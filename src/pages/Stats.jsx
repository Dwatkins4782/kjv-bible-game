import { useLocalStorage } from '../hooks/useLocalStorage'
import { getAllVerses, getCategories, getVersesByCategory } from '../data/verses'

export default function Stats() {
  const [stats, setStats] = useLocalStorage('kjv-stats', { quizzesTaken: 0, totalCorrect: 0, totalQuestions: 0, memorized: [] })

  const allVerses = getAllVerses()
  const categories = getCategories()
  const memorizedCount = stats.memorized?.length || 0
  const accuracy = stats.totalQuestions > 0
    ? Math.round((stats.totalCorrect / stats.totalQuestions) * 100)
    : 0
  const progress = Math.round((memorizedCount / allVerses.length) * 100)

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
          <div className="stat-value">{allVerses.length}</div>
          <div className="stat-label">Total Verses</div>
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
        <h3 className="text-gold mb-8">Overall Memorization</h3>
        <div className="progress-bar" style={{ height: '16px', marginBottom: '8px' }}>
          <div className="progress-fill" style={{ width: `${progress}%` }} />
        </div>
        <p className="text-muted">{memorizedCount} of {allVerses.length} verses ({progress}%)</p>
      </div>

      <div className="card">
        <h3 className="text-gold mb-16">By Category</h3>
        {categories.map(cat => {
          const catVerses = getVersesByCategory(cat)
          const catMemorized = catVerses.filter(v => stats.memorized.includes(v.ref)).length
          const catPct = Math.round((catMemorized / catVerses.length) * 100)
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
