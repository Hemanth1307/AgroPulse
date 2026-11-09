
import io
import json
from html import escape

import requests
from dotenv import load_dotenv
from flask import Flask, jsonify, request, send_file
from flask_cors import CORS
from PIL import Image as PILImage
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import getSampleStyleSheet
from reportlab.platypus import (
    SimpleDocTemplate,
    Paragraph,
    Spacer,
    Image,
)

from integrations.gemini_ai import (
    analyze_crop_image,
    ask_farmer_question,
)
from integrations.sentinel2 import get_sentinel2_data
from integrations.nasa_smap import get_smap_data
from integrations.open_meteo import get_weather_data

from database import init_db
from functions import (
    add_farm,
    get_all_farms,
    get_irrigation_settings,
    update_irrigation_settings,
    record_irrigation,
    get_irrigation_history,
    set_pump_status,
)


# --------------------------------------------------
# APPLICATION SETUP
# --------------------------------------------------

load_dotenv()

app = Flask(__name__)
CORS(app)

# Limit incoming requests to help prevent oversized uploads.
app.config["MAX_CONTENT_LENGTH"] = 10 * 1024 * 1024

init_db()


# --------------------------------------------------
# HEALTH CHECK
# --------------------------------------------------

@app.route("/api/health", methods=["GET"])
def health_check():
    return jsonify({
        "success": True,
        "message": "AgroPulse backend is running",
    }), 200


# --------------------------------------------------
# FARM MANAGEMENT
# --------------------------------------------------

@app.route("/api/farms", methods=["GET"])
def get_farms():
    try:
        farms = get_all_farms()

        return jsonify({
            "success": True,
            "farms": farms,
        }), 200

    except Exception:
        app.logger.exception("Failed to retrieve farms")

        return jsonify({
            "success": False,
            "message": "Unable to retrieve farms.",
        }), 500


@app.route("/api/farms", methods=["POST"])
def create_farm():
    data = request.get_json(silent=True)

    if not isinstance(data, dict):
        return jsonify({
            "success": False,
            "message": "Valid JSON request data is required.",
        }), 400

    required_fields = [
        "farmer_name",
        "farm_name",
        "crop_name",
        "area_acres",
    ]

    for field in required_fields:
        value = data.get(field)

        if value is None or (
            isinstance(value, str) and not value.strip()
        ):
            return jsonify({
                "success": False,
                "message": field + " is required.",
            }), 400

    try:
        area_acres = float(data["area_acres"])

        if area_acres <= 0:
            raise ValueError

        latitude = data.get("latitude")
        longitude = data.get("longitude")

        if latitude is not None:
            latitude = float(latitude)

            if not -90 <= latitude <= 90:
                raise ValueError

        if longitude is not None:
            longitude = float(longitude)

            if not -180 <= longitude <= 180:
                raise ValueError

        if (latitude is None) != (longitude is None):
            return jsonify({
                "success": False,
                "message": (
                    "Provide both latitude and longitude, "
                    "or leave both empty."
                ),
            }), 400

    except (ValueError, TypeError):
        return jsonify({
            "success": False,
            "message": "Invalid farm area or coordinates.",
        }), 400

    try:
        farm_id = add_farm(
            data["farmer_name"],
            data["farm_name"],
            data.get("location"),
            latitude,
            longitude,
            data["crop_name"],
            area_acres,
        )

        return jsonify({
            "success": True,
            "message": "Farm added successfully.",
            "farm_id": farm_id,
        }), 201

    except Exception:
        app.logger.exception("Failed to create farm")

        return jsonify({
            "success": False,
            "message": "Unable to create the farm.",
        }), 500


# --------------------------------------------------
# WEATHER
# --------------------------------------------------

