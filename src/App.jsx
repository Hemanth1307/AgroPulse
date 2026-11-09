import { useEffect, useState } from "react";
import {
  Sprout,
  LayoutDashboard,
  CloudSun,
  Scan,
  Droplets,
  Satellite,
  FlaskConical,
  Activity,
  CalendarDays,
  MessageCircle,
  Wallet,
  TrendingUp,
  Search,
  Bell,
  Menu,
  X,
  ChevronDown,
  ArrowUpRight,
  ArrowDownRight,
  MapPin,
  Wind,
  Thermometer,
  CloudRain,
  Sun,
  Leaf,
  Gauge,
  Send,
  Camera,
  Plus,
  Download,
  Settings,
  CircleHelp,
  LogOut,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Droplet,
  IndianRupee,
  BarChart3,
  RefreshCw,
  Languages,
  Mic,
  Volume2
} from "lucide-react";

import Login from "./Login";
import "./App.css";
import { jsPDF } from "jspdf";

const navigation = [
  { name: "Dashboard", icon: LayoutDashboard },
  { name: "Weather", icon: CloudSun },
  { name: "Crop Doctor", icon: Scan },
  { name: "Smart Irrigation", icon: Droplets },
  { name: "Satellite Monitoring", icon: Satellite },
  { name: "Nutrient Advisor", icon: FlaskConical },
  { name: "Crop Health Tracker", icon: Activity },
  { name: "Farming Calendar", icon: CalendarDays },
  { name: "Farmer Chatbot", icon: MessageCircle },
  { name: "Profit Calculator", icon: Wallet },
  { name: "Yield Predictor", icon: TrendingUp }
];

const descriptions = {
  Dashboard: "Your farm overview, insights and daily priorities.",
  Weather: "Weather conditions and forecasts for your farm.",
  "Crop Doctor": "Identify crop problems and explore possible treatments.",
  "Smart Irrigation": "Monitor estimated water demand and manage irrigation.",
  "Satellite Monitoring": "Explore satellite-derived vegetation indicators.",
  "Nutrient Advisor": "Review soil nutrient information and fertilizer guidance.",
  "Crop Health Tracker": "Track crop health indicators over time.",
  "Farming Calendar": "Plan important farm activities and crop milestones.",
  "Farmer Chatbot": "Ask questions about your farm and get advisory support.",
  "Profit Calculator": "Estimate farm costs, revenue and profitability.",
  "Yield Predictor": "Explore estimated crop yield using available indicators."
};

const languageOptions = [
  { code: "en-IN", label: "English", key: "en" },
  { code: "kn-IN", label: "ಕನ್ನಡ", key: "kn" },
  { code: "te-IN", label: "తెలుగు", key: "te" },
  { code: "hi-IN", label: "हिन्दी", key: "hi" },
  { code: "ta-IN", label: "தமிழ்", key: "ta" },
  { code: "ml-IN", label: "മലയാളം", key: "ml" }
];

const translations = {
  en: {
    workspace: "WORKSPACE",
    search: "Search modules...",
    dashboard: "Dashboard",
    farmerMode: "Farmer Mode",
    technicalMode: "Technical Mode",
    language: "Language",
    voice: "Voice assistant",
    welcome: "Welcome to your farm!",
    welcomeText: "Here is a simple overview of your farm today.",
    health: "Crop health",
    moisture: "Soil moisture estimate",
    water: "Water requirement",
    temperature: "Temperature",
    overview: "Farm overview",
    weather: "Weather",
    irrigation: "Irrigation status",
    priorities: "Today's farm activities",
    manage: "Manage irrigation",
    forecast: "Weather forecast",
    chat: "AgroPulse farm assistant",
    chatPlaceholder: "Ask something about your farm...",
    listen: "Speak",
    stop: "Stop listening",
    speak: "Read answer aloud",
    demo: "Demo mode",
    help: "Help & Support",
    settings: "Settings",
    refresh: "Refresh",
    logout: "Log out"
  },

  kn: {
    workspace: "ಕಾರ್ಯಸ್ಥಳ",
    search: "ವಿಭಾಗಗಳನ್ನು ಹುಡುಕಿ...",
    dashboard: "ಡ್ಯಾಶ್‌ಬೋರ್ಡ್",
    farmerMode: "ರೈತ ಮೋಡ್",
    technicalMode: "ತಾಂತ್ರಿಕ ಮೋಡ್",
    language: "ಭಾಷೆ",
    voice: "ಧ್ವನಿ ಸಹಾಯಕ",
    welcome: "ನಿಮ್ಮ ಹೊಲಕ್ಕೆ ಸ್ವಾಗತ!",
    welcomeText: "ಇಂದು ನಿಮ್ಮ ಹೊಲದ ಸರಳ ಮಾಹಿತಿ ಇಲ್ಲಿದೆ.",
    health: "ಬೆಳೆ ಆರೋಗ್ಯ",
    moisture: "ಮಣ್ಣಿನ ತೇವಾಂಶ ಅಂದಾಜು",
    water: "ನೀರಿನ ಅವಶ್ಯಕತೆ",
    temperature: "ತಾಪಮಾನ",
    overview: "ಹೊಲದ ಮಾಹಿತಿ",
    weather: "ಹವಾಮಾನ",
    irrigation: "ನೀರಾವರಿ ಸ್ಥಿತಿ",
    priorities: "ಇಂದಿನ ಕೃಷಿ ಚಟುವಟಿಕೆಗಳು",
    manage: "ನೀರಾವರಿ ನಿರ್ವಹಿಸಿ",
    forecast: "ಹವಾಮಾನ ಮುನ್ಸೂಚನೆ",
    chat: "AgroPulse ಕೃಷಿ ಸಹಾಯಕ",
    chatPlaceholder: "ನಿಮ್ಮ ಹೊಲದ ಬಗ್ಗೆ ಕೇಳಿ...",
    listen: "ಮಾತನಾಡಿ",
    stop: "ಕೇಳುವುದನ್ನು ನಿಲ್ಲಿಸಿ",
    speak: "ಉತ್ತರವನ್ನು ಕೇಳಿ",
    demo: "ಡೆಮೊ ಮೋಡ್",
    help: "ಸಹಾಯ",
    settings: "ಸೆಟ್ಟಿಂಗ್‌ಗಳು",
    refresh: "ಮರುಲೋಡ್",
    logout: "ಲಾಗ್ ಔಟ್"
  },

  te: {
    workspace: "పని ప్రదేశం",
    search: "మాడ్యూల్స్ వెతకండి...",
    dashboard: "డాష్‌బోర్డ్",
    farmerMode: "రైతు మోడ్",
    technicalMode: "టెక్నికల్ మోడ్",
    language: "భాష",
    voice: "వాయిస్ సహాయకుడు",
    welcome: "మీ పొలానికి స్వాగతం!",
    welcomeText: "ఈరోజు మీ పొలం యొక్క సరళమైన సమాచారం.",
    health: "పంట ఆరోగ్యం",
    moisture: "నేల తేమ అంచనా",
    water: "నీటి అవసరం",
    temperature: "ఉష్ణోగ్రత",
    overview: "పొలం వివరాలు",
    weather: "వాతావరణం",
    irrigation: "నీటిపారుదల స్థితి",
    priorities: "ఈరోజు వ్యవసాయ పనులు",
    manage: "నీటిపారుదల నిర్వహించండి",
    forecast: "వాతావరణ సూచన",
    chat: "AgroPulse వ్యవసాయ సహాయకుడు",
    chatPlaceholder: "మీ పొలం గురించి అడగండి...",
    listen: "మాట్లాడండి",
    stop: "వినడం ఆపండి",
    speak: "సమాధానం వినండి",
    demo: "డెమో మోడ్",
    help: "సహాయం",
    settings: "సెట్టింగ్స్",
    refresh: "రిఫ్రెష్",
    logout: "లాగ్ అవుట్"
  },

  hi: {
    workspace: "कार्यस्थान",
    search: "मॉड्यूल खोजें...",
    dashboard: "डैशबोर्ड",
    farmerMode: "किसान मोड",
    technicalMode: "तकनीकी मोड",
    language: "भाषा",
    voice: "आवाज़ सहायक",
    welcome: "आपके खेत में आपका स्वागत है!",
    welcomeText: "आज आपके खेत की आसान जानकारी।",
    health: "फसल का स्वास्थ्य",
    moisture: "मिट्टी की नमी का अनुमान",
    water: "पानी की आवश्यकता",
    temperature: "तापमान",
    overview: "खेत का विवरण",
    weather: "मौसम",
    irrigation: "सिंचाई की स्थिति",
    priorities: "आज के कृषि कार्य",
    manage: "सिंचाई प्रबंधित करें",
    forecast: "मौसम पूर्वानुमान",
    chat: "AgroPulse किसान सहायक",
    chatPlaceholder: "अपने खेत के बारे में पूछें...",
    listen: "बोलें",
    stop: "सुनना बंद करें",
    speak: "जवाब सुनें",
    demo: "डेमो मोड",
    help: "सहायता",
    settings: "सेटिंग्स",
    refresh: "रीफ्रेश",
    logout: "लॉग आउट"
  },

  ta: {
    workspace: "பணியிடம்",
    search: "பகுதிகளைத் தேடுங்கள்...",
    dashboard: "டாஷ்போர்டு",
    farmerMode: "விவசாயி முறை",
    technicalMode: "தொழில்நுட்ப முறை",
    language: "மொழி",
    voice: "குரல் உதவியாளர்",
    welcome: "உங்கள் பண்ணைக்கு வரவேற்கிறோம்!",
    welcomeText: "இன்றைய உங்கள் பண்ணையின் எளிய விவரங்கள்.",
    health: "பயிர் ஆரோக்கியம்",
    moisture: "மண் ஈரப்பத மதிப்பீடு",
    water: "நீர் தேவை",
    temperature: "வெப்பநிலை",
    overview: "பண்ணை விவரங்கள்",
    weather: "வானிலை",
    irrigation: "நீர்ப்பாசன நிலை",
    priorities: "இன்றைய விவசாயப் பணிகள்",
    manage: "நீர்ப்பாசனத்தை நிர்வகிக்கவும்",
    forecast: "வானிலை முன்னறிவிப்பு",
    chat: "AgroPulse விவசாய உதவியாளர்",
    chatPlaceholder: "உங்கள் பண்ணையைப் பற்றி கேளுங்கள்...",
    listen: "பேசுங்கள்",
    stop: "கேட்பதை நிறுத்து",
    speak: "பதிலைக் கேளுங்கள்",
    demo: "டெமோ முறை",
    help: "உதவி",
    settings: "அமைப்புகள்",
    refresh: "புதுப்பிக்கவும்",
    logout: "வெளியேறு"
  },

  ml: {
    workspace: "പ്രവർത്തന സ്ഥലം",
    search: "മൊഡ്യൂളുകൾ തിരയുക...",
    dashboard: "ഡാഷ്ബോർഡ്",
    farmerMode: "കർഷക മോഡ്",
    technicalMode: "സാങ്കേതിക മോഡ്",
    language: "ഭാഷ",
    voice: "വോയ്സ് സഹായി",
    welcome: "നിങ്ങളുടെ കൃഷിയിടത്തിലേക്ക് സ്വാഗതം!",
    welcomeText: "ഇന്നത്തെ കൃഷിയിടത്തിന്റെ ലളിതമായ വിവരങ്ങൾ.",
    health: "വിളയുടെ ആരോഗ്യം",
    moisture: "മണ്ണിലെ ഈർപ്പത്തിന്റെ കണക്ക്",
    water: "ജലത്തിന്റെ ആവശ്യം",
    temperature: "താപനില",
    overview: "കൃഷിയിട വിവരങ്ങൾ",
    weather: "കാലാവസ്ഥ",
    irrigation: "ജലസേചന നില",
    priorities: "ഇന്നത്തെ കൃഷിപ്പണികൾ",
    manage: "ജലസേചനം നിയന്ത്രിക്കുക",
    forecast: "കാലാവസ്ഥാ പ്രവചനം",
    chat: "AgroPulse കർഷക സഹായി",
    chatPlaceholder: "നിങ്ങളുടെ കൃഷിയിടത്തെക്കുറിച്ച് ചോദിക്കൂ...",
    listen: "സംസാരിക്കുക",
    stop: "കേൾക്കുന്നത് നിർത്തുക",
    speak: "ഉത്തരം കേൾക്കുക",
    demo: "ഡെമോ മോഡ്",
    help: "സഹായം",
    settings: "ക്രമീകരണങ്ങൾ",
    refresh: "പുതുക്കുക",
    logout: "ലോഗ് ഔട്ട്"
  }
};

