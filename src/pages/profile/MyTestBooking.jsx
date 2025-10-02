// src/pages/labTest/MyTestBooking.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import { config } from "../../config";
import { Link } from "react-router-dom";

function MyTestBooking() {
    const { baseUrl } = config;
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchBookings = async () => {
            try {
                const token = localStorage.getItem("access_token");
                if (!token) {
                    setBookings([]);
                    setLoading(false);
                    return;
                }
                const res = await axios.get(`${baseUrl}/labtests/bookings/`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setBookings(res.data.results || res.data);
            } catch (err) {
                console.error("Failed to load bookings", err);
                setBookings([]);
            } finally {
                setLoading(false);
            }
        };
        fetchBookings();
    }, [baseUrl]);

    if (loading) return <p>Loading...</p>;

    return (
        <div className="container">
            <h3 className="mb-4">🧪 My Test Bookings</h3>
            {Array.isArray(bookings) && bookings.length > 0 ? (
                <table className="table table-bordered align-middle text-center">
                    <thead className="table-light">
                        <tr>
                            <th style={{ width: "18%" }}>Booking ID</th>
                            <th style={{ width: "12%" }}>Lab</th>
                            <th style={{ width: "40%" }}>Items</th>
                            <th style={{ width: "10%" }}>Total</th>
                            <th style={{ width: "10%" }}>Status</th>
                            <th style={{ width: "10%" }}>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {bookings.map((booking) => (
                            <tr key={booking.uuid}>
                                <td>
                                    <Link to={`/profile/test-booking/${booking.uuid}`}>
                                        {booking.uuid.substring(0, 10)}...
                                    </Link>
                                </td>

                                <td>{booking.lab_name}</td>

                                <td>
                                    {booking.items && booking.items.length > 0 ? (
                                        booking.items.map((item) => (
                                            <div
                                                key={item.id}
                                                className="d-flex align-items-center justify-content-between mb-1"
                                            >
                                                <span>
                                                    {item.name}{" "}
                                                    {!item.is_package && item.sample_type && (
                                                        <small className="text-muted">
                                                            ({item.sample_type})
                                                        </small>
                                                    )}
                                                </span>
                                                <span style={{ color: "#a4449d" }}>
                                                    Tk {item.unit_price}
                                                </span>
                                            </div>
                                        ))
                                    ) : (
                                        <span className="text-muted">No items</span>
                                    )}
                                </td>

                                <td>{booking.total_amount} ৳</td>

                                <td>
                                    <span
                                        className={`badge ${booking.status === "PENDING"
                                                ? "bg-warning text-dark"
                                                : booking.status === "CONFIRMED"
                                                    ? "bg-success"
                                                    : booking.status === "CANCELLED"
                                                        ? "bg-danger"
                                                        : "bg-secondary"
                                            }`}
                                    >
                                        {booking.status}
                                    </span>
                                </td>

                                <td>
                                    {booking.is_paid ? (
                                        <span className="badge bg-success">Paid</span>
                                    ) : (
                                        <Link
                                            to={`/profile/test-booking/${booking.uuid}`}
                                            className="btn btn-sm btn-primary"
                                        >
                                            Pay Now
                                        </Link>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            ) : (
                <p>No test bookings yet.</p>
            )}
        </div>
    );
}

export default MyTestBooking;