@app.route("/api/weather", methods=["GET"])
def weather():
    latitude = request.args.get("latitude")
    longitude = request.args.get("longitude")

    if latitude is None or longitude is None:
        return jsonify({
            "success": False,
            "message": "Latitude and longitude are required.",
        }), 400

    try:
        latitude = float(latitude)
        longitude = float(longitude)

        if (
            not -90 <= latitude <= 90
            or not -180 <= longitude <= 180
        ):
            raise ValueError

    except (ValueError, TypeError):
        return jsonify({
            "success": False,
            "message": "Invalid latitude or longitude.",
        }), 400

    try:
        weather_data = get_weather_data(latitude, longitude)

        return jsonify(weather_data), 200

    except requests.RequestException:
        app.logger.exception("Weather provider request failed")

        return jsonify({
            "success": False,
            "message": "Unable to fetch weather data from Open-Meteo.",
        }), 502

    except Exception:
        app.logger.exception("Weather endpoint failed")

        return jsonify({
            "success": False,
            "message": "An error occurred while retrieving weather.",
        }), 500


# --------------------------------------------------
# IRRIGATION STATUS AND CALCULATIONS
# --------------------------------------------------

@app.route("/api/irrigation/<int:farm_id>", methods=["GET"])
def irrigation_status(farm_id):
    try:
        settings = get_irrigation_settings(farm_id)

        if not settings:
            return jsonify({
                "success": False,
                "message": "Farm not found.",
            }), 404

        farm = next(
            (
                f for f in get_all_farms()
                if f["id"] == farm_id
            ),
            None,
        )

        response = {
            "success": True,
            "settings": settings,
            "history": get_irrigation_history(farm_id),
            "pump_on": bool(settings["pump_on"]),
            "calculation_available": False,
        }

        if (
            not farm
            or farm["latitude"] is None
            or farm["longitude"] is None
        ):
            response["calculation_message"] = (
                "Farm coordinates are required."
            )
            return jsonify(response), 200

        weather_data = get_weather_data(
            farm["latitude"],
            farm["longitude"],
        )

        daily = weather_data.get("daily", {})

        et0 = (
            daily.get("et0_fao_evapotranspiration") or [None]
        )[0]

        rainfall = (
            daily.get("precipitation_sum") or [0]
        )[0]

        rain_probability = (
            daily.get("precipitation_probability_max") or [None]
        )[0]

        if et0 is None:
            raise ValueError("ET0 data is unavailable.")

        et0 = float(et0)
        rainfall = float(rainfall or 0)

        kc = float(settings["kc"])
        etc = et0 * kc

        # Simplified daily water deficit.
        water_deficit = max(0, etc - rainfall)

        # One millimetre over one square metre equals one litre.
        farm_area_m2 = float(farm["area_acres"]) * 4046.86
        water_litres = water_deficit * farm_area_m2

        efficiency = float(settings["efficiency"])

        if efficiency <= 0:
            raise ValueError("Irrigation efficiency must be positive.")

        required_litres = water_litres / efficiency

        total_flow = (
            float(settings["emitter_flow"])
            * int(settings["emitter_count"])
        )

        if total_flow <= 0:
            raise ValueError("Total irrigation flow must be positive.")

        runtime_minutes = (
            required_litres / total_flow
        ) * 60

        response.update({
            "calculation_available": True,
            "et0": round(et0, 2),
            "kc": kc,
            "etc": round(etc, 2),
            "rainfall": round(rainfall, 2),
            "water_deficit_mm": round(water_deficit, 2),
            "water_required_litres": round(required_litres, 2),
            "pump_runtime_minutes": round(runtime_minutes, 2),
            "rain_probability": rain_probability,
            "root_zone_moisture": settings["root_zone_moisture"],
        })

        return jsonify(response), 200

    except requests.RequestException:
        app.logger.exception("Irrigation weather request failed")

        return jsonify({
            "success": False,
            "message": "Unable to retrieve irrigation weather data.",
        }), 502

    except Exception:
        app.logger.exception("Irrigation status failed")

        return jsonify({
            "success": False,
            "message": "Unable to calculate irrigation status.",
        }), 500


