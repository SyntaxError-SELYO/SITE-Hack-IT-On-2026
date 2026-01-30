const mongoose = require('mongoose')

const announcementSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        maxLength: 100
    },
    message: {
        type: String,
        required: true,
        maxLength: 500
    },
    type: {
        type: String,
        enum: ['info', 'warning', 'urgent'],
        default: 'info'
    },
    isActive: {
        type: Boolean,
        default: true
    },
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    expiresAt: {
        type: Date
    }
}, {
    timestamps: true
})

// Index for efficient querying of active announcements
announcementSchema.index({ isActive: 1, expiresAt: 1 })

module.exports = mongoose.model('Announcement', announcementSchema)
