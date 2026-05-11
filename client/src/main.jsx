import { StrictMode } from "react";

import { createRoot } from "react-dom/client";

import "./index.css";

import "./styles.css";

import App from "./App.jsx";

import { Toaster } from "react-hot-toast";

import { WishlistProvider } from "./context/WishlistContext";
import { AuthProvider } from "./context/authContext.jsx";

createRoot(document.getElementById("root")).render(

   
    <AuthProvider>
      <WishlistProvider>
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
      </WishlistProvider>
    </AuthProvider>
);
