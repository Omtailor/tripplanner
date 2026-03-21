import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import api from '../api/axios'
import toast from 'react-hot-toast'
import { ClipLoader } from 'react-spinners'
import { ArrowLeft, MapPin, Calendar, Users, Wallet, ChevronRight, Inbox, Trash2, AlertTriangle, Plane } from 'lucide-react'

// ── Confirm Dialog Component ─────────────────────────────────
function ConfirmDialog({ destination, onConfirm, onCancel }) {
  return (
    <div style={{
      position: 'fixed', inset: 0, zIndex: 100,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(10px)',
    }}>
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ duration: 0.2 }}
        style={{
          background: 'rgba(12,16,34,0.95)',
          border: '1px solid rgba(239,68,68,0.25)',
          borderRadius: 24, padding: '32px 28px',
          maxWidth: 380, width: '90%',
          boxShadow: '0 24px 60px rgba(0,0,0,0.6)',
          textAlign: 'center',
        }}
      >
        <div style={{
          width: 56, height: 56, borderRadius: '50%',
          background: 'rgba(239,68,68,0.1)',
          border: '1px solid rgba(239,68,68,0.2)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          margin: '0 auto 24px',
        }}>
          <AlertTriangle size={24} color="#ef4444" />
        </div>

        <h3 style={{
          fontFamily: "'Poppins', sans-serif",
          fontSize: 20, fontWeight: 700, color: '#fff', marginBottom: 12,
        }}>
          Delete this trip?
        </h3>

        <p style={{
          fontFamily: "'Inter', sans-serif",
          fontSize: 15, color: 'rgba(255,255,255,0.6)',
          lineHeight: 1.6, marginBottom: 32,
        }}>
          Your <span style={{ color: '#fff', fontWeight: 600 }}>{destination}</span> itinerary
          will be permanently deleted. This action cannot be undone.
        </p>

        <div style={{ display: 'flex', gap: 12 }}>
          <button onClick={onCancel} style={{
            flex: 1, padding: '14px',
            background: 'rgba(255,255,255,0.06)',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: 14, color: 'rgba(255,255,255,0.8)',
            fontFamily: "'Inter', sans-serif",
            fontSize: 15, fontWeight: 500, cursor: 'pointer',
            transition: 'all 0.2s'
          }}
            onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'}
            onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.06)'}
          >
            Cancel
          </button>
          <button onClick={onConfirm} style={{
            flex: 1, padding: '14px',
            background: 'rgba(239,68,68,0.15)',
            border: '1px solid rgba(239,68,68,0.3)',
            borderRadius: 14, color: '#ef4444',
            fontFamily: "'Inter', sans-serif",
            fontSize: 15, fontWeight: 600, cursor: 'pointer',
            transition: 'all 0.2s'
          }}
            onMouseEnter={e => e.currentTarget.style.background = 'rgba(239,68,68,0.25)'}
            onMouseLeave={e => e.currentTarget.style.background = 'rgba(239,68,68,0.15)'}
          >
            Delete
          </button>
        </div>
      </motion.div>
    </div>
  )
}