# --------------------------------------------------
# UPDATE IRRIGATION SETTINGS
# --------------------------------------------------

@app.route("/api/irrigation/<int:farm_id>/settings", methods=["PUT"])
def irrigation_settings(farm_id):
    data = request.get_json(silent=True)

    if not isinstance(data, dict):
        return jsonify({
            "success": False,
            "message": "Valid JSON request data is required.",
        }), 400

    try:
        kc = float(data.get("kc", 1.15))
        moisture = float(data.get("root_zone_moisture", 31))
        emitter_flow = float(data.get("emitter_flow", 2))
        emitter_count = int(data.get("emitter_count", 100))
        efficiency = float(data.get("efficiency", 0.9))

        if not 0 < kc <= 2:
            raise ValueError

        if not 0 <= moisture <= 100:
            raise ValueError

        if emitter_flow <= 0 or emitter_count <= 0:
            raise ValueError

        if not 0 < efficiency <= 1:
            raise ValueError

    except (ValueError, TypeError):
        return jsonify({
            "success": False,
            "message": "Invalid irrigation settings.",
        }), 400

    try:
        settings = get_irrigation_settings(farm_id)

        if not settings:
            return jsonify({
                "success": False,
                "message": "Farm not found.",
            }), 404

        update_irrigation_settings(
            farm_id,
            kc,
            moisture,
            emitter_flow,
            emitter_count,
            efficiency,
        )

        return jsonify({
            "success": True,
            "message": "Irrigation settings updated.",
        }), 200

    except Exception:
        app.logger.exception("Failed to update irrigation settings")

        return jsonify({
            "success": False,
            "message": "Unable to update irrigation settings.",
        }), 500


# --------------------------------------------------
# IRRIGATION CONTROL
# --------------------------------------------------

