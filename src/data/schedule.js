// จำลอง schedule ของห้องในแต่ละวัน (ทีหลังจะดึงจาก backend จริงแทน)
// ช่วงเวลาเปิดจอง 08:30 - 17:30 แบ่งเป็นช่อง 1 ชั่วโมง = 9 ช่อง ตามกฎ business rule

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
  // เลือก 1-2 slot ให้เป็น "booked" แบบ deterministic ตาม hash
  const bookedIndex1 = hash % SLOT_TIMES.length;
  const bookedIndex2 = (hash * 7 + 3) % SLOT_TIMES.length;

  return SLOT_TIMES.map((time, index) => {
    let status = "available";
    let label = null;

    if (index === bookedIndex1 || index === bookedIndex2) {
      status = "booked";
      label = BOOKED_LABELS[(hash + index) % BOOKED_LABELS.length];
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
