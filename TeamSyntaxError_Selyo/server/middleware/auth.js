const jwt = require('jsonwebtoken')
const User = require('../models/User')

// Protect routes - verify JWT token
const protect = async (req, res, next) => {
    let token

    if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
        try {
            token = req.headers.authorization.split(' ')[1]
            const decoded = jwt.verify(token, process.env.JWT_SECRET || 'fallback-secret')

            req.user = await User.findById(decoded.id).select('-password')

            if (!req.user) {
                return res.status(401).json({ message: 'User not found' })
            }

            next()
        } catch (error) {
            console.error('Auth error:', error.message)
            res.status(401).json({ message: 'Not authorized, token failed' })
        }
    } else {
        res.status(401).json({ message: 'Not authorized, no token' })
    }
}

// Admin only middleware
const adminOnly = (req, res, next) => {
    if (req.user && req.user.role === 'admin') {
        next()
    } else {
        res.status(403).json({ message: 'Access denied. Admin only.' })
    }
}

// Student only middleware
const studentOnly = (req, res, next) => {
    if (req.user && req.user.role === 'student') {
        next()
    } else {
        res.status(403).json({ message: 'Access denied. Students only.' })
    }
}

module.exports = { protect, adminOnly, studentOnly }
