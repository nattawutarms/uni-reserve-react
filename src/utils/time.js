// ฟังก์ชันช่วยจัดรูปแบบเวลา แปลงจาก "10:30" (24 ชม.) เป็น "10:30 AM" (12 ชม.)

export function formatTime12(time24) {
  const [h, m] = time24.split(":").map(Number);
  return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")} น.`;
}

export function addHours(time24, hours) {
  const [h, m] = time24.split(":").map(Number);
  const newH = (h + hours) % 24;
  return `${String(newH).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
}

export function addOneHour(time24) {
  return addHours(time24, 1);
}

export function slotRangeLabel(startTime24, durationHours = 1) {
  const endTime24 = addHours(startTime24, durationHours);
  return `${formatTime12(startTime24)} - ${formatTime12(endTime24)}`;
}