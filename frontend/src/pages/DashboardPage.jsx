import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import api from '../api/axios'
import toast from 'react-hot-toast'
import { LogOut, History, Zap } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

import d1 from '../assets/dashboard/d1.jpg'
import d2 from '../assets/dashboard/d2.jpg'
import d3 from '../assets/dashboard/d3.jpg'
import d4 from '../assets/dashboard/d4.jpg'
import d5 from '../assets/dashboard/d5.jpg'

const IMAGES = [d1, d2, d3, d4, d5]

const TYPEWRITER_DESTINATIONS = [
  'Goa with friends...',
  'Manali in winter...',
  'Rajasthan on a budget...',
  'Kerala backwaters...',
  'Ladakh on a bike...',
]

// ── Tooltip Component ─────────────────────────────────────────
function LimitTooltip({ children, remaining }) {
  const [show, setShow] = useState(false)

  return (
    <div
      style={{ position: 'relative', display: 'inline-flex', alignItems: 'stretch' }}
      onMouseEnter={() => setShow(true)}
      onMouseLeave={() => setShow(false)}
      onClick={() => setShow(prev => !prev)}   // ✅ toggle on click
    >
      {children}

      <AnimatePresence>
        {show && (
          <motion.div
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.15 }}
            style={{
              position: 'absolute',
              top: 'calc(100% + 12px)',          // ✅ BELOW the button
              left: '50%',
              transform: 'translateX(-50%)',
              whiteSpace: 'nowrap',
              background: 'rgba(8,8,20,0.97)',
              border: '1px solid rgba(255,255,255,0.13)',
              borderRadius: 12,
              padding: '12px 18px',
              boxShadow: '0 12px 32px rgba(0,0,0,0.6)',
              zIndex: 999,
              pointerEvents: 'none',
            }}
          >
            {/* Arrow pointing UP */}
            <div style={{
              position: 'absolute',
              top: -5,                           // ✅ arrow at top
              left: '50%',
              width: 10, height: 10,
              background: 'rgba(8,8,20,0.97)',
              border: '1px solid rgba(255,255,255,0.13)',
              borderBottom: 'none', borderRight: 'none',  // ✅ top-left borders only
              transform: 'translateX(-50%) rotate(45deg)',
            }} />

            <div style={{
              fontFamily: "'Inter', sans-serif", fontSize: 13,
              fontWeight: 700, color: '#fff', marginBottom: 6,
            }}>
              ⚡ Daily Generation Limit
            </div>
            <div style={{
              fontFamily: "'Inter', sans-serif", fontSize: 12,
              color: 'rgba(255,255,255,0.5)', lineHeight: 1.6,
            }}>
              You can generate{' '}
              <span style={{ color: '#7eb3ff', fontWeight: 600 }}>5 itineraries</span> per day.<br />
              <span style={{ color: remaining === 0 ? '#f87171' : 'rgba(255,255,255,0.5)' }}>
                {remaining === 0
                  ? '🚫 No generations left today.'
                  : `✅ ${remaining} generation${remaining === 1 ? '' : 's'} remaining.`}
              </span><br />
              Limit resets at{' '}
              <span style={{ color: '#2dd4bf', fontWeight: 600 }}>12:00 AM</span> midnight.
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}


export default function DashboardPage() {
  const [current, setCurrent] = useState(0)
  const [typeText, setTypeText] = useState('')
  const [typeIndex, setTypeIndex] = useState(0)
  const [charIndex, setCharIndex] = useState(0)
  const [deleting, setDeleting] = useState(false)
  const [rateLimit, setRateLimit] = useState({ remaining: 5, limit: 5 })
  const [searchVal, setSearchVal] = useState('')
  const { user, logout } = useAuth()
  const navigate = useNavigate()

  // Preload images
  useEffect(() => {
    IMAGES.forEach(src => { const img = new Image(); img.src = src })
  }, [])

  // Crossfade every 5 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent(prev => (prev + 1) % IMAGES.length)
    }, 5000)
    return () => clearInterval(timer)
  }, [])

  // Typewriter effect
  useEffect(() => {
    const current_word = TYPEWRITER_DESTINATIONS[typeIndex]
    let timer
    if (!deleting && charIndex <= current_word.length) {
      timer = setTimeout(() => {
        setTypeText(current_word.slice(0, charIndex))
        setCharIndex(c => c + 1)
      }, 70)
    } else if (!deleting && charIndex > current_word.length) {
      timer = setTimeout(() => setDeleting(true), 1800)
    } else if (deleting && charIndex >= 0) {
      timer = setTimeout(() => {
        setTypeText(current_word.slice(0, charIndex))
        setCharIndex(c => c - 1)
      }, 35)
    } else if (deleting && charIndex < 0) {
      setDeleting(false)
      setTypeIndex(i => (i + 1) % TYPEWRITER_DESTINATIONS.length)
      setCharIndex(0)
    }
    return () => clearTimeout(timer)
  }, [charIndex, deleting, typeIndex])

  // Rate limit fetch
  const fetchRateLimit = () => {
    api.get('/rate-limit/')
      .then(res => setRateLimit(res.data))
      .catch(() => { })
  }

  useEffect(() => { fetchRateLimit() }, [])

  useEffect(() => {
    const handleFocus = () => fetchRateLimit()
    window.addEventListener('focus', handleFocus)
    return () => window.removeEventListener('focus', handleFocus)
  }, [])

  const handleLogout = () => {
    logout()
    toast.success('Logged out!')
    navigate('/auth')
  }

  const handleSearch = () => {
    if (!searchVal.trim()) {
      toast.error('Please enter a destination first!')
      return
    }
    if (rateLimit.remaining === 0) {
      toast.error('Daily limit reached. Try again tomorrow.')
      return
    }
    navigate('/plan', { state: { destination: searchVal.trim() } })
  }

  return (
    <div style={{ position: 'relative', width: '100vw', height: '100vh', overflow: 'hidden' }}>

      {/* Crossfading Background */}
      {IMAGES.map((img, i) => (
        <div key={i} style={{
          position: 'absolute', inset: 0,
          backgroundImage: `url(${img})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          opacity: i === current ? 1 : 0,
          transition: 'opacity 1.4s cubic-bezier(0.4, 0, 0.2, 1)',
          zIndex: i === current ? 1 : 0,
        }} />
      ))}

      {/* Overlay */}
      <div style={{
        position: 'absolute', inset: 0, zIndex: 2,
        background: `
          linear-gradient(180deg, rgba(0,0,0,0.35) 0%, rgba(0,0,0,0.5) 100%),
          radial-gradient(ellipse at 50% 60%, rgba(79,142,247,0.12) 0%, transparent 65%)
        `,
      }} />

      {/* Top Right — Rate Limit Badge + Nav Buttons */}
      <div style={{
        position: 'absolute', top: 20, right: 20, zIndex: 10,
        display: 'flex', alignItems: 'center', gap: 10,
      }}>

        {/* Rate Limit Badge with Tooltip */}
        <LimitTooltip remaining={rateLimit.remaining}>
          <button style={{
            display: 'flex', alignItems: 'center', gap: 6,
            height: 36, padding: '0 14px', borderRadius: 100,
            // ✅ same dark glass as search card
            background: rateLimit.remaining === 0
              ? 'rgba(248,113,113,0.15)'
              : 'rgba(8,8,18,0.40)',
            backdropFilter: 'blur(40px) saturate(180%)',
            WebkitBackdropFilter: 'blur(40px) saturate(180%)',
            border: rateLimit.remaining === 0
              ? '1px solid rgba(248,113,113,0.3)'
              : '1px solid rgba(255,255,255,0.13)',
            cursor: 'pointer', boxSizing: 'border-box', margin: 0,
            fontFamily: "'Inter', sans-serif", fontSize: 13,
          }}>
            <Zap size={13} color={rateLimit.remaining === 0 ? '#f87171' : '#fbbf24'} fill={rateLimit.remaining === 0 ? '#f87171' : '#fbbf24'} />
            <span style={{
              fontWeight: 600,
              color: rateLimit.remaining === 0 ? '#f87171' : 'rgba(255,255,255,0.85)',
            }}>
              {rateLimit.remaining}/{rateLimit.limit} left
            </span>
          </button>
        </LimitTooltip>

        {/* History Button */}
        <button onClick={() => navigate('/history')} style={{
          display: 'flex', alignItems: 'center', gap: 6,
          height: 36, padding: '0 14px', borderRadius: 100,
          // ✅ identical glass style
          background: 'rgba(8,8,18,0.40)',
          backdropFilter: 'blur(40px) saturate(180%)',
          WebkitBackdropFilter: 'blur(40px) saturate(180%)',
          border: '1px solid rgba(255,255,255,0.13)',
          color: 'rgba(255,255,255,0.85)', fontFamily: "'Inter', sans-serif",
          fontSize: 13, cursor: 'pointer',
          boxSizing: 'border-box', margin: 0,
        }}>
          <History size={13} /> History
        </button>

        {/* Logout Button */}
        <button onClick={handleLogout} style={{
          display: 'flex', alignItems: 'center', gap: 6,
          height: 36, padding: '0 14px', borderRadius: 100,
          // ✅ identical glass style
          background: 'rgba(8,8,18,0.40)',
          backdropFilter: 'blur(40px) saturate(180%)',
          WebkitBackdropFilter: 'blur(40px) saturate(180%)',
          border: '1px solid rgba(255,255,255,0.13)',
          color: 'rgba(255,255,255,0.85)', fontFamily: "'Inter', sans-serif",
          fontSize: 13, cursor: 'pointer',
          boxSizing: 'border-box', margin: 0,
        }}>
          <LogOut size={13} /> Logout
        </button>
      </div>



      {/* Center Content */}
      <div style={{
        position: 'absolute', inset: 0, zIndex: 5,
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        padding: '24px', gap: 32,
      }}>
        {/* Hero Text */}
        <div style={{ textAlign: 'center', animation: 'fadeInUp 0.7s ease both' }}>
          <h1 style={{
            fontFamily: "'Poppins', sans-serif",
            fontSize: 'clamp(28px, 6vw, 52px)', fontWeight: 800, color: '#ffffff',
            textShadow: '0 2px 24px rgba(0,0,0,0.5)',
            lineHeight: 1.15, marginBottom: 12,
          }}>
            Where to next?
          </h1>
          <p style={{
            fontFamily: "'Inter', sans-serif",
            fontSize: 18, color: 'rgba(255,255,255,0.65)',
            textShadow: '0 1px 8px rgba(0,0,0,0.4)',
          }}>
            Your AI travel planner — personalized, instant, beautiful.
          </p>
        </div>

        {/* Search Card */}
        <div style={{ width: '100%', maxWidth: 580, animation: 'fadeInUp 0.7s ease 0.15s both' }}>
          <div style={{
            background: 'rgba(8,8,18,0.72)',
            backdropFilter: 'blur(40px) saturate(180%)',
            WebkitBackdropFilter: 'blur(40px) saturate(180%)',
            border: '1px solid rgba(255,255,255,0.13)',
            borderTop: '1px solid rgba(255,255,255,0.2)',
            borderRadius: 24, padding: 'clamp(18px, 4vw, 28px)',
            boxShadow: '0 24px 60px rgba(0,0,0,0.65)',
          }}>
            <label style={{
              fontFamily: "'Inter', sans-serif", fontSize: 12, fontWeight: 600,
              color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase',
              letterSpacing: '0.1em', marginBottom: 12, display: 'block',
            }}>
              🌍 Plan a trip to
            </label>

            {/* Search Input Row */}
            <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
              <div style={{ flex: 1, position: 'relative' }}>
                <input
                  value={searchVal}
                  onChange={e => setSearchVal(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleSearch()}
                  placeholder={typeText + '|'}
                  style={{
                    width: '100%',
                    background: 'rgba(255,255,255,0.06)',
                    border: '1px solid rgba(255,255,255,0.12)',
                    borderRadius: 14, color: '#ffffff',
                    fontSize: 'clamp(15px, 3.5vw, 18px)', fontFamily: "'Inter', sans-serif",
                    fontWeight: 400, padding: '16px 20px',
                    outline: 'none', transition: 'all 0.3s ease',
                    boxSizing: 'border-box',
                  }}
                  onFocus={e => {
                    e.target.style.borderColor = 'rgba(79,142,247,0.6)'
                    e.target.style.background = 'rgba(79,142,247,0.06)'
                    e.target.style.boxShadow = '0 0 0 3px rgba(79,142,247,0.12)'
                  }}
                  onBlur={e => {
                    e.target.style.borderColor = 'rgba(255,255,255,0.12)'
                    e.target.style.background = 'rgba(255,255,255,0.06)'
                    e.target.style.boxShadow = 'none'
                  }}
                />
              </div>

              <button onClick={handleSearch} style={{
                width: 54, height: 54, borderRadius: 14,
                background: 'linear-gradient(135deg, #4f8ef7, #a855f7)',
                border: 'none', cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 22, boxShadow: '0 4px 20px rgba(79,142,247,0.45)',
                transition: 'all 0.25s ease', flexShrink: 0,
              }}
                onMouseEnter={e => {
                  e.currentTarget.style.transform = 'scale(1.08)'
                  e.currentTarget.style.boxShadow = '0 6px 28px rgba(79,142,247,0.6)'
                }}
                onMouseLeave={e => {
                  e.currentTarget.style.transform = 'scale(1)'
                  e.currentTarget.style.boxShadow = '0 4px 20px rgba(79,142,247,0.45)'
                }}>
                →
              </button>
            </div>

            {/* Quick Suggestions */}
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginTop: 16 }}>
              {['🏖️ Goa', '🏔️ Manali', '🕌 Rajasthan', '🌴 Kerala', '❄️ Kashmir'].map(place => (
                <span key={place} onClick={() => {
                  const dest = place.split(' ')[1]
                  setSearchVal(dest)
                  navigate('/plan', { state: { destination: dest } })
                }} style={{
                  padding: '6px 14px', borderRadius: 100,
                  fontSize: 13, fontFamily: "'Inter', sans-serif", fontWeight: 500,
                  background: 'rgba(255,255,255,0.07)',
                  border: '1px solid rgba(255,255,255,0.1)',
                  color: 'rgba(255,255,255,0.65)',
                  cursor: 'pointer', transition: 'all 0.2s ease',
                }}
                  onMouseEnter={e => {
                    e.currentTarget.style.background = 'rgba(255,255,255,0.12)'
                    e.currentTarget.style.color = '#ffffff'
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.background = 'rgba(255,255,255,0.07)'
                    e.currentTarget.style.color = 'rgba(255,255,255,0.65)'
                  }}>
                  {place}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>



      <style>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(24px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  )
}
