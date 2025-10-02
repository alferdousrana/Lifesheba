import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { config } from "../../config";

function MyBooking() {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [role, setRole] = useState(null);

    useEffect(() => {
        const token = localStorage.getItem("access_token");
        if (!token) return;

        const fetchData = async () => {
            try {
                // ✅ Get role
                const profileRes = await axios.get(
                    `${config.baseUrl}/accounts/profile/me/`,
                    {
                        headers: { Authorization: `Bearer ${token}` },
                    }
                );
                setRole(profileRes.data.role?.toLowerCase());

                // ✅ Get bookings
                const res = await axios.get(
                    `${config.baseUrl}/bookings/bookings/`,
                    {
                        headers: { Authorization: `Bearer ${token}` },
                    }
                );
                setBookings(res.data.results || []);
            } catch (err) {
                console.error("Failed to load bookings", err);
                setBookings([]);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, []);

    // ✅ Status update
    const handleStatusChange = async (bookingId, status) => {
        const token = localStorage.getItem("access_token");
        try {
            await axios.patch(
                `${config.baseUrl}/bookings/bookings/${bookingId}/`,
                { status },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setBookings((prev) =>
                prev.map((b) =>
                    b.booking_id === bookingId ? { ...b, status } : b
                )
            );
        } catch (err) {
            console.error("Status update failed", err);
            alert("Failed to update status");
        }
    };

    // ✅ Booking delete (customer only)
    const handleDelete = async (bookingId) => {
        if (!window.confirm("Are you sure you want to delete this booking?")) return;
        const token = localStorage.getItem("access_token");
        try {
            await axios.delete(
                `${config.baseUrl}/bookings/bookings/${bookingId}/`,
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setBookings((prev) => prev.filter((b) => b.booking_id !== bookingId));
        } catch (err) {
            console.error("Delete failed", err);
            alert("Failed to delete booking");
        }
    };

    if (loading) return <div className="text-center mt-5">Loading...</div>;
    if (bookings.length === 0) return <div className="container mt-5">No bookings found.</div>;

    const getStatusClass = (status) => {
        switch (status) {
            case "PENDING":
                return "badge bg-warning text-dark";
            case "CONFIRMED":
                return "badge bg-primary";
            case "ONGOING":
                return "badge bg-info text-dark";
            case "COMPLETED":
                return "badge bg-success";
            case "CANCELLED":
                return "badge bg-danger";
            default:
                return "badge bg-secondary";
        }
    };

    return (
        <div className="container my-5">
            <h3 className="mb-4">My Bookings</h3>

            <table className="table table-bordered table-striped align-middle text-center">
                <thead className="table-light">
                    <tr>
                        <th style={{ width: "15%" }}>Booking ID</th>
                        <th style={{ width: "20%" }}>Service</th>
                        <th style={{ width: "10%" }}>Price</th>
                        <th style={{ width: "15%" }}>Date</th>
                        <th style={{ width: "15%" }}>Phone</th>
                        {(role === "nurse" || role === "caregiver") && (
                            <th style={{ width: "10%" }}>Customer</th>
                        )}
                        <th style={{ width: "10%" }}>Status</th>
                        <th style={{ width: "15%" }}>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {bookings.map((b) => (
                        <tr key={b.booking_id}>
                            <td>
                                <Link
                                    to={`/profile/bookings/${b.booking_id}`}
                                    className="text-decoration-none"
                                >
                                    {b.booking_id?.slice(0, 10)}...
                                </Link>
                            </td>
                            <td>
                                {b.service_package?.service_type} – {b.service_package?.duration}
                            </td>
                            <td>৳ {b.service_package?.price}</td>
                            <td>{b.service_date}</td>
                            <td>{b.user_phone}</td>
                            {(role === "nurse" || role === "caregiver") && (
                                <td>{b.user?.full_name || "-"}</td>
                            )}
                            <td>
                                <span className={getStatusClass(b.status)}>{b.status}</span>
                            </td>

                            {/* ✅ Action buttons */}
                            <td>
                                {/* ✅ Nurse / Caregiver actions */}
                                {(role === "nurse" || role === "caregiver") && (
                                    <>
                                        {b.status === "PENDING" && (
                                            <button
                                                className="btn btn-sm btn-success me-1"
                                                onClick={() => handleStatusChange(b.booking_id, "CONFIRMED")}
                                            >
                                                Confirm
                                            </button>
                                        )}
                                        {b.status === "CONFIRMED" && (
                                            <button
                                                className="btn btn-sm btn-info me-1"
                                                onClick={() => handleStatusChange(b.booking_id, "ONGOING")}
                                            >
                                                Start
                                            </button>
                                        )}
                                        {b.status === "ONGOING" && (
                                            <button
                                                className="btn btn-sm btn-primary me-1"
                                                onClick={() => handleStatusChange(b.booking_id, "COMPLETED")}
                                            >
                                                Mark Completed
                                            </button>
                                        )}
                                        {/* ✅ যদি COMPLETED বা অন্য কিছু হয় → শুধু View button */}
                                        {(b.status === "COMPLETED" || b.status === "CANCELLED") && (
                                            <Link
                                                to={`/profile/bookings/${b.booking_id}`}
                                                className="btn btn-sm btn-outline-secondary"
                                            >
                                                View
                                            </Link>
                                        )}
                                    </>
                                )}

                                {/* ✅ Customer actions */}
                                {role === "customer" && (
                                    <>
                                        {b.status === "PENDING" ? (
                                            <button
                                                className="btn btn-sm btn-danger"
                                                onClick={() => handleDelete(b.booking_id)}
                                            >
                                                Delete
                                            </button>
                                        ) : (
                                            <Link
                                                to={`/profile/bookings/${b.booking_id}`}
                                                className="btn btn-sm btn-outline-secondary"
                                            >
                                                View
                                            </Link>
                                        )}
                                    </>
                                )}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

export default MyBooking;
