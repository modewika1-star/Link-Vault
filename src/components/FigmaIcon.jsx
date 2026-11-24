import { useEffect, useState } from 'react'

export default function FigmaIcon({ name, fallback, className = '' }) {
  const [failed, setFailed] = useState(false)

  useEffect(() => {
    setFailed(false)
  }, [name])

  if (failed) return fallback

  return (
    <img
      className={className}
      src={`/assets/figma/${name}.svg`}
      alt=""
      aria-hidden="true"
      loading="eager"
      onError={() => setFailed(true)}
    />
  )
}
