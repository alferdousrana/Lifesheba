import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { config } from '../../config';
import HoverZoom from "../components/HoverZoom";


function HomeMedicine() {
    const { baseUrl } = config;
    const [products, setProducts] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        axios.get(`${baseUrl}/products/shop/products/`)
            .then(res => {
                const prescriptionProducts = res.data["Prescription Medicine"] || [];
                setProducts(prescriptionProducts);
            })
            .catch(err => console.error("Failed to fetch prescription medicine:", err));
    }, [baseUrl]);

    // 👉 Infinite loop এর জন্য data duplicate
    const repeatedProducts = [...products, ...products];

    return (
        <div className="container my-5">
                <div className="d-flex justify-content-between align-items-center mb-4">
                    <h3 className="mb-0">Medicines</h3>
                    <span
                        onClick={() => navigate("/shop")}
                        style={{ cursor: "pointer", color: "#08ABBD", fontWeight: "500" }}
                    >
                        See All →
                    </span>
                </div>
            <div className="scroll-container">
                <div className="scroll-content">
                    {repeatedProducts.map((product, index) => {
                        const discountPercentage = product.discount_price
                            ? Math.round(((product.price - product.discount_price) / product.price) * 100)
                            : 0;
                        return (
                            <div
                                key={index}
                                className="card shadow-sm hover-parent"
                                onClick={() => navigate(`/product/${product.slug}`)}
                                style={{
                                    minWidth: '200px',
                                    maxWidth: '200px',
                                    flexShrink: 0,
                                    cursor: 'pointer',
                                    borderRadius: '12px',
                                    backgroundColor: '#f9f9f9',
                                    position: 'relative',
                                    margin: '0 10px',
                                    overflow: 'hidden',
                                }}
                            >
                                {discountPercentage > 0 && (
                                    <span
                                        style={{
                                            position: 'absolute',
                                            top: '5px',
                                            left: '5px',
                                            backgroundColor: '#ff4d4f',
                                            color: '#fff',
                                            padding: '2px 8px',
                                            fontSize: '12px',
                                            borderRadius: '5px',
                                            fontWeight: 'bold',
                                            zIndex: 3
                                        }}
                                    >
                                        {discountPercentage}% Off
                                    </span>
                                )}
                                {product.images?.[0]?.image && (
                                    <HoverZoom scale={1.1} triggerParentHover={true}>
                                    <img
                                            src={`${baseUrl.replace("/api", "")}/${product.images[0].image}`}
                                        alt={product.name}
                                        className="card-img-top"
                                        style={{
                                            height: '150px',
                                            objectFit: 'cover',
                                            borderTopLeftRadius: '12px',
                                            borderTopRightRadius: '12px',
                                        }}
                                    />
                                    </HoverZoom>
                                )}
                                <div className="card-body">
                                    <h6 className="card-title">{product.name}</h6>
                                    <p style={{ fontSize: '13px', color: '#555' }}>{product.description}</p>
                                    <div className="d-flex align-items-center">
                                        <p className="fw-bold mb-0 me-2" style={{ color: '#A4449D' }}>
                                            {product.discount_price ? `${product.discount_price} ৳` : `${product.price} ৳`}
                                        </p>
                                        {product.discount_price && (
                                            <p className="text-muted mb-0">
                                                <span style={{ textDecoration: 'line-through', fontSize: '13px', color: '#ff4d4f' }}>
                                                    {product.price} ৳
                                                </span>
                                            </p>
                                        )}
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Infinite scroll animation */}
            <style>
                {`
                    .scroll-container {
                        overflow: hidden;
                        position: relative;
                        width: 100%;
                    }

                    .scroll-content {
                        display: flex;
                        width: max-content;
                        animation: scroll-left 30s linear infinite;
                    }

                    @keyframes scroll-left {
                        0% { transform: translateX(0); }
                        100% { transform: translateX(-50%); }
                    }

                    .scroll-content:hover {
                        animation-play-state: paused; /* hover করলে stop হবে */
                    }
                `}
            </style>
        </div>
    );
}

export default HomeMedicine;