function MetricCard({ title, value, unit, change, icon: Icon, positive = true }) {
  return (
    <div className="metric-card">
      <div className="metric-top">
        <span>{title}</span>
        <div className="metric-icon"><Icon size={19} /></div>
      </div>

      <div className="metric-value">
        {value}<small>{unit}</small>
      </div>

      <div className={`metric-change ${positive ? "positive" : "negative"}`}>
        {positive ? <ArrowUpRight size={15} /> : <ArrowDownRight size={15} />}
        {change}
      </div>
    </div>
  );
}

function PanelTitle({ title, subtitle, action }) {
  return (
    <div className="panel-title">
      <div>
        <h3>{title}</h3>
        {subtitle && <p>{subtitle}</p>}
      </div>
      {action}
    </div>
  );
}

function Status({ children, type = "green" }) {
  return <span className={`status status-${type}`}>{children}</span>;
}

/* ================= DASHBOARD ================= */

function Dashboard({ setActive, mode, t }) {
  const tasks = [
    ["Check irrigation schedule", "Today · 10:30 AM", "High", "orange"],
    ["Inspect tomato crop health", "Today · 2:00 PM", "Medium", "blue"],
    ["Review nutrient recommendation", "Tomorrow · 9:00 AM", "Low", "green"]
  ];

  return (
    <>
      <div className="welcome-banner">
        <div>
          <span className="eyebrow">
            <Sprout size={14} /> AGROPULSE AI
          </span>

          <h2>{t.welcome} 👋</h2>
          <p>{t.welcomeText}</p>

          <div className="location-line">
            <MapPin size={14} />
            Bengaluru, Karnataka · Demo farm
          </div>
        </div>

        <div className="banner-illustration">
          <Sprout size={76} />
        </div>
      </div>

      <div className="metrics-grid">
        <MetricCard
          title={t.health}
          value="82"
          unit="/100"
          change="Illustrative value"
          icon={Leaf}
        />

        <MetricCard
          title={t.moisture}
          value="31"
          unit="%"
          change="Estimated value"
          icon={Droplets}
        />

        <MetricCard
          title={t.water}
          value="4.2"
          unit="mm"
          change="Demo value"
          icon={Droplet}
        />

        <MetricCard
          title={t.temperature}
          value="28"
          unit="°C"
          change="Demo value"
          icon={Sun}
        />
      </div>

      <div className="dashboard-grid">

        {mode === "technical" && (
          <div className="panel large-panel">
            <PanelTitle
              title="NDVI / Vegetation index"
              subtitle="Illustrative technical visualization"
              action={<Status type="blue">Demo data</Status>}
            />

            <div className="chart-legend">
              <span>
                <i className="legend-dot lime" /> NDVI
              </span>
              <span>Last 7 days</span>
            </div>

            <div className="bar-chart">
              {[54, 66, 61, 74, 69, 83, 78, 88, 82, 92, 86, 94].map(
                (h, i) => (
                  <div className="bar-column" key={i}>
                    <div
                      className="bar"
                      style={{ height: `${h}%` }}
                    />
                    <small>{i + 1}</small>
                  </div>
                )
              )}
            </div>

            <div className="chart-footnote">
              Illustrative values only. Not live satellite observations.
            </div>
          </div>
        )}

        <div className="panel">
          <PanelTitle
            title={t.weather}
            subtitle="Demo weather information"
            action={<CloudSun size={20} />}
          />

          <div className="weather-main">
            <Sun size={42} />
            <div>
              <strong>28°C</strong>
              <span>Partly cloudy</span>
            </div>
          </div>

          <div className="weather-details">
            <div>
              <Wind size={17} />
              <span>Wind</span>
              <strong>12 km/h</strong>
            </div>

            <div>
              <CloudRain size={17} />
              <span>Rain chance</span>
              <strong>30%</strong>
            </div>

            <div>
              <Thermometer size={17} />
              <span>Humidity</span>
              <strong>68%</strong>
            </div>
          </div>

          <button
            className="text-action"
            onClick={() => setActive("Weather")}
          >
            {t.forecast} <ArrowUpRight size={15} />
          </button>
        </div>

        <div className="panel">
          <PanelTitle
            title={t.irrigation}
            subtitle="Virtual irrigation system"
          />

          <div className="irrigation-status">
            <div className="round-icon">
              <Droplets size={27} />
            </div>

            <div>
              <strong>Standby</strong>
              <span>Virtual pump is currently off</span>
            </div>

            <Status type="blue">Simulation</Status>
          </div>

          <div className="progress-label">
            <span>{t.moisture}</span>
            <strong>31%</strong>
          </div>

          <div className="progress-track">
            <div style={{ width: "31%" }} />
          </div>

          <button
            className="text-action"
            onClick={() => setActive("Smart Irrigation")}
          >
            {t.manage} <ArrowUpRight size={15} />
          </button>
        </div>

        <div className="panel">
          <PanelTitle
            title={t.priorities}
            subtitle="Suggested farm activities"
          />

          <div className="task-list">
            {tasks.map(([title, time, priority, color]) => (
              <div className="task-item" key={title}>
                <div className="task-check">
                  <CheckCircle2 size={18} />
                </div>

                <div className="task-content">
                  <strong>{title}</strong>
                  <span>
                    <Clock size={12} /> {time}
                  </span>
                </div>

                <Status type={color}>{priority}</Status>
              </div>
            ))}
          </div>

          <button
            className="text-action"
            onClick={() => setActive("Farming Calendar")}
          >
            Open farming calendar <ArrowUpRight size={15} />
          </button>
        </div>
      </div>
    </>
  );
}

