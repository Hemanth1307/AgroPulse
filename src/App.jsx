
import {
  getWeather,
  askFarmerAssistant
} from "./services/api";

import { useEffect, useRef, useState } from "react";
import {
  Sprout, LayoutDashboard, CloudSun, Scan, Droplets, Satellite,
  FlaskConical, Activity, CalendarDays, MessageCircle, Wallet,
  TrendingUp, Search, Menu, X, ChevronDown, ArrowUpRight,
  ArrowDownRight, MapPin, Wind, Thermometer, CloudRain, Sun,
  Leaf, Gauge, Send, Camera, Plus, Download, Settings,
  CircleHelp, LogOut, CheckCircle2, AlertTriangle, Clock,
  Droplet, IndianRupee, BarChart3, RefreshCw, Languages,
  Mic, MicOff, Volume2, Paperclip, FileText, Trash2, MessageSquarePlus, XCircle
} from "lucide-react";

import Login from "./Login";
import NutrientAdvisor from "./components/NutrientAdvisor";
import GoogleTranslateRuntime from "./components/GoogleTranslateRuntime";
import "./App.css";
import { jsPDF } from "jspdf";

const API_URL = "http://127.0.0.1:5000";

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
  "Yield Predictor": "Explore estimated crop yield using available indicators.",
  "Help & Support": "Get help using AgroPulse AI and troubleshoot common issues.",
  Settings: "Manage your language, application mode and account."
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
    workspace: "WORKSPACE", search: "Search modules...",
    dashboard: "Dashboard", farmerMode: "Farmer Mode",
    technicalMode: "Technical Mode", language: "Language",
    voice: "Voice assistant", welcome: "Welcome to your farm!",
    welcomeText: "Here is a simple overview of your farm today.",
    health: "Crop health", moisture: "Soil moisture estimate",
    water: "Water requirement", temperature: "Temperature",
    overview: "Farm overview", weather: "Weather",
    irrigation: "Irrigation status", priorities: "Today's farm activities",
    manage: "Manage irrigation", forecast: "Weather forecast",
    chat: "AgroPulse farm assistant",
    chatPlaceholder: "Ask something about your farm...",
    listen: "Speak", stop: "Stop listening", speak: "Read answer aloud",
    demo: "AI Assistant", help: "Help & Support",
    settings: "Settings", refresh: "Refresh", logout: "Log out"
  },
  kn: {
    workspace: "ಕಾರ್ಯಸ್ಥಳ", search: "ವಿಭಾಗಗಳನ್ನು ಹುಡುಕಿ...",
    dashboard: "ಡ್ಯಾಶ್‌ಬೋರ್ಡ್", farmerMode: "ರೈತ ಮೋಡ್",
    technicalMode: "ತಾಂತ್ರಿಕ ಮೋಡ್", language: "ಭಾಷೆ",
    voice: "ಧ್ವನಿ ಸಹಾಯಕ", welcome: "ನಿಮ್ಮ ಹೊಲಕ್ಕೆ ಸ್ವಾಗತ!",
    welcomeText: "ಇಂದು ನಿಮ್ಮ ಹೊಲದ ಸರಳ ಮಾಹಿತಿ ಇಲ್ಲಿದೆ.",
    health: "ಬೆಳೆ ಆರೋಗ್ಯ", moisture: "ಮಣ್ಣಿನ ತೇವಾಂಶ ಅಂದಾಜು",
    water: "ನೀರಿನ ಅವಶ್ಯಕತೆ", temperature: "ತಾಪಮಾನ",
    overview: "ಹೊಲದ ಮಾಹಿತಿ", weather: "ಹವಾಮಾನ",
    irrigation: "ನೀರಾವರಿ ಸ್ಥಿತಿ", priorities: "ಇಂದಿನ ಕೃಷಿ ಚಟುವಟಿಕೆಗಳು",
    manage: "ನೀರಾವರಿ ನಿರ್ವಹಿಸಿ", forecast: "ಹವಾಮಾನ ಮುನ್ಸೂಚನೆ",
    chat: "AgroPulse ಕೃಷಿ ಸಹಾಯಕ",
    chatPlaceholder: "ನಿಮ್ಮ ಹೊಲದ ಬಗ್ಗೆ ಕೇಳಿ...",
    listen: "ಮಾತನಾಡಿ", stop: "ಕೇಳುವುದನ್ನು ನಿಲ್ಲಿಸಿ",
    speak: "ಉತ್ತರವನ್ನು ಕೇಳಿ", demo: "AI ಸಹಾಯಕ",
    help: "ಸಹಾಯ", settings: "ಸೆಟ್ಟಿಂಗ್‌ಗಳು",
    refresh: "ಮರುಲೋಡ್", logout: "ಲಾಗ್ ಔಟ್"
  },
  te: {
    workspace: "పని ప్రదేశం", search: "మాడ్యూల్స్ వెతకండి...",
    dashboard: "డాష్‌బోర్డ్", farmerMode: "రైతు మోడ్",
    technicalMode: "టెక్నికల్ మోడ్", language: "భాష",
    voice: "వాయిస్ సహాయకుడు", welcome: "మీ పొలానికి స్వాగతం!",
    welcomeText: "ఈరోజు మీ పొలం యొక్క సరళమైన సమాచారం.",
    health: "పంట ఆరోగ్యం", moisture: "నేల తేమ అంచనా",
    water: "నీటి అవసరం", temperature: "ఉష్ణోగ్రత",
    overview: "పొలం వివరాలు", weather: "వాతావరణం",
    irrigation: "నీటిపారుదల స్థితి", priorities: "ఈరోజు వ్యవసాయ పనులు",
    manage: "నీటిపారుదల నిర్వహించండి", forecast: "వాతావరణ సూచన",
    chat: "AgroPulse వ్యవసాయ సహాయకుడు",
    chatPlaceholder: "మీ పొలం గురించి అడగండి...",
    listen: "మాట్లాడండి", stop: "వినడం ఆపండి",
    speak: "సమాధానం వినండి", demo: "AI సహాయకుడు",
    help: "సహాయం", settings: "సెట్టింగ్స్",
    refresh: "రిఫ్రెష్", logout: "లాగ్ అవుట్"
  },
  hi: {
    workspace: "कार्यस्थान", search: "मॉड्यूल खोजें...",
    dashboard: "डैशबोर्ड", farmerMode: "किसान मोड",
    technicalMode: "तकनीकी मोड", language: "भाषा",
    voice: "आवाज़ सहायक", welcome: "आपके खेत में आपका स्वागत है!",
    welcomeText: "आज आपके खेत की आसान जानकारी।",
    health: "फसल का स्वास्थ्य", moisture: "मिट्टी की नमी का अनुमान",
    water: "पानी की आवश्यकता", temperature: "तापमान",
    overview: "खेत का विवरण", weather: "मौसम",
    irrigation: "सिंचाई की स्थिति", priorities: "आज के कृषि कार्य",
    manage: "सिंचाई प्रबंधित करें", forecast: "मौसम पूर्वानुमान",
    chat: "AgroPulse किसान सहायक",
    chatPlaceholder: "अपने खेत के बारे में पूछें...",
    listen: "बोलें", stop: "सुनना बंद करें",
    speak: "जवाब सुनें", demo: "AI सहायक",
    help: "सहायता", settings: "सेटिंग्स",
    refresh: "रीफ्रेश", logout: "लॉग आउट"
  },
  ta: {
    workspace: "பணியிடம்", search: "பகுதிகளைத் தேடுங்கள்...",
    dashboard: "டாஷ்போர்டு", farmerMode: "விவசாயி முறை",
    technicalMode: "தொழில்நுட்ப முறை", language: "மொழி",
    voice: "குரல் உதவியாளர்", welcome: "உங்கள் பண்ணைக்கு வரவேற்கிறோம்!",
    welcomeText: "இன்றைய உங்கள் பண்ணையின் எளிய விவரங்கள்.",
    health: "பயிர் ஆரோக்கியம்", moisture: "மண் ஈரப்பத மதிப்பீடு",
    water: "நீர் தேவை", temperature: "வெப்பநிலை",
    overview: "பண்ணை விவரங்கள்", weather: "வானிலை",
    irrigation: "நீர்ப்பாசன நிலை", priorities: "இன்றைய விவசாயப் பணிகள்",
    manage: "நீர்ப்பாசனத்தை நிர்வகிக்கவும்",
    forecast: "வானிலை முன்னறிவிப்பு",
    chat: "AgroPulse விவசாய உதவியாளர்",
    chatPlaceholder: "உங்கள் பண்ணையைப் பற்றி கேளுங்கள்...",
    listen: "பேசுங்கள்", stop: "கேட்பதை நிறுத்து",
    speak: "பதிலைக் கேளுங்கள்", demo: "AI உதவியாளர்",
    help: "உதவி", settings: "அமைப்புகள்",
    refresh: "புதுப்பிக்கவும்", logout: "வெளியேறு"
  },
  ml: {
    workspace: "പ്രവർത്തന സ്ഥലം", search: "മൊഡ്യൂളുകൾ തിരയുക...",
    dashboard: "ഡാഷ്ബോർഡ്", farmerMode: "കർഷക മോഡ്",
    technicalMode: "സാങ്കേതിക മോഡ്", language: "ഭാഷ",
    voice: "വോയ്സ് സഹായി",
    welcome: "നിങ്ങളുടെ കൃഷിയിടത്തിലേക്ക് സ്വാഗതം!",
    welcomeText: "ഇന്നത്തെ കൃഷിയിടത്തിന്റെ ലളിതമായ വിവരങ്ങൾ.",
    health: "വിളയുടെ ആരോഗ്യം",
    moisture: "മണ്ണിലെ ഈർപ്പത്തിന്റെ കണക്ക്",
    water: "ജലത്തിന്റെ ആവശ്യം", temperature: "താപനില",
    overview: "കൃഷിയിട വിവരങ്ങൾ", weather: "കാലാവസ്ഥ",
    irrigation: "ജലസേചന നില", priorities: "ഇന്നത്തെ കൃഷിപ്പണികൾ",
    manage: "ജലസേചനം നിയന്ത്രിക്കുക",
    forecast: "കാലാവസ്ഥാ പ്രവചനം",
    chat: "AgroPulse കർഷക സഹായി",
    chatPlaceholder: "നിങ്ങളുടെ കൃഷിയിടത്തെക്കുറിച്ച് ചോദിക്കൂ...",
    listen: "സംസാരിക്കുക", stop: "കേൾക്കുന്നത് നിർത്തുക",
    speak: "ഉത്തരം കേൾക്കുക", demo: "AI സഹായി",
    help: "സഹായം", settings: "ക്രമീകരണങ്ങൾ",
    refresh: "പുതുക്കുക", logout: "ലോഗ് ഔട്ട്"
  }
};

