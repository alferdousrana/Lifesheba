import React, { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";

export default function PaymentSuccess() {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();
    const appointmentId = searchParams.get("appointment_id"); // ✅ get id from URL

    useEffect(() => {
        if (appointmentId) {
            const timer = setTimeout(() => {
                navigate(`/profile/appointments-patient/${appointmentId}`);
                // ✅ এখন slug যাবে, numeric id না
            }, 2000);

            return () => clearTimeout(timer);
        }
    }, [appointmentId, navigate]);


    return (
        <div className="container text-center mt-5">
            <h2 className="text-success">✅ Payment Successful!</h2>
            <p>
                Redirecting you to your appointment details...
            </p>
        </div>
    );
}
