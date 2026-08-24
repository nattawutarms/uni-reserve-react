import { Navigate } from "react-router-dom";

// ห่อหน้าไหนก็ตามด้วย component นี้ ถ้ายังไม่ login (ไม่มี token ใน localStorage)
// จะถูกเด้งกลับไปหน้า login อัตโนมัติ
// ของจริงตอนมี backend: อาจเพิ่มการเช็คว่า token หมดอายุหรือยังด้วย
function ProtectedRoute({ children }) {
  const token = localStorage.getItem("token");

  if (!token) {
    return <Navigate to="/" replace />;
  }

  return children;
}

export default ProtectedRoute;
