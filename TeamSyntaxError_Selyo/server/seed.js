/**
 * Database Seed Script
 * Populates the database with sample students, requests, and appointments
 * 
 * Usage: node seed.js
 */

require('dotenv').config()
const mongoose = require('mongoose')
const User = require('./models/User')
const Request = require('./models/Request')
const Appointment = require('./models/Appointment')

// Connect to MongoDB
const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI)
        console.log('✅ MongoDB Connected')
    } catch (err) {
        console.error('❌ MongoDB Connection Error:', err.message)
        process.exit(1)
    }
}

// Sample student data
const sampleStudents = [
    {
        role: 'student',
        studentId: '2023301001',
        name: 'Juan Dela Cruz',
        email: 'juan.delacruz@ustp.edu.ph',
        password: 'password123',
        program: 'Bachelor of Science in Information Technology',
        yearLevel: 2
    },
    {
        role: 'student',
        studentId: '2023301002',
        name: 'Maria Santos',
        email: 'maria.santos@ustp.edu.ph',
        password: 'password123',
        program: 'Bachelor of Science in Computer Science',
        yearLevel: 3
    },
    {
        role: 'student',
        studentId: '2022301015',
        name: 'Carlos Garcia',
        email: 'carlos.garcia@ustp.edu.ph',
        password: 'password123',
        program: 'Bachelor of Science in Information Technology',
        yearLevel: 4
    },
    {
        role: 'student',
        studentId: '2024301008',
        name: 'Angela Reyes',
        email: 'angela.reyes@ustp.edu.ph',
        password: 'password123',
        program: 'Bachelor of Science in Computer Science',
        yearLevel: 1
    },
    {
        role: 'student',
        studentId: '2023301045',
        name: 'Mark Villanueva',
        email: 'mark.villanueva@ustp.edu.ph',
        password: 'password123',
        program: 'Bachelor of Science in Information Systems',
        yearLevel: 2
    },
    {
        role: 'student',
        studentId: '2022301022',
        name: 'Sofia Mendoza',
        email: 'sofia.mendoza@ustp.edu.ph',
        password: 'password123',
        program: 'Bachelor of Science in Information Technology',
        yearLevel: 3
    }
]

// Admin user
const adminUser = {
    role: 'admin',
    studentId: 'ADMIN001',
    name: 'Registrar Admin',
    email: 'admin@ustp.edu.ph',
    password: 'admin123',
    program: 'N/A',
    yearLevel: 1
}

// Request types available
const requestTypes = ['TOR', 'Shifting', 'Add/Drop', 'Irregular Enrollment', 'Document Submission', 'Petition for Subject']

// Status options
const statuses = ['Submitted', 'Under Review', 'Pending Dean Approval', 'Approved', 'Ready for Pickup', 'Rejected']

// Time slots
const timeSlots = [
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

// Helper to get random element
const getRandom = (arr) => arr[Math.floor(Math.random() * arr.length)]

// Helper to get future date
const getFutureDate = (daysAhead) => {
    const date = new Date()
    date.setDate(date.getDate() + daysAhead)
    return date
}

// Generate QR code
const generateQR = () => {
    return 'QR-' + Math.random().toString(36).substring(2, 10).toUpperCase()
}

// Main seeder function
const seedDatabase = async () => {
    try {
        await connectDB()

        // Clear existing data
        console.log('🗑️  Clearing existing data...')
        await User.deleteMany({})
        await Request.deleteMany({})
        await Appointment.deleteMany({})

        // Create admin
        console.log('👤 Creating admin user...')
        const admin = await User.create(adminUser)
        console.log(`   ✓ Admin: ${admin.email}`)

        // Create students
        console.log('👥 Creating sample students...')
        const students = []
        for (const studentData of sampleStudents) {
            const student = await User.create(studentData)
            students.push(student)
            console.log(`   ✓ Student: ${student.name} (${student.studentId})`)
        }

        // Create requests for each student
        console.log('📋 Creating sample requests...')
        const createdRequests = []

        for (const student of students) {
            // Each student gets 1-3 requests
            const numRequests = Math.floor(Math.random() * 3) + 1

            for (let i = 0; i < numRequests; i++) {
                const requestType = getRandom(requestTypes)
                const status = getRandom(statuses)

                const requestData = {
                    student: student._id,
                    requestType,
                    status,
                    reason: `Sample request for ${requestType}`,
                    qrCode: generateQR(),
                    adminComment: status === 'Rejected' ? 'Missing required documents' : null
                }

                const request = await Request.create(requestData)
                createdRequests.push({ request, student, requestType })
                console.log(`   ✓ Request: ${requestType} for ${student.name} [${status}]`)
            }
        }

        // Create appointments for requests that require them
        console.log('📅 Creating sample appointments...')
        const appointmentTypes = ['Irregular Enrollment', 'Document Submission', 'Petition for Subject']

        for (const { request, student, requestType } of createdRequests) {
            if (appointmentTypes.includes(requestType) && request.status !== 'Rejected') {
                const daysAhead = Math.floor(Math.random() * 14) + 1 // 1-14 days ahead
                const appointmentDate = getFutureDate(daysAhead)

                const appointmentData = {
                    student: student._id,
                    request: request._id,
                    date: appointmentDate,
                    timeSlot: getRandom(timeSlots),
                    purpose: requestType,
                    status: 'Scheduled',
                    notes: 'Please bring all required documents'
                }

                const appointment = await Appointment.create(appointmentData)

                // Update request with appointment reference
                await Request.findByIdAndUpdate(request._id, {
                    appointment: appointment._id,
                    status: 'Appointment Scheduled'
                })

                console.log(`   ✓ Appointment: ${requestType} on ${appointmentDate.toLocaleDateString()}`)
            }
        }

        console.log('\n🎉 Database seeded successfully!')
        console.log(`   - ${students.length} students created`)
        console.log(`   - ${createdRequests.length} requests created`)
        console.log(`   - 1 admin account created`)
        console.log('\n📝 Login Credentials:')
        console.log('   Admin: admin@ustp.edu.ph / admin123')
        console.log('   Student: juan.delacruz@ustp.edu.ph / password123')

        process.exit(0)
    } catch (err) {
        console.error('❌ Seeding Error:', err)
        process.exit(1)
    }
}

// Run the seeder
seedDatabase()
