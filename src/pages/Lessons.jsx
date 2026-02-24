import { useState } from 'react'
import { lessonRegistry, lessonCategories } from '../data/lessons/index'
import { useContentAccess } from '../hooks/useContentAccess'
import LessonCard from '../components/lessons/LessonCard'

export default function Lessons() {
  const [selectedCategory, setSelectedCategory] = useState(null)
  const { canAccessLesson } = useContentAccess()

  const filteredLessons = lessonRegistry
    .filter(l => !selectedCategory || l.category === selectedCategory)
    .map(l => ({
      ...l,
      locked: !canAccessLesson(l.tier),
    }))

  const freeCount = lessonRegistry.filter(l => l.tier === 'free').length
  const totalCount = lessonRegistry.length

  return (
    <div className="fade-in">
      <div style={{ marginBottom: '20px' }}>
        <h2 className="text-gold mb-8">Bible Lessons</h2>
        <p className="text-muted" style={{ fontSize: '0.9rem' }}>
          In-depth KJV Bible studies with scripture, discussion questions, and key takeaways.
          {freeCount} lessons free &bull; {totalCount} total
        </p>
      </div>

      {/* Category filter */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '20px' }}>
        <button
          className={`word-chip ${!selectedCategory ? '' : 'used'}`}
          style={!selectedCategory ? { background: 'var(--gold-dark)', color: '#fff' } : {}}
          onClick={() => setSelectedCategory(null)}
        >All ({totalCount})</button>
        {lessonCategories.map(cat => {
          const count = lessonRegistry.filter(l => l.category === cat.id).length
          return (
            <button
              key={cat.id}
              className={`word-chip ${selectedCategory === cat.id ? '' : 'used'}`}
              style={selectedCategory === cat.id ? { background: 'var(--gold-dark)', color: '#fff' } : {}}
              onClick={() => setSelectedCategory(cat.id)}
            >
              {cat.icon} {cat.name} ({count})
            </button>
          )
        })}
      </div>

      {/* Lesson grid */}
      <div className="category-grid">
        {filteredLessons.map(lesson => (
          <LessonCard key={lesson.id} lesson={lesson} />
        ))}
      </div>

      {filteredLessons.length === 0 && (
        <p className="text-center text-muted" style={{ marginTop: '30px' }}>
          No lessons in this category yet.
        </p>
      )}
    </div>
  )
}
