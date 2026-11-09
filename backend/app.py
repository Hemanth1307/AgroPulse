import os
from dotenv import load_dotenv
from integrations.gemini_ai import analyze_crop_image
from flask import Flask, jsonify, request
from flask_cors import CORS
import requests
import io
import json

from flask import send_file
from reportlab.lib.pagesizes import A4
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, Image
)
from reportlab.lib.styles import getSampleStyleSheet
from PIL import Image as PILImage
from integrations.sentinel2 import get_sentinel2_data
from integrations.nasa_smap import get_smap_data

from database import init_db
from functions import (
    add_farm,
    get_all_farms,
    get_irrigation_settings,
    update_irrigation_settings,
    record_irrigation,
    get_irrigation_history,
    set_pump_status
)
from integrations.open_meteo import get_weather_data

app = Flask(__name__)
load_dotenv()
CORS(app)

init_db()


@app.route("/api/health", methods=["GET"])
def health_check():
    return jsonify({
        "success": True,
        "message": "AgroPulse backend is running"
    }), 200


@app.route("/api/farms", methods=["GET"])
def get_farms():
    farms = get_all_farms()

    return jsonify({
        "success": True,
        "farms": farms
    }), 200


@app.route("/api/farms", methods=["POST"])
def create_farm():
    data = request.get_json()

    if not data:
        return jsonify({
            "success": False,
            "message": "Request data is required"
        }), 400

    required_fields = [
        "farmer_name", "farm_name",
        "crop_name", "area_acres"
    ]

    for field in required_fields:
        if field not in data or data[field] == "":
            return jsonify({
                "success": False,
                "message": field + " is required"
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

    except (ValueError, TypeError):
        return jsonify({
            "success": False,
            "message": "Invalid farm area or coordinates"
        }), 400

    farm_id = add_farm(
        data["farmer_name"],
        data["farm_name"],
        data.get("location"),
        latitude,
        longitude,
        data["crop_name"],
        area_acres
    )

    return jsonify({
        "success": True,
        "message": "Farm added successfully",
        "farm_id": farm_id
    }), 201


@app.route("/api/weather", methods=["GET"])
def weather():
    latitude = request.args.get("latitude")
    longitude = request.args.get("longitude")

    if latitude is None or longitude is None:
        return jsonify({
            "success": False,
            "message": "Latitude and longitude are required"
        }), 400

    try:
        latitude = float(latitude)
        longitude = float(longitude)

        if not -90 <= latitude <= 90:
            raise ValueError

        if not -180 <= longitude <= 180:
            raise ValueError

        weather_data = get_weather_data(latitude, longitude)

        return jsonify(weather_data), 200

    except (ValueError, TypeError):
        return jsonify({
            "success": False,
            "message": "Invalid latitude or longitude"
        }), 400

    except requests.RequestException:
        return jsonify({
            "success": False,
            "message": "Unable to fetch weather data from Open-Meteo"
        }), 502

    except Exception as error:
        return jsonify({
            "success": False,
            "message": str(error)
        }), 500


# GET IRRIGATION STATUS AND CALCULATIONS

@app.route("/api/irrigation/<int:farm_id>", methods=["GET"])
def irrigation_status(farm_id):

    settings = get_irrigation_settings(farm_id)

    if not settings:
        return jsonify({
            "success": False,
            "message": "Farm not found"
        }), 404

    farm = next(
        (f for f in get_all_farms() if f["id"] == farm_id),
        None
    )

    response = {
        "success": True,
        "settings": settings,
        "history": get_irrigation_history(farm_id),
        "pump_on": bool(settings["pump_on"]),
        "calculation_available": False
    }

    if not farm or farm["latitude"] is None or farm["longitude"] is None:
        response["calculation_message"] = "Farm coordinates are required"
        return jsonify(response), 200

    try:
        weather_data = get_weather_data(
            farm["latitude"],
            farm["longitude"]
        )

        daily = weather_data.get("daily", {})

        et0 = (daily.get("et0_fao_evapotranspiration") or [None])[0]
        rainfall = (daily.get("precipitation_sum") or [0])[0]
        rain_probability = (
            daily.get("precipitation_probability_max") or [None]
        )[0]

        if et0 is None:
            raise ValueError("ET0 data is unavailable")

        et0 = float(et0)
        rainfall = float(rainfall or 0)

        kc = float(settings["kc"])
        etc = et0 * kc

        # Simplified water deficit calculation
        water_deficit = max(0, etc - rainfall)

        # Convert water depth in mm into litres for the farm
        farm_area_m2 = float(farm["area_acres"]) * 4046.86
        water_litres = water_deficit * farm_area_m2

        efficiency = float(settings["efficiency"])
        required_litres = water_litres / efficiency

        total_flow = (
            float(settings["emitter_flow"]) *
            int(settings["emitter_count"])
        )

        runtime_minutes = (required_litres / total_flow) * 60

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
            "root_zone_moisture": settings["root_zone_moisture"]
        })

    except (requests.RequestException, ValueError, TypeError) as error:
        response["calculation_message"] = str(error)

    return jsonify(response), 200


