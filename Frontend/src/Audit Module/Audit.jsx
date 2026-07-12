import { useState, useEffect } from "react";
import axios from "axios";
import API from "../api";
import "../shared/moduleStyles.css";

const STATUS_CLASS = { Draft: "grey", Scheduled: "grey", Active: "purple", "In Progress": "purple", Completed: "green", Closed: "green" };
const FINDING_CLASS = { Missing: "red", Damaged: "orange", Verified: "green" };
function Audit() {
    const [tab, setTab] = useState("cycles");
    const [cycles, setCycles] = useState([]);
    const [discrepancies, setDiscrepancies] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [form, setForm] = useState({ name: "", startDate: "" });

    const userRole = localStorage.getItem("userRole") || "Employee";

    const fetchCycles = () => {
        axios.get(`${API}/audits`).then(res => setCycles(res.data)).catch(console.error);
        axios.get(`${API}/discrepancies`).then(res => setDiscrepancies(res.data)).catch(console.error);
    };

    useEffect(() => {
        fetchCycles();
    }, []);

    const handleUpdate = async (id, currentStatus) => {
        const newStatus = prompt("Enter new status (Scheduled, In Progress, Completed):", currentStatus);
        if (newStatus && ["Scheduled", "In Progress", "Completed"].includes(newStatus)) {
            try {
                await axios.put(`${API}/audits/${id}`, { status: newStatus });
                fetchCycles();
            } catch (err) {
                console.error(err);
            }
        } else if (newStatus) {
            alert("Invalid status");
        }
    };

    const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

    const handleSubmit = async () => {
        try {
            await axios.post(`${API}/audits`, {
                name: form.name,
                startDate: form.startDate,
                status: "Scheduled",
                progress: 0
            });
            setShowForm(false);
            setForm({ name: "", startDate: "" });
            fetchCycles();
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div className="module-page">
            <div className="module-header">
                <div>
                    <h2 className="module-title">Audit</h2>
                    <p className="module-subtitle">Run structured verification cycles and auto-generate discrepancy reports.</p>
                </div>
                <div className="module-actions">
                    {userRole === "Admin" && (
                        <button className="btn-primary" onClick={() => setShowForm(!showForm)}>
                            {showForm ? "Cancel" : "+ Create Audit Cycle"}
                        </button>
                    )}
                </div>
            </div>

            <div className="card-surface">
                <div className="tab-group">
                    <button className={`tab-btn ${tab === "cycles" ? "active" : ""}`} onClick={() => setTab("cycles")}>Audit Cycles</button>
                    <button className={`tab-btn ${tab === "discrepancies" ? "active" : ""}`} onClick={() => setTab("discrepancies")}>Discrepancy Report</button>
                </div>

                {showForm && (
                    <div className="form-panel" style={{ background: 'var(--surface)', padding: '24px', borderRadius: '12px', marginBottom: '24px' }}>
                        <div className="form-field">
                            <label>Cycle Name</label>
                            <input type="text" name="name" value={form.name} onChange={handleChange} placeholder="e.g. Q4 Asset Audit" />
                        </div>
                        <div className="form-field">
                            <label>Start Date</label>
                            <input type="date" name="startDate" value={form.startDate} onChange={handleChange} />
                        </div>
                        <div className="form-panel-actions">
                            <button className="btn-primary" onClick={handleSubmit}>Create Cycle</button>
                        </div>
                    </div>
                )}

                {tab === "cycles" && (
                    <div className="table-wrap">
                        <table className="data-table">
                            <thead>
                                <tr>
                                    <th>Cycle</th>
                                    <th>Scope</th>
                                    <th>Date Range</th>
                                    <th>Auditors</th>
                                    <th>Status</th>
                                    <th>Discrepancies</th>
                                    <th></th>
                                </tr>
                            </thead>
                            <tbody>
                                {cycles.map((c) => (
                                    <tr key={c.id}>
                                        <td className="cell-strong">{c.name}</td>
                                        <td className="cell-muted">—</td>
                                        <td className="cell-muted">{c.startDate}</td>
                                        <td>—</td>
                                        <td><span className={`status-pill ${STATUS_CLASS[c.status]}`}>{c.status}</span></td>
                                        <td>{c.progress}%</td>
                                        <td>
                                            {c.status !== "Completed" && userRole === "Admin" && (
                                                <button className="btn-text" onClick={() => handleUpdate(c.id, c.status)}>Update</button>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}

                {tab === "discrepancies" && (
                    <div className="table-wrap">
                        <table className="data-table">
                            <thead>
                                <tr>
                                    <th>Audit Cycle</th>
                                    <th>Asset</th>
                                    <th>Finding</th>
                                    <th>Note</th>
                                </tr>
                            </thead>
                            <tbody>
                                {discrepancies.map((d) => (
                                    <tr key={d.id}>
                                        <td className="cell-muted">—</td>
                                        <td className="cell-strong">{d.asset}</td>
                                        <td><span className={`status-pill ${FINDING_CLASS[d.status] || "orange"}`}>{d.status}</span></td>
                                        <td className="cell-muted">{d.actualLocation}</td>
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

export default Audit;
