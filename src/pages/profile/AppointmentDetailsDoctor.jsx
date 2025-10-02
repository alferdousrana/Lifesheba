import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { config } from "../../config";
import "./custom.css";

function AppointmentDetailsDoctor() {
    const { appointmentId } = useParams();
    const { baseUrl } = config;
    const [appointment, setAppointment] = useState(null);
    const [loading, setLoading] = useState(true);
    const [confirmedTime, setConfirmedTime] = useState("");
    const [prescription, setPrescription] = useState(null);
    const [timeLeft, setTimeLeft] = useState("");
    const [rescheduleDate, setRescheduleDate] = useState("");

    const isActionActive = (status) => {
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

    // const handleCancel = async () => {
    //     if (!window.confirm("Are you sure you want to cancel this appointment?")) return;

    //     const token = localStorage.getItem("access_token");
    //     if (!token) {
    //         alert("You are not logged in.");
    //         return;
    //     }

    //     try {
    //         await axios.patch(
    //             `${baseUrl}/appointments/appointments/${appointment.appointment_id}/update_status/`,
    //             { status: "CANCELLED" },
    //             { headers: { Authorization: `Bearer ${token}` } }
    //         );

    //         alert("Appointment cancelled successfully!");
    //         window.location.href = "/profile/appointments"; // redirect back
    //     } catch (err) {
    //         console.error("Failed to cancel appointment:", err);
    //         alert("Could not cancel appointment. Please try again.");
    //     }
    // };

    // 2. doctor time set function
    const handleSetTime = async () => {
        if (!confirmedTime) return alert("Select a time first");
        const token = localStorage.getItem("access_token");

        try {
            await axios.post(
                `${baseUrl}/appointments/appointments/${appointment.appointment_id}/set_confirmed_time/`,
                { confirmed_time: confirmedTime },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            alert("Time set successfully!");
            window.location.reload();
        } catch (err) {
            console.error("Failed to set time:", err);
            alert("Could not set time");
        }
    };


    // 3. prescription upload function
    const handleUploadPrescription = async () => {
        if (!prescription) return alert("Select a prescription file first");
        const token = localStorage.getItem("access_token");
        const formData = new FormData();
        formData.append("prescription", prescription);

        try {
            await axios.post(
                `${baseUrl}/appointments/appointments/${appointment.appointment_id}/upload_prescription/`,
                formData,
                { headers: { Authorization: `Bearer ${token}`, "Content-Type": "multipart/form-data" } }
            );
            alert("Prescription uploaded!");
            setPrescription(null);
            window.location.reload();
        } catch (err) {
            console.error("Failed to upload prescription:", err);
            alert("Could not upload prescription");
        }
    };


    // 4. mark as complete function
    const handleMarkAsCompleted = async () => {
        if (!window.confirm("Are you sure you want to mark this appointment as completed?")) return;

        const token = localStorage.getItem("access_token");
        if (!token) {
            alert("You are not logged in.");
            return;
        }

        try {
            await axios.patch(
                `${baseUrl}/appointments/appointments/${appointment.appointment_id}/update_status/`,
                { status: "COMPLETED" },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            alert("✅ Appointment marked as completed!");
            window.location.reload();
        } catch (err) {
            console.error("Failed to mark as completed:", err);
            alert("Could not mark appointment as completed. Please try again.");
        }
    };


    const handleReschedule = async () => {
        if (!rescheduleDate) return alert("Select a new date first");
        const token = localStorage.getItem("access_token");

        try {
            await axios.post(
                `${baseUrl}/appointments/appointments/${appointment.appointment_id}/reschedule/`,
                { status: "RESCHEDULED", rescheduled_to: rescheduleDate },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            alert("Appointment rescheduled successfully!");
            window.location.reload();
        } catch (err) {
            console.error("Failed to reschedule:", err);
            alert("Could not reschedule appointment");
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
                                <th>Main Complaint</th>
                                <td>{appointment.chief_complaint}</td>
                            </tr>
                            <tr>
                                <th>Status</th>
                                <td><span className={getStatusClass(appointment.status)}>
                                    {appointment.status}
                                </span></td>
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
            {appointment.patient_files && appointment.patient_files.length > 0 ? (
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
                                    
                                </tr>
                            </thead>
                            <tbody>
                                {appointment.patient_files.map((f, idx) => (
                                    <tr key={f.id}>
                                        <td>{idx + 1}</td>
                                        <td>
                                            {/* যদি PDF হয় */}
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
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            ) : (
                <div className="card shadow-sm mb-4">
                    <div className="card-header bg-info text-white fw-bold">
                        Patient Uploaded Files
                    </div>
                    <div className="card-body">
                        <p>No files uploaded</p>
                    </div>
                </div>
            )}

            {/* Doctor Prescription */}
            <div className="card shadow-sm mb-4">
                <div className="card-header bg-warning text-dark fw-bold">
                    Uploaded Prescription
                </div>
                <div className="card-body">
                    {appointment.prescription ? (
                        <div>
                            {appointment.prescription.toLowerCase().endsWith(".pdf") ? (
                                <a
                                    href={appointment.prescription}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="btn btn-outline-primary"
                                >
                                    📄 View Prescription
                                </a>
                            ) : (
                                <a
                                    href={appointment.prescription}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    <img
                                        src={appointment.prescription}
                                        alt="Prescription"
                                        className="img-fluid rounded"
                                        style={{ maxHeight: "200px" }}
                                    />
                                    <div className="mt-2">
                                        {appointment.prescription.split("/").pop()}
                                    </div>
                                </a>
                            )}
                        </div>
                    ) : (
                        <p>No prescription uploaded</p>
                    )}
                </div>
            </div>

            {/* Doctor Notes Section */}
            <div className="card shadow-sm mb-4">
                <div className="card-header bg-secondary text-white fw-bold">
                    Doctor's Notes
                </div>
                <div className="card-body">
                    <textarea
                        className="form-control"
                        rows={4}
                        style={{ minHeight: "120px" }}
                        placeholder="Write your notes here..."
                        value={appointment.doctor_notes || ""}
                        onChange={(e) =>
                            setAppointment({ ...appointment, doctor_notes: e.target.value })
                        }
                        disabled={!isActionActive(appointment.status)}
                    />
                    <button
                        className="btn btn-sm btn-primary mt-3"
                        onClick={async () => {
                            const token = localStorage.getItem("access_token");
                            try {
                                await axios.patch(
                                    `${baseUrl}/appointments/appointments/${appointment.appointment_id}/save_doctor_notes/`,
                                    { doctor_notes: appointment.doctor_notes },
                                    { headers: { Authorization: `Bearer ${token}` } }
                                );
                                alert("Doctor notes saved successfully!");
                            } catch (err) {
                                console.error("Failed to save doctor notes:", err);
                                alert("Could not save doctor notes");
                            }
                        }}
                        disabled={!isActionActive(appointment.status)}
                    >
                        Save Notes
                    </button>
                </div>
            </div>



            
            
            {/* Actions section */}
            <div className="card shadow-sm">
                <div className="card-header bg-warning fw-bold">Actions</div>
                <div className="mt-3 mx-5">
                    <div className="row">
                        {/* Confirmed Time - Left Side */}
                        <div className="col-md-6 mb-3">
                            <label className="form-label">Set Confirmed Time</label>
                            <input
                                type="time"
                                className="form-control"
                                value={confirmedTime}
                                onChange={(e) => setConfirmedTime(e.target.value)}
                                disabled={!isActionActive(appointment.status)}
                            />
                            <button
                                className="btn btn-sm btn-primary mt-2"
                                onClick={handleSetTime}
                                disabled={!isActionActive(appointment.status)}
                            >
                                Save Time
                            </button>
                        </div>

                        {/* Prescription Upload - Right Side */}
                        <div className="col-md-6 mb-3">
                            <label className="form-label">Upload Prescription</label>
                            <input
                                type="file"
                                className="form-control"
                                onChange={(e) => setPrescription(e.target.files[0])}
                                disabled={!isActionActive(appointment.status)}
                            />
                            <button
                                className="btn btn-sm btn-success mt-2"
                                onClick={handleUploadPrescription}
                                disabled={!isActionActive(appointment.status)}
                            >
                                Upload Prescription
                            </button>
                        </div>
                    </div>
                </div>

                <div
                    className="card-body d-flex justify-content-between align-items-center"
                    style={{
                        marginTop: "20px",
                        marginBottom: "20px",
                        background: "#D7F9FC",
                        margin: "20px",
                        borderRadius: "10px",
                    }}
                >
                    {/* Reschedule */}
                    <div className="col-md-4 mb-3">
                        <label className="form-label">Reschedule Appointment</label>
                        <input
                            type="date"
                            className="form-control"
                            style={{width: "80%"}}
                            value={rescheduleDate}
                            onChange={(e) => setRescheduleDate(e.target.value)}
                            disabled={!isActionActive(appointment.status)}
                        />
                        <button
                            className="btn btn-sm btn-warning mt-2"
                            onClick={handleReschedule}
                            disabled={!isActionActive(appointment.status)}
                        >
                            Reschedule
                        </button>
                    </div>

                    <button
                        className="btn btn-success"
                        style={{height: "50px"}}
                        onClick={handleMarkAsCompleted}
                        disabled={appointment.status === "COMPLETED"}
                    >
                        Mark as Completed
                    </button>

                    <button
                        className="btn btn-info me-2"
                        style={{ height: "50px" }}
                        onClick={() => window.open(`https://wa.me/${appointment.patient_whatsapp}`, "_blank")}
                        disabled={!isActionActive(appointment.status)}
                    >
                        📞 Make a Call
                    </button>
                </div>
            </div>



        </div>
    );
}

export default AppointmentDetailsDoctor;
