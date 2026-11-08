import { useState } from "react";
import { Satellite, MapPin } from "lucide-react";

export default function SatelliteMonitoring() {
  const [latitude, setLatitude] = useState("12.9716");
  const [longitude, setLongitude] = useState("77.5946");

  const valid =
    latitude !== "" &&
    longitude !== "" &&
    Number(latitude) >= -90 &&
    Number(latitude) <= 90 &&
    Number(longitude) >= -180 &&
    Number(longitude) <= 180;

  return (
    <>
      <div className="page-heading">
        <span className="feature-emoji">🛰️</span>
        <div>
          <h2>Satellite Monitoring</h2>
          <p>Enter your farm coordinates for location-based monitoring.</p>
        </div>
      </div>

      <div className="two-column">
        <section className="panel">
          <h3>Farm Location</h3>

          <label className="field-label">
            Latitude
            <input
              type="number"
              step="any"
              value={latitude}
              onChange={e => setLatitude(e.target.value)}
            />
          </label>

          <label className="field-label">
            Longitude
            <input
              type="number"
              step="any"
              value={longitude}
              onChange={e => setLongitude(e.target.value)}
            />
          </label>

          {valid && (
            <a
              className="text-link"
              href={`https://www.google.com/maps?q=${latitude},${longitude}`}
              target="_blank"
              rel="noreferrer"
            >
              <MapPin size={17} /> View Farm on Google Maps
            </a>
          )}

          {!valid && <p className="error-box">Enter valid coordinates.</p>}
        </section>

        <section className="panel satellite-placeholder">
          <Satellite size={45} />

          <h3>Satellite Data Connection</h3>

          <p>Farm Coordinates</p>
          <b>{latitude}, {longitude}</b>

          <p>
            Connect a satellite soil-moisture data source to retrieve
            actual soil moisture and vegetation measurements.
          </p>
        </section>
      </div>

      <div className="notice">
        Real satellite-derived data has not been connected yet.
        No actual moisture reading is being displayed.
      </div>
    </>
  );
}
