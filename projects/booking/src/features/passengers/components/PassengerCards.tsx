import { PassengerCard } from '@/components/molecules/booking-cards'
import { Button } from '@repo/ui'
import type { Passenger } from '@/shared/types'
import { requiresPassport } from '@/shared/domain'

export function PassengerCards({
  passengers,
  bookingType,
  readOnly,
  onRemove,
}: {
  passengers: Passenger[]
  bookingType: 'domestic' | 'international'
  readOnly: boolean
  onRemove: (id: string) => void
}) {
  const needPassport = requiresPassport(bookingType)

  return (
    <div className="grid gap-3 md:grid-cols-2">
      {passengers.map((p) => {
        const missingPassport = needPassport && !p.passportNumber?.trim()
        return (
          <PassengerCard
            key={p.id}
            title={`${p.firstName} ${p.lastName}`}
            className={missingPassport ? 'border-rose-800/60' : undefined}
          >
            <p className="text-sm text-slate-300">
              {p.gender} · {p.birthday}
            </p>
            <p
              className={
                missingPassport
                  ? 'mt-1 text-sm text-rose-300'
                  : 'mt-1 text-sm text-slate-400'
              }
            >
              Passport:{' '}
              {p.passportNumber?.trim() ||
                (needPassport ? 'Required' : '—')}
            </p>
            {!readOnly ? (
              <div className="mt-3">
                <Button
                  type="button"
                  size="sm"
                  variant="ghost"
                  className="text-rose-300"
                  onClick={() => onRemove(p.id)}
                >
                  Remove
                </Button>
              </div>
            ) : null}
          </PassengerCard>
        )
      })}
    </div>
  )
}
