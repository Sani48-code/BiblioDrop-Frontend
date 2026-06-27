import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'
import LoadingSpinner from './LoadingSpinner'

export default function PrivateRoute({ children, role }) {
  const { user, loading } = useAuth()
  const location = useLocation()

  if (loading) return <LoadingSpinner />
  if (!user) return <Navigate to="/login" state={{ from: location }} replace />
  if (role && user.role !== role) return <Navigate to="/" replace />
  return children
}
