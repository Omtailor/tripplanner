import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import toast from 'react-hot-toast'

import bg1 from '../assets/auth/bg1.jpg'
import bg2 from '../assets/auth/bg2.jpg'
import bg3 from '../assets/auth/bg3.jpg'
import bg4 from '../assets/auth/bg4.jpg'
import bg5 from '../assets/auth/bg5.jpg'

import AuthBackgroundSlider from '../components/auth/AuthBackgroundSlider'
import AuthHeader from '../components/auth/AuthHeader'
import AuthInputField from '../components/auth/AuthInputField'
import AuthSubmitButton from '../components/auth/AuthSubmitButton'
import AuthTogglePrompt from '../components/auth/AuthTogglePrompt'

const IMAGES = [bg1, bg2, bg3, bg4, bg5]

export default function AuthPage() {
  const [isLogin, setIsLogin] = useState(true)
  const [form, setForm] = useState({ name: '', email: '', password: '' })
  const [loading, setLoading] = useState(false)
  const [current, setCurrent] = useState(0)
  const [showPassword, setShowPassword] = useState(false)
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

  useEffect(() => {
    if (!showPassword) return
    const timer = setTimeout(() => setShowPassword(false), 3000)
    return () => clearTimeout(timer)
  }, [showPassword])

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
    <div style={{
      position: 'fixed',
      top: 0, left: 0,
      width: '100vw', height: '100vh',
      overflow: 'hidden',
      margin: 0, padding: 0,
    }}>
      <AuthBackgroundSlider images={IMAGES} current={current} />

      <div style={{
        position: 'absolute', inset: 0, zIndex: 2,
        background: `
          linear-gradient(180deg, rgba(0,0,0,0.3) 0%, rgba(0,0,0,0.55) 100%),
          radial-gradient(ellipse at 30% 70%, rgba(79,142,247,0.18) 0%, transparent 55%),
          radial-gradient(ellipse at 75% 25%, rgba(168,85,247,0.14) 0%, transparent 55%)
        `,
      }} />

      <div style={{
        position: 'absolute', inset: 0, zIndex: 3,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: 24,
        boxSizing: 'border-box',
      }}>
        <div style={{
          width: '100%', maxWidth: 400,
          background: 'rgba(8, 8, 18, 0.39)',
          backdropFilter: 'blur(60px) saturate(200%)',
          WebkitBackdropFilter: 'blur(60px) saturate(200%)',
          border: '1px solid rgba(255,255,255,0.18)',
          borderTop: '1px solid rgba(255,255,255,0.35)',
          borderRadius: 24,
          padding: 'clamp(20px, 4vw, 36px) clamp(16px, 4vw, 32px)',
          boxSizing: 'border-box',
          boxShadow: '0 24px 60px rgba(0,0,0,0.65)',
          animation: 'fadeInUp 0.7s cubic-bezier(0.4,0,0.2,1) both',
        }}>
          <AuthHeader isLogin={isLogin} />

          <form onSubmit={submit} style={{ display: 'flex', flexDirection: 'column', gap: 22 }}>
            {!isLogin && (
              <div style={{ animation: 'fadeInUp 0.3s ease both' }}>
                <AuthInputField
                  label="Full Name"
                  name="name"
                  placeholder="John Doe"
                  value={form.name}
                  onChange={handle}
                  required={!isLogin}
                  style={inputStyle}
                />
              </div>
            )}

            <AuthInputField
              label="Email Address"
              name="email"
              type="email"
              placeholder="you@example.com"
              value={form.email}
              onChange={handle}
              required
              style={inputStyle}
            />

            <AuthInputField
              label="Password"
              name="password"
              type={showPassword ? 'text' : 'password'}
              placeholder="••••••••"
              value={form.password}
              onChange={handle}
              required
              showPasswordToggle
              showPassword={showPassword}
              onTogglePassword={() => setShowPassword(prev => !prev)}
              style={inputStyle}
            />

            <AuthSubmitButton loading={loading} isLogin={isLogin} />
          </form>

          <div style={{
            height: 1, margin: '24px 0',
            background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.1), transparent)'
          }} />

          <AuthTogglePrompt
            isLogin={isLogin}
            onToggle={() => {
              setIsLogin(!isLogin)
              setForm({ name: '', email: '', password: '' })
            }}
          />
        </div>
      </div>
    </div>
  )
}

const inputStyle = {
  fontFamily: "'Inter', sans-serif",
  background: 'rgba(255,255,255,0.07)',
  fontSize: 16,
  padding: '16px 20px',
  color: '#ffffff',
  border: '1px solid rgba(255,255,255,0.15)',
  borderRadius: 14,
  width: '100%',
  boxSizing: 'border-box',
}
