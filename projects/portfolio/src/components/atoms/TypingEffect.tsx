import { useEffect, useState } from 'react'

export function TypingEffect({
  roles,
  intervalMs = 2200,
}: {
  roles: string[]
  intervalMs?: number
}) {
  const [index, setIndex] = useState(0)
  const [visible, setVisible] = useState(true)

  useEffect(() => {
    if (roles.length <= 1) return
    const id = window.setInterval(() => {
      setVisible(false)
      window.setTimeout(() => {
        setIndex((current) => (current + 1) % roles.length)
        setVisible(true)
      }, 180)
    }, intervalMs)
    return () => window.clearInterval(id)
  }, [roles, intervalMs])

  return (
    <span
      className={`inline-block min-h-[1.15em] text-inherit transition-opacity duration-200 ${
        visible ? 'opacity-100' : 'opacity-0'
      }`}
      aria-live="polite"
    >
      {roles[index]}
    </span>
  )
}
