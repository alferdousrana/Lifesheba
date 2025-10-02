// src/pages/labTest/CombinedTests.jsx
import React, { useEffect, useState, useMemo } from "react";
import { useLocation, Link } from "react-router-dom";
import axios from "axios";
import { config } from "../../config";

function CombinedTests() {
    const { search } = useLocation();
    const params = new URLSearchParams(search);

    // ✅ slugs stable করার জন্য useMemo ব্যবহার
    const slugsParam = params.get("slugs") || "";
    const slugs = useMemo(
        () => (slugsParam ? slugsParam.split(",").filter(Boolean) : []),
        [slugsParam]
    );

    const [tests, setTests] = useState([]);

    useEffect(() => {
        if (slugs.length > 0) {
            Promise.all(
                slugs.map((slug) =>
                    axios.get(`${config.baseUrl}/labtests/tests/${slug}/`).then((res) => res.data)
                )
            ).then(setTests);
        }
    }, [slugs]); // ✅ এখন শুধু slugsParam change হলে run হবে

    const totalPrice = useMemo(
        () => tests.reduce((sum, t) => sum + parseFloat(t.price), 0),
        [tests]
    );

    return (
        <div className="container my-4">
            <div className="d-flex justify-content-between align-items-center mb-2">
                <h2 className="mb-0">Selected Tests</h2>

                {/* ✅ Booking button */}
                {slugs.length > 0 && (
                    <Link
                        className="btn btn-primary"
                        to={`/labtests/booking?type=combined&slugs=${slugs.join(",")}`}
                    >
                        Proceed to Booking
                    </Link>
                )}
            </div>

            <ul className="list-group mb-3">
                {tests.map((t) => (
                    <li key={t.slug} className="list-group-item d-flex justify-content-between">
                        <span>{t.name}</span>
                        <span className="fw-bold">TK {t.price}</span>
                    </li>
                ))}
            </ul>
            <h4>
                Total: <span style={{ color: "#A4449D" }}>TK {totalPrice.toFixed(2)}</span>
            </h4>
        </div>
    );
}

export default CombinedTests;
