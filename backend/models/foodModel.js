const mongoose = require('mongoose')

const foodSchema = new mongoose.Schema({
    title: {
        type: String,
        required: [true, "Please enter service title!"],
        trim: true,
        minlength: 5
    },
    description: {
        type: String,
        required: [true, "Please enter service description!"],
        trim: true,
        minlength: 10
    },
    budget: {
        type: Number,
        required: [true, "Please enter your budget!"],
        min: 0
    },
    location: {
        type: String,
        required: [true, "Please enter service location!"],
        trim: true
    },
    category: {
        type: String,
        required: [true, "Please select service category!"],
        enum: [
            "Wafours",
    "Dry-Fruits",
    "South-Indian Cousine",
    "North-Indian Cousine",
    "Breakfast",
    "Snacks",
    "Extra Food",
    "dariy product",
    "extra food",
    "Others",
        ]
    },
    //services type is removed from here
     urgency: {
        type: String,
        required: [true, "Please select urgency level!"],
        enum: ['Low', 'Medium', 'High', 'Urgent'],
        default: 'Medium'
    },
    phone: {
        type: String,
        required: [true, "Please enter phone number!"],
        trim: true
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Users',
        required: true
    },
    status: {
        type: String,
        enum: ['Active', 'In Progress', 'Completed', 'Cancelled'],
        default: 'Active'
    },
    isArchived: {
        type: Number,
        default: 0
    }
}, {
    timestamps: true
})

module.exports = mongoose.model("Food", foodSchema)