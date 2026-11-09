
const BASE_URL = "https://api.open-meteo.com/v1";
const GEO_URL = "https://geocoding-api.open-meteo.com/v1";
const REVERSE_GEO_URL =
  "https://api.bigdatacloud.net/data/reverse-geocode-client";

const BACKEND_URL = "http://127.0.0.1:5000";

async function apiRequest(url) {
  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`Weather/location API error: ${response.status}`);
  }

  return response.json();
}

// Find coordinates for a manually entered city.
export async function getCoordinates(city) {
  if (!city || !city.trim()) {
    throw new Error("Please enter a city name.");
  }

  const params = new URLSearchParams({
    name: city.trim(),
    count: "1",
    language: "en",
    format: "json",
  });

  const data = await apiRequest(
    `${GEO_URL}/search?${params.toString()}`
  );

  if (!data.results?.length) {
    throw new Error("Location not found. Try another city name.");
  }

  return data.results[0];
}

// Get current weather and a 7-day forecast.
export async function getWeather(latitude, longitude) {
  const lat = Number(latitude);
  const lon = Number(longitude);

  if (
    !Number.isFinite(lat) ||
    !Number.isFinite(lon) ||
    lat < -90 ||
    lat > 90 ||
    lon < -180 ||
    lon > 180
  ) {
    throw new Error("Invalid GPS coordinates.");
  }

  const params = new URLSearchParams({
    latitude: String(lat),
    longitude: String(lon),
    current:
      "temperature_2m,apparent_temperature,relative_humidity_2m,precipitation,rain,wind_speed_10m",
    daily:
      "temperature_2m_max,temperature_2m_min,precipitation_probability_max,precipitation_sum,et0_fao_evapotranspiration",
    timezone: "auto",
    forecast_days: "7",
  });

  return apiRequest(`${BASE_URL}/forecast?${params.toString()}`);
}