/* ================= WEATHER ================= */

function WeatherPage() {
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Test coordinates: Bengaluru.
  // Replace these with saved farm coordinates later.
  const latitude = 12.9716;
  const longitude = 77.5946;

  useEffect(() => {
    let cancelled = false;

    async function loadWeather() {
      setLoading(true);
      setError("");

      try {
        const response = await fetch(
          `http://127.0.0.1:5000/api/weather?latitude=${latitude}&longitude=${longitude}`
        );

        const data = await response.json();

        if (!response.ok || !data.success) {
          throw new Error(data.message || "Unable to load weather data.");
        }

        if (!cancelled) {
          setWeather(data);
        }
      } catch (err) {
        if (!cancelled) {
          setError(err.message || "Could not connect to the weather service.");
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    }

    loadWeather();

    return () => {
      cancelled = true;
    };
  }, []);

  const current = weather?.current || {};
  const daily = weather?.daily || {};

  const forecastDates = daily.time || [];
  const maxTemps = daily.temperature_2m_max || [];
  const minTemps = daily.temperature_2m_min || [];
  const rainChances = daily.precipitation_probability_max || [];
  const et0Values = daily.et0_fao_evapotranspiration || [];

  function dayLabel(date, index) {
    if (index === 0) return "Today";

    return new Date(`${date}T00:00:00`).toLocaleDateString(
      "en-IN",
      { weekday: "short" }
    );
  }

  return (
    <>
      {loading && (
        <div className="panel">
          <p>Loading live weather data from Open-Meteo...</p>
        </div>
      )}

      {error && (
        <div className="panel">
          <div className="notice">
            <AlertTriangle size={17} />
            <span>
              {error} Check that Flask is running at http://127.0.0.1:5000.
            </span>
          </div>
        </div>
      )}

      {!loading && !error && weather && (
        <>
          <div className="panel" style={{ marginBottom: 18 }}>
            <PanelTitle
              title="Live farm weather"
              subtitle={`Open-Meteo · ${weather.location?.timezone || "Local timezone"}`}
              action={<Status type="green">Live API data</Status>}
            />

            <div className="metrics-grid">
              <MetricCard
                title="Temperature"
                value={current.temperature_2m ?? "—"}
                unit="°C"
                change="Current"
                icon={Thermometer}
              />

              <MetricCard
                title="Rain probability"
                value={rainChances[0] ?? "—"}
                unit="%"
                change="Today's maximum"
                icon={CloudRain}
              />

              <MetricCard
                title="Wind speed"
                value={current.wind_speed_10m ?? "—"}
                unit="km/h"
                change="Current"
                icon={Wind}
              />

              <MetricCard
                title="Reference ET₀"
                value={et0Values[0] ?? "—"}
                unit="mm/day"
                change="Today's forecast"
                icon={Sun}
              />
            </div>

            <div className="weather-main">
              <CloudSun size={42} />

              <div>
                <strong>{current.apparent_temperature ?? "—"}°C</strong>
                <span>
                  Feels like · Humidity {current.relative_humidity_2m ?? "—"}%
                </span>
              </div>
            </div>

            <div className="weather-details">
              <div>
                <CloudRain size={17} />
                <span>Current rain</span>
                <strong>{current.rain ?? 0} mm</strong>
              </div>

              <div>
                <Droplet size={17} />
                <span>Precipitation</span>
                <strong>{current.precipitation ?? 0} mm</strong>
              </div>

              <div>
                <Thermometer size={17} />
                <span>Humidity</span>
                <strong>{current.relative_humidity_2m ?? "—"}%</strong>
              </div>
            </div>

            <p className="helper-text">
              Coordinates: {weather.location?.latitude}, {weather.location?.longitude}.
              Weather values are API forecasts, not on-farm sensor readings.
            </p>
          </div>

          <div className="panel">
            <PanelTitle
              title="7-day forecast"
              subtitle="Daily forecast from Open-Meteo"
            />

            <div className="forecast-grid">
              {forecastDates.map((date, index) => (
                <div className="forecast-day" key={date}>
                  <span>{dayLabel(date, index)}</span>
                  <CloudSun />
                  <strong>{maxTemps[index] ?? "—"}°</strong>
                  <small>{minTemps[index] ?? "—"}°</small>
                  <span className="rain-label">
                    {rainChances[index] ?? "—"}% rain
                  </span>
                  <small>ET₀ {et0Values[index] ?? "—"} mm</small>
                </div>
              ))}
            </div>
          </div>

          <div className="panel">
            <PanelTitle
              title="Weather advisory"
              subtitle="Rule-based notice from forecast data"
            />

            <div className="advisory-box">
              <CloudRain />

              <div>
                <strong>
                  {(rainChances[0] ?? 0) > 65
                    ? "Rain lockout threshold reached"
                    : "Review irrigation conditions"}
                </strong>

                <p>
                  {(rainChances[0] ?? 0) > 65
                    ? `Today's maximum rain probability is ${rainChances[0]}%. The planned irrigation rule would block automatic irrigation when rain probability exceeds 65%.`
                    : `Today's maximum rain probability is ${rainChances[0] ?? "unavailable"}%. Check soil moisture and crop demand before irrigation.`}
                </p>
              </div>
            </div>
          </div>
        </>
      )}
    </>
  );
}

/* ================= CROP DOCTOR ================= */



function CropDoctor() {
  const API_URL = "http://127.0.0.1:5000";

  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState("");
  const [diagnosis, setDiagnosis] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [savedImage, setSavedImage] = useState(() =>
    sessionStorage.getItem("crop-image") || ""
  );

  const [savedName, setSavedName] = useState(() =>
    sessionStorage.getItem("crop-image-name") || ""
  );

  const [reportUrl, setReportUrl] = useState("");

  useEffect(() => {
    const savedDiagnosis = sessionStorage.getItem("crop-diagnosis");

    if (savedDiagnosis) {
      try {
        setDiagnosis(JSON.parse(savedDiagnosis));
      } catch {
        sessionStorage.removeItem("crop-diagnosis");
      }
    }

    if (savedImage) {
      setPreview(savedImage);
    }
  }, []);

  function handleImageChange(e) {
    const selected = e.target.files[0];

    if (!selected) return;

    if (!["image/jpeg", "image/png", "image/webp"].includes(selected.type)) {
      setError("Please select a JPG, PNG or WEBP image.");
      return;
    }

    if (selected.size > 8 * 1024 * 1024) {
      setError("Image must be smaller than 8 MB.");
      return;
    }

    const reader = new FileReader();

    reader.onload = () => {
      const imageData = reader.result;

      try {
        sessionStorage.setItem("crop-image", imageData);
        sessionStorage.setItem("crop-image-name", selected.name);
      } catch {
        setError("Image could not be saved for refresh. Please continue without refresh.");
      }

      setSavedImage(imageData);
      setSavedName(selected.name);
      setPreview(imageData);
    };

    reader.readAsDataURL(selected);

    setFile(selected);
    setDiagnosis(null);
    setReportUrl("");
    sessionStorage.removeItem("crop-diagnosis");
    setError("");
  }

  async function analyzeImage() {
    if (!file) return;

    try {
      setLoading(true);
      setError("");
      setDiagnosis(null);
      setReportUrl("");

      const formData = new FormData();
      formData.append("image", file);

      const response = await fetch(
        `${API_URL}/api/crop-doctor/analyze`,
        {
          method: "POST",
          body: formData
        }
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Image analysis failed.");
      }

      setDiagnosis(data.diagnosis);

      sessionStorage.setItem(
        "crop-diagnosis",
        JSON.stringify(data.diagnosis)
      );

    } catch (err) {
      setError(err.message || "Unable to analyze image.");
    } finally {
      setLoading(false);
    }
  }

  function generateReport() {
    if (!diagnosis) return;

    const pdf = new jsPDF();

    pdf.setFont("helvetica", "bold");
    pdf.setFontSize(20);
    pdf.text("AgroPulse AI", 20, 20);

    pdf.setFontSize(15);
    pdf.text("Crop Health Diagnosis Report", 20, 32);

    pdf.setFont("helvetica", "normal");
    pdf.setFontSize(11);

    pdf.text(`Image: ${file?.name || savedName || "Crop image"}`, 20, 45);
    pdf.text(`Date: ${new Date().toLocaleString()}`, 20, 53);

    pdf.setFont("helvetica", "bold");
    pdf.text("Diagnosis Details", 20, 68);

    pdf.setFont("helvetica", "normal");

    const details = [
      `Crop: ${diagnosis.crop || "Unknown"}`,
      `Disease: ${diagnosis.disease || "Unknown"}`,
      `Confidence: ${diagnosis.confidence ?? "N/A"}%`,
      `Severity: ${diagnosis.severity || "Unknown"}`,
      "",
      "Symptoms:",
      diagnosis.symptoms || "Not available",
      "",
      "Recommended Treatment:",
      diagnosis.treatment || "Not available",
      "",
      "Prevention:",
      diagnosis.prevention || "Not available"
    ];

    let y = 80;

    details.forEach((line) => {
      const wrapped = pdf.splitTextToSize(line, 170);

      if (y + wrapped.length * 7 > 270) {
        pdf.addPage();
        y = 20;
      }

      pdf.text(wrapped, 20, y);
      y += wrapped.length * 7;
    });

    pdf.setFontSize(9);
    pdf.text(
      "Disclaimer: AI-generated advisory. Not laboratory-confirmed. Verify with an agricultural expert.",
      20,
      285
    );

    const pdfBlob = pdf.output("blob");
    const url = URL.createObjectURL(pdfBlob);

    setReportUrl((previousUrl) => {
      if (previousUrl) {
        URL.revokeObjectURL(previousUrl);
      }

      return url;
    });
  }

  return (
    <div className="two-column">

      {/* IMAGE UPLOAD SECTION */}
      <div className="panel">
        <PanelTitle
          title="Upload crop image"
          subtitle="Choose a clear image of the affected leaf."
        />

        <label className="upload-area">
          <input
            type="file"
            accept="image/jpeg,image/png,image/webp"
            onChange={handleImageChange}
          />

          {preview ? (
            <img
              src={preview}
              alt="Selected crop leaf"
              style={{
                maxWidth: "100%",
                maxHeight: "250px",
                objectFit: "contain",
                borderRadius: "12px"
              }}
            />
          ) : (
            <>
              <Camera size={34} />
              <strong>Click to upload a crop image</strong>
              <span>PNG, JPG or WEBP</span>
              <small>Use a well-lit close-up image.</small>
            </>
          )}
        </label>

        {(file?.name || savedName) && (
          <p>{file?.name || savedName}</p>
        )}

        <button
          className="primary-button full-button"
          disabled={!file || loading}
          onClick={analyzeImage}
        >
          {loading ? "Analyzing image..." : "Analyze image"}
          <Scan size={17} />
        </button>

        {error && (
          <div className="notice" style={{ marginTop: 15 }}>
            <AlertTriangle size={17} />
            <span>{error}</span>
          </div>
        )}
      </div>

      {/* DIAGNOSIS RESULTS SECTION */}
      <div className="panel">
        <PanelTitle
          title="Diagnosis results"
          subtitle="AI-powered crop image assessment."
        />

        {!diagnosis && !loading && (
          <div className="empty-state">
            <Scan size={38} />
            <strong>No diagnosis yet</strong>
            <p>Upload a crop image and click Analyze image.</p>
          </div>
        )}

        {loading && (
          <div className="empty-state">
            <Activity size={38} />
            <strong>Analyzing crop image...</strong>
            <p>Please wait while Gemini examines the image.</p>
          </div>
        )}

        {diagnosis && (
          <>
            <div className="diagnosis-results">

              <div className="profile-detail">
                <span>Crop</span>
                <strong>{diagnosis.crop || "Unknown"}</strong>
              </div>

              <div className="profile-detail">
                <span>Suspected disease</span>
                <strong>{diagnosis.disease || "Unknown"}</strong>
              </div>

              <div className="profile-detail">
                <span>Confidence</span>
                <strong>{diagnosis.confidence ?? "—"}%</strong>
              </div>

              <div className="profile-detail">
                <span>Severity</span>
                <strong>{diagnosis.severity || "Unknown"}</strong>
              </div>

              <div className="profile-detail">
                <span>Visible symptoms</span>
                <p>{diagnosis.symptoms || "Not available"}</p>
              </div>

              <div className="profile-detail">
                <span>Recommended treatment</span>
                <p>{diagnosis.treatment || "Not available"}</p>
              </div>

              <div className="profile-detail">
                <span>Prevention</span>
                <p>{diagnosis.prevention || "Not available"}</p>
              </div>

            </div>

            {/* PDF REPORT SECTION */}
            <div style={{ marginTop: 25 }}>
              <PanelTitle
                title="Diagnosis Report"
                subtitle="Generate, preview and download your report."
              />

              <button
                className="primary-button"
                onClick={generateReport}
              >
                Generate PDF Preview
              </button>

              {reportUrl && (
                <>
                  <div style={{ marginTop: 20 }}>
                    <iframe
                      src={reportUrl}
                      title="Crop Diagnosis PDF Preview"
                      width="100%"
                      height="550px"
                      style={{
                        border: "1px solid #ddd",
                        borderRadius: "10px"
                      }}
                    />
                  </div>

                  <a
                    href={reportUrl}
                    download="AgroPulse-Crop-Diagnosis-Report.pdf"
                    className="primary-button"
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "8px",
                      marginTop: "15px",
                      textDecoration: "none"
                    }}
                  >
                    <Download size={17} />
                    Download PDF Report
                  </a>
                </>
              )}
            </div>
          </>
        )}

        <div className="notice" style={{ marginTop: 15 }}>
          <AlertTriangle size={17} />
          <span>
            AI diagnosis is advisory, not laboratory-confirmed.
            Verify recommendations with an agricultural expert.
          </span>
        </div>
      </div>
    </div>
  );
}


