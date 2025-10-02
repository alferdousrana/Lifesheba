import React, { useEffect, useState, useContext } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { config } from '../../config';
import { CartContext } from '../../contexts/CartContext';
import { FaShoppingCart } from 'react-icons/fa';

function ShopProductDetails() {
    const { baseUrl } = config;
    const { slug } = useParams();
    const [product, setProduct] = useState(null);
    const [quantity, setQuantity] = useState(1);
    const [categories, setCategories] = useState([]);
    const [categoryProducts, setCategoryProducts] = useState({});
    const navigate = useNavigate();
    const { cartCount, addToCart } = useContext(CartContext); //eslint-disable-line

    useEffect(() => {
        axios.get(`${baseUrl}/products/${slug}/`)
            .then(res => setProduct(res.data))
            .catch(err => console.error('Failed to fetch product:', err));
    }, [slug, baseUrl]);

    useEffect(() => {
        axios.get(`${baseUrl}/products/shop/products/`)
            .then(res => {
                setCategoryProducts(res.data);
                const nonEmptyCategories = Object.keys(res.data).filter(
                    cat => Array.isArray(res.data[cat]) && res.data[cat].length > 0
                );
                setCategories(nonEmptyCategories);
            })
            .catch(err => console.error('Failed to fetch categories:', err));
    }, [baseUrl]);

    const increaseQty = () => setQuantity(prev => prev + 1);
    const decreaseQty = () => setQuantity(prev => (prev > 1 ? prev - 1 : 1));

    const handleAddToCart = () => {
        addToCart(product, quantity);
        setQuantity(1); // Reset quantity after adding to cart
    };

    if (!product) return <p>Loading...</p>;

    const {
        name, mg, description, price, stock, is_available,
        category, images, detailed_description, discount_price
    } = product;

    const mainImage = images?.[0]?.image;
    const otherImages = images?.slice(1);

    const medicineInfo = {
        "Indication": detailed_description?.indication,
        "Therapeutic Class": detailed_description?.therapeutic_class,
        "Pharmacology": detailed_description?.pharmacology,
        "Dosage & Administration": detailed_description?.dosage_administration,
        "Dosage": detailed_description?.dosage,
        "Interaction": detailed_description?.interaction,
        "Contraindication": detailed_description?.contraindication,
        "Side Effect": detailed_description?.side_effect,
        "Warnings": detailed_description?.warnings,
        "Overdose Effect": detailed_description?.overdose_effect,
        "Storage Condition": detailed_description?.storage_condition,
        "Use in Special Population": detailed_description?.use_in_special_population,
        "Drug Classes": detailed_description?.drug_classes,
        "Mode of Action": detailed_description?.mode_of_action,
        "Pregnancy": detailed_description?.pregnancy,
        "Pediatric Users": detailed_description?.pediatric_users
    };

    return (
        <div className="container mt-4">
            <div className="row">
                {/* Categories */}
                <div className="col-md-3">
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

                {/* Product Details */}
                <div className="col-md-9">
                    <div className="p-4">
                        <div className='row'>
                            <div className='col-md-6 position-relative'>
                                {mainImage && (
                                    <img
                                        src={mainImage}
                                        alt={name}
                                        className="img-fluid rounded shadow mb-3"
                                        style={{ width: '100%', height: '300px', objectFit: 'cover' }}
                                    />
                                )}

                                {/* Out of Stock Badge */}
                                {(stock === 0 || !is_available) && (
                                    <span
                                        style={{
                                            position: "absolute",
                                            top: "10px",
                                            left: "10px",
                                            backgroundColor: "rgba(255,0,0,0.85)",
                                            color: "#fff",
                                            padding: "6px 12px",
                                            borderRadius: "5px",
                                            fontSize: "14px",
                                            fontWeight: "bold"
                                        }}
                                    >
                                        Out of Stock
                                    </span>
                                )}

                                {otherImages?.length > 0 && (
                                    <div className="d-flex gap-3 mt-4 flex-wrap">
                                        {otherImages.map((imgObj, index) => (
                                            <img
                                                key={index}
                                                src={imgObj.image}
                                                alt={`Thumbnail ${index + 1}`}
                                                style={{ width: '80px', height: '80px', objectFit: 'cover' }}
                                                className="rounded border"
                                            />
                                        ))}
                                    </div>
                                )}
                            </div>

                            <div className='card col-md-6 p-3'>
                                <h2>{name} <small style={{ fontSize: '12px', fontWeight: 'normal', color: '#6c757d' }}>{mg}</small></h2>
                                <p className="text-muted">{category?.name}</p>
                                <p>{description}</p>
                                <p>
                                    <span className="text-muted text-decoration-line-through me-2">৳ {price}</span>
                                    <span className="text-success fw-bold">
                                        ({Math.round(((price - discount_price) / price) * 100)}% off)
                                    </span>
                                </p>
                                <p className="fw-bold">৳ {discount_price}</p>
                                <p><strong>Stock:</strong> {stock}</p>
                                <p><strong>Available:</strong> {is_available ? 'Yes' : 'No'}</p>

                                <div className="d-flex align-items-center gap-2 mt-3">
                                    <button
                                        className="btn btn-outline-secondary"
                                        onClick={decreaseQty}
                                        disabled={stock === 0 || !is_available}
                                    >
                                        -
                                    </button>
                                    <span className="fw-bold">{quantity}</span>
                                    <button
                                        className="btn btn-outline-secondary"
                                        onClick={increaseQty}
                                        disabled={stock === 0 || !is_available}
                                    >
                                        +
                                    </button>
                                    <button
                                        className="btn btn-primary ms-3"
                                        onClick={handleAddToCart}
                                        disabled={stock === 0 || !is_available}
                                    >
                                        {stock === 0 || !is_available ? "Out of Stock" : "Add to Cart"}
                                    </button>
                                </div>
                            </div>
                        </div>

                        {/* Related Products (limit to 4) */}
                        <div className='row mt-5'>
                            <div className='col-12'>
                                <h4 className="mb-3">Related Products</h4>
                                <div className="row">
                                    {categoryProducts[category?.name]?.slice(0, 4).map(p => (
                                        <div className="col-md-3 mb-3" key={p.slug}>
                                            <div className="card h-100 position-relative">
                                                {/* Out of Stock badge */}
                                                {(p.stock === 0 || !p.is_available) && (
                                                    <span
                                                        style={{
                                                            position: "absolute",
                                                            top: "8px",
                                                            right: "8px",
                                                            backgroundColor: "rgba(0,0,0,0.7)",
                                                            color: "#fff",
                                                            padding: "4px 8px",
                                                            borderRadius: "5px",
                                                            fontSize: "12px",
                                                            fontWeight: "bold"
                                                        }}
                                                    >
                                                        Out of Stock
                                                    </span>
                                                )}
                                                <img
                                                    src={`${baseUrl.replace("/api", "")}/${p.images[0].image}`}
                                                    alt={p.name}
                                                    style={{ objectFit: 'cover', height: '150px' }}
                                                />
                                                <div className="card-body d-flex flex-column">
                                                    <h5 className="card-title">{p.name} <small style={{ fontSize: '12px', fontWeight: 'normal', color: '#6c757d' }}>{p.mg}</small></h5>
                                                    <p className="card-text">
                                                        <span className="text-muted text-decoration-line-through me-2">৳ {p.price}</span>
                                                        <span className="text-success fw-bold">
                                                            ({Math.round(((p.price - p.discount_price) / p.price) * 100)}% off)
                                                        </span>
                                                    </p>
                                                    <p className="card-text fw-bold">৳ {p.discount_price}</p>
                                                    <Link to={`/product/${p.slug}`} className="btn btn-sm btn-primary mt-auto">
                                                        View Details
                                                    </Link>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>

                        {/* Medicine Info */}
                        <div className='row mt-5'>
                            <div className='col-12'>
                                <h4 className="mb-3">Medicine Information</h4>
                                <div className="row">
                                    {Object.entries(medicineInfo).map(([key, value]) =>
                                        value ? (
                                            <div className="col-md-12 mb-3" key={key}>
                                                <h6 className="fw-bold">{key}: {name} {mg}</h6>
                                                <p>{value}</p>
                                            </div>
                                        ) : null
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ShopProductDetails;
