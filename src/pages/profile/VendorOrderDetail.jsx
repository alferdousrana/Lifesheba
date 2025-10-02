import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { config } from "../../config";

function VendorOrderDetail() {
    const { baseUrl } = config;
    const { id } = useParams();
    const navigate = useNavigate();

    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchOrder = async () => {
            try {
                const token = localStorage.getItem("access_token");
                const res = await axios.get(`${baseUrl}/orders/vendor/orders/${id}/`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setOrder(res.data);
            } catch (err) {
                console.error("Failed to load vendor order", err);
                alert("Failed to load order.");
            } finally {
                setLoading(false);
            }
        };
        fetchOrder();
    }, [baseUrl, id]);

    const handleStatusChange = async (newStatus) => {
        try {
            const token = localStorage.getItem("access_token");
            await axios.patch(
                `${baseUrl}/orders/vendor/orders/${id}/`,
                { status: newStatus },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setOrder((prev) => ({ ...prev, status: newStatus }));
        } catch (err) {
            console.error("Status update failed:", err.response?.data || err.message);
            alert("Failed to update status.");
        }
    };

    if (loading) return <p>Loading...</p>;
    if (!order) return <p>Order not found.</p>;

    return (
        <div className="container my-5">
            <h3>📦 Vendor Order Detail</h3>
            <p><strong>Order ID:</strong> {order.id}</p>

            <h5>👤 Customer Info</h5>
            <ul>
                <li><strong>Name:</strong> {order.user?.full_name || order.user?.username}</li>
                <li><strong>Email:</strong> {order.user?.email}</li>
                <li><strong>Mobile:</strong> {order.user?.phone}</li>
                <li><strong>Shipping Address:</strong> {order.shipping_address}</li>
                <li><strong>City:</strong> {order.user?.city}</li>
            </ul>


            <p><strong>Total:</strong> <strong className="text-danger fs-5">{order.total_amount} ৳</strong>  </p>
            <p>
                <strong>Status:</strong>{" "}
                <span className={`badge ${order.status === "PENDING"
                    ? "bg-warning text-dark"
                    : order.status === "PAID"
                        ? "bg-success"
                        : order.status === "SHIPPED"
                            ? "bg-primary"
                            : order.status === "DELIVERED"
                                ? "bg-info"
                                : "bg-secondary"
                    }`}>
                    {order.status}
                </span>
            </p>


            <h5>Products</h5>
            <ul className="list-group mb-3">
                {order.items.map((item) => (
                    <li
                        key={item.id}
                        className="list-group-item d-flex align-items-center justify-content-between"
                    >
                        <div className="d-flex align-items-center">
                            <img
                                src={item.product.images?.[0]?.image || "/placeholder.png"}
                                alt={item.product.name}
                                style={{
                                    width: "40px",
                                    height: "40px",
                                    objectFit: "cover",
                                    marginRight: "10px",
                                    borderRadius: "5px",
                                }}
                            />
                            {item.product.name} × {item.quantity}
                        </div>
                        <span>{item.price} ৳</span>
                    </li>
                ))}
            </ul>

            <div className="mt-3">
                {order.status === "PAID" && (
                    <>
                        <button
                            className="btn btn-outline-primary me-2"
                            onClick={() => handleStatusChange("SHIPPED")}
                        >
                            Mark Shipped
                        </button>
                        <button
                            className="btn btn-outline-success"
                            onClick={() => handleStatusChange("DELIVERED")}
                        >
                            Mark Delivered
                        </button>
                    </>
                )}

                {order.status === "SHIPPED" && (
                    <button
                        className="btn btn-outline-success"
                        onClick={() => handleStatusChange("DELIVERED")}
                    >
                        Mark Delivered
                    </button>
                )}

                <button
                    className="btn btn-secondary ms-2"
                    onClick={() => navigate(-1)}
                >
                    Back
                </button>
            </div>
        </div>
    );
}

export default VendorOrderDetail;
