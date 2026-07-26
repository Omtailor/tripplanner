import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

export default function LimitTooltip({ children, remaining }) {
  const [show, setShow] = useState(false)

  return (
    <div
      style={{ position: 'relative', display: 'inline-flex', alignItems: 'stretch' }}
      onMouseEnter={() => setShow(true)}
      onMouseLeave={() => setShow(false)}
      onClick={() => setShow(prev => !prev)}
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
              top: 'calc(100% + 12px)',
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
            <div style={{
              position: 'absolute',
              top: -5,
              left: '50%',
              width: 10, height: 10,
              background: 'rgba(8,8,20,0.97)',
              border: '1px solid rgba(255,255,255,0.13)',
              borderBottom: 'none', borderRight: 'none',
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
