import { useState, useEffect } from "react";
import axios from "axios";
import "../shared/moduleStyles.css";
import "./AllocationTransfer.css";

const MOCK_TRANSFERS = [
    { id: 1, asset: 'AF-0114 — MacBook Pro 14"', from: "Priya Shah", to: "Raj Malhotra", requestedOn: "2026-07-08", status: "Pending" },
    { id: 2, asset: "AF-0301 — Conference Table", from: "Facilities", to: "IT Floor 2", requestedOn: "2026-07-05", status: "Approved" },
];

const STATUS_CLASS = { Active: "green", Overdue: "red", Pending: "orange", Approved: "green", Rejected: "red" };

function AllocationTransfer() {
    const [tab, setTab] = useState("current");
    const [showForm, setShowForm] = useState(false);
    const [allocations, setAllocations] = useState([]);
    const [form, setForm] = useState({ asset: "", assignedTo: "", notes: "" });
    const [errorMsg, setErrorMsg] = useState("");

    const fetchAllocations = () => {
        axios.get("http://localhost:5000/api/allocations")
            .then(res => setAllocations(res.data))
            .catch(err => console.error(err));
    };

    useEffect(() => {
        fetchAllocations();
    }, []);

    const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

    const handleSubmit = async () => {
        setErrorMsg("");
        try {
            await axios.post("http://localhost:5000/api/allocations", {
                asset: form.asset,
                assignedTo: form.assignedTo,
                notes: form.notes,
                date: new Date().toISOString().split("T")[0],
                status: "Active"
            });
            setShowForm(false);
            setForm({ asset: "", assignedTo: "", notes: "" });
            fetchAllocations();
        } catch (err) {
            if (err.response && err.response.status === 409) {
                setErrorMsg(err.response.data.error);
            } else {
                setErrorMsg("An error occurred while allocating.");
            }
        }
    };

    return (
        <div className="module-page">
            <div className="module-header">
                <div>
                    <h2 className="module-title">Allocation &amp; Transfer</h2>
                    <p className="module-subtitle">See who holds what, and route transfer requests when there's a conflict.</p>
                </div>
                <div className="module-actions">
                    <button className="btn-primary" onClick={() => { setShowForm(!showForm); setErrorMsg(""); }}>
                        {showForm ? "Close" : "+ Allocate Asset"}
                    </button>
                </div>
            </div>

            <div className="conflict-callout">
                <strong>Conflict rule:</strong> an asset already held by someone can't be allocated again — the system shows who has it and offers a <em>Transfer Request</em> instead. E.g. Laptop AF-0114 is with Priya Shah; a second allocation attempt is blocked.
            </div>

            {showForm && (
                <div className="card-surface" style={{ marginBottom: 24 }}>
                    <div className="form-panel">
                        {errorMsg && <div className="login-error" style={{ gridColumn: "1 / -1", color: "red" }}>{errorMsg}</div>}
                        <div className="form-field">
                            <label>Asset</label>
                            <input type="text" name="asset" value={form.asset} onChange={handleChange} placeholder="e.g. AF-0114 MacBook" />
                        </div>
                        <div className="form-field">
                            <label>Assign To</label>
                            <input type="text" name="assignedTo" value={form.assignedTo} onChange={handleChange} placeholder="e.g. Priya Shah" />
                        </div>
                        <div className="form-field" style={{ gridColumn: "1 / -1" }}>
                            <label>Notes</label>
                            <textarea rows={2} name="notes" value={form.notes} onChange={handleChange} placeholder="Optional notes" />
                        </div>
                        <div className="form-panel-actions">
                            <button className="btn-secondary" onClick={() => setShowForm(false)}>Cancel</button>
                            <button className="btn-primary" onClick={handleSubmit}>Allocate</button>
                        </div>
                    </div>
                </div>
            )}

            <div className="card-surface">
                <div className="tab-group">
                    <button className={`tab-btn ${tab === "current" ? "active" : ""}`} onClick={() => setTab("current")}>Current Allocations</button>
                    <button className={`tab-btn ${tab === "transfers" ? "active" : ""}`} onClick={() => setTab("transfers")}>Transfer Requests</button>
                </div>

                {tab === "current" && (
                    <div className="table-wrap">
                        <table className="data-table">
                            <thead>
                                <tr>
                                    <th>Asset</th>
                                    <th>Held By</th>
                                    <th>Allocated On</th>
                                    <th>Status</th>
                                    <th></th>
                                </tr>
                            </thead>
                            <tbody>
                                {allocations.map((a) => (
                                    <tr key={a.id}>
                                        <td className="cell-strong">{a.asset}</td>
                                        <td>{a.assignedTo}</td>
                                        <td className="cell-muted">{a.date}</td>
                                        <td><span className={`status-pill ${STATUS_CLASS[a.status]}`}>{a.status}</span></td>
                                        <td className="row-actions">
                                            <button className="btn-text">Transfer</button>
                                            <button className="btn-text">Mark Returned</button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}

                {tab === "transfers" && (
                    <div className="table-wrap">
                        <table className="data-table">
                            <thead>
                                <tr>
                                    <th>Asset</th>
                                    <th>From</th>
                                    <th>To</th>
                                    <th>Requested On</th>
                                    <th>Status</th>
                                    <th></th>
                                </tr>
                            </thead>
                            <tbody>
                                {MOCK_TRANSFERS.map((t) => (
                                    <tr key={t.id}>
                                        <td className="cell-strong">{t.asset}</td>
                                        <td>{t.from}</td>
                                        <td>{t.to}</td>
                                        <td className="cell-muted">{t.requestedOn}</td>
                                        <td><span className={`status-pill ${STATUS_CLASS[t.status]}`}>{t.status}</span></td>
                                        <td className="row-actions">
                                            {t.status === "Pending" ? (
                                                <>
                                                    <button className="btn-text">Approve</button>
                                                    <button className="btn-text">Reject</button>
                                                </>
                                            ) : (
                                                <span className="cell-muted">Re-allocated</span>
                                            )}
                                        </td>
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

export default AllocationTransfer;