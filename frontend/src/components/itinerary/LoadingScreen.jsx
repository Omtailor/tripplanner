import { ClipLoader } from 'react-spinners'

export default function LoadingScreen() {
    return (
        <div style={{
            minHeight: '100vh', display: 'flex', alignItems: 'center',
            justifyContent: 'center', background: '#050508',
            flexDirection: 'column', gap: 16,
        }}>
            <ClipLoader size={40} color="#4f8ef7" />
            <p style={{ fontFamily: "'Inter', sans-serif", color: 'rgba(255,255,255,0.4)', fontSize: 19 }}>
                Loading your itinerary...
            </p>
        </div>
    )
}
