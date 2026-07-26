import { motion } from 'framer-motion'
import { MapPin, Clock, IndianRupee, Hotel, Bus, RefreshCw } from 'lucide-react'
import InfoChip from './InfoChip'

export default function DayCard({ day, index, regenDayId, onRegenerate }) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.08, duration: 0.5 }}
            style={{ marginBottom: 28 }}
        >
            <div style={{
                background: 'rgba(12,12,22,0.88)',
                backdropFilter: 'blur(30px)', WebkitBackdropFilter: 'blur(30px)',
                border: '1px solid rgba(255,255,255,0.07)',
                borderTop: '1px solid rgba(255,255,255,0.13)',
                borderRadius: 24, overflow: 'hidden',
                boxShadow: '0 16px 50px rgba(0,0,0,0.5)',
            }}>

                {/* Day Header */}
                <div style={{
                    padding: 'clamp(14px, 3vw, 22px) clamp(16px, 3vw, 30px)',
                    background: 'linear-gradient(135deg, rgba(79,142,247,0.1), rgba(168,85,247,0.07))',
                    borderBottom: '1px solid rgba(255,255,255,0.06)',
                    display: 'flex', alignItems: 'flex-start',
                    justifyContent: 'space-between',
                    flexWrap: 'wrap', gap: 12,
                }}>
                    <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap' }}>
                            <span style={{
                                fontFamily: "'Poppins', sans-serif",
                                fontSize: 'clamp(20px, 4vw, 30px)',
                                fontWeight: 700, color: '#fff',
                            }}>
                                Day {day.day_number}
                            </span>
                            <span style={{
                                fontFamily: "'Inter', sans-serif",
                                fontSize: 'clamp(14px, 2.5vw, 18px)',
                                color: 'rgba(255,255,255,0.55)',
                            }}>
                                — {day.theme}
                            </span>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 6, flexWrap: 'wrap' }}>
                            <span style={{ fontFamily: "'Inter', sans-serif", fontSize: 13, color: 'rgba(255,255,255,0.3)' }}>
                                {day.date}
                            </span>
                            <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontFamily: "'Inter', sans-serif", fontSize: 13, color: 'rgba(255,255,255,0.35)' }}>
                                <MapPin size={12} /> {day.region_of_day}
                            </span>
                            {day.vibes_of_day?.map(v => (
                                <span key={v} style={{
                                    padding: '3px 10px', borderRadius: 100,
                                    background: 'rgba(168,85,247,0.12)',
                                    border: '1px solid rgba(168,85,247,0.25)',
                                    fontFamily: "'Inter', sans-serif",
                                    fontSize: 12, color: '#c084fc', fontWeight: 500,
                                    textTransform: 'capitalize',
                                }}>{v}</span>
                            ))}
                        </div>
                    </div>

                    {/* Regenerate Button */}
                    <button
                        className="regen-btn"
                        onClick={() => onRegenerate(day.day_number)}
                        disabled={regenDayId === day.day_number}
                        style={{
                            display: 'flex', alignItems: 'center', gap: 7,
                            padding: 'clamp(8px, 1.5vw, 11px) clamp(12px, 2vw, 20px)',
                            background: regenDayId === day.day_number
                                ? 'rgba(79,142,247,0.15)'
                                : 'rgba(255,255,255,0.05)',
                            border: regenDayId === day.day_number
                                ? '1px solid rgba(79,142,247,0.3)'
                                : '1px solid rgba(255,255,255,0.1)',
                            borderRadius: 100,
                            color: regenDayId === day.day_number ? '#7eb3ff' : 'rgba(255,255,255,0.55)',
                            fontFamily: "'Inter', sans-serif",
                            fontSize: 'clamp(12px, 2vw, 15px)', fontWeight: 500,
                            cursor: regenDayId === day.day_number ? 'not-allowed' : 'pointer',
                            opacity: regenDayId === day.day_number ? 0.75 : 1,
                            transition: 'all 0.2s ease',
                            flexShrink: 0,
                            whiteSpace: 'nowrap',
                        }}>
                        <RefreshCw size={14} style={{
                            animation: regenDayId === day.day_number ? 'spin 1s linear infinite' : 'none'
                        }} />
                        {regenDayId === day.day_number ? 'Regenerating...' : 'Regenerate'}
                    </button>
                </div>

                {/* Day Body */}
                <div style={{ padding: 'clamp(16px, 3vw, 26px) clamp(16px, 3vw, 30px)', display: 'flex', flexDirection: 'column', gap: 22 }}>

                    {/* Meals Grid */}
                    <div className="meals-grid" style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
                        gap: 12,
                    }}>
                        {[
                            { label: '🌅 Breakfast', value: day.breakfast },
                            { label: '☀️ Lunch', value: day.lunch },
                            { label: '🌙 Dinner', value: day.dinner },
                        ].map(meal => meal.value && (
                            <div key={meal.label} style={{
                                padding: '14px 16px',
                                background: 'rgba(255,255,255,0.03)',
                                border: '1px solid rgba(255,255,255,0.06)',
                                borderRadius: 14,
                            }}>
                                <div style={{
                                    fontFamily: "'Inter', sans-serif", fontSize: 12, fontWeight: 600,
                                    color: 'rgba(255,255,255,0.35)', textTransform: 'uppercase',
                                    letterSpacing: '0.06em', marginBottom: 8,
                                }}>{meal.label}</div>
                                <div style={{ fontFamily: "'Inter', sans-serif", fontSize: 15, color: 'rgba(255,255,255,0.8)', lineHeight: 1.5 }}>
                                    {meal.value}
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Activities */}
                    <div>
                        <div style={{
                            fontFamily: "'Inter', sans-serif", fontSize: 13, fontWeight: 600,
                            color: 'rgba(255,255,255,0.35)', textTransform: 'uppercase',
                            letterSpacing: '0.08em', marginBottom: 14,
                        }}>📋 Activities</div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                            {day.activities?.map((act, i) => (
                                <div key={i} style={{
                                    padding: 'clamp(14px, 2vw, 18px) clamp(14px, 2vw, 22px)',
                                    background: 'rgba(255,255,255,0.03)',
                                    border: '1px solid rgba(255,255,255,0.06)',
                                    borderRadius: 16,
                                    display: 'flex', gap: 14, alignItems: 'flex-start',
                                }}>
                                    <div style={{
                                        flexShrink: 0, width: 56, padding: '5px 0', textAlign: 'center',
                                        background: 'rgba(79,142,247,0.1)', border: '1px solid rgba(79,142,247,0.2)',
                                        borderRadius: 10, fontFamily: "'Inter', sans-serif",
                                        fontSize: 13, fontWeight: 700, color: '#7eb3ff',
                                    }}>{act.time}</div>

                                    <div style={{ flex: 1, minWidth: 0 }}>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6, flexWrap: 'wrap' }}>
                                            <span style={{
                                                fontFamily: "'Inter', sans-serif",
                                                fontSize: 'clamp(15px, 3vw, 19px)',
                                                fontWeight: 600, color: '#fff',
                                            }}>
                                                {act.name}
                                            </span>
                                            {act.cost_inr > 0 && (
                                                <span style={{
                                                    padding: '3px 10px', borderRadius: 100,
                                                    background: 'rgba(20,184,166,0.1)', border: '1px solid rgba(20,184,166,0.2)',
                                                    fontFamily: "'Inter', sans-serif", fontSize: 13, color: '#2dd4bf', fontWeight: 600,
                                                }}>₹{act.cost_inr}</span>
                                            )}
                                            {act.duration_minutes && (
                                                <span style={{ display: 'flex', alignItems: 'center', gap: 3, fontFamily: "'Inter', sans-serif", fontSize: 13, color: 'rgba(255,255,255,0.35)' }}>
                                                    <Clock size={12} /> {act.duration_minutes}m
                                                </span>
                                            )}
                                        </div>
                                        <div style={{ fontFamily: "'Inter', sans-serif", fontSize: 15, color: 'rgba(255,255,255,0.55)', lineHeight: 1.7, marginBottom: 8 }}>
                                            {act.description}
                                        </div>
                                        {act.location && (
                                            <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontFamily: "'Inter', sans-serif", fontSize: 13, color: 'rgba(255,255,255,0.32)' }}>
                                                <MapPin size={12} /> {act.location}
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* Info Chips */}
                    <div className="info-grid" style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
                        gap: 12,
                    }}>
                        <InfoChip icon={<Hotel size={15} />} label="Stay" value={day.accommodation} color="#a78bfa" />
                        <InfoChip icon={<Bus size={15} />} label="Transport" value={day.local_transport_note} color="#60a5fa" />
                        <InfoChip icon={<IndianRupee size={15} />} label="Day Total" value={`₹${day.day_total_cost_inr?.toLocaleString()}`} color="#2dd4bf" big />
                    </div>

                </div>
            </div>
        </motion.div>
    )
}
