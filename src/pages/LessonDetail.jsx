import { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { lessonRegistry, loadLesson } from '../data/lessons/index'
import { useContentAccess } from '../hooks/useContentAccess'
import { useLocalStorage } from '../hooks/useLocalStorage'
import LessonContent from '../components/lessons/LessonContent'
import UpgradePrompt from '../components/subscription/UpgradePrompt'
import AudioReciteButton from '../components/subscription/AudioReciteButton'

export default function LessonDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const { canAccessLesson } = useContentAccess()
  const [lesson, setLesson] = useState(null)
  const [loading, setLoading] = useState(true)
  const [lessonProgress, setLessonProgress] = useLocalStorage('kjv-lesson-progress', {})

  const meta = lessonRegistry.find(l => l.id === id)

  useEffect(() => {
    if (!meta) {
      navigate('/lessons')
      return
    }

    if (!canAccessLesson(meta.tier)) {
      setLoading(false)
      return
    }

    loadLesson(id).then(data => {
      setLesson(data)
      setLoading(false)
    }).catch(() => setLoading(false))
  }, [id, meta])

  if (loading) {
    return (
      <div className="text-center" style={{ padding: '60px 20px' }}>
        <p className="text-muted">Loading lesson...</p>
      </div>
    )
  }

  if (!meta) return null

  // Show upgrade prompt if locked
  if (!canAccessLesson(meta.tier)) {
    return (
      <div className="fade-in">
        <Link to="/lessons" className="btn btn-secondary btn-sm mb-16">Back to Lessons</Link>
        <div className="card" style={{ textAlign: 'center', padding: '40px 20px' }}>
          <h2 className="text-gold mb-8">{meta.title}</h2>
          <p className="text-muted mb-16">{meta.description}</p>
          <UpgradePrompt requiredTier={meta.tier} feature={`the "${meta.title}" lesson`} />
        </div>
      </div>
    )
  }

  if (!lesson) {
    return (
      <div className="fade-in">
        <Link to="/lessons" className="btn btn-secondary btn-sm mb-16">Back to Lessons</Link>
        <p className="text-muted">Lesson content not available.</p>
      </div>
    )
  }

  const completedSections = lessonProgress[id]?.completedSections || []
  const progress = lesson.sections.length > 0
    ? Math.round((completedSections.length / lesson.sections.length) * 100)
    : 0

  function handleCompleteSection(index) {
    const current = lessonProgress[id] || { completedSections: [] }
    if (!current.completedSections.includes(index)) {
      const updated = {
        ...lessonProgress,
        [id]: {
          ...current,
          completedSections: [...current.completedSections, index],
          started: true,
          completed: current.completedSections.length + 1 >= lesson.sections.length,
        },
      }
      setLessonProgress(updated)
    }
  }

  return (
    <div className="fade-in">
      <Link to="/lessons" className="btn btn-secondary btn-sm mb-16">Back to Lessons</Link>

      {/* Lesson header */}
      <div className="card" style={{ textAlign: 'center' }}>
        <span className="category-tag mb-8">{meta.category}</span>
        <h2 className="text-gold" style={{ margin: '8px 0' }}>{lesson.title}</h2>
        <p className="text-muted" style={{ fontSize: '0.9rem' }}>{lesson.description}</p>
        <div className="flex-between mt-16" style={{ justifyContent: 'center', gap: '20px' }}>
          <span className="text-muted" style={{ fontSize: '0.8rem' }}>{lesson.estimatedMinutes} min read</span>
          <span className="text-muted" style={{ fontSize: '0.8rem' }}>{lesson.sections.length} sections</span>
          <span style={{ fontSize: '0.8rem', color: progress === 100 ? 'var(--green)' : 'var(--gold)' }}>
            {progress}% complete
          </span>
        </div>
        <div className="progress-bar mt-16" style={{ height: '6px' }}>
          <div className="progress-fill" style={{ width: `${progress}%` }} />
        </div>
      </div>

      {/* Scripture references */}
      <div className="card">
        <h3 className="text-gold mb-8">Scripture References</h3>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
          {lesson.scriptureReferences.map((ref, i) => (
            <span key={i} className="category-tag">{ref}</span>
          ))}
        </div>
      </div>

      {/* Sections */}
      {lesson.sections.map((section, i) => (
        <LessonContent
          key={i}
          section={section}
          sectionIndex={i}
          isCompleted={completedSections.includes(i)}
          onComplete={handleCompleteSection}
        />
      ))}

      {/* Discussion Questions */}
      {lesson.discussionQuestions && lesson.discussionQuestions.length > 0 && (
        <div className="card">
          <h3 className="text-gold mb-16">Discussion Questions</h3>
          <ol style={{ paddingLeft: '20px' }}>
            {lesson.discussionQuestions.map((q, i) => (
              <li key={i} style={{ marginBottom: '12px', lineHeight: '1.6', color: 'var(--text)' }}>{q}</li>
            ))}
          </ol>
        </div>
      )}

      {/* Key Takeaways */}
      {lesson.keyTakeaways && lesson.keyTakeaways.length > 0 && (
        <div className="card" style={{ borderColor: 'var(--gold-dark)' }}>
          <h3 className="text-gold mb-16">Key Takeaways</h3>
          <ul style={{ listStyle: 'none', padding: 0 }}>
            {lesson.keyTakeaways.map((t, i) => (
              <li key={i} style={{ marginBottom: '10px', paddingLeft: '20px', position: 'relative', lineHeight: '1.6' }}>
                <span style={{ position: 'absolute', left: 0, color: 'var(--gold)' }}>{'\u2022'}</span>
                {t}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Completion */}
      {progress === 100 && (
        <div className="card" style={{ textAlign: 'center', background: 'rgba(76,175,80,0.08)', borderColor: 'var(--green)' }}>
          <div style={{ fontSize: '2rem', marginBottom: '8px' }}>{'\u{1F3C6}'}</div>
          <h3 style={{ color: 'var(--green)' }}>Lesson Complete!</h3>
          <p className="text-muted">Well done, good and faithful servant.</p>
          <Link to="/lessons" className="btn btn-primary mt-16">More Lessons</Link>
        </div>
      )}
    </div>
  )
}
