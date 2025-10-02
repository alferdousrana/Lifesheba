import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { config } from '../../config';
import './css.css';


function DoctorList() {
    const { baseUrl } = config;
    const [doctors, setDoctors] = useState([]);
    const [loading, setLoading] = useState(true);
    const [specializationFilter, setSpecializationFilter] = useState('');
    const [allSpecializations, setAllSpecializations] = useState([]);
    const [searchParams, setSearchParams] = useSearchParams();
    const navigate = useNavigate();

    useEffect(() => {
        const paramSpec = searchParams.get('specialization');
        if (paramSpec) {
            setSpecializationFilter(paramSpec);
        } else {
            setSpecializationFilter('');
        }
    }, [searchParams]);

    useEffect(() => {
        if (!specializationFilter) {
            setSearchParams({}, { replace: true }); // ✅ replace instead of push
        } else {
            setSearchParams({ specialization: specializationFilter }, { replace: true }); // ✅ replace
        }
    }, [specializationFilter, setSearchParams]);


    useEffect(() => {
        const fetchDoctors = async () => {
            setLoading(true);
            try {
                const response = await axios.get(`${baseUrl}/doctors/`);
                let fetchedDoctors = response.data.results;

                // Build unique specializations
                const uniqueSpecializations = [
                    ...new Set(
                        fetchedDoctors
                            .map(doc => doc.specialization?.trim())
                            .filter(Boolean)
                    )
                ].sort();

                setAllSpecializations(uniqueSpecializations);

                // Filter by specialization
                if (specializationFilter) {
                    fetchedDoctors = fetchedDoctors.filter(doctor =>
                        doctor.specialization?.toLowerCase() === specializationFilter.toLowerCase()
                    );
                }

                // Sort by availability
                const sortedDoctors = fetchedDoctors.sort((a, b) => {
                    if (a.availability_status === 'AVAILABLE' && b.availability_status === 'BUSY') return -1;
                    if (a.availability_status === 'BUSY' && b.availability_status === 'AVAILABLE') return 1;
                    return 0;
                });

                setDoctors(sortedDoctors);
            } catch (error) {
                console.error('Error fetching doctors:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchDoctors();
    }, [baseUrl, specializationFilter]);

    const handleFilterChange = (e) => {
        setSpecializationFilter(e.target.value);
    };

    if (loading) return <div className="text-center mt-5">Loading...</div>;

    return (
        <div className="container my-5">
            <h2 className="mb-4 text-center">Available Doctors</h2>

            <div className="mb-4 d-flex justify-content-center">
                <div className="d-flex">
                    <select
                        className="form-select rounded-start"
                        value={specializationFilter}
                        onChange={handleFilterChange}
                        style={{ borderTopRightRadius: 0, borderBottomRightRadius: 0 }}
                    >
                        <option value="">All Specializations</option>
                        {allSpecializations.map((spec, idx) => (
                            <option key={idx} value={spec}>{spec}</option>
                        ))}
                    </select>

                    {specializationFilter && (
                        <button
                            className="btn rounded-end"
                            onClick={() => setSpecializationFilter('')}
                            style={{
                                backgroundColor: '#A4449D',
                                color: '#fff',
                                borderTopLeftRadius: 0,
                                borderBottomLeftRadius: 0,
                            }}
                        >
                            X
                        </button>
                    )}
                </div>
            </div>


            <div className="row">
                {doctors.length > 0 ? (
                    doctors.map((doctor, index) => (
                        <div className="col-md-6 mb-4" key={index}
                            onClick={() => navigate(`/doctors/${doctor.slug}/`)}
                            style={{ cursor: 'pointer', }}>
                            <div className="d-flex align-items-center shadow p-3 m-2 rounded card-hover" style={{ minHeight: '220px', background: '#f7eff3ff' }}>
                                <div className="image-wrapper position-relative">
                                    <div className="rotating-bg"></div>
                                    <img
                                        src={
                                            doctor.profile?.profile_picture
                                                ? `${baseUrl.replace("/api", "")}/${doctor.profile.profile_picture}`
                                                : 'https://developers.elementor.com/docs/assets/img/elementor-placeholder-image.png'
                                        }
                                        alt="Doctor"
                                        className="rounded-circle"
                                        style={{
                                            width: '200px',
                                            height: '200px',
                                            background: '#e2d2dbff',
                                            objectFit: 'cover',
                                            flexShrink: 0,
                                            border: '4px solid #fff',
                                            position: 'relative',
                                            zIndex: 2
                                        }}
                                    />
                                </div>
                                <div className="flex-grow-1">
                                    <h5 className="fw-bold mb-1" style={{ fontSize: '22px', color: '#cd0961ff' }}>
                                        {doctor.profile?.full_name || `Dr. ${doctor.user?.username}`}
                                    </h5>
                                    <p className="mb-0"><strong>{doctor.degree}</strong></p>
                                    <p className="mb-0">Specialization: {doctor.specialization}</p>
                                    <p className="mb-0">BMDC No: {doctor.bmdc_no || 'N/A'}</p>
                                    <p className="mb-2">Years of Experience: {doctor.years_of_experience || 'N/A'} Years</p>
                                    <div className="d-flex justify-content-between align-items-center">
                                        <span className={`badge ${doctor.availability_status === 'AVAILABLE' ? 'bg-success' : 'bg-secondary'}`}>
                                            {doctor.availability_status}
                                        </span>
                                        <button
                                            className="btn btn-sm btn-outline-primary"
                                            onClick={(e) => {
                                                e.stopPropagation(); // 👈 prevent parent click
                                                navigate(`/doctors/${doctor.slug}/`);
                                            }}
                                        >
                                            Details
                                        </button>

                                    </div>
                                </div>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="text-center text-muted">No doctors found for this specialization.</div>
                )}
            </div>
        </div>
    );
}

export default DoctorList;
