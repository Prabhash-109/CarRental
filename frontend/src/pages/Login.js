import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import "./Login.css"; // custom styles

const Login = () => {
  const [formData, setFormData] = useState({
    username: "",
    password: ""
  });
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const { login, user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (user) {
      navigate("/");
    }
  }, [user, navigate]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    const result = await login(formData.username, formData.password);

    if (result.success) {
      setMessage(result.message);
      setTimeout(() => {
        if (user?.role === "AGENT") {
          navigate("/agent/dashboard");
        } else {
          navigate("/");
        }
      }, 1000);
    } else {
      setMessage(result.message);
    }

    setLoading(false);
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <h2 className="login-title">Welcome Back</h2>
        <p className="login-subtitle">Login to continue your journey</p>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="username">Username</label>
            <input
              type="text"
              id="username"
              name="username"
              value={formData.username}
              onChange={handleChange}
              required
              placeholder="Enter your username"
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              placeholder="Enter your password"
            />
          </div>

          <button type="submit" className="btn login-btn" disabled={loading}>
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        {message && (
          <div
            className={`alert ${
              message.includes("successful") ? "alert-success" : "alert-danger"
            }`}
          >
            {message}
          </div>
        )}

        <p className="register-text">
          Don’t have an account? <Link to="/register">Register here</Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
