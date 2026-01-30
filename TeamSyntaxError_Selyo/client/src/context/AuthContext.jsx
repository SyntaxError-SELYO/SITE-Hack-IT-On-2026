import { createContext, useContext, useState, useEffect } from 'react'
import api from '../services/api'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    useEffect(() => {
        checkAuth()
    }, [])

    const checkAuth = async () => {
        const token = localStorage.getItem('token')
        if (token) {
            try {
                const response = await api.get('/auth/me')
                setUser(response.data.user)
            } catch (err) {
                localStorage.removeItem('token')
            }
        }
        setLoading(false)
    }

    const login = async (email, password, role) => {
        try {
            setError(null)
            const response = await api.post('/auth/login', { email, password, role })
            const { token, user } = response.data
            localStorage.setItem('token', token)
            setUser(user)
            return user
        } catch (err) {
            const message = err.response?.data?.message || 'Login failed'
            setError(message)
            throw new Error(message)
        }
    }

    const register = async (userData) => {
        try {
            setError(null)
            const response = await api.post('/auth/register', userData)
            const { token, user } = response.data
            localStorage.setItem('token', token)
            setUser(user)
            return user
        } catch (err) {
            const message = err.response?.data?.message || 'Registration failed'
            setError(message)
            throw new Error(message)
        }
    }

    const logout = () => {
        localStorage.removeItem('token')
        setUser(null)
    }

    const value = {
        user,
        loading,
        error,
        login,
        register,
        logout,
        isAuthenticated: !!user,
        isStudent: user?.role === 'student',
        isAdmin: user?.role === 'admin'
    }

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    )
}

export function useAuth() {
    const context = useContext(AuthContext)
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider')
    }
    return context
}

export default AuthContext
