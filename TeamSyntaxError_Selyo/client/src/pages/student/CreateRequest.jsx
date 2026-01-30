import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import Sidebar from '../../components/Sidebar'
import api from '../../services/api'
import './Student.css'

function CreateRequest() {
    const navigate = useNavigate()
    const [sidebarOpen, setSidebarOpen] = useState(false)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')
    const [requestTypes, setRequestTypes] = useState({})
    const [formData, setFormData] = useState({
        requestType: '',
        reason: ''
    })
    const [files, setFiles] = useState([])

    useEffect(() => {
        fetchRequestTypes()
    }, [])

    const fetchRequestTypes = async () => {
        try {
            const response = await api.get('/requests/types')
            setRequestTypes(response.data.types || {})
        } catch (err) {
            console.error('Failed to fetch request types:', err)
            // Fallback to default types
            setRequestTypes({
                'TOR': { label: 'Transcript of Records', requiresAppointment: false, requiredDocuments: [] },
                'Shifting': { label: 'Program Shifting', requiresAppointment: false, requiredDocuments: [] },
                'Add/Drop': { label: 'Add/Drop Form', requiresAppointment: false, requiredDocuments: [] }
            })
        }
    }

    const selectedType = requestTypes[formData.requestType]

    const handleFileChange = (e) => {
        const newFiles = Array.from(e.target.files)
        setFiles(prev => [...prev, ...newFiles])
    }

    const removeFile = (index) => {
        setFiles(prev => prev.filter((_, i) => i !== index))
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError('')

        if (!formData.requestType) {
            setError('Please select a request type')
            return
        }

        setLoading(true)

        try {
            const formDataToSend = new FormData()
            formDataToSend.append('requestType', formData.requestType)
            formDataToSend.append('reason', formData.reason)
            files.forEach(file => formDataToSend.append('documents', file))

            await api.post('/requests', formDataToSend, {
                headers: { 'Content-Type': 'multipart/form-data' }
            })

            navigate('/student/requests', { state: { success: true } })
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to submit request')
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
                        <h1>New Request</h1>
                        <p className="text-muted">Submit a new registrar request</p>
                    </div>
                </div>

                <div className="panel" style={{ maxWidth: '700px' }}>
                    <div className="panel-body">
                        {error && <div className="alert error">{error}</div>}

                        <form onSubmit={handleSubmit}>
                            <div className="form-group">
                                <label className="form-label">Request Type</label>
                                <div className="type-options">
                                    {Object.entries(requestTypes).map(([key, type]) => (
                                        <label
                                            key={key}
                                            className={`type-option ${formData.requestType === key ? 'selected' : ''}`}
                                        >
                                            <input
                                                type="radio"
                                                name="requestType"
                                                value={key}
                                                checked={formData.requestType === key}
                                                onChange={(e) => setFormData({ ...formData, requestType: e.target.value })}
                                            />
                                            <div className="type-info">
                                                <strong>{type.label}</strong>
                                                {type.requiresAppointment && (
                                                    <span className="badge pending" style={{ marginLeft: '8px', fontSize: '11px' }}>
                                                        Requires Visit
                                                    </span>
                                                )}
                                            </div>
                                        </label>
                                    ))}
                                </div>
                            </div>

                            {/* Requirements Checklist */}
                            {selectedType?.requiresAppointment && (
                                <div className="requirements-box">
                                    <div className="requirements-header">
                                        <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                            <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                                            <path d="M14 2v6h6" />
                                            <line x1="16" y1="13" x2="8" y2="13" />
                                            <line x1="16" y1="17" x2="8" y2="17" />
                                        </svg>
                                        <strong>What to Bring</strong>
                                    </div>
                                    <p className="text-muted text-sm" style={{ marginBottom: '12px' }}>
                                        This request requires a physical visit. Please prepare the following documents:
                                    </p>
                                    <ul className="requirements-list">
                                        {selectedType.requiredDocuments.map((doc, index) => (
                                            <li key={index}>
                                                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                                                    <polyline points="9 11 12 14 22 4" />
                                                    <path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11" />
                                                </svg>
                                                {doc}
                                            </li>
                                        ))}
                                    </ul>
                                    <div className="alert info" style={{ marginTop: '12px' }}>
                                        An appointment will be scheduled after your request is reviewed.
                                    </div>
                                </div>
                            )}

                            <div className="form-group">
                                <label className="form-label">Reason / Remarks</label>
                                <textarea
                                    className="form-textarea"
                                    placeholder="Provide additional details..."
                                    value={formData.reason}
                                    onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                                />
                            </div>

                            {/* Only show file upload for non-appointment requests */}
                            {!selectedType?.requiresAppointment && (
                                <div className="form-group">
                                    <label className="form-label">Supporting Documents (optional)</label>
                                    <div className={`upload-area ${files.length > 0 ? 'has-files' : ''}`}>
                                        <input
                                            type="file"
                                            id="file-upload"
                                            multiple
                                            accept=".pdf,.jpg,.jpeg,.png"
                                            onChange={handleFileChange}
                                            style={{ display: 'none' }}
                                        />
                                        <label htmlFor="file-upload" style={{ cursor: 'pointer' }}>
                                            <div style={{ fontSize: '24px', marginBottom: '8px' }}>+</div>
                                            <div>Click to upload files</div>
                                            <div className="text-muted text-sm" style={{ marginTop: '4px' }}>PDF, JPG, PNG (max 5MB)</div>
                                        </label>
                                    </div>

                                    {files.length > 0 && (
                                        <div className="file-list">
                                            {files.map((file, index) => (
                                                <div key={index} className="file-item">
                                                    <span>{file.name}</span>
                                                    <button type="button" onClick={() => removeFile(index)}>×</button>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            )}

                            <div style={{ display: 'flex', gap: '12px', marginTop: '28px' }}>
                                <button type="button" className="btn outline" onClick={() => navigate('/student/dashboard')}>Cancel</button>
                                <button type="submit" className="btn primary" disabled={loading}>
                                    {loading ? 'Submitting...' : 'Submit Request'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </main>
        </div>
    )
}

export default CreateRequest
