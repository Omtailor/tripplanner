import { motion } from 'framer-motion'
import { Calendar, ChevronRight, Plane, Trash2 } from 'lucide-react'
import { ClipLoader } from 'react-spinners'
import { toTitleCase } from '../../utils/planner'

export default function HistoryTripCard({ item, deleting, onOpen, onDelete, onConfirm }) {
  const trip = item.trip
  const isDeleting = deleting === item.id

  return (
    <motion.div
      key={item.id}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.2 } }}
      transition={{ delay: 0, duration: 0.4 }}
      onClick={() => !isDeleting && onOpen(item.id)}
      whileHover={!isDeleting ? {
        y: -3,
        boxShadow: '0 16px 40px rgba(0,0,0,0.55)',
      } : {}}
      whileTap={!isDeleting ? { scale: 0.98 } : {}}
      style={{
        position: 'relative',
        background: 'rgba(255, 255, 255, 0.06)',
        backdropFilter: 'blur(20px) saturate(160%)',
        WebkitBackdropFilter: 'blur(20px) saturate(160%)',
        border: '1px solid rgba(255, 255, 255, 0.10)',
        borderTop: '1px solid rgba(255,255,255,0.15)',
        borderRadius: 16,
        padding: '24px',
        boxShadow: '0 12px 30px rgba(0,0,0,0.3)',
        cursor: isDeleting ? 'default' : 'pointer',
        opacity: isDeleting ? 0.5 : 1,
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        flexWrap: 'wrap', gap: 20,
        overflow: 'visible',
      }}
    >
      <div style={{ flex: '1 1 250px', minWidth: 0, display: 'flex', flexDirection: 'column', gap: 14 }}>
        <div>
          <h2 style={{
            fontFamily: "'Poppins', sans-serif",
            fontSize: 'clamp(16px, 4vw, 22px)', fontWeight: 700, color: '#fff',
            margin: 0, display: 'flex', alignItems: 'center', gap: 10,
            flexWrap: 'wrap',
            wordBreak: 'break-word',
          }}>
            {toTitleCase(trip?.origin)}
            <Plane size={18} color="#7b61ff" style={{ opacity: 0.8 }} />
            {toTitleCase(trip?.destination)}
          </h2>
          <div style={{
            fontFamily: "'Inter', sans-serif",
            fontSize: 13, color: 'rgba(255,255,255,0.5)',
            display: 'flex', alignItems: 'center', gap: 6, marginTop: 6
          }}>
            <Calendar size={13} />
            Created {new Date(item.created_at).toLocaleDateString('en-IN', {
              day: 'numeric', month: 'short', year: 'numeric'
            })}
          </div>
        </div>

        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', minWidth: 0 }}>
          {[
            { icon: '🗓', label: `${trip?.start_date} — ${trip?.end_date}` },
            { icon: '📍', label: toTitleCase(trip?.destination) },
            { icon: '👥', label: trip?.group_type },
            { icon: '💰', label: trip?.budget_tier },
          ].map(tag => (
            <div key={tag.label} style={{
              display: 'flex', alignItems: 'center', gap: 6,
              padding: '6px 14px', borderRadius: 999,
              background: 'rgba(255,255,255,0.08)',
              border: '1px solid rgba(255,255,255,0.15)',
              fontFamily: "'Inter', sans-serif",
              fontSize: 12, fontWeight: 600, color: 'rgba(255,255,255,0.8)',
              textTransform: 'capitalize',
            }}>
              <span>{tag.icon}</span> {tag.label}
            </div>
          ))}
        </div>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 16, flexShrink: 0 }}>
        <button
          onClick={e => {
            e.stopPropagation()
            onConfirm(item.id)
          }}
          disabled={isDeleting}
          title="Delete trip"
          style={{
            width: 42, height: 42,
            minWidth: 42, minHeight: 42,
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: '#ef4444',
            border: 'none',
            padding: 0,
            outline: 'none',
            flexShrink: 0,
            overflow: 'visible',
            cursor: isDeleting ? 'not-allowed' : 'pointer',
            boxShadow: '0 4px 14px rgba(239,68,68,0.45)',
            transition: 'transform 0.15s ease, box-shadow 0.15s ease',
          }}
          onMouseEnter={e => {
            e.currentTarget.style.transform = 'scale(1.1)'
            e.currentTarget.style.boxShadow = '0 6px 20px rgba(239,68,68,0.65)'
          }}
          onMouseLeave={e => {
            e.currentTarget.style.transform = 'scale(1)'
            e.currentTarget.style.boxShadow = '0 4px 14px rgba(239,68,68,0.45)'
          }}
        >
          {isDeleting
            ? <ClipLoader size={16} color="#fff" />
            : <Trash2 size={18} color="#fff" strokeWidth={2.5} />
          }
        </button>

        <div style={{
          width: 44, height: 44, borderRadius: '50%',
          background: 'rgba(255,255,255,0.08)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          transition: 'all 0.2s',
          flexShrink: 0,
        }}>
          <ChevronRight size={22} color="#fff" />
        </div>
      </div>
    </motion.div>
  )
}
