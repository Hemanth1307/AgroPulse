
import { useState } from "react";

export default function YieldPredictor() {
  const [area, setArea] = useState(1);
  const [yieldPerAcre, setYieldPerAcre] = useState(20);

  return (
    <section>
      <h1>🌾 Yield Estimator</h1>
      <label>Farm area (acres)</label>
      <input type="number" value={area} onChange={e => setArea(Math.max(0, Number(e.target.value)))} />
      <label>Expected yield per acre (quintals)</label>
      <input type="number" value={yieldPerAcre} onChange={e => setYieldPerAcre(Math.max(0, Number(e.target.value)))} />
      <h2>Estimated yield: {area * yieldPerAcre} quintals</h2>
      <p>This is a user-entered estimate, not an AI prediction.</p>
    </section>
  );
}
