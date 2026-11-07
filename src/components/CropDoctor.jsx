
import { useState } from "react";

export default function CropDoctor() {
  const [preview, setPreview] = useState("");

  return (
    <section>
      <h1>🍃 Crop Doctor</h1>
      <p>Upload a crop leaf image for disease analysis.</p>
      <input
        type="file"
        accept="image/*"
        onChange={e => {
          const file = e.target.files[0];
          if (file) setPreview(URL.createObjectURL(file));
        }}
      />
      {preview && <img src={preview} alt="Uploaded leaf" width="250" />}
      <p>AI disease detection model integration is pending.</p>
    </section>
  );
}
