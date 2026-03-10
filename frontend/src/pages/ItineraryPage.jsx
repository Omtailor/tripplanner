import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import api from '../api/axios'
import toast from 'react-hot-toast'
import { ClipLoader } from 'react-spinners'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts'
import { ArrowLeft, RefreshCw, MapPin, Clock, IndianRupee, Hotel, Bus, Download } from 'lucide-react'
import { PDFDownloadLink } from '@react-pdf/renderer'
import ItineraryPDF from '../components/itinerary/ItineraryPDF'


export default function ItineraryPage() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [itinerary, setItinerary] = useState(null)
  const [loading, setLoading] = useState(true)
  const [regenDayId, setRegenDayId] = useState(null)
  const [showSuccessBanner, setShowSuccessBanner] = useState(false)

  useEffect(() => {
    api.get(`/itinerary/${id}/`)
      .then(res => setItinerary(res.data))
      .catch(() => toast.error('Failed to load itinerary'))
      .finally(() => setLoading(false))
  }, [id])

  const regenDay = async (dayNumber) => {
    setRegenDayId(dayNumber)
    try {
      const res = await api.post(`/itinerary/${id}/regen-day/`, { day_number: dayNumber })
      setItinerary(prev => ({
        ...prev,
        days: prev.days.map(d => d.day_number === dayNumber ? res.data.day : d)
      }))
      setShowSuccessBanner(dayNumber)
      setTimeout(() => setShowSuccessBanner(false), 2800)
    } catch {
      toast.error('Failed to regenerate day')
    } finally {
      setRegenDayId(null)
    }
  }

  if (loading) return (
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

  if (!itinerary) return null

  const days = itinerary.days || []
  const summary = itinerary.summary || {}
  const trip = itinerary.trip

  const chartData = [
    { name: 'Intercity', value: summary.intercity_travel_cost_inr || 0 },
    { name: 'Local Transport', value: summary.local_transport_total_inr || 0 },
    { name: 'Stay', value: summary.accommodation_total_inr || 0 },
    { name: 'Food', value: summary.food_total_inr || 0 },
    { name: 'Activities', value: summary.activities_total_inr || 0 },
  ]
  const COLORS = ['#4f8ef7', '#a855f7', '#2dd4bf', '#f472b6', '#fb923c']

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #050508 0%, #0d0d1a 50%, #050508 100%)',
    }}>

      {/* Background orbs */}
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

      {/* ✅ CHANGED: Sticky Navbar — flexWrap + clamp font/padding on buttons */}
      <div style={{
        position: 'sticky', top: 0, zIndex: 50,
        padding: 'clamp(10px, 2vw, 16px) clamp(14px, 3vw, 32px)',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        flexWrap: 'wrap', gap: 10,
        background: 'rgba(5,5,8,0.88)',
        backdropFilter: 'blur(24px)', WebkitBackdropFilter: 'blur(24px)',
        borderBottom: '1px solid rgba(255,255,255,0.07)',
      }}>
        <button onClick={() => navigate('/')} style={{
          display: 'flex', alignItems: 'center', gap: 8,
          padding: 'clamp(7px, 1.5vw, 10px) clamp(12px, 2vw, 20px)',
          background: 'rgba(255,255,255,0.06)',
          border: '1px solid rgba(255,255,255,0.1)', borderRadius: 100,
          color: 'rgba(255,255,255,0.7)', fontFamily: "'Inter', sans-serif",
          fontSize: 'clamp(13px, 2vw, 16px)', cursor: 'pointer',
        }}>
          <ArrowLeft size={16} /> Dashboard
        </button>

        <div style={{ textAlign: 'center', flex: 1, minWidth: 0, padding: '0 8px' }}>
          <div style={{
            fontFamily: "'Poppins', sans-serif",
            fontSize: 'clamp(13px, 3vw, 21px)',
            fontWeight: 700, color: '#fff',
            whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
          }}>
            {trip?.origin} → {trip?.destination}
          </div>
          <div style={{
            fontFamily: "'Inter', sans-serif",
            fontSize: 'clamp(11px, 1.5vw, 14px)',
            color: 'rgba(255,255,255,0.38)', marginTop: 2,
            whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
          }}>
            {trip?.start_date} · {days.length} days · {trip?.group_type} · {trip?.budget_tier}
          </div>
        </div>

        <div style={{ display: 'flex', gap: 8, flexShrink: 0 }}>
          {itinerary && (
            <PDFDownloadLink
              document={<ItineraryPDF itinerary={itinerary} />}
              fileName={`${trip?.destination}-itinerary.pdf`}
              style={{ textDecoration: 'none' }}
            >
              {({ loading }) => (
                <button style={{
                  display: 'flex', alignItems: 'center', gap: 7,
                  padding: 'clamp(7px, 1.5vw, 10px) clamp(12px, 2vw, 20px)',
                  background: loading
                    ? 'rgba(255,255,255,0.04)'
                    : 'linear-gradient(135deg, rgba(79,142,247,0.25), rgba(168,85,247,0.2))',
                  border: '1px solid rgba(79,142,247,0.35)',
                  borderRadius: 100,
                  color: loading ? 'rgba(255,255,255,0.35)' : '#7eb3ff',
                  fontFamily: "'Inter', sans-serif",
                  fontSize: 'clamp(13px, 2vw, 16px)',
                  cursor: loading ? 'not-allowed' : 'pointer',
                  transition: 'all 0.2s ease',
                  whiteSpace: 'nowrap',
                }}>
                  {loading
                    ? <><ClipLoader size={13} color="#7eb3ff" /> Preparing...</>
                    : <><Download size={16} /> Export PDF</>
                  }
                </button>
              )}
            </PDFDownloadLink>
          )}

          <button onClick={() => navigate('/history')} style={{
            padding: 'clamp(7px, 1.5vw, 10px) clamp(12px, 2vw, 20px)',
            background: 'rgba(255,255,255,0.06)',
            border: '1px solid rgba(255,255,255,0.1)', borderRadius: 100,
            color: 'rgba(255,255,255,0.6)', fontFamily: "'Inter', sans-serif",
            fontSize: 'clamp(13px, 2vw, 16px)', cursor: 'pointer',
            whiteSpace: 'nowrap',
          }}>
            History
          </button>
        </div>
      </div>

      {/* Page Content */}
      <div style={{ maxWidth: 860, margin: '0 auto', padding: 'clamp(24px, 5vw, 44px) clamp(14px, 3vw, 24px) 80px', position: 'relative', zIndex: 1 }}>

        {/* Hero Header */}
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

        {/* Day Cards */}
        {days.map((day, index) => (
          <motion.div key={day.day_number}
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

              {/* ✅ CHANGED: Day Header — flexWrap so regen button drops below on mobile */}
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
                  onClick={() => regenDay(day.day_number)}
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

                {/* ✅ CHANGED: Meals Row — auto-fit collapses to 1 col on mobile */}
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

                {/* ✅ CHANGED: Bottom Info — auto-fit collapses to 2 col on mobile */}
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
        ))}

        {/* Summary Section */}
        {summary && (
          <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }}
            transition={{ delay: days.length * 0.08 + 0.2 }}>
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
        )}

      </div>

      {/* Center Success Popup */}
      <AnimatePresence>
        {showSuccessBanner && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 30 }}
            transition={{ duration: 0.25, ease: 'easeOut' }}
            style={{
              position: 'fixed',
              top: '50%', left: '50%',
              transform: 'translate(-50%, -50%)',
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
              Day {showSuccessBanner} Regenerated!
            </span>
            <span style={{ fontFamily: "'Inter', sans-serif", fontSize: 13, color: 'rgba(255,255,255,0.4)' }}>
              Your itinerary has been updated
            </span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ✅ CHANGED: media queries added */}
      <style>{`
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }

        @media (max-width: 480px) {
          .meals-grid {
            grid-template-columns: 1fr !important;
          }
          .info-grid {
            grid-template-columns: 1fr 1fr !important;
          }
          .regen-btn {
            font-size: 12px !important;
            padding: 8px 12px !important;
          }
        }
      `}</style>
    </div>
  )
}


function InfoChip({ icon, label, value, color, big }) {
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
