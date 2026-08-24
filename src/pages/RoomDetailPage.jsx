import { useState, useMemo } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { Users, ChevronLeft, ChevronRight, Info } from "lucide-react";
import { getRoomById } from "../data/rooms.js";
import { getScheduleForDate, SLOT_TIMES } from "../data/schedule.js";
import { startOfToday, addDays, isSameDay, formatDateLabel, toDateKey } from "../utils/date.js";
import AppHeader from "../components/AppHeader.jsx";
import "./RoomDetailPage.css";

const MAX_DAYS_AHEAD = 30; // Calendar Guard: จองล่วงหน้าได้ไม่เกิน 30 วัน

function RoomDetailPage() {
  const { roomId } = useParams();
  const navigate = useNavigate();
  const room = getRoomById(roomId);

  const today = startOfToday();
  const [selectedDate, setSelectedDate] = useState(today);
  const [selectedSlots, setSelectedSlots] = useState([]);

  // ----- Calendar Guard: คำนวณว่าเลื่อนวัน ก่อนหน้า/ถัดไป ได้ไหม -----
  const canGoPrev = selectedDate > today;
  const canGoNext = selectedDate < addDays(today, MAX_DAYS_AHEAD - 1);

  function goPrevDay() {
    if (canGoPrev) {
      setSelectedDate((d) => addDays(d, -1));
      setSelectedSlots([]);
    }
  }

  function goNextDay() {
    if (canGoNext) {
      setSelectedDate((d) => addDays(d, 1));
      setSelectedSlots([]);
    }
  }

  // ----- ดึง schedule จำลองของวันที่เลือก -----
  const isToday = isSameDay(selectedDate, today);
  const schedule = useMemo(
    () => getScheduleForDate(roomId, toDateKey(selectedDate), isToday, new Date()),
    [roomId, selectedDate, isToday]
  );

  const morningSlots = schedule.filter((s) => Number(s.time.split(":")[0]) < 12);
  const afternoonSlots = schedule.filter((s) => Number(s.time.split(":")[0]) >= 12);

  function handleSlotClick(slot) {
    if (slot.status !== "available") return; // Overlap Guard: ห้ามเลือก slot ที่ booked/past

    const clickedIndex = SLOT_TIMES.indexOf(slot.time);

    setSelectedSlots((current) => {
      if (current.length === 0) {
        return [slot.time]; // ยังไม่มีอะไรเลือกไว้ เริ่มเลือกช่องนี้เป็นช่องแรก
      }

      const firstIndex = SLOT_TIMES.indexOf(current[0]);
      const lastIndex = SLOT_TIMES.indexOf(current[current.length - 1]);

      // คลิกช่องสุดท้ายที่เลือกไว้ซ้ำ -> ยุบออก (เอาออกจากท้าย)
      if (clickedIndex === lastIndex) {
        return current.slice(0, -1);
      }

      // คลิกช่องถัดจากช่องสุดท้ายพอดี -> ต่อเพิ่มไปข้างหลัง (ขยายเวลาให้นานขึ้น)
      if (clickedIndex === lastIndex + 1) {
        return [...current, slot.time];
      }

      // คลิกช่องก่อนหน้าช่องแรกพอดี -> ต่อเพิ่มไปข้างหน้า
      if (clickedIndex === firstIndex - 1) {
        return [slot.time, ...current];
      }

      // คลิกช่องอื่นที่ไม่ต่อเนื่องกับที่เลือกไว้ -> เริ่มเลือกใหม่จากช่องนี้
      return [slot.time];
    });
  }

  function handleReviewBooking() {
    if (selectedSlots.length === 0) return;
    navigate(`/rooms/${room.id}/confirm`, {
      state: {
        dateKey: toDateKey(selectedDate),
        time: selectedSlots[0], // เวลาเริ่มต้น = slot แรกที่เลือก
        duration: selectedSlots.length, // จำนวนชั่วโมง = จำนวน slot ที่เลือก
      },
    });
  }

  if (!room) {
    return (
      <div className="detail-page">
        <AppHeader active="rooms" />
        <p>ไม่พบห้องนี้</p>
        <Link to="/rooms">กลับไปหน้า Browse Rooms</Link>
      </div>
    );
  }

  return (
    <div className="detail-page">
      <AppHeader active="rooms" />
      <div className="breadcrumb">
        <Link to="/rooms">Browse Rooms</Link>
        <span>›</span>
        <span>{room.name}</span>
      </div>

      <div className="detail-layout">
        {/* ---------- ซ้าย: รูปภาพ + รายละเอียดห้อง ---------- */}
        <div className="detail-main">
          <div className="gallery">
            <img className="gallery-main" src={room.gallery[0]} alt={room.name} />
            {room.gallery.length > 1 && (
              <div className="gallery-thumbs">
                {room.gallery.slice(1, 3).map((src, i) => (
                  <img key={i} src={src} alt="" />
                ))}
              </div>
            )}
          </div>

          <div className="detail-title-row">
            <div>
              <h1>{room.name}</h1>
              <p className="detail-subtitle">{room.floor} • {room.wing}</p>
            </div>
            <span className="capacity-pill">
              <Users size={14} /> Up to {room.capacity}
            </span>
          </div>

          <hr />

          <h2>About this space</h2>
          <p className="about-text">{room.longDescription}</p>

          <h2>Amenities</h2>
          <ul className="amenities-list">
            {room.amenities.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>

        {/* ---------- ขวา: Schedule / Slot Picker ---------- */}
        <div className="schedule-card">
          <div className="schedule-header">
            <h2>Schedule</h2>
            <div className="date-nav">
              <button onClick={goPrevDay} disabled={!canGoPrev} aria-label="วันก่อนหน้า">
                <ChevronLeft size={16} />
              </button>
              <span>{formatDateLabel(selectedDate)}</span>
              <button onClick={goNextDay} disabled={!canGoNext} aria-label="วันถัดไป">
                <ChevronRight size={16} />
              </button>
            </div>
          </div>

          <div className="info-banner">
            <Info size={14} />
            Bookings require a minimum duration of 1 hour.
          </div>

          <div className="legend">
            <span><i className="dot available" /> Available</span>
            <span><i className="dot booked" /> Booked</span>
            <span><i className="dot selected" /> Selected</span>
          </div>

          <p className="slot-group-label">Morning</p>
          <div className="slot-list">
            {morningSlots.map((slot) => (
              <SlotRow
                key={slot.time}
                slot={slot}
                isSelected={selectedSlots.includes(slot.time)}
                onClick={handleSlotClick}
              />
            ))}
          </div>

          <p className="slot-group-label">Afternoon</p>
          <div className="slot-list">
            {afternoonSlots.map((slot) => (
              <SlotRow
                key={slot.time}
                slot={slot}
                isSelected={selectedSlots.includes(slot.time)}
                onClick={handleSlotClick}
              />
            ))}
          </div>

          <div className="duration-row">
            <span>Duration</span>
            <strong>
              {selectedSlots.length === 0
                ? "-"
                : `${selectedSlots.length} hour${selectedSlots.length > 1 ? "s" : ""}`}
            </strong>
          </div>

          <button
            className="review-btn"
            disabled={selectedSlots.length === 0}
            onClick={handleReviewBooking}
          >
            Review Booking →
          </button>
        </div>
      </div>
    </div>
  );
}

// แถวของแต่ละ slot เวลา แยกเป็น component ย่อยให้โค้ดหลักอ่านง่ายขึ้น
function SlotRow({ slot, isSelected, onClick }) {
  const status = isSelected ? "selected" : slot.status;

  return (
    <button
      className={`slot-row slot-${status}`}
      disabled={slot.status === "booked" || slot.status === "past"}
      onClick={() => onClick(slot)}
    >
      <span className="slot-time">{slot.time}</span>
      <span className="slot-status">
        {status === "available" && "Available"}
        {status === "selected" && "Selected"}
        {status === "booked" && `${slot.label} (Reserved)`}
        {status === "past" && "Passed"}
      </span>
    </button>
  );
}

export default RoomDetailPage;
