// ฟังก์ชันช่วยจัดรูปแบบเวลา แปลงจาก "10:30" (24 ชม.) เป็น "10:30 AM" (12 ชม.)

export function formatTime12(time24) {
  const [h, m] = time24.split(":").map(Number);
  const period = h >= 12 ? "PM" : "AM";
  const hour12 = h % 12 === 0 ? 12 : h % 12;
  return `${hour12}:${String(m).padStart(2, "0")} ${period}`;
}

export function addOneHour(time24) {
  const [h, m] = time24.split(":").map(Number);
  const newH = (h + 1) % 24;
  return `${String(newH).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
}

// คืนค่าเป็น "10:30 AM - 11:30 AM" จากเวลาเริ่มต้น (การจองขั้นต่ำ 1 ชั่วโมงตามสเปค)
export function slotRangeLabel(startTime24) {
  const endTime24 = addOneHour(startTime24);
  return `${formatTime12(startTime24)} - ${formatTime12(endTime24)}`;
}
