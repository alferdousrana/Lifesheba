import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { config } from "../../config";
import "./custom.css";

function AppointmentDetailsPatient() {
    const { appointmentId } = useParams();
    const { baseUrl } = config;
    const [appointment, setAppointment] = useState(null);
    const [loading, setLoading] = useState(true);
    const [note, setNote] = useState("");
    const [file, setFile] = useState(null);
    const [timeLeft, setTimeLeft] = useState("");
    const [paymentLoading, setPaymentLoading] = useState(false);


    const isActive = (status) => {
        return status === "CONFIRMED" || status === "RESCHEDULED";
    };


    useEffect(() => {
        if (
            appointment &&
            (appointment.appointment_date || appointment.rescheduled_to) &&
            appointment.confirmed_time
        ) {
            const dateToUse =
                appointment.status === "RESCHEDULED"
                    ? appointment.rescheduled_to
                    : appointment.appointment_date;

            const targetDateTime = new Date(`${dateToUse}T${appointment.confirmed_time}`);

            const timer = setInterval(() => {
                const now = new Date();
                const diff = targetDateTime - now;

                if (diff <= 0) {
                    setTimeLeft("Time expired!");
                    clearInterval(timer);
                } else {
                    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
                    const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
                    const minutes = Math.floor((diff / (1000 * 60)) % 60);
                    const seconds = Math.floor((diff / 1000) % 60);

                    setTimeLeft(`${days}d ${hours}h ${minutes}m ${seconds}s`);
                }
            }, 1000);

            return () => clearInterval(timer);
        }
    }, [appointment]);




    useEffect(() => {
        const token = localStorage.getItem("access_token");
        if (!token) {
            window.location.href = "/login";
            return;
        }

        const fetchDetails = async () => {
            try {
                const resp = await axios.get(
                    `${baseUrl}/appointments/appointments/${appointmentId}/`,
                    { headers: { Authorization: `Bearer ${token}` } }
                );
                setAppointment(resp.data);
            } catch (err) {
                console.error("Failed to load appointment details:", err);
                alert("Could not load appointment details");
            } finally {
                setLoading(false);
            }
        };

        fetchDetails();
    }, [appointmentId, baseUrl]);

    if (loading) return <div className="text-center mt-5">Loading...</div>;
    if (!appointment)
        return <div className="text-center mt-5">Appointment not found.</div>;

    const handleCancel = async () => {
        if (!window.confirm("Are you sure you want to cancel this appointment?")) return;

        const token = localStorage.getItem("access_token");
        if (!token) {
            alert("You are not logged in.");
            return;
        }

        try {
            await axios.patch(
                `${baseUrl}/appointments/appointments/${appointment.appointment_id}/update_status/`,
                { status: "CANCELLED" },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            alert("Appointment cancelled successfully!");
            window.location.href = "/profile/appointments"; // redirect back
        } catch (err) {
            console.error("Failed to cancel appointment:", err);
            alert("Could not cancel appointment. Please try again.");
        }
    };


    const handleAddNote = async () => {
        if (!note.trim()) return alert("Note cannot be empty");
        const token = localStorage.getItem("access_token");

        try {
            await axios.post(
                `${baseUrl}/appointments/appointments/${appointment.appointment_id}/add_extra_note/`,
                { extra_note: note },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            alert("Note added!");
            setNote("");
            window.location.reload();
        } catch (err) {
            console.error("Failed to add note:", err);
            alert("Could not add note");
        }
    };


    // 3. file upload function
    const handleFileUpload = async () => {
        if (!file) return alert("Select a file first");
        const token = localStorage.getItem("access_token");
        const formData = new FormData();
        formData.append("file", file);

        try {
            await axios.post(
                `${baseUrl}/appointments/appointments/${appointment.appointment_id}/upload_patient_files/`,
                formData,
                { headers: { Authorization: `Bearer ${token}`, "Content-Type": "multipart/form-data" } }
            );
            alert("File uploaded!");
            setFile(null);
            window.location.reload();
        } catch (err) {
            console.error("Failed to upload file:", err);
            alert("Could not upload file");
        }
    };

    const handlePayment = async () => {
        const token = localStorage.getItem("access_token");
        if (!token) {
            alert("You are not logged in.");
            return;
        }

        setPaymentLoading(true);

        try {
            
            const resp = await axios.post(
                `${baseUrl}/payments/`,   
    {
                    amount: Number(appointment.consultation_fee),
                    currency: "BDT",
                    appointment_id: appointment.appointment_id,
                },
                {
                    headers: { Authorization: `Bearer ${token}` },
                }
            );



            const paymentId = resp.data.id;

            
            const payResp = await axios.post(
                `${baseUrl}/payments/${paymentId}/start_sslcommerz/`,
                {},
                { headers: { Authorization: `Bearer ${token}` } }
            );

            if (payResp.data.redirect_url) {
                window.location.href = payResp.data.redirect_url; 
            } else {
                alert("Payment gateway error");
            }
        } catch (err) {
            console.error("Payment failed:", err.response?.data || err);
            alert("Could not start payment");
        } finally {
            setPaymentLoading(false);
        }
    };



    const handleDeleteFile = async (fileId) => {
        if (!window.confirm("Are you sure you want to delete this file?")) return;

        const token = localStorage.getItem("access_token");
        try {
            await axios.delete(`${baseUrl}/appointments/appointment_files/${fileId}/`, {
                headers: { Authorization: `Bearer ${token}` },
            });

            alert("File deleted successfully!");

            // ✅ Local state থেকে ওই file remove করে UI refresh করো
            setAppointment({
                ...appointment,
                patient_files: appointment.patient_files.filter((f) => f.id !== fileId),
            });
        } catch (err) {
            console.error("Failed to delete file:", err);
            alert("Could not delete file");
        }
    };



    const getStatusClass = (status) => {
        switch (status) {
            case "PENDING": return "badge bg-warning text-dark";
            case "CONFIRMED": return "badge bg-primary";
            case "COMPLETED": return "badge bg-success";
            case "CANCELLED": return "badge bg-danger";
            case "RESCHEDULED": return "badge bg-info text-dark";
            default: return "badge bg-secondary";
        }
    };

    return (
        <div className="container mb-5 appointment-card">
            {appointment.status !== "COMPLETED" && appointment.confirmed_time && (
                <div className="alert alert-primary text-center fs-4 fw-bold">
                    Appointment starts in: {timeLeft}
                </div>
            )}
            <h3 className="mb-4 text-primary fw-bold">Appointment Details</h3>

            {/* Appointment Info */}
            <div className="card shadow-sm mb-4">
                <div className="card-header bg-dark text-white fw-bold">
                    Appointment Information
                </div>
                <div className="card-body">
                    <table className="table table-striped table-bordered">
                        <tbody>
                            <tr>
                                <th>Appointment ID</th>
                                <td>{appointment.appointment_id}</td>
                            </tr>
                            <tr>
                                <th>Appointment Date</th>
                                <td>{appointment.appointment_date}</td>
                            </tr>
                            {appointment.status === "RESCHEDULED" && (
                                <tr>
                                    <th>Notice</th>
                                    <td>
                                        This appointment has been rescheduled by the doctor.
                                        New Date: <strong>{appointment.rescheduled_to}</strong>
                                    </td>
                                </tr>
                            )}
                            <tr>
                                <th>Appointment Type</th>
                                <td>{appointment.appointment_type}</td>
                            </tr>
                            <tr>
                                <th>Main Disease</th>
                                <td>{appointment.chief_complaint}</td>
                            </tr>
                            <tr>
                                <th>Status</th>
                                <td>
                                    <span className={getStatusClass(appointment.status)}>
                                        {appointment.status}
                                    </span>
                                </td>
                            </tr>

                            {/* ✅ Extra row only if CONFIRMED */}
                            {appointment.status === "CONFIRMED" && (
                                <tr>
                                    <th>Notice</th>
                                    <td>Doctor will call you on the appointment time via <strong style={{color:'red'}}>WhatsApp</strong> . So be active on the time.</td>
                                </tr>
                            )}
                        </tbody>
                    </table>

                </div>
            </div>


            {/* Doctor Info */}
            <div className="card shadow-sm mb-4">
                <div className="card-header bg-primary text-white fw-bold">
                    Doctor Information
                </div>
                <div className="card-body">
                    <table className="table table-striped table-bordered">
                        <tbody>
                            <tr>
                                <th>Doctor</th>
                                <td>{appointment.doctor_full_name}</td>
                            </tr>
                            <tr>
                                <th>Degree</th>
                                <td>{appointment.doctor_degree}</td>
                            </tr>
                            <tr>
                                <th>Specialization</th>
                                <td>{appointment.doctor_specialization}</td>
                            </tr>
                            
                            <tr>
                                <th>Designation</th>
                                <td>{appointment.doctor_designation}</td>
                            </tr>
                            <tr>
                                <th>Fees</th>
                                <td>{appointment.doctor_fees} BDT</td>
                            </tr>
                            <tr>
                                <th>Follow-up Fees</th>
                                <td>{appointment.doctor_followup_fees} BDT</td>
                            </tr>
                            <tr>
                                <th>About</th>
                                <td>{appointment.doctor_about}</td>
                            </tr>
                            <tr>
                                <th>Status</th>
                                <td>{appointment.doctor_status}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Patient Info */}
            <div className="card shadow-sm mb-4">
                <div className="card-header bg-success text-white fw-bold">
                    Patient Information
                </div>
                <div className="card-body">
                    <table className="table table-striped table-bordered">
                        <tbody>
                            <tr>
                                <th>Full Name</th>
                                <td>{appointment.patient_name}</td>
                            </tr>
                            <tr>
                                <th>Age</th>
                                <td>{appointment.patient_age}</td>
                            </tr>
                            <tr>
                                <th>Gender</th>
                                <td>{appointment.patient_gender}</td>
                            </tr>
                            <tr>
                                <th>WhatsApp</th>
                                <td>{appointment.patient_whatsapp}</td>
                            </tr>
                            <tr>
                                <th>Address</th>
                                <td>{appointment.patient_address}</td>
                            </tr>
                            <tr>
                                <th>Blood Group</th>
                                <td>{appointment.patient_blood_group}</td>
                            </tr>
                            <tr>
                                <th>Height</th>
                                <td>{appointment.patient_height} m</td>
                            </tr>
                            <tr>
                                <th>Weight</th>
                                <td>{appointment.patient_weight} kg</td>
                            </tr>
                            <tr>
                                <th>BMI</th>
                                <td>{appointment.patient_bmi}</td>
                            </tr>
                            <tr>
                                <th>Medical History</th>
                                <td>{appointment.patient_medical_history}</td>
                            </tr>
                            <tr>
                                <th>Extra Medical Complaint</th>
                                <td>{appointment.extra_note}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>


            {/* Patient Uploaded Files */}
            {appointment.patient_files && appointment.patient_files.length > 0 && (
                <div className="card shadow-sm mb-4">
                    <div className="card-header bg-info text-white fw-bold">
                        Patient Uploaded Files
                    </div>
                    <div className="card-body">
                        <table className="table table-bordered">
                            <thead>
                                <tr>
                                    <th style={{ width: "8%" }}>#</th>
                                    <th style={{ width: "50%" }}>Files</th>
                                    <th style={{ width: "28%" }}>Uploaded At</th>
                                    <th style={{ width: "14%" }}>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {appointment.patient_files.map((f, idx) => (
                                    <tr key={f.id}>
                                        <td>{idx + 1}</td>
                                        <td>
                                            {f.file.toLowerCase().endsWith(".pdf") ? (
                                                <a href={f.file} target="_blank" rel="noopener noreferrer">
                                                    {f.filename}
                                                </a>
                                            ) : (
                                                <a href={f.file} target="_blank" rel="noopener noreferrer">
                                                    <img
                                                        src={f.file}
                                                        alt="Patient Upload"
                                                        className="img-fluid rounded"
                                                        style={{ maxHeight: "80px" }}
                                                    />
                                                </a>
                                            )}
                                        </td> 
                                        <td>{new Date(f.uploaded_at).toLocaleString()}</td>
                                        <td>
                                            <button
                                                className="btn btn-sm btn-danger"
                                                onClick={() => handleDeleteFile(f.id)}
                                                disabled={appointment.status === "COMPLETED"}
                                            >
                                                ❌ Delete
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}

            {/* Doctor's Notes */}
            {appointment.doctor_notes && (
                <div className="card shadow-sm mb-4">
                    <div className="card-header bg-secondary text-white fw-bold">
                        Doctor's Prescription / Notes
                    </div>
                    <div className="card-body">
                        <p style={{ whiteSpace: "pre-line" }}>
                            {appointment.doctor_notes}
                        </p>
                    </div>
                </div>
            )}


            {/* Doctor Prescription */}
            {appointment.prescription && (
                <div className="card shadow-sm mb-4">
                    <div className="card-header bg-warning text-dark fw-bold">
                        Doctor's Uploaded Prescription
                    </div>
                    <div className="card-body">
                        <a
                            href={appointment.prescription}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="btn btn-outline-primary"
                        >
                            📄 View Prescription
                        </a>
                    </div>
                </div>
            )}


            {/* File Upload & Extra Note Actions */}
            <div className="card shadow-sm mb-4">
                <div className="card-header bg-info fw-bold">Your Actions</div>
                <div className="card-body">
                    {/* Extra Note */}
                    <div className="mb-3">
                        <label className="form-label">Add other medical Complaint</label>
                        <textarea
                            className="form-control"
                            value={note}
                            onChange={(e) => setNote(e.target.value)}
                            disabled={!isActive(appointment.status)} // ✅ active in CONFIRMED or RESCHEDULED
                        />
                        <button
                            className="btn btn-sm btn-primary mt-2"
                            onClick={handleAddNote}
                            disabled={!isActive(appointment.status)}
                        >
                            Save Note
                        </button>
                    </div>

                    {/* File Upload */}
                    <div className="mb-3">
                        <label className="form-label">Upload Your Medical History</label>
                        <input
                            type="file"
                            className="form-control"
                            onChange={(e) => setFile(e.target.files[0])}
                            disabled={!isActive(appointment.status)} // ✅ active in CONFIRMED or RESCHEDULED
                        />
                        <button
                            className="btn btn-sm btn-success mt-2"
                            onClick={handleFileUpload}
                            disabled={!isActive(appointment.status)}
                        >
                            Upload
                        </button>
                    </div>
                </div>
            </div>



            {/* Actions */}
            {/* Actions */}
            {appointment.status !== "COMPLETED" && (
                <div className="card shadow-sm">
                    <div className="card-header bg-warning fw-bold">Actions</div>
                    <div className="card-body">
                        <div className="d-flex justify-content-between">
                            {/* Cancel button */}
                            <button
                                className="btn btn-danger"
                                onClick={handleCancel}
                            >
                                Cancel Appointment
                            </button>

                            {/* Payment button → hide if CONFIRMED or RESCHEDULED */}
                            {!isActive(appointment.status) && (
                                <button
                                    className="btn btn-info"
                                    onClick={handlePayment}
                                    disabled={paymentLoading || appointment.is_paid}
                                >
                                    {appointment.is_paid
                                        ? "✅ Payment Done"
                                        : paymentLoading
                                            ? "Processing..."
                                            : "Make Payment"}
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            )}



        </div>
    );
}

export default AppointmentDetailsPatient;
