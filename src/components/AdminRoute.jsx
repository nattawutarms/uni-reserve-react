import { Navigate } from "react-router-dom";

// เหมือน ProtectedRoute แต่เช็คเพิ่มว่า role ต้องเป็น "admin" เท่านั้น
// user ธรรมดาที่พิมพ์ URL /admin/... ตรงๆ จะถูกเด้งกลับไปหน้า Browse Rooms
function AdminRoute({ children }) {
    const token = localStorage.getItem("token");
    const user = JSON.parse(localStorage.getItem("user") || "null");

    if (!token) {
        return <Navigate to="/" replace />;
    }

    if (user?.role !== "admin") {
        return <Navigate to="/rooms" replace />;
    }

    return children;
}

export default AdminRoute;