import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { login } from "../api/mockApi.js";
import "./LoginPage.css";

function LoginPage() {
  const navigate = useNavigate();
  // ----- state ต่างๆ ของหน้า (แทนที่การเข้าถึง DOM ตรงๆ แบบ vanilla JS) -----
  const [role, setRole] = useState("user"); // "user" | "admin"
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");

    if (!identifier.trim() || !password) {
      setError("กรุณากรอกข้อมูลให้ครบ");
      return;
    }

    setLoading(true);
    try {
      const result = await login(identifier.trim(), password, role);

      if (result.success) {
        localStorage.setItem("token", result.token);
        localStorage.setItem("user", JSON.stringify(result.user));
        navigate("/rooms"); // login สำเร็จ พาไปหน้าจองห้อง
      } else {
        setError(result.message);
      }
    } catch (err) {
      setError("เกิดข้อผิดพลาดในการเชื่อมต่อ กรุณาลองใหม่");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="login-page-wrap">
      <div className="login-card">
        <div className="icon-box">
          <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <rect x="3" y="3" width="18" height="18" rx="2" />
            <path d="M9 3v18M3 9h18M3 15h6" />
          </svg>
        </div>

        <h1>อุ๊ยรวยไม่จำกัด มหาชน</h1>
        <p className="subtitle">University Room Booking System</p>

        <div className="role-tabs">
          <button
            type="button"
            className={`tab ${role === "user" ? "active" : ""}`}
            onClick={() => setRole("user")}
          >
            Student / User
          </button>
          <button
            type="button"
            className={`tab ${role === "admin" ? "active" : ""}`}
            onClick={() => setRole("admin")}
          >
            Admin
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <span className="input-icon">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="8" r="4" />
                <path d="M4 20c0-4 4-6 8-6s8 2 8 6" />
              </svg>
            </span>
            <input
              type="text"
              placeholder="Email Address or ID"
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
            />
          </div>

          <div className="input-group">
            <span className="input-icon">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="5" y="11" width="14" height="9" rx="2" />
                <path d="M8 11V7a4 4 0 0 1 8 0v4" />
              </svg>
            </span>
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <span className="toggle-eye" onClick={() => setShowPassword((v) => !v)}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M1 12s4-7 11-7 11 7 11 7-4 7-11 7-11-7-11-7z" />
                <circle cx="12" cy="12" r="3" />
              </svg>
            </span>
          </div>

          <div className="row-between">
            <label className="remember">
              <input type="checkbox" />
              Remember Me
            </label>
            <a href="#" className="forgot">Forgot Password?</a>
          </div>

          {error && <p className="error-msg">{error}</p>}

          <button type="submit" className="submit-btn" disabled={loading}>
            {loading ? "Signing In..." : "Sign In to Portal"}
          </button>
        </form>
      </div>

      <p className="footer">
        © 2024 University Facility Management
        <br />
        <a href="#">IT Support</a> · <a href="#">Terms of Service</a> · <a href="#">Privacy Policy</a>
      </p>
    </div>
  );
}

export default LoginPage;
