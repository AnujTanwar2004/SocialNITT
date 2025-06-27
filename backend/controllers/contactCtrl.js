const Users = require("../models/userModel");
const Contact = require("../models/contactModel");
const sendMail = require("./sendMail");

const contactCtrl = {
  submitContactForm: async (req, res) => {
    try {
      const { name, email, message } = req.body;

      if (!name || !email || !message) {
        return res.status(400).json({ msg: "Please fill in all fields." });
      }

      // Save contact form to database
      const newContact = new Contact({
        name,
        email,
        message,
      });

      await newContact.save();

      // Find all admin users
      const admins = await Users.find({ role: 1 });

      if (admins.length > 0) {
        // Send email to first admin
        const adminEmail = admins[0].email;
        const emailMsg = `
          <div style="max-width: 700px; margin:auto; border: 10px solid #ddd; padding: 50px 20px; font-size: 110%;">
            <h2 style="text-align: center; text-transform: uppercase;color: teal;">New Contact Form Submission</h2>
            <p><strong>Name:</strong> ${name}</p>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Message:</strong></p>
            <div style="background: #f9f9f9; padding: 20px; border-left: 4px solid #850E35;">
              ${message}
            </div>
            <p style="margin-top: 20px;">Submitted on: ${new Date().toLocaleString()}</p>
          </div>
        `;

        await sendMail(
          adminEmail,
          emailMsg,
          "New Contact Form Submission - SocialNITT"
        );
      }

      res.json({
        msg: "Message sent successfully! We'll get back to you soon.",
      });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },

  // Admin functions
  getAllContacts: async (req, res) => {
    try {
      const contacts = await Contact.find().sort({ createdAt: -1 });
      res.json(contacts);
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },

  markAsRead: async (req, res) => {
    try {
      const { id } = req.params;
      await Contact.findByIdAndUpdate(id, { status: "read" });
      res.json({ msg: "Contact marked as read." });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },

  deleteContact: async (req, res) => {
    try {
      const { id } = req.params;
      const contact = await Contact.findById(id);

      if (!contact) {
        return res.status(404).json({ msg: "Contact not found." });
      }

      await contact.deleteOne();
      res.json({ msg: "Contact deleted successfully!" });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },

  replyToContact: async (req, res) => {
    try {
      const { id } = req.params;
      const { reply } = req.body;

      const contact = await Contact.findById(id);
      if (!contact) {
        return res.status(404).json({ msg: "Contact not found." });
      }

      // Update contact with reply
      await Contact.findByIdAndUpdate(id, {
        adminReply: reply,
        status: "replied",
      });

      // Send reply email to user
      const emailMsg = `
        <div style="max-width: 700px; margin:auto; border: 10px solid #ddd; padding: 50px 20px; font-size: 110%;">
          <h2 style="text-align: center; text-transform: uppercase;color: teal;">Reply from SocialNITT Team</h2>
          <p>Dear ${contact.name},</p>
          <p>Thank you for contacting us. Here's our response to your message:</p>
          
          <div style="background: #f0f0f0; padding: 15px; margin: 20px 0; border-left: 4px solid #ccc;">
            <strong>Your Original Message:</strong><br>
            ${contact.message}
          </div>

          <div style="background: #f9f9f9; padding: 20px; border-left: 4px solid #850E35;">
            <strong>Our Reply:</strong><br>
            ${reply}
          </div>

          <p style="margin-top: 20px;">Best regards,<br>SocialNITT Team</p>
        </div>
      `;

      await sendMail(contact.email, emailMsg, "Reply from SocialNITT Team");

      res.json({ msg: "Reply sent successfully!" });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
};

module.exports = contactCtrl;
