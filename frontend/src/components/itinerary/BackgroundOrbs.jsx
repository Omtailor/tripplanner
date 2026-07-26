export default function BackgroundOrbs() {
    return (
        <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 0 }}>
            <div style={{
                position: 'absolute', width: 700, height: 700,
                background: 'radial-gradient(circle, rgba(79,142,247,0.1) 0%, transparent 70%)',
                top: -300, left: -200, borderRadius: '50%',
            }} />
            <div style={{
                position: 'absolute', width: 500, height: 500,
                background: 'radial-gradient(circle, rgba(168,85,247,0.08) 0%, transparent 70%)',
                bottom: -200, right: -100, borderRadius: '50%',
            }} />
        </div>
    )
}
