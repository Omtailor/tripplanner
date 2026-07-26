import { motion, AnimatePresence } from 'framer-motion'

export default function SuccessBanner({ dayNumber }) {
    return (
        <AnimatePresence>
            {dayNumber && (
                <motion.div
                    initial={{ opacity: 0, scale: 0.9, y: -20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.9, y: -20 }}
                    transition={{ duration: 0.25, ease: 'easeOut' }}
                    style={{
                        position: 'fixed',
                        top: 'clamp(72px, 12vw, 90px)', left: '50%',
                        transform: 'translateX(-50%)',
                        zIndex: 9999,
                        background: 'rgba(8, 8, 20, 0.92)',
                        backdropFilter: 'blur(24px)',
                        WebkitBackdropFilter: 'blur(24px)',
                        border: '1px solid rgba(45,212,191,0.3)',
                        borderTop: '1px solid rgba(45,212,191,0.5)',
                        borderRadius: 22,
                        padding: 'clamp(16px, 3vw, 24px) clamp(24px, 5vw, 40px)',
                        boxShadow: '0 16px 60px rgba(0,0,0,0.75), 0 0 40px rgba(45,212,191,0.1)',
                        display: 'flex', flexDirection: 'column',
                        alignItems: 'center', gap: 10,
                        pointerEvents: 'none',
                        textAlign: 'center',
                        width: 'clamp(240px, 80vw, 320px)',
                    }}
                >
                    <span style={{ fontSize: 32 }}>✨</span>
                    <span style={{ fontFamily: "'Poppins', sans-serif", fontSize: 17, fontWeight: 700, color: '#2dd4bf' }}>
                        Day {dayNumber} Regenerated!
                    </span>
                    <span style={{ fontFamily: "'Inter', sans-serif", fontSize: 13, color: 'rgba(255,255,255,0.4)' }}>
                        Your itinerary has been updated
                    </span>
                </motion.div>
            )}
        </AnimatePresence>
    )
}
