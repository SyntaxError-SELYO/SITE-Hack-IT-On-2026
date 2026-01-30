/**
 * Mock API Service for Demo/Hackathon Mode
 * Simulates backend responses with local data
 */

// ============================================
// MOCK DATA
// ============================================

const MOCK_USERS = {
    student: {
        _id: 'student001',
        role: 'student',
        studentId: '2023301001',
        name: 'Juan Dela Cruz',
        email: 'student@ustp.edu.ph',
        program: 'Bachelor of Science in Information Technology',
        yearLevel: 3
    },
    admin: {
        _id: 'admin001',
        role: 'admin',
        studentId: 'ADMIN001',
        name: 'Registrar Admin',
        email: 'admin@ustp.edu.ph',
        program: 'N/A',
        yearLevel: 1
    }
}

const MOCK_STUDENTS = [
    { ...MOCK_USERS.student },
    {
        _id: 'student002',
        role: 'student',
        studentId: '2023301002',
        name: 'Maria Santos',
        email: 'maria.santos@ustp.edu.ph',
        program: 'Bachelor of Science in Computer Science',
        yearLevel: 2
    },
    {
        _id: 'student003',
        role: 'student',
        studentId: '2022301015',
        name: 'Carlos Garcia',
        email: 'carlos.garcia@ustp.edu.ph',
        program: 'Bachelor of Science in Information Technology',
        yearLevel: 4
    },
    {
        _id: 'student004',
        role: 'student',
        studentId: '2024301008',
        name: 'Angela Reyes',
        email: 'angela.reyes@ustp.edu.ph',
        program: 'Bachelor of Science in Computer Science',
        yearLevel: 1
    }
]

let MOCK_REQUESTS = [
    {
        _id: 'req001',
        student: MOCK_STUDENTS[0],
        requestType: 'TOR',
        status: 'Submitted',
        reason: 'Need transcript for scholarship application',
        createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
        qrCode: 'QR-REQ001ABC'
    },
    {
        _id: 'req002',
        student: MOCK_STUDENTS[0],
        requestType: 'Add/Drop',
        status: 'Under Review',
        reason: 'Schedule conflict with major subject',
        createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
        qrCode: 'QR-REQ002DEF'
    },
    {
        _id: 'req007',
        student: MOCK_STUDENTS[0],
        requestType: 'Irregular Enrollment',
        status: 'Appointment Scheduled',
        reason: 'Need to enroll in subjects from different year levels',
        createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
        qrCode: 'QR-REQ007STU',
        appointment: {
            _id: 'apt003',
            date: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
            timeSlot: '2:00 PM - 2:30 PM',
            status: 'Scheduled'
        }
    },
    {
        _id: 'req008',
        student: MOCK_STUDENTS[0],
        requestType: 'Document Submission',
        status: 'Pending Dean Approval',
        reason: 'Submitting original PSA and Form 137',
        createdAt: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
        qrCode: 'QR-REQ008VWX',
        appointment: {
            _id: 'apt004',
            date: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000).toISOString(),
            timeSlot: '10:00 AM - 10:30 AM',
            status: 'Scheduled'
        }
    },
    {
        _id: 'req009',
        student: MOCK_STUDENTS[0],
        requestType: 'Petition for Subject',
        status: 'Approved',
        reason: 'Petition for opening IT Capstone 2 section',
        createdAt: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString(),
        qrCode: 'QR-REQ009YZA'
    },
    {
        _id: 'req003',
        student: MOCK_STUDENTS[1],
        requestType: 'Irregular Enrollment',
        status: 'Appointment Scheduled',
        reason: 'Transfer student enrollment',
        createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
        qrCode: 'QR-REQ003GHI',
        appointment: {
            _id: 'apt001',
            date: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
            timeSlot: '9:00 AM - 9:30 AM',
            status: 'Scheduled'
        }
    },
    {
        _id: 'req004',
        student: MOCK_STUDENTS[2],
        requestType: 'Document Submission',
        status: 'Pending Dean Approval',
        reason: 'Submitting missing clearance documents',
        createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
        qrCode: 'QR-REQ004JKL',
        appointment: {
            _id: 'apt002',
            date: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
            timeSlot: '10:30 AM - 11:00 AM',
            status: 'Scheduled'
        }
    },
    {
        _id: 'req005',
        student: MOCK_STUDENTS[3],
        requestType: 'Shifting',
        status: 'Approved',
        reason: 'Shifting from BSCS to BSIT',
        createdAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
        qrCode: 'QR-REQ005MNO'
    },
    {
        _id: 'req006',
        student: MOCK_STUDENTS[1],
        requestType: 'Petition for Subject',
        status: 'Rejected',
        reason: 'Petition for IT Elective 3',
        adminComment: 'Insufficient number of petitioners. Minimum 15 students required.',
        createdAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
        qrCode: 'QR-REQ006PQR'
    }
]

