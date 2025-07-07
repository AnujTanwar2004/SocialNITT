const mongoose = require('mongoose')

const serviceSchema = new mongoose.Schema({
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
            'Construction & Renovation',
            'Plumbing & Water',
            'Electrical',
            'Cleaning & Maintenance',
            'Transportation & Logistics',
            'IT & Technical',
            'Professional Services',
            'Others'
        ]
    },
    serviceType: {
        type: String,
        required: [true, "Please select service type!"],
        enum: ['One-time', 'Recurring', 'Project-based']
    },
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
     isApproved: {
      type: Boolean,
      default: false,
    },
    isArchived: {
        type: Number,
        default: 0
    }
}, {
    timestamps: true
})

module.exports = mongoose.model("Services", serviceSchema)