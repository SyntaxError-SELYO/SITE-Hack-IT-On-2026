import { useState, useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import Sidebar from '../../components/Sidebar'
import api from '../../services/api'
import './Student.css'

function CreateRequest() {
    const navigate = useNavigate()
    const [searchParams] = useSearchParams()
    const [sidebarOpen, setSidebarOpen] = useState(false)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')
    const [requestTypes, setRequestTypes] = useState({})
    const [formData, setFormData] = useState({
        requestType: searchParams.get('type') || '',
        reason: ''
    })
    const [files, setFiles] = useState([])
    const [dragActive, setDragActive] = useState(false)

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

    const handleDrag = (e) => {
        e.preventDefault()
        e.stopPropagation()
        if (e.type === 'dragenter' || e.type === 'dragover') {
            setDragActive(true)
        } else if (e.type === 'dragleave') {
            setDragActive(false)
        }
    }

    const handleDrop = (e) => {
        e.preventDefault()
        e.stopPropagation()
        setDragActive(false)
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            const newFiles = Array.from(e.dataTransfer.files)
            setFiles(prev => [...prev, ...newFiles])
        }
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

    const getTypeIcon = (key) => {
        const icons = {
            'TOR': (
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                    <path d="M14 2v6h6" />
                    <line x1="16" y1="13" x2="8" y2="13" />
                    <line x1="16" y1="17" x2="8" y2="17" />
                </svg>
            ),
            'Add/Drop': (
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <rect x="3" y="3" width="18" height="18" rx="2" />
                    <line x1="12" y1="8" x2="12" y2="16" />
                    <line x1="8" y1="12" x2="16" y2="12" />
                </svg>
            ),
            'Shifting': (
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <polyline points="16 3 21 3 21 8" />
                    <line x1="4" y1="20" x2="21" y2="3" />
                    <polyline points="21 16 21 21 16 21" />
                    <line x1="15" y1="15" x2="21" y2="21" />
                </svg>
            ),
            'Irregular Enrollment': (
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                    <circle cx="8.5" cy="7" r="4" />
                    <line x1="20" y1="8" x2="20" y2="14" />
                    <line x1="23" y1="11" x2="17" y2="11" />
                </svg>
            ),
            'Document Submission': (
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                    <path d="M14 2v6h6" />
                    <polyline points="9 15 12 18 15 15" />
                    <line x1="12" y1="12" x2="12" y2="18" />
                </svg>
            ),
            'Petition for Subject': (
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <line x1="8" y1="6" x2="21" y2="6" />
                    <line x1="8" y1="12" x2="21" y2="12" />
                    <line x1="8" y1="18" x2="21" y2="18" />
                    <line x1="3" y1="6" x2="3.01" y2="6" />
                    <line x1="3" y1="12" x2="3.01" y2="12" />
                    <line x1="3" y1="18" x2="3.01" y2="18" />
                </svg>
            )
        }
        return icons[key] || icons['TOR']
    }

    const getSubLabel = (key) => {
        const labels = {
            'TOR': 'Transcript of Records',
            'Add/Drop': 'Subject Management',
            'Shifting': 'Change Program',
            'Irregular Enrollment': 'Irregular/Transfer Enrollment',
            'Document Submission': 'Submit Documents',
            'Petition for Subject': 'Petition for Subject'
        }
        return labels[key] || ''
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
                        <h1>Submit New Request</h1>
                        <p className="text-muted">Select your request type and upload the required documents.</p>
                    </div>
                </div>

                <div className="panel" style={{ maxWidth: '900px' }}>
                    <div className="panel-body">
                        {error && <div className="alert error">{error}</div>}

                        <form onSubmit={handleSubmit}>
                            {/* Request Type Grid */}
                            <div className="request-type-grid">
                                {Object.entries(requestTypes).map(([key, type]) => (
                                    <button
                                        key={key}
                                        type="button"
                                        className={`request-type-card ${formData.requestType === key ? 'selected' : ''} ${type.requiresAppointment ? 'requires-visit' : ''}`}
                                        onClick={() => setFormData({ ...formData, requestType: key })}
                                    >
                                        <div className="type-card-icon">
                                            {getTypeIcon(key)}
                                        </div>
                                        <div className="type-card-label">{type.label}</div>
                                        <div className="type-card-sub">{getSubLabel(key)}</div>
                                        {type.requiresAppointment && (
                                            <span className="requires-visit-badge">Requires Visit</span>
                                        )}
                                    </button>
                                ))}
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

                            {/* Purpose of Request */}
                            <div className="form-group">
                                <label className="form-label">Purpose of Request</label>
                                <textarea
                                    className="form-textarea"
                                    placeholder="e.g., For employment application, Graduate school, etc."
                                    value={formData.reason}
                                    onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
                                />
                            </div>

                            {/* File Upload - Only for non-appointment requests */}
                            {!selectedType?.requiresAppointment && (
                                <div className="form-group">
                                    <label className="form-label">Upload Required Documents</label>
                                    <div
                                        className={`upload-area-new ${dragActive ? 'drag-active' : ''} ${files.length > 0 ? 'has-files' : ''}`}
                                        onDragEnter={handleDrag}
                                        onDragLeave={handleDrag}
                                        onDragOver={handleDrag}
                                        onDrop={handleDrop}
                                    >
                                        <input
                                            type="file"
                                            id="file-upload"
                                            multiple
                                            accept=".pdf,.jpg,.jpeg,.png"
                                            onChange={handleFileChange}
                                            style={{ display: 'none' }}
                                        />
                                        <label htmlFor="file-upload" className="upload-label">
                                            <div className="upload-icon">
                                                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                                                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                                                    <polyline points="17 8 12 3 7 8" />
                                                    <line x1="12" y1="3" x2="12" y2="15" />
                                                </svg>
                                            </div>
                                            <div className="upload-text">Drag and drop files here or click to browse</div>
                                            <div className="upload-hint">Supported Formats: PDF, JPG, PNG (Max 5MB each)</div>
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

                            <div className="form-actions">
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
