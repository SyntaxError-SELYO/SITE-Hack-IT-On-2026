const express = require('express')
const jwt = require('jsonwebtoken')
const User = require('../models/User')
const { protect } = require('../middleware/auth')

const router = express.Router()

// Generate JWT token
const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET || 'fallback-secret', {
        expiresIn: '30d'
    })
}

// @route   POST /api/auth/register
// @desc    Register a new student
// @access  Public
router.post('/register', async (req, res) => {
    try {
        const { studentId, name, email, password, program, yearLevel } = req.body

        // Check if user exists
        const userExists = await User.findOne({
            $or: [{ email }, { studentId }]
        })

        if (userExists) {
            return res.status(400).json({
                message: 'User with this email or student ID already exists'
            })
        }

        // Create user
        const user = await User.create({
            studentId,
            name,
            email,
            password,
            program,
            yearLevel,
            role: 'student'
        })

        const token = generateToken(user._id)

        res.status(201).json({
            token,
            user: user.toJSON()
        })
    } catch (error) {
        console.error('Register error:', error)
        res.status(500).json({ message: 'Registration failed', error: error.message })
    }
})

// @route   POST /api/auth/login
// @desc    Authenticate user & get token
// @access  Public
router.post('/login', async (req, res) => {
    try {
        const { email, password, role } = req.body

        // Find user by email or student ID
        const user = await User.findOne({
            $or: [
                { email: email.toLowerCase() },
                { studentId: email }
            ]
        })

        if (!user) {
            return res.status(401).json({ message: 'Invalid credentials' })
        }

        // Check password
        const isMatch = await user.matchPassword(password)
        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid credentials' })
        }

        // Check role matches
        if (role && user.role !== role) {
            return res.status(401).json({
                message: `This account is not registered as ${role}`
            })
        }

        const token = generateToken(user._id)

        res.json({
            token,
            user: user.toJSON()
        })
    } catch (error) {
        console.error('Login error:', error)
        res.status(500).json({ message: 'Login failed', error: error.message })
    }
})

// @route   GET /api/auth/me
// @desc    Get current user
// @access  Private
router.get('/me', protect, async (req, res) => {
    try {
        const user = await User.findById(req.user._id)
        res.json({ user: user.toJSON() })
    } catch (error) {
        res.status(500).json({ message: 'Failed to get user info' })
    }
})

module.exports = router
