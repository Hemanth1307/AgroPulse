import { useState } from "react";
import { UploadCloud, ScanLeaf } from "lucide-react";

export default function CropDoctor() {
  const [image, setImage] = useState(null);
  const [fileName, setFileName] = useState("");

  const handleUpload = (e) => {
    const file = e.target.files[0];

    if (!file) return;

    if (!file.type.startsWith("image/")) {
      alert("Please upload an image.");
      return;
    }

    setImage(URL.createObjectURL(file));
    setFileName(file.name);
  };

  return (
    <>
      <div className="page-heading">
        <span className="feature-emoji">🍃</span>
        <div>
          <h2>AI Crop Disease Detector</h2>
          <p>Upload a leaf image to prepare it for disease analysis.</p>
        </div>
      </div>

      <section className="panel upload-panel">
        <ScanLeaf size={45} />

        <h3>Upload Crop Image</h3>
        <p>Choose a clear image of the affected crop leaf.</p>

        <label className="upload-button">
          <UploadCloud size={18} /> Choose Image
          <input
            type="file"
            accept="image/*"
            hidden
            onChange={handleUpload}
          />
        </label>

        {image && (
          <div className="image-preview">
            <img src={image} alt="Uploaded crop leaf" />
            <b>{fileName}</b>
            <p>Image uploaded successfully.</p>
          </div>
        )}
      </section>

      <div className="notice">
        Actual disease identification requires connecting a trained
        machine-learning model. This component currently previews images only.
      </div>
    </>
  );
}
