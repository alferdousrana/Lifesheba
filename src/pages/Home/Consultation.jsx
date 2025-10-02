import React from 'react';
import { useNavigate } from 'react-router-dom';

// Import different images for each category
import pediatricImg from '../../assets/images/doctorCat/pediatrician.png';
import gynoImg from '../../assets/images/doctorCat/gynaecologist.png';
import psychImg from '../../assets/images/doctorCat/psychiatrist.png';
import dermaImg from '../../assets/images/doctorCat/dermatologist.png';
import neuroImg from '../../assets/images/doctorCat/neurologist.png';
import orthoImg from '../../assets/images/doctorCat/orthopedic.png';
import dentistImg from '../../assets/images/doctorCat/dentist.png';
import bg from '../../assets/images/bg1.png';
import HoverZoom from "../components/HoverZoom";

function Consultation() {
    const navigate = useNavigate();

    const steps = [
        { number: "01", title: "Login", desc: "Login or Sign Up to your account" },
        { number: "02", title: "Book Appointment", desc: "Choose a doctor and time slot" },
        { number: "03", title: "Start Consultation", desc: "Join the video call with your doctor" },
        { number: "04", title: "Receive Medication", desc: "Get medication delivered to your home" },
    ];

    const categories = [
        { title: "Medicine", img: pediatricImg },
        { title: "Gynecologist", img: gynoImg },
        { title: "Psychiatrist", img: psychImg },
        { title: "Dermatologist", img: dermaImg },
        { title: "Neurologist", img: neuroImg },
        { title: "Orthopedic", img: orthoImg },
        { title: "Dentist", img: dentistImg },
    ];

    return (
        <div style={{
            backgroundImage: `url(${bg})`,
            backgroundSize: 'cover',
            backgroundRepeat: 'no-repeat',
            backgroundPosition: 'center'
        }}>
            <div className='container' style={{ marginTop: '70px' }}>
                {/* Steps section */}
                <div className="bg-white p-4 rounded mb-5 text-center"
                    style={{
                        boxShadow: '0 8px 24px rgba(0,0,0,0.18)',
                        borderRadius: '16px',
                    }}>
                    <h3 className="fw-bold mb-2">Online Consultation in 4 Easy Steps</h3>
                    <p className="text-muted mb-4">
                        Get the care you need by following these simple steps
                    </p>

                    <div className="row text-center">
                        {steps.map((step, idx) => (
                            <div key={idx} className="col-6 col-md-3 mb-3">
                                <h2 className="text-primary">{step.number}</h2>
                                <h5 className="fw-bold">{step.title}</h5>
                                {step.number === "01" ? (
                                    <p className="text-muted">
                                        <span
                                            onClick={() => navigate('/login')}
                                            style={{ color: '#1a73e8', cursor: 'pointer', fontWeight: 500 }}
                                        >
                                            Login
                                        </span>
                                        {' '}or{' '}
                                        <span
                                            onClick={() => navigate('/register')}
                                            style={{ color: '#1a73e8', cursor: 'pointer', fontWeight: 500 }}
                                        >
                                            Sign Up
                                        </span>
                                        {' '}to your account
                                    </p>
                                ) : (
                                    <p className="text-muted">{step.desc}</p>
                                )}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Categories section */}
                <div className="p-4 rounded">
                    <div className="d-flex justify-content-between align-items-center mb-3">
                        <h4 className="fw-bold">Book Specialist Appointment</h4>
                        <span
                            onClick={() => navigate("/doctors")}
                            style={{ cursor: "pointer", color: "#08ABBD", fontWeight: "500" }}
                        >
                            See All →
                        </span>
                    </div>

                    <div
                        className="scroll-wrapper"
                        style={{
                            display: 'flex',
                            gap: '15px',
                            overflowX: 'auto',
                            paddingBottom: '10px',
                        }}
                    >
                        {categories.map((category, index) => (
                            <div
                                key={index}
                                onClick={() => navigate(`/doctors?specialization=${category.title}`)}
                                className="card hover-parent"
                                style={{
                                    minWidth: '280px',
                                    cursor: 'pointer',
                                    borderRadius: '8px',
                                    backgroundColor: '#fff',
                                    boxShadow: '0 2px 6px rgba(0,0,0,0.1)',
                                    overflow: 'hidden',
                                    textAlign: 'center',
                                    flexShrink: 0,
                                }}
                            >
                                <HoverZoom scale={1.1} triggerParentHover={true}>
                                    <img
                                        src={category.img}
                                        alt={category.title}
                                        style={{ width: '100%', height: '160px', objectFit: 'cover' }}
                                    />
                                </HoverZoom>
                                <div className="p-2 fw-bold">{category.title}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Scrollbar hover style */}
            <style>
                {`
                    .scroll-wrapper {
                        scrollbar-width: none; /* Firefox */
                    }
                    .scroll-wrapper::-webkit-scrollbar {
                        height: 0px;
                    }
                    .scroll-wrapper:hover::-webkit-scrollbar {
                        height: 6px;
                    }
                    .scroll-wrapper:hover::-webkit-scrollbar-thumb {
                        background-color: #ccc;
                        border-radius: 10px;
                    }
                    .scroll-wrapper:hover {
                        scrollbar-width: thin;
                    }

                    /* Optional: card hover effect */
                    .hover-parent:hover {
                        box-shadow: 0 6px 16px rgba(0,0,0,0.15);
                        transition: box-shadow 0.3s ease;
                    }
                `}
            </style>
        </div>
    );
}

export default Consultation;
