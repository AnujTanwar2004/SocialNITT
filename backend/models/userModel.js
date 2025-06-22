const mongoose = require('mongoose')


const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, "Please enter your name!"],
        trim: true
    },
    email: {
        type: String,
        required: [true, "Please enter your email!"],
        trim: true,
        unique: true
    },
    password: {
        type: String,
        required: [true, "Please enter your password!"]
    },
    role: {
        type: Number,
        default: 0 // 0 = user, 1 = admin
    },
    avatar: {
        type: String,
        default: "https://res.cloudinary.com/saifmsf/image/upload/v1662039097/avatar/avatar_pamsno.png"
    },
    points: {
    type: Number,
    default: 0
},
pointsHistory: [
  {
    points: { type: Number, required: true },
    reason: { type: String, required: true }, // e.g. 'upload_product', 'contacted', etc.
    date: { type: Date, default: Date.now }
  }
],
}, {
    timestamps: true
})

module.exports = mongoose.model("Users", userSchema)
