import { useState } from 'react'
import { useEvents, useAuth } from '../context/AppContext'
import { Link } from 'react-router-dom'
import './Dashboard.css'

const CATEGORIES = ['Sports', 'Academic', 'Social']

export default function Dashboard() {
  const { events, addEvent, deleteEvent, toggleStatus } = useEvents()
  const { logout } = useAuth()

  const [form, setForm]     = useState({ title: '', category: 'Academic', date: '', location: '', description: '' })
  const [showForm, setShowForm] = useState(false)
  const [added, setAdded]   = useState(false)

  const active = events.filter(e => e.status === 'active').length
  const done   = events.filter(e => e.status === 'done').length

  const handleChange = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }))

  const handleAdd = () => {
    if (!form.title || !form.date) return
    addEvent(form)
    setForm({ title: '', category: 'Academic', date: '', location: '', description: '' })
    setShowForm(false)
    setAdded(true)
    setTimeout(() => setAdded(false), 3000)
  }

  return (
    <div className="container">
      <div className="page-header db-header">
        <div>
          <div className="badge badge-indigo" style={{ marginBottom: 10 }}>Protected Page</div>
          <h1>Dashboard</h1>
          <p>Manage all campus events in one place</p>
        </div>
        <div className="db-header-actions">
          <button className="btn btn-primary" onClick={() => setShowForm(v => !v)}>
            {showForm ? '✕ Cancel' : '+ Add Event'}
          </button>
        </div>
      </div>

      {/* ── Stats strip ── */}
      <div className="db-stats fade-up">
        <div className="db-stat card">
          <span className="db-stat-num">{events.length}</span>
          <span className="db-stat-label">Total Events</span>
        </div>
        <div className="db-stat card">
          <span className="db-stat-num" style={{ color: 'var(--green)' }}>{active}</span>
          <span className="db-stat-label">Active</span>
        </div>
        <div className="db-stat card">
          <span className="db-stat-num" style={{ color: 'var(--slate)' }}>{done}</span>
          <span className="db-stat-label">Completed</span>
        </div>
      </div>

      {/* ── Toast notification ── */}
      {added && (
        <div className="toast fade-up">✓ Event added successfully!</div>
      )}

      {/* ── Add Event form ── */}
      {showForm && (
        <div className="add-form card fade-up">
          <h2 className="form-title">New Event</h2>
          <div className="form-grid">
            <div className="form-group span-2">
              <label>Event Title *</label>
              <input name="title" className="input" placeholder="e.g. ICTC Symposium 2026" value={form.title} onChange={handleChange} />
            </div>
            <div className="form-group">
              <label>Category</label>
              <select name="category" className="input" value={form.category} onChange={handleChange}>
                {CATEGORIES.map(c => <option key={c}>{c}</option>)}
              </select>
            </div>
            <div className="form-group">
              <label>Date *</label>
              <input name="date" type="date" className="input" value={form.date} onChange={handleChange} />
            </div>
            <div className="form-group span-2">
              <label>Location</label>
              <input name="location" className="input" placeholder="e.g. Main Gymnasium" value={form.location} onChange={handleChange} />
            </div>
            <div className="form-group span-2">
              <label>Description</label>
              <textarea name="description" className="input" rows={3} placeholder="Short event description…" value={form.description} onChange={handleChange} style={{ resize: 'vertical' }} />
            </div>
          </div>
          <div className="form-actions">
            <button className="btn btn-primary" onClick={handleAdd} disabled={!form.title || !form.date}>Save Event</button>
            <button className="btn btn-ghost" onClick={() => setShowForm(false)}>Cancel</button>
          </div>
        </div>
      )}

      {/* ── Events table ── */}
      <div className="db-table-wrap card fade-up">
        <table className="db-table">
          <thead>
            <tr>
              <th>Event</th>
              <th>Category</th>
              <th>Date</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {events.length === 0 && (
              <tr><td colSpan={5} style={{ textAlign: 'center', padding: '32px', color: 'var(--slate-400)' }}>No events yet.</td></tr>
            )}
            {events.map(event => (
              <tr key={event.id}>
                <td>
                  <Link to={`/events/${event.id}`} className="table-event-link">
                    <span className="table-event-title">{event.title}</span>
                    <span className="table-event-loc">{event.location}</span>
                  </Link>
                </td>
                <td>
                  <span className={`badge badge-${catColor(event.category)}`}>{event.category}</span>
                </td>
                <td className="table-date">{formatDate(event.date)}</td>
                <td>
                  <span className={`status-pill ${event.status === 'active' ? 'status-active' : 'status-done'}`}>
                    {event.status === 'active' ? 'Active' : 'Done'}
                  </span>
                </td>
                <td>
                  <div className="row-actions">
                    <button className="btn btn-ghost row-btn" title="Toggle status" onClick={() => toggleStatus(event.id)}>
                      {event.status === 'active' ? '✓' : '↩'}
                    </button>
                    <button className="btn btn-ghost row-btn danger" title="Delete" onClick={() => deleteEvent(event.id)}>🗑</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}

function catColor(cat) {
  return { Sports: 'green', Academic: 'indigo', Social: 'amber' }[cat] || 'indigo'
}
function formatDate(d) {
  return new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}
