import { useState } from "react";
import { Plus, Pencil, Trash2, X } from "lucide-react";
import { getAllRooms, addRoom, updateRoom, deleteRoom } from "../api/roomsStore.js";
import AppHeader from "../components/AppHeader.jsx";
import "./AdminRoomsPage.css";

const EMPTY_FORM = {
    name: "",
    description: "",
    longDescription: "",
    floor: "",
    wing: "",
    capacity: 2,
    equipment: [],
    amenitiesText: "",
    image: "",
};

function AdminRoomsPage() {
    const [roomList, setRoomList] = useState(getAllRooms);
    const [showForm, setShowForm] = useState(false);
    const [editingId, setEditingId] = useState(null);
    const [formData, setFormData] = useState(EMPTY_FORM);

    function refresh() {
        setRoomList(getAllRooms());
    }

    function handleAddNew() {
        setEditingId(null);
        setFormData(EMPTY_FORM);
        setShowForm(true);
    }

    function handleEdit(room) {
        setEditingId(room.id);
        setFormData({
            name: room.name,
            description: room.description,
            longDescription: room.longDescription,
            floor: room.floor,
            wing: room.wing,
            capacity: room.capacity,
            equipment: room.equipment,
            amenitiesText: room.amenities.join(", "),
            image: room.image,
        });
        setShowForm(true);
    }

    function handleDelete(room) {
        const confirmed = window.confirm(`ยืนยันลบห้อง "${room.name}" ใช่ไหม?`);
        if (!confirmed) return;
        deleteRoom(room.id);
        refresh();
    }

    function toggleEquipment(key) {
        setFormData((current) => ({
            ...current,
            equipment: current.equipment.includes(key)
                ? current.equipment.filter((k) => k !== key)
                : [...current.equipment, key],
        }));
    }

    function handleSubmit(e) {
        e.preventDefault();

        const payload = {
            name: formData.name.trim(),
            description: formData.description.trim(),
            longDescription: formData.longDescription.trim(),
            floor: formData.floor.trim(),
            wing: formData.wing.trim(),
            capacity: Number(formData.capacity),
            equipment: formData.equipment,
            amenities: formData.amenitiesText.split(",").map((s) => s.trim()).filter(Boolean),
            image: formData.image.trim(),
        };

        if (editingId) {
            updateRoom(editingId, payload);
        } else {
            addRoom(payload);
        }

        refresh();
        setShowForm(false);
    }

    return (
        <div className="admin-rooms-page">
            <AppHeader active="admin-rooms" />

            <div className="admin-rooms-content">
                <div className="rooms-heading-row">
                    <div>
                        <h1>Manage Rooms</h1>
                        <p className="page-subtitle">เพิ่ม แก้ไข หรือลบห้องประชุมในระบบ</p>
                    </div>
                    <button className="add-room-btn" onClick={handleAddNew}>
                        <Plus size={16} /> Add Room
                    </button>
                </div>

                {showForm && (
                    <form className="room-form" onSubmit={handleSubmit}>
                        <div className="form-row">
                            <button type="button" className="close-form-btn" onClick={() => setShowForm(false)}>
                                <X size={16} />
                            </button>
                        </div>

                        <label className="form-label">Room Name</label>
                        <input
                            type="text"
                            className="form-input"
                            required
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        />

                        <label className="form-label">Short Description</label>
                        <input
                            type="text"
                            className="form-input"
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                        />

                        <label className="form-label">Full Description</label>
                        <textarea
                            className="form-textarea"
                            value={formData.longDescription}
                            onChange={(e) => setFormData({ ...formData, longDescription: e.target.value })}
                        />

                        <div className="form-grid">
                            <div>
                                <label className="form-label">Floor</label>
                                <input
                                    type="text"
                                    className="form-input"
                                    value={formData.floor}
                                    onChange={(e) => setFormData({ ...formData, floor: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="form-label">Wing</label>
                                <input
                                    type="text"
                                    className="form-input"
                                    value={formData.wing}
                                    onChange={(e) => setFormData({ ...formData, wing: e.target.value })}
                                />
                            </div>
                            <div>
                                <label className="form-label">Capacity</label>
                                <input
                                    type="number"
                                    min="1"
                                    className="form-input"
                                    value={formData.capacity}
                                    onChange={(e) => setFormData({ ...formData, capacity: e.target.value })}
                                />
                            </div>
                        </div>

                        <label className="form-label">Equipment</label>
                        <div className="equipment-checkboxes">
                            <label>
                                <input type="checkbox" checked={formData.equipment.includes("projector")} onChange={() => toggleEquipment("projector")} />
                                Projector
                            </label>
                            <label>
                                <input type="checkbox" checked={formData.equipment.includes("video")} onChange={() => toggleEquipment("video")} />
                                Video Conference
                            </label>
                            <label>
                                <input type="checkbox" checked={formData.equipment.includes("whiteboard")} onChange={() => toggleEquipment("whiteboard")} />
                                Whiteboard
                            </label>
                        </div>

                        <label className="form-label">Amenities (คั่นด้วยจุลภาค)</label>
                        <input
                            type="text"
                            className="form-input"
                            placeholder="เช่น Coffee Service, High-Speed Wi-Fi"
                            value={formData.amenitiesText}
                            onChange={(e) => setFormData({ ...formData, amenitiesText: e.target.value })}
                        />

                        <label className="form-label">Image URL</label>
                        <input
                            type="text"
                            className="form-input"
                            placeholder="https://..."
                            value={formData.image}
                            onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                        />

                        <button type="submit" className="save-room-btn">
                            {editingId ? "Save Changes" : "Add Room"}
                        </button>
                    </form>
                )}

                <div className="admin-rooms-grid">
                    {roomList.map((room) => (
                        <div className="admin-room-card" key={room.id}>
                            <img src={room.image} alt={room.name} />
                            <div className="admin-room-body">
                                <h3>{room.name}</h3>
                                <p>{room.description}</p>
                                <p className="room-meta">Capacity: {room.capacity} · {room.equipment.join(", ") || "No equipment"}</p>
                                <div className="admin-room-actions">
                                    <button onClick={() => handleEdit(room)}>
                                        <Pencil size={14} /> Edit
                                    </button>
                                    <button className="delete-btn" onClick={() => handleDelete(room)}>
                                        <Trash2 size={14} /> Delete
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default AdminRoomsPage;