const UI_TRANSLATIONS = {
  en: {},
  kn: {
    "Dashboard":"ಡ್ಯಾಶ್‌ಬೋರ್ಡ್", "Weather":"ಹವಾಮಾನ", "Crop Doctor":"ಬೆಳೆ ವೈದ್ಯ", "Smart Irrigation":"ಸ್ಮಾರ್ಟ್ ನೀರಾವರಿ", "Satellite Monitoring":"ಉಪಗ್ರಹ ಮೇಲ್ವಿಚಾರಣೆ", "Nutrient Advisor":"ಪೋಷಕಾಂಶ ಸಲಹೆಗಾರ", "Crop Health Tracker":"ಬೆಳೆ ಆರೋಗ್ಯ ಟ್ರ್ಯಾಕರ್", "Farming Calendar":"ಕೃಷಿ ಕ್ಯಾಲೆಂಡರ್", "Farmer Chatbot":"ರೈತ ಚಾಟ್‌ಬಾಟ್", "Profit Calculator":"ಲಾಭ ಲೆಕ್ಕಾಚಾರ", "Yield Predictor":"ಇಳುವರಿ ಮುನ್ಸೂಚಕ", "Help & Support":"ಸಹಾಯ ಮತ್ತು ಬೆಂಬಲ", "Settings":"ಸೆಟ್ಟಿಂಗ್‌ಗಳು", "WORKSPACE":"ಕಾರ್ಯಸ್ಥಳ", "Search modules...":"ವಿಭಾಗಗಳನ್ನು ಹುಡುಕಿ...", "Refresh":"ಮರುಲೋಡ್", "Farmer Mode":"ರೈತ ಮೋಡ್", "Technical Mode":"ತಾಂತ್ರಿಕ ಮೋಡ್", "Language":"ಭಾಷೆ", "Log out":"ಲಾಗ್ ಔಟ್", "Welcome to your farm!":"ನಿಮ್ಮ ಹೊಲಕ್ಕೆ ಸ್ವಾಗತ!", "Here is a simple overview of your farm today.":"ಇಂದು ನಿಮ್ಮ ಹೊಲದ ಸರಳ ಮಾಹಿತಿ ಇಲ್ಲಿದೆ.", "Crop health":"ಬೆಳೆ ಆರೋಗ್ಯ", "Soil moisture estimate":"ಮಣ್ಣಿನ ತೇವಾಂಶ ಅಂದಾಜು", "Water requirement":"ನೀರಿನ ಅವಶ್ಯಕತೆ", "Temperature":"ತಾಪಮಾನ", "Farm overview":"ಹೊಲದ ಅವಲೋಕನ", "Irrigation status":"ನೀರಾವರಿ ಸ್ಥಿತಿ", "Today's farm activities":"ಇಂದಿನ ಕೃಷಿ ಚಟುವಟಿಕೆಗಳು", "Manage irrigation":"ನೀರಾವರಿ ನಿರ್ವಹಿಸಿ", "Weather forecast":"ಹವಾಮಾನ ಮುನ್ಸೂಚನೆ", "Select farm":"ಹೊಲವನ್ನು ಆಯ್ಕೆಮಾಡಿ", "Save observation":"ವೀಕ್ಷಣೆಯನ್ನು ಉಳಿಸಿ", "Saving...":"ಉಳಿಸಲಾಗುತ್ತಿದೆ...", "Crop variety":"ಬೆಳೆ ತಳಿ", "Growth stage":"ಬೆಳವಣಿಗೆಯ ಹಂತ", "Health score (0–100)":"ಆರೋಗ್ಯ ಅಂಕ (0–100)", "Observation / notes":"ವೀಕ್ಷಣೆ / ಟಿಪ್ಪಣಿಗಳು", "Recent observations":"ಇತ್ತೀಚಿನ ವೀಕ್ಷಣೆಗಳು", "No crop health records yet":"ಇನ್ನೂ ಬೆಳೆ ಆರೋಗ್ಯ ದಾಖಲೆಗಳಿಲ್ಲ", "Add crop health observation":"ಬೆಳೆ ಆರೋಗ್ಯ ವೀಕ್ಷಣೆ ಸೇರಿಸಿ", "Crop health history":"ಬೆಳೆ ಆರೋಗ್ಯ ಇತಿಹಾಸ", "Crop profile":"ಬೆಳೆ ವಿವರ", "Farm":"ಹೊಲ", "Crop":"ಬೆಳೆ", "Variety":"ತಳಿ", "Growth stage":"ಬೆಳವಣಿಗೆಯ ಹಂತ", "Data status":"ದತ್ತಾಂಶ ಸ್ಥಿತಿ", "Database records":"ಡೇಟಾಬೇಸ್ ದಾಖಲೆಗಳು", "Awaiting first record":"ಮೊದಲ ದಾಖಲೆಗೆ ಕಾಯುತ್ತಿದೆ", "Not recorded":"ದಾಖಲಾಗಿಲ್ಲ", "Not entered":"ನಮೂದಿಸಿಲ್ಲ", "No farm records found. Add a farm first from the farm selector.":"ಯಾವುದೇ ಹೊಲದ ದಾಖಲೆಗಳು ಕಂಡುಬಂದಿಲ್ಲ. ಮೊದಲು ಹೊಲವನ್ನು ಸೇರಿಸಿ.", "Cancel":"ರದ್ದುಮಾಡಿ", "Save":"ಉಳಿಸಿ", "Submit":"ಸಲ್ಲಿಸಿ", "Search":"ಹುಡುಕಿ", "Loading...":"ಲೋಡ್ ಆಗುತ್ತಿದೆ...", "Today":"ಇಂದು", "Tomorrow":"ನಾಳೆ", "Planned":"ಯೋಜಿಸಲಾಗಿದೆ"
  },
  te: {
    "Dashboard":"డాష్‌బోర్డ్", "Weather":"వాతావరణం", "Crop Doctor":"పంట వైద్యుడు", "Smart Irrigation":"స్మార్ట్ నీటిపారుదల", "Satellite Monitoring":"ఉపగ్రహ పర్యవేక్షణ", "Nutrient Advisor":"పోషక సలహాదారు", "Crop Health Tracker":"పంట ఆరోగ్య ట్రాకర్", "Farming Calendar":"వ్యవసాయ క్యాలెండర్", "Farmer Chatbot":"రైతు చాట్‌బాట్", "Profit Calculator":"లాభాల లెక్కింపు", "Yield Predictor":"దిగుబడి అంచనా", "Help & Support":"సహాయం మరియు మద్దతు", "Settings":"సెట్టింగ్‌లు", "WORKSPACE":"పని ప్రదేశం", "Search modules...":"మాడ్యూల్స్ వెతకండి...", "Refresh":"రిఫ్రెష్", "Farmer Mode":"రైతు మోడ్", "Technical Mode":"సాంకేతిక మోడ్", "Language":"భాష", "Log out":"లాగ్ అవుట్", "Welcome to your farm!":"మీ పొలానికి స్వాగతం!", "Here is a simple overview of your farm today.":"ఈరోజు మీ పొలం యొక్క సరళమైన సమాచారం.", "Crop health":"పంట ఆరోగ్యం", "Soil moisture estimate":"నేల తేమ అంచనా", "Water requirement":"నీటి అవసరం", "Temperature":"ఉష్ణోగ్రత", "Farm overview":"పొలం వివరాలు", "Irrigation status":"నీటిపారుదల స్థితి", "Today's farm activities":"ఈరోజు వ్యవసాయ పనులు", "Manage irrigation":"నీటిపారుదల నిర్వహించండి", "Weather forecast":"వాతావరణ సూచన", "Select farm":"పొలాన్ని ఎంచుకోండి", "Save observation":"పరిశీలనను సేవ్ చేయండి", "Saving...":"సేవ్ అవుతోంది...", "Crop variety":"పంట రకం", "Growth stage":"పెరుగుదల దశ", "Health score (0–100)":"ఆరోగ్య స్కోరు (0–100)", "Observation / notes":"పరిశీలన / గమనికలు", "Recent observations":"ఇటీవలి పరిశీలనలు", "No crop health records yet":"ఇంకా పంట ఆరోగ్య రికార్డులు లేవు", "Add crop health observation":"పంట ఆరోగ్య పరిశీలనను జోడించండి", "Crop health history":"పంట ఆరోగ్య చరిత్ర", "Crop profile":"పంట వివరాలు", "Farm":"పొలం", "Crop":"పంట", "Variety":"రకం", "Growth stage":"పెరుగుదల దశ", "Data status":"డేటా స్థితి", "Database records":"డేటాబేస్ రికార్డులు", "Awaiting first record":"మొదటి రికార్డు కోసం వేచి ఉంది", "Not recorded":"నమోదు కాలేదు", "Not entered":"నమోదు చేయలేదు", "No farm records found. Add a farm first from the farm selector.":"పొలం రికార్డులు కనబడలేదు. ముందుగా పొలాన్ని జోడించండి.", "Cancel":"రద్దు చేయండి", "Save":"సేవ్ చేయండి", "Submit":"సమర్పించండి", "Search":"వెతకండి", "Loading...":"లోడ్ అవుతోంది...", "Today":"ఈరోజు", "Tomorrow":"రేపు", "Planned":"ప్రణాళిక చేయబడింది"
  },
  hi: {
    "Dashboard":"डैशबोर्ड", "Weather":"मौसम", "Crop Doctor":"फसल डॉक्टर", "Smart Irrigation":"स्मार्ट सिंचाई", "Satellite Monitoring":"उपग्रह निगरानी", "Nutrient Advisor":"पोषक तत्व सलाहकार", "Crop Health Tracker":"फसल स्वास्थ्य ट्रैकर", "Farming Calendar":"कृषि कैलेंडर", "Farmer Chatbot":"किसान चैटबॉट", "Profit Calculator":"लाभ कैलकुलेटर", "Yield Predictor":"उपज पूर्वानुमान", "Help & Support":"सहायता और समर्थन", "Settings":"सेटिंग्स", "WORKSPACE":"कार्यस्थान", "Search modules...":"मॉड्यूल खोजें...", "Refresh":"रीफ्रेश", "Farmer Mode":"किसान मोड", "Technical Mode":"तकनीकी मोड", "Language":"भाषा", "Log out":"लॉग आउट", "Welcome to your farm!":"आपके खेत में आपका स्वागत है!", "Here is a simple overview of your farm today.":"आज आपके खेत की आसान जानकारी।", "Crop health":"फसल का स्वास्थ्य", "Soil moisture estimate":"मिट्टी की नमी का अनुमान", "Water requirement":"पानी की आवश्यकता", "Temperature":"तापमान", "Farm overview":"खेत का विवरण", "Irrigation status":"सिंचाई की स्थिति", "Today's farm activities":"आज के कृषि कार्य", "Manage irrigation":"सिंचाई प्रबंधित करें", "Weather forecast":"मौसम पूर्वानुमान", "Select farm":"खेत चुनें", "Save observation":"अवलोकन सहेजें", "Saving...":"सहेजा जा रहा है...", "Crop variety":"फसल की किस्म", "Growth stage":"विकास चरण", "Health score (0–100)":"स्वास्थ्य अंक (0–100)", "Observation / notes":"अवलोकन / नोट्स", "Recent observations":"हाल के अवलोकन", "No crop health records yet":"अभी तक फसल स्वास्थ्य रिकॉर्ड नहीं हैं", "Add crop health observation":"फसल स्वास्थ्य अवलोकन जोड़ें", "Crop health history":"फसल स्वास्थ्य इतिहास", "Crop profile":"फसल विवरण", "Farm":"खेत", "Crop":"फसल", "Variety":"किस्म", "Growth stage":"विकास चरण", "Data status":"डेटा स्थिति", "Database records":"डेटाबेस रिकॉर्ड", "Awaiting first record":"पहले रिकॉर्ड की प्रतीक्षा", "Not recorded":"दर्ज नहीं", "Not entered":"नहीं भरा गया", "No farm records found. Add a farm first from the farm selector.":"खेत का रिकॉर्ड नहीं मिला। पहले खेत जोड़ें।", "Cancel":"रद्द करें", "Save":"सहेजें", "Submit":"जमा करें", "Search":"खोजें", "Loading...":"लोड हो रहा है...", "Today":"आज", "Tomorrow":"कल", "Planned":"नियोजित"
  },
  ta: {
    "Dashboard":"டாஷ்போர்டு", "Weather":"வானிலை", "Crop Doctor":"பயிர் மருத்துவர்", "Smart Irrigation":"ஸ்மார்ட் நீர்ப்பாசனம்", "Satellite Monitoring":"செயற்கைக்கோள் கண்காணிப்பு", "Nutrient Advisor":"ஊட்டச்சத்து ஆலோசகர்", "Crop Health Tracker":"பயிர் ஆரோக்கிய கண்காணிப்பு", "Farming Calendar":"விவசாய நாட்காட்டி", "Farmer Chatbot":"விவசாயி உரையாடல் உதவியாளர்", "Profit Calculator":"லாபக் கணிப்பான்", "Yield Predictor":"மகசூல் கணிப்பான்", "Help & Support":"உதவி மற்றும் ஆதரவு", "Settings":"அமைப்புகள்", "WORKSPACE":"பணியிடம்", "Search modules...":"பகுதிகளைத் தேடுங்கள்...", "Refresh":"புதுப்பிக்கவும்", "Farmer Mode":"விவசாயி முறை", "Technical Mode":"தொழில்நுட்ப முறை", "Language":"மொழி", "Log out":"வெளியேறு", "Welcome to your farm!":"உங்கள் பண்ணைக்கு வரவேற்கிறோம்!", "Here is a simple overview of your farm today.":"இன்றைய உங்கள் பண்ணையின் எளிய விவரங்கள்.", "Crop health":"பயிர் ஆரோக்கியம்", "Soil moisture estimate":"மண் ஈரப்பத மதிப்பீடு", "Water requirement":"நீர் தேவை", "Temperature":"வெப்பநிலை", "Farm overview":"பண்ணை விவரங்கள்", "Irrigation status":"நீர்ப்பாசன நிலை", "Today's farm activities":"இன்றைய விவசாயப் பணிகள்", "Manage irrigation":"நீர்ப்பாசனத்தை நிர்வகிக்கவும்", "Weather forecast":"வானிலை முன்னறிவிப்பு", "Select farm":"பண்ணையைத் தேர்ந்தெடுக்கவும்", "Save observation":"கவனிப்பைச் சேமிக்கவும்", "Saving...":"சேமிக்கப்படுகிறது...", "Crop variety":"பயிர் வகை", "Growth stage":"வளர்ச்சி நிலை", "Health score (0–100)":"ஆரோக்கிய மதிப்பெண் (0–100)", "Observation / notes":"கவனிப்பு / குறிப்புகள்", "Recent observations":"சமீபத்திய கவனிப்புகள்", "No crop health records yet":"இன்னும் பயிர் ஆரோக்கியப் பதிவுகள் இல்லை", "Add crop health observation":"பயிர் ஆரோக்கியக் கவனிப்பைச் சேர்க்கவும்", "Crop health history":"பயிர் ஆரோக்கிய வரலாறு", "Crop profile":"பயிர் விவரம்", "Farm":"பண்ணை", "Crop":"பயிர்", "Variety":"வகை", "Growth stage":"வளர்ச்சி நிலை", "Data status":"தரவு நிலை", "Database records":"தரவுத்தளப் பதிவுகள்", "Awaiting first record":"முதல் பதிவுக்காகக் காத்திருக்கிறது", "Not recorded":"பதிவு செய்யப்படவில்லை", "Not entered":"உள்ளிடப்படவில்லை", "No farm records found. Add a farm first from the farm selector.":"பண்ணைப் பதிவுகள் இல்லை. முதலில் பண்ணையைச் சேர்க்கவும்.", "Cancel":"ரத்துசெய்", "Save":"சேமி", "Submit":"சமர்ப்பிக்கவும்", "Search":"தேடு", "Loading...":"ஏற்றப்படுகிறது...", "Today":"இன்று", "Tomorrow":"நாளை", "Planned":"திட்டமிடப்பட்டது"
  },
  ml: {
    "Dashboard":"ഡാഷ്ബോർഡ്", "Weather":"കാലാവസ്ഥ", "Crop Doctor":"വിള ഡോക്ടർ", "Smart Irrigation":"സ്മാർട്ട് ജലസേചനം", "Satellite Monitoring":"ഉപഗ്രഹ നിരീക്ഷണം", "Nutrient Advisor":"പോഷക ഉപദേഷ്ടാവ്", "Crop Health Tracker":"വിള ആരോഗ്യ ട്രാക്കർ", "Farming Calendar":"കൃഷി കലണ്ടർ", "Farmer Chatbot":"കർഷക ചാറ്റ്ബോട്ട്", "Profit Calculator":"ലാഭ കാൽക്കുലേറ്റർ", "Yield Predictor":"വിളവ് പ്രവചനം", "Help & Support":"സഹായവും പിന്തുണയും", "Settings":"ക്രമീകരണങ്ങൾ", "WORKSPACE":"പ്രവർത്തന സ്ഥലം", "Search modules...":"മൊഡ്യൂളുകൾ തിരയുക...", "Refresh":"പുതുക്കുക", "Farmer Mode":"കർഷക മോഡ്", "Technical Mode":"സാങ്കേതിക മോഡ്", "Language":"ഭാഷ", "Log out":"ലോഗ് ഔട്ട്", "Welcome to your farm!":"നിങ്ങളുടെ കൃഷിയിടത്തിലേക്ക് സ്വാഗതം!", "Here is a simple overview of your farm today.":"ഇന്നത്തെ കൃഷിയിടത്തിന്റെ ലളിതമായ വിവരങ്ങൾ.", "Crop health":"വിളയുടെ ആരോഗ്യം", "Soil moisture estimate":"മണ്ണിലെ ഈർപ്പത്തിന്റെ കണക്ക്", "Water requirement":"ജലത്തിന്റെ ആവശ്യം", "Temperature":"താപനില", "Farm overview":"കൃഷിയിട വിവരങ്ങൾ", "Irrigation status":"ജലസേചന നില", "Today's farm activities":"ഇന്നത്തെ കൃഷിപ്പണികൾ", "Manage irrigation":"ജലസേചനം നിയന്ത്രിക്കുക", "Weather forecast":"കാലാവസ്ഥാ പ്രവചനം", "Select farm":"കൃഷിയിടം തിരഞ്ഞെടുക്കുക", "Save observation":"നിരീക്ഷണം സംരക്ഷിക്കുക", "Saving...":"സംരക്ഷിക്കുന്നു...", "Crop variety":"വിളയുടെ ഇനം", "Growth stage":"വളർച്ചാ ഘട്ടം", "Health score (0–100)":"ആരോഗ്യ സ്കോർ (0–100)", "Observation / notes":"നിരീക്ഷണം / കുറിപ്പുകൾ", "Recent observations":"സമീപകാല നിരീക്ഷണങ്ങൾ", "No crop health records yet":"വിള ആരോഗ്യ രേഖകൾ ഇതുവരെ ഇല്ല", "Add crop health observation":"വിള ആരോഗ്യ നിരീക്ഷണം ചേർക്കുക", "Crop health history":"വിള ആരോഗ്യ ചരിത്രം", "Crop profile":"വിളയുടെ വിവരങ്ങൾ", "Farm":"കൃഷിയിടം", "Crop":"വിള", "Variety":"ഇനം", "Growth stage":"വളർച്ചാ ഘട്ടം", "Data status":"ഡാറ്റ നില", "Database records":"ഡാറ്റാബേസ് രേഖകൾ", "Awaiting first record":"ആദ്യ രേഖയ്ക്കായി കാത്തിരിക്കുന്നു", "Not recorded":"രേഖപ്പെടുത്തിയിട്ടില്ല", "Not entered":"നൽകിയിട്ടില്ല", "No farm records found. Add a farm first from the farm selector.":"കൃഷിയിട രേഖകൾ കണ്ടെത്തിയില്ല. ആദ്യം കൃഷിയിടം ചേർക്കുക.", "Cancel":"റദ്ദാക്കുക", "Save":"സംരക്ഷിക്കുക", "Submit":"സമർപ്പിക്കുക", "Search":"തിരയുക", "Loading...":"ലോഡ് ചെയ്യുന്നു...", "Today":"ഇന്ന്", "Tomorrow":"നാളെ", "Planned":"ആസൂത്രണം ചെയ്തു"
  }
};

function MetricCard({ title, value, unit, change, icon: Icon, positive = true }) {
  return (
    <div className="metric-card">
      <div className="metric-top">
        <span>{title}</span>
        <div className="metric-icon"><Icon size={19} /></div>
      </div>
      <div className="metric-value notranslate" translate="no">{value}<small>{unit}</small></div>
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
      <div><h3>{title}</h3>{subtitle && <p>{subtitle}</p>}</div>
      {action}
    </div>
  );
}

function Status({ children, type = "green" }) {
  return <span className={`status status-${type}`}>{children}</span>;
}

/* ================= DASHBOARD ================= */

