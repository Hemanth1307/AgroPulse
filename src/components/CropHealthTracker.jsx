
import { useState } from "react";

export default function CropHealthTracker() {
  const [health, setHealth] = useState("Good");

  return (
    <section>
      <h1>🌱 Crop Health Tracker</h1>
      <label>Current crop condition</label>
      <select value={health} onChange={e => setHealth(e.target.value)}>
        <option>Good</option>
        <option>Average</option>
        <option>Poor</option>
      </select>
      <h2>Crop status: {health}</h2>
      <p>Record crop observations regularly.</p>
    </section>
  );
}