# UPDATE IRRIGATION SETTINGS

@app.route("/api/irrigation/<int:farm_id>/settings", methods=["PUT"])
def irrigation_settings(farm_id):

    data = request.get_json()

    if not data:
        return jsonify({
            "success": False,
            "message": "Request data is required"
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
            "message": "Invalid irrigation settings"
        }), 400

    settings = get_irrigation_settings(farm_id)

    if not settings:
        return jsonify({
            "success": False,
            "message": "Farm not found"
        }), 404

    update_irrigation_settings(
        farm_id, kc, moisture,
        emitter_flow, emitter_count, efficiency
    )

    return jsonify({
        "success": True,
        "message": "Irrigation settings updated"
    }), 200


# IRRIGATION CALCULATION AND PUMP CONTROL

@app.route("/api/irrigation/<int:farm_id>/control", methods=["POST"])
def irrigation_control(farm_id):

    data = request.get_json() or {}
    action = data.get("action")

    if action not in ["ON", "OFF"]:
        return jsonify({
            "success": False,
            "message": "Action must be ON or OFF"
        }), 400

    settings = get_irrigation_settings(farm_id)

    if not settings:
        return jsonify({
            "success": False,
            "message": "Farm not found"
        }), 404

    # OFF is always allowed
    if action == "OFF":
        set_pump_status(farm_id, False)

        record_irrigation(
            farm_id, "OFF", "Pump switched off by user"
        )

        return jsonify({
            "success": True,
            "pump_on": False,
            "message": "Virtual pump switched off"
        }), 200

    # Fetch weather for this farm
    farm = next(
        (f for f in get_all_farms() if f["id"] == farm_id),
        None
    )

    if not farm or farm["latitude"] is None or farm["longitude"] is None:
        return jsonify({
            "success": False,
            "message": "Farm coordinates are required"
        }), 400

    try:
        weather_data = get_weather_data(
            farm["latitude"], farm["longitude"]
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
            raise ValueError("Required weather forecast data is missing")

        rain_probability = float(rain_probability)
        et0 = float(et0)
        rainfall = float(rainfall or 0)

    except (requests.RequestException, ValueError, TypeError) as error:
        return jsonify({
            "success": False,
            "message": "Could not verify weather safety: " + str(error),
            "pump_on": False
        }), 502

    moisture = settings["root_zone_moisture"]
    kc = settings["kc"]

    if rain_probability > 65:
        reason = "Automatic irrigation blocked: rain probability exceeds 65%."

    elif moisture > settings["field_capacity"]:
        reason = "Automatic irrigation blocked: soil moisture exceeds field capacity."

    else:
        reason = None

    if reason:
        set_pump_status(farm_id, False)
        record_irrigation(farm_id, "BLOCKED", reason)

        return jsonify({
            "success": False,
            "pump_on": False,
            "lockout": True,
            "message": reason,
            "rain_probability": rain_probability,
            "root_zone_moisture": moisture
        }), 409

    # Water requirement calculation
    etc = et0 * kc

    # Simplified daily water deficit.
    # Rainfall is used as an estimate of effective rainfall.
    water_deficit = max(0, etc - rainfall)

    # Convert mm to litres for the entire farm.
    farm_area_m2 = farm["area_acres"] * 4046.86
    water_litres = water_deficit * farm_area_m2

    # Account for irrigation efficiency.
    required_litres = water_litres / settings["efficiency"]

    total_flow_litres_hour = (
        settings["emitter_flow"] * settings["emitter_count"]
    )

    runtime_minutes = (
        required_litres / total_flow_litres_hour
    ) * 60

    set_pump_status(farm_id, True)

    record_irrigation(
        farm_id, "ON", "Virtual pump activated after safety checks"
    )

    return jsonify({
        "success": True,
        "pump_on": True,
        "lockout": False,
        "message": "Virtual pump activated",
        "et0": round(et0, 2),
        "kc": kc,
        "etc": round(etc, 2),
        "rainfall": round(rainfall, 2),
        "water_deficit_mm": round(water_deficit, 2),
        "water_required_litres": round(required_litres, 2),
        "pump_runtime_minutes": round(runtime_minutes, 2),
        "rain_probability": rain_probability,
        "root_zone_moisture": moisture
    }), 200

# CROP DOCTOR - AI IMAGE ANALYSIS

@app.route("/api/crop-doctor/analyze", methods=["POST"])
def crop_doctor_analyze():

    if "image" not in request.files:
        return jsonify({
            "success": False,
            "message": "Please upload a crop image"
        }), 400

    image = request.files["image"]

    if image.filename == "":
        return jsonify({
            "success": False,
            "message": "No image selected"
        }), 400

    if image.mimetype not in ["image/jpeg", "image/png", "image/webp"]:
        return jsonify({
            "success": False,
            "message": "Only JPG, PNG and WEBP images are allowed"
        }), 400

    image_bytes = image.read()

    if not image_bytes:
        return jsonify({
            "success": False,
            "message": "Uploaded image is empty"
        }), 400

    if len(image_bytes) > 8 * 1024 * 1024:
        return jsonify({
            "success": False,
            "message": "Image must be smaller than 8 MB"
        }), 400

    try:
        result = analyze_crop_image(image_bytes, image.mimetype)

        return jsonify({
            "success": True,
            "message": "Crop analysis completed",
            "diagnosis": result
        }), 200

    except Exception as error:
        print("Crop Doctor Error:", error)

        return jsonify({
            "success": False,
            "message": "Unable to analyze image. Check Gemini API configuration."
        }), 500

# CROP DOCTOR - DOWNLOAD PDF REPORT

@app.route("/api/crop-doctor/report", methods=["POST"])
def download_crop_report():

    if "image" not in request.files:
        return jsonify({
            "success": False,
            "message": "Crop image is required"
        }), 400

    try:
        diagnosis = json.loads(request.form.get("diagnosis", "{}"))

        required_fields = [
            "crop", "disease", "confidence", "severity",
            "symptoms", "treatment", "prevention"
        ]

        for field in required_fields:
            if field not in diagnosis:
                raise ValueError("Missing diagnosis field: " + field)

        image_file = request.files["image"]

        if image_file.mimetype not in [
            "image/jpeg", "image/png", "image/webp"
        ]:
            raise ValueError("Invalid image format")

        image_bytes = image_file.read()

        if not image_bytes or len(image_bytes) > 8 * 1024 * 1024:
            raise ValueError("Image is empty or exceeds 8 MB")

        pdf_buffer = io.BytesIO()

        document = SimpleDocTemplate(
            pdf_buffer,
            pagesize=A4
        )

        styles = getSampleStyleSheet()
        content = []

        content.append(
            Paragraph("AgroPulse AI - Crop Diagnosis Report", styles["Title"])
        )
        content.append(Spacer(1, 20))

        content.append(Paragraph(
            "Crop: " + str(diagnosis["crop"]),
            styles["Heading2"]
        ))

        content.append(Paragraph(
            "Suspected Disease: " + str(diagnosis["disease"]),
            styles["Normal"]
        ))

        content.append(Paragraph(
            "Confidence: " + str(diagnosis["confidence"]) + "%",
            styles["Normal"]
        ))

        content.append(Paragraph(
            "Severity: " + str(diagnosis["severity"]),
            styles["Normal"]
        ))

        content.append(Spacer(1, 15))

        # Add uploaded crop image
        pil_image = PILImage.open(
            io.BytesIO(image_bytes)
        ).convert("RGB")

        image_buffer = io.BytesIO()
        pil_image.save(image_buffer, format="JPEG")
        image_buffer.seek(0)

        content.append(Image(
            image_buffer,
            width=250,
            height=180,
            kind="proportional"
        ))

        sections = [
            ("Visible Symptoms", "symptoms"),
            ("Recommended Treatment", "treatment"),
            ("Prevention", "prevention")
        ]

        for heading, field in sections:
            content.append(Spacer(1, 15))
            content.append(Paragraph(heading, styles["Heading2"]))
            content.append(Paragraph(
                str(diagnosis[field]),
                styles["BodyText"]
            ))

        content.append(Spacer(1, 25))
        content.append(Paragraph(
            "Disclaimer: AI-generated advisory only. "
            "This is not a laboratory-confirmed diagnosis. "
            "Consult an agricultural expert before treatment.",
            styles["Italic"]
        ))

        document.build(content)

        pdf_buffer.seek(0)

        return send_file(
            pdf_buffer,
            mimetype="application/pdf",
            as_attachment=True,
            download_name="AgroPulse_Crop_Diagnosis.pdf"
        )

    except Exception as error:
        print("PDF Report Error:", error)

        return jsonify({
            "success": False,
            "message": str(error)
        }), 400

        
# SENTINEL-2 SATELLITE DATA

@app.route("/api/satellite/sentinel2", methods=["GET"])
def sentinel2_data():

    latitude = request.args.get("latitude")
    longitude = request.args.get("longitude")

    if latitude is None or longitude is None:
        return jsonify({
            "success": False,
            "message": "Latitude and longitude are required"
        }), 400

    try:
        latitude = float(latitude)
        longitude = float(longitude)

        if not -90 <= latitude <= 90:
            raise ValueError

        if not -180 <= longitude <= 180:
            raise ValueError

        result = get_sentinel2_data(latitude, longitude)

        return jsonify(result), 200

    except (ValueError, TypeError):
        return jsonify({
            "success": False,
            "message": "Invalid coordinates"
        }), 400

    except requests.RequestException as error:
        return jsonify({
            "success": False,
            "message": "Unable to retrieve Sentinel-2 catalogue data",
            "detail": str(error)
        }), 502


# NASA SMAP SATELLITE DATA

@app.route("/api/satellite/smap", methods=["GET"])
def smap_data():

    latitude = request.args.get("latitude")
    longitude = request.args.get("longitude")

    if latitude is None or longitude is None:
        return jsonify({
            "success": False,
            "message": "Latitude and longitude are required"
        }), 400

    try:
        latitude = float(latitude)
        longitude = float(longitude)

        if not -90 <= latitude <= 90:
            raise ValueError

        if not -180 <= longitude <= 180:
            raise ValueError

        result = get_smap_data(latitude, longitude)

        return jsonify(result), 200

    except (ValueError, TypeError):
        return jsonify({
            "success": False,
            "message": "Invalid coordinates"
        }), 400

    except requests.RequestException as error:
        return jsonify({
            "success": False,
            "message": "Unable to retrieve NASA SMAP catalogue data",
            "detail": str(error)
        }), 502


if __name__ == "__main__":
    app.run(debug=True, port=5000)