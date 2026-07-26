import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import api from '../api/axios'
import toast from 'react-hot-toast'
import BackgroundOrbs from '../components/itinerary/BackgroundOrbs'
import LoadingScreen from '../components/itinerary/LoadingScreen'
import ItineraryNavbar from '../components/itinerary/ItineraryNavbar'
import ItineraryHero from '../components/itinerary/ItineraryHero'
import DayCard from '../components/itinerary/DayCard'
import CostBreakdown from '../components/itinerary/CostBreakdown'
import SuccessBanner from '../components/itinerary/SuccessBanner'


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
                days: prev.days.map(d => d.day_number === dayNumber ? res.data.day : d),
                summary: res.data.summary ?? prev.summary
            }))
            setShowSuccessBanner(dayNumber)
            setTimeout(() => setShowSuccessBanner(false), 4000)
        } catch {
            toast.error('Failed to regenerate day')
        } finally {
            setRegenDayId(null)
        }
    }



    if (loading) return <LoadingScreen />

    if (!itinerary) return null

    const days = itinerary.days || []
    const summary = itinerary.summary || {}
    const trip = itinerary.trip


    return (
        <div style={{
            minHeight: '100vh',
            background: 'linear-gradient(135deg, #050508 0%, #0d0d1a 50%, #050508 100%)',
        }}>

            <BackgroundOrbs />

            <ItineraryNavbar
                trip={trip}
                itinerary={itinerary}
                onBack={() => navigate('/')}
                onHistory={() => navigate('/history')}
            />

            <div style={{ maxWidth: 860, margin: '0 auto', padding: 'clamp(24px, 5vw, 44px) clamp(14px, 3vw, 24px) 80px', position: 'relative', zIndex: 1 }}>

                <ItineraryHero trip={trip} days={days} summary={summary} />

                {days.map((day, index) => (
                    <DayCard
                        key={day.day_number}
                        day={day}
                        index={index}
                        regenDayId={regenDayId}
                        onRegenerate={regenDay}
                    />
                ))}

                {summary && (
                    <CostBreakdown summary={summary} delay={days.length * 0.08 + 0.2} />
                )}

            </div>

            <SuccessBanner dayNumber={showSuccessBanner} />

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
