const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const notificationCtrl = require('../controllers/notificationCtrl');

router.get('/', auth, notificationCtrl.getNotifications);
router.patch('/:id/read', auth, notificationCtrl.markAsRead);

 module.exports = router;