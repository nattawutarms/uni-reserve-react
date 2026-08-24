// ข้อมูลเริ่มต้น (seed) สำหรับ localStorage ตอนที่ยังไม่เคยมีการจองใดๆ เลย
// ใช้ตอน bookingsStore.js เจอว่า localStorage ว่างอยู่ครั้งแรก
import { addDays, startOfToday, toDateKey } from "../utils/date.js";

const today = startOfToday();

// status ที่เป็นไปได้ตามสเปค: pending, approved, checked-in, no-show, cancelled, completed
// startTime เป็นรูปแบบ 24 ชม. ("HH:MM") ให้ตรงกับ SLOT_TIMES ใน schedule.js
export const seedBookings = [
  {
    id: "bk-1",
    roomId: "room-1",
    dateKey: toDateKey(addDays(today, 2)),
    startTime: "10:30",
    status: "approved",
  },
  {
    id: "bk-2",
    roomId: "room-3",
    dateKey: toDateKey(addDays(today, 5)),
    startTime: "14:30",
    status: "pending",
  },
  {
    id: "bk-3",
    roomId: "room-2",
    dateKey: toDateKey(addDays(today, -10)),
    startTime: "09:30",
    status: "completed",
  },
  {
    id: "bk-4",
    roomId: "room-1",
    dateKey: toDateKey(addDays(today, -5)),
    startTime: "13:30",
    status: "no-show",
  },
];