function Dashboard({ setActive, mode, t, locationName, deviceWeather }) {
  const tasks = [
    ["Check irrigation schedule", "Today · 10:30 AM", "High", "orange"],
    ["Inspect tomato crop health", "Today · 2:00 PM", "Medium", "blue"],
    ["Review nutrient recommendation", "Tomorrow · 9:00 AM", "Low", "green"]
  ];

  return (
    <>
      <div className="welcome-banner">
        <div>
          <span className="eyebrow"><Sprout size={14} /> AGROPULSE AI</span>
          <h2>{t.welcome} 👋</h2>
          <p>{t.welcomeText}</p>
          <div className="location-line"><MapPin size={14} />{locationName}</div>
        </div>
        <div className="banner-illustration"><Sprout size={76} /></div>
      </div>

      <div className="metrics-grid">
        <MetricCard title={t.health} value="82" unit="/100" change="Illustrative value" icon={Leaf} />
        <MetricCard title={t.moisture} value="31" unit="%" change="Estimated value" icon={Droplets} />
        <MetricCard title={t.water} value="4.2" unit="mm" change="Demo value" icon={Droplet} />
        <MetricCard title={t.temperature} value="28" unit="°C" change="Demo value" icon={Sun} />
      </div>

      <div className="dashboard-grid">
        {mode === "technical" && (
          <div className="panel large-panel">
            <PanelTitle title="NDVI / Vegetation index" subtitle="Illustrative technical visualization" action={<Status type="blue">Demo data</Status>} />
            <div className="chart-legend"><span><i className="legend-dot lime" /> NDVI</span><span>Last 7 days</span></div>
            <div className="bar-chart">
              {[54, 66, 61, 74, 69, 83, 78, 88, 82, 92, 86, 94].map((h, i) => (
                <div className="bar-column" key={i}><div className="bar" style={{ height: `${h}%` }} /><small>{i + 1}</small></div>
              ))}
            </div>
            <p className="chart-footnote">Illustrative values only. Not live satellite observations.</p>
          </div>
        )}

        <div className="panel">
          <PanelTitle title={t.weather} subtitle={deviceWeather ? `Live weather · ${locationName}` : "Waiting for live device GPS"} action={<CloudSun size={20} />} />
          {deviceWeather ? (
            <>
              <div className="weather-main"><CloudSun size={42} /><div><strong className="notranslate" translate="no">{deviceWeather.current?.temperature_2m ?? "—"}°C</strong><span>Current device-location temperature</span></div></div>
              <div className="weather-details">
                <div><Wind size={17} /><span>Wind</span><strong className="notranslate" translate="no">{deviceWeather.current?.wind_speed_10m ?? "—"} km/h</strong></div>
                <div><CloudRain size={17} /><span>Rain chance</span><strong className="notranslate" translate="no">{deviceWeather.daily?.precipitation_probability_max?.[0] ?? "—"}%</strong></div>
                <div><Thermometer size={17} /><span>Humidity</span><strong className="notranslate" translate="no">{deviceWeather.current?.relative_humidity_2m ?? "—"}%</strong></div>
              </div>
              <p className="helper-text">Weather fetched using the latest device GPS coordinates.</p>
            </>
          ) : <p className="helper-text">Live weather will appear after the browser shares your current device location. No saved or demo location is used.</p>}
          <button className="text-action" onClick={() => setActive("Weather")}>{t.forecast} <ArrowUpRight size={15} /></button>
        </div>

        <div className="panel">
          <PanelTitle title={t.irrigation} subtitle="Virtual irrigation system" />
          <div className="irrigation-status">
            <div className="round-icon"><Droplets size={27} /></div>
            <div><strong>Standby</strong><span>Virtual pump is currently off</span></div>
            <Status type="blue">Simulation</Status>
          </div>
          <div className="progress-label"><span>{t.moisture}</span><strong>31%</strong></div>
          <div className="progress-track"><div style={{ width: "31%" }} /></div>
          <button className="text-action" onClick={() => setActive("Smart Irrigation")}>{t.manage} <ArrowUpRight size={15} /></button>
        </div>

        <div className="panel">
          <PanelTitle title={t.priorities} subtitle="Suggested farm activities" />
          <div className="task-list">
            {tasks.map(([title, time, priority, color]) => (
              <div className="task-item" key={title}>
                <div className="task-check"><CheckCircle2 size={18} /></div>
                <div className="task-content"><strong>{title}</strong><span><Clock size={12} /> {time}</span></div>
                <Status type={color}>{priority}</Status>
              </div>
            ))}
          </div>
          <button className="text-action" onClick={() => setActive("Farming Calendar")}>Open farming calendar <ArrowUpRight size={15} /></button>
        </div>
      </div>
    </>
  );
}

/* ================= WEATHER ================= */

function WeatherPage({ locationName, deviceWeather, locationError, locationLoading, refreshDeviceLocation }) {
  const current = deviceWeather?.current || {};
  const daily = deviceWeather?.daily || {};
  const dates = daily.time || [];
  const maxTemps = daily.temperature_2m_max || [];
  const minTemps = daily.temperature_2m_min || [];
  const rain = daily.precipitation_probability_max || [];
  const et0 = daily.et0_fao_evapotranspiration || [];
  const coordinates = deviceWeather?.coordinates;

  return (
    <>
      <div className="panel" style={{ marginBottom: 18 }}>
        <PanelTitle
          title="Live device weather"
          subtitle={locationName || "Waiting for live device GPS"}
          action={
            <button className="secondary-button" onClick={refreshDeviceLocation} disabled={locationLoading}>
              <RefreshCw size={16} />
              {locationLoading ? "Detecting..." : "Refresh device location"}
            </button>
          }
        />
        {locationLoading && <p className="helper-text">Detecting your device's current position...</p>}
        {locationError && <div className="notice"><AlertTriangle size={17} /><span>{locationError}</span></div>}
        {deviceWeather ? (
          <>
            <div className="metrics-grid">
              <MetricCard title="Temperature" value={current.temperature_2m ?? "—"} unit="°C" change="Current" icon={Thermometer} />
              <MetricCard title="Rain probability" value={rain[0] ?? "—"} unit="%" change="Today's maximum" icon={CloudRain} />
              <MetricCard title="Wind speed" value={current.wind_speed_10m ?? "—"} unit="km/h" change="Current" icon={Wind} />
              <MetricCard title="Reference ET₀" value={et0[0] ?? "—"} unit="mm/day" change="Forecast" icon={Sun} />
            </div>
            <div className="weather-main">
              <CloudSun size={42} />
              <div><strong className="notranslate" translate="no">{current.apparent_temperature ?? current.temperature_2m ?? "—"}°C</strong><span>Feels like · Humidity <span className="notranslate" translate="no">{current.relative_humidity_2m ?? "—"}%</span></span></div>
            </div>
            <div className="weather-details">
              <div><CloudRain size={17} /><span>Current rain</span><strong className="notranslate" translate="no">{current.rain ?? 0} mm</strong></div>
              <div><Droplet size={17} /><span>Precipitation</span><strong className="notranslate" translate="no">{current.precipitation ?? 0} mm</strong></div>
              <div><Thermometer size={17} /><span>Humidity</span><strong className="notranslate" translate="no">{current.relative_humidity_2m ?? "—"}%</strong></div>
            </div>
            <p className="helper-text">
              Live device location: {locationName}<br />
              {coordinates ? <><span>GPS: </span><span className="notranslate" translate="no">{Number(coordinates.latitude).toFixed(5)}, {Number(coordinates.longitude).toFixed(5)}</span><span> · Accuracy: approximately </span><span className="notranslate" translate="no">{Math.round(coordinates.accuracy || 0)} m</span></> : ""}
              <br />
              {deviceWeather.fetchedAt ? <>Weather updated: <span className="notranslate" translate="no">{new Date(deviceWeather.fetchedAt).toLocaleTimeString("en-IN")}</span>. </> : ""}
              Weather data is from an online forecast service, not a physical sensor. Place names © <a href="https://www.openstreetmap.org/copyright" target="_blank" rel="noreferrer">OpenStreetMap contributors</a>.
            </p>
          </>
        ) : (
          <p className="helper-text">Weather will appear after your browser provides the device's live GPS coordinates. No fixed farm or saved location is used.</p>
        )}
      </div>

      {deviceWeather && (
        <>
          <div className="panel">
            <PanelTitle title="7-day forecast" subtitle={`Forecast for ${locationName}`} />
            <div className="forecast-grid">
              {dates.map((date, i) => (
                <div className="forecast-day" key={date}>
                  <span>{i === 0 ? "Today" : new Date(`${date}T00:00:00`).toLocaleDateString("en-IN", { weekday: "short" })}</span>
                  <CloudSun /><strong className="notranslate" translate="no">{maxTemps[i] ?? "—"}°</strong><small className="notranslate" translate="no">{minTemps[i] ?? "—"}°</small>
                  <span className="rain-label"><span className="notranslate" translate="no">{rain[i] ?? "—"}%</span> rain</span><small>ET₀ <span className="notranslate" translate="no">{et0[i] ?? "—"} mm</span></small>
                </div>
              ))}
            </div>
          </div>
          <div className="panel">
            <PanelTitle title="Weather advisory" subtitle="Guidance based on forecast data" />
            <div className="advisory-box"><CloudRain /><div>
              <strong>{(rain[0] ?? 0) > 65 ? "High rain probability" : "Review irrigation conditions"}</strong>
              <p>{(rain[0] ?? 0) > 65 ? "Check rainfall and soil moisture before irrigation." : "Check soil moisture and crop demand before irrigation."}</p>
            </div></div>
          </div>
        </>
      )}
    </>
  );
}

/* ================= CROP DOCTOR ================= */


function CropDoctor() {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState("");
  const [diagnosis, setDiagnosis] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [savedName, setSavedName] = useState("");
  const [reportUrl, setReportUrl] = useState("");

  // Converts different Gemini response formats into one consistent structure.
  function normalizeDiagnosis(raw) {
    let data = raw;

    // The backend may return diagnosis as a JSON string.
    if (typeof data === "string") {
      try {
        data = JSON.parse(data);
      } catch {
        throw new Error(
          "The AI returned text instead of structured diagnosis data. Check the backend Gemini response."
        );
      }
    }

    // Also handle a nested response.
    if (data?.diagnosis && typeof data.diagnosis === "object") {
      data = data.diagnosis;
    } else if (typeof data?.diagnosis === "string") {
      try {
        data = JSON.parse(data.diagnosis);
      } catch {
        // Continue with the original object if it is not nested JSON.
      }
    }

    if (!data || typeof data !== "object" || Array.isArray(data)) {
      throw new Error("The AI response did not contain a valid diagnosis.");
    }

    const asText = value => {
      if (value == null || value === "") return "";
      if (Array.isArray(value)) {
        return value
          .map(item =>
            typeof item === "string"
              ? item
              : item?.description || item?.name || JSON.stringify(item)
          )
          .join("\n");
      }
      if (typeof value === "object") {
        return value.description || value.text || JSON.stringify(value);
      }
      return String(value);
    };

    const crop = asText(data.crop || data.crop_name);
    const disease = asText(
      data.disease ||
      data.condition ||
      data.suspected_disease ||
      data.diagnosis_name
    );
    const symptoms = asText(
      data.symptoms ||
      data.visible_symptoms ||
      data.observed_symptoms
    );
    const treatment = asText(
      data.treatment ||
      data.recommendations ||
      data.recommended_treatment ||
      data.management
    );
    const prevention = asText(
      data.prevention ||
      data.preventive_measures ||
      data.prevention_tips
    );

    let confidence = data.confidence ?? data.confidence_score ?? data.probability;

    if (typeof confidence === "string") {
      const match = confidence.match(/(\d+(?:\.\d+)?)/);
      confidence = match ? Number(match[1]) : null;

      // Convert decimal probability, such as 0.85, into 85%.
      if (confidence !== null && confidence > 0 && confidence <= 1) {
        confidence *= 100;
      }
    }

    if (typeof confidence === "number") {
      confidence = Math.max(0, Math.min(100, Math.round(confidence)));
    } else {
      confidence = null;
    }

    return {
      crop: crop || "Not identified",
      disease: disease || "Unable to identify a specific disease",
      confidence,
      severity: asText(data.severity || data.severity_level) || "Not assessed",
      symptoms: symptoms || "No visible symptoms were returned by the AI.",
      treatment: treatment || "No treatment recommendation was returned.",
      prevention: prevention || "No prevention recommendation was returned.",
      possible_causes: asText(data.possible_causes || data.causes),
      disclaimer:
        asText(data.disclaimer) ||
        "AI diagnosis is advisory. Verify important recommendations with an agricultural expert."
    };
  }

  useEffect(() => {
    let active = true;

    try {
      const savedImage = sessionStorage.getItem("crop-image");
      const savedDiagnosis = sessionStorage.getItem("crop-diagnosis");
      const name = sessionStorage.getItem("crop-image-name") || "";

      if (savedImage && active) setPreview(savedImage);
      if (active) setSavedName(name);

      if (savedDiagnosis) {
        try {
          const normalized = normalizeDiagnosis(savedDiagnosis);
          if (active) setDiagnosis(normalized);
          sessionStorage.setItem(
            "crop-diagnosis",
            JSON.stringify(normalized)
          );
        } catch (err) {
          console.warn("Saved diagnosis could not be restored:", err);
          sessionStorage.removeItem("crop-diagnosis");
        }
      }
    } catch (err) {
      console.warn("Could not restore the saved crop image:", err);
    }

    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    return () => {
      if (reportUrl) URL.revokeObjectURL(reportUrl);
    };
  }, [reportUrl]);

  function handleImageChange(e) {
    const selected = e.target.files?.[0];
    if (!selected) return;

    if (!["image/jpeg", "image/png", "image/webp"].includes(selected.type)) {
      setError("Please select a JPG, PNG or WEBP image.");
      e.target.value = "";
      return;
    }

    if (selected.size > 8 * 1024 * 1024) {
      setError("Image must be smaller than 8 MB.");
      e.target.value = "";
      return;
    }

    setError("");
    setDiagnosis(null);
    setFile(selected);
    setSavedName(selected.name);

    sessionStorage.removeItem("crop-diagnosis");

    if (reportUrl) {
      URL.revokeObjectURL(reportUrl);
      setReportUrl("");
    }

    const reader = new FileReader();

    reader.onload = () => {
      const imageData = reader.result;
      setPreview(imageData);

      try {
        sessionStorage.setItem("crop-image", imageData);
        sessionStorage.setItem("crop-image-name", selected.name);
      } catch {
        setError(
          "Image preview is available, but it could not be saved for refresh."
        );
      }
    };

    reader.onerror = () => {
      setError("Could not read the selected image. Please try another image.");
    };

    reader.readAsDataURL(selected);
  }

  async function analyzeImage() {
    if (!file) {
      setError(
        "Please select the crop image again. Select the image before clicking Analyze."
      );
      return;
    }

    try {
      setLoading(true);
      setError("");
      setDiagnosis(null);

      const formData = new FormData();
      formData.append("image", file);

      const response = await fetch(
        `${API_URL}/api/crop-doctor/analyze`,
        {
          method: "POST",
          body: formData
        }
      );

      const responseText = await response.text();
      let data;

      try {
        data = JSON.parse(responseText);
      } catch {
        throw new Error(
          `The backend returned an invalid response (HTTP ${response.status}). Check the Flask terminal for errors.`
        );
      }

      if (!response.ok || data.success === false) {
        throw new Error(
          data.message ||
          data.error ||
          `Image analysis failed (HTTP ${response.status}).`
        );
      }

      // Support either { diagnosis: ... } or a direct diagnosis object.
      const rawDiagnosis = data.diagnosis ?? data.result ?? data;
      const normalized = normalizeDiagnosis(rawDiagnosis);

      // Do not silently display a fabricated diagnosis.
      if (
        normalized.disease === "Unable to identify a specific disease" &&
        normalized.crop === "Not identified"
      ) {
        throw new Error(
          "The AI response did not contain crop or disease information. Check the backend Gemini response."
        );
      }

      setDiagnosis(normalized);

      try {
        sessionStorage.setItem(
          "crop-diagnosis",
          JSON.stringify(normalized)
        );
      } catch {
        console.warn("Diagnosis could not be saved for refresh.");
      }
    } catch (err) {
      console.error("Crop Doctor analysis error:", err);
      setError(
        err.message ||
        "Unable to analyze this image. Check that Flask and Gemini are configured correctly."
      );
    } finally {
      setLoading(false);
    }
  }

  function generateReport() {
    if (!diagnosis) {
      setError("Analyze an image before generating a report.");
      return;
    }

    try {
      const pdf = new jsPDF();
      const pageHeight = pdf.internal.pageSize.getHeight();
      const pageWidth = pdf.internal.pageSize.getWidth();
      const margin = 20;
      const usableWidth = pageWidth - margin * 2;

      pdf.setFont("helvetica", "bold");
      pdf.setFontSize(20);
      pdf.text("AgroPulse AI", margin, 20);

      pdf.setFontSize(15);
      pdf.text("Crop Health Diagnosis Report", margin, 32);

      pdf.setFont("helvetica", "normal");
      pdf.setFontSize(10);

      const details = [
        `Image: ${file?.name || savedName || "Crop image"}`,
        `Date: ${new Date().toLocaleString()}`,
        "",
        `Crop: ${diagnosis.crop}`,
        `Suspected disease: ${diagnosis.disease}`,
        `Confidence: ${diagnosis.confidence == null ? "Not provided" : `${diagnosis.confidence}%`}`,
        `Severity: ${diagnosis.severity}`,
        "",
        "Visible symptoms:",
        diagnosis.symptoms,
        "",
        "Recommended treatment:",
        diagnosis.treatment,
        "",
        "Prevention:",
        diagnosis.prevention,
        "",
        "Possible causes:",
        diagnosis.possible_causes || "Not provided",
        "",
        "Disclaimer:",
        diagnosis.disclaimer
      ];

      let y = 44;

      details.forEach(line => {
        const wrapped = pdf.splitTextToSize(String(line), usableWidth);
        const lineHeight = 6;

        if (y + wrapped.length * lineHeight > pageHeight - margin) {
          pdf.addPage();
          y = margin;
        }

        if (line.endsWith(":")) {
          pdf.setFont("helvetica", "bold");
        } else {
          pdf.setFont("helvetica", "normal");
        }

        pdf.text(wrapped, margin, y);
        y += wrapped.length * lineHeight + 2;
      });

      if (reportUrl) URL.revokeObjectURL(reportUrl);

      const url = URL.createObjectURL(pdf.output("blob"));
      setReportUrl(url);
      setError("");
    } catch (err) {
      console.error("PDF generation error:", err);
      setError("Could not generate the PDF report: " + err.message);
    }
  }

  return (
    <div className="two-column">
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
                maxHeight: 250,
                objectFit: "contain",
                borderRadius: 12
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

        {savedName && <p>{savedName}</p>}

        <button
          className="primary-button full-button"
          disabled={!file || loading}
          onClick={analyzeImage}
        >
          {loading ? "Analyzing image..." : "Analyze image"}
          <Scan size={17} />
        </button>

        {error && (
          <div className="notice">
            <AlertTriangle size={17} />
            <span>{error}</span>
          </div>
        )}
      </div>

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
            <p>Please wait while the AI examines the image.</p>
          </div>
        )}

        {diagnosis && (
          <>
            {[
              ["Crop", diagnosis.crop],
              ["Suspected disease", diagnosis.disease],
              [
                "Confidence",
                diagnosis.confidence == null
                  ? "Not provided by AI"
                  : `${diagnosis.confidence}%`
              ],
              ["Severity", diagnosis.severity],
              ["Visible symptoms", diagnosis.symptoms],
              ["Recommended treatment", diagnosis.treatment],
              ["Prevention", diagnosis.prevention]
            ].map(([label, value]) => (
              <div className="profile-detail" key={label}>
                <span>{label}</span>
                <p style={{ whiteSpace: "pre-line" }}>
                  {value || "Not available"}
                </p>
              </div>
            ))}

            {diagnosis.possible_causes && (
              <div className="profile-detail">
                <span>Possible causes</span>
                <p style={{ whiteSpace: "pre-line" }}>
                  {diagnosis.possible_causes}
                </p>
              </div>
            )}

            <PanelTitle
              title="Diagnosis Report"
              subtitle="Generate and download your report."
            />

            <button
              className="primary-button"
              onClick={generateReport}
            >
              Generate PDF Preview
            </button>

            {reportUrl && (
              <>
                <iframe
                  src={reportUrl}
                  title="Crop Diagnosis PDF Preview"
                  width="100%"
                  height="500"
                  style={{
                    marginTop: 20,
                    border: "1px solid #ddd",
                    borderRadius: 10
                  }}
                />

                <a
                  href={reportUrl}
                  download="AgroPulse-Crop-Diagnosis-Report.pdf"
                  className="primary-button"
                  style={{
                    display: "inline-flex",
                    gap: 8,
                    marginTop: 15,
                    textDecoration: "none"
                  }}
                >
                  <Download size={17} />
                  Download PDF Report
                </a>
              </>
            )}
          </>
        )}

        <div className="notice">
          <AlertTriangle size={17} />
          <span>
            {diagnosis?.disclaimer ||
              "AI diagnosis is advisory, not laboratory-confirmed. Verify important recommendations with an agricultural expert."}
          </span>
        </div>
      </div>
    </div>
  );
}


