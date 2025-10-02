import React, { useEffect, useState, useContext } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { config } from '../../config';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faPaperPlane } from '@fortawesome/free-solid-svg-icons';
import { CartContext } from '../../contexts/CartContext';

function CategoryProducts() {
    const { category } = useParams();
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const { addToCart } = useContext(CartContext);
    const navigate = useNavigate();
    const {baseUrl} = config;

    // Load all products and extract category list
    useEffect(() => {
        axios
            .get(`${baseUrl}/products/shop/products/`)
            .then((res) => {
                const allData = res.data;
                const categoryList = Object.keys(allData);
                setCategories(categoryList);
                if (allData[category]) {
                    setProducts(allData[category]);
                } else {
                    setProducts([]);
                }
            })
            .catch((err) => console.error(err));
    }, [category]);

    const filteredData = (products) => {
        if (!products) return [];
        return products.filter((product) =>
            (product?.name || '').toLowerCase().includes(searchTerm.toLowerCase())
        );
    };

    return (
        <div className="container my-4">
            <div className="row">
                {/* Left Sidebar for Categories */}
                <div className="col-md-2">
                    <h5 className="mb-3">Categories</h5>
                    <ul className="list-group">
                        {categories.map((cat) => (
                            <li
                                key={cat}
                                className={`list-group-item ${cat === category ? 'active' : ''}`}
                                style={{ cursor: "pointer" }}
                                onClick={() => navigate(`/category-products/${encodeURIComponent(cat)}`)}
                            >
                                {cat}
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Main Product Area */}
                <div className="col-md-10">
                    <div className="d-flex justify-content-between align-items-center mb-4">
                        <h3 className="mb-0">{category}</h3>
                        <div className="col-md-6">
                            <div className="input-group">
                                <input
                                    type="text"
                                    className="form-control"
                                    placeholder="Search products..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    style={{
                                        paddingLeft: '35px',
                                        paddingRight: '35px',
                                        position: 'relative',
                                        borderLeft: '1px solid #FDD4FA',
                                    }}
                                />
                                <span
                                    style={{
                                        position: 'absolute',
                                        left: '10px',
                                        top: '50%',
                                        transform: 'translateY(-50%)',
                                        color: '#33B1BF',
                                    }}
                                >
                                    <FontAwesomeIcon icon={faSearch} />
                                </span>
                                <span
                                    style={{
                                        position: 'absolute',
                                        right: '10px',
                                        top: '50%',
                                        transform: 'translateY(-50%)',
                                        cursor: 'pointer',
                                        color: '#33B1BF',
                                    }}
                                >
                                    <FontAwesomeIcon icon={faPaperPlane} />
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="row">
                        {filteredData(products).length > 0 ? (
                            filteredData(products).map((product, i) => (
                                <div className="col-md-3 mb-4" key={i}>
                                    <div
                                        className="card h-100 shadow-sm d-flex flex-column justify-content-between"
                                        style={{
                                            borderRadius: '12px',
                                            backgroundColor: '#f4f4f4ff',
                                            overflow: 'hidden',
                                            position: 'relative',
                                        }}
                                    >
                                        {/* Out of Stock badge */}
                                        {(product.stock === 0 || !product.is_available) && (
                                            <span
                                                style={{
                                                    position: 'absolute',
                                                    top: '10px',
                                                    right: '10px',
                                                    backgroundColor: 'rgba(0,0,0,0.7)',
                                                    color: '#fff',
                                                    padding: '4px 8px',
                                                    fontSize: '12px',
                                                    borderRadius: '5px',
                                                    fontWeight: 'bold',
                                                    zIndex: 2,
                                                }}
                                            >
                                                Out of Stock
                                            </span>
                                        )}

                                        {/* Discount badge */}
                                        {product.discount_price && (
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
                                                    zIndex: 1,
                                                }}
                                            >
                                                {Math.round(((product.price - product.discount_price) / product.price) * 100)}% Off
                                            </span>
                                        )}

                                        {/* Link wraps image and info */}
                                        <Link
                                            to={`/product/${product.slug}`}
                                            style={{ textDecoration: 'none', color: 'inherit' }}
                                            className="flex-grow-1"
                                        >
                                            {product.images?.[0]?.image && (
                                                <img
                                                    src={`${baseUrl.replace("/api", "")}/${product.images[0].image}`}
                                                    alt={product.name}
                                                    className="card-img-top"
                                                    style={{
                                                        height: '180px',
                                                        width: '90%',
                                                        objectFit: 'cover',
                                                        display: 'block',
                                                        margin: '10px auto 0',
                                                        borderRadius: '12px',
                                                        backgroundColor: '#fff',
                                                    }}
                                                />
                                            )}
                                            <div className="card-body">
                                                <h6 className="card-title">{product.name}</h6>
                                                <p style={{ fontSize: '13px', color: '#555' }}>
                                                    {product.description || 'No description available'}
                                                </p>
                                                <div className="d-flex align-items-center mb-2">
                                                    <p className="fw-bold mb-0 me-2" style={{ fontSize: '18px', color: '#A4449D' }}>
                                                        {product.discount_price ? `${product.discount_price} ৳` : ''}
                                                    </p>
                                                    <p className="text-muted mb-0">
                                                        {product.discount_price ? (
                                                            <span
                                                                style={{
                                                                    textDecoration: 'line-through',
                                                                    fontSize: '14px',
                                                                    color: '#ff4d4f',
                                                                }}
                                                            >
                                                                {product.price} ৳
                                                            </span>
                                                        ) : (
                                                            `${product.price} ৳`
                                                        )}
                                                    </p>
                                                </div>
                                            </div>
                                        </Link>

                                        {/* Add to Cart button */}
                                        <div>
                                            <button
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    e.preventDefault();
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
                                                    fontWeight: 'bold',
                                                    padding: '10px 0',
                                                    fontSize: '16px',
                                                    cursor: product.stock === 0 || !product.is_available ? "not-allowed" : "pointer"
                                                }}
                                            >
                                                {product.stock === 0 || !product.is_available ? "Out of Stock" : "Add to cart"}
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))
                        ) : (
                        <p className="text-danger fw-bold text-center mt-4">No products found</p>
                        )}
                    
                    </div>
                </div>
            </div>
        </div>
    );
}

export default CategoryProducts;
