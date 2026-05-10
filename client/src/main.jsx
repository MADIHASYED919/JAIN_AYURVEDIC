import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import './styles.css' 
import { Toaster } from "react-hot-toast";
// import "./axiosConfig.js"


createRoot(document.getElementById('root')).render(
  <>
  <StrictMode>
<Toaster
      position="top-center"
      toastOptions={{
        duration: 2000,
        style: {
              borderRadius: "10px",
      background: "#1e293b",
      color: "#fff",
      padding: "12px 16px",
      fontSize: "14px",
        },
      }}
    />

    <App />
  </StrictMode>
  </>
  
)
