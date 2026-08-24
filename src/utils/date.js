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
  // ใช้เป็น key เทียบวันที่ในตัวอย่าง mock schedule เช่น "2026-08-24"
  return date.toISOString().slice(0, 10);
}
