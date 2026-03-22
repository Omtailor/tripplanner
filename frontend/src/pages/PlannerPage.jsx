import { useState, useEffect, useRef } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import DatePicker from 'react-datepicker'
import "react-datepicker/dist/react-datepicker.css"
import api from '../api/axios'
import toast from 'react-hot-toast'
import { ClipLoader } from 'react-spinners'
import { ArrowLeft, ArrowRight, Calendar, DollarSign, Sparkles, MapPin, Utensils, Users, Check, Plane } from 'lucide-react'



const CITIES = [
  'Mumbai', 'Delhi', 'Bangalore', 'Chennai', 'Kolkata', 'Hyderabad', 'Pune', 'Ahmedabad', 'Jaipur', 'Surat',
  'Lucknow', 'Kanpur', 'Nagpur', 'Indore', 'Thane', 'Bhopal', 'Visakhapatnam', 'Patna', 'Vadodara', 'Rajkot',
  'Varanasi', 'Amritsar', 'Tirupati', 'Shirdi', 'Mathura', 'Vrindavan', 'Dwarka', 'Puri', 'Bodh Gaya', 'Ajmer',
  'Rameswaram', 'Haridwar', 'Rishikesh', 'Ujjain', 'Nashik', 'Nathdwara', 'Somnath', 'Palitana', 'Madurai', 'Kanchipuram',
  'Agra', 'Jodhpur', 'Udaipur', 'Jaisalmer', 'Pushkar', 'Hampi', 'Khajuraho', 'Aurangabad', 'Mysore', 'Pondicherry',
  'Goa', 'Kochi', 'Varkala', 'Alibaug', 'Tarkarli', 'Diu', 'Daman', 'Mangalore', 'Udupi', 'Bekal',
  'Kanyakumari', 'Digha', 'Mandarmani', 'Vizag Beach', 'Karwar', 'Murudeshwar',
  'Shimla', 'Manali', 'Mussoorie', 'Nainital', 'Darjeeling', 'Ooty', 'Munnar', 'Coorg', 'Kodaikanal', 'Chikmagalur',
  'Kasauli', 'Lansdowne', 'Dalhousie', 'Dharamshala', 'McLeod Ganj', 'Spiti', 'Kufri', 'Mahabaleshwar', 'Lonavala', 'Matheran',
  'Mount Abu', 'Pachmarhi', 'Shillong', 'Cherrapunji', 'Tawang', 'Gangtok', 'Pelling', 'Lachung', 'Yuksom', 'Kasol',
  'Leh', 'Srinagar', 'Jammu', 'Kargil', 'Padum',
  'Uttarkashi', 'Kedarnath', 'Badrinath', 'Chopta', 'Auli', 'Munsiyari', 'Binsar', 'Chakrata', 'Dhanaulti',
  'Guwahati', 'Kaziranga', 'Tezpur', 'Dibrugarh', 'Imphal', 'Aizawl', 'Agartala', 'Kohima', 'Itanagar',
  'Port Blair', 'Havelock Island', 'Neil Island', 'Lakshadweep', 'Kavaratti',
  'Chandigarh', 'Dehradun', 'Siliguri', 'Ranchi', 'Raipur', 'Bhubaneswar', 'Tiruchirappalli', 'Vijayawada', 'Coimbatore', 'Salem'
]



const STEPS = [
  { id: 1, label: 'Dates', icon: Calendar },
  { id: 2, label: 'Budget', icon: DollarSign },
  { id: 3, label: 'Vibe', icon: Sparkles },
  { id: 4, label: 'Origin', icon: MapPin },
  { id: 5, label: 'Meals', icon: Utensils },
  { id: 6, label: 'Group', icon: Users },
  { id: 7, label: 'Summary', icon: Check },
]



const slideVariants = {
  enter: (direction) => ({ x: direction > 0 ? 12 : -12, opacity: 0 }),
  center: { x: 0, opacity: 1 },
  exit: (direction) => ({ x: direction < 0 ? 12 : -12, opacity: 0 }),
}



