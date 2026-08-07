import type { ReactNode } from 'react'
import { useEffect } from 'react'
import { useSuspenseQuery } from '@tanstack/react-query'
import { bookingDetailQueryOptions } from '@/shared/services/apis/apis'
import { useUiStore, type BookingDetailTabId } from '@/shared/stores/ui.store'
import { BookingDetailHeader } from './BookingDetailHeader'
import { BookingDetailTabs } from './BookingDetailTabs'
import { BookingReadOnlyBanner } from './BookingReadOnlyBanner'

export function BookingDetailShell({
  bookingId,
  active,
  children,
}: {
  bookingId: string
  active: BookingDetailTabId
  children: ReactNode
}) {
  const { data } = useSuspenseQuery(bookingDetailQueryOptions(bookingId))
  const setSelectedTab = useUiStore((s) => s.setSelectedTab)

  useEffect(() => {
    setSelectedTab(active)
  }, [active, setSelectedTab])

  return (
    <div className="space-y-4">
      <BookingDetailHeader booking={data} />
      <BookingReadOnlyBanner status={data.status} />
      <BookingDetailTabs bookingId={bookingId} active={active} />
      {children}
    </div>
  )
}
