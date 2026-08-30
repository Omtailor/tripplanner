export default function AuthHeader({ isLogin }) {
  return (
    <div style={{ textAlign: 'center', marginBottom: 24 }}>
      <div style={{ fontSize: 32, marginBottom: 8 }}>✈️</div>
      <div style={{
        fontFamily: "'Poppins', sans-serif",
        fontSize: 'clamp(22px, 5vw, 32px)', fontWeight: 700,
        background: 'linear-gradient(135deg, #4f8ef7, #a855f7)',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
        backgroundClip: 'text',
        marginBottom: 8,
      }}>
        TripPlanner
      </div>
      <p style={{
        fontFamily: "'Inter', sans-serif",
        color: 'rgba(255,255,255,0.5)',
        fontSize: 16, fontWeight: 400,
        margin: 0,
      }}>
        {isLogin ? 'Sign in to plan your next adventure' : 'Create your account to get started'}
      </p>
    </div>
  )
}
