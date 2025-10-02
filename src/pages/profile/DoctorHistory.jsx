import React, { useEffect, useState } from "react";
import axios from "axios";
import { config } from "../../config";
import { Link } from "react-router-dom";

function DoctorHistory() {
    const { baseUrl } = config;
    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(true);

    // status badge helper
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

    useEffect(() => {
        const token = localStorage.getItem("access_token");
        if (!token) {
            window.location.href = "/login";
            return;
        }

        const fetchAppointments = async () => {
            try {
                const resp = await axios.get(`${baseUrl}/appointments/appointments/`, {
                    headers: { Authorization: `Bearer ${token}` },
                });

                // শুধু completed filter করলাম
                const completed = (resp.data.results || []).filter(
                    (a) => a.status === "COMPLETED"
                );

                setAppointments(completed);
            } catch (err) {
                console.error("Failed to load doctor history:", err);
                alert("Could not load appointment history");
            } finally {
                setLoading(false);
            }
        };

        fetchAppointments();
    }, [baseUrl]);

    if (loading) return <div className="text-center mt-5">Loading...</div>;
    if (appointments.length === 0)
        return <div className="container mt-5">No completed appointments found.</div>;

    return (
        <div className="container my-5">
            <h3 className="mb-4">Completed Appointments History</h3>

            <div className="table-responsive">
                <table className="table table-bordered table-striped text-center align-middle">
                    <thead className="table-light">
                        <tr>
                            <th style={{ width: "15%" }}>Appointment ID</th>
                            <th style={{ width: "15%" }}>Date</th>
                            <th style={{ width: "15%" }}>Time</th>
                            <th style={{ width: "25%" }}>Patient Name</th>
                            <th style={{ width: "10%" }}>Age</th>
                            <th style={{ width: "20%" }}>WhatsApp</th>
                            <th style={{ width: "10%" }}>Status</th>
                        </tr>
                    </thead>
                    <tbody>
                        {appointments.map((appointment) => (
                            <tr key={appointment.id}>
                                <td>
                                    <Link
                                        to={`/profile/appointments-doctor/${appointment.appointment_id}`}
                                        className="text-decoration-none fw-bold text-primary"
                                    >
                                        {appointment.appointment_id}
                                    </Link>
                                </td>
                                <td>{appointment.appointment_date}</td>
                                <td>
                                    {appointment.confirmed_time
                                        ? new Date(`1970-01-01T${appointment.confirmed_time}`).toLocaleTimeString([], {
                                            hour: "2-digit",
                                            minute: "2-digit",
                                            hour12: true,
                                        })
                                        : "-"}
                                </td>
                                <td>{appointment.patient_name}</td>
                                <td>{appointment.patient_age}</td>
                                <td>{appointment.patient_whatsapp}</td>
                                <td>
                                    <span className={getStatusClass(appointment.status)}>
                                        {appointment.status}
                                    </span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

export default DoctorHistory;
