import { useState } from "react";
import "../shared/moduleStyles.css";
import "./OrganizationSetup.css";

// TODO: replace with API.get("/departments"), ("/categories"), ("/employees")
const MOCK_DEPARTMENTS = [
    { id: 1, name: "Information Technology", head: "Priya Shah", parent: "—", status: "Active" },
    { id: 2, name: "Facilities", head: "Rahul Nair", parent: "—", status: "Active" },
    { id: 3, name: "Field Support", head: "Amit Verma", parent: "Information Technology", status: "Active" },
    { id: 4, name: "Finance", head: "Unassigned", parent: "—", status: "Inactive" },
];

const MOCK_CATEGORIES = [
    { id: 1, name: "Electronics", fields: "Warranty Period, Serial No.", assetCount: 84 },
    { id: 2, name: "Furniture", fields: "Material, Dimensions", assetCount: 52 },
    { id: 3, name: "Vehicles", fields: "Registration No., Fuel Type", assetCount: 12 },
    { id: 4, name: "Office Equipment", fields: "Warranty Period", assetCount: 30 },
];

const MOCK_EMPLOYEES = [
    { id: 1, name: "Priya Shah", email: "priya.shah@org.com", dept: "Information Technology", role: "Department Head", status: "Active" },
    { id: 2, name: "Raj Malhotra", email: "raj.malhotra@org.com", dept: "Facilities", role: "Asset Manager", status: "Active" },
    { id: 3, name: "Amit Verma", email: "amit.verma@org.com", dept: "Field Support", role: "Employee", status: "Active" },
    { id: 4, name: "Neha Kapoor", email: "neha.kapoor@org.com", dept: "Finance", role: "Employee", status: "Inactive" },
    { id: 5, name: "Sana Iyer", email: "sana.iyer@org.com", dept: "Information Technology", role: "Employee", status: "Active" },
];

const TABS = [
    { key: "departments", label: "Departments" },
    { key: "categories", label: "Asset Categories" },
    { key: "employees", label: "Employee Directory" },
];

function StatusPill({ value }) {
    const cls = value === "Active" ? "green" : "grey";
    return <span className={`status-pill ${cls}`}>{value}</span>;
}

function DepartmentsTab() {
    return (
        <div className="table-wrap">
            <table className="data-table">
                <thead>
                    <tr>
                        <th>Department</th>
                        <th>Head</th>
                        <th>Parent Department</th>
                        <th>Status</th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    {MOCK_DEPARTMENTS.map((d) => (
                        <tr key={d.id}>
                            <td className="cell-strong">{d.name}</td>
                            <td>{d.head}</td>
                            <td>{d.parent}</td>
                            <td><StatusPill value={d.status} /></td>
                            <td><button className="btn-text">Edit</button></td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

function CategoriesTab() {
    return (
        <div className="table-wrap">
            <table className="data-table">
                <thead>
                    <tr>
                        <th>Category</th>
                        <th>Custom Fields</th>
                        <th>Assets Registered</th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    {MOCK_CATEGORIES.map((c) => (
                        <tr key={c.id}>
                            <td className="cell-strong">{c.name}</td>
                            <td className="cell-muted">{c.fields}</td>
                            <td>{c.assetCount}</td>
                            <td><button className="btn-text">Edit</button></td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

function EmployeesTab() {
    return (
        <div className="table-wrap">
            <table className="data-table">
                <thead>
                    <tr>
                        <th>Name</th>
                        <th>Email</th>
                        <th>Department</th>
                        <th>Role</th>
                        <th>Status</th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    {MOCK_EMPLOYEES.map((e) => (
                        <tr key={e.id}>
                            <td className="cell-strong">{e.name}</td>
                            <td className="cell-muted">{e.email}</td>
                            <td>{e.dept}</td>
                            <td>
                                <span className={`status-pill ${e.role === "Employee" ? "grey" : "purple"}`}>{e.role}</span>
                            </td>
                            <td><StatusPill value={e.status} /></td>
                            <td><button className="btn-text">Promote</button></td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

function OrganizationSetup() {
    const [tab, setTab] = useState("departments");

    const ADD_LABEL = {
        departments: "+ Add Department",
        categories: "+ Add Category",
        employees: "Promote Employee",
    };

    return (
        <div className="module-page">
            <div className="module-header">
                <div>
                    <h2 className="module-title">Organization Setup</h2>
                    <p className="module-subtitle">Master data for departments, asset categories and the employee directory — Admin only.</p>
                </div>
                <div className="module-actions">
                    <button className="btn-primary">{ADD_LABEL[tab]}</button>
                </div>
            </div>

            <div className="card-surface">
                <div className="tab-group">
                    {TABS.map((t) => (
                        <button
                            key={t.key}
                            className={`tab-btn ${tab === t.key ? "active" : ""}`}
                            onClick={() => setTab(t.key)}
                        >
                            {t.label}
                        </button>
                    ))}
                </div>

                {tab === "departments" && <DepartmentsTab />}
                {tab === "categories" && <CategoriesTab />}
                {tab === "employees" && <EmployeesTab />}

                <p className="org-note">
                    Role assignment happens only here — promoting an employee to <strong>Department Head</strong> or <strong>Asset Manager</strong> is the sole path to elevated access, keeping signup limited to plain Employee accounts.
                </p>
            </div>
        </div>
    );
}

export default OrganizationSetup;
