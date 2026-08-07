import { useSuspenseQuery } from '@tanstack/react-query'
import {
  CustomerBankSection,
  CustomerContactSection,
  CustomerDetailHeader,
  CustomerDetailSummary,
  CustomerGeneralSection,
  CustomerInternalSection,
  CustomerTravelSection,
} from '@/features/customer-detail'
import { customerDetailQueryOptions } from '@/shared/services/apis/apis'

export default function CustomerDetailPage({
  customerId,
}: {
  customerId: string
}) {
  const { data: customer } = useSuspenseQuery(
    customerDetailQueryOptions(customerId),
  )

  return (
    <div className="space-y-4">
      <CustomerDetailHeader customer={customer} />
      <CustomerDetailSummary customer={customer} />
      <CustomerGeneralSection customer={customer} />
      <CustomerTravelSection customer={customer} />
      <CustomerContactSection customer={customer} />
      <CustomerBankSection customer={customer} />
      <CustomerInternalSection customer={customer} />
    </div>
  )
}
