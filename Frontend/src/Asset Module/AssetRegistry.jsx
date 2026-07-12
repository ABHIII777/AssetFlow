import { useState, useMemo, useEffect } from "react";
import axios from "axios";
import "../shared/moduleStyles.css";

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

    const [assets, setAssets] = useState([]);
    const [dbCategories, setDbCategories] = useState([]);
    const [dbDepartments, setDbDepartments] = useState([]);

    const fetchAssets = () => {
        axios.get("http://localhost:5000/api/assets")
            .then(res => setAssets(res.data))
            .catch(err => console.error(err));
    };

    useEffect(() => {
        fetchAssets();
        axios.get("http://localhost:5000/api/categories")
            .then(res => setDbCategories(res.data))
            .catch(err => console.error(err));
        axios.get("http://localhost:5000/api/departments")
            .then(res => setDbDepartments(res.data))
            .catch(err => console.error(err));
    }, []);

    const [form, setForm] = useState({
        name: "",
        category: "",
        tag: "",
        condition: "Good",
        location: "",
        dept: "",
        shared: "No"
    });

    const handleFormChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

    const handleSaveAsset = async () => {
        if (!form.name || !form.category || !form.tag) return alert("Please fill Name, Category, and Tag.");
        try {
            await axios.post("http://localhost:5000/api/assets", {
                ...form,
                shared: form.shared === "Yes",
                status: "Available"
            });
            setShowForm(false);
            setForm({ name: "", category: "", tag: "", condition: "Good", location: "", dept: "", shared: "No" });
            fetchAssets();
        } catch (err) {
            console.error(err);
            alert("Error saving asset: " + (err.response?.data?.error || err.message));
        }
    };

    const categories = useMemo(() => ["All", ...new Set(assets.map((a) => a.category))], [assets]);
    const statuses = ["All", "Available", "Allocated", "Reserved", "Under Maintenance", "Lost", "Retired", "Disposed"];

    const filtered = assets.filter((a) => {
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
                            <input type="text" name="name" value={form.name} onChange={handleFormChange} placeholder='e.g. MacBook Pro 14"' />
                        </div>
                        <div className="form-field">
                            <label>Category</label>
                            <select name="category" value={form.category} onChange={handleFormChange}>
                                <option value="" disabled>Select category</option>
                                {dbCategories.map((c) => <option key={c.id} value={c.name}>{c.name}</option>)}
                            </select>
                        </div>
                        <div className="form-field">
                            <label>Asset Tag</label>
                            <input type="text" name="tag" value={form.tag} onChange={handleFormChange} placeholder="e.g. AF-0302" />
                        </div>
                        <div className="form-field">
                            <label>Department</label>
                            <select name="dept" value={form.dept} onChange={handleFormChange}>
                                <option value="" disabled>Select department</option>
                                {dbDepartments.map((d) => <option key={d.id} value={d.name}>{d.name}</option>)}
                            </select>
                        </div>
                        <div className="form-field">
                            <label>Condition</label>
                            <select name="condition" value={form.condition} onChange={handleFormChange}>
                                <option>Good</option>
                                <option>Fair</option>
                                <option>Needs Repair</option>
                            </select>
                        </div>
                        <div className="form-field">
                            <label>Location</label>
                            <input type="text" name="location" value={form.location} onChange={handleFormChange} placeholder="e.g. IT Floor 2" />
                        </div>
                        <div className="form-field">
                            <label>Bookable / Shared</label>
                            <select name="shared" value={form.shared} onChange={handleFormChange}>
                                <option>No</option>
                                <option>Yes</option>
                            </select>
                        </div>
                        <div className="form-panel-actions">
                            <button className="btn-secondary" onClick={() => setShowForm(false)}>Cancel</button>
                            <button className="btn-primary" onClick={handleSaveAsset}>Save Asset</button>
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