import React, { useState, useEffect } from "react";
import axios from "axios";
import { config } from "../config";
import TextInput from "../pages/profile/components/TextInput";
import contactImage from "../assets/images/HomeBanner.png";

function ContactPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState("");

  // ✅ Fetch user profile if logged in
  useEffect(() => {
    const token = localStorage.getItem("access_token");
    if (!token) return;

    const fetchProfile = async () => {
      try {
        const res = await axios.get(`${config.baseUrl}/accounts/profile/me/`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        // ধরছি API থেকে আসছে: { email: "", full_name: "" }
        setFormData((prev) => ({
          ...prev,
          name: res.data.full_name || "",
          email: res.data.email || "",
        }));
      } catch (err) {
        console.error("❌ Profile fetch failed:", err);
      }
    };

    fetchProfile();
  }, []);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatus("");

    try {
      await axios.post(`${config.baseUrl}/contacts/contact/`, formData);
      setStatus("✅ Message sent successfully!");
      setFormData({ name: "", email: "", subject: "", message: "" });
    } catch (err) {
      console.error(err);
      setStatus("❌ Failed to send message. Try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container my-5">
      <h1 className="text-center mb-4">Contact Us</h1>

      <div className="row">
        {/* Left Side: Image */}
        <div className="col-md-6 mb-4">
          <img
            src={contactImage}
            alt="Contact"
            className="img-fluid rounded shadow"
            style={{ objectFit: "cover", width: "100%", height: "100%" }}
          />
        </div>

        {/* Right Side: Contact Form */}
        <div className="col-md-6">
          <form onSubmit={handleSubmit} className="row">
            <TextInput
              label="Full Name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              col={12}
              icon="user"
            />
            <TextInput
              label="Email Address"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              col={12}
              icon="email"
            />
            <TextInput
              label="Subject"
              name="subject"
              value={formData.subject}
              onChange={handleChange}
              col={12}
              icon="note"
            />
            <TextInput
              label="Message"
              name="message"
              multiline
              rows={5}
              style={{ height: "90px"}} 
              value={formData.message}
              onChange={handleChange}
              col={12}
              icon="message"
            />

            <div className="col-12">
              <button
                type="submit"
                className="btn btn-primary w-100"
                disabled={loading}
              >
                {loading ? "Sending..." : "Send Message"}
              </button>
            </div>
          </form>

          {status && <p className="mt-3 text-center">{status}</p>}
        </div>
      </div>
    </div>
  );
}

export default ContactPage;
