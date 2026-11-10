
import { useState } from "react";
import {
  FlaskConical,
  Upload,
  FileText,
  CheckCircle,
  AlertTriangle,
  Loader2,
  Microscope
} from "lucide-react";

const API_URL = "http://127.0.0.1:5000/api/npk-detect";

const advice = {
  Tomato:
    "Use soil-test-based balanced nutrients. Avoid excessive nitrogen during flowering and fruiting.",
  Rice:
    "Follow soil-test recommendations and split nitrogen applications according to local agricultural guidance.",
  Wheat:
    "Maintain balanced nitrogen, phosphorus and potassium based on soil test results.",
  Maize:
    "Apply nutrients according to soil conditions and crop growth stage.",
  Potato:
    "Use balanced nutrition based on soil analysis and local crop recommendations.",
  Cotton:
    "Monitor nutrient requirements throughout vegetative and reproductive growth."
};

const nutrientNames = [
  { key: "nitrogen", name: "Nitrogen", symbol: "N" },
  { key: "phosphorus", name: "Phosphorus", symbol: "P" },
  { key: "potassium", name: "Potassium", symbol: "K" }
];

export default function NutrientAdvisor() {
  const [crop, setCrop] = useState("Tomato");
  const [soil, setSoil] = useState("Not Tested");

  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [values, setValues] = useState({
    nitrogen: "",
    phosphorus: "",
    potassium: ""
  });

  const [details, setDetails] = useState({
    nitrogen: {},
    phosphorus: {},
    potassium: {}
  });

  const [notes, setNotes] = useState([]);
  const [reportContext, setReportContext] = useState("");
  const [extractionStatus, setExtractionStatus] = useState("");
  const [extracted, setExtracted] = useState(false);
  const [verified, setVerified] = useState(false);

  const resetResults = () => {
    setValues({
      nitrogen: "",
      phosphorus: "",
      potassium: ""
    });

    setDetails({
      nitrogen: {},
      phosphorus: {},
      potassium: {}
    });

    setNotes([]);
    setReportContext("");
    setExtractionStatus("");
    setExtracted(false);
    setVerified(false);
    setSoil("Not Tested");
  };

  const handleFileChange = (event) => {
    const selectedFile = event.target.files?.[0];

    setError("");
    setSuccess("");
    resetResults();

    if (!selectedFile) {
      setFile(null);
      return;
    }

    const allowedTypes = [
      "application/pdf",
      "image/jpeg",
      "image/png",
      "image/webp"
    ];

    if (!allowedTypes.includes(selectedFile.type)) {
      setError("Please upload a PDF, JPG, PNG or WEBP file.");
      setFile(null);
      event.target.value = "";
      return;
    }

    if (selectedFile.size > 8 * 1024 * 1024) {
      setError("File size must be below 8 MB.");
      setFile(null);
      event.target.value = "";
      return;
    }

    setFile(selectedFile);
  };

  const handleUpload = async () => {
    if (!file) {
      setError("Please select a soil test report first.");
      return;
    }

    setLoading(true);
    setError("");
    setSuccess("");
    setVerified(false);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch(API_URL, {
        method: "POST",
        body: formData
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        throw new Error(
          data.message || "Report processing failed."
        );
      }

      const nutrients = data.nutrients || {};

      setValues({
        nitrogen: nutrients.nitrogen ?? "",
        phosphorus: nutrients.phosphorus ?? "",
        potassium: nutrients.potassium ?? ""
      });

      setDetails(data.nutrient_details || {
        nitrogen: {},
        phosphorus: {},
        potassium: {}
      });

      setNotes(Array.isArray(data.notes) ? data.notes : []);
      setReportContext(data.report_context || "");
      setExtractionStatus(data.extraction_status || "unclear");

      setExtracted(true);
      setSoil("Test Completed");

      if (data.extraction_status === "complete") {
        setSuccess(
          "Report processed. Check all three values against the original laboratory report."
        );
      } else if (data.extraction_status === "partial") {
        setSuccess(
          "Some values were extracted. Check the original report and enter any missing values manually."
        );
      } else {
        setSuccess(
          "The report was received, but its values need careful manual checking."
        );
      }

    } catch (err) {
      setError(
        err.message ||
        "Unable to connect to AgroPulse AI backend. Check your Flask server."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleValueChange = (key, value) => {
    setValues((previous) => ({
      ...previous,
      [key]: value
    }));

    setVerified(false);
    setError("");
  };

  const handleVerification = () => {
    const allPresent = nutrientNames.every(({ key }) => {
      const value = values[key];

      return (
        value !== "" &&
        Number.isFinite(Number(value)) &&
        Number(value) >= 0
      );
    });

    if (!allPresent) {
      setError(
        "Please enter all three NPK values from the original report before verification."
      );
      return;
    }

    setError("");
    setVerified(true);

    setSuccess(
      "Values marked as farmer-verified. This does not independently validate laboratory accuracy."
    );
  };

  return (
    <>
      <div className="page-heading">
        <span className="feature-emoji">🧪</span>
        <div>
          <h2>Nutrient Advisor</h2>
          <p>
            Detect and analyse soil nutrient measurements
            using laboratory reports.
          </p>
        </div>
      </div>

      {/* FARM DETAILS */}

      <section className="panel narrow-panel">
        <h3>Farm Details</h3>

        <label className="field-label">
          Select Crop

          <select
            value={crop}
            onChange={(e) => setCrop(e.target.value)}
          >
            {Object.keys(advice).map((item) => (
              <option key={item} value={item}>
                {item}
              </option>
            ))}
          </select>
        </label>

        <label className="field-label">
          Soil Test Status

          <select
            value={soil}
            onChange={(e) => setSoil(e.target.value)}
          >
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

      {/* NPK REPORT UPLOAD */}

      <section className="panel narrow-panel">
        <h3>
          <Microscope size={22} style={{ marginRight: 8 }} />
          Smart NPK Detection
        </h3>

        <p>
          Upload your laboratory soil report to extract
          Nitrogen, Phosphorus and Potassium values using Gemini AI.
        </p>

        <label className="field-label">
          Upload Soil Test Report

          <input
            type="file"
            accept=".pdf,.jpg,.jpeg,.png,.webp"
            onChange={handleFileChange}
          />
        </label>

        {file && (
          <div className="notice">
            <FileText size={20} />
            <span>{file.name}</span>
          </div>
        )}

        <button
          type="button"
          className="primary-button"
          onClick={handleUpload}
          disabled={!file || loading}
        >
          {loading ? (
            <>
              <Loader2 size={18} className="spin" />
              Processing Report...
            </>
          ) : (
            <>
              <Upload size={18} />
              Extract NPK Values
            </>
          )}
        </button>

        {error && (
          <div className="notice error-notice" role="alert">
            <AlertTriangle size={18} />
            {error}
          </div>
        )}

        {success && (
          <div className="notice success-notice" role="status">
            <CheckCircle size={18} />
            {success}
          </div>
        )}
      </section>

      {/* EXTRACTED NPK VALUES */}

      {extracted && (
        <section className="panel narrow-panel">
          <h3>Extracted Soil Nutrient Measurements</h3>

          <p>
            Check these values against your original laboratory
            report. Correct any errors before verification.
          </p>

          {extractionStatus && (
            <p>
              <strong>Extraction status:</strong>{" "}
              {extractionStatus}
            </p>
          )}

          {reportContext && (
            <p>
              <strong>Report details:</strong> {reportContext}
            </p>
          )}

          {nutrientNames.map(({ key, name, symbol }) => {
            const item = details[key] || {};

            return (
              <div key={key}>
                <label className="field-label">
                  {name} ({symbol})

                  <input
                    type="number"
                    min="0"
                    step="any"
                    placeholder={`Enter ${name} value`}
                    value={values[key]}
                    onChange={(e) =>
                      handleValueChange(key, e.target.value)
                    }
                  />
                </label>

                <small>
                  Report label: {item.reported_name || "Not identified"}
                  {" | "}
                  Unit: {item.unit || "Not specified"}
                </small>
              </div>
            );
          })}

          {notes.length > 0 && (
            <div className="notice">
              <AlertTriangle size={18} />
              <div>
                <strong>Report reading notes</strong>
                <ul>
                  {notes.map((note, index) => (
                    <li key={index}>{String(note)}</li>
                  ))}
                </ul>
              </div>
            </div>
          )}

          <p>
            <strong>Important:</strong> Keep the same units
            shown in the original laboratory report.
            Do not mix N with N₂, P with P₂O₅, or K with K₂O.
          </p>

          <button
            type="button"
            className="primary-button"
            onClick={handleVerification}
            disabled={verified}
          >
            <CheckCircle size={18} />
            {verified ? "Values Verified" : "Verify NPK Measurements"}
          </button>

          {verified && (
            <div className="notice success-notice">
              <CheckCircle size={18} />
              Farmer verification completed.
            </div>
          )}

          <div className="notice">
            <AlertTriangle size={18} />
            Verification means the farmer has checked the
            extracted values. It is not an independent
            laboratory accuracy certificate.
          </div>
        </section>
      )}

      {/* SOIL NUTRIENT SUMMARY */}

      <section className="panel narrow-panel">
        <h3>Soil Nutrient Summary</h3>

        <p><strong>Crop:</strong> {crop}</p>
        <p><strong>Soil Test:</strong> {soil}</p>

        {extracted ? (
          <>
            {nutrientNames.map(({ key, name, symbol }) => {
              const item = details[key] || {};

              return (
                <p key={key}>
                  <strong>{name} ({symbol}):</strong>{" "}
                  {values[key] === "" ? "Not available" : values[key]}
                  {" "}
                  {item.unit || ""}
                </p>
              );
            })}

            <p>
              <strong>Measurement status:</strong>{" "}
              {verified ? "Farmer verified" : "Verification pending"}
            </p>

            <p>
              <strong>Source:</strong> Uploaded soil laboratory report
            </p>
          </>
        ) : (
          <p>
            No laboratory NPK measurements have been extracted yet.
          </p>
        )}
      </section>

      <div className="notice">
        {advice[crop]} Obtain reliable soil-test measurements
        before deciding fertilizer quantities.
      </div>
    </>
  );
}
