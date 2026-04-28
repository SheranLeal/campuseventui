import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useEvents } from '../context/AppContext'
import './Events.css'

const CATEGORIES = ['All', 'Sports', 'Academic', 'Social']

// ── English campus announcement templates mapped to post IDs ─────────────────
const ANNOUNCEMENT_MAP = {
  1:  { title: 'Library Extended Hours During Finals Week',             body: 'The ISPSC library will be open from 7:00 AM to 9:00 PM starting April 28 through May 10 to support students preparing for their final examinations. Please bring your valid school ID.',                    tag: 'Library',     icon: '📚' },
  2:  { title: 'Scholarship Application Now Open for A.Y. 2026–2027',   body: 'Qualified students may now apply for the State Scholarship Program. Requirements include a GPA of 1.75 or higher and a certificate of good moral character. Deadline is May 15, 2026.',                   tag: 'Financial Aid', icon: '🎓' },
  3:  { title: 'Campus Clean-Up Drive – All Students Required to Join',  body: 'In line with the national Linis Pilipinas campaign, all students are required to participate in the campus clean-up drive on May 3, 2026. Attendance will be recorded by your respective departments.',  tag: 'Campus Life',  icon: '🌿' },
  4:  { title: 'Enrollment Schedule for First Semester 2026–2027',      body: 'Online enrollment for the incoming first semester will begin on June 1, 2026. Students must settle all outstanding balances before proceeding. Contact the Registrar\'s Office for concerns.',         tag: 'Enrollment',   icon: '📋' },
  5:  { title: 'Online Thesis Defense Schedule Released',               body: 'The official schedule for fourth-year thesis defenses has been posted on the College bulletin board and the official ISPSC Facebook page. Presenters must submit their final manuscripts by April 30.',     tag: 'Academic',     icon: '🔬' },
  6:  { title: 'Computer Laboratory Rules and Usage Reminder',          body: 'Students are reminded that food and drinks are strictly prohibited inside all computer laboratories. Lab hours are from 8:00 AM to 5:00 PM on weekdays. Reservations must be filed at least one day ahead.', tag: 'Facilities',   icon: '💻' },
  7:  { title: 'Campus Shuttle Service Schedule Update',                body: 'Effective May 1, 2026, the campus shuttle will have revised departure times: 6:30 AM, 12:00 NN, and 5:00 PM. Students are advised to coordinate with their class schedules accordingly.',                  tag: 'Transport',    icon: '🚌' },
  8:  { title: 'Medical Mission and Free Check-Up for Students',        body: 'The ISPSC Health Services Office will conduct a free medical and dental mission on May 7, 2026 at the gymnasium lobby. All students, faculty, and staff are welcome to avail of the free services.',      tag: 'Health',       icon: '🏥' },
  9:  { title: 'Student Council Election Results – A.Y. 2026–2027',    body: 'Congratulations to the newly elected Supreme Student Council officers. The official list of winners has been posted at the SSC bulletin board and will be announced during the next assembly.',            tag: 'Student Gov', icon: '🗳️' },
  10: { title: 'Semestral Break Schedule Announced',                    body: 'Classes will be suspended from May 16 to May 24, 2026 for the semestral break. Students are encouraged to use this period to rest, review, and prepare for the upcoming semester.',                        tag: 'Schedule',     icon: '📅' },
}

function transformPost(post) {
  const map = ANNOUNCEMENT_MAP[post.id]
  if (map) return { ...post, ...map }
  return {
    ...post,
    title: `Campus Notice #${post.id}`,
    body:  'Please check the official ISPSC bulletin board or the registrar\'s office for more details regarding this announcement.',
    tag:   'General',
    icon:  '📢',
  }
}

