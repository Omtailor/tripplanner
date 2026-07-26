export default function InfoChip({ icon, label, value, color, big }) {
    return (
        <div style={{
            padding: '14px 16px',
            background: 'rgba(255,255,255,0.03)',
            border: '1px solid rgba(255,255,255,0.06)',
            borderRadius: 14,
        }}>
            <div style={{
                display: 'flex', alignItems: 'center', gap: 5,
                fontFamily: "'Inter', sans-serif",
                fontSize: 12, fontWeight: 600,
                color: 'rgba(255,255,255,0.3)',
                textTransform: 'uppercase', letterSpacing: '0.06em',
                marginBottom: 8,
            }}>
                <span style={{ color }}>{icon}</span> {label}
            </div>
            <div style={{
                fontFamily: big ? "'Poppins', sans-serif" : "'Inter', sans-serif",
                fontSize: big ? 'clamp(16px, 3vw, 22px)' : 'clamp(13px, 2.5vw, 16px)',
                fontWeight: big ? 700 : 400,
                color: big ? color : 'rgba(255,255,255,0.7)',
                lineHeight: 1.4,
            }}>{value}</div>
        </div>
    )
}
