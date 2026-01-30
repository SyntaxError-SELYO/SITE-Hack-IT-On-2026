require('dotenv').config()
const express = require('express')
const cors = require('cors')
const path = require('path')
const connectDB = require('./config/db')

// Import routes
const authRoutes = require('./routes/auth')
const requestRoutes = require('./routes/requests')
const adminRoutes = require('./routes/admin')

const app = express()

// Connect to MongoDB
connectDB()

// Middleware
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// Static files for uploads
app.use('/api/uploads', express.static(path.join(__dirname, 'uploads')))

// Debug Logging
app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.url}`)
    next()
})

// Routes
app.use('/api/auth', authRoutes)
app.use('/api/requests', requestRoutes)
app.use('/api/admin', adminRoutes)

// Health check
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', message: 'SELYO API is running' })
})

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack)
    res.status(500).json({
        message: 'Something went wrong!',
        error: process.env.NODE_ENV === 'development' ? err.message : undefined
    })
})

const PORT = process.env.PORT || 5000

app.listen(PORT, () => {
    console.log(`SELYO Server running on port ${PORT}`)
})
