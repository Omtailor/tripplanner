import { Document, Page, Text, View, StyleSheet } from '@react-pdf/renderer'

const styles = StyleSheet.create({
  page: {
    padding: '40px 44px',
    fontFamily: 'Helvetica',
    fontSize: 10,
    color: '#1a1a1a',
    lineHeight: 1.4,
  },

  // ── Header ──
  header: {
    marginBottom: 24,
    paddingBottom: 16,
    borderBottomWidth: 2,
    borderBottomColor: '#4f8ef7',
    borderBottomStyle: 'solid',
  },
  title: {
    fontSize: 22,
    fontFamily: 'Helvetica-Bold',
    color: '#4f8ef7',
    marginBottom: 6,
  },
  subtitle: {
    fontSize: 11,
    color: '#555',
    marginBottom: 12,
  },
  infoGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  infoItem: {
    width: '48%',
    padding: 8,
    backgroundColor: '#f0f4ff',
    borderRadius: 4,
    marginBottom: 4,
  },
  infoLabel: {
    fontSize: 7,
    color: '#888',
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    marginBottom: 3,
  },
  infoValue: {
    fontSize: 11,
    fontFamily: 'Helvetica-Bold',
    color: '#222',
  },

  // ── Day Card ──
  dayCard: {
    marginTop: 16,
    padding: 16,
    backgroundColor: '#fafafa',
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#4f8ef7',
    borderLeftStyle: 'solid',
  },
  dayHeader: {
    marginBottom: 10,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#e0e0e0',
    borderBottomStyle: 'solid',
  },
  dayTitle: {
    fontSize: 14,
    fontFamily: 'Helvetica-Bold',
    color: '#222',
    marginBottom: 3,
  },
  dayTheme: {
    fontSize: 10,
    color: '#666',
  },
  dayMeta: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginBottom: 12,
    marginTop: 6,
  },
  metaChip: {
    paddingVertical: 3,
    paddingHorizontal: 8,
    backgroundColor: '#e8eeff',
    borderRadius: 4,
  },
  metaChipText: {
    fontSize: 8,
    color: '#4f8ef7',
    fontFamily: 'Helvetica-Bold',
  },

  // ── Section Label ──
  sectionLabel: {
    fontSize: 8,
    fontFamily: 'Helvetica-Bold',
    color: '#888',
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    marginBottom: 8,
    marginTop: 14,
  },

  // ── Activity ──
  activityBlock: {
    marginBottom: 12,
    paddingLeft: 10,
    paddingBottom: 10,
    borderLeftWidth: 2,
    borderLeftColor: '#c7d8ff',
    borderLeftStyle: 'solid',
  },
  activityTimeRow: {
    marginBottom: 3,
  },
  activityTime: {
    fontSize: 9,
    fontFamily: 'Helvetica-Bold',
    color: '#4f8ef7',
  },
  activityName: {
    fontSize: 11,
    fontFamily: 'Helvetica-Bold',
    color: '#222',
    marginBottom: 4,
  },
  activityDesc: {
    fontSize: 9,
    color: '#555',
    lineHeight: 1.6,
    marginBottom: 5,
  },
  activityLocation: {
    fontSize: 8,
    color: '#888',
    marginBottom: 3,
  },
  activityCostRow: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 2,
  },
  activityCost: {
    fontSize: 9,
    fontFamily: 'Helvetica-Bold',
    color: '#10b981',
  },
  activityDuration: {
    fontSize: 9,
    color: '#999',
  },

  // ── Meals ──
  mealsBox: {
    backgroundColor: '#fff',
    borderRadius: 6,
    padding: 10,
    borderWidth: 1,
    borderColor: '#eee',
    borderStyle: 'solid',
  },
  mealRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 7,
  },
  mealLabel: {
    fontSize: 9,
    fontFamily: 'Helvetica-Bold',
    color: '#666',
    width: 72,
    flexShrink: 0,
  },
  mealValue: {
    fontSize: 9,
    color: '#333',
    flex: 1,
    lineHeight: 1.5,
  },

  // ── Accommodation ──
  accommodationBox: {
    marginTop: 10,
    padding: 10,
    backgroundColor: '#fffbeb',
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#fde68a',
    borderStyle: 'solid',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  accommodationName: {
    fontSize: 10,
    fontFamily: 'Helvetica-Bold',
    color: '#333',
    flex: 1,
    marginRight: 8,
  },
  accommodationCost: {
    fontSize: 10,
    fontFamily: 'Helvetica-Bold',
    color: '#d97706',
  },

  // ── Transport ──
  transportRow: {
    marginTop: 8,
    padding: '6px 10px',
    backgroundColor: '#f1f5f9',
    borderRadius: 4,
  },
  transportText: {
    fontSize: 8,
    color: '#64748b',
  },

  // ── Day Total ──
  dayTotal: {
    marginTop: 10,
    padding: 10,
    backgroundColor: '#e0f2fe',
    borderRadius: 6,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  dayTotalLabel: {
    fontSize: 10,
    fontFamily: 'Helvetica-Bold',
    color: '#0369a1',
  },
  dayTotalValue: {
    fontSize: 13,
    fontFamily: 'Helvetica-Bold',
    color: '#0369a1',
  },

  // ── Summary Page ──
  summaryCard: {
    padding: 20,
    backgroundColor: '#f0f9ff',
    borderRadius: 8,
  },
  summaryTitle: {
    fontSize: 16,
    fontFamily: 'Helvetica-Bold',
    color: '#0369a1',
    marginBottom: 16,
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 9,
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
    borderBottomStyle: 'solid',
  },
  summaryLabel: {
    fontSize: 10,
    color: '#555',
  },
  summaryValue: {
    fontSize: 10,
    fontFamily: 'Helvetica-Bold',
    color: '#222',
  },
  grandTotalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 14,
    padding: 12,
    backgroundColor: '#dbeafe',
    borderRadius: 6,
  },
  grandTotalLabel: {
    fontSize: 13,
    fontFamily: 'Helvetica-Bold',
    color: '#1e40af',
  },
  grandTotalValue: {
    fontSize: 16,
    fontFamily: 'Helvetica-Bold',
    color: '#1e40af',
  },

  // ── Travel Tips ──
  tipsCard: {
    marginTop: 20,
    padding: 16,
    backgroundColor: '#f0fdf4',
    borderRadius: 8,
  },
  tipsTitle: {
    fontSize: 12,
    fontFamily: 'Helvetica-Bold',
    color: '#15803d',
    marginBottom: 10,
  },
  tipRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 7,
  },
  tipBullet: {
    fontSize: 10,
    color: '#15803d',
    marginRight: 6,
    marginTop: 1,
  },
  tipText: {
    fontSize: 9,
    color: '#333',
    flex: 1,
    lineHeight: 1.5,
  },

  // ── Footer ──
  footer: {
    position: 'absolute',
    bottom: 24,
    left: 44,
    right: 44,
    textAlign: 'center',
    fontSize: 8,
    color: '#aaa',
    borderTopWidth: 1,
    borderTopColor: '#e0e0e0',
    borderTopStyle: 'solid',
    paddingTop: 8,
  },
})

