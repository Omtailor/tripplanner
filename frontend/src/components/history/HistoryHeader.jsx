import { motion } from 'framer-motion'
import { ArrowLeft } from 'lucide-react'

export default function HistoryHeader({ tripCount, onBack, onNewTrip }) {
  return (
    <>
      <div style={{
        position: 'sticky', top: 0, zIndex: 50,
        height: 64, width: '100%',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: 'rgba(5, 10, 25, 0.7)',
        backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)',
        borderBottom: '1px solid rgba(255,255,255,0.08)',
      }}>
        <div style={{
          width: '100%', maxWidth: 1100, padding: '0 16px',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          gap: 8,
        }}>
          <motion.button
            whileTap={{ scale: 0.96 }}
            onClick={onBack}
            style={{
              display: 'flex', alignItems: 'center', gap: 8,
              padding: 'clamp(6px, 1.5vw, 8px) clamp(10px, 2.5vw, 20px)',
              background: 'linear-gradient(90deg, #7b61ff, #4f8ef7, #7b61ff)',
              backgroundSize: '200% auto',
              border: 'none', borderRadius: 100,
              color: '#fff', fontFamily: "'Inter', sans-serif",
              fontSize: 'clamp(11px, 2.5vw, 14px)',
              fontWeight: 600, cursor: 'pointer',
              whiteSpace: 'nowrap',
              boxShadow: 'inset 0 1px 1px rgba(255,255,255,0.3), 0 4px 16px rgba(123,97,255,0.2)',
            }}
          >
            <ArrowLeft size={16} /> Dashboard
          </motion.button>

          <div style={{
            fontFamily: "'Poppins', sans-serif",
            fontSize: 'clamp(12px, 3vw, 16px)', fontWeight: 600, color: '#fff',
            letterSpacing: '0.5px', flexShrink: 0,
            whiteSpace: 'nowrap',
          }}>
            TripPlanner ✈️
          </div>

          <motion.button
            whileHover={{ backgroundPosition: '100% 0' }}
            whileTap={{ scale: 0.96 }}
            onClick={onNewTrip}
            style={{
              padding: 'clamp(6px, 1.5vw, 8px) clamp(10px, 2.5vw, 20px)',
              background: 'linear-gradient(90deg, #7b61ff, #4f8ef7, #7b61ff)',
              backgroundSize: '200% auto',
              border: 'none', borderRadius: 100,
              color: '#fff', fontFamily: "'Inter', sans-serif",
              fontSize: 'clamp(11px, 2.5vw, 14px)',
              fontWeight: 600, cursor: 'pointer',
              whiteSpace: 'nowrap',
              boxShadow: 'inset 0 1px 1px rgba(255,255,255,0.3), 0 4px 16px rgba(123,97,255,0.2)',
            }}
          >
            + New Trip
          </motion.button>
        </div>
      </div>

      <div style={{
        maxWidth: 1100, margin: '0 auto',
        padding: '64px 24px 24px',
        position: 'relative', zIndex: 1,
      }}>
        <div style={{ position: 'relative', marginBottom: 56 }}>
          <div style={{
            position: 'absolute', top: -50, left: '50%', transform: 'translateX(-50%)',
            width: 300, height: 150,
            background: 'radial-gradient(circle at top center, rgba(123,97,255,0.25), transparent 65%)',
            pointerEvents: 'none'
          }} />

          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} style={{ position: 'relative', zIndex: 1 }}>
            <h1 style={{
              fontFamily: "'Poppins', sans-serif",
              fontSize: 'clamp(28px, 4vw, 36px)', fontWeight: 800, color: '#fff',
              display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8
            }}>
              <span style={{ fontSize: '1.1em' }}>🗂️</span> Your Travel History
            </h1>
            <p style={{
              fontFamily: "'Inter', sans-serif",
              fontSize: 16, color: 'rgba(255,255,255,0.65)', marginLeft: 4
            }}>
              {tripCount} trip{tripCount !== 1 ? 's' : ''} planned so far
            </p>
          </motion.div>
        </div>
      </div>
    </>
  )
}
