import { NavLink } from "react-router-dom";
import "./Sidebar.css";

const NAV_ITEMS = [
    { to: "/home", label: "Dashboard" },
    { to: "/organization-setup", label: "Organization Setup" },
    { to: "/assets", label: "Assets" },
    { to: "/allocation", label: "Allocation & Transfer" },
    { to: "/booking", label: "Resource Booking" },
    { to: "/maintenance", label: "Maintenance" },
    { to: "/audit", label: "Audit" },
    { to: "/reports", label: "Reports" },
    { to: "/notifications", label: "Notifications" },
];

function Sidebar() {
    const orgName = localStorage.getItem("orgName") || "AssetFlow";
    const userName = localStorage.getItem("userName") || "Admin User";
    const userRole = localStorage.getItem("userRole") || "Admin";

    return (
        <aside className="sidebar">

            {/* Branding */}
            <div className="sidebar-brand">
                <p className="sidebar-title">{orgName}</p>
                <p className="brand-subtitle">Asset &amp; Resource Management</p>
            </div>

            {/* Nav */}
            <nav className="sidebar-nav">
                <p className="nav-label">Menu</p>

                {NAV_ITEMS.map((item) => (
                    <NavLink
                        key={item.to}
                        to={item.to}
                        className={({ isActive }) => isActive ? "nav-item active" : "nav-item"}
                    >
                        {item.label}
                    </NavLink>
                ))}
            </nav>

            {/* Bottom */}
            <div className="sidebar-bottom">
                <div className="user-profile">
                    <div className="user-avatar">{userName[0] || "A"}</div>
                    <div className="user-info">
                        <span className="user-name">{userName}</span>
                        <span className="user-role">{userRole}</span>
                    </div>
                </div>
            </div>

        </aside>
    );
}

export default Sidebar;