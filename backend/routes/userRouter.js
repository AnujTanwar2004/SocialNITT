const express = require("express");
const router = express.Router();

const userCtrl = require("../controllers/userCtrl");
const auth = require("../middleware/auth");

// User Registration & Activation
router.post("/register", userCtrl.register);
router.post("/activation", userCtrl.activateEmail);

// Authentication
router.post("/login", userCtrl.login);
router.post("/refresh_token", userCtrl.getAccessToken);
router.get("/logout", userCtrl.logout);

// Password Management
router.post("/forgot", userCtrl.forgotPassword);
router.post("/reset", auth, userCtrl.resetPassword);

// User Profile
router.get("/infor", auth, userCtrl.getUserInfo);
router.patch("/update", auth, userCtrl.updateUser);
router.get('/top-users', require('../controllers/userCtrl').getTopUsers);
router.get('/top-users-week', require('../controllers/userCtrl').getTopUsersWeek);

module.exports = router;
