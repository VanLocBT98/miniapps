import { Button, Card, Input } from '@repo/ui'
import {
  customerSourceSchema,
  customerStatusSchema,
  customerTypeSchema,
  genderSchema,
} from '@/shared/types'
import type { CustomerFormErrors, CustomerFormValues } from './customer-form-model'

function SelectField({
  label,
  value,
  onChange,
  options,
  error,
}: {
  label: string
  value: string
  onChange: (value: string) => void
  options: readonly string[]
  error?: string
}) {
  return (
    <label className="flex w-full flex-col gap-1.5 text-sm text-slate-200">
      <span className="font-medium">{label}</span>
      <select
        className="h-10 rounded-md border border-slate-700 bg-slate-950 px-3 text-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      >
        {options.map((opt) => (
          <option key={opt} value={opt}>
            {opt}
          </option>
        ))}
      </select>
      {error ? <span className="text-xs text-rose-400">{error}</span> : null}
    </label>
  )
}

export function CustomerForm({
  values,
  errors,
  pending,
  submitLabel,
  onChange,
  onSubmit,
  onCancel,
}: {
  values: CustomerFormValues
  errors: CustomerFormErrors
  pending?: boolean
  submitLabel: string
  onChange: (patch: Partial<CustomerFormValues>) => void
  onSubmit: () => void
  onCancel?: () => void
}) {
  return (
    <form
      className="space-y-4"
      onSubmit={(e) => {
        e.preventDefault()
        onSubmit()
      }}
      noValidate
    >
      {errors.form ? (
        <p className="rounded-md border border-rose-800 bg-rose-950/40 px-3 py-2 text-sm text-rose-200">
          {errors.form}
        </p>
      ) : null}

      <Card title="General Information">
        <div className="grid gap-3 sm:grid-cols-2">
          <Input
            label="Customer Code"
            name="customerCode"
            value={values.customerCode}
            error={errors.customerCode}
            onChange={(e) => onChange({ customerCode: e.target.value })}
            required
          />
          <SelectField
            label="Customer Type"
            value={values.customerType}
            options={customerTypeSchema.options}
            error={errors.customerType}
            onChange={(v) =>
              onChange({
                customerType: v as CustomerFormValues['customerType'],
              })
            }
          />
          <Input
            label="Full Name"
            name="fullName"
            value={values.fullName}
            error={errors.fullName}
            onChange={(e) => onChange({ fullName: e.target.value })}
            required
          />
          <SelectField
            label="Gender"
            value={values.gender}
            options={genderSchema.options}
            error={errors.gender}
            onChange={(v) =>
              onChange({ gender: v as CustomerFormValues['gender'] })
            }
          />
          <Input
            label="Birthday"
            name="birthday"
            type="date"
            value={values.birthday}
            error={errors.birthday}
            onChange={(e) => onChange({ birthday: e.target.value })}
            required
          />
          <Input
            label="Nationality"
            name="nationality"
            value={values.nationality}
            error={errors.nationality}
            onChange={(e) => onChange({ nationality: e.target.value })}
            required
          />
          <SelectField
            label="Status"
            value={values.status}
            options={customerStatusSchema.options}
            error={errors.status}
            onChange={(v) =>
              onChange({ status: v as CustomerFormValues['status'] })
            }
          />
        </div>
      </Card>

      <Card
        title="Travel Information"
        description="Passport number is required when Passport Country is set."
      >
        <div className="grid gap-3 sm:grid-cols-2">
          <Input
            label="Passport Number"
            name="passportNumber"
            value={values.passportNumber}
            error={errors.passportNumber}
            onChange={(e) => onChange({ passportNumber: e.target.value })}
          />
          <Input
            label="Passport Expired Date"
            name="passportExpiredDate"
            type="date"
            value={values.passportExpiredDate}
            error={errors.passportExpiredDate}
            onChange={(e) => onChange({ passportExpiredDate: e.target.value })}
          />
          <Input
            label="Passport Country"
            name="passportCountry"
            value={values.passportCountry}
            error={errors.passportCountry}
            onChange={(e) => onChange({ passportCountry: e.target.value })}
          />
          <Input
            label="Identity Number"
            name="identityNumber"
            value={values.identityNumber}
            error={errors.identityNumber}
            onChange={(e) => onChange({ identityNumber: e.target.value })}
          />
        </div>
      </Card>

      <Card title="Contact Information" description="Phone and email are optional.">
        <div className="grid gap-3 sm:grid-cols-2">
          <Input
            label="Phone Number"
            name="phone"
            value={values.phone}
            error={errors.phone}
            onChange={(e) => onChange({ phone: e.target.value })}
          />
          <Input
            label="Email"
            name="email"
            type="email"
            value={values.email}
            error={errors.email}
            onChange={(e) => onChange({ email: e.target.value })}
          />
          <div className="sm:col-span-2">
            <Input
              label="Address"
              name="address"
              value={values.address}
              error={errors.address}
              onChange={(e) => onChange({ address: e.target.value })}
            />
          </div>
        </div>
      </Card>

      <Card title="Bank Information">
        <div className="grid gap-3 sm:grid-cols-2">
          <Input
            label="Bank Name"
            name="bankName"
            value={values.bankName}
            error={errors.bankName}
            onChange={(e) => onChange({ bankName: e.target.value })}
          />
          <Input
            label="Account Number"
            name="accountNumber"
            value={values.accountNumber}
            error={errors.accountNumber}
            onChange={(e) => onChange({ accountNumber: e.target.value })}
          />
          <Input
            label="Account Name"
            name="accountName"
            value={values.accountName}
            error={errors.accountName}
            onChange={(e) => onChange({ accountName: e.target.value })}
          />
          <Input
            label="Swift Code"
            name="swiftCode"
            value={values.swiftCode}
            error={errors.swiftCode}
            onChange={(e) => onChange({ swiftCode: e.target.value })}
          />
        </div>
      </Card>

      <Card title="Internal Information">
        <div className="grid gap-3 sm:grid-cols-2">
          <Input
            label="Owner"
            name="owner"
            value={values.owner}
            error={errors.owner}
            onChange={(e) => onChange({ owner: e.target.value })}
            required
          />
          <Input
            label="Department"
            name="department"
            value={values.department}
            error={errors.department}
            onChange={(e) => onChange({ department: e.target.value })}
          />
          <SelectField
            label="Source"
            value={values.source}
            options={customerSourceSchema.options}
            error={errors.source}
            onChange={(v) =>
              onChange({ source: v as CustomerFormValues['source'] })
            }
          />
        </div>
      </Card>

      <div className="flex flex-wrap gap-2">
        <Button type="submit" disabled={pending}>
          {pending ? 'Saving…' : submitLabel}
        </Button>
        {onCancel ? (
          <Button type="button" variant="ghost" onClick={onCancel} disabled={pending}>
            Cancel
          </Button>
        ) : null}
      </div>
    </form>
  )
}
