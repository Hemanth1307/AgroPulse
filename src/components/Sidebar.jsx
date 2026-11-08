import {
  LayoutDashboard, Droplets, CloudSun, ScanLeaf,
  Satellite, MessageCircle, CalendarDays,
  FlaskConical, HeartPulse, Calculator, TrendingUp
} from "lucide-react";

const links = [
  ["Dashboard", LayoutDashboard],
  ["Irrigation Advisor", Droplets],
  ["Weather", CloudSun],
  ["Disease Detection", ScanLeaf],
  ["Satellite Monitoring", Satellite],
  ["Farmer Chatbot", MessageCircle],
  ["Farming Calendar", CalendarDays],
  ["Nutrient Advisor", FlaskConical],
  ["Crop Health", HeartPulse],
  ["Profit Calculator", Calculator],
  ["Yield Predictor", TrendingUp]
];

export default function Sidebar({ active, onNavigate }) {
  return (
    <aside className="sidebar">
      <div className="brand">
        <span className="brand-mark">🌱</span>
        <div>
          <b>AgroPulse</b>
          <small>SMART FARMING</small>
        </div>
      </div>

      <p className="nav-label">WORKSPACE</p>

      <nav>
        {links.map(([name, Icon]) => (
          <button
            key={name}
            className={`nav-link ${active === name ? "selected" : ""}`}
            onClick={() => onNavigate(name)}
          >
            <Icon size={18} />
            <span>{name}</span>
          </button>
        ))}
      </nav>

      <div className="sidebar-bottom">
        <div className="sidebar-tip">
          🌾
          <b>Grow with confidence</b>
          <p>Make smarter farming decisions with AgroPulse.</p>
        </div>
      </div>
    </aside>
  );
}
