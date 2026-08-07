import { Card } from '@repo/ui'
import { formatDate } from '@repo/shared/utils'
import type { Customer } from '@/shared/types'
import { CustomerFieldGrid } from './CustomerFieldGrid'

export function CustomerDetailSummary({ customer }: { customer: Customer }) {
  return (
    <Card title="Summary" description={`${customer.customerCode} · ${customer.source}`}>
      <dl className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-lg border border-slate-800 bg-slate-950/50 p-3">
          <dt className="text-xs uppercase tracking-wide text-slate-500">Type</dt>
          <dd className="mt-1 text-lg font-semibold text-slate-50">
            {customer.customerType}
          </dd>
        </div>
        <div className="rounded-lg border border-slate-800 bg-slate-950/50 p-3">
          <dt className="text-xs uppercase tracking-wide text-slate-500">Owner</dt>
          <dd className="mt-1 text-lg font-semibold text-slate-50">
            {customer.owner}
          </dd>
        </div>
        <div className="rounded-lg border border-slate-800 bg-slate-950/50 p-3">
          <dt className="text-xs uppercase tracking-wide text-slate-500">Phone</dt>
          <dd className="mt-1 text-lg font-semibold text-slate-50">
            {customer.phone || '—'}
          </dd>
        </div>
        <div className="rounded-lg border border-slate-800 bg-slate-950/50 p-3">
          <dt className="text-xs uppercase tracking-wide text-slate-500">Created</dt>
          <dd className="mt-1 text-sm font-medium text-slate-100">
            {formatDate(customer.createdDate)}
          </dd>
          <p className="mt-1 text-xs text-slate-400">
            by {customer.createdBy}
          </p>
        </div>
      </dl>
    </Card>
  )
}

export function CustomerGeneralSection({ customer }: { customer: Customer }) {
  return (
    <Card title="General Information">
      <CustomerFieldGrid
        items={[
          { label: 'Customer Code', value: customer.customerCode },
          { label: 'Customer Type', value: customer.customerType },
          { label: 'Full Name', value: customer.fullName },
          { label: 'Gender', value: customer.gender },
          { label: 'Birthday', value: customer.birthday },
          { label: 'Nationality', value: customer.nationality },
          { label: 'Status', value: customer.status },
        ]}
      />
    </Card>
  )
}

export function CustomerTravelSection({ customer }: { customer: Customer }) {
  return (
    <Card title="Travel Information">
      <CustomerFieldGrid
        items={[
          { label: 'Passport Number', value: customer.passportNumber },
          { label: 'Passport Expired Date', value: customer.passportExpiredDate },
          { label: 'Passport Country', value: customer.passportCountry },
          { label: 'Identity Number', value: customer.identityNumber },
        ]}
      />
    </Card>
  )
}

export function CustomerContactSection({ customer }: { customer: Customer }) {
  return (
    <Card title="Contact Information">
      <CustomerFieldGrid
        items={[
          { label: 'Phone Number', value: customer.phone },
          { label: 'Email', value: customer.email },
          { label: 'Address', value: customer.address },
        ]}
      />
    </Card>
  )
}

export function CustomerBankSection({ customer }: { customer: Customer }) {
  return (
    <Card title="Bank Information">
      <CustomerFieldGrid
        items={[
          { label: 'Bank Name', value: customer.bankName },
          { label: 'Account Number', value: customer.accountNumber },
          { label: 'Account Name', value: customer.accountName },
          { label: 'Swift Code', value: customer.swiftCode },
        ]}
      />
    </Card>
  )
}

export function CustomerInternalSection({ customer }: { customer: Customer }) {
  return (
    <Card title="Internal Information">
      <CustomerFieldGrid
        items={[
          { label: 'Owner', value: customer.owner },
          { label: 'Department', value: customer.department },
          { label: 'Source', value: customer.source },
          { label: 'Created By', value: customer.createdBy },
          { label: 'Created Date', value: formatDate(customer.createdDate) },
          { label: 'Updated By', value: customer.updatedBy },
          { label: 'Updated Date', value: formatDate(customer.updatedDate) },
        ]}
      />
    </Card>
  )
}
