const mongoose = require('mongoose')

// Define request types with their requirements
const REQUEST_TYPES = {
    // Digital requests (no appointment needed)
    'TOR': {
        label: 'Transcript of Records',
        requiresAppointment: false,
        requiredDocuments: []
    },
    'Shifting': {
        label: 'Program Shifting',
        requiresAppointment: false,
        requiredDocuments: []
    },
    'Add/Drop': {
        label: 'Add/Drop Form',
        requiresAppointment: false,
        requiredDocuments: []
    },
    // Physical visit requests (appointment needed)
    'Irregular Enrollment': {
        label: 'Irregular / Transfer Enrollment',
        requiresAppointment: true,
        requiredDocuments: [
            'Grades / Transcript from Previous School',
            'Evaluation Form',
            'Certificate of Good Moral',
            'PSA Birth Certificate'
        ]
    },
    'Cross-Enrollment': {
        label: 'Cross-Enrollment',
        requiresAppointment: true,
        requiredDocuments: [
            'Permit to Cross-Enroll from Home School',
            'Registration Form',
            'Valid School ID'
        ]
    },
    'Document Submission': {
        label: 'Document Submission',
        requiresAppointment: true,
        requiredDocuments: [
            'Original Copy of Required Documents'
        ]
    },
    'Petition for Subject': {
        label: 'Petition for Subject',
        requiresAppointment: true,
        requiredDocuments: [
            'Petition Form',
            'List of Petitioning Students with Signatures',
            'Course Syllabus (if applicable)'
        ]
    }
}

const requestSchema = new mongoose.Schema({
    student: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    requestType: {
        type: String,
        enum: Object.keys(REQUEST_TYPES),
        required: true
    },
    documents: [{
        type: String // File paths
    }],
    reason: {
        type: String
    },
    status: {
        type: String,
        enum: [
            'Submitted',
            'Under Review',
            'Pending Dean Approval',
            'Appointment Scheduled',
            'Approved',
            'Ready for Pickup',
            'Rejected',
            'Released',
            'Completed'
        ],
        default: 'Submitted'
    },
    adminComment: {
        type: String
    },
    qrCode: {
        type: String,
        unique: true,
        sparse: true
    },
    // Appointment reference (if this request requires one)
    appointment: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Appointment'
    }
}, {
    timestamps: true
})

// Virtual to get request type info
requestSchema.virtual('typeInfo').get(function () {
    return REQUEST_TYPES[this.requestType] || {}
})

// Populate student info by default
requestSchema.pre(/^find/, function (next) {
    this.populate({
        path: 'student',
        select: 'name studentId email program yearLevel'
    })
    this.populate('appointment')
    next()
})

// Export the REQUEST_TYPES for use in routes
requestSchema.statics.REQUEST_TYPES = REQUEST_TYPES

module.exports = mongoose.model('Request', requestSchema)
