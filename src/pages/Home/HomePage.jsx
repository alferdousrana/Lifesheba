import React, { useState, useEffect } from 'react';
import { FaSearch } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import axios from 'axios';
import Tiles from './Tiles';
import HomeMedicine from './HomeMedicine';
import StudentBenefits from './StudentBenefits';
import Consultation from './Consultation';
import HomeBlog from './HomeBlog';
import HomeTestimonial from './HomeTestimonial';
import HomeBanner from '../../assets/images/HomeBanner.png';
import { config } from '../../config';

function HomePage() {
    const { baseUrl } = config;

    const [query, setQuery] = useState("");
    const [results, setResults] = useState([]);
    const [loading, setLoading] = useState(false);

    // debounce timer
    useEffect(() => {
        const timer = setTimeout(() => {
            if (query.trim()) {
                handleSearch();
            } else {
                setResults([]);
            }
        }, 400); // wait 400ms after typing
        return () => clearTimeout(timer);
    }, [query]); //eslint-disable-line

    const handleSearch = async () => {
        try {
            setLoading(true);
            const res = await axios.get(`${baseUrl}/search/`, {
                params: { q: query }
            });
            setResults(res.data || []);
        } catch (err) {
            console.error("Search error", err);
        } finally {
            setLoading(false);
        }
    };

    // group results by type
    const groupedResults = results.reduce((acc, item) => {
        if (!acc[item.type]) acc[item.type] = [];
        acc[item.type].push(item);
        return acc;
    }, {});

    return (
        <>
            <div style={{ background: '#e9f6fbff' }}>
                <div className="container py-5">
                    <h2 className="text-center fw-bold mb-4">
                        Life Sheba - Your Online Doctor and Pharmacy
                    </h2>

                    {/* Search Bar */}
                    <div className="input-group mb-5" style={{ maxWidth: '900px', margin: '0 auto' }}>
                        <input
                            type="text"
                            className="form-control rounded-start-pill"
                            placeholder="Search Doctor, Nurse, Medicine..."
                            style={{ padding: '1rem' }}
                            value={query}
                            onChange={(e) => setQuery(e.target.value)}
                        />
                        <span
                            className="input-group-text rounded-end-pill text-white"
                            style={{ cursor: 'pointer', backgroundColor: '#08ABBD' }}
                            onClick={handleSearch}
                        >
                            <FaSearch />
                        </span>
                    </div>

                    {/* Search Results */}
                    <div style={{ maxWidth: "900px", margin: "0 auto" }}>
                        {loading && <p>🔄 Searching...</p>}

                        {Object.keys(groupedResults).length > 0 && (
                            <div className="mt-4">
                                {/* Doctors */}
                                {groupedResults.doctor && (
                                    <div className="mb-4">
                                        <h5 className="fw-bold">👨‍⚕️ Doctors</h5>
                                        <ul className="list-group">
                                            {groupedResults.doctor.map((item, index) => (
                                                <li key={index} className="list-group-item">
                                                    <Link to={item.url}>{item.name}</Link>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                )}

                                {/* Nurses */}
                                {groupedResults.nurse && (
                                    <div className="mb-4">
                                        <h5 className="fw-bold">👩‍⚕️ Nurses</h5>
                                        <ul className="list-group">
                                            {groupedResults.nurse.map((item, index) => (
                                                <li key={index} className="list-group-item">
                                                    <Link to={item.url}>{item.name}</Link>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                )}

                                {/* Medicines */}
                                {groupedResults.medicine && (
                                    <div className="mb-4">
                                        <h5 className="fw-bold">💊 Medicines</h5>
                                        <ul className="list-group">
                                            {groupedResults.medicine.map((item, index) => (
                                                <li key={index} className="list-group-item">
                                                    <Link to={item.url}>{item.name}</Link>
                                                </li>
                                            ))}
                                        </ul>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>

                    {/* Tiles Component */}
                    <Tiles />
                </div>
            </div>

            <div className='container'>
                <img src={HomeBanner} alt="" style={{ height: "340px" }} />
            </div>

            <HomeMedicine />
            <StudentBenefits />
            <Consultation />
            <HomeBlog />
            <HomeTestimonial />
        </>
    );
}

export default HomePage;
