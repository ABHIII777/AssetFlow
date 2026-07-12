import { useState, useEffect } from "react";
import axios from "axios";
import API from "../api";
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

// Event bus for add button
const ADD_EVENT = new EventTarget();

function DepartmentsTab() {
    const [departments, setDepartments] = useState([]);
    const [showForm, setShowForm] = useState(false);
    const [form, setForm] = useState({ name: "", head: "", parent: "", status: "Active" });

    const fetchDepartments = () => {
        axios.get(`${API}/departments`)
            .then(res => setDepartments(res.data))
            .catch(err => console.error(err));
    };

    useEffect(() => {
        fetchDepartments();
        const onAdd = () => setShowForm(prev => !prev);
        ADD_EVENT.addEventListener("add_departments", onAdd);
        return () => ADD_EVENT.removeEventListener("add_departments", onAdd);
    }, []);

    const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

    const handleSubmit = async () => {
        try {
            await axios.post(`${API}/departments`, form);
            setShowForm(false);
            setForm({ name: "", head: "", parent: "", status: "Active" });
            fetchDepartments();
        } catch (err) {
            console.error(err);
        }
    };

    const handleEdit = async (id, currentName) => {
        const newName = prompt("Enter new department name:", currentName);
        if (newName && newName !== currentName) {
            try {
                await axios.put(`${API}/departments/${id}`, { name: newName });
                fetchDepartments();
            } catch (err) {
                console.error(err);
            }
        }
    };

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            {showForm && (
                <div className="form-panel" style={{ background: 'var(--surface)', padding: '24px', borderRadius: '12px' }}>
                    <div className="form-field">
                        <label>Department Name</label>
                        <input type="text" name="name" value={form.name} onChange={handleChange} placeholder="e.g. HR" />
                    </div>
                    <div className="form-field">
                        <label>Head</label>
                        <input type="text" name="head" value={form.head} onChange={handleChange} placeholder="e.g. Priya Shah" />
                    </div>
                    <div className="form-field">
                        <label>Parent Department</label>
                        <input type="text" name="parent" value={form.parent} onChange={handleChange} placeholder="e.g. Finance or —" />
                    </div>
                    <div className="form-panel-actions">
                        <button className="btn-secondary" onClick={() => setShowForm(false)}>Cancel</button>
                        <button className="btn-primary" onClick={handleSubmit}>Save Department</button>
                    </div>
                </div>
            )}
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
                                <td><button className="btn-text" onClick={() => handleEdit(d.id, d.name)}>Edit</button></td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

function CategoriesTab() {
    const [categories, setCategories] = useState([]);

    const fetchCategories = () => {
        axios.get(`${API}/categories`)
            .then(res => setCategories(res.data))
            .catch(err => console.error(err));
    };

    useEffect(() => {
        fetchCategories();
    }, []);

    const handleEdit = async (id, currentName) => {
        const newName = prompt("Enter new category name:", currentName);
        if (newName && newName !== currentName) {
            try {
                await axios.put(`${API}/categories/${id}`, { name: newName });
                fetchCategories();
            } catch (err) {
                console.error(err);
            }
        }
    };

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
                            <td><button className="btn-text" onClick={() => handleEdit(c.id, c.name)}>Edit</button></td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

function EmployeesTab() {
    const [employees, setEmployees] = useState([]);

    const fetchEmployees = () => {
        axios.get(`${API}/employees`)
            .then(res => setEmployees(res.data))
            .catch(err => console.error(err));
    };

    useEffect(() => {
        fetchEmployees();
    }, []);

    const handlePromote = async (id, currentRole) => {
        const newRole = prompt("Enter new role (e.g. Admin, Department Head, Employee):", currentRole);
        if (newRole && newRole !== currentRole) {
            try {
                await axios.put(`${API}/employees/${id}`, { role: newRole });
                fetchEmployees();
            } catch (err) {
                console.error(err);
            }
        }
    };

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
                            <td>
                                {e.role !== "Admin" && (
                                    <button className="btn-text" onClick={() => handlePromote(e.id, e.role)}>Promote</button>
                                )}
                            </td>
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
                    <button className="btn-primary" onClick={() => ADD_EVENT.dispatchEvent(new Event(`add_${tab}`))}>{ADD_LABEL[tab]}</button>
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
