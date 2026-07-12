import { useState, useEffect } from "react";
import axios from "axios";
import "../shared/moduleStyles.css";
import "./OrganizationSetup.css";

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
    const [departments, setDepartments] = useState([]);

    useEffect(() => {
        axios.get("http://localhost:5000/api/departments")
            .then(res => setDepartments(res.data))
            .catch(err => console.error(err));
    }, []);

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
                    {departments.map((d) => (
                        <tr key={d.id}>
                            <td className="cell-strong">{d.name}</td>
                            <td>{d.head || "—"}</td>
                            <td>{d.parent || "—"}</td>
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
    const [categories, setCategories] = useState([]);

    useEffect(() => {
        axios.get("http://localhost:5000/api/categories")
            .then(res => setCategories(res.data))
            .catch(err => console.error(err));
    }, []);

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
                    {categories.map((c) => (
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
    const [employees, setEmployees] = useState([]);

    useEffect(() => {
        axios.get("http://localhost:5000/api/employees")
            .then(res => setEmployees(res.data))
            .catch(err => console.error(err));
    }, []);

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
                    {employees.map((e) => (
                        <tr key={e.id}>
                            <td className="cell-strong">{e.name}</td>
                            <td className="cell-muted">{e.email}</td>
                            <td>{e.dept || "—"}</td>
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
