export default function AuthBackgroundSlider({ images, current }) {
  return (
    <>
      {images.map((img, i) => (
        <div key={i} style={{
          position: 'absolute', inset: 0,
          backgroundImage: `url(${img})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          backgroundRepeat: 'no-repeat',
          opacity: i === current ? 1 : 0,
          transition: 'opacity 1.4s cubic-bezier(0.4, 0, 0.2, 1)',
          zIndex: i === current ? 1 : 0,
        }} />
      ))}
    </>
  )
}
