import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { config } from "../config";
import TextInput from "../pages/profile/components/TextInput";
import SelectInput from "../pages/profile/components/SelectInput";

function DoctorAppointments() {
    const { slug } = useParams();
    const { baseUrl } = config;
    const navigate = useNavigate();

    const [doctor, setDoctor] = useState(null);
    const [selectedDate, setSelectedDate] = useState("");
    const [availability, setAvailability] = useState([]);
    const [loading, setLoading] = useState(true);
    const [submitting, setSubmitting] = useState(false);

    const [appointmentData, setAppointmentData] = useState({
        chief_complaint: "",
        appointment_type: "NEW",
        patient_whatsapp: "",   // ✅ backend requires this
    });

    // Helpers
    const formatDate = (date) => new Date(date).toISOString().split("T")[0];
    const today = formatDate(new Date());

    // Fetch doctor info + availability
    useEffect(() => {
        const token = localStorage.getItem("access_token");
        if (!token) {
            navigate("/login", { replace: true });
            return;
        }

        const fetchData = async () => {
            try {
                // doctor details
                const doctorResp = await axios.get(`${baseUrl}/doctors/${slug}/`);
                setDoctor(doctorResp.data);

                // availability
                const availResp = await axios.get(
                    `${baseUrl}/appointments/appointments/check-availability/${doctorResp.data.id}/`
                );
                setAvailability(availResp.data.availability || []);

                // prefill whatsapp if available in profile
                const userResp = await axios.get(`${baseUrl}/accounts/profile/me/`, {
                    headers: { Authorization: `Bearer ${token}` },
                });

                if (userResp.data.role === "customer") {
                    setAppointmentData((prev) => ({
                        ...prev,
                        patient_whatsapp: userResp.data.whatsapp || "",
                    }));
                }
            } catch (err) {
                console.error("Error loading data:", err);
                alert("Failed to load doctor or profile info.");
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [slug, baseUrl, navigate]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setAppointmentData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!selectedDate) {
            alert("Please select a date");
            return;
        }

        const token = localStorage.getItem("access_token");
        if (!token) {
            alert("⚠️ Please login first to book an appointment.");
            navigate("/login");
            return;
        }

        setSubmitting(true);

        try {
            const payload = {
                doctor_id: doctor.id,
                appointment_date: selectedDate,
                appointment_type: appointmentData.appointment_type,
                chief_complaint: appointmentData.chief_complaint,
                patient_whatsapp: appointmentData.patient_whatsapp,  // ✅ required
            };

            const resp = await axios.post(
                `${baseUrl}/appointments/appointments/`,
                payload,
                { headers: { Authorization: `Bearer ${token}` } }
            );

            alert("✅ " + resp.data.message);
            navigate("/profile/appointments");
        } catch (err) {
            console.error("Booking failed:", err);

            if (err.response?.status === 401) {
                alert("⚠️ Your session expired. Please login again.");
                navigate("/login");
            } else if (err.response?.data) {
                let msg = "";
                Object.entries(err.response.data).forEach(([key, val]) => {
                    msg += `${key}: ${val}\n`;
                });
                alert("Failed:\n" + msg);
            } else {
                alert("Something went wrong. Try again.");
            }
        } finally {
            setSubmitting(false);
        }
    };

    if (loading) return <div className="text-center mt-5">Loading...</div>;
    if (!doctor) return <div className="text-center mt-5">Doctor not found</div>;

    return (
        <div className="container my-5">
            <div className="card shadow">
                <div className="card-header bg-primary text-white text-center">
                    <h3>Book Appointment</h3>
                    <p>{doctor.profile?.full_name || `Dr. ${doctor.user?.username}`}</p>
                </div>
                <div className="card-body">
                    <form onSubmit={handleSubmit}>
                        {/* Date */}
                        <div className="mb-3">
                            <TextInput
                                label="Appointment Date *"
                                name="appointment_date"
                                type="date"
                                value={selectedDate || ""}
                                onChange={(e) => setSelectedDate(e.target.value)}
                                col={12}
                                required
                                min={today}           // ✅ এখন কাজ করবে
                                icon="birthdate"
                                placeholder="Select a date"
                            />

                            {selectedDate && (
                                <small className="text-muted">
                                    {
                                        availability.find((a) => formatDate(a.date) === selectedDate)
                                            ?.available_slots ?? 10
                                    }{" "}
                                    slots left
                                </small>
                            )}
                        </div>

                        {/* Appointment Type */}
                        <div className="mb-3">
                            <SelectInput
                                label="Appointment Type"
                                name="appointment_type"
                                value={appointmentData.appointment_type || ""}
                                onChange={handleChange}
                                col={12}
                                options={[
                                    { value: "NEW", label: "New Patient" },
                                    { value: "FOLLOWUP", label: "Follow-up" },
                                ]}
                                icon="patient"   // 🔑 iconMap.js এ status: faHourglassHalf আছে
                            />

                        </div>

                        {/* Chief Complaint */}
                        <div className="mb-3">
                            <TextInput
                                label="Chief Complaint *"
                                name="chief_complaint"
                                value={appointmentData.chief_complaint || ""}
                                onChange={handleChange}
                                col={12}
                                multiline={true}   
                                rows={3}           
                                required
                                icon="medical_history" 
                            />

                        </div>

                        {/* WhatsApp Number */}
                        <div className="mb-3">
                            <TextInput
                                label="WhatsApp Number *"
                                name="patient_whatsapp"
                                type="text"
                                value={appointmentData.patient_whatsapp || ""}
                                onChange={handleChange}
                                col={12}
                                placeholder="Enter WhatsApp number"
                                required
                                icon="whatsapp"   
                            />

                        </div>

                        <div className="d-flex justify-content-between">
                            <button
                                type="button"
                                className="btn btn-secondary"
                                onClick={() => navigate(`/doctors/${slug}`)}
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                className="btn btn-success"
                                disabled={submitting}
                            >
                                {submitting ? "Booking..." : "Book Appointment"}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}

export default DoctorAppointments;
