import { createContext, useContext, useReducer, useState, useEffect } from 'react'

const AuthContext   = createContext(null)
const ThemeContext  = createContext(null)
const EventsContext = createContext(null)

const initialEvents = [
  { id: 'e1', title: 'Intramurals Opening Ceremony', category: 'Sports',    status: 'active', date: '2026-05-10', location: 'Main Gymnasium',  description: 'Annual intramural sports opening with a grand parade of athletes from all departments. Features exciting competitions in basketball, volleyball, swimming, and track and field.' },
  { id: 'e2', title: 'ICTC Tech Summit 2026',        category: 'Academic',  status: 'active', date: '2026-05-14', location: 'AVR Building',     description: 'Technology conference featuring cutting-edge student research presentations, industry speaker panels, and hands-on workshops covering AI, web development, and cybersecurity.' },
  { id: 'e3', title: 'Freshmen Orientation Night',   category: 'Social',    status: 'done',   date: '2026-04-08', location: 'Open Grounds',     description: 'A warm welcome event for all incoming first-year students. Get to know your professors, explore campus facilities, and meet fellow students over food, games, and live performances.' },
  { id: 'e4', title: 'Research Colloquium 2026',     category: 'Academic',  status: 'active', date: '2026-05-20', location: 'Conference Hall',  description: 'Annual gathering of faculty and student researchers presenting thesis and capstone projects across all colleges. Open to all ISPSC students and faculty members.' },
  { id: 'e5', title: 'Foundation Day Celebration',   category: 'Social',    status: 'active', date: '2026-06-01', location: 'Campus Grounds',   description: "ISPSC's annual founding anniversary celebration featuring cultural shows, alumni homecoming, academic exhibitions, and a grand evening program." },
  { id: 'e6', title: 'Basketball Elimination Round', category: 'Sports',    status: 'done',   date: '2026-04-15', location: 'Covered Court',    description: 'Inter-departmental basketball elimination rounds to determine the top 8 teams advancing to the quarterfinals of the Intramural Games 2026.' },
]

function eventsReducer(state, action) {
  switch (action.type) {
    case 'ADD_EVENT':    return [{ ...action.payload, id: `e${Date.now()}`, status: 'active' }, ...state]
    case 'DELETE_EVENT': return state.filter(e => e.id !== action.id)
    case 'TOGGLE_STATUS':return state.map(e => e.id === action.id ? { ...e, status: e.status === 'active' ? 'done' : 'active' } : e)
    default:             return state
  }
}

export const DEMO_CREDENTIALS = { username: 'student2026', password: 'ispsc123' }

export function AppProvider({ children }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [events, dispatch] = useReducer(eventsReducer, initialEvents)
  const [dark, setDark] = useState(() => {
    const saved = localStorage.getItem('theme')
    return saved ? saved === 'dark' : window.matchMedia('(prefers-color-scheme: dark)').matches
  })

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', dark ? 'dark' : 'light')
    localStorage.setItem('theme', dark ? 'dark' : 'light')
  }, [dark])

  return (
    <ThemeContext.Provider value={{ dark, setDark }}>
      <AuthContext.Provider value={{ isLoggedIn, login: () => setIsLoggedIn(true), logout: () => setIsLoggedIn(false) }}>
        <EventsContext.Provider value={{
          events,
          addEvent:     (p) => dispatch({ type: 'ADD_EVENT',     payload: p }),
          deleteEvent:  (id) => dispatch({ type: 'DELETE_EVENT',  id }),
          toggleStatus: (id) => dispatch({ type: 'TOGGLE_STATUS', id }),
        }}>
          {children}
        </EventsContext.Provider>
      </AuthContext.Provider>
    </ThemeContext.Provider>
  )
}

export const useAuth   = () => useContext(AuthContext)
export const useEvents = () => useContext(EventsContext)
export const useTheme  = () => useContext(ThemeContext)
