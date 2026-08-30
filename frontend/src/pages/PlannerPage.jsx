import { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import api from '../api/axios'
import toast from 'react-hot-toast'
import { toTitleCase, slideVariants } from '../utils/planner'
import { CITIES } from '../constants/planner'
import GeneratingOverlay from '../components/planner/GeneratingOverlay'
import StepProgress from '../components/planner/StepProgress'
import StepContent from '../components/planner/StepContent'
import PlannerBackground from '../components/planner/PlannerBackground'
import PlannerFooter from '../components/planner/PlannerFooter'

export default function PlannerPage() {
  const navigate = useNavigate()
  const location = useLocation()

  const [[step, direction], setPage] = useState([1, 0])
  const [generating, setGenerating] = useState(false)
  const [citySearch, setCitySearch] = useState('')

  const destinationFromDash = location.state?.destination
    ? toTitleCase(location.state.destination)
    : ''

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
        destination: toTitleCase(data.destination || 'Goa'),
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

  return (
    <>
      <AnimatePresence>
        {generating && <GeneratingOverlay destination={data.destination || 'your destination'} />}
      </AnimatePresence>

      <motion.div
        animate={{ opacity: generating ? 0 : 1 }}
        transition={{ duration: 0.4 }}
        style={{
          minHeight: '100vh', width: '100vw',
          background: '#080c1a',
          display: 'flex', flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'flex-start',
          paddingTop: 'clamp(16px, 4vw, 48px)',
          paddingBottom: 'clamp(24px, 4vw, 48px)',
          paddingLeft: 16, paddingRight: 16,
          position: 'relative', overflow: 'hidden',
          boxSizing: 'border-box',
        }}
      >
        <PlannerBackground />

        <StepProgress step={step} paginate={paginate} />

        <div style={{
          width: '100%', maxWidth: 600, zIndex: 1, position: 'relative',
          background: 'rgba(255,255,255,0.04)',
          backdropFilter: 'blur(24px) saturate(170%)',
          WebkitBackdropFilter: 'blur(24px) saturate(170%)',
          border: '1px solid rgba(255,255,255,0.12)',
          borderRadius: 24,
          boxShadow: '0 18px 45px rgba(0,0,0,0.55)',
          maxHeight: 'calc(100vh - 180px)',
          overflow: 'visible',
          display: 'flex', flexDirection: 'column',
          boxSizing: 'border-box',
        }}>
          <div style={{
            position: 'absolute', top: 0, left: 0, right: 0, height: 1,
            background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent)'
          }} />

          <div style={{
            flex: 1,
            overflowY: 'auto',
            padding: 'clamp(24px, 5vw, 36px)',
            paddingBottom: 16,
            scrollbarWidth: 'none',
            msOverflowStyle: 'none',
          }}>
            <AnimatePresence mode="wait" custom={direction}>
              <motion.div
                key={step} custom={direction} variants={slideVariants}
                initial="enter" animate="center" exit="exit"
                transition={{ duration: 0.2, ease: 'easeOut' }}
                style={{ display: 'flex', flexDirection: 'column' }}
              >
                <StepContent
                  step={step}
                  data={data}
                  update={update}
                  days={days}
                  citySearch={citySearch}
                  setCitySearch={setCitySearch}
                  filteredCities={filteredCities}
                />
              </motion.div>
            </AnimatePresence>
          </div>

          <PlannerFooter
            step={step}
            generating={generating}
            canNext={canNext}
            paginate={paginate}
            generate={generate}
          />
        </div>

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
          .react-datepicker-popper {
            z-index: 9999 !important;
          }
          .react-datepicker {
            background: #1a1f35 !important;
            border: 1px solid rgba(255,255,255,0.12) !important;
            font-family: 'Inter', sans-serif !important;
          }
          .react-datepicker__header {
            background: rgba(255,255,255,0.05) !important;
            border-bottom: 1px solid rgba(255,255,255,0.08) !important;
          }
          .react-datepicker__current-month,
          .react-datepicker__day-name,
          .react-datepicker__day {
            color: #fff !important;
          }
          .react-datepicker__day:hover {
            background: rgba(123,97,255,0.3) !important;
          }
          .react-datepicker__day--selected {
            background: #7b61ff !important;
          }
          .react-datepicker__day--disabled {
            color: rgba(255,255,255,0.2) !important;
          }
        `}</style>
      </motion.div>
    </>
  )
}
