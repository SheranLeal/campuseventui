import { Outlet } from 'react-router-dom'
import Navbar from './Navbar'

export default function Layout() {
  return (
    <>
      <Navbar />
      <main>
        <Outlet />
      </main>
      <footer style={{
        borderTop: '1px solid var(--border)',
        padding: '28px 0',
        marginTop: '40px',
        textAlign: 'center',
        color: 'var(--text-4)',
        fontSize: '13px',
        background: 'var(--bg-card)'
      }}>
        © 2026 CampusEventUI &nbsp;·&nbsp; Ilocos Sur Polytechnic State College &nbsp;·&nbsp; Prof Elective 3 Final Lab Exam
      </footer>
    </>
  )
}
