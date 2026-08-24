import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { AlertTriangle, Pin, Calendar, Clock, Plus, Check, X, Mail } from "lucide-react";
import { getAllBookings, updateBookingStatus, updateParticipantStatus } from "../api/bookingsStore.js";
import { getRoomById } from "../data/rooms.js";
import { getUserById } from "../data/users.js";
import { startOfToday, fromDateKey, formatDateLabel } from "../utils/date.js";
import { slotRangeLabel } from "../utils/time.js";
import AppHeader from "../components/AppHeader.jsx";
import "./MyBookingsPage.css";

const MIN_CANCEL_DAYS = 3; // Cancellation Guard: ต้องยกเลิกล่วงหน้าอย่างน้อย 3 วัน

const STATUS_META = {
  pending: { label: "Pending", className: "badge-pending" },
  approved: { label: "Approved - Pending Check-in", className: "badge-approved" },
  "checked-in": { label: "Checked-in", className: "badge-approved" },
  completed: { label: "Completed", className: "badge-completed" },
  cancelled: { label: "Cancelled", className: "badge-cancelled" },
  "no-show": { label: "No-Show", className: "badge-cancelled" },
};

function daysUntil(date) {
  const today = startOfToday();
  return Math.round((date - today) / (1000 * 60 * 60 * 24));
}

function MyBookingsPage() {
  const navigate = useNavigate();
  const currentUser = JSON.parse(localStorage.getItem("user") || "null");
  const [bookingList, setBookingList] = useState(getAllBookings);
  const [tab, setTab] = useState("upcoming"); // "upcoming" | "past"

  const today = startOfToday();

  // "การจองของฉัน" = ตัวเองเป็นคนกดจอง (ownerId ตรงกับ user ที่ login อยู่)
  const myBookings = bookingList.filter((b) => b.ownerId === currentUser?.id);

  // "คำเชิญที่ได้รับ" = ตัวเองอยู่ใน participants ของการจองคนอื่น และยังไม่ได้ตอบรับ/ปฏิเสธ
  const myInvitations = bookingList.filter((b) =>
    (b.participants || []).some((p) => p.id === currentUser?.id)
  );

  const visibleBookings = myBookings.filter((b) => {
    const bookingDate = fromDateKey(b.dateKey);
    return tab === "upcoming"
      ? bookingDate >= today && b.status !== "cancelled"
      : bookingDate < today || b.status === "cancelled";
  });

  function handleCancel(booking) {
    const confirmed = window.confirm(`ยืนยันยกเลิกการจอง "${getRoomById(booking.roomId)?.name}" ใช่ไหม?`);
    if (!confirmed) return;

    updateBookingStatus(booking.id, "cancelled");
    setBookingList(getAllBookings()); // โหลดข้อมูลล่าสุดจาก store มาแสดงใหม่
  }

  function handleRespondInvite(bookingId, status) {
    updateParticipantStatus(bookingId, currentUser?.id, status);
    setBookingList(getAllBookings());
  }

  return (
    <div className="bookings-page">
      <AppHeader active="bookings" />

      <div className="banner banner-warning">
        <AlertTriangle size={14} />
        Cancellations must be made at least {MIN_CANCEL_DAYS} days prior to the event date.
      </div>

      <div className="banner banner-info">
        <Pin size={14} />
        Please check in with the Admin at the room location 15 minutes before your time slot.
      </div>
      {myInvitations.length > 0 && (
        <div className="invitations-section">
          <h2 className="invitations-title">
            <Mail size={16} /> Meeting Invitations
          </h2>
          <div className="invitations-list">
            {myInvitations.map((booking) => {
              const room = getRoomById(booking.roomId);
              const organizer = getUserById(booking.ownerId);
              const myStatus = booking.participants.find((p) => p.id === currentUser?.id)?.status;

              return (
                <div className="invite-card" key={booking.id}>
                  <div className="invite-info">
                    <p className="invite-title">{booking.title || "Untitled Meeting"}</p>
                    <p className="invite-meta">
                      {room?.name} · {formatDateLabel(fromDateKey(booking.dateKey))} ·{" "}
                      {slotRangeLabel(booking.startTime, booking.duration || 1)}
                    </p>
                    <p className="invite-meta">Invited by {organizer?.name ?? "Unknown"}</p>
                  </div>

                  {myStatus === "pending" ? (
                    <div className="invite-actions">
                      <button
                        className="accept-btn"
                        onClick={() => handleRespondInvite(booking.id, "accepted")}
                      >
                        <Check size={14} /> Accept
                      </button>
                      <button
                        className="decline-btn"
                        onClick={() => handleRespondInvite(booking.id, "declined")}
                      >
                        <X size={14} /> Decline
                      </button>
                    </div>
                  ) : (
                    <span className={`invite-status-badge ${myStatus}`}>
                      {myStatus === "accepted" ? "Accepted" : "Declined"}
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
      <div className="bookings-heading">
        <div>
          <h1>My Bookings</h1>
          <p>Manage your upcoming reservations and view past history.</p>
        </div>

        <div className="tab-switch">
          <button
            className={tab === "upcoming" ? "active" : ""}
            onClick={() => setTab("upcoming")}
          >
            Upcoming Bookings
          </button>
          <button
            className={tab === "past" ? "active" : ""}
            onClick={() => setTab("past")}
          >
            Past History
          </button>
        </div>
      </div>

      <div className="bookings-grid">
        {visibleBookings.map((booking) => {
          const room = getRoomById(booking.roomId);
          const meta = STATUS_META[booking.status];
          const canCancel =
            tab === "upcoming" &&
            (booking.status === "pending" || booking.status === "approved") &&
            daysUntil(fromDateKey(booking.dateKey)) >= MIN_CANCEL_DAYS;

          if (!room) return null;

          return (
            <div className="booking-card" key={booking.id}>
              <div className="booking-image-wrap">
                <img src={room.image} alt={room.name} />
                <span className={`status-badge ${meta.className}`}>{meta.label}</span>
              </div>

              <div className="booking-body">
                <h3>{room.name}</h3>
                <p className="booking-line">
                  <Calendar size={13} /> {formatDateLabel(fromDateKey(booking.dateKey))}
                </p>
                <p className="booking-line">
                  <Clock size={13} /> {slotRangeLabel(booking.startTime)}
                </p>

                {tab === "upcoming" && (
                  <button
                    className="cancel-btn"
                    disabled={!canCancel}
                    onClick={() => handleCancel(booking)}
                    title={!canCancel ? `ยกเลิกไม่ได้ ต้องล่วงหน้า ${MIN_CANCEL_DAYS} วันขึ้นไป` : ""}
                  >
                    Cancel Booking
                  </button>
                )}
              </div>
            </div>
          );
        })}

        {tab === "upcoming" && (
          <div className="booking-card add-card" onClick={() => navigate("/rooms")}>
            <div className="add-icon">
              <Plus size={22} />
            </div>
            <h3>Need another room?</h3>
            <p>Browse available spaces for your next meeting.</p>
            <button className="browse-btn">Browse Rooms</button>
          </div>
        )}

        {visibleBookings.length === 0 && tab === "past" && (
          <p className="empty-text">ยังไม่มีประวัติการจองที่ผ่านมา</p>
        )}
      </div>
    </div>
  );
}

export default MyBookingsPage;
