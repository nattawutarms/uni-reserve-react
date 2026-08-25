import { useState } from "react";
import { Check, X } from "lucide-react";
import { getAllBookings, updateBookingStatus } from "../api/bookingsStore.js";
import { getRoomById } from "../data/rooms.js";
import { getUserById } from "../data/users.js";
import { fromDateKey, formatDateLabel } from "../utils/date.js";
import { slotRangeLabel } from "../utils/time.js";
import AppHeader from "../components/AppHeader.jsx";
import "./AdminBookingsPage.css";

const STATUS_TABS = ["pending", "approved", "rejected", "completed", "no-show", "cancelled"];

const STATUS_META = {
    pending: { label: "Pending", className: "badge-pending" },
    approved: { label: "Approved", className: "badge-approved" },
    rejected: { label: "Rejected", className: "badge-rejected" },
    completed: { label: "Completed", className: "badge-completed" },
    "no-show": { label: "No-Show", className: "badge-rejected" },
    cancelled: { label: "Cancelled", className: "badge-cancelled" },
};

function AdminBookingsPage() {
    const [bookingList, setBookingList] = useState(getAllBookings);
    const [statusFilter, setStatusFilter] = useState("pending");

    const visibleBookings = bookingList.filter((b) => b.status === statusFilter);

    function handleDecision(booking, newStatus) {
        updateBookingStatus(booking.id, newStatus);
        setBookingList(getAllBookings());
    }

    return (
        <div className="admin-bookings-page">
            <AppHeader active="admin-bookings" />

            <h1>Manage Bookings</h1>
            <p className="page-subtitle">อนุมัติ/ปฏิเสธการจอง และดูสถานะทั้งหมดในระบบ</p>

            <div className="status-tabs">
                {STATUS_TABS.map((status) => (
                    <button
                        key={status}
                        className={statusFilter === status ? "active" : ""}
                        onClick={() => setStatusFilter(status)}
                    >
                        {STATUS_META[status].label}
                        <span className="tab-count">
                            {bookingList.filter((b) => b.status === status).length}
                        </span>
                    </button>
                ))}
            </div>

            <div className="bookings-table">
                <div className="table-header">
                    <span>Room</span>
                    <span>Organizer</span>
                    <span>Date & Time</span>
                    <span>Participants</span>
                    <span>Status</span>
                    <span>Actions</span>
                </div>

                {visibleBookings.map((booking) => {
                    const room = getRoomById(booking.roomId);
                    const organizer = getUserById(booking.ownerId);
                    const meta = STATUS_META[booking.status];

                    return (
                        <div className="table-row" key={booking.id}>
                            <span className="cell-room">{room?.name ?? "Unknown Room"}</span>
                            <span>{organizer?.name ?? "Unknown"}</span>
                            <span>
                                {formatDateLabel(fromDateKey(booking.dateKey))}
                                <br />
                                <span className="cell-time">{slotRangeLabel(booking.startTime, booking.duration || 1)}</span>
                            </span>
                            <span>{(booking.participants || []).length} invited</span>
                            <span>
                                <span className={`status-badge ${meta.className}`}>{meta.label}</span>
                            </span>
                            <span className="cell-actions">
                                {booking.status === "pending" ? (
                                    <>
                                        <button className="approve-btn" onClick={() => handleDecision(booking, "approved")}>
                                            <Check size={14} /> Approve
                                        </button>
                                        <button className="reject-btn" onClick={() => handleDecision(booking, "rejected")}>
                                            <X size={14} /> Reject
                                        </button>
                                    </>
                                ) : (
                                    <span className="no-action">—</span>
                                )}
                            </span>
                        </div>
                    );
                })}

                {visibleBookings.length === 0 && (
                    <p className="empty-text">ไม่มีรายการในสถานะนี้</p>
                )}
            </div>
        </div>
    );
}

export default AdminBookingsPage;