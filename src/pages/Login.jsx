import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../context/AppContext'
import './Login.css'

export default function Login() {
  const { login } = useAuth()
  const navigate  = useNavigate()
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError]       = useState('')
  const [loading, setLoading]   = useState(false)

  const handleLogin = () => {
    if (!username || !password) {
      setError('Please fill in all fields.')
      return
    }

    if (username !== 'admin' || password !== 'admin123') {
      setError('Incorrect username or password.')
      return
    }

    setLoading(true)
    setTimeout(() => {
      login()
      navigate('/dashboard')
    }, 500)
  }

  const fillDemo = () => {
    setUsername('admin')
    setPassword('admin123')
    setError('')
  }

  return (
    <div className="login-page">
      <div className="login-card card fade-up">
        <div className="login-header">
          <div className="login-logo">◈</div>
          <h1>Welcome back</h1>
          <p>Sign in to access your Dashboard</p>
        </div>

        <div className="demo-box">
          <div className="demo-label">Demo Account</div>
          <div className="demo-row">
            <span className="demo-field">Username</span>
            <code className="demo-val">admin</code>
          </div>
          <div className="demo-row">
            <span className="demo-field">Password</span>
            <code className="demo-val">admin123</code>
          </div>
          <button className="demo-fill-btn" onClick={fillDemo}>
            ⚡ Fill credentials
          </button>
        </div>

        <div className="login-form">
          {error && <div className="login-error">⚠️ {error}</div>}

          <div className="form-group">
            <label>Username</label>
            <input
              className="input"
              placeholder="Enter username"
              value={username}
              onChange={e => {
                setUsername(e.target.value)
                setError('')
              }}
              onKeyDown={e => e.key === 'Enter' && handleLogin()}
              autoComplete="username"
            />
          </div>

          <div className="form-group">
            <label>Password</label>
            <input
              className="input"
              type="password"
              placeholder="Enter password"
              value={password}
              onChange={e => {
                setPassword(e.target.value)
                setError('')
              }}
              onKeyDown={e => e.key === 'Enter' && handleLogin()}
              autoComplete="current-password"
            />
          </div>

          <button
            className="btn btn-primary login-btn"
            onClick={handleLogin}
            disabled={loading}
          >
            {loading ? 'Signing in…' : 'Login'}
          </button>

          <div className="login-footer">
            <Link to="/" className="btn btn-ghost" style={{ fontSize: '13px' }}>
              ← Back to Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}