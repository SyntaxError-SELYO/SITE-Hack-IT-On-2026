import { Link, useLocation, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import './Sidebar.css'

function Sidebar({ isOpen, onToggle }) {
    const { user, logout } = useAuth()
    const location = useLocation()
    const navigate = useNavigate()
    const isAdmin = user?.role === 'admin'

    const handleLogout = () => {
        logout()
        navigate('/login')
    }

    const studentLinks = [
        { path: '/student/dashboard', label: 'Dashboard', icon: 'dashboard' },
        { path: '/student/request/new', label: 'New Request', icon: 'add' },
        { path: '/student/requests', label: 'My Requests', icon: 'list' },
    ]

    const adminLinks = [
        { path: '/admin/dashboard', label: 'Dashboard', icon: 'dashboard' },
        { path: '/admin/appointments', label: 'Appointments', icon: 'calendar' },
        { path: '/admin/verify', label: 'QR Scanner', icon: 'scan' },
    ]

    const links = isAdmin ? adminLinks : studentLinks

    const getIcon = (type) => {
        const icons = {
            dashboard: (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="3" y="3" width="7" height="9" rx="1" />
                    <rect x="14" y="3" width="7" height="5" rx="1" />
                    <rect x="14" y="12" width="7" height="9" rx="1" />
                    <rect x="3" y="16" width="7" height="5" rx="1" />
                </svg>
            ),
            add: (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                    <path d="M14 2v6h6" />
                    <line x1="12" y1="18" x2="12" y2="12" />
                    <line x1="9" y1="15" x2="15" y2="15" />
                </svg>
            ),
            list: (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                    <path d="M14 2v6h6" />
                    <line x1="16" y1="13" x2="8" y2="13" />
                    <line x1="16" y1="17" x2="8" y2="17" />
                </svg>
            ),
            scan: (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
                    <circle cx="12" cy="13" r="4" />
                </svg>
            ),
            calendar: (
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                    <line x1="16" y1="2" x2="16" y2="6" />
                    <line x1="8" y1="2" x2="8" y2="6" />
                    <line x1="3" y1="10" x2="21" y2="10" />
                </svg>
            )
        }
        return icons[type] || icons.dashboard
    }

    return (
        <>
            {isOpen && <div className="sidebar-overlay" onClick={onToggle}></div>}

            <aside className={`sidebar ${isOpen ? 'open' : ''}`}>
                <div className="sidebar-brand">
                    <Link to={isAdmin ? '/admin/dashboard' : '/student/dashboard'} className="brand-link">
                        <img src="/ustp-logo.png" alt="USTP Registrar" className="brand-logo" />
                    </Link>
                </div>

                <nav className="sidebar-nav">
                    {links.map((link) => (
                        <Link
                            key={link.path}
                            to={link.path}
                            className={`nav-item ${location.pathname === link.path ? 'active' : ''}`}
                        >
                            <span className="nav-icon">{getIcon(link.icon)}</span>
                            <span className="nav-text">{link.label}</span>
                        </Link>
                    ))}
                </nav>

                <div className="sidebar-bottom">
                    <div className="user-block">
                        <div className="user-avatar">
                            {user?.name?.charAt(0)?.toUpperCase() || 'U'}
                        </div>
                        <span className="user-name">{user?.name || 'User'}</span>
                    </div>

                    <button className="logout-btn" onClick={handleLogout}>
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                            <polyline points="16 17 21 12 16 7" />
                            <line x1="21" y1="12" x2="9" y2="12" />
                        </svg>
                        <span>Logout</span>
                    </button>
                </div>
            </aside>
        </>
    )
}

export default Sidebar
