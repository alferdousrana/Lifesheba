import React, { useEffect, useState } from "react";
import axios from "axios";
import { config } from "../../config";
import { Link } from "react-router-dom";

function MyOrders() {
  const { baseUrl } = config;
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
    try {
      const token = localStorage.getItem("access_token");
      const res = await axios.get(`${baseUrl}/orders/my-orders/`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setOrders(res.data.results || res.data);
    } catch (err) {
      console.error("Failed to load orders", err);
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };
    fetchOrders();
  }, [baseUrl]);

  

  // const handleDelete = async (id) => {
  //   if (!window.confirm("Are you sure you want to delete this order?")) return;
  //   try {
  //     const token = localStorage.getItem("access_token");
  //     await axios.delete(`${baseUrl}/orders/my-orders/${id}/`, {
  //       headers: { Authorization: `Bearer ${token}` },
  //     });
  //     // refresh orders
  //     setOrders((prev) => prev.filter((o) => o.id !== id));
  //   } catch (err) {
  //     console.error("Delete failed:", err.response?.data || err.message);
  //     alert("Failed to delete order.");
  //   }
  // };

  if (loading) return <p>Loading...</p>;

  return (
    <div className="container my-5">
      <h3>📦 My Orders</h3>
      {Array.isArray(orders) && orders.length > 0 ? (
        <table className="table table-bordered align-middle text-center">
          <thead className="table-light">
            <tr>
              <th style={{ width: "18%" }}>Order ID#</th>
              <th style={{ width: "45%" }}>Products</th>
              <th style={{ width: "12%" }}>Total</th>
              <th style={{ width: "10%" }}>Status</th>
              <th style={{ width: "15%" }}>Action</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order.id}>
                <td>
                  <Link to={`/profile/orders/${order.id}`}>
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
                        {item.product.name}  <span style={{color: "#a89e9eff"}}>×{item.quantity}</span>
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
                          : order.status === "DELIVERED"
                            ? "bg-info"
                            : "bg-secondary"
                      }`}
                  >
                    {order.status}
                  </span>
                </td>

                <td>
                  {order.status === "PENDING" ? (
                    <>
                      <Link
                        to={`/profile/orders/${order.id}`}
                        className="btn btn-sm btn-primary me-2"
                      >
                        Pay Now
                      </Link>
                      {/* <button
                        className="btn btn-sm btn-danger"
                        onClick={() => handleDelete(order.id)}
                      >
                        X
                      </button> */}
                    </>
                  ) : (
                    <Link
                      to={`/profile/orders/${order.id}`}
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
        <p>No orders yet.</p>
      )}
    </div>
  );
}

export default MyOrders;
