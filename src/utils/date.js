// ฟังก์ชันช่วยจัดการวันที่ ใช้ร่วมกันหลายหน้า (Calendar Guard ตามสเปค)

export function startOfToday() {
  const d = new Date();
  d.setHours(0, 0, 0, 0);
  return d;
}

export function addDays(date, days) {
  const d = new Date(date);
  d.setDate(d.getDate() + days);
  return d;
}

export function isSameDay(a, b) {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

export function formatDateLabel(date) {
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function toDateKey(date) {
  // ใช้ local date components แทน toISOString() เพราะ toISOString ใช้ UTC
  // ถ้า timezone ของเครื่อง user ต่างจาก UTC อาจได้วันที่เพี้ยนไป 1 วัน
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

export function fromDateKey(dateKey) {
  // แปลง "2026-08-24" กลับเป็น Date แบบ local midnight (ไม่ใช้ UTC)
  const [y, m, d] = dateKey.split("-").map(Number);
  return new Date(y, m - 1, d);
}
