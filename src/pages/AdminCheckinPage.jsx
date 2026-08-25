import { useState } from "react";
import { ChevronLeft, ChevronRight, LogIn, UserX } from "lucide-react";
import { getAllBookings, updateBookingStatus } from "../api/bookingsStore.js";
import { getRoomById } from "../api/roomsStore.js";
import { getUserById } from "../data/users.js";
import { startOfToday, addDays, toDateKey, fromDateKey, formatDateLabel } from "../utils/date.js";
import { slotRangeLabel } from "../utils/time.js";
import AppHeader from "../components/AppHeader.jsx";
import "./AdminCheckinPage.css";

const STATUS_META = {
    approved: { label: "Approved - Pending Check-in", className: "badge-approved" },
    "checked-in": { label: "Checked-in", className: "badge-checked-in" },
    "no-show": { label: "No-Show", className: "badge-no-show" },
};

function AdminCheckinPage() {
    const [selectedDate, setSelectedDate] = useState(startOfToday());
    const [bookingList, setBookingList] = useState(getAllBookings);

    const dateKey = toDateKey(selectedDate);

    // เฉพาะ booking ที่อนุมัติแล้ว/เช็คอินไปแล้ว/no-show ของวันนี้เท่านั้น
    // (pending/rejected/cancelled ไม่เกี่ยวกับหน้า check-in)
    const todaysBookings = bookingList
        .filter((b) => b.dateKey === dateKey && ["approved", "checked-in", "no-show"].includes(b.status))
        .sort((a, b) => a.startTime.localeCompare(b.startTime));

    function handleAction(booking, newStatus) {
        updateBookingStatus(booking.id, newStatus);
        setBookingList(getAllBookings());
    }

    function goPrevDay() {
        setSelectedDate((d) => addDays(d, -1));
    }

    function goNextDay() {
        setSelectedDate((d) => addDays(d, 1));
    }

    function handleDateInputChange(e) {
        setSelectedDate(fromDateKey(e.target.value));
    }

    return (
        <div className="checkin-page">
            <AppHeader active="admin-checkin" />

            <div className="checkin-content">
                <h1>Check-in Station</h1>
                <p className="page-subtitle">ยืนยันตัวตนผู้เข้าประชุมประจำวัน ก่อนเวลาเริ่มใช้งาน 15 นาที</p>

                <div className="date-picker-bar">
                    <button onClick={goPrevDay} aria-label="วันก่อนหน้า">
                        <ChevronLeft size={16} />
                    </button>
                    <input type="date" value={dateKey} onChange={handleDateInputChange} />
                    <button onClick={goNextDay} aria-label="วันถัดไป">
                        <ChevronRight size={16} />
                    </button>
                    <span className="date-label">{formatDateLabel(selectedDate)}</span>
                </div>

                <div className="checkin-list">
                    {todaysBookings.map((booking) => {
                        const room = getRoomById(booking.roomId);
                        const organizer = getUserById(booking.ownerId);
                        const meta = STATUS_META[booking.status];

                        return (
                            <div className="checkin-card" key={booking.id}>
                                <div className="checkin-info">
                                    <p className="checkin-time">{slotRangeLabel(booking.startTime, booking.duration || 1)}</p>
                                    <p className="checkin-room">{room?.name ?? "Unknown Room"}</p>
                                    <p className="checkin-organizer">{organizer?.name ?? "Unknown"} · {booking.title || "Untitled Meeting"}</p>
                                </div>

                                {booking.status === "approved" ? (
                                    <div className="checkin-actions">
                                        <button className="checkin-btn" onClick={() => handleAction(booking, "checked-in")}>
                                            <LogIn size={14} /> Confirm Check-in
                                        </button>
                                        <button className="noshow-btn" onClick={() => handleAction(booking, "no-show")}>
                                            <UserX size={14} /> Mark No-Show
                                        </button>
                                    </div>
                                ) : (
                                    <span className={`status-badge ${meta.className}`}>{meta.label}</span>
                                )}
                            </div>
                        );
                    })}

                    {todaysBookings.length === 0 && (
                        <p className="empty-text">ไม่มีการจองที่ต้อง check-in ในวันนี้</p>
                    )}
                </div>
            </div>
        </div>
    );
}

export default AdminCheckinPage;