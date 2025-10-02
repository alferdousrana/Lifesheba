import React from "react";
import { Link } from "react-router-dom";

export default function PaymentFail() {
    return (
        <div className="container text-center mt-5">
            <h2 className="text-danger">❌ Payment Failed</h2>
            <p>Something went wrong. Please try again.</p>
            <Link to="/profile/appointments" className="btn btn-primary mt-3">
                Back to Appointments
            </Link>
        </div>
    );
}
