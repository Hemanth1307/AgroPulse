import React, { useState, useEffect } from 'react';
import { 
  Sprout, Cpu, CloudSun, MessageSquare, FlaskConical, 
  TrendingUp, Globe, Activity, Calendar, DollarSign, 
  Upload, MapPin, Send, CheckCircle2, AlertTriangle, 
  RefreshCw, Layers, Droplets, Thermometer, Wind, 
  Zap, ShieldCheck, Navigation, Sparkles, ChevronRight, 
  Play, Pause, Compass, ArrowUpRight, Check, BarChart3,
  Sun, CloudRain, Award
} from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState('irrigation');
  const [gpsCoords, setGpsCoords] = useState({ 
    lat: 13.1986, 
    lon: 77.7066, 
    label: 'Devanahalli Agro Zone, Bengaluru Rural' 
  });
  const [isLocating, setIsLocating] = useState(false);
  const [cropType, setCropType] = useState('Tomato (Arka Rakshak)');
  const [farmArea, setFarmArea] = useState(3.0);
  const [pumpRunning, setPumpRunning] = useState(false);
  const [pumpTimer, setPumpTimer] = useState(0);

  // Live Simulated Satellite & IoT Sensor Feed
  const [telemetry, setTelemetry] = useState({
    surfaceMoisture: 31.8,
    rootMoisture: 34.6,
    soilTemp: 24.2,
    et0: 4.8,
    ndvi: 0.81,
    waterSaved: 16420,
    solarIrradiance: 840,
    humidity: 58
  });

  // Real-time ticking simulation
  useEffect(() => {
    const interval = setInterval(() => {
      setTelemetry(prev => ({
        ...prev,
        surfaceMoisture: +(prev.surfaceMoisture + (Math.random() * 0.4 - 0.2)).toFixed(1),
        rootMoisture: +(prev.rootMoisture + (Math.random() * 0.2 - 0.1)).toFixed(1),
        soilTemp: +(prev.soilTemp + (Math.random() * 0.2 - 0.1)).toFixed(1),
        waterSaved: prev.waterSaved + (pumpRunning ? 0 : 2)
      }));
    }, 2500);
    return () => clearInterval(interval);
  }, [pumpRunning]);

  // Pump countdown timer simulation
  useEffect(() => {
    let timer;
    if (pumpRunning) {
      timer = setInterval(() => {
        setPumpTimer(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [pumpRunning]);

  const detectLiveGPS = () => {
    setIsLocating(true);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setGpsCoords({
            lat: +pos.coords.latitude.toFixed(4),
            lon: +pos.coords.longitude.toFixed(4),
            label: 'Live Geo-Pinpoint (Karnataka Field Grid)'
          });
          setIsLocating(false);
        },
        () => {
          setGpsCoords({ lat: 13.1155, lon: 77.6070, label: 'Yelahanka Precision Plot, Bengaluru' });
          setIsLocating(false);
        }
      );
    } else {
      setIsLocating(false);
    }
  };

  // Module 1: AI Crop Doctor State
  const [selectedImage, setSelectedImage] = useState(null);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [isScanning, setIsScanning] = useState(false);

  const sampleLeafUrl = 'https://images.unsplash.com/photo-1592841200221-a6898f307baa?auto=format&fit=crop&w=800&q=80';

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedImage(URL.createObjectURL(file));
      setAnalysisResult(null);
    }
  };

  const triggerDiagnosis = () => {
    if (!selectedImage) return;
    setIsScanning(true);
    setTimeout(() => {
      setIsScanning(false);
      setAnalysisResult({
        disease: 'Early Blight (Alternaria solani) Detected',
        severity: 'Moderate Stress (14.2% Foliage Surface)',
        confidence: '98.6%',
        irrigationProtocol: 'Shift exclusively to sub-surface root-drip. Cease overhead sprinkling immediately to arrest fungal spore dispersal.',
        treatment: 'Apply Copper Oxychloride (2.5 g/L) or cold-pressed Neem bio-fungicide before dusk.',
        nutrientIntervention: 'Potassium (K) foliar feed recommended to fortify plant cell walls against mycelium penetration.'
      });
    }, 1400);
  };

  // Module 5: Nutrient Advisor State
  const [npkValues, setNpkValues] = useState({ n: 142, p: 29, k: 195, ph: 6.5 });

  // Module 9: Farming Calendar State
  const [calendarTasks, setCalendarTasks] = useState([
    { id: 1, date: 'Today (Nov 14)', title: 'Root-Zone Drip Cycle — 22 Mins @ 06:00', tag: 'Smart Irrigation', completed: true },
    { id: 2, date: 'Nov 16, 2026', title: 'Bio-Fungicide Foliar Spray (Post-Pruning)', tag: 'Pathology', completed: false },
    { id: 3, date: 'Nov 18, 2026', title: 'Rain Lockout: 18mm Pre-Monsoon Showers', tag: 'Climate Alert', completed: false },
    { id: 4, date: 'Nov 24, 2026', title: 'Multispectral Sentinel-2 NDVI Re-Survey', tag: 'Satellite', completed: false },
    { id: 5, date: 'Dec 05, 2026', title: 'Stage 3 Fertigation Flush (SOP 0:0:50)', tag: 'Nutrients', completed: false },
  ]);

  // Module 10: Financial ROI State
  const [financeInputs, setFinanceInputs] = useState({
    seeds: 9500,
    nutrients: 15500,
    labor: 21000,
    mandiPricePerTon: 13800
  });

  // Module 4: Chatbot State
  const [chatOpen, setChatOpen] = useState(false);
  const [language, setLanguage] = useState('EN');
  const [messages, setMessages] = useState([
    {
      sender: 'bot',
      text: 'Namaste! Connected to Sentinel-2, NASA SMAP & Open-Meteo for Devanahalli Rural Grid. Root-zone soil moisture is 34.6%. How can I assist your crop today?'
    }
  ]);
  const [inputText, setInputText] = useState('');

  const sendFarmerChat = (e) => {
    e?.preventDefault();
    if (!inputText.trim()) return;
    const userQuery = inputText;
    setMessages(prev => [...prev, { sender: 'user', text: userQuery }]);
    setInputText('');

    setTimeout(() => {
      const q = userQuery.toLowerCase();
      let botAnswer = '';
      if (language === 'KN') {
        botAnswer = `ನಮಸ್ಕಾರ! ನಿಮ್ಮ ಜಮೀನಿನ (${gpsCoords.lat}°N) ಮಣ್ಣಿನ ತೇವಾಂಶ ${telemetry.rootMoisture}% ಇದೆ. ಮುಂಬರುವ 24 ಗಂಟೆಗಳಲ್ಲಿ 85% ಮಳೆಯಾಗುವ ಮುನ್ಸೂಚನೆ ಇರುವುದರಿಂದ, ಇಂದು ಮೋಟಾರ್ ಆನ್ ಮಾಡುವ ಅಗತ್ಯವಿಲ್ಲ.`;
      } else if (q.includes('water') || q.includes('pump') || q.includes('motor') || q.includes('irrigation')) {
        botAnswer = `Live Satellite Telemetry indicates Root-Zone Soil Moisture at ${telemetry.rootMoisture}% and Evapotranspiration (ET0) at ${telemetry.et0} mm/day. Recommended Run: 22 minutes via Sector A drip at 06:00 AM. 420 Liters conserved compared to baseline.`;
      } else if (q.includes('disease') || q.includes('leaf') || q.includes('spot') || q.includes('blight')) {
        botAnswer = `Pathology Engine recommends: Early Blight spots thrive under leaf wetness. Keep foliage completely dry using ground drippers, and spray Copper Oxychloride (2.5 g/L) at sunset.`;
      } else if (q.includes('nutrient') || q.includes('npk') || q.includes('fertilizer')) {
        botAnswer = `Soil test shows Phosphorus at ${npkValues.p} ppm (sub-optimal). For ${cropType}, add 15 kg/acre DAP or Bone Meal during tomorrow's fertigation window.`;
      } else {
        botAnswer = `For ${farmArea} Acres of ${cropType}: Soil moisture is ${telemetry.rootMoisture}%, NDVI vigor index is ${telemetry.ndvi} (High biomass), and estimated market output is ${(farmArea * 11.6).toFixed(1)} Tons.`;
      }
      setMessages(prev => [...prev, { sender: 'bot', text: botAnswer }]);
    }, 600);
  };

  const navModules = [
    { id: 'irrigation', num: '02', name: 'Smart Irrigation', subtitle: 'Sensorless ET0 & Virtual Relay', icon: Droplets, color: 'text-emerald-400' },
    { id: 'doctor', num: '01', name: 'AI Crop Doctor', subtitle: 'Gemini Vision Pathology', icon: Activity, color: 'text-rose-400' },
    { id: 'weather', num: '03', name: 'Weather Forecast', subtitle: 'Hyper-Local Rain & Climate', icon: CloudSun, color: 'text-amber-400' },
    { id: 'nutrients', num: '05', name: 'Nutrient Advisor', subtitle: 'NPK Dosage & Soil pH', icon: FlaskConical, color: 'text-cyan-400' },
    { id: 'yield', num: '06', name: 'Yield Predictor', subtitle: 'Biomass & Harvest AI', icon: TrendingUp, color: 'text-indigo-400' },
    { id: 'satellite', num: '07', name: 'Satellite Monitoring', subtitle: 'Sentinel-2 NDVI Matrix', icon: Globe, color: 'text-teal-400' },
    { id: 'health', num: '08', name: 'Crop Health Tracker', subtitle: 'Multi-Week Recovery Curve', icon: Layers, color: 'text-violet-400' },
    { id: 'calendar', num: '09', name: 'Farming Calendar', subtitle: 'Growth Stage Milestones', icon: Calendar, color: 'text-sky-400' },
    { id: 'profit', num: '10', name: 'Profit Calculator', subtitle: 'APMC Ledger & Net Margin', icon: DollarSign, color: 'text-emerald-400' },
  ];

  const estimatedYieldTons = +(farmArea * 11.6).toFixed(1);
  const totalCost = financeInputs.seeds + financeInputs.nutrients + financeInputs.labor;
  const grossIncome = Math.round(estimatedYieldTons * financeInputs.mandiPricePerTon);
  const netProfit = grossIncome - totalCost;

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100 overflow-x-hidden selection:bg-emerald-500 selection:text-slate-950">
      
      {/* GLOWING AMBIENT TOP LIGHT */}
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-3/4 h-32 bg-emerald-500/10 blur-[120px] pointer-events-none rounded-full z-0"></div>

      {/* TOP COMMAND HEADER */}
      <header className="sticky top-0 z-50 glass-card border-b border-slate-800/80 px-6 py-3.5 flex flex-wrap items-center justify-between gap-4">
        
        {/* Brand identity */}
        <div className="flex items-center space-x-3.5">
          <div className="relative">
            <div className="h-10 w-10 rounded-2xl bg-gradient-to-tr from-emerald-600 to-teal-400 flex items-center justify-center text-slate-950 font-bold shadow-lg shadow-emerald-500/25">
              <Sprout className="h-6 w-6 text-slate-950" />
            </div>
            <span className="absolute -bottom-1 -right-1 h-3.5 w-3.5 rounded-full bg-emerald-400 border-2 border-slate-950 animate-ping"></span>
            <span className="absolute -bottom-1 -right-1 h-3.5 w-3.5 rounded-full bg-emerald-400 border-2 border-slate-950"></span>
          </div>

          <div>
            <div className="flex items-center space-x-2">
              <span className="text-xl font-extrabold tracking-tight bg-gradient-to-r from-white via-slate-100 to-slate-400 bg-clip-text text-transparent">
                AgroPulse <span className="text-emerald-400 font-mono">AI</span>
              </span>
              <span className="px-2.5 py-0.5 text-[10px] font-bold tracking-wider uppercase rounded-full bg-emerald-500/10 text-emerald-300 border border-emerald-500/30">
                TECH EMBED'26
              </span>
              <span className="hidden sm:inline-flex px-2 py-0.5 text-[10px] font-semibold rounded-full bg-cyan-500/10 text-cyan-300 border border-cyan-500/30">
                UN SDG 2 & 6
              </span>
            </div>
            <p className="text-xs text-slate-400 font-medium">
              Sensorless Satellite Precision Agro-Advisory & Software IoT Digital Twin
            </p>
          </div>
        </div>

        {/* Global GPS Coordinates & AI Trigger */}
        <div className="flex items-center flex-wrap gap-3">
          <div className="flex items-center space-x-2.5 bg-slate-900/90 border border-slate-800 rounded-xl px-3.5 py-1.5 text-xs shadow-inner">
            <MapPin className="h-4 w-4 text-emerald-400 shrink-0" />
            <div className="flex flex-col text-left">
              <span className="text-slate-200 font-semibold">{gpsCoords.label}</span>
              <span className="text-[10px] text-slate-400 font-mono">GPS: {gpsCoords.lat}° N, {gpsCoords.lon}° E</span>
            </div>
            <button 
              onClick={detectLiveGPS}
              className="ml-2 px-2.5 py-1 bg-emerald-500/15 hover:bg-emerald-500/25 border border-emerald-500/30 text-emerald-300 rounded-lg text-[11px] font-bold flex items-center space-x-1 transition"
            >
              <Navigation className="h-3 w-3" />
              <span>{isLocating ? 'Locking...' : 'Sync GPS'}</span>
            </button>
          </div>

          <button 
            onClick={() => setChatOpen(!chatOpen)}
            className="group relative px-4 py-2 rounded-xl bg-gradient-to-r from-emerald-600 via-emerald-500 to-teal-500 hover:from-emerald-500 hover:to-teal-400 text-slate-950 font-bold text-xs flex items-center space-x-2 shadow-lg shadow-emerald-500/20 transition-all hover:scale-[1.02] active:scale-[0.98]"
          >
            <Sparkles className="h-4 w-4 text-slate-950 animate-pulse" />
            <span>04. AI Farmer Chatbot</span>
            <span className="bg-slate-950 text-emerald-400 font-mono text-[10px] px-1.5 py-0.5 rounded-full font-bold ml-1">
              EN/KN
            </span>
          </button>
        </div>
      </header>

      {/* WORKSPACE BODY */}
      <div className="flex flex-1 overflow-hidden relative z-10">

        {/* LEFT NAV DRAWER: 10 MODULES */}
        <aside className="w-80 bg-slate-900/50 backdrop-blur-md border-r border-slate-800/80 p-4 hidden lg:flex flex-col justify-between overflow-y-auto shrink-0">
          <div className="space-y-1.5">
            <div className="px-3 py-2 flex items-center justify-between text-xs">
              <span className="font-extrabold text-slate-400 uppercase tracking-wider text-[11px]">System Modules</span>
              <span className="flex items-center space-x-1.5 text-emerald-400 font-mono text-[11px]">
                <span className="h-2 w-2 rounded-full bg-emerald-400 animate-ping"></span>
                <span>ONLINE</span>
              </span>
            </div>

            {navModules.map((m) => {
              const Icon = m.icon;
              const isSelected = activeTab === m.id;
              return (
                <button
                  key={m.id}
                  onClick={() => setActiveTab(m.id)}
                  className={`w-full flex items-center justify-between px-3.5 py-3 rounded-2xl text-left transition-all group ${
                    isSelected 
                      ? 'bg-gradient-to-r from-emerald-500/20 to-teal-500/10 border border-emerald-500/40 text-emerald-300 shadow-md shadow-emerald-950/50' 
                      : 'border border-transparent text-slate-400 hover:bg-slate-800/60 hover:text-slate-200'
                  }`}
                >
                  <div className="flex items-center space-x-3.5">
                    <div className={`p-2.5 rounded-xl transition-colors ${
                      isSelected 
                        ? 'bg-emerald-500 text-slate-950 font-bold shadow-md shadow-emerald-500/30' 
                        : 'bg-slate-800/80 text-slate-400 group-hover:text-slate-200 group-hover:bg-slate-800'
                    }`}>
                      <Icon className="h-4 w-4" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-slate-100 flex items-center space-x-1.5">
                        <span>{m.name}</span>
                      </div>
                      <div className="text-[10px] text-slate-400 tracking-tight">{m.subtitle}</div>
                    </div>
                  </div>

                  <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-md ${
                    isSelected ? 'bg-emerald-500/20 text-emerald-300' : 'text-slate-500'
                  }`}>
                    #{m.num}
                  </span>
                </button>
              );
            })}
          </div>

          {/* SATELLITE DIGITAL TWIN STATUS PANEL */}
          <div className="mt-4 p-4 rounded-2xl glass-card border border-emerald-500/20 space-y-3">
            <div className="flex items-center justify-between text-xs">
              <span className="font-bold text-slate-200 flex items-center gap-2">
                <Cpu className="h-4 w-4 text-emerald-400" />
                Satellite Telemetry Bridge
              </span>
              <span className="text-[10px] font-mono text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-2 py-0.5 rounded-full font-bold">
                ACTIVE
              </span>
            </div>

            <div className="space-y-1.5 text-[11px] font-mono text-slate-400">
              <div className="flex justify-between">
                <span>Constellation:</span>
                <span className="text-slate-200 font-medium">Sentinel-2B + SMAP</span>
              </div>
              <div className="flex justify-between">
                <span>Atmospheric Model:</span>
                <span className="text-slate-200 font-medium">Open-Meteo High-Res</span>
              </div>
              <div className="flex justify-between">
                <span>Net Water Conserved:</span>
                <span className="text-cyan-400 font-bold">{telemetry.waterSaved.toLocaleString()} Liters</span>
              </div>
            </div>
          </div>
        </aside>

        {/* MOBILE MODULE BAR */}
        <div className="lg:hidden flex overflow-x-auto bg-slate-900 border-b border-slate-800 p-2 gap-1.5 shrink-0 w-full fixed bottom-0 left-0 z-40">
          {navModules.map((m) => (
            <button
              key={m.id}
              onClick={() => setActiveTab(m.id)}
              className={`px-3 py-2 rounded-xl text-xs font-bold whitespace-nowrap ${
                activeTab === m.id ? 'bg-emerald-500 text-slate-950 font-extrabold' : 'bg-slate-800 text-slate-400'
              }`}
            >
              {m.num}. {m.name}
            </button>
          ))}
        </div>

        {/* MAIN VIEWPORT */}
        <main className="flex-1 overflow-y-auto p-6 lg:p-8 space-y-6 pb-24 lg:pb-8">
          
          {/* TOP CONTROLS & FIELD CALIBRATION BAR */}
          <section className="glass-card rounded-3xl p-5 border border-slate-800/80 flex flex-wrap items-center justify-between gap-6 shadow-xl">
            <div className="flex flex-wrap items-center gap-6">
              
              {/* Crop Picker */}
              <div>
                <label className="block text-[10px] font-extrabold uppercase tracking-widest text-slate-400 mb-1">
                  Target Cultivation
                </label>
                <div className="relative">
                  <select 
                    value={cropType} 
                    onChange={(e) => setCropType(e.target.value)}
                    className="bg-slate-950 border border-slate-700/80 rounded-xl px-3.5 py-2 text-xs font-bold text-white focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 outline-none pr-8 cursor-pointer"
                  >
                    <option>Tomato (Arka Rakshak - High Yield)</option>
                    <option>Paddy (IR-64 Wetland Variety)</option>
                    <option>Ragi / Finger Millet (Indaf-5 Drought Tolerant)</option>
                    <option>Green Capsicum (Protected Polyhouse)</option>
                    <option>Maize (Deccan 103 Fodder/Grain)</option>
                  </select>
                </div>
              </div>

              {/* Land Area */}
              <div>
                <label className="block text-[10px] font-extrabold uppercase tracking-widest text-slate-400 mb-1">
                  Acreage (Acres)
                </label>
                <div className="flex items-center space-x-2">
                  <input 
                    type="number" 
                    step="0.5" 
                    min="0.5" 
                    max="100"
                    value={farmArea}
                    onChange={(e) => setFarmArea(Math.max(0.5, parseFloat(e.target.value) || 1))}
                    className="w-24 bg-slate-950 border border-slate-700/80 rounded-xl px-3 py-2 text-xs font-mono font-bold text-white focus:border-emerald-500 outline-none"
                  />
                  <span className="text-xs text-slate-400 font-medium">Acres</span>
                </div>
              </div>

              {/* Crop Stage Equation */}
              <div>
                <label className="block text-[10px] font-extrabold uppercase tracking-widest text-slate-400 mb-1">
                  Phenological Stage Factor (Kc)
                </label>
                <div className="bg-slate-950 border border-slate-800 rounded-xl px-3.5 py-2 text-xs font-mono text-emerald-400 font-bold flex items-center space-x-2">
                  <span className="h-2 w-2 rounded-full bg-emerald-400"></span>
                  <span>Mid-Season Flowering (Kc = 1.15)</span>
                </div>
              </div>
            </div>

            {/* Live Surface & Root Zone Quick Gauges */}
            <div className="flex items-center space-x-6 bg-slate-950/60 border border-slate-800/80 rounded-2xl px-5 py-2.5">
              <div className="text-center">
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">SURFACE (0-5cm)</span>
                <span className="font-mono font-extrabold text-base text-cyan-400">{telemetry.surfaceMoisture}%</span>
              </div>
              <div className="h-8 w-px bg-slate-800"></div>
              <div className="text-center">
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">ROOT ZONE (10-30cm)</span>
                <span className="font-mono font-extrabold text-base text-emerald-400">{telemetry.rootMoisture}%</span>
              </div>
              <div className="h-8 w-px bg-slate-800"></div>
              <div className="text-center">
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider block">SOIL TEMP</span>
                <span className="font-mono font-extrabold text-base text-amber-400">{telemetry.soilTemp}°C</span>
              </div>
            </div>
          </section>

          {/* ============================================================== */}
          {/* MODULE 2: SMART IRRIGATION */}
          {/* ============================================================== */}
          {activeTab === 'irrigation' && (
            <div className="space-y-6">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 text-[11px] font-bold uppercase tracking-wider">
                      Core Hackathon Track
                    </span>
                    <span className="text-xs text-slate-400 font-mono">Module #02</span>
                  </div>
                  <h2 className="text-2xl font-extrabold text-white mt-1">Smart Irrigation & Virtual IoT Relay Engine</h2>
                  <p className="text-sm text-slate-400 max-w-3xl">
                    Replaces physical underground moisture probes using satellite soil-moisture APIs and FAO Penman-Monteith Evapotranspiration to generate precise daily irrigation schedules.
                  </p>
                </div>

                <div className="bg-emerald-500/10 border border-emerald-500/30 px-4 py-2 rounded-2xl flex items-center space-x-2.5 text-emerald-400 text-xs font-bold">
                  <ShieldCheck className="h-5 w-5 text-emerald-400" />
                  <span>100% Sensorless Architecture</span>
                </div>
              </div>

              {/* 4 Core Telemetry Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                <div className="glass-card glass-card-hover p-5 rounded-3xl relative overflow-hidden">
                  <div className="flex justify-between items-start">
                    <span className="text-xs font-bold uppercase text-slate-400">Root-Zone Soil Moisture</span>
                    <Droplets className="h-5 w-5 text-emerald-400" />
                  </div>
                  <div className="text-4xl font-extrabold font-mono text-white mt-2">{telemetry.rootMoisture}%</div>
                  <div className="w-full bg-slate-800 h-2 rounded-full mt-3 overflow-hidden">
                    <div 
                      className="bg-gradient-to-r from-emerald-500 to-teal-400 h-full rounded-full transition-all duration-700" 
                      style={{ width: `${Math.min(100, telemetry.rootMoisture * 2.2)}%` }}
                    ></div>
                  </div>
                  <div className="flex justify-between items-center text-[11px] text-emerald-400 mt-2 font-medium">
                    <span>Field Capacity: Optimal</span>
                    <span>Range: 28% – 42%</span>
                  </div>
                </div>

                <div className="glass-card glass-card-hover p-5 rounded-3xl">
                  <div className="flex justify-between items-start">
                    <span className="text-xs font-bold uppercase text-slate-400">Crop Water Deficit (ETc)</span>
                    <Thermometer className="h-5 w-5 text-cyan-400" />
                  </div>
                  <div className="text-4xl font-extrabold font-mono text-white mt-2">{(telemetry.et0 * 1.15).toFixed(2)} <span className="text-lg font-sans text-slate-400">mm</span></div>
                  <div className="text-xs text-slate-400 mt-3 font-mono">
                    Formula: {telemetry.et0}mm ($ET_0$) × 1.15 ($K_c$)
                  </div>
                  <div className="text-[11px] text-cyan-300 mt-1 font-semibold">
                    Net Requirement: {Math.round(farmArea * 1850).toLocaleString()} Liters/day
                  </div>
                </div>

                <div className="glass-card glass-card-hover p-5 rounded-3xl">
                  <div className="flex justify-between items-start">
                    <span className="text-xs font-bold uppercase text-slate-400">Recommended Motor Run</span>
                    <Zap className="h-5 w-5 text-amber-400" />
                  </div>
                  <div className="text-4xl font-extrabold font-mono text-amber-400 mt-2">{Math.round(farmArea * 9)} <span className="text-lg font-sans text-slate-400">Mins</span></div>
                  <div className="text-xs text-slate-400 mt-3">Scheduled: Tomorrow 06:00 AM</div>
                  <div className="text-[11px] text-amber-300 mt-1 font-semibold">
                    Lockout: Thursday (85% Rain Forecast)
                  </div>
                </div>

                <div className="glass-card glass-card-hover p-5 rounded-3xl">
                  <div className="flex justify-between items-start">
                    <span className="text-xs font-bold uppercase text-slate-400">Groundwater Conserved</span>
                    <Globe className="h-5 w-5 text-purple-400" />
                  </div>
                  <div className="text-4xl font-extrabold font-mono text-purple-400 mt-2">{telemetry.waterSaved.toLocaleString()} <span className="text-lg font-sans text-slate-400">L</span></div>
                  <div className="text-xs text-slate-400 mt-3">38.4% reduction vs flood irrigation</div>
                  <div className="text-[11px] text-purple-300 mt-1 font-semibold">
                    +46.2 kWh Pump Power Saved
                  </div>
                </div>
              </div>

              {/* Virtual IoT Pump Relay & 7-Day Timetable */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                
                {/* Virtual Relay Control Panel */}
                <div className="glass-card p-6 rounded-3xl flex flex-col justify-between border-slate-800">
                  <div>
                    <div className="flex items-center justify-between mb-3">
                      <h3 className="text-base font-bold text-white flex items-center gap-2">
                        <Cpu className="h-5 w-5 text-emerald-400" />
                        Virtual IoT Relay Simulator
                      </h3>
                      <span className={`px-2.5 py-1 rounded-full text-[11px] font-mono font-bold ${
                        pumpRunning 
                          ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 animate-pulse' 
                          : 'bg-slate-800 text-slate-400'
                      }`}>
                        {pumpRunning ? 'PUMP ACTIVE (ON)' : 'STANDBY (OFF)'}
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 leading-relaxed">
                      Emulates an MQTT-driven smart valve controller. The engine automatically locks the valve whenever satellite rain probability exceeds 65% or root soil moisture is &gt;38%.
                    </p>

                    {pumpRunning && (
                      <div className="mt-4 p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-2xl flex items-center justify-between">
                        <div className="text-xs text-emerald-300 font-semibold">Live Pumping Active:</div>
                        <div className="font-mono text-lg font-extrabold text-emerald-400">{pumpTimer}s elapsed</div>
                      </div>
                    )}
                  </div>

                  <div className="mt-6 space-y-3">
                    <button 
                      onClick={() => setPumpRunning(!pumpRunning)}
                      className={`w-full py-3.5 rounded-2xl font-extrabold text-xs tracking-wider uppercase transition-all shadow-xl flex items-center justify-center space-x-2 ${
                        pumpRunning 
                          ? 'bg-rose-600 hover:bg-rose-500 text-white shadow-rose-600/30' 
                          : 'bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-black shadow-emerald-500/25'
                      }`}
                    >
                      {pumpRunning ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                      <span>{pumpRunning ? 'EMERGENCY SHUTOFF VALVE' : 'TRIGGER MANUAL PUMP OVERRIDE'}</span>
                    </button>
                    <div className="text-[11px] text-center text-slate-500 font-mono">
                      Emulated Valve: GPIO 18 • Flow: 180 L/min • Drip Pressure: 1.85 Bar
                    </div>
                  </div>
                </div>

                {/* 7-Day Precision Timetable */}
                <div className="lg:col-span-2 glass-card p-6 rounded-3xl border-slate-800">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-base font-bold text-white flex items-center gap-2">
                      <Calendar className="h-5 w-5 text-cyan-400" />
                      7-Day Rain-Aware Irrigation Timetable
                    </h3>
                    <span className="text-xs text-slate-400 font-mono">Open-Meteo Satellite Sync</span>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-7 gap-2.5">
                    {[
                      { day: 'Mon', rain: '5%', mins: '22m', status: 'Watered', bg: 'bg-emerald-500/15 border-emerald-500/40 text-emerald-300' },
                      { day: 'Tue', rain: '10%', mins: '22m', status: 'Scheduled', bg: 'bg-slate-950 border-slate-800 text-slate-300' },
                      { day: 'Wed', rain: '20%', mins: '18m', status: 'Scheduled', bg: 'bg-slate-950 border-slate-800 text-slate-300' },
                      { day: 'Thu', rain: '85%', mins: '0m', status: 'Rain Skip', bg: 'bg-cyan-500/20 border-cyan-500/50 text-cyan-300 glow-cyan' },
                      { day: 'Fri', rain: '70%', mins: '0m', status: 'Rain Skip', bg: 'bg-cyan-500/20 border-cyan-500/50 text-cyan-300' },
                      { day: 'Sat', rain: '15%', mins: '14m', status: 'Reduced', bg: 'bg-slate-950 border-slate-800 text-slate-300' },
                      { day: 'Sun', rain: '5%', mins: '22m', status: 'Normal', bg: 'bg-slate-950 border-slate-800 text-slate-300' },
                    ].map((slot, idx) => (
                      <div key={idx} className={`p-3.5 rounded-2xl border text-center transition-all ${slot.bg}`}>
                        <div className="text-xs font-bold uppercase">{slot.day}</div>
                        <div className="text-[10px] text-cyan-400 mt-1 font-mono">Rain: {slot.rain}</div>
                        <div className="text-2xl font-black font-mono my-2">{slot.mins}</div>
                        <div className="text-[10px] font-semibold tracking-wide uppercase">{slot.status}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ============================================================== */}
          {/* MODULE 1: AI CROP DOCTOR */}
          {/* ============================================================== */}
          {activeTab === 'doctor' && (
            <div className="space-y-6">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <div className="flex items-center space-x-2">
                    <span className="px-2.5 py-0.5 rounded-full bg-rose-500/15 text-rose-300 border border-rose-500/30 text-[11px] font-bold uppercase tracking-wider">
                      Computer Vision Pathology
                    </span>
                    <span className="text-xs text-slate-400 font-mono">Module #01</span>
                  </div>
                  <h2 className="text-2xl font-extrabold text-white mt-1">AI Crop Doctor & Leaf Stress Diagnostics</h2>
                  <p className="text-sm text-slate-400">
                    Upload leaf photos or ground-truth soil scans to instantly detect fungal diseases, nutrient stress, and automatically adjust irrigation runtimes.
                  </p>
                </div>

                <button 
                  onClick={() => { setSelectedImage(sampleLeafUrl); setAnalysisResult(null); }}
                  className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-emerald-400 text-xs font-bold flex items-center space-x-2 transition"
                >
                  <Sparkles className="h-4 w-4" />
                  <span>Load Sample Tomato Leaf</span>
                </button>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                
                {/* Upload or View Leaf Box */}
                <div className="glass-card p-6 rounded-3xl flex flex-col justify-between border-slate-800">
                  {selectedImage ? (
                    <div className="space-y-4">
                      <div className="relative rounded-2xl overflow-hidden border border-slate-700 group">
                        <img src={selectedImage} alt="Crop Scan" className="w-full h-80 object-cover" />
                        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-transparent to-transparent flex items-end p-4">
                          <span className="text-xs font-mono bg-slate-900/80 px-3 py-1 rounded-full text-slate-300 border border-slate-700">
                            Target: Solanum lycopersicum (Tomato Leaf)
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center justify-between">
                        <button 
                          onClick={() => { setSelectedImage(null); setAnalysisResult(null); }}
                          className="text-xs text-rose-400 hover:underline font-semibold"
                        >
                          Clear Image
                        </button>

                        <button 
                          onClick={triggerDiagnosis}
                          disabled={isScanning}
                          className="px-6 py-3 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-400 hover:from-emerald-400 hover:to-teal-300 text-slate-950 font-black text-xs flex items-center space-x-2 shadow-xl shadow-emerald-500/25 transition disabled:opacity-50"
                        >
                          <RefreshCw className={`h-4 w-4 ${isScanning ? 'animate-spin' : ''}`} />
                          <span>{isScanning ? 'SCANNING SPECTRAL SIGNATURE...' : 'RUN GEMINI VISION DIAGNOSIS'}</span>
                        </button>
                      </div>
                    </div>
                  ) : (
                    <label className="w-full h-80 border-2 border-dashed border-slate-700 hover:border-emerald-500/80 rounded-3xl flex flex-col items-center justify-center cursor-pointer transition bg-slate-950/40 p-6 text-center group">
                      <div className="p-4 rounded-2xl bg-slate-900 border border-slate-800 group-hover:scale-110 transition-transform mb-3">
                        <Upload className="h-8 w-8 text-emerald-400" />
                      </div>
                      <span className="text-sm font-bold text-white">Click or drag crop leaf photo here</span>
                      <span className="text-xs text-slate-400 mt-1 max-w-xs">Supports JPG, PNG up to 10MB or tap "Load Sample Tomato Leaf" above for instant demo</span>
                      <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                    </label>
                  )}
                </div>

                {/* AI Pathology Diagnostic Report */}
                <div className="glass-card p-6 rounded-3xl border-slate-800">
                  <h3 className="text-base font-bold text-white mb-4 flex items-center gap-2">
                    <Activity className="h-5 w-5 text-rose-400" />
                    Pathology & Prescription Output
                  </h3>

                  {analysisResult ? (
                    <div className="space-y-4">
                      <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 flex items-start space-x-3.5">
                        <AlertTriangle className="h-6 w-6 text-rose-400 shrink-0 mt-0.5" />
                        <div>
                          <div className="text-sm font-extrabold text-rose-400">{analysisResult.disease}</div>
                          <div className="text-xs text-slate-300 mt-1">
                            Severity: <span className="font-semibold text-white">{analysisResult.severity}</span> • Model Confidence: <span className="font-mono text-emerald-400 font-bold">{analysisResult.confidence}</span>
                          </div>
                        </div>
                      </div>

                      <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-1">
                        <span className="text-[10px] font-extrabold uppercase text-cyan-400 tracking-wider">Automated Irrigation Adjustment</span>
                        <p className="text-xs text-slate-200 leading-relaxed">{analysisResult.irrigationProtocol}</p>
                      </div>

                      <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-1">
                        <span className="text-[10px] font-extrabold uppercase text-emerald-400 tracking-wider">Recommended Treatment</span>
                        <p className="text-xs text-slate-200 leading-relaxed">{analysisResult.treatment}</p>
                      </div>

                      <div className="p-4 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-1">
                        <span className="text-[10px] font-extrabold uppercase text-amber-400 tracking-wider">Nutrient Fortification</span>
                        <p className="text-xs text-slate-200 leading-relaxed">{analysisResult.nutrientIntervention}</p>
                      </div>
                    </div>
                  ) : (
                    <div className="h-72 flex flex-col items-center justify-center text-center text-slate-500 p-6">
                      <Activity className="h-12 w-12 mb-3 opacity-30 text-emerald-400" />
                      <p className="text-sm font-medium text-slate-400">No leaf sample analyzed yet.</p>
                      <p className="text-xs text-slate-500 mt-1">Upload a leaf photo or load the demo sample to preview the AI diagnosis report.</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* ============================================================== */}
          {/* MODULE 3: WEATHER FORECAST */}
          {/* ============================================================== */}
          {activeTab === 'weather' && (
            <div className="space-y-6">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-amber-400 font-mono">Module #03 • Open-Meteo Ingestion</span>
                <h2 className="text-2xl font-extrabold text-white mt-1">Hyper-Local Meteorological Feed & Rain Lockout</h2>
                <p className="text-sm text-slate-400">Direct satellite radar feed with automated pump lockout to prevent water wastage during unexpected rainfall.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-5">
                {[
                  { title: 'Today (Nov 14)', temp: '28°C / 19°C', rain: '10% (0.0mm)', et: '4.8 mm', status: 'Normal Drip', color: 'text-emerald-400' },
                  { title: 'Saturday (Nov 15)', temp: '29°C / 20°C', rain: '15% (0.1mm)', et: '5.1 mm', status: 'Normal Drip', color: 'text-emerald-400' },
                  { title: 'Sunday (Nov 16)', temp: '26°C / 18°C', rain: '45% (3.2mm)', et: '3.6 mm', status: 'Reduced 30%', color: 'text-amber-400' },
                  { title: 'Monday (Alert)', temp: '23°C / 17°C', rain: '85% (18.4mm)', et: '2.1 mm', status: 'Auto Lockout', color: 'text-cyan-400' },
                ].map((w, idx) => (
                  <div key={idx} className="glass-card glass-card-hover p-6 rounded-3xl space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-bold text-slate-300">{w.title}</span>
                      <CloudSun className="h-5 w-5 text-amber-400" />
                    </div>
                    <div className="text-3xl font-black font-mono text-white">{w.temp}</div>
                    <div className="text-xs text-slate-400 space-y-1 font-mono">
                      <div>Precipitation: <span className="text-cyan-400 font-semibold">{w.rain}</span></div>
                      <div>Daily $ET_0$: <span className="text-emerald-400 font-semibold">{w.et}</span></div>
                    </div>
                    <div className={`pt-2 border-t border-slate-800 text-xs font-bold ${w.color}`}>
                      Action: {w.status}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ============================================================== */}
          {/* MODULE 5: NUTRIENT ADVISOR */}
          {/* ============================================================== */}
          {activeTab === 'nutrients' && (
            <div className="space-y-6">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-cyan-400 font-mono">Module #05 • Soil Chemistry</span>
                <h2 className="text-2xl font-extrabold text-white mt-1">Interactive NPK & Soil Fertility Advisor</h2>
                <p className="text-sm text-slate-400">Calibrate soil test PPMs or optical foliar indices to compute precise fertilizer dosages per acre.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="glass-card p-6 rounded-3xl space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-bold text-slate-200">Nitrogen (N)</span>
                    <span className="text-base font-extrabold font-mono text-emerald-400">{npkValues.n} PPM</span>
                  </div>
                  <input 
                    type="range" min="40" max="250" value={npkValues.n} 
                    onChange={(e) => setNpkValues({...npkValues, n: +e.target.value})} 
                    className="w-full accent-emerald-500 cursor-pointer" 
                  />
                  <p className="text-xs text-slate-400 leading-relaxed">
                    {npkValues.n < 110 ? 'Deficient: Top-dress 20 kg Neem-coated Urea per acre.' : 'Optimal vegetative canopy nitrogen level.'}
                  </p>
                </div>

                <div className="glass-card p-6 rounded-3xl space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-bold text-slate-200">Phosphorus (P)</span>
                    <span className="text-base font-extrabold font-mono text-amber-400">{npkValues.p} PPM</span>
                  </div>
                  <input 
                    type="range" min="10" max="100" value={npkValues.p} 
                    onChange={(e) => setNpkValues({...npkValues, p: +e.target.value})} 
                    className="w-full accent-amber-500 cursor-pointer" 
                  />
                  <p className="text-xs text-slate-400 leading-relaxed">
                    {npkValues.p < 35 ? 'Low Root P: Apply 18 kg DAP (Di-Ammonium Phosphate) via drip.' : 'Adequate for robust root branching and blossom set.'}
                  </p>
                </div>

                <div className="glass-card p-6 rounded-3xl space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-bold text-slate-200">Potassium (K)</span>
                    <span className="text-base font-extrabold font-mono text-cyan-400">{npkValues.k} PPM</span>
                  </div>
                  <input 
                    type="range" min="50" max="300" value={npkValues.k} 
                    onChange={(e) => setNpkValues({...npkValues, k: +e.target.value})} 
                    className="w-full accent-cyan-500 cursor-pointer" 
                  />
                  <p className="text-xs text-slate-400 leading-relaxed">
                    {npkValues.k < 150 ? 'Sub-optimal: Supply MOP (Muriate of Potash) to boost disease resistance.' : 'Excellent potassium level for fruit firmness.'}
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* ============================================================== */}
          {/* MODULE 6: CROP YIELD PREDICTOR */}
          {/* ============================================================== */}
          {activeTab === 'yield' && (
            <div className="space-y-6">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-indigo-400 font-mono">Module #06 • Harvest Intelligence</span>
                <h2 className="text-2xl font-extrabold text-white mt-1">AI Crop Yield & Biomass Predictor</h2>
              </div>

              <div className="glass-card p-8 rounded-3xl grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
                <div>
                  <span className="text-xs font-extrabold uppercase text-emerald-400 tracking-wider">Projected Harvest Biomass</span>
                  <div className="text-5xl font-black font-mono text-white mt-2">{estimatedYieldTons} <span className="text-2xl text-slate-400">Tons</span></div>
                  <p className="text-xs text-slate-400 mt-2 font-medium">Estimated for {farmArea} Acres of {cropType}</p>
                </div>

                <div className="bg-slate-950/80 p-5 rounded-2xl border border-slate-800">
                  <span className="text-xs text-slate-400 font-medium">NDVI Biomass Factor</span>
                  <div className="text-3xl font-extrabold font-mono text-cyan-400 mt-1">0.81 (Dense Canopy)</div>
                  <div className="text-[11px] text-emerald-400 mt-2 font-semibold">+16.4% gain from sensorless precision drip</div>
                </div>

                <div className="bg-slate-950/80 p-5 rounded-2xl border border-slate-800">
                  <span className="text-xs text-slate-400 font-medium">Harvest Window</span>
                  <div className="text-2xl font-extrabold font-mono text-amber-400 mt-1">Dec 20 – Dec 28</div>
                  <div className="text-[11px] text-slate-400 mt-2">Prediction Confidence: 96.2%</div>
                </div>
              </div>
            </div>
          )}

          {/* ============================================================== */}
          {/* MODULE 7: SATELLITE MONITORING */}
          {activeTab === 'satellite' && (
            <div className="space-y-6">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-teal-400 font-mono">Module #07 • Earth Observation</span>
                <h2 className="text-2xl font-extrabold text-white mt-1">Sentinel-2 Multispectral & Soil Moisture Matrix</h2>
                <p className="text-sm text-slate-400">Interactive 10m-resolution multispectral plot matrix for GPS: {gpsCoords.lat}°N, {gpsCoords.lon}°E.</p>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 glass-card p-6 rounded-3xl">
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-xs font-bold text-white uppercase tracking-wider">Field Grid Sectors (Click any plot)</span>
                    <span className="text-xs font-mono text-emerald-400">ESA Sentinel-2 L2A Feed</span>
                  </div>

                  <div className="grid grid-cols-4 gap-3 h-64">
                    {[
                      { sector: 'Sector 1A', ndvi: 0.84, moisture: '36%', status: 'Prime' },
                      { sector: 'Sector 1B', ndvi: 0.81, moisture: '35%', status: 'Prime' },
                      { sector: 'Sector 1C', ndvi: 0.77, moisture: '33%', status: 'Good' },
                      { sector: 'Sector 1D', ndvi: 0.65, moisture: '25%', status: 'Dry Fringe' },
                      { sector: 'Sector 2A', ndvi: 0.83, moisture: '35%', status: 'Prime' },
                      { sector: 'Sector 2B', ndvi: 0.79, moisture: '34%', status: 'Good' },
                      { sector: 'Sector 2C', ndvi: 0.78, moisture: '33%', status: 'Good' },
                      { sector: 'Sector 2D', ndvi: 0.68, moisture: '27%', status: 'Moderate' },
                    ].map((cell, idx) => (
                      <div 
                        key={idx}
                        className={`p-3.5 rounded-2xl border flex flex-col justify-between cursor-pointer transition-all hover:scale-[1.03] ${
                          cell.ndvi > 0.75 
                            ? 'bg-emerald-500/15 border-emerald-500/40 hover:bg-emerald-500/25' 
                            : 'bg-amber-500/15 border-amber-500/40 hover:bg-amber-500/25'
                        }`}
                      >
                        <div className="flex justify-between text-xs font-extrabold">
                          <span>{cell.sector}</span>
                          <span className="font-mono">{cell.moisture}</span>
                        </div>
                        <div>
                          <div className="text-[10px] text-slate-400 font-mono">NDVI: {cell.ndvi}</div>
                          <div className="text-xs font-bold text-white mt-0.5">{cell.status}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="glass-card p-6 rounded-3xl space-y-4">
                  <h3 className="text-sm font-bold text-white">Satellite Constellation Metadata</h3>
                  <div className="space-y-3 text-xs">
                    <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800">
                      <div className="text-slate-400 text-[11px]">Vegetation Index Sensor</div>
                      <div className="text-sm font-extrabold text-white mt-1">ESA Sentinel-2B Optical</div>
                      <div className="text-emerald-400 font-mono text-[11px] mt-1">Cloud Cover: 3.8% • Clear Pass</div>
                    </div>
                    <div className="bg-slate-950 p-4 rounded-2xl border border-slate-800">
                      <div className="text-slate-400 text-[11px]">Microwave Soil Radiometer</div>
                      <div className="text-sm font-extrabold text-white mt-1">NASA SMAP L-Band (1.4 GHz)</div>
                      <div className="text-cyan-400 font-mono text-[11px] mt-1">Subsurface Depth: 0–30 cm</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ============================================================== */}
          {/* MODULE 8: CROP HEALTH TRACKER */}
          {activeTab === 'health' && (
            <div className="space-y-6">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-violet-400 font-mono">Module #08 • Longitudinal Timeline</span>
                <h2 className="text-2xl font-extrabold text-white mt-1">Crop Health Timeline & Recovery Progression</h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                  { stage: 'Stage 1 (Oct 24)', score: '74%', diagnosis: 'Slight Leaf Curling Noted', remedy: 'Switched to morning drip & Neem extract', color: 'text-amber-400' },
                  { stage: 'Stage 2 (Nov 02)', score: '88%', diagnosis: 'Vigorous New Foliage Flush', remedy: 'Balanced 19:19:19 fertigation applied', color: 'text-cyan-400' },
                  { stage: 'Stage 3 (Nov 14)', score: '96%', diagnosis: 'Peak Flowering Stage Reached', remedy: 'Subsurface moisture held at 34.6%', color: 'text-emerald-400' },
                ].map((s, idx) => (
                  <div key={idx} className="glass-card glass-card-hover p-6 rounded-3xl space-y-3">
                    <div className="text-xs font-mono text-slate-400 font-bold">{s.stage}</div>
                    <div className={`text-4xl font-black font-mono ${s.color}`}>Score: {s.score}</div>
                    <div className="text-sm font-bold text-white">{s.diagnosis}</div>
                    <div className="text-xs text-slate-400 pt-3 border-t border-slate-800">Action: {s.remedy}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ============================================================== */}
          {/* MODULE 9: FARMING CALENDAR */}
          {activeTab === 'calendar' && (
            <div className="space-y-6">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-sky-400 font-mono">Module #09 • Lifecycle Planner</span>
                <h2 className="text-2xl font-extrabold text-white mt-1">Dynamic Farming Calendar & Automated Milestones</h2>
              </div>

              <div className="space-y-3">
                {calendarTasks.map((t) => (
                  <div 
                    key={t.id}
                    onClick={() => setCalendarTasks(calendarTasks.map(item => item.id === t.id ? {...item, completed: !item.completed} : item))}
                    className="glass-card glass-card-hover p-4 rounded-2xl flex items-center justify-between cursor-pointer"
                  >
                    <div className="flex items-center space-x-3.5">
                      <div className={`h-5 w-5 rounded-lg border flex items-center justify-center transition-colors ${
                        t.completed ? 'bg-emerald-500 border-emerald-500 text-slate-950 font-bold' : 'border-slate-600 bg-slate-900'
                      }`}>
                        {t.completed && <Check className="h-3.5 w-3.5 stroke-[3]" />}
                      </div>
                      <div>
                        <div className={`text-sm font-bold ${t.completed ? 'line-through text-slate-500' : 'text-white'}`}>{t.title}</div>
                        <div className="text-xs text-slate-400 font-mono">{t.date}</div>
                      </div>
                    </div>
                    <span className="text-xs font-semibold px-3 py-1 rounded-full bg-emerald-500/15 text-emerald-300 border border-emerald-500/30">
                      {t.tag}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ============================================================== */}
          {/* MODULE 10: PROFIT CALCULATOR */}
          {activeTab === 'profit' && (
            <div className="space-y-6">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-emerald-400 font-mono">Module #10 • Economic Ledger</span>
                <h2 className="text-2xl font-extrabold text-white mt-1">Farm Cost, APMC Mandi Revenue & Net Profit Calculator</h2>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="glass-card p-6 rounded-3xl space-y-4">
                  <h3 className="text-sm font-bold text-white">Adjust Farm Expenditure Inputs (₹)</h3>
                  <div className="grid grid-cols-2 gap-4 text-xs">
                    <div>
                      <label className="text-slate-400 font-medium">Seed & Nursery (₹)</label>
                      <input 
                        type="number" value={financeInputs.seeds} 
                        onChange={(e) => setFinanceInputs({...financeInputs, seeds: +e.target.value})} 
                        className="mt-1 w-full bg-slate-950 border border-slate-700/80 rounded-xl p-2.5 text-white font-mono font-bold" 
                      />
                    </div>
                    <div>
                      <label className="text-slate-400 font-medium">Fertilizer & Bio-Spray (₹)</label>
                      <input 
                        type="number" value={financeInputs.nutrients} 
                        onChange={(e) => setFinanceInputs({...financeInputs, nutrients: +e.target.value})} 
                        className="mt-1 w-full bg-slate-950 border border-slate-700/80 rounded-xl p-2.5 text-white font-mono font-bold" 
                      />
                    </div>
                    <div>
                      <label className="text-slate-400 font-medium">Labor & Cultivation (₹)</label>
                      <input 
                        type="number" value={financeInputs.labor} 
                        onChange={(e) => setFinanceInputs({...financeInputs, labor: +e.target.value})} 
                        className="mt-1 w-full bg-slate-950 border border-slate-700/80 rounded-xl p-2.5 text-white font-mono font-bold" 
                      />
                    </div>
                    <div>
                      <label className="text-slate-400 font-medium">APMC Rate per Ton (₹)</label>
                      <input 
                        type="number" value={financeInputs.mandiPricePerTon} 
                        onChange={(e) => setFinanceInputs({...financeInputs, mandiPricePerTon: +e.target.value})} 
                        className="mt-1 w-full bg-slate-950 border border-slate-700/80 rounded-xl p-2.5 text-white font-mono font-bold" 
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div className="glass-card p-5 rounded-3xl flex flex-col justify-center text-center">
                    <span className="text-xs text-slate-400 font-bold uppercase">Total Cost</span>
                    <span className="text-2xl font-black font-mono text-rose-400 mt-2">₹{totalCost.toLocaleString()}</span>
                  </div>
                  <div className="glass-card p-5 rounded-3xl flex flex-col justify-center text-center">
                    <span className="text-xs text-slate-400 font-bold uppercase">Gross Income</span>
                    <span className="text-2xl font-black font-mono text-cyan-400 mt-2">₹{grossIncome.toLocaleString()}</span>
                  </div>
                  <div className="glass-card p-5 rounded-3xl flex flex-col justify-center text-center border-emerald-500/40 glow-emerald">
                    <span className="text-xs text-emerald-400 font-bold uppercase">Net Profit</span>
                    <span className="text-3xl font-black font-mono text-emerald-400 mt-2">₹{netProfit.toLocaleString()}</span>
                  </div>
                </div>
              </div>
            </div>
          )}

        </main>
      </div>

      {/* ============================================================== */}
      {/* MODULE 4: AI FARMER CHATBOT DRAWER (BILINGUAL EN / KN) */}
      {/* ============================================================== */}
      {chatOpen && (
        <div className="fixed bottom-6 right-6 w-96 max-w-[94vw] h-[550px] glass-card border border-emerald-500/40 rounded-3xl shadow-2xl flex flex-col z-50 overflow-hidden glow-emerald">
          
          {/* Chat Header */}
          <div className="bg-slate-900/90 px-4 py-3 border-b border-slate-800 flex items-center justify-between">
            <div className="flex items-center space-x-2.5">
              <div className="p-2 rounded-xl bg-emerald-500 text-slate-950 font-bold">
                <MessageSquare className="h-4 w-4" />
              </div>
              <div>
                <div className="text-xs font-extrabold text-white">AgroPulse AI Assistant</div>
                <div className="text-[10px] text-emerald-400 font-mono">Live Ground Truth Context</div>
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <button 
                onClick={() => setLanguage(language === 'EN' ? 'KN' : 'EN')}
                className="px-2.5 py-1 rounded-lg bg-slate-800 hover:bg-slate-700 text-[11px] font-bold text-emerald-400 border border-slate-700"
              >
                {language === 'EN' ? 'ಕನ್ನಡ (KN)' : 'English (EN)'}
              </button>
              <button 
                onClick={() => setChatOpen(false)}
                className="text-slate-400 hover:text-white text-lg font-bold px-1.5"
              >
                ×
              </button>
            </div>
          </div>

          {/* Messages Scroll Area */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-slate-950/70">
            {messages.map((m, idx) => (
              <div key={idx} className={`flex ${m.sender === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] p-3.5 rounded-2xl text-xs leading-relaxed ${
                  m.sender === 'user' 
                    ? 'bg-emerald-500 text-slate-950 font-semibold rounded-br-none shadow-md' 
                    : 'bg-slate-900 text-slate-200 border border-slate-800 rounded-bl-none shadow-md'
                }`}>
                  {m.text}
                </div>
              </div>
            ))}
          </div>

          {/* Quick Query Pills */}
          <div className="px-3 py-2 bg-slate-900 border-t border-slate-800 flex gap-2 overflow-x-auto shrink-0">
            {['Run pump today?', 'Blight treatment', 'Phosphorus dosage'].map((pill, i) => (
              <button
                key={i}
                onClick={() => setInputText(pill)}
                className="text-[11px] font-medium bg-slate-800 hover:bg-slate-700 text-slate-300 px-3 py-1 rounded-full whitespace-nowrap border border-slate-700/80"
              >
                {pill}
              </button>
            ))}
          </div>

          {/* Input Footer */}
          <form onSubmit={sendFarmerChat} className="p-3 bg-slate-900 border-t border-slate-800 flex items-center space-x-2">
            <input 
              type="text"
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder={language === 'KN' ? 'ಕನ್ನಡದಲ್ಲಿ ಕೃಷಿ ಪ್ರಶ್ನೆಗಳನ್ನು ಕೇಳಿ...' : 'Ask about motor minutes, diseases, NPK...'}
              className="flex-1 bg-slate-950 border border-slate-700 rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-emerald-500"
            />
            <button 
              type="submit"
              className="p-2.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold transition shadow-md shadow-emerald-500/20"
            >
              <Send className="h-4 w-4" />
            </button>
          </form>
        </div>
      )}

    </div>
  );
}
