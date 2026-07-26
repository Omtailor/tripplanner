import { History, LogOut, Zap } from 'lucide-react'
import LimitTooltip from '../shared/LimitTooltip'

export default function TopBar({ rateLimit, onHistory, onLogout }) {
  const isLimitExhausted = rateLimit.remaining === 0

  return (
    <div style={{
      position: 'absolute', top: 20, right: 20, zIndex: 10,
      display: 'flex', alignItems: 'center', gap: 10,
    }}>
      <LimitTooltip remaining={rateLimit.remaining}>
        <button style={{
          display: 'flex', alignItems: 'center', gap: 6,
          height: 36, padding: '0 14px', borderRadius: 100,
          background: isLimitExhausted
            ? 'rgba(248,113,113,0.15)'
            : 'rgba(8,8,18,0.40)',
          backdropFilter: 'blur(40px) saturate(180%)',
          WebkitBackdropFilter: 'blur(40px) saturate(180%)',
          border: isLimitExhausted
            ? '1px solid rgba(248,113,113,0.3)'
            : '1px solid rgba(255,255,255,0.13)',
          cursor: 'pointer', boxSizing: 'border-box', margin: 0,
          fontFamily: "'Inter', sans-serif", fontSize: 13,
        }}>
          <Zap
            size={13}
            color={isLimitExhausted ? '#f87171' : '#fbbf24'}
            fill={isLimitExhausted ? '#f87171' : '#fbbf24'}
          />
          <span style={{
            fontWeight: 600,
            color: isLimitExhausted ? '#f87171' : 'rgba(255,255,255,0.85)',
          }}>
            {rateLimit.remaining}/{rateLimit.limit} left
          </span>
        </button>
      </LimitTooltip>

      <button onClick={onHistory} style={{
        display: 'flex', alignItems: 'center', gap: 6,
        height: 36, padding: '0 14px', borderRadius: 100,
        background: 'rgba(8,8,18,0.40)',
        backdropFilter: 'blur(40px) saturate(180%)',
        WebkitBackdropFilter: 'blur(40px) saturate(180%)',
        border: '1px solid rgba(255,255,255,0.13)',
        color: 'rgba(255,255,255,0.85)', fontFamily: "'Inter', sans-serif",
        fontSize: 13, cursor: 'pointer',
        boxSizing: 'border-box', margin: 0,
      }}>
        <History size={13} /> History
      </button>

      <button onClick={onLogout} style={{
        display: 'flex', alignItems: 'center', gap: 6,
        height: 36, padding: '0 14px', borderRadius: 100,
        background: 'rgba(8,8,18,0.40)',
        backdropFilter: 'blur(40px) saturate(180%)',
        WebkitBackdropFilter: 'blur(40px) saturate(180%)',
        border: '1px solid rgba(255,255,255,0.13)',
        color: 'rgba(255,255,255,0.85)', fontFamily: "'Inter', sans-serif",
        fontSize: 13, cursor: 'pointer',
        boxSizing: 'border-box', margin: 0,
      }}>
        <LogOut size={13} /> Logout
      </button>
    </div>
  )
}