@app.route("/api/irrigation/<int:farm_id>/control", methods=["POST"])
def irrigation_control(farm_id):
    data = request.get_json(silent=True) or {}
    action = data.get("action")

    if action not in ["ON", "OFF"]:
        return jsonify({
            "success": False,
            "message": "Action must be ON or OFF.",
        }), 400

    try:
        settings = get_irrigation_settings(farm_id)

        if not settings:
            return jsonify({
                "success": False,
                "message": "Farm not found.",
            }), 404

        # This is a simulated pump, not a physical pump.
        if action == "OFF":
            set_pump_status(farm_id, False)

            record_irrigation(
                farm_id,
                "OFF",
                "Pump switched off by user",
            )

            return jsonify({
                "success": True,
                "pump_on": False,
                "message": "Virtual pump switched off.",
            }), 200

        farm = next(
            (
                f for f in get_all_farms()
                if f["id"] == farm_id
            ),
            None,
        )

        if (
            not farm
            or farm["latitude"] is None
            or farm["longitude"] is None
        ):
            return jsonify({
                "success": False,
                "message": "Farm coordinates are required.",
            }), 400

        weather_data = get_weather_data(
            farm["latitude"],
            farm["longitude"],
        )

        daily = weather_data.get("daily", {})

        rain_probability = (
            daily.get("precipitation_probability_max") or [None]
        )[0]

        et0 = (
            daily.get("et0_fao_evapotranspiration") or [None]
        )[0]

        rainfall = (
            daily.get("precipitation_sum") or [0]
        )[0]

        if rain_probability is None or et0 is None:
            raise ValueError(
                "Required weather forecast data is missing."
            )

        rain_probability = float(rain_probability)
        et0 = float(et0)
        rainfall = float(rainfall or 0)

        moisture = float(settings["root_zone_moisture"])
        kc = float(settings["kc"])
        field_capacity = float(settings["field_capacity"])

        if rain_probability > 65:
            reason = (
                "Irrigation blocked: rain probability exceeds 65%."
            )
        elif moisture > field_capacity:
            reason = (
                "Irrigation blocked: soil moisture exceeds "
                "field capacity."
            )
        else:
            reason = None

        if reason:
            set_pump_status(farm_id, False)

            record_irrigation(
                farm_id,
                "BLOCKED",
                reason,
            )

            return jsonify({
                "success": False,
                "pump_on": False,
                "lockout": True,
                "message": reason,
                "rain_probability": rain_probability,
                "root_zone_moisture": moisture,
            }), 409

        etc = et0 * kc
        water_deficit = max(0, etc - rainfall)

        farm_area_m2 = float(farm["area_acres"]) * 4046.86
        water_litres = water_deficit * farm_area_m2

        efficiency = float(settings["efficiency"])

        if efficiency <= 0:
            raise ValueError("Irrigation efficiency must be positive.")

        required_litres = water_litres / efficiency

        total_flow = (
            float(settings["emitter_flow"])
            * int(settings["emitter_count"])
        )

        if total_flow <= 0:
            raise ValueError("Total irrigation flow must be positive.")

        runtime_minutes = (required_litres / total_flow) * 60

        set_pump_status(farm_id, True)

        record_irrigation(
            farm_id,
            "ON",
            "Virtual pump activated after safety checks",
        )

        return jsonify({
            "success": True,
            "pump_on": True,
            "lockout": False,
            "message": "Virtual pump activated.",
            "et0": round(et0, 2),
            "kc": kc,
            "etc": round(etc, 2),
            "rainfall": round(rainfall, 2),
            "water_deficit_mm": round(water_deficit, 2),
            "water_required_litres": round(required_litres, 2),
            "pump_runtime_minutes": round(runtime_minutes, 2),
            "rain_probability": rain_probability,
            "root_zone_moisture": moisture,
        }), 200

    except requests.RequestException:
        app.logger.exception("Irrigation control weather request failed")

        return jsonify({
            "success": False,
            "pump_on": False,
            "message": "Unable to verify weather safety.",
        }), 502

    except Exception:
        app.logger.exception("Irrigation control failed")

        return jsonify({
            "success": False,
            "message": "Unable to process irrigation control.",
        }), 500


# --------------------------------------------------
# CROP DOCTOR: AI IMAGE ANALYSIS
# --------------------------------------------------

@app.route("/api/crop-doctor/analyze", methods=["POST"])
def crop_doctor_analyze():
    if "image" not in request.files:
        return jsonify({
            "success": False,
            "message": "Please upload a crop image.",
        }), 400

    image = request.files["image"]

    if not image.filename:
        return jsonify({
            "success": False,
            "message": "No image selected.",
        }), 400

    if image.mimetype not in [
        "image/jpeg",
        "image/png",
        "image/webp",
    ]:
        return jsonify({
            "success": False,
            "message": "Only JPG, PNG and WEBP images are allowed.",
        }), 400

    image_bytes = image.read()

    if not image_bytes:
        return jsonify({
            "success": False,
            "message": "Uploaded image is empty.",
        }), 400

    if len(image_bytes) > 8 * 1024 * 1024:
        return jsonify({
            "success": False,
            "message": "Image must be smaller than 8 MB.",
        }), 400

    try:
        result = analyze_crop_image(
            image_bytes,
            image.mimetype,
        )

        return jsonify({
            "success": True,
            "message": "Crop analysis completed.",
            "diagnosis": result,
        }), 200

    except Exception:
        app.logger.exception("Crop Doctor analysis failed")

        return jsonify({
            "success": False,
            "message": (
                "Unable to analyze image. Check Gemini API "
                "configuration and backend logs."
            ),
        }), 500


# --------------------------------------------------
# CROP DOCTOR: DOWNLOAD PDF REPORT
# --------------------------------------------------

