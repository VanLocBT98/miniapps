import { useState } from 'react'
import { Button, Card, cn } from '@repo/ui'
import type { Document } from '@/shared/types'

const TYPE_LABEL: Record<string, string> = {
  itinerary: 'Itinerary',
  'e-ticket': 'E-ticket',
  invoice: 'Invoice',
  receipt: 'Receipt',
  voucher: 'Voucher',
}

function labelFor(type: string) {
  return TYPE_LABEL[type] ?? type
}

/** List + preview panel for booking documents (mock URLs). */
export function DocumentViewer({ documents }: { documents: Document[] }) {
  const [selectedId, setSelectedId] = useState<string | null>(
    documents[0]?.id ?? null,
  )
  const selected =
    documents.find((d) => d.id === selectedId) ?? documents[0] ?? null

  if (documents.length === 0) {
    return (
      <Card title="Documents" description="No documents attached to this booking." />
    )
  }

  return (
    <div className="grid gap-4 lg:grid-cols-[16rem_minmax(0,1fr)]">
      <Card title="Files" description={`${documents.length} document(s)`}>
        <ul className="space-y-1">
          {documents.map((doc) => {
            const active = selected?.id === doc.id
            return (
              <li key={doc.id}>
                <button
                  type="button"
                  className={cn(
                    'w-full rounded-md px-3 py-2 text-left text-sm transition-colors',
                    active
                      ? 'bg-sky-950 text-sky-100'
                      : 'text-slate-300 hover:bg-slate-900',
                  )}
                  onClick={() => setSelectedId(doc.id)}
                >
                  <span className="font-medium">{labelFor(doc.type)}</span>
                  <span className="mt-0.5 block truncate text-xs text-slate-500">
                    {doc.id}
                  </span>
                </button>
              </li>
            )
          })}
        </ul>
      </Card>

      {selected ? (
        <Card
          title={labelFor(selected.type)}
          description="Mock document preview — open URL in a new tab."
        >
          <div className="space-y-4">
            <dl className="grid gap-2 text-sm sm:grid-cols-2">
              <div>
                <dt className="text-xs uppercase tracking-wide text-slate-500">
                  Type
                </dt>
                <dd className="mt-1 text-slate-200">{selected.type}</dd>
              </div>
              <div>
                <dt className="text-xs uppercase tracking-wide text-slate-500">
                  ID
                </dt>
                <dd className="mt-1 font-mono text-xs text-slate-300">
                  {selected.id}
                </dd>
              </div>
              <div className="sm:col-span-2">
                <dt className="text-xs uppercase tracking-wide text-slate-500">
                  URL
                </dt>
                <dd className="mt-1 break-all text-slate-300">{selected.url}</dd>
              </div>
            </dl>

            <div className="flex min-h-[12rem] items-center justify-center rounded-lg border border-dashed border-slate-700 bg-slate-950/60 p-6 text-center">
              <div>
                <p className="text-sm font-medium text-slate-200">
                  {labelFor(selected.type)} preview
                </p>
                <p className="mt-1 max-w-sm text-xs text-slate-500">
                  In production this panel would embed a PDF/viewer. Mock seed
                  links open externally.
                </p>
              </div>
            </div>

            <Button
              type="button"
              size="sm"
              onClick={() =>
                window.open(selected.url, '_blank', 'noopener,noreferrer')
              }
            >
              Open document
            </Button>
          </div>
        </Card>
      ) : null}
    </div>
  )
}
