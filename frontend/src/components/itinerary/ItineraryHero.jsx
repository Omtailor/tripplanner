import { motion } from 'framer-motion'
import { IndianRupee } from 'lucide-react'

export default function ItineraryHero({ trip, days, summary }) {
    return (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            style={{ textAlign: 'center', marginBottom: 'clamp(28px, 5vw, 52px)' }}>
            <div style={{ fontSize: 'clamp(36px, 8vw, 56px)', marginBottom: 14 }}>🗺️</div>
            <h1 style={{
                fontFamily: "'Poppins', sans-serif",
                fontSize: 'clamp(22px, 6vw, 48px)',
                fontWeight: 800, color: '#fff', marginBottom: 16,
            }}>
                Your {trip?.destination} Trip
            </h1>
            <div style={{ display: 'flex', justifyContent: 'center', gap: 8, flexWrap: 'wrap', padding: '0 8px' }}>
                {[
                    `📍 From ${trip?.origin}`,
                    `🗓️ ${days.length} Days`,
                    `👥 ${trip?.group_type}`,
                    `🍽️ ${trip?.meal_pref}`,
                    `✨ ${trip?.vibe}`,
                    `💸 ${trip?.budget_tier}`,
                ].map(tag => (
                    <span key={tag} style={{
                        padding: 'clamp(5px, 1.5vw, 8px) clamp(10px, 2.5vw, 18px)',
                        borderRadius: 100,
                        background: 'rgba(79,142,247,0.1)',
                        border: '1px solid rgba(79,142,247,0.22)',
                        fontFamily: "'Inter', sans-serif",
                        fontSize: 'clamp(12px, 2.5vw, 16px)', color: '#7eb3ff', fontWeight: 500,
                    }}>{tag}</span>
                ))}
            </div>

            {summary.grand_total_inr && (
                <div style={{
                    display: 'inline-flex', alignItems: 'center', gap: 8,
                    marginTop: 20, padding: 'clamp(8px, 2vw, 12px) clamp(16px, 3vw, 28px)',
                    background: 'rgba(20,184,166,0.1)',
                    border: '1px solid rgba(20,184,166,0.25)',
                    borderRadius: 100,
                }}>
                    <IndianRupee size={18} color="#2dd4bf" />
                    <span style={{
                        fontFamily: "'Poppins', sans-serif",
                        fontSize: 'clamp(16px, 4vw, 22px)',
                        fontWeight: 700, color: '#2dd4bf',
                    }}>
                        Est. Total: ₹{summary.grand_total_inr?.toLocaleString()}
                    </span>
                </div>
            )}
        </motion.div>
    )
}