@app.route("/api/crop-doctor/report", methods=["POST"])
def download_crop_report():
    if "image" not in request.files:
        return jsonify({
            "success": False,
            "message": "Crop image is required.",
        }), 400

    try:
        diagnosis_text = request.form.get("diagnosis", "{}")
        diagnosis = json.loads(diagnosis_text)

        if not isinstance(diagnosis, dict):
            raise ValueError("Diagnosis must be a JSON object.")

        required_fields = [
            "crop",
            "disease",
            "confidence",
            "severity",
            "symptoms",
            "treatment",
            "prevention",
        ]

        for field in required_fields:
            if field not in diagnosis:
                raise ValueError(
                    "Missing diagnosis field: " + field
                )

        image_file = request.files["image"]

        if image_file.mimetype not in [
            "image/jpeg",
            "image/png",
            "image/webp",
        ]:
            raise ValueError("Invalid image format.")

        image_bytes = image_file.read()

        if (
            not image_bytes
            or len(image_bytes) > 8 * 1024 * 1024
        ):
            raise ValueError(
                "Image is empty or exceeds 8 MB."
            )

        pdf_buffer = io.BytesIO()

        document = SimpleDocTemplate(
            pdf_buffer,
            pagesize=A4,
        )

        styles = getSampleStyleSheet()
        content = []

        content.append(
            Paragraph(
                "AgroPulse AI - Crop Diagnosis Report",
                styles["Title"],
            )
        )
        content.append(Spacer(1, 20))

        content.append(
            Paragraph(
                "Crop: " + escape(str(diagnosis["crop"])),
                styles["Heading2"],
            )
        )

        content.append(
            Paragraph(
                "Suspected Disease: "
                + escape(str(diagnosis["disease"])),
                styles["Normal"],
            )
        )

        content.append(
            Paragraph(
                "Confidence: "
                + escape(str(diagnosis["confidence"]))
                + "%",
                styles["Normal"],
            )
        )

        content.append(
            Paragraph(
                "Severity: " + escape(str(diagnosis["severity"])),
                styles["Normal"],
            )
        )

        content.append(Spacer(1, 15))

        pil_image = PILImage.open(
            io.BytesIO(image_bytes)
        ).convert("RGB")

        image_buffer = io.BytesIO()
        pil_image.save(image_buffer, format="JPEG")
        image_buffer.seek(0)

        content.append(
            Image(
                image_buffer,
                width=250,
                height=180,
                kind="proportional",
            )
        )

        sections = [
            ("Visible Symptoms", "symptoms"),
            ("Recommended Treatment", "treatment"),
            ("Prevention", "prevention"),
        ]

        for heading, field in sections:
            content.append(Spacer(1, 15))
            content.append(
                Paragraph(heading, styles["Heading2"])
            )
            content.append(
                Paragraph(
                    escape(str(diagnosis[field])).replace(
                        "\n", "<br/>"
                    ),
                    styles["BodyText"],
                )
            )

        content.append(Spacer(1, 25))
        content.append(
            Paragraph(
                "Disclaimer: AI-generated advisory only. "
                "This is not a laboratory-confirmed diagnosis. "
                "Consult an agricultural expert before treatment.",
                styles["Italic"],
            )
        )

        document.build(content)
        pdf_buffer.seek(0)

        return send_file(
            pdf_buffer,
            mimetype="application/pdf",
            as_attachment=True,
            download_name="AgroPulse_Crop_Diagnosis.pdf",
        )

    except (ValueError, json.JSONDecodeError) as error:
        return jsonify({
            "success": False,
            "message": str(error),
        }), 400

    except Exception:
        app.logger.exception("Crop report generation failed")

        return jsonify({
            "success": False,
            "message": "Unable to generate the crop diagnosis report.",
        }), 500


# --------------------------------------------------
# SENTINEL-2 SATELLITE DATA
# --------------------------------------------------

