import { useEffect, useRef } from 'react'
import { motion } from 'framer-motion'
import { Calendar, DollarSign, Sparkles, MapPin, Utensils, Users, Check } from 'lucide-react'

const STEPS = [
  { id: 1, label: 'Dates', icon: Calendar },
  { id: 2, label: 'Budget', icon: DollarSign },
  { id: 3, label: 'Vibe', icon: Sparkles },
  { id: 4, label: 'Origin', icon: MapPin },
  { id: 5, label: 'Meals', icon: Utensils },
  { id: 6, label: 'Group', icon: Users },
  { id: 7, label: 'Summary', icon: Check },
]

export default function StepProgress({ step, paginate }) {
  const progressRef = useRef(null)

  useEffect(() => {
    if (progressRef.current) {
      const activeEl = progressRef.current.querySelector('[data-active="true"]')
      if (activeEl) {
        activeEl.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' })
      }
    }
  }, [step])

  return (
    <div ref={progressRef} style={{
      display: 'flex', alignItems: 'center', gap: 6,
      marginBottom: 32, zIndex: 1,
      overflowX: 'auto', padding: '12px 16px',
      maxWidth: '100%', scrollbarWidth: 'none', msOverflowStyle: 'none',
    }}>
      {STEPS.map((s, i) => {
        const Icon = s.icon
        const done = step > s.id
        const active = step === s.id

        return (
          <div key={s.id} style={{ display: 'flex', alignItems: 'center' }}>
            <motion.div
              data-active={active ? "true" : "false"}
              onClick={() => done && paginate(s.id)}
              whileHover={done ? { scale: 1.05 } : {}}
              style={{
                display: 'flex', alignItems: 'center', gap: 6,
                padding: active ? '13px 26px' : done ? '11px 20px' : '11px 22px',
                borderRadius: 999,
                background: active
                  ? 'linear-gradient(90deg, #7b61ff, #4f8ef7)'
                  : done ? 'rgba(255,255,255,0.1)' : 'transparent',
                border: active ? 'none' : done ? '1px solid rgba(255,255,255,0.05)' : '1px solid rgba(255,255,255,0.15)',
                boxShadow: active ? '0 4px 16px rgba(123,97,255,0.3)' : 'none',
                cursor: done ? 'pointer' : 'default',
                transition: 'all 0.3s ease',
                flexShrink: 0
              }}
            >
              {done ? <Check size={18} color="#fff" /> : <Icon size={18} color={active ? '#fff' : 'rgba(255,255,255,0.4)'} />}
              <span style={{
                fontFamily: "'Inter', sans-serif", fontSize: active ? 17 : 15,
                fontWeight: active ? 600 : 500,
                color: active ? '#fff' : done ? 'rgba(255,255,255,0.7)' : 'rgba(255,255,255,0.4)',
                whiteSpace: 'nowrap',
              }}>{s.label}</span>
            </motion.div>

            {i < STEPS.length - 1 && (
              <div style={{
                width: 'clamp(16px, 4vw, 32px)', height: 2, margin: '0 4px',
                background: done ? 'linear-gradient(90deg, #4f8ef7, #7b61ff)' : 'rgba(255,255,255,0.1)',
                borderRadius: 1, transition: 'background 0.4s ease', flexShrink: 0,
              }} />
            )}
          </div>
        )
      })}
    </div>
  )
}
