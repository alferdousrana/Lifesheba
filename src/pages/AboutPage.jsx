import React, { useState, useEffect } from 'react';
import { FaMapMarkerAlt, FaPhone, FaEnvelope } from 'react-icons/fa';
import partner1 from '../assets/images/partners/1.png';
import partner2 from '../assets/images/partners/2.png';
import partner3 from '../assets/images/partners/3.png';
import partner4 from '../assets/images/partners/4.png';
import partner5 from '../assets/images/partners/5.png';
import partner6 from '../assets/images/partners/6.png';
import career_doctor from '../assets/images/career/career_doctor.jpg';
import career_nurse from '../assets/images/career/career_nurse.jpg';
import career_caregiver from '../assets/images/career/career_caregiver.jpg';
import career_lab_tech from '../assets/images/career/career_lab_tech.jpg';
import career_delivery from '../assets/images/career/career_delivery.jpg';
import rana_profile from '../assets/images/rana_profile_image.jpg';
import nahida_profile from '../assets/images/nahida_profile_image.jpg';
import '../App.css';
import FAQ from '../components/FAQ';

const partnerLogos = [partner1, partner2, partner3, partner4, partner5, partner6];

const useCounter = (end, duration = 1000) => {
    const [count, setCount] = useState(0);
    useEffect(() => {
        let start = 0;
        const increment = end / (duration / 10);
        const interval = setInterval(() => {
            start += increment;
            if (start >= end) {
                setCount(end);
                clearInterval(interval);
            } else {
                setCount(Math.ceil(start));
            }
        }, 5);
        return () => clearInterval(interval);
    }, [end, duration]);
    return count;
};

const careerContent = {
    Doctor: {
        image: career_doctor,
        text: 'Join our team of expert doctors who are transforming digital healthcare access across Bangladesh. Contribute to meaningful patient care and clinical excellence.',
        button: 'Apply as Doctor'
    },
    Nurse: {
        image: career_nurse,
        text: 'Our nurses are at the heart of our care delivery. If you have passion and compassion, Life Sheba welcomes you to make a difference.',
        button: 'Join as Nurse'
    },
    Caregiver: {
        image: career_caregiver,
        text: 'Caregivers provide essential support to our patients. Join us and be a companion in someone’s health journey.',
        button: 'Become a Caregiver'
    },
    Technician: {
        image: career_lab_tech,
        text: 'Are you a skilled lab or health technician? Help us ensure accurate diagnostics and home sample collection.',
        button: 'Start as Technician'
    },
    'Delivery Agent': {
        image: career_delivery,
        text: 'Ensure life-saving medicines reach on time. Become a trusted delivery partner in our growing network.',
        button: 'Join as Delivery Agent'
    }
};

