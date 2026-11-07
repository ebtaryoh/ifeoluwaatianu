'use client'

import { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Disc3, Music, Pause, Play, Volume2, VolumeX } from 'lucide-react'

export function AudioPlayer() {
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [isMuted, setIsMuted] = useState(false)
  const [autoplayBlocked, setAutoplayBlocked] = useState(false)
  const [hasStartedOnce, setHasStartedOnce] = useState(false)
  const [isExpanded, setIsExpanded] = useState(false)

  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return

    audio.volume = 0.65

    // Attempt direct autoplay
    const startAudio = async () => {
      try {
        await audio.play()
        setIsPlaying(true)
        setAutoplayBlocked(false)
        setHasStartedOnce(true)
      } catch {
        // Browser blocked unmuted autoplay without prior interaction
        setAutoplayBlocked(true)
        setIsPlaying(false)
      }
    }

    startAudio()

    // Fallback: start on the very first user interaction anywhere on the screen
    const handleFirstUserGesture = () => {
      if (audio && audio.paused) {
        audio.play().then(() => {
          setIsPlaying(true)
          setAutoplayBlocked(false)
          setHasStartedOnce(true)
        }).catch(() => {})
      }
      cleanupListeners()
    }

    const events = ['click', 'touchstart', 'scroll', 'keydown', 'pointerdown']
    const cleanupListeners = () => {
      events.forEach((evt) => window.removeEventListener(evt, handleFirstUserGesture))
    }

    events.forEach((evt) => {
      window.addEventListener(evt, handleFirstUserGesture, { once: true, passive: true })
    })

    return () => {
      cleanupListeners()
    }
  }, [])

  const togglePlay = () => {
    const audio = audioRef.current
    if (!audio) return

    if (isPlaying) {
      audio.pause()
      setIsPlaying(false)
    } else {
      audio.play().then(() => {
        setIsPlaying(true)
        setAutoplayBlocked(false)
        setHasStartedOnce(true)
      }).catch((err) => {
        console.warn('Playback error:', err)
      })
    }
  }

  const toggleMute = (e: React.MouseEvent) => {
    e.stopPropagation()
    const audio = audioRef.current
    if (!audio) return
    audio.muted = !isMuted
    setIsMuted(!isMuted)
  }

  return (
    <>
      <audio
        ref={audioRef}
        src="/audio/wedding-song.mp3"
        preload="auto"
        loop
        playsInline
      >
        <source src="/audio/wedding-song.mp3" type="audio/mpeg" />
        <source src="/audio/wedding-song.mpeg" type="audio/mpeg" />
      </audio>

      {/* Floating Audio Controller */}
      <div className="audio-controller-container" style={{ position: 'fixed', bottom: '24px', right: '24px', zIndex: 90 }}>
        {/* Floating blocked notification banner */}
        <AnimatePresence>
          {autoplayBlocked && !hasStartedOnce && (
            <motion.button
              onClick={togglePlay}
              initial={{ opacity: 0, y: 15, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.95 }}
              transition={{ duration: 0.4 }}
              className="music-prompt-banner glassmorphism-dark"
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                padding: '10px 16px',
                marginBottom: '10px',
                color: '#fff',
                fontSize: '11px',
                letterSpacing: '0.08em',
                textTransform: 'uppercase',
                borderRadius: '50px',
                cursor: 'pointer',
                border: '1px solid rgba(173, 139, 92, 0.4)',
                boxShadow: '0 8px 30px rgba(0,0,0,0.3)',
              }}
            >
              <Music className="w-3.5 h-3.5 text-[#ad8b5c] animate-pulse" />
              <span>Tap to Play Wedding Song ♫</span>
            </motion.button>
          )}
        </AnimatePresence>

        {/* Main Floating Music Pill */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 1 }}
          className="music-player-pill glassmorphism"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            padding: '8px 14px 8px 8px',
            borderRadius: '9999px',
            boxShadow: '0 12px 35px rgba(0, 0, 0, 0.15)',
            border: '1px solid rgba(173, 139, 92, 0.35)',
            background: 'rgba(252, 250, 247, 0.92)',
            backdropFilter: 'blur(16px)',
            WebkitBackdropFilter: 'blur(16px)',
          }}
        >
          {/* Rotating Vinyl Record */}
          <button
            onClick={togglePlay}
            aria-label={isPlaying ? 'Pause wedding soundtrack' : 'Play wedding soundtrack'}
            style={{
              position: 'relative',
              width: '42px',
              height: '42px',
              borderRadius: '50%',
              background: 'linear-gradient(135deg, #1c1814, #362f28)',
              display: 'grid',
              placeItems: 'center',
              border: '2px solid var(--gold)',
              cursor: 'pointer',
              padding: 0,
              boxShadow: isPlaying ? '0 0 15px rgba(173, 139, 92, 0.4)' : 'none',
              transition: 'box-shadow 0.3s ease',
            }}
          >
            <motion.div
              animate={{ rotate: isPlaying ? 360 : 0 }}
              transition={{ repeat: Infinity, duration: 4, ease: 'linear' }}
              style={{ display: 'grid', placeItems: 'center', width: '100%', height: '100%' }}
            >
              <Disc3 className="w-5 h-5 text-[#ad8b5c]" />
            </motion.div>

            {/* Play/Pause center overlay indicator */}
            <div
              style={{
                position: 'absolute',
                inset: 0,
                display: 'grid',
                placeItems: 'center',
                background: 'rgba(0,0,0,0.3)',
                borderRadius: '50%',
                opacity: isPlaying ? 0 : 0.8,
                transition: 'opacity 0.2s',
              }}
            >
              <Play className="w-3.5 h-3.5 text-white fill-white ml-0.5" />
            </div>
          </button>

          {/* Song Info & Equalizer */}
          <div
            onClick={togglePlay}
            style={{ display: 'flex', flexDirection: 'column', cursor: 'pointer', minWidth: '95px' }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span
                style={{
                  fontFamily: "'Playfair Display', serif",
                  fontSize: '13px',
                  fontWeight: 600,
                  color: 'var(--ink)',
                  letterSpacing: '0.02em',
                }}
              >
                For Life
              </span>
              {/* Equalizer Bars */}
              <div
                style={{
                  display: 'flex',
                  alignItems: 'flex-end',
                  gap: '2px',
                  height: '12px',
                }}
              >
                {[1, 2, 3, 4].map((bar) => (
                  <motion.span
                    key={bar}
                    animate={{
                      height: isPlaying ? [4, 12, 6, 14, 4][bar % 5] : 3,
                    }}
                    transition={{
                      repeat: Infinity,
                      duration: 0.6 + bar * 0.15,
                      ease: 'easeInOut',
                      repeatType: 'reverse',
                    }}
                    style={{
                      width: '2.5px',
                      background: 'var(--gold)',
                      borderRadius: '1px',
                      display: 'inline-block',
                    }}
                  />
                ))}
              </div>
            </div>
            <span
              style={{
                fontSize: '9.5px',
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                color: 'var(--muted)',
                fontWeight: 500,
              }}
            >
              {isPlaying ? 'Now Playing · O & I' : 'Click to Play'}
            </span>
          </div>

          {/* Control Actions */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
            <button
              onClick={togglePlay}
              aria-label={isPlaying ? 'Pause' : 'Play'}
              style={{
                background: 'transparent',
                border: 'none',
                color: 'var(--ink)',
                padding: '6px',
                borderRadius: '50%',
                display: 'grid',
                placeItems: 'center',
                cursor: 'pointer',
              }}
            >
              {isPlaying ? <Pause className="w-4 h-4 text-[var(--ink)]" /> : <Play className="w-4 h-4 text-[var(--gold)] fill-[var(--gold)]" />}
            </button>

            <button
              onClick={toggleMute}
              aria-label={isMuted ? 'Unmute' : 'Mute'}
              style={{
                background: 'transparent',
                border: 'none',
                color: 'var(--muted)',
                padding: '6px',
                borderRadius: '50%',
                display: 'grid',
                placeItems: 'center',
                cursor: 'pointer',
              }}
            >
              {isMuted ? <VolumeX className="w-4 h-4 text-red-500" /> : <Volume2 className="w-4 h-4" />}
            </button>
          </div>
        </motion.div>
      </div>
    </>
  )
}

