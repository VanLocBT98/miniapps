import { AnimatePresence, motion } from 'motion/react'
import { useEffect, useState } from 'react'
import { create } from 'zustand'
import { cn } from '../lib/cn'

type ToastItem = {
  id: string
  title: string
  description?: string
  variant?: 'default' | 'success' | 'error'
}

type ToastStore = {
  toasts: ToastItem[]
  push: (toast: Omit<ToastItem, 'id'>) => void
  dismiss: (id: string) => void
}

export const useToastStore = create<ToastStore>((set) => ({
  toasts: [],
  push: (toast) =>
    set((state) => ({
      toasts: [...state.toasts, { ...toast, id: crypto.randomUUID() }],
    })),
  dismiss: (id) => set((state) => ({ toasts: state.toasts.filter((t) => t.id !== id) })),
}))

export function toast(input: Omit<ToastItem, 'id'>) {
  useToastStore.getState().push(input)
}

export function ToastViewport({ className }: { className?: string }) {
  const toasts = useToastStore((s) => s.toasts)
  const dismiss = useToastStore((s) => s.dismiss)

  return (
    <div
      className={cn('pointer-events-none fixed right-4 bottom-4 z-[60] flex w-80 flex-col gap-2', className)}
      aria-live="polite"
    >
      <AnimatePresence>
        {toasts.map((item) => (
          <ToastCard key={item.id} item={item} onDismiss={() => dismiss(item.id)} />
        ))}
      </AnimatePresence>
    </div>
  )
}

function ToastCard({ item, onDismiss }: { item: ToastItem; onDismiss: () => void }) {
  const [hover, setHover] = useState(false)

  useEffect(() => {
    if (hover) return
    const timer = window.setTimeout(onDismiss, 3500)
    return () => window.clearTimeout(timer)
  }, [hover, onDismiss])

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 8 }}
      className={cn(
        'pointer-events-auto rounded-lg border px-4 py-3 shadow-lg',
        item.variant === 'error'
          ? 'border-rose-700 bg-rose-950 text-rose-50'
          : item.variant === 'success'
            ? 'border-emerald-700 bg-emerald-950 text-emerald-50'
            : 'border-slate-700 bg-slate-900 text-slate-50',
      )}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      role="status"
    >
      <p className="text-sm font-medium">{item.title}</p>
      {item.description ? <p className="mt-1 text-xs opacity-80">{item.description}</p> : null}
    </motion.div>
  )
}
