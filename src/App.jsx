
import { useState } from "react";
import "./App.css";
import "./Login.css";

const features = [
  { name: "Dashboard", icon: "🏡", description: "Your farming overview" },
  { name: "Weather", icon: "🌦️", description: "Weather forecasts" },
  { name: "Crop Doctor", icon: "🌿", description: "Check crop diseases" },
  { name: "Irrigation", icon: "💧", description: "Smart watering advice" },
  { name: "Satellite Monitoring", icon: "🛰️", description: "Monitor your farm" },
  { name: "Nutrient Advisor", icon: "🧪", description: "Soil nutrient guidance" },
  { name: "Crop Health Tracker", icon: "📊", description: "Track crop health" },
  { name: "Farming Calendar", icon: "📅", description: "Plan farm activities" },
  { name: "Farmer Chatbot", icon: "🤖", description: "Ask farming questions" },
  { name: "Profit Calculator", icon: "💰", description: "Estimate your profit" },
  { name: "Yield Predictor", icon: "🌾", description: "Estimate crop yield" }
];

function Login({ onLogin }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  function handleSubmit(event) {
    event.preventDefault();

    if (!email.trim() || !password.trim()) {
      alert("Please enter your email and password.");
      return;
    }

    onLogin(email);
  }

  function handleGoogleLogin() {
    alert("Google authentication is not connected yet. Configure Firebase Authentication to enable it.");
  }

  return (
    <div className="login-page">
      <div className="login-visual">
        <div className="visual-content">
          <div className="brand-mark">🌱 AgroPulse</div>
          <h1>Grow smarter.<br />Farm better.</h1>
          <p>
            Your intelligent farming companion for weather,
            crop health, irrigation and better decisions.
          </p>
          <div className="visual-illustration">🌾</div>
          <span>Smart insights for a greener tomorrow.</span>
        </div>
      </div>

      <div className="login-form-area">
        <div className="login-card">
          <div className="mobile-brand">🌱 AgroPulse</div>

          <span className="login-eyebrow">WELCOME TO AGROPULSE</span>
          <h2>Welcome back!</h2>
          <p className="login-subtitle">
            Sign in to access your smart farming dashboard.
          </p>

          <button
            type="button"
            className="google-login"
            onClick={handleGoogleLogin}
          >
            <span className="google-icon">G</span>
            Continue with Google
          </button>

          <div className="login-divider">
            <span>OR CONTINUE WITH EMAIL</span>
          </div>

          <form onSubmit={handleSubmit}>
            <label htmlFor="email">Email address</label>
            <input
              id="email"
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              required
            />

            <label htmlFor="password">Password</label>
            <div className="password-wrapper">
              <input
                id="password"
                type={showPassword ? "text" : "password"}
                placeholder="Enter your password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                required
              />
              <button
                type="button"
                className="show-password"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>

            <button type="submit" className="login-submit">
              Sign in →
            </button>
          </form>

          <p className="login-note">
            Demo login: enter any valid email and password.
          </p>
          <p className="login-footer">
            By continuing, you agree to our Terms and Privacy Policy.
          </p>
        </div>
      </div>
    </div>
  );
}

function Dashboard({ email, onLogout }) {
  const [activeFeature, setActiveFeature] = useState("Dashboard");

  return (
    <div className="app-layout">
      <aside className="sidebar">
        <div className="sidebar-brand">🌱 AgroPulse</div>
        <p className="sidebar-label">MAIN MENU</p>

        <nav>
          {features.map((feature) => (
            <button
              key={feature.name}
              className={`nav-item ${
                activeFeature === feature.name ? "active" : ""
              }`}
              onClick={() => setActiveFeature(feature.name)}
            >
              <span>{feature.icon}</span>
              {feature.name}
            </button>
          ))}
        </nav>

        <button className="logout-button" onClick={onLogout}>
          ↪ Sign out
        </button>
      </aside>

      <main className="dashboard-main">
        <header className="topbar">
          <div>
            <span className="topbar-label">SMART FARMING PLATFORM</span>
            <h2>AgroPulse</h2>
          </div>
          <div className="user-info">
            <div className="user-avatar">👨‍🌾</div>
            <span>{email}</span>
          </div>
        </header>

        <section className="welcome-section">
          <span className="welcome-tag">YOUR FARMING ASSISTANT</span>
          <h1>
            {activeFeature === "Dashboard"
              ? "Welcome to your farm dashboard 🌱"
              : activeFeature}
          </h1>
          <p>
            {activeFeature === "Dashboard"
              ? "Make informed farming decisions with smart agricultural insights."
              : `Explore ${activeFeature.toLowerCase()} with AgroPulse.`}
          </p>
        </section>

        {activeFeature === "Dashboard" ? (
          <>
            <div className="stats-grid">
              <div className="stat-card">
                <span>🌦️</span>
                <p>Weather</p>
                <h3>Live updates</h3>
                <small>Check local weather conditions</small>
              </div>
              <div className="stat-card">
                <span>🌿</span>
                <p>Crop Health</p>
                <h3>Monitor crops</h3>
                <small>Keep track of crop conditions</small>
              </div>
              <div className="stat-card">
                <span>💧</span>
                <p>Irrigation</p>
                <h3>Save water</h3>
                <small>Plan efficient watering</small>
              </div>
              <div className="stat-card">
                <span>🌾</span>
                <p>Crop Planning</p>
                <h3>Plan ahead</h3>
                <small>Organize farming activities</small>
              </div>
            </div>

            <div className="section-heading">
              <div>
                <h2>Explore AgroPulse</h2>
                <p>Choose a tool to get started.</p>
              </div>
            </div>

            <div className="feature-grid">
              {features.slice(1).map((feature) => (
                <button
                  className="feature-card"
                  key={feature.name}
                  onClick={() => setActiveFeature(feature.name)}
                >
                  <span className="feature-icon">{feature.icon}</span>
                  <h3>{feature.name}</h3>
                  <p>{feature.description}</p>
                  <span className="feature-arrow">Explore →</span>
                </button>
              ))}
            </div>
          </>
        ) : (
          <div className="feature-placeholder">
            <span className="placeholder-icon">
              {features.find((item) => item.name === activeFeature)?.icon}
            </span>
            <h2>{activeFeature}</h2>
            <p>
              This feature page can be connected to its individual component.
            </p>
            <button onClick={() => setActiveFeature("Dashboard")}>
              ← Back to Dashboard
            </button>
          </div>
        )}
      </main>
    </div>
  );
}

export default function App() {
  const [email, setEmail] = useState(
    localStorage.getItem("agropulse-user") || ""
  );

  function handleLogin(userEmail) {
    localStorage.setItem("agropulse-user", userEmail);
    setEmail(userEmail);
  }

  function handleLogout() {
    localStorage.removeItem("agropulse-user");
    setEmail("");
  }

  return email ? (
    <Dashboard email={email} onLogout={handleLogout} />
  ) : (
    <Login onLogin={handleLogin} />
  );
}
