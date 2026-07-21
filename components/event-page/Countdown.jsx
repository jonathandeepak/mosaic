'use client'

import { useEffect, useState } from 'react'

const pad = (n) => String(n).padStart(2, '0')

/**
 * Live days/hours/minutes countdown to `target` (an ISO date string).
 * Renders nothing until mounted (avoids SSR/CSR hydration mismatch) or when
 * the target is missing/past.
 */
export function Countdown({ target, labels, className }) {
  const [now, setNow] = useState(null)

  useEffect(() => {
    setNow(Date.now())
    const id = setInterval(() => setNow(Date.now()), 30000)
    return () => clearInterval(id)
  }, [])

  const targetMs = target ? Date.parse(target) : NaN
  if (now == null || Number.isNaN(targetMs) || targetMs <= now) return null

  const diff = targetMs - now
  const days = Math.floor(diff / 86400000)
  const hours = Math.floor((diff % 86400000) / 3600000)
  const mins = Math.floor((diff % 3600000) / 60000)

  const parts = [
    { v: days, label: labels.days },
    { v: pad(hours), label: labels.hours },
    { v: pad(mins), label: labels.min },
  ]

  return (
    <div className={className}>
      {parts.map((p, i) => (
        <div key={i}>
          <strong>{p.v}</strong>
          <span>{p.label}</span>
        </div>
      ))}
    </div>
  )
}
