import { useState } from 'react'
import { getCategories, getVersesByCategory, getAllVerses } from '../data/verses'
import { useLocalStorage } from '../hooks/useLocalStorage'

const STAGES = [
  { name: 'Read', description: 'Read the verse carefully 3 times' },
  { name: 'First Letters', description: 'Fill in words given only first letters' },
  { name: 'Fill Blanks', description: 'Fill in missing words' },
  { name: 'Full Recall', description: 'Type the entire verse from memory' },
]

function shuffle(arr) {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

export default function Memorize() {
  const [stats, setStats] = useLocalStorage('kjv-stats', { quizzesTaken: 0, totalCorrect: 0, totalQuestions: 0, memorized: [] })
  const [selectedCategory, setSelectedCategory] = useState(null)
  const [selectedVerse, setSelectedVerse] = useState(null)
  const [stage, setStage] = useState(0)
  const [readCount, setReadCount] = useState(0)
  const [userInput, setUserInput] = useState('')
  const [blanks, setBlanks] = useState([])
  const [blankAnswers, setBlankAnswers] = useState({})
  const [showResult, setShowResult] = useState(false)
  const [stageComplete, setStageComplete] = useState(false)

  const categories = getCategories()

  function startVerse(verse) {
    setSelectedVerse(verse)
    setStage(0)
    setReadCount(0)
    setUserInput('')
    setShowResult(false)
    setStageComplete(false)
  }

  function handleRead() {
    const next = readCount + 1
    setReadCount(next)
    if (next >= 3) {
      setStageComplete(true)
    }
  }

  function nextStage() {
    const next = stage + 1
    setStage(next)
    setStageComplete(false)
    setShowResult(false)
    setUserInput('')
    setBlankAnswers({})

    if (next === 2) {
      // Generate blanks
      const words = selectedVerse.text.split(' ')
      const count = Math.max(3, Math.floor(words.length * 0.35))
      const indices = shuffle(words.map((_, i) => i)).slice(0, count).sort((a, b) => a - b)
      setBlanks(indices.map(i => ({ index: i, word: words[i] })))
    }
  }

  function checkFirstLetters() {
    const words = selectedVerse.text.split(' ')
    const input = userInput.trim().split(/\s+/)
    let correct = 0
    for (let i = 0; i < words.length; i++) {
      if (input[i] && input[i].toLowerCase().replace(/[^a-z]/g, '') === words[i].toLowerCase().replace(/[^a-z]/g, '')) {
        correct++
      }
    }
    setShowResult(true)
    if (correct >= words.length * 0.7) setStageComplete(true)
  }

  function checkBlanks() {
    let correct = 0
    for (const b of blanks) {
      const answer = (blankAnswers[b.index] || '').trim().toLowerCase().replace(/[^a-z]/g, '')
      const expected = b.word.toLowerCase().replace(/[^a-z]/g, '')
      if (answer === expected) correct++
    }
    setShowResult(true)
    if (correct >= blanks.length * 0.7) setStageComplete(true)
  }

  function checkFullRecall() {
    const normalize = s => s.toLowerCase().replace(/[^a-z\s]/g, '').replace(/\s+/g, ' ').trim()
    const input = normalize(userInput)
    const expected = normalize(selectedVerse.text)

    const inputWords = input.split(' ')
    const expectedWords = expected.split(' ')
    let correct = 0
    for (let i = 0; i < expectedWords.length; i++) {
      if (inputWords[i] === expectedWords[i]) correct++
    }

    const accuracy = correct / expectedWords.length
    setShowResult(true)

    if (accuracy >= 0.8) {
      setStageComplete(true)
      // Mark as memorized
      if (!stats.memorized.includes(selectedVerse.ref)) {
        setStats({
          ...stats,
          memorized: [...stats.memorized, selectedVerse.ref],
        })
      }
    }
  }

  function resetVerse() {
    setSelectedVerse(null)
    setSelectedCategory(null)
    setStage(0)
  }

  // Category selection
  if (!selectedCategory) {
    return (
      <div className="fade-in">
        <h2 className="text-gold mb-16">Memorize Scripture</h2>
        <p className="text-muted mb-16">Choose a category to begin memorizing KJV verses</p>
        <div className="category-grid">
          {categories.map(cat => (
            <div key={cat} className="card card-clickable" onClick={() => setSelectedCategory(cat)}>
              <h3 style={{ color: 'var(--gold)', textTransform: 'capitalize' }}>{cat}</h3>
              <p className="text-muted" style={{ fontSize: '0.85rem', marginTop: '4px' }}>
                {getVersesByCategory(cat).length} verses
              </p>
            </div>
          ))}
        </div>
      </div>
    )
  }

  // Verse selection
  if (!selectedVerse) {
    const verses = getVersesByCategory(selectedCategory)
    return (
      <div className="fade-in">
        <button className="btn btn-secondary btn-sm mb-16" onClick={() => setSelectedCategory(null)}>
          Back to Categories
        </button>
        <h2 className="text-gold mb-16" style={{ textTransform: 'capitalize' }}>{selectedCategory}</h2>
        {verses.map(v => (
          <div key={v.ref} className="card card-clickable" onClick={() => startVerse(v)}>
            <div className="flex-between mb-8">
              <span className="verse-ref">{v.ref}</span>
              {stats.memorized.includes(v.ref) && <span className="streak-badge">Memorized</span>}
            </div>
            <p className="verse-text" style={{ fontSize: '0.95rem' }}>
              {v.text.length > 100 ? v.text.slice(0, 100) + '...' : v.text}
            </p>
          </div>
        ))}
      </div>
    )
  }

  // Memorization stages
  const words = selectedVerse.text.split(' ')

  return (
    <div className="fade-in">
      <div className="flex-between mb-16">
        <button className="btn btn-secondary btn-sm" onClick={resetVerse}>Back</button>
        <span className="verse-ref">{selectedVerse.ref}</span>
      </div>

      {/* Stage indicator */}
      <div className="stage-indicator">
        {STAGES.map((s, i) => (
          <div
            key={i}
            className={`stage-dot ${i < stage ? 'completed' : i === stage ? 'current' : ''}`}
          />
        ))}
      </div>

      <div className="card">
        <h3 className="text-gold mb-8">Stage {stage + 1}: {STAGES[stage].name}</h3>
        <p className="text-muted mb-16" style={{ fontSize: '0.85rem' }}>{STAGES[stage].description}</p>

        {/* Stage 0: Read */}
        {stage === 0 && (
          <>
            <p className="verse-text">{selectedVerse.text}</p>
            <p className="text-muted mt-16 mb-16">Read {readCount}/3 times</p>
            <button className="btn btn-primary" onClick={handleRead}>
              {readCount >= 3 ? 'Read Again' : `I've Read It (${readCount}/3)`}
            </button>
          </>
        )}

        {/* Stage 1: First Letters */}
        {stage === 1 && (
          <>
            <div className="verse-text mb-16">
              {words.map((w, i) => (
                <span key={i}>
                  <strong>{w[0]}</strong>{'_'.repeat(Math.max(1, w.length - 1))}
                  {i < words.length - 1 ? ' ' : ''}
                </span>
              ))}
            </div>
            <textarea
              className="text-input mb-16"
              rows={4}
              value={userInput}
              onChange={e => setUserInput(e.target.value)}
              placeholder="Type the full verse here..."
            />
            {showResult && (
              <div className={`card ${stageComplete ? '' : ''}`} style={{
                background: stageComplete ? 'rgba(76,175,80,0.1)' : 'rgba(231,76,60,0.1)',
                borderColor: stageComplete ? 'var(--green)' : 'var(--red)',
                marginBottom: '12px',
              }}>
                <p>{stageComplete ? 'Well done! You got most of the words right.' : 'Not quite. Try again — look at the first letters for hints.'}</p>
                <p className="text-muted mt-16" style={{ fontSize: '0.85rem' }}><strong>Verse:</strong> {selectedVerse.text}</p>
              </div>
            )}
            {!showResult && (
              <button className="btn btn-primary" onClick={checkFirstLetters}>Check</button>
            )}
            {showResult && !stageComplete && (
              <button className="btn btn-secondary" onClick={() => { setShowResult(false); setUserInput('') }}>Try Again</button>
            )}
          </>
        )}

        {/* Stage 2: Fill Blanks */}
        {stage === 2 && (
          <>
            <div className="verse-text mb-16">
              {words.map((w, i) => {
                const isBlank = blanks.some(b => b.index === i)
                if (!isBlank) return <span key={i}>{w} </span>
                return (
                  <input
                    key={i}
                    type="text"
                    className="text-input"
                    style={{
                      display: 'inline-block',
                      width: `${Math.max(60, w.length * 12)}px`,
                      padding: '4px 8px',
                      margin: '2px',
                      fontSize: '1rem',
                      textAlign: 'center',
                    }}
                    value={blankAnswers[i] || ''}
                    onChange={e => setBlankAnswers({ ...blankAnswers, [i]: e.target.value })}
                    placeholder="..."
                  />
                )
              })}
            </div>
            {showResult && (
              <div className="card" style={{
                background: stageComplete ? 'rgba(76,175,80,0.1)' : 'rgba(231,76,60,0.1)',
                borderColor: stageComplete ? 'var(--green)' : 'var(--red)',
                marginBottom: '12px',
              }}>
                <p>{stageComplete ? 'Great job filling in the blanks!' : 'Some blanks were incorrect. Review and try again.'}</p>
                <p className="text-muted mt-16" style={{ fontSize: '0.85rem' }}>
                  <strong>Answers:</strong> {blanks.map(b => `"${b.word}"`).join(', ')}
                </p>
              </div>
            )}
            {!showResult && (
              <button className="btn btn-primary mt-16" onClick={checkBlanks}>Check</button>
            )}
            {showResult && !stageComplete && (
              <button className="btn btn-secondary" onClick={() => { setShowResult(false); setBlankAnswers({}) }}>Try Again</button>
            )}
          </>
        )}

        {/* Stage 3: Full Recall */}
        {stage === 3 && (
          <>
            <p className="text-muted mb-16">Type the entire verse for <strong>{selectedVerse.ref}</strong> from memory:</p>
            <textarea
              className="text-input mb-16"
              rows={5}
              value={userInput}
              onChange={e => setUserInput(e.target.value)}
              placeholder="Type the verse from memory..."
            />
            {showResult && (
              <div className="card" style={{
                background: stageComplete ? 'rgba(76,175,80,0.1)' : 'rgba(231,76,60,0.1)',
                borderColor: stageComplete ? 'var(--green)' : 'var(--red)',
                marginBottom: '12px',
              }}>
                <p>{stageComplete ? 'You\'ve memorized this verse!' : 'Not quite there yet. Keep practicing!'}</p>
                <p className="text-muted mt-16" style={{ fontSize: '0.85rem' }}><strong>Verse:</strong> {selectedVerse.text}</p>
              </div>
            )}
            {!showResult && (
              <button className="btn btn-primary" onClick={checkFullRecall}>Check</button>
            )}
            {showResult && !stageComplete && (
              <button className="btn btn-secondary" onClick={() => { setShowResult(false); setUserInput('') }}>Try Again</button>
            )}
            {showResult && stageComplete && (
              <button className="btn btn-success mt-16" onClick={resetVerse}>Choose Another Verse</button>
            )}
          </>
        )}

        {/* Next stage button */}
        {stageComplete && stage < 3 && (
          <button className="btn btn-primary mt-16" onClick={nextStage}>
            Next Stage: {STAGES[stage + 1].name}
          </button>
        )}
      </div>
    </div>
  )
}
