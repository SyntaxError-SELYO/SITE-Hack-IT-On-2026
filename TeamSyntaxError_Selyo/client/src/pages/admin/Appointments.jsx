import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import Sidebar from '../../components/Sidebar'
import api from '../../services/api'
import './Admin.css'

function Appointments() {
    const [appointments, setAppointments] = useState([])
    const [loading, setLoading] = useState(true)
    const [filter, setFilter] = useState('all')
    const [selectedDate, setSelectedDate] = useState('')
    const [sidebarOpen, setSidebarOpen] = useState(false)

    // Edit State
    const [editing, setEditing] = useState(null)
    const [editDate, setEditDate] = useState('')
    const [editTime, setEditTime] = useState('')
    const [availableSlots, setAvailableSlots] = useState([])
    const [slotsLoading, setSlotsLoading] = useState(false)

    useEffect(() => {
        if (editDate) {
            fetchAvailableSlots()
        }
    }, [editDate])

    useEffect(() => {
        fetchAppointments()
    }, [selectedDate])

    const fetchAppointments = async () => {
        try {
            let url = '/admin/appointments'
            if (selectedDate) {
                url += `?date=${selectedDate}`
            }
            const response = await api.get(url)
            setAppointments(response.data.appointments || [])
        } catch (err) {
            console.error('Failed to fetch appointments:', err)
        } finally {
            setLoading(false)
        }
    }

    const fetchAvailableSlots = async () => {
        setSlotsLoading(true)
        try {
            const response = await api.get(`/admin/slots?date=${editDate}`)
            setAvailableSlots(response.data.availableSlots || [])
        } catch (err) {
            console.error('Failed to fetch slots:', err)
        } finally {
            setSlotsLoading(false)
        }
    }

    const startEdit = (apt) => {
        setEditing(apt)
        setEditDate(new Date(apt.date).toISOString().split('T')[0])
        setEditTime(apt.timeSlot)
    }

    const cancelEdit = () => {
        setEditing(null)
        setEditDate('')
        setEditTime('')
        setAvailableSlots([])
    }

    const handleSaveEdit = async () => {
        if (!editDate || !editTime) return

        try {
            await api.put(`/admin/appointments/${editing._id}`, {
                date: editDate,
                timeSlot: editTime
            })
            setEditing(null)
            fetchAppointments()
        } catch (err) {
            console.error('Failed to update appointment:', err)
            alert('Failed to update appointment')
        }
    }

    const updateAppointmentStatus = async (id, status) => {
        try {
            await api.put(`/admin/appointments/${id}`, { status })
            fetchAppointments()
        } catch (err) {
            console.error('Failed to update appointment:', err)
        }
    }

    const filteredAppointments = filter === 'all'
        ? appointments
        : appointments.filter(a => a.status === filter)

    const getStatusClass = (status) => {
        if (status === 'Completed') return 'approved'
        if (status === 'No-Show' || status === 'Cancelled') return 'rejected'
        return 'pending'
    }

    const formatDate = (dateStr) => {
        return new Date(dateStr).toLocaleDateString('en-PH', {
            weekday: 'short',
            month: 'short',
            day: 'numeric'
        })
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
                        <h1>Appointments</h1>
                        <p className="text-muted">Manage scheduled visits</p>
                    </div>
                    <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                        <input
                            type="date"
                            className="form-input"
                            value={selectedDate}
                            onChange={(e) => setSelectedDate(e.target.value)}
                            style={{ width: 'auto' }}
                        />
                        {selectedDate && (
                            <button className="btn outline" onClick={() => setSelectedDate('')}>
                                Clear
                            </button>
                        )}
                    </div>
                </div>

                <div className="panel">
                    <div className="panel-head">
                        <h2>
                            {selectedDate ? `Appointments for ${formatDate(selectedDate)}` : 'All Appointments'}
                        </h2>
                        <div className="tab-group">
                            {['all', 'Scheduled', 'Completed', 'No-Show'].map(f => (
                                <button
                                    key={f}
                                    className={`tab ${filter === f ? 'active' : ''}`}
                                    onClick={() => setFilter(f)}
                                >
                                    {f === 'all' ? 'All' : f}
                                </button>
                            ))}
                        </div>
                    </div>
                    <div className="panel-body" style={{ padding: 0 }}>
                        {loading ? (
                            <p className="text-center text-muted" style={{ padding: '32px' }}>Loading...</p>
                        ) : filteredAppointments.length === 0 ? (
                            <p className="text-center text-muted" style={{ padding: '32px' }}>No appointments found</p>
                        ) : (
                            <div className="table-wrap">
                                <table className="data-table">
                                    <thead>
                                        <tr>
                                            <th>Date</th>
                                            <th>Time</th>
                                            <th>Student</th>
                                            <th>Purpose</th>
                                            <th>Status</th>
                                            <th>Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {filteredAppointments.map(apt => (
                                            <tr key={apt._id}>
                                                <td>{formatDate(apt.date)}</td>
                                                <td>{apt.timeSlot}</td>
                                                <td>
                                                    <div className="cell-stack">
                                                        <strong>{apt.student?.name || 'N/A'}</strong>
                                                        <span className="text-muted text-sm">{apt.student?.studentId}</span>
                                                    </div>
                                                </td>
                                                <td>{apt.purpose}</td>
                                                <td>
                                                    <span className={`badge ${getStatusClass(apt.status)}`}>
                                                        {apt.status}
                                                    </span>
                                                </td>
                                                <td>
                                                    {apt.status === 'Scheduled' && (
                                                        <div style={{ display: 'flex', gap: '8px' }}>
                                                            <button
                                                                className="btn-sm success"
                                                                onClick={() => updateAppointmentStatus(apt._id, 'Completed')}
                                                            >
                                                                Complete
                                                            </button>
                                                            <button
                                                                className="btn-sm danger"
                                                                onClick={() => updateAppointmentStatus(apt._id, 'No-Show')}
                                                            >
                                                                No-Show
                                                            </button>
                                                            <button
                                                                className="btn-sm outline"
                                                                onClick={() => startEdit(apt)}
                                                            >
                                                                Edit
                                                            </button>
                                                        </div>
                                                    )}
                                                    {apt.status !== 'Scheduled' && (
                                                        <Link to={`/admin/request/${apt.request}`} className="btn-link">
                                                            View Request
                                                        </Link>
                                                    )}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                </div>
            </main>
            {/* Edit Modal */}
            {editing && (
                <div className="modal-overlay">
                    <div className="modal">
                        <div className="modal-head">
                            <h3>Edit Appointment</h3>
                            <button className="btn-icon" onClick={cancelEdit}>×</button>
                        </div>
                        <div className="modal-body">
                            <div className="form-group">
                                <label className="form-label">Date</label>
                                <input
                                    type="date"
                                    className="form-input"
                                    value={editDate}
                                    onChange={(e) => setEditDate(e.target.value)}
                                    min={new Date().toISOString().split('T')[0]}
                                />
                            </div>
                            {editDate && (
                                <div className="form-group">
                                    <label className="form-label">Time Slot</label>
                                    {slotsLoading ? (
                                        <p className="text-muted">Loading slots...</p>
                                    ) : (
                                        <div className="slot-grid">
                                            {availableSlots.map(slot => (
                                                <button
                                                    key={slot}
                                                    type="button"
                                                    className={`slot-btn ${editTime === slot ? 'selected' : ''}`}
                                                    onClick={() => setEditTime(slot)}
                                                >
                                                    {slot}
                                                </button>
                                            ))}
                                            {/* Ensure current slot is selectable if unchanged date */}
                                            {(!availableSlots.includes(editing.timeSlot) && editDate === new Date(editing.date).toISOString().split('T')[0]) && (
                                                <button
                                                    type="button"
                                                    className={`slot-btn ${editTime === editing.timeSlot ? 'selected' : ''}`}
                                                    onClick={() => setEditTime(editing.timeSlot)}
                                                >
                                                    {editing.timeSlot}
                                                </button>
                                            )}
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                        <div className="modal-foot">
                            <button className="btn outline" onClick={cancelEdit}>Cancel</button>
                            <button className="btn primary" onClick={handleSaveEdit}>Save Changes</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

export default Appointments
