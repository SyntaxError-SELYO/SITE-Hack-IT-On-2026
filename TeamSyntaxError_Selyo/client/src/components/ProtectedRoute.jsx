import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

function ProtectedRoute({ role }) {
    const { user, loading, isAuthenticated } = useAuth()

    if (loading) {
        return (
            <div className="loading-screen">
                <div className="spinner"></div>
                <p>Loading...</p>
                <style>{`
          .loading-screen {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            height: 100vh;
            gap: 1rem;
          }
        `}</style>
            </div>
        )
    }

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />
    }

    if (role && user.role !== role) {
        // Redirect to appropriate dashboard
        const redirectPath = user.role === 'admin' ? '/admin/dashboard' : '/student/dashboard'
        return <Navigate to={redirectPath} replace />
    }

    return <Outlet />
}

export default ProtectedRoute