function AboutPage() {
    const [selectedCareer, setSelectedCareer] = useState(null);
    const patients = useCounter(70000);
    const partners = useCounter(15);
    const staff = useCounter(100);
    const years = useCounter(5);
    

    return (
        <div className="container my-3">
            <section className="company-overview-box">
                <h1 className="about-heading">Company Overview</h1>
            </section>


            {/* About */}
            <section className="mb-5 p-4" >
                <div className="row align-items-center">
                    <div className="col-md-6">
                        <h2 className="text-primary">Life Sheba: A Healthy Life for Millions</h2>
                        <p>We provide affordable, comprehensive healthcare—doctor consultations, home care, lab services, and medicine delivery—through a single platform.</p>
                        <ul>
                            <li>24/7 Specialist Consultation</li>
                            <li>At-home Health Checkups</li>
                            <li>Lab Sample Collection</li>
                            <li>Medicine Delivery</li>
                            <li>Digital Health Tracking</li>
                        </ul>
                    </div>
                    <div className="col-md-6">
                        <img className="img-fluid rounded" src="https://beehealthy.com/wp-content/uploads/2025/06/hero-team-all-1920x1280-1-1-Large.jpeg" alt="About" style={{ height: '300px', width: '600px', objectFit: 'cover' }} />
                    </div>
                </div>
            </section>

            {/* Statistics */}
            <section className="mb-5">
                <div className="row text-center">
                    <div className="col-md-3"><h1 className="text-success fw-bold">{patients}+</h1><p>Patients Served</p></div>
                    <div className="col-md-3"><h1 className="text-primary fw-bold">{partners}+</h1><p>Partner Clinics</p></div>
                    <div className="col-md-3"><h1 className="text-warning fw-bold">{staff}+</h1><p>Healthcare Staff</p></div>
                    <div className="col-md-3"><h1 className="text-purple fw-bold">{years}+</h1><p>Years of Service</p></div>
                </div>
            </section>

            {/* Mission & Vision */}
            <section className="mb-5">
                <div className="row">
                    <div className="col-md-6 mb-3">
                        <div className="p-4" style={{ backgroundColor: '#e5f5f5', borderRadius: '8px' }}>
                            <h3 className="text-dark fw-bold">Mission</h3>
                            <p>To ensure top-notch healthcare for every diabetic patient and enable a healthier nation.</p>
                        </div>
                    </div>
                    <div className="col-md-6 mb-3">
                        <div className="p-4" style={{ backgroundColor: '#e8f5e9', borderRadius: '8px' }}>
                            <h3 className="text-dark fw-bold">Vision</h3>
                            <p>A 360° diabetes care platform that delivers lifestyle education, consultation, and medicine to every doorstep.</p>
                        </div>
                    </div>
                </div>
            </section>

            {/* Team */}
            <section className="mb-5">
                <div className="text-center mb-4">
                    <h3 className="text-success fw-bold">Our Leadership</h3>
                </div>
                <div className="row">
                    <div className="col-md-6 mb-3">
                        <div className="d-flex align-items-center gap-3">
                            <img src={rana_profile} alt="Al Ferdous" className="img-fluid rounded" style={{ width: '150px', height: '180px', objectFit: 'cover' }} />
                            <div>
                                <h5 className="mb-1">Md. Al Ferdous</h5>
                                <p className="mb-1 text-muted">Chief Technology Officer, Life Sheba</p>
                                <p className="mb-1 text-muted">Backend Engineer</p>
                                <p className="mb-1"><FaPhone className="me-2 text-success" /> +8801711111111</p>
                                <p className="mb-1"><FaEnvelope className="me-2 text-danger" /> alferdous@lifesheba.com</p>
                                <p style={{ fontSize: '0.875rem', color: '#555' }}>
                                    Al leads innovation with 5+ years in IT and 2+ years in healthcare, driving accessible tech solutions.
                                </p>
                            </div>
                        </div>
                    </div>
                    <div className="col-md-6 mb-3">
                        <div className="d-flex align-items-center gap-3">
                            <img src={nahida_profile} alt="Nahida Haque" className="img-fluid rounded" style={{ width: '150px', height: '180px', objectFit: 'cover' }} />
                            <div>
                                <h5 className="mb-1">Nahida Haque</h5>
                                <p className="mb-1 text-muted">Senior Technology Officer, Life Sheba</p>
                                <p className="mb-1 text-muted">Frontend Engineer</p>
                                <p className="mb-1"><FaPhone className="me-2 text-success" /> +8801711111111</p>
                                <p className="mb-1"><FaEnvelope className="me-2 text-danger" /> nahida@lifesheba.com</p>
                                <p style={{ fontSize: '0.875rem', color: '#555' }}>
                                    With 5+ years of tech ops experience, Nahida ensures seamless and scalable healthcare delivery.
                                </p>
                            </div>
                        </div>
                    </div>
                </div>
            </section>



            {/* Career Section */}
            <section className="mb-5">
                <div className="text-center mb-3">
                    <h3 className="text-primary fw-bold mb-4">Career Opportunities</h3>
                    <div className="d-flex flex-wrap justify-content-center gap-3">
                        {Object.keys(careerContent).map((role) => (
                            <button
                                key={role}
                                className={`btn btn-outline-primary ${selectedCareer === role ? 'active' : ''}`}
                                onClick={() => setSelectedCareer(selectedCareer === role ? null : role)}
                                style={{ minWidth: '160px', fontWeight: 'bold' }}
                            >
                                {role} Career
                            </button>
                        ))}
                    </div>
                </div>
                {selectedCareer && (
                    <div className="row mt-4 align-items-center" style={{ backgroundColor: '#fff8e1', borderRadius: '8px', padding: '20px' }}>
                        <div className="col-md-5">
                            <img src={careerContent[selectedCareer].image} alt={selectedCareer} className="img-fluid rounded" style={{ height: '400px', objectFit: 'cover' }} />
                        </div>
                        <div className="col-md-7">
                            <h4 className="text-dark">{selectedCareer} Opportunity</h4>
                            <p>{careerContent[selectedCareer].text}</p>

                            <button
                                className="btn btn-warning"
                                onClick={() => window.open("https://forms.gle/zYPPPwjom9uEvkkw9", "_blank")}
                            >
                                {careerContent[selectedCareer].button}
                            </button>

                        </div>
                    </div>
                )}
            </section>

            {/* Partners */}
            <section className="mb-5 py-4">
                <h3 className="text-center fw-bold text-danger mb-4">Our Partners</h3>
                <div className="overflow-hidden">
                    <div className="d-flex align-items-center" style={{ animation: 'scroll 60s linear infinite', gap: '100px', whiteSpace: 'nowrap' }}>
                        {partnerLogos.map((logo, index) => (
                            <img
                                key={index}
                                src={logo}
                                alt={`Partner ${index + 1}`}
                                style={{ height: '60px', filter: 'grayscale(0%)' }}
                            />
                        ))}
                    </div>
                </div>
            </section>

            {/* FAQ Section */}
            <section className="mb-5 mt-5">
                <FAQ />
            </section>


            {/* Address */}
            <section className="p-4" style={{ backgroundColor: "#e0f7fa", borderRadius: "8px" }}>
                <div className="row">
                    {/* Left side - Address */}
                    <div className="col-md-6 mb-3">
                        <h3 className="text-dark mb-3">Our Office</h3>
                        <p>
                            <FaMapMarkerAlt className="me-2 text-info" />
                            House 274, Road 11, Kashipur, Barishal 8600
                        </p>
                        <p>
                            <FaPhone className="me-2 text-success" /> +8801767457345
                        </p>
                        <p>
                            <FaEnvelope className="me-2 text-danger" /> hello@lifesheba.com / lifesheba@gmail.com
                        </p>
                    </div>

                    {/* Right side - Google Map */}
                    <div className="col-md-6">
                        <div style={{ borderRadius: "8px", overflow: "hidden" }}>
                            <iframe
                                title="Lifesheba Office Location"
                                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d7297.802795962201!2d90.3551389!3d22.7010026!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x30aaffc5480f6f4d%3A0xdcb7555e32f6bb43!2sKashipur%2C%20Barishal!5e0!3m2!1sen!2sbd!4v1693659822763!5m2!1sen!2sbd"
                                width="100%"
                                height="250"
                                style={{ border: 0 }}
                                allowFullScreen=""
                                loading="lazy"
                                referrerPolicy="no-referrer-when-downgrade"
                            ></iframe>
                        </div>
                    </div>
                </div>
            </section>

            {/* Custom styles */}
            <style>{`
                @keyframes scroll {
                    0% { transform: translateX(100%); }
                    100% { transform: translateX(-100%); }
                }
                .text-purple { color: #8e24aa; }
            `}</style>
        </div>
    );
}

export default AboutPage;
