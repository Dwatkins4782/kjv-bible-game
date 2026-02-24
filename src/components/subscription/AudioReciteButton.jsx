import { useState, useEffect } from 'react'
import { speakVerse, stopSpeaking, pauseSpeaking, resumeSpeaking, isSpeaking, isPaused, isAudioSupported } from '../../utils/audioRecite'
import { useContentAccess } from '../../hooks/useContentAccess'
import { Link } from 'react-router-dom'

export default function AudioReciteButton({ text, reference, showUpgrade = true }) {
  const { hasAudioRecite } = useContentAccess()
  const [playing, setPlaying] = useState(false)
  const [paused, setPaused] = useState(false)

  useEffect(() => {
    return () => stopSpeaking()
  }, [])

  if (!isAudioSupported()) return null

  // Show locked state for non-premium users
  if (!hasAudioRecite) {
    if (!showUpgrade) return null
    return (
      <Link to="/pricing" className="btn btn-sm audio-locked-btn" title="Upgrade to Premium for Audio Recite">
        &#128274; Audio
      </Link>
    )
  }

  function handlePlay() {
    if (playing && !paused) {
      pauseSpeaking()
      setPaused(true)
      return
    }

    if (paused) {
      resumeSpeaking()
      setPaused(false)
      return
    }

    setPlaying(true)
    setPaused(false)
    speakVerse(text, reference, {
      onEnd: () => { setPlaying(false); setPaused(false) },
      onError: () => { setPlaying(false); setPaused(false) },
    })
  }

  function handleStop() {
    stopSpeaking()
    setPlaying(false)
    setPaused(false)
  }

  return (
    <div className="audio-recite-controls">
      <button
        className={`btn btn-sm ${playing ? 'btn-primary' : 'btn-secondary'}`}
        onClick={handlePlay}
        title={playing ? (paused ? 'Resume' : 'Pause') : 'Listen to this verse'}
      >
        {playing ? (paused ? '\u25B6 Resume' : '\u23F8 Pause') : '\u{1F50A} Listen'}
      </button>
      {playing && (
        <button className="btn btn-sm btn-danger" onClick={handleStop} title="Stop">
          \u23F9
        </button>
      )}
    </div>
  )
}
