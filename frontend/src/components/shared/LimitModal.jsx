import { motion, AnimatePresence } from 'framer-motion'

export default function LimitModal({ onClose }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
      style={{
        position: 'fixed', inset: 0, zIndex: 9999,
        background: 'rgba(0,0,0,0.65)',
        backdropFilter: 'blur(6px)',
        WebkitBackdropFilter: 'blur(6px)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        padding: '16px',
      }}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.88, y: 24 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.88, y: 24 }}
        transition={{ type: 'spring', stiffness: 300, damping: 24 }}
        onClick={e => e.stopPropagation()}
        style={{
          background: 'rgba(8,8,20,0.97)',
          border: '1px solid rgba(255,255,255,0.13)',
          borderRadius: 20,
          padding: 'clamp(24px, 5vw, 36px)',
          maxWidth: 380, width: '100%',
          boxShadow: '0 24px 60px rgba(0,0,0,0.7)',
          textAlign: 'center',
        }}
      >
        <div style={{ fontSize: 40, marginBottom: 12 }}>🚫</div>
        <h2 style={{
          fontFamily: "'Poppins', sans-serif",
          fontSize: 'clamp(17px, 4vw, 20px)',
          fontWeight: 700, color: '#fff',
          marginBottom: 8, marginTop: 0,
        }}>
          Daily Limit Reached
        </h2>
        <p style={{
          fontFamily: "'Inter', sans-serif",
          fontSize: 'clamp(13px, 3vw, 14px)',
          color: 'rgba(255,255,255,0.55)',
          lineHeight: 1.7, marginBottom: 24,
        }}>
          You've used all{' '}
          <span style={{ color: '#7eb3ff', fontWeight: 600 }}>5 itinerary generations</span>{' '}
          for today.<br />
          Your limit resets at{' '}
          <span style={{ color: '#2dd4bf', fontWeight: 600 }}>12:00 AM midnight</span>.
        </p>
        <button
          onClick={onClose}
          style={{
            padding: '10px 28px', borderRadius: 100,
            background: 'linear-gradient(135deg, #4f8ef7, #a855f7)',
            border: 'none', color: '#fff',
            fontFamily: "'Inter', sans-serif",
            fontSize: 14, fontWeight: 600, cursor: 'pointer',
          }}
        >
          Got it
        </button>
      </motion.div>
    </motion.div>
  )
}
