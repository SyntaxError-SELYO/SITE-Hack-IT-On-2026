import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import Sidebar from '../../components/Sidebar'
import api from '../../services/api'
import './Student.css'

function Dashboard() {
    const { user } = useAuth()
    const [requests, setRequests] = useState([])
    const [announcements, setAnnouncements] = useState([])
    const [loading, setLoading] = useState(true)
    const [sidebarOpen, setSidebarOpen] = useState(false)

    useEffect(() => {
        fetchRequests()
        fetchAnnouncements()
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

    const fetchAnnouncements = async () => {
        try {
            const response = await api.get('/requests/announcements')
            setAnnouncements(response.data.announcements || [])
        } catch (err) {
            console.error('Failed to fetch announcements:', err)
        }
    }

    const getGreeting = () => {
        const hour = new Date().getHours()
        if (hour < 12) return 'Good Morning'
        if (hour < 18) return 'Good Afternoon'
        return 'Good Evening'
    }

    const stats = {
        total: requests.length,
        pending: requests.filter(r => ['Submitted', 'Under Review', 'Pending Dean Approval'].includes(r.status)).length,
        approved: requests.filter(r => ['Approved', 'Ready for Pickup', 'Released'].includes(r.status)).length,
        rejected: requests.filter(r => r.status === 'Rejected').length
    }

    const recentRequests = requests.slice(0, 4)

    const getStatusBadge = (status) => {
        const statusMap = {
            'Submitted': { label: 'SUBMITTED', class: 'pending' },
            'Under Review': { label: 'UNDER REVIEW', class: 'pending' },
            'Pending Dean Approval': { label: 'PENDING DEAN', class: 'pending-dean' },
            'Appointment Scheduled': { label: 'SCHEDULED', class: 'info' },
            'Approved': { label: 'APPROVED', class: 'approved' },
            'Ready for Pickup': { label: 'READY FOR PICKUP', class: 'ready' },
            'Rejected': { label: 'REJECTED', class: 'rejected' },
            'Released': { label: 'RELEASED', class: 'approved' },
            'Completed': { label: 'COMPLETED', class: 'completed' }
        }
        return statusMap[status] || { label: status.toUpperCase(), class: 'pending' }
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
                        <h1 className="greeting-title">{getGreeting()}, {user?.name?.split(' ')[0]}!</h1>
                    </div>
                    <Link to="/student/request/new" className="btn primary">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
                            <line x1="12" y1="5" x2="12" y2="19" />
                            <line x1="5" y1="12" x2="19" y2="12" />
                        </svg>
                        New Request
                    </Link>
                </div>

                {/* Announcements */}
                {announcements.length > 0 && (
                    <div className="announcements-section">
                        {announcements.map(ann => (
                            <div key={ann._id} className={`announcement-banner ${ann.type}`}>
                                <div className="announcement-icon">
                                    {ann.type === 'urgent' && (
                                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                            <circle cx="12" cy="12" r="10" />
                                            <line x1="12" y1="8" x2="12" y2="12" />
                                            <line x1="12" y1="16" x2="12.01" y2="16" />
                                        </svg>
                                    )}
                                    {ann.type === 'warning' && (
                                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                            <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" />
                                            <line x1="12" y1="9" x2="12" y2="13" />
                                            <line x1="12" y1="17" x2="12.01" y2="17" />
                                        </svg>
                                    )}
                                    {ann.type === 'info' && (
                                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                            <circle cx="12" cy="12" r="10" />
                                            <line x1="12" y1="16" x2="12" y2="12" />
                                            <line x1="12" y1="8" x2="12.01" y2="8" />
                                        </svg>
                                    )}
                                </div>
                                <div className="announcement-content">
                                    <strong>{ann.title}</strong>
                                    <span>{ann.message}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Stats Row */}
                <div className="stats-row">
                    <div className="stat-box">
                        <span className="stat-label">TOTAL REQUESTS</span>
                        <span className="stat-num blue">{stats.total}</span>
                        <span className="stat-sub">All time</span>
                    </div>
                    <div className="stat-box">
                        <span className="stat-label">PENDING</span>
                        <span className="stat-num orange">{stats.pending}</span>
                        <span className="stat-sub">Awaiting review</span>
                    </div>
                    <div className="stat-box">
                        <span className="stat-label">APPROVED</span>
                        <span className="stat-num green">{stats.approved}</span>
                        <span className="stat-sub">Ready for pickup</span>
                    </div>
                    <div className="stat-box">
                        <span className="stat-label">REJECTED</span>
                        <span className="stat-num red">{stats.rejected}</span>
                        <span className="stat-sub">This month</span>
                    </div>
                </div>

                <div className="content-cols">
                    {/* Recent Requests */}
                    <section className="panel">
                        <div className="panel-head">
                            <h2>Recent Requests</h2>
                            <Link to="/student/requests" className="link-arrow">View All</Link>
                        </div>
                        <div className="panel-body">
                            {loading ? (
                                <p className="text-center text-muted">Loading...</p>
                            ) : recentRequests.length === 0 ? (
                                <div className="empty-box">
                                    <p>No requests yet</p>
                                    <Link to="/student/request/new" className="btn outline">Create your first request</Link>
                                </div>
                            ) : (
                                <ul className="request-list-new">
                                    {recentRequests.map(request => {
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
                                                            {new Date(request.createdAt).toLocaleDateString('en-PH', { month: 'short', day: 'numeric', year: 'numeric' })}
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
                    </section>

                    {/* Quick Actions */}
                    <section className="panel">
                        <div className="panel-head">
                            <h2>Quick Actions</h2>
                        </div>
                        <div className="panel-body">
                            <div className="actions-grid">
                                <Link to="/student/request/new?type=TOR" className="action-card-new">
                                    <div className="action-icon-new blue">
                                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                                            <path d="M14 2v6h6" />
                                            <line x1="16" y1="13" x2="8" y2="13" />
                                            <line x1="16" y1="17" x2="8" y2="17" />
                                        </svg>
                                    </div>
                                    <span>Request TOR</span>
                                </Link>
                                <Link to="/student/request/new?type=Shifting" className="action-card-new">
                                    <div className="action-icon-new pink">
                                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                            <polyline points="16 3 21 3 21 8" />
                                            <line x1="4" y1="20" x2="21" y2="3" />
                                            <polyline points="21 16 21 21 16 21" />
                                            <line x1="15" y1="15" x2="21" y2="21" />
                                            <line x1="4" y1="4" x2="9" y2="9" />
                                        </svg>
                                    </div>
                                    <span>Request Shifting</span>
                                </Link>
                                <Link to="/student/request/new?type=Add/Drop" className="action-card-new">
                                    <div className="action-icon-new green">
                                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                            <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" />
                                            <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" />
                                        </svg>
                                    </div>
                                    <span>Add/Drop Form</span>
                                </Link>
                                <Link to="/student/requests" className="action-card-new">
                                    <div className="action-icon-new orange">
                                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                            <line x1="18" y1="20" x2="18" y2="10" />
                                            <line x1="12" y1="20" x2="12" y2="4" />
                                            <line x1="6" y1="20" x2="6" y2="14" />
                                        </svg>
                                    </div>
                                    <span>Track Status</span>
                                </Link>
                            </div>
                        </div>
                    </section>
                </div>
            </main>
        </div>
    )
}

export default Dashboard
