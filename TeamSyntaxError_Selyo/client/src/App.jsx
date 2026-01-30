import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import ProtectedRoute from './components/ProtectedRoute'

// Public Pages
import Landing from './pages/Landing'
import Login from './pages/Login'
import Register from './pages/Register'

// Student Pages
import StudentDashboard from './pages/student/Dashboard'
import CreateRequest from './pages/student/CreateRequest'
import RequestStatus from './pages/student/RequestStatus'
import RequestDetail from './pages/student/RequestDetail'

// Admin Pages
import AdminDashboard from './pages/admin/Dashboard'
import AdminRequestReview from './pages/admin/RequestReview'
import QRScanner from './pages/admin/QRScanner'
import Appointments from './pages/admin/Appointments'

function App() {
    return (
        <AuthProvider>
            <BrowserRouter>
                <Routes>
                    {/* Public Routes */}
                    <Route path="/" element={<Landing />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />

                    {/* Student Routes */}
                    <Route path="/student" element={<ProtectedRoute role="student" />}>
                        <Route path="dashboard" element={<StudentDashboard />} />
                        <Route path="request/new" element={<CreateRequest />} />
                        <Route path="requests" element={<RequestStatus />} />
                        <Route path="request/:id" element={<RequestDetail />} />
                    </Route>

                    {/* Admin Routes */}
                    <Route path="/admin" element={<ProtectedRoute role="admin" />}>
                        <Route path="dashboard" element={<AdminDashboard />} />
                        <Route path="request/:id" element={<AdminRequestReview />} />
                        <Route path="verify" element={<QRScanner />} />
                        <Route path="appointments" element={<Appointments />} />
                    </Route>

                    {/* Fallback */}
                    <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
            </BrowserRouter>
        </AuthProvider>
    )
}

export default App
