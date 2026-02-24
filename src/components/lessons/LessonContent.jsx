import AudioReciteButton from '../subscription/AudioReciteButton'

export default function LessonContent({ section, sectionIndex, isCompleted, onComplete }) {
  return (
    <div className={`card lesson-section ${isCompleted ? 'section-completed' : ''}`}>
      <div className="flex-between mb-8">
        <h3 style={{ color: 'var(--gold)', fontSize: '1.05rem' }}>
          {sectionIndex + 1}. {section.title}
        </h3>
        {isCompleted && <span style={{ color: 'var(--green)' }}>\u2713</span>}
      </div>

      <div className="lesson-text mb-16">{section.content}</div>

      {section.scriptures && section.scriptures.length > 0 && (
        <div className="lesson-scriptures mb-16">
          {section.scriptures.map((s, i) => (
            <div key={i} className="scripture-block">
              <div className="flex-between mb-8">
                <span className="verse-ref">{s.ref}</span>
                <AudioReciteButton text={s.text} reference={s.ref} />
              </div>
              <p className="verse-text" style={{ fontSize: '0.95rem' }}>{s.text}</p>
            </div>
          ))}
        </div>
      )}

      {section.keyPoint && (
        <div className="key-point">
          <strong>Key Point:</strong> {section.keyPoint}
        </div>
      )}

      {!isCompleted && (
        <button className="btn btn-sm btn-secondary mt-16" onClick={() => onComplete(sectionIndex)}>
          Mark Section Complete
        </button>
      )}
    </div>
  )
}
