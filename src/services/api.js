
const BASE_URL = "https://api.open-meteo.com/v1";
const GEO_URL = "https://geocoding-api.open-meteo.com/v1";

// Common function to fetch API data
async function apiRequest(url) {
  try {
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`API Error: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("API request failed:", error);
    throw error;
  }
}

// 1. Get coordinates using city name
export async function getCoordinates(city) {
  if (!city || !city.trim()) {
    throw new Error("Please enter a city name.");
  }

  const url =
    `${GEO_URL}/search?name=${encodeURIComponent(city)}&count=1`;

  const data = await apiRequest(url);

  if (!data.results || data.results.length === 0) {
    throw new Error("Location not found.");
  }

  return data.results[0];
}

// 2. Get weather using latitude and longitude
export async function getWeather(latitude, longitude) {
  const url =
    `${BASE_URL}/forecast?latitude=${latitude}` +
    `&longitude=${longitude}` +
    `&current=temperature_2m,relative_humidity_2m,precipitation,wind_speed_10m` +
    `&daily=temperature_2m_max,temperature_2m_min,precipitation_probability_max` +
    `&timezone=auto&forecast_days=5`;

  return await apiRequest(url);
}

// 3. Get weather directly using city name
export async function getWeatherByCity(city) {
  const location = await getCoordinates(city);

  const weather = await getWeather(
    location.latitude,
    location.longitude
  );

  return {
    location,
    weather
  };
}

// 4. Satellite monitoring placeholder
export async function getSatelliteData(latitude, longitude) {
  if (
    latitude < -90 ||
    latitude > 90 ||
    longitude < -180 ||
    longitude > 180
  ) {
    throw new Error("Invalid coordinates.");
  }

  throw new Error(
    "Satellite data provider is not connected yet."
  );
}

// 5. Crop disease detection placeholder
export async function detectCropDisease(imageFile) {
  if (!imageFile || !imageFile.type.startsWith("image/")) {
    throw new Error("Please upload a valid crop image.");
  }

  throw new Error(
    "AI crop disease detection model is not connected yet."
  );
}

// 6. Farmer chatbot placeholder
export async function askFarmerAssistant(question) {
  if (!question || !question.trim()) {
    throw new Error("Please enter your question.");
  }

  throw new Error(
    "AI chatbot backend is not connected yet."
  );
}
