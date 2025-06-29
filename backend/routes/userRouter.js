
const express = require("express");
const router = express.Router();

const userCtrl = require("../controllers/userCtrl");
const auth = require("../middleware/auth");

// DAuth Authentication
router.get("/dauth/login", userCtrl.dauthLogin);
router.get("/dauth/callback", userCtrl.dauthCallback);

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
router.get('/top-users', userCtrl.getTopUsers);
router.get('/top-users-week', userCtrl.getTopUsersWeek);

router.get('/info', auth, userCtrl.getUserInfo);

// Admin routes
const admin = require("../middleware/admin");
router.get("/admin/all", auth, admin, userCtrl.getAllUsers);
router.delete("/admin/:id", auth, admin, userCtrl.adminDeleteUser);

module.exports = router;
