import { useState } from "react";
import "../shared/moduleStyles.css";
import "./Notifications.css";

// TODO: replace with API.get("/notifications") and /activity-log
const MOCK_NOTIFICATIONS = [
    { id: 1, type: "Overdue Return Alert", text: "Laptop AF-0114 was due back on 2026-07-02 — still with Priya Shah.", time: "10 min ago", read: false, tone: "red" },
    { id: 2, type: "Booking Confirmed", text: "Room B2 booking confirmed for 10:00–11:00 today.", time: "35 min ago", read: false, tone: "green" },
    { id: 3, type: "Maintenance Approved", text: "Repair approved for Toyota Innova (AF-0045) — AC not cooling.", time: "1 hr ago", read: true, tone: "purple" },
    { id: 4, type: "Transfer Approved", text: "Conference Table AF-0301 transferred from Facilities to IT Floor 2.", time: "2 hrs ago", read: true, tone: "green" },
    { id: 5, type: "Audit Discrepancy Flagged", text: "Wireless Mouse AF-0209 marked Missing in Q3 IT Assets cycle.", time: "Yesterday", read: true, tone: "orange" },
    { id: 6, type: "Booking Reminder", text: "Your Conference Room A booking starts in 15 minutes.", time: "Yesterday", read: true, tone: "purple" },
];

const MOCK_LOG = [
    { id: 1, actor: "Raj Malhotra", action: "Approved transfer request for AF-0301", time: "2026-07-12 09:14" },
    { id: 2, actor: "Priya Shah", action: "Raised maintenance request for AF-0198", time: "2026-07-11 17:02" },
    { id: 3, actor: "Admin", action: "Promoted Sana Iyer to Asset Manager", time: "2026-07-10 11:20" },
    { id: 4, actor: "Amit Verma", action: "Booked Toyota Innova for 2026-07-13", time: "2026-07-09 15:47" },
];

const TONE_CLASS = { red: "red", green: "green", purple: "purple", orange: "orange" };

function Notifications() {
    const [tab, setTab] = useState("notifications");
    const [filter, setFilter] = useState("all");
    const [items, setItems] = useState(MOCK_NOTIFICATIONS);

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
                    <button className={`tab-btn ${tab === "log" ? "active" : ""}`} onClick={() => setTab("log")}>Activity Log</button>
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
                                {MOCK_LOG.map((l) => (
                                    <tr key={l.id}>
                                        <td className="cell-strong">{l.actor}</td>
                                        <td>{l.action}</td>
                                        <td className="cell-muted">{l.time}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
}

export default Notifications;
