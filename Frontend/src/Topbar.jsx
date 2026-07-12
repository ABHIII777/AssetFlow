import { Link, useNavigate } from "react-router-dom";
import "./Topbar.css";

function Topbar({ onMenuToggle }) {
    const navigate = useNavigate();

    const handleLogout = async () => {
        // TODO: wire up to real auth/logout API once the backend is connected
        localStorage.removeItem("token");
        localStorage.removeItem("userRole");
        localStorage.removeItem("userName");
        localStorage.removeItem("orgName");
        navigate("/", { replace: true }); // replace: true prevents back-button bypass
    };

    return (
        <div className="topbar">
            {/* Left: Hamburger + Brand title */}
            <div className="topbar-left">
                <button className="hamburger-btn" onClick={onMenuToggle} title="Toggle menu">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <line x1="3" y1="6" x2="21" y2="6"/>
                        <line x1="3" y1="12" x2="21" y2="12"/>
                        <line x1="3" y1="18" x2="21" y2="18"/>
                    </svg>
                </button>
                <Link to="/home" className="topbar-title">AssetFlow</Link>
            </div>

            {/* Right: Icons */}
            <div className="topbar-right">

                {/* Bell / Notifications */}
                <Link to="/notifications" className="icon-btn" title="Notifications">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
                        <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
                    </svg>
                </Link>

                {/* Help / Info */}
                <button className="icon-btn" title="Help">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <circle cx="12" cy="12" r="10"/>
                        <path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/>
                        <line x1="12" y1="17" x2="12.01" y2="17"/>
                    </svg>
                </button>

                {/* Logout */}
                <button className="icon-btn" title="Logout" onClick={handleLogout}>
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/>
                        <polyline points="16 17 21 12 16 7"/>
                        <line x1="21" y1="12" x2="9" y2="12"/>
                    </svg>
                </button>

            </div>
        </div>
    );
}

export default Topbar;