import { Link, useNavigate } from "react-router-dom";
import { LogOut } from "lucide-react";
import "./AppHeader.css";

/**
 * AppHeader - แถบบนสุดที่ใช้ร่วมกันทุกหน้าหลัง login
 * @param {"rooms" | "bookings"} active - บอกว่าตอนนี้อยู่หน้าไหน เพื่อ highlight nav link
 */
function AppHeader({ active }) {
  const navigate = useNavigate();
  const storedUser = JSON.parse(localStorage.getItem("user") || "null");
  const isAdmin = storedUser?.role === "admin";

  function handleLogout() {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/");
  }

  return (
    <header className="app-header">
      <Link to="/rooms" className="app-logo">VenueMaster</Link>

      <nav className="app-nav">
        <Link to="/rooms" className={`nav-link ${active === "rooms" ? "active" : ""}`}>
          Browse Rooms
        </Link>
        <Link to="/my-bookings" className={`nav-link ${active === "bookings" ? "active" : ""}`}>
          My Bookings
        </Link>
        {isAdmin && <a href="#" className="nav-link">Manage Rooms</a>}
      </nav>

      <div className="app-user">
        <span className="role-badge">Role: {isAdmin ? "Admin" : "User"}</span>
        <button className="logout-btn" onClick={handleLogout}>
          <LogOut size={14} />
          Logout
        </button>
        <div className="avatar">{storedUser?.name?.charAt(0) ?? "U"}</div>
      </div>
    </header>
  );
}

export default AppHeader;