/* ================= IRRIGATION ================= */

function IrrigationPage() {
  const API_URL = "http://127.0.0.1:5000";

  const [farms, setFarms] = useState([]);
  const [farmId, setFarmId] = useState("");
  const [settings, setSettings] = useState({
    kc: 1.15,
    root_zone_moisture: 31,
    emitter_flow: 2,
    emitter_count: 100,
    efficiency: 0.9
  });

  const [result, setResult] = useState(null);
  const [pump, setPump] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    loadFarms();
  }, []);

  async function loadFarms() {
    try {
      setLoading(true);
      setError("");

      const response = await fetch(`${API_URL}/api/farms`);
      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Unable to load farms");
      }

      setFarms(data.farms);

      if (data.farms.length > 0) {
        setFarmId(String(data.farms[0].id));
        await loadSettings(data.farms[0].id);
      } else {
        setError("No farm found. Add a farm with valid coordinates first.");
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  async function loadSettings(id) {
    try {
      const response = await fetch(
        `${API_URL}/api/irrigation/${id}`
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Unable to load settings");
      }

      setSettings({
        kc: data.settings.kc,
        root_zone_moisture: data.settings.root_zone_moisture,
        emitter_flow: data.settings.emitter_flow,
        emitter_count: data.settings.emitter_count,
        efficiency: data.settings.efficiency
      });

      setPump(Boolean(data.settings.pump_on));

      // Store calculation results for the metric cards
      setResult(data);

    } catch (err) {
      setError(err.message);
    }
  }

  async function changeFarm(id) {
    setFarmId(id);
    setResult(null);
    setError("");
    setPump(false);
    await loadSettings(id);
  }

  async function saveSettings() {
    if (!farmId) return;

    try {
      setSaving(true);
      setError("");

      const response = await fetch(
        `${API_URL}/api/irrigation/${farmId}/settings`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify(settings)
        }
      );

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Unable to save settings");
      }

      await loadSettings(farmId);

    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  }

  async function controlPump(action) {
    if (!farmId) return;

    try {
      setSaving(true);
      setError("");
      setResult(null);

      const response = await fetch(
        `${API_URL}/api/irrigation/${farmId}/control`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({ action })
        }
      );

      const data = await response.json();

      setPump(Boolean(data.pump_on));
      setResult(data);

      if (!response.ok) {
        setError(data.message || "Pump operation was blocked");
      }
    } catch (err) {
      setError("Unable to connect to irrigation backend: " + err.message);
    } finally {
      setSaving(false);
    }
  }

  const updateSetting = (name, value) => {
    setSettings(prev => ({
      ...prev,
      [name]: Number(value)
    }));
  };

  const etc = result?.etc;
  const waterDeficit = result?.water_deficit_mm;
  const runtime = result?.pump_runtime_minutes;

  if (loading) {
    return (
      <div className="panel">
        <p>Loading farm irrigation information...</p>
      </div>
    );
  }

  return (
    <>
      <div className="panel">
        <PanelTitle
          title="Farm selection"
          subtitle="Select the farm for irrigation monitoring."

        />

        {farms.length > 0 && (
          <label>
            Select farm
            <select
              value={farmId}
              onChange={e => changeFarm(e.target.value)}
            >
              {farms.map(farm => (
                <option key={farm.id} value={farm.id}>
                  {farm.farm_name} — {farm.crop_name}
                </option>
              ))}
            </select>
          </label>
        )}

        {error && (
          <div className="notice" style={{ marginTop: 15 }}>
            <AlertTriangle size={18} />
            <span>{error}</span>
          </div>
        )}
      </div>

      {farmId && (
        <>
          <div className="metrics-grid">
            <MetricCard
              title="Root-zone moisture"
              value={settings.root_zone_moisture}
              unit="%"
              change="Configured value"
              icon={Droplets}
            />

            <MetricCard
              title="Crop coefficient"
              value={settings.kc}
              unit=""
              change="Farm setting"
              icon={Leaf}
            />

            <MetricCard
              title="Estimated ETc"
              value={etc !== undefined ? etc : "—"}
              unit="mm/day"
              change="Weather-based estimate"
              icon={Gauge}
            />

            <MetricCard
              title="Water deficit"
              value={waterDeficit !== undefined ? waterDeficit : "—"}
              unit="mm"
              change="ETc minus forecast rainfall"
              icon={Droplet}
            />
          </div>

          <div className="dashboard-grid">
            <div className="panel">
              <PanelTitle
                title="Irrigation settings"
                subtitle="Configure crop and virtual drip system."
              />

              <div className="input-stack">
                <label>
                  Crop coefficient (Kc)
                  <input
                    type="number"
                    min="0.1"
                    max="2"
                    step="0.05"
                    value={settings.kc}
                    onChange={e =>
                      updateSetting("kc", e.target.value)
                    }
                  />
                </label>

                <label>
                  Root-zone moisture (%)
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={settings.root_zone_moisture}
                    onChange={e =>
                      updateSetting(
                        "root_zone_moisture",
                        e.target.value
                      )
                    }
                  />
                </label>

                <label>
                  Emitter flow (litres/hour)
                  <input
                    type="number"
                    min="0.1"
                    step="0.1"
                    value={settings.emitter_flow}
                    onChange={e =>
                      updateSetting("emitter_flow", e.target.value)
                    }
                  />
                </label>

                <label>
                  Number of emitters
                  <input
                    type="number"
                    min="1"
                    value={settings.emitter_count}
                    onChange={e =>
                      updateSetting("emitter_count", e.target.value)
                    }
                  />
                </label>

                <label>
                  Irrigation efficiency (0–1)
                  <input
                    type="number"
                    min="0.1"
                    max="1"
                    step="0.05"
                    value={settings.efficiency}
                    onChange={e =>
                      updateSetting("efficiency", e.target.value)
                    }
                  />
                </label>
              </div>

              <button
                className="primary-button"
                onClick={saveSettings}
                disabled={saving}
              >
                {saving ? "Saving..." : "Save settings"}
              </button>
            </div>

            <div className="panel">
              <PanelTitle
                title="Virtual pump control"
                subtitle="Backend-controlled simulated relay."
                action={
                  <Status type={pump ? "green" : "blue"}>
                    {pump ? "Pump ON" : "Pump OFF"}
                  </Status>
                }
              />

              <div className="pump-control">
                <div className={`pump-orb ${pump ? "pump-on" : ""}`}>
                  <Droplets size={42} />
                </div>

                <strong>{pump ? "Pump ON" : "Pump OFF"}</strong>

                <span>
                  {pump
                    ? "Virtual irrigation is active"
                    : "Virtual pump is in standby"}
                </span>

                <button
                  className={`primary-button ${pump ? "stop-button" : ""}`}
                  disabled={saving}
                  onClick={() =>
                    controlPump(pump ? "OFF" : "ON")
                  }
                >
                  {saving
                    ? "Processing..."
                    : pump
                      ? "Turn pump OFF"
                      : "Request pump ON"}
                </button>
              </div>

              <div className="notice">
                <AlertTriangle size={17} />
                <span>
                  Backend checks rain probability and soil moisture
                  before allowing pump activation.
                </span>
              </div>
            </div>
          </div>

          {result && (
            <div className="panel">
              <PanelTitle
                title="Irrigation calculation result"
                subtitle="Latest backend response"
              />

              {result.message && (
                <div className="notice">
                  {result.lockout
                    ? <AlertTriangle size={18} />
                    : <CheckCircle2 size={18} />}
                  <span>{result.message}</span>
                </div>
              )}

              {result.et0 !== undefined && (
                <>
                  <div className="balance-row">
                    <span>Reference ET₀</span>
                    <strong>{result.et0} mm/day</strong>
                  </div>

                  <div className="balance-row">
                    <span>Crop coefficient</span>
                    <strong>{result.kc}</strong>
                  </div>

                  <div className="balance-row">
                    <span>Crop evapotranspiration (ETc)</span>
                    <strong>{result.etc} mm/day</strong>
                  </div>

                  <div className="balance-row">
                    <span>Rainfall forecast</span>
                    <strong>{result.rainfall} mm</strong>
                  </div>

                  <div className="balance-total">
                    <span>Water deficit</span>
                    <strong>{result.water_deficit_mm} mm</strong>
                  </div>

                  <div className="balance-total">
                    <span>Estimated pump runtime</span>
                    <strong>{result.pump_runtime_minutes} minutes</strong>
                  </div>

                  <div className="balance-row">
                    <span>Rain probability</span>
                    <strong>{result.rain_probability}%</strong>
                  </div>
                </>
              )}
            </div>
          )}
        </>
      )}

      <p className="helper-text">
        Root-zone moisture is a manually configured demo value, not a live
        satellite or physical sensor measurement. The pump is simulated;
        no physical pump is connected.
      </p>
    </>
  );
}

