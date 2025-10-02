// src/pages/Home/HomeTestimonial.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";
import { config } from "../../config";
import { FaStar } from "react-icons/fa";

function HomeTestimonial() {
    const { baseUrl } = config;
    const [testimonials, setTestimonials] = useState([]);
    const [current, setCurrent] = useState(0);

    useEffect(() => {
        axios
            .get(`${baseUrl}/testimonials/`)
            .then((res) => {
                const data = res.data.results || res.data;
                // oldest first show -> sort by created_at ascending
                const sorted = [...data].sort(
                    (a, b) => new Date(a.created_at) - new Date(b.created_at)
                );
                setTestimonials(sorted || []);
                setCurrent(0); // start with first testimonial
            })
            .catch((err) => console.error("Failed to fetch testimonials:", err));
    }, [baseUrl]);

    const getImageUrl = (path) => {
        if (!path) return "https://via.placeholder.com/80";
        return path.startsWith("http")
            ? path
            : `${baseUrl.replace("/api", "")}${path}`;
    };

    const nextSlide = () => {
        if (testimonials.length > 0) {
            setCurrent((prev) => (prev + 1) % testimonials.length);
        }
    };

    const prevSlide = () => {
        if (testimonials.length > 0) {
            setCurrent((prev) =>
                prev === 0 ? testimonials.length - 1 : prev - 1
            );
        }
    };


    useEffect(() => {
        if (testimonials.length > 0) {
            const interval = setInterval(() => {
                setCurrent((prev) => (prev + 1) % testimonials.length);
            }, 10000);
            return () => clearInterval(interval);
        }
    }, [testimonials]);

    if (testimonials.length === 0) return null;

    const prevIndex = current === 0 ? testimonials.length - 1 : current - 1;
    const nextIndex = (current + 1) % testimonials.length;

    const visible = [
        testimonials[prevIndex],
        testimonials[current],
        testimonials[nextIndex],
    ];

    return (
        <div
            className="testimonial-section py-5"
            style={{
                background: "linear-gradient(90deg, #a8edea 0%, #fed6e3 100%)",
                width: "100%",
            }}
        >
            <div className="container">
                <h2 className="text-center" style={{ marginBottom: "80px" }}>
                    Testimonials
                </h2>

                <div className="d-flex justify-content-center align-items-center position-relative">
                    {/* Prev Button */}
                    <button
                        onClick={prevSlide}
                        className="btn rounded-circle position-absolute"
                        style={{
                            left: "31%",
                            top: "50%",
                            transform: "translateY(-50%) rotate(180deg)",
                            zIndex: 3,
                            width: "45px",
                            height: "45px",
                            backgroundColor: "#08ABBD",
                            color: "#fff",
                        }}
                    >
                        &#10148;
                    </button>

                    {/* 3 Testimonials */}
                    <div className="d-flex justify-content-center gap-4">
                        {visible.map((item, idx) => (
                            <div
                                key={idx}
                                className="card shadow text-center p-4 position-relative"
                                style={{
                                    width: idx === 1 ? "400px" : "340px",
                                    height: "355px",
                                    borderRadius: "20px",
                                    background: "#fff",
                                    transform:
                                        idx === 1 ? "scale(1.05)" : "scale(0.9)",
                                    transition: "0.4s",
                                    overflow: "visible",
                                }}
                            >
                                {/* Avatar */}
                                <img
                                    src={getImageUrl(item.avatar)}
                                    alt={item.name}
                                    className="rounded-circle mx-auto"
                                    style={{
                                        width: "90px",
                                        height: "90px",
                                        objectFit: "cover",
                                        border: "4px solid #08ABBD",
                                        position: "absolute",
                                        top: "-45px",
                                        left: "50%",
                                        transform: "translateX(-50%)",
                                        background: "#fff",
                                    }}
                                />

                                {/* Space for avatar */}
                                <div style={{ marginTop: "50px" }}></div>

                                <h6 style={{ fontSize: "16px", fontWeight: "bold" }}>
                                    {item.name}
                                </h6>

                                {/* Rating */}
                                <div className="mb-2">
                                    {[...Array(5)].map((_, i) => (
                                        <FaStar
                                            key={i}
                                            size={16}
                                            color={
                                                i < item.rating ? "#ab3ab4ff" : "#ddd"
                                            }
                                        />
                                    ))}
                                </div>

                                <p
                                    style={{
                                        fontStyle: "italic",
                                        color: "#555",
                                        fontSize: "13px",
                                        lineHeight: "1.4em",
                                        overflow: "hidden",
                                        textOverflow: "ellipsis",
                                    }}
                                >
                                    "{item.feedback}"
                                </p>
                            </div>
                        ))}
                    </div>

                    {/* Next Button */}
                    <button
                        onClick={nextSlide}
                        className="btn rounded-circle position-absolute"
                        style={{
                            right: "31%",
                            top: "50%",
                            transform: "translateY(-50%)",
                            zIndex: 3,
                            width: "45px",
                            height: "45px",
                            backgroundColor: "#08ABBD",
                            color: "#fff",
                        }}
                    >
                        &#10148;
                    </button>
                </div>
            </div>
        </div>
    );
}

export default HomeTestimonial;
