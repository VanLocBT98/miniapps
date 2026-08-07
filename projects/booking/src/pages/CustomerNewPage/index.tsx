import { Link, useNavigate } from '@tanstack/react-router'
import { useState } from 'react'
import {
  CustomerForm,
  emptyCustomerFormValues,
  validateCustomerForm,
  type CustomerFormErrors,
  type CustomerFormValues,
} from '@/features/customer-form'
import { useCreateCustomerMutation } from '@/shared/services/apis/apis'

export default function CustomerNewPage() {
  const navigate = useNavigate()
  const createMutation = useCreateCustomerMutation()
  const [values, setValues] = useState<CustomerFormValues>(() =>
    emptyCustomerFormValues(),
  )
  const [errors, setErrors] = useState<CustomerFormErrors>({})

  return (
    <div className="mx-auto max-w-3xl space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-semibold text-slate-50">New customer</h1>
        <Link to="/customer" className="text-sm text-sky-400 hover:underline">
          Back to list
        </Link>
      </div>
      <CustomerForm
        values={values}
        errors={errors}
        pending={createMutation.isPending}
        submitLabel="Create customer"
        onChange={(patch) => {
          setValues((prev) => ({ ...prev, ...patch }))
          setErrors({})
        }}
        onCancel={() => void navigate({ to: '/customer' })}
        onSubmit={() => {
          const result = validateCustomerForm(values)
          if (!result.ok) {
            setErrors(result.errors)
            return
          }
          createMutation.mutate(result.input, {
            onSuccess: (data) => {
              void navigate({
                to: '/customer/$customerId',
                params: { customerId: data.id },
              })
            },
            onError: (err) => {
              setErrors({
                form: err instanceof Error ? err.message : 'Create failed',
                ...(err instanceof Error &&
                err.message.toLowerCase().includes('duplicate')
                  ? { customerCode: err.message }
                  : {}),
              })
            },
          })
        }}
      />
    </div>
  )
}
