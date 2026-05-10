import { useState } from "react";

import axios from "../axiosConfig";
import { useNavigate, useLocation } from "react-router-dom";
import { FaLeaf, FaLock, FaEnvelope } from "react-icons/fa";
import "./auth.css";
import toast from "react-hot-toast";

const Login = () => {
  const [form, setForm] = useState({ email: "", password: "" });
  const navigate = useNavigate();
  const location = useLocation();

  const redirect = location.state?.from || "/";


  const handleLogin = async () => {
    try {
      const res = await axios.post("/api/auth/login", { withCredentials: true },form);

      toast.success(`Welcome back ${res.data.user.name} 🎉`);

      setTimeout(() => {
        navigate(redirect);
      }, 1000);

    } catch (err) {
      toast.error(err.response?.data?.error || "Login failed ❌");
    }
  };

  return (
    <div className="auth-container">
 
      <div className="auth-card">

        <h2><FaLeaf /> Ayurvedic Login</h2>

        <form onSubmit={(e) => { e.preventDefault(); handleLogin(); }}>

          <div className="input-group">
            <FaEnvelope />
            <input 
              type="email"
             placeholder="Enter Email"
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              required
            />
          </div>

          <div className="input-group">
            <FaLock />
            <input 
              type="password"
              placeholder="Enter Password"
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              required
            />
          </div>

          <button className="auth-btn">Login</button>

        </form>

        <p onClick={() => navigate("/register")} className="switch-text">
          New here? 🌱 Create Account
        </p>

      </div>

    </div>
  );
};

export default Login;