let MOCK_APPOINTMENTS = [
    {
        _id: 'apt001',
        student: MOCK_STUDENTS[1],
        request: { _id: 'req003', requestType: 'Irregular Enrollment' },
        date: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
        timeSlot: '9:00 AM - 9:30 AM',
        purpose: 'Irregular Enrollment',
        status: 'Scheduled',
        notes: 'Please bring all required documents'
    },
    {
        _id: 'apt002',
        student: MOCK_STUDENTS[2],
        request: { _id: 'req004', requestType: 'Document Submission' },
        date: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
        timeSlot: '10:30 AM - 11:00 AM',
        purpose: 'Document Submission',
        status: 'Scheduled',
        notes: 'Bring original copies'
    }
]

const MOCK_ANNOUNCEMENTS = [
    {
        _id: 'ann001',
        title: 'Enrollment Period Extended',
        message: 'The enrollment period has been extended until February 15, 2026.',
        type: 'info',
        isActive: true,
        createdAt: new Date().toISOString()
    },
    {
        _id: 'ann002',
        title: 'System Maintenance',
        message: 'The system will undergo maintenance on February 5, 2026 from 10 PM to 6 AM.',
        type: 'warning',
        isActive: true,
        createdAt: new Date().toISOString()
    }
]

const TIME_SLOTS = [
    '8:00 AM - 8:30 AM', '8:30 AM - 9:00 AM',
    '9:00 AM - 9:30 AM', '9:30 AM - 10:00 AM',
    '10:00 AM - 10:30 AM', '10:30 AM - 11:00 AM',
    '11:00 AM - 11:30 AM', '11:30 AM - 12:00 PM',
    '1:00 PM - 1:30 PM', '1:30 PM - 2:00 PM',
    '2:00 PM - 2:30 PM', '2:30 PM - 3:00 PM',
    '3:00 PM - 3:30 PM', '3:30 PM - 4:00 PM',
    '4:00 PM - 4:30 PM', '4:30 PM - 5:00 PM'
]

// ============================================
// HELPER FUNCTIONS
// ============================================

const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms))

const generateId = () => Math.random().toString(36).substring(2, 10)

const getCurrentUser = () => {
    const token = localStorage.getItem('token')
    if (!token) return null
    // Token format: mock_role_timestamp
    const role = token.split('_')[1]
    return MOCK_USERS[role] || null
}

// ============================================
// MOCK API IMPLEMENTATION
// ============================================

