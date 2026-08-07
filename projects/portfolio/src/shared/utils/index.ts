export function joinWith(
  items: string[],
  separator: string = ' & ',
): string {
  return items.filter(Boolean).join(separator)
}

export function scrollToHash(hash: string, offset = 88) {
  if (typeof document === 'undefined') return
  const el = document.getElementById(hash)
  if (!el) return
  const top = el.getBoundingClientRect().top + window.scrollY - offset
  window.scrollTo({ top, behavior: 'smooth' })
}
