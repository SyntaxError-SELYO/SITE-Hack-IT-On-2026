import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { QRCodeSVG } from 'qrcode.react'
import Sidebar from '../../components/Sidebar'
import api from '../../services/api'
import './Student.css'

function RequestDetail() {
    const { id } = useParams()
    const [request, setRequest] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')
    const [sidebarOpen, setSidebarOpen] = useState(false)

    useEffect(() => {
        fetchRequest()
    }, [id])

    const fetchRequest = async () => {
        try {
            const response = await api.get(`/requests/${id}`)
            setRequest(response.data.request)
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to load request')
        } finally {
            setLoading(false)
        }
    }

    const getStatusClass = (status) => {
        if (['Approved', 'Ready for Pickup', 'Released'].includes(status)) return 'approved'
        if (status === 'Rejected') return 'rejected'
        return 'pending'
    }

    const statusSteps = [
        { key: 'Submitted', label: 'Submitted' },
        { key: 'Under Review', label: 'Under Review' },
        { key: 'Pending Dean Approval', label: 'Dean Approval' },
        { key: 'Approved', label: 'Approved' },
        { key: 'Ready for Pickup', label: 'Ready for Pickup' }
    ]

    const getCurrentStepIndex = () => {
        if (request?.status === 'Rejected') return -1
        if (request?.status === 'Released') return statusSteps.length
        return statusSteps.findIndex(s => s.key === request?.status)
    }

    if (loading) {
        return (
            <div className="layout">
                <Sidebar isOpen={sidebarOpen} onToggle={() => setSidebarOpen(!sidebarOpen)} />
                <main className="main">
                    <p className="text-center text-muted">Loading...</p>
                </main>
            </div>
        )
    }

    if (error) {
        return (
            <div className="layout">
                <Sidebar isOpen={sidebarOpen} onToggle={() => setSidebarOpen(!sidebarOpen)} />
                <main className="main">
                    <div className="alert error">{error}</div>
                    <Link to="/student/requests" className="btn outline">Back</Link>
                </main>
            </div>
        )
    }

    const currentStep = getCurrentStepIndex()

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
                        <Link to="/student/requests" className="text-muted text-sm" style={{ textDecoration: 'none' }}>← Back to Requests</Link>
                        <h1 style={{ marginTop: '6px' }}>{request.requestType}</h1>
                        <p className="text-muted">ID: {request._id.slice(-8).toUpperCase()}</p>
                    </div>
                    <span className={`badge ${getStatusClass(request.status)}`} style={{ padding: '8px 14px' }}>{request.status}</span>
                </div>

                <div className="panel" style={{ maxWidth: '720px' }}>
                    <div className="panel-body">
                        <div className="detail-section">
                            <h3>Status Timeline</h3>
                            <div className="timeline">
                                {statusSteps.map((step, index) => (
                                    <div
                                        key={step.key}
                                        className={`timeline-step ${index < currentStep ? 'done' : ''} ${index === currentStep ? 'current' : ''} ${request.status === 'Rejected' && index === 0 ? 'failed' : ''}`}
                                    >
                                        <div className="timeline-dot">{index < currentStep ? '✓' : ''}</div>
                                        <div>
                                            <h4>{step.label}</h4>
                                            {index <= currentStep && <p>{new Date(request.updatedAt).toLocaleDateString('en-PH')}</p>}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="detail-section">
                            <h3>Request Details</h3>
                            <div className="detail-grid">
                                <div className="detail-item">
                                    <label>Request Type</label>
                                    <span>{request.requestType}</span>
                                </div>
                                <div className="detail-item">
                                    <label>Date Submitted</label>
                                    <span>{new Date(request.createdAt).toLocaleDateString('en-PH', { month: 'long', day: 'numeric', year: 'numeric' })}</span>
                                </div>
                            </div>
                        </div>

                        {/* Appointment Info */}
                        {request.appointment && (
                            <div className="detail-section">
                                <h3>Your Appointment</h3>
                                <div className="appointment-info" style={{
                                    background: request.appointment.status === 'Scheduled' ? '#dbeafe' : '#d1fae5',
                                    padding: '18px',
                                    borderRadius: '10px'
                                }}>
                                    <div className="detail-grid">
                                        <div className="detail-item">
                                            <label>Date</label>
                                            <span style={{ fontWeight: '600' }}>
                                                {new Date(request.appointment.date).toLocaleDateString('en-PH', {
                                                    weekday: 'long',
                                                    month: 'long',
                                                    day: 'numeric',
                                                    year: 'numeric'
                                                })}
                                            </span>
                                        </div>
                                        <div className="detail-item">
                                            <label>Time</label>
                                            <span style={{ fontWeight: '600' }}>{request.appointment.timeSlot}</span>
                                        </div>
                                    </div>
                                    <div style={{ marginTop: '14px', padding: '12px', background: 'rgba(255,255,255,0.6)', borderRadius: '6px' }}>
                                        <p style={{ margin: 0, fontSize: '13px', color: '#1e40af' }}>
                                            <strong>📍 Location:</strong> Registrar's Office, Main Building
                                        </p>
                                        <p style={{ margin: '6px 0 0', fontSize: '13px', color: '#1e40af' }}>
                                            <strong>📋 Status:</strong> {request.appointment.status}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        )}

                        {request.reason && (
                            <div className="detail-section">
                                <h3>Reason / Remarks</h3>
                                <p className="text-muted">{request.reason}</p>
                            </div>
                        )}

                        {request.adminComment && (
                            <div className="detail-section">
                                <h3>Registrar Comment</h3>
                                <div className={`alert ${request.status === 'Rejected' ? 'error' : 'info'}`}>
                                    {request.adminComment}
                                </div>
                            </div>
                        )}

                        {request.qrCode && ['Approved', 'Ready for Pickup'].includes(request.status) && (
                            <div className="qr-box">
                                <h3>Your document is ready!</h3>
                                <p className="text-muted" style={{ marginBottom: '16px' }}>Present this QR code at the registrar's office for pickup</p>
                                <div className="qr-wrap">
                                    <QRCodeSVG value={request.qrCode} size={180} />
                                </div>
                                <p className="text-muted text-sm" style={{ marginTop: '12px', fontFamily: 'monospace' }}>{request.qrCode}</p>
                            </div>
                        )}
                    </div>
                </div>
            </main>
        </div>
    )
}

export default RequestDetail
