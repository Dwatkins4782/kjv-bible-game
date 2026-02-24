import { useState } from 'react'
import { getCategories, getVersesByCategory, getAllVerses } from '../data/verses'
import { useLocalStorage } from '../hooks/useLocalStorage'

export default function Browse() {
  const [stats] = useLocalStorage('kjv-stats', { quizzesTaken: 0, totalCorrect: 0, totalQuestions: 0, memorized: [] })
  const [selectedCategory, setSelectedCategory] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')

  const categories = getCategories()

  const getFilteredVerses = () => {
    const verses = selectedCategory ? getVersesByCategory(selectedCategory) : getAllVerses()
    if (!searchTerm.trim()) return verses
    const term = searchTerm.toLowerCase()
    return verses.filter(v =>
      v.text.toLowerCase().includes(term) ||
      v.ref.toLowerCase().includes(term)
    )
  }

  const verses = getFilteredVerses()

  return (
    <div className="fade-in">
      <h2 className="text-gold mb-16">Browse KJV Verses</h2>

      <input
        type="text"
        className="text-input mb-16"
        placeholder="Search verses or references..."
        value={searchTerm}
        onChange={e => setSearchTerm(e.target.value)}
      />

      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '20px' }}>
        <button
          className={`word-chip ${!selectedCategory ? '' : 'used'}`}
          style={!selectedCategory ? { background: 'var(--gold-dark)', color: '#fff' } : {}}
          onClick={() => setSelectedCategory(null)}
        >All ({getAllVerses().length})</button>
        {categories.map(cat => (
          <button
            key={cat}
            className={`word-chip ${selectedCategory === cat ? '' : 'used'}`}
            style={selectedCategory === cat ? { background: 'var(--gold-dark)', color: '#fff' } : {}}
            onClick={() => setSelectedCategory(cat)}
          >
            {cat} ({getVersesByCategory(cat).length})
          </button>
        ))}
      </div>

      {verses.length === 0 && (
        <p className="text-muted text-center mt-16">No verses found matching your search.</p>
      )}

      {verses.map(v => (
        <div key={v.ref} className="card">
          <div className="flex-between mb-8">
            <div>
              <span className="verse-ref">{v.ref}</span>
              <span className="category-tag">{v.category}</span>
            </div>
            {stats.memorized.includes(v.ref) && <span className="streak-badge">Memorized</span>}
          </div>
          <p className="verse-text">{v.text}</p>
        </div>
      ))}
    </div>
  )
}
