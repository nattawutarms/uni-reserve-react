// จำลองรายการจองของ user คนปัจจุบัน (ทีหลังจะดึงจาก backend ตาม token ของ user นั้นแทน)
import { addDays, startOfToday } from "../utils/date.js";

const today = startOfToday();

// status ที่เป็นไปได้ตามสเปค: pending, approved, checked-in, no-show, cancelled, completed
export const bookings = [
  {
    id: "bk-1",
    roomId: "room-1",
    date: addDays(today, 2),
    startTime: "10:00 AM",
    endTime: "12:00 PM",
    status: "approved", // เขียว: Approved - Pending Check-in
  },
  {
    id: "bk-2",
    roomId: "room-3",
    date: addDays(today, 5),
    startTime: "2:00 PM",
    endTime: "4:00 PM",
    status: "pending", // เหลือง: รออนุมัติ
  },
  {
    id: "bk-3",
    roomId: "room-2",
    date: addDays(today, -10),
    startTime: "9:00 AM",
    endTime: "10:00 AM",
    status: "completed", // อดีต: เสร็จสิ้นแล้ว (เคย checked-in)
  },
  {
    id: "bk-4",
    roomId: "room-1",
    date: addDays(today, -5),
    startTime: "1:00 PM",
    endTime: "2:00 PM",
    status: "no-show", // อดีต: แดง ไม่มาตามนัด
  },
];
