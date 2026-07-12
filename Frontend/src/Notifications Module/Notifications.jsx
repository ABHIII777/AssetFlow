import { useState, useEffect } from "react";
import axios from "axios";
import "../shared/moduleStyles.css";
import "./Notifications.css";

const TONE_CLASS = { red: "red", green: "green", purple: "purple", orange: "orange" };

function Notifications() {
    const [tab, setTab] = useState("notifications");
    const [filter, setFilter] = useState("all");
    const [items, setItems] = useState([]);
    const [logs, setLogs] = useState([]);

    useEffect(() => {
        const user = localStorage.getItem("userName");
        const role = localStorage.getItem("userRole");
        axios.get(`http://localhost:5000/api/notifications?user=${user}&role=${role}`)
            .then(res => {
                const mapped = res.data.map(n => ({
                    id: n.id,
                    type: n.type === "alert" ? "Alert" : "System Update",
                    text: n.message,
                    time: n.time,
                    read: false,
                    tone: n.type === "alert" ? "red" : "purple"
                }));
                setItems(mapped);
            })
            .catch(err => console.error(err));

        axios.get("http://localhost:5000/api/logs")
            .then(res => setLogs(res.data))
            .catch(err => console.error(err));
    }, []);

    const visible = filter === "unread" ? items.filter((n) => !n.read) : items;
    const unreadCount = items.filter((n) => !n.read).length;

    const markAllRead = () => setItems((prev) => prev.map((n) => ({ ...n, read: true })));

    return (
        <div className="module-page">
            <div className="module-header">
                <div>
                    <h2 className="module-title">Notifications</h2>
                    <p className="module-subtitle">Stay on top of overdue returns, approvals, bookings and audit flags.</p>
                </div>
                <div className="module-actions">
                    <button className="btn-secondary" onClick={markAllRead}>Mark all as read</button>
                </div>
            </div>

            <div className="card-surface">
                <div className="tab-group">
                    <button className={`tab-btn ${tab === "notifications" ? "active" : ""}`} onClick={() => setTab("notifications")}>
                        Notifications {unreadCount > 0 && <span className="tab-count">{unreadCount}</span>}
                    </button>
                    {localStorage.getItem("userRole") === "Admin" && (
                        <button className={`tab-btn ${tab === "log" ? "active" : ""}`} onClick={() => setTab("log")}>Activity Log</button>
                    )}
                </div>

                {tab === "notifications" && (
                    <>
                        <div className="notif-filters">
                            <button className={`chip ${filter === "all" ? "chip-active" : ""}`} onClick={() => setFilter("all")}>All</button>
                            <button className={`chip ${filter === "unread" ? "chip-active" : ""}`} onClick={() => setFilter("unread")}>Unread</button>
                        </div>

                        <ul className="notif-list">
                            {visible.map((n) => (
                                <li key={n.id} className={`notif-item ${n.read ? "" : "notif-unread"}`}>
                                    <span className={`status-pill ${TONE_CLASS[n.tone]} notif-type`}>{n.type}</span>
                                    <div className="notif-body">
                                        <p className="notif-text">{n.text}</p>
                                        <p className="notif-time">{n.time}</p>
                                    </div>
                                    {!n.read && <span className="notif-dot" />}
                                </li>
                            ))}
                        </ul>

                        {visible.length === 0 && <div className="empty-state">You're all caught up.</div>}
                    </>
                )}

                {tab === "log" && (
                    <div className="table-wrap">
                        <table className="data-table">
                            <thead>
                                <tr>
                                    <th>Actor</th>
                                    <th>Action</th>
                                    <th>Timestamp</th>
                                </tr>
                            </thead>
                            <tbody>
                                {logs.map((l) => {
                                    // Parse actor if string starts with a known format or just use "System"
                                    const parts = l.action.split(" ");
                                    const actor = ["Priya", "Amit", "Admin", "System", "Raj"].includes(parts[0]) 
                                                  ? parts[0] + (parts[0] !== "Admin" && parts[0] !== "System" ? " " + parts[1] : "") 
                                                  : "System";
                                    return (
                                        <tr key={l.id}>
                                            <td className="cell-strong">{actor}</td>
                                            <td>{l.action}</td>
                                            <td className="cell-muted">{l.time}</td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}

export default Notifications;
