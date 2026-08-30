import { motion } from 'framer-motion'
import { ArrowLeft, ArrowRight, Plane } from 'lucide-react'
import { ClipLoader } from 'react-spinners'

export default function PlannerFooter({ step, generating, canNext, paginate, generate }) {
  return (
    <div style={{
      flexShrink: 0,
      display: 'flex',
      justifyContent: step === 1 ? 'flex-end' : 'space-between',
      alignItems: 'center',
      gap: 12,
      padding: 'clamp(14px, 2.5vw, 20px) clamp(24px, 5vw, 36px)',
      borderTop: '1px solid rgba(255,255,255,0.07)',
      background: 'rgba(8,12,26,0.5)',
      borderRadius: '0 0 24px 24px',
    }}>
      {step > 1 && (
        <motion.button
          whileHover={{ backgroundColor: 'rgba(255,255,255,0.1)' }}
          whileTap={{ scale: 0.97 }}
          onClick={() => paginate(step - 1)}
          style={{
            display: 'flex', alignItems: 'center', gap: 6,
            padding: '12px 20px', borderRadius: 999,
            background: 'transparent', border: '1px solid rgba(255,255,255,0.2)',
            color: 'rgba(255,255,255,0.9)', fontFamily: "'Inter', sans-serif",
            fontSize: 15, fontWeight: 500, cursor: 'pointer', transition: 'all 0.2s',
          }}
        >
          <ArrowLeft size={16} /> Back
        </motion.button>
      )}

      {step < 7 && (
        <motion.button
          whileHover={canNext() ? { y: -1, boxShadow: '0 8px 20px rgba(123,97,255,0.3)' } : {}}
          whileTap={canNext() ? { scale: 0.98 } : {}}
          onClick={() => canNext() && paginate(step + 1)}
          style={{
            display: 'flex', alignItems: 'center', gap: 6,
            padding: '12px 24px', borderRadius: 999,
            background: canNext() ? 'linear-gradient(90deg, #7b61ff, #4f8ef7)' : 'rgba(255,255,255,0.08)',
            border: 'none',
            color: canNext() ? '#fff' : 'rgba(255,255,255,0.3)',
            fontFamily: "'Inter', sans-serif", fontSize: 15, fontWeight: 600,
            cursor: canNext() ? 'pointer' : 'not-allowed', transition: 'all 0.2s',
            boxShadow: canNext() ? 'inset 0 1px 1px rgba(255,255,255,0.2)' : 'none',
          }}
        >
          Next <ArrowRight size={16} />
        </motion.button>
      )}

      {step === 7 && (
        <motion.button
          whileHover={!generating ? { y: -1, boxShadow: '0 8px 24px rgba(123,97,255,0.4)' } : {}}
          onClick={generate}
          disabled={generating}
          style={{
            display: 'flex', alignItems: 'center', gap: 8,
            padding: '12px 28px', borderRadius: 999,
            background: generating ? 'rgba(123,97,255,0.4)' : 'linear-gradient(90deg, #7b61ff, #4f8ef7)',
            border: 'none', color: '#fff',
            fontFamily: "'Inter', sans-serif", fontSize: 16, fontWeight: 600,
            cursor: generating ? 'wait' : 'pointer', transition: 'all 0.2s',
            boxShadow: 'inset 0 1px 1px rgba(255,255,255,0.3)',
          }}
        >
          {generating ? <ClipLoader size={16} color="#fff" /> : <><Plane size={16} /> Generate Itinerary</>}
        </motion.button>
      )}
    </div>
  )
}
