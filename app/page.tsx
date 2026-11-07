'use client'

import { useEffect, useMemo, useState } from 'react'
import {
  ArrowDown,
  ArrowUpRight,
  CalendarDays,
  Check,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Clock3,
  Heart,
  MapPin,
  Maximize2,
  Menu,
  Send,
  Sparkles,
  Video,
  Calendar,
  X,
} from 'lucide-react'
import confetti from 'canvas-confetti'
import { motion, AnimatePresence, Variants, useScroll, useTransform } from 'framer-motion'
import { AudioPlayer } from '@/components/audio-player'

const eventDate = new Date('2026-11-28T11:00:00+01:00')
const venue = 'Christ Apostolic Church, Mountain of Salvation, No 34, Odekale street, Baba Barber Junction, Ewupe, Sango Ota, Ogun State'
const calendarUrl = 'https://calendar.google.com/calendar/render?action=TEMPLATE&text=Odunayo+%26+Ibitayo%27s+Wedding&dates=20261128T090000Z/20261128T160000Z&details=Join+us+as+we+celebrate+our+wedding!&location=Christ+Apostolic+Church,+Mountain+of+Salvation,+No+34,+Odekale+street,+Baba+Barber+Junction,+Ewupe,+Sango+Ota,+Ogun+State'

interface GalleryItem {
  id: number
  src: string
  alt: string
  label: string
  subtitle: string
  category: 'traditional' | 'modern' | 'faith'
  spanClass: string
}

const galleryItems: GalleryItem[] = [
  {
    id: 1,
    src: '/images/Second.png',
    alt: 'Odunayo and Ibitayo in an intimate traditional embrace with foreheads resting',
    label: 'Sacred Promise',
    subtitle: 'An intimate covenant sealed in timeless devotion and grace',
    category: 'traditional',
    spanClass: 'card-span-tall',
  },
  {
    id: 2,
    src: '/images/Third.png',
    alt: 'Odunayo and Ibitayo in majestic traditional regalia with gele and embroidered agbada',
    label: 'Royal Splendor',
    subtitle: 'Honoring our rich heritage in bespoke traditional blue and gold',
    category: 'traditional',
    spanClass: 'card-span-wide',
  },
  {
    id: 3,
    src: '/images/First.png',
    alt: 'Odunayo and Ibitayo in royal blue formal suit and matching dress',
    label: 'Modern Elegance',
    subtitle: 'Vibrant sapphire blue, shared smiles, and refined celebration',
    category: 'modern',
    spanClass: 'card-span-third',
  },
  {
    id: 4,
    src: '/images/Fourth.png',
    alt: 'Odunayo and Ibitayo with hands joined tightly in prayer with closed eyes',
    label: 'Rooted in Prayer',
    subtitle: 'Laying the spiritual cornerstone of our union before God',
    category: 'faith',
    spanClass: 'card-span-third',
  },
  {
    id: 5,
    src: '/images/Seventh.png',
    alt: 'Odunayo and Ibitayo holding hands with radiating joy and affection',
    label: 'Eternity in Hand',
    subtitle: 'Resting in each other’s warmth, hand in hand forever',
    category: 'modern',
    spanClass: 'card-span-third',
  },
  {
    id: 6,
    src: '/images/Fifth.png',
    alt: 'Odunayo looking up adoringly at Ibitayo',
    label: 'Sweet Devotion',
    subtitle: 'A glance that speaks of unspoken warmth and quiet admiration',
    category: 'modern',
    spanClass: 'card-span-half',
  },
  {
    id: 7,
    src: '/images/Sixth.png',
    alt: 'Odunayo and Ibitayo laughing and talking warmly seated together on a sofa',
    label: 'Joyful Companionship',
    subtitle: 'Countless laughs, unwavering friendship, and love for a lifetime',
    category: 'faith',
    spanClass: 'card-span-half',
  },
]

