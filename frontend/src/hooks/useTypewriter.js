import { useState, useEffect } from 'react'

const TYPEWRITER_DESTINATIONS = [
  'Goa with friends...',
  'Manali in winter...',
  'Rajasthan on a budget...',
  'Kerala backwaters...',
  'Ladakh on a bike...',
  'Shimla for snow...',
  'Udaipur with romance...',
  'Gokarna for peace...',
  'Coorg in monsoon...',
  'Bikaner for heritage...',
  'Mussoorie weekend getaway...',
  'Andaman island escape...',
  'Kashmir valley views...',
  'Hampi historical trails...',
  'Munnar tea gardens...',
]

export default function useTypewriter() {
  const [typeText, setTypeText] = useState('')
  const [typeIndex, setTypeIndex] = useState(0)
  const [charIndex, setCharIndex] = useState(0)
  const [deleting, setDeleting] = useState(false)

  useEffect(() => {
    const current_word = TYPEWRITER_DESTINATIONS[typeIndex]
    let timer
    if (!deleting && charIndex <= current_word.length) {
      timer = setTimeout(() => {
        setTypeText(current_word.slice(0, charIndex))
        setCharIndex(c => c + 1)
      }, 70)
    } else if (!deleting && charIndex > current_word.length) {
      timer = setTimeout(() => setDeleting(true), 1800)
    } else if (deleting && charIndex >= 0) {
      timer = setTimeout(() => {
        setTypeText(current_word.slice(0, charIndex))
        setCharIndex(c => c - 1)
      }, 35)
    } else if (deleting && charIndex < 0) {
      setDeleting(false)
      setTypeIndex(i => (i + 1) % TYPEWRITER_DESTINATIONS.length)
      setCharIndex(0)
    }
    return () => clearTimeout(timer)
  }, [charIndex, deleting, typeIndex])

  return typeText
}
