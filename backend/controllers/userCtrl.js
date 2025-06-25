const Users = require("../models/userModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const axios = require("axios"); // Add this import for DAuth
const sendMail = require("./sendMail");
const logToFile = require("../utils/logger");

const {
  CLIENT_URL,
  DAUTH_CLIENT_ID,        // Add these for DAuth
  DAUTH_CLIENT_SECRET,    // Add these for DAuth
  DAUTH_REDIRECT_URI,     // Add these for DAuth
  ACTIVATION_TOKEN_SECRET,
  ACCESS_TOKEN_SECRET,
  REFRESH_TOKEN_SECRET,
} = process.env;

const userCtrl = {
  // ADD THESE DAUTH METHODS TO YOUR EXISTING CONTROLLER
  dauthLogin: (req, res) => {
    const dauthUrl = `https://auth.delta.nitt.edu/authorize?client_id=${DAUTH_CLIENT_ID}&redirect_uri=${encodeURIComponent(DAUTH_REDIRECT_URI)}&response_type=code&grant_type=authorization_code&scope=user`;
    res.redirect(dauthUrl);
  },

  dauthCallback: async (req, res) => {
    const code = req.query.code;
    if (!code) return res.status(400).json({ msg: "No code provided" });

    try {
      // Use URLSearchParams for form-encoded data
      const tokenData = new URLSearchParams({
        grant_type: "authorization_code",
        code,
        client_id: DAUTH_CLIENT_ID,
        client_secret: DAUTH_CLIENT_SECRET,
        redirect_uri: DAUTH_REDIRECT_URI,
      });

      const tokenRes = await axios.post("https://auth.delta.nitt.edu/api/oauth/token", tokenData, {
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
      });

      const access_token = tokenRes.data.access_token;

      // Use POST request to /api/resources/user
      const userRes = await axios.post("https://auth.delta.nitt.edu/api/resources/user", {}, {
        headers: { Authorization: `Bearer ${access_token}` },
      });

      console.log('User response:', userRes.data);
      
      const { name, email } = userRes.data;

      let user = await Users.findOne({ email });

      if (!user) {
        user = new Users({ name, email });
        await user.save();
      }

      const refreshToken = createRefreshToken({ id: user._id });

      res.cookie("refreshtoken", refreshToken, {
        httpOnly: true,
        path: "/user/refresh_token",
        maxAge: 7 * 24 * 60 * 60 * 1000,
      });

      const token = createAccessToken({ id: user._id });

      res.redirect(`${CLIENT_URL}?access_token=${token}`);
    } catch (err) {
      console.error("DAuth callback error:", err.response?.data || err.message);
      res.status(500).json({ msg: "DAuth login failed", error: err.response?.data });
    }
  },

  // YOUR EXISTING METHODS (keep all of these)
  register: async (req, res) => {
    try {
      const { name, email, password } = req.body;
      if (!name || !email || !password)
        return res.status(400).json({ msg: "Please fill in all fields." });

      if (!validateEmail(email))
        return res.status(400).json({ msg: "Invalid email format." });

      const userExists = await Users.findOne({ email });
      if (userExists)
        return res.status(400).json({ msg: "Email already registered." });

      if (password.length < 8)
        return res
          .status(400)
          .json({ msg: "Password must be at least 8 characters." });

      const passwordHash = await bcrypt.hash(password, 12);

      const newUser = { name, email, password: passwordHash };
      const activationToken = createActivationToken(newUser);

      const url = `http://localhost:3000/user/activate/${activationToken}`;

      await sendMail(email, url, "Verify your email address");

      logToFile('register.log', `User registered: ${newUser.email} (id: ${newUser._id})`);

      res.json({ msg: "Register Success! Please activate your email." });
    } catch (err) {
      console.error(err);
      res.status(500).json({ msg: "Server Error. Please try again." });
    }
  },

  activateEmail: async (req, res) => {
    try {
      console.log("=== ACTIVATION START ===");
      const { activation_token } = req.body;
      console.log(
        "Received token:",
        activation_token ? "Token present" : "No token"
      );

      if (!activation_token) {
        console.log("❌ No activation token provided");
        return res.status(400).json({ msg: "No activation token provided." });
      }

      console.log("🔍 Verifying JWT token...");
      const user = jwt.verify(activation_token, ACTIVATION_TOKEN_SECRET);
      console.log("✅ Token verified successfully");
      console.log("Token payload:", { name: user.name, email: user.email });

      const { name, email, password } = user;

      console.log("🔍 Checking if user already exists...");
      const exists = await Users.findOne({ email });

      if (exists) {
        console.log("✅ User already exists and is activated:", email);

        return res.json({
          msg: "Account already activated! You can now login.",
        });
      }

      console.log("✅ User doesn't exist, creating new user...");

      const newUser = new Users({ name, email, password });
      console.log("🔍 Saving user to database...");

      await newUser.save();
      console.log("✅ User saved successfully!");
      console.log("=== ACTIVATION SUCCESS ===");

      res.json({ msg: "Account activated successfully!" });
    } catch (err) {
      console.log("=== ACTIVATION ERROR ===");
      console.error("Full error object:", err);
      console.error("Error name:", err.name);
      console.error("Error message:", err.message);

      if (err.name === "TokenExpiredError") {
        console.log("❌ Token expired");
        return res
          .status(400)
          .json({ msg: "Activation link has expired. Please register again." });
      }

      if (err.name === "JsonWebTokenError") {
        console.log("❌ Invalid token");
        return res.status(400).json({ msg: "Invalid activation token." });
      }

      if (err.code === 11000) {
        console.log(
          "✅ User already exists (duplicate key error) - treating as successful activation"
        );
        return res.json({
          msg: "Account already activated! You can now login.",
        });
      }

      console.log("❌ Unknown error during activation");
      res.status(500).json({ msg: "Activation failed. Please try again." });
    }
  },

  login: async (req, res) => {
    try {
      const { email, password } = req.body;
      const user = await Users.findOne({ email });

      if (!user) return res.status(400).json({ msg: "Email not registered." });

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) return res.status(400).json({ msg: "Incorrect password." });

      const refreshToken = createRefreshToken({ id: user._id });

      res.cookie("refreshtoken", refreshToken, {
        httpOnly: true,
        path: "/user/refresh_token",
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      });

      const accessToken = createAccessToken({ id: user._id });

      // Log successful login
      logToFile("login.log", `User login: ${email} (id: ${user._id})`);

      res.json({
        msg: "Login successful.",
        access_token: accessToken,
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({ msg: "Server Error. Please try again." });
    }
  },

  getAccessToken: (req, res) => {
    try {
      const rf_token = req.cookies.refreshtoken;
      if (!rf_token)
        return res.status(401).json({ msg: "Please login first." });

      jwt.verify(rf_token, REFRESH_TOKEN_SECRET, (err, user) => {
        if (err)
          return res.status(403).json({ msg: "Invalid or expired token." });

        const accessToken = createAccessToken({ id: user.id });
        res.json({ access_token: accessToken });
      });
    } catch (err) {
      console.error(err);
      res.status(500).json({ msg: "Token Error." });
    }
  },

  forgotPassword: async (req, res) => {
    try {
      const { email } = req.body;
      const user = await Users.findOne({ email });

      if (!user) return res.status(400).json({ msg: "Email not registered." });

      const accessToken = createAccessToken({ id: user._id });

      const url = `http://localhost:3000/user/reset/${accessToken}`;

      await sendMail(email, url, "Reset your password");
      res.json({ msg: "Password reset email sent." });
    } catch (err) {
      console.error(err);
      res.status(500).json({ msg: "Server Error. Please try again." });
    }
  },

  resetPassword: async (req, res) => {
    try {
      const { password } = req.body;

      if (password.length < 8)
        return res
          .status(400)
          .json({ msg: "Password must be at least 8 characters." });

      const passwordHash = await bcrypt.hash(password, 12);

      await Users.findOneAndUpdate(
        { _id: req.user.id },
        {
          password: passwordHash,
        }
      );

      res.json({ msg: "Password updated successfully!" });
    } catch (err) {
      console.error(err);
      res.status(500).json({ msg: "Password reset failed." });
    }
  },

  getUserInfo: async (req, res) => {
    try {
      const user = await Users.findById(req.user.id).select("-password");
      res.json(user);
    } catch (err) {
      console.error(err);
      res.status(500).json({ msg: "Failed to fetch user data." });
    }
  },

  logout: (req, res) => {
    try {
      res.clearCookie("refreshtoken", { path: "/user/refresh_token" });
      res.json({ msg: "Logged out successfully." });
    } catch (err) {
      console.error(err);
      res.status(500).json({ msg: "Logout error." });
    }
  },

  updateUser: async (req, res) => {
    try {
      const { name, avatar } = req.body;
      await Users.findOneAndUpdate({ _id: req.user.id }, { name, avatar });
      res.json({ msg: "Profile updated." });
    } catch (err) {
      console.error(err);
      res.status(500).json({ msg: "Profile update failed." });
    }
  },

  getTopUsers: async (req, res) => {
    try {
      const topUsers = await Users.find({})
        .sort({ points: -1 })
        .limit(3)
        .select("name avatar points");
      res.json(topUsers);
    } catch (err) {
      res.status(500).json({ msg: err.message });
    }
  },

  getTopUsersWeek: async (req, res) => {
    try {
      const oneWeekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
      const users = await Users.aggregate([
        { $unwind: "$pointsHistory" },
        { $match: { "pointsHistory.date": { $gte: oneWeekAgo } } },
        {
          $group: {
            _id: "$_id",
            name: { $first: "$name" },
            avatar: { $first: "$avatar" },
            weeklyPoints: { $sum: "$pointsHistory.points" },
          },
        },
        { $sort: { weeklyPoints: -1 } },
        { $limit: 3 },
      ]);
      res.json(users);
    } catch (err) {
      res.status(500).json({ msg: err.message });
    }
  },

  deleteProduct: async (req, res) => {
    try {
      // Assuming productId is passed as a URL parameter
      const { productId } = req.params;

      // Find the user and update their points and pointsHistory
      await Users.findByIdAndUpdate(product.user, {
        $inc: { points: 1 },
        $push: {
          pointsHistory: { points: 1, reason: "contacted", date: new Date() },
        },
      });

      res.json({ msg: "Product deleted and points updated." });
    } catch (err) {
      console.error(err);
      res.status(500).json({ msg: "Error deleting product." });
    }
  },

  getAllUsers: async (req, res) => {
    try {
      const users = await Users.find({})
        .select("-password") // Exclude password field
        .sort({ createdAt: -1 }); // Sort by newest first
      res.json(users);
    } catch (err) {
      res.status(500).json({ msg: err.message });
    }
  },

  // Admin delete user
  adminDeleteUser: async (req, res) => {
    try {
      const user = await Users.findById(req.params.id);
      if (!user) return res.status(404).json({ msg: "User not found." });
      
      await user.deleteOne();
      res.json({ msg: "User deleted successfully!" });
    } catch (err) {
      res.status(500).json({ msg: err.message });
    }
  },
};

function validateEmail(email) {
  const re =
    /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(email);
}

const createActivationToken = (payload) =>
  jwt.sign(payload, ACTIVATION_TOKEN_SECRET, { expiresIn: "5m" });

const createAccessToken = (payload) =>
  jwt.sign(payload, ACCESS_TOKEN_SECRET, { expiresIn: "1d" });

const createRefreshToken = (payload) =>
  jwt.sign(payload, REFRESH_TOKEN_SECRET, { expiresIn: "7d" });

module.exports = userCtrl;