
import { useState } from "react";

export default function Weather() {
  const [city, setCity] = useState("Bengaluru");
  const [data, setData] = useState(null);
  const [error, setError] = useState("");

  async function getWeather() {
    setError("");
    setData(null);
    try {
      const geo = await fetch(
        `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1`
      );
      const locations = await geo.json();
      if (!locations.results?.length) throw new Error("City not found");

      const place = locations.results[0];
      const response = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${place.latitude}&longitude=${place.longitude}&current=temperature_2m,relative_humidity_2m,precipitation&timezone=auto`
      );
      const result = await response.json();
      setData({ place, current: result.current });
    } catch (e) {
      setError(e.message);
    }
  }

  return (
    <section>
      <h1>🌦️ Weather Forecast</h1>
      <input value={city} onChange={e => setCity(e.target.value)} placeholder="Enter city" />
      <button onClick={getWeather}>Get Weather</button>
      {error && <p>{error}</p>}
      {data && (
        <div>
          <h2>{data.place.name}</h2>
          <p>Temperature: {data.current.temperature_2m}°C</p>
          <p>Humidity: {data.current.relative_humidity_2m}%</p>
          <p>Precipitation: {data.current.precipitation} mm</p>
        </div>
      )}
    </section>
  );
}