function Countdown() {
  const [isMounted, setIsMounted] = useState(false)
  const [now, setNow] = useState(() => new Date())

  useEffect(() => {
    setIsMounted(true)
    setNow(new Date())
    const id = window.setInterval(() => setNow(new Date()), 1000)
    return () => window.clearInterval(id)
  }, [])

  const values = useMemo(() => {
    const diff = eventDate.getTime() - now.getTime()
    if (diff <= 0) return null
    return [
      Math.floor(diff / 86400000),
      Math.floor(diff / 3600000) % 24,
      Math.floor(diff / 60000) % 60,
      Math.floor(diff / 1000) % 60,
    ]
  }, [now])

  if (!isMounted) {
    return (
      <div className="countdown" aria-live="polite">
        {[0, 0, 0, 0].map((_, i) => (
          <div className="count-item" key={i}>
            <strong>00</strong>
            <span>{['Days', 'Hours', 'Minutes', 'Seconds'][i]}</span>
          </div>
        ))}
      </div>
    )
  }

  return (
    <div className="countdown" aria-live="polite">
      {values ? (
        values.map((value, i) => (
          <div className="count-item" key={i}>
            <strong>{String(value).padStart(2, '0')}</strong>
            <span>{['Days', 'Hours', 'Minutes', 'Seconds'][i]}</span>
          </div>
        ))
      ) : (
        <p className="after-countdown">Today we celebrate forever.</p>
      )}
    </div>
  )
}

