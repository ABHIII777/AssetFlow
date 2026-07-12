import { useState, useEffect } from "react";
import axios from "axios";
import "../shared/moduleStyles.css";
import "./ResourceBooking.css";

const STATUS_CLASS = { Upcoming: "purple", Ongoing: "green", Completed: "grey", Cancelled: "red" };

function ResourceBooking() {
    const [showForm, setShowForm] = useState(false);
    const [bookings, setBookings] = useState([]);
    const [editingId, setEditingId] = useState(null);
    const [form, setForm] = useState({ resource: "", date: "", startTime: "", endTime: "" });

    const fetchBookings = () => {
        axios.get("http://localhost:5000/api/bookings")
            .then(res => setBookings(res.data))
            .catch(err => console.error(err));
    };

    useEffect(() => {
        fetchBookings();
    }, []);

    const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

    const handleSave = async () => {
        const payload = {
            resource: form.resource,
            user: localStorage.getItem("userName") || "Admin User",
            startTime: `${form.date} ${form.startTime}`,
            endTime: `${form.date} ${form.endTime}`,
            status: "Upcoming"
        };

        try {
            if (editingId) {
                await axios.put(`http://localhost:5000/api/bookings/${editingId}`, payload);
            } else {
                await axios.post("http://localhost:5000/api/bookings", payload);
            }
            setShowForm(false);
            setEditingId(null);
            setForm({ resource: "", date: "", startTime: "", endTime: "" });
            fetchBookings();
        } catch (err) {
            console.error(err);
            alert("Error saving booking");
        }
    };

    const handleCancel = async (id) => {
        try {
            await axios.delete(`http://localhost:5000/api/bookings/${id}`);
            fetchBookings();
        } catch (err) {
            console.error(err);
        }
    };

    const handleReschedule = (b) => {
        setEditingId(b.id);
        const [date, startTime] = (b.startTime || "").split(" ");
        const [_, endTime] = (b.endTime || "").split(" ");
        setForm({ resource: b.resource, date: date || "", startTime: startTime || "", endTime: endTime || "" });
        setShowForm(true);
    };

    return (
        <div className="module-page">
            <div className="module-header">
                <div>
                    <h2 className="module-title">Resource Booking</h2>
                    <p className="module-subtitle">Book shared resources by time slot — overlapping requests are rejected automatically.</p>
                </div>
                <div className="module-actions">
                    <button className="btn-primary" onClick={() => setShowForm((s) => !s)}>
                        {showForm ? "Close" : "+ New Booking"}
                    </button>
                </div>
            </div>

            <div className="card-surface">
                {showForm && (
                    <div className="form-panel">
                        <div className="form-field">
                            <label>Resource</label>
                            <select name="resource" value={form.resource} onChange={handleChange}>
                                <option value="" disabled>Select a shared resource</option>
                                <option>Room B2</option>
                                <option>Conference Room A</option>
                                <option>Toyota Innova</option>
                            </select>
                        </div>
                        <div className="form-field">
                            <label>Date</label>
                            <input type="date" name="date" value={form.date} onChange={handleChange} />
                        </div>
                        <div className="form-field">
                            <label>Start Time</label>
                            <input type="time" name="startTime" value={form.startTime} onChange={handleChange} />
                        </div>
                        <div className="form-field">
                            <label>End Time</label>
                            <input type="time" name="endTime" value={form.endTime} onChange={handleChange} />
                        </div>
                        <div className="form-panel-actions">
                            <button className="btn-secondary" onClick={() => { setShowForm(false); setEditingId(null); }}>Cancel</button>
                            <button className="btn-primary" onClick={handleSave}>Check Availability &amp; Book</button>
                        </div>
                    </div>
                )}

                <div className="booking-legend">
                    <span className="legend-dot" style={{ background: "#7c5cbf" }} /> Room B2 — 09:00 to 10:00 is taken.
                    A 09:30–10:30 request overlaps and is rejected; 10:00–11:00 is fine.
                </div>

                <div className="table-wrap">
                    <table className="data-table">
                        <thead>
                            <tr>
                                <th>Resource</th>
                                <th>Booked By</th>
                                <th>Date</th>
                                <th>Time Slot</th>
                                <th>Status</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            {bookings.map((b) => {
                                const [date, startTime] = (b.startTime || "").split(" ");
                                const [_, endTime] = (b.endTime || "").split(" ");
                                return (
                                    <tr key={b.id}>
                                        <td className="cell-strong">{b.resource}</td>
                                        <td>{b.user}</td>
                                        <td className="cell-muted">{date}</td>
                                        <td>{startTime} – {endTime}</td>
                                        <td><span className={`status-pill ${STATUS_CLASS[b.status] || "grey"}`}>{b.status}</span></td>
                                        <td>
                                            {b.status === "Upcoming" && (
                                                <div className="row-actions">
                                                    <button className="btn-text" onClick={() => handleReschedule(b)}>Reschedule</button>
                                                    <button className="btn-text" onClick={() => handleCancel(b.id)}>Cancel</button>
                                                </div>
                                            )}
                                        </td>
                                    </tr>
                                )
                            })}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

export default ResourceBooking;