// No emojis — use plain text labels instead
const DayContent = ({ day }) => (
  <View style={styles.dayCard}>
    {/* Header */}
    <View style={styles.dayHeader}>
      <Text style={styles.dayTitle}>
        Day {day.day_number} — {day.date}
      </Text>
      <Text style={styles.dayTheme}>{day.theme}</Text>
    </View>

    {/* Meta chips */}
    <View style={styles.dayMeta}>
      <View style={styles.metaChip}>
        <Text style={styles.metaChipText}>{day.region_of_day}</Text>
      </View>
      {day.vibes_of_day?.map((vibe, i) => (
        <View key={i} style={styles.metaChip}>
          <Text style={styles.metaChipText}>{vibe.toUpperCase()}</Text>
        </View>
      ))}
    </View>

    {/* Activities */}
    <Text style={styles.sectionLabel}>Activities</Text>
    {day.activities?.map((act, i) => (
      <View key={i} style={styles.activityBlock}>
        <View style={styles.activityTimeRow}>
          <Text style={styles.activityTime}>{act.time}</Text>
        </View>
        <Text style={styles.activityName}>{act.name}</Text>
        <Text style={styles.activityDesc}>{act.description}</Text>
        {act.location ? (
          <Text style={styles.activityLocation}>Location: {act.location}</Text>
        ) : null}
        <View style={styles.activityCostRow}>
          {act.cost_inr > 0 && (
            <Text style={styles.activityCost}>Rs. {act.cost_inr.toLocaleString('en-IN')}</Text>
          )}
          {act.duration_minutes ? (
            <Text style={styles.activityDuration}>{act.duration_minutes} min</Text>
          ) : null}
        </View>
      </View>
    ))}

    {/* Meals */}
    <Text style={styles.sectionLabel}>Meals</Text>
    <View style={styles.mealsBox}>
      <View style={styles.mealRow}>
        <Text style={styles.mealLabel}>Breakfast:</Text>
        <Text style={styles.mealValue}>{day.breakfast || '—'}</Text>
      </View>
      <View style={styles.mealRow}>
        <Text style={styles.mealLabel}>Lunch:</Text>
        <Text style={styles.mealValue}>{day.lunch || '—'}</Text>
      </View>
      <View style={[styles.mealRow, { marginBottom: 0 }]}>
        <Text style={styles.mealLabel}>Dinner:</Text>
        <Text style={styles.mealValue}>{day.dinner || '—'}</Text>
      </View>
    </View>

    {/* Accommodation */}
    <View style={styles.accommodationBox}>
      <Text style={styles.accommodationName}>Stay: {day.accommodation}</Text>
      <Text style={styles.accommodationCost}>
        Rs. {day.accommodation_cost_inr?.toLocaleString('en-IN')}
      </Text>
    </View>

    {/* Transport */}
    {day.local_transport_note ? (
      <View style={styles.transportRow}>
        <Text style={styles.transportText}>Transport: {day.local_transport_note}</Text>
      </View>
    ) : null}

    {/* Day Total */}
    <View style={styles.dayTotal}>
      <Text style={styles.dayTotalLabel}>Day Total</Text>
      <Text style={styles.dayTotalValue}>
        Rs. {day.day_total_cost_inr?.toLocaleString('en-IN')}
      </Text>
    </View>
  </View>
)

