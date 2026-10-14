import { ArrowLeft, Compass } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import useDocumentMeta from '../hooks/useDocumentMeta'

export default function NotFoundPage() {
  const navigate = useNavigate()
  const { user } = useAuth()

  useDocumentMeta({
    title: 'Page Not Found | TripPlanner',
    description: 'The page you are looking for does not exist or has moved.',
    noindex: true,
  })

  return (
    <main id="main-content" style={{
      minHeight: '100vh',
      display: 'grid',
      placeItems: 'center',
      padding: 24,
      background: 'linear-gradient(135deg, #050508 0%, #0d0d1a 50%, #050508 100%)',
      color: '#fff',
    }}>
      <section aria-labelledby="not-found-title" style={{
        width: '100%',
        maxWidth: 620,
        padding: 'clamp(32px, 7vw, 64px) clamp(24px, 6vw, 56px)',
        textAlign: 'center',
        background: 'rgba(12, 12, 22, 0.78)',
        backdropFilter: 'blur(30px)',
        WebkitBackdropFilter: 'blur(30px)',
        border: '1px solid rgba(255,255,255,0.13)',
        borderTop: '1px solid rgba(255,255,255,0.25)',
        borderRadius: 24,
        boxShadow: '0 24px 60px rgba(0,0,0,0.55)',
      }}>
        <Compass aria-hidden="true" size={42} color="#4f8ef7" style={{ marginBottom: 16 }} />
        <div aria-hidden="true" style={{
          fontFamily: "'Poppins', sans-serif",
          fontSize: 'clamp(76px, 18vw, 150px)',
          lineHeight: 0.9,
          fontWeight: 800,
          background: 'linear-gradient(135deg, #4f8ef7, #a855f7)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
          marginBottom: 22,
        }}>404</div>
        <h1 id="not-found-title" style={{
          fontFamily: "'Poppins', sans-serif",
          fontSize: 'clamp(24px, 5vw, 36px)',
          lineHeight: 1.2,
          margin: '0 0 14px',
        }}>Looks like this trip took a wrong turn</h1>
        <p style={{
          color: 'rgba(255,255,255,0.68)',
          fontFamily: "'Inter', sans-serif",
          fontSize: 16,
          lineHeight: 1.6,
          margin: '0 auto 30px',
          maxWidth: 430,
        }}>The page you&apos;re looking for doesn&apos;t exist or has been moved.</p>
        <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 12 }}>
          <button type="button" onClick={() => navigate(user ? '/' : '/auth')} style={primaryButtonStyle}>
            {user ? 'Back to Dashboard' : 'Go to Sign In'}
          </button>
          <button type="button" onClick={() => navigate(-1)} style={secondaryButtonStyle}>
            <ArrowLeft aria-hidden="true" size={17} /> Go Back
          </button>
        </div>
      </section>
    </main>
  )
}

const primaryButtonStyle = {
  minHeight: 44,
  padding: '12px 20px',
  border: '1px solid rgba(79,142,247,0.5)',
  borderRadius: 12,
  background: 'linear-gradient(135deg, #4f8ef7, #7b61ff)',
  color: '#fff',
  fontFamily: "'Inter', sans-serif",
  fontWeight: 700,
  cursor: 'pointer',
}

const secondaryButtonStyle = {
  ...primaryButtonStyle,
  display: 'inline-flex',
  alignItems: 'center',
  gap: 8,
  background: 'rgba(255,255,255,0.06)',
  borderColor: 'rgba(255,255,255,0.16)',
}
