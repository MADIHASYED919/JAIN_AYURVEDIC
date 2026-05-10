


import React, { useRef, useState } from "react";
import Webcam from "react-webcam";

import axios from "../axiosConfig";
import "./CameraScanner.css";

const CameraScanner = () => {
  const webcamRef = useRef(null);

  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  // 📸 CAPTURE IMAGE
  const capture = async () => {
    if (!webcamRef.current) return;

    const imageSrc = webcamRef.current.getScreenshot();
    if (!imageSrc) return;

    const blob = await fetch(imageSrc).then(res => res.blob());

    const formData = new FormData();
    formData.append("image", blob, "scan.jpg");

    try {
      setLoading(true);
      setResult(null);

      const res = await axios.post(
        "/api/scan",
        formData
      );

      setResult(res.data);

    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  // 📂 UPLOAD IMAGE
  const handleUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("image", file);

    try {
      setLoading(true);
      setResult(null);

      const res = await axios.post(
        "/api/scan",
        formData
      );

      setResult(res.data);

    } catch (err) {
      console.log(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="lens-container">

      {/* CAMERA */}
     <Webcam
  ref={webcamRef}
  screenshotFormat="image/jpeg"
  className="lens-camera"
  videoConstraints={{
    facingMode: "environment" // 🔥 IMPORTANT for mobile
  }}
/>

      {/* OVERLAY */}
      <div className="lens-overlay">

        {/* SCAN FRAME */}
        <div className="scan-frame">
          <div className="scan-line"></div>
        </div>

        {/* LOADING */}
        {loading && (
          <div className="loading-box">
            <p>🤖 Analyzing Medicine...</p>
            <br />
            <p>⚡ Trying Gemini / Ollama...</p>
            <br />
            <p>⏳ Please wait...</p>
          </div>
        )}

        {/* CONTROLS */}
        <div className="lens-controls">

          {/* Upload */}
          <label className="upload-btn">
            📂Upload Image
            <input
              type="file"
              accept="image/*"
              onChange={handleUpload}
              hidden
            />
          </label>

          {/* Scan Button */}
          <button className="capture-btn" onClick={capture}>
            🔍Scan Image
          </button>

        </div>

        {/* RESULT DRAWER */}
       {result && (
      <div className="result-drawer">

       <h2>🧠 Medicine Analysis</h2>

    <p><b>Name:</b> {result.name}</p>
    <p><b>Uses:</b> {result.uses}</p>

        <div className="details">

   <h4>💊 Dosage</h4>
    <p>👶 Children: {result.dosage?.children}</p>
    <p>🧑 Adults: {result.dosage?.adults}</p>
    <p>👴 Elderly: {result.dosage?.elderly}</p>

    <p><b>🕒 How to use:</b> {result.howToUse}</p>

    <p><b>⚠️ Precautions:</b> {result.precautions}</p>
    <p><b>❗ Side Effects:</b> {result.sideEffects}</p>
    <p><b>📦 Expiry:</b> {result.expiryInfo}</p>


        </div>

      </div>
    )}

      </div>
    </div>
  );
};

export default CameraScanner;