export default function Page() {
  const { scrollY } = useScroll()
  const heroY = useTransform(scrollY, [0, 800], [0, 250])
  const heroOpacity = useTransform(scrollY, [0, 400], [1, 0])

  const [menuOpen, setMenuOpen] = useState(false)
  const [lightbox, setLightbox] = useState<number | null>(null)
  const [rsvpSent, setRsvpSent] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const [isAppLoading, setIsAppLoading] = useState(true)
  const [galleryFilter, setGalleryFilter] = useState<'all' | 'traditional' | 'modern' | 'faith'>('all')

  const filteredGallery = useMemo(() => {
    if (galleryFilter === 'all') return galleryItems
    return galleryItems.filter((item) => item.category === galleryFilter)
  }, [galleryFilter])

  // Keyboard navigation for lightbox
  useEffect(() => {
    if (lightbox === null) return
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setLightbox(null)
      if (e.key === 'ArrowRight') {
        setLightbox((prev) => (prev !== null ? (prev + 1) % filteredGallery.length : null))
      }
      if (e.key === 'ArrowLeft') {
        setLightbox((prev) => (prev !== null ? (prev - 1 + filteredGallery.length) % filteredGallery.length : null))
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [lightbox, filteredGallery.length])

  useEffect(() => {
    let frameId: number
    let isActive = false

    const timer = setTimeout(() => {
      setIsAppLoading(false)
      isActive = true

      const colors = ['#ad8b5c', '#d8cfc3', '#fcfaf7', '#2d2925']

      // 1. Initial Grand Burst
      confetti({
        particleCount: 150,
        spread: 100,
        origin: { y: 0.4 },
        colors: colors,
        disableForReducedMotion: true,
        zIndex: 100,
      })

      // 2. Gentle Continuous Snow
      function randomInRange(min: number, max: number) {
        return Math.random() * (max - min) + min
      }

      let skew = 1
      let lastTime = Date.now()

      ;(function frame() {
        if (!isActive) return

        frameId = requestAnimationFrame(frame)

        const now = Date.now()
        if (now - lastTime < 400) return
        lastTime = now

        skew = Math.max(0.8, skew - 0.001)

        confetti({
          particleCount: 1,
          startVelocity: 0,
          ticks: 800,
          origin: {
            x: Math.random(),
            y: Math.random() * skew - 0.2,
          },
          colors: colors,
          shapes: ['circle'],
          gravity: randomInRange(0.1, 0.2),
          scalar: randomInRange(0.4, 0.9),
          drift: randomInRange(-0.2, 0.2),
          disableForReducedMotion: true,
          zIndex: 100,
        })
      })()
    }, 2200)

    return () => {
      clearTimeout(timer)
      isActive = false
      if (frameId) cancelAnimationFrame(frameId)
    }
  }, [])

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const [faq, setFaq] = useState<number | null>(0)
  const [email, setEmail] = useState('')
  const nav = ['Our Story', 'The Wedding', 'Schedule', 'Travel', 'Gallery', 'RSVP']
  const directions = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(venue)}`

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')

  const handleRsvpSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)
    setErrorMessage('')

    const formData = new FormData(e.currentTarget)
    formData.append('access_key', 'bc7db950-62ce-4a4a-b976-10557b7a18e1')
    formData.append('subject', "New RSVP for Odunayo & Ibitayo's Wedding!")

    try {
      const response = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        body: formData,
      })
      const data = await response.json()

      if (data.success) {
        setRsvpSent(true)
        confetti({
          particleCount: 150,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#ad8b5c', '#d8cfc3', '#fcfaf7', '#2d2925'],
        })
      } else {
        setErrorMessage('Something went wrong. Please check your connection and try again.')
      }
    } catch {
      setErrorMessage('Something went wrong. Please check your connection and try again.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const fadeUp: Variants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: 'easeOut' } },
  }

  return (
    <main className="site-shell">
      {/* Background Audio Player with Autoplay & Floating Luxury Controls */}
      <AudioPlayer />

      {/* Initial Page Loading Overlay */}
      <AnimatePresence>
        {isAppLoading && (
          <motion.div
            key="loader"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8, ease: 'easeInOut' }}
            style={{
              position: 'fixed',
              inset: 0,
              zIndex: 100,
              background: 'var(--cream)',
              display: 'grid',
              placeItems: 'center',
            }}
          >
            <motion.div
              initial={{ opacity: 0.5, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1, repeat: Infinity, repeatType: 'reverse', ease: 'easeInOut' }}
              className="invitation-mark"
              style={{ fontSize: '100px', color: 'var(--gold)', alignSelf: 'center' }}
            >
              O <span>&</span> I
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Navigation Bar */}
      <header className={`nav-wrap ${isScrolled ? 'scrolled' : ''}`}>
        <a className="wordmark" href="#top" aria-label="Odunayo and Ibitayo home">
          O <span>&</span> I
        </a>
        <nav className={menuOpen ? 'nav-links open' : 'nav-links'} aria-label="Primary navigation">
          {nav.map((item) => (
            <a key={item} href={`#${item.toLowerCase().replaceAll(' ', '-')}`} onClick={() => setMenuOpen(false)}>
              {item}
            </a>
          ))}
          <a className="nav-rsvp" href="#rsvp" onClick={() => setMenuOpen(false)}>
            RSVP <ArrowUpRight aria-hidden="true" />
          </a>
        </nav>
        <button
          className="menu-button"
          aria-label={menuOpen ? 'Close menu' : 'Open menu'}
          onClick={() => setMenuOpen(!menuOpen)}
        >
          {menuOpen ? <X /> : <Menu />}
        </button>
      </header>

      {/* Hero Section */}
      <section className="hero" id="top" style={{ overflow: 'hidden' }}>
        <motion.div style={{ y: heroY, position: 'absolute', inset: 0, width: '100%', height: '100%' }}>
          <motion.img
            initial={{ scale: 1.05, filter: 'blur(10px)', opacity: 0 }}
            animate={{ scale: 1, filter: 'blur(0px)', opacity: 1 }}
            transition={{ duration: 2, ease: 'easeOut' }}
            className="hero-image"
            src="/images/Second.png"
            alt="Odunayo and Ibitayo in an intimate traditional embrace"
          />
          <div className="hero-overlay" />
        </motion.div>

        <motion.div
          style={{ opacity: heroOpacity }}
          initial="hidden"
          animate="visible"
          variants={{
            hidden: {},
            visible: {
              transition: { staggerChildren: 0.15, delayChildren: 0.2 },
            },
          }}
          className="hero-content"
        >
          <motion.div
            variants={{ hidden: { opacity: 0, y: 15 }, visible: { opacity: 1, y: 0, transition: { duration: 1 } } }}
          >
            <div className="hero-tag">
              <Sparkles className="w-3.5 h-3.5 text-[#d4af7c]" />
              <span>The Royal Union</span>
            </div>
            <p className="eyebrow light">Together with their families</p>
          </motion.div>

          <h1 style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', margin: '20px 0' }}>
            <span style={{ overflow: 'hidden', display: 'block', padding: '5px 0' }}>
              <motion.span
                variants={{ hidden: { y: '100%' }, visible: { y: '0%', transition: { duration: 1.2, ease: [0.16, 1, 0.3, 1] } } }}
                style={{ display: 'block' }}
              >
                Odunayo
              </motion.span>
            </span>
            <motion.em
              variants={{ hidden: { scale: 0, opacity: 0 }, visible: { scale: 1, opacity: 1, transition: { duration: 0.8, ease: 'easeOut' } } }}
            >
              &
            </motion.em>
            <span style={{ overflow: 'hidden', display: 'block', padding: '5px 0' }}>
              <motion.span
                variants={{ hidden: { y: '100%' }, visible: { y: '0%', transition: { duration: 1.2, ease: [0.16, 1, 0.3, 1] } } }}
                style={{ display: 'block' }}
              >
                Ibitayo
              </motion.span>
            </span>
          </h1>

          <motion.p
            variants={{ hidden: { opacity: 0, filter: 'blur(4px)' }, visible: { opacity: 1, filter: 'blur(0px)', transition: { duration: 1 } } }}
            className="hero-date"
          >
            28 <i>•</i> 11 <i>•</i> 2026
          </motion.p>
          <motion.p
            variants={{ hidden: { opacity: 0 }, visible: { opacity: 1, transition: { duration: 1 } } }}
            className="hero-location"
          >
            Our wedding day <span>·</span> Ogun State, Nigeria
          </motion.p>

          <div style={{ display: 'flex', gap: '15px', flexWrap: 'wrap', justifyContent: 'center' }}>
            <motion.a
              variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { duration: 1 } } }}
              className="button button-light glassmorphism-dark"
              href="#rsvp"
            >
              Join our celebration <ArrowDown aria-hidden="true" />
            </motion.a>
            <motion.a
              variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { duration: 1 } } }}
              className="button button-light glassmorphism-dark"
              href="https://youtube.com/live"
              target="_blank"
              rel="noreferrer"
            >
              Watch Live Stream <Video aria-hidden="true" />
            </motion.a>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2.5, duration: 1 }}
          className="scroll-cue"
        >
          <span>Scroll to explore</span>
          <i />
        </motion.div>
      </section>

      {/* Countdown Section */}
      <section className="countdown-section">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-100px' }} variants={fadeUp}>
          <div className="section-kicker">Counting down to forever</div>
          <Countdown />
          <p className="count-note">
            Saturday, November 28, 2026 <span>·</span> 10:00 AM WAT
          </p>
        </motion.div>
      </section>

      {/* Invitation Section with Royal Arched Portrait Frame */}
      <section className="invitation section-pad">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-100px' }} variants={fadeUp} className="invitation-copy">
          <p className="eyebrow">An invitation</p>
          <h2>
            Two hearts.
            <br />
            <i>One covenant.</i>
            <br />A lifetime together.
          </h2>
          <p>
            With grateful hearts and joyful anticipation, we invite you to witness the beginning of our forever as we unite before God and our beloved families.
          </p>
          <a className="text-link" href="#the-wedding">
            Discover the day <ArrowUpRight />
          </a>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.92, y: 20 }}
          whileInView={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 1, ease: 'easeOut' }}
          viewport={{ once: true }}
          className="invitation-visual"
        >
          <div className="invitation-frame">
            <img
              src="/images/Third.png"
              alt="Odunayo and Ibitayo dressed in royal agbada and gele"
            />
            <div className="invitation-seal">O & I</div>
          </div>
        </motion.div>
      </section>

      {/* Our Story Section with Dual Photo Editorial Collage */}
      <section className="story section-pad" id="our-story">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-100px' }} variants={fadeUp} className="section-heading">
          <p className="eyebrow">The journey</p>
          <h2>
            Our story is still
            <br />
            <i>being written.</i>
          </h2>
        </motion.div>

        <div className="story-grid">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
            viewport={{ once: true, margin: '-50px' }}
            className="story-collage"
          >
            <div className="story-main-image">
              <img
                src="/images/Sixth.png"
                alt="Odunayo and Ibitayo laughing and sharing a warm moment together"
              />
            </div>
            <motion.div
              initial={{ opacity: 0, y: 25 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.3 }}
              viewport={{ once: true }}
              className="story-sub-image"
            >
              <img
                src="/images/Fourth.png"
                alt="Odunayo and Ibitayo holding hands in prayer"
              />
              <div className="story-sub-badge">Anchored in Faith</div>
            </motion.div>
          </motion.div>

          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: '-100px' }}
            variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.2 } } }}
            className="story-text"
          >
            <motion.span variants={fadeUp} className="story-number">
              01
            </motion.span>
            <motion.h3 variants={fadeUp}>The beginning</motion.h3>
            <motion.p variants={fadeUp}>
              What started as a chance meeting quickly blossomed into a beautiful friendship, and eventually, the love of a lifetime. We’ve shared countless laughs, supported each other through every season, and built a foundation of unwavering faith and trust.
            </motion.p>
            <motion.p variants={fadeUp} className="muted">
              Now, as we prepare to take this sacred step together, we can’t wait to celebrate the beginning of our forever with the people who mean the most to us.
            </motion.p>
            <motion.div variants={fadeUp} className="line" />
          </motion.div>
        </div>
      </section>

      {/* Quote / Scripture Section */}
      <section className="quote-section">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-100px' }} variants={fadeUp} className="quote-inner">
          <div className="rings-container">
            <motion.div
              initial={{ x: -120, opacity: 0, y: 0 }}
              whileInView={{ x: 18, opacity: 1, y: [0, -8, 0] }}
              transition={{
                x: { duration: 2, ease: 'easeOut' },
                opacity: { duration: 2 },
                y: { duration: 4, repeat: Infinity, ease: 'easeInOut' },
              }}
              viewport={{ once: true }}
              className="wedding-ring"
            />
            <motion.div
              initial={{ x: 120, opacity: 0, y: 0 }}
              whileInView={{ x: -18, opacity: 1, y: [0, -8, 0] }}
              transition={{
                x: { duration: 2, ease: 'easeOut' },
                opacity: { duration: 2 },
                y: { duration: 4.5, repeat: Infinity, ease: 'easeInOut', delay: 0.5 },
              }}
              viewport={{ once: true }}
              className="wedding-ring"
            />
            <motion.div
              initial={{ scale: 0, y: 0 }}
              whileInView={{ scale: 1, y: [0, -10, 0] }}
              transition={{
                scale: { duration: 0.8, delay: 1.5, type: 'spring' },
                y: { duration: 3.5, repeat: Infinity, ease: 'easeInOut', delay: 2 },
              }}
              viewport={{ once: true }}
              style={{ display: 'flex', alignItems: 'center' }}
            >
              <Heart className="quote-heart" aria-hidden="true" />
            </motion.div>
          </div>
          <blockquote>“Therefore what God has joined together, let no one separate.”</blockquote>
          <cite>Mark 10:9</cite>
        </motion.div>
      </section>

      {/* Details Section */}
      <section className="details section-pad" id="the-wedding" style={{ background: 'linear-gradient(to bottom, #fcfaf7, #e9e2d9)' }}>
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-100px' }} variants={fadeUp} className="section-heading centered">
          <p className="eyebrow">The wedding</p>
          <h2>
            A day to remember,
            <br />
            <i>a love to celebrate.</i>
          </h2>
        </motion.div>
        <div className="details-grid">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            viewport={{ once: true }}
            className="detail-card glassmorphism"
          >
            <motion.div animate={{ y: [0, -8, 0] }} transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}>
              <CalendarDays />
            </motion.div>
            <span>The date</span>
            <strong>Saturday, November 28, 2026</strong>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            viewport={{ once: true }}
            className="detail-card glassmorphism"
          >
            <motion.div animate={{ y: [0, -8, 0] }} transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}>
              <Clock3 />
            </motion.div>
            <span>The time</span>
            <strong>10:00 AM WAT</strong>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            viewport={{ once: true }}
            className="detail-card glassmorphism"
          >
            <motion.div animate={{ y: [0, -8, 0] }} transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut', delay: 1 }}>
              <MapPin />
            </motion.div>
            <span>The venue</span>
            <strong>
              Christ Apostolic Church, Mountain of Salvation
              <br />
              No 34, Odekale street, Baba Barber Junction,
              <br />
              Ewupe, Sango Ota
            </strong>
          </motion.div>
        </div>
        <div style={{ display: 'flex', gap: '15px', justifyContent: 'center', flexWrap: 'wrap' }}>
          <motion.a
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
            viewport={{ once: true }}
            className="button button-dark glassmorphism-dark"
            href={directions}
            target="_blank"
            rel="noreferrer"
          >
            Get directions <ArrowUpRight />
          </motion.a>
          <motion.a
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            viewport={{ once: true }}
            className="button button-dark glassmorphism-dark"
            href={calendarUrl}
            target="_blank"
            rel="noreferrer"
          >
            Add to Calendar <Calendar />
          </motion.a>
        </div>
      </section>

      {/* Schedule Section */}
      <section className="schedule section-pad" id="schedule">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-100px' }} variants={fadeUp} className="section-heading">
          <p className="eyebrow">The rhythm of the day</p>
          <h2>
            Make a day
            <br />
            <i>of it.</i>
          </h2>
        </motion.div>
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.2 } } }}
          className="timeline"
        >
          <motion.div variants={{ hidden: { opacity: 0, x: -20 }, visible: { opacity: 1, x: 0, transition: { duration: 0.8, ease: 'easeOut' } } }}>
            <time>10:00 AM</time>
            <h3>Wedding Ceremony</h3>
            <p>Christ Apostolic Church</p>
          </motion.div>
          <motion.div variants={{ hidden: { opacity: 0, x: -20 }, visible: { opacity: 1, x: 0, transition: { duration: 0.8, ease: 'easeOut' } } }}>
            <time>01:00 PM</time>
            <h3>Wedding Reception</h3>
            <p>Followed immediately by food, drinks, and joyful celebration.</p>
          </motion.div>
          <motion.div variants={{ hidden: { opacity: 0, x: -20 }, visible: { opacity: 1, x: 0, transition: { duration: 0.8, ease: 'easeOut' } } }}>
            <time>03:30 PM</time>
            <h3>After Party & Dancing</h3>
            <p>Bring your dancing shoes as we celebrate into the evening.</p>
          </motion.div>
        </motion.div>
      </section>

      {/* Travel Section */}
      <section className="story section-pad" id="travel" style={{ background: '#eee8df' }}>
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-100px' }} variants={fadeUp} className="section-heading centered">
          <p className="eyebrow">Travel & Stay</p>
          <h2>
            For our out-of-town
            <br />
            <i>guests.</i>
          </h2>
        </motion.div>
        <div style={{ maxWidth: 800, margin: '0 auto', display: 'grid', gap: '30px', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))' }}>
          <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} className="glassmorphism" style={{ padding: 40, border: '1px solid rgba(173,139,92,0.2)' }}>
            <h3 style={{ font: "400 24px 'Playfair Display', serif", margin: '0 0 15px', color: 'var(--ink)' }}>Getting Here</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <p style={{ color: 'var(--muted)', fontSize: 14, lineHeight: 1.8, margin: 0 }}>
                <strong>Driving from outside Lagos:</strong> If you are entering through Berger, connect towards Sango Ota.
              </p>
              <p style={{ color: 'var(--muted)', fontSize: 14, lineHeight: 1.8, margin: 0 }}>
                <strong>From within Lagos:</strong> Navigate to Sango, then proceed to Veepee Bus Stop. From there, take a short ride to Baba Barber Junction—CAC is right in front of the junction.
              </p>
              <p style={{ color: 'var(--muted)', fontSize: 14, lineHeight: 1.8, margin: 0 }}>
                <strong>Flying in:</strong> The closest airport is Murtala Muhammed International Airport (LOS). Uber and Bolt are readily available.
              </p>
            </div>
          </motion.div>
          <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} className="glassmorphism" style={{ padding: 40, border: '1px solid rgba(173,139,92,0.2)' }}>
            <h3 style={{ font: "400 24px 'Playfair Display', serif", margin: '0 0 15px', color: 'var(--ink)' }}>Where to Stay</h3>
            <p style={{ color: 'var(--muted)', fontSize: 14, lineHeight: 1.8, margin: 0 }}>
              We recommend booking a hotel in the Ikeja area (for proximity to the airport and commercial centers) or comfortable local accommodations within Sango Ota.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Pro Styled Wedding Gallery Section */}
      <section className="gallery-section section-pad" id="gallery">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-100px' }} variants={fadeUp} className="section-heading centered">
          <p className="eyebrow">A glimpse of us</p>
          <h2>
            Moments, held
            <br />
            <i>in light.</i>
          </h2>
        </motion.div>

        {/* Gallery Filter Tabs */}
        <div className="gallery-filter-bar">
          <button
            className={`gallery-filter-btn ${galleryFilter === 'all' ? 'active' : ''}`}
            onClick={() => setGalleryFilter('all')}
          >
            All Moments ({galleryItems.length})
          </button>
          <button
            className={`gallery-filter-btn ${galleryFilter === 'traditional' ? 'active' : ''}`}
            onClick={() => setGalleryFilter('traditional')}
          >
            Traditional Regalia (2)
          </button>
          <button
            className={`gallery-filter-btn ${galleryFilter === 'modern' ? 'active' : ''}`}
            onClick={() => setGalleryFilter('modern')}
          >
            Modern Elegance (3)
          </button>
          <button
            className={`gallery-filter-btn ${galleryFilter === 'faith' ? 'active' : ''}`}
            onClick={() => setGalleryFilter('faith')}
          >
            Faith & Joy (2)
          </button>
        </div>

        {/* Masonry / Magazine Layout Grid */}
        <div className="gallery-masonry">
          {filteredGallery.map((image, i) => (
            <motion.div
              key={image.src}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: i * 0.08, ease: 'easeOut' }}
              viewport={{ once: true, margin: '-40px' }}
              className={`gallery-card ${image.spanClass}`}
              onClick={() => setLightbox(i)}
              role="button"
              tabIndex={0}
              onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') setLightbox(i)
              }}
              aria-label={`View photo: ${image.label}`}
            >
              <img className="gallery-card-img" src={image.src} alt={image.alt} />
              <div className="gallery-card-overlay">
                <div className="gallery-card-content">
                  <div className="gallery-card-badge">
                    {image.category === 'traditional' ? 'Traditional' : image.category === 'modern' ? 'Modern' : 'Faith & Joy'}
                  </div>
                  <h3 className="gallery-card-title">
                    <span>{image.label}</span>
                    <Maximize2 aria-hidden="true" />
                  </h3>
                  <p className="gallery-card-subtitle">{image.subtitle}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* RSVP Section */}
      <section className="rsvp-section" id="rsvp">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-100px' }} variants={fadeUp} className="rsvp-copy">
          <p className="eyebrow light">We hope you can make it</p>
          <h2>
            Will you celebrate
            <br />
            <i>with us?</i>
          </h2>
          <p>Your presence would mean the world to us. Kindly let us know if we can save you a seat.</p>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          viewport={{ once: true }}
          className="rsvp-card glassmorphism"
        >
          {rsvpSent ? (
            <motion.div
              initial="hidden"
              animate="visible"
              variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.15 } } }}
              className="success"
            >
              <motion.div variants={fadeUp} className="success-icon">
                <Check />
              </motion.div>
              <motion.p variants={fadeUp} className="eyebrow">
                Thank you
              </motion.p>
              <motion.h3 variants={fadeUp}>You're on the guest list.</motion.h3>
              <motion.p variants={fadeUp}>We can't wait to celebrate with you on November 28.</motion.p>
              <motion.a variants={fadeUp} className="text-link" href="#top">
                Back to the beginning <ArrowUpRight />
              </motion.a>
            </motion.div>
          ) : (
            <form onSubmit={handleRsvpSubmit}>
              {errorMessage && <p style={{ color: '#d9534f', fontSize: '13px', marginBottom: '15px' }}>{errorMessage}</p>}
              <input type="hidden" name="from_name" value="Wedding Website RSVP" />
              <label htmlFor="name">Your name</label>
              <input id="name" name="name" required placeholder="First and last name" />
              <label htmlFor="email">Email address</label>
              <input
                id="email"
                name="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="you@example.com"
              />
              <label>Will you be joining us?</label>
              <div className="choice-row">
                <label>
                  <input name="attendance" value="Joyfully accept" type="radio" required /> Joyfully accept
                </label>
                <label>
                  <input name="attendance" value="Regretfully decline" type="radio" /> Regretfully decline
                </label>
              </div>
              <label htmlFor="note">
                A note for the couple <span>(optional)</span>
              </label>
              <textarea id="note" name="message" placeholder="Share a little love..." rows={3} />
              <button className="button button-dark" type="submit" disabled={isSubmitting}>
                {isSubmitting ? 'Sending...' : 'Send RSVP'} <Send />
              </button>
            </form>
          )}
        </motion.div>
      </section>

      {/* FAQ Section */}
      <section className="faq section-pad" id="faq">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-100px' }} variants={fadeUp} className="section-heading centered">
          <p className="eyebrow">Good to know</p>
          <h2>
            Questions,
            <br />
            <i>answered.</i>
          </h2>
        </motion.div>
        <div className="faq-list">
          {['Where is the wedding?', 'What time should guests arrive?', 'Is RSVP required?', 'Is there a dress code?'].map(
            (question, i) => (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: i * 0.1 }}
                viewport={{ once: true }}
                className="faq-row"
                key={question}
              >
                <button onClick={() => setFaq(faq === i ? null : i)} aria-expanded={faq === i}>
                  <span>0{i + 1}</span>
                  {question}
                  <ChevronDown className={faq === i ? 'rotated' : ''} />
                </button>
                {faq === i && (
                  <motion.p initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}>
                    {[
                      venue,
                      'Guests are encouraged to arrive by 9:30 AM so we can begin the ceremony promptly.',
                      'Yes, please RSVP by November 20th to help us prepare for your arrival.',
                      "Yes! Our colors are purple and champagne gold. We can't wait to see you looking fabulous!",
                    ][i]}
                  </motion.p>
                )}
              </motion.div>
            )
          )}
        </div>
      </section>

      {/* Footer */}
      <footer>
        <a className="wordmark" href="#top">
          O <span>&</span> I
        </a>
        <p>With love, gratitude & joy.</p>
        <div className="footer-line" />
        <small>© 2026 Odunayo & Ibitayo · Made with love</small>
      </footer>

      {/* Full-Screen Lightbox Modal with Navigation Controls */}
      <AnimatePresence>
        {lightbox !== null && filteredGallery[lightbox] && (
          <motion.div
            key="lightbox-modal"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="lightbox"
            role="dialog"
            aria-modal="true"
            aria-label="Gallery image preview"
            onClick={() => setLightbox(null)}
          >
            <div className="lightbox-header">
              <span className="lightbox-counter">
                Moment {lightbox + 1} of {filteredGallery.length}
              </span>
              <button
                className="lightbox-close-btn"
                aria-label="Close image"
                onClick={() => setLightbox(null)}
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Navigation Arrows */}
            {filteredGallery.length > 1 && (
              <>
                <button
                  className="lightbox-nav-btn prev"
                  aria-label="Previous photo"
                  onClick={(e) => {
                    e.stopPropagation()
                    setLightbox((prev) => (prev !== null ? (prev - 1 + filteredGallery.length) % filteredGallery.length : null))
                  }}
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>
                <button
                  className="lightbox-nav-btn next"
                  aria-label="Next photo"
                  onClick={(e) => {
                    e.stopPropagation()
                    setLightbox((prev) => (prev !== null ? (prev + 1) % filteredGallery.length : null))
                  }}
                >
                  <ChevronRight className="w-6 h-6" />
                </button>
              </>
            )}

            {/* Stage */}
            <div className="lightbox-stage" onClick={(e) => e.stopPropagation()}>
              <motion.img
                key={filteredGallery[lightbox].src}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.35, ease: 'easeOut' }}
                className="lightbox-image"
                src={filteredGallery[lightbox].src}
                alt={filteredGallery[lightbox].alt}
              />
            </div>

            {/* Image Details */}
            <div className="lightbox-footer" onClick={(e) => e.stopPropagation()}>
              <h3>{filteredGallery[lightbox].label}</h3>
              <p>{filteredGallery[lightbox].subtitle}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  )
}
