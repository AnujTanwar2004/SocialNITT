import { useState } from "react";
import "./ContactUs.css";
import axios from "axios";

function ContactUs() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    message: "",
  });
  const [charCount, setCharCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    if (name === "message") {
      setCharCount(value.length);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    try {
      const response = await axios.post("/api/contact", formData);
      setSuccess("Message sent successfully! We'll get back to you soon.");
      setFormData({ name: "", email: "", message: "" });
      setCharCount(0);
    } catch (err) {
      setError(
        err.response?.data?.msg || "Failed to send message. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="contact-wrapper">
      <div className="contact-left">
        <h1>Talk to our team</h1>
        <p>
          We're committed to delivering the support you require to make your
          experience as smooth as possible.
        </p>

        <ul className="contact-details">
          <li>📍 66 Jade Hostel, NITT</li>
          <li>📞 +91 amandevatwal</li>
          <li>📧 it'syourbadboyamandevatwal@kingpin.com</li>
        </ul>
      </div>

      <div className="contact-right">
        <form onSubmit={handleSubmit}>
          {error && <div className="error-message">{error}</div>}
          {success && <div className="success-message">{success}</div>}

          <div className="form-row">
            <input
              type="text"
              name="name"
              placeholder="Your name"
              value={formData.name}
              onChange={handleInputChange}
              required
            />
            <input
              type="email"
              name="email"
              placeholder="example@example.com"
              value={formData.email}
              onChange={handleInputChange}
              required
            />
          </div>
          <textarea
            name="message"
            placeholder="Write your message..."
            rows="5"
            maxLength="500"
            value={formData.message}
            onChange={handleInputChange}
            required
          />
          <div className="form-footer">
            <span>{charCount}/500</span>
            <button type="submit" disabled={loading}>
              {loading ? "Sending..." : "Submit"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ContactUs;
