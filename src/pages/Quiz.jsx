import { useState } from 'react'
import { getCategories, getVersesByCategory, getAllVerses } from '../data/verses'
import { generateQuiz } from '../utils/quiz'
import { useLocalStorage } from '../hooks/useLocalStorage'

export default function Quiz() {
  const [stats, setStats] = useLocalStorage('kjv-stats', { quizzesTaken: 0, totalCorrect: 0, totalQuestions: 0, memorized: [] })
  const [category, setCategory] = useState('all')
  const [difficulty, setDifficulty] = useState('medium')
  const [questionCount, setQuestionCount] = useState(10)
  const [quiz, setQuiz] = useState(null)
  const [currentQ, setCurrentQ] = useState(0)
  const [score, setScore] = useState(0)
  const [answered, setAnswered] = useState(false)
  const [selectedAnswer, setSelectedAnswer] = useState(null)
  const [wordOrderSelection, setWordOrderSelection] = useState([])
  const [fillBlankInput, setFillBlankInput] = useState({})
  const [quizDone, setQuizDone] = useState(false)

  const categories = getCategories()

  function startQuiz() {
    const verses = category === 'all' ? getAllVerses() : getVersesByCategory(category)
    const count = Math.min(questionCount, verses.length)
    const q = generateQuiz(verses, count, difficulty)
    setQuiz(q)
    setCurrentQ(0)
    setScore(0)
    setAnswered(false)
    setSelectedAnswer(null)
    setWordOrderSelection([])
    setFillBlankInput({})
    setQuizDone(false)
  }

  function handleAnswer(answer) {
    if (answered) return
    setAnswered(true)
    setSelectedAnswer(answer)

    const q = quiz[currentQ]
    let isCorrect = false

    if (q.type === 'refMatch') {
      isCorrect = answer === q.data.correctRef
    } else if (q.type === 'completion') {
      isCorrect = answer === q.data.correctEnding
    }

    if (isCorrect) setScore(s => s + 1)
  }

  function checkFillBlanks() {
    if (answered) return
    setAnswered(true)

    const q = quiz[currentQ]
    let correct = 0
    for (const b of q.data.blanks) {
      const input = (fillBlankInput[b.index] || '').trim().toLowerCase().replace(/[^a-z]/g, '')
      const expected = b.word.toLowerCase().replace(/[^a-z]/g, '')
      if (input === expected) correct++
    }
    if (correct >= q.data.blanks.length * 0.7) setScore(s => s + 1)
    setSelectedAnswer(correct >= q.data.blanks.length * 0.7 ? 'correct' : 'incorrect')
  }

  function checkWordOrder() {
    if (answered) return
    setAnswered(true)

    const q = quiz[currentQ]
    const correct = q.data.correct
    let matches = 0
    for (let i = 0; i < correct.length; i++) {
      if (wordOrderSelection[i] === correct[i]) matches++
    }
    if (matches >= correct.length * 0.7) setScore(s => s + 1)
    setSelectedAnswer(matches >= correct.length * 0.7 ? 'correct' : 'incorrect')
  }

  function nextQuestion() {
    if (currentQ + 1 >= quiz.length) {
      setQuizDone(true)
      setStats({
        ...stats,
        quizzesTaken: stats.quizzesTaken + 1,
        totalCorrect: stats.totalCorrect + score + (answered && selectedAnswer !== 'incorrect' ? 0 : 0),
        totalQuestions: stats.totalQuestions + quiz.length,
      })
      // Recalculate with final score
      const finalScore = score
      setStats(prev => ({
        ...prev,
        quizzesTaken: prev.quizzesTaken + 1,
        totalCorrect: prev.totalCorrect + finalScore,
        totalQuestions: prev.totalQuestions + quiz.length,
      }))
      return
    }
    setCurrentQ(c => c + 1)
    setAnswered(false)
    setSelectedAnswer(null)
    setWordOrderSelection([])
    setFillBlankInput({})
  }

  // Setup screen
  if (!quiz) {
    return (
      <div className="fade-in">
        <h2 className="text-gold mb-16">Quiz</h2>
        <p className="text-muted mb-16">Test your KJV scripture knowledge</p>

        <div className="card">
          <h3 className="text-gold mb-16">Quiz Settings</h3>

          <label className="text-muted" style={{ fontSize: '0.85rem', display: 'block', marginBottom: '8px' }}>Category</label>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '20px' }}>
            <button
              className={`word-chip ${category === 'all' ? '' : 'used'}`}
              style={category === 'all' ? { background: 'var(--gold-dark)', color: '#fff' } : {}}
              onClick={() => setCategory('all')}
            >All</button>
            {categories.map(cat => (
              <button
                key={cat}
                className={`word-chip ${category === cat ? '' : 'used'}`}
                style={category === cat ? { background: 'var(--gold-dark)', color: '#fff' } : {}}
                onClick={() => setCategory(cat)}
              >{cat}</button>
            ))}
          </div>

          <label className="text-muted" style={{ fontSize: '0.85rem', display: 'block', marginBottom: '8px' }}>Difficulty</label>
          <div className="difficulty-select" style={{ marginBottom: '20px' }}>
            {['easy', 'medium', 'hard'].map(d => (
              <button
                key={d}
                className={`difficulty-btn ${difficulty === d ? 'active' : ''}`}
                onClick={() => setDifficulty(d)}
              >{d.charAt(0).toUpperCase() + d.slice(1)}</button>
            ))}
          </div>

          <label className="text-muted" style={{ fontSize: '0.85rem', display: 'block', marginBottom: '8px' }}>Questions</label>
          <div style={{ display: 'flex', gap: '8px', marginBottom: '24px' }}>
            {[5, 10, 15, 20].map(n => (
              <button
                key={n}
                className={`difficulty-btn ${questionCount === n ? 'active' : ''}`}
                onClick={() => setQuestionCount(n)}
              >{n}</button>
            ))}
          </div>

          <button className="btn btn-primary" style={{ width: '100%' }} onClick={startQuiz}>
            Start Quiz
          </button>
        </div>
      </div>
    )
  }

  // Results screen
  if (quizDone) {
    const pct = Math.round((score / quiz.length) * 100)
    return (
      <div className="fade-in">
        <div className="score-display">
          <div className="score-number">{pct}%</div>
          <div className="score-label">{score} of {quiz.length} correct</div>
          <p className="text-muted mt-16" style={{ fontSize: '1rem' }}>
            {pct >= 90 ? 'Excellent! Thy word have I hid in mine heart.' :
             pct >= 70 ? 'Well done, good and faithful servant!' :
             pct >= 50 ? 'Keep studying — the Word of God is a lamp unto thy feet.' :
             'Be not discouraged — continue in the Word daily.'}
          </p>
        </div>

        <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
          <button className="btn btn-primary" onClick={startQuiz}>Retry</button>
          <button className="btn btn-secondary" onClick={() => setQuiz(null)}>New Quiz</button>
        </div>

        <h3 className="text-gold mt-16 mb-16">Review</h3>
        {quiz.map((q, i) => (
          <div key={i} className="card" style={{ padding: '16px' }}>
            <span className="verse-ref">{q.verse.ref}</span>
            <span className="category-tag">{q.verse.category}</span>
            <p className="verse-text" style={{ fontSize: '0.9rem', marginTop: '8px' }}>{q.verse.text}</p>
          </div>
        ))}
      </div>
    )
  }

  // Active quiz
  const q = quiz[currentQ]

  return (
    <div className="fade-in">
      <div className="flex-between mb-8">
        <span className="text-muted">Question {currentQ + 1} of {quiz.length}</span>
        <span className="streak-badge">Score: {score}</span>
      </div>
      <div className="progress-bar mb-16">
        <div className="progress-fill" style={{ width: `${((currentQ + 1) / quiz.length) * 100}%` }} />
      </div>

      <div className="card">
        {/* Reference Match */}
        {q.type === 'refMatch' && (
          <>
            <h3 className="text-gold mb-8">Which verse is this?</h3>
            <p className="verse-text mb-16">{q.data.text}</p>
            {q.data.options.map(opt => (
              <button
                key={opt}
                className={`quiz-option ${answered ? (opt === q.data.correctRef ? 'correct' : opt === selectedAnswer ? 'incorrect' : '') : ''}`}
                onClick={() => handleAnswer(opt)}
                disabled={answered}
              >{opt}</button>
            ))}
          </>
        )}

        {/* Verse Completion */}
        {q.type === 'completion' && (
          <>
            <h3 className="text-gold mb-8">Complete the verse</h3>
            <p className="verse-text mb-8">{q.data.beginning}</p>
            <p className="text-muted mb-16" style={{ fontSize: '0.8rem' }}>{q.verse.ref}</p>
            {q.data.options.map((opt, i) => (
              <button
                key={i}
                className={`quiz-option ${answered ? (opt === q.data.correctEnding ? 'correct' : opt === selectedAnswer ? 'incorrect' : '') : ''}`}
                onClick={() => handleAnswer(opt)}
                disabled={answered}
                style={{ fontSize: '0.85rem' }}
              >{opt}</button>
            ))}
          </>
        )}

        {/* Fill in the Blank */}
        {q.type === 'fillBlank' && (
          <>
            <h3 className="text-gold mb-8">Fill in the blanks</h3>
            <p className="text-muted mb-8" style={{ fontSize: '0.8rem' }}>{q.verse.ref}</p>
            <div className="verse-text mb-16" style={{ lineHeight: '2.2' }}>
              {q.data.display.split(' ').map((w, i) => {
                if (w === '______') {
                  const blank = q.data.blanks.find(b => {
                    const words = q.verse.text.split(' ')
                    let blankIdx = 0
                    for (let j = 0; j < words.length; j++) {
                      if (q.data.display.split(' ')[j] === '______') {
                        if (blankIdx === Object.keys(fillBlankInput).length) break
                        blankIdx++
                      }
                    }
                    return b.index === i || q.data.blanks.indexOf(b) === q.data.display.split(' ').slice(0, i).filter(x => x === '______').length
                  })
                  const blankNum = q.data.display.split(' ').slice(0, i).filter(x => x === '______').length
                  return (
                    <input
                      key={i}
                      type="text"
                      className="text-input"
                      style={{
                        display: 'inline-block',
                        width: '90px',
                        padding: '3px 6px',
                        margin: '2px',
                        fontSize: '0.95rem',
                        textAlign: 'center',
                      }}
                      value={fillBlankInput[blankNum] || ''}
                      onChange={e => setFillBlankInput({ ...fillBlankInput, [blankNum]: e.target.value })}
                      disabled={answered}
                    />
                  )
                }
                return <span key={i}>{w} </span>
              })}
            </div>
            {answered && (
              <div className="card" style={{
                background: selectedAnswer === 'correct' ? 'rgba(76,175,80,0.1)' : 'rgba(231,76,60,0.1)',
                borderColor: selectedAnswer === 'correct' ? 'var(--green)' : 'var(--red)',
                marginBottom: '12px',
              }}>
                <p><strong>Answers:</strong> {q.data.blanks.map(b => b.word).join(', ')}</p>
              </div>
            )}
            {!answered && (
              <button className="btn btn-primary" onClick={checkFillBlanks}>Check Answers</button>
            )}
          </>
        )}

        {/* Word Order */}
        {q.type === 'wordOrder' && (
          <>
            <h3 className="text-gold mb-8">Put the words in order</h3>
            <p className="text-muted mb-8" style={{ fontSize: '0.8rem' }}>{q.verse.ref}</p>

            <div style={{ minHeight: '50px', padding: '12px', background: 'rgba(0,0,0,0.2)', borderRadius: '8px', marginBottom: '12px' }}>
              {wordOrderSelection.length === 0 && <span className="text-muted">Tap words below to build the verse...</span>}
              {wordOrderSelection.map((w, i) => (
                <span key={i} className="word-chip" style={{ margin: '2px' }}
                  onClick={() => !answered && setWordOrderSelection(wordOrderSelection.filter((_, j) => j !== i))}
                >{w}</span>
              ))}
            </div>

            <div className="word-bank">
              {q.data.scrambled.map((w, i) => {
                const usedCount = wordOrderSelection.filter(s => s === w).length
                const availCount = q.data.scrambled.filter(s => s === w).length
                const isUsed = usedCount >= q.data.scrambled.slice(0, i + 1).filter(s => s === w).length
                return (
                  <button
                    key={i}
                    className={`word-chip ${isUsed ? 'used' : ''}`}
                    onClick={() => !answered && !isUsed && setWordOrderSelection([...wordOrderSelection, w])}
                    disabled={answered || isUsed}
                  >{w}</button>
                )
              })}
            </div>

            {answered && (
              <div className="card mt-16" style={{
                background: selectedAnswer === 'correct' ? 'rgba(76,175,80,0.1)' : 'rgba(231,76,60,0.1)',
                borderColor: selectedAnswer === 'correct' ? 'var(--green)' : 'var(--red)',
              }}>
                <p><strong>Correct order:</strong> {q.data.correct.join(' ')}</p>
              </div>
            )}
            {!answered && wordOrderSelection.length > 0 && (
              <button className="btn btn-primary mt-16" onClick={checkWordOrder}>Check Order</button>
            )}
          </>
        )}

        {/* Next button */}
        {answered && (
          <button className="btn btn-primary mt-16" onClick={nextQuestion}>
            {currentQ + 1 >= quiz.length ? 'See Results' : 'Next Question'}
          </button>
        )}
      </div>
    </div>
  )
}
