import {
  Sprout, Droplets, CloudSun, ScanLeaf,
  Satellite, TrendingUp, CalendarDays, FlaskConical
} from "lucide-react";

export default function Dashboard({ user, onNavigate }) {
  const features = [
    ["Irrigation Advisor", "💧", "Plan daily water requirements"],
    ["Weather", "🌦️", "Check weather forecasts"],
    ["Disease Detection", "🍃", "Upload crop leaf images"],
    ["Satellite Monitoring", "🛰️", "Monitor farm locations"],
    ["Farmer Chatbot", "🤖", "Get farming guidance"],
    ["Farming Calendar", "📅", "Organize farm activities"],
    ["Nutrient Advisor", "🧪", "Explore crop nutrition"],
    ["Crop Health", "💚", "Track crop observations"],
    ["Profit Calculator", "💰", "Estimate farm returns"],
    ["Yield Predictor", "📈", "Calculate expected yield"]
  ];

  return (
    <>
      <section className="hero-banner">
        <div>
          <span className="pill">SMART FARMING PLATFORM</span>
          <h2>Welcome to AgroPulse, {user}! 🌱</h2>
          <p>Grow smarter with technology and practical farming insights.</p>
        </div>
        <div className="hero-plant">🌾</div>
      </section>

      <div className="section-title">
        <h2>Your Farming Workspace</h2>
      </div>

      <div className="metric-grid">
        <article className="metric-card">
          <Sprout />
          <small>Platform</small>
          <b>AgroPulse</b>
          <em>Smart agriculture</em>
        </article>

        <article className="metric-card">
          <Droplets />
          <small>Water</small>
          <b>Irrigation Planner</b>
          <em>Water management</em>
        </article>

        <article className="metric-card">
          <CloudSun />
          <small>Climate</small>
          <b>Weather</b>
          <em>Forecast information</em>
        </article>

        <article className="metric-card">
          <ScanLeaf />
          <small>Crop Care</small>
          <b>Disease Detection</b>
          <em>Image analysis interface</em>
        </article>
      </div>

      <div className="section-title">
        <h2>Explore Features</h2>
      </div>

      <div className="quick-grid">
        {features.map(([title, emoji, description]) => (
          <button
            className="quick-card"
            key={title}
            onClick={() => onNavigate(title)}
          >
            <span>{emoji}</span>
            <b>{title}</b>
            <small>{description}</small>
          </button>
        ))}
      </div>
    </>
  );
}