const LOADING_SENTENCES = [
  "✈️ Crafting your perfect trip across India...",
  "🗺️ Charting the most scenic route just for you...",
  "📅 Locking in your travel dates and schedule...",
  "🏨 Handpicking the finest stays along the way...",
  "🍽️ Discovering local flavours you'll absolutely love...",
  "🚆 Finding the best trains, cabs, and connections...",
  "🏔️ Exploring offbeat trails only locals know about...",
  "🛺 Arranging every transfer so you don't have to...",
  "🌅 Scouting the most breathtaking sunrise spots...",
  "🎭 Weaving culture, adventure, and relaxation together...",
  "🎒 Packing your days with unforgettable experiences...",
  "🌿 Finding that perfect chai stop between destinations...",
  "📍 Pinning every hidden gem onto your map...",
  "🗿 Uncovering centuries of history along your route...",
  "💫 Adding those little moments of pure magic...",
  "🛎️ Putting the finishing touches on your itinerary...",
  "🔍 Double-checking every detail one last time...",
  "🚀 Almost ready — your dream trip is nearly here!",
]



// ── Generating Overlay ────────────────────────────────────────
function GeneratingOverlay({ destination }) {
  const [sentenceIndex, setSentenceIndex] = useState(0)
  const [visible, setVisible] = useState(true)

  useEffect(() => {
    const interval = setInterval(() => {
      setVisible(false)
      setTimeout(() => {
        setSentenceIndex(i => (i + 1) % LOADING_SENTENCES.length)
        setVisible(true)
      }, 400)
    }, 2800)
    return () => clearInterval(interval)
  }, [])

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.4 }}
      style={{
        position: 'fixed', inset: 0, zIndex: 200,
        background: 'rgba(8,12,26,0.95)',
        backdropFilter: 'blur(10px)',
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        padding: '24px', textAlign: 'center',
      }}
    >
      <div style={{ position: 'relative', marginBottom: 40 }}>
        <motion.div
          animate={{ rotate: [0, 10, -10, 0] }}
          transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
          style={{ fontSize: 64, lineHeight: 1 }}
        >
          <Plane color="#7b61ff" fill="#7b61ff" size={64} />
        </motion.div>
        {[1, 2, 3].map(i => (
          <motion.div
            key={i}
            animate={{ scale: [1, 2.2], opacity: [0.4, 0] }}
            transition={{ duration: 2, repeat: Infinity, delay: i * 0.5, ease: 'easeOut' }}
            style={{
              position: 'absolute', inset: 0, borderRadius: '50%',
              border: '2px solid rgba(123,97,255,0.4)',
            }}
          />
        ))}
      </div>

      <div style={{
        height: 80, width: '100%', maxWidth: 600,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        marginBottom: 48,
      }}>
        <motion.p
          key={sentenceIndex}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: visible ? 1 : 0, y: visible ? 0 : -12 }}
          transition={{ duration: 0.3 }}
          style={{
            fontFamily: "'Poppins', sans-serif", fontSize: 'clamp(17px, 4.5vw, 24px)',
            fontWeight: 600, color: '#fff', margin: 0, lineHeight: 1.4,
          }}
        >
          {LOADING_SENTENCES[sentenceIndex]}
        </motion.p>
      </div>
    </motion.div>
  )
}



