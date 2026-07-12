import { useState, useEffect } from "react";
import axios from "axios";
import API from "../api";
import "../shared/moduleStyles.css";
import "./AllocationTransfer.css";

const STATUS_CLASS = { Active: "green", Overdue: "red", Pending: "orange", Approved: "green", Rejected: "red", Returned: "grey" };

function AllocationTransfer() {
    const [tab, setTab] = useState("current");
    const [showForm, setShowForm] = useState(false);
    const [allocations, setAllocations] = useState([]);
    const [transfers, setTransfers] = useState([]);
    const [form, setForm] = useState({ asset: "", assignedTo: "", notes: "" });
    const [errorMsg, setErrorMsg] = useState("");
    const [transferForm, setTransferForm] = useState({ asset: null, to: "", toDept: "" });
    const [transferError, setTransferError] = useState("");

    const userRole = localStorage.getItem("userRole") || "Employee";
    const userName = localStorage.getItem("userName") || "";

    const fetchAllocations = () => {
        axios.get(`${API}/allocations?user=${encodeURIComponent(userName)}&role=${encodeURIComponent(userRole)}`)
            .then(res => setAllocations(res.data))
            .catch(err => console.error(err));
    };

    const fetchTransfers = () => {
        axios.get(`${API}/transfers?user=${encodeURIComponent(userName)}&role=${encodeURIComponent(userRole)}`)
            .then(res => setTransfers(res.data))
            .catch(err => console.error(err));
    };

    useEffect(() => {
        fetchAllocations();
        fetchTransfers();
    }, []);

    const handleMarkReturned = async (id) => {
        try {
            await axios.put(`${API}/allocations/${id}`, { status: "Returned" });
            fetchAllocations();
        } catch (e) { console.error(e); }
    };

    const handleTransfer = (alloc) => {
        setTransferForm({ asset: alloc, to: "", toDept: "" });
        setTransferError("");
    };

    const submitTransfer = async () => {
        setTransferError("");
        if (!transferForm.to || !transferForm.toDept) {
            setTransferError("Please provide both Username and Department.");
            return;
        }
        try {
            await axios.post("${API}/transfers", {
                asset: transferForm.asset.asset,
                from: transferForm.asset.assignedTo,
                to: transferForm.to,
                toDept: transferForm.toDept,
                reason: "User requested transfer",
                status: "Pending",
                date: new Date().toISOString().split('T')[0]
            });
            setTransferForm({ asset: null, to: "", toDept: "" });
            fetchTransfers();
            setTab("transfers");
        } catch (e) {
            if (e.response && e.response.status === 400) {
                setTransferError(e.response.data.error);
            } else {
                setTransferError("An error occurred requesting transfer.");
            }
        }
    };

    const handleResolveTransfer = async (id, status) => {
        try {
            await axios.put(`${API}/transfers/${id}`, { status });
            fetchTransfers();
        } catch (e) { console.error(e); }
    };

    const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

    const handleSubmit = async () => {
        setErrorMsg("");
        try {
            await axios.post("${API}/allocations", {
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
                    {userRole === "Admin" && (
                        <button className="btn-primary" onClick={() => { setShowForm(!showForm); setErrorMsg(""); }}>
                            {showForm ? "Close" : "+ Allocate Asset"}
                        </button>
                    )}
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

            {transferForm.asset && (
                <div className="card-surface" style={{ marginBottom: 24 }}>
                    <div className="form-panel">
                        {transferError && <div className="login-error" style={{ gridColumn: "1 / -1", color: "red" }}>{transferError}</div>}
                        <div className="form-field" style={{ gridColumn: "1 / -1" }}>
                            <strong>Transferring:</strong> {transferForm.asset.asset}
                        </div>
                        <div className="form-field">
                            <label>Transfer To (Username)</label>
                            <input type="text" value={transferForm.to} onChange={(e) => setTransferForm({...transferForm, to: e.target.value})} placeholder="e.g. Amit Patel" />
                        </div>
                        <div className="form-field">
                            <label>Department</label>
                            <input type="text" value={transferForm.toDept} onChange={(e) => setTransferForm({...transferForm, toDept: e.target.value})} placeholder="e.g. Engineering" />
                        </div>
                        <div className="form-panel-actions">
                            <button className="btn-secondary" onClick={() => setTransferForm({ asset: null, to: "", toDept: "" })}>Cancel</button>
                            <button className="btn-primary" onClick={submitTransfer}>Request Transfer</button>
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
                                            {a.status !== "Returned" && (
                                                <>
                                                    {a.assignedTo === userName && (
                                                        <button className="btn-text" onClick={() => handleTransfer(a)}>Transfer</button>
                                                    )}
                                                    {userRole === "Admin" && (
                                                        <button className="btn-text" onClick={() => handleMarkReturned(a.id)}>Mark Returned</button>
                                                    )}
                                                </>
                                            )}
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
                                {transfers.map((t) => (
                                    <tr key={t.id}>
                                        <td className="cell-strong">{t.asset}</td>
                                        <td>{t.from}</td>
                                        <td>{t.to}</td>
                                        <td className="cell-muted">{t.date}</td>
                                        <td><span className={`status-pill ${STATUS_CLASS[t.status]}`}>{t.status}</span></td>
                                        <td className="row-actions">
                                            {t.status === "Pending" ? (
                                                userRole === "Admin" ? (
                                                    <>
                                                        <button className="btn-text" onClick={() => handleResolveTransfer(t.id, "Approved")}>Approve</button>
                                                        <button className="btn-text" style={{color: "var(--red)"}} onClick={() => handleResolveTransfer(t.id, "Rejected")}>Reject</button>
                                                    </>
                                                ) : (
                                                    <span className="cell-muted">Pending Admin Action</span>
                                                )
                                            ) : (
                                                <span className="cell-muted">Resolved</span>
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