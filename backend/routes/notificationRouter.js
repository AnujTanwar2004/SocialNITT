const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const admin = require('../middleware/admin');
const notificationCtrl = require('../controllers/notificationCtrl');

router.get('/', auth, notificationCtrl.getNotifications);
router.patch('/:id/read', auth, notificationCtrl.markAsRead);

// Admin routes
router.get('/admin/all', auth, admin, notificationCtrl.getAllNotifications);
router.delete('/admin/:id', auth, admin, notificationCtrl.adminDeleteNotification);

module.exports = router;