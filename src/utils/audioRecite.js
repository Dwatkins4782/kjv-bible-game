// Audio Recite feature — Text-to-speech for KJV scriptures
// Uses the Web Speech API (SpeechSynthesis) for cross-platform voice reading

let currentUtterance = null

export function isAudioSupported() {
  return 'speechSynthesis' in window
}

export function getAvailableVoices() {
  if (!isAudioSupported()) return []
  return window.speechSynthesis.getVoices().filter(v =>
    v.lang.startsWith('en')
  )
}

// Get a good default voice (prefer natural/high-quality voices)
function getBestVoice() {
  const voices = getAvailableVoices()
  // Prefer voices with "Natural", "Enhanced", or "Premium" in name
  const premium = voices.find(v =>
    /natural|enhanced|premium/i.test(v.name)
  )
  if (premium) return premium

  // Prefer US English
  const usVoice = voices.find(v => v.lang === 'en-US')
  if (usVoice) return usVoice

  // Fallback to any English voice
  return voices[0] || null
}

export function speakVerse(text, reference, options = {}) {
  if (!isAudioSupported()) {
    console.warn('Speech synthesis not supported')
    return null
  }

  // Stop any current speech
  stopSpeaking()

  const {
    rate = 0.85,      // Slightly slower for scripture reading
    pitch = 1.0,
    volume = 1.0,
    onStart,
    onEnd,
    onWord,
    onError,
    includeReference = true,
  } = options

  // Build the speech text — read the reference first, then the verse
  const fullText = includeReference
    ? `${reference}. ${text}`
    : text

  const utterance = new SpeechSynthesisUtterance(fullText)
  const voice = getBestVoice()
  if (voice) utterance.voice = voice

  utterance.rate = rate
  utterance.pitch = pitch
  utterance.volume = volume
  utterance.lang = 'en-US'

  if (onStart) utterance.onstart = onStart
  if (onEnd) utterance.onend = onEnd
  if (onError) utterance.onerror = onError
  if (onWord) utterance.onboundary = (e) => {
    if (e.name === 'word') onWord(e)
  }

  currentUtterance = utterance
  window.speechSynthesis.speak(utterance)

  return utterance
}

export function stopSpeaking() {
  if (isAudioSupported()) {
    window.speechSynthesis.cancel()
  }
  currentUtterance = null
}

export function pauseSpeaking() {
  if (isAudioSupported()) {
    window.speechSynthesis.pause()
  }
}

export function resumeSpeaking() {
  if (isAudioSupported()) {
    window.speechSynthesis.resume()
  }
}

export function isSpeaking() {
  if (!isAudioSupported()) return false
  return window.speechSynthesis.speaking
}

export function isPaused() {
  if (!isAudioSupported()) return false
  return window.speechSynthesis.paused
}