export default function Events() {
  const { events } = useEvents()

  // ── API data (Step 8) ──────────────────────────────────────────────────────
  const [apiPosts, setApiPosts]         = useState([])
  const [loading, setLoading]           = useState(true)
  const [error, setError]               = useState(null)
  const [lastUpdated, setLastUpdated]   = useState(null)   // Step 10 – Option B
  const [justUpdated, setJustUpdated]   = useState(false)  // Step 10 – Option C

  const fetchPosts = async () => {
    try {
      const res = await fetch('https://jsonplaceholder.typicode.com/posts?_limit=10')
      if (!res.ok) throw new Error(`HTTP ${res.status}`)
      const raw = await res.json()
      setApiPosts(raw.map(transformPost))
      setLastUpdated(new Date())
      setJustUpdated(true)
      setError(null)
      setTimeout(() => setJustUpdated(false), 3000)
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchPosts()
    // Step 10 – Option A: auto-refresh every 30 seconds
    const interval = setInterval(fetchPosts, 30_000)
    return () => clearInterval(interval)
  }, [])

  // ── Search & filter (Step 13) ──────────────────────────────────────────────
  const [search, setSearch]       = useState('')
  const [activeTab, setActiveTab] = useState('local')
  const [category, setCategory]   = useState('All')

  const filtered = events.filter(e => {
    const matchCat    = category === 'All' || e.category === category
    const matchSearch = e.title.toLowerCase().includes(search.toLowerCase()) ||
                        e.description.toLowerCase().includes(search.toLowerCase())
    return matchCat && matchSearch
  })

  return (
    <div className="container">
      <div className="page-header">
        <h1>Campus Events</h1>
        <p>Discover everything happening across ISPSC this semester</p>
      </div>

      {/* ── Tabs ── */}
      <div className="tab-bar">
        <button
          className={`tab-btn${activeTab === 'local' ? ' tab-active' : ''}`}
          onClick={() => setActiveTab('local')}
        >
          🗓️ Campus Events <span className="tab-count">{events.length}</span>
        </button>
        <button
          className={`tab-btn${activeTab === 'api' ? ' tab-active' : ''}`}
          onClick={() => setActiveTab('api')}
        >
          📢 Announcements <span className="tab-count">{apiPosts.length}</span>
        </button>
      </div>

      {/* ── Campus Events tab ── */}
      {activeTab === 'local' && (
        <>
          <div className="filter-bar">
            <input
              className="input search-input"
              placeholder="🔍  Search events…"
              value={search}
              onChange={e => setSearch(e.target.value)}
            />
            <div className="category-pills">
              {CATEGORIES.map(c => (
                <button
                  key={c}
                  className={`pill${category === c ? ' pill-active' : ''}`}
                  onClick={() => setCategory(c)}
                >{c}</button>
              ))}
            </div>
          </div>

          {filtered.length === 0 ? (
            <div className="empty-state">
              <div className="icon">🎯</div>
              <h3>No events found</h3>
              <p>Try adjusting your search or category filter.</p>
            </div>
          ) : (
            <div className="events-grid fade-up">
              {filtered.map(event => (
                <EventCard key={event.id} event={event} />
              ))}
            </div>
          )}
        </>
      )}

      {/* ── Announcements tab (API data) ── */}
      {activeTab === 'api' && (
        <div className="api-section fade-up">

          {/* Step 10 – Option B + C: Last updated + flash message */}
          <div className="api-meta-row">
            {lastUpdated && (
              <span className="last-updated">
                🔄 Last updated: {lastUpdated.toLocaleTimeString()} · auto-refreshes every 30s
              </span>
            )}
            {justUpdated && (
              <span className="data-updated-badge">✓ Data Updated</span>
            )}
            <button className="btn btn-outline refresh-btn" onClick={fetchPosts}>Refresh</button>
          </div>

          {/* Step 8 – Loading state */}
          {loading && (
            <div className="loading-state">
              <div className="spinner" />
              <p className="loading-text">Loading announcements…</p>
            </div>
          )}

          {/* Step 8 – Error state */}
          {error && !loading && (
            <div className="error-box card">
              <span className="error-icon">⚠️</span>
              <div>
                <strong>Failed to load announcements</strong>
                <p>{error}</p>
              </div>
              <button className="btn btn-outline" onClick={fetchPosts}>Retry</button>
            </div>
          )}

          {/* Step 8 – Data display */}
          {!loading && !error && (
            <div className="api-grid">
              {apiPosts.map(post => (
                <div key={post.id} className="api-card card">
                  <div className="api-card-top">
                    <span className="api-icon">{post.icon}</span>
                    <span className="badge badge-indigo">{post.tag}</span>
                  </div>
                  <h3 className="api-title">{post.title}</h3>
                  <p className="api-body">{post.body}</p>
                  <div className="api-card-footer">
                    <span className="api-ref">Ref #{String(post.id).padStart(4, '0')}</span>
                    <span className="api-date">Posted: A.Y. 2025–2026</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}

function EventCard({ event }) {
  const colorMap = { Sports: 'green', Academic: 'indigo', Social: 'amber' }
  const color = colorMap[event.category] || 'indigo'
  return (
    <Link to={`/events/${event.id}`} className="event-card card">
      <div className="event-card-top">
        <span className={`badge badge-${color}`}>{event.category}</span>
        <span className={`status-dot${event.status === 'done' ? ' done' : ''}`}>
          {event.status === 'active' ? '● Active' : '✓ Done'}
        </span>
      </div>
      <h3 className="event-card-title">{event.title}</h3>
      <p className="event-card-desc">{event.description}</p>
      <div className="event-card-meta">
        <span>📅 {formatDate(event.date)}</span>
        <span>📍 {event.location}</span>
      </div>
    </Link>
  )
}

function formatDate(d) {
  return new Date(d).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}
