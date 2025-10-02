// src/pages/labTest/BookingDetails.jsx
import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import axios from "axios";
import { config } from "../../config";

function BookingDetails() {
    const { id } = useParams(); // uuid from URL
    const { baseUrl } = config;
    const [booking, setBooking] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchBooking = async () => {
            try {
                const token = localStorage.getItem("access_token");
                if (!token) return;

                const res = await axios.get(`${baseUrl}/labtests/bookings/${id}/`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setBooking(res.data);
            } catch (err) {
                console.error("Failed to load booking details", err);
                setBooking(null);
            } finally {
                setLoading(false);
            }
        };
        fetchBooking();
    }, [id, baseUrl]);

    if (loading) return <p>Loading...</p>;
    if (!booking) return <p>Booking not found.</p>;

    return (
        <div className="container my-4">
            <h3>🧾 Booking Details</h3>
            <hr />

            {/* Booking Info */}
            <h5>Booking Info</h5>
            <table className="table table-sm table-bordered">
                <tbody>
                    <tr>
                        <th>ID</th>
                        <td>{booking.uuid}</td>
                    </tr>
                    <tr>
                        <th>Status</th>
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
                    </tr>
                    <tr>
                        <th>Paid</th>
                        <td>{booking.is_paid ? "✅ Yes" : "❌ No"}</td>
                    </tr>
                    <tr>
                        <th>Collection Date</th>
                        <td>{new Date(booking.collection_date).toLocaleString()}</td>
                    </tr>
                    <tr>
                        <th>Total Amount</th>
                        <td style={{ color: "#a4449d" }}>{booking.total_amount} ৳</td>
                    </tr>
                </tbody>
            </table>

            {/* User Info */}
            <h5>User Info</h5>
            <table className="table table-sm table-bordered">
                <tbody>
                    <tr>
                        <th>Name</th>
                        <td>{booking.user?.full_name}</td>
                    </tr>
                    <tr>
                        <th>Email</th>
                        <td>{booking.user?.email}</td>
                    </tr>
                    <tr>
                        <th>Phone</th>
                        <td>{booking.phone}</td>
                    </tr>
                    <tr>
                        <th>Address</th>
                        <td>{booking.address}</td>
                    </tr>
                </tbody>
            </table>

            {/* Lab Info */}
            <h5>Lab Info</h5>
            <table className="table table-sm table-bordered">
                <tbody>
                    <tr>
                        <th>Lab</th>
                        <td>{booking.lab_name}</td>
                    </tr>
                </tbody>
            </table>

            {/* Items */}
            <h5>Booking Items</h5>
            {booking.items && booking.items.length > 0 ? (
                <table className="table table-bordered text-center">
                    <thead className="table-light">
                        <tr>
                            <th>Name</th>
                            <th>Type</th>
                            <th>Sample</th>
                            <th>Price</th>
                            <th>Qty</th>
                            <th>Subtotal</th>
                        </tr>
                    </thead>
                    <tbody>
                        {booking.items.map((item) => (
                            <React.Fragment key={item.id}>
                                <tr>
                                    <td>{item.name}</td>
                                    <td>{item.is_package ? "Package" : "Test"}</td>
                                    <td>{item.sample_type || "-"}</td>
                                    <td>৳ {item.unit_price}</td>
                                    <td>{item.quantity}</td>
                                    <td style={{ color: "#a4449d" }}>
                                        ৳ {item.unit_price * item.quantity}
                                    </td>
                                </tr>

                                {/* ✅ যদি package হয় তাহলে এর টেস্টগুলো table আকারে দেখাবে */}
                                {item.is_package && item.package_tests?.length > 0 && (
                                    <tr>
                                        <td colSpan="6" className="bg-light text-start">
                                            <b>Included Tests:</b>
                                            <table className="table table-sm table-bordered mt-2 mb-0">
                                                <thead className="table-light">
                                                    <tr>
                                                        <th>Name</th>
                                                        <th>Price</th>
                                                        <th>Sample Type</th>
                                                    </tr>
                                                </thead>
                                                <tbody>
                                                    {item.package_tests.map((t, idx) => (
                                                        <tr key={idx}>
                                                            <td>{t.name}</td>
                                                            <td>৳ {t.price}</td>
                                                            <td>{t.sample_type || "N/A"}</td>
                                                        </tr>
                                                    ))}
                                                </tbody>
                                            </table>
                                        </td>
                                    </tr>
                                )}
                            </React.Fragment>
                        ))}
                    </tbody>
                </table>
            ) : (
                <p>No items found.</p>
            )}

            <div className="mt-3">
                <Link to="/profile/test-bookings" className="btn btn-secondary">
                    ← Back to My Bookings
                </Link>
            </div>
        </div>
    );
}

export default BookingDetails;
