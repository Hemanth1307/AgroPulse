
import { useEffect, useState } from "react";
import "./App.css";

const crops = {
  Tomato: 0.8,
  Rice: 1.1,
  Wheat: 1.0,
  Maize: 0.9,
  Potato: 0.85,
  Groundnut: 0.7,
  Cotton: 0.9,
};

function App() {
  // LOGIN STATES
  const [isLoggedIn, setIsLoggedIn] = useState(
    localStorage.getItem("agropulse-logged-in") === "true"
  );
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loginError, setLoginError] = useState("");

  // DASHBOARD STATES
  const [page, setPage] = useState("Dashboard");
  const [crop, setCrop] = useState("Tomato");
  const [area, setArea] = useState(1000);
  const [et0, setEt0] = useState(5);
  const [rain, setRain] = useState(1);
  const [efficiency, setEfficiency] = useState(90);
  const [location, setLocation] = useState("Bengaluru");
  const [weather, setWeather] = useState(null);
  const [weatherError, setWeatherError] = useState("");
  const [loadingWeather, setLoadingWeather] = useState(false);
  const [image, setImage] = useState(null);
  const [farmerName, setFarmerName] = useState(
    localStorage.getItem("agropulse-name") || ""
  );

  // LOGIN FUNCTION
  function handleLogin(event) {
    event.preventDefault();

    if (!email.trim() || !password.trim()) {
      setLoginError("Please enter your email and password.");
      return;
    }

    localStorage.setItem("agropulse-logged-in", "true");
    localStorage.setItem("agropulse-email", email);
    setLoginError("");
    setIsLoggedIn(true);
  }

  // LOGOUT FUNCTION
  function handleLogout() {
    localStorage.removeItem("agropulse-logged-in");
    localStorage.removeItem("agropulse-email");
    setIsLoggedIn(false);
    setEmail("");
    setPassword("");
    setPage("Dashboard");
  }

  // IRRIGATION CALCULATION
  const etc = et0 * crops[crop];
  const netWater = Math.max(0, etc - rain);
  const grossWater = netWater / (efficiency / 100);
  const litres = Math.round(grossWater * area);

  useEffect(() => {
    localStorage.setItem("agropulse-name", farmerName);
  }, [farmerName]);

  // WEATHER FUNCTION
  async function getWeather() {
    if (!location.trim()) {
      setWeatherError("Please enter a city name.");
      return;
    }

    setLoadingWeather(true);
    setWeatherError("");
    setWeather(null);

    try {
      const geoResponse = await fetch(
        `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(
          location
        )}&count=1&language=en&format=json`
      );

      if (!geoResponse.ok) {
        throw new Error("Could not find location.");
      }

      const geoData = await geoResponse.json();
      const place = geoData.results?.[0];

      if (!place) {
        throw new Error("Location not found. Try another city.");
      }

      const weatherResponse = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${place.latitude}&longitude=${place.longitude}&current=temperature_2m,relative_humidity_2m,precipitation,wind_speed_10m&daily=temperature_2m_max,temperature_2m_min,precipitation_probability_max&timezone=auto&forecast_days=5`
      );

      if (!weatherResponse.ok) {
        throw new Error("Weather data unavailable.");
      }

      const data = await weatherResponse.json();
      setWeather({ ...data, place });
    } catch (error) {
      setWeatherError(error.message || "Unable to load weather.");
    } finally {
      setLoadingWeather(false);
    }
  }

  // IMAGE UPLOAD FUNCTION
  function handleImage(event) {
    const file = event.target.files?.[0];

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("Please select an image file.");
      return;
    }

    if (image) {
      URL.revokeObjectURL(image);
    }

    setImage(URL.createObjectURL(file));
  }

  // NAVIGATION BUTTON
  function NavigationButton({ name, icon }) {
    return (
      <button
        className={`nav-button ${page === name ? "active" : ""}`}
        onClick={() => setPage(name)}
      >
        <span>{icon}</span> {name}
      </button>
    );
  }

  // LOGIN PAGE
  if (!isLoggedIn) {
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          background: "#edf7ee",
          padding: "20px",
        }}
      >
        <form
          onSubmit={handleLogin}
          style={{
            width: "100%",
            maxWidth: "420px",
            background: "white",
            padding: "40px",
            borderRadius: "18px",
            boxShadow: "0 8px 30px rgba(0,0,0,0.08)",
            display: "flex",
            flexDirection: "column",
            gap: "15px",
          }}
        >
          <div style={{ textAlign: "center", fontSize: "50px" }}>
            🌱
          </div>

          <h1
            style={{
              textAlign: "center",
              color: "#216b3a",
              margin: "0",
            }}
          >
            Welcome to AgroPulse
          </h1>

          <p style={{ textAlign: "center", color: "#777" }}>
            Smart farming starts here.
          </p>

          <label htmlFor="email">Email address</label>

          <input
            id="email"
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            style={{
              padding: "13px",
              border: "1px solid #ddd",
              borderRadius: "8px",
              fontSize: "15px",
            }}
          />

          <label htmlFor="password">Password</label>

          <input
            id="password"
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            style={{
              padding: "13px",
              border: "1px solid #ddd",
              borderRadius: "8px",
              fontSize: "15px",
            }}
          />

          {loginError && (
            <p style={{ color: "red", margin: "0" }}>
              {loginError}
            </p>
          )}

          <button
            type="submit"
            style={{
              padding: "14px",
              background: "#278447",
              color: "white",
              border: "none",
              borderRadius: "8px",
              fontSize: "16px",
              cursor: "pointer",
            }}
          >
            Login
          </button>

          <p
            style={{
              textAlign: "center",
              color: "#777",
              fontSize: "13px",
            }}
          >
            AgroPulse – Smart Farming 🌾
          </p>
        </form>
      </div>
    );
  }

  // MAIN AGROPULSE DASHBOARD
  return (
    <div className="app-layout">
      <aside className="sidebar">
        <div className="brand">
          <div className="brand-icon">🌱</div>
          <div>
            <h2>AgroPulse</h2>
            <p>Smart Farming</p>
          </div>
        </div>

        <p className="nav-heading">MAIN MENU</p>

        <nav>
          <NavigationButton name="Dashboard" icon="▦" />
          <NavigationButton name="Irrigation Advisor" icon="💧" />
          <NavigationButton name="Weather" icon="☀️" />
          <NavigationButton name="Disease Detection" icon="🍃" />
        </nav>

        <div className="sidebar-bottom">
          <div className="help-card">
            <span>🌾</span>
            <h4>Grow smarter</h4>
            <p>Make informed farming decisions every day.</p>
          </div>

          <p className="sidebar-footer">AgroPulse © 2026</p>
        </div>
      </aside>

      <main className="main-content">
        <header className="topbar">
          <div>
            <p className="topbar-label">
              SMART AGRICULTURE PLATFORM
            </p>
            <h2>{page}</h2>
          </div>

          <div className="profile">
            <div className="avatar">👨‍🌾</div>
            <span>{farmerName || email || "Farmer"}</span>

            <button
              onClick={handleLogout}
              style={{
                marginLeft: "12px",
                padding: "9px 14px",
                border: "none",
                borderRadius: "7px",
                background: "#e8f3e9",
                color: "#216b3a",
                cursor: "pointer",
              }}
            >
              Logout
            </button>
          </div>
        </header>

        {/* DASHBOARD PAGE */}
        {page === "Dashboard" && (
          <section>
            <div className="welcome-banner">
              <div>
                <p className="eyebrow">WELCOME TO AGROPULSE</p>

                <h1>Grow better. Save water. 🌱</h1>

                <p>
                  Your smart farming companion for better crop and
                  irrigation decisions.
                </p>

                <input
                  className="name-input"
                  value={farmerName}
                  onChange={(e) => setFarmerName(e.target.value)}
                  placeholder="Enter your name"
                  aria-label="Farmer name"
                />
              </div>

              <div className="banner-illustration">🌳</div>
            </div>

            <div className="section-heading">
              <div>
                <h2>Farm overview</h2>
                <p>
                  Useful information for your daily farming activities.
                </p>
              </div>
            </div>

            <div className="stats-grid">
              <div className="stat-card">
                <div className="stat-icon green">🌱</div>
                <p>Selected crop</p>
                <h2>{crop}</h2>
                <span>Crop coefficient: {crops[crop]}</span>
              </div>

              <div className="stat-card">
                <div className="stat-icon blue">💧</div>
                <p>Estimated daily water</p>
                <h2>{litres.toLocaleString("en-IN")} L</h2>
                <span>Based on your entered farm details</span>
              </div>

              <div className="stat-card">
                <div className="stat-icon yellow">🌦️</div>
                <p>Weather location</p>
                <h2>{weather?.place?.name || location}</h2>
                <span>
                  {weather
                    ? `${weather.current.temperature_2m}°C currently`
                    : "Fetch weather for your location"}
                </span>
              </div>
            </div>

            <div className="content-grid">
              <div className="panel">
                <div className="panel-heading">
                  <div>
                    <h3>Quick actions</h3>
                    <p>Choose a tool to get started.</p>
                  </div>
                </div>

                <div className="quick-actions">
                  <button onClick={() => setPage("Irrigation Advisor")}>
                    <span>💧</span>
                    <strong>Calculate irrigation</strong>
                    <small>Estimate crop water needs</small>
                  </button>

                  <button onClick={() => setPage("Weather")}>
                    <span>🌤️</span>
                    <strong>Check weather</strong>
                    <small>View a five-day forecast</small>
                  </button>

                  <button onClick={() => setPage("Disease Detection")}>
                    <span>🍃</span>
                    <strong>Upload leaf image</strong>
                    <small>Prepare an image for analysis</small>
                  </button>
                </div>
              </div>

              <div className="panel tip-panel">
                <div className="tip-icon">💡</div>
                <h3>Today's farming tip</h3>

                <p>
                  Check the weather forecast before irrigation. If useful
                  rainfall is expected, you may be able to reduce scheduled
                  watering.
                </p>

                <button
                  className="text-button"
                  onClick={() => setPage("Irrigation Advisor")}
                >
                  Explore irrigation advice →
                </button>
              </div>
            </div>

            <div className="notice">
              <strong>Prototype note:</strong> Soil moisture and crop
              recommendations are not yet connected to satellite data.
              The displayed irrigation estimate uses the values entered
              in the calculator.
            </div>
          </section>
        )}

        {/* IRRIGATION PAGE */}
        {page === "Irrigation Advisor" && (
          <section>
            <div className="page-intro">
              <span className="large-icon">💧</span>

              <div>
                <h1>Smart Irrigation Calculator</h1>
                <p>
                  Estimate daily irrigation water using crop and weather
                  inputs.
                </p>
              </div>
            </div>

            <div className="calculator-layout">
              <div className="panel">
                <h3>Enter farm details</h3>

                <p className="muted">
                  Enter the values for your farm to calculate an estimate.
                </p>

                <label>Choose your crop</label>

                <select
                  value={crop}
                  onChange={(e) => setCrop(e.target.value)}
                >
                  {Object.keys(crops).map((item) => (
                    <option key={item} value={item}>
                      {item}
                    </option>
                  ))}
                </select>

                <label>Farm area (square metres)</label>

                <input
                  type="number"
                  min="1"
                  value={area}
                  onChange={(e) =>
                    setArea(Math.max(1, Number(e.target.value)))
                  }
                />

                <label>
                  Reference evapotranspiration ET0 (mm/day)
                </label>

                <input
                  type="number"
                  min="0"
                  step="0.1"
                  value={et0}
                  onChange={(e) =>
                    setEt0(Math.max(0, Number(e.target.value)))
                  }
                />

                <label>Effective rainfall (mm/day)</label>

                <input
                  type="number"
                  min="0"
                  step="0.1"
                  value={rain}
                  onChange={(e) =>
                    setRain(Math.max(0, Number(e.target.value)))
                  }
                />

                <label>Irrigation efficiency (%)</label>

                <input
                  type="number"
                  min="1"
                  max="100"
                  value={efficiency}
                  onChange={(e) =>
                    setEfficiency(
                      Math.min(100, Math.max(1, Number(e.target.value)))
                    )
                  }
                />

                <button
                  className="primary-button full-button"
                  type="button"
                >
                  Calculate water requirement
                </button>
              </div>

              <div className="panel result-panel">
                <span className="result-label">
                  ESTIMATED DAILY REQUIREMENT
                </span>

                <div className="water-result">
                  {litres.toLocaleString("en-IN")}
                  <span> litres/day</span>
                </div>

                <p className="muted">
                  Approximate gross irrigation water for the entered area.
                </p>

                <div className="calculation-row">
                  <span>Crop</span>
                  <strong>{crop}</strong>
                </div>

                <div className="calculation-row">
                  <span>Crop coefficient (Kc)</span>
                  <strong>{crops[crop]}</strong>
                </div>

                <div className="calculation-row">
                  <span>Crop evapotranspiration (ETc)</span>
                  <strong>{etc.toFixed(2)} mm/day</strong>
                </div>

                <div className="calculation-row">
                  <span>Net irrigation depth</span>
                  <strong>{netWater.toFixed(2)} mm/day</strong>
                </div>

                <div className="calculation-row">
                  <span>Gross irrigation depth</span>
                  <strong>{grossWater.toFixed(2)} mm/day</strong>
                </div>

                <div className="formula-box">
                  <strong>Formula used</strong>
                  <p>ETc = ET0 × Kc</p>
                  <p>
                    Net irrigation = max(0, ETc − effective rainfall)
                  </p>
                  <p>Gross irrigation = net irrigation ÷ efficiency</p>
                  <p>Water in litres = gross depth × area</p>
                </div>
              </div>
            </div>

            <div className="notice warning">
              <strong>Important:</strong> This is a simplified educational
              estimate, not a guaranteed irrigation schedule. Real advice
              also needs soil type, root depth, crop growth stage,
              soil-water storage, local rainfall and irrigation method.
              Rice requires a different water-management model.
            </div>
          </section>
        )}

        {/* WEATHER PAGE */}
        {page === "Weather" && (
          <section>
            <div className="page-intro">
              <span className="large-icon">🌦️</span>

              <div>
                <h1>Weather Forecast</h1>
                <p>Get live weather information for a city.</p>
              </div>
            </div>

            <div className="panel weather-search">
              <label>Enter your city or town</label>

              <div className="search-row">
                <input
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="Example: Bengaluru"
                  onKeyDown={(e) =>
                    e.key === "Enter" && getWeather()
                  }
                />

                <button
                  className="primary-button"
                  onClick={getWeather}
                  disabled={loadingWeather}
                >
                  {loadingWeather ? "Loading..." : "Get weather"}
                </button>
              </div>

              {weatherError && (
                <p className="error-text">{weatherError}</p>
              )}
            </div>

            {weather && (
              <>
                <div className="weather-current panel">
                  <div>
                    <p className="muted">CURRENT WEATHER</p>

                    <h2>
                      {weather.place.name}, {weather.place.country}
                    </h2>

                    <div className="temperature">
                      {weather.current.temperature_2m}°C
                    </div>

                    <p>Current temperature</p>
                  </div>

                  <div className="weather-emoji">☀️</div>
                </div>

                <div className="stats-grid weather-stats">
                  <div className="stat-card">
                    <p>Humidity</p>
                    <h2>
                      {weather.current.relative_humidity_2m}%
                    </h2>
                  </div>

                  <div className="stat-card">
                    <p>Precipitation</p>
                    <h2>
                      {weather.current.precipitation} mm
                    </h2>
                  </div>

                  <div className="stat-card">
                    <p>Wind speed</p>
                    <h2>
                      {weather.current.wind_speed_10m} km/h
                    </h2>
                  </div>
                </div>

                <div className="panel">
                  <h3>Five-day forecast</h3>

                  <div className="forecast-grid">
                    {weather.daily.time.map((day, index) => (
                      <div className="forecast-day" key={day}>
                        <strong>
                          {new Date(
                            day + "T12:00:00"
                          ).toLocaleDateString("en-IN", {
                            weekday: "short",
                            day: "numeric",
                          })}
                        </strong>

                        <span>🌤️</span>

                        <strong>
                          {weather.daily.temperature_2m_max[index]}° /{" "}
                          {weather.daily.temperature_2m_min[index]}°
                        </strong>

                        <small>
                          Rain chance:{" "}
                          {weather.daily.precipitation_probability_max[index]}%
                        </small>
                      </div>
                    ))}
                  </div>
                </div>

                <p className="source-note">
                  Weather data provided by Open-Meteo.
                </p>
              </>
            )}

            {!weather && !loadingWeather && !weatherError && (
              <div className="empty-state">
                <span>🌤️</span>
                <h3>Your weather report will appear here</h3>
                <p>Enter a city and click Get weather.</p>
              </div>
            )}
          </section>
        )}

        {/* DISEASE DETECTION PAGE */}
        {page === "Disease Detection" && (
          <section>
            <div className="page-intro">
              <span className="large-icon">🍃</span>

              <div>
                <h1>Crop Disease Detection</h1>
                <p>
                  Upload a clear photo of a crop leaf for future AI analysis.
                </p>
              </div>
            </div>

            <div className="panel upload-panel">
              <div className="upload-icon">📷</div>

              <h2>Upload a leaf image</h2>

              <p>
                Choose a clear photo showing the affected leaf.
              </p>

              <label className="upload-button">
                Choose image

                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImage}
                  hidden
                />
              </label>

              {image && (
                <div className="image-preview">
                  <img
                    src={image}
                    alt="Uploaded crop leaf preview"
                  />

                  <p>Image selected successfully.</p>
                </div>
              )}

              <div className="notice warning">
                <strong>AI model not connected yet.</strong> This page
                currently previews uploaded images only. It does not
                diagnose diseases. A trained and tested image-classification
                model must be integrated before showing disease predictions
                or treatment advice.
              </div>
            </div>

            <div className="panel">
              <h3>How the feature will work</h3>

              <div className="steps-grid">
                <div>
                  <span>1</span>
                  <strong>Upload</strong>
                  <p>Take a clear leaf photo.</p>
                </div>

                <div>
                  <span>2</span>
                  <strong>AI analysis</strong>
                  <p>A trained model checks the image.</p>
                </div>

                <div>
                  <span>3</span>
                  <strong>Advisory</strong>
                  <p>Show a reviewed result and safe next steps.</p>
                </div>
              </div>
            </div>
          </section>
        )}

        <footer className="footer">
          AgroPulse – Smart farming for a sustainable future 🌍
        </footer>
      </main>
    </div>
  );
}

export default App;
