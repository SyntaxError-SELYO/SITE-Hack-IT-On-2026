const express = require('express')
const { v4: uuidv4 } = require('uuid')
const Request = require('../models/Request')
const Appointment = require('../models/Appointment')
const Announcement = require('../models/Announcement')
const { protect, adminOnly } = require('../middleware/auth')

const router = express.Router()

// All admin routes require authentication and admin role
router.use(protect, adminOnly)

// @route   GET /api/admin/request-types
// @desc    Get all request types with their requirements
// @access  Private (Admin)
router.get('/request-types', (req, res) => {
    res.json({ types: Request.REQUEST_TYPES })
})

// @route   GET /api/admin/requests
// @desc    Get all requests (admin)
// @access  Private (Admin)
router.get('/requests', async (req, res) => {
    try {
        const requests = await Request.find()
            .sort({ createdAt: -1 })

        res.json({ requests })
    } catch (error) {
        console.error('Admin get requests error:', error)
        res.status(500).json({ message: 'Failed to fetch requests' })
    }
})

// @route   GET /api/admin/requests/:id
// @desc    Get single request by ID (admin)
// @access  Private (Admin)
router.get('/requests/:id', async (req, res) => {
    try {
        const request = await Request.findById(req.params.id)

        if (!request) {
            return res.status(404).json({ message: 'Request not found' })
        }

        res.json({ request })
    } catch (error) {
        console.error('Admin get request error:', error)
        res.status(500).json({ message: 'Failed to fetch request' })
    }
})

// @route   PUT /api/admin/requests/:id
// @desc    Update request status (admin)
// @access  Private (Admin)
router.put('/requests/:id', async (req, res) => {
    try {
        const { status, adminComment } = req.body

        const request = await Request.findById(req.params.id)

        if (!request) {
            return res.status(404).json({ message: 'Request not found' })
        }

        // Update status
        request.status = status

        // Add admin comment if provided
        if (adminComment) {
            request.adminComment = adminComment
        }

        // Generate QR code on approval
        if (status === 'Approved' || status === 'Ready for Pickup') {
            if (!request.qrCode) {
                request.qrCode = `SELYO-${uuidv4().substring(0, 8).toUpperCase()}-${request._id.toString().slice(-6).toUpperCase()}`
            }
        }

        await request.save()

        // Refresh with populated data
        const updatedRequest = await Request.findById(request._id)

        res.json({
            message: 'Request updated successfully',
            request: updatedRequest
        })
    } catch (error) {
        console.error('Admin update request error:', error)
        res.status(500).json({ message: 'Failed to update request' })
    }
})

// @route   DELETE /api/admin/requests/:id
// @desc    Delete request and associated files/appointment
// @access  Private (Admin)
router.delete('/requests/:id', async (req, res) => {
    try {
        const request = await Request.findById(req.params.id)

        if (!request) {
            return res.status(404).json({ message: 'Request not found' })
        }

        // 1. Delete associated files
        if (request.documents && request.documents.length > 0) {
            const fs = require('fs')
            const path = require('path')

            request.documents.forEach(doc => {
                const filePath = path.join(__dirname, '../uploads', doc)
                if (fs.existsSync(filePath)) {
                    fs.unlinkSync(filePath)
                }
            })
        }

        // 2. Delete associated appointment
        if (request.appointment) {
            await Appointment.findByIdAndDelete(request.appointment)
        }

        // 3. Delete the request
        await Request.findByIdAndDelete(req.params.id)

        res.json({ message: 'Request deleted successfully' })
    } catch (error) {
        console.error('Delete request error:', error)
        res.status(500).json({ message: 'Failed to delete request' })
    }
})

// @route   GET /api/admin/verify/:qrCode
// @desc    Verify QR code
// @access  Private (Admin)
router.get('/verify/:qrCode', async (req, res) => {
    try {
        const request = await Request.findOne({ qrCode: req.params.qrCode })

        if (!request) {
            return res.status(404).json({
                valid: false,
                message: 'Invalid QR code. No matching request found.'
            })
        }

        // Check if request is in approved/ready status
        if (!['Approved', 'Ready for Pickup', 'Released'].includes(request.status)) {
            return res.status(400).json({
                valid: false,
                message: 'This request is not approved for pickup.'
            })
        }

        res.json({
            valid: true,
            request,
            student: request.student
        })
    } catch (error) {
        console.error('QR verify error:', error)
        res.status(500).json({ message: 'Failed to verify QR code' })
    }
})

