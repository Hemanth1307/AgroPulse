
export default function Dashboard() {
  return (
    <section>
      <h1>Welcome to AgroPulse 🌱</h1>
      <p>Your smart farming companion.</p>
      <div className="dashboard-cards">
        <div className="card">💧 Smart Irrigation</div>
        <div className="card">🌦️ Weather Forecast</div>
        <div className="card">🍃 Crop Disease Detection</div>
        <div className="card">🛰️ Satellite Monitoring</div>
      </div>
    </section>
  );
}
