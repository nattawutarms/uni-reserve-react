import { useState } from "react";
import { useLocation, useNavigate, useParams, Link } from "react-router-dom";
import { AlertTriangle, Calendar, Clock, Users } from "lucide-react";
import { getRoomById } from "../api/roomsStore.js";
import { addBooking } from "../api/bookingsStore.js";
import { getAllUsers } from "../api/usersStore.js";
import { fromDateKey, formatDateLabel } from "../utils/date.js";
import { slotRangeLabel } from "../utils/time.js";
import AppHeader from "../components/AppHeader.jsx";
import "./ConfirmBookingPage.css";

function ConfirmBookingPage() {
  const { roomId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const room = getRoomById(roomId);

  // ข้อมูลวัน/เวลาที่เลือกไว้ ถูกส่งมาจากหน้า Room Detail ผ่าน navigate(path, { state })
  const { dateKey, time, duration = 1 } = location.state || {};

  // คนที่ login อยู่ตอนนี้ คือคนที่จะเป็น "เจ้าของการจอง" (organizer)
  const currentUser = JSON.parse(localStorage.getItem("user") || "null");

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [selectedParticipantIds, setSelectedParticipantIds] = useState([]);

  // รายชื่อที่เลือกเชิญได้ = ทุกคนในระบบ ยกเว้นตัวเอง
  const inviteableUsers = getAllUsers().filter((u) => u.id !== currentUser?.id);

  function toggleParticipant(userId) {
    setSelectedParticipantIds((current) =>
      current.includes(userId)
        ? current.filter((id) => id !== userId)
        : [...current, userId]
    );
  }

  // ถ้าใครเข้าหน้านี้ตรงๆ โดยไม่ได้เลือกวัน/เวลามาก่อน (เช่น พิมพ์ URL เอง) ให้เด้งกลับ
  if (!room || !dateKey || !time) {
    return (
      <div className="confirm-page">
        <AppHeader active="rooms" />
        <p>ไม่พบข้อมูลการจอง กรุณาเลือกช่วงเวลาจากหน้ารายละเอียดห้องก่อน</p>
        <Link to={`/rooms/${roomId}`}>กลับไปเลือกเวลา</Link>
      </div>
    );
  }

  function handleConfirm() {
    addBooking({
      roomId: room.id,
      dateKey,
      startTime: time,
      duration,
      title: title.trim() || "Untitled Meeting",
      description: description.trim(),
      ownerId: currentUser?.id,
      participantIds: selectedParticipantIds,
    });
    navigate("/my-bookings");
  }

  return (
    <div className="confirm-page">
      <AppHeader active="rooms" />

      <div className="breadcrumb">
        <Link to="/rooms">Browse Rooms</Link>
        <span>›</span>
        <Link to={`/rooms/${room.id}`}>{room.name}</Link>
        <span>›</span>
        <span>Confirm Booking</span>
      </div>

      <div className="confirm-card">
        <h1>Confirm Your Booking</h1>
        <p className="confirm-subtitle">ตรวจสอบรายละเอียดให้ถูกต้องก่อนยืนยัน</p>

        <div className="confirm-room-row">
          <img src={room.image} alt={room.name} />
          <div>
            <h2>{room.name}</h2>
            <p>{room.floor} • {room.wing}</p>
          </div>
        </div>

        <div className="confirm-details">
          <div className="detail-item">
            <Calendar size={16} />
            <div>
              <span className="detail-label">Date</span>
              <span className="detail-value">{formatDateLabel(fromDateKey(dateKey))}</span>
            </div>
          </div>
          <div className="detail-item">
            <Clock size={16} />
            <div>
              <span className="detail-label">Time</span>
              <span className="detail-value">{slotRangeLabel(time, duration)}</span>
            </div>
          </div>
          <div className="detail-item">
            <Users size={16} />
            <div>
              <span className="detail-label">Capacity</span>
              <span className="detail-value">Up to {room.capacity} people</span>
            </div>
          </div>
        </div>
        <div className="form-section">
          <label className="form-label">Meeting Title</label>
          <input
            type="text"
            className="form-input"
            placeholder="เช่น Weekly Team Sync"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>

        <div className="form-section">
          <label className="form-label">Description</label>
          <textarea
            className="form-textarea"
            placeholder="รายละเอียดคร่าวๆ ว่าประชุมเรื่องอะไร (ไม่บังคับ)"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>

        <div className="form-section">
          <label className="form-label">Invite Participants</label>
          <div className="participant-list">
            {inviteableUsers.map((u) => (
              <label key={u.id} className="participant-row">
                <input
                  type="checkbox"
                  checked={selectedParticipantIds.includes(u.id)}
                  onChange={() => toggleParticipant(u.id)}
                />
                {u.name}
              </label>
            ))}
          </div>
        </div>

        <div className="policy-banner">
          <AlertTriangle size={14} />
          การจองนี้จะมีสถานะ "Pending" จนกว่า Admin จะอนุมัติ และต้องมารายงานตัวก่อนเวลาเริ่มใช้งาน 15 นาที มิฉะนั้นจะถือเป็น No-Show
        </div>

        <div className="confirm-actions">
          <button className="btn-secondary" onClick={() => navigate(-1)}>
            ย้อนกลับไปแก้ไข
          </button>
          <button className="btn-primary" onClick={handleConfirm}>
            Confirm Booking
          </button>
        </div>
      </div>
    </div>
  );
}

export default ConfirmBookingPage;
