import axios from 'axios'
import mockApi from './mockApi'

// ============================================
// DEMO MODE TOGGLE
// Set to true for Vercel deployment without backend
// ============================================
const DEMO_MODE = true

// Real API (for development with backend)
const realApi = axios.create({
    baseURL: '/api',
    headers: {
        'Content-Type': 'application/json'
    }
})

// Add auth token to requests
realApi.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token')
        if (token) {
            config.headers.Authorization = `Bearer ${token}`
        }
        return config
    },
    (error) => {
        return Promise.reject(error)
    }
)

// Handle auth errors
realApi.interceptors.response.use(
    (response) => response,
    (error) => {
        if (error.response?.status === 401) {
            localStorage.removeItem('token')
            if (window.location.pathname !== '/login') {
                window.location.href = '/login'
            }
        }
        return Promise.reject(error)
    }
)

// Export the appropriate API based on mode
const api = DEMO_MODE ? mockApi : realApi

export default api
