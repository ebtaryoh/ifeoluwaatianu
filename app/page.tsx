'use client'

import { useEffect, useMemo, useState, useCallback } from 'react'
import {
  ArrowDown,
  ArrowUpRight,
  CalendarDays,
  Check,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Clock3,
  Copy,
  Globe2,
  Heart,
  MapPin,
  Maximize2,
  Menu,
  MessageCircle,
  MessageSquareHeart,
  Music,
  PhoneCall,
  Send,
  Sparkles,
  Video,
  Calendar,
  X,
  CreditCard,
  Gift,
} from 'lucide-react'
import confetti from 'canvas-confetti'
import { motion, AnimatePresence, Variants, useScroll, useTransform } from 'framer-motion'
import { AudioPlayer } from '@/components/audio-player'

const eventDate = new Date('2026-11-28T08:00:00+01:00')
const venue = 'Christ Apostolic Church, Mountain of Salvation, No 34, Odekale street, Baba Barber Junction, Ewupe, Sango Ota, Ogun State'
const calendarUrl = 'https://calendar.google.com/calendar/render?action=TEMPLATE&text=Odunayo+%26+Ibitayo%27s+Wedding&dates=20261128T070000Z/20261128T160000Z&details=Join+us+as+we+celebrate+our+Engagement+%26+Church+Wedding!&location=Christ+Apostolic+Church,+Mountain+of+Salvation,+No+34,+Odekale+street,+Baba+Barber+Junction,+Ewupe,+Sango+Ota,+Ogun+State'

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
    src: '/images/romantic-blue-and-gold-embrace.png',
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

