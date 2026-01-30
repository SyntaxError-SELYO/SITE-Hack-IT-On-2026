const mongoose = require('mongoose')

const appointmentSchema = new mongoose.Schema({
    student: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    request: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Request',
        required: true
    },
    date: {
        type: Date,
        required: true
    },
    timeSlot: {
        type: String,
        required: true // e.g., "9:00 AM - 9:30 AM"
    },
    purpose: {
        type: String,
        required: true
    },
    status: {
        type: String,
        enum: ['Scheduled', 'Completed', 'No-Show', 'Cancelled'],
        default: 'Scheduled'
    },
    notes: {
        type: String
    }
}, {
    timestamps: true
})

// Populate student by default (but NOT request to avoid circular dependency)
appointmentSchema.pre(/^find/, function (next) {
    this.populate('student', 'name studentId email program')
    // Don't populate 'request' here - it causes circular loop with Request's pre-find
    next()
})

module.exports = mongoose.model('Appointment', appointmentSchema)
