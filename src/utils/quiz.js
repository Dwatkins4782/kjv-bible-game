// Quiz generation utilities

function shuffle(arr) {
  const a = [...arr]
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[a[i], a[j]] = [a[j], a[i]]
  }
  return a
}

// Fill in the blank: removes words from the verse
export function generateFillBlank(verse, difficulty = 'medium') {
  const words = verse.text.split(' ')
  let blankCount
  if (difficulty === 'easy') blankCount = Math.max(1, Math.floor(words.length * 0.15))
  else if (difficulty === 'medium') blankCount = Math.max(2, Math.floor(words.length * 0.3))
  else blankCount = Math.max(3, Math.floor(words.length * 0.5))

  const indices = shuffle(words.map((_, i) => i)).slice(0, blankCount).sort((a, b) => a - b)
  const blanks = indices.map(i => ({ index: i, word: words[i] }))
  const display = words.map((w, i) => indices.includes(i) ? '______' : w)

  return { display: display.join(' '), blanks, ref: verse.ref }
}

// Reference matching: given a verse text, pick the correct reference
export function generateRefMatch(verse, allVerses) {
  const others = allVerses.filter(v => v.ref !== verse.ref)
  const wrongRefs = shuffle(others).slice(0, 3).map(v => v.ref)
  const options = shuffle([verse.ref, ...wrongRefs])
  return { text: verse.text, correctRef: verse.ref, options }
}

// Verse completion: given the first part, pick the correct ending
export function generateVerseCompletion(verse, allVerses) {
  const words = verse.text.split(' ')
  const splitAt = Math.floor(words.length * 0.4)
  const beginning = words.slice(0, splitAt).join(' ') + '...'
  const correctEnding = '...' + words.slice(splitAt).join(' ')

  const wrongEndings = shuffle(allVerses.filter(v => v.ref !== verse.ref))
    .slice(0, 3)
    .map(v => {
      const w = v.text.split(' ')
      const s = Math.floor(w.length * 0.4)
      return '...' + w.slice(s).join(' ')
    })

  const options = shuffle([correctEnding, ...wrongEndings])
  return { beginning, correctEnding, options, ref: verse.ref }
}

// Word order: scramble verse words and user must reorder
export function generateWordOrder(verse, difficulty = 'medium') {
  const words = verse.text.split(' ')
  let segment
  if (difficulty === 'easy') {
    segment = words.slice(0, Math.min(6, words.length))
  } else if (difficulty === 'medium') {
    segment = words.slice(0, Math.min(12, words.length))
  } else {
    segment = words
  }
  return { scrambled: shuffle(segment), correct: segment, ref: verse.ref }
}

// Generate a mixed quiz from a set of verses
export function generateQuiz(verses, questionCount = 10, difficulty = 'medium') {
  const allVerses = [...verses]
  const questions = []
  const types = ['fillBlank', 'refMatch', 'completion', 'wordOrder']

  const selected = shuffle(allVerses).slice(0, questionCount)

  for (let i = 0; i < selected.length; i++) {
    const verse = selected[i]
    const type = types[i % types.length]

    switch (type) {
      case 'fillBlank':
        questions.push({ type: 'fillBlank', data: generateFillBlank(verse, difficulty), verse })
        break
      case 'refMatch':
        questions.push({ type: 'refMatch', data: generateRefMatch(verse, allVerses), verse })
        break
      case 'completion':
        questions.push({ type: 'completion', data: generateVerseCompletion(verse, allVerses), verse })
        break
      case 'wordOrder':
        questions.push({ type: 'wordOrder', data: generateWordOrder(verse, difficulty), verse })
        break
    }
  }

  return shuffle(questions)
}
