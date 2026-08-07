function Field({
  label,
  value,
}: {
  label: string
  value: string | number | null | undefined
}) {
  return (
    <div className="space-y-1">
      <dt className="text-xs uppercase tracking-wide text-slate-500">{label}</dt>
      <dd className="text-sm text-slate-100">{value == null || value === '' ? '—' : value}</dd>
    </div>
  )
}

export function CustomerFieldGrid({
  items,
}: {
  items: Array<{ label: string; value: string | number | null | undefined }>
}) {
  return (
    <dl className="grid gap-4 sm:grid-cols-2">
      {items.map((item) => (
        <Field key={item.label} label={item.label} value={item.value} />
      ))}
    </dl>
  )
}
