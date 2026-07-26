export const toTitleCase = (str) =>
  str
    .split(' ')
    .map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
    .join(' ')

export const slideVariants = {
  enter: (direction) => ({ x: direction > 0 ? 12 : -12, opacity: 0 }),
  center: { x: 0, opacity: 1 },
  exit: (direction) => ({ x: direction < 0 ? 12 : -12, opacity: 0 }),
}

export const labelSt = {
  fontFamily: "'Inter', sans-serif",
  fontSize: 14,
  fontWeight: 500,
  color: 'rgba(255,255,255,0.5)',
  marginBottom: 6,
  display: 'block',
}
