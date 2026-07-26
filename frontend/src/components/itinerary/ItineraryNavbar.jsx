import { ArrowLeft, Download } from 'lucide-react'
import { ClipLoader } from 'react-spinners'
import { PDFDownloadLink } from '@react-pdf/renderer'
import ItineraryPDF from './ItineraryPDF'

export default function ItineraryNavbar({ trip, itinerary, onBack, onHistory }) {
    return (
        <div style={{
            position: 'sticky', top: 0, zIndex: 50,
            padding: 'clamp(10px, 2vw, 16px) clamp(14px, 3vw, 32px)',
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            flexWrap: 'wrap', gap: 10,
            background: 'rgba(5,5,8,0.88)',
            backdropFilter: 'blur(24px)', WebkitBackdropFilter: 'blur(24px)',
            borderBottom: '1px solid rgba(255,255,255,0.07)',
        }}>
            <button onClick={onBack} style={{
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
                    {trip?.start_date} · {itinerary?.days?.length || 0} days · {trip?.group_type} · {trip?.budget_tier}
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

                <button onClick={onHistory} style={{
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
    )
}