@app.route("/api/satellite/sentinel2", methods=["GET"])
def sentinel2_data():
    latitude = request.args.get("latitude")
    longitude = request.args.get("longitude")

    if latitude is None or longitude is None:
        return jsonify({
            "success": False,
            "message": "Latitude and longitude are required.",
        }), 400

    try:
        latitude = float(latitude)
        longitude = float(longitude)

        if (
            not -90 <= latitude <= 90
            or not -180 <= longitude <= 180
        ):
            raise ValueError

    except (ValueError, TypeError):
        return jsonify({
            "success": False,
            "message": "Invalid coordinates.",
        }), 400

    try:
        result = get_sentinel2_data(latitude, longitude)
        return jsonify(result), 200

    except requests.RequestException:
        app.logger.exception("Sentinel-2 request failed")

        return jsonify({
            "success": False,
            "message": (
                "Unable to retrieve Sentinel-2 catalogue data."
            ),
        }), 502

    except Exception:
        app.logger.exception("Sentinel-2 endpoint failed")

        return jsonify({
            "success": False,
            "message": "Unable to retrieve Sentinel-2 data.",
        }), 500


# --------------------------------------------------
# NASA SMAP SATELLITE DATA
# --------------------------------------------------

@app.route("/api/satellite/smap", methods=["GET"])
def smap_data():
    latitude = request.args.get("latitude")
    longitude = request.args.get("longitude")

    if latitude is None or longitude is None:
        return jsonify({
            "success": False,
            "message": "Latitude and longitude are required.",
        }), 400

    try:
        latitude = float(latitude)
        longitude = float(longitude)

        if (
            not -90 <= latitude <= 90
            or not -180 <= longitude <= 180
        ):
            raise ValueError

    except (ValueError, TypeError):
        return jsonify({
            "success": False,
            "message": "Invalid coordinates.",
        }), 400

    try:
        result = get_smap_data(latitude, longitude)
        return jsonify(result), 200

    except requests.RequestException:
        app.logger.exception("NASA SMAP request failed")

        return jsonify({
            "success": False,
            "message": "Unable to retrieve NASA SMAP data.",
        }), 502

    except Exception:
        app.logger.exception("NASA SMAP endpoint failed")

        return jsonify({
            "success": False,
            "message": "Unable to retrieve NASA SMAP data.",
        }), 500


# --------------------------------------------------
# FARMER CHATBOT: GEMINI AI
# --------------------------------------------------

@app.route("/api/farmer-assistant", methods=["POST"])
def farmer_assistant():
    data = request.get_json(silent=True)

    if not isinstance(data, dict):
        return jsonify({
            "success": False,
            "message": "Please send your question as JSON.",
        }), 400

    question = data.get("question", "")

    if not isinstance(question, str) or not question.strip():
        return jsonify({
            "success": False,
            "message": "Please enter your farming question.",
        }), 400

    question = question.strip()

    if len(question) > 4000:
        return jsonify({
            "success": False,
            "message": (
                "Please keep your question under 4000 characters."
            ),
        }), 400

    try:
        answer = ask_farmer_question(question)

        if not isinstance(answer, str) or not answer.strip():
            app.logger.error(
                "Gemini returned an empty or invalid answer."
            )

            return jsonify({
                "success": False,
                "message": (
                    "The AI returned an empty answer. "
                    "Please try again."
                ),
            }), 502

        return jsonify({
            "success": True,
            "answer": answer.strip(),
        }), 200

    except Exception:
        app.logger.exception("Farmer Assistant Gemini request failed")

        return jsonify({
            "success": False,
            "message": (
                "Unable to generate an answer. Check the Gemini "
                "API key, model configuration, and backend terminal."
            ),
        }), 500


# --------------------------------------------------
# START FLASK SERVER
# IMPORTANT: KEEP THIS AT THE VERY BOTTOM
# --------------------------------------------------

if __name__ == "__main__":
    app.run(debug=True, host="127.0.0.1", port=5000)
