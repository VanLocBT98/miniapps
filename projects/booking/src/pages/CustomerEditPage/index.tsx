import { Link, useNavigate } from '@tanstack/react-router'
import { useSuspenseQuery } from '@tanstack/react-query'
import { useState } from 'react'
import {
  CustomerForm,
  customerToFormValues,
  validateCustomerForm,
  type CustomerFormErrors,
  type CustomerFormValues,
} from '@/features/customer-form'
import {
  customerDetailQueryOptions,
  useUpdateCustomerMutation,
} from '@/shared/services/apis/apis'

export default function CustomerEditPage({
  customerId,
}: {
  customerId: string
}) {
  const navigate = useNavigate()
  const { data: customer } = useSuspenseQuery(
    customerDetailQueryOptions(customerId),
  )
  const updateMutation = useUpdateCustomerMutation()
  const [values, setValues] = useState<CustomerFormValues>(() =>
    customerToFormValues(customer),
  )
  const [errors, setErrors] = useState<CustomerFormErrors>({})

  return (
    <div className="mx-auto max-w-3xl space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-semibold text-slate-50">Edit customer</h1>
        <Link
          to="/customer/$customerId"
          params={{ customerId }}
          className="text-sm text-sky-400 hover:underline"
        >
          Back to detail
        </Link>
      </div>
      <CustomerForm
        values={values}
        errors={errors}
        pending={updateMutation.isPending}
        submitLabel="Save changes"
        onChange={(patch) => {
          setValues((prev) => ({ ...prev, ...patch }))
          setErrors({})
        }}
        onCancel={() =>
          void navigate({
            to: '/customer/$customerId',
            params: { customerId },
          })
        }
        onSubmit={() => {
          const result = validateCustomerForm(values)
          if (!result.ok) {
            setErrors(result.errors)
            return
          }
          updateMutation.mutate(
            { id: customerId, input: result.input },
            {
              onSuccess: (data) => {
                void navigate({
                  to: '/customer/$customerId',
                  params: { customerId: data.id },
                })
              },
              onError: (err) => {
                setErrors({
                  form: err instanceof Error ? err.message : 'Update failed',
                  ...(err instanceof Error &&
                  err.message.toLowerCase().includes('duplicate')
                    ? { customerCode: err.message }
                    : {}),
                })
              },
            },
          )
        }}
      />
    </div>
  )
}
