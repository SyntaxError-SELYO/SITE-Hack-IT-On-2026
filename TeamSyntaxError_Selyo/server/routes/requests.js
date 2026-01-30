const express = require('express')
const multer = require('multer')
const path = require('path')
const { v4: uuidv4 } = require('uuid')
const Request = require('../models/Request')
const Announcement = require('../models/Announcement')
const { protect, studentOnly } = require('../middleware/auth')

const router = express.Router()

// Configure multer for file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname, '../uploads'))
    },
    filename: (req, file, cb) => {
        const uniqueName = `${Date.now()}-${uuidv4()}${path.extname(file.originalname)}`
        cb(null, uniqueName)
    }
})

const upload = multer({
    storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
    fileFilter: (req, file, cb) => {
        const allowedTypes = /jpeg|jpg|png|pdf/
        const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase())
        const mimetype = allowedTypes.test(file.mimetype)

        if (extname && mimetype) {
            return cb(null, true)
        }
        cb(new Error('Only PDF, JPG, JPEG, and PNG files are allowed'))
    }
})

// @route   GET /api/requests/announcements
// @desc    Get active announcements for students
// @access  Private (Student)
router.get('/announcements', protect, studentOnly, async (req, res) => {
    try {
        const now = new Date()
        const announcements = await Announcement.find({
            isActive: true,
            $or: [
                { expiresAt: null },
                { expiresAt: { $gt: now } }
            ]
        }).sort({ createdAt: -1 })

        res.json({ announcements })
    } catch (error) {
        console.error('Get announcements error:', error)
        res.status(500).json({ message: 'Failed to fetch announcements' })
    }
})

// @route   GET /api/requests/types
// @desc    Get all request types with their requirements
// @access  Private (Student)
router.get('/types', protect, studentOnly, (req, res) => {
    res.json({ types: Request.REQUEST_TYPES })
})

// @route   POST /api/requests
// @desc    Create a new request
// @access  Private (Student)
router.post('/', protect, studentOnly, upload.array('documents', 5), async (req, res) => {
    try {
        const { requestType, reason } = req.body

        const documents = req.files ? req.files.map(file => file.filename) : []

        const request = await Request.create({
            student: req.user._id,
            requestType,
            reason,
            documents,
            status: 'Submitted'
        })

        const populatedRequest = await Request.findById(request._id)

        res.status(201).json({
            message: 'Request submitted successfully',
            request: populatedRequest
        })
    } catch (error) {
        console.error('Create request error:', error)
        res.status(500).json({ message: 'Failed to create request', error: error.message })
    }
})

// @route   GET /api/requests
// @desc    Get all requests for current student
// @access  Private (Student)
router.get('/', protect, studentOnly, async (req, res) => {
    try {
        const requests = await Request.find({ student: req.user._id })
            .sort({ createdAt: -1 })

        res.json({ requests })
    } catch (error) {
        console.error('Get requests error:', error)
        res.status(500).json({ message: 'Failed to fetch requests' })
    }
})

// @route   GET /api/requests/:id
// @desc    Get single request by ID
// @access  Private (Student - own request only)
router.get('/:id', protect, studentOnly, async (req, res) => {
    try {
        const request = await Request.findOne({
            _id: req.params.id,
            student: req.user._id
        })

        if (!request) {
            return res.status(404).json({ message: 'Request not found' })
        }

        res.json({ request })
    } catch (error) {
        console.error('Get request error:', error)
        res.status(500).json({ message: 'Failed to fetch request' })
    }
})

module.exports = router
