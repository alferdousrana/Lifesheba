import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { CartContext } from '../../contexts/CartContext';
import { config } from '../../config';

function Cart() {
    const { cartItems, updateQuantity, removeFromCart } = useContext(CartContext);
    const navigate = useNavigate();
    const totalItems = (cartItems || []).reduce((acc, item) => acc + item.quantity, 0);
    const { baseUrl } = config;

    const totalPrice = cartItems.reduce((acc, item) => {
        const price = item.discount_price ? item.discount_price : item.price;
        return acc + price * item.quantity;
    }, 0);

    return (
        <div className="container my-5">
            <h3 className="mb-4">🛒 My Cart ({totalItems}) </h3>
            {cartItems.length === 0 ? (
                <div className="text-start">
                    <p>Your cart is empty.</p>
                    <button
                        className="btn btn-primary mt-2"
                        onClick={() => navigate('/shop')}
                    >
                        Start Shopping
                    </button>
                </div>
            ) : (
                <>
                    {cartItems.map(item => (
                        <div
                            key={item.id}
                            className="d-flex justify-content-between align-items-center mb-3 p-2 shadow-sm"
                            style={{
                                backgroundColor: "#e4f6faff",
                                borderRadius: "8px",
                                minHeight: "100px" // সব row একই height
                            }}
                        >
                            {/* Left side: image + product info */}
                            <div className="d-flex align-items-center flex-grow-1">
                                <img
                                    src={item.images[0].image.startsWith('http') ? item.images[0].image : `${baseUrl.replace("/api", "")}/${item.images[0].image}`}
                                    alt={item.name}
                                    style={{
                                        width: "80px",
                                        height: "80px",
                                        objectFit: "cover",
                                        marginRight: "10px",
                                        borderRadius: "5px",
                                        backgroundColor: "#fff"
                                    }}
                                />
                                <div style={{ flex: 1 }}>
                                    <h6 className="mb-1">{item.name}</h6>
                                    <p className="mb-0 text-danger fw-bold" style={{ fontSize: "14px" }}>
                                        {item.discount_price ? item.discount_price : item.price} ৳ x {item.quantity}
                                    </p>
                                    <p style={{ color: "#1694a2ff", fontSize: "18px", fontWeight: "bold" }}>
                                        {(item.discount_price || item.price) * item.quantity} ৳
                                    </p>
                                </div>
                            </div>

                            {/* Middle: quantity controls */}
                            <div className="d-flex align-items-center mx-5">
                                <button
                                    className="btn btn-sm btn-secondary me-2"
                                    onClick={() => updateQuantity(item.id, "decrease")}
                                >
                                    -
                                </button>
                                <span>{item.quantity}</span>
                                <button
                                    className="btn btn-sm btn-secondary ms-2"
                                    onClick={() => updateQuantity(item.id, "increase")}
                                >
                                    +
                                </button>
                            </div>

                            {/* Right: remove button */}
                            <button
                                className="btn btn-sm btn-danger mx-3"
                                onClick={() => removeFromCart(item.id)}
                            >
                                Remove
                            </button>
                        </div>

                    ))}

                    <div className="text-start mt-4">
                        <button
                            className="btn btn-primary mt-2"
                            onClick={() => navigate('/shop')}
                        >
                            More Shopping
                        </button>
                    </div>
                    <div className="text-end mt-4">
                        <h5>
                            Total: <span className="text-danger">{totalPrice.toFixed(2)} ৳</span>
                        </h5>
                        <button
                            className="btn btn-success mt-2"
                            onClick={() => navigate('/checkout')}
                        >
                            Proceed to Checkout
                        </button>
                    </div>
                </>
            )}
        </div>
    );
}

export default Cart;