import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import './css/UserRegistration.css';
import { config } from '../config';
import { AuthContext } from '../contexts/AuthContext';

function UserRegistration() {
    const { baseUrl } = config;
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: ''
    });
    const [error, setError] = useState(null);

    const navigate = useNavigate();
    const { setUser } = useContext(AuthContext);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // Register the user
            await axios.post(`${baseUrl}/accounts/register/`, formData, {
                headers: { 'Content-Type': 'application/json' }
            });

            // Login immediately
            const loginRes = await axios.post(`${baseUrl}/accounts/token/`, {
                email: formData.email,
                password: formData.password
            });

            localStorage.setItem('access_token', loginRes.data.access);
            localStorage.setItem('refresh_token', loginRes.data.refresh);

            // Fetch profile and update context
            const profileRes = await axios.get(`${baseUrl}/accounts/profile/me/`, {
                headers: { Authorization: `Bearer ${loginRes.data.access}` }
            });

            setUser(profileRes.data);

            alert('Registration successful! Redirecting to profile...');
            navigate('/profile');
        } catch (err) {
            const errorMsg = err.response?.data?.error || err.message || 'Registration failed';
            setError(errorMsg);
        }
    };

    return (
        <div className="registration-container">
            <div className="registration-image">
                {/* Optional illustration */}
            </div>
            <div className="card registration-card">
                <div className="card-body">
                    <h3>Create Account</h3>

                    <div className="social-buttons">
                        <button className="btn btn-social fb"><i className="fab fa-facebook-f"></i> Facebook</button>
                        <button className="btn btn-social google"><i className="fab fa-google"></i> Google</button>
                        <button className="btn btn-social linkedin"><i className="fab fa-linkedin-in"></i> LinkedIn</button>
                    </div>

                    <p className="or-use-email">or use your email for registration</p>
                    {error && <div className="alert alert-danger">{error}</div>}

                    <form onSubmit={handleSubmit}>
                        <div className="mb-3">
                            <div className="input-icon">
                                <i className="fas fa-user"></i>
                                <input
                                    type="text"
                                    className="form-control"
                                    name="username"
                                    value={formData.username}
                                    onChange={handleChange}
                                    placeholder="Enter your username"
                                />
                            </div>
                        </div>

                        <div className="mb-3">
                            <div className="input-icon">
                                <i className="fas fa-envelope"></i>
                                <input
                                    type="email"
                                    className="form-control"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    placeholder="Enter your email"
                                />
                            </div>
                        </div>

                        <div className="mb-3">
                            <div className="input-icon">
                                <i className="fas fa-lock"></i>
                                <input
                                    type="password"
                                    className="form-control"
                                    name="password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    placeholder="Create a password"
                                />
                            </div>
                        </div>

                        <button type="submit" className="btn btn-primary btn-register">Sign Up</button>
                        <p className='mt-3 mb-3 text-center'> I already have an account? <a style={{ color: '#cd0961' }} href='/login'>Sign In</a> </p>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default UserRegistration;