/* ================= SATELLITE ================= */

function SatellitePage() {
  const API_URL = "http://127.0.0.1:5000";

  const [farms, setFarms] = useState([]);
  const [farmId, setFarmId] = useState("");

  const [sentinelData, setSentinelData] = useState(null);
  const [smapData, setSmapData] = useState(null);

  const [loadingFarms, setLoadingFarms] = useState(true);
  const [loading, setLoading] = useState(false);

  const [error, setError] = useState("");

  const selectedFarm = farms.find(
    farm => String(farm.id) === String(farmId)
  );

  useEffect(() => {
    loadFarms();
  }, []);

  async function loadFarms() {
    try {
      setLoadingFarms(true);
      setError("");

      const response = await fetch(`${API_URL}/api/farms`);
      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(data.message || "Unable to load farms.");
      }

      setFarms(data.farms);

      if (data.farms.length > 0) {
        setFarmId(String(data.farms[0].id));
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoadingFarms(false);
    }
  }

  async function searchSatelliteData() {
    if (!selectedFarm) {
      setError("Please select a farm.");
      return;
    }

    const latitude = selectedFarm.latitude;
    const longitude = selectedFarm.longitude;

    if (latitude == null || longitude == null) {
      setError(
        "This farm does not have GPS coordinates. Update its farm details first."
      );
      return;
    }

    setLoading(true);
    setError("");
    setSentinelData(null);
    setSmapData(null);

    try {
      const [sentinelResponse, smapResponse] = await Promise.all([
        fetch(
          `${API_URL}/api/satellite/sentinel2?latitude=${latitude}&longitude=${longitude}`
        ),
        fetch(
          `${API_URL}/api/satellite/smap?latitude=${latitude}&longitude=${longitude}`
        )
      ]);

      const sentinel = await sentinelResponse.json();
      const smap = await smapResponse.json();

      if (!sentinelResponse.ok || !sentinel.success) {
        throw new Error(
          sentinel.message || "Sentinel-2 search failed."
        );
      }

      if (!smapResponse.ok || !smap.success) {
        throw new Error(
          smap.message || "NASA SMAP search failed."
        );
      }

      setSentinelData(sentinel);
      setSmapData(smap);

    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="dashboard-grid">

      {/* FARM SELECTION */}

      <div className="panel large-panel">
        <PanelTitle
          title="Satellite Monitoring"
          subtitle="Search satellite products using saved farm coordinates."
          action={<Status type="blue">Satellite APIs</Status>}
        />

        {loadingFarms ? (
          <p>Loading farms...</p>
        ) : farms.length === 0 ? (
          <div className="notice">
            <AlertTriangle size={17} />
            <span>No farms found. Add a farm first.</span>
          </div>
        ) : (
          <>
            <label>
              Select farm

              <select
                value={farmId}
                onChange={e => {
                  setFarmId(e.target.value);
                  setSentinelData(null);
                  setSmapData(null);
                  setError("");
                }}
              >
                {farms.map(farm => (
                  <option key={farm.id} value={farm.id}>
                    {farm.farm_name} — {farm.crop_name}
                  </option>
                ))}
              </select>
            </label>

            {selectedFarm && (
              <div className="notice" style={{ marginTop: 15 }}>
                <MapPin size={17} />

                <span>
                  Latitude: {selectedFarm.latitude ?? "Not available"}
                  {" | "}
                  Longitude: {selectedFarm.longitude ?? "Not available"}
                </span>
              </div>
            )}

            <button
              className="primary-button"
              style={{ marginTop: 18 }}
              onClick={searchSatelliteData}
              disabled={loading}
            >
              <RefreshCw size={16} />
              {loading ? "Searching satellite data..." : "Search Satellite Data"}
            </button>
          </>
        )}

        {error && (
          <div className="notice" style={{ marginTop: 15 }}>
            <AlertTriangle size={17} />
            <span>{error}</span>
          </div>
        )}
      </div>

      {/* SENTINEL-2 */}

      <div className="panel">
        <PanelTitle
          title="Sentinel-2"
          subtitle="ESA multispectral satellite catalogue"
          action={<Status type="blue">Copernicus</Status>}
        />

        <div className="source-item">
          <Satellite size={22} />

          <div>
            <strong>Sentinel-2 Level-2A</strong>
            <span>10 m resolution for selected bands</span>
          </div>
        </div>

        {sentinelData && (
          <>
            <div className="metric-card">
              <span>Products found</span>
              <strong>{sentinelData.products_found}</strong>
            </div>

            {sentinelData.products?.length > 0 ? (
              sentinelData.products.map((product, index) => (
                <div
                  className="source-item"
                  key={product.id || index}
                >
                  <Satellite size={20} />

                  <div>
                    <strong>{product.name}</strong>

                    <span>
                      Date: {product.date
                        ? new Date(product.date).toLocaleString()
                        : "Not available"}
                    </span>

                    <span>
                      Processing: {product.processing_level}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <p>No Sentinel-2 products found for this location.</p>
            )}
          </>
        )}

        <p className="chart-footnote">
          Catalogue metadata only. Actual imagery and NDVI values
          have not been downloaded or calculated.
        </p>
      </div>

      {/* NASA SMAP */}

      <div className="panel">
        <PanelTitle
          title="NASA SMAP"
          subtitle="Soil moisture satellite catalogue"
          action={<Status type="blue">NASA</Status>}
        />

        <div className="source-item">
          <Droplets size={22} />

          <div>
            <strong>SMAP SPL3SMP</strong>
            <span>Satellite soil moisture observations</span>
          </div>
        </div>

        {smapData && (
          <>
            <div className="metric-card">
              <span>Products found</span>
              <strong>{smapData.products_found}</strong>
            </div>

            {smapData.products?.length > 0 ? (
              smapData.products.map((product, index) => (
                <div
                  className="source-item"
                  key={product.id || index}
                >
                  <Droplets size={20} />

                  <div>
                    <strong>{product.title}</strong>

                    <span>
                      Date: {product.date
                        ? new Date(product.date).toLocaleString()
                        : "Not available"}
                    </span>
                  </div>
                </div>
              ))
            ) : (
              <p>No SMAP products found for this location.</p>
            )}
          </>
        )}

        <div className="notice">
          <AlertTriangle size={17} />

          <span>
            {smapData?.resolution_note ||
              "SMAP has coarse spatial resolution. It is not a 10 m farm measurement."}
          </span>
        </div>
      </div>

    </div>
  );
}

/* ================= CROP HEALTH ================= */

function HealthPage() {
  return (
    <div className="dashboard-grid">
      <div className="panel large-panel">
        <PanelTitle
          title="Crop health history"
          subtitle="Illustrative health index records"
        />

        <div className="history-list">
          {[["Week 1", 62], ["Week 2", 68], ["Week 3", 71], ["Week 4", 77], ["Week 5", 82]].map(([week, value]) => (
            <div className="history-row" key={week}>
              <span>{week}</span>

              <div className="progress-track">
                <div style={{ width: `${value}%` }} />
              </div>

              <strong>{value}/100</strong>
            </div>
          ))}
        </div>
      </div>

      <div className="panel">
        <PanelTitle
          title="Crop profile"
          subtitle="Example crop record"
        />

        <div className="profile-detail">
          <span>Crop</span>
          <strong>Tomato</strong>
        </div>

        <div className="profile-detail">
          <span>Variety</span>
          <strong>Arka Rakshak</strong>
        </div>

        <div className="profile-detail">
          <span>Growth stage</span>
          <strong>Flowering</strong>
        </div>

        <div className="profile-detail">
          <span>Data status</span>
          <Status type="blue">Sample data</Status>
        </div>
      </div>
    </div>
  );
}

/* ================= FARMING CALENDAR ================= */

function CalendarPage() {
  const events = [
    ["Today", "Inspect leaves for pest symptoms", "Crop monitoring"],
    ["Tomorrow", "Review irrigation requirement", "Irrigation"],
    ["12 Nov", "Check soil nutrient test", "Soil health"],
    ["15 Nov", "Review crop growth progress", "Crop monitoring"]
  ];

  return (
    <div className="panel">
      <PanelTitle
        title="Farm activity calendar"
        subtitle="Example schedule — edit dates for your crop cycle."
        action={
          <button
            className="secondary-button"
            onClick={() => alert("Task creation will be connected next.")}
          >
            <Plus size={15} /> Add task
          </button>
        }
      />

      <div className="calendar-list">
        {events.map(([date, title, category]) => (
          <div className="calendar-event" key={title}>
            <div className="event-date">{date}</div>

            <div className="event-info">
              <strong>{title}</strong>
              <span>{category}</span>
            </div>

            <Status type="green">Planned</Status>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ================= CHATBOT ================= */

function ChatbotPage({ language, t }) {
  const [message, setMessage] = useState("");

  const [messages, setMessages] = useState([
    {
      from: "bot",
      text: "Namaste! I'm your AgroPulse farm assistant. Ask me about irrigation, crop care or farm planning."
    }
  ]);

  const [listening, setListening] = useState(false);
  const [voiceError, setVoiceError] = useState("");

  function startListening() {
    const SpeechRecognition =
      window.SpeechRecognition ||
      window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setVoiceError(
        "Speech recognition is not supported in this browser. Try Chrome."
      );
      return;
    }

    const recognition = new SpeechRecognition();

    recognition.lang = language;
    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.onstart = () => {
      setListening(true);
      setVoiceError("");
    };

    recognition.onresult = (event) => {
      const spokenText = event.results[0][0].transcript;
      setMessage(spokenText);
    };

    recognition.onerror = () => {
      setVoiceError("Could not recognize your voice. Please try again.");
      setListening(false);
    };

    recognition.onend = () => {
      setListening(false);
    };

    recognition.start();
  }

  function speakText(text) {
    if (!("speechSynthesis" in window)) {
      setVoiceError("Speech output is not supported in this browser.");
      return;
    }

    window.speechSynthesis.cancel();

    const speech = new SpeechSynthesisUtterance(text);
    speech.lang = language;
    speech.rate = 0.9;

    window.speechSynthesis.speak(speech);
  }

  function sendMessage() {
    if (!message.trim()) return;

    const userMessage = message.trim();

    const reply =
      "Your message has been added to this demo conversation. Connect the Gemini API for real farm-specific answers.";

    setMessages((previous) => [
      ...previous,
      { from: "user", text: userMessage },
      { from: "bot", text: reply }
    ]);

    setMessage("");

    speakText(reply);
  }

  return (
    <div className="panel chat-panel">
      <PanelTitle
        title={t.chat}
        subtitle="Voice-enabled farm assistant · Demo mode"
        action={<Status type="blue">{t.demo}</Status>}
      />

      <div className="chat-messages">
        {messages.map((m, i) => (
          <div className={`chat-message ${m.from}`} key={i}>
            <div className="chat-avatar">
              {m.from === "bot" ? <Sprout size={17} /> : "You"}
            </div>

            <p>{m.text}</p>

            {m.from === "bot" && (
              <button
                className="voice-small-button"
                onClick={() => speakText(m.text)}
                aria-label={t.speak}
                title={t.speak}
              >
                <Volume2 size={17} />
              </button>
            )}
          </div>
        ))}
      </div>

      <div className="chat-input">
        <input
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          placeholder={t.chatPlaceholder}
        />

        <button
          className="secondary-button voice-button"
          onClick={startListening}
          disabled={listening}
          title={listening ? t.stop : t.listen}
        >
          <Mic size={18} />
        </button>

        <button
          className="primary-button"
          onClick={sendMessage}
          aria-label="Send message"
        >
          <Send size={17} />
        </button>
      </div>

      {listening && (
        <p className="voice-status">
          <Mic size={15} /> {t.listen}...
        </p>
      )}

      {voiceError && (
        <div className="notice">
          <AlertTriangle size={17} />
          <span>{voiceError}</span>
        </div>
      )}

      <p className="helper-text">
        Voice support depends on browser and installed language voices.
        Chat responses are currently demonstrations, not actual AI advice.
      </p>
    </div>
  );
}

/* ================= PROFIT CALCULATOR ================= */

function ProfitPage() {
  const [area, setArea] = useState(2);
  const [yieldPerAcre, setYieldPerAcre] = useState(12);
  const [price, setPrice] = useState(1800);
  const [cost, setCost] = useState(12000);

  const revenue = area * yieldPerAcre * price;
  const totalCost = area * cost;
  const profit = revenue - totalCost;

  return (
    <div className="dashboard-grid">
      <div className="panel">
        <PanelTitle
          title="Farm profit calculator"
          subtitle="Enter your own estimates."
        />

        <div className="input-stack">
          <label>
            Farm area (acres)
            <input
              type="number"
              min="0"
              value={area}
              onChange={e => setArea(Math.max(0, Number(e.target.value)))}
            />
          </label>

          <label>
            Expected yield (quintals/acre)
            <input
              type="number"
              min="0"
              value={yieldPerAcre}
              onChange={e => setYieldPerAcre(Math.max(0, Number(e.target.value)))}
            />
          </label>

          <label>
            Price per quintal (₹)
            <input
              type="number"
              min="0"
              value={price}
              onChange={e => setPrice(Math.max(0, Number(e.target.value)))}
            />
          </label>

          <label>
            Input cost per acre (₹)
            <input
              type="number"
              min="0"
              value={cost}
              onChange={e => setCost(Math.max(0, Number(e.target.value)))}
            />
          </label>
        </div>
      </div>

      <div className="panel">
        <PanelTitle
          title="Estimated financial summary"
          subtitle="Calculated from your inputs"
        />

        <div className="finance-result">
          <span>Estimated revenue</span>
          <strong>₹{revenue.toLocaleString("en-IN")}</strong>
        </div>

        <div className="finance-result">
          <span>Total input cost</span>
          <strong>₹{totalCost.toLocaleString("en-IN")}</strong>
        </div>

        <div className="finance-total">
          <span>Estimated profit</span>
          <strong className={profit >= 0 ? "profit-positive" : "profit-negative"}>
            ₹{profit.toLocaleString("en-IN")}
          </strong>
        </div>

        <div className="notice">
          <IndianRupee size={17} />
          <span>
            Illustrative estimate only. Actual prices, yield and costs may differ.
          </span>
        </div>
      </div>
    </div>
  );
}

/* ================= YIELD PREDICTOR ================= */

function YieldPage() {
  const [area, setArea] = useState(2);
  const [yieldValue, setYieldValue] = useState(12);

  return (
    <div className="dashboard-grid">
      <div className="panel">
        <PanelTitle
          title="Yield estimate inputs"
          subtitle="Enter a baseline yield estimate."
        />

        <div className="input-stack">
          <label>
            Crop
            <select defaultValue="tomato">
              <option value="tomato">Tomato</option>
              <option>Maize</option>
              <option>Rice</option>
              <option>Chilli</option>
            </select>
          </label>

          <label>
            Farm area (acres)
            <input
              type="number"
              min="0"
              value={area}
              onChange={e => setArea(Math.max(0, Number(e.target.value)))}
            />
          </label>

          <label>
            Baseline yield (quintals/acre)
            <input
              type="number"
              min="0"
              value={yieldValue}
              onChange={e => setYieldValue(Math.max(0, Number(e.target.value)))}
            />
          </label>
        </div>
      </div>

      <div className="panel yield-result">
        <TrendingUp size={35} />
        <span>Baseline yield estimate</span>

        <strong>
          {(area * yieldValue).toFixed(1)} <small>quintals</small>
        </strong>

        <p>Based only on the values entered. This is not an AI prediction.</p>

        <div className="notice">
          <AlertTriangle size={17} />
          <span>
            Connect historical yield data, crop area and regional datasets before presenting a predictive result.
          </span>
        </div>
      </div>
    </div>
  );
}

/* ================= SECTION ROUTER ================= */

/* ================= NUTRIENT ADVISOR ================= */

function NutrientPage() {
  const [crop, setCrop] = useState("Tomato");
  const [area, setArea] = useState("1");
  const [nitrogen, setNitrogen] = useState("Low");
  const [phosphorus, setPhosphorus] = useState("Medium");
  const [potassium, setPotassium] = useState("Low");

  const [result, setResult] = useState(false);

  function getRecommendation() {
    setResult(true);
  }

  return (
    <div className="page-content">
      <div className="page-header">
        <div>
          <h1>Nutrient Advisor</h1>
          <p>Get basic fertilizer guidance for your crop.</p>
        </div>
      </div>

      <div className="panel">
        <h2>Farm Details</h2>

        <div className="form-group">
          <label>Crop</label>
          <select
            value={crop}
            onChange={(e) => setCrop(e.target.value)}
          >
            <option>Tomato</option>
            <option>Rice</option>
            <option>Wheat</option>
            <option>Maize</option>
            <option>Groundnut</option>
            <option>Chilli</option>
          </select>
        </div>

        <div className="form-group">
          <label>Farm Area (acres)</label>
          <input
            type="number"
            min="0.1"
            value={area}
            onChange={(e) => setArea(e.target.value)}
          />
        </div>

        <h2>Soil Nutrient Levels</h2>

        <div className="form-group">
          <label>Nitrogen (N)</label>
          <select
            value={nitrogen}
            onChange={(e) => setNitrogen(e.target.value)}
          >
            <option>Low</option>
            <option>Medium</option>
            <option>High</option>
          </select>
        </div>

        <div className="form-group">
          <label>Phosphorus (P)</label>
          <select
            value={phosphorus}
            onChange={(e) => setPhosphorus(e.target.value)}
          >
            <option>Low</option>
            <option>Medium</option>
            <option>High</option>
          </select>
        </div>

        <div className="form-group">
          <label>Potassium (K)</label>
          <select
            value={potassium}
            onChange={(e) => setPotassium(e.target.value)}
          >
            <option>Low</option>
            <option>Medium</option>
            <option>High</option>
          </select>
        </div>

        <button
          className="primary-btn"
          onClick={getRecommendation}
          disabled={!area || Number(area) <= 0}
        >
          Get Nutrient Guidance
        </button>
      </div>

      {result && (
        <div className="panel">
          <h2>Soil Nutrient Summary</h2>

          <p><strong>Crop:</strong> {crop}</p>
          <p><strong>Farm Area:</strong> {area} acres</p>
          <p><strong>Nitrogen:</strong> {nitrogen}</p>
          <p><strong>Phosphorus:</strong> {phosphorus}</p>
          <p><strong>Potassium:</strong> {potassium}</p>

          <p>
            Your selected nutrient levels have been recorded.
            Use a laboratory soil test and crop-specific
            recommendations before applying fertilizer.
          </p>
        </div>
      )}
    </div>
  );
}

function SectionContent({ active, setActive, mode, language, t }) {
  switch (active) {
    case "Dashboard":
      return (
        <Dashboard
          setActive={setActive}
          mode={mode}
          t={t}
        />
      );

    case "Weather":
      return <WeatherPage />;

    case "Crop Doctor":
      return <CropDoctor />;

    case "Smart Irrigation":
      return <IrrigationPage />;

    case "Satellite Monitoring":
      return <SatellitePage />;

    case "Nutrient Advisor":
      return <NutrientPage />;

    case "Crop Health Tracker":
      return <HealthPage />;

    case "Farming Calendar":
      return <CalendarPage />;

    case "Farmer Chatbot":
      return (
        <ChatbotPage
          language={language}
          t={t}
        />
      );

    case "Profit Calculator":
      return <ProfitPage />;

    case "Yield Predictor":
      return <YieldPage />;

    default:
      return (
        <div className="panel">
          <BarChart3 />
          <p>Section not found.</p>
        </div>
      );
  }
}

/* ================= MAIN APP ================= */

export default function App() {
  const [user, setUser] = useState(() => {
    try {
      const saved = localStorage.getItem("agropulse-user");
      return saved ? JSON.parse(saved) : null;
    } catch {
      localStorage.removeItem("agropulse-user");
      return null;
    }
  });

  const [active, setActive] = useState(() => {
    return localStorage.getItem("agropulse-active-page") || "Dashboard";
  });

  const [languageKey, setLanguageKey] = useState(
    () => localStorage.getItem("agropulse-language") || "en"
  );

  const [mode, setMode] = useState(
    () => localStorage.getItem("agropulse-mode") || "farmer"
  );

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [search, setSearch] = useState("");

  const selectedLanguage =
    languageOptions.find((item) => item.key === languageKey) ||
    languageOptions[0];

  const language = selectedLanguage.code;
  const t = translations[languageKey] || translations.en;

  useEffect(() => {
    localStorage.setItem("agropulse-active-page", active);
  }, [active]);

  useEffect(() => {
    localStorage.setItem("agropulse-language", languageKey);
  }, [languageKey]);

  useEffect(() => {
    localStorage.setItem("agropulse-mode", mode);
  }, [mode]);

  function handleLogin(userData) {
    localStorage.setItem("agropulse-user", JSON.stringify(userData));
    setUser(userData);
  }

  function handleLogout() {
    localStorage.removeItem("agropulse-user");
    localStorage.removeItem("agropulse-active-page");

    setUser(null);
    setActive("Dashboard");
  }

  if (!user) {
    return <Login onLogin={handleLogin} />;
  }

  const filteredNavigation = navigation.filter((item) =>
    item.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className={`app-shell ${mode === "farmer" ? "farmer-mode" : "technical-mode"}`}>

      {sidebarOpen && (
        <div
          className="mobile-overlay"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      <aside className={`sidebar ${sidebarOpen ? "sidebar-open" : ""}`}>

        <div className="brand">
          <div className="brand-icon">
            <Sprout size={25} />
          </div>

          <div>
            <strong>AgroPulse<span>AI</span></strong>
            <small>PRECISION AGRICULTURE</small>
          </div>

          <button
            className="close-sidebar"
            onClick={() => setSidebarOpen(false)}
            aria-label="Close menu"
          >
            <X />
          </button>
        </div>

        <div className="farm-switcher">
          <div className="farm-avatar">
            <Leaf size={19} />
          </div>

          <div>
            <strong>My Demo Farm</strong>
            <span>Farm workspace</span>
          </div>

          <ChevronDown size={16} />
        </div>

        <div className="nav-label">{t.workspace}</div>

        <div className="sidebar-search">
          <Search size={15} />

          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={t.search}
            aria-label={t.search}
          />
        </div>

        <nav className="side-navigation">
          {filteredNavigation.map((item) => {
            const Icon = item.icon;

            return (
              <button
                key={item.name}
                className={`nav-item ${active === item.name ? "active" : ""}`}
                onClick={() => {
                  setActive(item.name);
                  setSidebarOpen(false);
                }}
              >
                <Icon size={18} />
                <span>
                  {item.name === "Dashboard" ? t.dashboard : item.name}
                </span>
                {active === item.name && <i />}
              </button>
            );
          })}
        </nav>

        <div className="sidebar-bottom">

          <button className="nav-item">
            <CircleHelp size={18} />
            <span>{t.help}</span>
          </button>

          <button className="nav-item">
            <Settings size={18} />
            <span>{t.settings}</span>
          </button>

          <div className="user-profile">
            <div className="user-avatar">
              {(user.name || "F").charAt(0).toUpperCase()}
            </div>

            <div>
              <strong>{user.name || "Farm User"}</strong>
              <span>{user.email}</span>
            </div>

            <button
              className="logout-button"
              title={t.logout}
              aria-label={t.logout}
              onClick={handleLogout}
            >
              <LogOut size={17} />
            </button>
          </div>
        </div>
      </aside>

      <main className="main-area">

        <header className="topbar">

          <div className="topbar-left">
            <button
              className="menu-button"
              onClick={() => setSidebarOpen(true)}
              aria-label="Open menu"
            >
              <Menu size={22} />
            </button>

            <div className="breadcrumb">
              Workspace <span>/</span>
              <strong>
                {active === "Dashboard" ? t.dashboard : active}
              </strong>
            </div>
          </div>

          <div className="topbar-right accessibility-controls">

            <label className="accessibility-select">
              <Languages size={16} />

              <select
                value={languageKey}
                onChange={(e) => setLanguageKey(e.target.value)}
                aria-label={t.language}
              >
                {languageOptions.map((item) => (
                  <option key={item.key} value={item.key}>
                    {item.label}
                  </option>
                ))}
              </select>
            </label>

            <div className="mode-switch">
              <button
                className={mode === "farmer" ? "selected" : ""}
                onClick={() => setMode("farmer")}
              >
                <Sprout size={15} />
                {t.farmerMode}
              </button>

              <button
                className={mode === "technical" ? "selected" : ""}
                onClick={() => setMode("technical")}
              >
                <Gauge size={15} />
                {t.technicalMode}
              </button>
            </div>

            <div className="top-date">
              <Sun size={16} />
              AgroPulse AI
            </div>

          </div>
        </header>

        <div className="page-content">

          <div className="page-heading">
            <div>
              <span className="eyebrow">
                AGROPULSE AI / FARM MANAGEMENT
              </span>

              <h1>
                {active === "Dashboard" ? t.dashboard : active}
              </h1>

              <p>
                {active === "Dashboard"
                  ? t.welcomeText
                  : descriptions[active]}
              </p>
            </div>

            <div className="page-heading-actions">
              <button
                className="secondary-button"
                onClick={() => window.location.reload()}
              >
                <RefreshCw size={18} />
                {t.refresh}
              </button>
            </div>
          </div>

          <SectionContent
            active={active}
            setActive={setActive}
            mode={mode}
            language={language}
            t={t}
          />

          <footer className="app-footer">
            <span>© 2026 AgroPulse AI</span>
            <span>
              Sensorless precision agriculture · {mode} mode
            </span>
          </footer>
        </div>
      </main>
    </div>
  );
}