# UniReserve / VenueMaster — API Specification

เอกสารนี้สรุป endpoint ที่ backend ต้องทำ โดยอ้างอิงจากพฤติกรรมจริงที่ frontend ใช้งานอยู่ตอนนี้ (mock ด้วย localStorage) ทุก endpoint ระบุ request/response ให้ตรงกับ shape ข้อมูลที่ frontend คาดหวังอยู่แล้ว เพื่อให้สลับจาก mock เป็นของจริงได้โดยแทบไม่ต้องแก้โค้ดฝั่ง frontend

**Base URL สมมติ:** `https://api.example.com`
**Auth:** ทุก endpoint ยกเว้น login ต้องแนบ `Authorization: Bearer <token>` ที่ได้จากตอน login

---

## 1. Authentication

### POST `/api/auth/login`

**Request body:**
```json
{
  "identifier": "student@test.com",
  "password": "123456",
  "role": "user"
}
```

**Response (สำเร็จ):**
```json
{
  "success": true,
  "token": "eyJhbGciOi...",
  "user": { "id": "u1", "name": "Somchai Student", "role": "user" }
}
```

**Response (ล้มเหลว):**
```json
{ "success": false, "message": "อีเมล/รหัสผ่าน หรือประเภทผู้ใช้ไม่ถูกต้อง" }
```

**หมายเหตุ:** `role` ที่ frontend ส่งมาคือ role ที่ผู้ใช้เลือกจาก tab ตอน login (Student/User หรือ Admin) — backend ควรเช็คว่า role ที่เลือกตรงกับ role จริงของ account ไหม ถ้าไม่ตรงให้ตอบ `success: false` เหมือนรหัสผ่านผิด (ไม่ต้องบอกว่า "role ไม่ตรง" เพื่อความปลอดภัย)

---

## 2. Users

### GET `/api/users`
คืนรายชื่อ user ทั้งหมด (ไม่รวม password) ใช้แสดงในลิสต์เชิญประชุมและหน้า Admin จัดการ user

**Response:**
```json
[
  { "id": "u1", "name": "Somchai Student", "role": "user" },
  { "id": "a1", "name": "Admin User", "role": "admin" }
]
```

### POST `/api/users` *(admin only)*
เพิ่ม user ใหม่

**Request:** `{ "name": "New Person", "role": "user" }`
**Response:** user object ที่สร้างเสร็จ พร้อม `id`

**ข้อควรคุยกับทีม:** ตอนนี้ frontend เพิ่ม user แบบไม่มี email/password (เพราะ mock ไม่มีระบบสมัครสมาชิกจริง) ถ้า backend จริงต้องมี credential ให้ login ได้ อาจต้องเพิ่ม field `email` และส่ง invite link/temporary password ทางอีเมลแทน — ต้องคุยกับทีมว่าจะออกแบบ flow นี้ยังไง

### DELETE `/api/users/:id` *(admin only)*
ลบ user ออกจากระบบ — **ควรกันไม่ให้ลบตัวเอง** (frontend กันไว้แล้วฝั่ง UI แต่ backend ควรเช็คซ้ำ)

---

## 3. Rooms

### GET `/api/rooms`
คืนรายการห้องทั้งหมด

**Response:**
```json
[
  {
    "id": "room-1",
    "name": "Focus Pod",
    "description": "Compact space for quick 1:1s or focused calls.",
    "longDescription": "A small, quiet pod designed for...",
    "floor": "Floor 5",
    "wing": "South Wing",
    "capacity": 2,
    "equipment": ["video"],
    "amenities": ["Video Conferencing", "High-Speed Wi-Fi", "Soundproofing"],
    "available": true,
    "image": "https://...",
    "gallery": ["https://..."]
  }
]
```

### GET `/api/rooms/:id`
คืนรายละเอียดห้องเดียว (หน้าตาเดียวกับข้างบน) — ใช้ในหน้า Room Detail

### POST `/api/rooms` *(admin only)*
เพิ่มห้องใหม่ — body เหมือน room object ด้านบน (ไม่ต้องส่ง `id`, backend สร้างให้)

### PUT `/api/rooms/:id` *(admin only)*
แก้ไขห้อง — ส่งเฉพาะ field ที่เปลี่ยนก็ได้ (partial update)

### DELETE `/api/rooms/:id` *(admin only)*
ลบห้อง — **ควรเช็คก่อนว่ามี booking ที่ยัง active (pending/approved) อยู่ในห้องนี้ไหม** ถ้ามีควรเตือนหรือปฏิเสธ ไม่ใช่ลบเงียบๆ (frontend ปัจจุบันยังไม่ได้เช็คจุดนี้ เป็นช่องโหว่ที่ backend ควรป้องกัน)

---

## 4. Bookings

### GET `/api/bookings/schedule?roomId=X&date=YYYY-MM-DD`
คืนตารางเวลาของห้องนั้นในวันนั้น ใช้วาด slot picker (สีเขียว/แดง)

**Response:**
```json
[
  { "time": "08:30", "status": "available" },
  { "time": "09:30", "status": "booked", "label": "Weekly Team Sync" }
]
```
`status` เป็นหนึ่งใน `available | booked | past`

### GET `/api/bookings/mine`
คืน booking ทั้งหมดที่ user ปัจจุบันเป็นคนจอง (`ownerId` ตรงกับ user ที่ login)

### GET `/api/bookings/invitations`
คืน booking ที่ user ปัจจุบันถูกเชิญเป็น participant

