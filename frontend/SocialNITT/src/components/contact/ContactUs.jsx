import React from "react";
import "./ContactUs.css";

function ContactUs() {
  return (
    <div className="contact-wrapper">
      <div className="contact-left">
        <h1>Talk to our team</h1>
        <p>We're committed to delivering the support you require to make your experience as smooth as possible.</p>

        <ul className="contact-details">
          <li>
            📍 66 Jade Hostel, NITT 
          </li>
          <li>
            📞 +91 amandevatwal
          </li>
          <li>
            📧 it'syourbadboyamandevatwal@kingpin.com
          </li>
        </ul>
      </div>

      <div className="contact-right">
        <form>
          <div className="form-row">
            <input type="text" placeholder="Your name" required />
            <input type="email" placeholder="example@example.com" required />
          </div>
          <textarea placeholder="Write your message..." rows="5" maxLength="500"></textarea>
          <div className="form-footer">
            <span>0/500</span>
            <button type="submit">Submit</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ContactUs;
