// src/pages/profile/MyStock.jsx
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { config } from '../../config';

function MyStock() {
    const { baseUrl } = config;
    const [products, setProducts] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const token = localStorage.getItem('access_token');
        if (!token) {
            setError('No access token found. Please log in.');
            return;
        }

        axios
            .get(`${baseUrl}/products/my-products/`, {
                headers: { Authorization: `Bearer ${token}` },
            })
            .then((res) => {
                const productList = res.data.results || res.data;
                const sorted = productList.sort((a, b) => a.stock - b.stock);
                setProducts(sorted);
                setError(null);
            })
            .catch((err) => {
                if (err.response?.status === 403) {
                    setError('You are not a vendor.');
                } else {
                    setError(`Failed to fetch products: ${err.message}`);
                }
            });
    }, [baseUrl]);

    const filteredProducts = [...products]
        .filter((product) =>
            product.name.toLowerCase().includes(searchTerm.toLowerCase())
        )
        .sort((a, b) => a.stock - b.stock);

    return (
        <div>
            <div className="row mb-3 align-items-center">
                <div className="col-md-8">
                    <h2>My Stock</h2>
                </div>
                <div className="col-md-4">
                    <input
                        type="text"
                        placeholder="Search product..."
                        className="form-control"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            {error && <p className="text-danger">{error}</p>}

            {!error && filteredProducts.length === 0 ? (
                <p>No matching products found.</p>
            ) : (
                <table className="table table-hover align-middle">
                    <thead className="table-light">
                        <tr>
                            <th>Image</th>
                            <th>Product Name</th>
                            <th>Status</th>
                            <th>Stock</th>
                            <th>Price</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredProducts.map((product) => {
                            const isLowStock = product.stock <= 5;
                            const thumbnail = product.images?.[0]?.image;

                            return (
                                <tr
                                    key={product.id}
                                    className={isLowStock ? 'table-warning' : ''}
                                    style={{ cursor: 'pointer' }}
                                    onClick={() => navigate(`/profile/products/${product.slug}`)}
                                >
                                    <td>
                                        {thumbnail ? (
                                            <img
                                                src={thumbnail}
                                                alt={product.name}
                                                style={{ width: '50px', height: '50px', objectFit: 'cover', borderRadius: '5px' }}
                                            />
                                        ) : (
                                            <span className="text-muted">No Image</span>
                                        )}
                                    </td>
                                    <td>{product.name}</td>
                                    <td>
                                        <span className={product.is_available ? 'text-success' : 'text-danger'}>
                                            {product.is_available ? 'Available' : 'Not Available'}
                                        </span>
                                    </td>
                                    <td>{isLowStock ? <span className="text-danger">{product.stock}</span> : product.stock}</td>
                                    <td>৳{product.discount_price}</td>
                                </tr>
                            );
                        })}
                    </tbody>
                </table>
            )}
        </div>
    );
}

export default MyStock;
