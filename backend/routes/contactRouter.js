const express = require("express");
const router = express.Router();
const contactCtrl = require("../controllers/contactCtrl");
const auth = require("../middleware/auth");
const admin = require("../middleware/admin");

// Public route
router.post("/", contactCtrl.submitContactForm);

// Admin routes
router.get("/admin/all", auth, admin, contactCtrl.getAllContacts);
router.patch("/admin/:id/read", auth, admin, contactCtrl.markAsRead);
router.delete("/admin/:id", auth, admin, contactCtrl.deleteContact);
router.post("/admin/:id/reply", auth, admin, contactCtrl.replyToContact);

module.exports = router;