/* ================= IRRIGATION ================= */

function IrrigationPage() {
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
  const [remainingSeconds, setRemainingSeconds] = useState(0);
  const [cycleMode, setCycleMode] = useState("idle");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  useEffect(() => {
    loadFarms();
  }, []);

  // Refresh the backend cycle state while this page is open. The backend remains
  // the source of truth; the browser never controls the pump timer itself.
  useEffect(() => {
    if (!farmId) return undefined;

    let active = true;
    const refreshCycle = async () => {
      try {
        const response = await fetch(`${API_URL}/api/irrigation/${farmId}/cycle`);
        const data = await response.json();
        if (!response.ok || !data.success) {
          throw new Error(data.message || "Unable to retrieve pump status.");
        }
        if (!active) return;
        setPump(Boolean(data.pump_on));
        setRemainingSeconds(Math.max(0, Number(data.remaining_seconds) || 0));
        setCycleMode(data.cycle_mode || data.cycle?.cycle_mode || "idle");
      } catch (err) {
        if (active) setError(err.message || "Unable to refresh pump status.");
      }
    };

    refreshCycle();
    const intervalId = window.setInterval(refreshCycle, 2000);
    return () => {
      active = false;
      window.clearInterval(intervalId);
    };
  }, [farmId]);

  async function loadFarms() {
    try {
      setLoading(true);
      setError("");
      const response = await fetch(`${API_URL}/api/farms`);
      const data = await response.json();
      if (!response.ok || !data.success) {
        throw new Error(data.message || "Unable to load farms.");
      }
      setFarms(data.farms || []);
      if (data.farms?.length) {
        const firstFarmId = String(data.farms[0].id);
        setFarmId(firstFarmId);
        await loadSettings(firstFarmId);
      } else {
        setError("No farm found. Add a farm with valid coordinates first.");
      }
    } catch (err) {
      setError(err.message || "Unable to load farms.");
    } finally {
      setLoading(false);
    }
  }

  async function loadSettings(id) {
    try {
      const response = await fetch(`${API_URL}/api/irrigation/${id}`);
      const data = await response.json();
      if (!response.ok || !data.success) {
        throw new Error(data.message || "Unable to load irrigation settings.");
      }
      const loadedSettings = data.settings || {};
      setSettings({
        kc: loadedSettings.kc ?? 1.15,
        root_zone_moisture: loadedSettings.root_zone_moisture ?? 31,
        emitter_flow: loadedSettings.emitter_flow ?? 2,
        emitter_count: loadedSettings.emitter_count ?? 100,
        efficiency: loadedSettings.efficiency ?? 0.9
      });
      setResult(data);
      setPump(Boolean(data.pump_on ?? loadedSettings.pump_on));
      return data;
    } catch (err) {
      setError(err.message || "Unable to load irrigation settings.");
      return null;
    }
  }

  async function changeFarm(id) {
    setFarmId(String(id));
    setResult(null);
    setError("");
    setNotice("");
    setPump(false);
    setRemainingSeconds(0);
    setCycleMode("idle");
    await loadSettings(id);
  }

  async function saveSettings() {
    if (!farmId) return;
    try {
      setSaving(true);
      setError("");
      setNotice("");
      const response = await fetch(`${API_URL}/api/irrigation/${farmId}/settings`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(settings)
      });
      const data = await response.json();
      if (!response.ok || !data.success) {
        throw new Error(data.message || "Unable to save settings.");
      }
      setNotice(data.message || "Irrigation settings saved successfully.");
      await loadSettings(farmId);
    } catch (err) {
      setError(err.message || "Unable to save settings.");
    } finally {
      setSaving(false);
    }
  }

  async function controlPump(action) {
    if (!farmId || saving) return;
    try {
      setSaving(true);
      setError("");
      setNotice("");
      const response = await fetch(`${API_URL}/api/irrigation/${farmId}/control`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action })
      });
      const data = await response.json();
      setResult(previous => ({ ...(previous || {}), ...data }));
      setPump(Boolean(data.pump_on));
      setRemainingSeconds(Math.max(0, Number(data.remaining_seconds ?? data.cycle_duration_seconds) || 0));

      if (!response.ok || !data.success) {
        setError(data.message || "Pump operation was blocked.");
      } else {
        setNotice(data.message || (action === "ON" ? "Irrigation cycle started." : "Pump switched off."));
      }

      // Reload the latest calculations and history after every pump action.
      await loadSettings(farmId);
    } catch (err) {
      setError("Unable to connect to irrigation backend: " + (err.message || "Unknown error"));
    } finally {
      setSaving(false);
    }
  }

  function updateSetting(name, value) {
    setSettings(previous => ({ ...previous, [name]: value === "" ? "" : Number(value) }));
  }

  function formatDuration(totalSeconds) {
    const seconds = Math.max(0, Number(totalSeconds) || 0);
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainder = seconds % 60;
    return hours > 0
      ? `${hours}h ${String(minutes).padStart(2, "0")}m ${String(remainder).padStart(2, "0")}s`
      : `${minutes}m ${String(remainder).padStart(2, "0")}s`;
  }

  const etc = result?.etc;
  const deficit = result?.water_deficit_mm;
  const history = result?.history || [];

  if (loading) {
    return <div className="panel"><p>Loading farm irrigation information...</p></div>;
  }

  return <>
    <div className="panel">
      <PanelTitle title="Farm selection" subtitle="Select the farm for irrigation monitoring." />
      {farms.length > 0 && (
        <label>Select farm
          <select value={farmId} onChange={event => changeFarm(event.target.value)}>
            {farms.map(farm => (
              <option key={farm.id} value={farm.id}>{farm.farm_name} — {farm.crop_name}</option>
            ))}
          </select>
        </label>
      )}
      {error && <div className="notice" role="alert"><AlertTriangle size={18} /><span>{error}</span></div>}
      {notice && <div className="notice" role="status"><CheckCircle2 size={18} /><span>{notice}</span></div>}
    </div>

    {farmId && <>
      <div className="metrics-grid">
        <MetricCard title="Root-zone moisture" value={settings.root_zone_moisture} unit="%" change="Configured value" icon={Droplets} />
        <MetricCard title="Crop coefficient" value={settings.kc} unit="" change="Farm setting" icon={Leaf} />
        <MetricCard title="Estimated ETc" value={etc ?? "—"} unit="mm/day" change="Weather-based estimate" icon={Gauge} />
        <MetricCard title="Water deficit" value={deficit ?? "—"} unit="mm" change="Estimated deficit" icon={Droplet} />
      </div>

      <div className="dashboard-grid">
        <div className="panel">
          <PanelTitle title="Irrigation settings" subtitle="Configure crop and virtual drip system." />
          <div className="input-stack">
            <label>Crop coefficient (Kc)
              <input type="number" min="0.01" max="2" step="0.05" value={settings.kc} onChange={event => updateSetting("kc", event.target.value)} />
            </label>
            <label>Root-zone moisture (%)
              <input type="number" min="0" max="100" step="1" value={settings.root_zone_moisture} onChange={event => updateSetting("root_zone_moisture", event.target.value)} />
            </label>
            <label>Emitter flow (litres/hour)
              <input type="number" min="0.1" step="0.1" value={settings.emitter_flow} onChange={event => updateSetting("emitter_flow", event.target.value)} />
            </label>
            <label>Number of emitters
              <input type="number" min="1" step="1" value={settings.emitter_count} onChange={event => updateSetting("emitter_count", event.target.value)} />
            </label>
            <label>Irrigation efficiency (0–1)
              <input type="number" min="0.01" max="1" step="0.05" value={settings.efficiency} onChange={event => updateSetting("efficiency", event.target.value)} />
            </label>
          </div>
          <button className="primary-button" disabled={saving} onClick={saveSettings}>
            {saving ? "Saving..." : "Save settings"}
          </button>
        </div>

        <div className="panel">
          <PanelTitle
            title="Virtual pump control"
            subtitle="Backend-controlled simulated relay."
            action={<Status type={pump ? "green" : "blue"}>{pump ? "Pump ON" : "Pump OFF"}</Status>}
          />
          <div className="pump-control">
            <div className={`pump-orb ${pump ? "pump-on" : ""}`}><Droplets size={42} /></div>
            <strong>{pump ? "Pump ON" : "Pump OFF"}</strong>
            <span>{pump ? "Virtual irrigation cycle is active" : "Virtual pump is in standby"}</span>
            {pump && <div className="balance-total" style={{ width: "100%", marginTop: 12 }}>
              <span>Time remaining</span>
              <strong>{formatDuration(remainingSeconds)}</strong>
            </div>}
            <button
              className={`primary-button ${pump ? "stop-button" : ""}`}
              disabled={saving}
              onClick={() => controlPump(pump ? "OFF" : "ON")}
            >
              {saving ? "Processing..." : pump ? "Turn pump OFF" : "Request pump ON"}
            </button>
            <small className="helper-text">Cycle mode: {cycleMode || "idle"}</small>
          </div>
          <div className="notice"><AlertTriangle size={17} /><span>The backend checks irrigation conditions before allowing pump activation. The pump is simulated and does not operate physical equipment.</span></div>
        </div>
      </div>

      {result && <div className="panel">
        <PanelTitle title="Irrigation calculation result" subtitle="Latest backend response" />
        {result.message && <div className="notice">{result.lockout ? <AlertTriangle size={18} /> : <CheckCircle2 size={18} />}<span>{result.message}</span></div>}
        {result.calculation_message && <p className="helper-text">{result.calculation_message}</p>}
        {result.et0 !== undefined && <>
          <div className="balance-row"><span>Reference ET₀</span><strong>{result.et0} mm/day</strong></div>
          <div className="balance-row"><span>Crop coefficient</span><strong>{result.kc}</strong></div>
          <div className="balance-row"><span>Crop evapotranspiration (ETc)</span><strong>{result.etc} mm/day</strong></div>
          <div className="balance-row"><span>Rainfall forecast</span><strong>{result.rainfall} mm</strong></div>
          <div className="balance-total"><span>Water deficit</span><strong>{result.water_deficit_mm} mm</strong></div>
          <div className="balance-row"><span>Estimated water requirement</span><strong>{result.water_required_litres ?? "—"} litres</strong></div>
          <div className="balance-total"><span>Estimated pump runtime</span><strong>{result.pump_runtime_minutes ?? "—"} minutes</strong></div>
          <div className="balance-row"><span>Rain probability</span><strong>{result.rain_probability ?? "—"}%</strong></div>
        </>}
      </div>}

      <div className="panel">
        <PanelTitle title="Irrigation history" subtitle="Recent pump activity recorded by the backend." action={<Status type="blue">Latest 30 records</Status>} />
        {history.length > 0 ? (
          <div className="history-list">
            {history.map((entry, index) => (
              <div className="history-row" key={entry.id || `${entry.action}-${entry.created_at || index}`}>
                <span>{entry.action || "EVENT"}</span>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <strong>{entry.reason || "Irrigation event"}</strong>
                  <small style={{ display: "block", opacity: 0.7 }}>{entry.created_at || "Time not provided"}</small>
                </div>
                <Status type={entry.action === "ON" ? "green" : entry.action === "BLOCKED" ? "orange" : "blue"}>{entry.action || "Event"}</Status>
              </div>
            ))}
          </div>
        ) : (
          <div className="empty-state"><Clock size={30} /><strong>No irrigation activity yet</strong><p>Backend pump events will appear here.</p></div>
        )}
      </div>
    </>}

    <p className="helper-text">Root-zone moisture is a manually configured value, not a live physical sensor measurement. Weather-based calculations use the selected farm coordinates. The pump is simulated; no physical pump is connected.</p>
  </>;
}

/* ================= SATELLITE MONITORING ================= */

