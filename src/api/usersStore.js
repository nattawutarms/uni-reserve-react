/*
  ============================================================
  USERS STORE
  ============================================================
  หลักการเดียวกับ roomsStore.js / bookingsStore.js
  เก็บ "สมุดรายชื่อ" user ไว้ใน localStorage เพื่อให้ Admin
  เพิ่ม/ลบรายชื่อผ่านหน้าเว็บได้จริง

  ข้อจำกัด: user ที่ Admin เพิ่มผ่านหน้านี้ จะ "login เข้าระบบจริง
  ไม่ได้" เพราะระบบ login (mockApi.js) แยกฐานข้อมูลกันคนละที่
  (ไม่มี backend สร้าง account/password จริงให้) - เพิ่มได้แค่ชื่อ
  ไว้เชิญประชุม/แสดงในรายชื่อเท่านั้น
  ============================================================
*/

import { seedUsers } from "../data/users.js";

const STORAGE_KEY = "unireserve_users";

function readRaw() {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(seedUsers));
        return seedUsers;
    }
    return JSON.parse(stored);
}

function writeRaw(list) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
}

export function getAllUsers() {
    return readRaw();
}

export function getUserById(id) {
    return readRaw().find((u) => u.id === id) ?? null;
}

export function addUser({ name, role }) {
    const list = readRaw();
    const newUser = { id: "u-" + Date.now(), name, role };
    writeRaw([...list, newUser]);
    return newUser;
}

export function deleteUser(id) {
    const list = readRaw();
    writeRaw(list.filter((u) => u.id !== id));
}