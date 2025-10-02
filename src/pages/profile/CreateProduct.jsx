import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import { config } from '../../config';

function CreateProduct() {
    const { baseUrl } = config;
    const { slug } = useParams();
    const navigate = useNavigate();

    const [previewImage, setPreviewImage] = useState(null);
    const [categories, setCategories] = useState([]);
    const [form, setForm] = useState({
        name: '',
        mg: '',
        description: '',
        price: '',
        discount_price: '',
        stock: '',
        category_slug: '',
        is_available: true,
        indication: '',
        therapeutic_class: '',
        pharmacology: '',
        dosage_administration: '',
        dosage: '',
        interaction: '',
        contraindication: '',
        side_effect: '',
        warnings: '',
        overdose_effect: '',
        storage_condition: '',
        use_in_special_population: '',
        drug_classes: '',
        mode_of_action: '',
        pregnancy: '',
        pediatric_users: ''
    });
    const [images, setImages] = useState([]);
    const [isEditing, setIsEditing] = useState(false);

    useEffect(() => {
        axios.get(`${baseUrl}/products/categories/`)
            .then(res => {
                if (res.data && Array.isArray(res.data.results)) {
                    setCategories(res.data.results);
                    console.log(categories)
                } else {
                    setCategories(res.data);
                }
            })
            .catch(err => console.error('Failed to load categories:', err));

        if (slug) {
            setIsEditing(true);
            axios.get(`${baseUrl}/products/${slug}/`)
                .then(res => {
                    const data = res.data;
                    const desc = data.detailed_description || {};
                    setForm({
                        name: data.name,
                        mg: data.mg,
                        description: data.description,
                        price: data.price,
                        discount_price: data.discount_price,
                        stock: data.stock,
                        category_slug: data.category.slug,
                        is_available: data.is_available,
                        indication: desc.indication || '',
                        therapeutic_class: desc.therapeutic_class || '',
                        pharmacology: desc.pharmacology || '',
                        dosage_administration: desc.dosage_administration || '',
                        dosage: desc.dosage || '',
                        interaction: desc.interaction || '',
                        contraindication: desc.contraindication || '',
                        side_effect: desc.side_effect || '',
                        warnings: desc.warnings || '',
                        overdose_effect: desc.overdose_effect || '',
                        storage_condition: desc.storage_condition || '',
                        use_in_special_population: desc.use_in_special_population || '',
                        drug_classes: desc.drug_classes || '',
                        mode_of_action: desc.mode_of_action || '',
                        pregnancy: desc.pregnancy || '',
                        pediatric_users: desc.pediatric_users || ''
                    });
                    if (data.images && data.images.length > 0) {
                        setPreviewImage(data.images[0].image);
                    }
                })
                .catch(err => console.error('Failed to load product:', err));
        }
    }, [baseUrl, slug]);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setForm(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }));
    };

    const handleImageChange = (e) => {
        const selectedFiles = Array.from(e.target.files);
        setImages(selectedFiles);

        if (selectedFiles.length > 0) {
            const reader = new FileReader();
            reader.onload = () => setPreviewImage(reader.result);
            reader.readAsDataURL(selectedFiles[0]);
        } else {
            setPreviewImage(null);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem('access_token');
        const formData = new FormData();

        const descriptionFields = [
            'indication', 'therapeutic_class', 'pharmacology', 'dosage_administration', 'dosage',
            'interaction', 'contraindication', 'side_effect', 'warnings', 'overdose_effect',
            'storage_condition', 'use_in_special_population', 'drug_classes',
            'mode_of_action', 'pregnancy', 'pediatric_users'
        ];

        // Append basic fields
        for (const key in form) {
            if (!descriptionFields.includes(key)) {
                formData.append(key, form[key]);
            }
        }

        // Append nested description fields
        descriptionFields.forEach(field => {
            formData.append(`detailed_description.${field}`, form[field]);
        });

        // Append images
        images.forEach(image => formData.append('images', image));

        const configHeaders = {
            headers: {
                Authorization: `Bearer ${token}`
            }
        };

        try {
            if (isEditing) {
                await axios.put(`${baseUrl}/products/${slug}/`, formData, configHeaders);
                alert('Product updated successfully!');
            } else {
                await axios.post(`${baseUrl}/products/create/`, formData, configHeaders);
                alert('Product created successfully!');
            }
            navigate('/profile/products');
        } catch (err) {
            console.error(err);
            alert('Failed to submit product');
        }
    };

    return (
        <div className="card p-4 position-relative" style={{ paddingBottom: '80px' }}>
            <div className='row mb-3'>
                <div className='col-md-8'>
                    <h1>{isEditing ? 'Edit Product' : 'Create Product'}</h1>
                </div>
                <div className='col-md-4'>
                    <button className="btn btn-secondary float-end" onClick={() => navigate('/profile/products')}>Cancel</button>
                </div>
            </div>

            <form onSubmit={handleSubmit} encType="multipart/form-data">
                <input name="name" placeholder="Name" className="form-control mb-2" value={form.name} onChange={handleChange} required />
                <input name="mg" placeholder="mg" className="form-control mb-2" value={form.mg} onChange={handleChange} />
                <textarea name="description" placeholder="Brand Description" className="form-control mb-2" value={form.description} onChange={handleChange} />

                <input name="price" type="number" placeholder="Price" className="form-control mb-2" value={form.price} onChange={handleChange} required />
                <input name="discount_price" type="number" placeholder="Discount Price" className="form-control mb-2" value={form.discount_price} onChange={handleChange} required />
                <input name="stock" type="number" placeholder="Stock" className="form-control mb-2" value={form.stock} onChange={handleChange} required />

                <select name="category_slug" className="form-control mb-3" value={form.category_slug} onChange={handleChange} required>
                    <option value="">-- Select Category --</option>
                    {categories.map(cat => <option key={cat.slug} value={cat.slug}>{cat.name}</option>)}
                </select>

                <div className="form-check mb-3">
                    <input className="form-check-input" type="checkbox" name="is_available" checked={form.is_available} onChange={handleChange} />
                    <label className="form-check-label">Available</label>
                </div>

                {previewImage && (
                    <div className="mb-3">
                        <p>Image Preview:</p>
                        <img src={previewImage} alt="Preview" style={{ width: '200px', borderRadius: '10px' }} />
                    </div>
                )}
                <input type="file" name="images" multiple accept="image/*" onChange={handleImageChange} className="form-control mb-3" />

                {/* New Medical Fields */}
                {[
                    'indication', 'therapeutic_class', 'pharmacology', 'dosage_administration', 'dosage', 'interaction',
                    'contraindication', 'side_effect', 'warnings', 'overdose_effect', 'storage_condition',
                    'use_in_special_population', 'drug_classes', 'mode_of_action', 'pregnancy', 'pediatric_users'
                ].map(field => (
                    <textarea
                        key={field}
                        name={field}
                        placeholder={field.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase())}
                        className="form-control mb-2"
                        value={form[field]}
                        onChange={handleChange}
                    />
                ))}

                {/* Sticky Submit Button */}
                <div className="position-fixed bottom-0 start-0 end-0 bg-white shadow p-3 d-flex justify-content-end" style={{ zIndex: 1000 }}>
                    <button type="submit" className="btn btn-success">{isEditing ? 'Update' : 'Submit'}</button>
                </div>
            </form>
        </div>
    );
}

export default CreateProduct;
