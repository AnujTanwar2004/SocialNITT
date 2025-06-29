const Notification = require('../models/notificationModel');

exports.getNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find({ user: req.user.id }).sort({ createdAt: -1 });
    res.json(notifications);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

exports.markAsRead = async (req, res) => {
  try {
    await Notification.findByIdAndUpdate(req.params.id, { isRead: true });
    res.json({ msg: "Notification marked as read." });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

// Add admin functions
exports.getAllNotifications = async (req, res) => {
  try {
    const notifications = await Notification.find()
      .populate('user', 'name email')
      .sort({ createdAt: -1 });
    res.json(notifications);
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};

exports.adminDeleteNotification = async (req, res) => {
  try {
    const notification = await Notification.findById(req.params.id);
    if (!notification) {
      return res.status(404).json({ msg: "Notification not found." });
    }
    
    await notification.deleteOne();
    res.json({ msg: "Notification deleted successfully!" });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
};