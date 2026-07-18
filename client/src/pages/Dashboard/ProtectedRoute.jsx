// src/components/layout/ProtectedRoute.jsx
import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

export default function ProtectedRoute({ children }) {
  const { user } = useAuth()
  const location = useLocation()

  // Not logged in → send to login, remember where they wanted to go
  if (!user) {
    return <Navigate to="/login" replace state={{ from: location }} />
  }

  // Logged in but not a vendor → dashboard is vendor-only
  if (user.role !== 'vendor') {
    return <Navigate to="/" replace />
  }

  return children
}