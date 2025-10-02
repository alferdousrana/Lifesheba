import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { config } from "../config";
import TextInput from "../pages/profile/components/TextInput";
import SelectInput from "../pages/profile/components/SelectInput";

const durationLabels = {
    "1D_12H": "Daily (12 Hours)",
    "1D_24H": "Daily (24 Hours)",
    "3D_12H": "3 Days (12 Hours)",
    "3D_24H": "3 Days (24 Hours)",
    "7D_12H": "Weekly (12 Hours)",
    "7D_24H": "Weekly (24 Hours)",
    "15D_12H": "15 Days (12 Hours)",
    "15D_24H": "15 Days (24 Hours)",
    "30D_12H": "Monthly (12 Hours)",
    "30D_24H": "Monthly (24 Hours)",
};

function BookingPage() {
    const { serviceType, slug } = useParams(); // ✅ URL থেকে পড়বো (nurse বা caregiver + id)
    const [packages, setPackages] = useState([]);
    const navigate = useNavigate();
    const [profile, setProfile] = useState(null);
    const [selectedPackage, setSelectedPackage] = useState(null);
    const [formData, setFormData] = useState({
        patient_type: "BED",
        diaper_change: "NO",
        user_phone: "",
        user_address: "",
        other_place: false,
        new_address: "",
        disease: "",
        service_date: "",
    });


    // Helpers
    const formatDate = (date) => new Date(date).toISOString().split("T")[0];
    const today = formatDate(new Date());
    // 👉 Packages load
    useEffect(() => {
        axios
            .get(`${config.baseUrl}/bookings/packages/?service_type=${serviceType}`)
            .then((res) => {
                const data = Array.isArray(res.data) ? res.data : res.data.results;
                setPackages(data || []);
            })
            .catch((err) => console.error(err));
    }, [serviceType]);

    // 👉 Profile load (phone + address auto-fill)
    useEffect(() => {
        const token = localStorage.getItem("access_token");
        if (!token) return;

        const fetchProfileData = async () => {
            try {
                const userRes = await axios.get(`${config.baseUrl}/accounts/profile/me/`, {
                    headers: { Authorization: `Bearer ${token}` },
                });

                const customerRes = await axios.get(`${config.baseUrl}/customers/profile/`, {
                    headers: { Authorization: `Bearer ${token}` },
                });

                setFormData((prev) => ({
                    ...prev,
                    user_phone: userRes.data.phone || "",
                    user_address: customerRes.data.address || "",
                }));
            } catch (err) {
                console.error("❌ Profile load failed:", err);
            }
        };

        fetchProfileData();
    }, []);



    // 👉 Submit booking
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem("access_token");

            // Nurse বা Caregiver id ঠিক করে payload এ দিবো
            const payload = {
                service_package_id: selectedPackage,
                ...formData,
            };

            if (serviceType.toUpperCase() === "NURSE") {
                payload.nurse = slug;   // 👈 slug ব্যবহার করো
            } else if (serviceType.toUpperCase() === "CAREGIVER") {
                payload.caregiver = slug;
            }
            


            await axios.post(`${config.baseUrl}/bookings/bookings/`, payload, {
                headers: { Authorization: `Bearer ${token}` },
            });

            alert("✅ Booking successful!");
            navigate("/profile/bookings");
        } catch (err) {
            console.error(err);
            alert("❌ Booking failed!");
        }
    };


    useEffect(() => {
        axios.get(`${config.baseUrl}/${serviceType.toLowerCase()}s/${slug}/`)
            .then((res) => setProfile(res.data))
            
            .catch((err) => console.error("❌ Failed to load profile:", err));
    }, [serviceType, slug]);
    
    const getDisplayName = (profile) => {
        if (!profile) return "Unknown";

        // Nurse
        if (profile?.profile?.role === "nurse") {
            return profile.profile.full_name;
        }

        // Caregiver
        if (profile?.user?.role === "caregiver") {
            return profile.user.full_name;
        }

        return "Unknown";
    };


    return (
        <div className="container my-5">
            <h3 className="mb-4">Select Package</h3>
            
                <div className="card shadow mb-4">
                    <div className="card-body text-center">
                    <h4>Booking for {getDisplayName(profile)}</h4>
                    </div>
                </div>
    


            <div className="row g-3">
                {packages.map((pkg) => (
                    <div
                        key={pkg.id}
                        className="col-12 col-sm-6 col-md-4 col-lg-3"
                    >
                        <div
                            className={`card shadow-sm h-100 ${selectedPackage === pkg.id ? "border border-primary border-2" : ""
                                }`}
                            style={{ cursor: "pointer", borderRadius: "12px" }}
                            onClick={() => setSelectedPackage(pkg.id)}
                        >
                            <div className="card-body d-flex flex-column justify-content-between">
                                <h5 className="fw-bold text-dark mb-2">
                                    {durationLabels[pkg.duration]}
                                </h5>
                                <p className="text-muted small mb-2">
                                    {pkg.service_type === "CAREGIVER" ? "Caregiver" : "Nurse"}
                                </p>
                                <p className="fw-bold text-primary fs-5 text-end mb-0">
                                    ৳ {Number(pkg.price).toLocaleString()}
                                </p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {selectedPackage && (
                <form className="mt-5" onSubmit={handleSubmit}>
                    <div className="mb-3">
                        
                        <TextInput
                            label="Service Date"
                            type="date"
                            className="form-control"
                            value={formData.service_date}
                            onChange={(e) =>
                                setFormData({ ...formData, service_date: e.target.value })
                            }
                            required
                            icon="birthdate"
                            min={today}
                        />
                    </div>

                    <div className="mb-3">
                        <SelectInput
                            label="Patient Type"
                            name="patient_type"
                            value={formData.patient_type || ""}
                            onChange={(e) =>
                                setFormData({ ...formData, patient_type: e.target.value })
                            }
                            col={12}
                            options={[
                                { value: "BED", label: "Bed Patient" },
                                { value: "NON_BED", label: "Non Bed Patient" },
                            ]}
                            icon="bed"   
                        />

                    </div>

                    <div className="mb-3">
                        <SelectInput
                            label="Diaper Change"
                            name="diaper_change"
                            value={formData.diaper_change || ""}
                            onChange={(e) =>
                                setFormData({ ...formData, diaper_change: e.target.value })
                            }
                            col={12}
                            options={[
                                { value: "YES", label: "Yes" },
                                { value: "NO", label: "No" },
                            ]}
                            icon="note"   
                        />

                    </div>

                    <div className="mb-3">
                        <TextInput
                            label="Phone"
                            name="user_phone"
                            type="text"
                            value={formData.user_phone || ""}
                            onChange={(e) =>
                                setFormData({ ...formData, user_phone: e.target.value })
                            }
                            col={12}
                            required
                            icon="phone"
                        />

                    </div>

                    <div className="mb-3">
                        <TextInput
                            label="Address"
                            name="user_address"
                            value={formData.user_address || ""}
                            onChange={(e) =>
                                setFormData({ ...formData, user_address: e.target.value })
                            }
                            col={12}
                            multiline={true}   
                            rows={3}           
                            required
                            icon="address"
                        />

                    </div>

                    <div className="form-check mb-3">
                        <input
                            type="checkbox"
                            className="form-check-input"
                            checked={formData.other_place}
                            onChange={(e) =>
                                setFormData({ ...formData, other_place: e.target.checked })
                            }
                        />
                        <label className="form-check-label">Service for another place</label>
                    </div>

                    {formData.other_place && (
                        <div className="mb-3">
                            <TextInput
                                label="New Address"
                                name="new_address"
                                value={formData.new_address || ""}
                                onChange={(e) =>
                                    setFormData({ ...formData, new_address: e.target.value })
                                }
                                col={12}
                                multiline={true}   
                                rows={3}           
                                icon="address"
                            />

                        </div>
                    )}

                    <div className="mb-3">
                        <TextInput
                            label="Disease (optional)"
                            name="disease"
                            type="text"
                            value={formData.disease || ""}
                            onChange={(e) =>
                                setFormData({ ...formData, disease: e.target.value })
                            }
                            col={12}
                            icon="medical_history"
                        />

                    </div>

                    <button type="submit" className="btn btn-primary">
                        Confirm Booking
                    </button>
                </form>
            )}
        </div>
    );
}

export default BookingPage;
