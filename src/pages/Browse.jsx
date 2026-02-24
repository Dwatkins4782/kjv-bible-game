import { useState } from 'react'
import { getCategories, getVersesByCategory, getAllVerses } from '../data/verses'
import { useLocalStorage } from '../hooks/useLocalStorage'
import { useContentAccess } from '../hooks/useContentAccess'
import AudioReciteButton from '../components/subscription/AudioReciteButton'
import UpgradePrompt from '../components/subscription/UpgradePrompt'
import { Link } from 'react-router-dom'

export default function Browse() {
  const [stats] = useLocalStorage('kjv-stats', { quizzesTaken: 0, totalCorrect: 0, totalQuestions: 0, memorized: [] })
  const [selectedCategory, setSelectedCategory] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const { accessibleVerses, isVerseLocked, tier } = useContentAccess()

  const categories = getCategories()
  const allVerses = getAllVerses()

  const getFilteredVerses = () => {
    const verses = selectedCategory ? getVersesByCategory(selectedCategory) : allVerses
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
      <h2 className="text-gold mb-8">Browse KJV Verses</h2>
      <p className="text-muted mb-16" style={{ fontSize: '0.85rem' }}>
        {accessibleVerses.length} of {allVerses.length} verses available on your plan
      </p>

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
        >All ({allVerses.length})</button>
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

      {verses.map((v, idx) => {
        const globalIndex = allVerses.findIndex(av => av.ref === v.ref)
        const locked = isVerseLocked(globalIndex)

        return (
          <div key={v.ref} className={`card ${locked ? 'verse-locked' : ''}`}>
            <div className="flex-between mb-8">
              <div>
                <span className="verse-ref">{v.ref}</span>
                <span className="category-tag">{v.category}</span>
              </div>
              <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                {!locked && <AudioReciteButton text={v.text} reference={v.ref} />}
                {stats.memorized.includes(v.ref) && <span className="streak-badge">Memorized</span>}
                {locked && (
                  <Link to="/pricing" className="btn btn-sm" style={{ color: 'var(--gold)', fontSize: '0.75rem' }}>
                    {'\u{1F512}'} Unlock
                  </Link>
                )}
              </div>
            </div>
            {locked ? (
              <p className="verse-text" style={{ filter: 'blur(4px)', userSelect: 'none' }}>{v.text}</p>
            ) : (
              <p className="verse-text">{v.text}</p>
            )}
          </div>
        )
      })}

      {tier === 'free' && verses.some((v, i) => isVerseLocked(allVerses.findIndex(av => av.ref === v.ref))) && (
        <div style={{ marginTop: '16px' }}>
          <UpgradePrompt requiredTier="basic" feature="more scriptures" />
        </div>
      )}
    </div>
  )
}