function SatellitePage() {
  const [farms, setFarms] = useState([]);
  const [farmId, setFarmId] = useState("");
  const [sentinelData, setSentinelData] = useState(null);
  const [smapData, setSmapData] = useState(null);
  const [loadingFarms, setLoadingFarms] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const selectedFarm = farms.find(f => String(f.id) === String(farmId));

  useEffect(() => { loadFarms(); }, []);

  async function loadFarms() {
    try {
      setLoadingFarms(true); setError("");
      const response = await fetch(`${API_URL}/api/farms`);
      const data = await response.json();
      if (!response.ok || !data.success) throw new Error(data.message || "Unable to load farms.");
      setFarms(data.farms || []);
      if (data.farms?.length) setFarmId(String(data.farms[0].id));
    } catch (err) { setError(err.message); }
    finally { setLoadingFarms(false); }
  }

  async function searchSatelliteData() {
    if (!selectedFarm) { setError("Please select a farm."); return; }
    const { latitude, longitude } = selectedFarm;
    if (latitude == null || longitude == null) { setError("This farm does not have GPS coordinates."); return; }
    setLoading(true); setError(""); setSentinelData(null); setSmapData(null);
    try {
      const [sRes, mRes] = await Promise.all([
        fetch(`${API_URL}/api/satellite/sentinel2?latitude=${latitude}&longitude=${longitude}`),
        fetch(`${API_URL}/api/satellite/smap?latitude=${latitude}&longitude=${longitude}`)
      ]);
      const sentinel = await sRes.json();
      const smap = await mRes.json();
      if (!sRes.ok || !sentinel.success) throw new Error(sentinel.message || "Sentinel-2 search failed.");
      if (!mRes.ok || !smap.success) throw new Error(smap.message || "NASA SMAP search failed.");
      setSentinelData(sentinel); setSmapData(smap);
    } catch (err) { setError(err.message); }
    finally { setLoading(false); }
  }

  return <div className="dashboard-grid">
    <div className="panel large-panel">
      <PanelTitle title="Satellite Monitoring" subtitle="Search satellite products using saved farm coordinates." action={<Status type="blue">Satellite APIs</Status>} />
      {loadingFarms ? <p>Loading farms...</p> : !farms.length ? <div className="notice"><AlertTriangle size={17} /><span>No farms found. Add a farm first.</span></div> : <>
        <label style={{ display: "flex", alignItems: "center", gap: 10, flexWrap: "wrap", color: "#e8eee9", fontWeight: 600 }}>Select farm<select value={farmId} onChange={e => { setFarmId(e.target.value); setSentinelData(null); setSmapData(null); setError(""); }} style={{ display: "inline-block", appearance: "none", WebkitAppearance: "none", minWidth: 260, maxWidth: "100%", height: 44, padding: "0 42px 0 14px", border: "1px solid #5b765f", borderRadius: 10, backgroundColor: "#14251c", backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%23a8e83f' stroke-width='2' stroke-linecap='round' stroke-linejoin='round'%3E%3Cpath d='m6 9 6 6 6-6'/%3E%3C/svg%3E\")", backgroundRepeat: "no-repeat", backgroundPosition: "right 14px center", color: "#ffffff", colorScheme: "dark", fontSize: 14, fontWeight: 600, cursor: "pointer", outline: "none" }}>{farms.map(f => <option key={f.id} value={f.id} style={{ backgroundColor: "#14251c", color: "#ffffff" }}>{f.farm_name} — {f.crop_name}</option>)}</select></label>
        {selectedFarm && <div className="notice"><MapPin size={17} /><span>Latitude: {selectedFarm.latitude ?? "N/A"} | Longitude: {selectedFarm.longitude ?? "N/A"}</span></div>}
        <button className="primary-button" style={{ marginTop: 18 }} onClick={searchSatelliteData} disabled={loading}><RefreshCw size={16} />{loading ? "Searching satellite data..." : "Search Satellite Data"}</button>
      </>}
      {error && <div className="notice"><AlertTriangle size={17} /><span>{error}</span></div>}
    </div>
    <div className="panel">
      <PanelTitle title="Sentinel-2" subtitle="ESA multispectral satellite catalogue" action={<Status type="blue">Copernicus</Status>} />
      <div className="source-item"><Satellite size={22} /><div><strong>Sentinel-2 Level-2A</strong><span>10 m resolution for selected bands</span></div></div>
      {sentinelData && <>
        <div className="metric-card"><span>Products found</span><strong>{sentinelData.products_found}</strong></div>
        {sentinelData.products?.length ? sentinelData.products.map((p, i) => <div className="source-item" key={p.id || i}><Satellite size={20} /><div><strong>{p.name}</strong><span>Date: {p.date ? new Date(p.date).toLocaleString() : "N/A"}</span><span>Processing: {p.processing_level}</span></div></div>) : <p>No Sentinel-2 products found.</p>}
      </>}
      <p className="chart-footnote">Catalogue metadata only. Actual imagery and NDVI values have not been calculated.</p>
    </div>
    <div className="panel">
      <PanelTitle title="NASA SMAP" subtitle="Soil moisture satellite catalogue" action={<Status type="blue">NASA</Status>} />
      <div className="source-item"><Droplets size={22} /><div><strong>SMAP SPL3SMP</strong><span>Satellite soil moisture observations</span></div></div>
      {smapData && <>
        <div className="metric-card"><span>Products found</span><strong>{smapData.products_found}</strong></div>
        {smapData.products?.length ? smapData.products.map((p, i) => <div className="source-item" key={p.id || i}><Droplets size={20} /><div><strong>{p.title}</strong><span>Date: {p.date ? new Date(p.date).toLocaleString() : "N/A"}</span></div></div>) : <p>No SMAP products found.</p>}
      </>}
      <div className="notice"><AlertTriangle size={17} /><span>{smapData?.resolution_note || "SMAP has coarse spatial resolution. It is not a 10 m farm measurement."}</span></div>
    </div>
  </div>;
}

/* ================= CROP HEALTH TRACKER ================= */

function HealthPage() {
  const [farms, setFarms] = useState([]);
  const [farmId, setFarmId] = useState("");
  const [records, setRecords] = useState([]);
  const [profile, setProfile] = useState(null);
  const [form, setForm] = useState({ variety: "", growth_stage: "", health_score: "80", notes: "" });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  useEffect(() => { loadFarms(); }, []);

  async function loadFarms() {
    try {
      setLoading(true);
      setError("");
      const response = await fetch(`${API_URL}/api/farms`);
      const data = await response.json();
      if (!response.ok || !data.success) throw new Error(data.message || "Could not load farms.");
      const list = Array.isArray(data.farms) ? data.farms : [];
      setFarms(list);
      if (list.length) {
        const id = String(list[0].id);
        setFarmId(id);
        await loadHealth(id);
      }
    } catch (err) {
      setError(err.message || "Could not connect to the backend.");
    } finally {
      setLoading(false);
    }
  }

  async function loadHealth(id) {
    if (!id) return;
    try {
      setError("");
      const response = await fetch(`${API_URL}/api/crop-health?farm_id=${encodeURIComponent(id)}`);
      const data = await response.json();
      if (!response.ok || !data.success) throw new Error(data.message || "Could not load crop health data.");
      setRecords(data.records || []);
      setProfile(data.profile || null);
      setForm(previous => ({
        ...previous,
        variety: data.profile?.variety || "",
        growth_stage: data.profile?.growth_stage || ""
      }));
    } catch (err) {
      setError(err.message || "Could not load crop health data.");
      setRecords([]);
      setProfile(null);
    }
  }

  async function changeFarm(id) {
    setFarmId(String(id));
    setRecords([]);
    setProfile(null);
    setNotice("");
    await loadHealth(id);
  }

  async function saveRecord(event) {
    event.preventDefault();
    if (!farmId) return;
    const score = Number(form.health_score);
    if (!Number.isFinite(score) || score < 0 || score > 100) {
      setError("Health score must be between 0 and 100.");
      return;
    }
    try {
      setSaving(true);
      setError("");
      setNotice("");
      const response = await fetch(`${API_URL}/api/crop-health`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          farm_id: Number(farmId),
          variety: form.variety,
          growth_stage: form.growth_stage,
          health_score: score,
          notes: form.notes
        })
      });
      const data = await response.json();
      if (!response.ok || !data.success) throw new Error(data.message || "Could not save crop health record.");
      setNotice("Crop health record saved to the database.");
      setForm(previous => ({ ...previous, notes: "" }));
      await loadHealth(farmId);
    } catch (err) {
      setError(err.message || "Could not save crop health record.");
    } finally {
      setSaving(false);
    }
  }

  const selectedFarm = farms.find(farm => String(farm.id) === String(farmId));

  if (loading) return <div className="panel"><p>Loading crop health data from backend...</p></div>;

  return <>
    <div className="panel">
      <PanelTitle title="Crop Health Tracker" subtitle="Crop details and health records saved in your AgroPulse database." />
      {farms.length > 0 ? (
        <label>Select farm
          <select value={farmId} onChange={event => changeFarm(event.target.value)}>
            {farms.map(farm => <option key={farm.id} value={farm.id}>{farm.farm_name} — {farm.crop_name}</option>)}
          </select>
        </label>
      ) : <div className="notice"><AlertTriangle size={17} /><span>No farm records found. Add a farm first from the farm selector.</span></div>}
      {error && <div className="notice" role="alert"><AlertTriangle size={17} /><span>{error}</span></div>}
      {notice && <div className="notice" role="status"><CheckCircle2 size={17} /><span>{notice}</span></div>}
    </div>

    {selectedFarm && <>
      <div className="dashboard-grid">
        <div className="panel large-panel">
          <PanelTitle title="Crop health history" subtitle="Recorded health scores (0–100), newest first." />
          {records.length ? <div className="history-list">
            {records.map(record => <div className="history-row" key={record.id}>
              <span>{new Date(record.created_at + (record.created_at?.endsWith("Z") ? "" : "Z")).toLocaleDateString()}</span>
              <div className="progress-track"><div style={{ width: `${record.health_score}%` }} /></div>
              <strong>{record.health_score}/100</strong>
            </div>)}
          </div> : <div className="empty-state"><Activity size={32} /><strong>No crop health records yet</strong><p>Add the first observation using the form below. No sample history is shown.</p></div>}
        </div>
        <div className="panel">
          <PanelTitle title="Crop profile" subtitle="Details from your selected farm and latest saved observation." />
          <div className="profile-detail"><span>Farm</span><strong>{selectedFarm.farm_name}</strong></div>
          <div className="profile-detail"><span>Crop</span><strong>{selectedFarm.crop_name || "Not entered"}</strong></div>
          <div className="profile-detail"><span>Variety</span><strong>{profile?.variety || "Not recorded"}</strong></div>
          <div className="profile-detail"><span>Growth stage</span><strong>{profile?.growth_stage || "Not recorded"}</strong></div>
          <div className="profile-detail"><span>Data status</span><Status type={records.length ? "green" : "blue"}>{records.length ? "Database records" : "Awaiting first record"}</Status></div>
        </div>
      </div>

      <div className="panel">
        <PanelTitle title="Add crop health observation" subtitle="Enter an observation to store it in SQLite for this farm." />
        <form onSubmit={saveRecord}>
          <div className="form-grid">
            <label>Crop variety
              <input value={form.variety} onChange={e => setForm({ ...form, variety: e.target.value })} placeholder="e.g. Arka Rakshak" />
            </label>
            <label>Growth stage
              <input value={form.growth_stage} onChange={e => setForm({ ...form, growth_stage: e.target.value })} placeholder="e.g. Flowering" />
            </label>
            <label>Health score (0–100)
              <input type="number" min="0" max="100" step="1" required value={form.health_score} onChange={e => setForm({ ...form, health_score: e.target.value })} />
            </label>
            <label>Observation / notes
              <input value={form.notes} onChange={e => setForm({ ...form, notes: e.target.value })} placeholder="Describe visible crop condition" />
            </label>
          </div>
          <button type="submit" className="primary-button" disabled={saving}>{saving ? "Saving..." : "Save observation"}</button>
        </form>
      </div>

      {records.length > 0 && <div className="panel">
        <PanelTitle title="Recent observations" subtitle="Notes saved with each health score." />
        {records.map(record => <div className="profile-detail" key={`note-${record.id}`}>
          <span>{new Date(record.created_at + (record.created_at?.endsWith("Z") ? "" : "Z")).toLocaleString()}</span>
          <strong>{record.notes || "No notes entered"}</strong>
        </div>)}
      </div>}
    </>}
  </>;
}

/* ================= FARMING CALENDAR ================= */

function CalendarPage() {
  const events = [
    ["Today", "Inspect leaves for pest symptoms", "Crop monitoring"],
    ["Tomorrow", "Review irrigation requirement", "Irrigation"],
    ["12 Nov", "Check soil nutrient test", "Soil health"],
    ["15 Nov", "Review crop growth progress", "Crop monitoring"]
  ];
  return <div className="panel">
    <PanelTitle title="Farm activity calendar" subtitle="Example schedule — edit dates for your crop cycle." action={<button className="secondary-button" onClick={() => alert("Task creation will be connected next.")}><Plus size={15} /> Add task</button>} />
    <div className="calendar-list">{events.map(([date, title, category]) => <div className="calendar-event" key={title}><div className="event-date">{date}</div><div className="event-info"><strong>{title}</strong><span>{category}</span></div><Status type="green">Planned</Status></div>)}</div>
  </div>;
}

/* ================= FARMER CHATBOT ================= */

