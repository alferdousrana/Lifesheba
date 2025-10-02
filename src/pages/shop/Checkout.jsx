import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { CartContext } from "../../contexts/CartContext";
import { config } from "../../config";
import TextInput from "../profile/components/TextInput";

function Checkout() {
    const { cartItems, clearCart } = useContext(CartContext);
    const { baseUrl } = config;
    const navigate = useNavigate();

    const [loading, setLoading] = useState(false);

    // form fields
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [address, setAddress] = useState("");

    // ✅ Fetch profile info on mount
    useEffect(() => {
        const token = localStorage.getItem("access_token");
        if (!token) {
            navigate("/login");
            return;
        }

        const fetchProfiles = async () => {
            try {
                // Common profile
                const res = await axios.get(`${baseUrl}/accounts/profile/me/`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setName(res.data.full_name || "");
                setEmail(res.data.email || "");
                setPhone(res.data.phone || "");

                // Customer profile
                const customerRes = await axios.get(`${baseUrl}/customers/profile/`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setAddress(customerRes.data.address || "");
            } catch (err) {
                console.error("Profile fetch error:", err);
            }
        };

        fetchProfiles();
    }, [baseUrl, navigate]);

    // 🧮 Subtotal
    const subtotal = cartItems.reduce((acc, item) => {
        const price = item.discount_price || item.price;
        return acc + price * item.quantity;
    }, 0);

    // 🧮 Shipping cost
    const shipping = address?.toLowerCase().includes("dhaka") ? 50 : 80;

    // 🧮 Final total
    const grandTotal = subtotal + shipping;

    // 🚀 Handle checkout
    const handleCheckout = async () => {
        if (cartItems.length === 0) {
            alert("Cart is empty!");
            return;
        }
        if (!name || !phone || !address) {
            alert("Please fill all required fields");
            return;
        }

        try {
            setLoading(true);
            const token = localStorage.getItem("access_token");

            const payload = {
                shipping_address: address,
                phone_number: phone,
                items: cartItems.map((item) => ({
                    product_id: item.id,
                    quantity: item.quantity,
                })),
            };

            await axios.post(`${baseUrl}/orders/checkout/`, payload, {
                headers: { Authorization: `Bearer ${token}` },
            });

            // ✅ Clear cart & redirect
            clearCart();
            navigate("/profile/orders");
        } catch (err) {
            console.error("Checkout error:", err.response?.data || err.message);
            alert("Checkout failed! Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container my-5">
            <h3>Checkout</h3>
            <div className="row">
                {/* Left Side - User Info */}
                <div className="col-md-6">
                    <div>
                       
                        <TextInput
                            label="Full Name"
                            type="text"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            icon = {"user"}
                            col={12}
                        />
                    </div>
                    <div className="mb-3">
                        
                        <TextInput 
                            type="email" 
                            value={email} 
                            disabled 
                            label="Email" 
                            col = {12}
                            icon="email"
                        />
                    </div>
                    <div className="mb-3">
                        <TextInput
                            label="Phone Number"
                            type="text"
                            col ={12}
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            icon={"phone"}
                        />
                    </div>
                    <div className="mb-3">
                        <TextInput
                            label={"Address"}
                            value={address}
                            onChange={(e) => setAddress(e.target.value)}
                            icon={'address'}
                            col={12}
                            multiline={true}
                            rows={3}

                        />
                    </div>

                    
                </div>

                {/* Right Side - Cart Summary */}
                <div className="col-md-6">
                    <h5>Your Order</h5>
                    {cartItems.map((item) => (
                        <div key={item.id} className="d-flex justify-content-between mb-2">
                            <span>
                                {item.name} x {item.quantity}
                            </span>
                            <span>
                                {(item.discount_price || item.price) * item.quantity} ৳
                            </span>
                        </div>
                    ))}
                    <hr />
                    <div className="d-flex justify-content-between">
                        <strong>Subtotal</strong>
                        <span>{subtotal.toFixed(2)} ৳</span>
                    </div>
                    <div className="d-flex justify-content-between">
                        <strong>Shipping</strong>
                        <span>{shipping} ৳</span>
                    </div>
                    <hr />
                    <div className="d-flex justify-content-between">
                        <h5>Total:</h5>
                        <h5 className="text-danger">{grandTotal.toFixed(2)} ৳</h5>
                    </div>
                </div>
                <button
                    className="btn btn-success mt-4"
                    onClick={handleCheckout}
                    disabled={loading}
                >
                    {loading ? "Processing..." : "Place Order"}
                </button>
            </div>
        </div>
    );
}

export default Checkout;
