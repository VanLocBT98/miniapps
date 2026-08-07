import { useState } from 'react'
import { Button, Card, FormField, Input } from '@repo/ui'
import { genderSchema, type Gender, type Passenger } from '@/shared/types'
import { requiresPassport } from '@/shared/domain'

export function AddPassengerForm({
  bookingType,
  disabled,
  onAdd,
}: {
  bookingType: 'domestic' | 'international'
  disabled: boolean
  onAdd: (passenger: Passenger) => void
}) {
  const needPassport = requiresPassport(bookingType)
  const [firstName, setFirstName] = useState('')
  const [lastName, setLastName] = useState('')
  const [gender, setGender] = useState<Gender>('unspecified')
  const [birthday, setBirthday] = useState('')
  const [passportNumber, setPassportNumber] = useState('')
  const [error, setError] = useState<string | null>(null)

  if (disabled) return null

  return (
    <Card title="Add passenger" description="Saved via TanStack Query mutation.">
      <form
        className="grid gap-3 sm:grid-cols-2"
        onSubmit={(e) => {
          e.preventDefault()
          if (!firstName.trim() || !lastName.trim() || !birthday.trim()) {
            setError('First name, last name, and birthday are required')
            return
          }
          if (needPassport && !passportNumber.trim()) {
            setError('Passport is required for international bookings')
            return
          }
          setError(null)
          onAdd({
            id: `p-${Date.now()}`,
            firstName: firstName.trim(),
            lastName: lastName.trim(),
            gender,
            birthday: birthday.trim(),
            passportNumber: passportNumber.trim() || undefined,
          })
          setFirstName('')
          setLastName('')
          setGender('unspecified')
          setBirthday('')
          setPassportNumber('')
        }}
      >
        <FormField label="First name" htmlFor="p-first">
          <Input
            id="p-first"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            required
          />
        </FormField>
        <FormField label="Last name" htmlFor="p-last">
          <Input
            id="p-last"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            required
          />
        </FormField>
        <FormField label="Gender" htmlFor="p-gender">
          <select
            id="p-gender"
            className="h-10 w-full rounded-md border border-slate-700 bg-slate-950 px-3 text-slate-100"
            value={gender}
            onChange={(e) => setGender(e.target.value as Gender)}
          >
            {genderSchema.options.map((g) => (
              <option key={g} value={g}>
                {g}
              </option>
            ))}
          </select>
        </FormField>
        <FormField label="Birthday" htmlFor="p-bday">
          <Input
            id="p-bday"
            type="date"
            value={birthday}
            onChange={(e) => setBirthday(e.target.value)}
            required
          />
        </FormField>
        <FormField
          label={needPassport ? 'Passport (required)' : 'Passport'}
          htmlFor="p-passport"
          error={error ?? undefined}
          className="sm:col-span-2"
        >
          <Input
            id="p-passport"
            value={passportNumber}
            onChange={(e) => setPassportNumber(e.target.value)}
            required={needPassport}
            placeholder={needPassport ? 'Required for international' : 'Optional'}
          />
        </FormField>
        <div className="sm:col-span-2">
          <Button type="submit" size="sm">
            Add passenger
          </Button>
        </div>
      </form>
    </Card>
  )
}
