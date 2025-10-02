import React, { useState } from "react";
import axios from "axios";
import { config } from "../config"; // ✅ import your backend base URL

import logo from "../assets/images/logo-02.png";
import visa from "../assets/images/visa.jpg";
import master from "../assets/images/master.png";
import american_express from "../assets/images/american_express.png";
import bkash from "../assets/images/bkash.png";
import nogod from "../assets/images/nagad.png";
import roket from "../assets/images/roket.png";
import TextInput from "../pages/profile/components/TextInput"
import { FaFacebook, FaInstagram, FaLinkedin, FaYoutube } from "react-icons/fa";


function Footer() {
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");

    const handleSubscribe = async (e) => {
        e.preventDefault();
        if (!email) {
            setMessage("⚠️ Please enter a valid email.");
            return;
        }
        setLoading(true);
        setMessage("");

        try {
            const res = await axios.post(`${config.baseUrl}/contacts/subscribe/`, {
                email,
            });
            console.log(res.data);
            setMessage("✅ Successfully subscribed!");
            setEmail("");
        } catch (err) {
            if (err.response?.status === 400) {
                setMessage("⚠️ This email is already subscribed.");
            } else {
                setMessage("❌ Subscription failed. Try again later.");
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <footer className="bg-dark text-white p-4 mt-5" style={{ width: "100%" }}>
            <div className="row">
                <div className="col-md-3">
                    <img
                        src={logo}
                        alt="Logo"
                        style={{ height: "80px", objectFit: "cover" }}
                    />
                    <div className="mt-3 d-flex gap-3">
                        <a href="https://facebook.com" target="_blank" rel="noopener noreferrer">
                            <FaFacebook size={24} className="text-white" />
                        </a>
                        <a href="https://instagram.com" target="_blank" rel="noopener noreferrer">
                            <FaInstagram size={24} className="text-white" />
                        </a>
                        <a href="https://linkedin.com" target="_blank" rel="noopener noreferrer">
                            <FaLinkedin size={24} className="text-white" />
                        </a>
                        <a href="https://youtube.com" target="_blank" rel="noopener noreferrer">
                            <FaYoutube size={24} className="text-white" />
                        </a>
                    </div>
                </div>

                <div className="col-md-3">
                    <ul className="list-unstyled">
                        <li>
                            <a href="/" className="text-white text-decoration-none">
                                Home
                            </a>
                        </li>
                        <li>
                            <a
                                href="/shop"
                                className="text-white text-decoration-none"
                            >
                                Products
                            </a>
                        </li>
                        <li>
                            <a
                                href="/education"
                                className="text-white text-decoration-none"
                            >
                                Education
                            </a>
                        </li>
                        <li>
                            <a
                                href="/about-us"
                                className="text-white text-decoration-none"
                            >
                                About Us
                            </a>
                        </li>
                        <li>
                            <a
                                href="/contact-us"
                                className="text-white text-decoration-none"
                            >
                                Contact Us
                            </a>
                        </li>
                        <li>
                            <a href="/login" className="text-white text-decoration-none">
                                Login
                            </a>
                        </li>
                    </ul>
                </div>
                <div className="col-md-2">
                    <ul className="list-unstyled">
                        Services 🔻
                        <li>
                            <a href="/doctors" className="text-white text-decoration-none">
                                Doctor
                            </a>
                        </li>
                        <li>
                            <a
                                href="/nurses"
                                className="text-white text-decoration-none"
                            >
                                Nurse
                            </a>
                        </li>
                        <li>
                            <a href="/caregivers" className="text-white text-decoration-none">
                                Caregiver
                            </a>
                        </li>
                        <li>
                            <a href="/tests" className="text-white text-decoration-none">
                                Lab Test
                            </a>
                        </li>
                    </ul>
                </div>

                {/* Newsletter Subscribe */}
                <div className="col-md-4">
                    <form onSubmit={handleSubscribe}>
                        <label>Email for Newsletter:</label>
                        <TextInput
                            type="email"
                            className="form-control"
                            placeholder={"Enter your email"}
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            icon="email"

                        />
                        <button
                            type="submit"
                            className="btn btn-outline-light btn-sm "
                            disabled={loading}
                            style={{width: "50%"}}
                        >
                            {loading ? "Subscribing..." : "Subscribe"}
                        </button>
                        {message && <p className="mt-2 small">{message}</p>}
                    </form>
                </div>

                <div className="col-6 mt-3 text-start">
                    <p>&copy; 2025 LifeSheba. All rights reserved.</p>
                </div>

                <div className="col-6 mt-3 text-end">
                    <img
                        className="mx-2"
                        src={visa}
                        alt="Visa"
                        style={{ height: "30px" }}
                    />
                    <img
                        className="p-1 mx-2"
                        src={master}
                        alt="MasterCard"
                        style={{
                            height: "30px",
                            backgroundColor: "white",
                            objectFit: "cover",
                        }}
                    />
                    <img
                        className="p-1 mx-2"
                        src={american_express}
                        alt="American Express"
                        style={{
                            height: "30px",
                            backgroundColor: "white",
                            objectFit: "cover",
                        }}
                    />
                    <img
                        className="p-1 mx-2"
                        src={bkash}
                        alt="bKash"
                        style={{
                            height: "30px",
                            backgroundColor: "white",
                            objectFit: "cover",
                        }}
                    />
                    <img
                        className="p-1 mx-2"
                        src={nogod}
                        alt="Nagad"
                        style={{
                            height: "30px",
                            backgroundColor: "white",
                            objectFit: "cover",
                        }}
                    />
                    <img
                        className="p-1 mx-2"
                        src={roket}
                        alt="Rocket"
                        style={{
                            height: "30px",
                            backgroundColor: "white",
                            objectFit: "cover",
                        }}
                    />
                </div>
            </div>
        </footer>
    );
}

export default Footer;
