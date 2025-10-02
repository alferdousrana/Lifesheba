import React from 'react';
import studentImage from '../../assets/images/studentbenefits.png'; // adjust the path if needed
import { useNavigate } from 'react-router-dom';

function StudentBenefits() {

    const navigate = useNavigate();

    return (
        <div
            style={{
                display: 'flex',
                alignItems: 'center',
                backgroundColor: '#eaf4fc',
                padding: '20px 20px',
                borderRadius: '8px',
                position: 'relative',
                marginTop:'80px',
                marginBottom:'20px',
                
                
            }}
            
        >
            {/* Left: Image */}
            <div style={{ flex: 1, display: 'flex', justifyContent: 'center' }}>
                <img
                    src={studentImage}
                    alt="Student Benefits"
                    style={{
                        maxHeight: '350px',
                        borderRadius: '10px',
                        objectFit: 'contain',
                        marginTop: '-50px', // this will push the image out of the top
                        zIndex: 1,
                    }}
                />

            </div>

            {/* Right: Text Content */}
            <div style={{ flex: 2, paddingLeft: '30px' }}>
                <h3 className="fw-bold">Student Benefits Programs</h3>
                <p style={{ fontSize: '16px', color: '#333', maxWidth: '600px' }}>
                    Provide students with access to quality healthcare at affordable rates.
                    Our tailored packages ensure better health and peace of mind while helping
                    institutions reduce overhead costs.
                </p>
                <button
                    style={{
                        backgroundColor: '#1a73e8',
                        color: '#fff',
                        padding: '10px 20px',
                        fontSize: '16px',
                        border: 'none',
                        borderRadius: '5px',
                        cursor: 'pointer',
                        marginTop: '10px',
                    }}
                    onClick={() => navigate('/register')}
                >
                    Click for Register!
                </button>
            </div>

            {/* Decorative Circles (Right side background) */}
            <div
                style={{
                    position: 'absolute',
                    right: '-120px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    width: '300px',
                    height: '300px',
                    borderRadius: '50%',
                    backgroundColor: '#d4eafd',
                }}
            >
                <div
                    style={{
                        position: 'absolute',
                        right: '40px',
                        top: '50%',
                        transform: 'translateY(-50%)',
                        width: '200px',
                        height: '200px',
                        borderRadius: '50%',
                        backgroundColor: '#9cd2ff',
                    }}
                >
                    <div
                        style={{
                            position: 'absolute',
                            right: '40px',
                            top: '50%',
                            transform: 'translateY(-50%)',
                            width: '100px',
                            height: '100px',
                            borderRadius: '50%',
                            backgroundColor: '#2e90fa',
                        }}
                    />
                </div>
            </div>
        </div>
    );
}

export default StudentBenefits;
