import { useState } from "react";
import { CloudSun, Search, Wind, Droplets } from "lucide-react";

export default function Weather() {
    const [city, setCity] = useState("Bengaluru");
    const [weather, setWeather] = useState(null);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const getWeather = async (e) => {
        e.preventDefault();

        if (!city.trim()) return;

        setLoading(true);
        setError("");
        setWeather(null);

        try {
            const geoResponse = await fetch(
                `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(city)}&count=1`
            );

            if (!geoResponse.ok) throw new Error("Location search failed.");

            const geo = await geoResponse.json();
            const place = geo.results?.[0];

            if (!place) throw new Error("City not found.");

            const response = await fetch(
                `https://api.open-meteo.com/v1/forecast?latitude=${place.latitude}&longitude=${place.longitude}&current=temperature_2m,relative_humidity_2m,precipitation,wind_speed_10m&daily=temperature_2m_max,temperature_2m_min,precipitation_probability_max&timezone=auto&forecast_days=5`
            );

            if (!response.ok) throw new Error("Weather service unavailable.");

            const data = await response.json();

            setWeather({ place, ...data });
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <div className="page-heading">
                <span className="feature-emoji">🌦️</span>
                <div>
                    <h2>Weather Forecast</h2>
                    <p>Get weather information for your farming location.</p>
                </div>
            </div>

            <form className="search-form" onSubmit={getWeather}>
                <input
                    value={city}
                    onChange={e => setCity(e.target.value)}
                    placeholder="Enter your city"
                />

                <button className="primary-button" disabled={loading}>
                    <Search size={17} />
                    {loading ? "Loading..." : "Search"}
                </button>
            </form>

            {error && <div className="error-box">{error}</div>}

            {weather && (
                <>
                    <section className="panel weather-hero">
                        <div>
                            <span className="overline">
                                {weather.place.name}, {weather.place.country}
                            </span>

                            <h2>{weather.current.temperature_2m}°C</h2>
                            <p>Current temperature</p>
                        </div>

                        <CloudSun size={65} />
                    </section>

                    <div className="metric-grid">
                        <article className="metric-card">
                            <Droplets />
                            <small>Humidity</small>
                            <b>{weather.current.relative_humidity_2m}%</b>
                        </article>

                        <article className="metric-card">
                            <Wind />
                            <small>Wind Speed</small>
                            <b>{weather.current.wind_speed_10m} km/h</b>
                        </article>

                        <article className="metric-card">
                            <Droplets />
                            <small>Precipitation</small>
                            <b>{weather.current.precipitation} mm</b>
                        </article>
                    </div>

                    <div className="section-title">
                        <h2>Five-Day Forecast</h2>
                    </div>

                    <div className="forecast-grid">
                        {weather.daily.time.map((day, index) => (
                            <article className="forecast-card" key={day}>
                                <b>
                                    {new Date(day + "T00:00:00").toLocaleDateString(
                                        "en",
                                        { weekday: "short" }
                                    )}
                                </b>

                                <span>🌤️</span>

                                <strong>
                                    {Math.round(weather.daily.temperature_2m_max[index])}° /
                                    {Math.round(weather.daily.temperature_2m_min[index])}°
                                </strong>

                                <small>
                                    Rain: {weather.daily.precipitation_probability_max[index]}%
                                </small>
                            </article>
                        ))}
                    </div>

                    <p className="helper-text">
                        Weather information provided by Open-Meteo.
                    </p>
                </>
            )}
        </>
    );
}
