import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import api from '../api/axios'
import toast from 'react-hot-toast'
import { ClipLoader } from 'react-spinners'
import DeleteConfirmDialog from '../components/history/DeleteConfirmDialog'
import HistoryHeader from '../components/history/HistoryHeader'
import HistoryEmptyState from '../components/history/HistoryEmptyState'
import HistoryTripCard from '../components/history/HistoryTripCard'
import { toTitleCase } from '../utils/planner'

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
          <DeleteConfirmDialog
            destination={toTitleCase(trips.find(t => t.id === confirmId)?.trip?.destination)}
            onConfirm={() => handleDelete(confirmId)}
            onCancel={() => setConfirmId(null)}
          />
        )}
      </AnimatePresence>

      <HistoryHeader
        tripCount={trips.length}
        onBack={() => navigate('/')}
        onNewTrip={() => navigate('/')}
      />

      <div style={{
        maxWidth: 1100, margin: '0 auto',
        padding: '0 24px 100px',
        position: 'relative', zIndex: 1,
      }}>
        {trips.length === 0 ? (
          <HistoryEmptyState onPlanTrip={() => navigate('/')} />
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            <AnimatePresence>
              {trips.map((item) => (
                <HistoryTripCard
                  key={item.id}
                  item={item}
                  deleting={deleting}
                  onOpen={(itineraryId) => navigate(`/itinerary/${itineraryId}`)}
                  onConfirm={(itineraryId) => setConfirmId(itineraryId)}
                />
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  )
}
