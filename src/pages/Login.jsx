import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'

export default function Login() {
  const { signIn, signUp, signInWithGoogle, user } = useAuth()
  const navigate = useNavigate()
  const [isSignUp, setIsSignUp] = useState(false)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [displayName, setDisplayName] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  // If already logged in, redirect
  if (user) {
    navigate('/')
    return null
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setError('')
    setLoading(true)
    try {
      if (isSignUp) {
        await signUp(email, password, displayName)
      } else {
        await signIn(email, password)
      }
      navigate('/')
    } catch (err) {
      setError(err.message?.replace('Firebase: ', '').replace(/\(auth\/.*\)/, '') || 'Authentication failed')
    }
    setLoading(false)
  }

  async function handleGoogle() {
    setError('')
    setLoading(true)
    try {
      await signInWithGoogle()
      navigate('/')
    } catch (err) {
      setError(err.message?.replace('Firebase: ', '') || 'Google sign-in failed')
    }
    setLoading(false)
  }

  return (
    <div className="fade-in" style={{ maxWidth: '420px', margin: '0 auto' }}>
      <div style={{ textAlign: 'center', margin: '20px 0' }}>
        <div style={{ fontSize: '3rem', marginBottom: '8px' }}>{isSignUp ? '\u{270D}\u{FE0F}' : '\u{1F4D6}'}</div>
        <h2 className="text-gold">{isSignUp ? 'Create Account' : 'Welcome Back'}</h2>
        <p className="text-muted" style={{ fontSize: '0.9rem' }}>
          {isSignUp ? 'Join Scripture Vault to track your progress' : 'Sign in to continue your study'}
        </p>
      </div>

      <div className="card">
        {error && (
          <div style={{
            background: 'rgba(231, 76, 60, 0.1)',
            border: '1px solid var(--red)',
            borderRadius: '8px',
            padding: '10px 14px',
            marginBottom: '16px',
            color: 'var(--red)',
            fontSize: '0.85rem',
          }}>
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {isSignUp && (
            <div className="mb-16">
              <label className="text-muted" style={{ fontSize: '0.85rem', display: 'block', marginBottom: '6px' }}>Name</label>
              <input
                type="text"
                className="text-input"
                value={displayName}
                onChange={e => setDisplayName(e.target.value)}
                placeholder="Your name"
              />
            </div>
          )}

          <div className="mb-16">
            <label className="text-muted" style={{ fontSize: '0.85rem', display: 'block', marginBottom: '6px' }}>Email</label>
            <input
              type="email"
              className="text-input"
              value={email}
              onChange={e => setEmail(e.target.value)}
              placeholder="your@email.com"
              required
            />
          </div>

          <div className="mb-16">
            <label className="text-muted" style={{ fontSize: '0.85rem', display: 'block', marginBottom: '6px' }}>Password</label>
            <input
              type="password"
              className="text-input"
              value={password}
              onChange={e => setPassword(e.target.value)}
              placeholder={isSignUp ? 'Create a password' : 'Your password'}
              required
              minLength={6}
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary"
            style={{ width: '100%', justifyContent: 'center' }}
            disabled={loading}
          >
            {loading ? 'Please wait...' : (isSignUp ? 'Create Account' : 'Sign In')}
          </button>
        </form>

        <div style={{ textAlign: 'center', margin: '16px 0', color: 'var(--text-muted)', fontSize: '0.85rem' }}>or</div>

        <button
          className="btn btn-secondary"
          style={{ width: '100%', justifyContent: 'center' }}
          onClick={handleGoogle}
          disabled={loading}
        >
          Sign in with Google
        </button>

        <div style={{ textAlign: 'center', marginTop: '16px' }}>
          <button
            style={{ background: 'none', border: 'none', color: 'var(--gold)', cursor: 'pointer', fontFamily: 'inherit', fontSize: '0.9rem' }}
            onClick={() => { setIsSignUp(!isSignUp); setError('') }}
          >
            {isSignUp ? 'Already have an account? Sign in' : "Don't have an account? Sign up"}
          </button>
        </div>
      </div>

      <p className="text-center text-muted" style={{ fontSize: '0.8rem', marginTop: '16px' }}>
        Start free with 20 scriptures and 3 Bible lessons
      </p>
    </div>
  )
}
