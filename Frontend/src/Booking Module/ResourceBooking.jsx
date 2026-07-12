import { useState } from "react";
import "../shared/moduleStyles.css";
import "./ResourceBooking.css";

// TODO: replace with API.get("/bookings")
const MOCK_BOOKINGS = [
    { id: 1, resource: "Room B2", bookedBy: "Priya Shah", date: "2026-07-12", slot: "09:00 – 10:00", status: "Completed" },
    { id: 2, resource: "Room B2", bookedBy: "Raj Malhotra", date: "2026-07-12", slot: "10:00 – 11:00", status: "Ongoing" },
    { id: 3, resource: "Toyota Innova", bookedBy: "Field Support", date: "2026-07-13", slot: "08:00 – 18:00", status: "Upcoming" },
    { id: 4, resource: "Conference Room A", bookedBy: "Sana Iyer", date: "2026-07-14", slot: "14:00 – 15:30", status: "Upcoming" },
    { id: 5, resource: "Room B2", bookedBy: "Neha Kapoor", date: "2026-07-11", slot: "13:00 – 14:00", status: "Cancelled" },
];

const STATUS_CLASS = { Upcoming: "purple", Ongoing: "green", Completed: "grey", Cancelled: "red" };

function ResourceBooking() {
    const [showForm, setShowForm] = useState(false);

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
                            <select defaultValue="">
                                <option value="" disabled>Select a shared resource</option>
                                <option>Room B2</option>
                                <option>Conference Room A</option>
                                <option>Toyota Innova</option>
                            </select>
                        </div>
                        <div className="form-field">
                            <label>Date</label>
                            <input type="date" />
                        </div>
                        <div className="form-field">
                            <label>Start Time</label>
                            <input type="time" />
                        </div>
                        <div className="form-field">
                            <label>End Time</label>
                            <input type="time" />
                        </div>
                        <div className="form-panel-actions">
                            <button className="btn-secondary" onClick={() => setShowForm(false)}>Cancel</button>
                            <button className="btn-primary">Check Availability &amp; Book</button>
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
                            {MOCK_BOOKINGS.map((b) => (
                                <tr key={b.id}>
                                    <td className="cell-strong">{b.resource}</td>
                                    <td>{b.bookedBy}</td>
                                    <td className="cell-muted">{b.date}</td>
                                    <td>{b.slot}</td>
                                    <td><span className={`status-pill ${STATUS_CLASS[b.status]}`}>{b.status}</span></td>
                                    <td>
                                        {b.status === "Upcoming" && (
                                            <div className="row-actions">
                                                <button className="btn-text">Reschedule</button>
                                                <button className="btn-text">Cancel</button>
                                            </div>
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

export default ResourceBooking;
