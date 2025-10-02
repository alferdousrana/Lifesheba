import React, { useEffect, useState } from "react";
import axios from "axios";
import { config } from "../../config";
import { Link, useNavigate } from "react-router-dom";

function MyAppointments() {
  const { baseUrl } = config;
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [role, setRole] = useState(null);
  const navigate = useNavigate();

  // Pay Now handler with appointmentId
  const handlePayNow = (appointmentId) => {
    navigate(`/profile/appointments-patient/${appointmentId}#make-payment`);
  };

  const doctorVisibleAppointments = (appointments) => {
    return appointments.filter(
      (a) => a.status === "CONFIRMED" || a.status === "RESCHEDULED"
    );
  };


  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (!token) {
      window.location.href = "/login"; // not logged in
      return;
    }

    const fetchAppointments = async () => {
      try {
        // fetch profile first to know role
        const profileRes = await axios.get(`${baseUrl}/accounts/profile/me/`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setRole(profileRes.data.role?.toLowerCase());

        // fetch appointments
        const resp = await axios.get(`${baseUrl}/appointments/appointments/`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        setAppointments(resp.data.results || []);
      } catch (err) {
        console.error("Failed to load appointments:", err);
        alert("Could not load appointments");
      } finally {
        setLoading(false);
      }
    };

    fetchAppointments();
  }, [baseUrl]);

  // sorting before rendering (descending by created_at)
  const sortedAppointments = [...appointments].sort(
    (a, b) => new Date(b.created_at) - new Date(a.created_at)
  );


  if (loading) return <div className="text-center mt-5">Loading...</div>;
  if (appointments.length === 0)
    return <div className="container mt-5">No appointments found.</div>;

  // Helper for status badge
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
    <div className="container my-5">
      <h3 className="mb-4">My Appointments</h3>

      {/* ================= CUSTOMER TABLE ================= */}
      {role === "customer" && (
        <div className="table-responsive">
          <table className="table table-bordered table-striped align-middle text-center">
            <thead className="table-light">
              <tr>
                <th style={{ width: "18%" }}>Appointment ID</th> 
                <th style={{ width: "10%" }}>Date</th> 
                <th style={{ width: "10%" }}>Time</th> 
                <th style={{ width: "28%" }}>Doctor</th> 
                <th style={{ width: "14%" }}>Patient</th> 
                <th style={{ width: "10%" }}>Status</th> 
                <th style={{ width: "10%" }}>Payment</th>
              </tr>
            </thead>
            <tbody>
              {sortedAppointments.length === 0 ? (
                <tr>
                  <td colSpan="7" className="text-muted text-center">
                    No appointments found.
                  </td>
                </tr>
              ) : (
                  sortedAppointments.map((appointment) => (
                  <tr key={appointment.id}>
                    {/* Appointment ID */}
                    <td>
                      <Link
                        to={`/profile/appointments-patient/${appointment.appointment_id}`}
                        className="text-decoration-none fw-bold text-primary"
                      >
                        {appointment.appointment_id}
                      </Link>
                    </td>

                    {/* Appointment Date */}
                    <td>
                      {appointment.rescheduled_to
                        ? appointment.rescheduled_to
                        : appointment.appointment_date}
                    </td>

                    {/* Appointment Time */}
                    <td>
                      {appointment.confirmed_time
                        ? new Date(`1970-01-01T${appointment.confirmed_time}`).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                            hour12: true,
                          })
                        : "-"}
                    </td>

                    {/* Doctor */}
                    <td>
                      <div className="fw-bold">Dr. {appointment.doctor_full_name}</div>
                      <small className="text-muted">{appointment.doctor_specialization}</small>
                    </td>

                    {/* Patient */}
                    <td>{appointment.patient_name}</td>

                    {/* Status */}
                    <td>
                      <span className={getStatusClass(appointment.status)}>
                        {appointment.status}
                      </span>
                    </td>

                    {/* Payment */}
                    <td>
                      {appointment.status === "PENDING" ? (
                        <button
                          className="btn btn-sm btn-success"
                          onClick={() => handlePayNow(appointment.appointment_id)}
                        >
                          💳 Pay Now
                        </button>
                      ) : (
                        <span className="text-muted">Paid</span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* ================= DOCTOR TABLE ================= */}
      {role === "doctor" && (
        <table className="table table-bordered table-sm table-responsive text-center align-middle">
          <thead className="table-light">
            <tr>
              <th style={{ width: "15%" }}>Appointment ID</th>
              <th style={{ width: "15%" }}>Date</th>
              <th style={{ width: "15%" }}>Confirm Time</th>
              <th style={{ width: "20%" }}>Patient Name</th>
              <th style={{ width: "10%" }}>Age</th>
              <th style={{ width: "15%" }}>WhatsApp</th>
              <th style={{ width: "10%" }}>Status</th>
            </tr>
          </thead>
          <tbody>
            {doctorVisibleAppointments(sortedAppointments).length === 0 ? (
              <tr>
                <td colSpan="7" className="text-center text-muted">
                  No confirmed or rescheduled appointments found.
                </td>
              </tr>
            ) : (
                doctorVisibleAppointments(sortedAppointments).map((appointment) => (
                <tr key={appointment.id}>
                  <td>
                    <Link
                      to={`/profile/appointments-doctor/${appointment.appointment_id}`}
                      className="text-decoration-none"
                    >
                      {appointment.appointment_id}
                    </Link>
                  </td>
                  <td>
                    {appointment.rescheduled_to
                      ? appointment.rescheduled_to
                      : appointment.appointment_date}
                  </td>
                  <td>
                    {appointment.confirmed_time
                      ? new Date(`1970-01-01T${appointment.confirmed_time}`).toLocaleTimeString(
                        [],
                        {
                          hour: "2-digit",
                          minute: "2-digit",
                          hour12: true,
                        }
                      )
                      : ""}
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
              ))
            )}
          </tbody>
        </table>
      )}
    </div>
  );
}

export default MyAppointments;
