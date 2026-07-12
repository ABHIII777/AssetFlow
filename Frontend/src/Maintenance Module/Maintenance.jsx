import { useState, useEffect } from "react";
import axios from "axios";
import API from "../api";
import "../shared/moduleStyles.css";
import "./Maintenance.css";

const STAGES = ["Pending", "Approved", "Technician Assigned", "In Progress", "Resolved"];
const PRIORITY_CLASS = { High: "red", Medium: "orange", Low: "grey" };

function Maintenance() {
    const [showForm, setShowForm] = useState(false);
    const [requests, setRequests] = useState([]);
    const [myAssets, setMyAssets] = useState([]);
    const [form, setForm] = useState({ asset: "", priority: "Medium", issue: "" });

    const userRole = localStorage.getItem("userRole") || "Employee";
    const userName = localStorage.getItem("userName") || "Admin User";

    const fetchRequests = () => {
        axios.get(`${API}/maintenance?user=${encodeURIComponent(userName)}&role=${encodeURIComponent(userRole)}`)
            .then(res => setRequests(res.data))
            .catch(err => console.error(err));
    };

    const fetchMyAssets = () => {
        axios.get(`${API}/allocations?user=${encodeURIComponent(userName)}&role=${encodeURIComponent(userRole)}`)
            .then(res => {
                // filter active allocations if possible, or just map asset name
                const assets = Array.from(new Set(res.data.map(a => a.asset)));
                setMyAssets(assets);
            })
            .catch(err => console.error(err));
    };

    useEffect(() => {
        fetchRequests();
        fetchMyAssets();
    }, []);

    const handleResolve = async (id) => {
        try {
            await axios.put(`${API}/maintenance/${id}`, { status: "Resolved" });
            fetchRequests();
        } catch (e) { console.error(e); }
    };

    const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

    const handleSubmit = async () => {
        try {
            await axios.post("${API}/maintenance", {
                ...form,
                loggedBy: localStorage.getItem("userName") || "Admin User",
                date: new Date().toISOString().split("T")[0],
                status: "Pending"
            });
            setShowForm(false);
            setForm({ asset: "", priority: "Medium", issue: "" });
            fetchRequests();
        } catch (err) {
            console.error(err);
            alert("Error submitting maintenance request");
        }
    };

    return (
        <div className="module-page">
            <div className="module-header">
                <div>
                    <h2 className="module-title">Maintenance</h2>
                    <p className="module-subtitle">Repairs are approved before work starts — the asset flips to Under Maintenance on approval.</p>
                </div>
                <div className="module-actions">
                    <button className="btn-primary" onClick={() => setShowForm((s) => !s)}>
                        {showForm ? "Close" : "+ Raise Request"}
                    </button>
                </div>
            </div>

            {showForm && (
                <div className="card-surface">
                    <div className="form-panel">
                        <div className="form-field">
                            <label>Asset</label>
                            <select name="asset" value={form.asset} onChange={handleChange}>
                                <option value="" disabled>Select asset</option>
                                {myAssets.map((asset, idx) => (
                                    <option key={idx} value={asset}>{asset}</option>
                                ))}
                            </select>
                        </div>
                        <div className="form-field">
                            <label>Priority</label>
                            <select name="priority" value={form.priority} onChange={handleChange}>
                                <option>Low</option>
                                <option>Medium</option>
                                <option>High</option>
                            </select>
                        </div>
                        <div className="form-field">
                            <label>Attach Photo</label>
                            <input type="file" />
                        </div>
                        <div className="form-field" style={{ gridColumn: "1 / -1" }}>
                            <label>Describe the Issue</label>
                            <textarea rows={3} name="issue" value={form.issue} onChange={handleChange} placeholder="What's wrong with this asset?" />
                        </div>
                        <div className="form-panel-actions">
                            <button className="btn-secondary" onClick={() => setShowForm(false)}>Cancel</button>
                            <button className="btn-primary" onClick={handleSubmit}>Submit Request</button>
                        </div>
                    </div>
                </div>
            )}

            <div className="maint-board">
                {STAGES.map((stage) => (
                    <div className="maint-column" key={stage}>
                        <div className="maint-column-header">
                            <span>{stage}</span>
                            <span className="maint-count">
                                {requests.filter((r) => (r.stage || r.status) === stage).length}
                            </span>
                        </div>
                        <div className="maint-column-body">
                            {requests.filter((r) => (r.stage || r.status) === stage).map((r) => (
                                <div className="maint-card" key={r.id}>
                                    <div className="maint-card-top">
                                        <span className="maint-asset">{r.asset}</span>
                                        <span className={`status-pill ${PRIORITY_CLASS[r.priority]}`}>{r.priority}</span>
                                    </div>
                                    <p className="maint-issue">{r.issue}</p>
                                    <p className="maint-by">Raised by {r.raisedBy || r.loggedBy}</p>
                                    {localStorage.getItem("userRole") === "Admin" && stage !== "Resolved" && (
                                        <div style={{ marginTop: "12px", textAlign: "right" }}>
                                            <button className="btn-secondary" style={{ padding: "4px 8px", fontSize: "12px" }} onClick={() => handleResolve(r.id)}>Mark Resolved</button>
                                        </div>
                                    )}
                                </div>
                            ))}
                            {requests.filter((r) => (r.stage || r.status) === stage).length === 0 && (
                                <p className="maint-empty">Nothing here</p>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default Maintenance;