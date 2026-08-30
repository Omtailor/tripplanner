import { ClipLoader } from 'react-spinners'

export default function AuthSubmitButton({ loading, isLogin }) {
  return (
    <button type="submit" disabled={loading} style={{
      marginTop: 4,
      width: '100%', padding: '17px',
      background: loading
        ? 'rgba(79,142,247,0.35)'
        : 'linear-gradient(135deg, #4f8ef7 0%, #a855f7 100%)',
      color: 'white', border: 'none',
      borderRadius: 14,
      fontFamily: "'Inter', sans-serif",
      fontSize: 16, fontWeight: 600,
      letterSpacing: '0.02em',
      cursor: loading ? 'not-allowed' : 'pointer',
      transition: 'all 0.3s ease',
      display: 'flex', alignItems: 'center',
      justifyContent: 'center', gap: 10,
      boxShadow: loading ? 'none' : '0 4px 24px rgba(79,142,247,0.45)',
    }}>
      {loading
        ? <><ClipLoader size={16} color="#fff" /><span>Please wait...</span></>
        : isLogin ? 'Sign In →' : 'Create Account →'}
    </button>
  )
}
