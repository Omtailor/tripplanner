// src/api/weatherService.js

const GEO_URL = 'https://geocoding-api.open-meteo.com/v1/search'
const WEATHER_URL = 'https://api.open-meteo.com/v1/forecast'

// WMO weather code → emoji + label
function interpretWeatherCode(code) {
  if (code === 0)               return { emoji: '☀️', label: 'Clear sky' }
  if (code <= 2)                return { emoji: '⛅', label: 'Partly cloudy' }
  if (code === 3)               return { emoji: '☁️', label: 'Overcast' }
  if (code <= 48)               return { emoji: '🌫️', label: 'Foggy' }
  if (code <= 55)               return { emoji: '🌦️', label: 'Drizzle' }
  if (code <= 67)               return { emoji: '🌧️', label: 'Rain' }
  if (code <= 77)               return { emoji: '❄️', label: 'Snow' }
  if (code <= 82)               return { emoji: '🌦️', label: 'Rain showers' }
  if (code <= 86)               return { emoji: '🌨️', label: 'Snow showers' }
  if (code >= 95)               return { emoji: '⛈️', label: 'Thunderstorm' }
  return                               { emoji: '🌡️', label: 'Unknown' }
}

// Step 1: Get lat/lon from destination name
async function getCoordinates(destination) {
  const res = await fetch(`${GEO_URL}?name=${encodeURIComponent(destination)}&count=1&language=en&format=json`)
  const data = await res.json()
  if (!data.results || data.results.length === 0) {
    throw new Error(`Location not found: ${destination}`)
  }
  const { latitude, longitude } = data.results[0]
  return { latitude, longitude }
}

// Step 2: Fetch daily weather between start_date and end_date
export async function fetchTripWeather(destination, startDate, endDate) {
  try {
    const { latitude, longitude } = await getCoordinates(destination)

    const params = new URLSearchParams({
      latitude,
      longitude,
      daily: 'temperature_2m_max,temperature_2m_min,precipitation_sum,weathercode',
      timezone: 'Asia/Kolkata',
      start_date: startDate,   // format: "YYYY-MM-DD"
      end_date: endDate,
    })

    const res = await fetch(`${WEATHER_URL}?${params}`)
    const data = await res.json()

    // Shape the data into a clean per-day array
    return data.daily.time.map((date, i) => ({
      date,
      maxTemp: Math.round(data.daily.temperature_2m_max[i]),
      minTemp: Math.round(data.daily.temperature_2m_min[i]),
      precipitation: data.daily.precipitation_sum[i],
      ...interpretWeatherCode(data.daily.weathercode[i]),
    }))

  } catch (err) {
    console.error('Weather fetch failed:', err)
    return null   // graceful failure — UI handles null
  }
}
