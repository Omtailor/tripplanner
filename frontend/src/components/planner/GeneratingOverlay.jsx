import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { Plane } from 'lucide-react'
import { LOADING_SENTENCES } from '../../constants/planner'

export default function GeneratingOverlay({ destination }) {
  const [sentenceIndex, setSentenceIndex] = useState(0)
  const [visible, setVisible] = useState(true)

  useEffect(() => {
    const interval = setInterval(() => {
      setVisible(false)
      setTimeout(() => {
        setSentenceIndex(i => (i + 1) % LOADING_SENTENCES.length)
        setVisible(true)
      }, 400)
    }, 2800)
    return () => clearInterval(interval)
  }, [])

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
      style={{
        position: 'fixed', inset: 0, zIndex: 200,
        background: 'rgba(8,12,26,0.95)',
        backdropFilter: 'blur(10px)',
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        padding: '24px', textAlign: 'center',
      }}
    >
      <div style={{ position: 'relative', marginBottom: 40 }}>
        <motion.div
          animate={{ rotate: [0, 10, -10, 0] }}
          transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
          style={{ fontSize: 64, lineHeight: 1 }}
        >
          <Plane color="#7b61ff" fill="#7b61ff" size={64} />
        </motion.div>
        {[1, 2, 3].map(i => (
          <motion.div
            key={i}
            animate={{ scale: [1, 2.2], opacity: [0.4, 0] }}
            transition={{ duration: 2, repeat: Infinity, delay: i * 0.5, ease: 'easeOut' }}
            style={{
              position: 'absolute', inset: 0, borderRadius: '50%',
              border: '2px solid rgba(123,97,255,0.4)',
            }}
          />
        ))}
      </div>

      <div style={{
        height: 80, width: '100%', maxWidth: 600,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        marginBottom: 48,
      }}>
        <motion.p
          key={sentenceIndex}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: visible ? 1 : 0, y: visible ? 0 : -12 }}
          transition={{ duration: 0.3 }}
          style={{
            fontFamily: "'Poppins', sans-serif", fontSize: 'clamp(17px, 4.5vw, 24px)',
            fontWeight: 600, color: '#fff', margin: 0, lineHeight: 1.4,
          }}
        >
          {LOADING_SENTENCES[sentenceIndex]}
        </motion.p>
      </div>
    </motion.div>
  )
}
