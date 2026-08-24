import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Search } from "lucide-react";
import { Video, Presentation, PenSquare, Users } from "lucide-react";
import { rooms } from "../data/rooms.js";
import { SLOT_TIMES } from "../data/schedule.js";
import { slotRangeLabel } from "../utils/time.js";
import AppHeader from "../components/AppHeader.jsx";
import "./BrowseRoomsPage.css";
// ไอคอนแทนอุปกรณ์แต่ละชนิด ใช้ key เดียวกับใน rooms.js (equipment array)
const EQUIPMENT_ICONS = {
  video: Video,
  projector: Presentation,
  whiteboard: PenSquare,
};

function BrowseRoomsPage() {
  const navigate = useNavigate();

  const [searchQuery, setSearchQuery] = useState("");
  const [minCapacity, setMinCapacity] = useState(2);
  const [equipmentFilter, setEquipmentFilter] = useState({
    projector: false,
    video: false,
    whiteboard: false,
  });

  function handleBookNow(room) {
    navigate(`/rooms/${room.id}`);
  }

  function toggleEquipment(key) {
    setEquipmentFilter((current) => ({ ...current, [key]: !current[key] }));
  }

  // ห้องที่ผ่านเงื่อนไขทุกตัวกรองพร้อมกัน (search + capacity + equipment)
  const filteredRooms = rooms.filter((room) => {
    const matchesSearch = room.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCapacity = room.capacity >= minCapacity;

    // เช็คว่าอุปกรณ์ที่ "ติ๊กไว้" ทุกตัว ห้องนี้ต้องมีครบ
    const activeFilters = Object.keys(equipmentFilter).filter((key) => equipmentFilter[key]);
    const matchesEquipment = activeFilters.every((key) => room.equipment.includes(key));

    return matchesSearch && matchesCapacity && matchesEquipment;
  });

  return (
    <div className="venue-page">
      <AppHeader active="rooms" />

      {/* ---------- Hero ---------- */}
      <section className="venue-hero">
        <h1>Find Your Space</h1>
        <p>
          Filter our premium room catalog to find the exact setup for your next meeting,
          presentation, or collaborative session.
        </p>
      </section>

      {/* ---------- Filter bar (UI only ตอนนี้ ยังไม่กรองข้อมูลจริง) ---------- */}
      <section className="filter-card">
        <div className="filter-block">
          <label className="filter-label">Schedule</label>
          <div className="filter-row">
            <input type="date" defaultValue="2024-05-15" />
            <select defaultValue={SLOT_TIMES[0]}>
              {SLOT_TIMES.map((time) => (
                <option key={time} value={time}>
                  {slotRangeLabel(time)}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="filter-block">
          <div className="filter-label-row">
            <label className="filter-label">Capacity</label>
            <span className="capacity-badge">{minCapacity}+ People</span>
          </div>
          <input
            type="range"
            min="2"
            max="50"
            value={minCapacity}
            onChange={(e) => setMinCapacity(Number(e.target.value))}
          />
          <div className="range-scale">
            <span>2</span>
            <span>50</span>
          </div>
        </div>

        <div className="filter-block">
          <label className="filter-label">Equipment</label>
          <label className="checkbox-row">
            <input
              type="checkbox"
              checked={equipmentFilter.projector}
              onChange={() => toggleEquipment("projector")}
            />
            Projector
          </label>
          <label className="checkbox-row">
            <input
              type="checkbox"
              checked={equipmentFilter.video}
              onChange={() => toggleEquipment("video")}
            />
            Video Conference
          </label>
          <label className="checkbox-row">
            <input
              type="checkbox"
              checked={equipmentFilter.whiteboard}
              onChange={() => toggleEquipment("whiteboard")}
            />
            Whiteboard
          </label>
        </div>
      </section>

      {/* ---------- Room list ---------- */}
      <section className="rooms-section">
        <div className="search-bar">
          <Search size={16} />
          <input
            type="text"
            placeholder="Search rooms by name..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="rooms-heading">
          <h2>Available Spaces</h2>
          <span className="results-count">Showing {filteredRooms.length} results</span>
        </div>

        <div className="rooms-grid">
          {filteredRooms.map((room) => (
            <div className="room-card" key={room.id}>
              <div className="room-image-wrap">
                <img src={room.image} alt={room.name} />
                <span className={`availability-badge ${room.available ? "" : "unavailable"}`}>
                  {room.available ? "● AVAILABLE" : "● BOOKED"}
                </span>
              </div>

              <div className="room-body">
                <h3>{room.name}</h3>
                <p className="room-desc">{room.description}</p>

                <div className="room-footer">
                  <div className="room-meta">
                    <span className="meta-item">
                      <Users size={14} /> Up to {room.capacity}
                    </span>
                    {room.equipment.map((key) => {
                      const Icon = EQUIPMENT_ICONS[key];
                      return Icon ? <Icon size={14} key={key} className="meta-icon" /> : null;
                    })}
                  </div>

                  <button
                    className="book-btn"
                    disabled={!room.available}
                    onClick={() => handleBookNow(room)}
                  >
                    {room.available ? "Book Now" : "Unavailable"}
                  </button>
                </div>
              </div>
            </div>
          ))}
          {filteredRooms.length === 0 && (
            <p className="empty-rooms-text">ไม่พบห้องที่ตรงเงื่อนไข ลองปรับตัวกรองใหม่</p>
          )}
        </div>
      </section>
    </div>
  );
}

export default BrowseRoomsPage;
