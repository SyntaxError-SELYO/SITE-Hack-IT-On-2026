import { useState } from 'react'
import Sidebar from '../../components/Sidebar'
import api from '../../services/api'
import './Admin.css'

function QRScanner() {
    const [scanResult, setScanResult] = useState(null)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')
    const [manualCode, setManualCode] = useState('')
    const [sidebarOpen, setSidebarOpen] = useState(false)

    const verifyQRCode = async (code) => {
        if (!code.trim()) {
            setError('Please enter a QR code')
            return
        }

        setLoading(true)
        setError('')
        setScanResult(null)

        try {
            const response = await api.get(`/admin/verify/${encodeURIComponent(code)}`)
            setScanResult(response.data)
        } catch (err) {
            setError(err.response?.data?.message || 'Invalid or expired QR code')
        } finally {
            setLoading(false)
        }
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        verifyQRCode(manualCode)
    }

    const markAsReleased = async () => {
        if (!scanResult?.request?._id) return

        setLoading(true)
        setError('')

        try {
            await api.put(`/admin/release/${scanResult.request._id}`)
            setScanResult(prev => ({
                ...prev,
                request: { ...prev.request, status: 'Released' }
            }))
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to mark as released')
        } finally {
            setLoading(false)
        }
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
                        <h1>QR Verification</h1>
                        <p className="text-muted">Scan or enter QR code for document pickup</p>
                    </div>
                </div>

                <div className="panel scanner-box">
                    <div className="panel-head"><h2>Verify QR Code</h2></div>
                    <div className="panel-body">
                        <div className="scanner-preview">
                            <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                                <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
                                <circle cx="12" cy="13" r="4" />
                            </svg>
                            <span>Camera scanning coming soon</span>
                            <span style={{ fontSize: '13px' }}>Use manual entry below</span>
                        </div>

                        <form onSubmit={handleSubmit} style={{ marginTop: '20px' }}>
                            <label className="form-label">Enter QR Code</label>
                            <div style={{ display: 'flex', gap: '10px' }}>
                                <input
                                    type="text"
                                    className="form-input"
                                    placeholder="Enter the QR code value..."
                                    value={manualCode}
                                    onChange={(e) => setManualCode(e.target.value)}
                                    style={{ flex: 1 }}
                                />
                                <button type="submit" className="btn primary" disabled={loading}>
                                    {loading ? 'Verifying...' : 'Verify'}
                                </button>
                            </div>
                        </form>

                        {error && <div className="alert error" style={{ marginTop: '16px' }}>{error}</div>}
                    </div>
                </div>

                {scanResult && (
                    <div className={`panel verify-card ${scanResult.valid ? 'valid' : 'invalid'}`} style={{ maxWidth: '480px' }}>
                        <div className="panel-head">
                            <h2>{scanResult.valid ? 'Valid QR Code' : 'Invalid QR Code'}</h2>
                        </div>
                        <div className="panel-body">
                            {scanResult.valid && scanResult.request && (
                                <>
                                    <div className="detail-grid">
                                        <div className="detail-item"><label>Student</label><span>{scanResult.student?.name}</span></div>
                                        <div className="detail-item"><label>ID</label><span>{scanResult.student?.studentId}</span></div>
                                        <div className="detail-item"><label>Request</label><span>{scanResult.request?.requestType}</span></div>
                                        <div className="detail-item"><label>Status</label><span className={`badge ${scanResult.request?.status === 'Released' ? 'approved' : 'pending'}`}>{scanResult.request?.status}</span></div>
                                    </div>

                                    {scanResult.request?.status !== 'Released' && (
                                        <button className="btn success" onClick={markAsReleased} disabled={loading} style={{ width: '100%', marginTop: '20px' }}>
                                            {loading ? 'Processing...' : 'Mark as Released'}
                                        </button>
                                    )}

                                    {scanResult.request?.status === 'Released' && (
                                        <div className="alert success" style={{ marginTop: '20px' }}>
                                            This document has been released.
                                        </div>
                                    )}
                                </>
                            )}
                        </div>
                    </div>
                )}
            </main>
        </div>
    )
}

export default QRScanner
