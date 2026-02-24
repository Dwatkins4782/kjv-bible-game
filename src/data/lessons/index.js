// Master lesson registry — lightweight metadata for listing
// Full content is lazy-loaded from individual files

export const lessonRegistry = [
  // FREE TIER (3 lessons)
  { id: 'the-sabbath', title: 'The Sabbath', category: 'doctrine', tier: 'free', description: 'A study of God\'s holy seventh-day Sabbath from Creation through the New Testament.', estimatedMinutes: 25 },
  { id: 'the-judgment', title: 'The Judgment', category: 'doctrine', tier: 'free', description: 'Understanding the Biblical teaching of God\'s judgment and what it means for every soul.', estimatedMinutes: 20 },
  { id: 'hells-fire', title: 'Hell\'s Fire & State of the Dead', category: 'doctrine', tier: 'free', description: 'What the Bible truly teaches about death, hell, and God\'s consuming fire.', estimatedMinutes: 25 },

  // BASIC TIER (7 lessons)
  { id: 'babylon', title: 'Babylon & The Second Angel\'s Message', category: 'prophecy', tier: 'basic', description: 'Identifying who Babylon is and why she is considered fallen.', estimatedMinutes: 30 },
  { id: 'seven-churches', title: 'Seven Churches of Revelation', category: 'prophecy', tier: 'basic', description: 'A study of the seven churches in Revelation and their prophetic significance.', estimatedMinutes: 35 },
  { id: 'abomination-desolation', title: 'The Abomination of Desolation', category: 'prophecy', tier: 'basic', description: 'Understanding what stands in the holy place in the last days.', estimatedMinutes: 20 },
  { id: 'armageddon', title: 'Armageddon & End Times', category: 'prophecy', tier: 'basic', description: 'How Satan is preparing the world for the final battle and how God\'s people can be ready.', estimatedMinutes: 25 },
  { id: 'daniels-prophecies', title: 'Daniel\'s Prophecies', category: 'prophecy', tier: 'basic', description: 'The 70 weeks, the image of Daniel 2, and the timeline of world empires.', estimatedMinutes: 35 },
  { id: 'revelation-symbols', title: 'Revelation Symbols', category: 'prophecy', tier: 'basic', description: 'Decoding the beasts, horns, seals, and trumpets of Revelation.', estimatedMinutes: 30 },
  { id: 'the-sanctuary', title: 'The Sanctuary & Heavenly Service', category: 'doctrine', tier: 'basic', description: 'The earthly sanctuary as a pattern of Christ\'s ministry in heaven.', estimatedMinutes: 30 },

  // PREMIUM TIER (8 lessons)
  { id: 'the-144000', title: 'The 144,000 & Special Resurrection', category: 'prophecy', tier: 'premium', description: 'Who are the 144,000 and what is the special resurrection?', estimatedMinutes: 25 },
  { id: 'three-angels-messages', title: 'The Three Angels\' Messages', category: 'prophecy', tier: 'premium', description: 'God\'s final warning to the world found in Revelation 14.', estimatedMinutes: 30 },
  { id: 'health-temperance', title: 'Health & Temperance', category: 'lifestyle', tier: 'premium', description: 'What the Bible teaches about caring for the body temple and avoiding harmful substances.', estimatedMinutes: 20 },
  { id: 'virtuous-woman', title: 'The Virtuous Woman (Proverbs 31)', category: 'character', tier: 'premium', description: 'A study of the Proverbs 31 woman and godly character.', estimatedMinutes: 20 },
  { id: 'persecution-last-days', title: 'Persecution in the Last Days', category: 'prophecy', tier: 'premium', description: 'What Jesus warned about persecution in Matthew 24 and how to stand firm.', estimatedMinutes: 20 },
  { id: 'confession-forgiveness', title: 'Confession & Forgiveness', category: 'character', tier: 'premium', description: 'Is confession to a human priest necessary? What the Bible says about forgiveness.', estimatedMinutes: 15 },
  { id: 'second-coming', title: 'The Second Coming of Christ', category: 'doctrine', tier: 'premium', description: 'The manner, signs, and certainty of Christ\'s return.', estimatedMinutes: 25 },
  { id: 'new-earth-heaven', title: 'The New Earth & Heaven', category: 'doctrine', tier: 'premium', description: 'God\'s promise of a restored earth and eternal life for His people.', estimatedMinutes: 20 },
]

export const lessonCategories = [
  { id: 'doctrine', name: 'Doctrine', icon: '\u{1F4DC}' },
  { id: 'prophecy', name: 'Prophecy', icon: '\u{1F52E}' },
  { id: 'lifestyle', name: 'Lifestyle', icon: '\u{1F331}' },
  { id: 'character', name: 'Character', icon: '\u{1F451}' },
]

// Lazy loader for full lesson content
// Uses explicit mapping for Vite's static analysis of dynamic imports
const lessonModules = import.meta.glob('./*.js', { import: 'default' })

export async function loadLesson(id) {
  try {
    const key = `./${id}.js`
    if (!lessonModules[key]) {
      console.error(`Lesson module not found: ${id}`)
      return null
    }
    return await lessonModules[key]()
  } catch (e) {
    console.error(`Failed to load lesson: ${id}`, e)
    return null
  }
}