export default function HistoryPage() {
  const [trips, setTrips] = useState([])
  const [loading, setLoading] = useState(true)
  const [deleting, setDeleting] = useState(null)
  const [confirmId, setConfirmId] = useState(null)
  const navigate = useNavigate()

  useEffect(() => {
    api.get('/itinerary/history/')
      .then(res => setTrips(res.data))
      .catch(() => toast.error('Failed to load history'))
      .finally(() => setLoading(false))
  }, [])

  const handleDelete = async (itineraryId) => {
    setConfirmId(null)
    setDeleting(itineraryId)
    try {
      await api.delete(`/itinerary/${itineraryId}/delete/`)
      setTrips(prev => prev.filter(t => t.id !== itineraryId))
      toast.success('Trip deleted successfully')
    } catch {
      toast.error('Failed to delete trip')
    } finally {
      setDeleting(null)
    }
  }

  if (loading) return (
    <div style={{
      minHeight: '100vh', display: 'flex', alignItems: 'center',
      justifyContent: 'center', background: '#080c1a',
      flexDirection: 'column', gap: 16,
    }}>
      <ClipLoader size={40} color="#7b61ff" />
      <p style={{ fontFamily: "'Inter', sans-serif", color: 'rgba(255,255,255,0.5)', fontSize: 15 }}>
        Loading your memories...
      </p>
    </div>
  )

  return (
    <div style={{
      minHeight: '100vh',
      background: '#080c1a',
      color: '#fff',
      overflowX: 'hidden'
    }}>

      {/* Background Bokeh Orbs */}
      <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 0 }}>
        <div style={{
          position: 'absolute', width: '60vw', height: '60vw',
          background: 'radial-gradient(circle, rgba(123,97,255,0.05) 0%, transparent 60%)',
          top: '-10%', left: '-10%', borderRadius: '50%',
        }} />
        <div style={{
          position: 'absolute', width: '50vw', height: '50vw',
          background: 'radial-gradient(circle, rgba(79,142,247,0.06) 0%, transparent 60%)',
          bottom: '-20%', right: '-10%', borderRadius: '50%',
        }} />
      </div>

      <AnimatePresence>
        {confirmId && (
          <ConfirmDialog
            destination={trips.find(t => t.id === confirmId)?.trip?.destination}
            onConfirm={() => handleDelete(confirmId)}
            onCancel={() => setConfirmId(null)}
          />
        )}
      </AnimatePresence>

      {/* Glass Navbar */}
      <div style={{
        position: 'sticky', top: 0, zIndex: 50,
        height: 64, width: '100%',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        background: 'rgba(5, 10, 25, 0.7)',
        backdropFilter: 'blur(16px)', WebkitBackdropFilter: 'blur(16px)',
        borderBottom: '1px solid rgba(255,255,255,0.08)',
      }}>
        <div style={{
          width: '100%', maxWidth: 1100, padding: '0 24px',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between'
        }}>
          <motion.button
            whileTap={{ scale: 0.96 }}
            onClick={() => navigate('/')}
            style={{
              display: 'flex', alignItems: 'center', gap: 8,
              padding: '8px 20px',
              background: 'linear-gradient(90deg, #7b61ff, #4f8ef7, #7b61ff)',
              backgroundSize: '200% auto',
              border: 'none', borderRadius: 100,
              color: '#fff', fontFamily: "'Inter', sans-serif",
              fontSize: 14, fontWeight: 600, cursor: 'pointer',
              boxShadow: 'inset 0 1px 1px rgba(255,255,255,0.3), 0 4px 16px rgba(123,97,255,0.2)',
            }}
          >
            <ArrowLeft size={16} /> Dashboard
          </motion.button>


          <div style={{
            fontFamily: "'Poppins', sans-serif",
            fontSize: 16, fontWeight: 600, color: '#fff', letterSpacing: '0.5px'
          }}>
            TripPlanner ✈️
          </div>

          <motion.button
            whileHover={{ backgroundPosition: '100% 0' }}
            whileTap={{ scale: 0.96 }}
            onClick={() => navigate('/plan')}
            style={{
              padding: '8px 20px',
              background: 'linear-gradient(90deg, #7b61ff, #4f8ef7, #7b61ff)',
              backgroundSize: '200% auto',
              border: 'none', borderRadius: 100,
              color: '#fff', fontFamily: "'Inter', sans-serif",
              fontSize: 14, fontWeight: 600, cursor: 'pointer',
              boxShadow: 'inset 0 1px 1px rgba(255,255,255,0.3), 0 4px 16px rgba(123,97,255,0.2)',
            }}>
            + New Trip
          </motion.button>
        </div>
      </div>

      {/* Main Content Area */}
      <div style={{
        maxWidth: 1100, margin: '0 auto',
        padding: '64px 24px 100px',
        position: 'relative', zIndex: 1,
      }}>

        {/* Header Section */}
        <div style={{ position: 'relative', marginBottom: 56 }}>
          <div style={{
            position: 'absolute', top: -50, left: '50%', transform: 'translateX(-50%)',
            width: 300, height: 150,
            background: 'radial-gradient(circle at top center, rgba(123,97,255,0.25), transparent 65%)',
            pointerEvents: 'none'
          }} />

          <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} style={{ position: 'relative', zIndex: 1 }}>
            <h1 style={{
              fontFamily: "'Poppins', sans-serif",
              fontSize: 'clamp(28px, 4vw, 36px)', fontWeight: 800, color: '#fff',
              display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8
            }}>
              <span style={{ fontSize: '1.1em' }}>🗂️</span> Your Travel History
            </h1>
            <p style={{
              fontFamily: "'Inter', sans-serif",
              fontSize: 16, color: 'rgba(255,255,255,0.65)', marginLeft: 4
            }}>
              {trips.length} trip{trips.length !== 1 ? 's' : ''} planned so far
            </p>
          </motion.div>
        </div>

        {/* Empty State */}
        {trips.length === 0 && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            style={{
              textAlign: 'center', padding: '80px 40px',
              background: 'rgba(255,255,255,0.03)',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(255,255,255,0.08)',
              borderRadius: 24,
            }}>
            <div style={{
              width: 80, height: 80, margin: '0 auto 24px',
              background: 'rgba(255,255,255,0.05)', borderRadius: '50%',
              display: 'flex', alignItems: 'center', justifyContent: 'center'
            }}>
              <Plane size={36} color="rgba(255,255,255,0.4)" />
            </div>
            <p style={{
              fontFamily: "'Poppins', sans-serif",
              fontSize: 22, fontWeight: 600, color: '#fff', marginBottom: 12,
            }}>No trips yet</p>
            <p style={{
              fontFamily: "'Inter', sans-serif",
              fontSize: 15, color: 'rgba(255,255,255,0.5)', marginBottom: 32,
            }}>Start by planning your first adventure.</p>
            <button onClick={() => navigate('/plan')} style={{
              padding: '14px 32px',
              background: 'linear-gradient(90deg, #7b61ff, #4f8ef7)',
              border: 'none', borderRadius: 100,
              color: '#fff', fontFamily: "'Inter', sans-serif",
              fontSize: 16, fontWeight: 600, cursor: 'pointer',
              boxShadow: '0 8px 24px rgba(123,97,255,0.3)',
            }}>
              Plan a trip
            </button>
          </motion.div>
        )}

        {/* Trip Cards List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          <AnimatePresence>
            {trips.map((item, index) => {
              const trip = item.trip
              const isDeleting = deleting === item.id

              return (
                <motion.div
                  key={item.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, transition: { duration: 0.2 } }}
                  transition={{ delay: index * 0.05, duration: 0.4 }}
                  onClick={() => !isDeleting && navigate(`/itinerary/${item.id}`)}
                  whileHover={!isDeleting ? {
                    y: -3,
                    boxShadow: '0 16px 40px rgba(0,0,0,0.55)',
                    borderColor: 'rgba(255,255,255,0.18)'
                  } : {}}
                  whileTap={!isDeleting ? { scale: 0.98 } : {}}
                  style={{
                    position: 'relative',
                    background: 'rgba(255, 255, 255, 0.06)',
                    backdropFilter: 'blur(20px) saturate(160%)',
                    WebkitBackdropFilter: 'blur(20px) saturate(160%)',
                    border: '1px solid rgba(255, 255, 255, 0.10)',
                    borderRadius: 16,
                    padding: '24px',
                    boxShadow: '0 12px 30px rgba(0,0,0,0.3)',
                    cursor: isDeleting ? 'default' : 'pointer',
                    opacity: isDeleting ? 0.5 : 1,
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    flexWrap: 'wrap', gap: 20,
                    overflow: 'hidden'
                  }}
                >
                  {/* Inner top highlight via pseudo-element equivalent */}
                  <div style={{
                    position: 'absolute', top: 0, left: 0, right: 0, height: 1,
                    background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)'
                  }} />

                  {/* Left Column: Title & Meta */}
                  <div style={{ flex: '1 1 250px', display: 'flex', flexDirection: 'column', gap: 14 }}>

                    <div>
                      <h2 style={{
                        fontFamily: "'Poppins', sans-serif",
                        fontSize: 22, fontWeight: 700, color: '#fff',
                        margin: 0, display: 'flex', alignItems: 'center', gap: 10
                      }}>
                        {trip?.origin}
                        <Plane size={18} color="#7b61ff" style={{ opacity: 0.8 }} />
                        {trip?.destination}
                      </h2>
                      <div style={{
                        fontFamily: "'Inter', sans-serif",
                        fontSize: 13, color: 'rgba(255,255,255,0.5)',
                        display: 'flex', alignItems: 'center', gap: 6, marginTop: 6
                      }}>
                        <Calendar size={13} />
                        Created {new Date(item.created_at).toLocaleDateString('en-IN', {
                          day: 'numeric', month: 'short', year: 'numeric'
                        })}
                      </div>
                    </div>

                    {/* Chips Row */}
                    <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                      {[
                        { icon: '🗓', label: `${trip?.start_date} — ${trip?.end_date}` },
                        { icon: '📍', label: trip?.destination },
                        { icon: '👥', label: trip?.group_type },
                        { icon: '💰', label: trip?.budget_tier },
                      ].map(tag => (
                        <div key={tag.label} style={{
                          display: 'flex', alignItems: 'center', gap: 6,
                          padding: '6px 14px', borderRadius: 999,
                          background: 'rgba(255,255,255,0.08)',
                          border: '1px solid rgba(255,255,255,0.15)',
                          fontFamily: "'Inter', sans-serif",
                          fontSize: 12, fontWeight: 600, color: 'rgba(255,255,255,0.8)',
                          textTransform: 'capitalize',
                        }}>
                          <span>{tag.icon}</span> {tag.label}
                        </div>
                      ))}
                    </div>

                  </div>

                  {/* Right Column: Actions */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>

                    {/* Delete Button */}
                    {/* Delete Button */}
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={e => {
                        e.stopPropagation()
                        setConfirmId(item.id)
                      }}
                      disabled={isDeleting}
                      title="Delete trip"
                      style={{
                        width: 42, height: 42,
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                        background: 'rgba(239,68,68,0.85)',   // ← solid red background
                        border: '1.5px solid rgba(239,68,68,1)',
                        cursor: isDeleting ? 'not-allowed' : 'pointer',
                        transition: 'all 0.2s ease',
                        position: 'relative',
                        zIndex: 10,                            // ← ensure it's above card layers
                        boxShadow: '0 0 12px rgba(239,68,68,0.4)',
                      }}
                      onMouseEnter={e => {
                        e.currentTarget.style.background = 'rgba(239,68,68,1)'
                        e.currentTarget.style.boxShadow = '0 0 20px rgba(239,68,68,0.6)'
                      }}
                      onMouseLeave={e => {
                        e.currentTarget.style.background = 'rgba(239,68,68,0.85)'
                        e.currentTarget.style.boxShadow = '0 0 12px rgba(239,68,68,0.4)'
                      }}
                    >
                      {isDeleting
                        ? <ClipLoader size={16} color="#fff" />
                        : <Trash2 size={18} color="#fff" strokeWidth={2.5} />  // ← WHITE icon
                      }
                    </motion.button>


                    {/* View Details Chevron */}
                    <div style={{
                      width: 44, height: 44, borderRadius: '50%',
                      background: 'rgba(255,255,255,0.08)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      transition: 'all 0.2s',
                    }}
                      className="chevron-btn"
                    >
                      <ChevronRight size={22} color="#fff" />
                    </div>

                  </div>

                </motion.div>
              )
            })}
          </AnimatePresence>
        </div>

      </div>
    </div>
  )
}