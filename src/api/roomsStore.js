/*
  ============================================================
  ROOMS STORE
  ============================================================
  หลักการเดียวกับ bookingsStore.js — เก็บข้อมูลห้องไว้ใน localStorage
  เพื่อให้ Admin เพิ่ม/แก้ไข/ลบห้องผ่านหน้าเว็บได้จริง
  ============================================================
*/

import { seedRooms } from "../data/rooms.js";

const STORAGE_KEY = "unireserve_rooms";

function readRaw() {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (!stored) {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(seedRooms));
        return seedRooms;
    }
    return JSON.parse(stored);
}

function writeRaw(list) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
}

export function getAllRooms() {
    return readRaw();
}

export function getRoomById(id) {
    return readRaw().find((r) => r.id === id) ?? null;
}

export function addRoom(roomData) {
    const list = readRaw();
    const newRoom = {
        id: "room-" + Date.now(),
        available: true,
        gallery: [roomData.image],
        ...roomData,
    };
    writeRaw([...list, newRoom]);
    return newRoom;
}

export function updateRoom(id, updates) {
    const list = readRaw();
    const updated = list.map((r) => (r.id === id ? { ...r, ...updates } : r));
    writeRaw(updated);
}

export function deleteRoom(id) {
    const list = readRaw();
    writeRaw(list.filter((r) => r.id !== id));
}