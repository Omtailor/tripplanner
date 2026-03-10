import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import toast from 'react-hot-toast'
import { ClipLoader } from 'react-spinners'

import bg1 from '../assets/auth/bg1.jpg'
import bg2 from '../assets/auth/bg2.jpg'
import bg3 from '../assets/auth/bg3.jpg'
import bg4 from '../assets/auth/bg4.jpg'
import bg5 from '../assets/auth/bg5.jpg'

const IMAGES = [bg1, bg2, bg3, bg4, bg5]

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true)
  const [form, setForm] = useState({ name: '', email: '', password: '' })
  const [loading, setLoading] = useState(false)
  const [current, setCurrent] = useState(0)
  const { login, register } = useAuth()
  const navigate = useNavigate()

  useEffect(() => {
    IMAGES.forEach(src => { const img = new Image(); img.src = src })
  }, [])

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrent(prev => (prev + 1) % IMAGES.length)
    }, 4000)
    return () => clearInterval(timer)
  }, [])

  const handle = (e) => setForm({ ...form, [e.target.name]: e.target.value })

  const submit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      if (isLogin) {
        await login(form.email, form.password)
        toast.success('Welcome back! ✈️')
        navigate('/')
      } else {
        await register(form.email, form.password, form.name)
        toast.success('Account created! Please sign in.')
        setIsLogin(true)
        setForm({ name: '', email: '', password: '' })
      }
    } catch (err) {
      toast.error(
        err.response?.data?.detail ||
        err.response?.data?.email?.[0] ||
        err.response?.data?.password?.[0] ||
        'Something went wrong'
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    // ✅ FIX 1: margin: 0 and left: 0 ensure no offset from parent layout
    <div style={{
      position: 'fixed',   // ✅ FIX 2: fixed instead of absolute — always covers full viewport
      top: 0, left: 0,
      width: '100vw', height: '100vh',
      overflow: 'hidden',
      margin: 0, padding: 0,
    }}>

      {/* ── Crossfading Background Images ── */}
      {IMAGES.map((img, i) => (
        <div key={i} style={{
          position: 'absolute', inset: 0,
          backgroundImage: `url(${img})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',   // ✅ FIX 3: prevent tiling on wide screens
          opacity: i === current ? 1 : 0,
          transition: 'opacity 1.4s cubic-bezier(0.4, 0, 0.2, 1)',
          zIndex: i === current ? 1 : 0,
        }} />
      ))}

      {/* ── Dark + Color Overlay ── */}
      <div style={{
        position: 'absolute', inset: 0, zIndex: 2,
        background: `
          linear-gradient(180deg, rgba(0,0,0,0.3) 0%, rgba(0,0,0,0.55) 100%),
          radial-gradient(ellipse at 30% 70%, rgba(79,142,247,0.18) 0%, transparent 55%),
          radial-gradient(ellipse at 75% 25%, rgba(168,85,247,0.14) 0%, transparent 55%)
        `,
      }} />

      {/* ── Centered Card ── */}
      <div style={{
        position: 'absolute', inset: 0, zIndex: 3,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: 24,
        boxSizing: 'border-box',   // ✅ FIX 4: padding doesn't push card off-center
      }}>
        <div style={{
          width: '100%', maxWidth: 400,   // ✅ FIX 5: 480 fits better on most screens
          background: 'rgba(8, 8, 18, 0.39)',              // ✅ 0.55→0.28 much more transparent
          backdropFilter: 'blur(60px) saturate(200%)',      // ✅ stronger blur for glass feel
          WebkitBackdropFilter: 'blur(60px) saturate(200%)',
          border: '1px solid rgba(255,255,255,0.18)',       // ✅ slightly brighter border
          borderTop: '1px solid rgba(255,255,255,0.35)',    // ✅ brighter top highlight
          borderRadius: 24,
          padding: 'clamp(20px, 4vw, 36px) clamp(16px, 4vw, 32px)',  // ✅ tighter padding
          boxSizing: 'border-box',   // ✅ FIX 6: prevents overflow on mobile
          boxShadow: '0 24px 60px rgba(0,0,0,0.65)',
          animation: 'fadeInUp 0.7s cubic-bezier(0.4,0,0.2,1) both',
        }}>

          {/* Logo */}
          <div style={{ textAlign: 'center', marginBottom: 24 }}>
            <div style={{ fontSize: 32, marginBottom: 8 }}>✈️</div>
            <div style={{
              fontFamily: "'Poppins', sans-serif",
              fontSize: 'clamp(22px, 5vw, 32px)', fontWeight: 700,
              background: 'linear-gradient(135deg, #4f8ef7, #a855f7)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              marginBottom: 8,
            }}>
              TripPlanner
            </div>
            <p style={{
              fontFamily: "'Inter', sans-serif",
              color: 'rgba(255,255,255,0.5)',
              fontSize: 16, fontWeight: 400,
              margin: 0,
            }}>
              {isLogin ? 'Sign in to plan your next adventure' : 'Create your account to get started'}
            </p>
          </div>

          {/* Form */}
          <form onSubmit={submit} style={{ display: 'flex', flexDirection: 'column', gap: 22 }}>

            {!isLogin && (
              <div style={{ animation: 'fadeInUp 0.3s ease both' }}>
                <label style={labelStyle}>Full Name</label>
                <input
                  className="glass-input"
                  name="name"
                  placeholder="John Doe"
                  value={form.name}
                  onChange={handle}
                  required={!isLogin}
                  style={inputStyle}
                />
              </div>
            )}

            <div>
              <label style={labelStyle}>Email Address</label>
              <input
                className="glass-input"
                name="email"
                type="email"
                placeholder="you@example.com"
                value={form.email}
                onChange={handle}
                required
                style={inputStyle}
              />
            </div>

            <div>
              <label style={labelStyle}>Password</label>
              <input
                className="glass-input"
                name="password"
                type="password"
                placeholder="••••••••"
                value={form.password}
                onChange={handle}
                required
                style={inputStyle}
              />
            </div>

            <button type="submit" disabled={loading} style={{
              marginTop: 4,
              width: '100%', padding: '17px',
              background: loading
                ? 'rgba(79,142,247,0.35)'
                : 'linear-gradient(135deg, #4f8ef7 0%, #a855f7 100%)',
              color: 'white', border: 'none',
              borderRadius: 14,
              fontFamily: "'Inter', sans-serif",
              fontSize: 16, fontWeight: 600,
              letterSpacing: '0.02em',
              cursor: loading ? 'not-allowed' : 'pointer',
              transition: 'all 0.3s ease',
              display: 'flex', alignItems: 'center',
              justifyContent: 'center', gap: 10,
              boxShadow: loading ? 'none' : '0 4px 24px rgba(79,142,247,0.45)',
            }}>
              {loading
                ? <><ClipLoader size={16} color="#fff" /><span>Please wait...</span></>
                : isLogin ? 'Sign In →' : 'Create Account →'
              }
            </button>
          </form>

          {/* Divider */}
          <div style={{
            height: 1, margin: '24px 0',
            background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent)'
          }} />

          {/* Toggle */}
          <p style={{
            textAlign: 'center',
            fontFamily: "'Inter', sans-serif",
            color: 'rgba(255,255,255,0.55)',
            fontSize: 15,
            margin: 0,
          }}>
            {isLogin ? "Don't have an account? " : 'Already have an account? '}
            <span
              onClick={() => { setIsLogin(!isLogin); setForm({ name: '', email: '', password: '' }) }}
              style={{ color: '#7eb3ff', cursor: 'pointer', fontWeight: 600, transition: 'color 0.2s' }}
            >
              {isLogin ? 'Sign up free' : 'Sign in'}
            </span>
          </p>

        </div>
      </div>



    </div>
  )
}

const labelStyle = {
  fontFamily: "'Inter', sans-serif",
  fontSize: 14, fontWeight: 700,
  color: 'rgba(255,255,255,0.7)',
  marginBottom: 10,
  display: 'block',
  textTransform: 'uppercase',
  letterSpacing: '0.08em',
}

const inputStyle = {
  fontFamily: "'Inter', sans-serif",
  background: 'rgba(255,255,255,0.07)',
  fontSize: 16,
  padding: '16px 20px',
  color: '#ffffff',
  border: '1px solid rgba(255,255,255,0.15)',
  borderRadius: 14,
  width: '100%',              // ✅ FIX 7: inputs stretch full card width
  boxSizing: 'border-box',   // ✅ FIX 8: padding included in width calculation
}
