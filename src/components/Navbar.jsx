import React, { useContext } from 'react';
import { NavLink, Link, useLocation } from 'react-router-dom';  // ✅ useLocation
import { AuthContext } from '../contexts/AuthContext';
import { CartContext } from '../contexts/CartContext';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faShoppingCart, faUserCircle } from '@fortawesome/free-solid-svg-icons';
import logo from '../assets/images/logo-03.png';
import "./css/Navbar.css";

function Navbar() {
    const { user } = useContext(AuthContext);
    const { cartItems } = useContext(CartContext);
    const location = useLocation();

    const totalItems = (cartItems || []).reduce((acc, item) => acc + item.quantity, 0);

    // ✅ Services active check
    const servicesPaths = ["/doctors", "/nurses", "/caregivers", "/tests"];
    const isServicesActive = servicesPaths.includes(location.pathname);

    return (
        <nav className="navbar navbar-expand-lg navbar-light bg-light sticky-top">
            <Link className="navbar-brand" to="/">
                <img src={logo} alt="Logo" style={{ height: '50px' }} />
            </Link>
            <div className="container me-5" style={{ color: 'black', fontSize: '18px' }}>
                <button
                    className="navbar-toggler"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#navbarNav"
                >
                    <span className="navbar-toggler-icon"></span>
                </button>

                <div className="collapse navbar-collapse" id="navbarNav">
                    <ul className="navbar-nav ms-auto">
                        <li className="nav-item">
                            <NavLink className="nav-link" to="/" end>Home</NavLink>
                        </li>
                        <li className="nav-item">
                            <NavLink className="nav-link" to="/shop">Shop</NavLink>
                        </li>

                        {/* ✅ Services Dropdown */}
                        <li className={`nav-item dropdown ${isServicesActive ? "active" : ""}`}>
                            <span className={`nav-link dropdown-toggle ${isServicesActive ? "active" : ""}`} role="button">
                                Services
                            </span>
                            <ul className="dropdown-menu">
                                <li><NavLink className="dropdown-item" to="/doctors">Doctor</NavLink></li>
                                <li><NavLink className="dropdown-item" to="/nurses">Nurse</NavLink></li>
                                <li><NavLink className="dropdown-item" to="/caregivers">Caregiver</NavLink></li>
                                <li><NavLink className="dropdown-item" to="/tests">Lab Test</NavLink></li>
                            </ul>
                        </li>

                        <li className="nav-item">
                            <NavLink className="nav-link" to="/education">Education</NavLink>
                        </li>
                        <li className="nav-item">
                            <NavLink className="nav-link" to="/about-us">About Us</NavLink>
                        </li>
                        <li className="nav-item">
                            <NavLink className="nav-link" to="/contact-us">Contact Us</NavLink>
                        </li>

                        {/* ✅ Cart */}
                        <li className="nav-item ms-2">
                            <Link className="nav-link" to="/cart">
                                <div className="cart-btn">
                                    <FontAwesomeIcon icon={faShoppingCart} size="sm" />
                                    {totalItems > 0 && (
                                        <span className="position-absolute badge rounded-pill bg-danger">
                                            {totalItems}
                                        </span>
                                    )}
                                </div>
                            </Link>
                        </li>

                        {/* ✅ User Avatar */}
                        <li className="nav-item dropdown ms-3">
                            <a
                                className="nav-link dropdown-toggle d-flex align-items-center"
                                href="#"
                                role="button"
                                data-bs-toggle="dropdown"
                            >
                                {user ? (
                                    <>
                                        <img
                                            src={user.profile_picture || "https://via.placeholder.com/40"}
                                            alt="User Avatar"
                                            className="user-avatar me-2"
                                        />
                                        <span>{user.full_name?.split(" ")[0] || "User"}</span>
                                    </>
                                ) : (
                                    <FontAwesomeIcon icon={faUserCircle} size="2x" className="text-secondary" />
                                )}
                            </a>

                            <ul className="dropdown-menu dropdown-menu-end">
                                {!user ? (
                                    <>
                                        <li><NavLink className="dropdown-item" to="/register">Register</NavLink></li>
                                        <li><NavLink className="dropdown-item" to="/login">Login</NavLink></li>
                                    </>
                                ) : (
                                    <>
                                        <li><NavLink className="dropdown-item" to="/profile">Profile</NavLink></li>
                                        <li><NavLink className="dropdown-item" to="/logout">Logout</NavLink></li>
                                    </>
                                )}
                            </ul>
                        </li>
                    </ul>
                </div>
            </div>
        </nav>
    );
}

export default Navbar;
