import { useState } from "react";
import { Plus, Trash2, X, AlertTriangle } from "lucide-react";
import { getAllUsers, addUser, deleteUser } from "../api/usersStore.js";
import AppHeader from "../components/AppHeader.jsx";
import "./AdminUsersPage.css";

function AdminUsersPage() {
    const currentUser = JSON.parse(localStorage.getItem("user") || "null");
    const [userList, setUserList] = useState(getAllUsers);
    const [showForm, setShowForm] = useState(false);
    const [name, setName] = useState("");
    const [role, setRole] = useState("user");

    function refresh() {
        setUserList(getAllUsers());
    }

    function handleSubmit(e) {
        e.preventDefault();
        if (!name.trim()) return;

        addUser({ name: name.trim(), role });
        setName("");
        setRole("user");
        setShowForm(false);
        refresh();
    }

    function handleDelete(user) {
        const confirmed = window.confirm(`ยืนยันลบ "${user.name}" ออกจากระบบใช่ไหม?`);
        if (!confirmed) return;
        deleteUser(user.id);
        refresh();
    }

    return (
        <div className="admin-users-page">
            <AppHeader active="admin-users" />

            <div className="admin-users-content">
                <div className="users-heading-row">
                    <div>
                        <h1>Manage Users</h1>
                        <p className="page-subtitle">รายชื่อผู้ใช้งานทั้งหมดในระบบ</p>
                    </div>
                    <button className="add-user-btn" onClick={() => setShowForm(true)}>
                        <Plus size={16} /> Add User
                    </button>
                </div>

                <div className="limitation-banner">
                    <AlertTriangle size={14} />
                    User ที่เพิ่มผ่านหน้านี้จะใช้เชิญประชุม/แสดงในรายชื่อได้เท่านั้น ยัง login เข้าระบบจริงไม่ได้ (ระบบยังไม่มี backend สร้างบัญชีจริง)
                </div>

                {showForm && (
                    <form className="user-form" onSubmit={handleSubmit}>
                        <button type="button" className="close-form-btn" onClick={() => setShowForm(false)}>
                            <X size={16} />
                        </button>

                        <label className="form-label">Name</label>
                        <input
                            type="text"
                            className="form-input"
                            required
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                        />

                        <label className="form-label">Role</label>
                        <select className="form-input" value={role} onChange={(e) => setRole(e.target.value)}>
                            <option value="user">User</option>
                            <option value="admin">Admin</option>
                        </select>

                        <button type="submit" className="save-user-btn">Add User</button>
                    </form>
                )}

                <div className="users-table">
                    <div className="table-header">
                        <span>Name</span>
                        <span>Role</span>
                        <span>Actions</span>
                    </div>

                    {userList.map((user) => (
                        <div className="table-row" key={user.id}>
                            <span className="cell-name">{user.name}</span>
                            <span>
                                <span className={`role-pill ${user.role}`}>{user.role}</span>
                            </span>
                            <span>
                                {user.id === currentUser?.id ? (
                                    <span className="no-action">ตัวคุณเอง</span>
                                ) : (
                                    <button className="delete-btn" onClick={() => handleDelete(user)}>
                                        <Trash2 size={14} /> Delete
                                    </button>
                                )}
                            </span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default AdminUsersPage;