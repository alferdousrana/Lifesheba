import React, { useEffect, useState } from "react";
import { useSearchParams, Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { config } from "../../config";

function OrderSuccess() {
    const { baseUrl } = config;
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const orderId = searchParams.get("order_id");

    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchOrder = async () => {
            if (!orderId) {
                navigate("/profile/my-orders");
                return;
            }
            try {
                const token = localStorage.getItem("access_token");
                const res = await axios.get(`${baseUrl}/orders/my-orders/${orderId}/`, {
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
    }, [orderId, baseUrl, navigate]);

    if (loading) return <p>Loading...</p>;
    if (!order) return <p>Order not found.</p>;

    return (
        <div className="container my-5 text-center">
            <div className="alert alert-success">
                🎉 Your payment was successful!
            </div>
            <h3>✅ Order Payment Success</h3>
            <p>
                <strong>Order ID:</strong> {order.id}
            </p>
            <p>
                <strong>Status:</strong>{" "}
                <span className="badge bg-success">{order.status}</span>
            </p>
            <p>
                <strong>Total Paid:</strong> {order.total_amount} ৳
            </p>

            <h5 className="mt-4">Products:</h5>
            <ul className="list-group mb-4">
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
                                    width: "50px",
                                    height: "50px",
                                    objectFit: "cover",
                                    borderRadius: "5px",
                                    marginRight: "10px",
                                }}
                            />
                            {item.product.name} × {item.quantity}
                        </div>
                        <span>{item.price * item.quantity} ৳</span>
                    </li>
                ))}
            </ul>

            <div className="d-flex justify-content-center gap-3">
                <Link to="/profile/orders" className="btn btn-outline-primary">
                    Go to My Orders
                </Link>
                <Link to={`/profile/orders/${order.id}`} className="btn btn-primary">
                    View Order Details
                </Link>
            </div>
        </div>
    );
}

export default OrderSuccess;