interface Wish {
  id: string
  name: string
  location: string
  message: string
  date: string
  heartCount: number
}

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
  const [isScrolled, setIsScrolled] = useState(false)
  const [isAppLoading, setIsAppLoading] = useState(true)
  const [galleryFilter, setGalleryFilter] = useState<'all' | 'traditional' | 'modern' | 'faith'>('all')

  // Bank Copy State
  const [copiedAccount, setCopiedAccount] = useState<'sterling' | 'gtb' | null>(null)

  // Wishes / Guestbook States
  const [wishes, setWishes] = useState<Wish[]>([
    {
      id: '1',
      name: 'The Akinnibosun Family',
      location: 'Lagos, Nigeria',
      message: 'May your union be blessed with unending joy, peace, and abundance. We are so proud of you both and pray God’s favor guides your new home!',
      date: 'November 2026',
      heartCount: 14,
    },
    {
      id: '2',
      name: 'Pastor & Mrs. Akinde',
      location: 'Ogun State, Nigeria',
      message: 'Congratulations our beloved Odunayo and Ibitayo! As you step into holy matrimony, may God’s presence never depart from your home.',
      date: 'November 2026',
      heartCount: 19,
    },
    {
      id: '3',
      name: 'Uncle Tunde & Family',
      location: 'London, UK',
      message: 'Warmest congratulations all the way from the UK! What God has joined together, let no man put asunder. Wishing you a lifetime of laughter and shared dreams.',
      date: 'November 2026',
      heartCount: 11,
    },
  ])

  const [wishName, setWishName] = useState('')
  const [wishLocation, setWishLocation] = useState('')
  const [wishMessage, setWishMessage] = useState('')
  const [isSubmittingWish, setIsSubmittingWish] = useState(false)
  const [wishSuccess, setWishSuccess] = useState(false)
  const [likedWishes, setLikedWishes] = useState<Record<string, boolean>>({})
  const [visibleWishesCount, setVisibleWishesCount] = useState(5)

  // Load saved wishes from API or LocalStorage
  useEffect(() => {
    fetch('/api/wishes')
      .then((res) => res.json())
      .then((data) => {
        if (data.wishes && Array.isArray(data.wishes) && data.wishes.length > 0) {
          setWishes(data.wishes)
        }
      })
      .catch(() => {
        // Fallback to local storage if API is unreachable
        try {
          const local = localStorage.getItem('wedding_wishes')
          if (local) setWishes(JSON.parse(local))
        } catch { }
      })
  }, [])

  const handleCopyAccount = (accountNumber: string, type: 'sterling' | 'gtb') => {
    navigator.clipboard.writeText(accountNumber)
    setCopiedAccount(type)
    setTimeout(() => setCopiedAccount(null), 3000)
  }

  const handleWishSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!wishName.trim() || !wishMessage.trim()) return

    setIsSubmittingWish(true)

    const newWish: Wish = {
      id: Date.now().toString(),
      name: wishName.trim(),
      location: wishLocation.trim() || 'Well-wisher',
      message: wishMessage.trim(),
      date: 'Just now',
      heartCount: 1,
    }

    try {
      const response = await fetch('/api/wishes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newWish),
      })
      const data = await response.json()
      if (data.wishes) {
        setWishes(data.wishes)
      } else {
        setWishes((prev) => [newWish, ...prev])
      }
    } catch {
      // Local fallback
      setWishes((prev) => {
        const updated = [newWish, ...prev]
        try {
          localStorage.setItem('wedding_wishes', JSON.stringify(updated))
        } catch { }
        return updated
      })
    } finally {
      setIsSubmittingWish(false)
      setWishSuccess(true)
      setWishName('')
      setWishLocation('')
      setWishMessage('')

      confetti({
        particleCount: 120,
        spread: 80,
        origin: { y: 0.6 },
        colors: ['#ad8b5c', '#d8cfc3', '#fcfaf7', '#2d2925'],
      })

      setTimeout(() => setWishSuccess(false), 6000)
    }
  }

  const toggleHeart = (wishId: string) => {
    const isLiked = likedWishes[wishId]
    setLikedWishes((prev) => ({ ...prev, [wishId]: !isLiked }))
    setWishes((prev) =>
      prev.map((w) => {
        if (w.id === wishId) {
          return {
            ...w,
            heartCount: isLiked ? Math.max(0, w.heartCount - 1) : w.heartCount + 1,
          }
        }
        return w
      })
    )
  }

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

  const enterCelebration = useCallback(() => {
    // 1. Dispatch custom play event to unlock audio
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('play-wedding-music'))
        ; (window as any).__playWeddingMusic?.()
    }

    // 2. Dismiss loading screen immediately
    setIsAppLoading(false)

    // 3. Fire celebratory wedding confetti
    confetti({
      particleCount: 160,
      spread: 100,
      origin: { y: 0.4 },
      colors: ['#ad8b5c', '#d8cfc3', '#fcfaf7', '#2d2925'],
      disableForReducedMotion: true,
      zIndex: 100,
    })
  }, [])

  useEffect(() => {
    let frameId: number
    let isActive = false

    // Auto-enter after 2.8s if user hasn't tapped yet
    const timer = setTimeout(() => {
      enterCelebration()
      isActive = true

      const colors = ['#ad8b5c', '#d8cfc3', '#fcfaf7', '#2d2925']

      function randomInRange(min: number, max: number) {
        return Math.random() * (max - min) + min
      }

      let skew = 1
      let lastTime = Date.now()

        ; (function frame() {
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
    }, 2800)

    return () => {
      clearTimeout(timer)
      isActive = false
      if (frameId) cancelAnimationFrame(frameId)
    }
  }, [enterCelebration])

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  const [faq, setFaq] = useState<number | null>(0)
  const nav = ['Our Story', 'The Wedding', 'Schedule', 'Gallery', 'Gifts', 'Wishes', 'Travel', 'FAQ']
  const directions = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(venue)}`

  const fadeUp: Variants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: 'easeOut' } },
  }

  return (
    <main className="site-shell">
      {/* Background Audio Player with Autoplay & Floating Luxury Controls */}
      <AudioPlayer />

      {/* Initial Page Loading Overlay with Tap-to-Enter Audio Unlock */}
      <AnimatePresence>
        {isAppLoading && (
          <motion.div
            key="loader"
            initial={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.8, ease: 'easeInOut' }}
            onClick={enterCelebration}
            style={{
              position: 'fixed',
              inset: 0,
              zIndex: 100,
              background: 'radial-gradient(ellipse at center, #2e261f 0%, #16120e 100%)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              alignItems: 'center',
              cursor: 'pointer',
              color: '#fff',
              padding: '24px',
              textAlign: 'center',
            }}
          >
            <motion.div
              initial={{ opacity: 0.5, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 1.2, repeat: Infinity, repeatType: 'reverse', ease: 'easeInOut' }}
              className="invitation-mark"
              style={{ fontSize: 'clamp(64px, 14vw, 100px)', color: 'var(--gold)', marginBottom: '14px' }}
            >
              O <span>&</span> I
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.7 }}
              style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '8px' }}
            >
              <span style={{ font: "italic 22px 'Playfair Display', serif", color: '#fff', letterSpacing: '0.04em' }}>
                Odunayo &amp; Ibitayo
              </span>
              <span style={{ fontSize: '10.5px', textTransform: 'uppercase', letterSpacing: '0.22em', color: 'var(--gold-light)' }}>
                The Wedding Celebration · November 2026
              </span>

              <motion.div
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                style={{
                  marginTop: '28px',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px',
                  padding: '11px 24px',
                  borderRadius: '50px',
                  background: 'rgba(212, 175, 124, 0.16)',
                  border: '1px solid rgba(212, 175, 124, 0.55)',
                  color: '#fff',
                  fontSize: '11px',
                  textTransform: 'uppercase',
                  letterSpacing: '0.14em',
                  fontWeight: 600,
                  boxShadow: '0 8px 25px rgba(0,0,0,0.3)',
                }}
              >
                <Music className="w-3.5 h-3.5 text-[#d4af7c] animate-pulse" />
                <span>Open Invitation ♫</span>
              </motion.div>

              <span style={{ marginTop: '14px', fontSize: '9.5px', letterSpacing: '0.14em', color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase' }}>
                Tap anywhere to enter with music
              </span>
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
          <a className="nav-rsvp" href="#wishes" onClick={() => setMenuOpen(false)}>
            Send Wishes <MessageSquareHeart className="w-3.5 h-3.5 ml-1 text-[#d4af7c]" />
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
            src="/images/romantic-blue-and-gold-embrace.png"
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
              href="#wishes"
            >
              Send Blessings & Wishes <Heart className="w-3.5 h-3.5 text-[#d4af7c] fill-[#d4af7c]" />
            </motion.a>
            <motion.a
              variants={{ hidden: { opacity: 0, y: 20 }, visible: { opacity: 1, y: 0, transition: { duration: 1 } } }}
              className="button button-light glassmorphism-dark"
              href="#gifts"
            >
              Gifts & Registry <Gift className="w-3.5 h-3.5 text-[#d4af7c]" />
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
            Saturday, November 28, 2026 <span>·</span> 8:00 AM Prompt WAT
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

      {/* The Wedding Details Section */}
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
            <strong>08:00 AM Prompt</strong>
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
          <motion.a
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
            viewport={{ once: true }}
            className="button button-dark glassmorphism-dark"
            href="tel:07037008505"
            title="Call Olamide for directions or enquiries"
          >
            Call for directions <PhoneCall className="w-4 h-4 text-[#d4af7c]" />
          </motion.a>
        </div>
      </section>

      {/* THE RHYTHM OF THE DAY - Strictly 8:00 AM & 10:00 AM */}
      <section className="schedule section-pad" id="schedule">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-100px' }} variants={fadeUp} className="section-heading centered">
          <p className="eyebrow">The rhythm of the day</p>
          <h2>
            Order of events,<br />
            <i>prompt & joyous.</i>
          </h2>
        </motion.div>
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-100px' }}
          variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.2 } } }}
          className="timeline"
          style={{ maxWidth: 860, margin: '0 auto' }}
        >
          <motion.div variants={{ hidden: { opacity: 0, x: -20 }, visible: { opacity: 1, x: 0, transition: { duration: 0.8, ease: 'easeOut' } } }}>
            <time style={{ fontSize: '14px', fontWeight: 700 }}>08:00 AM PROMPT</time>
            <h3>Engagement & Traditional Wedding</h3>
            <p>The cultural marriage rites, presentation of the bride, family greetings, and ancestral blessings.</p>
          </motion.div>

          <motion.div variants={{ hidden: { opacity: 0, x: -20 }, visible: { opacity: 1, x: 0, transition: { duration: 0.8, ease: 'easeOut' } } }}>
            <time style={{ fontSize: '14px', fontWeight: 700 }}>10:00 AM PROMPT</time>
            <h3>Church Wedding Ceremony</h3>
            <p>Christ Apostolic Church, Mountain of Salvation. Solemnization of holy matrimony, covenant vows, and thanksgiving.</p>
          </motion.div>
        </motion.div>
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

      {/* GIFTS & BLESSINGS (Bank Details + International Guidance) */}
      <section className="gifts-section section-pad" id="gifts">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-100px' }} variants={fadeUp} className="section-heading centered">
          <p className="eyebrow">Love & Generosity</p>
          <h2>
            Gifts & Tokens<br />
            <i>of love.</i>
          </h2>
          <p style={{ maxWidth: 620, margin: '14px auto 0', color: 'var(--muted)', fontSize: '14.5px', lineHeight: 1.8 }}>
            Your prayers and presence are the greatest gifts we could ask for. For friends and family who wish to bless our new home with a monetary gift, our bank details and international options are provided below.
          </p>
        </motion.div>

        <div className="gifts-grid">
          {/* Nigerian Bank Cards Column (Bride First, then Groom) */}
          <div className="gifts-accounts-col">
            {/* Bride's Account: GTBank (Guaranty Trust Bank) */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
              className="bank-card-container gtb-card"
            >
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                  <div className="bank-card-chip gtb-chip" />
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span className="account-tag gtb-tag">Bride&apos;s Account</span>
                    <span style={{ font: "italic 22px 'Playfair Display', serif", color: '#ffb380' }}>
                      GTBank
                    </span>
                  </div>
                </div>

                <div className="bank-card-title">Bank Name</div>
                <div style={{ fontSize: '18px', fontWeight: 600, color: '#fff', letterSpacing: '0.03em' }}>
                  Guaranty Trust Bank (GTB)
                </div>

                <div className="bank-card-title" style={{ marginTop: '16px' }}>
                  Account Number
                </div>
                <div className="bank-card-number">
                  0142301947
                </div>

                <div className="bank-card-title">Account Name</div>
                <div style={{ fontSize: '16px', fontWeight: 600, color: '#fbeee6', letterSpacing: '0.02em' }}>
                  Odunayo Akinde Janet
                </div>
              </div>

              <div className="bank-card-footer">
                <span style={{ fontSize: '11px', color: '#c7b2a6', letterSpacing: '0.06em' }}>
                  Currency: NGN (Naira) · Bride
                </span>
                <button
                  type="button"
                  onClick={() => handleCopyAccount('0142301947', 'gtb')}
                  className="copy-account-btn gtb-copy-btn"
                  aria-label="Copy GTBank account number"
                >
                  {copiedAccount === 'gtb' ? (
                    <>
                      <Check className="w-4 h-4 text-emerald-300" />
                      <span>Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4" />
                      <span>Copy Number</span>
                    </>
                  )}
                </button>
              </div>
            </motion.div>

            {/* Groom's Account: Sterling Bank */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.15 }}
              viewport={{ once: true }}
              className="bank-card-container"
            >
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                  <div className="bank-card-chip" />
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <span className="account-tag">Groom&apos;s Account</span>
                    <span style={{ font: "italic 22px 'Playfair Display', serif", color: 'var(--gold-light)' }}>
                      Sterling
                    </span>
                  </div>
                </div>

                <div className="bank-card-title">Bank Name</div>
                <div style={{ fontSize: '18px', fontWeight: 600, color: '#fff', letterSpacing: '0.03em' }}>
                  Sterling Bank
                </div>

                <div className="bank-card-title" style={{ marginTop: '16px' }}>
                  Account Number
                </div>
                <div className="bank-card-number">
                  0088927432
                </div>

                <div className="bank-card-title">Account Name</div>
                <div style={{ fontSize: '16px', fontWeight: 600, color: '#f3ece3', letterSpacing: '0.02em' }}>
                  Akinnibosun Ibitayo
                </div>
              </div>

              <div className="bank-card-footer">
                <span style={{ fontSize: '11px', color: '#b8aba0', letterSpacing: '0.06em' }}>
                  Currency: NGN (Naira) · Groom
                </span>
                <button
                  type="button"
                  onClick={() => handleCopyAccount('0088927432', 'sterling')}
                  className="copy-account-btn"
                  aria-label="Copy Sterling Bank account number"
                >
                  {copiedAccount === 'sterling' ? (
                    <>
                      <Check className="w-4 h-4 text-emerald-300" />
                      <span>Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4" />
                      <span>Copy Number</span>
                    </>
                  )}
                </button>
              </div>
            </motion.div>
          </div>

          {/* International Guests Guide (USA, UK, Canada, Australia) */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
            className="intl-card glassmorphism"
          >
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                <Globe2 className="w-5 h-5 text-[#ad8b5c]" />
                <span className="eyebrow" style={{ margin: 0 }}>Sending From Abroad?</span>
              </div>
              <h3 style={{ font: "400 24px 'Playfair Display', serif", margin: '0 0 10px', color: 'var(--ink)' }}>
                USA, UK, Canada & Australia
              </h3>
              <p style={{ color: 'var(--muted)', fontSize: '13px', lineHeight: 1.7, margin: 0 }}>
                Guests abroad can pay directly into either the GTBank or Sterling Bank account in seconds at live bank exchange rates using any of these trusted remittance apps:
              </p>

              <div className="intl-pill-grid">
                <div className="intl-pill-item">
                  <span className="intl-pill-name">LemFi</span>
                  <span className="intl-pill-desc">UK, USA, Canada · Zero transfer fees to Nigeria</span>
                </div>
                <div className="intl-pill-item">
                  <span className="intl-pill-name">Remitly</span>
                  <span className="intl-pill-desc">USA, UK, Australia, Canada · Direct deposit to GTB / Sterling</span>
                </div>
                <div className="intl-pill-item">
                  <span className="intl-pill-name">Sendwave</span>
                  <span className="intl-pill-desc">USA, UK, Canada, Europe · Fee-free instant transfer</span>
                </div>
                <div className="intl-pill-item">
                  <span className="intl-pill-name">WorldRemit</span>
                  <span className="intl-pill-desc">Australia, UK, USA · Bank transfer to GTB or Sterling</span>
                </div>
              </div>
            </div>

            <div style={{ background: 'rgba(173, 139, 92, 0.1)', padding: '14px 16px', borderRadius: '12px', border: '1px solid rgba(173, 139, 92, 0.25)' }}>
              <p style={{ fontSize: '12px', color: 'var(--ink)', margin: 0, lineHeight: 1.65 }}>
                <strong>Easy 2-Minute Steps:</strong> Open your remittance app → Select <strong>Nigeria</strong> → Choose <strong>Bank Transfer</strong> → Select either <strong>GTBank</strong> (0142301947 · Odunayo Akinde Janet) or <strong>Sterling Bank</strong> (0088927432 · Akinnibosun Ibitayo). Transfers arrive immediately!
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* WISHES & GUESTBOOK (Replacing RSVP with Live Public Wishes) */}
      <section className="wishes-section section-pad" id="wishes">
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-100px' }} variants={fadeUp} className="section-heading centered">
          <p className="eyebrow">Words of blessing</p>
          <h2>
            Leave your wishes<br />
            <i>for the couple.</i>
          </h2>
          <p style={{ maxWidth: 600, margin: '14px auto 0', color: 'var(--muted)', fontSize: '14.5px', lineHeight: 1.8 }}>
            Share your prayers, love, and congratulations for Odunayo & Ibitayo. Your message will be published live below for all our family and friends to read!
          </p>
        </motion.div>

        <div className="wishes-container">
          {/* Wishes Form Card */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="wishes-form-card glassmorphism"
          >
            {wishSuccess && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                style={{
                  background: 'rgba(46, 125, 50, 0.1)',
                  border: '1px solid rgba(46, 125, 50, 0.3)',
                  padding: '14px 18px',
                  borderRadius: '12px',
                  marginBottom: '20px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  color: '#1b5e20',
                  fontSize: '13.5px',
                }}
              >
                <Check className="w-5 h-5 text-emerald-600" />
                <span>Thank you! Your heartfelt blessing has been published on the wall below.</span>
              </motion.div>
            )}

            <form onSubmit={handleWishSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '16px' }}>
                <div>
                  <label htmlFor="wishName" style={{ display: 'block', fontSize: '10.5px', textTransform: 'uppercase', letterSpacing: '0.14em', fontWeight: 600, color: 'var(--muted)', marginBottom: '6px' }}>
                    Your Name *
                  </label>
                  <input
                    id="wishName"
                    value={wishName}
                    onChange={(e) => setWishName(e.target.value)}
                    required
                    placeholder="e.g. Segun & Bolanle"
                    style={{
                      width: '100%',
                      padding: '12px 14px',
                      background: 'rgba(255, 255, 255, 0.8)',
                      border: '1px solid rgba(173, 139, 92, 0.3)',
                      borderRadius: '8px',
                      outline: 'none',
                      fontSize: '14px',
                      color: 'var(--ink)',
                    }}
                  />
                </div>
                <div>
                  <label htmlFor="wishLocation" style={{ display: 'block', fontSize: '10.5px', textTransform: 'uppercase', letterSpacing: '0.14em', fontWeight: 600, color: 'var(--muted)', marginBottom: '6px' }}>
                    Your City / Country (Optional)
                  </label>
                  <input
                    id="wishLocation"
                    value={wishLocation}
                    onChange={(e) => setWishLocation(e.target.value)}
                    placeholder="e.g. London, UK / Lagos, Nigeria"
                    style={{
                      width: '100%',
                      padding: '12px 14px',
                      background: 'rgba(255, 255, 255, 0.8)',
                      border: '1px solid rgba(173, 139, 92, 0.3)',
                      borderRadius: '8px',
                      outline: 'none',
                      fontSize: '14px',
                      color: 'var(--ink)',
                    }}
                  />
                </div>
              </div>

              <div>
                <label htmlFor="wishMessage" style={{ display: 'block', fontSize: '10.5px', textTransform: 'uppercase', letterSpacing: '0.14em', fontWeight: 600, color: 'var(--muted)', marginBottom: '6px' }}>
                  Your Message or Prayer for the Couple *
                </label>
                <textarea
                  id="wishMessage"
                  value={wishMessage}
                  onChange={(e) => setWishMessage(e.target.value)}
                  required
                  rows={4}
                  placeholder="Write your prayers, blessings, or wedding congratulations here..."
                  style={{
                    width: '100%',
                    padding: '12px 14px',
                    background: 'rgba(255, 255, 255, 0.8)',
                    border: '1px solid rgba(173, 139, 92, 0.3)',
                    borderRadius: '8px',
                    outline: 'none',
                    fontSize: '14px',
                    color: 'var(--ink)',
                    resize: 'vertical',
                  }}
                />
              </div>

              <div style={{ display: 'flex', gap: '15px', flexWrap: 'wrap', alignItems: 'center', marginTop: '10px' }}>
                <button
                  type="submit"
                  disabled={isSubmittingWish}
                  className="button button-dark"
                  style={{ padding: '14px 28px', borderRadius: '8px' }}
                >
                  {isSubmittingWish ? 'Publishing...' : 'Publish Blessing'} <Heart className="w-4 h-4 fill-[#ad8b5c] text-[#ad8b5c]" />
                </button>
                <span style={{ fontSize: '11px', color: 'var(--muted)' }}>
                  Your blessing will appear on the guest wall immediately.
                </span>
              </div>
            </form>
          </motion.div>

          {/* Published Wishes Wall (Paginated: 5 at a time) */}
          <div className="wishes-grid">
            {wishes.slice(0, visibleWishesCount).map((item, index) => (
              <motion.div
                key={item.id || index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: (index % 5) * 0.08 }}
                viewport={{ once: true }}
                className="wish-card"
              >
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                    <span style={{ fontSize: '10.5px', letterSpacing: '0.14em', textTransform: 'uppercase', color: 'var(--gold)', fontWeight: 600 }}>
                      {item.location}
                    </span>
                    <span style={{ fontSize: '10.5px', color: 'var(--muted)' }}>
                      {item.date}
                    </span>
                  </div>
                  <p className="wish-card-text">
                    “{item.message}”
                  </p>
                </div>

                <div className="wish-card-author">
                  <strong style={{ font: "600 14px 'DM Sans', sans-serif", color: 'var(--ink)' }}>
                    {item.name}
                  </strong>
                  <button
                    onClick={() => toggleHeart(item.id)}
                    className={`heart-button ${likedWishes[item.id] ? 'active' : ''}`}
                    aria-label="Send love to this wish"
                  >
                    <Heart className={`w-3.5 h-3.5 ${likedWishes[item.id] ? 'fill-current' : ''}`} />
                    <span>{item.heartCount}</span>
                  </button>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Read More / Next 5 Wishes Pagination Button */}
          {wishes.length > 5 && (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '14px', marginTop: '36px' }}>
              {visibleWishesCount < wishes.length ? (
                <button
                  type="button"
                  onClick={() => setVisibleWishesCount((prev) => prev + 5)}
                  className="button button-dark"
                  style={{
                    padding: '13px 30px',
                    borderRadius: '50px',
                    fontSize: '11px',
                    letterSpacing: '0.14em',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '10px',
                    cursor: 'pointer',
                    boxShadow: '0 8px 25px rgba(0,0,0,0.12)',
                  }}
                >
                  <span>Read More Wishes ({Math.min(5, wishes.length - visibleWishesCount)} more)</span>
                  <ChevronDown className="w-4 h-4 text-[#d4af7c]" />
                </button>
              ) : (
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px', flexWrap: 'wrap', justifyContent: 'center' }}>
                  <span style={{ fontSize: '13px', color: 'var(--muted)', fontStyle: 'italic' }}>
                    You&apos;ve read all {wishes.length} blessings ❤️
                  </span>
                  <button
                    type="button"
                    onClick={() => {
                      setVisibleWishesCount(5)
                      const el = document.getElementById('wishes')
                      if (el) el.scrollIntoView({ behavior: 'smooth' })
                    }}
                    className="button button-light"
                    style={{
                      padding: '8px 18px',
                      borderRadius: '50px',
                      fontSize: '10px',
                      color: 'var(--ink)',
                      borderColor: 'rgba(173,139,92,0.4)',
                      cursor: 'pointer',
                    }}
                  >
                    Show First 5
                  </button>
                </div>
              )}
              <span style={{ fontSize: '11px', color: 'var(--muted)', letterSpacing: '0.06em' }}>
                Showing {Math.min(visibleWishesCount, wishes.length)} of {wishes.length} blessings
              </span>
            </div>
          )}
        </div>
      </section>

      {/* Travel & Stay Section */}
      <section className="story section-pad" id="travel" style={{ background: '#eee8df' }}>
        <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: '-100px' }} variants={fadeUp} className="section-heading centered">
          <p className="eyebrow">Travel & Stay</p>
          <h2>
            For our out-of-town
            <br />
            <i>guests.</i>
          </h2>
        </motion.div>
        <div style={{ maxWidth: 860, margin: '0 auto', display: 'grid', gap: '30px', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))' }}>
          <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} className="glassmorphism" style={{ padding: 40, border: '1px solid rgba(173,139,92,0.2)' }}>
            <h3 style={{ font: "400 24px 'Playfair Display', serif", margin: '0 0 15px', color: 'var(--ink)' }}>Getting Here</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <p style={{ color: 'var(--muted)', fontSize: 14, lineHeight: 1.8, margin: 0 }}>
                <strong>Driving from outside Lagos:</strong> If you are entering through Berger, connect towards Sango Ota.
              </p>
              <p style={{ color: 'var(--muted)', fontSize: 14, lineHeight: 1.8, margin: 0 }}>
                <strong>From within Lagos:</strong> Navigate to Sango, then proceed to Veepee Bus Stop. From there, take a short ride down to Baba Barber Junction—the church (CAC) is right in front of the junction.
              </p>
              <p style={{ color: 'var(--muted)', fontSize: 14, lineHeight: 1.8, margin: 0 }}>
                <strong>Flying in:</strong> Murtala Muhammed International Airport (LOS) is approximately 45-60 minutes away. Bolt and Uber are readily available.
              </p>
            </div>
          </motion.div>
          <motion.div variants={fadeUp} initial="hidden" whileInView="visible" viewport={{ once: true }} className="glassmorphism" style={{ padding: 40, border: '1px solid rgba(173,139,92,0.2)' }}>
            <h3 style={{ font: "400 24px 'Playfair Display', serif", margin: '0 0 15px', color: 'var(--ink)' }}>Where to Stay</h3>
            <p style={{ color: 'var(--muted)', fontSize: 14, lineHeight: 1.8, margin: 0 }}>
              We recommend booking a hotel in the Ikeja area (ideal for airport transit and shopping) or reputable accommodations within Sango Ota for ease of morning arrival.
            </p>
          </motion.div>

          {/* Location & Enquiries Direct Contact Card */}
          <motion.div
            variants={fadeUp}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            className="glassmorphism"
            style={{
              gridColumn: '1 / -1',
              padding: '30px 32px',
              border: '1px solid rgba(173,139,92,0.3)',
              background: 'linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(247,242,235,0.95) 100%)',
              borderRadius: '18px',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: '20px',
            }}
          >
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '8px' }}>
                <PhoneCall className="w-4 h-4 text-[#ad8b5c]" />
                <span className="eyebrow" style={{ margin: 0 }}>Location &amp; Enquiries</span>
              </div>
              <h3 style={{ font: "400 22px 'Playfair Display', serif", margin: '0 0 6px', color: 'var(--ink)' }}>
                Need Directions or Assistance on the Day?
              </h3>
              <p style={{ color: 'var(--muted)', fontSize: '13.5px', margin: 0, lineHeight: 1.6 }}>
                For landmark assistance from Veepee / Baba Barber Junction or any enquiries, please call:
                <br />
                <strong style={{ color: 'var(--ink)', fontSize: '15px' }}>Olamide</strong> ·{' '}
                <a href="tel:07037008505" style={{ color: 'var(--gold)', fontWeight: 700, letterSpacing: '0.04em', textDecoration: 'none' }}>
                  07037008505
                </a>
              </p>
            </div>

            <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
              <a
                href="tel:07037008505"
                className="button button-dark"
                style={{ padding: '12px 20px', borderRadius: '8px', fontSize: '11px', textDecoration: 'none' }}
              >
                <PhoneCall className="w-4 h-4 text-[#d4af7c]" /> Call 07037008505
              </a>
              <a
                href="https://wa.me/2347037008505?text=Hello%20Olamide%2C%20I%20am%20calling%2Fmessaging%20regarding%20directions%20to%20Odunayo%20and%20Ibitayo%27s%20wedding"
                target="_blank"
                rel="noreferrer"
                className="button button-light"
                style={{ padding: '12px 18px', borderRadius: '8px', fontSize: '11px', color: 'var(--ink)', borderColor: 'rgba(173,139,92,0.4)', textDecoration: 'none' }}
              >
                <MessageCircle className="w-4 h-4 text-emerald-600" /> WhatsApp Olamide
              </a>
            </div>
          </motion.div>
        </div>
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
          {[
            'Where is the wedding?',
            'What time should guests arrive?',
            'How can I send my wedding gift or contribution?',
            'Who can I call for directions or enquiries?',
            'Is there a dress code / colors of the day?',
          ].map((question, i) => (
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
                    'Please note our prompt timing: Engagement & Traditional Wedding begins at 8:00 AM Prompt, followed by the Church Wedding Ceremony at 10:00 AM Prompt.',
                    'You can transfer directly to either Sterling Bank (0088927432 · Akinnibosun Ibitayo) or GTBank (0142301947 · Odunayo Akinde Janet). Guests from abroad can send seamlessly via LemFi, Remitly, Sendwave, or WorldRemit.',
                    'For real-time directions, landmarks in Sango Ota, or any wedding day enquiries, please call Olamide on 07037008505.',
                    'Our colors of the day are Purple and champagne gold. We cannot wait to see you looking magnificent!',
                  ][i]}
                </motion.p>
              )}
            </motion.div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer>
        <a className="wordmark" href="#top">
          O <span>&</span> I
        </a>
        <p>With love, gratitude & joy.</p>
        <div style={{ marginTop: '14px', fontSize: '12px', color: '#cfc4b6' }}>
          For directions &amp; enquiries on the day: Call <strong>Olamide</strong> on{' '}
          <a href="tel:07037008505" style={{ color: 'var(--gold-light)', textDecoration: 'underline' }}>
            07037008505
          </a>
        </div>
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
