const Users = require('../models/userModel')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const sendMail = require('./sendMail')

const { CLIENT_URL, ACTIVATION_TOKEN_SECRET, ACCESS_TOKEN_SECRET, REFRESH_TOKEN_SECRET } = process.env

const userCtrl = {
  // 📌 Register
  register: async (req, res) => {
    try {
      const { name, email, password } = req.body
      if (!name || !email || !password)
        return res.status(400).json({ msg: "Please fill in all fields." })

      if (!validateEmail(email))
        return res.status(400).json({ msg: "Invalid email format." })

      const userExists = await Users.findOne({ email })
      if (userExists)
        return res.status(400).json({ msg: "Email already registered." })

      if (password.length < 8)
        return res.status(400).json({ msg: "Password must be at least 8 characters." })

      const passwordHash = await bcrypt.hash(password, 12)

      const newUser = { name, email, password: passwordHash }
      const activationToken = createActivationToken(newUser)
      
      // Fixed: Direct frontend URL to avoid redirect issues
      const url = `http://localhost:3000/user/activate/${activationToken}`

      await sendMail(email, url, "Verify your email address")

      res.json({ msg: "Register Success! Please activate your email." })

    } catch (err) {
      console.error(err)
      res.status(500).json({ msg: "Server Error. Please try again." })
    }
  },

  // 📌 Activate Email
  activateEmail: async (req, res) => {
    try {
      const { activation_token } = req.body
      const user = jwt.verify(activation_token, ACTIVATION_TOKEN_SECRET)
      const { name, email, password } = user

      const exists = await Users.findOne({ email })
      if (exists)
        return res.status(400).json({ msg: "Email already registered." })

      const newUser = new Users({ name, email, password })
      await newUser.save()

      res.json({ msg: "Account activated successfully!" })

    } catch (err) {
      console.error(err)
      res.status(500).json({ msg: "Invalid or expired activation link." })
    }
  },

  // 📌 Login
  login: async (req, res) => {
    try {
      const { email, password } = req.body
      const user = await Users.findOne({ email })

      if (!user)
        return res.status(400).json({ msg: "Email not registered." })

      const isMatch = await bcrypt.compare(password, user.password)
      if (!isMatch)
        return res.status(400).json({ msg: "Incorrect password." })

      const refreshToken = createRefreshToken({ id: user._id })

      res.cookie('refreshtoken', refreshToken, {
        httpOnly: true,
        path: '/user/refresh_token',
        maxAge: 7 * 24 * 60 * 60 * 1000 // 7 days
      })

      const accessToken = createAccessToken({ id: user._id })

      res.json({
        msg: "Login successful.",
        access_token: accessToken
      })

    } catch (err) {
      console.error(err)
      res.status(500).json({ msg: "Server Error. Please try again." })
    }
  },

  // 📌 Get Access Token
  getAccessToken: (req, res) => {
    try {
      const rf_token = req.cookies.refreshtoken
      if (!rf_token)
        return res.status(401).json({ msg: "Please login first." })

      jwt.verify(rf_token, REFRESH_TOKEN_SECRET, (err, user) => {
        if (err)
          return res.status(403).json({ msg: "Invalid or expired token." })

        const accessToken = createAccessToken({ id: user.id })
        res.json({ access_token: accessToken })
      })

    } catch (err) {
      console.error(err)
      res.status(500).json({ msg: "Token Error." })
    }
  },

  // 📌 Forgot Password
  forgotPassword: async (req, res) => {
    try {
      const { email } = req.body
      const user = await Users.findOne({ email })

      if (!user)
        return res.status(400).json({ msg: "Email not registered." })

      const accessToken = createAccessToken({ id: user._id })
      
      // Fixed: Direct frontend URL for password reset
      const url = `http://localhost:3000/user/reset/${accessToken}`

      await sendMail(email, url, "Reset your password")
      res.json({ msg: "Password reset email sent." })

    } catch (err) {
      console.error(err)
      res.status(500).json({ msg: "Server Error. Please try again." })
    }
  },

  // 📌 Reset Password
  resetPassword: async (req, res) => {
    try {
      const { password } = req.body

      if (password.length < 8)
        return res.status(400).json({ msg: "Password must be at least 8 characters." })

      const passwordHash = await bcrypt.hash(password, 12)

      await Users.findOneAndUpdate({ _id: req.user.id }, {
        password: passwordHash
      })

      res.json({ msg: "Password updated successfully!" })

    } catch (err) {
      console.error(err)
      res.status(500).json({ msg: "Password reset failed." })
    }
  },

  // 📌 Get User Info
  getUserInfo: async (req, res) => {
    try {
      const user = await Users.findById(req.user.id).select('-password')
      res.json(user)

    } catch (err) {
      console.error(err)
      res.status(500).json({ msg: "Failed to fetch user data." })
    }
  },

  // 📌 Logout
  logout: (req, res) => {
    try {
      res.clearCookie('refreshtoken', { path: '/user/refresh_token' })
      res.json({ msg: "Logged out successfully." })

    } catch (err) {
      console.error(err)
      res.status(500).json({ msg: "Logout error." })
    }
  },

  // 📌 Update User
  updateUser: async (req, res) => {
    try {
      const { name, avatar } = req.body
      await Users.findOneAndUpdate({ _id: req.user.id }, { name, avatar })
      res.json({ msg: "Profile updated." })

    } catch (err) {
      console.error(err)
      res.status(500).json({ msg: "Profile update failed." })
    }
  }
}

// 📌 Email Validator
function validateEmail(email) {
  const re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
  return re.test(email)
}

// 📌 JWT Token Generators
const createActivationToken = (payload) =>
  jwt.sign(payload, ACTIVATION_TOKEN_SECRET, { expiresIn: '5m' })

const createAccessToken = (payload) =>
  jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, { expiresIn: '1d' })

const createRefreshToken = (payload) =>
  jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET, { expiresIn: '7d' })

module.exports = userCtrl