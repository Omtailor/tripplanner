export default function PlannerBackground() {
  return (
    <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 0 }}>
      <div style={{
        position: 'absolute', width: '50vw', height: '50vw',
        background: 'radial-gradient(circle, rgba(123,97,255,0.06) 0%, transparent 60%)',
        top: '-10%', left: '-10%', borderRadius: '50%',
      }} />
      <div style={{
        position: 'absolute', width: '60vw', height: '60vw',
        background: 'radial-gradient(circle, rgba(79,142,247,0.05) 0%, transparent 60%)',
        bottom: '-20%', right: '-10%', borderRadius: '50%',
      }} />
    </div>
  )
}
