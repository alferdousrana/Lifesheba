import React, { useEffect, useState } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { config } from "../../config";

function BookingDetails() {
    const { bookingId } = useParams();
    const navigate = useNavigate();
    const [booking, setBooking] = useState(null);
    const [loading, setLoading] = useState(true);
    const [role, setRole] = useState(null);

    useEffect(() => {
        const token = localStorage.getItem("access_token");
        if (!token) return;

        const fetchBooking = async () => {
            try {
                // ✅ role get
                const profileRes = await axios.get(
                    `${config.baseUrl}/accounts/profile/me/`,
                    {
                        headers: { Authorization: `Bearer ${token}` },
                    }
                );
                setRole(profileRes.data.role?.toLowerCase());

                // ✅ booking get
                const res = await axios.get(
                    `${config.baseUrl}/bookings/bookings/${bookingId}/`,
                    {
                        headers: { Authorization: `Bearer ${token}` },
                    }
                );
                setBooking(res.data);
            } catch (err) {
                console.error("❌ Failed to load booking:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchBooking();
    }, [bookingId]);

    // ✅ handle status update
    const handleStatusChange = async (newStatus) => {
        const token = localStorage.getItem("access_token");
        try {
            const res = await axios.patch(
                `${config.baseUrl}/bookings/bookings/${bookingId}/`,
                { status: newStatus },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setBooking(res.data);
        } catch (err) {
            console.error("❌ Failed to update status:", err);
            alert("Failed to update status");
        }
    };

    // ✅ handle delete (customer only, PENDING status)
    const handleDelete = async () => {
        if (!window.confirm("Are you sure you want to delete this booking?")) return;
        const token = localStorage.getItem("access_token");
        try {
            await axios.delete(
                `${config.baseUrl}/bookings/bookings/${bookingId}/`,
                { headers: { Authorization: `Bearer ${token}` } }
            );
            alert("Booking deleted successfully");
            navigate("/profile/bookings");
        } catch (err) {
            console.error("❌ Failed to delete booking:", err);
            alert("Failed to delete booking");
        }
    };

    if (loading) return <div className="text-center mt-5">Loading...</div>;
    if (!booking) return <div className="container mt-5">Booking not found.</div>;

    return (
        <div className="container my-5">
            <h3 className="mb-4">Booking Details</h3>

            <div className="card shadow p-4">
                <h5><strong>Booking ID:</strong> {booking.booking_id}</h5>
                <p><strong>Service:</strong> {booking.service_package?.service_type} – {booking.service_package?.duration}</p>
                <p><strong>Price:</strong> ৳ {booking.service_package?.price}</p>
                <p><strong>Date:</strong> {booking.service_date}</p>
                <p><strong>Patient Type:</strong> {booking.patient_type}</p>
                <p><strong>Diaper Change:</strong> {booking.diaper_change}</p>
                <p><strong>Phone:</strong> {booking.user_phone}</p>
                <p><strong>Address:</strong> {booking.user_address}</p>
                {booking.other_place && (
                    <p><strong>New Address:</strong> {booking.new_address}</p>
                )}
                <p><strong>Disease:</strong> {booking.disease || "N/A"}</p>
                <p>
                    <strong>Status:</strong>{" "}
                    <span className="badge bg-info text-dark">{booking.status}</span>
                </p>

                {/* ✅ Action buttons */}
                <div className="mt-3">
                    {/* Nurse / Caregiver status flow */}
                    {(role === "nurse" || role === "caregiver") && (
                        <>
                            {booking.status === "PENDING" && (
                                <button
                                    className="btn btn-success me-2"
                                    onClick={() => handleStatusChange("CONFIRMED")}
                                >
                                    Confirm
                                </button>
                            )}
                            {booking.status === "CONFIRMED" && (
                                <button
                                    className="btn btn-info me-2"
                                    onClick={() => handleStatusChange("ONGOING")}
                                >
                                    Start
                                </button>
                            )}
                            {booking.status === "ONGOING" && (
                                <button
                                    className="btn btn-primary me-2"
                                    onClick={() => handleStatusChange("COMPLETED")}
                                >
                                    Mark Completed
                                </button>
                            )}
                        </>
                    )}

                    {/* Customer delete button (only if PENDING) */}
                    {role === "customer" && booking.status === "PENDING" && (
                        <button
                            className="btn btn-danger"
                            onClick={handleDelete}
                        >
                            Delete Booking
                        </button>
                    )}
                </div>
            </div>

            <div className="mt-4">
                <Link to="/profile/bookings" className="btn btn-secondary">
                    Back to My Bookings
                </Link>
            </div>
        </div>
    );
}

export default BookingDetails;
