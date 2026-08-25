// สมุดรายชื่อ user ทั้งหมดในระบบ (ใช้เลือกคนเชิญประชุม, และหน้า Admin จัดการ user)
// แยกออกมาจาก mockApi.js เพราะไม่อยากให้หน้าอื่นต้องรู้เรื่อง password/login เลย
// แค่ต้องการรู้ว่า "มีใครอยู่ในระบบบ้าง" เท่านั้น

export const seedUsers = [
    { id: "u1", name: "Somchai Student", role: "user" },
    { id: "u2", name: "Nina Wattana", role: "user" },
    { id: "u3", name: "David Chen", role: "user" },
    { id: "u4", name: "Mai Suksan", role: "user" },
    { id: "u5", name: "Arthur Lee", role: "user" },
    { id: "u6", name: "Praew Intarat", role: "user" },
    { id: "u7", name: "Wisa Boonmee", role: "user" },
    { id: "a1", name: "Admin User", role: "admin" },
];
