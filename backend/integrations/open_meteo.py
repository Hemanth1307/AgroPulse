
import requests


WEATHER_URL = "https://api.open-meteo.com/v1/forecast"


def get_weather_data(latitude, longitude):

    params = {
        "latitude": latitude,
        "longitude": longitude,
        "current": [
            "temperature_2m",
            "relative_humidity_2m",
            "apparent_temperature",
            "precipitation",
            "rain",
            "weather_code",
            "wind_speed_10m"
        ],
        "hourly": [
            "precipitation_probability",
            "precipitation",
            "temperature_2m"
        ],
        "daily": [
            "temperature_2m_max",
            "temperature_2m_min",
            "precipitation_probability_max",
            "precipitation_sum",
            "et0_fao_evapotranspiration"
        ],
        "forecast_days": 7,
        "timezone": "auto"
    }

    response = requests.get(
        WEATHER_URL,
        params=params,
        timeout=20
    )

    response.raise_for_status()

    data = response.json()

    return {
        "success": True,
        "location": {
            "latitude": data.get("latitude"),
            "longitude": data.get("longitude"),
            "timezone": data.get("timezone")
        },
        "current": data.get("current", {}),
        "hourly": data.get("hourly", {}),
        "daily": data.get("daily", {}),
        "units": {
            "current": data.get("current_units", {}),
            "hourly": data.get("hourly_units", {}),
            "daily": data.get("daily_units", {})
        },
        "source": "Open-Meteo",
        "data_type": "Live weather API data"
    }
