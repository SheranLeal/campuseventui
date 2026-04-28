import { Navigate } from 'react-router-dom'
import { useAuth } from '../context/AppContext'

export default function ProtectedRoute({ children }) {
  const { isLoggedIn } = useAuth()
  return isLoggedIn ? children : <Navigate to="/login" replace />
}
