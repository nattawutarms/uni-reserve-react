


## วิธีรันโปรเจค (ทำครั้งแรกครั้งเดียว)

ต้องติดตั้ง [Node.js](https://nodejs.org/) ก่อน (เลือกเวอร์ชัน LTS)

```bash
# 1. ติดตั้ง dependencies (ดึงจาก package.json)
npm install

# 2. รันโปรเจคแบบ dev (จะเปิดที่ http://localhost:5173)
npm run dev
```

ทดสอบ login ด้วย:
- Student/User: `01` / `123456`
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


แก้แค่ใน `src/api/mockApi.js` ให้เปลี่ยนจาก mock เป็น `fetch()` จริง
(มีตัวอย่างเขียนไว้เป็น comment ท้ายไฟล์แล้ว) ไม่ต้องแก้ component ไหนเลย

