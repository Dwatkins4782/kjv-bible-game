import { Navigate } from 'react-router-dom'
import { useAuth } from '../../hooks/useAuth'

export default function AuthGuard({ children }) {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div className="text-center" style={{ padding: '60px 20px' }}>
        <div style={{ fontSize: '2rem', marginBottom: '12px' }}>Loading...</div>
        <p className="text-muted">Checking authentication...</p>
      </div>
    )
  }

  if (!user) {
    return <Navigate to="/login" replace />
  }

  return children
}
