import { Link } from 'react-router-dom'

const categoryIcons = {
  doctrine: '\u{1F4DC}',
  prophecy: '\u{1F52E}',
  lifestyle: '\u{1F331}',
  character: '\u{1F451}',
}

const tierColors = {
  free: 'var(--green)',
  basic: 'var(--blue)',
  premium: 'var(--gold)',
}

export default function LessonCard({ lesson }) {
  const { id, title, category, tier, description, estimatedMinutes, locked, progress } = lesson

  return (
    <Link to={locked ? '/pricing' : `/lesson/${id}`} style={{ textDecoration: 'none' }}>
      <div className={`card card-clickable lesson-card ${locked ? 'lesson-locked' : ''}`}>
        <div className="flex-between mb-8">
          <span style={{ fontSize: '1.5rem' }}>{categoryIcons[category] || '\u{1F4D6}'}</span>
          <span className="tier-tag" style={{ color: tierColors[tier] || 'var(--text-muted)' }}>
            {locked ? '\u{1F512} ' : ''}{tier.toUpperCase()}
          </span>
        </div>
        <h3 style={{ color: locked ? 'var(--text-muted)' : 'var(--gold)', marginBottom: '4px', fontSize: '1rem' }}>
          {title}
        </h3>
        {description && (
          <p className="text-muted" style={{ fontSize: '0.8rem', marginBottom: '8px' }}>{description}</p>
        )}
        <div className="flex-between">
          <span className="text-muted" style={{ fontSize: '0.75rem' }}>{category}</span>
          {estimatedMinutes && (
            <span className="text-muted" style={{ fontSize: '0.75rem' }}>{estimatedMinutes} min</span>
          )}
        </div>
        {progress && !locked && (
          <div className="progress-bar" style={{ marginTop: '8px', height: '4px' }}>
            <div className="progress-fill" style={{ width: `${progress}%` }} />
          </div>
        )}
      </div>
    </Link>
  )
}
