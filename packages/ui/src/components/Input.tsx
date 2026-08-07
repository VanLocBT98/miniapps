import type { InputHTMLAttributes } from 'react'
import { cn } from '../lib/cn'

export type InputProps = InputHTMLAttributes<HTMLInputElement> & {
  label?: string
  error?: string
}

export function Input({ className, label, error, id, ...props }: InputProps) {
  const inputId = id ?? props.name
  return (
    <label className="flex w-full flex-col gap-1.5 text-sm text-slate-200">
      {label ? <span className="font-medium">{label}</span> : null}
      <input
        id={inputId}
        className={cn(
          'h-10 rounded-md border border-slate-700 bg-slate-950 px-3 text-slate-100 placeholder:text-slate-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500',
          error && 'border-rose-500',
          className,
        )}
        aria-invalid={Boolean(error)}
        aria-describedby={error && inputId ? `${inputId}-error` : undefined}
        {...props}
      />
      {error ? (
        <span id={inputId ? `${inputId}-error` : undefined} className="text-xs text-rose-400">
          {error}
        </span>
      ) : null}
    </label>
  )
}
