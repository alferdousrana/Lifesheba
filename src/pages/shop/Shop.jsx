import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { config } from '../../config';
import { useNavigate } from "react-router-dom";
import { FaArrowRight } from "react-icons/fa";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faPaperPlane } from '@fortawesome/free-solid-svg-icons';
import { CartContext } from '../../contexts/CartContext';
import prescription_upload from '../../assets/images/prescription_upload.png';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

function Shop() {
    const { baseUrl } = config;
    const [data, setData] = useState({});
    const [categories, setCategories] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [displayedCategories, setDisplayedCategories] = useState([]);
    const { addToCart } = useContext(CartContext);
    const navigate = useNavigate();

    const [banners, setBanners] = useState([]);

    useEffect(() => {
        axios.get(`${baseUrl}/banners/product-banners/`)
            .then(res => {
                setBanners(res.data.results);
            })
            .catch(err => console.error("Banner fetch error:", err));
    }, [baseUrl]);

    useEffect(() => {
        axios.get(`${baseUrl}/products/displayed-categories/`)
            .then(response => {
                const categoryNames = response.data.results.map(item => item.category.name);
                setDisplayedCategories(categoryNames);
            })
            .catch(error => {
                console.error("Error fetching displayed categories:", error);
            });
    }, [baseUrl]);

    useEffect(() => {
        axios.get(`${baseUrl}/products/shop/products/`)
            .then(res => {
                setData(res.data);
                setCategories(Object.keys(res.data));
            })
            .catch(err => {
                console.error('Failed to fetch products:', err);
            });
    }, [baseUrl]);

    const filteredData = (products) => {
        if (!products) return [];
        return products.filter(product =>
            (product?.name || '').toLowerCase().includes(searchTerm.toLowerCase())
        );
    };

    const goToCategoryProducts = (category) => {
        navigate(`/category-products/${encodeURIComponent(category)}`);
    };

    return (
        <div className="mx-4 my-5">
            <div className="row">
                {/* Sidebar */}
                <div className="col-md-2">
                    <h5 className="mb-3">Categories</h5>
                    <ul className="list-group">
                        {categories.map(cat => (
                            <li
                                className="list-group-item"
                                key={cat}
                                style={{ cursor: "pointer" }}
                                onClick={() => navigate(`/category-products/${encodeURIComponent(cat)}`)}
                            >
                                {cat}
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Main content */}
                <div className="col-md-10">
                    {/* Search Bar */}
                    <div className='row mb-4'>
                        <div className="col-md-10">
                            <div className="input-group position-relative">
                                <input
                                    type="text"
                                    className="form-control"
                                    placeholder="Search products..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    style={{
                                        paddingLeft: '45px',
                                        paddingRight: '45px',
                                        borderLeft: '1px solid #FDD4FA',
                                        borderRadius: '20px',
                                    }}
                                />

                                {/* Left Icon */}
                                {!searchTerm && (
                                    <span
                                        style={{
                                            position: 'absolute',
                                            left: '15px',
                                            top: '50%',
                                            transform: 'translateY(-50%)',
                                            color: '#33B1BF',
                                        }}
                                    >
                                        <FontAwesomeIcon icon={faSearch} />
                                    </span>
                                )}

                                {/* Right Icon (Cross / Send) */}
                                <button
                                    type="button"
                                    style={{
                                        background: "none",
                                        border: "none",
                                        position: "absolute",
                                        right: "10px",
                                        top: "50%",
                                        transform: "translateY(-50%)",
                                        cursor: "pointer",
                                        color: "#33B1BF"
                                    }}
                                    onMouseDown={(e) => {
                                        e.preventDefault();
                                        setSearchTerm('');
                                    }}
                                >
                                    {searchTerm ? '✖' : <FontAwesomeIcon icon={faPaperPlane} />}
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Search Results */}
                    {searchTerm && (
                        <div
                            className="p-4 mb-4"
                            style={{
                                backgroundColor: '#f9f9f9',
                                border: '1px solid #ddd',
                                borderRadius: '8px'
                            }}
                        >
                            <h5 className="mb-3">Search Results:</h5>
                            <div className="d-flex flex-wrap" style={{ gap: "10px" }}>
                                {categories.some(cat => filteredData(data[cat]).length > 0) ? (
                                    categories.map(cat =>
                                        filteredData(data[cat]).map((product, i) => (
                                            <div
                                                key={i}
                                                className="card shadow-sm"
                                                style={{
                                                    flex: "0 0 23%", // 4 cards per row
                                                    borderRadius: "12px",
                                                    overflow: "hidden",
                                                    border: "1px solid #eee",
                                                    transition: "transform 0.2s ease, box-shadow 0.2s ease",
                                                    cursor: "pointer",
                                                    position: "relative"
                                                }}
                                                onClick={() => navigate(`/product/${product.slug}`)}
                                                onMouseEnter={(e) => {
                                                    e.currentTarget.style.transform = "translateY(-5px)";
                                                    e.currentTarget.style.boxShadow = "0 6px 16px rgba(0,0,0,0.15)";
                                                }}
                                                onMouseLeave={(e) => {
                                                    e.currentTarget.style.transform = "translateY(0)";
                                                    e.currentTarget.style.boxShadow = "0 2px 8px rgba(0,0,0,0.1)";
                                                }}
                                            >
                                                {/* Out of Stock Badge */}
                                                {(product.stock === 0 || !product.is_available) && (
                                                    <span
                                                        style={{
                                                            position: "absolute",
                                                            top: "10px",
                                                            right: "10px",
                                                            backgroundColor: "rgba(0,0,0,0.7)",
                                                            color: "#fff",
                                                            padding: "5px 10px",
                                                            borderRadius: "5px",
                                                            fontSize: "12px",
                                                            fontWeight: "bold"
                                                        }}
                                                    >
                                                        Out of Stock
                                                    </span>
                                                )}

                                                {/* Image */}
                                                {product.images?.[0]?.image && (
                                                    <img
                                                        src={`${baseUrl.replace("/api", "")}/${product.images[0].image}`}
                                                        alt={product.name}
                                                        style={{
                                                            width: "100%",
                                                            height: "160px",
                                                            objectFit: "cover",
                                                            backgroundColor: "#fff",
                                                        }}
                                                    />
                                                )}

                                                {/* Body */}
                                                <div className="p-3 d-flex flex-column" style={{ minHeight: "150px" }}>
                                                    <h6 className="fw-bold mb-1" style={{ color: "#333" }}>
                                                        {product.name}
                                                    </h6>
                                                    <p className="text-muted mb-2" style={{ fontSize: "13px" }}>
                                                        {product.description?.slice(0, 40)}...
                                                    </p>

                                                    {/* Price */}
                                                    <div className="d-flex align-items-center mb-2">
                                                        {product.discount_price && (
                                                            <span
                                                                className="fw-bold me-2"
                                                                style={{ fontSize: "16px", color: "#A4449D" }}
                                                            >
                                                                {product.discount_price} ৳
                                                            </span>
                                                        )}
                                                        <span
                                                            style={{
                                                                textDecoration: product.discount_price ? "line-through" : "none",
                                                                color: product.discount_price ? "#ff4d4f" : "#555",
                                                                fontSize: "14px",
                                                            }}
                                                        >
                                                            {product.price} ৳
                                                        </span>
                                                    </div>

                                                    {/* Button */}
                                                    <button
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            addToCart(product);
                                                        }}
                                                        className="btn mt-auto"
                                                        disabled={product.stock === 0 || !product.is_available}
                                                        style={{
                                                            backgroundColor: product.stock === 0 || !product.is_available ? "#ccc" : "#33B1BF",
                                                            color: "#fff",
                                                            borderRadius: "6px",
                                                            fontWeight: "600",
                                                            padding: "8px 0",
                                                            cursor: product.stock === 0 || !product.is_available ? "not-allowed" : "pointer"
                                                        }}
                                                    >
                                                        {product.stock === 0 || !product.is_available ? "Out of Stock" : "Add to cart"}
                                                    </button>
                                                </div>
                                            </div>
                                        ))
                                    )
                                ) : (
                                    <p className="text-danger fw-bold">No products found</p>
                                )}
                            </div>
                        </div>
                    )}

                    {/* Banner */}
                    {banners.length > 0 && (
                        <div id="shopBannerCarousel" className="carousel slide mb-3" data-bs-ride="carousel">
                            <div className="carousel-inner">
                                {banners.map((banner, index) => (
                                    <div key={index} className={`carousel-item ${index === 0 ? 'active' : ''}`}>
                                        <img
                                            src={banner.image}
                                            className="d-block w-100 rounded shadow"
                                            alt={banner.title || `Banner ${index}`}
                                            style={{ maxHeight: '200px', objectFit: 'cover' }}
                                        />
                                        <div className="carousel-caption d-none d-md-block text-start bg-dark bg-opacity-50 p-3 rounded">
                                            <h5>{banner.title}</h5>
                                            {banner.subtitle && <p>{banner.subtitle}</p>}
                                            {banner.link && (
                                                <a
                                                    href={banner.link}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="btn btn-light btn-sm"
                                                >
                                                    Order Now
                                                </a>
                                            )}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Prescription Upload Section */}
                    <div
                        className="p-3 mb-4"
                        style={{
                            backgroundColor: '#e6f0fa',
                            borderRadius: '8px',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
                        }}
                    >
                        <div style={{ display: 'flex', alignItems: 'center' }}>
                            <div style={{ marginRight: '15px' }}>
                                <img src={prescription_upload} alt="prescription upload" style={{ width: '80px', height: '80px', objectFit: 'cover' }} />
                            </div>
                            <div>
                                <h4 style={{ color: '#1e90ff', margin: '0 0 5px 0' }}>Order With Prescription</h4>
                                <p style={{ color: '#555', margin: '0' }}>
                                    Upload your prescription, and we will deliver your medicines right to your doorstep.
                                </p>
                            </div>
                        </div>
                        <button
                            style={{
                                backgroundColor: '#A4449D',
                                width: "200px",
                                color: '#fff',
                                border: 'none',
                                padding: '8px 20px',
                                borderRadius: '5px',
                                cursor: 'pointer',
                                fontWeight: 'bold',
                            }}
                            onClick={() => document.getElementById('fileUpload').click()}
                        >
                            Upload
                        </button>
                        <input
                            type="file"
                            id="fileUpload"
                            style={{ display: 'none' }}
                            onChange={(e) => {
                                console.log(e.target.files[0]);
                            }}
                        />
                    </div>

                    {/* Category Section */}
                    {displayedCategories.map((cat, idx) => (
                        data[cat]?.length > 0 && (
                            <div key={idx} className="mb-5">
                                <div className="d-flex align-items-center" style={{ gap: "15px" }}>
                                    <div style={{ flex: "1" }}>
                                        <h4 className="mb-3">{cat}</h4>
                                        <div className="d-flex flex-wrap" style={{ gap: "10px" }}>
                                            {filteredData(data[cat]).slice(0, 5).map((product, i) => {
                                                const discountPercentage = product.discount_price
                                                    ? Math.round(((product.price - product.discount_price) / product.price) * 100)
                                                    : 0;
                                                return (
                                                    <div
                                                        key={i}
                                                        style={{
                                                            flex: "0 0 20%",
                                                            maxWidth: "19%",
                                                        }}
                                                    >
                                                        <div
                                                            className="card h-100 shadow-sm"
                                                            onClick={() => navigate(`/product/${product.slug}`)}
                                                            style={{
                                                                cursor: 'pointer',
                                                                borderRadius: "12px",
                                                                backgroundColor: "#f4f4f4ff",
                                                                position: "relative",
                                                                overflow: "hidden",
                                                            }}
                                                        >
                                                            {/* Out of Stock Badge */}
                                                            {(product.stock === 0 || !product.is_available) && (
                                                                <span
                                                                    style={{
                                                                        position: "absolute",
                                                                        top: "10px",
                                                                        right: "10px",
                                                                        backgroundColor: "rgba(0,0,0,0.7)",
                                                                        color: "#fff",
                                                                        padding: "5px 10px",
                                                                        borderRadius: "5px",
                                                                        fontSize: "12px",
                                                                        fontWeight: "bold"
                                                                    }}
                                                                >
                                                                    Out of Stock
                                                                </span>
                                                            )}

                                                            {/* Discount Badge */}
                                                            {discountPercentage > 0 && (
                                                                <span
                                                                    style={{
                                                                        position: "absolute",
                                                                        top: "5px",
                                                                        left: "5px",
                                                                        backgroundColor: "#ff4d4f",
                                                                        color: "#fff",
                                                                        padding: "2px 8px",
                                                                        fontSize: "12px",
                                                                        borderRadius: "5px",
                                                                        fontWeight: "bold",
                                                                    }}
                                                                >
                                                                    {discountPercentage}% Off
                                                                </span>
                                                            )}

                                                            {product.images?.[0]?.image && (
                                                                <img
                                                                    src={`${baseUrl.replace("/api", "")}/${product.images[0].image}`}
                                                                    alt={product.name}
                                                                    className="card-img-top"
                                                                    style={{
                                                                        height: "180px",
                                                                        width: "90%",
                                                                        objectFit: "cover",
                                                                        margin: "10px auto 0",
                                                                        borderRadius: "12px",
                                                                        backgroundColor: "#fff",
                                                                    }}
                                                                />
                                                            )}
                                                            <div className="card-body d-flex flex-column justify-content-between">
                                                                <h6 className="card-title">{product.name}</h6>
                                                                <p style={{ fontSize: "13px", color: "#555" }}>{product.description}</p>
                                                                <div className="d-flex align-items-center mb-2">
                                                                    <p className="card-text fw-bold mb-0 me-2" style={{ fontSize: "18px", color: "#A4449D" }}>
                                                                        {product.discount_price ? `${product.discount_price} ৳` : ""}
                                                                    </p>
                                                                    <p className="card-text text-muted mb-0">
                                                                        {product.discount_price ? (
                                                                            <span style={{ textDecoration: "line-through", fontSize: "14px", color: "#ff4d4f" }}>
                                                                                {product.price} ৳
                                                                            </span>
                                                                        ) : (
                                                                            `${product.price} ৳`
                                                                        )}
                                                                    </p>
                                                                </div>
                                                            </div>
                                                            <button
                                                                onClick={(e) => {
                                                                    e.stopPropagation();
                                                                    addToCart(product);
                                                                }}
                                                                className="btn w-100"
                                                                disabled={product.stock === 0 || !product.is_available}
                                                                style={{
                                                                    borderBottomLeftRadius: "12px",
                                                                    borderBottomRightRadius: "12px",
                                                                    marginTop: "auto",
                                                                    backgroundColor: product.stock === 0 || !product.is_available ? "#ccc" : "#33B1BF",
                                                                    color: "#fff",
                                                                    fontWeight: "bold",
                                                                    padding: '10px 0',
                                                                    fontSize: '16px',
                                                                    cursor: product.stock === 0 || !product.is_available ? "not-allowed" : "pointer"
                                                                }}
                                                            >
                                                                {product.stock === 0 || !product.is_available ? "Out of Stock" : "Add to cart"}
                                                            </button>
                                                        </div>
                                                    </div>
                                                );
                                            })}
                                        </div>
                                    </div>
                                    {/* Right Arrow Button */}
                                    <button
                                        onClick={() => goToCategoryProducts(cat)}
                                        style={{
                                            width: "35px",
                                            height: "35px",
                                            borderRadius: "50%",
                                            backgroundColor: "#007bff",
                                            color: "#fff",
                                            border: "none",
                                            display: "flex",
                                            justifyContent: "center",
                                            alignItems: "center",
                                            cursor: "pointer",
                                            flexShrink: 0,
                                        }}
                                    >
                                        <FaArrowRight />
                                    </button>
                                </div>
                            </div>
                        )
                    ))}
                </div>
            </div>
        </div>
    );
}

export default Shop;