const mockApi = {
    // Simulate axios response structure
    async get(url) {
        await delay(300) // Simulate network delay

        const user = getCurrentUser()

        // Auth routes
        if (url === '/auth/me') {
            if (!user) throw { response: { status: 401, data: { message: 'Not authenticated' } } }
            return { data: { user } }
        }

        // Request types (public route)
        if (url === '/requests/types') {
            return {
                data: {
                    types: {
                        'TOR': { label: 'Transcript of Records', requiresAppointment: false, requiredDocuments: [] },
                        'Shifting': { label: 'Program Shifting', requiresAppointment: false, requiredDocuments: [] },
                        'Add/Drop': { label: 'Add/Drop Form', requiresAppointment: false, requiredDocuments: [] },
                        'Irregular Enrollment': {
                            label: 'Irregular/Transfer Enrollment',
                            requiresAppointment: true,
                            requiredDocuments: ['Grades/Transcript from Previous School', 'Evaluation Form', 'Certificate of Good Moral', 'PSA Birth Certificate']
                        },
                        'Document Submission': {
                            label: 'Document Submission',
                            requiresAppointment: true,
                            requiredDocuments: ['Original Copy of Required Documents']
                        },
                        'Petition for Subject': {
                            label: 'Petition for Subject',
                            requiresAppointment: true,
                            requiredDocuments: ['Petition Form', 'List of Petitioning Students with Signatures', 'Course Syllabus (if applicable)']
                        }
                    }
                }
            }
        }

        // Student routes
        if (url === '/student/requests' || url === '/requests') {
            const studentRequests = MOCK_REQUESTS.filter(r => r.student._id === user._id)
            return { data: { requests: studentRequests } }
        }

        if (url.startsWith('/student/requests/') || url.match(/^\/requests\/[^/]+$/)) {
            const id = url.split('/').pop()
            const request = MOCK_REQUESTS.find(r => r._id === id)
            if (!request) throw { response: { status: 404, data: { message: 'Request not found' } } }
            return { data: { request } }
        }

        if (url === '/student/announcements' || url === '/requests/announcements') {
            return { data: { announcements: MOCK_ANNOUNCEMENTS.filter(a => a.isActive) } }
        }

        // Admin routes
        if (url === '/admin/requests') {
            return { data: { requests: MOCK_REQUESTS } }
        }

        if (url.startsWith('/admin/requests/')) {
            const id = url.split('/').pop()
            const request = MOCK_REQUESTS.find(r => r._id === id)
            if (!request) throw { response: { status: 404, data: { message: 'Request not found' } } }
            return { data: { request } }
        }

        if (url === '/admin/appointments') {
            return { data: { appointments: MOCK_APPOINTMENTS } }
        }

        if (url.startsWith('/admin/slots')) {
            // Return available slots (randomly remove some to simulate bookings)
            const available = TIME_SLOTS.filter(() => Math.random() > 0.3)
            return { data: { availableSlots: available } }
        }

        if (url === '/admin/announcements') {
            return { data: { announcements: MOCK_ANNOUNCEMENTS } }
        }

        if (url === '/admin/stats') {
            return {
                data: {
                    stats: {
                        totalRequests: MOCK_REQUESTS.length,
                        pending: MOCK_REQUESTS.filter(r => ['Submitted', 'Under Review'].includes(r.status)).length,
                        approved: MOCK_REQUESTS.filter(r => r.status === 'Approved').length,
                        todayAppointments: 2
                    }
                }
            }
        }

        throw { response: { status: 404, data: { message: 'Route not found' } } }
    },

    async post(url, data) {
        await delay(300)

        // Auth routes
        if (url === '/auth/login') {
            const { email, role } = data
            if (role === 'admin' && email.includes('admin')) {
                return {
                    data: {
                        token: `mock_admin_${Date.now()}`,
                        user: MOCK_USERS.admin
                    }
                }
            }
            if (role === 'student') {
                return {
                    data: {
                        token: `mock_student_${Date.now()}`,
                        user: MOCK_USERS.student
                    }
                }
            }
            throw { response: { status: 401, data: { message: 'Invalid credentials' } } }
        }

        if (url === '/auth/register') {
            const newUser = {
                _id: `student_${generateId()}`,
                role: 'student',
                ...data
            }
            return {
                data: {
                    token: `mock_student_${Date.now()}`,
                    user: newUser
                }
            }
        }

        // Student create request (handles both /requests and /student/requests)
        if (url === '/student/requests' || url === '/requests') {
            const user = getCurrentUser()
            // Handle FormData - extract requestType from data
            const requestType = data.requestType || (data.get ? data.get('requestType') : '')
            const reason = data.reason || (data.get ? data.get('reason') : '')

            const newRequest = {
                _id: `req_${generateId()}`,
                student: user,
                requestType: requestType,
                reason: reason,
                status: 'Submitted',
                createdAt: new Date().toISOString(),
                qrCode: `QR-${generateId().toUpperCase()}`
            }
            MOCK_REQUESTS.unshift(newRequest)
            return { data: { request: newRequest, message: 'Request submitted successfully' } }
        }

        // Admin create appointment
        if (url === '/admin/appointments') {
            const request = MOCK_REQUESTS.find(r => r._id === data.requestId)
            if (!request) throw { response: { status: 404, data: { message: 'Request not found' } } }

            const newAppointment = {
                _id: `apt_${generateId()}`,
                student: request.student,
                request: { _id: request._id, requestType: request.requestType },
                date: data.date,
                timeSlot: data.timeSlot,
                purpose: request.requestType,
                status: 'Scheduled',
                notes: data.notes || ''
            }
            MOCK_APPOINTMENTS.push(newAppointment)

            // Update request
            request.appointment = newAppointment
            request.status = 'Appointment Scheduled'

            return { data: { appointment: newAppointment, message: 'Appointment scheduled' } }
        }

        // Admin announcements
        if (url === '/admin/announcements') {
            const newAnnouncement = {
                _id: `ann_${generateId()}`,
                ...data,
                isActive: true,
                createdAt: new Date().toISOString()
            }
            MOCK_ANNOUNCEMENTS.unshift(newAnnouncement)
            return { data: { announcement: newAnnouncement } }
        }

        throw { response: { status: 404, data: { message: 'Route not found' } } }
    },

    async put(url, data) {
        await delay(300)

        // Admin update request
        if (url.startsWith('/admin/requests/')) {
            const id = url.split('/').pop()
            const request = MOCK_REQUESTS.find(r => r._id === id)
            if (!request) throw { response: { status: 404, data: { message: 'Request not found' } } }

            Object.assign(request, data)
            return { data: { request, message: 'Request updated' } }
        }

        // Admin update appointment
        if (url.startsWith('/admin/appointments/')) {
            const id = url.split('/').pop()
            const appointment = MOCK_APPOINTMENTS.find(a => a._id === id)
            if (!appointment) throw { response: { status: 404, data: { message: 'Appointment not found' } } }

            Object.assign(appointment, data)
            return { data: { appointment, message: 'Appointment updated' } }
        }

        throw { response: { status: 404, data: { message: 'Route not found' } } }
    },

    async delete(url) {
        await delay(300)

        // Admin delete request
        if (url.startsWith('/admin/requests/')) {
            const id = url.split('/').pop()
            const index = MOCK_REQUESTS.findIndex(r => r._id === id)
            if (index === -1) throw { response: { status: 404, data: { message: 'Request not found' } } }

            MOCK_REQUESTS.splice(index, 1)
            return { data: { message: 'Request deleted' } }
        }

        // Admin delete announcement
        if (url.startsWith('/admin/announcements/')) {
            const id = url.split('/').pop()
            const index = MOCK_ANNOUNCEMENTS.findIndex(a => a._id === id)
            if (index !== -1) MOCK_ANNOUNCEMENTS.splice(index, 1)
            return { data: { message: 'Announcement deleted' } }
        }

        throw { response: { status: 404, data: { message: 'Route not found' } } }
    }
}

export default mockApi