const ItineraryPDF = ({ itinerary }) => {
  const { trip, days, summary } = itinerary

  return (
    <Document>
      {/* Page 1 — Header + Day 1 */}
      <Page size="A4" style={styles.page}>
        <View style={styles.header}>
          <Text style={styles.title}>{trip.destination} Trip Itinerary</Text>
          <Text style={styles.subtitle}>
            {new Date(trip.start_date).toLocaleDateString('en-IN', {
              day: 'numeric', month: 'short', year: 'numeric',
            })} to {new Date(trip.end_date).toLocaleDateString('en-IN', {
              day: 'numeric', month: 'short', year: 'numeric',
            })} ({trip.days} days)
          </Text>
          <View style={styles.infoGrid}>
            {[
              { label: 'From', value: trip.origin },
              { label: 'Budget', value: trip.budget_tier.charAt(0).toUpperCase() + trip.budget_tier.slice(1) },
              { label: 'Vibe', value: trip.vibe.charAt(0).toUpperCase() + trip.vibe.slice(1) },
              { label: 'Group', value: trip.group_type.charAt(0).toUpperCase() + trip.group_type.slice(1) },
            ].map(item => (
              <View key={item.label} style={styles.infoItem}>
                <Text style={styles.infoLabel}>{item.label}</Text>
                <Text style={styles.infoValue}>{item.value}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* First day on same page as header */}
        {days[0] && <DayContent day={days[0]} />}

        <Text style={styles.footer} fixed render={({ pageNumber, totalPages }) =>
          `TripPlanner  |  ${trip.origin} to ${trip.destination}  |  Page ${pageNumber} of ${totalPages}`
        } />
      </Page>

      {/* One page per remaining day */}
      {days.slice(1).map((day) => (
        <Page key={day.day_number} size="A4" style={styles.page}>
          <DayContent day={day} />
          <Text style={styles.footer} fixed render={({ pageNumber, totalPages }) =>
            `TripPlanner  |  ${trip.origin} to ${trip.destination}  |  Page ${pageNumber} of ${totalPages}`
          } />
        </Page>
      ))}

      {/* Summary Page */}
      <Page size="A4" style={styles.page}>
        <View style={styles.summaryCard}>
          <Text style={styles.summaryTitle}>Trip Cost Summary</Text>
          {[
            { label: 'Intercity Travel', value: summary.intercity_travel_cost_inr },
            { label: 'Local Transport', value: summary.local_transport_total_inr },
            { label: 'Accommodation', value: summary.accommodation_total_inr },
            { label: 'Food & Dining', value: summary.food_total_inr },
            { label: 'Activities', value: summary.activities_total_inr },
          ].map(row => (
            <View key={row.label} style={styles.summaryRow}>
              <Text style={styles.summaryLabel}>{row.label}</Text>
              <Text style={styles.summaryValue}>
                Rs. {row.value?.toLocaleString('en-IN') || '0'}
              </Text>
            </View>
          ))}
          <View style={styles.grandTotalRow}>
            <Text style={styles.grandTotalLabel}>Grand Total</Text>
            <Text style={styles.grandTotalValue}>
              Rs. {summary.grand_total_inr?.toLocaleString('en-IN')}
            </Text>
          </View>
        </View>

        {summary.travel_tips?.length > 0 && (
          <View style={styles.tipsCard}>
            <Text style={styles.tipsTitle}>Travel Tips</Text>
            {summary.travel_tips.map((tip, i) => (
              <View key={i} style={styles.tipRow}>
                <Text style={styles.tipBullet}>•</Text>
                <Text style={styles.tipText}>{tip}</Text>
              </View>
            ))}
          </View>
        )}

        <Text style={styles.footer} fixed render={({ pageNumber, totalPages }) =>
          `TripPlanner  |  ${trip.origin} to ${trip.destination}  |  Page ${pageNumber} of ${totalPages}`
        } />
      </Page>
    </Document>
  )
}

export default ItineraryPDF
