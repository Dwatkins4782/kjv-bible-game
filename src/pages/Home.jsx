import { Link } from 'react-router-dom'
import { useLocalStorage } from '../hooks/useLocalStorage'
import { getAllVerses } from '../data/verses'

export default function Home() {
  const [stats] = useLocalStorage('kjv-stats', { quizzesTaken: 0, totalCorrect: 0, totalQuestions: 0, memorized: [] })
  const allVerses = getAllVerses()

  const memorizedCount = stats.memorized?.length || 0
  const accuracy = stats.totalQuestions > 0
    ? Math.round((stats.totalCorrect / stats.totalQuestions) * 100)
    : 0

  return (
    <div className="fade-in">
      <div style={{ textAlign: 'center', margin: '30px 0' }}>
        <div style={{ fontSize: '4rem', marginBottom: '8px' }}>📖</div>
        <h2 style={{ color: 'var(--gold)', marginBottom: '8px' }}>Welcome</h2>
        <p className="text-muted">Hide God's Word in your heart through memorization and quizzes</p>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-value">{allVerses.length}</div>
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

      <div className="category-grid">
        <Link to="/memorize" style={{ textDecoration: 'none' }}>
          <div className="card card-clickable">
            <div style={{ fontSize: '2rem', marginBottom: '8px' }}>🧠</div>
            <h3 style={{ color: 'var(--gold)', marginBottom: '4px' }}>Memorize</h3>
            <p className="text-muted" style={{ fontSize: '0.85rem' }}>
              Step-by-step scripture memorization with progressive difficulty
            </p>
          </div>
        </Link>

        <Link to="/quiz" style={{ textDecoration: 'none' }}>
          <div className="card card-clickable">
            <div style={{ fontSize: '2rem', marginBottom: '8px' }}>📝</div>
            <h3 style={{ color: 'var(--gold)', marginBottom: '4px' }}>Quiz</h3>
            <p className="text-muted" style={{ fontSize: '0.85rem' }}>
              Test your knowledge with fill-in-the-blank, matching, and more
            </p>
          </div>
        </Link>

        <Link to="/browse" style={{ textDecoration: 'none' }}>
          <div className="card card-clickable">
            <div style={{ fontSize: '2rem', marginBottom: '8px' }}>📚</div>
            <h3 style={{ color: 'var(--gold)', marginBottom: '4px' }}>Browse</h3>
            <p className="text-muted" style={{ fontSize: '0.85rem' }}>
              Explore all KJV verses organized by category
            </p>
          </div>
        </Link>

        <Link to="/stats" style={{ textDecoration: 'none' }}>
          <div className="card card-clickable">
            <div style={{ fontSize: '2rem', marginBottom: '8px' }}>📊</div>
            <h3 style={{ color: 'var(--gold)', marginBottom: '4px' }}>Progress</h3>
            <p className="text-muted" style={{ fontSize: '0.85rem' }}>
              Track your memorization journey and quiz scores
            </p>
          </div>
        </Link>
      </div>
    </div>
  )
}
