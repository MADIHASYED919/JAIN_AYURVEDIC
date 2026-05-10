import { useState } from "react";

import axios from "../axiosConfig";
import "./medicineScanner.css"

const MedicineScanner = () => {
  const [result, setResult] = useState("");
  const [loading, setLoading] = useState(false);
  const [speaking, setSpeaking] = useState(false);

 const handleUpload = async (e) => {
  const file = e.target.files[0];
  if (!file) return;

  const formData = new FormData();
  formData.append("image", file);

  try {
    setLoading(true);

    const res = await axios.post(
      "/api/scan",
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );

    setResult(res.data);

  } catch (err) {
    console.log(err);
  } finally {
    setLoading(false);
  }
};

  // 🔊 VOICE
  const toggleSpeak = () => {
    if (speaking) {
      window.speechSynthesis.cancel();
      setSpeaking(false);
      return;
    } else {
      const text = `
      Medicine: ${result.name}.
      Uses: ${result.uses}.
      Adults: ${result.dosage?.adults}.
      Precautions: ${result.precautions}.
      `;

      const speech = new SpeechSynthesisUtterance(text);

      speech.onend = () => setSpeaking(false);

      window.speechSynthesis.speak(speech);
      setSpeaking(true);
    }
  };

  return (
    <div className="scanner-container">

      <input type="file" accept="image/*" onChange={handleUpload} />

      {loading && <p>🔍 Analyzing medicine...</p>}

      {result && (
  <div className="scan-result">
    <h2>🧠 Medicine Analysis</h2>

    <p><b>Name:</b> {result.name}</p>
    <p><b>Uses:</b> {result.uses}</p>

  <p><b>Dosage:</b></p>
    <p>👶 Children: {result.dosage?.children}</p>
    <p>🧑 Adults: {result.dosage?.adults}</p>
    <p>👴 Elderly: {result.dosage?.elderly}</p>

    <p><b>Precautions:</b> {result.precautions}</p>
    <p><b>Side Effects:</b> {result.sideEffects}</p>
    <p><b>Expiry:</b> {result.expiryInfo}</p>
    <button onClick={toggleSpeak}>
            {speaking ? "⏹ Stop" : "🔊 Listen"}
          </button>

    <p className="warning">
      ⚠️ Consult doctor before use
    </p>
  </div>
)}




    </div>
  );
};

export default MedicineScanner;