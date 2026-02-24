import { useLocalStorage } from '../hooks/useLocalStorage'
import { getAllVerses, getCategories, getVersesByCategory } from '../data/verses'
import { useContentAccess } from '../hooks/useContentAccess'
import { useSubscription } from '../hooks/useSubscription'
import { lessonRegistry } from '../data/lessons/index'
import { Link } from 'react-router-dom'

export default function Stats() {
  const [stats, setStats] = useLocalStorage('kjv-stats', { quizzesTaken: 0, totalCorrect: 0, totalQuestions: 0, memorized: [] })
  const [lessonProgress] = useLocalStorage('kjv-lesson-progress', {})
  const { accessibleVerses } = useContentAccess()
  const { tier } = useSubscription()

  const allVerses = getAllVerses()
  const categories = getCategories()
  const memorizedCount = stats.memorized?.length || 0
  const accuracy = stats.totalQuestions > 0
    ? Math.round((stats.totalCorrect / stats.totalQuestions) * 100)
    : 0
  const progress = accessibleVerses.length > 0
    ? Math.round((memorizedCount / accessibleVerses.length) * 100)
    : 0

  // Lesson stats
  const lessonsStarted = Object.keys(lessonProgress).length
  const lessonsCompleted = Object.values(lessonProgress).filter(p => p.completed).length

  function resetStats() {
    if (confirm('Are you sure you want to reset all progress? This cannot be undone.')) {
      setStats({ quizzesTaken: 0, totalCorrect: 0, totalQuestions: 0, memorized: [] })
    }
  }

  return (
    <div className="fade-in">
      <h2 className="text-gold mb-16">Your Progress</h2>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-value">{memorizedCount}</div>
          <div className="stat-label">Verses Memorized</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{accessibleVerses.length}</div>
          <div className="stat-label">Available Verses</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{stats.quizzesTaken}</div>
          <div className="stat-label">Quizzes Taken</div>
        </div>
        <div className="stat-card">
          <div className="stat-value">{accuracy}%</div>
          <div className="stat-label">Quiz Accuracy</div>
        </div>
      </div>

      <div className="card">
        <h3 className="text-gold mb-8">Scripture Memorization</h3>
        <div className="progress-bar" style={{ height: '16px', marginBottom: '8px' }}>
          <div className="progress-fill" style={{ width: `${progress}%` }} />
        </div>
        <p className="text-muted">{memorizedCount} of {accessibleVerses.length} available verses ({progress}%)</p>
        {tier === 'free' && (
          <p className="text-muted" style={{ fontSize: '0.8rem', marginTop: '8px' }}>
            <Link to="/pricing" style={{ color: 'var(--gold)' }}>Upgrade</Link> to unlock more verses ({allVerses.length} total)
          </p>
        )}
      </div>

      {/* Lesson Progress */}
      <div className="card">
        <h3 className="text-gold mb-8">Bible Lessons</h3>
        <div className="stats-grid" style={{ marginBottom: '12px' }}>
          <div className="stat-card">
            <div className="stat-value">{lessonsStarted}</div>
            <div className="stat-label">Started</div>
          </div>
          <div className="stat-card">
            <div className="stat-value">{lessonsCompleted}</div>
            <div className="stat-label">Completed</div>
          </div>
        </div>
        <div className="progress-bar" style={{ height: '8px', marginBottom: '8px' }}>
          <div className="progress-fill" style={{ width: `${lessonRegistry.length > 0 ? Math.round((lessonsCompleted / lessonRegistry.length) * 100) : 0}%` }} />
        </div>
        <p className="text-muted" style={{ fontSize: '0.85rem' }}>
          {lessonsCompleted} of {lessonRegistry.length} lessons completed
        </p>
      </div>

      <div className="card">
        <h3 className="text-gold mb-16">By Category</h3>
        {categories.map(cat => {
          const catVerses = getVersesByCategory(cat)
          const catMemorized = catVerses.filter(v => stats.memorized.includes(v.ref)).length
          const catPct = catVerses.length > 0 ? Math.round((catMemorized / catVerses.length) * 100) : 0
          return (
            <div key={cat} style={{ marginBottom: '16px' }}>
              <div className="flex-between mb-8">
                <span style={{ textTransform: 'capitalize' }}>{cat}</span>
                <span className="text-muted">{catMemorized}/{catVerses.length}</span>
              </div>
              <div className="progress-bar">
                <div className="progress-fill" style={{ width: `${catPct}%` }} />
              </div>
            </div>
          )
        })}
      </div>

      {stats.memorized.length > 0 && (
        <div className="card">
          <h3 className="text-gold mb-16">Memorized Verses</h3>
          {stats.memorized.map(ref => {
            const verse = allVerses.find(v => v.ref === ref)
            return verse ? (
              <div key={ref} style={{ marginBottom: '12px', paddingBottom: '12px', borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                <span className="verse-ref">{verse.ref}</span>
                <span className="category-tag">{verse.category}</span>
                <p className="verse-text" style={{ fontSize: '0.9rem', marginTop: '4px' }}>
                  {verse.text.length > 80 ? verse.text.slice(0, 80) + '...' : verse.text}
                </p>
              </div>
            ) : null
          })}
        </div>
      )}

      <div className="text-center mt-16">
        <button className="btn btn-danger btn-sm" onClick={resetStats}>
          Reset All Progress
        </button>
      </div>
    </div>
  )
}
