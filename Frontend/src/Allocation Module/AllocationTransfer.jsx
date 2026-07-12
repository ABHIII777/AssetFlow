import { useState } from "react";
import "../shared/moduleStyles.css";
import "./AllocationTransfer.css";

// TODO: replace with API.get("/allocations")
const MOCK_ALLOCATIONS = [
    { id: 1, asset: 'AF-0114 — MacBook Pro 14"', holder: "Priya Shah", dept: "Information Technology", allocatedOn: "2026-05-02", expectedReturn: "2026-07-02", status: "Overdue" },
    { id: 2, asset: "AF-0231 — Ergonomic Chair", holder: "Amit Verma", dept: "Field Support", allocatedOn: "2026-06-10", expectedReturn: "—", status: "Active" },
    { id: 3, asset: "AF-0045 — Toyota Innova", holder: "Field Support (dept)", dept: "Field Support", allocatedOn: "2026-06-28", expectedReturn: "2026-07-20", status: "Active" },
    { id: 4, asset: "AF-0173 — iPad Air", holder: "Sana Iyer", dept: "Information Technology", allocatedOn: "2026-04-14", expectedReturn: "2026-06-14", status: "Overdue" },
    { id: 5, asset: "AF-0056 — Standing Desk", holder: "Neha Kapoor", dept: "Finance", allocatedOn: "2026-06-01", expectedReturn: "2026-08-01", status: "Active" },
];

const MOCK_TRANSFERS = [
    { id: 1, asset: 'AF-0114 — MacBook Pro 14"', from: "Priya Shah", to: "Raj Malhotra", requestedOn: "2026-07-08", status: "Pending" },
    { id: 2, asset: "AF-0301 — Conference Table", from: "Facilities", to: "IT Floor 2", requestedOn: "2026-07-05", status: "Approved" },
];

const STATUS_CLASS = { Active: "green", Overdue: "red", Pending: "orange", Approved: "green", Rejected: "red" };

function AllocationTransfer() {
    const [tab, setTab] = useState("current");

    return (
        <div className="module-page">
            <div className="module-header">
                <div>
                    <h2 className="module-title">Allocation &amp; Transfer</h2>
                    <p className="module-subtitle">See who holds what, and route transfer requests when there's a conflict.</p>
                </div>
                <div className="module-actions">
                    <button className="btn-primary">+ Allocate Asset</button>
                </div>
            </div>

            <div className="conflict-callout">
                <strong>Conflict rule:</strong> an asset already held by someone can't be allocated again — the system shows who has it and offers a <em>Transfer Request</em> instead. E.g. Laptop AF-0114 is with Priya Shah; a second allocation attempt is blocked.
            </div>

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
                                    <th>Department</th>
                                    <th>Allocated On</th>
                                    <th>Expected Return</th>
                                    <th>Status</th>
                                    <th></th>
                                </tr>
                            </thead>
                            <tbody>
                                {MOCK_ALLOCATIONS.map((a) => (
                                    <tr key={a.id}>
                                        <td className="cell-strong">{a.asset}</td>
                                        <td>{a.holder}</td>
                                        <td>{a.dept}</td>
                                        <td className="cell-muted">{a.allocatedOn}</td>
                                        <td className="cell-muted">{a.expectedReturn}</td>
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