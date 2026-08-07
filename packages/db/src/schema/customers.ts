import {
  pgTable,
  uuid,
  varchar,
  text,
  date,
  timestamp,
} from 'drizzle-orm/pg-core'

export const customers = pgTable('customers', {
  id: uuid('id').defaultRandom().primaryKey(),
  customerCode: varchar('customer_code', { length: 50 }).notNull().unique(),
  customerType: varchar('customer_type', { length: 20 }).notNull(),
  fullName: varchar('full_name', { length: 255 }).notNull(),
  gender: varchar('gender', { length: 20 }),
  birthday: date('birthday'),
  nationality: varchar('nationality', { length: 100 }),
  phone: varchar('phone', { length: 30 }),
  email: varchar('email', { length: 255 }),
  address: text('address'),
  passportNumber: varchar('passport_number', { length: 100 }),
  passportCountry: varchar('passport_country', { length: 100 }),
  passportExpiredDate: date('passport_expired_date'),
  identityNumber: varchar('identity_number', { length: 100 }),
  bankName: varchar('bank_name', { length: 255 }),
  bankAccountNumber: varchar('bank_account_number', { length: 100 }),
  bankAccountName: varchar('bank_account_name', { length: 255 }),
  swiftCode: varchar('swift_code', { length: 50 }),
  ownerId: uuid('owner_id'),
  source: varchar('source', { length: 50 }),
  status: varchar('status', { length: 20 }),
  createdBy: uuid('created_by'),
  updatedBy: uuid('updated_by'),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow(),
  updatedAt: timestamp('updated_at', { withTimezone: true }).defaultNow(),
  deletedAt: timestamp('deleted_at', { withTimezone: true }),
})

export type CustomerRow = typeof customers.$inferSelect
export type NewCustomerRow = typeof customers.$inferInsert
