import { z } from 'zod'
import { genderSchema } from './booking'

export const customerIdSchema = z.string().min(1)
export type CustomerId = z.infer<typeof customerIdSchema>

export const customerTypeSchema = z.enum(['Individual', 'Company'])
export type CustomerType = z.infer<typeof customerTypeSchema>

export const customerStatusSchema = z.enum(['Active', 'Inactive'])
export type CustomerStatus = z.infer<typeof customerStatusSchema>

export const customerSourceSchema = z.enum([
  'Manual',
  'Imported',
  'Booking',
  'API',
  'CRM',
])
export type CustomerSource = z.infer<typeof customerSourceSchema>

export const customerSchema = z.object({
  id: customerIdSchema,
  customerCode: z.string().min(1),
  customerType: customerTypeSchema,
  fullName: z.string().min(1),
  gender: genderSchema,
  birthday: z.string().min(1),
  nationality: z.string().min(1),

  phone: z.string().optional(),
  email: z
    .string()
    .email()
    .optional()
    .or(z.literal('').transform(() => undefined)),
  address: z.string().optional(),

  passportNumber: z.string().optional(),
  passportExpiredDate: z.string().optional(),
  passportCountry: z.string().optional(),
  identityNumber: z.string().optional(),

  bankName: z.string().optional(),
  accountNumber: z.string().optional(),
  accountName: z.string().optional(),
  swiftCode: z.string().optional(),

  owner: z.string().min(1),
  department: z.string().optional(),
  source: customerSourceSchema,

  status: customerStatusSchema,
  createdBy: z.string().min(1),
  createdDate: z.string().min(1),
  updatedBy: z.string().min(1),
  updatedDate: z.string().min(1),
})
export type Customer = z.infer<typeof customerSchema>
