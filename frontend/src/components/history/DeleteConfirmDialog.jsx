import { motion } from 'framer-motion'
import { AlertTriangle } from 'lucide-react'

export default function DeleteConfirmDialog({ destination, onConfirm, onCancel }) {
  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 100,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(10px)',
    }}>
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ duration: 0.2 }}
        style={{
          background: 'rgba(12,16,34,0.95)',
          border: '1px solid rgba(239,68,68,0.25)',
          borderRadius: 24, padding: '32px 28px',
          maxWidth: 380, width: '90%',
          boxShadow: '0 24px 60px rgba(0,0,0,0.6)',
          textAlign: 'center',
        }}
      >
        <div style={{
          width: 56, height: 56, borderRadius: '50%',
          background: 'rgba(239,68,68,0.1)',
          border: '1px solid rgba(239,68,68,0.2)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          margin: '0 auto 24px',
        }}>
          <AlertTriangle size={24} color="#ef4444" />
        </div>

        <h3 style={{
          fontFamily: "'Poppins', sans-serif",
          fontSize: 20, fontWeight: 700, color: '#fff', marginBottom: 12,
        }}>
          Delete this trip?
        </h3>

        <p style={{
          fontFamily: "'Inter', sans-serif",
          fontSize: 15, color: 'rgba(255,255,255,0.6)',
          lineHeight: 1.6, marginBottom: 32,
        }}>
          Your <span style={{ color: '#fff', fontWeight: 600 }}>{destination}</span> itinerary
          will be permanently deleted. This action cannot be undone.
        </p>

        <div style={{ display: 'flex', gap: 12 }}>
          <button onClick={onCancel} style={{
            flex: 1, padding: '14px',
            background: 'rgba(255,255,255,0.06)',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: 14, color: 'rgba(255,255,255,0.8)',
            fontFamily: "'Inter', sans-serif",
            fontSize: 15, fontWeight: 500, cursor: 'pointer',
            transition: 'all 0.2s'
          }}
            onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'}
            onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.06)'}
          >
            Cancel
          </button>
          <button onClick={onConfirm} style={{
            flex: 1, padding: '14px',
            background: 'rgba(239,68,68,0.15)',
            border: '1px solid rgba(239,68,68,0.3)',
            borderRadius: 14, color: '#ef4444',
            fontFamily: "'Inter', sans-serif",
            fontSize: 15, fontWeight: 600, cursor: 'pointer',
            transition: 'all 0.2s'
          }}
            onMouseEnter={e => e.currentTarget.style.background = 'rgba(239,68,68,0.25)'}
            onMouseLeave={e => e.currentTarget.style.background = 'rgba(239,68,68,0.15)'}
          >
            Delete
          </button>
        </div>
      </motion.div>
    </div>
  )
}