// @route   PUT /api/admin/release/:id
// @desc    Mark request as released
// @access  Private (Admin)
router.put('/release/:id', async (req, res) => {
    try {
        const request = await Request.findById(req.params.id)

        if (!request) {
            return res.status(404).json({ message: 'Request not found' })
        }

        if (!['Approved', 'Ready for Pickup'].includes(request.status)) {
            return res.status(400).json({
                message: 'Only approved requests can be marked as released'
            })
        }

        request.status = 'Released'
        await request.save()

        res.json({
            message: 'Request marked as released',
            request
        })
    } catch (error) {
        console.error('Release error:', error)
        res.status(500).json({ message: 'Failed to mark as released' })
    }
})

// ==========================================
// APPOINTMENT ROUTES
// ==========================================

// @route   GET /api/admin/appointments
// @desc    Get all appointments
// @access  Private (Admin)
router.get('/appointments', async (req, res) => {
    try {
        const { date, status } = req.query
        const filter = {}

        if (date) {
            const startOfDay = new Date(date)
            startOfDay.setHours(0, 0, 0, 0)
            const endOfDay = new Date(date)
            endOfDay.setHours(23, 59, 59, 999)
            filter.date = { $gte: startOfDay, $lte: endOfDay }
        }

        if (status) {
            filter.status = status
        }

        const appointments = await Appointment.find(filter)
            .sort({ date: 1, timeSlot: 1 })

        res.json({ appointments })
    } catch (error) {
        console.error('Get appointments error:', error)
        res.status(500).json({ message: 'Failed to fetch appointments' })
    }
})

// @route   POST /api/admin/appointments
// @desc    Create appointment for a request
// @access  Private (Admin)
router.post('/appointments', async (req, res) => {
    try {
        const { requestId, date, timeSlot, notes } = req.body

        const request = await Request.findById(requestId)
        if (!request) {
            return res.status(404).json({ message: 'Request not found' })
        }

        // Check if appointment already exists
        if (request.appointment) {
            return res.status(400).json({ message: 'Appointment already scheduled for this request' })
        }

        const appointment = await Appointment.create({
            student: request.student._id || request.student,
            request: request._id,
            date: new Date(date),
            timeSlot,
            purpose: request.requestType,
            notes: notes || ''
        })

        // Link appointment to request
        request.appointment = appointment._id
        request.status = 'Appointment Scheduled'
        await request.save()

        const populatedAppointment = await Appointment.findById(appointment._id)

        res.status(201).json({
            message: 'Appointment scheduled successfully',
            appointment: populatedAppointment
        })
    } catch (error) {
        console.error('Create appointment error:', error)
        res.status(500).json({ message: 'Failed to schedule appointment' })
    }
})

// @route   PUT /api/admin/appointments/:id
// @desc    Update appointment (reschedule, mark complete, etc.)
// @access  Private (Admin)
router.put('/appointments/:id', async (req, res) => {
    try {
        const { date, timeSlot, status, notes } = req.body

        const appointment = await Appointment.findById(req.params.id)
        if (!appointment) {
            return res.status(404).json({ message: 'Appointment not found' })
        }

        if (date) appointment.date = new Date(date)
        if (timeSlot) appointment.timeSlot = timeSlot
        if (status) appointment.status = status
        if (notes !== undefined) appointment.notes = notes

        await appointment.save()

        // Update request status based on appointment status
        if (status === 'Completed') {
            await Request.findByIdAndUpdate(appointment.request._id || appointment.request, {
                status: 'Completed'
            })
        } else if (status === 'No-Show') {
            await Request.findByIdAndUpdate(appointment.request._id || appointment.request, {
                status: 'Under Review',
                adminComment: 'Student did not show up for scheduled appointment'
            })
        }

        const updatedAppointment = await Appointment.findById(appointment._id)

        res.json({
            message: 'Appointment updated successfully',
            appointment: updatedAppointment
        })
    } catch (error) {
        console.error('Update appointment error:', error)
        res.status(500).json({ message: 'Failed to update appointment' })
    }
})

