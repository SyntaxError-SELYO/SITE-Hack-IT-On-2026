import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import './Auth.css'

function Login() {
    const navigate = useNavigate()
    const { login, isAuthenticated, user, error: authError } = useAuth()

    const [formData, setFormData] = useState({
        email: '',
        password: '',
        role: 'student',
        rememberMe: false
    })
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        if (isAuthenticated && user) {
            const redirectPath = user.role === 'admin' ? '/admin/dashboard' : '/student/dashboard'
            navigate(redirectPath, { replace: true })
        }
    }, [isAuthenticated, user, navigate])

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? checked : value
        }))
        setError('')
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError('')
        setLoading(true)

        try {
            await login(formData.email, formData.password, formData.role)
        } catch (err) {
            setError(err.message || 'Login failed. Please try again.')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="auth-page">
            {/* Background Split */}
            <div className="auth-bg">
                <div className="auth-bg-left"></div>
                <div className="auth-bg-right"></div>
            </div>

            {/* Header with Logos */}
            <div className="auth-top-bar">
                <div className="auth-logo-left">
                    <img src="/selyo-logo.png" alt="SELYO" className="selyo-logo" />
                </div>
            </div>

            {/* Login Card */}
            <div className="auth-card">
                <div className="card-header-logo">
                    <img src="/ustp-logo.png" alt="USTP Registrar" className="ustp-logo-card" />
                </div>
                <h2>Login to your account</h2>

                {(error || authError) && (
                    <div className="alert alert-error">
                        {error || authError}
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    {/* Role Selector */}
                    <div className="role-tabs">
                        <button
                            type="button"
                            className={`role-tab ${formData.role === 'student' ? 'active' : ''}`}
                            onClick={() => setFormData(prev => ({ ...prev, role: 'student' }))}
                        >
                            🎓 Student
                        </button>
                        <button
                            type="button"
                            className={`role-tab ${formData.role === 'admin' ? 'active' : ''}`}
                            onClick={() => setFormData(prev => ({ ...prev, role: 'admin' }))}
                        >
                            🏛️ Staff
                        </button>
                    </div>

                    {/* Username/Email Input */}
                    <div className="input-group">
                        <span className="input-icon">
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                                <circle cx="12" cy="7" r="4" />
                            </svg>
                        </span>
                        <input
                            type="text"
                            name="email"
                            placeholder={formData.role === 'student' ? 'Email or Student ID' : 'Email'}
                            value={formData.email}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    {/* Password Input */}
                    <div className="input-group">
                        <span className="input-icon">
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                                <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                            </svg>
                        </span>
                        <input
                            type="password"
                            name="password"
                            placeholder="Password"
                            value={formData.password}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    {/* Remember Me */}
                    <div className="remember-row">
                        <label className="checkbox-label">
                            <input
                                type="checkbox"
                                name="rememberMe"
                                checked={formData.rememberMe}
                                onChange={handleChange}
                            />
                            <span className="checkmark" style={{ display: 'none' }}></span>
                            Remember me
                        </label>
                    </div>

                    {/* Submit Button */}
                    <button type="submit" className="login-btn" disabled={loading}>
                        {loading ? 'Signing in...' : 'Login'}
                    </button>
                </form>

                <div className="auth-footer">
                    <p style={{ marginBottom: '10px' }}>
                        <Link to="/forgot-password">Forgot your password?</Link>
                    </p>
                    <p>
                        Don't have an account? <Link to="/register">Sign up</Link>
                    </p>
                </div>
            </div>
        </div>
    )
}

export default Login
