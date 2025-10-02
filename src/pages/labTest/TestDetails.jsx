// src/pages/labTest/TestDetails.jsx
import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom"; // ✅ Link import
import axios from "axios";
import { config } from "../../config";

function TestDetails({ type }) {
    const { slug } = useParams();
    const [data, setData] = useState(null);

    useEffect(() => {
        const endpoint =
            type === "package"
                ? `${config.baseUrl}/labtests/packages/${slug}/`
                : `${config.baseUrl}/labtests/tests/${slug}/`;

        axios
            .get(endpoint)
            .then((res) => setData(res.data))
            .catch((err) => console.error("Error loading details:", err));
    }, [slug, type]);

    if (!data) return <p className="text-center">Loading...</p>;

    return (
        <div className="container my-4">
            <div className="card shadow-sm p-4">
                <div className="d-flex justify-content-between align-items-start">
                    <h2 className="mb-0">{data.name}</h2>

                    {/* ✅ Book button */}
                    <Link
                        className="btn btn-primary"
                        to={
                            type === "package"
                                ? `/labtests/booking?type=package&slug=${slug}`
                                : `/labtests/booking?type=test&slug=${slug}`
                        }
                    >
                        Book Now
                    </Link>
                </div>

                <p className="fw-bold mt-2" style={{ color: "#A4449D" }}>
                    TK {data.price}
                </p>

                {type === "test" && (
                    <>
                        {data.sample_type && (
                            <p>
                                <strong>Sample:</strong> {data.sample_type}
                            </p>
                        )}
                        <p>
                            <strong>Category:</strong> {data.category}
                        </p>
                        <p>{data.description || "No description provided."}</p>
                    </>
                )}

                {type === "package" && (
                    <>
                        <p>{data.description || "No description provided."}</p>
                        <h5 className="mt-4">Included Tests:</h5>
                        <ul>
                            {data.tests && data.tests.length > 0 ? (
                                data.tests.map((testSlug) => <li key={testSlug}>{testSlug}</li>)
                            ) : (
                                <li>No tests linked to this package.</li>
                            )}
                        </ul>
                    </>
                )}
            </div>
        </div>
    );
}

export default TestDetails;
