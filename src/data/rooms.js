// ข้อมูลห้องประชุมปลอมไว้ก่อน (ทีหลังจะดึงจาก backend จริงแทน)
// รูปภาพใช้จาก Unsplash ชั่วคราว - ทีหลังเปลี่ยนเป็น URL รูปจริงของบริษัทได้เลย

export const rooms = [
  {
    id: "room-1",
    name: "Executive Boardroom Alpha",
    description:
      "Premium space optimized for executive presentations and formal board meetings with panoramic views.",
    longDescription:
      "Designed for high-stakes meetings and executive presentations, Boardroom Alpha offers premium acoustics, dual 4K displays, and comprehensive video conferencing capabilities. Natural light fills the room, creating an energizing environment for prolonged strategy sessions.",
    floor: "Floor 12",
    wing: "East Wing",
    capacity: 24,
    equipment: ["projector", "video", "whiteboard"],
    amenities: ["Dual 4K Displays", "Video Conferencing", "High-Speed Wi-Fi", "Whiteboard", "Coffee Service"],
    available: true,
    image:
      "https://images.unsplash.com/photo-1497366216548-37526070297c?w=600&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1497366216548-37526070297c?w=600&q=80",
      "https://images.unsplash.com/photo-1524758631624-e2822e304c36?w=300&q=80",
      "https://images.unsplash.com/photo-1497215728101-856f4ea42174?w=300&q=80",
    ],
  },
  {
    id: "room-2",
    name: "Collaboration Pod B",
    description: "Intimate space for quick syncs and brainstorming sessions.",
    longDescription:
      "A cozy, informal space built for fast-moving teams. Comfortable seating and a compact video setup make it ideal for daily standups and quick 1:1s.",
    floor: "Floor 8",
    wing: "West Wing",
    capacity: 4,
    equipment: ["video"],
    amenities: ["Video Conferencing", "High-Speed Wi-Fi"],
    available: true,
    image:
      "https://images.unsplash.com/photo-1517502884422-41eaead166d4?w=600&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1517502884422-41eaead166d4?w=600&q=80",
    ],
  },
  {
    id: "room-3",
    name: "Innovation Lab C",
    description: "Bright, flexible room with movable furniture for workshops and training sessions.",
    longDescription:
      "An open, adaptable room with movable furniture and writable wall surfaces, purpose-built for workshops, design sprints, and hands-on training sessions.",
    floor: "Floor 3",
    wing: "North Wing",
    capacity: 12,
    equipment: ["projector", "whiteboard"],
    amenities: ["Projector", "Movable Furniture", "Whiteboard Walls", "High-Speed Wi-Fi"],
    available: true,
    image:
      "https://images.unsplash.com/photo-1431540015161-0bf868a2d407?w=600&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1431540015161-0bf868a2d407?w=600&q=80",
    ],
  },
  {
    id: "room-4",
    name: "Focus Room D",
    description: "Quiet single-purpose room, ideal for interviews or one-on-one meetings.",
    longDescription:
      "A quiet, single-purpose room designed for interviews, one-on-one meetings, or focused calls away from the open floor.",
    floor: "Floor 5",
    wing: "South Wing",
    capacity: 2,
    equipment: ["video"],
    amenities: ["Video Conferencing", "Soundproofing"],
    available: false,
    image:
      "https://images.unsplash.com/photo-1497215728101-856f4ea42174?w=600&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1497215728101-856f4ea42174?w=600&q=80",
    ],
  },
];

export function getRoomById(id) {
  return rooms.find((r) => r.id === id) ?? null;
}
