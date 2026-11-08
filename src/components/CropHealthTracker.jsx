import { useState } from "react";
import { HeartPulse } from "lucide-react";

export default function CropHealthTracker() {
  const [crop, setCrop] = useState("Tomato");
  const [stage, setStage] = useState("Vegetative");
  const [notes, setNotes] = useState("");

  const [records, setRecords] = useState(() =>
    JSON.parse(localStorage.getItem("agropulse-health") || "[]")
  );

  const saveRecord = (e) => {
    e.preventDefault();

    const updated = [
      {
        id: Date.now(),
        crop,
        stage,
        notes,
        date: new Date().toLocaleDateString()
      },
      ...records
    ];

    setRecords(updated);
    localStorage.setItem("agropulse-health", JSON.stringify(updated));
    setNotes("");
  };

  return (
    <>
      <div className="page-heading">
        <span className="feature-emoji">💚</span>
        <div>
          <h2>Crop Health Tracker</h2>
          <p>Record and monitor your crop observations.</p>
        </div>
      </div>

      <section className="panel">
        <form onSubmit={saveRecord}>
          <label className="field-label">
            Crop Name
            <select value={crop} onChange={e => setCrop(e.target.value)}>
              <option>Tomato</option>
              <option>Rice</option>
              <option>Wheat</option>
              <option>Maize</option>
              <option>Cotton</option>
              <option>Potato</option>
            </select>
          </label>

          <label className="field-label">
            Growth Stage
            <select value={stage} onChange={e => setStage(e.target.value)}>
              <option>Seedling</option>
              <option>Vegetative</option>
              <option>Flowering</option>
              <option>Fruiting</option>
              <option>Harvest</option>
            </select>
          </label>

          <label className="field-label">
            Crop Observations
            <textarea
              rows="4"
              value={notes}
              onChange={e => setNotes(e.target.value)}
              placeholder="Enter crop health observations..."
              required
            />
          </label>

          <button className="primary-button">
            <HeartPulse size={17} /> Save Record
          </button>
        </form>
      </section>

      <div className="section-title">
        <h2>Previous Records</h2>
      </div>

      <div className="stack-list">
        {records.map(record => (
          <article className="list-card" key={record.id}>
            <b>{record.crop} – {record.stage}</b>
            <small>{record.date}</small>
            <p>{record.notes}</p>
          </article>
        ))}
      </div>

      {records.length === 0 && (
        <div className="empty-state">No records available yet.</div>
      )}
    </>
  );
}
