import { motion } from 'framer-motion'
import DatePicker from 'react-datepicker'
import "react-datepicker/dist/react-datepicker.css"
import { Calendar, DollarSign, Sparkles, MapPin, Utensils, Users, Check } from 'lucide-react'
import { CITIES } from '../../constants/planner'
import { labelSt } from '../../utils/planner'
import StepHeader from './StepHeader'

export default function StepContent({
  step, data, update, days,
  citySearch, setCitySearch, filteredCities
}) {

  if (step === 1) {
    return (
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
                popperPlacement="bottom-start"
                popperProps={{ strategy: 'fixed' }}
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
                popperPlacement="bottom-start"
                popperProps={{ strategy: 'fixed' }}
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
    )
  }

  if (step === 2) {
    return (
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
    )
  }

  if (step === 3) {
    return (
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
    )
  }

  if (step === 4) {
    return (
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
    )
  }

  if (step === 5) {
    return (
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
    )
  }

  if (step === 6) {
    return (
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
    )
  }

  if (step === 7) {
    return (
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
    )
  }

  return null
}
