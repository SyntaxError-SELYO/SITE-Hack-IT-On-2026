import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import Sidebar from '../../components/Sidebar'
import api from '../../services/api'
import './Admin.css'

// Request types that require appointments
const APPOINTMENT_TYPES = ['Irregular Enrollment', 'Cross-Enrollment', 'Document Submission', 'Petition for Subject']

function RequestReview() {
    const { id } = useParams()
    const [request, setRequest] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')
    const [success, setSuccess] = useState('')
    const [actionLoading, setActionLoading] = useState(false)
    const [selectedStatus, setSelectedStatus] = useState('')
    const [comment, setComment] = useState('')
    const [sidebarOpen, setSidebarOpen] = useState(false)

    // Appointment scheduling
    const [showScheduler, setShowScheduler] = useState(false)
    const [appointmentDate, setAppointmentDate] = useState('')
    const [availableSlots, setAvailableSlots] = useState([])
    const [selectedSlot, setSelectedSlot] = useState('')
    const [appointmentNote, setAppointmentNote] = useState('')
    const [slotsLoading, setSlotsLoading] = useState(false)

    const statusOptions = [
        { value: 'Under Review', label: 'Mark as Under Review' },
        { value: 'Pending Dean Approval', label: 'Forward to Dean' },
        { value: 'Approved', label: 'Approve Request' },
        { value: 'Ready for Pickup', label: 'Ready for Pickup' },
        { value: 'Rejected', label: 'Reject Request' }
    ]

    useEffect(() => {
        fetchRequest()
    }, [id])

    useEffect(() => {
        if (appointmentDate) {
            fetchAvailableSlots()
        }
    }, [appointmentDate])

    const fetchRequest = async () => {
        try {
            const response = await api.get(`/admin/requests/${id}`)
            setRequest(response.data.request)
            setSelectedStatus(response.data.request.status)
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to load request')
        } finally {
            setLoading(false)
        }
    }

    const fetchAvailableSlots = async () => {
        setSlotsLoading(true)
        try {
            const response = await api.get(`/admin/slots?date=${appointmentDate}`)
            setAvailableSlots(response.data.availableSlots || [])
        } catch (err) {
            console.error('Failed to fetch slots:', err)
        } finally {
            setSlotsLoading(false)
        }
    }

    const handleUpdateStatus = async () => {
        if (!selectedStatus) return
        if (selectedStatus === 'Rejected' && !comment.trim()) {
            setError('Please provide a rejection reason')
            return
        }

        setActionLoading(true)
        setError('')

        try {
            await api.put(`/admin/requests/${id}`, { status: selectedStatus, adminComment: comment })
            await fetchRequest()
            setComment('')
            setSuccess('Status updated successfully')
            setTimeout(() => setSuccess(''), 3000)
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to update')
        } finally {
            setActionLoading(false)
        }
    }

    const handleScheduleAppointment = async () => {
        if (!appointmentDate || !selectedSlot) {
            setError('Please select a date and time slot')
            return
        }

        setActionLoading(true)
        setError('')

        try {
            await api.post('/admin/appointments', {
                requestId: id,
                date: appointmentDate,
                timeSlot: selectedSlot,
                notes: appointmentNote
            })
            await fetchRequest()
            setShowScheduler(false)
            setAppointmentDate('')
            setSelectedSlot('')
            setAppointmentNote('')
            setSuccess('Appointment scheduled successfully')
            setTimeout(() => setSuccess(''), 3000)
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to schedule appointment')
        } finally {
            setActionLoading(false)
        }
    }

    const getStatusClass = (status) => {
        if (['Approved', 'Ready for Pickup', 'Released', 'Completed'].includes(status)) return 'approved'
        if (status === 'Rejected') return 'rejected'
        if (status === 'Appointment Scheduled') return 'info'
        return 'pending'
    }

    const requiresAppointment = request && APPOINTMENT_TYPES.includes(request.requestType)

    if (loading) {
        return (
            <div className="layout">
                <Sidebar isOpen={sidebarOpen} onToggle={() => setSidebarOpen(!sidebarOpen)} />
                <main className="main"><p className="text-center text-muted">Loading...</p></main>
            </div>
        )
    }

    return (
        <div className="layout">
            <Sidebar isOpen={sidebarOpen} onToggle={() => setSidebarOpen(!sidebarOpen)} />

            <button className="menu-toggle" onClick={() => setSidebarOpen(!sidebarOpen)}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <line x1="3" y1="12" x2="21" y2="12" />
                    <line x1="3" y1="6" x2="21" y2="6" />
                    <line x1="3" y1="18" x2="21" y2="18" />
                </svg>
            </button>

            <main className="main">
                <div className="page-top">
                    <div>
                        <Link to="/admin/dashboard" className="text-muted text-sm" style={{ textDecoration: 'none' }}>← Back to Dashboard</Link>
                        <h1 style={{ marginTop: '6px' }}>Review Request</h1>
                    </div>
                    <span className={`badge ${getStatusClass(request.status)}`} style={{ padding: '8px 14px' }}>{request.status}</span>
                </div>

                {error && <div className="alert error">{error}</div>}
                {success && <div className="alert success">{success}</div>}

                <div className="review-layout">
                    <div className="panel">
                        <div className="panel-head">
                            <h2>{request.requestType}</h2>
                            <span className="text-muted text-sm">ID: {request._id.slice(-8).toUpperCase()}</span>
                        </div>
                        <div className="panel-body">
                            <div className="detail-section">
                                <h3>Student Information</h3>
                                <div className="detail-grid">
                                    <div className="detail-item"><label>Full Name</label><span>{request.student?.name || 'N/A'}</span></div>
                                    <div className="detail-item"><label>Student ID</label><span>{request.student?.studentId || 'N/A'}</span></div>
                                    <div className="detail-item"><label>Program</label><span>{request.student?.program || 'N/A'}</span></div>
                                    <div className="detail-item"><label>Year Level</label><span>{request.student?.yearLevel ? `${request.student.yearLevel}${['st', 'nd', 'rd'][request.student.yearLevel - 1] || 'th'} Year` : 'N/A'}</span></div>
                                    <div className="detail-item"><label>Email</label><span>{request.student?.email || 'N/A'}</span></div>
                                </div>
                            </div>

                            <div className="detail-section">
                                <h3>Request Details</h3>
                                <div className="detail-grid">
                                    <div className="detail-item"><label>Type</label><span>{request.requestType}</span></div>
                                    <div className="detail-item"><label>Submitted</label><span>{new Date(request.createdAt).toLocaleDateString('en-PH', { month: 'long', day: 'numeric', year: 'numeric' })}</span></div>
                                </div>
                            </div>

                            {request.reason && (
                                <div className="detail-section">
                                    <h3>Reason</h3>
                                    <p className="text-muted">{request.reason}</p>
                                </div>
                            )}

                            {/* Appointment Info */}
                            {request.appointment && (
                                <div className="detail-section">
                                    <h3>Appointment</h3>
                                    <div className="appointment-info">
                                        <div className="detail-grid">
                                            <div className="detail-item">
                                                <label>Date</label>
                                                <span>{new Date(request.appointment.date).toLocaleDateString('en-PH', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}</span>
                                            </div>
                                            <div className="detail-item">
                                                <label>Time</label>
                                                <span>{request.appointment.timeSlot}</span>
                                            </div>
                                            <div className="detail-item">
                                                <label>Status</label>
                                                <span className={`badge ${getStatusClass(request.appointment.status)}`}>{request.appointment.status}</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {request.documents?.length > 0 && (
                                <div className="detail-section">
                                    <h3>Documents</h3>
                                    <div className="doc-list">
                                        {request.documents.map((doc, i) => (
                                            <div key={i} className="doc-item">
                                                <span>Document {i + 1}</span>
                                                <a href={`/api/uploads/${doc}`} target="_blank" rel="noopener noreferrer">View</a>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>

                    <div>
                        {/* Schedule Appointment (for applicable types) */}
                        {requiresAppointment && !request.appointment && (
                            <div className="panel" style={{ marginBottom: '20px' }}>
                                <div className="panel-head">
                                    <h2>Schedule Appointment</h2>
                                </div>
                                <div className="panel-body">
                                    {!showScheduler ? (
                                        <div style={{ textAlign: 'center' }}>
                                            <p className="text-muted" style={{ marginBottom: '16px' }}>
                                                This request requires a physical visit.
                                            </p>
                                            <button className="btn primary" onClick={() => setShowScheduler(true)}>
                                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                                                    <line x1="16" y1="2" x2="16" y2="6" />
                                                    <line x1="8" y1="2" x2="8" y2="6" />
                                                    <line x1="3" y1="10" x2="21" y2="10" />
                                                </svg>
                                                Schedule Appointment
                                            </button>
                                        </div>
                                    ) : (
                                        <div>
                                            <div className="form-group">
                                                <label className="form-label">Select Date</label>
                                                <input
                                                    type="date"
                                                    className="form-input"
                                                    value={appointmentDate}
                                                    onChange={(e) => setAppointmentDate(e.target.value)}
                                                    min={new Date().toISOString().split('T')[0]}
                                                />
                                            </div>

                                            {appointmentDate && (
                                                <div className="form-group">
                                                    <label className="form-label">Select Time Slot</label>
                                                    {slotsLoading ? (
                                                        <p className="text-muted">Loading slots...</p>
                                                    ) : availableSlots.length === 0 ? (
                                                        <p className="text-muted">No slots available for this date</p>
                                                    ) : (
                                                        <div className="slot-grid">
                                                            {availableSlots.map(slot => (
                                                                <button
                                                                    key={slot}
                                                                    type="button"
                                                                    className={`slot-btn ${selectedSlot === slot ? 'selected' : ''}`}
                                                                    onClick={() => setSelectedSlot(slot)}
                                                                >
                                                                    {slot}
                                                                </button>
                                                            ))}
                                                        </div>
                                                    )}
                                                </div>
                                            )}

                                            <div className="form-group">
                                                <label className="form-label">Notes (Optional)</label>
                                                <textarea
                                                    className="form-textarea"
                                                    placeholder="Add any notes..."
                                                    value={appointmentNote}
                                                    onChange={(e) => setAppointmentNote(e.target.value)}
                                                    rows={2}
                                                />
                                            </div>

                                            <div style={{ display: 'flex', gap: '10px' }}>
                                                <button className="btn outline" onClick={() => setShowScheduler(false)}>Cancel</button>
                                                <button
                                                    className="btn success"
                                                    onClick={handleScheduleAppointment}
                                                    disabled={actionLoading || !appointmentDate || !selectedSlot}
                                                >
                                                    {actionLoading ? 'Scheduling...' : 'Confirm Appointment'}
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>
                        )}

                        {/* Update Status */}
                        <div className="panel">
                            <div className="panel-head"><h2>Update Status</h2></div>
                            <div className="panel-body">
                                <div className="status-radios">
                                    {statusOptions.map(opt => (
                                        <label key={opt.value} className={`status-radio ${selectedStatus === opt.value ? 'selected' : ''}`}>
                                            <input
                                                type="radio"
                                                name="status"
                                                value={opt.value}
                                                checked={selectedStatus === opt.value}
                                                onChange={(e) => setSelectedStatus(e.target.value)}
                                            />
                                            {opt.label}
                                        </label>
                                    ))}
                                </div>

                                <div style={{ marginTop: '18px' }}>
                                    <label className="form-label">{selectedStatus === 'Rejected' ? 'Rejection Reason *' : 'Comment (Optional)'}</label>
                                    <textarea
                                        className="form-textarea"
                                        placeholder={selectedStatus === 'Rejected' ? 'Provide rejection reason...' : 'Add comment...'}
                                        value={comment}
                                        onChange={(e) => setComment(e.target.value)}
                                        rows={3}
                                    />
                                </div>

                                <button
                                    className={`btn ${selectedStatus === 'Rejected' ? 'danger' : selectedStatus === 'Approved' || selectedStatus === 'Ready for Pickup' ? 'success' : 'primary'}`}
                                    onClick={handleUpdateStatus}
                                    disabled={actionLoading || selectedStatus === request.status}
                                    style={{ width: '100%', marginTop: '16px' }}
                                >
                                    {actionLoading ? 'Updating...' : 'Update Status'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    )
}

export default RequestReview
