import { motion } from 'framer-motion'
import { Plane } from 'lucide-react'

export default function HistoryEmptyState({ onPlanTrip }) {
  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
      style={{
        textAlign: 'center', padding: '80px 40px',
        background: 'rgba(255,255,255,0.03)',
        backdropFilter: 'blur(20px)',
        border: '1px solid rgba(255,255,255,0.08)',
        borderRadius: 24,
      }}>
      <div style={{
        width: 80, height: 80, margin: '0 auto 24px',
        background: 'rgba(255,255,255,0.05)', borderRadius: '50%',
        display: 'flex', alignItems: 'center', justifyContent: 'center'
      }}>
        <Plane size={36} color="rgba(255,255,255,0.4)" />
      </div>
      <p style={{
        fontFamily: "'Poppins', sans-serif",
        fontSize: 22, fontWeight: 600, color: '#fff', marginBottom: 12,
      }}>No trips yet</p>
      <p style={{
        fontFamily: "'Inter', sans-serif",
        fontSize: 15, color: 'rgba(255,255,255,0.5)', marginBottom: 32,
      }}>Start by planning your first adventure.</p>
      <button onClick={onPlanTrip} style={{
        padding: '14px 32px',
        background: 'linear-gradient(90deg, #7b61ff, #4f8ef7)',
        border: 'none', borderRadius: 100,
        color: '#fff', fontFamily: "'Inter', sans-serif",
        fontSize: 16, fontWeight: 600, cursor: 'pointer',
        boxShadow: '0 8px 24px rgba(123,97,255,0.3)',
      }}>
        Plan a trip
      </button>
    </motion.div>
  )
}