// ── Main Page ─────────────────────────────────────────────────
export default function PlannerPage() {
  const navigate = useNavigate()
  const location = useLocation()

  const [[step, direction], setPage] = useState([1, 0])
  const [generating, setGenerating] = useState(false)
  const [citySearch, setCitySearch] = useState('')

  const destinationFromDash = location.state?.destination || ''

  const [data, setData] = useState({
    destination: destinationFromDash,
    start_date: null, end_date: null,
    budget_tier: '', vibe: '', origin: '',
    meal_pref: '', group_type: '',
  })

  const update = (key, val) => setData(d => ({ ...d, [key]: val }))

  const paginate = (newStep) => {
    setPage([newStep, newStep > step ? 1 : -1])
  }

  const days = data.start_date && data.end_date
    ? Math.ceil((data.end_date - data.start_date) / (1000 * 60 * 60 * 24))
    : 0

  const canNext = () => {
    if (step === 1) return data.start_date && data.end_date && days > 0 && days <= 14
    if (step === 2) return !!data.budget_tier
    if (step === 3) return !!data.vibe
    if (step === 4) return !!data.origin
    if (step === 5) return !!data.meal_pref
    if (step === 6) return !!data.group_type
    return true
  }

  const generate = async () => {
    setGenerating(true)
    try {
      const travelersMap = { solo: 1, couple: 2, friends: 4, family: 4 }
      const payload = {
        origin: data.origin,
        destination: data.destination || 'Goa',
        start_date: data.start_date.toISOString().split('T')[0],
        end_date: data.end_date.toISOString().split('T')[0],
        days,
        group_type: data.group_type,
        meal_pref: data.meal_pref,
        vibe: data.vibe,
        budget_tier: data.budget_tier,
        travelers: travelersMap[data.group_type] || 1,
      }
      const res = await api.post('/itinerary/generate/', payload)
      toast.success('Itinerary created! ✈️')
      navigate(`/itinerary/${res.data.id}`)
    } catch (err) {
      toast.error(err.response?.data?.error || 'Failed to generate')
    } finally {
      setGenerating(false)
    }
  }

  const filteredCities = CITIES.filter(c => c.toLowerCase().includes(citySearch.toLowerCase()))

  const progressRef = useRef(null)

  useEffect(() => {
    if (progressRef.current) {
      const activeEl = progressRef.current.querySelector('[data-active="true"]')
      if (activeEl) {
        activeEl.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' })
      }
    }
  }, [step])


  return (
    <>
      <AnimatePresence>
        {generating && <GeneratingOverlay destination={data.destination || 'your destination'} />}
      </AnimatePresence>

      {/* ── CHANGE 1: justifyContent flex-start + split padding ── */}
      <motion.div
        animate={{ opacity: generating ? 0 : 1 }}
        transition={{ duration: 0.4 }}
        style={{
          minHeight: '100vh', width: '100vw',
          background: '#080c1a',
          display: 'flex', flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'flex-start',            // ← was 'center'
          paddingTop: 'clamp(16px, 4vw, 48px)',    // ← was single padding shorthand
          paddingBottom: 'clamp(24px, 4vw, 48px)',
          paddingLeft: 16, paddingRight: 16,
          position: 'relative', overflow: 'hidden',
          boxSizing: 'border-box',
        }}
      >
        {/* Soft Bokeh Background */}
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

        {/* Step Progress Bar */}
        <div ref={progressRef} style={{
          display: 'flex', alignItems: 'center', gap: 6,
          marginBottom: 32, zIndex: 1,
          overflowX: 'auto', padding: '12px 16px',
          maxWidth: '100%', scrollbarWidth: 'none', msOverflowStyle: 'none',
        }}>
          {STEPS.map((s, i) => {
            const Icon = s.icon
            const done = step > s.id
            const active = step === s.id

            return (
              <div key={s.id} style={{ display: 'flex', alignItems: 'center' }}>
                <motion.div
                  data-active={active ? "true" : "false"}
                  onClick={() => done && paginate(s.id)}
                  whileHover={done ? { scale: 1.05 } : {}}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 6,
                    padding: active ? '13px 26px' : done ? '11px 20px' : '11px 22px',
                    borderRadius: 999,
                    background: active
                      ? 'linear-gradient(90deg, #7b61ff, #4f8ef7)'
                      : done ? 'rgba(255,255,255,0.1)' : 'transparent',
                    border: active ? 'none' : done ? '1px solid rgba(255,255,255,0.05)' : '1px solid rgba(255,255,255,0.15)',
                    boxShadow: active ? '0 4px 16px rgba(123,97,255,0.3)' : 'none',
                    cursor: done ? 'pointer' : 'default',
                    transition: 'all 0.3s ease',
                    flexShrink: 0
                  }}
                >
                  {done ? <Check size={18} color="#fff" /> : <Icon size={18} color={active ? '#fff' : 'rgba(255,255,255,0.4)'} />}
                  <span style={{
                    fontFamily: "'Inter', sans-serif", fontSize: active ? 17 : 15,
                    fontWeight: active ? 600 : 500,
                    color: active ? '#fff' : done ? 'rgba(255,255,255,0.7)' : 'rgba(255,255,255,0.4)',
                    whiteSpace: 'nowrap',
                  }}>{s.label}</span>
                </motion.div>

                {i < STEPS.length - 1 && (
                  <div style={{
                    width: 'clamp(16px, 4vw, 32px)', height: 2, margin: '0 4px',
                    background: done ? 'linear-gradient(90deg, #4f8ef7, #7b61ff)' : 'rgba(255,255,255,0.1)',
                    borderRadius: 1, transition: 'background 0.4s ease', flexShrink: 0,
                  }} />
                )}
              </div>
            )
          })}
        </div>

        {/* ── CHANGE 2: Glass card — height-constrained, overflow hidden ── */}
        <div style={{
          width: '100%', maxWidth: 600, zIndex: 1, position: 'relative',
          background: 'rgba(255,255,255,0.04)',
          backdropFilter: 'blur(24px) saturate(170%)',
          WebkitBackdropFilter: 'blur(24px) saturate(170%)',
          border: '1px solid rgba(255,255,255,0.12)',
          borderRadius: 24,
          // padding removed from here — lives in children now
          boxShadow: '0 18px 45px rgba(0,0,0,0.55)',
          maxHeight: 'calc(100vh - 180px)',   // ← NEW: cap to viewport height
          overflow: 'hidden',                 // ← NEW: clip, children scroll
          // minHeight: 420 removed
          display: 'flex', flexDirection: 'column',
          boxSizing: 'border-box',
        }}>

          {/* Inner Highlight — unchanged */}
          <div style={{
            position: 'absolute', top: 0, left: 0, right: 0, height: 1,
            background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)'
          }} />

          {/* ── Scrollable step content ── */}
          <div style={{
            flex: 1,
            overflowY: 'auto',
            padding: 'clamp(24px, 5vw, 36px)',   // padding moved here from card
            paddingBottom: 16,
            scrollbarWidth: 'none',
            msOverflowStyle: 'none',
          }}>
            <AnimatePresence mode="wait" custom={direction}>
              <motion.div
                key={step} custom={direction} variants={slideVariants}
                initial="enter" animate="center" exit="exit"
                transition={{ duration: 0.2, ease: "easeOut" }}
                style={{ display: 'flex', flexDirection: 'column' }}
              >

                {/* STEP 1: Dates */}
                {step === 1 && (
                  <div>
                    <StepHeader icon={<Calendar size={20} color="#7b61ff" />} title="When are you travelling?" sub="Select your start and end dates." />
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 16, marginTop: 24 }}>
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16 }}>
                        <div>
                          <label style={labelSt}>Start Date</label>
                          <DatePicker
                            selected={data.start_date}
                            onChange={d => {
                              update('start_date', d)
                              if (data.end_date && d > data.end_date) update('end_date', null)
                            }}
                            minDate={new Date()}
                            placeholderText="Select start date"
                            className="glass-input"
                            wrapperClassName="date-picker-wrapper"
                          />
                        </div>
                        <div>
                          <label style={labelSt}>End Date</label>
                          <DatePicker
                            selected={data.end_date}
                            onChange={d => update('end_date', d)}
                            minDate={data.start_date || new Date()}
                            placeholderText="Select end date"
                            disabled={!data.start_date}
                            className="glass-input"
                            wrapperClassName="date-picker-wrapper"
                          />
                        </div>
                      </div>
                      {days > 0 && days <= 14 && (
                        <motion.div initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} style={{
                          marginTop: 8, fontSize: 15, color: 'rgba(255,255,255,0.6)', fontFamily: "'Inter', sans-serif"
                        }}>
                          Planning a <strong style={{ color: '#fff' }}>{days} day</strong> trip.
                        </motion.div>
                      )}
                      {days > 14 && (
                        <motion.div initial={{ opacity: 0, y: 5 }} animate={{ opacity: 1, y: 0 }} style={{
                          marginTop: 8, fontSize: 15, color: '#f87171', fontFamily: "'Inter', sans-serif",
                          background: 'rgba(248,113,113,0.08)', border: '1px solid rgba(248,113,113,0.25)',
                          borderRadius: 10, padding: '10px 14px',
                        }}>
                          ⚠️ Maximum <strong style={{ color: '#fff' }}>14 days</strong> allowed. Please shorten your trip.
                        </motion.div>
                      )}
                    </div>
                  </div>
                )}

                {/* STEP 2: Budget */}
                {step === 2 && (
                  <div>
                    <StepHeader icon={<DollarSign size={20} color="#4f8ef7" />} title="What's your budget?" sub="Choose your comfort level." />
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 12, marginTop: 24 }}>
                      {[
                        { id: 'low', label: 'Budget', desc: 'Hostels, street food, public transit' },
                        { id: 'mid', label: 'Mid-range', desc: 'Standard hotels, restaurants, cabs' },
                        { id: 'high', label: 'Luxury', desc: 'Resorts, fine dining, private drivers' },
                      ].map(b => (
                        <motion.div key={b.id} whileHover={{ scale: 1.01 }} whileTap={{ scale: 0.98 }} onClick={() => update('budget_tier', b.id)} style={{
                          padding: '16px 20px', borderRadius: 16, cursor: 'pointer', transition: 'all 0.2s',
                          background: data.budget_tier === b.id ? 'linear-gradient(135deg, rgba(123,97,255,0.2), rgba(79,142,247,0.2))' : 'rgba(255,255,255,0.04)',
                          border: data.budget_tier === b.id ? '1px solid rgba(123,97,255,0.5)' : '1px solid rgba(255,255,255,0.08)',
                          boxShadow: data.budget_tier === b.id ? '0 8px 20px rgba(123,97,255,0.15)' : 'none',
                        }}>
                          <div style={{
                            fontFamily: "'Inter', sans-serif", fontSize: 17, fontWeight: 600,
                            color: data.budget_tier === b.id ? '#fff' : 'rgba(255,255,255,0.8)',
                          }}>{b.label}</div>
                          <div style={{
                            fontFamily: "'Inter', sans-serif", fontSize: 15, color: 'rgba(255,255,255,0.45)', marginTop: 4,
                          }}>{b.desc}</div>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                )}

                {/* STEP 3: Vibe */}
                {step === 3 && (
                  <div>
                    <StepHeader icon={<Sparkles size={20} color="#f472b6" />} title="What's the vibe?" sub="Pick the main mood for your trip." />
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginTop: 24 }}>
                      {[
                        { id: 'relax', label: 'Chill & Relax' },
                        { id: 'adventure', label: 'Adventure' },
                        { id: 'culture', label: 'Culture & History' },
                        { id: 'mixed', label: 'A bit of everything' },
                      ].map(v => (
                        <motion.div key={v.id} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={() => update('vibe', v.id)} style={{
                          padding: '18px 16px', borderRadius: 16, cursor: 'pointer', textAlign: 'center', transition: 'all 0.2s',
                          background: data.vibe === v.id ? 'linear-gradient(135deg, rgba(244,114,182,0.2), rgba(123,97,255,0.2))' : 'rgba(255,255,255,0.04)',
                          border: data.vibe === v.id ? '1px solid rgba(244,114,182,0.5)' : '1px solid rgba(255,255,255,0.08)',
                          boxShadow: data.vibe === v.id ? '0 8px 20px rgba(244,114,182,0.15)' : 'none',
                        }}>
                          <div style={{
                            fontFamily: "'Inter', sans-serif", fontSize: 16, fontWeight: 600,
                            color: data.vibe === v.id ? '#fff' : 'rgba(255,255,255,0.8)',
                          }}>{v.label}</div>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                )}

                {/* STEP 4: Origin */}
                {step === 4 && (
                  <div>
                    <StepHeader icon={<MapPin size={20} color="#2dd4bf" />} title="Where are you leaving from?" sub="We need this to suggest travel routes." />
                    <div style={{ marginTop: 24 }}>
                      <input
                        placeholder="Search your origin city..."
                        value={citySearch}
                        onChange={e => { setCitySearch(e.target.value); update('origin', '') }}
                        style={{
                          width: '100%',
                          padding: '12px 16px',
                          background: 'rgba(255, 255, 255, 0.06)',
                          border: '1px solid rgba(255, 255, 255, 0.15)',
                          borderRadius: '12px',
                          color: '#fff',
                          fontFamily: "'Inter', sans-serif",
                          fontSize: '16px',
                          outline: 'none',
                          boxSizing: 'border-box',
                        }}
                      />
                      <div style={{ maxHeight: 180, overflowY: 'auto', display: 'flex', flexWrap: 'wrap', gap: 8, marginTop: 16 }}>
                        {filteredCities.slice(0, 15).map(city => (
                          <span key={city} onClick={() => { update('origin', city); setCitySearch(city) }} style={{
                            padding: '8px 16px', borderRadius: 999, fontFamily: "'Inter', sans-serif", fontSize: 15, fontWeight: 500,
                            background: data.origin === city ? 'rgba(45,212,191,0.2)' : 'rgba(255,255,255,0.04)',
                            border: data.origin === city ? '1px solid rgba(45,212,191,0.5)' : '1px solid rgba(255,255,255,0.1)',
                            color: data.origin === city ? '#2dd4bf' : 'rgba(255,255,255,0.6)',
                            cursor: 'pointer', transition: 'all 0.2s',
                          }}>
                            {city}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* STEP 5: Meal */}
                {step === 5 && (
                  <div>
                    <StepHeader icon={<Utensils size={20} color="#fbbf24" />} title="Food preferences?" sub="We'll tailor restaurant suggestions." />
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginTop: 24 }}>
                      {[
                        { id: 'veg', label: 'Vegetarian', desc: 'Pure veg options' },
                        { id: 'non-veg', label: 'Non-Vegetarian', desc: 'All cuisines' },
                      ].map(m => (
                        <motion.div key={m.id} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={() => update('meal_pref', m.id)} style={{
                          padding: '24px 16px', borderRadius: 16, cursor: 'pointer', textAlign: 'center', transition: 'all 0.2s',
                          background: data.meal_pref === m.id ? 'linear-gradient(135deg, rgba(251,191,36,0.15), rgba(245,158,11,0.15))' : 'rgba(255,255,255,0.04)',
                          border: data.meal_pref === m.id ? '1px solid rgba(251,191,36,0.5)' : '1px solid rgba(255,255,255,0.08)',
                        }}>
                          <div style={{ fontFamily: "'Inter', sans-serif", fontSize: 17, fontWeight: 600, color: data.meal_pref === m.id ? '#fff' : 'rgba(255,255,255,0.8)' }}>{m.label}</div>
                          <div style={{ fontFamily: "'Inter', sans-serif", fontSize: 15, color: 'rgba(255,255,255,0.45)', marginTop: 4 }}>{m.desc}</div>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                )}

                {/* STEP 6: Group */}
                {step === 6 && (
                  <div>
                    <StepHeader icon={<Users size={20} color="#a855f7" />} title="Who's travelling?" sub="Helps us suggest the right activities." />
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginTop: 24 }}>
                      {[
                        { id: 'solo', label: 'Solo' },
                        { id: 'couple', label: 'Couple' },
                        { id: 'friends', label: 'Friends' },
                        { id: 'family', label: 'Family' },
                      ].map(g => (
                        <motion.div key={g.id} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }} onClick={() => update('group_type', g.id)} style={{
                          padding: '18px 16px', borderRadius: 16, cursor: 'pointer', textAlign: 'center', transition: 'all 0.2s',
                          background: data.group_type === g.id ? 'linear-gradient(135deg, rgba(168,85,247,0.2), rgba(123,97,255,0.2))' : 'rgba(255,255,255,0.04)',
                          border: data.group_type === g.id ? '1px solid rgba(168,85,247,0.5)' : '1px solid rgba(255,255,255,0.08)',
                        }}>
                          <div style={{ fontFamily: "'Inter', sans-serif", fontSize: 17, fontWeight: 600, color: data.group_type === g.id ? '#fff' : 'rgba(255,255,255,0.8)' }}>{g.label}</div>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                )}

                {/* STEP 7: Summary */}
                {step === 7 && (
                  <div>
                    <StepHeader icon={<Check size={20} color="#4ade80" />} title="Trip Summary" sub="Ready for takeoff? Review your choices." />
                    <div style={{ marginTop: 24, display: 'flex', flexDirection: 'column', gap: 8 }}>
                      {[
                        { label: 'Destination', value: data.destination || '—' },
                        { label: 'Dates', value: data.start_date && data.end_date ? `${data.start_date.toLocaleDateString()} to ${data.end_date.toLocaleDateString()}` : '—' },
                        { label: 'Budget', value: data.budget_tier || '—' },
                        { label: 'Vibe', value: data.vibe || '—' },
                        { label: 'Origin', value: data.origin || '—' },
                        { label: 'Food', value: data.meal_pref || '—' },
                        { label: 'Group', value: data.group_type || '—' },
                      ].map(row => (
                        <div key={row.label} style={{
                          display: 'flex', justifyContent: 'space-between', padding: '13px 16px',
                          background: 'rgba(255,255,255,0.02)', borderRadius: 10, border: '1px solid rgba(255,255,255,0.05)'
                        }}>
                          <span style={{ fontFamily: "'Inter', sans-serif", fontSize: 15, color: 'rgba(255,255,255,0.5)' }}>{row.label}</span>
                          <span style={{ fontFamily: "'Inter', sans-serif", fontSize: 15, fontWeight: 600, color: '#fff', textTransform: 'capitalize' }}>{row.value}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

              </motion.div>
            </AnimatePresence>
          </div>
          {/* ── END scrollable content ── */}

          {/* ── Sticky footer with buttons — always visible ── */}
          <div style={{
            flexShrink: 0,                                            // never shrinks — always visible
            display: 'flex',
            justifyContent: step === 1 ? 'flex-end' : 'space-between',
            alignItems: 'center',
            gap: 12,
            padding: 'clamp(14px, 2.5vw, 20px) clamp(24px, 5vw, 36px)',
            borderTop: '1px solid rgba(255,255,255,0.07)',
            background: 'rgba(8,12,26,0.5)',
            borderRadius: '0 0 24px 24px',
          }}>

            {/* Back button */}
            {step > 1 && (
              <motion.button
                whileHover={{ backgroundColor: 'rgba(255,255,255,0.1)' }}
                whileTap={{ scale: 0.97 }}
                onClick={() => paginate(step - 1)}
                style={{
                  display: 'flex', alignItems: 'center', gap: 6,
                  padding: '12px 20px', borderRadius: 999,
                  background: 'transparent', border: '1px solid rgba(255,255,255,0.2)',
                  color: 'rgba(255,255,255,0.9)', fontFamily: "'Inter', sans-serif",
                  fontSize: 15, fontWeight: 500, cursor: 'pointer', transition: 'all 0.2s',
                }}>
                <ArrowLeft size={16} /> Back
              </motion.button>
            )}

            {/* Next button (steps 1–6) */}
            {step < 7 && (
              <motion.button
                whileHover={canNext() ? { y: -1, boxShadow: '0 8px 20px rgba(123,97,255,0.3)' } : {}}
                whileTap={canNext() ? { scale: 0.98 } : {}}
                onClick={() => canNext() && paginate(step + 1)}
                style={{
                  display: 'flex', alignItems: 'center', gap: 6,
                  padding: '12px 24px', borderRadius: 999,
                  background: canNext() ? 'linear-gradient(90deg, #7b61ff, #4f8ef7)' : 'rgba(255,255,255,0.08)',
                  border: 'none',
                  color: canNext() ? '#fff' : 'rgba(255,255,255,0.3)',
                  fontFamily: "'Inter', sans-serif", fontSize: 15, fontWeight: 600,
                  cursor: canNext() ? 'pointer' : 'not-allowed', transition: 'all 0.2s',
                  boxShadow: canNext() ? 'inset 0 1px 1px rgba(255,255,255,0.2)' : 'none',
                }}>
                Next <ArrowRight size={16} />
              </motion.button>
            )}

            {/* Generate Itinerary button (step 7 only) */}
            {step === 7 && (
              <motion.button
                whileHover={!generating ? { y: -1, boxShadow: '0 8px 24px rgba(123,97,255,0.4)' } : {}}
                onClick={generate}
                disabled={generating}
                style={{
                  display: 'flex', alignItems: 'center', gap: 8,
                  padding: '12px 28px', borderRadius: 999,
                  background: generating ? 'rgba(123,97,255,0.4)' : 'linear-gradient(90deg, #7b61ff, #4f8ef7)',
                  border: 'none', color: '#fff',
                  fontFamily: "'Inter', sans-serif", fontSize: 16, fontWeight: 600,
                  cursor: generating ? 'wait' : 'pointer', transition: 'all 0.2s',
                  boxShadow: 'inset 0 1px 1px rgba(255,255,255,0.3)',
                }}>
                {generating ? <ClipLoader size={16} color="#fff" /> : <><Plane size={16} /> Generate Itinerary</>}
              </motion.button>
            )}

          </div>
          {/* ── END sticky footer ── */}

        </div>
        {/* ── END glass card ── */}

        {/* Global Styles */}
        <style>{`
          .glass-input, .glass-input-field {
            width: 100%;
            padding: 12px 16px;
            background: rgba(255, 255, 255, 0.06);
            border: 1px solid rgba(255, 255, 255, 0.15);
            border-radius: 12px;
            color: #fff;
            font-family: 'Inter', sans-serif;
            font-size: 16px;
            outline: none;
            transition: all 0.2s ease;
            box-sizing: border-box;
          }
          .glass-input::placeholder, .glass-input-field::placeholder {
            color: rgba(255, 255, 255, 0.4);
          }
          .glass-input:focus, .glass-input-field:focus {
            background: rgba(255, 255, 255, 0.08);
            border: 1px solid #7b61ff;
            box-shadow: 0 0 0 3px rgba(123, 97, 255, 0.25);
            transform: scale(1.01);
          }
          .date-picker-wrapper {
            width: 100%;
          }
          .react-datepicker-wrapper {
            width: 100%;
          }
        `}</style>
      </motion.div>
    </>
  )
}



function StepHeader({ icon, title, sub }) {
  return (
    <div style={{ display: 'flex', gap: 16, alignItems: 'center', marginBottom: 8 }}>
      <div style={{
        width: 44, height: 44, borderRadius: '50%',
        background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)',
        display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0
      }}>
        {icon}
      </div>
      <div>
        <h2 style={{ fontFamily: "'Poppins', sans-serif", fontSize: 26, fontWeight: 700, color: '#fff', margin: '0 0 2px 0' }}>
          {title}
        </h2>
        <p style={{ fontFamily: "'Inter', sans-serif", fontSize: 15, color: 'rgba(255,255,255,0.5)', margin: 0 }}>
          {sub}
        </p>
      </div>
    </div>
  )
}



const labelSt = {
  fontFamily: "'Inter', sans-serif", fontSize: 14, fontWeight: 500,
  color: 'rgba(255,255,255,0.5)', marginBottom: 6, display: 'block',
}