import { Link, useNavigate } from '@tanstack/react-router'
import { useState } from 'react'
import { formatDate } from '@repo/shared/utils'
import { Button } from '@repo/ui'
import { CustomerStatus } from '@/components/molecules'
import { useDeleteCustomerMutation } from '@/shared/services/apis/apis'
import type { Customer } from '@/shared/types'
import { CustomerDeleteDialog } from './CustomerDeleteDialog'

export function CustomerDetailHeader({ customer }: { customer: Customer }) {
  const navigate = useNavigate()
  const deleteMutation = useDeleteCustomerMutation()
  const [deleteOpen, setDeleteOpen] = useState(false)

  return (
    <header className="space-y-3">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <Link to="/customer" className="text-sm text-sky-400 hover:underline">
          ← Back to customers
        </Link>
        <div className="flex flex-wrap items-center gap-2">
          <Link
            to="/customer/$customerId/edit"
            params={{ customerId: customer.id }}
          >
            <Button size="sm" variant="secondary">
              Edit
            </Button>
          </Link>
          <Button
            size="sm"
            variant="ghost"
            disabled={deleteMutation.isPending}
            onClick={() => setDeleteOpen(true)}
          >
            Delete
          </Button>
        </div>
      </div>
      <div className="flex flex-wrap items-center gap-3">
        <h1 className="text-2xl font-semibold tracking-tight text-slate-50 md:text-3xl">
          {customer.fullName}
        </h1>
        <CustomerStatus status={customer.status} />
      </div>
      <p className="text-sm text-slate-400">
        <span className="text-slate-200">{customer.customerCode}</span>
        <span className="mx-2 text-slate-600">·</span>
        <span>{customer.customerType}</span>
        <span className="mx-2 text-slate-600">·</span>
        <span>{customer.id}</span>
        <span className="mx-2 text-slate-600">·</span>
        <span>Updated {formatDate(customer.updatedDate)}</span>
      </p>

      <CustomerDeleteDialog
        customer={customer}
        open={deleteOpen}
        pending={deleteMutation.isPending}
        onClose={() => setDeleteOpen(false)}
        onConfirm={() => {
          deleteMutation.mutate(customer.id, {
            onSuccess: () => {
              setDeleteOpen(false)
              void navigate({ to: '/customer' })
            },
          })
        }}
      />
    </header>
  )
}
