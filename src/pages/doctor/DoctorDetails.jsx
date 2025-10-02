// src/pages/doctor/DoctorDetails.jsx
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { config } from '../../config';
import PropTypes from 'prop-types';

function DoctorDetails() {
    const { slug } = useParams();
    const { baseUrl } = config;
    const [doctor, setDoctor] = useState(null);
    const [schedules, setSchedules] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    // Helper to format times
    const formatTimeRange = (start, end) => {
        if (!start || !end) return null;

        const formatTime = (timeString) => {
            const [hours, minutes] = timeString.split(':');
            const date = new Date();
            date.setHours(parseInt(hours, 10), parseInt(minutes, 10));
            return date.toLocaleTimeString('en-US', {
                hour: 'numeric',
                minute: '2-digit',
                hour12: true,
            });
        };

        return `${formatTime(start)} - ${formatTime(end)}`;
    };

    useEffect(() => {
        const fetchDoctor = async () => {
            try {
                const response = await axios.get(`${baseUrl}/doctors/${slug}/`);
                setDoctor(response.data);

                // Fetch schedules endpoint (assumed available)
                const schedulesResponse = await axios.get(`${baseUrl}/doctors/${slug}/schedules/`);
                // Handle paginated or non-paginated response
                const schedulesData = schedulesResponse.data.results || schedulesResponse.data || [];
                setSchedules(Array.isArray(schedulesData) ? schedulesData : []);
            } catch (error) {
                console.error('Error fetching doctor details:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchDoctor();
    }, [slug, baseUrl]);

    if (loading) return <div className="text-center mt-5">Loading...</div>;
    if (!doctor) return <div className="text-center mt-5">Doctor not found</div>;

    // Build schedule days array from schedules (e.g., ["sunday", "monday", ...])
    // Assume each schedule item has a `day` field like "Sunday"
    const scheduleDays = schedules
        .map(s => s.day)
        .filter(Boolean)
        .map(d => d.toString().toLowerCase());

    // When user clicks Book Appointment, navigate to Appointment page and pass required data
    const handleBookClick = () => {
        navigate(`/doctor-appointments/${slug}`, {
            state: {
                doctor_id: doctor.id,
                doctor_name: doctor.profile?.full_name || `Dr. ${doctor.user?.username}`,
                fees: doctor.fees,
                followUp_fees: doctor.followUp_fees,
                schedule_days: scheduleDays,
                specialization: doctor.specialization,
                // optionally pass additional quick-info:
                avatar: doctor.profile?.profile_picture ? `${baseUrl}${doctor.profile.profile_picture}` : null,
            }
        });
    };

    return (
        <div className="container my-5">
            <h3 className="text-center fw-bold mb-4" style={{ color: '#A4449D' }}>
                Doctor Details Information
            </h3>

            <div className="row align-items-start">
                <div className="col-md-4 text-center">
                    <img
                        src={
                            doctor.profile?.profile_picture
                                ? `${baseUrl.replace("/api", "")}/${doctor.profile.profile_picture}`
                                : 'https://developers.elementor.com/docs/assets/img/elementor-placeholder-image.png'
                        }
                        alt="Doctor"
                        style={{
                            width: '100%',
                            maxWidth: 400,
                            maxHeight: 380,
                            borderRadius: 10,
                            objectFit: 'cover',
                            background: '#e2d2dbff',
                        }}
                    />

                </div>

                <div className="col-md-4">
                    <h4 className="fw-semibold">
                        {doctor.profile?.full_name || `Dr. ${doctor.user?.username}`}
                    </h4>
                    <p><strong>Degree:</strong> {doctor.degree || 'N/A'}</p>
                    <p><strong>Designation:</strong> {doctor.designation || 'N/A'}</p>
                    <p><strong>Consultation Fee (New):</strong> {doctor.fees ? `${doctor.fees} Tk` : 'N/A'}</p>
                    <p><strong>Follow-up Fee:</strong> {doctor.followUp_fees ? `${doctor.followUp_fees} Tk` : 'N/A'}</p>
                    <p><strong>Specialization:</strong> {doctor.specialization || 'N/A'}</p>
                    <p><strong>Chamber Address:</strong> {doctor.chamber_address || 'N/A'}</p>
                    <p>
                        <strong>Status: </strong>
                        <span className={`badge ${doctor.availability_status === 'AVAILABLE' ? 'bg-success' : 'bg-secondary'}`}>
                            {doctor.availability_status}
                        </span>
                    </p>
                </div>

                <div className="col-md-4">
                    {doctor.about_doctor && (
                        <div className="mb-4">
                            <p><strong>About Doctor:</strong> {doctor.about_doctor}</p>
                        </div>
                    )}

                    <div className="mt-4">
                        <h5 className="mb-3" style={{ color: '#000' }}>Available Online Schedule</h5>
                        {schedules.length > 0 ? (
                            <div className="table-responsive">
                                <table className="table table-bordered table-striped table-sm">
                                    <thead>
                                        <tr>
                                            <th style={{ fontSize: '0.85rem', background: '#A4449D', color: 'white' }}>Day</th>
                                            <th style={{ fontSize: '0.85rem', background: '#A4449D', color: 'white' }}>Morning</th>
                                            <th style={{ fontSize: '0.85rem', background: '#A4449D', color: 'white' }}>Evening</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {schedules.map((schedule, index) => (
                                            <tr key={schedule.id || index}>
                                                <td><strong style={{ color: '#A4449D', fontSize: '0.8rem' }}>{schedule.day}</strong></td>
                                                <td style={{ fontSize: '0.75rem' }}>{formatTimeRange(schedule.m_start_time, schedule.m_end_time) || 'N/A'}</td>
                                                <td style={{ fontSize: '0.75rem' }}>{formatTimeRange(schedule.e_start_time, schedule.e_end_time) || 'N/A'}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        ) : (
                            <div className="alert alert-info py-2"><small>No schedule available at the moment.</small></div>
                        )}
                    </div>
                </div>
            </div>

            <div className="row mt-4">
                <div className="col-12 mb-2">
                    <button className="btn btn-primary w-100" onClick={handleBookClick}>
                        Book Appointment
                    </button>
                </div>
                <div className="col-12">
                    <button className="btn btn-outline-secondary w-100" onClick={() => navigate('/doctors')}>
                        Go Back
                    </button>
                </div>
            </div>
        </div>
    );
}

DoctorDetails.propTypes = {
    // no props; route-based
};

export default DoctorDetails;
