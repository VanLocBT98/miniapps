import { eq } from 'drizzle-orm'
import { closeDb, getDb, hasDatabaseUrl } from './client'
import { customers } from './schema/customers'
import { DEMO_OWNER_IDS, SEED_CUSTOMER_IDS } from './customers/demo'

/** Local docker-compose default — CLI seed does not load apps/main/.env */
const LOCAL_DATABASE_URL =
  'postgresql://miniapps:miniapps@localhost:5433/miniapps'

async function seed() {
  if (!hasDatabaseUrl()) {
    process.env.DATABASE_URL = LOCAL_DATABASE_URL
    console.log(`DATABASE_URL unset — using ${LOCAL_DATABASE_URL}`)
  }

  const db = getDb()
  const now = new Date()

  const rows = [
    {
      id: SEED_CUSTOMER_IDS.c1001,
      customerCode: 'CUS-1001',
      customerType: 'Individual',
      fullName: 'An Nguyen',
      gender: 'female',
      birthday: '1994-03-12',
      nationality: 'VN',
      phone: '+84901234567',
      email: 'an.nguyen@example.com',
      address: '1 Nguyen Hue, HCMC',
      passportNumber: 'C1234567',
      passportExpiredDate: '2030-01-01',
      passportCountry: 'VN',
      identityNumber: '079194001234',
      bankName: 'Vietcombank',
      bankAccountNumber: '0123456789',
      bankAccountName: 'AN NGUYEN',
      swiftCode: 'BFTVVNVX',
      ownerId: DEMO_OWNER_IDS['agent.one'],
      source: 'Manual',
      status: 'Active',
      createdBy: DEMO_OWNER_IDS.system,
      updatedBy: DEMO_OWNER_IDS.system,
      createdAt: now,
      updatedAt: now,
      deletedAt: null,
    },
    {
      id: SEED_CUSTOMER_IDS.c1002,
      customerCode: 'CUS-1002',
      customerType: 'Company',
      fullName: 'Acme Travel Co',
      gender: 'unspecified',
      birthday: '2010-01-01',
      nationality: 'VN',
      phone: '+84987654321',
      email: 'ops@acme-travel.example',
      address: '88 Dong Khoi, HCMC',
      ownerId: DEMO_OWNER_IDS['agent.two'],
      source: 'Imported',
      status: 'Active',
      createdBy: DEMO_OWNER_IDS.system,
      updatedBy: DEMO_OWNER_IDS.system,
      createdAt: now,
      updatedAt: now,
      deletedAt: null,
    },
    {
      id: SEED_CUSTOMER_IDS.c1003,
      customerCode: 'CUS-1003',
      customerType: 'Individual',
      fullName: 'Inactive User',
      gender: 'male',
      birthday: '1985-06-01',
      nationality: 'VN',
      ownerId: DEMO_OWNER_IDS['agent.one'],
      source: 'Booking',
      status: 'Inactive',
      createdBy: DEMO_OWNER_IDS.system,
      updatedBy: DEMO_OWNER_IDS.system,
      createdAt: now,
      updatedAt: now,
      deletedAt: null,
    },
  ]

  for (const row of rows) {
    const existing = await db
      .select({ id: customers.id })
      .from(customers)
      .where(eq(customers.customerCode, row.customerCode))
      .limit(1)
    if (existing[0]) {
      const { id: _id, createdAt: _createdAt, ...rest } = row
      await db
        .update(customers)
        .set({ ...rest, updatedAt: now, deletedAt: null })
        .where(eq(customers.id, existing[0].id))
      console.log(`reset ${row.customerCode}`)
      continue
    }
    await db.insert(customers).values(row)
    console.log(`seeded ${row.customerCode}`)
  }

  await closeDb()
  console.log('seed complete')
}

seed().catch(async (err) => {
  console.error(err)
  await closeDb()
  process.exit(1)
})
