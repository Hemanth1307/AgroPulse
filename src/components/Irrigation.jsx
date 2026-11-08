import { useState } from "react";
import { Droplets } from "lucide-react";

const cropKc = {
  Tomato: 0.8,
  Rice: 1.1,
  Wheat: 1.0,
  Maize: 0.9,
  Potato: 0.85,
  Cotton: 0.9
};

export default function Irrigation() {
  const [crop, setCrop] = useState("Tomato");
  const [area, setArea] = useState(1000);
  const [et0, setEt0] = useState(5);
  const [rain, setRain] = useState(1);
  const [efficiency, setEfficiency] = useState(90);

  const etc = et0 * cropKc[crop];
  const netWater = Math.max(0, etc - rain);
  const grossWater = netWater / (efficiency / 100);
  const litres = grossWater * area;

  return (
    <>
      <div className="page-heading">
        <span className="feature-emoji">💧</span>
        <div>
          <h2>Smart Irrigation Advisor</h2>
          <p>Calculate the estimated daily water requirement.</p>
        </div>
      </div>

      <div className="two-column">
        <section className="panel">
          <h3>Farm Information</h3>

          <label className="field-label">
            Select Crop
            <select value={crop} onChange={e => setCrop(e.target.value)}>
              {Object.keys(cropKc).map(c => (
                <option key={c}>{c}</option>
              ))}
            </select>
          </label>

          <label className="field-label">
            Farm Area (m²)
            <input
              type="number"
              min="1"
              value={area}
              onChange={e => setArea(Math.max(0, Number(e.target.value) || 0))}
            />
          </label>

          <label className="field-label">
            Reference ET₀ (mm/day)
            <input
              type="number"
              min="0"
              step="0.1"
              value={et0}
              onChange={e => setEt0(Math.max(0, Number(e.target.value) || 0))}
            />
          </label>

          <label className="field-label">
            Rainfall (mm/day)
            <input
              type="number"
              min="0"
              step="0.1"
              value={rain}
              onChange={e => setRain(Math.max(0, Number(e.target.value) || 0))}
            />
          </label>

          <label className="field-label">
            Irrigation Efficiency (%)
            <input
              type="number"
              min="1"
              max="100"
              value={efficiency}
              onChange={e =>
                setEfficiency(Math.min(100, Math.max(1, Number(e.target.value) || 1)))
              }
            />
          </label>
        </section>

        <section className="panel result-panel">
          <span className="overline">ESTIMATED WATER REQUIREMENT</span>

          <div className="big-result">
            {Math.round(litres).toLocaleString("en-IN")}
            <small> litres/day</small>
          </div>

          <div className="result-row">
            <span>Crop</span>
            <b>{crop}</b>
          </div>

          <div className="result-row">
            <span>Crop ET</span>
            <b>{etc.toFixed(2)} mm</b>
          </div>

          <div className="result-row">
            <span>Net water depth</span>
            <b>{netWater.toFixed(2)} mm</b>
          </div>

          <div className="result-row">
            <span>Gross water depth</span>
            <b>{grossWater.toFixed(2)} mm</b>
          </div>

          <p className="helper-text">
            Estimates depend on crop growth stage, soil, weather and
            field conditions. Use locally appropriate crop coefficients.
          </p>
        </section>
      </div>
    </>
  );
}
