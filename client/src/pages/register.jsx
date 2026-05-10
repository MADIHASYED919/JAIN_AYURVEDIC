import { useState } from "react";

import axios from "../axiosConfig";
import { useNavigate } from "react-router-dom";
import { FaLeaf, FaUser, FaEnvelope, FaLock } from "react-icons/fa";
import "./auth.css";
import toast from "react-hot-toast";

const Register = () => {
  const [form, setForm] = useState({ name: "", email: "", password: "" });
  const navigate = useNavigate();

   const handleRegister = async () => {
    try {
      await axios.post("/api/auth/register",form);

      toast.success("Account created successfully 🌿✨");

      setTimeout(() => {
        navigate("/");
      }, 1200);

    } catch (err) {
      toast.error(err.response?.data?.error || "Signup failed ❌");
    }
  };
  

  return (
    <div className="auth-container">

      <div className="auth-card">

        <h2><FaLeaf /> Join Ayurveda</h2>

        <form onSubmit={(e) => { e.preventDefault(); handleRegister(); }}>

          <div className="input-group">
            <FaUser />
            <input 
              placeholder="Full Name"
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              required
            />
          </div>

          <div className="input-group">
            <FaEnvelope />
            <input 
              type="email"
              placeholder="Email"
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              required
            />
          </div>

          <div className="input-group">
            <FaLock />
            <input 
              type="password"
              placeholder="Password"
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              required
            />
          </div>

          <button className="auth-btn">Register</button>

        </form>

        <p onClick={() => navigate("/login")} className="switch-text">
          Already have account? 🔑 Login
        </p>

      </div>

    </div>
  );
};

export default Register;