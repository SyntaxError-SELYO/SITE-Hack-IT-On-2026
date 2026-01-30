import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import './Navbar.css'

function Navbar() {
    const { user, logout, isAdmin } = useAuth()
    const navigate = useNavigate()

    const handleLogout = () => {
        logout()
        navigate('/login')
    }

    const basePath = isAdmin ? '/admin' : '/student'

    return (
        <nav className="navbar">
            <div className="container navbar-container">
                <Link to={`${basePath}/dashboard`} className="navbar-brand">
                    <span className="logo-icon">◆</span>
                    <span className="logo-text">SELYO</span>
                </Link>

                <div className="navbar-menu">
                    {isAdmin ? (
                        <>
                            <Link to="/admin/dashboard" className="navbar-link">Dashboard</Link>
                            <Link to="/admin/verify" className="navbar-link">QR Scanner</Link>
                        </>
                    ) : (
                        <>
                            <Link to="/student/dashboard" className="navbar-link">Dashboard</Link>
                            <Link to="/student/requests" className="navbar-link">My Requests</Link>
                            <Link to="/student/request/new" className="navbar-link">New Request</Link>
                        </>
                    )}
                </div>

                <div className="navbar-right">
                    <div className="user-info">
                        <span className="user-name">{user?.name}</span>
                        <span className="user-role">{isAdmin ? 'Registrar Staff' : user?.studentId}</span>
                    </div>
                    <button onClick={handleLogout} className="btn btn-secondary btn-sm">
                        Logout
                    </button>
                </div>
            </div>
        </nav>
    )
}

export default Navbar