### GET `/api/bookings` *(admin only)*
คืน booking ทั้งหมดในระบบ รองรับ query param `?status=pending`

**Response object shape (ใช้ร่วมกันทุก endpoint ข้างบน):**
```json
{
  "id": "bk-123",
  "roomId": "room-1",
  "dateKey": "2026-08-25",
  "startTime": "08:30",
  "duration": 2,
  "title": "Weekly Team Sync",
  "description": "รายละเอียดการประชุม",
  "ownerId": "u1",
  "participants": [
    { "id": "u2", "status": "pending" }
  ],
  "status": "pending"
}
```
`status` (ของ booking) เป็นหนึ่งใน: `pending | approved | rejected | checked-in | no-show | cancelled | completed`
`participants[].status` เป็นหนึ่งใน: `pending | accepted | declined`

### POST `/api/bookings`
สร้าง booking ใหม่ — `ownerId` **backend ต้องดึงจาก token ที่ login เอง** ไม่ใช่รับจาก body (ป้องกันคนแอบสร้าง booking แทนคนอื่น)

**Request:**
```json
{
  "roomId": "room-1",
  "dateKey": "2026-08-25",
  "startTime": "08:30",
  "duration": 2,
  "title": "Weekly Team Sync",
  "description": "...",
  "participantIds": ["u2", "u3"]
}
```

**Validation ที่ backend ต้องเช็ค (Business Rules จากสเปค — สำคัญมาก ห้ามเชื่อ frontend อย่างเดียว):**
- **Time Guard:** `startTime` ต้องอยู่ในช่วง 08:30–17:30 และ `duration` รวมแล้วต้องไม่เกิน 17:30
- **Time Guard (ขั้นต่ำ):** `duration` ≥ 1
- **Calendar Guard:** `dateKey` ต้องไม่ใช่วันย้อนหลัง และไม่เกิน 30 วันจากวันนี้
- **Overlap Guard:** เช็คว่าห้องนี้ วันนี้ ช่วงเวลานี้ ยังไม่มี booking อื่นที่สถานะ `pending/approved/checked-in` ทับซ้อนอยู่ — ถ้าทับ ต้องปฏิเสธ (frontend เช็คแค่ตอนแสดงผล แต่ backend ต้องเช็คจริงตอน submit กันกรณี 2 คนกดพร้อมกัน/race condition)

`status` เริ่มต้นเป็น `pending` เสมอ

### PATCH `/api/bookings/:id/status` *(admin only)*
เปลี่ยนสถานะ booking (approve/reject/checked-in/no-show)

**Request:** `{ "status": "approved" }`

**Validation:**
- `approved`/`rejected` ใช้ได้เฉพาะตอนสถานะปัจจุบันเป็น `pending`
- `checked-in`/`no-show` ใช้ได้เฉพาะตอนสถานะปัจจุบันเป็น `approved`
- **Check-in Guard:** `checked-in` ควรทำได้เฉพาะช่วง 15 นาทีก่อนเวลาเริ่ม ถึงเวลาสิ้นสุดการจอง (ตามสเปค R11) — ตอนนี้ frontend ยังไม่ได้บังคับจุดนี้ **แนะนำให้ backend เป็นคนบังคับกฎนี้จริงจัง**

### PATCH `/api/bookings/:id/cancel`
ผู้จอง (`ownerId` ต้องตรงกับ user ที่ login) ยกเลิก booking ของตัวเอง

**Validation (Cancellation Guard):** `dateKey` ต้องเหลืออีกอย่างน้อย 3 วันนับจากวันนี้ ถึงจะยกเลิกได้ ไม่งั้นตอบ error กลับไป

### PATCH `/api/bookings/:id/participants/me`
ผู้ถูกเชิญ (ต้องเป็น user คนที่ login อยู่ และต้องมีชื่ออยู่ใน `participants` ของ booking นั้นจริง) ตอบรับ/ปฏิเสธคำเชิญ

**Request:** `{ "status": "accepted" }` หรือ `{ "status": "declined" }`

---

## 5. สรุปตารางสถานะ (Status Enums)

| Field | ค่าที่เป็นไปได้ |
|---|---|
| `booking.status` | `pending`, `approved`, `rejected`, `checked-in`, `no-show`, `cancelled`, `completed` |
| `participant.status` | `pending`, `accepted`, `declined` |
| `slot.status` (จาก schedule endpoint) | `available`, `booked`, `past` |
| `user.role` | `user`, `admin` |

---

## 6. สิ่งที่ frontend ยังไม่ได้บังคับ แต่ backend ควรบังคับเพิ่ม

รายการนี้สำคัญ เพราะ frontend ตอนนี้เชื่อใจผู้ใช้ในหลายจุด (เพราะไม่มี backend มาคาน) — **backend ห้ามเชื่อ input จาก frontend เฉยๆ ต้อง validate ซ้ำทุกข้อนี้:**

1. Overlap Guard ตอน POST booking (กัน race condition จองพร้อมกัน)
2. Time Guard + Calendar Guard ตอน POST booking
3. Cancellation Guard (≥3 วัน) ตอน cancel
4. Check-in Guard (15 นาทีก่อนเวลา) ตอน mark checked-in
5. `ownerId` ต้องดึงจาก token เท่านั้น ห้ามรับจาก request body
6. Role check ทุก endpoint ที่มี `(admin only)` กำกับไว้
