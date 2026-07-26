export default function StepHeader({ icon, title, sub }) {
  return (
    <div style={{ display: 'flex', gap: 16, alignItems: 'center', marginBottom: 8 }}>
      <div style={{
        width: 44, height: 44, borderRadius: '50%',
        background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)',
        display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0
      }}>
        {icon}
      </div>
      <div>
        <h2 style={{ fontFamily: "'Poppins', sans-serif", fontSize: 26, fontWeight: 700, color: '#fff', margin: '0 0 2px 0' }}>
          {title}
        </h2>
        <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 15, color: 'rgba(255,255,255,0.5)', margin: 0 }}>
          {sub}
        </p>
      </div>
    </div>
  )
}
