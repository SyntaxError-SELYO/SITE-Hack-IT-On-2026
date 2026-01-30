import { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import Sidebar from '../../components/Sidebar'
import api from '../../services/api'
import './Student.css'

function RequestStatus() {
    const location = useLocation()
    const [requests, setRequests] = useState([])
    const [loading, setLoading] = useState(true)
    const [sidebarOpen, setSidebarOpen] = useState(false)
    const [showSuccess, setShowSuccess] = useState(location.state?.success || false)

    useEffect(() => {
        fetchRequests()
        if (showSuccess) {
            setTimeout(() => setShowSuccess(false), 5000)
        }
    }, [])

    const fetchRequests = async () => {
        try {
            const response = await api.get('/requests')
            setRequests(response.data.requests || [])
        } catch (err) {
            console.error('Failed to fetch requests:', err)
        } finally {
            setLoading(false)
        }
    }

    const getStatusBadge = (status) => {
        const statusMap = {
            'Submitted': { label: 'Submitted', class: 'pending' },
            'Under Review': { label: 'Under Review', class: 'pending' },
            'Pending Dean Approval': { label: 'Pending Dean Approval', class: 'pending-dean' },
            'Appointment Scheduled': { label: 'Scheduled', class: 'info' },
            'Approved': { label: 'Approved', class: 'approved' },
            'Ready for Pickup': { label: 'Ready for Pickup', class: 'ready' },
            'Rejected': { label: 'Rejected', class: 'rejected' },
            'Released': { label: 'Released', class: 'approved' },
            'Completed': { label: 'Completed', class: 'completed' }
        }
        return statusMap[status] || { label: status, class: 'pending' }
    }

    const isPositiveStatus = (status) => {
        return ['Approved', 'Ready for Pickup', 'Released', 'Completed'].includes(status)
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
                        <h1>My Requests</h1>
                        <p className="text-muted">Track your submissions</p>
                    </div>
                    <Link to="/student/request/new" className="btn primary">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                            <line x1="12" y1="5" x2="12" y2="19" />
                            <line x1="5" y1="12" x2="19" y2="12" />
                        </svg>
                        New Request
                    </Link>
                </div>

                {showSuccess && (
                    <div className="alert success">Your request has been submitted successfully!</div>
                )}

                <div className="panel">
                    <div className="panel-body">
                        {loading ? (
                            <p className="text-center text-muted">Loading...</p>
                        ) : requests.length === 0 ? (
                            <div className="empty-box">
                                <p>No requests yet</p>
                                <Link to="/student/request/new" className="btn outline">Create your first request</Link>
                            </div>
                        ) : (
                            <ul className="request-list-new">
                                {requests.map(request => {
                                    const badge = getStatusBadge(request.status)
                                    return (
                                        <li key={request._id}>
                                            <Link to={`/student/request/${request._id}`} className="request-row-new">
                                                <div className={`request-icon ${isPositiveStatus(request.status) ? 'success' : 'pending'}`}>
                                                    {isPositiveStatus(request.status) ? (
                                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                                                            <polyline points="20 6 9 17 4 12" />
                                                        </svg>
                                                    ) : (
                                                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                            <circle cx="12" cy="12" r="10" />
                                                            <polyline points="12 6 12 12 16 14" />
                                                        </svg>
                                                    )}
                                                </div>
                                                <div className="request-info">
                                                    <strong>{request.requestType}</strong>
                                                    <span className="text-muted text-sm">
                                                        Submitted {new Date(request.createdAt).toLocaleDateString('en-PH', { month: 'short', day: 'numeric', year: 'numeric' })}
                                                    </span>
                                                </div>
                                                <span className={`badge-new ${badge.class}`}>{badge.label}</span>
                                            </Link>
                                        </li>
                                    )
                                })}
                            </ul>
                        )}
                    </div>
                </div>
            </main>
        </div>
    )
}

export default RequestStatus
