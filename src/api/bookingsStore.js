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

export function addBooking({ roomId, dateKey, startTime }) {
  const list = readRaw();
  const newBooking = {
    id: "bk-" + Date.now(),
    roomId,
    dateKey,
    startTime,
    status: "pending", // การจองใหม่ต้องรอ Admin อนุมัติก่อนเสมอ (ตามสเปค R11)
  };
  writeRaw([...list, newBooking]);
  return newBooking;
}

export function updateBookingStatus(id, status) {
  const list = readRaw();
  const updated = list.map((b) => (b.id === id ? { ...b, status } : b));
  writeRaw(updated);
}
