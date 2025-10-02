// src/pages/profile/MyProducts.jsx
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { config } from '../../config';

function MyProducts() {
  const { baseUrl } = config;
  const [products, setProducts] = useState([]);
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('access_token');
    if (!token) {
      setError('No access token found. Please log in.');
      return;
    }

    console.log('Request URL:', `${baseUrl}/products/my-products/`);

    axios
      .get(`${baseUrl}/products/my-products/`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        console.log('Response:', res.data);
        // ✅ Extract products from the results array
        const productList = res.data.results || res.data;
        setProducts(productList);
        setError(null);
      })
      .catch((err) => {
        console.error('Error fetching products:', err.response || err);
        if (err.response?.status === 404) {
          setError('Products endpoint not found. Check backend configuration.');
        } else if (err.response?.status === 403) {
          setError('You are not a vendor. Please create a vendor profile.');
        } else {
          setError(`Failed to fetch products: ${err.message}`);
        }
      });
  }, [baseUrl]);

  const handleDelete = async (slug) => {
    const confirmed = window.confirm("Are you sure you want to delete this product?");
    if (!confirmed) return;

    const token = localStorage.getItem('access_token');
    try {
      await axios.delete(`${baseUrl}/products/${slug}/`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setProducts(products.filter(p => p.slug !== slug));
      alert('Product deleted successfully!');
    } catch (err) {
      console.error('Delete failed:', err);
      alert('Failed to delete product.');
    }
  };

  return (
    <div>
      <div className='row'>
        <div className='col-md-8'>
          <h1>My Products</h1>
        </div>
        <div className='col-md-4 text-end'>
          <button
            className="btn btn-success"
            onClick={() => navigate(`/profile/create-product/`)}
          >
            Create Product
          </button>
        </div>

      </div>
      
      {error && <p className="text-danger">{error}</p>}
      {products.length === 0 && !error ? (
        <p>No products yet.</p>
      ) : (
        <div className="row">
          {products.map((product) => (
            console.log(product),
            <div className="col-md-3 mb-3" key={product.id}>
              <div className="card h-100">
                {product.images?.[0]?.image && (
                  <img
                    src={product.images[0].image}
                    alt={product.name}
                    className="card-img-top"
                    style={{height: "200px", objectFit: "cover"}}
                  />
                )}
                <div className="card-body">
                  <span className="">{product.is_available ? "Available" : "Not Available"}</span>
                  <h5 className="card-title">{product.name}</h5>
                  <p>{product.description}</p>
                  <div className='row'>
                    <div className='col-md-6'>
                        <strong>৳{product.discount_price}</strong>
                    </div>
                    <div className='col-md-6 text-end'>
                      <strong>{product.stock} {product.stock > 0 ? "In Stock" : "Out of Stock" }</strong>
                    </div>
                  </div>
                  <div className='row mt-3'>
                    <div className='col-md-4'>
                        <button className="btn btn-danger" onClick={() => handleDelete(product.slug)}>Delete</button>
                    </div>
                     
                      <div className='col-md-8 text-end'>
                        <button
                        style={{width: "100%"}}
                          className="btn btn-primary"
                          onClick={() => navigate(`/profile/products/${product.slug}`)}
                        >
                          View
                        </button>
                      </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default MyProducts;