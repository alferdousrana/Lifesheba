// src/contexts/CartContext.jsx
import React, { createContext, useEffect, useState } from 'react';

export const CartContext = createContext();

export const CartProvider = ({ children }) => {
    const [cartItems, setCartItems] = useState([]);
    const [cartCount, setCartCount] = useState(0);

    useEffect(() => {
        const cart = JSON.parse(localStorage.getItem("cart")) || [];
        setCartItems(cart);
        setCartCount(cart.reduce((acc, item) => acc + item.quantity, 0));
    }, []);

    const addToCart = (product, quantity = 1) => {
        const cart = [...cartItems];
        const existing = cart.find(item => item.id === product.id);

        if (existing) {
            existing.quantity += quantity;
        } else {
            cart.push({ ...product, quantity });
        }

        setCartItems(cart);
        localStorage.setItem("cart", JSON.stringify(cart));
        setCartCount(cart.reduce((acc, item) => acc + item.quantity, 0));
    };

    const removeFromCart = (productId) => {
        const updatedCart = cartItems.filter(item => item.id !== productId);
        setCartItems(updatedCart);
        localStorage.setItem("cart", JSON.stringify(updatedCart));
        setCartCount(updatedCart.reduce((acc, item) => acc + item.quantity, 0));
    };

    const updateQuantity = (productId, action) => {
        const updatedCart = cartItems.map(item => {
            if (item.id === productId) {
                if (action === 'increase') item.quantity += 1;
                if (action === 'decrease' && item.quantity > 1) item.quantity -= 1;
            }
            return item;
        });
        setCartItems(updatedCart);
        localStorage.setItem("cart", JSON.stringify(updatedCart));
        setCartCount(updatedCart.reduce((acc, item) => acc + item.quantity, 0));
    };

    // ✅ clearCart function যোগ করা হলো
    const clearCart = () => {
        setCartItems([]);
        setCartCount(0);
        localStorage.removeItem("cart");
    };

    return (
        <CartContext.Provider value={{
            cartItems,
            cartCount,
            addToCart,
            removeFromCart,
            updateQuantity,
            clearCart  // 👉 এখন Checkout.jsx থেকে এটা ব্যবহার করতে পারবে
        }}>
            {children}
        </CartContext.Provider>
    );
};
