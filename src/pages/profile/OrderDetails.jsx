import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { config } from "../../config";

function OrderDetails() {
    const { id } = useParams();
    const { baseUrl } = config;
    const navigate = useNavigate();
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchOrder = async () => {
            try {
                const token = localStorage.getItem("access_token");
                const res = await axios.get(`${baseUrl}/orders/my-orders/${id}/`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setOrder(res.data);
            } catch (err) {
                console.error("Failed to load order", err);
            } finally {
                setLoading(false);
            }
        };
        fetchOrder();
    }, [id, baseUrl]);

    const handleDelete = async () => {
        if (!window.confirm("Are you sure you want to delete this order?")) return;
        try {
            const token = localStorage.getItem("access_token");
            await axios.delete(`${baseUrl}/orders/my-orders/${id}/`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            alert("Order deleted successfully");
            navigate("/profile/my-orders");
        } catch (err) {
            console.error("Delete failed:", err.response?.data || err.message);
            alert("Failed to delete order.");
        }
    };
    const handlePayment = async () => {
        try {
            const token = localStorage.getItem("access_token");
            const payId = order.payments[0]?.id;
            if (!payId) return alert("No payment found");

            const res = await axios.post(
                `${baseUrl}/payments/${payId}/start_sslcommerz/`,
                {},
                { headers: { Authorization: `Bearer ${token}` } }
            );

            if (res.data.redirect_url) {
                window.location.href = res.data.redirect_url;
            }
        } catch (err) {
            console.error("Payment start failed", err);
            alert("Failed to start payment.");
        }
    };


    if (loading) return <p>Loading...</p>;
    if (!order) return <p>Order not found.</p>;

    return (
        <div className="container my-5">
            {/* Status */}
            <h3 className="mb-3">
                Order Details{" "}
                <span
                    className={`badge ${order.status === "PENDING"
                            ? "bg-warning text-dark"
                            : order.status === "PAID"
                                ? "bg-success"
                                : order.status === "DELIVERED"
                                    ? "bg-info"
                                    : "bg-secondary"
                        }`}
                >
                    {order.status}
                </span>
            </h3>

            {/* Tracking Progress Line */}
            <div className="mb-5 position-relative">
                {/* Gray Base Line */}
                <div
                    className="position-absolute top-50 start-0 w-100"
                    style={{
                        height: "6px",
                        backgroundColor: "#e0e0e0",
                        zIndex: 1,
                    }}
                ></div>

                {/* Blue Progress Line */}
                <div
                    className="position-absolute top-50 start-0"
                    style={{
                        height: "6px",
                        width: `${((["PENDING", "PAID", "SHIPPED", "DELIVERED"].indexOf(order.status) + 1) *
                                2 *
                                100) / 8
                            }%`,
                        backgroundColor: "#0d6efd",
                        zIndex: 2,
                        transition: "width 0.5s ease-in-out",
                    }}
                ></div>

                {/* Left Circle (Start) */}
                <div
                    className="position-absolute top-50 translate-middle-y"
                    style={{
                        left: "-12px",
                        zIndex: 3,
                        width: "25px",
                        height: "25px",
                        borderRadius: "50%",
                        backgroundColor: "#0d6efd",
                    }}
                ></div>

                {/* Right Arrow (End) */}
                <div
                    className="position-absolute top-50 translate-middle-y"
                    style={{
                        right: "-20px",
                        zIndex: 3,
                        fontSize: "48px",
                        color: "#0d6efd",
                    }}
                >
                    ➔
                </div>

                {/* Steps */}
                <div className="d-flex justify-content-between align-items-center position-relative">
                    {["PENDING", "PAID", "SHIPPED", "DELIVERED"].map((step, index, arr) => {
                        const stepIndex = arr.indexOf(order.status);
                        const isActive = index <= stepIndex;

                        return (
                            <div
                                key={step}
                                className="d-flex flex-column align-items-center"
                                style={{ zIndex: 3, flex: 1 }}
                            >
                                {/* Step Circle */}
                                <div
                                    className={`rounded-circle d-flex justify-content-center align-items-center ${isActive ? "bg-primary text-white" : "bg-light text-muted"
                                        }`}
                                    style={{
                                        width: "36px",
                                        height: "36px",
                                        border: "2px solid",
                                        borderColor: isActive ? "#0d6efd" : "#ccc",
                                        fontSize: "14px",
                                        fontWeight: "bold",
                                    }}
                                >
                                    {index + 1}
                                </div>
                                {/* Label */}
                                <small
                                    className={`mt-2 ${isActive ? "text-primary fw-bold" : "text-muted"
                                        }`}
                                >
                                    {step}
                                </small>
                            </div>
                        );
                    })}
                </div>
            </div>




            {/* Items Table */}
            <h5>Products</h5>
            <table className="table table-bordered align-middle text-center">
                <thead className="table-light">
                    <tr>
                        <th style={{ width: "15%" }}>Image</th>
                        <th style={{ width: "40%" }}>Product</th>
                        <th style={{ width: "15%" }}>Quantity</th>
                        <th style={{ width: "15%" }}>Price</th>
                        <th style={{ width: "15%" }}>Total</th>
                    </tr>
                </thead>
                <tbody>
                    {order.items.map((item) => (
                        <tr key={item.id}>
                            <td>
                                <img
                                    src={item.product.images?.[0]?.image || "/placeholder.png"}
                                    alt={item.product.name}
                                    style={{
                                        width: "60px",
                                        height: "60px",
                                        objectFit: "cover",
                                        borderRadius: "5px",
                                    }}
                                />
                            </td>
                            <td>{item.product.name}</td>
                            <td>{item.quantity}</td>
                            <td>{item.price} ৳</td>
                            <td>{item.price * item.quantity} ৳</td>
                        </tr>
                    ))}
                </tbody>
            </table>

            <hr />

            {/* Common Info */}
            <h5>Order Information</h5>
            <table className="table table-striped">
                <tbody>
                    <tr>
                        <th style={{ width: "25%" }}>Order ID</th>
                        <td>{order.id}</td>
                    </tr>
                    <tr>
                        <th>Total Amount</th>
                        <td>{order.total_amount} ৳</td>
                    </tr>
                    <tr>
                        <th>Shipping Address</th>
                        <td>{order.shipping_address}</td>
                    </tr>
                    <tr>
                        <th>Phone</th>
                        <td>{order.phone_number}</td>
                    </tr>
                    <tr>
                        <th>Created At</th>
                        <td>{new Date(order.created_at).toLocaleString()}</td>
                    </tr>
                </tbody>
            </table>

            {/* Payment Info */}
            <h5 className="mt-4">Payment</h5>
            {order.payments.length > 0 ? (
                <table className="table table-bordered">
                    <thead className="table-light">
                        <tr>
                            <th>Payment ID</th>
                            <th>Status</th>
                            <th>Amount</th>
                            <th>Method</th>
                        </tr>
                    </thead>
                    <tbody>
                        {order.payments.map((pay) => (
                            <tr key={pay.id}>
                                <td>{pay.id}</td>
                                <td>{pay.status}</td>
                                <td>{pay.amount} ৳</td>
                                <td>{pay.method || "N/A"}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            ) : (
                <p>No payment yet.</p>
            )}

            <hr />

            {/* Actions */}
            <div className="d-flex gap-2">
                {order.status === "PENDING" && (
                    <button className="btn btn-danger" onClick={handleDelete}>
                        Delete Order
                    </button>
                )}

                {order.status === "PENDING" && order.payments.length > 0 && (
                    <button className="btn btn-primary" onClick={handlePayment}>
                        Pay Now
                    </button>
                )}

            </div>
        </div>
    );
}

export default OrderDetails;
