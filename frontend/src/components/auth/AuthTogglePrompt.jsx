export default function AuthTogglePrompt({ isLogin, onToggle }) {
  return (
    <p style={{
      textAlign: 'center',
      fontFamily: "'Inter', sans-serif",
      color: 'rgba(255,255,255,0.55)',
      fontSize: 15,
      margin: 0,
    }}>
      {isLogin ? "Don't have an account? " : 'Already have an account? '}
      <span
        onClick={onToggle}
        style={{ color: '#7eb3ff', cursor: 'pointer', fontWeight: 600, transition: 'color 0.2s' }}
      >
        {isLogin ? 'Sign up free' : 'Sign in'}
      </span>
    </p>
  )
}
