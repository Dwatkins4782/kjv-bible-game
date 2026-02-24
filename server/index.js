const express = require('express')
const cors = require('cors')

const app = express()
const PORT = process.env.PORT || 3001

app.use(cors())
app.use(express.json())

// KJV verse data
const verses = {
  salvation: [
    { ref: 'John 3:16', text: 'For God so loved the world, that he gave his only begotten Son, that whosoever believeth in him should not perish, but have everlasting life.' },
    { ref: 'Romans 3:23', text: 'For all have sinned, and come short of the glory of God;' },
    { ref: 'Romans 6:23', text: 'For the wages of sin is death; but the gift of God is eternal life through Jesus Christ our Lord.' },
    { ref: 'Romans 10:9', text: 'That if thou shalt confess with thy mouth the Lord Jesus, and shalt believe in thine heart that God hath raised him from the dead, thou shalt be saved.' },
    { ref: 'Ephesians 2:8-9', text: 'For by grace are ye saved through faith; and that not of yourselves: it is the gift of God: Not of works, lest any man should boast.' },
    { ref: 'Acts 4:12', text: 'Neither is there salvation in any other: for there is none other name under heaven given among men, whereby we must be saved.' },
    { ref: 'John 14:6', text: 'Jesus saith unto him, I am the way, the truth, and the life: no man cometh unto the Father, but by me.' },
    { ref: 'Romans 5:8', text: 'But God commendeth his love toward us, in that, while we were yet sinners, Christ died for us.' },
    { ref: 'Titus 3:5', text: 'Not by works of righteousness which we have done, but according to his mercy he saved us, by the washing of regeneration, and renewing of the Holy Ghost;' },
    { ref: 'John 1:12', text: 'But as many as received him, to them gave he power to become the sons of God, even to them that believe on his name:' },
  ],
  faith: [
    { ref: 'Hebrews 11:1', text: 'Now faith is the substance of things hoped for, the evidence of things not seen.' },
    { ref: 'Hebrews 11:6', text: 'But without faith it is impossible to please him: for he that cometh to God must believe that he is, and that he is a rewarder of them that diligently seek him.' },
    { ref: 'Romans 10:17', text: 'So then faith cometh by hearing, and hearing by the word of God.' },
    { ref: '2 Corinthians 5:7', text: 'For we walk by faith, not by sight:' },
    { ref: 'James 2:17', text: 'Even so faith, if it hath not works, is dead, being alone.' },
    { ref: 'Mark 11:22-23', text: 'And Jesus answering saith unto them, Have faith in God. For verily I say unto you, That whosoever shall say unto this mountain, Be thou removed, and be thou cast into the sea; and shall not doubt in his heart, but shall believe that those things which he saith shall come to pass; he shall have whatsoever he saith.' },
    { ref: 'Matthew 17:20', text: 'And Jesus said unto them, Because of your unbelief: for verily I say unto you, If ye have faith as a grain of mustard seed, ye shall say unto this mountain, Remove hence to yonder place; and it shall remove; and nothing shall be impossible unto you.' },
    { ref: 'Galatians 2:20', text: 'I am crucified with Christ: nevertheless I live; yet not I, but Christ liveth in me: and the life which I now live in the flesh I live by the faith of the Son of God, who loved me, and gave himself for me.' },
  ],
  strength: [
    { ref: 'Philippians 4:13', text: 'I can do all things through Christ which strengtheneth me.' },
    { ref: 'Isaiah 40:31', text: 'But they that wait upon the LORD shall renew their strength; they shall mount up with wings as eagles; they shall run, and not be weary; and they shall walk, and not faint.' },
    { ref: 'Joshua 1:9', text: 'Have not I commanded thee? Be strong and of a good courage; be not afraid, neither be thou dismayed: for the LORD thy God is with thee whithersoever thou goest.' },
    { ref: '2 Timothy 1:7', text: 'For God hath not given us the spirit of fear; but of power, and of love, and of a sound mind.' },
    { ref: 'Psalm 46:1', text: 'God is our refuge and strength, a very present help in trouble.' },
    { ref: 'Isaiah 41:10', text: 'Fear thou not; for I am with thee: be not dismayed; for I am thy God: I will strengthen thee; yea, I will help thee; yea, I will uphold thee with the right hand of my righteousness.' },
    { ref: 'Deuteronomy 31:6', text: 'Be strong and of a good courage, fear not, nor be afraid of them: for the LORD thy God, he it is that doth go with thee; he will not fail thee, nor forsake thee.' },
    { ref: 'Nehemiah 8:10', text: 'Then he said unto them, Go your way, eat the fat, and drink the sweet, and send portions unto them for whom nothing is prepared: for this day is holy unto our Lord: neither be ye sorry; for the joy of the LORD is your strength.' },
  ],
  peace: [
    { ref: 'Philippians 4:6-7', text: 'Be careful for nothing; but in every thing by prayer and supplication with thanksgiving let your requests be made known unto God. And the peace of God, which passeth all understanding, shall keep your hearts and minds through Christ Jesus.' },
    { ref: 'John 14:27', text: 'Peace I leave with you, my peace I give unto you: not as the world giveth, give I unto you. Let not your heart be troubled, neither let it be afraid.' },
    { ref: 'Isaiah 26:3', text: 'Thou wilt keep him in perfect peace, whose mind is stayed on thee: because he trusteth in thee.' },
    { ref: 'Romans 8:28', text: 'And we know that all things work together for good to them that love God, to them who are the called according to his purpose.' },
    { ref: 'Psalm 23:1-3', text: 'The LORD is my shepherd; I shall not want. He maketh me to lie down in green pastures: he leadeth me beside the still waters. He restoreth my soul: he leadeth me in the paths of righteousness for his name\'s sake.' },
    { ref: 'Matthew 11:28-30', text: 'Come unto me, all ye that labour and are heavy laden, and I will give you rest. Take my yoke upon you, and learn of me; for I am meek and lowly in heart: and ye shall find rest unto your souls. For my yoke is easy, and my burden is light.' },
    { ref: 'Psalm 29:11', text: 'The LORD will give strength unto his people; the LORD will bless his people with peace.' },
  ],
  love: [
    { ref: '1 Corinthians 13:4-7', text: 'Charity suffereth long, and is kind; charity envieth not; charity vaunteth not itself, is not puffed up, Doth not behave itself unseemly, seeketh not her own, is not easily provoked, thinketh no evil; Rejoiceth not in iniquity, but rejoiceth in the truth; Beareth all things, believeth all things, hopeth all things, endureth all things.' },
    { ref: '1 John 4:8', text: 'He that loveth not knoweth not God; for God is love.' },
    { ref: '1 John 4:19', text: 'We love him, because he first loved us.' },
    { ref: 'John 15:13', text: 'Greater love hath no man than this, that a man lay down his life for his friends.' },
    { ref: 'Romans 8:38-39', text: 'For I am persuaded, that neither death, nor life, nor angels, nor principalities, nor powers, nor things present, nor things to come, Nor height, nor depth, nor any other creature, shall be able to separate us from the love of God, which is in Christ Jesus our Lord.' },
    { ref: '1 John 3:18', text: 'My little children, let us not love in word, neither in tongue; but in deed and in truth.' },
    { ref: 'Mark 12:30-31', text: 'And thou shalt love the Lord thy God with all thy heart, and with all thy soul, and with all thy mind, and with all thy strength: this is the first commandment. And the second is like, namely this, Thou shalt love thy neighbour as thyself. There is none other commandment greater than these.' },
  ],
  wisdom: [
    { ref: 'Proverbs 3:5-6', text: 'Trust in the LORD with all thine heart; and lean not unto thine own understanding. In all thy ways acknowledge him, and he shall direct thy paths.' },
    { ref: 'James 1:5', text: 'If any of you lack wisdom, let him ask of God, that giveth to all men liberally, and upbraideth not; and it shall be given him.' },
    { ref: 'Proverbs 9:10', text: 'The fear of the LORD is the beginning of wisdom: and the knowledge of the holy is understanding.' },
    { ref: 'Psalm 119:105', text: 'Thy word is a lamp unto my feet, and a light unto my path.' },
    { ref: 'Colossians 3:16', text: 'Let the word of Christ dwell in you richly in all wisdom; teaching and admonishing one another in psalms and hymns and spiritual songs, singing with grace in your hearts to the Lord.' },
    { ref: 'Proverbs 2:6', text: 'For the LORD giveth wisdom: out of his mouth cometh knowledge and understanding.' },
    { ref: 'Psalm 111:10', text: 'The fear of the LORD is the beginning of wisdom: a good understanding have all they that do his commandments: his praise endureth for ever.' },
    { ref: '2 Timothy 3:16-17', text: 'All scripture is given by inspiration of God, and is profitable for doctrine, for reproof, for correction, for instruction in righteousness: That the man of God may be perfect, throughly furnished unto all good works.' },
  ],
  prayer: [
    { ref: 'Jeremiah 29:12', text: 'Then shall ye call upon me, and ye shall go and pray unto me, and I will hearken unto you.' },
    { ref: '1 Thessalonians 5:17', text: 'Pray without ceasing.' },
    { ref: 'Matthew 6:6', text: 'But thou, when thou prayest, enter into thy closet, and when thou hast shut thy door, pray to thy Father which is in secret; and thy Father which seeth in secret shall reward thee openly.' },
    { ref: 'James 5:16', text: 'Confess your faults one to another, and pray one for another, that ye may be healed. The effectual fervent prayer of a righteous man availeth much.' },
    { ref: 'Psalm 145:18', text: 'The LORD is nigh unto all them that call upon him, to all that call upon him in truth.' },
    { ref: '1 John 5:14', text: 'And this is the confidence that we have in him, that, if we ask any thing according to his will, he heareth us:' },
    { ref: 'Matthew 7:7', text: 'Ask, and it shall be given you; seek, and ye shall find; knock, and it shall be opened unto you:' },
    { ref: 'Philippians 4:6', text: 'Be careful for nothing; but in every thing by prayer and supplication with thanksgiving let your requests be made known unto God.' },
  ],
  promises: [
    { ref: 'Jeremiah 29:11', text: 'For I know the thoughts that I think toward you, saith the LORD, thoughts of peace, and not of evil, to give you an expected end.' },
    { ref: 'Romans 8:31', text: 'What shall we then say to these things? If God be for us, who can be against us?' },
    { ref: 'Psalm 37:4', text: 'Delight thyself also in the LORD; and he shall give thee the desires of thine heart.' },
    { ref: 'Isaiah 54:17', text: 'No weapon that is formed against thee shall prosper; and every tongue that shall rise against thee in judgment thou shalt condemn. This is the heritage of the servants of the LORD, and their righteousness is of me, saith the LORD.' },
    { ref: 'Malachi 3:10', text: 'Bring ye all the tithes into the storehouse, that there may be meat in mine house, and prove me now herewith, saith the LORD of hosts, if I will not open you the windows of heaven, and pour you out a blessing, that there shall not be room enough to receive it.' },
    { ref: 'Psalm 91:1-2', text: 'He that dwelleth in the secret place of the most High shall abide under the shadow of the Almighty. I will say of the LORD, He is my refuge and my fortress: my God; in him will I trust.' },
    { ref: 'Matthew 28:20', text: 'Teaching them to observe all things whatsoever I have commanded you: and, lo, I am with you always, even unto the end of the world. Amen.' },
    { ref: 'Revelation 21:4', text: 'And God shall wipe away all tears from their eyes; and there shall be no more death, neither sorrow, nor crying, neither shall there be any more pain: for the former things are passed away.' },
  ],
}

// Flatten all verses with category attached
function getAllVerses() {
  const all = []
  for (const [category, list] of Object.entries(verses)) {
    for (const v of list) {
      all.push({ ...v, category })
    }
  }
  return all
}

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() })
})

// GET /api/categories – list all categories
app.get('/api/categories', (req, res) => {
  res.json(Object.keys(verses))
})

// GET /api/verses – all verses, optionally filtered by ?category=
app.get('/api/verses', (req, res) => {
  const { category } = req.query
  if (category) {
    const list = verses[category]
    if (!list) {
      return res.status(404).json({ error: `Category "${category}" not found` })
    }
    return res.json(list.map(v => ({ ...v, category })))
  }
  res.json(getAllVerses())
})

// GET /api/verses/:ref – single verse by reference (e.g. "John 3:16")
app.get('/api/verses/:ref', (req, res) => {
  const ref = decodeURIComponent(req.params.ref)
  const verse = getAllVerses().find(v => v.ref.toLowerCase() === ref.toLowerCase())
  if (!verse) {
    return res.status(404).json({ error: `Verse "${ref}" not found` })
  }
  res.json(verse)
})

app.listen(PORT, () => {
  console.log(`KJV Bible Game API running on port ${PORT}`)
})
