'use client'

import { useEffect, useRef, useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Disc3, Music, Pause, Play, Volume2, VolumeX, X } from 'lucide-react'

// Web Audio API session unlock for iOS Safari and mobile WebKit
function unlockWebAudio() {
  try {
    const AudioCtxClass = window.AudioContext || (window as any).webkitAudioContext
    if (AudioCtxClass) {
      const ctx = new AudioCtxClass()
      if (ctx.state === 'suspended') {
        ctx.resume().catch(() => { })
      }
      const buffer = ctx.createBuffer(1, 1, 22050)
      const source = ctx.createBufferSource()
      source.buffer = buffer
      source.connect(ctx.destination)
      source.start(0)
    }
  } catch { }
}

export function AudioPlayer() {
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const isMutedRef = useRef(false)
  const [isPlaying, setIsPlaying] = useState(false)
  const [isMuted, setIsMuted] = useState(false)
  const [autoplayBlocked, setAutoplayBlocked] = useState(false)
  const [hasStartedOnce, setHasStartedOnce] = useState(false)
  const [bannerDismissed, setBannerDismissed] = useState(false)

  // Direct unmuted playback attempt
  const attemptPlay = useCallback(async () => {
    const audio = audioRef.current
    if (!audio) return false

    unlockWebAudio()
    if (!isMutedRef.current) {
      audio.muted = false
      audio.volume = 0.75
    }

    try {
      await audio.play()
      setIsPlaying(true)
      setAutoplayBlocked(false)
      setHasStartedOnce(true)
      return true
    } catch {
      // Unmuted autoplay blocked by browser policy on live domain
      // Warm up audio buffer with muted playback so it buffers with 0 latency
      try {
        audio.muted = true
        await audio.play()
      } catch { }
      setAutoplayBlocked(true)
      return false
    }
  }, [])

  // User gesture handler (unmutes & starts)
  const handleUserGesture = useCallback(async () => {
    const audio = audioRef.current
    if (!audio) return
    // Respect user's explicit mute choice
    if (isMutedRef.current) return
    if (hasStartedOnce && !audio.paused) return

    unlockWebAudio()
    audio.muted = false
    audio.volume = 0.75

    try {
      await audio.play()
      setIsPlaying(true)
      setAutoplayBlocked(false)
      setHasStartedOnce(true)
    } catch {
      // Keep waiting for subsequent valid user interaction
    }
  }, [hasStartedOnce])

  useEffect(() => {
    // 1. Attempt unmuted autoplay immediately on mount
    attemptPlay()

    // 2. Register global user gesture listeners on window and document
    const gestureEvents = ['touchstart', 'click', 'pointerdown', 'touchend', 'keydown']

    const gestureListener = () => {
      handleUserGesture()
    }

    if (!hasStartedOnce) {
      gestureEvents.forEach((evt) => {
        window.addEventListener(evt, gestureListener, { capture: true, passive: true })
        document.addEventListener(evt, gestureListener, { capture: true, passive: true })
      })
    }

    // 3. Listen for custom 'play-wedding-music' event dispatched by splash screen or buttons
    const customListener = () => {
      handleUserGesture()
    }
    window.addEventListener('play-wedding-music', customListener)

    // 4. Expose to global window
    if (typeof window !== 'undefined') {
      ; (window as any).__playWeddingMusic = handleUserGesture
    }

    // 5. Visibility change handler: resume if user switches back to tab
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible' && hasStartedOnce && !isMutedRef.current) {
        if (audioRef.current && audioRef.current.paused) {
          audioRef.current.play().then(() => setIsPlaying(true)).catch(() => { })
        }
      }
    }
    document.addEventListener('visibilitychange', handleVisibilityChange)

    return () => {
      gestureEvents.forEach((evt) => {
        window.removeEventListener(evt, gestureListener, { capture: true })
        document.removeEventListener(evt, gestureListener, { capture: true })
      })
      window.removeEventListener('play-wedding-music', customListener)
      document.removeEventListener('visibilitychange', handleVisibilityChange)
    }
  }, [attemptPlay, handleUserGesture, hasStartedOnce])

  // Auto-dismiss the prompt banner after 4s or immediately upon scroll so it doesn't obstruct content
  useEffect(() => {
    if (autoplayBlocked && !hasStartedOnce) {
      const timer = setTimeout(() => {
        setBannerDismissed(true)
      }, 4000)

      const handleScroll = () => {
        setBannerDismissed(true)
      }
      window.addEventListener('scroll', handleScroll, { passive: true, once: true })

      return () => {
        clearTimeout(timer)
        window.removeEventListener('scroll', handleScroll)
      }
    }
  }, [autoplayBlocked, hasStartedOnce])

  const togglePlay = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation()
    const audio = audioRef.current
    if (!audio) return

    unlockWebAudio()

    if (isPlaying) {
      audio.pause()
      setIsPlaying(false)
    } else {
      if (!isMutedRef.current) {
        audio.muted = false
        audio.volume = 0.75
      }
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
    const nextMuted = !isMuted
    isMutedRef.current = nextMuted
    setIsMuted(nextMuted)
    audio.muted = nextMuted
    audio.volume = nextMuted ? 0 : 0.75
  }

  const dismissBanner = (e: React.MouseEvent) => {
    e.stopPropagation()
    setBannerDismissed(true)
  }

  return (
    <>
      <audio
        ref={audioRef}
        src="/audio/wedding-song.mp3"
        preload="auto"
        loop
        playsInline
        onEnded={() => {
          if (audioRef.current) {
            audioRef.current.currentTime = 0
            audioRef.current.play().catch(() => { })
          }
        }}
      >
        <source src="/audio/wedding-song.mp3" type="audio/mpeg" />
        <source src="/audio/wedding-song.mpeg" type="audio/mpeg" />
      </audio>

      {/* Floating Audio Controller */}
      <div className="audio-controller-container">
        {/* Floating blocked notification banner */}
        <AnimatePresence>
          {autoplayBlocked && !hasStartedOnce && !bannerDismissed && (
            <motion.div
              initial={{ opacity: 0, y: 15, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.95 }}
              transition={{ duration: 0.35 }}
              className="music-prompt-banner glassmorphism-dark"
              onClick={togglePlay}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Music className="w-3.5 h-3.5 text-[#d4af7c] animate-pulse" />
                <span>Tap to Play Wedding Song ♫</span>
              </div>
              <button
                type="button"
                onClick={dismissBanner}
                aria-label="Dismiss banner"
                style={{
                  background: 'transparent',
                  border: 'none',
                  color: 'rgba(255,255,255,0.7)',
                  padding: '2px',
                  display: 'grid',
                  placeItems: 'center',
                  cursor: 'pointer',
                  marginLeft: '4px',
                }}
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Main Floating Music Pill */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="music-player-pill glassmorphism"
        >
          {/* Rotating Vinyl Record */}
          <button
            onClick={togglePlay}
            aria-label={isPlaying ? 'Pause wedding soundtrack' : 'Play wedding soundtrack'}
            className="music-vinyl-btn"
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
                opacity: isPlaying ? 0 : 0.85,
                transition: 'opacity 0.2s',
              }}
            >
              <Play className="w-3.5 h-3.5 text-white fill-white ml-0.5" />
            </div>
          </button>

          {/* Song Info & Equalizer */}
          <div onClick={togglePlay} className="music-info">
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <span className="music-title">
                For Life
              </span>
              {/* Equalizer Bars */}
              <div className="music-eq">
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
            <span className="music-sub">
              {isPlaying ? 'Now Playing · O & I' : 'Click to Play'}
            </span>
          </div>

          {/* Control Actions */}
          <div className="music-controls">
            <button
              onClick={togglePlay}
              aria-label={isPlaying ? 'Pause' : 'Play'}
              className="music-action-btn"
            >
              {isPlaying ? <Pause className="w-4 h-4 text-[var(--ink)]" /> : <Play className="w-4 h-4 text-[var(--gold)] fill-[var(--gold)]" />}
            </button>

            <button
              onClick={toggleMute}
              aria-label={isMuted ? 'Unmute' : 'Mute'}
              className="music-action-btn"
            >
              {isMuted ? <VolumeX className="w-4 h-4 text-red-500" /> : <Volume2 className="w-4 h-4" />}
            </button>
          </div>
        </motion.div>
      </div>
    </>
  )
}

