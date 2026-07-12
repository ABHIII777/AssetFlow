import { useState } from "react";
import "../shared/moduleStyles.css";

// TODO: replace with API.get("/audit-cycles")
const MOCK_CYCLES = [
    { id: 1, name: "Q3 IT Assets", scope: "Information Technology · IT Floor 2", range: "2026-07-01 to 2026-07-10", auditors: "Priya Shah, Raj Malhotra", status: "Closed", discrepancies: 2 },
    { id: 2, name: "Facilities Half-Yearly", scope: "Facilities · All Locations", range: "2026-07-05 to 2026-07-20", auditors: "Raj Malhotra", status: "Active", discrepancies: 1 },
    { id: 3, name: "Field Vehicles Check", scope: "Field Support · Parking B", range: "2026-07-15 to 2026-07-18", auditors: "Amit Verma", status: "Draft", discrepancies: 0 },
];

const MOCK_DISCREPANCIES = [
    { id: 1, cycle: "Q3 IT Assets", asset: "AF-0209 — Wireless Mouse", finding: "Missing", note: "Not located in last known department" },
    { id: 2, cycle: "Q3 IT Assets", asset: "AF-0176 — External SSD", finding: "Damaged", note: "Casing cracked, unit unusable" },
    { id: 3, cycle: "Facilities Half-Yearly", asset: "AF-0244 — Office Cabinet", finding: "Missing", note: "Awaiting auditor confirmation" },
];

const STATUS_CLASS = { Draft: "grey", Active: "purple", Closed: "green" };
const FINDING_CLASS = { Missing: "red", Damaged: "orange", Verified: "green" };

function Audit() {
    const [tab, setTab] = useState("cycles");

    return (
        <div className="module-page">
            <div className="module-header">
                <div>
                    <h2 className="module-title">Audit</h2>
                    <p className="module-subtitle">Run structured verification cycles and auto-generate discrepancy reports.</p>
                </div>
                <div className="module-actions">
                    <button className="btn-primary">+ Create Audit Cycle</button>
                </div>
            </div>

            <div className="card-surface">
                <div className="tab-group">
                    <button className={`tab-btn ${tab === "cycles" ? "active" : ""}`} onClick={() => setTab("cycles")}>Audit Cycles</button>
                    <button className={`tab-btn ${tab === "discrepancies" ? "active" : ""}`} onClick={() => setTab("discrepancies")}>Discrepancy Report</button>
                </div>

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
                                {MOCK_CYCLES.map((c) => (
                                    <tr key={c.id}>
                                        <td className="cell-strong">{c.name}</td>
                                        <td className="cell-muted">{c.scope}</td>
                                        <td className="cell-muted">{c.range}</td>
                                        <td>{c.auditors}</td>
                                        <td><span className={`status-pill ${STATUS_CLASS[c.status]}`}>{c.status}</span></td>
                                        <td>{c.discrepancies > 0 ? <span className="status-pill red">{c.discrepancies}</span> : "—"}</td>
                                        <td>
                                            {c.status !== "Closed" && <button className="btn-text">{c.status === "Draft" ? "Start" : "Close Cycle"}</button>}
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
                                {MOCK_DISCREPANCIES.map((d) => (
                                    <tr key={d.id}>
                                        <td className="cell-muted">{d.cycle}</td>
                                        <td className="cell-strong">{d.asset}</td>
                                        <td><span className={`status-pill ${FINDING_CLASS[d.finding]}`}>{d.finding}</span></td>
                                        <td className="cell-muted">{d.note}</td>
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