// Convert Markdown-style AI output into clean readable text.
// Removes visible **, *, #, backticks and markdown separators.
function cleanChatText(value) {
  return String(value || "")
    .replace(/```[\s\S]*?```/g, block =>
      block.replace(/```[^\n]*\n?/g, "").replace(/```/g, "")
    )
    .replace(/\r/g, "")
    .split("\n")
    .map(rawLine => {
      let line = rawLine.trim();
      line = line.replace(/^#{1,6}\s*/, "");
      line = line.replace(/^[-*+]\s+/, "• ");
      line = line.replace(/^\d+[.)]\s+/, match => `${match.trim()} `);
      line = line.replace(/\*\*(.*?)\*\*/g, "$1");
      line = line.replace(/__(.*?)__/g, "$1");
      line = line.replace(/(?<!\*)\*([^*]+)\*(?!\*)/g, "$1");
      line = line.replace(/(?<!_)_([^_]+)_(?!_)/g, "$1");
      line = line.replace(/`([^`]+)`/g, "$1");
      line = line.replace(/^\s*[-*_]{3,}\s*$/, "");
      line = line.replace(/\*+/g, "").replace(/_{2,}/g, "");
      line = line.replace(/^#+\s*/, "").replace(/\s{2,}/g, " ");
      return line;
    })
    .join("\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

function FormattedChatAnswer({ text }) {
  const cleanText = cleanChatText(text);
  return (
    <div className="formatted-chat-answer">
      {cleanText.split("\n").map((line, index) =>
        line.trim()
          ? <p key={index}>{line}</p>
          : <div key={index} style={{ height: 6 }} />
      )}
    </div>
  );
}

function ChatbotPage({ language, t }) {
  const STORAGE_KEY = "agropulse_farmer_chat_history_v1";
  const welcomeMessage = {
    from: "bot",
    text: "Namaste! I'm your AgroPulse AI farm assistant. Ask me about crop diseases, irrigation, soil nutrients, weather or farm planning. You can also attach a crop photo or soil report."
  };
  const [message, setMessage] = useState("");
  const [conversations, setConversations] = useState(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || "[]");
      return Array.isArray(saved) ? saved : [];
    } catch { return []; }
  });
  const [activeId, setActiveId] = useState(() => {
    try { return localStorage.getItem("agropulse_active_chat_v1") || ""; }
    catch { return ""; }
  });
  const [attachments, setAttachments] = useState([]);
  const [listening, setListening] = useState(false);
  const [loading, setLoading] = useState(false);
  const [voiceError, setVoiceError] = useState("");
  const [replyMode, setReplyMode] = useState("text");
  const [speaking, setSpeaking] = useState(false);
  const recognitionRef = useRef(null);
  const fileInputRef = useRef(null);

  const activeConversation = conversations.find(chat => chat.id === activeId);
  const messages = activeConversation?.messages || [welcomeMessage];

  useEffect(() => {
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(conversations)); }
    catch { setVoiceError("Browser storage is full. Remove some old conversations or attachments."); }
  }, [conversations]);

  useEffect(() => {
    try { if (activeId) localStorage.setItem("agropulse_active_chat_v1", activeId); }
    catch { /* Storage may be disabled. */ }
  }, [activeId]);

  function updateMessages(nextMessages, title) {
    setConversations(previous => {
      const exists = previous.some(chat => chat.id === activeId);
      if (exists) return previous.map(chat => chat.id === activeId
        ? { ...chat, title: chat.title === "New chat" ? (title || chat.title) : chat.title, updatedAt: Date.now(), messages: nextMessages }
        : chat);
      const id = activeId || `chat-${Date.now()}`;
      if (!activeId) setActiveId(id);
      return [{ id, title: title || "New chat", updatedAt: Date.now(), messages: nextMessages }, ...previous];
    });
  }

  function startNewChat() {
    stopListening();
    stopSpeaking();
    const id = `chat-${Date.now()}`;
    setActiveId(id);
    setMessage("");
    setAttachments([]);
    setVoiceError("");
    setConversations(previous => [{ id, title: "New chat", updatedAt: Date.now(), messages: [welcomeMessage] }, ...previous]);
  }

  function openConversation(id) {
    setActiveId(id);
    setMessage("");
    setAttachments([]);
    setVoiceError("");
  }

  function deleteConversation(id, event) {
    event?.stopPropagation();
    const remaining = conversations.filter(chat => chat.id !== id);
    setConversations(remaining);
    if (activeId === id) setActiveId(remaining[0]?.id || "");
  }

  function addFiles(fileList) {
    const files = Array.from(fileList || []);
    const allowed = ["image/jpeg", "image/png", "image/webp", "application/pdf", "text/plain"];
    const next = [];
    for (const file of files) {
      if (!allowed.includes(file.type)) {
        setVoiceError(`${file.name}: supported formats are JPG, PNG, WEBP, PDF and TXT.`);
        continue;
      }
      if (file.size > 8 * 1024 * 1024) {
        setVoiceError(`${file.name}: file must be smaller than 8 MB.`);
        continue;
      }
      next.push(file);
    }
    if (attachments.length + next.length > 4) {
      setVoiceError("You can attach up to 4 files per message.");
      return;
    }
    setAttachments(previous => [...previous, ...next]);
    setVoiceError("");
  }

  function fileToPayload(file) {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => {
        const dataUrl = String(reader.result || "");
        resolve({ name: file.name, mime_type: file.type || "application/octet-stream", data: dataUrl.split(",")[1] || "" });
      };
      reader.onerror = () => reject(new Error(`Could not read ${file.name}.`));
      reader.readAsDataURL(file);
    });
  }

  function speakText(text) {
    if (!("speechSynthesis" in window)) { setVoiceError("Voice output is not supported in this browser. Try Google Chrome."); return; }
    window.speechSynthesis.cancel();
    const speech = new SpeechSynthesisUtterance(cleanChatText(text));
    speech.lang = language; speech.rate = 0.9;
    speech.onstart = () => setSpeaking(true);
    speech.onend = () => setSpeaking(false);
    speech.onerror = () => setSpeaking(false);
    window.speechSynthesis.speak(speech);
  }
  function stopSpeaking() {
    if ("speechSynthesis" in window) window.speechSynthesis.cancel();
    setSpeaking(false);
  }
  function stopListening() {
    const recognition = recognitionRef.current;
    if (recognition) { try { recognition.stop(); } catch { /* already stopped */ } }
    recognitionRef.current = null; setListening(false);
  }
  function toggleListening() {
    if (listening) { stopListening(); return; }
    if (loading) return;
    const Recognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!Recognition) { setVoiceError("Speech recognition is not supported. Try Google Chrome."); return; }
    try {
      const recognition = new Recognition(); recognitionRef.current = recognition;
      recognition.lang = language; recognition.continuous = false; recognition.interimResults = true; recognition.maxAlternatives = 1;
      recognition.onstart = () => { setListening(true); setVoiceError(""); };
      recognition.onresult = event => {
        let transcript = "";
        for (let i = 0; i < event.results.length; i += 1) transcript += event.results[i]?.[0]?.transcript || "";
        if (transcript.trim()) setMessage(transcript.trim());
      };
      recognition.onerror = event => {
        setVoiceError(event?.error === "no-speech" ? "No speech detected. Please speak again." : event?.error === "not-allowed" ? "Microphone permission is blocked. Allow microphone access in browser settings." : "Could not recognize your voice. Please try again.");
        setListening(false); recognitionRef.current = null;
      };
      recognition.onend = () => { setListening(false); recognitionRef.current = null; };
      recognition.start();
    } catch { recognitionRef.current = null; setListening(false); setVoiceError("Unable to start voice recognition."); }
  }
  useEffect(() => () => {
    if (recognitionRef.current) { try { recognitionRef.current.abort(); } catch { /* ignore */ } }
    if ("speechSynthesis" in window) window.speechSynthesis.cancel();
  }, []);

  function chooseReplyMode(mode) {
    setReplyMode(mode); setVoiceError("");
    if (mode === "text") { stopListening(); stopSpeaking(); }
  }

  async function sendMessage() {
    const userMessage = message.trim();
    if ((!userMessage && !attachments.length) || loading) return;
    stopListening(); setMessage(""); setVoiceError(""); setLoading(true);
    const outgoingFiles = attachments;
    setAttachments([]);
    const userItem = { from: "user", text: userMessage || "Please analyse the attached file(s).", files: outgoingFiles.map(file => ({ name: file.name, type: file.type, preview: file.type.startsWith("image/") ? URL.createObjectURL(file) : "" })) };
    const previousMessages = messages;
    const nextMessages = [...previousMessages, userItem];
    updateMessages(nextMessages, userMessage.slice(0, 42) || outgoingFiles[0]?.name || "File analysis");
    const shouldSpeak = replyMode === "voice";
    try {
      const filePayloads = await Promise.all(outgoingFiles.map(fileToPayload));
      const history = previousMessages.filter(item => item.from === "user" || item.from === "bot").slice(-12).map(item => ({ role: item.from === "bot" ? "model" : "user", text: item.text }));
      const response = await askFarmerAssistant(userItem.text, { files: filePayloads, history });
      const answer = typeof response === "string" ? response : response?.answer || response?.reply || response?.response;
      if (!answer || typeof answer !== "string") throw new Error("The AI returned an empty response.");
      const cleanAnswer = cleanChatText(answer);
      updateMessages([...nextMessages, { from: "bot", text: cleanAnswer }], userItem.text.slice(0, 42));
      if (shouldSpeak) speakText(cleanAnswer);
    } catch (error) {
      const errorText = `Sorry, I couldn't get an AI response. ${error.message || "Check that the Flask backend is running."}`;
      updateMessages([...nextMessages, { from: "bot", text: errorText }], userItem.text.slice(0, 42));
      if (shouldSpeak) speakText(errorText);
    } finally { setLoading(false); }
  }

  return <div className="panel chat-panel ag-chat-shell">
    <style>{`.formatted-chat-answer{line-height:1.7;overflow-wrap:anywhere}.formatted-chat-answer p{margin:0 0 10px}.formatted-chat-answer p:last-child{margin-bottom:0}.chat-mode-selector{display:flex;gap:10px;flex-wrap:wrap;margin:14px 0}.chat-mode-selector button{min-width:150px}`}</style>
    <div className="ag-chat-top"><div><PanelTitle title={t.chat} subtitle="Your AI farming companion — ask, attach and explore." action={<Status type="green">Gemini AI</Status>} /></div><button className="primary-button" type="button" onClick={startNewChat}><MessageSquarePlus size={16}/> New Chat</button></div>
    <div className="ag-chat-layout">
      <aside className="ag-chat-history"><div className="ag-chat-history-title">Recent chats</div>
        {conversations.length === 0 && <p className="ag-chat-muted">Your conversations will appear here.</p>}
        {conversations.map(chat => <div key={chat.id} className={`ag-chat-history-row ${chat.id === activeId ? "active" : ""}`}><button type="button" onClick={() => openConversation(chat.id)}>{chat.title || "New chat"}<small>{new Date(chat.updatedAt).toLocaleDateString()}</small></button><button type="button" title="Delete chat" onClick={event => deleteConversation(chat.id, event)}><Trash2 size={14}/></button></div>)}
      </aside>
      <section className="ag-chat-main">
        <div className="chat-mode-selector" role="group" aria-label="Choose assistant type">
          <button type="button" className={replyMode === "text" ? "primary-button" : "secondary-button"} onClick={() => chooseReplyMode("text")} aria-pressed={replyMode === "text"}><MessageCircle size={17}/> Text Assistant</button>
          <button type="button" className={replyMode === "voice" ? "primary-button" : "secondary-button"} onClick={() => chooseReplyMode("voice")} aria-pressed={replyMode === "voice"}><Volume2 size={17}/> Voice Assistant</button>
          {speaking && <button type="button" className="secondary-button" onClick={stopSpeaking}>Stop speaking</button>}
        </div>
        <div className="chat-messages ag-chat-messages">
          {messages.map((item, index) => <div className={`chat-message ${item.from}`} key={`${activeId}-${index}`}>
            <div className="chat-avatar">{item.from === "bot" ? <Sprout size={17}/> : "You"}</div>
            <div className="chat-answer"><FormattedChatAnswer text={item.text}/>
              {item.files?.length > 0 && <div className="ag-chat-file-list">{item.files.map((file, i) => <div className="ag-chat-file" key={i}>{file.preview ? <img src={file.preview} alt={file.name}/> : <FileText size={18}/>}<span>{file.name}</span></div>)}</div>}
            </div>
            {item.from === "bot" && <button className="voice-small-button" onClick={() => speakText(item.text)} aria-label="Read this answer aloud" title="Read this answer aloud"><Volume2 size={17}/></button>}
          </div>)}
          {loading && <div className="chat-message bot"><div className="chat-avatar"><Sprout size={17}/></div><p>AgroPulse AI is analysing your question...</p></div>}
        </div>
        {attachments.length > 0 && <div className="ag-chat-pending-files">{attachments.map((file, i) => <div key={`${file.name}-${i}`}><span>{file.type.startsWith("image/") ? "🖼️" : "📄"} {file.name}</span><button type="button" onClick={() => setAttachments(previous => previous.filter((_, index) => index !== i))} aria-label={`Remove ${file.name}`}><XCircle size={16}/></button></div>)}</div>}
        <div className="chat-input ag-chat-composer">
          <input ref={fileInputRef} type="file" accept="image/jpeg,image/png,image/webp,application/pdf,text/plain" multiple hidden onChange={event => { addFiles(event.target.files); event.target.value = ""; }}/>
          <button type="button" className="secondary-button" onClick={() => fileInputRef.current?.click()} disabled={loading} title="Attach image or document"><Paperclip size={18}/></button>
          <input value={message} onChange={event => setMessage(event.target.value)} onKeyDown={event => { if (event.key === "Enter" && !event.shiftKey) { event.preventDefault(); sendMessage(); } }} placeholder={replyMode === "voice" ? "Speak using the microphone or type your question..." : t.chatPlaceholder} disabled={loading} aria-label={t.chatPlaceholder}/>
          {replyMode === "voice" && <button type="button" className={`secondary-button voice-button${listening ? " voice-button-active" : ""}`} onClick={toggleListening} disabled={loading} title={listening ? "Turn microphone off" : "Start voice input"} aria-pressed={listening}>{listening ? <MicOff size={18}/> : <Mic size={18}/>}<span>{listening ? "Listening..." : "Speak"}</span></button>}
          <button className="primary-button" onClick={sendMessage} disabled={(!message.trim() && !attachments.length) || loading} aria-label="Send message">{loading ? <RefreshCw size={17}/> : <Send size={17}/>}</button>
        </div>
        <p className="ag-chat-hint">Attach up to 4 files (JPG, PNG, WEBP, PDF or TXT; 8 MB each). Your chat history is saved in this browser.</p>
        {listening && <p className="voice-status"><Mic size={15}/> Listening — speak your question now.</p>}
        {voiceError && <div className="notice"><AlertTriangle size={17}/><span>{voiceError}</span></div>}
        <p className="helper-text">AI-generated advice may not be accurate for every farm. Verify important crop treatment and fertilizer decisions with a local agricultural expert.</p>
      </section>
    </div>
  </div>;
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

  return <div className="dashboard-grid">
    <div className="panel">
      <PanelTitle title="Farm profit calculator" subtitle="Enter your own estimates." />
      <div className="input-stack">
        <label>Farm area (acres)<input type="number" min="0" value={area} onChange={e => setArea(Math.max(0, Number(e.target.value)))} /></label>
        <label>Expected yield (quintals/acre)<input type="number" min="0" value={yieldPerAcre} onChange={e => setYieldPerAcre(Math.max(0, Number(e.target.value)))} /></label>
        <label>Price per quintal (₹)<input type="number" min="0" value={price} onChange={e => setPrice(Math.max(0, Number(e.target.value)))} /></label>
        <label>Input cost per acre (₹)<input type="number" min="0" value={cost} onChange={e => setCost(Math.max(0, Number(e.target.value)))} /></label>
      </div>
    </div>
    <div className="panel">
      <PanelTitle title="Estimated financial summary" subtitle="Calculated from your inputs" />
      <div className="finance-result"><span>Estimated revenue</span><strong>₹{revenue.toLocaleString("en-IN")}</strong></div>
      <div className="finance-result"><span>Total input cost</span><strong>₹{totalCost.toLocaleString("en-IN")}</strong></div>
      <div className="finance-total"><span>Estimated profit</span><strong className={profit >= 0 ? "profit-positive" : "profit-negative"}>₹{profit.toLocaleString("en-IN")}</strong></div>
      <div className="notice"><IndianRupee size={17} /><span>Illustrative estimate only. Actual prices, yield and costs may differ.</span></div>
    </div>
  </div>;
}

/* ================= YIELD PREDICTOR ================= */

function YieldPage() {
  const [area, setArea] = useState(2);
  const [yieldValue, setYieldValue] = useState(12);
  return <div className="dashboard-grid">
    <div className="panel">
      <PanelTitle title="Yield estimate inputs" subtitle="Enter a baseline yield estimate." />
      <div className="input-stack">
        <label>Crop<select defaultValue="tomato"><option value="tomato">Tomato</option><option>Maize</option><option>Rice</option><option>Chilli</option></select></label>
        <label>Farm area (acres)<input type="number" min="0" value={area} onChange={e => setArea(Math.max(0, Number(e.target.value)))} /></label>
        <label>Baseline yield (quintals/acre)<input type="number" min="0" value={yieldValue} onChange={e => setYieldValue(Math.max(0, Number(e.target.value)))} /></label>
      </div>
    </div>
    <div className="panel yield-result">
      <TrendingUp size={35} /><span>Baseline yield estimate</span>
      <strong>{(area * yieldValue).toFixed(1)} <small>quintals</small></strong>
      <p>Based only on the values entered. This is not an AI prediction.</p>
      <div className="notice"><AlertTriangle size={17} /><span>Connect historical yield data and regional datasets before presenting a predictive result.</span></div>
    </div>
  </div>;
}

/* ================= NUTRIENT ADVISOR ================= */


/* ================= HELP & SUPPORT ================= */

function HelpSupportPage({ setActive }) {
  const helpItems = [
    { title: "Dashboard", description: "View your farm overview, crop indicators, weather summary and suggested activities.", section: "Dashboard", icon: LayoutDashboard },
    { title: "Weather", description: "Check weather and forecasts. Allow browser location access.", section: "Weather", icon: CloudSun },
    { title: "Crop Doctor", description: "Upload a crop image for AI assessment and a PDF report.", section: "Crop Doctor", icon: Scan },
    { title: "Smart Irrigation", description: "Configure irrigation settings and review water estimates.", section: "Smart Irrigation", icon: Droplets },
    { title: "Satellite Monitoring", description: "Search satellite product catalogues using farm coordinates.", section: "Satellite Monitoring", icon: Satellite },
    { title: "Nutrient Advisor", description: "Enter your crop and soil nutrient levels.", section: "Nutrient Advisor", icon: FlaskConical },
    { title: "Crop Health Tracker", description: "View crop health history and crop profile.", section: "Crop Health Tracker", icon: Activity },
    { title: "Farming Calendar", description: "Review suggested farm activities and management tasks.", section: "Farming Calendar", icon: CalendarDays },
    { title: "Farmer Chatbot", description: "Ask farming questions using text or supported voice features.", section: "Farmer Chatbot", icon: MessageCircle },
    { title: "Profit Calculator", description: "Estimate revenue, costs and potential profit.", section: "Profit Calculator", icon: Wallet },
    { title: "Yield Predictor", description: "Calculate a baseline yield from area and expected yield per acre.", section: "Yield Predictor", icon: TrendingUp }
  ];

  return <div className="help-support-page">
    <div className="panel">
      <PanelTitle title="Welcome to AgroPulse AI Support" subtitle="Find instructions for using your farm management tools." />
      <p>Choose a feature below to learn how it works. Open the corresponding page directly from this support section.</p>
      <div className="notice"><CircleHelp size={20} /><span>If a feature does not load, check that your Flask backend is running and that your browser can connect to it.</span></div>
    </div>
    <div className="dashboard-grid">
      {helpItems.map(item => {
        const Icon = item.icon;
        return <div className="panel" key={item.section}>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 12 }}><div className="metric-icon"><Icon size={21} /></div><h3 style={{ margin: 0 }}>{item.title}</h3></div>
          <p>{item.description}</p>
          <button type="button" className="text-action" onClick={() => setActive(item.section)}>Open {item.title} <ArrowUpRight size={16} /></button>
        </div>;
      })}
    </div>
    <div className="panel">
      <PanelTitle title="Troubleshooting" subtitle="Solutions to common problems" />
      <div className="profile-detail"><strong>Location is not detected</strong><p>Use localhost or HTTPS, allow location access in your browser, and refresh the Weather page.</p></div>
      <div className="profile-detail"><strong>Crop Doctor cannot analyze an image</strong><p>Check that Flask is running, your Gemini API key is configured, and the image is a supported format smaller than 8 MB.</p></div>
      <div className="profile-detail"><strong>Farmer Chatbot does not respond</strong><p>Check the backend connection, API configuration and terminal output for errors.</p></div>
      <div className="profile-detail"><strong>Smart Irrigation shows no farms</strong><p>Add a farm using your farm management functionality and ensure that its coordinates are valid.</p></div>
      <div className="notice"><AlertTriangle size={18} /><span>Crop diagnoses and agricultural calculations are advisory. Verify important decisions with a qualified agricultural expert.</span></div>
    </div>
  </div>;
}

/* ================= SETTINGS ================= */

