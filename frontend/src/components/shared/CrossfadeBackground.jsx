import { useEffect } from 'react'

export default function CrossfadeBackground({ images, currentIndex }) {
  useEffect(() => {
    images.forEach(src => { const img = new Image(); img.src = src })
  }, [images])

  return (
    <>
      {images.map((img, i) => (
        <div key={i} style={{
          position: 'absolute', inset: 0,
          backgroundImage: `url(${img})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          opacity: i === currentIndex ? 1 : 0,
          transition: 'opacity 1.4s cubic-bezier(0.4, 0, 0.2, 1)',
          zIndex: i === currentIndex ? 1 : 0,
        }} />
      ))}
      <div style={{
        position: 'absolute', inset: 0, zIndex: 2,
        background: `
          linear-gradient(180deg, rgba(0,0,0,0.35) 0%, rgba(0,0,0,0.5) 100%),
          radial-gradient(ellipse at 50% 60%, rgba(79,142,247,0.12) 0%, transparent 65%)
        `,
      }} />
    </>
  )
}
