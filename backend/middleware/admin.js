const Users = require('../models/userModel');

const admin = async (req, res, next) => {
  try {
    const user = await Users.findById(req.user.id);
    if (!user || user.role !== 1) {
      return res.status(403).json({ msg: "Admin resources access denied." });
    }
    next();
  } catch (err) {
    return res.status(500).json({ msg: err.message });
  }
};

module.exports = admin;