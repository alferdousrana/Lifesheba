import React from 'react';
import { Link } from 'react-router-dom';
import doctor from '../../assets/images/doctor.png';
import medicine from '../../assets/images/medicine.png';
import nurse from '../../assets/images/nurse.png';
import caregiver from '../../assets/images/caregiver.png';
import test from '../../assets/images/test.png';
import education from '../../assets/images/education.png';

function Tiles() {
    const tiles = [
        { label: 'Pharmacy', sub: 'Order medicines delivered to, your doorstep', tag: 'ONLINE', bg: '#d2edf7', image: medicine, link: '/shop' },
        { label: "Doctor, Consultation", sub: 'Video consult with certified, doctors anytime', tag: 'ONLINE', bg: '#ffb9b7ff', image: doctor, link: '/doctors' },
        { label: 'Online Nurse, Booking', sub: 'Hire trained nurses for home care', tag: 'POPULAR', bg: '#efddf8ff', image: nurse, link: '/nurses' },
        { label: 'Book Your, Caregiver', sub: 'Get reliable caregiving at, your home', tag: 'JUST IN', bg: '#f7efd2ff', image: caregiver, link: '/caregivers' },
        { label: 'Health Screening, Packages', sub: 'Book lab tests and checkup packages', tag: 'CHECKUP', bg: '#a6e3e9', image: test, link: '/tests' },
        { label: 'Online Health,Education', sub: 'Learn health topics from, verified experts', tag: 'HEALTH@EDU', bg: '#b2dfdb', image: education, link: '/education' },
    ];
    
    return(

        <div className="row g-4">
            {tiles.map((tile, index) => (
                <div className="col-12 col-sm-6 col-md-4 col-lg-4" key={index}>
                    <Link to={tile.link} style={{ textDecoration: 'none' }}>
                        <div
                            className="ps-3 rounded shadow-sm"
                            style={{
                                backgroundColor: tile.bg,
                                height: '200px',
                                display: 'flex',
                                flexDirection: 'column',
                                justifyContent: 'center',
                                position: 'relative',
                                overflow: 'hidden',
                                border: '4px solid #ffffff',
                                color: 'black',
                                backgroundImage: `url(${tile.image})`,
                                backgroundPosition: 'right',
                                backgroundRepeat: 'no-repeat',
                                transition: 'transform 0.4s ease-in-out',
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.transform = 'scale(1.06)'; // 🟢 Zoom in
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.transform = 'scale(1)'; // 🔙 Reset
                            }}
                        >
                            <div
                                style={{
                                    position: 'absolute',
                                    top: '10px',
                                    left: '10px',
                                    backgroundColor: '#A4449D',
                                    color: 'white',
                                    fontSize: '0.75rem',
                                    fontWeight: 'bold',
                                    padding: '2px 6px',
                                    borderRadius: '4px',
                                    textTransform: 'uppercase',
                                    

                                }}
                            >
                                {tile.tag}
                            </div>
                            <div
                                style={{
                                    fontSize: '1.4rem',
                                    fontWeight: 'bold',
                                    marginTop: '2rem',
                                    lineHeight: '1'
                                }}
                            >
                                {tile.label.split(',').map((word, idx) => (
                                    <React.Fragment key={idx}>
                                        {word}
                                        <br />
                                    </React.Fragment>
                                ))}
                            </div>
                            <div
                                style={{
                                    fontSize: '0.9rem',
                                    fontWeight: 'normal',
                                    lineHeight: '1',
                                    marginTop:'10px'

                                }}
                            >
                                {tile.sub.split(',').map((word, idx) => (
                                    <React.Fragment key={idx}>
                                        {word}
                                        <br />
                                    </React.Fragment>
                                ))}
                            </div>
                            {/* Image */}

                        </div>
                    </Link>
                </div>
            ))}
        </div>

    );

}

export default Tiles;