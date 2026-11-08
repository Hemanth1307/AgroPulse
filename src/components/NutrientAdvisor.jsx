import { useState } from "react";
import { FlaskConical } from "lucide-react";

const advice = {
  Tomato: "Use soil-test-based balanced nutrients. Avoid excessive nitrogen during flowering and fruiting.",
  Rice: "Follow soil-test recommendations and split nitrogen applications according to local agricultural guidance.",
  Wheat: "Maintain balanced nitrogen, phosphorus and potassium based on soil test results.",
  Maize: "Apply nutrients according to soil conditions and crop growth stage.",
  Potato: "Use balanced nutrition based on soil analysis and local crop recommendations.",
  Cotton: "Monitor nutrient requirements throughout vegetative and reproductive growth."
};

export default function NutrientAdvisor() {
  const [crop, setCrop] = useState("Tomato");
  const [soil, setSoil] = useState("Not Tested");

  return (
    <>
      <div className="page-heading">
        <span className="feature-emoji">🧪</span>
        <div>
          <h2>Nutrient Advisor</h2>
          <p>Explore general crop nutrition guidance.</p>
        </div>
      </div>

      <section className="panel narrow-panel">
        <label className="field-label">
          Select Crop
          <select value={crop} onChange={e => setCrop(e.target.value)}>
            {Object.keys(advice).map(item => (
              <option key={item}>{item}</option>
            ))}
          </select>
        </label>

        <label className="field-label">
          Soil Test Status
          <select value={soil} onChange={e => setSoil(e.target.value)}>
            <option>Not Tested</option>
            <option>Test Completed</option>
            <option>Test Planned</option>
          </select>
        </label>

        <div className="advice-card">
          <FlaskConical size={28} />

          <h3>{crop} Nutrient Guidance</h3>

          <p>{advice[crop]}</p>

          <small>Soil Test: {soil}</small>
        </div>
      </section>

      <div className="notice">
        Get a professional soil test before deciding fertilizer quantities.
        These are general recommendations, not personalized fertilizer prescriptions.
      </div>
    </>
  );
}
