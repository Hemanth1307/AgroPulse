
import { useState } from "react";

export default function NutrientAdvisor() {
  const [crop, setCrop] = useState("Tomato");

  const advice = {
    Tomato: "Monitor nitrogen, phosphorus and potassium based on soil testing.",
    Rice: "Use soil-test-based nitrogen, phosphorus and potassium management.",
    Wheat: "Check soil fertility and apply nutrients according to crop stage.",
    Maize: "Monitor nitrogen demand and soil phosphorus and potassium."
  };

  return (
    <section>
      <h1>🧪 Nutrient Advisor</h1>
      <select value={crop} onChange={e => setCrop(e.target.value)}>
        {Object.keys(advice).map(c => <option key={c}>{c}</option>)}
      </select>
      <p>{advice[crop]}</p>
      <small>General guidance only. Confirm fertilizer rates with soil testing and local agricultural experts.</small>
    </section>
  );
}
