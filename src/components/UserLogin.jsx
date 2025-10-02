import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { config } from '../config';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEnvelope, faLock } from '@fortawesome/free-solid-svg-icons';
import loginGif from '../assets/images/login_image.gif';
import loginBg from '../assets/images/login_bg_image.png';
import './css/UserRegistration.css';
import { AuthContext } from '../contexts/AuthContext';

function UserLogin() {
    const { baseUrl } = config;
    const [formData, setFormData] = useState({ email: '', password: '' });
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    const { setUser } = useContext(AuthContext); // 🔥 important

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            // Step 1: login
            const { data } = await axios.post(`${baseUrl}/accounts/login/`, formData);
            localStorage.setItem('access_token', data.access_token);
            localStorage.setItem('refresh_token', data.refresh_token);

            // Step 2: fetch user profile and set context
            const profileRes = await axios.get(`${baseUrl}/accounts/profile/me/`, {
                headers: { Authorization: `Bearer ${data.access_token}` }
            });
            setUser(profileRes.data);

            alert('Login successful!');
            navigate('/profile');
        } catch (err) {
            setError(err.response?.data?.error || 'Invalid credentials');
        }
    };

    return (
        <div className="card my-4" style={{
            backgroundImage: `url(${loginBg})`,
            backgroundSize: 'cover',
            backgroundPosition: 'center',
            backgroundRepeat: 'no-repeat'
        }}>
            <div className="card-body py-3">
                <div className='row'>
                    <div className='col-md-6 d-flex align-items-center justify-content-center'>
                        <img
                            src={loginGif}
                            alt="Login Illustration"
                            style={{ objectFit: 'contain', height: '400px', width: '100%' }}
                        />
                    </div>

                    <div className='col-md-6 d-flex flex-column justify-content-center'>
                        <h3>Login</h3>
                        {error && <div className="alert alert-danger">{error}</div>}

                        <div className="social-buttons">
                            <button className="btn btn-social fb">
                                <i className="fab fa-facebook-f"></i> Facebook
                            </button>
                            <button className="btn btn-social google">
                                <i className="fab fa-google"></i> Google
                            </button>
                            <button className="btn btn-social linkedin">
                                <i className="fab fa-linkedin-in"></i> LinkedIn
                            </button>
                        </div>

                        <form onSubmit={handleSubmit}>
                            <div className="mb-3">
                                <label className="form-label">Email</label>
                                <div className="input-group">
                                    <span className="input-group-text">
                                        <FontAwesomeIcon icon={faEnvelope} style={{ color: "#33B1BF" }} />
                                    </span>
                                    <input
                                        type="email"
                                        className="form-control"
                                        name="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        required
                                        
                                    />
                                </div>
                            </div>

                            <div className="mb-3">
                                <label className="form-label">Password</label>
                                <div className="input-group">
                                    <span className="input-group-text">
                                        <FontAwesomeIcon icon={faLock} style={{ color: "#33B1BF" }} />
                                    </span>
                                    <input
                                        type="password"
                                        className="form-control"
                                        name="password"
                                        value={formData.password}
                                        onChange={handleChange}
                                        required
                                    />
                                </div>
                            </div>

                            <button type="submit" className="btn btn-primary btn-register">Login</button>
                            <p className='mt-3 mb-3 text-center'> I don't have an account? <a style={{ color:'#cd0961'}} href='/register'>Sign Up</a> </p>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default UserLogin;
