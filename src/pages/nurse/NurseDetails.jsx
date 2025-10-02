import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { config } from '../../config';

function NurseDetails() {
    const { slug } = useParams();
    const { baseUrl } = config;
    const [nurse, setNurse] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchNurse = async () => {
            try {
                const response = await axios.get(`${baseUrl}/nurses/${slug}/`);
                setNurse(response.data);
            } catch (error) {
                console.error('Error fetching nurse details:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchNurse();
    }, [slug, baseUrl]);

    if (loading) {
        return <div className="text-center mt-5">Loading...</div>;
    }

    if (!nurse) {
        return <div className="text-center mt-5">Nurse not found</div>;
    }

    return (
        <div className="container my-5">
            <h3 className="text-center text-info mb-4">Nurse Details Information</h3>

            <div className="d-flex justify-content-center">
                <div className="row w-100 justify-content-center">
                    {/* Image Column */}
                    <div className="col-12 col-md-5 text-end mb-4 mb-md-0">
                        <img
                            src={
                                nurse.profile?.profile_picture
                                    ? `${baseUrl.replace("/api", "")}/${nurse.profile.profile_picture}`
                                    : 'https://developers.elementor.com/docs/assets/img/elementor-placeholder-image.png'
                            }
                            alt="Nurse"
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
                            {nurse.profile?.full_name || `Dr. ${nurse.user?.username}`}
                        </h4>

                        <p><strong>Education:</strong> {nurse.education}</p>
                        <p><strong>Training:</strong> {nurse.training}</p>
                        <p><strong>Training Result:</strong> {nurse.training_result}</p>
                        <p><strong>Working At:</strong> {nurse.work_place}</p>
                        <p><strong>Years of Experience:</strong> {nurse.experience || 'N/A'} years</p>

                        <p>
                            <strong>Status: </strong>
                            <span
                                className={`badge ${nurse.availability_status === 'AVAILABLE'
                                    ? 'bg-success'
                                    : 'bg-secondary'
                                    }`}
                            >
                                {nurse.availability_status}
                            </span>
                        </p>

                        {/* Schedule Section */}
                        {nurse.available_slots?.length > 0 && (
                            <>
                                <h5 className="mt-4">Available Schedule</h5>
                                <ul>
                                    {nurse.available_slots.map((slot, index) => (
                                        <li key={index}>
                                            {slot.day} - {slot.slot} ({slot.date})
                                        </li>
                                    ))}
                                </ul>
                            </>
                        )}
                    </div>

                    {/* Back + Book Buttons */}
                    <div className="col-12 text-center mt-4 d-flex flex-column align-items-center gap-3">


                        {/* ✅ Book Now button */}
                        <button
                            style={{ maxWidth: '300px', width: '100%' }}
                            className="btn btn-primary"
                            onClick={() => navigate(`/booking/nurse/${nurse.profile.slug}`)} 
                        >
                            Book Now
                        </button>
                        <button
                            style={{ maxWidth: '300px', width: '100%' }}
                            className="btn btn-outline-secondary"
                            onClick={() => navigate('/nurses')}
                        >
                            Go Back
                        </button>
                    </div>

                </div>
            </div>
        </div>
    );
}

export default NurseDetails;