function SettingsPage({ user, languageKey, setLanguageKey, mode, setMode, handleLogout }) {
  return <div className="dashboard-grid">
    <div className="panel">
      <PanelTitle title="Application Settings" subtitle="Manage your AgroPulse AI preferences." />
      <div className="input-stack">
        <label>Display language<select value={languageKey} onChange={e => setLanguageKey(e.target.value)}>{languageOptions.map(item => <option key={item.key} value={item.key}>{item.label}</option>)}</select></label>
        <label>Application mode<select value={mode} onChange={e => setMode(e.target.value)}><option value="farmer">Farmer Mode</option><option value="technical">Technical Mode</option></select></label>
      </div>
      <p className="helper-text">Your language and mode preferences are saved in this browser.</p>
    </div>
    <div className="panel">
      <PanelTitle title="Account Information" subtitle="Currently signed-in user." />
      <div className="profile-detail"><span>Name</span><strong>{user?.name || "Farm User"}</strong></div>
      <div className="profile-detail"><span>Email</span><strong>{user?.email || "Not provided"}</strong></div>
      <div className="profile-detail"><span>Application</span><strong>AgroPulse AI</strong></div>
      <button type="button" className="primary-button" style={{ marginTop: 20 }} onClick={handleLogout}><LogOut size={17} /> Log out</button>
    </div>
    <div className="panel">
      <PanelTitle title="About AgroPulse AI" subtitle="Farm management and agricultural advisory." />
      <p>AgroPulse AI brings together weather information, crop image analysis, irrigation estimates, satellite catalogue searches, nutrient guidance and farm planning tools.</p>
      <p className="helper-text">Some indicators and calculations use illustrative or manually configured values. Check each feature's data limitations.</p>
    </div>
  </div>;
}

/* ================= SECTION ROUTER ================= */

