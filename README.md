# UniReserve Portal - Frontend

Frontend ของระบบจองห้องประชุม เขียนด้วย React + Vite
ตอนนี้ backend ยังไม่เสร็จ เลยใช้ mock API (`src/api/mockApi.js`) จำลองการทำงานไปก่อน

## วิธีรันโปรเจค (ทำครั้งแรกครั้งเดียว)

ต้องติดตั้ง [Node.js](https://nodejs.org/) ก่อน (เลือกเวอร์ชัน LTS)

```bash
# 1. ติดตั้ง dependencies (ดึงจาก package.json)
npm install

# 2. รันโปรเจคแบบ dev (จะเปิดที่ http://localhost:5173)
npm run dev
```

ทดสอบ login ด้วย:
- Student/User: `student@test.com` / `123456`
- Admin: `admin@test.com` / `admin123`

## โครงสร้างโปรเจค

```
src/
├── api/
│   └── mockApi.js      ← ตัวปลอม backend (แก้ไฟล์นี้ไฟล์เดียวตอนมี backend จริง)
├── pages/
│   ├── LoginPage.jsx    ← หน้า login
│   └── LoginPage.css
├── App.jsx              ← จุดที่จะเพิ่ม route ของหน้าอื่นๆ ทีหลัง
└── main.jsx             ← จุดเริ่มต้นของแอพ
```

## เมื่อมี backend จริงแล้ว

แก้แค่ใน `src/api/mockApi.js` ให้เปลี่ยนจาก mock เป็น `fetch()` จริง
(มีตัวอย่างเขียนไว้เป็น comment ท้ายไฟล์แล้ว) ไม่ต้องแก้ component ไหนเลย

---

## Git Workflow (สำหรับโหลดขึ้น GitHub)

### ครั้งแรก - setup repo

```bash
# 1. เข้าไปในโฟลเดอร์โปรเจค แล้วเริ่มต้น git
cd unireserve-frontend
git init

# 2. บอกชื่อ/อีเมล (ทำครั้งเดียวต่อเครื่อง ถ้ายังไม่เคยตั้ง)
git config --global user.name "ชื่อคุณ"
git config --global user.email "อีเมลคุณ"

# 3. เพิ่มไฟล์ทั้งหมด (node_modules จะถูกข้ามอัตโนมัติ เพราะอยู่ใน .gitignore)
git add .

# 4. commit ครั้งแรก (บันทึกจุดนี้ไว้พร้อมข้อความอธิบาย)
git commit -m "Initial commit: login page with mock API"
```

### เชื่อมกับ GitHub

1. ไปสร้าง repo เปล่าๆ ที่ https://github.com/new (อย่าติ๊ก "Add README" เพราะเรามีไฟล์อยู่แล้ว)
2. copy คำสั่งที่ GitHub ให้มา จะประมาณนี้:

```bash
git remote add origin https://github.com/<username>/<repo-name>.git
git branch -M main
git push -u origin main
```

### ทำงานต่อในวันถัดๆ ไป (workflow ปกติที่ใช้ทุกวัน)

```bash
git add .
git commit -m "อธิบายว่าแก้อะไร เช่น 'Add booking calendar page'"
git push
```

### ถ้าทำงานเป็นทีม (แนะนำให้ลองใช้)

```bash
# สร้าง branch แยกก่อนเริ่มฟีเจอร์ใหม่ กันโค้ดชนกับเพื่อน
git checkout -b feature/booking-page

# ทำงานเสร็จแล้ว push branch นี้ขึ้นไป
git push -u origin feature/booking-page

# แล้วไปเปิด Pull Request บน GitHub เพื่อขอ merge เข้า main
```
