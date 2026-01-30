import { useState, useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import './Auth.css'

function Register() {
    const navigate = useNavigate()
    const { register, isAuthenticated, user, error: authError } = useAuth()

    const [formData, setFormData] = useState({
        studentId: '',
        name: '',
        email: '',
        program: '',
        yearLevel: '',
        password: '',
        confirmPassword: ''
    })
    const [error, setError] = useState('')
    const [loading, setLoading] = useState(false)

    const programs = [
        'Bachelor of Science in Computer Science',
        'Bachelor of Science in Information Technology',
        'Bachelor of Science in Computer Engineering',
        'Bachelor of Science in Electronics Engineering',
        'Bachelor of Science in Civil Engineering',
        'Bachelor of Science in Mechanical Engineering',
        'Bachelor of Science in Accountancy',
        'Bachelor of Science in Business Administration',
        'Bachelor of Arts in Communication',
        'Bachelor of Elementary Education',
        'Bachelor of Secondary Education'
    ]

    useEffect(() => {
        if (isAuthenticated && user) {
            navigate('/student/dashboard', { replace: true })
        }
    }, [isAuthenticated, user, navigate])

    const handleChange = (e) => {
        const { name, value } = e.target
        setFormData(prev => ({ ...prev, [name]: value }))
        setError('')
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError('')

        if (formData.password !== formData.confirmPassword) {
            setError('Passwords do not match')
            return
        }

        if (formData.password.length < 6) {
            setError('Password must be at least 6 characters')
            return
        }

        setLoading(true)

        try {
            await register({
                studentId: formData.studentId,
                name: formData.name,
                email: formData.email,
                program: formData.program,
                yearLevel: parseInt(formData.yearLevel),
                password: formData.password,
                role: 'student'
            })
        } catch (err) {
            setError(err.message || 'Registration failed. Please try again.')
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

            {/* Register Card */}
            <div className="auth-card" style={{ maxWidth: '480px' }}>
                <div className="card-header-logo">
                    <img src="/ustp-logo.png" alt="USTP Registrar" className="ustp-logo-card" />
                </div>
                <h2>Create your account</h2>

                {(error || authError) && (
                    <div className="alert alert-error">
                        {error || authError}
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    {/* Student ID & Name */}
                    <div className="register-grid">
                        <div className="input-group">
                            <span className="input-icon">
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <rect x="2" y="4" width="20" height="16" rx="2" />
                                    <line x1="6" y1="8" x2="18" y2="8" />
                                    <line x1="6" y1="12" x2="14" y2="12" />
                                </svg>
                            </span>
                            <input
                                type="text"
                                name="studentId"
                                placeholder="Student ID (e.g., 2024-00001)"
                                value={formData.studentId}
                                onChange={handleChange}
                                required
                            />
                        </div>
                        <div className="input-group">
                            <span className="input-icon">
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                                    <circle cx="12" cy="7" r="4" />
                                </svg>
                            </span>
                            <input
                                type="text"
                                name="name"
                                placeholder="Full Name"
                                value={formData.name}
                                onChange={handleChange}
                                required
                            />
                        </div>
                    </div>

                    {/* Email */}
                    <div className="input-group" style={{ marginTop: '12px' }}>
                        <span className="input-icon">
                            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                                <polyline points="22,6 12,13 2,6" />
                            </svg>
                        </span>
                        <input
                            type="email"
                            name="email"
                            placeholder="Email Address"
                            value={formData.email}
                            onChange={handleChange}
                            required
                        />
                    </div>

                    {/* Program & Year */}
                    <div className="register-grid" style={{ marginTop: '12px' }}>
                        <div className="input-group">
                            <span className="input-icon">
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <path d="M22 10v6M2 10l10-5 10 5-10 5z" />
                                    <path d="M6 12v5c3 3 9 3 12 0v-5" />
                                </svg>
                            </span>
                            <select
                                name="program"
                                className="form-select"
                                value={formData.program}
                                onChange={handleChange}
                                required
                            >
                                <option value="">Select Program</option>
                                {programs.map(program => (
                                    <option key={program} value={program}>{program}</option>
                                ))}
                            </select>
                        </div>
                        <div className="input-group">
                            <span className="input-icon">
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
                                    <line x1="16" y1="2" x2="16" y2="6" />
                                    <line x1="8" y1="2" x2="8" y2="6" />
                                    <line x1="3" y1="10" x2="21" y2="10" />
                                </svg>
                            </span>
                            <select
                                name="yearLevel"
                                className="form-select"
                                value={formData.yearLevel}
                                onChange={handleChange}
                                required
                            >
                                <option value="">Year Level</option>
                                <option value="1">1st Year</option>
                                <option value="2">2nd Year</option>
                                <option value="3">3rd Year</option>
                                <option value="4">4th Year</option>
                                <option value="5">5th Year</option>
                            </select>
                        </div>
                    </div>

                    {/* Password */}
                    <div className="register-grid" style={{ marginTop: '12px' }}>
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
                        <div className="input-group">
                            <span className="input-icon">
                                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                                    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                                </svg>
                            </span>
                            <input
                                type="password"
                                name="confirmPassword"
                                placeholder="Confirm Password"
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                required
                            />
                        </div>
                    </div>

                    {/* Submit Button */}
                    <button type="submit" className="login-btn" style={{ marginTop: '20px' }} disabled={loading}>
                        {loading ? 'Creating account...' : 'Create Account'}
                    </button>
                </form>

                <div className="auth-footer">
                    <p>
                        Already have an account? <Link to="/login">Sign in</Link>
                    </p>
                </div>
            </div>
        </div>
    )
}

export default Register
