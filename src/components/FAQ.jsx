import React from "react";
import { Accordion } from "react-bootstrap";
import { FaQuestionCircle } from "react-icons/fa";
import faq from "../assets/images/faq.png";

function FAQ() {
    const faqs = [
        {
            q: "What is LifeSheba?",
            a: "LifeSheba is a digital healthcare service platform that connects patients with doctors, lab tests, and other medical services online."
        },
        {
            q: "How can I book a doctor’s appointment?",
            a: "You can easily book appointments through the LifeSheba app or website by selecting your doctor, preferred time slot, and confirming the booking."
        },
        {
            q: "Does LifeSheba provide home sample collection for lab tests?",
            a: "Yes, LifeSheba offers home sample collection for various diagnostic tests. You can schedule it from the app."
        },
        {
            q: "Is LifeSheba available 24/7?",
            a: "Yes, LifeSheba provides access to healthcare services anytime, anywhere. Some services like emergency support are available 24/7."
        },
        {
            q: "How secure is my medical data?",
            a: "LifeSheba uses encrypted systems to protect patient data and ensures that all information remains confidential and secure."
        }
    ];

    return (
        <div className="container">
            <div className="row">
                <h2 className="text-center mb-5">
                    <FaQuestionCircle className="me-2 text-primary" />
                    Frequently Asked Questions
                </h2>
                <div className="col-md-6">

                    <Accordion defaultActiveKey="0" flush>
                        {faqs.map((faq, index) => (
                            <Accordion.Item eventKey={index.toString()} key={index}>
                                <Accordion.Header>
                                    <FaQuestionCircle className="me-2 text-secondary" />
                                    {faq.q}
                                </Accordion.Header>
                                <Accordion.Body>{faq.a}</Accordion.Body>
                            </Accordion.Item>
                        ))}
                    </Accordion>
                </div>
                <div className="col-md-6 text-center" style={{maxHeight: "450px"}}>
                    <img src={faq} className="img-fluid" alt="FAQ" style={{height: "100%"}}/>
                </div>

            </div>

        </div>
    );
}

export default FAQ;
