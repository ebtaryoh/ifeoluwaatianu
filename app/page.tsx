'use client'

import { useEffect, useMemo, useState } from 'react'
import { ArrowDown, ArrowUpRight, CalendarDays, Check, ChevronDown, Clock3, Heart, MapPin, Menu, Send, X } from 'lucide-react'
import confetti from 'canvas-confetti'
import { motion, AnimatePresence } from 'framer-motion'

const eventDate = new Date('2026-11-28T11:00:00+01:00')
const venue = 'MFM Regional Headquarters, Singer Bus Stop, Ogun State, Nigeria'

const gallery = [
  { src: '/wedding-hero.png', alt: 'Ibitayo and Odunayo together', label: 'The beginning' },
  { src: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=1200&q=85', alt: 'Wedding rings on silk', label: 'The details' },
  { src: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=1200&q=85', alt: 'Bride in an elegant wedding dress', label: 'The feeling' },
  { src: 'https://images.unsplash.com/photo-1519225421980-715cb0215aed?auto=format&fit=crop&w=1200&q=85', alt: 'Wedding celebration table', label: 'The celebration' },
]

function Countdown() {
  const [now, setNow] = useState(() => new Date())
  useEffect(() => { const id = window.setInterval(() => setNow(new Date()), 1000); return () => window.clearInterval(id) }, [])
  const values = useMemo(() => {
    const diff = eventDate.getTime() - now.getTime()
    if (diff <= 0) return null
    return [Math.floor(diff / 86400000), Math.floor(diff / 3600000) % 24, Math.floor(diff / 60000) % 60, Math.floor(diff / 1000) % 60]
  }, [now])
  return <div className="countdown" aria-live="polite">{values ? values.map((value, i) => <div className="count-item" key={i}><strong>{String(value).padStart(2, '0')}</strong><span>{['Days', 'Hours', 'Minutes', 'Seconds'][i]}</span></div>) : <p className="after-countdown">Today we celebrate forever.</p>}</div>
}

export default function Page() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [lightbox, setLightbox] = useState<number | null>(null)
  const [rsvpSent, setRsvpSent] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const [isAppLoading, setIsAppLoading] = useState(true)

  useEffect(() => {
    let frameId: number;
    let isActive = false;

    const timer = setTimeout(() => {
      setIsAppLoading(false)
      isActive = true;

      const colors = ['#ad8b5c', '#d8cfc3', '#fcfaf7', '#2d2925'];
      
      // 1. Initial Grand Burst
      confetti({
        particleCount: 150,
        spread: 100,
        origin: { y: 0.4 },
        colors: colors,
        disableForReducedMotion: true,
        zIndex: 100
      });
      
      // 2. Gentle Continuous Snow (Very little and slow)
      function randomInRange(min: number, max: number) {
        return Math.random() * (max - min) + min;
      }
      
      let skew = 1;
      let lastTime = Date.now();
      
      (function frame() {
        if (!isActive) return;
        
        frameId = requestAnimationFrame(frame);
        
        // Only fire a particle every 400ms to keep it very sparse
        const now = Date.now();
        if (now - lastTime < 400) return;
        lastTime = now;
        
        skew = Math.max(0.8, skew - 0.001);

        confetti({
          particleCount: 1,
          startVelocity: 0,
          ticks: 800, // Stays on screen longer
          origin: {
            x: Math.random(),
            y: (Math.random() * skew) - 0.2
          },
          colors: colors,
          shapes: ['circle'],
          gravity: randomInRange(0.1, 0.2), // Very slow fall
          scalar: randomInRange(0.4, 0.9), // Slightly smaller
          drift: randomInRange(-0.2, 0.2), // Subtle sway
          disableForReducedMotion: true,
          zIndex: 100
        });
      }());

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
  const nav = ['Our Story', 'The Wedding', 'Schedule', 'Gallery', 'RSVP']
  const directions = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(venue)}`
  
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  
  const handleRsvpSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)
    setErrorMessage('')
    
    const formData = new FormData(e.currentTarget)
    
    // 👇 Replace this with your actual Web3Forms access key
    formData.append("access_key", "YOUR_ACCESS_KEY_HERE")
    
    // Optional: Subject line for the email
    formData.append("subject", "New RSVP for Ibitayo & Odunayo's Wedding!")
    
    try {
      const response = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        body: formData
      })
      const data = await response.json()
      
      if (data.success || formData.get('access_key') === 'YOUR_ACCESS_KEY_HERE') {
        // We also show success if you haven't put your key in yet just so you can test the UI
        setRsvpSent(true)
        confetti({
          particleCount: 150,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#ad8b5c', '#d8cfc3', '#fcfaf7', '#2d2925']
        })
      } else {
        setErrorMessage("Something went wrong. Please check your connection and try again.")
      }
    } catch (error) {
      setErrorMessage("Something went wrong. Please check your connection and try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const fadeUp = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" } }
  }

  return <main className="site-shell">
    <AnimatePresence>
      {isAppLoading && (
        <motion.div 
          key="loader"
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8, ease: "easeInOut" }}
          style={{ position: 'fixed', inset: 0, zIndex: 100, background: 'var(--cream)', display: 'grid', placeItems: 'center' }}
        >
          <motion.div
            initial={{ opacity: 0.5, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, repeat: Infinity, repeatType: 'reverse', ease: "easeInOut" }}
            className="invitation-mark"
            style={{ fontSize: '100px', color: 'var(--gold)' }}
          >
            I <span>&</span> O
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>

    <header className={`nav-wrap ${isScrolled ? 'scrolled' : ''}`}>
      <a className="wordmark" href="#top" aria-label="Ibitayo and Odunayo home">I <span>&</span> O</a>
      <nav className={menuOpen ? 'nav-links open' : 'nav-links'} aria-label="Primary navigation">{nav.map(item => <a key={item} href={`#${item.toLowerCase().replaceAll(' ', '-')}`} onClick={() => setMenuOpen(false)}>{item}</a>)}<a className="nav-rsvp" href="#rsvp" onClick={() => setMenuOpen(false)}>RSVP <ArrowUpRight aria-hidden="true" /></a></nav>
      <button className="menu-button" aria-label={menuOpen ? 'Close menu' : 'Open menu'} onClick={() => setMenuOpen(!menuOpen)}>{menuOpen ? <X /> : <Menu />}</button>
    </header>

    <section className="hero" id="top">
      <img className="hero-image" src="/wedding-hero.png" alt="Ibitayo and Odunayo, a bride and groom in a warm editorial portrait" />
      <div className="hero-overlay" />
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 1.2, delay: 0.2 }} className="hero-content">
        <p className="eyebrow light">Together with their families</p>
        <h1><span>Ibitayo</span><em>&</em><span>Odunayo</span></h1>
        <p className="hero-date">28 <i>•</i> 11 <i>•</i> 2026</p>
        <p className="hero-location">Our wedding day <span>·</span> Ogun State, Nigeria</p>
        <a className="button button-light glassmorphism-dark" href="#rsvp">Join our celebration <ArrowDown aria-hidden="true" /></a>
      </motion.div>
      <div className="scroll-cue"><span>Scroll to explore</span><i /></div>
    </section>

    <section className="countdown-section"><motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={fadeUp}><div className="section-kicker">Counting down to forever</div><Countdown /><p className="count-note">Saturday, November 28, 2026 <span>·</span> 11:00 AM WAT</p></motion.div></section>

    <section className="invitation section-pad"><motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={fadeUp} className="invitation-copy"><p className="eyebrow">An invitation</p><h2>Two hearts.<br /><i>One covenant.</i><br />A lifetime together.</h2><p>With grateful hearts and joyful anticipation, we invite you to witness the beginning of our forever.</p><a className="text-link" href="#the-wedding">Discover the day <ArrowUpRight /></a></motion.div><motion.div initial={{ opacity: 0, x: 50 }} whileInView={{ opacity: 1, x: 0 }} transition={{ duration: 1 }} viewport={{ once: true }} className="invitation-mark">I <span>&</span> O</motion.div></section>

    <section className="story section-pad" id="our-story"><motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={fadeUp} className="section-heading"><p className="eyebrow">The journey</p><h2>Our story is still<br /><i>being written.</i></h2></motion.div><div className="story-grid"><motion.div initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} transition={{ duration: 0.8 }} viewport={{ once: true }} className="story-image"><img src="https://images.unsplash.com/photo-1516589178581-6cd7833ae3b2?auto=format&fit=crop&w=1000&q=85" alt="Couple holding hands in soft light" /></motion.div><motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} transition={{ duration: 0.8, delay: 0.2 }} viewport={{ once: true }} className="story-text"><span className="story-number">01</span><h3>The beginning</h3><p>A beautiful chapter is unfolding. Here, the couple will share the story of how two lives met, grew together, and found their way to this joyful promise.</p><p className="muted">This space is ready for their words, their memories, and the little moments that made this love theirs.</p><div className="line" /></motion.div></div></section>

    <section className="quote-section">
      <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={fadeUp} className="quote-inner">
        <div className="rings-container">
          <motion.div initial={{ x: -120, opacity: 0 }} whileInView={{ x: 18, opacity: 1 }} transition={{ duration: 2, ease: "easeOut" }} viewport={{ once: true }} className="wedding-ring" />
          <motion.div initial={{ x: 120, opacity: 0 }} whileInView={{ x: -18, opacity: 1 }} transition={{ duration: 2, ease: "easeOut" }} viewport={{ once: true }} className="wedding-ring" />
          <motion.div initial={{ scale: 0 }} whileInView={{ scale: 1 }} transition={{ duration: 0.8, delay: 1.5, type: "spring" }} viewport={{ once: true }} style={{ display: 'flex', alignItems: 'center' }}>
            <Heart className="quote-heart" aria-hidden="true" />
          </motion.div>
        </div>
        <blockquote>“Therefore what God has joined together, let no one separate.”</blockquote>
        <cite>Mark 10:9</cite>
      </motion.div>
    </section>

    <section className="details section-pad" id="the-wedding" style={{ background: "linear-gradient(to bottom, #fcfaf7, #e9e2d9)" }}><motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={fadeUp} className="section-heading centered"><p className="eyebrow">The wedding</p><h2>A day to remember,<br /><i>a love to celebrate.</i></h2></motion.div><div className="details-grid"><motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.1 }} viewport={{ once: true }} className="detail-card glassmorphism"><CalendarDays /><span>The date</span><strong>Saturday, November 28, 2026</strong></motion.div><motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.2 }} viewport={{ once: true }} className="detail-card glassmorphism"><Clock3 /><span>The time</span><strong>11:00 AM WAT</strong></motion.div><motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.6, delay: 0.3 }} viewport={{ once: true }} className="detail-card glassmorphism"><MapPin /><span>The venue</span><strong>MFM Regional Headquarters<br />Singer Bus Stop, Ogun State</strong></motion.div></div><motion.a initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} transition={{ delay: 0.5 }} viewport={{ once: true }} className="button button-dark glassmorphism-dark" href={directions} target="_blank" rel="noreferrer">Get directions <ArrowUpRight /></motion.a></section>

    <section className="schedule section-pad" id="schedule"><motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={fadeUp} className="section-heading"><p className="eyebrow">The rhythm of the day</p><h2>Make a day<br /><i>of it.</i></h2></motion.div><div className="timeline"><motion.div initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} transition={{ duration: 0.5, delay: 0.1 }} viewport={{ once: true }}><time>11:00 AM</time><h3>Wedding Ceremony</h3><p>MFM Regional Headquarters</p></motion.div><motion.div initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} transition={{ duration: 0.5, delay: 0.2 }} viewport={{ once: true }} className="placeholder-event"><time>12:30 PM</time><h3>Photography & Family Moments</h3><p>Schedule details to follow</p></motion.div><motion.div initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} transition={{ duration: 0.5, delay: 0.3 }} viewport={{ once: true }} className="placeholder-event"><time>01:30 PM</time><h3>Reception & Celebration</h3><p>Schedule details to follow</p></motion.div></div></section>

    <section className="gallery-section section-pad" id="gallery"><motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={fadeUp} className="section-heading centered"><p className="eyebrow">A glimpse of us</p><h2>Moments, held<br /><i>in light.</i></h2></motion.div><div className="gallery-grid">{gallery.map((image, i) => <motion.button initial={{ opacity: 0, scale: 0.95 }} whileInView={{ opacity: 1, scale: 1 }} transition={{ duration: 0.6, delay: i * 0.1 }} viewport={{ once: true }} className={`gallery-item item-${i + 1}`} key={image.src} onClick={() => setLightbox(i)}><img src={image.src} alt={image.alt} /><span>{image.label}<ArrowUpRight /></span></motion.button>)}</div></section>

    <section className="rsvp-section" id="rsvp">
      <motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={fadeUp} className="rsvp-copy">
        <p className="eyebrow light">We hope you can make it</p>
        <h2>Will you celebrate<br /><i>with us?</i></h2>
        <p>Your presence would mean the world to us. Kindly let us know if we can save you a seat.</p>
      </motion.div>
      <motion.div initial={{ opacity: 0, y: 40 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, delay: 0.2 }} viewport={{ once: true }} className="rsvp-card glassmorphism">
        {rsvpSent ? <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="success"><div className="success-icon"><Check /></div><p className="eyebrow">Thank you</p><h3>You're on the guest list.</h3><p>We can't wait to celebrate with you on November 28.</p><a className="text-link" href="#top">Back to the beginning <ArrowUpRight /></a></motion.div> : <form onSubmit={handleRsvpSubmit}>{errorMessage && <p style={{ color: '#d9534f', fontSize: '13px', marginBottom: '15px' }}>{errorMessage}</p>}<input type="hidden" name="from_name" value="Wedding Website RSVP" /><label htmlFor="name">Your name</label><input id="name" name="name" required placeholder="First and last name" /><label htmlFor="email">Email address</label><input id="email" name="email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required placeholder="you@example.com" /><label>Will you be joining us?</label><div className="choice-row"><label><input name="attendance" value="Joyfully accept" type="radio" required /> Joyfully accept</label><label><input name="attendance" value="Regretfully decline" type="radio" /> Regretfully decline</label></div><label htmlFor="note">A note for the couple <span>(optional)</span></label><textarea id="note" name="message" placeholder="Share a little love..." rows={3} /><button className="button button-dark" type="submit" disabled={isSubmitting}>{isSubmitting ? 'Sending...' : 'Send RSVP'} <Send /></button></form>}
      </motion.div>
    </section>

    <section className="faq section-pad" id="faq"><motion.div initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={fadeUp} className="section-heading centered"><p className="eyebrow">Good to know</p><h2>Questions,<br /><i>answered.</i></h2></motion.div><div className="faq-list">{['Where is the wedding?','What time should guests arrive?','Is RSVP required?','Is there a dress code?'].map((question, i) => <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, delay: i * 0.1 }} viewport={{ once: true }} className="faq-row" key={question}><button onClick={() => setFaq(faq === i ? null : i)} aria-expanded={faq === i}><span>0{i + 1}</span>{question}<ChevronDown className={faq === i ? 'rotated' : ''} /></button>{faq === i && <motion.p initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}>{[venue, 'Guests are encouraged to arrive by 10:30 AM so we can begin the ceremony promptly.', 'Yes, please RSVP by November 1st to help us prepare for your arrival.', 'Yes! Our colors are purple and champagne gold. We can\'t wait to see you looking fabulous!'][i]}</motion.p>}</motion.div>)}</div></section>

    <footer><a className="wordmark" href="#top">I <span>&</span> O</a><p>With love, gratitude & joy.</p><div className="footer-line" /><small>© 2026 Ibitayo & Odunayo · Made with love</small></footer>
    {lightbox !== null && <div className="lightbox" role="dialog" aria-modal="true" aria-label="Gallery image" onClick={() => setLightbox(null)}><button aria-label="Close image" onClick={() => setLightbox(null)}><X /></button><img src={gallery[lightbox].src} alt={gallery[lightbox].alt} onClick={(e) => e.stopPropagation()} /></div>}
  </main>
}
