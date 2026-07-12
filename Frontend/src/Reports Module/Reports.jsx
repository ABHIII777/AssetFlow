import "../shared/moduleStyles.css";
import "./Reports.css";

// TODO: replace with API-backed aggregates once analytics endpoints exist
const UTILIZATION = [
    { label: 'MacBook Pro 14"', value: 92 },
    { label: "Conference Room A", value: 78 },
    { label: "Toyota Innova", value: 64 },
    { label: "Epson Projector", value: 41 },
    { label: "Standing Desk", value: 18 },
];

const MAINTENANCE_FREQ = [
    { category: "Electronics", count: 14 },
    { category: "Vehicles", count: 6 },
    { category: "Furniture", count: 3 },
    { category: "Office Equipment", count: 5 },
];

const DEPT_ALLOCATION = [
    { dept: "Information Technology", assets: 58 },
    { dept: "Facilities", assets: 34 },
    { dept: "Field Support", assets: 22 },
    { dept: "Finance", assets: 12 },
];

const RETIREMENT_DUE = [
    { asset: "AF-0021 — Dell Latitude", dueIn: "12 days" },
    { asset: "AF-0087 — HP LaserJet Printer", dueIn: "27 days" },
    { asset: "AF-0009 — Toyota Etios", dueIn: "41 days" },
];

const HEATMAP_HOURS = ["9–11", "11–13", "13–15", "15–17", "17–19"];
const HEATMAP = [
    [2, 4, 6, 3, 1],
    [3, 5, 8, 5, 2],
    [1, 3, 4, 2, 1],
];
const HEATMAP_ROWS = ["Room B2", "Conference Room A", "Toyota Innova"];

function heatColor(v) {
    const max = 8;
    const alpha = 0.12 + (v / max) * 0.65;
    return `rgba(124, 92, 191, ${alpha.toFixed(2)})`;
}

function Reports() {
    return (
        <div className="module-page">
            <div className="module-header">
                <div>
                    <h2 className="module-title">Reports &amp; Analytics</h2>
                    <p className="module-subtitle">Operational insight across utilization, maintenance, allocation and bookings.</p>
                </div>
                <div className="module-actions">
                    <button className="btn-secondary">Export CSV</button>
                    <button className="btn-primary">Export PDF</button>
                </div>
            </div>

            <div className="reports-grid">

                {/* Utilization */}
                <div className="card-surface">
                    <div className="surface-header">
                        <span className="surface-title">Most-Used Assets</span>
                        <span className="cell-muted">This month</span>
                    </div>
                    {UTILIZATION.map((u) => (
                        <div className="bar-row" key={u.label}>
                            <span className="bar-label">{u.label}</span>
                            <div className="bar-track">
                                <div className="bar-fill" style={{ width: `${u.value}%` }} />
                            </div>
                            <span className="bar-value">{u.value}%</span>
                        </div>
                    ))}
                </div>

                {/* Maintenance frequency */}
                <div className="card-surface">
                    <div className="surface-header">
                        <span className="surface-title">Maintenance Frequency by Category</span>
                    </div>
                    {MAINTENANCE_FREQ.map((m) => (
                        <div className="bar-row" key={m.category}>
                            <span className="bar-label">{m.category}</span>
                            <div className="bar-track">
                                <div className="bar-fill bar-fill--orange" style={{ width: `${(m.count / 14) * 100}%` }} />
                            </div>
                            <span className="bar-value">{m.count}</span>
                        </div>
                    ))}
                </div>

                {/* Department allocation */}
                <div className="card-surface">
                    <div className="surface-header">
                        <span className="surface-title">Department-wise Allocation</span>
                    </div>
                    {DEPT_ALLOCATION.map((d) => (
                        <div className="bar-row" key={d.dept}>
                            <span className="bar-label">{d.dept}</span>
                            <div className="bar-track">
                                <div className="bar-fill" style={{ width: `${(d.assets / 58) * 100}%` }} />
                            </div>
                            <span className="bar-value">{d.assets}</span>
                        </div>
                    ))}
                </div>

                {/* Due for retirement */}
                <div className="card-surface">
                    <div className="surface-header">
                        <span className="surface-title">Nearing Retirement / Maintenance Due</span>
                    </div>
                    <ul className="retire-list">
                        {RETIREMENT_DUE.map((r) => (
                            <li key={r.asset} className="retire-item">
                                <span>{r.asset}</span>
                                <span className="status-pill orange">Due in {r.dueIn}</span>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Booking heatmap */}
                <div className="card-surface reports-heatmap">
                    <div className="surface-header">
                        <span className="surface-title">Resource Booking Heatmap — Peak Windows</span>
                    </div>
                    <table className="heatmap-table">
                        <thead>
                            <tr>
                                <th></th>
                                {HEATMAP_HOURS.map((h) => <th key={h}>{h}</th>)}
                            </tr>
                        </thead>
                        <tbody>
                            {HEATMAP_ROWS.map((row, ri) => (
                                <tr key={row}>
                                    <td className="heatmap-row-label">{row}</td>
                                    {HEATMAP[ri].map((v, ci) => (
                                        <td key={ci}>
                                            <div className="heatmap-cell" style={{ background: heatColor(v) }}>{v}</div>
                                        </td>
                                    ))}
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

            </div>
        </div>
    );
}

export default Reports;