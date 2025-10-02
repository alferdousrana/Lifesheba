// src/pages/labTest/TestBooking.jsx
import React, { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import axios from "axios";
import { config } from "../../config";

const serviceTypeMap = {
    test: "INDIVIDUAL",
    package: "PACKAGE",
    combined: "COMBINED",
};

function TestBooking() {
    const navigate = useNavigate();
    const { search } = useLocation();
    const params = new URLSearchParams(search);

    const type = (params.get("type") || "test").toLowerCase(); // test | package | combined
    const slug = params.get("slug");
    const slugsParam = params.get("slugs") || "";
    const slugs = useMemo(
        () => (slugsParam ? slugsParam.split(",").filter(Boolean) : []),
        [slugsParam]
    );

    const [labs, setLabs] = useState([]);
    const [selectedLabSlug, setSelectedLabSlug] = useState("");
    const [items, setItems] = useState([]);
    const [profile, setProfile] = useState({ phone: "", address: "" });
    const [collectionDate, setCollectionDate] = useState("");
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState("");
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    const serviceType = useMemo(() => serviceTypeMap[type] || "INDIVIDUAL", [type]);

    // --- Helpers
    const getImageUrl = (path) => {
        if (!path) return "https://via.placeholder.com/80x80?text=Lab";
        if (path.startsWith("http")) return path;
        return `${config.baseUrl}${path}`;
    };

    // --- Load labs
    useEffect(() => {
        axios
            .get(`${config.baseUrl}/labtests/labs/`)
            .then((res) => {
                const data = res.data.results || res.data;
                setLabs(data);
                const defaultLab =
                    data.find((l) => l.slug === "life-sheba") || data[0] || null;
                if (defaultLab) setSelectedLabSlug(defaultLab.slug);
            })
            .catch((e) => console.error("Failed to load labs:", e));
    }, []);

    // --- Load profile if logged in
    useEffect(() => {
        const token = localStorage.getItem("access_token");
        if (!token) {
            setIsLoggedIn(false);
            return;
        }
        setIsLoggedIn(true);

        const fetchProfileData = async () => {
            try {
                const userRes = await axios.get(`${config.baseUrl}/accounts/profile/me/`, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                const customerRes = await axios.get(`${config.baseUrl}/customers/profile/`, {
                    headers: { Authorization: `Bearer ${token}` },
                });

                setProfile({
                    phone: userRes.data.phone || "",
                    address: customerRes.data.address || "",
                });
            } catch (err) {
                console.error("❌ Profile load failed:", err);
            }
        };

        fetchProfileData();
    }, []);

    // --- Build items based on type (with cancel support)
    useEffect(() => {
        const controller = new AbortController();
        async function load() {
            try {
                if (type === "test" && slug) {
                    const r = await axios.get(
                        `${config.baseUrl}/labtests/tests/${slug}/`,
                        { signal: controller.signal }
                    );
                    const t = r.data;
                    setItems([
                        {
                            is_package: false,
                            ref_id: t.id,
                            name: t.name,
                            sample_type: t.sample_type || "",
                            unit_price: parseFloat(t.price),
                            quantity: 1,
                            report_time: "",
                        },
                    ]);
                } else if (type === "package" && slug) {
                    const r = await axios.get(
                        `${config.baseUrl}/labtests/packages/${slug}/`,
                        { signal: controller.signal }
                    );
                    const p = r.data;
                    setItems([
                        {
                            is_package: true,
                            ref_id: p.id,
                            name: p.name,
                            sample_type: "",
                            unit_price: parseFloat(p.price),
                            quantity: 1,
                            report_time: "",
                        },
                    ]);
                } else if (type === "combined" && slugs.length > 0) {
                    const all = await Promise.all(
                        slugs.map((s) =>
                            axios
                                .get(`${config.baseUrl}/labtests/tests/${s}/`, {
                                    signal: controller.signal,
                                })
                                .then((res) => res.data)
                        )
                    );
                    setItems(
                        all.map((t) => ({
                            is_package: false,
                            ref_id: t.id,
                            name: t.name,
                            sample_type: t.sample_type || "",
                            unit_price: parseFloat(t.price),
                            quantity: 1,
                            report_time: "",
                        }))
                    );
                }
            } catch (e) {
                if (axios.isCancel(e)) return;
                console.error("Failed to load selection:", e);
                setError("Failed to load selected items.");
            }
        }
        load();
        return () => controller.abort();
    }, [type, slug, slugsParam]); //eslint-disable-line

    const total = useMemo(
        () => items.reduce((sum, it) => sum + it.unit_price * (it.quantity || 1), 0),
        [items]
    );

    const canSubmit =
        isLoggedIn &&
        !!selectedLabSlug &&
        !!collectionDate &&
        !!profile.address &&
        !!profile.phone &&
        items.length > 0;

    // --- Submit booking
    const handleConfirm = async () => {
        setError("");
        if (!canSubmit) {
            setError("Please fill all required fields before confirming.");
            return;
        }
        setSubmitting(true);
        try {
            const payload = {
                lab_slug: selectedLabSlug,
                service_type: serviceType,
                collection_date: new Date(collectionDate).toISOString(),
                address: profile.address,
                phone: profile.phone,
            };
            const token = localStorage.getItem("access_token");
            const bookingRes = await axios.post(
                `${config.baseUrl}/labtests/bookings/`,
                payload,
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            );
            const booking = bookingRes.data;

            await Promise.all(
                items.map((it) =>
                    axios.post(
                        `${config.baseUrl}/labtests/booking-items/`,
                        {
                            booking: booking.uuid,
                            is_package: it.is_package,
                            ref_id: it.ref_id,
                            name: it.name,
                            sample_type: it.sample_type,
                            unit_price: it.unit_price,
                            quantity: it.quantity || 1,
                            report_time: it.report_time || "",
                        },
                        {
                            headers: { Authorization: `Bearer ${token}` }, 
                        }
                    )
                )
            );

            navigate("/profile/test-booking");
        } catch (e) {
            console.error(e);
            setError(
                e?.response?.data
                    ? JSON.stringify(e.response.data)
                    : "Failed to confirm booking."
            );
        } finally {
            setSubmitting(false);
        }
    };

    // today default for datetime-local (YYYY-MM-DDTHH:mm)
    const todayLocal = useMemo(() => {
        const d = new Date();
        d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
        return d.toISOString().slice(0, 16);
    }, []);

    useEffect(() => {
        if (!collectionDate) setCollectionDate(todayLocal);
    }, [todayLocal]); //eslint-disable-line

    return (
        <div className="container my-4">
            <h2 className="mb-3">Confirm Your Booking</h2>

            {!isLoggedIn && (
                <div className="alert alert-warning">
                    ⚠️ Please log in to continue with booking.
                </div>
            )}

            {/* Selection Summary */}
            <div className="card shadow-sm mb-4">
                <div className="card-body">
                    <div className="d-flex justify-content-between align-items-center">
                        <h5 className="mb-0">
                            Selected{" "}
                            {type === "combined"
                                ? "Tests (Combined)"
                                : type === "package"
                                    ? "Package"
                                    : "Test"}
                        </h5>
                        <span className="badge text-bg-secondary">{serviceType}</span>
                    </div>
                    <ul className="list-group list-group-flush mt-3">
                        {items.map((it, idx) => (
                            <li
                                key={idx}
                                className="list-group-item d-flex justify-content-between"
                            >
                                <div>
                                    <strong>{it.name}</strong>{" "}
                                    {!it.is_package && it.sample_type ? (
                                        <small className="text-muted">({it.sample_type})</small>
                                    ) : null}
                                </div>
                                <div>TK {it.unit_price}</div>
                            </li>
                        ))}
                    </ul>
                    <div className="d-flex justify-content-end mt-3">
                        <h5 className="mb-0">Total:&nbsp;</h5>
                        <h5 className="mb-0" style={{ color: "#A4449D" }}>
                            TK {total.toFixed(2)}
                        </h5>
                    </div>
                </div>
            </div>

            {/* Lab selection */}
            <div className="mb-4">
                <h5 className="mb-2">Choose a Lab</h5>
                <div className="row g-3">
                    {labs.map((lab) => {
                        const active = selectedLabSlug === lab.slug;
                        return (
                            <div
                                className="col-12 col-sm-6 col-md-4 col-lg-3"
                                key={lab.slug}
                            >
                                <div
                                    className={`card h-100 ${active ? "border-2 border-primary" : ""
                                        }`}
                                    style={{ cursor: "pointer" }}
                                    onClick={() => setSelectedLabSlug(lab.slug)}
                                >
                                    <div className="card-body d-flex align-items-center">
                                        <img
                                            src={getImageUrl(lab.logo)}
                                            alt={lab.name}
                                            style={{
                                                width: 48,
                                                height: 48,
                                                objectFit: "contain",
                                                marginRight: 12,
                                            }}
                                        />
                                        <div>
                                            <div className="fw-semibold">{lab.name}</div>
                                            <small className="text-muted">{lab.slug}</small>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        );
                    })}
                    {labs.length === 0 && <p className="text-muted">No labs available.</p>}
                </div>
            </div>

            {/* Collection details */}
            <div className="card shadow-sm mb-4">
                <div className="card-body">
                    <div className="row g-3">
                        <div className="col-md-6">
                            <label className="form-label">Collection Date & Time</label>
                            <input
                                type="datetime-local"
                                className="form-control"
                                value={collectionDate}
                                min={todayLocal}
                                onChange={(e) => setCollectionDate(e.target.value)}
                            />
                        </div>
                        <div className="col-md-6">
                            <label className="form-label">Phone</label>
                            <input
                                type="text"
                                className="form-control"
                                value={profile.phone}
                                onChange={(e) =>
                                    setProfile((p) => ({ ...p, phone: e.target.value }))
                                }
                            />
                        </div>
                        <div className="col-12">
                            <label className="form-label">Collection Address</label>
                            <textarea
                                className="form-control"
                                rows={3}
                                value={profile.address}
                                onChange={(e) =>
                                    setProfile((p) => ({ ...p, address: e.target.value }))
                                }
                            />
                        </div>
                        <div className="col-12">
                            <label className="form-label">Service Type</label>
                            <input
                                type="text"
                                className="form-control"
                                value={serviceType}
                                readOnly
                            />
                        </div>
                    </div>
                </div>
            </div>

            {error && <div className="alert alert-danger">{error}</div>}

            <div className="d-flex justify-content-end">
                <button
                    className="btn btn-primary px-4"
                    disabled={!canSubmit || submitting}
                    onClick={handleConfirm}
                >
                    {submitting ? "Processing..." : "Confirm Booking"}
                </button>
            </div>
        </div>
    );
}

export default TestBooking;
