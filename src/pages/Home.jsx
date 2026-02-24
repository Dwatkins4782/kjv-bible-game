import { Link } from 'react-router-dom'
import { useLocalStorage } from '../hooks/useLocalStorage'
import { getAllVerses } from '../data/verses'
import { useContentAccess } from '../hooks/useContentAccess'
import { useAuth } from '../hooks/useAuth'
import { lessonRegistry } from '../data/lessons/index'

export default function Home() {
  const [stats] = useLocalStorage('kjv-stats', { quizzesTaken: 0, totalCorrect: 0, totalQuestions: 0, memorized: [] })
  const { user } = useAuth()
  const { accessibleVerses, tier } = useContentAccess()
  const allVerses = getAllVerses()

  const memorizedCount = stats.memorized?.length || 0
  const accuracy = stats.totalQuestions > 0
    ? Math.round((stats.totalCorrect / stats.totalQuestions) * 100)
    : 0
  const freeLessons = lessonRegistry.filter(l => l.tier === 'free').length

  return (
    <div className="fade-in">
      <div style={{ textAlign: 'center', margin: '20px 0' }}>
        <div style={{ fontSize: '3.5rem', marginBottom: '8px' }}>{'\u{1F512}'}</div>
        <h2 style={{ color: 'var(--gold)', marginBottom: '8px' }}>Scripture Vault</h2>
        <p className="text-muted">Hide God&apos;s Word in your heart through memorization, lessons, and quizzes</p>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-value">{accessibleVerses.length}<span style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>/{allVerses.length}</span></div>
          <div className="stat-label">KJV Verses</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{memorizedCount}</div>
          <div className="stat-label">Memorized</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{stats.quizzesTaken}</div>
          <div className="stat-label">Quizzes Taken</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{accuracy}%</div>
          <div className="stat-label">Accuracy</div>
        </div>
      </div>

      {/* Audio Recite promo for non-premium */}
      {tier !== 'premium' && (
        <Link to="/pricing" style={{ textDecoration: 'none' }}>
          <div className="card card-clickable" style={{ background: 'linear-gradient(135deg, rgba(201,168,76,0.15), rgba(201,168,76,0.05))', borderColor: 'var(--gold-dark)' }}>
            <div className="flex-between">
              <div>
                <h3 style={{ color: 'var(--gold)', marginBottom: '4px', fontSize: '1rem' }}>{'\u{1F50A}'} Audio Recite — NEW</h3>
                <p className="text-muted" style={{ fontSize: '0.8rem' }}>
                  Hear every KJV scripture read aloud. Perfect for memorization on the go.
                  Premium feature — $6.99/mo or $49.99 lifetime.
                </p>
              </div>
              <span style={{ fontSize: '1.5rem' }}>{'\u{27A1}\u{FE0F}'}</span>
            </div>
          </div>
        </Link>
      )}

      <div className="category-grid">
        <Link to="/memorize" style={{ textDecoration: 'none' }}>
          <div className="card card-clickable">
            <div style={{ fontSize: '2rem', marginBottom: '8px' }}>{'\u{1F9E0}'}</div>
            <h3 style={{ color: 'var(--gold)', marginBottom: '4px' }}>Memorize</h3>
            <p className="text-muted" style={{ fontSize: '0.85rem' }}>
              Step-by-step scripture memorization with progressive difficulty
            </p>
          </div>
        </Link>

        <Link to="/lessons" style={{ textDecoration: 'none' }}>
          <div className="card card-clickable">
            <div style={{ fontSize: '2rem', marginBottom: '8px' }}>{'\u{1F4D6}'}</div>
            <h3 style={{ color: 'var(--gold)', marginBottom: '4px' }}>Bible Lessons</h3>
            <p className="text-muted" style={{ fontSize: '0.85rem' }}>
              {lessonRegistry.length} in-depth studies &bull; {freeLessons} free
            </p>
          </div>
        </Link>

        <Link to="/quiz" style={{ textDecoration: 'none' }}>
          <div className="card card-clickable">
            <div style={{ fontSize: '2rem', marginBottom: '8px' }}>{'\u{1F4DD}'}</div>
            <h3 style={{ color: 'var(--gold)', marginBottom: '4px' }}>Quiz</h3>
            <p className="text-muted" style={{ fontSize: '0.85rem' }}>
              Test your knowledge with fill-in-the-blank, matching, and more
            </p>
          </div>
        </Link>

        <Link to="/browse" style={{ textDecoration: 'none' }}>
          <div className="card card-clickable">
            <div style={{ fontSize: '2rem', marginBottom: '8px' }}>{'\u{1F4DA}'}</div>
            <h3 style={{ color: 'var(--gold)', marginBottom: '4px' }}>Browse</h3>
            <p className="text-muted" style={{ fontSize: '0.85rem' }}>
              Explore all KJV verses organized by category
            </p>
          </div>
        </Link>
      </div>

      {!user && (
        <div className="card" style={{ textAlign: 'center', marginTop: '8px' }}>
          <p className="text-muted mb-8">Sign in to save your progress across devices</p>
          <Link to="/login" className="btn btn-primary">Get Started Free</Link>
        </div>
      )}
    </div>
  )
}
