import { useState } from "react";
import "../shared/moduleStyles.css";
import "./Maintenance.css";

// TODO: replace with API.get("/maintenance-requests")
const MOCK_REQUESTS = [
    { id: 1, asset: 'AF-0198 — Dell Monitor 27"', issue: "Screen flickering intermittently", priority: "High", stage: "Pending", raisedBy: "Sana Iyer" },
    { id: 2, asset: "AF-0045 — Toyota Innova", issue: "AC not cooling", priority: "Medium", stage: "Approved", raisedBy: "Field Support" },
    { id: 3, asset: "AF-0301 — Conference Table", issue: "Leg bracket loose", priority: "Low", stage: "Technician Assigned", raisedBy: "Facilities" },
    { id: 4, asset: 'AF-0114 — MacBook Pro 14"', issue: "Battery draining fast", priority: "Medium", stage: "In Progress", raisedBy: "Priya Shah" },
    { id: 5, asset: "AF-0062 — Epson Projector", issue: "Bulb replacement", priority: "High", stage: "Resolved", raisedBy: "Facilities" },
];

const STAGES = ["Pending", "Approved", "Technician Assigned", "In Progress", "Resolved"];
const PRIORITY_CLASS = { High: "red", Medium: "orange", Low: "grey" };

function Maintenance() {
    const [showForm, setShowForm] = useState(false);

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
                            <select defaultValue="">
                                <option value="" disabled>Select asset</option>
                                <option>AF-0114 — MacBook Pro 14"</option>
                                <option>AF-0198 — Dell Monitor 27"</option>
                                <option>AF-0045 — Toyota Innova</option>
                            </select>
                        </div>
                        <div className="form-field">
                            <label>Priority</label>
                            <select defaultValue="Medium">
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
                            <textarea rows={3} placeholder="What's wrong with this asset?" />
                        </div>
                        <div className="form-panel-actions">
                            <button className="btn-secondary" onClick={() => setShowForm(false)}>Cancel</button>
                            <button className="btn-primary">Submit Request</button>
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
                                {MOCK_REQUESTS.filter((r) => r.stage === stage).length}
                            </span>
                        </div>
                        <div className="maint-column-body">
                            {MOCK_REQUESTS.filter((r) => r.stage === stage).map((r) => (
                                <div className="maint-card" key={r.id}>
                                    <div className="maint-card-top">
                                        <span className="maint-asset">{r.asset}</span>
                                        <span className={`status-pill ${PRIORITY_CLASS[r.priority]}`}>{r.priority}</span>
                                    </div>
                                    <p className="maint-issue">{r.issue}</p>
                                    <p className="maint-by">Raised by {r.raisedBy}</p>
                                </div>
                            ))}
                            {MOCK_REQUESTS.filter((r) => r.stage === stage).length === 0 && (
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