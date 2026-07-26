import { useState } from 'react'
import toast from 'react-hot-toast'
import useTypewriter from '../../hooks/useTypewriter'

export default function SearchCard({ onSearch, isLimitExhausted }) {
  const [searchVal, setSearchVal] = useState('')
  const typeText = useTypewriter()

  const handleSearch = () => {
    onSearch(searchVal)
  }

  return (
    <div style={{ width: '100%', maxWidth: 580, animation: 'fadeInUp 0.7s ease 0.15s both' }}>
      <div style={{
        background: 'rgba(8,8,18,0.72)',
        backdropFilter: 'blur(40px) saturate(180%)',
        WebkitBackdropFilter: 'blur(40px) saturate(180%)',
        border: '1px solid rgba(255,255,255,0.13)',
        borderTop: '1px solid rgba(255,255,255,0.2)',
        borderRadius: 24, padding: 'clamp(18px, 4vw, 28px)',
        boxShadow: '0 24px 60px rgba(0,0,0,0.65)',
      }}>
        <label style={{
          fontFamily: "'Inter', sans-serif", fontSize: 12, fontWeight: 600,
          color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase',
          letterSpacing: '0.1em', marginBottom: 12, display: 'block',
        }}>
          🌍 Plan a trip to
        </label>

        <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
          <div style={{ flex: 1, position: 'relative', minWidth: 0 }}>
            <input
              value={searchVal}
              onChange={e => setSearchVal(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleSearch()}
              placeholder={typeText + '|'}
              style={{
                width: '100%',
                background: 'rgba(255,255,255,0.06)',
                border: '1px solid rgba(255,255,255,0.12)',
                borderRadius: 14, color: '#ffffff',
                fontSize: 'clamp(15px, 3.5vw, 18px)', fontFamily: "'Inter', sans-serif",
                fontWeight: 400, padding: '16px 20px',
                outline: 'none', transition: 'all 0.3s ease',
                boxSizing: 'border-box',
              }}
              onFocus={e => {
                e.target.style.borderColor = 'rgba(79,142,247,0.6)'
                e.target.style.background = 'rgba(79,142,247,0.06)'
                e.target.style.boxShadow = '0 0 0 3px rgba(79,142,247,0.12)'
              }}
              onBlur={e => {
                e.target.style.borderColor = 'rgba(255,255,255,0.12)'
                e.target.style.background = 'rgba(255,255,255,0.06)'
                e.target.style.boxShadow = 'none'
              }}
            />
          </div>

          <button
            onClick={handleSearch}
            style={{
              width: 54, height: 54, borderRadius: 14, flexShrink: 0,
              background: isLimitExhausted
                ? 'rgba(255,255,255,0.08)'
                : 'linear-gradient(135deg, #4f8ef7, #a855f7)',
              border: isLimitExhausted
                ? '1px solid rgba(255,255,255,0.1)'
                : 'none',
              cursor: isLimitExhausted ? 'not-allowed' : 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 22, color: '#fff',
              boxShadow: isLimitExhausted
                ? 'none'
                : '0 4px 20px rgba(79,142,247,0.45)',
              opacity: isLimitExhausted ? 0.4 : 1,
              transition: 'all 0.25s ease',
            }}
            onMouseEnter={e => {
              if (isLimitExhausted) return
              e.currentTarget.style.transform = 'scale(1.08)'
              e.currentTarget.style.boxShadow = '0 6px 28px rgba(79,142,247,0.6)'
            }}
            onMouseLeave={e => {
              if (isLimitExhausted) {
                e.currentTarget.style.transform = 'scale(1)'
                return
              }
              e.currentTarget.style.transform = 'scale(1)'
              e.currentTarget.style.boxShadow = '0 4px 20px rgba(79,142,247,0.45)'
            }}
          >
            →
          </button>
        </div>
      </div>
    </div>
  )
}
