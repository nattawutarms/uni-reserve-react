import { BrowserRouter, Routes, Route } from "react-router-dom";
import LoginPage from "./pages/LoginPage.jsx";
import BrowseRoomsPage from "./pages/BrowseRoomsPage.jsx";
import RoomDetailPage from "./pages/RoomDetailPage.jsx";
import ConfirmBookingPage from "./pages/ConfirmBookingPage.jsx";
import MyBookingsPage from "./pages/MyBookingsPage.jsx";
import AdminBookingsPage from "./pages/AdminBookingsPage.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";
import AdminRoute from "./components/AdminRoute.jsx";

// เพิ่มหน้าใหม่ในอนาคต (เช่น /admin) แค่เพิ่ม <Route> ตรงนี้
// ห่อด้วย <ProtectedRoute> ถ้าหน้านั้นต้อง login ก่อนถึงเข้าได้
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LoginPage />} />
        <Route
          path="/rooms"
          element={
            <ProtectedRoute>
              <BrowseRoomsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/rooms/:roomId"
          element={
            <ProtectedRoute>
              <RoomDetailPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/rooms/:roomId/confirm"
          element={
            <ProtectedRoute>
              <ConfirmBookingPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/my-bookings"
          element={
            <ProtectedRoute>
              <MyBookingsPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/bookings"
          element={
            <AdminRoute>
              <AdminBookingsPage />
            </AdminRoute>
          }
        />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
