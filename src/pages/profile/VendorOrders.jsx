import React, { useEffect, useState } from "react";
import axios from "axios";
import { config } from "../../config";
import { Link } from "react-router-dom";

function VendorOrders() {
    const { baseUrl } = config;
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchVendorOrders = async () => {
            try {
                const token = localStorage.getItem("access_token");
                const res = await axios.get(`${baseUrl}/orders/vendor/orders/`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setOrders(res.data.results || res.data);
            } catch (err) {
                console.error("Failed to load vendor orders", err);
                setOrders([]);
            } finally {
                setLoading(false);
            }
        };
        fetchVendorOrders();
    }, [baseUrl]);

    const handleStatusChange = async (id, newStatus) => {
        try {
            const token = localStorage.getItem("access_token");
            await axios.patch(
                `${baseUrl}/orders/vendor/orders/${id}/`,
                { status: newStatus },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            // Update local state
            setOrders((prev) =>
                prev.map((o) => (o.id === id ? { ...o, status: newStatus } : o))
            );
        } catch (err) {
            console.error("Status update failed:", err.response?.data || err.message);
            alert("Failed to update status.");
        }
    };

    if (loading) return <p>Loading...</p>;

    return (
        <div className="container my-5">
            <h3>📦 Vendor Orders</h3>
            {Array.isArray(orders) && orders.length > 0 ? (
                <table className="table table-bordered align-middle text-center">
                    <thead className="table-light">
                        <tr>
                            <th style={{ width: "18%" }}>Order ID#</th>
                            <th style={{ width: "45%" }}>Products</th>
                            <th style={{ width: "12%" }}>Amount</th>
                            <th style={{ width: "10%" }}>Status</th>
                            <th style={{ width: "15%" }}>Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {orders.map((order) => (
                            <tr key={order.id}>
                                <td>
                                    <Link to={`/profile/vendor/orders/${order.id}`}>
                                        {order.id.substring(0, 12)}...
                                    </Link>
                                </td>


                                <td>
                                    {order.items.map((item) => (
                                        <div
                                            key={item.id}
                                            className="d-flex align-items-center mb-2"
                                        >
                                            <img
                                                src={
                                                    item.product.images?.[0]?.image || "/placeholder.png"
                                                }
                                                alt={item.product.name}
                                                style={{
                                                    width: "40px",
                                                    height: "40px",
                                                    objectFit: "cover",
                                                    marginRight: "8px",
                                                    borderRadius: "5px",
                                                }}
                                            />
                                            <div>
                                                {item.product.name} × {item.quantity}
                                            </div>
                                        </div>
                                    ))}
                                </td>

                                <td>{order.total_amount} ৳</td>

                                <td>
                                    <span
                                        className={`badge ${order.status === "PENDING"
                                                ? "bg-warning text-dark"
                                                : order.status === "PAID"
                                                    ? "bg-success"
                                                    : order.status === "SHIPPED"
                                                        ? "bg-primary"
                                                        : order.status === "DELIVERED"
                                                            ? "bg-info"
                                                            : "bg-secondary"
                                            }`}
                                    >
                                        {order.status}
                                    </span>
                                </td>

                                <td>
                                    {order.status === "PAID" ? (
                                        <>
                                            <button
                                                className="btn btn-sm btn-outline-primary me-2"
                                                onClick={() => handleStatusChange(order.id, "SHIPPED")}
                                            >
                                                Mark Shipped
                                            </button>
                                            <button
                                                className="btn btn-sm btn-outline-success"
                                                onClick={() =>
                                                    handleStatusChange(order.id, "DELIVERED")
                                                }
                                            >
                                                Mark Delivered
                                            </button>
                                        </>
                                    ) : order.status === "SHIPPED" ? (
                                        <button
                                            className="btn btn-sm btn-outline-success"
                                            onClick={() =>
                                                handleStatusChange(order.id, "DELIVERED")
                                            }
                                        >
                                            Mark Delivered
                                        </button>
                                    ) : (
                                        <Link
                                            to={`/profile/vendor/orders/${order.id}`}
                                            className="btn btn-sm btn-outline-secondary"
                                        >
                                            View
                                        </Link>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            ) : (
                <p>No vendor orders found.</p>
            )}
        </div>
    );
}

export default VendorOrders;
