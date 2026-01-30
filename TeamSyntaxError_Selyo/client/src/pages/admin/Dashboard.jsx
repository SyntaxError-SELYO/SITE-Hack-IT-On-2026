import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'
import Sidebar from '../../components/Sidebar'
import api from '../../services/api'
import './Admin.css'

function Dashboard() {
    const { user } = useAuth()
    const [requests, setRequests] = useState([])
    const [announcements, setAnnouncements] = useState([])
    const [loading, setLoading] = useState(true)
    const [filter, setFilter] = useState('all')
    const [sidebarOpen, setSidebarOpen] = useState(false)

    // Announcement form
    const [showAnnouncementForm, setShowAnnouncementForm] = useState(false)
    const [announcementForm, setAnnouncementForm] = useState({
        title: '',
        message: '',
        type: 'info'
    })
    const [announcementLoading, setAnnouncementLoading] = useState(false)

    useEffect(() => {
        fetchRequests()
        fetchAnnouncements()
    }, [])

    const fetchRequests = async () => {
        try {
            const response = await api.get('/admin/requests')
            setRequests(response.data.requests || [])
        } catch (err) {
            console.error('Failed to fetch requests:', err)
        } finally {
            setLoading(false)
        }
    }

    const fetchAnnouncements = async () => {
        try {
            const response = await api.get('/admin/announcements')
            setAnnouncements(response.data.announcements || [])
        } catch (err) {
            console.error('Failed to fetch announcements:', err)
        }
    }

    const handleCreateAnnouncement = async (e) => {
        e.preventDefault()
        setAnnouncementLoading(true)
        try {
            await api.post('/admin/announcements', announcementForm)
            setAnnouncementForm({ title: '', message: '', type: 'info' })
            setShowAnnouncementForm(false)
            fetchAnnouncements()
        } catch (err) {
            console.error('Failed to create announcement:', err)
        } finally {
            setAnnouncementLoading(false)
        }
    }

    const handleToggleAnnouncement = async (id, isActive) => {
        try {
            await api.put(`/admin/announcements/${id}`, { isActive: !isActive })
            fetchAnnouncements()
        } catch (err) {
            console.error('Failed to toggle announcement:', err)
        }
    }

    const handleDeleteAnnouncement = async (id) => {
        if (!window.confirm('Delete this announcement?')) return
        try {
            await api.delete(`/admin/announcements/${id}`)
            fetchAnnouncements()
        } catch (err) {
            console.error('Failed to delete announcement:', err)
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

    const filteredRequests = filter === 'all'
        ? requests
        : filter === 'pending'
            ? requests.filter(r => ['Submitted', 'Under Review', 'Pending Dean Approval'].includes(r.status))
            : filter === 'approved'
                ? requests.filter(r => ['Approved', 'Ready for Pickup', 'Released'].includes(r.status))
                : requests.filter(r => r.status === 'Rejected')

    const getStatusClass = (status) => {
        if (['Approved', 'Ready for Pickup', 'Released'].includes(status)) return 'approved'
        if (status === 'Rejected') return 'rejected'
        return 'pending'
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
                        <h1>{getGreeting()}!</h1>
                        <p className="text-muted">Registrar Command Center</p>
                    </div>
                    <Link to="/admin/verify" className="btn primary">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
                            <circle cx="12" cy="13" r="4" />
                        </svg>
                        QR Scanner
                    </Link>
                </div>

                {/* Announcement Management */}
                <div className="panel" style={{ marginBottom: '24px' }}>
                    <div className="panel-head">
                        <h2>📢 Announcements</h2>
                        <button
                            className="btn primary"
                            onClick={() => setShowAnnouncementForm(!showAnnouncementForm)}
                            style={{ padding: '8px 14px', fontSize: '13px' }}
                        >
                            {showAnnouncementForm ? 'Cancel' : '+ New'}
                        </button>
                    </div>
                    <div className="panel-body">
                        {showAnnouncementForm && (
                            <form onSubmit={handleCreateAnnouncement} className="announcement-form">
                                <div className="form-row">
                                    <input
                                        type="text"
                                        className="form-input"
                                        placeholder="Announcement title..."
                                        value={announcementForm.title}
                                        onChange={(e) => setAnnouncementForm({ ...announcementForm, title: e.target.value })}
                                        required
                                    />
                                    <select
                                        className="form-input"
                                        value={announcementForm.type}
                                        onChange={(e) => setAnnouncementForm({ ...announcementForm, type: e.target.value })}
                                        style={{ width: '140px' }}
                                    >
                                        <option value="info">ℹ️ Info</option>
                                        <option value="warning">⚠️ Warning</option>
                                        <option value="urgent">🚨 Urgent</option>
                                    </select>
                                </div>
                                <textarea
                                    className="form-textarea"
                                    placeholder="Message to display to students..."
                                    value={announcementForm.message}
                                    onChange={(e) => setAnnouncementForm({ ...announcementForm, message: e.target.value })}
                                    required
                                    rows={2}
                                />
                                <button type="submit" className="btn success" disabled={announcementLoading}>
                                    {announcementLoading ? 'Posting...' : 'Post Announcement'}
                                </button>
                            </form>
                        )}

                        {announcements.length === 0 ? (
                            <p className="text-muted text-center">No announcements yet</p>
                        ) : (
                            <div className="announcements-list">
                                {announcements.map(ann => (
                                    <div key={ann._id} className={`announcement-item ${ann.type} ${!ann.isActive ? 'inactive' : ''}`}>
                                        <div className="announcement-info">
                                            <strong>{ann.title}</strong>
                                            <span>{ann.message}</span>
                                            <small className="text-muted">
                                                {new Date(ann.createdAt).toLocaleDateString('en-PH')} • {ann.isActive ? 'Active' : 'Hidden'}
                                            </small>
                                        </div>
                                        <div className="announcement-actions">
                                            <button
                                                className={`btn-sm ${ann.isActive ? 'warning' : 'success'}`}
                                                onClick={() => handleToggleAnnouncement(ann._id, ann.isActive)}
                                            >
                                                {ann.isActive ? 'Hide' : 'Show'}
                                            </button>
                                            <button
                                                className="btn-sm danger"
                                                onClick={() => handleDeleteAnnouncement(ann._id)}
                                            >
                                                Delete
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>

                <div className="stats-row">
                    <div className="stat-box">
                        <span className="stat-num">{stats.total}</span>
                        <span className="stat-txt">Total Requests</span>
                    </div>
                    <div className="stat-box warn">
                        <span className="stat-num">{stats.pending}</span>
                        <span className="stat-txt">Pending</span>
                    </div>
                    <div className="stat-box success">
                        <span className="stat-num">{stats.approved}</span>
                        <span className="stat-txt">Approved</span>
                    </div>
                    <div className="stat-box danger">
                        <span className="stat-num">{stats.rejected}</span>
                        <span className="stat-txt">Rejected</span>
                    </div>
                </div>

                <div className="panel">
                    <div className="panel-head">
                        <h2>All Requests</h2>
                        <div className="tab-group">
                            {['all', 'pending', 'approved', 'rejected'].map(f => (
                                <button
                                    key={f}
                                    className={`tab ${filter === f ? 'active' : ''}`}
                                    onClick={() => setFilter(f)}
                                >
                                    {f.charAt(0).toUpperCase() + f.slice(1)}
                                </button>
                            ))}
                        </div>
                    </div>
                    <div className="panel-body" style={{ padding: 0 }}>
                        {loading ? (
                            <p className="text-center text-muted" style={{ padding: '32px' }}>Loading...</p>
                        ) : filteredRequests.length === 0 ? (
                            <p className="text-center text-muted" style={{ padding: '32px' }}>No requests found</p>
                        ) : (
                            <div className="table-wrap">
                                <table className="data-table">
                                    <thead>
                                        <tr>
                                            <th>Student</th>
                                            <th>Request Type</th>
                                            <th>Date</th>
                                            <th>Status</th>
                                            <th></th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {filteredRequests.slice(0, 15).map(request => (
                                            <tr key={request._id}>
                                                <td>
                                                    <div className="cell-stack">
                                                        <strong>{request.student?.name || 'N/A'}</strong>
                                                        <span className="text-muted text-sm">{request.student?.studentId || ''}</span>
                                                    </div>
                                                </td>
                                                <td>{request.requestType}</td>
                                                <td>{new Date(request.createdAt).toLocaleDateString('en-PH')}</td>
                                                <td><span className={`badge ${getStatusClass(request.status)}`}>{request.status}</span></td>
                                                <td>
                                                    <Link to={`/admin/request/${request._id}`} className="btn-link">Review</Link>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                </div>
            </main>
        </div>
    )
}

export default Dashboard
