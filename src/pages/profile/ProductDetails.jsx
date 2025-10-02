import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { config } from '../../config';

function ProductDetails() {
    const { baseUrl } = config;
    const { slug } = useParams();
    const [product, setProduct] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        axios.get(`${baseUrl}/products/${slug}/`)
            .then(res => setProduct(res.data))
            .catch(err => console.error('Failed to fetch product:', err));
    }, [baseUrl, slug]);

    if (!product) return <p>Loading...</p>;

    const {
        name, mg, description, price, stock, is_available,
        category, images, detailed_description
    } = product;

    const {
        indication,
        therapeutic_class,
        pharmacology,
        dosage_administration,
        dosage,
        interaction,
        contraindication,
        side_effect,
        warnings,
        overdose_effect,
        storage_condition,
        use_in_special_population,
        drug_classes,
        mode_of_action,
        pregnancy,
        pediatric_users
    } = detailed_description || {};

    const mainImage = images?.[0]?.image;
    const otherImages = images?.slice(1);

    const medicineInfo = {
        "Indication": indication,
        "Therapeutic Class": therapeutic_class,
        "Pharmacology": pharmacology,
        "Dosage & Administration": dosage_administration,
        "Dosage": dosage,
        "Interaction": interaction,
        "Contraindication": contraindication,
        "Side Effect": side_effect,
        "Warnings": warnings,
        "Overdose Effect": overdose_effect,
        "Storage Condition": storage_condition,
        "Use in Special Population": use_in_special_population,
        "Drug Classes": drug_classes,
        "Mode of Action": mode_of_action,
        "Pregnancy": pregnancy,
        "Pediatric Users": pediatric_users
    };

    return (
        <div className="card p-4">
            

            <div className='row'>
                <div className='col-md-6'>
                    {mainImage && (
                        <img
                            src={mainImage}
                            alt={name}
                            style={{ maxWidth: '400px', maxHeight: '400px',objectFit:'cover', marginBottom: '15px' }}
                            className="img-fluid rounded shadow"
                        />
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
                <div className='col-md-6'>
                    <div className='row mb-2'>
                        <div className='col-md-10 text-start'>
                            <h2>
                                {name}
                                <small className="text-muted ms-2" style={{ fontSize: '1rem' }}>{mg}</small>
                            </h2>
                        </div>
                        <div className='col-md-2 text-end'>
                            <button
                                className="btn btn-success"
                                onClick={() => navigate(`/profile/create-product/${product.slug}`)}
                            >
                                Edit
                            </button>
                        </div>
                    </div>
                    <p>{category?.name}</p>
                    <p>{description}</p>
                    <p>
                        <span className="text-muted text-decoration-line-through me-2">৳ {price}</span>
                        <span className="text-success fw-bold">
                            (
                            {Math.round(((price - product.discount_price) / price) * 100)}% off
                            )
                        </span>
                    </p>
                    <p className="fw-bold">৳ {product.discount_price}</p>
                    <p><strong>Stock:</strong> {stock}</p>
                    
                    <p><strong>Available:</strong> {is_available ? 'Yes' : 'No'}</p>
                </div>
            </div>

            {/* ✅ Medicine Info Section */}
            <div className='row mt-5'>
                <div className='col-12'>
                    <h4 className="mb-3">Medicine Information</h4>
                    <div className="row">
                        {Object.entries(medicineInfo).map(([key, value]) =>
                            value ? (
                                <div className="col-md-12 mb-3" key={key}>
                                    <h6 className="bold">{key}: {name} {mg}</h6>
                                    <p>{value}</p>
                                </div>
                            ) : null
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ProductDetails;
