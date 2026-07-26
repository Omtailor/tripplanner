import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import api from '../api/axios'
import toast from 'react-hot-toast'
import { AnimatePresence } from 'framer-motion'

import d1 from '../assets/dashboard/d1.jpg'
import d2 from '../assets/dashboard/d2.jpg'
import d3 from '../assets/dashboard/d3.jpg'
import d4 from '../assets/dashboard/d4.jpg'
import d5 from '../assets/dashboard/d5.jpg'

import CrossfadeBackground from '../components/shared/CrossfadeBackground'
import TopBar from '../components/dashboard/TopBar'
import SearchCard from '../components/dashboard/SearchCard'
import LimitModal from '../components/shared/LimitModal'

const IMAGES = [d1, d2, d3, d4, d5]

export default function DashboardPage() {
  const [current, setCurrent] = useState(0)
  const [rateLimit, setRateLimit] = useState({ remaining: 5, limit: 5 })
  const [showLimitModal, setShowLimitModal] = useState(false)
  const { logout } = useAuth()
  const navigate = useNavigate()

  const isLimitExhausted = rateLimit.remaining === 0

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent(prev => (prev + 1) % IMAGES.length)
    }, 5000)
    return () => clearInterval(timer)
  }, [])

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

  const handleSearch = (destination) => {
    if (!destination.trim()) {
      toast.error('Please enter a destination first!')
      return
    }
    if (isLimitExhausted) {
      setShowLimitModal(true)
      return
    }
    navigate('/plan', { state: { destination: destination.trim() } })
  }

  return (
    <div style={{ position: 'relative', width: '100vw', height: '100vh', overflow: 'hidden' }}>
      <CrossfadeBackground images={IMAGES} currentIndex={current} />

      <TopBar
        rateLimit={rateLimit}
        onHistory={() => navigate('/history')}
        onLogout={handleLogout}
      />

      <div style={{
        position: 'absolute', inset: 0, zIndex: 5,
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        padding: '24px', gap: 32,
      }}>
        <div style={{ textAlign: 'center', animation: 'fadeInUp 0.7s ease both' }}>
          <h1 style={{
            fontFamily: "'Poppins', sans-serif",
            fontSize: 'clamp(28px, 6vw, 52px)', fontWeight: 800, color: '#ffffff',
            textShadow: '0 2px 24px rgba(0,0,0,0.5)',
            lineHeight: 1.15, marginBottom: 12, marginTop: 0,
          }}>
            Where to next?
          </h1>
          <p style={{
            fontFamily: "'Inter', sans-serif",
            fontSize: 'clamp(14px, 2.5vw, 18px)',
            color: 'rgba(255,255,255,0.65)',
            textShadow: '0 1px 8px rgba(0,0,0,0.4)',
            margin: 0,
          }}>
            Your AI travel planner — personalized, instant, beautiful.
          </p>
        </div>

        <SearchCard onSearch={handleSearch} isLimitExhausted={isLimitExhausted} />
      </div>

      <AnimatePresence>
        {showLimitModal && (
          <LimitModal onClose={() => setShowLimitModal(false)} />
        )}
      </AnimatePresence>

      <style>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(24px); }
          to { opacity: 1; transform: translateY(0); }
        }
        input::placeholder {
          color: rgba(255, 255, 255, 0.3);
        }
      `}</style>
    </div>
  )
}
