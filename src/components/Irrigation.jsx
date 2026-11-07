
import { useState } from "react";

export default function Irrigation() {
  const [area, setArea] = useState(1000);
  const [et0, setEt0] = useState(5);
  const [rain, setRain] = useState(1);
  const [kc, setKc] = useState(0.8);

  const water = Math.round(
    Math.max(0, et0 * kc - rain) * area
  );

  return (
    <section>
      <h1>💧 Irrigation Calculator</h1>
      <label>Farm area (m²)</label>
      <input type="number" value={area} onChange={e => setArea(Math.max(0, Number(e.target.value)))} />
      <label>ET0 (mm/day)</label>
      <input type="number" value={et0} onChange={e => setEt0(Math.max(0, Number(e.target.value)))} />
      <label>Rainfall (mm/day)</label>
      <input type="number" value={rain} onChange={e => setRain(Math.max(0, Number(e.target.value)))} />
      <label>Crop coefficient (Kc)</label>
      <input type="number" step="0.1" value={kc} onChange={e => setKc(Math.max(0, Number(e.target.value)))} />
      <h2>Estimated water: {water.toLocaleString("en-IN")} litres/day</h2>
      <p>Simplified estimate. Actual irrigation needs soil and crop conditions.</p>
    </section>
  );
}
