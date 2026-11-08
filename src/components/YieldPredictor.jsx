import { useState } from "react";
import { TrendingUp } from "lucide-react";

const factors = {
  Low: 0.75,
  Normal: 1,
  Good: 1.15
};

export default function YieldPredictor() {
  const [area, setArea] = useState(1);
  const [baseYield, setBaseYield] = useState(2200);
  const [condition, setCondition] = useState("Normal");

  const estimate = area * baseYield * factors[condition];

  return (
    <>
      <div className="page-heading">
        <span className="feature-emoji">📈</span>
        <div>
          <h2>Crop Yield Estimator</h2>
          <p>Estimate crop production using your farm details.</p>
        </div>
      </div>

      <div className="two-column">
        <section className="panel">
          <h3>Farm Information</h3>

          <label className="field-label">
            Farm Area (Acres)
            <input
              type="number"
              min="0"
              step="0.1"
              value={area}
              onChange={e => setArea(Math.max(0, Number(e.target.value) || 0))}
            />
          </label>

          <label className="field-label">
            Baseline Yield (kg/acre)
            <input
              type="number"
              min="0"
              value={baseYield}
              onChange={e =>
                setBaseYield(Math.max(0, Number(e.target.value) || 0))
              }
            />
          </label>

          <label className="field-label">
            Expected Growing Conditions
            <select
              value={condition}
              onChange={e => setCondition(e.target.value)}
            >
              <option>Low</option>
              <option>Normal</option>
              <option>Good</option>
            </select>
          </label>
        </section>

        <section className="panel result-panel">
          <TrendingUp size={32} />

          <span className="overline">ESTIMATED CROP PRODUCTION</span>

          <div className="big-result">
            {Math.round(estimate).toLocaleString("en-IN")}
            <small> kg</small>
          </div>

          <div className="result-row">
            <span>Farm Area</span>
            <b>{area} acres</b>
          </div>

          <div className="result-row">
            <span>Baseline Yield</span>
            <b>{baseYield} kg/acre</b>
          </div>

          <div className="result-row">
            <span>Growing Conditions</span>
            <b>{condition}</b>
          </div>

          <div className="result-row">
            <span>Adjustment Factor</span>
            <b>{factors[condition]}×</b>
          </div>
        </section>
      </div>

      <div className="notice">
        This is a scenario-based estimate, not an actual AI/ML prediction.
        A trained model using historical crop, weather and soil data is
        needed for real predictive analytics.
      </div>
    </>
  );
}