function SectionContent({ active, setActive, mode, language, t, locationName, deviceWeather, locationError, locationLoading, refreshDeviceLocation, user, languageKey, setLanguageKey, setMode, handleLogout }) {
  switch (active) {
    case "Dashboard": return <Dashboard setActive={setActive} mode={mode} t={t} locationName={locationName} deviceWeather={deviceWeather} />;
    case "Weather": return <WeatherPage locationName={locationName} deviceWeather={deviceWeather} locationError={locationError} locationLoading={locationLoading} refreshDeviceLocation={refreshDeviceLocation} />;
    case "Crop Doctor": return <CropDoctor />;
    case "Smart Irrigation": return <IrrigationPage />;
    case "Satellite Monitoring": return <SatellitePage />;
    case "Nutrient Advisor": return <NutrientAdvisor />;
    case "Crop Health Tracker": return <HealthPage />;
    case "Farming Calendar": return <CalendarPage />;
    case "Farmer Chatbot": return <ChatbotPage language={language} t={t} />;
    case "Profit Calculator": return <ProfitPage />;
    case "Yield Predictor": return <YieldPage />;
    case "Help & Support": return <HelpSupportPage setActive={setActive} />;
    case "Settings": return <SettingsPage user={user} languageKey={languageKey} setLanguageKey={setLanguageKey} mode={mode} setMode={setMode} handleLogout={handleLogout} />;
    default: return <div className="panel"><BarChart3 /><p>Section not found.</p><button className="primary-button" onClick={() => setActive("Dashboard")}>Return to Dashboard</button></div>;
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

  const [active, setActive] = useState(() => localStorage.getItem("agropulse-active-page") || "Dashboard");
  const [languageKey, setLanguageKey] = useState(() => localStorage.getItem("agropulse-language") || "en");
  const [mode, setMode] = useState(() => localStorage.getItem("agropulse-mode") || "farmer");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [search, setSearch] = useState("");
  const [locationName, setLocationName] = useState("Detecting your current location...");
  const [deviceWeather, setDeviceWeather] = useState(null);
  const [locationError, setLocationError] = useState("");
  const [locationLoading, setLocationLoading] = useState(true);
  // Exposes the single shared GPS update handler to the manual refresh button.
  const updateLocationFromPointRef = useRef(null);
  const manualLocationOverrideRef = useRef(false);
  const [farms, setFarms] = useState([]);
  const [selectedFarmId, setSelectedFarmId] = useState(() => localStorage.getItem("agropulse-selected-farm") || "");
  const [farmMenuOpen, setFarmMenuOpen] = useState(false);
  const [farmFormOpen, setFarmFormOpen] = useState(false);
  const [farmSaving, setFarmSaving] = useState(false);
  const [geocodeLoading, setGeocodeLoading] = useState(false);
  const [geocodeResults, setGeocodeResults] = useState([]);
  const [geocodeMessage, setGeocodeMessage] = useState("");
  const [farmError, setFarmError] = useState("");
  const [farmSuccess, setFarmSuccess] = useState("");
  const [farmForm, setFarmForm] = useState({
    farmer_name: "",
    farm_name: "",
    location: "",
    crop_name: "",
    area_acres: "",
    latitude: "",
    longitude: ""
  });

  const selectedFarm = farms.find(farm => String(farm.id) === String(selectedFarmId)) || farms[0] || null;

  async function loadFarmList() {
    try {
      const response = await fetch(`${API_URL}/api/farms`);
      const data = await response.json();
      if (!response.ok || !data.success) throw new Error(data.message || "Unable to load farms.");
      const loadedFarms = Array.isArray(data.farms) ? data.farms : [];
      setFarms(loadedFarms);
      if (loadedFarms.length) {
        const savedExists = loadedFarms.some(farm => String(farm.id) === String(selectedFarmId));
        const nextId = savedExists ? String(selectedFarmId) : String(loadedFarms[0].id);
        setSelectedFarmId(nextId);
        localStorage.setItem("agropulse-selected-farm", nextId);
      } else {
        setSelectedFarmId("");
        localStorage.removeItem("agropulse-selected-farm");
      }
    } catch (error) {
      console.error("Farm loading failed:", error);
      setFarmError(error.message || "Unable to connect to the farm service.");
    }
  }

  async function findFarmCoordinates() {
    const query = farmForm.location.trim();
    setFarmError("");
    setGeocodeMessage("");
    setGeocodeResults([]);

    if (query.length < 3) {
      setFarmError("Enter a village, town or full address (at least 3 characters) first.");
      return;
    }

    try {
      setGeocodeLoading(true);
      const response = await fetch(`${API_URL}/api/geocode?q=${encodeURIComponent(query)}`);
      const data = await response.json();
      if (!response.ok || !data.success) {
        throw new Error(data.message || "Could not find this location.");
      }
      if (!Array.isArray(data.results) || data.results.length === 0) {
        throw new Error("No matching location found. Add the district and state, then try again.");
      }

      setGeocodeResults(data.results);
      const first = data.results[0];
      setFarmForm(previous => ({
        ...previous,
        latitude: String(first.latitude),
        longitude: String(first.longitude)
      }));
      setGeocodeMessage(`Matched location: ${first.display_name}. Please verify that this is your farm area.`);
    } catch (error) {
      setFarmError(error.message || "Location search failed. Check that the Flask backend is running.");
    } finally {
      setGeocodeLoading(false);
    }
  }

  function selectGeocodeResult(index) {
    const place = geocodeResults[Number(index)];
    if (!place) return;
    setFarmForm(previous => ({
      ...previous,
      latitude: String(place.latitude),
      longitude: String(place.longitude)
    }));
    setGeocodeMessage(`Selected location: ${place.display_name}. Please verify that this is your farm area.`);
  }

  async function saveFarm(event) {
    event.preventDefault();
    setFarmError("");
    setFarmSuccess("");

    const latitude = Number(farmForm.latitude);
    const longitude = Number(farmForm.longitude);
    const area = Number(farmForm.area_acres);

    if (!farmForm.farmer_name.trim() || !farmForm.farm_name.trim() || !farmForm.crop_name.trim()) {
      setFarmError("Please fill in farmer name, farm name and crop name.");
      return;
    }
    if (!Number.isFinite(area) || area <= 0) {
      setFarmError("Enter a valid farm area greater than zero.");
      return;
    }
    if (farmForm.latitude.trim() === "" || farmForm.longitude.trim() === "" || !Number.isFinite(latitude) || !Number.isFinite(longitude) || latitude < -90 || latitude > 90 || longitude < -180 || longitude > 180) {
      setFarmError("Enter valid latitude and longitude so Satellite Monitoring can locate your farm.");
      return;
    }

    try {
      setFarmSaving(true);
      const response = await fetch(`${API_URL}/api/farms`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          farmer_name: farmForm.farmer_name.trim(),
          farm_name: farmForm.farm_name.trim(),
          location: farmForm.location.trim(),
          crop_name: farmForm.crop_name.trim(),
          area_acres: area,
          latitude,
          longitude
        })
      });
      const data = await response.json();
      if (!response.ok || !data.success) throw new Error(data.message || "Farm could not be saved.");
      await loadFarmList();
      if (data.farm_id != null) {
        setSelectedFarmId(String(data.farm_id));
        localStorage.setItem("agropulse-selected-farm", String(data.farm_id));
      }
      setFarmSuccess("Farm added successfully.");
      setFarmForm({ farmer_name: user?.name || "", farm_name: "", location: "", crop_name: "", area_acres: "", latitude: "", longitude: "" });
      setFarmFormOpen(false);
      setFarmMenuOpen(false);
    } catch (error) {
      setFarmError(error.message || "Unable to save farm. Check that the Flask backend is running.");
    } finally {
      setFarmSaving(false);
    }
  }

  useEffect(() => { loadFarmList(); }, []);

  // One shared live-device tracker powers BOTH Dashboard and Weather.
  // It never reads farm coordinates or a previously saved location.
  useEffect(() => {
    if (!navigator.geolocation) {
      setLocationName("Device location is not supported by this browser");
      setLocationError("Use a browser with location support and allow device location access.");
      setLocationLoading(false);
      return undefined;
    }

    let cancelled = false;
    let lastGeocodedPoint = null;
    let lastWeatherPoint = null;
    let lastWeatherFetch = 0;
    let geocodeBusy = false;
    let lastGeocodeRequestAt = 0;
    let weatherBusy = false;
    let newestPoint = null;

    const distanceMetres = (a, b) => {
      if (!a || !b) return Infinity;
      const rad = value => value * Math.PI / 180;
      const dLat = rad(b.latitude - a.latitude);
      const dLon = rad(b.longitude - a.longitude);
      const lat1 = rad(a.latitude);
      const lat2 = rad(b.latitude);
      const h = Math.sin(dLat / 2) ** 2 + Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLon / 2) ** 2;
      return 6371000 * 2 * Math.asin(Math.sqrt(h));
    };

    const reverseGeocode = async point => {
      const fallback = `Current device position (${point.latitude.toFixed(5)}, ${point.longitude.toFixed(5)})`;
      const controller = new AbortController();
      const timeoutId = window.setTimeout(() => controller.abort(), 8000);

      try {
        // Use the actual GPS point for a detailed reverse lookup. The previous
        // provider could return a broad administrative locality (for example,
        // Yelahanka) instead of the nearby neighbourhood.
        const params = new URLSearchParams({
          format: "jsonv2",
          lat: String(point.latitude),
          lon: String(point.longitude),
          zoom: "18",
          addressdetails: "1",
          "accept-language": "en"
        });

        const response = await fetch(
          `https://nominatim.openstreetmap.org/reverse?${params.toString()}`,
          {
            signal: controller.signal,
            headers: { Accept: "application/json" }
          }
        );

        if (!response.ok) {
          throw new Error("Could not convert GPS coordinates to a place name.");
        }

        const place = await response.json();
        const address = place.address || {};

        // Prefer the nearest named neighbourhood/locality over a broad
        // administrative area, then add the city/state for context.
        const locality =
          address.neighbourhood ||
          address.suburb ||
          address.quarter ||
          address.village ||
          address.hamlet ||
          address.town ||
          address.city_district ||
          address.city ||
          address.county;

        const city =
          address.city ||
          address.town ||
          address.municipality ||
          address.county;

        const state = address.state;
        const country = address.country;

        const parts = [locality, city, state, country]
          .filter(Boolean)
          .filter((value, index, array) => array.indexOf(value) === index);

        return parts.join(", ") || place.display_name || fallback;
      } finally {
        window.clearTimeout(timeoutId);
      }
    };

    const updateFromPoint = async point => {
      if (manualLocationOverrideRef.current) return;
      newestPoint = point;
      setLocationLoading(false);
      setLocationError("");

      // Resolve the place name in the background. Do not make weather wait
      // for reverse-geocoding; show coordinates immediately after the GPS fix.
      if (!geocodeBusy && Date.now() - lastGeocodeRequestAt >= 1100 && distanceMetres(lastGeocodedPoint, point) >= 150) {
        geocodeBusy = true;
        lastGeocodeRequestAt = Date.now();
        const pointBeingResolved = point;
        setLocationName(`Current device position (${point.latitude.toFixed(5)}, ${point.longitude.toFixed(5)})`);
        (async () => {
          try {
            const name = await reverseGeocode(pointBeingResolved);
            if (!cancelled && newestPoint && distanceMetres(pointBeingResolved, newestPoint) < 500) {
              setLocationName(name);
              lastGeocodedPoint = pointBeingResolved;
            }
          } catch {
            // Keep the live GPS coordinates as the location label if lookup fails.
          } finally {
            geocodeBusy = false;
          }
        })();
      }

      // Weather is refreshed on first GPS fix, after 500 m movement, or every
      // 10 minutes. Small GPS drift does not trigger unnecessary API requests.
      const moved = distanceMetres(lastWeatherPoint, point) >= 500;
      const timeDue = Date.now() - lastWeatherFetch >= 10 * 60 * 1000;
      if (!weatherBusy && (!lastWeatherPoint || moved || timeDue)) {
        weatherBusy = true;
        const pointBeingFetched = point;
        lastWeatherFetch = Date.now();
        try {
          const data = await getWeather(pointBeingFetched.latitude, pointBeingFetched.longitude);
          if (!cancelled && newestPoint && distanceMetres(pointBeingFetched, newestPoint) < 1500) {
            setDeviceWeather({
              current: data.current || {},
              daily: data.daily || {},
              fetchedAt: Date.now(),
              coordinates: pointBeingFetched
            });
            lastWeatherPoint = pointBeingFetched;
          }
        } catch (error) {
          if (!cancelled) setLocationError(`Weather could not be refreshed: ${error.message || "Please try again."}`);
        } finally {
          weatherBusy = false;
        }
      }
    };

    // Keep the same handler for watchPosition, manual refresh, and the
    // periodic location check. This ensures Dashboard and Weather always
    // receive exactly the same fresh coordinates.
    updateLocationFromPointRef.current = updateFromPoint;

    const handlePosition = position => {
      if (cancelled) return;
      const point = {
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
        accuracy: position.coords.accuracy
      };
      updateFromPoint(point);
    };

    // Ask for a position immediately instead of waiting for the first watch
    // callback or the old 20-second polling interval.
    navigator.geolocation.getCurrentPosition(
      handlePosition,
      error => {
        if (!cancelled) {
          setLocationLoading(false);
          setLocationError(
            error.code === 1
              ? "Location permission denied. Allow location access for localhost."
              : error.code === 2
                ? "Device location is unavailable. Check Windows Location Services and Wi-Fi."
                : "Location is taking longer than expected. The live tracker is still trying."
          );
        }
      },
      { enableHighAccuracy: true, timeout: 20000, maximumAge: 0 }
    );

    const watchId = navigator.geolocation.watchPosition(
      handlePosition,
      error => {
        if (cancelled) return;
        setLocationLoading(false);
        setLocationError(
          error.code === 1
            ? "Location permission denied. Allow location access for localhost in your browser."
            : error.code === 2
              ? "Device location is unavailable. Turn on Windows Location Services and check Wi-Fi/GPS."
              : "Device location timed out. Keep the app open and try Refresh device location."
        );
        setLocationName("Waiting for live device location");
      },
      { enableHighAccuracy: true, timeout: 20000, maximumAge: 0 }
    );

    // Some desktop location providers do not emit watchPosition callbacks
    // promptly. Poll for a fresh fix as a fallback while the app is open.
    const locationPollId = window.setInterval(() => {
      if (cancelled) return;
      navigator.geolocation.getCurrentPosition(
        handlePosition,
        () => {},
        { enableHighAccuracy: true, timeout: 20000, maximumAge: 0 }
      );
    }, 10000);

    return () => {
      cancelled = true;
      updateLocationFromPointRef.current = null;
      navigator.geolocation.clearWatch(watchId);
      window.clearInterval(locationPollId);
    };
  }, []);

  // Force a new browser location fix and immediately pass its coordinates
  // into the shared tracker. Do not wait for a separate watchPosition event.
  function refreshDeviceLocation() {
    manualLocationOverrideRef.current = false;
    if (!navigator.geolocation) {
      setLocationError("This browser does not support device location.");
      return;
    }
    setLocationLoading(true);
    setLocationError("");
    navigator.geolocation.getCurrentPosition(
      position => {
        const point = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          accuracy: position.coords.accuracy
        };
        if (updateLocationFromPointRef.current) {
          updateLocationFromPointRef.current(point);
        } else {
          setLocationLoading(false);
          setLocationError("Live location tracker is still starting. Please try again.");
        }
      },
      error => {
        setLocationLoading(false);
        setLocationError(
          error.code === 1
            ? "Location permission denied. Allow location access for this site."
            : error.code === 2
              ? "Device location is unavailable. Check Windows Location Services."
              : "Could not get a fresh location. Please try again."
        );
      },
      { enableHighAccuracy: true, timeout: 20000, maximumAge: 0 }
    );
  }

  const selectedLanguage = languageOptions.find(item => item.key === languageKey) || languageOptions[0];
  const language = selectedLanguage.code;

  // Keep React's source text in English and let the page translator translate
  // every visible module, including dynamically rendered content and forms.
  // This avoids translating only the small set of labels in the old dictionary.
  const t = translations.en;

  // Local UI translation: no hidden third-party widget or API key is required.
  // React-rendered text and newly-mounted module content are translated from
  // the bundled phrase dictionary; user-entered values and farm names are left alone.
  useEffect(() => {
    const dictionaries = UI_TRANSLATIONS[languageKey] || UI_TRANSLATIONS.en;
    const translateElement = root => {
      if (!root) return;
      const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
      const nodes = [];
      while (walker.nextNode()) nodes.push(walker.currentNode);
      nodes.forEach(node => {
        const parent = node.parentElement;
        if (!parent || parent.closest('script,style,textarea,input,select,option,[contenteditable="true"],.user-entered,.chat-message')) return;
        const original = node.nodeValue;
        const trimmed = original.trim();
        if (!trimmed) return;
        const translated = dictionaries[trimmed];
        if (translated && translated !== trimmed) {
          const leading = original.match(/^\s*/)?.[0] || '';
          const trailing = original.match(/\s*$/)?.[0] || '';
          node.nodeValue = leading + translated + trailing;
        }
      });
      root.querySelectorAll?.('input[placeholder],textarea[placeholder],[aria-label],[title]').forEach(el => {
        ['placeholder','aria-label','title'].forEach(attr => {
          const value = el.getAttribute(attr);
          if (value && dictionaries[value]) el.setAttribute(attr, dictionaries[value]);
        });
      });
    };
    const appRoot = document.querySelector('.app-shell') || document.body;
    translateElement(appRoot);
    const observer = new MutationObserver(records => {
      records.forEach(record => {
        if (record.type === 'characterData') {
          const node = record.target;
          const value = node.nodeValue?.trim();
          if (value && dictionaries[value] && !node.parentElement?.closest('input,textarea,select,option,.chat-message')) node.nodeValue = node.nodeValue.replace(value, dictionaries[value]);
        }
        record.addedNodes.forEach(node => {
          if (node.nodeType === Node.ELEMENT_NODE) translateElement(node);
          else if (node.nodeType === Node.TEXT_NODE) {
            const value = node.nodeValue?.trim();
            if (value && dictionaries[value] && !node.parentElement?.closest('input,textarea,select,option,.chat-message')) node.nodeValue = node.nodeValue.replace(value, dictionaries[value]);
          }
        });
      });
    });
    observer.observe(appRoot, { childList: true, characterData: true, subtree: true });
    return () => observer.disconnect();
  }, [languageKey, active]);

  useEffect(() => { localStorage.setItem("agropulse-active-page", active); }, [active]);
  useEffect(() => { localStorage.setItem("agropulse-language", languageKey); }, [languageKey]);
  useEffect(() => { localStorage.setItem("agropulse-mode", mode); }, [mode]);

  function handleLogin(userData) {
    localStorage.setItem("agropulse-user", JSON.stringify(userData));
    setUser(userData);
  }

  function handleLogout() {
    localStorage.removeItem("agropulse-user");
    localStorage.removeItem("agropulse-active-page");
    setUser(null);
    setActive("Dashboard");
    setSidebarOpen(false);
  }

  function navigateTo(section) {
    setActive(section);
    setSidebarOpen(false);
    setSearch("");
  }

  if (!user) return <Login onLogin={handleLogin} />;

  const filteredNavigation = navigation.filter(item => item.name.toLowerCase().includes(search.toLowerCase()));

  return <div className={`app-shell ${mode === "farmer" ? "farmer-mode" : "technical-mode"}`}>
    <style>{`
      .app-shell select {
        color: #f4f8f4 !important;
        background-color: #102019 !important;
        border: 1px solid #45634f !important;
        border-radius: 9px !important;
        min-height: 40px;
        padding: 8px 34px 8px 12px !important;
        color-scheme: dark;
        font: inherit;
        line-height: 1.35;
        max-width: 100%;
        outline: none;
      }
      .app-shell select:focus {
        border-color: #a8e83f !important;
        box-shadow: 0 0 0 2px rgba(168, 232, 63, 0.18);
      }
      .app-shell select option {
        color: #f4f8f4 !important;
        background: #102019 !important;
      }
      .app-shell select:disabled {
        color: #9eafa3 !important;
        background-color: #17271e !important;
        opacity: 0.75;
      }
    `}</style>
    <GoogleTranslateRuntime language={languageKey} />
    {sidebarOpen && <div className="mobile-overlay" onClick={() => setSidebarOpen(false)} />}

    <aside className={`sidebar ${sidebarOpen ? "sidebar-open" : ""}`}>
      <div className="brand">
        <div className="brand-icon"><Sprout size={25} /></div>
        <div><strong>AgroPulse<span>AI</span></strong><small>PRECISION AGRICULTURE</small></div>
        <button className="close-sidebar" onClick={() => setSidebarOpen(false)} aria-label="Close menu"><X /></button>
      </div>

      <div style={{ position: "relative", marginBottom: 26 }}>
        <button
          type="button"
          className="farm-switcher"
          onClick={() => { setFarmMenuOpen(open => !open); setFarmError(""); setFarmSuccess(""); }}
          aria-expanded={farmMenuOpen}
          style={{ width: "100%", color: "inherit", textAlign: "left", cursor: "pointer", font: "inherit" }}
        >
          <div className="farm-avatar"><Leaf size={19} /></div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <strong style={{ display: "block", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{selectedFarm?.farm_name || "Add Your Farm"}</strong>
            <span>{selectedFarm ? `${selectedFarm.crop_name} · Farm workspace` : "No farm registered yet"}</span>
          </div>
          <ChevronDown size={16} />
        </button>
        {farmMenuOpen && <div style={{ position: "absolute", top: "calc(100% + 8px)", left: 0, right: 0, zIndex: 100, padding: 10, border: "1px solid rgba(190,220,190,.16)", borderRadius: 12, background: "#17251b", boxShadow: "0 14px 35px rgba(0,0,0,.4)" }}>
          <strong style={{ display: "block", padding: "5px 7px 9px", fontSize: 11, color: "#a3e635" }}>YOUR FARMS</strong>
          {farms.length ? farms.map(farm => <button key={farm.id} type="button" onClick={() => { setSelectedFarmId(String(farm.id)); localStorage.setItem("agropulse-selected-farm", String(farm.id)); setFarmMenuOpen(false); }} style={{ width: "100%", display: "block", padding: "9px 8px", marginBottom: 4, border: 0, borderRadius: 8, textAlign: "left", color: "#e8eee9", background: String(selectedFarmId) === String(farm.id) ? "rgba(163,230,53,.13)" : "transparent" }}>
            <strong style={{ display: "block", fontSize: 11 }}>{farm.farm_name}</strong><span style={{ display: "block", marginTop: 3, color: "#91a095", fontSize: 10 }}>{farm.crop_name} · {farm.area_acres} acres</span>
          </button>) : <p style={{ padding: "4px 7px", color: "#91a095", fontSize: 10 }}>No farms registered yet.</p>}
          <button type="button" className="primary-button full-button" onClick={() => { setFarmForm({ farmer_name: user?.name || "", farm_name: "", location: "", crop_name: "", area_acres: "", latitude: "", longitude: "" }); setFarmError(""); setFarmMenuOpen(false); setFarmFormOpen(true); }}><Plus size={15} /> Add Farm</button>
          {farmError && <p style={{ color: "#fca5a5", fontSize: 10, lineHeight: 1.5, margin: "8px 3px 2px" }}>{farmError}</p>}
          {farmSuccess && <p style={{ color: "#a3e635", fontSize: 10, margin: "8px 3px 2px" }}>{farmSuccess}</p>}
        </div>}
      </div>

      <div className="nav-label">{t.workspace}</div>
      <div className="sidebar-search"><Search size={15} /><input value={search} onChange={e => setSearch(e.target.value)} placeholder={t.search} aria-label={t.search} /></div>

      <nav className="side-navigation">
        {filteredNavigation.map(item => {
          const Icon = item.icon;
          return <button key={item.name} className={`nav-item ${active === item.name ? "active" : ""}`} onClick={() => navigateTo(item.name)}>
            <Icon size={18} /><span>{item.name === "Dashboard" ? t.dashboard : item.name}</span>{active === item.name && <i />}
          </button>;
        })}
      </nav>

      <div className="sidebar-bottom">
        {/* FIX: both sidebar buttons now navigate to their pages. */}
        <button type="button" className={`nav-item ${active === "Help & Support" ? "active" : ""}`} onClick={() => navigateTo("Help & Support")} aria-current={active === "Help & Support" ? "page" : undefined}>
          <CircleHelp size={18} /><span>{t.help}</span>{active === "Help & Support" && <i />}
        </button>
        <button type="button" className={`nav-item ${active === "Settings" ? "active" : ""}`} onClick={() => navigateTo("Settings")} aria-current={active === "Settings" ? "page" : undefined}>
          <Settings size={18} /><span>{t.settings}</span>{active === "Settings" && <i />}
        </button>

        <div className="user-profile">
          <div className="user-avatar">{(user.name || "F").charAt(0).toUpperCase()}</div>
          <div><strong>{user.name || "Farm User"}</strong><span>{user.email}</span></div>
          <button className="logout-button" title={t.logout} aria-label={t.logout} onClick={handleLogout}><LogOut size={17} /></button>
        </div>
      </div>
    </aside>

    {farmFormOpen && <div role="presentation" onMouseDown={event => { if (event.target === event.currentTarget && !farmSaving) setFarmFormOpen(false); }} style={{ position: "fixed", inset: 0, zIndex: 200, display: "grid", placeItems: "center", padding: 18, background: "rgba(0,0,0,.72)" }}>
      <div role="dialog" aria-modal="true" aria-labelledby="add-farm-title" className="panel" style={{ width: "min(680px, 100%)", maxHeight: "90vh", overflowY: "auto", margin: 0, background: "#142219", border: "1px solid rgba(163,230,53,.25)" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12, marginBottom: 18 }}>
          <div><h2 id="add-farm-title" style={{ fontSize: 20, marginBottom: 5 }}>Add New Farm</h2><p style={{ color: "#91a095", fontSize: 11 }}>Register your farm to enable Satellite Monitoring.</p></div>
          <button type="button" onClick={() => !farmSaving && setFarmFormOpen(false)} aria-label="Close form" style={{ border: 0, background: "transparent", color: "#dce8dc" }}><X /></button>
        </div>
        <form onSubmit={saveFarm}>
          <div className="form-grid">
            <label>Farmer name<input required value={farmForm.farmer_name} onChange={e => setFarmForm({ ...farmForm, farmer_name: e.target.value })} placeholder="Farmer name" /></label>
            <label>Farm name<input required value={farmForm.farm_name} onChange={e => setFarmForm({ ...farmForm, farm_name: e.target.value })} placeholder="e.g. My Demo Farm" /></label>
            <label>Location / village<input value={farmForm.location} onChange={e => { setFarmForm({ ...farmForm, location: e.target.value, latitude: "", longitude: "" }); setGeocodeResults([]); setGeocodeMessage(""); }} placeholder="Village, district, state" /></label>
            <label>Crop name<input required value={farmForm.crop_name} onChange={e => setFarmForm({ ...farmForm, crop_name: e.target.value })} placeholder="e.g. Ragi, Rice, Tomato" /></label>
            <label>Farm area (acres)<input required type="number" min="0.01" step="any" value={farmForm.area_acres} onChange={e => setFarmForm({ ...farmForm, area_acres: e.target.value })} placeholder="e.g. 2.5" /></label>
            <label>Latitude<input required type="number" min="-90" max="90" step="any" value={farmForm.latitude} onChange={e => setFarmForm({ ...farmForm, latitude: e.target.value })} placeholder="Farm latitude" /></label>
            <label>Longitude<input required type="number" min="-180" max="180" step="any" value={farmForm.longitude} onChange={e => setFarmForm({ ...farmForm, longitude: e.target.value })} placeholder="Farm longitude" /></label>
          </div>
          <button type="button" className="secondary-button" onClick={findFarmCoordinates} disabled={geocodeLoading || farmSaving} style={{ marginBottom: 12 }}>
            <MapPin size={16} /> {geocodeLoading ? "Finding coordinates..." : "Find Coordinates from Location"}
          </button>
          {geocodeResults.length > 1 && <label style={{ display: "block", marginBottom: 12 }}>Choose the matching location
            <select defaultValue="0" onChange={e => selectGeocodeResult(e.target.value)}>
              {geocodeResults.map((place, index) => <option key={`${place.latitude}-${place.longitude}-${index}`} value={index}>{place.display_name}</option>)}
            </select>
          </label>}
          {geocodeMessage && <div className="notice" role="status" style={{ marginBottom: 12 }}>{geocodeMessage}</div>}
          <p className="helper-text" style={{ marginBottom: 14 }}>Enter the village, town or address, then click Find Coordinates. Review the matched place before saving. A village search may return the village centre rather than the exact farm boundary. OpenStreetMap data is used for location lookup.</p>
          {farmError && <div className="notice" role="alert" style={{ marginBottom: 14 }}>{farmError}</div>}
          <div style={{ display: "flex", justifyContent: "flex-end", gap: 10, flexWrap: "wrap" }}>
            <button type="button" className="secondary-button" onClick={() => setFarmFormOpen(false)} disabled={farmSaving}>Cancel</button>
            <button type="submit" className="primary-button" disabled={farmSaving}>{farmSaving ? "Saving..." : "Save Farm"}</button>
          </div>
        </form>
      </div>
    </div>}

    <main className="main-area">
      <header className="topbar">
        <div className="topbar-left">
          <button className="menu-button" onClick={() => setSidebarOpen(true)} aria-label="Open menu"><Menu size={22} /></button>
          <div className="breadcrumb">Workspace <span>/</span><strong>{active === "Dashboard" ? t.dashboard : active}</strong></div>
        </div>
        <div className="topbar-right accessibility-controls">
          <label className="accessibility-select"><Languages size={16} /><select value={languageKey} onChange={e => setLanguageKey(e.target.value)} aria-label={t.language}>{languageOptions.map(item => <option key={item.key} value={item.key}>{item.label}</option>)}</select></label>
          <div className="mode-switch">
            <button className={mode === "farmer" ? "selected" : ""} onClick={() => setMode("farmer")}><Sprout size={15} />{t.farmerMode}</button>
            <button className={mode === "technical" ? "selected" : ""} onClick={() => setMode("technical")}><Gauge size={15} />{t.technicalMode}</button>
          </div>
          <div className="top-date"><Sun size={16} />AgroPulse AI</div>
        </div>
      </header>

      <div className="page-content">
        <div className="page-heading">
          <div>
            <span className="eyebrow">AGROPULSE AI / FARM MANAGEMENT</span>
            <h1>{active === "Dashboard" ? t.dashboard : active}</h1>
            <p>{active === "Dashboard" ? t.welcomeText : descriptions[active] || ""}</p>
          </div>
          <div className="page-heading-actions"><button className="secondary-button" onClick={() => window.location.reload()}><RefreshCw size={18} />{t.refresh}</button></div>
        </div>

        <SectionContent
          active={active}
          setActive={navigateTo}
          mode={mode}
          language={language}
          t={t}
          locationName={locationName}
          deviceWeather={deviceWeather}
          locationError={locationError}
          locationLoading={locationLoading}
          refreshDeviceLocation={refreshDeviceLocation}
          user={user}
          languageKey={languageKey}
          setLanguageKey={setLanguageKey}
          setMode={setMode}
          handleLogout={handleLogout}
        />

        <footer className="app-footer"><span>© 2026 AgroPulse AI</span><span>Sensorless precision agriculture · {mode} mode</span></footer>
      </div>
    </main>
  </div>;
}
