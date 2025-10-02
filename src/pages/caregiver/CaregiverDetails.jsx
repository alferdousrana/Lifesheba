import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { config } from '../../config';

function CaregiverDetails() {
    const { slug } = useParams();
    const { baseUrl } = config;
    const [caregiver, setCaregiver] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchCaregiver = async () => {
            try {
                const response = await axios.get(`${baseUrl}/caregivers/${slug}/`);
                setCaregiver(response.data);
            } catch (error) {
                console.error('Error fetching caregiver details:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchCaregiver();
    }, [slug, baseUrl]);

    if (loading) {
        return <div className="text-center mt-5">Loading...</div>;
    }

    if (!caregiver) {
        return <div className="text-center mt-5">Caregiver not found</div>;
    }

    return (
        <div className="container my-5">
            <h3 className="text-center text-info mb-4">
                Caregiver Details Information
            </h3>

            <div className="d-flex justify-content-center">
                <div className="row w-100 justify-content-center">
                    {/* Image Column */}
                    <div className="col-12 col-md-5 text-center mb-4 mb-md-0">
                        <img
                            src={
                                caregiver.user?.profile_picture
                                    ? caregiver.user.profile_picture
                                    : 'https://developers.elementor.com/docs/assets/img/elementor-placeholder-image.png'
                            }
                            alt="Caregiver"
                            className="img-fluid rounded shadow-sm"
                            style={{
                                maxWidth: '100%',
                                height: '300px',
                                borderRadius: '12px',
                                objectFit: 'cover',
                            }}
                        />
                    </div>

                    {/* Info Column */}
                    <div className="col-12 col-md-5">
                        <h4 className="fw-semibold mb-3">
                            {caregiver.user?.full_name || caregiver.user?.username}
                        </h4>

                        <p><strong>Education:</strong> {caregiver.education}</p>
                        <p><strong>Training:</strong> {caregiver.training}</p>
                        <p><strong>Training Result:</strong> {caregiver.training_result}</p>
                        <p><strong>Experience:</strong> {caregiver.experience || 'N/A'}</p>

                        <p>
                            <strong>Status: </strong>
                            <span
                                className={`badge ${caregiver.availability_status === 'AVAILABLE'
                                    ? 'bg-success'
                                    : 'bg-secondary'
                                    }`}
                            >
                                {caregiver.availability_status}
                            </span>
                        </p>
                    </div>

                    {/* Buttons */}
                    <div className="col-12 text-center mt-4 d-flex flex-column align-items-center gap-3">


                        {/* ✅ Book Now button */}
                        <button
                            style={{ maxWidth: '300px', width: '100%' }}
                            className="btn btn-primary"
                            onClick={() => navigate(`/booking/caregiver/${caregiver.slug}`)}
                        >
                            Book Now
                        </button>
                        <button
                            style={{ maxWidth: '300px', width: '100%' }}
                            className="btn btn-outline-secondary"
                            onClick={() => navigate('/caregivers')}
                        >
                            Go Back
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default CaregiverDetails;
