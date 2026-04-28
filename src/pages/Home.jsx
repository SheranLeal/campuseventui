import { Link } from 'react-router-dom'
import { useEvents } from '../context/AppContext'
import './Home.css'

const FEATURES = [
  { icon: '🗓️', title: 'Stay Informed', desc: 'Get real-time updates on all academic, sports, and social events happening on campus.' },
  { icon: '🏆', title: 'Join & Compete', desc: 'Register for intramurals, competitions, and contests representing your department.' },
  { icon: '🤝', title: 'Connect & Grow', desc: 'Network with fellow students, faculty, and alumni at every campus event.' },
]

export default function Home() {
  const { events } = useEvents()
  const active = events.filter(e => e.status === 'active').length
  const done   = events.filter(e => e.status === 'done').length

  return (
    <div className="home">

      {/* ── Hero ── */}
      <section className="hero">
        <div className="container hero-inner">
          <div className="hero-content fade-up">
            <div className="badge badge-indigo hero-tag">ISPSC · A.Y. 2025–2026</div>
            <h1 className="hero-title">
              ISPSC Tagudin<br />
              <span className="hero-accent">Campus Events</span>
            </h1>
            <p className="hero-subtitle">
              Ilocos Sur Polytechnic State College's official event hub. Browse upcoming activities,
              track results, and stay connected with everything happening on campus — all in one place.
            </p>
            <div className="hero-actions">
              <Link to="/events"    className="btn btn-primary hero-btn-primary">Explore Events →</Link>
              <Link to="/dashboard" className="btn hero-btn-ghost">Go to Dashboard</Link>
            </div>
            <div className="hero-stats">
              <div className="h-stat"><strong>{events.length}</strong><span>Total Events</span></div>
              <div className="h-stat-sep" />
              <div className="h-stat"><strong>{active}</strong><span>Active Now</span></div>
              <div className="h-stat-sep" />
              <div className="h-stat"><strong>{done}</strong><span>Completed</span></div>
            </div>
          </div>
          <div className="hero-visual fade-up" style={{ animationDelay:'100ms' }}>
            <div className="hero-card-stack">
              {events.slice(0, 3).map((e, i) => (
                <Link to={`/events/${e.id}`} key={e.id} className={`hero-ev-card card hero-ev-${i}`}>
                  <span className={`badge badge-${catColor(e.category)}`}>{e.category}</span>
                  <p className="hec-title">{e.title}</p>
                  <p className="hec-loc">📍 {e.location}</p>
                </Link>
              ))}
            </div>
          </div>
        </div>
        <div className="hero-orbs" aria-hidden="true">
          <div className="orb o1" /><div className="orb o2" /><div className="orb o3" />
        </div>
      </section>

      {/* ── Features ── */}
      <section className="features-section">
        <div className="container">
          <div className="features-grid">
            {FEATURES.map(f => (
              <div key={f.title} className="feature-card card fade-up">
                <div className="feature-icon">{f.icon}</div>
                <h3 className="feature-title">{f.title}</h3>
                <p className="feature-desc">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Upcoming events ── */}
      <section className="section">
        <div className="container">
          <div className="section-head">
            <div>
              <h2 className="section-title">Upcoming Events</h2>
              <p className="section-sub">Don't miss what's happening this semester</p>
            </div>
            <Link to="/events" className="btn btn-outline">View all →</Link>
          </div>
          <div className="preview-grid">
            {events.filter(e => e.status === 'active').map((event, i) => (
              <Link to={`/events/${event.id}`} key={event.id} className="preview-card card fade-up" style={{ animationDelay: `${i * 60}ms` }}>
                <div className="preview-top">
                  <span className={`badge badge-${catColor(event.category)}`}>{event.category}</span>
                  <span className="preview-date">{formatDate(event.date)}</span>
                </div>
                <h3 className="preview-title">{event.title}</h3>
                <p className="preview-desc">{event.description}</p>
                <p className="preview-location">📍 {event.location}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA Banner ── */}
      <section className="cta-section">
        <div className="container">
          <div className="cta-card card">
            <div className="cta-content">
              <h2>Ready to manage campus events?</h2>
              <p>Login to the Dashboard to add, track, and manage all events in real time.</p>
            </div>
            <Link to="/login" className="btn btn-primary cta-btn">Get Started →</Link>
          </div>
        </div>
      </section>

    </div>
  )
}

function catColor(cat) {
  return { Sports: 'green', Academic: 'indigo', Social: 'amber' }[cat] || 'indigo'
}
function formatDate(d) {
  return new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}
