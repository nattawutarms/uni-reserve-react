// จำลอง schedule ของห้องในแต่ละวัน (ทีหลังจะดึงจาก backend จริงแทน)
// ช่วงเวลาเปิดจอง 08:30 - 17:30 แบ่งเป็นช่อง 1 ชั่วโมง = 9 ช่อง ตามกฎ business rule
import { getAllBookings } from "../api/bookingsStore.js";
import { addHours } from "../utils/time.js";

export const SLOT_TIMES = [
  "08:30", "09:30", "10:30", "11:30",
  "12:30", "13:30", "14:30", "15:30", "16:30",
];

// ทำ hash ง่ายๆ จาก string เพื่อสุ่มแบบ deterministic (roomId + date เดิม จะได้ผลเดิมเสมอ)
function simpleHash(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash * 31 + str.charCodeAt(i)) % 1000;
  }
  return hash;
}

const BOOKED_LABELS = ["Marketing Sync", "Lunch Hold", "Client Call", "Team Retro"];

/**
 * getScheduleForDate - จำลองการดึงตารางเวลาห้องจาก backend
 * คืนค่าเป็น array ของ { time, status, label }
 * status: "available" | "booked" | "past"
 */
export function getScheduleForDate(roomId, dateKey, isToday, now) {
  const hash = simpleHash(roomId + dateKey);
  // เลือก 1-2 slot ให้เป็น "booked" แบบ deterministic ตาม hash (mock บรรยากาศ ไม่ใช่ของจริง)
  const bookedIndex1 = hash % SLOT_TIMES.length;
  const bookedIndex2 = (hash * 7 + 3) % SLOT_TIMES.length;

  // ----- เช็คการจองจริงของห้องนี้ วันนี้ (Overlap Guard ตัวจริง) -----
  // สร้าง Set ของเวลาที่ "ถูกจองจริงแล้ว" พร้อมชื่อหัวข้อประชุม
  const realBookings = getAllBookings().filter(
    (b) => b.roomId === roomId && b.dateKey === dateKey && b.status !== "cancelled"
  );

  const realBookedMap = {}; // { "08:30": "ชื่อหัวข้อประชุม", ... }
  realBookings.forEach((booking) => {
    let slotTime = booking.startTime;
    for (let i = 0; i < (booking.duration || 1); i++) {
      realBookedMap[slotTime] = booking.title || "Booked";
      slotTime = addHours(slotTime, 1);
    }
  });

  return SLOT_TIMES.map((time, index) => {
    let status = "available";
    let label = null;

    if (index === bookedIndex1 || index === bookedIndex2) {
      status = "booked";
      label = BOOKED_LABELS[(hash + index) % BOOKED_LABELS.length];
    }

    // การจองจริงมีความสำคัญกว่า mock เสมอ (ทับค่าข้างบนได้ แม้ mock จะบอกว่า available)
    if (realBookedMap[time]) {
      status = "booked";
      label = realBookedMap[time];
    }

    // Time Guard ส่วนหนึ่ง: ถ้าเป็นวันนี้และเวลาผ่านไปแล้ว ห้ามเลือก
    if (isToday && status === "available") {
      const [h, m] = time.split(":").map(Number);
      const slotDate = new Date(now);
      slotDate.setHours(h, m, 0, 0);
      if (slotDate < now) {
        status = "past";
      }
    }

    return { time, status, label };
  });
}