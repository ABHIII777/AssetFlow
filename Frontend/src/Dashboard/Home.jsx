import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./Home.css";

// TODO: replace mock data with real API calls (GET /assets/summary, /bookings, /maintenance, /allocations)
const MOCK_STATS = {
    assetsAvailable: 128,
    assetsAllocated: 76,
    maintenanceToday: 4,
    activeBookings: 9,
    pendingTransfers: 3,
    upcomingReturns: 12,
};

const MOCK_OVERDUE_COUNT = 3;

const MOCK_ACTIVITY = [
    { id: 1, text: "Laptop AF-0114 allocated to Priya Shah — IT dept", time: "10 min ago" },
    { id: 2, text: "Room B2 booking confirmed — 2:00 PM to 3:00 PM", time: "42 min ago" },
    { id: 3, text: "Projector AF-0062 maintenance resolved", time: "1 hr ago" },
    { id: 4, text: "Transfer request approved — Chair AF-0231 to Facilities", time: "3 hrs ago" },
    { id: 5, text: 'Audit cycle "Q3 IT Assets" closed with 2 discrepancies', time: "Yesterday" },
];

function Home() {
    const navigate = useNavigate();
    const [stats, setStats] = useState(MOCK_STATS);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Simulated fetch — swap for real API.get("/dashboard/summary")
        const t = setTimeout(() => {
            setStats(MOCK_STATS);
            setLoading(false);
        }, 300);
        return () => clearTimeout(t);
    }, []);

    const kpis = [
        { key: "assetsAvailable", label: "Assets Available", value: stats.assetsAvailable, badge: "Total", badgeClass: "purple", icon: "box" },
        { key: "assetsAllocated", label: "Assets Allocated", value: stats.assetsAllocated, badge: "In use", badgeClass: "green", icon: "users" },
        { key: "maintenanceToday", label: "Maintenance Today", value: stats.maintenanceToday, badge: "Active", badgeClass: "red", icon: "wrench" },
        { key: "activeBookings", label: "Active Bookings", value: stats.activeBookings, badge: "Today", badgeClass: "purple", icon: "calendar" },
        { key: "pendingTransfers", label: "Pending Transfers", value: stats.pendingTransfers, badge: "Review", badgeClass: "orange", icon: "swap" },
        { key: "upcomingReturns", label: "Upcoming Returns", value: stats.upcomingReturns, badge: "7 days", badgeClass: "orange", icon: "clock" },
    ];

    const ICONS = {
        box: <path d="M21 8V21H3V8M1 3h22v5H1zM10 12h4"/>,
        users: <><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></>,
        wrench: <path d="M14.7 6.3a1 1 0 0 0 0 1.4l1.6 1.6a1 1 0 0 0 1.4 0l3.77-3.77a6 6 0 0 1-7.94 7.94l-6.91 6.91a2.12 2.12 0 0 1-3-3l6.91-6.91a6 6 0 0 1 7.94-7.94l-3.76 3.76z"/>,
        calendar: <><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></>,
        swap: <><path d="M17 1l4 4-4 4"/><path d="M3 11V9a4 4 0 0 1 4-4h14"/><path d="M7 23l-4-4 4-4"/><path d="M21 13v2a4 4 0 0 1-4 4H3"/></>,
        clock: <><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></>,
    };

    return (
        <div className="dash-page">

            {/* Header */}
            <div className="dash-header">
                <h2 className="dash-title">Today's <span className="dash-name">Overview</span></h2>
                <p className="dash-subtitle">Real-time snapshot of assets, allocations, bookings and maintenance.</p>
            </div>

            {/* KPI Cards */}
            <div className="dash-grid">
                {kpis.map((k) => (
                    <div className="dash-card" key={k.key}>
                        <div className="dash-card-top">
                            <div className="dash-icon">
                                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                    {ICONS[k.icon]}
                                </svg>
                            </div>
                            <span className={`dash-badge ${k.badgeClass}`}>{k.badge}</span>
                        </div>
                        <p className="dash-label">{k.label}</p>
                        <p className="dash-value">{loading ? "—" : k.value}</p>
                    </div>
                ))}
            </div>

            {/* Overdue alert */}
            {!loading && MOCK_OVERDUE_COUNT > 0 && (
                <div className="dash-alert" onClick={() => navigate("/allocation")}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <circle cx="12" cy="12" r="10"/>
                        <line x1="12" y1="8" x2="12" y2="12"/>
                        <line x1="12" y1="16" x2="12.01" y2="16"/>
                    </svg>
                    {MOCK_OVERDUE_COUNT} asset{MOCK_OVERDUE_COUNT !== 1 ? "s" : ""} overdue for return — flagged for follow-up
                </div>
            )}

            {/* Quick actions */}
            <div className="dash-quick-actions">
                <button className="qa-btn qa-primary" onClick={() => navigate("/assets")}>
                    <span>+</span> Register Asset
                </button>
                <button className="qa-btn" onClick={() => navigate("/booking")}>
                    Book Resource
                </button>
                <button className="qa-btn" onClick={() => navigate("/maintenance")}>
                    Raise Maintenance Request
                </button>
            </div>

            {/* Recent Activity */}
            <div className="dash-section">
                <div className="dash-section-header">
                    <div className="dash-section-title">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <polyline points="12 6 12 12 16 14"/>
                            <circle cx="12" cy="12" r="10"/>
                        </svg>
                        Recent Activity
                    </div>
                </div>

                {loading ? (
                    <div className="dash-empty">Loading...</div>
                ) : (
                    <ul className="dash-activity-list">
                        {MOCK_ACTIVITY.map((a) => (
                            <li key={a.id} className="dash-activity-item">
                                <span className="dash-activity-dot" />
                                <span className="dash-activity-text">{a.text}</span>
                                <span className="dash-activity-time">{a.time}</span>
                            </li>
                        ))}
                    </ul>
                )}
            </div>

        </div>
    );
}

export default Home;