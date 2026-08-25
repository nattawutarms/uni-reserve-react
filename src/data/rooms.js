
// ข้อมูลห้องประชุมปลอมไว้ก่อน (ทีหลังจะดึงจาก backend จริงแทน)
// รูปภาพใช้จาก Unsplash ชั่วคราว - ทีหลังเปลี่ยนเป็น URL รูปจริงของบริษัทได้เลย

export const seedRooms = [
  {
    id: "room-1",
    name: "Focus Pod",
    description: "Compact space for quick or focused calls.",
    longDescription:
      "A small, quiet pod designed for one-on-one meetings or focused solo calls. Soundproofed walls keep conversations private without needing a full-size room.",
    floor: "Floor 5",
    wing: "South Wing",
    capacity: 4,
    equipment: ["video"],
    amenities: ["Video Conferencing", "High-Speed Wi-Fi", "Soundproofing"],
    available: true,
    image: "https://images.unsplash.com/photo-1497215728101-856f4ea42174?w=600&q=80",
    gallery: ["https://images.unsplash.com/photo-1497215728101-856f4ea42174?w=600&q=80"],
  },
  {
    id: "room-2",
    name: "Team Room",
    description: "Mid-size room built for team meetings and workshops.",
    longDescription:
      "A flexible mid-size room with movable furniture and full whiteboard walls, ideal for team syncs, brainstorming sessions, and short workshops.",
    floor: "Floor 8",
    wing: "West Wing",
    capacity: 10,
    equipment: ["projector", "whiteboard"],
    amenities: ["Projector", "Whiteboard", "High-Speed Wi-Fi", "Movable Furniture"],
    available: true,
    image: "https://images.unsplash.com/photo-1431540015161-0bf868a2d407?w=600&q=80",
    gallery: ["https://images.unsplash.com/photo-1431540015161-0bf868a2d407?w=600&q=80"],
  },
  {
    id: "room-3",
    name: "Grand Boardroom",
    description: "Premium space for executive meetings and formal presentations.",
    longDescription:
      "Designed for high-stakes meetings and executive presentations, the Grand Boardroom offers premium acoustics, dual 4K displays, and comprehensive video conferencing capabilities.",
    floor: "Floor 12",
    wing: "East Wing",
    capacity: 24,
    equipment: ["projector", "video", "whiteboard"],
    amenities: ["Dual 4K Displays", "Video Conferencing", "High-Speed Wi-Fi", "Whiteboard", "Coffee Service"],
    available: true,
    image: "https://images.unsplash.com/photo-1497366216548-37526070297c?w=600&q=80",
    gallery: [
      "https://images.unsplash.com/photo-1497366216548-37526070297c?w=600&q=80",
      "https://images.unsplash.com/photo-1524758631624-e2822e304c36?w=300&q=80",
    ],
  },
];