// Convert GPS coordinates into a readable location name.
async function getLocationName(latitude, longitude) {
  const lat = Number(latitude);
  const lon = Number(longitude);

  // First try BigDataCloud.
  try {
    const params = new URLSearchParams({
      latitude: String(lat),
      longitude: String(lon),
      localityLanguage: "en",
    });

    const response = await fetch(
      `${REVERSE_GEO_URL}?${params.toString()}`
    );

    if (response.ok) {
      const data = await response.json();

      const candidates = [
        data.locality,
        data.city,
        data.principalSubdivision,
      ];

      const parts = candidates
        .filter(
          (part) =>
            typeof part === "string" && part.trim()
        )
        .map((part) => part.trim());

      const uniqueParts = parts.filter(
        (part, index) =>
          parts.findIndex(
            (item) => item.toLowerCase() === part.toLowerCase()
          ) === index
      );

      if (uniqueParts.length) {
        return uniqueParts.join(", ");
      }
    }
  } catch (error) {
    console.warn("BigDataCloud lookup failed:", error);
  }

  // Fallback to OpenStreetMap reverse geocoding.
  try {
    const params = new URLSearchParams({
      lat: String(lat),
      lon: String(lon),
      format: "jsonv2",
      "accept-language": "en",
    });

    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?${params.toString()}`
    );

    if (response.ok) {
      const data = await response.json();
      const address = data.address || {};

      const candidates = [
        address.suburb,
        address.neighbourhood,
        address.village,
        address.town,
        address.city,
        address.county,
        address.state,
      ];

      const parts = candidates
        .filter(
          (part) =>
            typeof part === "string" && part.trim()
        )
        .map((part) => part.trim());

      const uniqueParts = parts.filter(
        (part, index) =>
          parts.findIndex(
            (item) => item.toLowerCase() === part.toLowerCase()
          ) === index
      );

      if (uniqueParts.length) {
        return uniqueParts.slice(0, 3).join(", ");
      }
    }
  } catch (error) {
    console.warn("OpenStreetMap lookup failed:", error);
  }

  return "Your current location";
}

// Get weather using a city name.
export async function getWeatherByCity(city) {
  const location = await getCoordinates(city);

  const weather = await getWeather(
    location.latitude,
    location.longitude
  );

  return { location, weather };
}

// Detect the device's current GPS location.
export async function getCurrentLocation() {
  if (!("geolocation" in navigator)) {
    throw new Error(
      "Your browser does not support GPS location detection."
    );
  }

  const position = await new Promise((resolve, reject) => {
    navigator.geolocation.getCurrentPosition(
      resolve,
      (error) => {
        if (error.code === 1) {
          reject(
            new Error(
              "Location permission denied. Allow location access in your browser settings."
            )
          );
        } else if (error.code === 2) {
          reject(
            new Error(
              "Your location is unavailable. Turn on device location services."
            )
          );
        } else {
          reject(
            new Error(
              "Location request timed out. Please try again."
            )
          );
        }
      },
      {
        enableHighAccuracy: true,
        timeout: 20000,
        maximumAge: 0,
      }
    );
  });

  const latitude = position.coords.latitude;
  const longitude = position.coords.longitude;
  const name = await getLocationName(latitude, longitude);

  return {
    latitude,
    longitude,
    name,
    locality: name,
    accuracy: position.coords.accuracy,
  };
}

// Continuously track the device's GPS location.
export function watchCurrentLocation(onLocation, onError) {
  if (!("geolocation" in navigator)) {
    if (onError) {
      onError(
        new Error("Your browser does not support GPS location detection.")
      );
    }
    return () => {};
  }

  let stopped = false;
  let latestRequest = 0;

  const watchId = navigator.geolocation.watchPosition(
    async (position) => {
      const requestId = ++latestRequest;
      const latitude = position.coords.latitude;
      const longitude = position.coords.longitude;

      const name = await getLocationName(latitude, longitude);

      if (stopped || requestId !== latestRequest) return;

      onLocation({
        latitude,
        longitude,
        name,
        locality: name,
        accuracy: position.coords.accuracy,
      });
    },
    (error) => {
      if (stopped) return;

      const message =
        error.code === 1
          ? "Location permission denied. Allow browser location access."
          : error.code === 2
            ? "Your device location is unavailable."
            : "Location tracking timed out. Please try again.";

      if (onError) onError(new Error(message));
    },
    {
      enableHighAccuracy: true,
      maximumAge: 0,
      timeout: 20000,
    }
  );

  return () => {
    stopped = true;
    navigator.geolocation.clearWatch(watchId);
  };
}

// Satellite monitoring placeholder.
export async function getSatelliteData(latitude, longitude) {
  const lat = Number(latitude);
  const lon = Number(longitude);

  if (
    !Number.isFinite(lat) ||
    !Number.isFinite(lon) ||
    lat < -90 ||
    lat > 90 ||
    lon < -180 ||
    lon > 180
  ) {
    throw new Error("Invalid coordinates.");
  }

  throw new Error("Satellite data provider is not connected yet.");
}

// Crop disease detection placeholder.
export async function detectCropDisease(imageFile) {
  if (!imageFile || !imageFile.type.startsWith("image/")) {
    throw new Error("Please upload a valid crop image.");
  }

  throw new Error("AI crop disease detection model is not connected yet.");
}

// Farmer chatbot connected to the Flask backend.
export async function askFarmerAssistant(question) {
  if (typeof question !== "string" || !question.trim()) {
    throw new Error("Please enter your question.");
  }

  let response;

  try {
    response = await fetch(`${BACKEND_URL}/api/farmer-assistant`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        question: question.trim(),
      }),
    });
  } catch {
    throw new Error(
      "Cannot connect to the AgroPulse backend. Make sure Flask is running on port 5000."
    );
  }

  let data;

  try {
    data = await response.json();
  } catch {
    throw new Error("The backend returned an invalid response.");
  }

  if (!response.ok || !data.success) {
    throw new Error(
      data.message || "Unable to get an AI response. Please try again."
    );
  }

  if (typeof data.answer !== "string" || !data.answer.trim()) {
    throw new Error("The AI returned an empty answer. Please try again.");
  }

  return data.answer.trim();
}
