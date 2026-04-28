import { useParams, useNavigate, Link } from 'react-router-dom'
import { useEvents } from '../context/AppContext'
import './EventDetails.css'

export default function EventDetails() {
  const { id } = useParams()
  const { events, toggleStatus, deleteEvent } = useEvents()
  const navigate = useNavigate()

  const event = events.find(e => e.id === id)

  if (!event) {
    return (
      <div className="container">
        <div className="empty-state" style={{ paddingTop: 80 }}>
          <div className="icon">❓</div>
          <h3>Event not found</h3>
          <p>This event may have been deleted or the ID is invalid.</p>
          <Link to="/events" className="btn btn-primary" style={{ marginTop: 20 }}>Back to Events</Link>
        </div>
      </div>
    )
  }

  const handleDelete = () => {
    if (confirm(`Delete "${event.title}"?`)) {
      deleteEvent(event.id)
      navigate('/events')
    }
  }

  const colorMap  = { Sports: 'green', Academic: 'indigo', Social: 'amber' }
  const badgeColor = colorMap[event.category] || 'indigo'

  return (
    <div className="container">
      <div className="breadcrumb">
        <Link to="/events" className="crumb">Events</Link>
        <span className="crumb-sep">›</span>
        <span className="crumb-current">{event.title}</span>
      </div>

      <div className="details-layout fade-up">
        {/* ── Main panel ── */}
        <div className="details-main card">
          <div className="details-header">
            <div className="details-badges">
              <span className={`badge badge-${badgeColor}`}>{event.category}</span>
              <span className={`badge ${event.status === 'active' ? 'badge-green' : 'badge-amber'}`}>
                {event.status === 'active' ? '● Active' : '✓ Done'}
              </span>
            </div>
            <h1 className="details-title">{event.title}</h1>
            <p className="details-desc">{event.description}</p>
          </div>

          <div className="details-divider" />

          <div className="details-meta-grid">
            <div className="meta-item">
              <span className="meta-label">Event ID</span>
              <code className="meta-value-code">{event.id}</code>
            </div>
            <div className="meta-item">
              <span className="meta-label">Date</span>
              <span className="meta-value">{formatDate(event.date)}</span>
            </div>
            <div className="meta-item">
              <span className="meta-label">Location</span>
              <span className="meta-value">{event.location}</span>
            </div>
            <div className="meta-item">
              <span className="meta-label">Category</span>
              <span className="meta-value">{event.category}</span>
            </div>
          </div>
        </div>

        {/* ── Sidebar actions ── */}
        <div className="details-sidebar">
          <div className="card sidebar-card">
            <h3 className="sidebar-label">Actions</h3>
            <div className="sidebar-actions">
              <button
                className={`btn btn-outline sidebar-btn`}
                onClick={() => toggleStatus(event.id)}
              >
                {event.status === 'active' ? '✓  Mark as Done' : '↩  Mark as Active'}
              </button>
              <button className="btn btn-danger sidebar-btn" onClick={handleDelete}>
                🗑  Delete Event
              </button>
              <Link to="/events" className="btn btn-ghost sidebar-btn">← Back to list</Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function formatDate(d) {
  return new Date(d).toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })
}
