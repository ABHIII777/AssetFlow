import { useState, useMemo } from "react";
import "../shared/moduleStyles.css";

// TODO: replace with API.get("/assets") — filters (tag, serial, QR, category, status, dept, location)
const MOCK_ASSETS = [
    { id: 1, tag: "AF-0114", name: 'MacBook Pro 14"', category: "Electronics", status: "Allocated", location: "IT Floor 2", dept: "Information Technology", condition: "Good", shared: false },
    { id: 2, tag: "AF-0062", name: "Epson Projector", category: "Electronics", status: "Available", location: "Conference Room A", dept: "Facilities", condition: "Good", shared: true },
    { id: 3, tag: "AF-0231", name: "Ergonomic Chair", category: "Furniture", status: "Allocated", location: "Facilities Store", dept: "Facilities", condition: "Fair", shared: false },
    { id: 4, tag: "AF-0045", name: "Toyota Innova", category: "Vehicles", status: "Reserved", location: "Parking B", dept: "Field Support", condition: "Good", shared: true },
    { id: 5, tag: "AF-0198", name: 'Dell Monitor 27"', category: "Electronics", status: "Under Maintenance", location: "IT Store", dept: "Information Technology", condition: "Needs Repair", shared: false },
    { id: 6, tag: "AF-0301", name: "Conference Table", category: "Furniture", status: "Available", location: "Meeting Room B2", dept: "Facilities", condition: "Good", shared: true },
    { id: 7, tag: "AF-0087", name: "HP LaserJet Printer", category: "Office Equipment", status: "Lost", location: "—", dept: "Finance", condition: "—", shared: false },
];

const STATUS_CLASS = {
    Available: "green",
    Allocated: "purple",
    Reserved: "orange",
    "Under Maintenance": "red",
    Lost: "grey",
    Retired: "grey",
    Disposed: "grey",
};

function AssetRegistry() {
    const [query, setQuery] = useState("");
    const [statusFilter, setStatusFilter] = useState("All");
    const [categoryFilter, setCategoryFilter] = useState("All");
    const [showForm, setShowForm] = useState(false);

    const categories = useMemo(() => ["All", ...new Set(MOCK_ASSETS.map((a) => a.category))], []);
    const statuses = ["All", "Available", "Allocated", "Reserved", "Under Maintenance", "Lost", "Retired", "Disposed"];

    const filtered = MOCK_ASSETS.filter((a) => {
        const matchesQuery =
            a.tag.toLowerCase().includes(query.toLowerCase()) ||
            a.name.toLowerCase().includes(query.toLowerCase());
        const matchesStatus = statusFilter === "All" || a.status === statusFilter;
        const matchesCategory = categoryFilter === "All" || a.category === categoryFilter;
        return matchesQuery && matchesStatus && matchesCategory;
    });

    return (
        <div className="module-page">
            <div className="module-header">
                <div>
                    <h2 className="module-title">Assets</h2>
                    <p className="module-subtitle">Register, search and track every asset through its lifecycle.</p>
                </div>
                <div className="module-actions">
                    <button className="btn-primary" onClick={() => setShowForm((s) => !s)}>
                        {showForm ? "Close" : "+ Register Asset"}
                    </button>
                </div>
            </div>

            <div className="card-surface">
                {showForm && (
                    <div className="form-panel">
                        <div className="form-field">
                            <label>Asset Name</label>
                            <input type="text" placeholder='e.g. MacBook Pro 14"' />
                        </div>
                        <div className="form-field">
                            <label>Category</label>
                            <select defaultValue="">
                                <option value="" disabled>Select category</option>
                                {categories.filter((c) => c !== "All").map((c) => <option key={c}>{c}</option>)}
                            </select>
                        </div>
                        <div className="form-field">
                            <label>Asset Tag</label>
                            <input type="text" value="AF-0302 (auto)" disabled />
                        </div>
                        <div className="form-field">
                            <label>Serial Number</label>
                            <input type="text" placeholder="e.g. SN-88213X" />
                        </div>
                        <div className="form-field">
                            <label>Acquisition Date</label>
                            <input type="date" />
                        </div>
                        <div className="form-field">
                            <label>Acquisition Cost</label>
                            <input type="number" placeholder="For reporting only" />
                        </div>
                        <div className="form-field">
                            <label>Condition</label>
                            <select defaultValue="Good">
                                <option>Good</option>
                                <option>Fair</option>
                                <option>Needs Repair</option>
                            </select>
                        </div>
                        <div className="form-field">
                            <label>Location</label>
                            <input type="text" placeholder="e.g. IT Floor 2" />
                        </div>
                        <div className="form-field">
                            <label>Bookable / Shared</label>
                            <select defaultValue="No">
                                <option>No</option>
                                <option>Yes</option>
                            </select>
                        </div>
                        <div className="form-panel-actions">
                            <button className="btn-secondary" onClick={() => setShowForm(false)}>Cancel</button>
                            <button className="btn-primary">Save Asset</button>
                        </div>
                    </div>
                )}

                <div className="search-bar">
                    <input
                        className="search-input"
                        placeholder="Search by Asset Tag, Serial Number or Name…"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                    />
                    <select className="filter-select" value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)}>
                        {categories.map((c) => <option key={c}>{c}</option>)}
                    </select>
                    <select className="filter-select" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
                        {statuses.map((s) => <option key={s}>{s}</option>)}
                    </select>
                </div>

                <div className="table-wrap">
                    <table className="data-table">
                        <thead>
                            <tr>
                                <th>Asset Tag</th>
                                <th>Name</th>
                                <th>Category</th>
                                <th>Status</th>
                                <th>Location</th>
                                <th>Department</th>
                                <th>Condition</th>
                                <th>Shared</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filtered.map((a) => (
                                <tr key={a.id}>
                                    <td className="cell-strong">{a.tag}</td>
                                    <td>{a.name}</td>
                                    <td>{a.category}</td>
                                    <td><span className={`status-pill ${STATUS_CLASS[a.status]}`}>{a.status}</span></td>
                                    <td>{a.location}</td>
                                    <td>{a.dept}</td>
                                    <td className="cell-muted">{a.condition}</td>
                                    <td>{a.shared ? "Yes" : "—"}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    {filtered.length === 0 && (
                        <div className="empty-state">No assets match your search or filters.</div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default AssetRegistry;