/*
  ============================================================
  BOOKINGS STORE
  ============================================================
  ตอนนี้ยังไม่มี backend จริง เลยใช้ localStorage เก็บรายการจองไว้แทน
  เพื่อให้การจองที่สร้างในหน้า Confirm Booking ไปโผล่ในหน้า My Bookings ได้จริง
  (ข้อมูลจะอยู่แค่ในเบราว์เซอร์เครื่องนี้ ถ้าเปลี่ยนเครื่อง/ล้าง cache จะหายไป)

  พอมี backend จริง ให้แก้ทั้ง 3 ฟังก์ชันด้านล่างให้เป็น fetch() ไปหา API แทน
  (เช่น getAllBookings -> GET /api/bookings, addBooking -> POST /api/bookings)
  หน้าที่เรียกใช้ (MyBookingsPage, ConfirmBookingPage) ไม่ต้องแก้เลย
  ============================================================
*/

import { seedBookings } from "../data/bookings.js";

const STORAGE_KEY = "unireserve_bookings";

function readRaw() {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) {
    // ครั้งแรกที่ยังไม่มีข้อมูลเลย ใส่ mock data เริ่มต้นไปก่อน
    localStorage.setItem(STORAGE_KEY, JSON.stringify(seedBookings));
    return seedBookings;
  }
  return JSON.parse(stored);
}

function writeRaw(list) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
}

export function getAllBookings() {
  return readRaw();
}

export function addBooking({ roomId, dateKey, startTime, duration = 1, title, description, ownerId, participantIds = [] }) {
  const list = readRaw();
  const newBooking = {
    id: "bk-" + Date.now(),
    roomId,
    dateKey,
    startTime,
    duration,
    title,
    description,
    ownerId, // id ของคนที่เป็นคนจอง (organizer) ใช้แยก "การจองของฉัน"
    // เก็บผู้เข้าร่วมเป็น id ไม่ใช่ชื่อ กันปัญหาชื่อซ้ำ แต่ละคนมีสถานะตอบรับแยกกัน
    participants: participantIds.map((id) => ({ id, status: "pending" })),
    status: "pending", // สถานะของ "การจองห้อง" (รอ Admin อนุมัติ) คนละเรื่องกับสถานะผู้เข้าร่วม
  };
  writeRaw([...list, newBooking]);
  return newBooking;
}

export function updateBookingStatus(id, status) {
  const list = readRaw();
  const updated = list.map((b) => (b.id === id ? { ...b, status } : b));
  writeRaw(updated);
}
export function updateParticipantStatus(bookingId, participantId, status) {
  const list = readRaw();
  const updated = list.map((b) => {
    if (b.id !== bookingId) return b;
    return {
      ...b,
      participants: (b.participants || []).map((p) =>
        p.id === participantId ? { ...p, status } : p
      ),
    };
  });
  writeRaw(updated);
}
