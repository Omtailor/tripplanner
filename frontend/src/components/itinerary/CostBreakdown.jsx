import { motion } from 'framer-motion'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts'

const COLORS = ['#4f8ef7', '#a855f7', '#2dd4bf', '#f472b6', '#fb923c']

export default function CostBreakdown({ summary, delay }) {
    const chartData = [
        { name: 'Intercity', value: summary.intercity_travel_cost_inr || 0 },
        { name: 'Local Transport', value: summary.local_transport_total_inr || 0 },
        { name: 'Stay', value: summary.accommodation_total_inr || 0 },
        { name: 'Food', value: summary.food_total_inr || 0 },
        { name: 'Activities', value: summary.activities_total_inr || 0 },
    ]

    return (
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay }}>
            <div style={{
                background: 'rgba(12,12,22,0.88)',
                backdropFilter: 'blur(30px)', WebkitBackdropFilter: 'blur(30px)',
                border: '1px solid rgba(255,255,255,0.07)',
                borderTop: '1px solid rgba(255,255,255,0.13)',
                borderRadius: 24, padding: 'clamp(20px, 4vw, 30px) clamp(16px, 4vw, 34px)',
                boxShadow: '0 16px 50px rgba(0,0,0,0.5)',
            }}>
                <h3 style={{
                    fontFamily: "'Poppins', sans-serif",
                    fontSize: 'clamp(18px, 4vw, 24px)',
                    fontWeight: 700, color: '#fff', marginBottom: 24,
                }}>
                    💰 Cost Breakdown
                </h3>

                <ResponsiveContainer width="100%" height={220}>
                    <BarChart data={chartData} barSize={window.innerWidth < 480 ? 18 : 40} margin={{ top: 5, right: 5, left: 0, bottom: 5 }}>
                        <XAxis
                            dataKey="name"
                            tick={{ fontFamily: "'Inter', sans-serif", fontSize: 'clamp(10px, 2vw, 14px)', fill: 'rgba(255,255,255,0.5)' }}
                            axisLine={false} tickLine={false}
                        />
                        <YAxis
                            tick={{ fontFamily: "'Inter', sans-serif", fontSize: 11, fill: 'rgba(255,255,255,0.35)' }}
                            axisLine={false} tickLine={false}
                            tickFormatter={v => `₹${(v / 1000).toFixed(0)}k`}
                            width={40}
                        />
                        <Tooltip
                            contentStyle={{
                                background: 'rgba(8,8,18,0.92)',
                                border: '1px solid rgba(255,255,255,0.12)',
                                borderRadius: 10,
                                fontFamily: "'Inter', sans-serif",
                                color: '#fff',
                                boxShadow: '0 8px 24px rgba(0,0,0,0.4)',
                            }}
                            labelStyle={{ color: 'rgba(255,255,255,0.6)', fontSize: 13, marginBottom: 4 }}
                            itemStyle={{ color: '#7eb3ff', fontSize: 15, fontWeight: 700, fontFamily: "'Poppins', sans-serif" }}
                            formatter={(value) => [`₹${value.toLocaleString()}`, '']}
                            cursor={{ fill: 'rgba(255,255,255,0.04)' }}
                        />
                        <Bar dataKey="value" radius={[8, 8, 0, 0]}>
                            {chartData.map((_, i) => (
                                <Cell key={i} fill={COLORS[i]} fillOpacity={0.85} />
                            ))}
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>

                <div style={{
                    padding: 'clamp(14px, 2vw, 20px) clamp(16px, 3vw, 26px)', marginTop: 20,
                    background: 'linear-gradient(135deg, rgba(79,142,247,0.15), rgba(168,85,247,0.1))',
                    border: '1px solid rgba(79,142,247,0.3)', borderRadius: 16,
                    display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                    flexWrap: 'wrap', gap: 8,
                }}>
                    <span style={{
                        fontFamily: "'Poppins', sans-serif",
                        fontSize: 'clamp(16px, 3vw, 21px)',
                        fontWeight: 700, color: '#fff',
                    }}>
                        Grand Total
                    </span>
                    <span style={{
                        fontFamily: "'Poppins', sans-serif",
                        fontSize: 'clamp(22px, 5vw, 30px)',
                        fontWeight: 800, color: '#7eb3ff',
                    }}>
                        ₹{summary.grand_total_inr?.toLocaleString()}
                    </span>
                </div>

                {summary.travel_tips?.length > 0 && (
                    <div style={{ marginTop: 28 }}>
                        <div style={{
                            fontFamily: "'Inter', sans-serif", fontSize: 13, fontWeight: 600,
                            color: 'rgba(255,255,255,0.35)', textTransform: 'uppercase',
                            letterSpacing: '0.08em', marginBottom: 14,
                        }}>💡 Travel Tips</div>
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
                            {summary.travel_tips.map((tip, i) => (
                                <span key={i} style={{
                                    padding: 'clamp(7px, 1.5vw, 10px) clamp(12px, 2vw, 18px)',
                                    borderRadius: 100,
                                    background: 'rgba(255,255,255,0.04)',
                                    border: '1px solid rgba(255,255,255,0.08)',
                                    fontFamily: "'Inter', sans-serif",
                                    fontSize: 'clamp(13px, 2.5vw, 16px)',
                                    color: 'rgba(255,255,255,0.65)',
                                }}>{tip}</span>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </motion.div>
    )
}
