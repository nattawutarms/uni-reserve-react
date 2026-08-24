/*
  ============================================================
  MOCK API LAYER (เวอร์ชัน React)
  ============================================================
  หลักการเดียวกับตอน vanilla JS: component ไม่รู้ว่าข้างในนี้
  ทำงานยังไง รู้แค่ว่าเรียก login() แล้วได้ผลลัพธ์รูปแบบเดิมกลับมา

  พอมี backend จริง ให้แก้แค่ไฟล์นี้ไฟล์เดียว เปลี่ยนจาก
  setTimeout เป็น fetch() จริง ไม่ต้องแตะ component เลย
  ============================================================
*/

const FAKE_USERS = [
  { id: "u1", identifier: "01", password: "123456", role: "user", name: "Somchai Student" },
  { id: "u2", identifier: "02", password: "123456", role: "user", name: "Nina Wattana" },
  { id: "u3", identifier: "03", password: "123456", role: "user", name: "David Chen" },
  { id: "u4", identifier: "04", password: "123456", role: "user", name: "Mai Suksan" },
  { id: "u5", identifier: "05", password: "123456", role: "user", name: "Arthur Lee" },
  { id: "u6", identifier: "06", password: "123456", role: "user", name: "Praew Intarat" },
  { id: "u7", identifier: "07", password: "123456", role: "user", name: "Wisa Boonmee" },
  { id: "a1", identifier: "admin@test.com", password: "admin123", role: "admin", name: "Admin User" },
];

/**
 * login - จำลองการ login กับ backend
 * @param {string} identifier
 * @param {string} password
 * @param {string} role - "user" หรือ "admin"
 * @returns {Promise<{success: boolean, token?: string, user?: object, message?: string}>}
 */
export function login(identifier, password, role) {
  return new Promise((resolve) => {
    setTimeout(() => {
      const foundUser = FAKE_USERS.find(
        (u) => u.identifier === identifier && u.password === password && u.role === role
      );

      if (foundUser) {
        resolve({
          success: true,
          token: "fake-jwt-token-" + Date.now(),
          user: { id: foundUser.id, name: foundUser.name, role: foundUser.role },
        });
      } else {
        resolve({
          success: false,
          message: "อีเมล/รหัสผ่าน หรือประเภทผู้ใช้ไม่ถูกต้อง",
        });
      }
    }, 800);
  });
}

/*
  ============================================================
  ตัวอย่าง: พอมี backend จริงแล้ว จะแก้เป็นแบบนี้

  export async function login(identifier, password, role) {
    const response = await fetch("https://your-backend.com/api/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ identifier, password, role }),
    });
    return await response.json();
  }
  ============================================================
*/