// @route   GET /api/admin/slots
// @desc    Get available time slots for a date
// @access  Private (Admin)
router.get('/slots', async (req, res) => {
    try {
        const { date } = req.query

        if (!date) {
            return res.status(400).json({ message: 'Date is required' })
        }

        // Define all possible slots (8AM - 5PM, 30-min intervals)
        const allSlots = [
            '8:00 AM - 8:30 AM',
            '8:30 AM - 9:00 AM',
            '9:00 AM - 9:30 AM',
            '9:30 AM - 10:00 AM',
            '10:00 AM - 10:30 AM',
            '10:30 AM - 11:00 AM',
            '11:00 AM - 11:30 AM',
            '11:30 AM - 12:00 PM',
            '1:00 PM - 1:30 PM',
            '1:30 PM - 2:00 PM',
            '2:00 PM - 2:30 PM',
            '2:30 PM - 3:00 PM',
            '3:00 PM - 3:30 PM',
            '3:30 PM - 4:00 PM',
            '4:00 PM - 4:30 PM',
            '4:30 PM - 5:00 PM'
        ]

        // Find booked slots for this date
        const startOfDay = new Date(date)
        startOfDay.setHours(0, 0, 0, 0)
        const endOfDay = new Date(date)
        endOfDay.setHours(23, 59, 59, 999)

        const bookedAppointments = await Appointment.find({
            date: { $gte: startOfDay, $lte: endOfDay },
            status: { $ne: 'Cancelled' }
        }).select('timeSlot')

        const bookedSlots = bookedAppointments.map(a => a.timeSlot)

        const availableSlots = allSlots.filter(slot => !bookedSlots.includes(slot))

        res.json({
            date,
            allSlots,
            bookedSlots,
            availableSlots
        })
    } catch (error) {
        console.error('Get slots error:', error)
        res.status(500).json({ message: 'Failed to get time slots' })
    }
})

// ==========================================
// ANNOUNCEMENT ROUTES
// ==========================================

// @route   GET /api/admin/announcements
// @desc    Get all announcements
// @access  Private (Admin)
router.get('/announcements', async (req, res) => {
    try {
        const announcements = await Announcement.find()
            .sort({ createdAt: -1 })
            .populate('createdBy', 'name')

        res.json({ announcements })
    } catch (error) {
        console.error('Get announcements error:', error)
        res.status(500).json({ message: 'Failed to fetch announcements' })
    }
})

// @route   POST /api/admin/announcements
// @desc    Create a new announcement
// @access  Private (Admin)
router.post('/announcements', async (req, res) => {
    try {
        const { title, message, type, expiresAt } = req.body

        const announcement = await Announcement.create({
            title,
            message,
            type: type || 'info',
            createdBy: req.user._id,
            expiresAt: expiresAt ? new Date(expiresAt) : null
        })

        res.status(201).json({
            message: 'Announcement created successfully',
            announcement
        })
    } catch (error) {
        console.error('Create announcement error:', error)
        res.status(500).json({ message: 'Failed to create announcement' })
    }
})

// @route   PUT /api/admin/announcements/:id
// @desc    Update an announcement
// @access  Private (Admin)
router.put('/announcements/:id', async (req, res) => {
    try {
        const { title, message, type, isActive, expiresAt } = req.body

        const announcement = await Announcement.findById(req.params.id)
        if (!announcement) {
            return res.status(404).json({ message: 'Announcement not found' })
        }

        if (title) announcement.title = title
        if (message) announcement.message = message
        if (type) announcement.type = type
        if (isActive !== undefined) announcement.isActive = isActive
        if (expiresAt !== undefined) announcement.expiresAt = expiresAt ? new Date(expiresAt) : null

        await announcement.save()

        res.json({
            message: 'Announcement updated successfully',
            announcement
        })
    } catch (error) {
        console.error('Update announcement error:', error)
        res.status(500).json({ message: 'Failed to update announcement' })
    }
})

// @route   DELETE /api/admin/announcements/:id
// @desc    Delete an announcement
// @access  Private (Admin)
router.delete('/announcements/:id', async (req, res) => {
    try {
        const announcement = await Announcement.findByIdAndDelete(req.params.id)
        if (!announcement) {
            return res.status(404).json({ message: 'Announcement not found' })
        }

        res.json({ message: 'Announcement deleted successfully' })
    } catch (error) {
        console.error('Delete announcement error:', error)
        res.status(500).json({ message: 'Failed to delete announcement' })
    }
})

module.exports = router

