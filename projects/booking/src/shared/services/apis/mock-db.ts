import type { BookingAggregate, Customer } from '@/shared/types'

const now = '2026-08-06T00:00:00.000Z'

function seed(): BookingAggregate[] {
  return [
    {
      id: 'b-1001',
      bookingNumber: 'BK-1001',
      status: 'Confirmed',
      bookingType: 'domestic',
      createdDate: now,
      updatedDate: now,
      passengers: [
        {
          id: 'p-1001-1',
          firstName: 'An',
          lastName: 'Nguyen',
          gender: 'female',
          birthday: '1994-03-12',
        },
      ],
      flights: [
        {
          id: 'f-1001-1',
          airline: 'VN',
          flightNumber: 'VN210',
          departureAirport: 'SGN',
          arrivalAirport: 'HAN',
          departureTime: '2026-08-10T08:00:00.000Z',
          arrivalTime: '2026-08-10T10:05:00.000Z',
        },
      ],
      payment: {
        id: 'pay-1001',
        amount: 240,
        currency: 'USD',
        paymentMethod: 'card',
        paymentStatus: 'Captured',
      },
      timeline: [
        {
          id: 't-1001-1',
          action: 'Booking created',
          user: 'system',
          createdDate: now,
        },
      ],
      history: [
        {
          id: 'h-1001-1',
          action: 'Booking created',
          user: 'system',
          createdDate: now,
        },
      ],
      documents: [
        {
          id: 'd-1001-1',
          type: 'itinerary',
          url: 'https://example.com/docs/b-1001-itinerary.pdf',
        },
        {
          id: 'd-1001-2',
          type: 'invoice',
          url: 'https://example.com/docs/b-1001-invoice.pdf',
        },
      ],
    },
    {
      id: 'b-1002',
      bookingNumber: 'BK-1002',
      status: 'Draft',
      bookingType: 'international',
      createdDate: now,
      updatedDate: now,
      passengers: [
        {
          id: 'p-1002-1',
          firstName: 'Minh',
          lastName: 'Tran',
          gender: 'male',
          birthday: '1990-07-21',
          passportNumber: 'C9988776',
        },
      ],
      flights: [
        {
          id: 'f-1002-1',
          airline: 'QH',
          flightNumber: 'QH208',
          departureAirport: 'SGN',
          arrivalAirport: 'ICN',
          departureTime: '2026-08-14T23:30:00.000Z',
          arrivalTime: '2026-08-15T06:10:00.000Z',
        },
      ],
      payment: null,
      timeline: [
        {
          id: 't-1002-1',
          action: 'Draft started',
          user: 'minh.tran',
          createdDate: now,
        },
      ],
      history: [
        {
          id: 'h-1002-1',
          action: 'Draft started',
          user: 'minh.tran',
          createdDate: now,
        },
      ],
      documents: [],
    },
    {
      id: 'b-1003',
      bookingNumber: 'BK-1003',
      status: 'Ticketed',
      bookingType: 'domestic',
      createdDate: now,
      updatedDate: now,
      passengers: [
        {
          id: 'p-1003-1',
          firstName: 'Lan',
          lastName: 'Pham',
          gender: 'female',
          birthday: '1988-11-02',
        },
      ],
      flights: [
        {
          id: 'f-1003-1',
          airline: 'VJ',
          flightNumber: 'VJ120',
          departureAirport: 'DAD',
          arrivalAirport: 'SGN',
          departureTime: '2026-08-20T13:00:00.000Z',
          arrivalTime: '2026-08-20T14:20:00.000Z',
        },
      ],
      payment: {
        id: 'pay-1003',
        amount: 320,
        currency: 'USD',
        paymentMethod: 'card',
        paymentStatus: 'Captured',
      },
      timeline: [
        {
          id: 't-1003-1',
          action: 'Ticketed',
          user: 'system',
          createdDate: now,
        },
      ],
      history: [
        {
          id: 'h-1003-1',
          action: 'Ticketed',
          user: 'system',
          createdDate: now,
        },
      ],
      documents: [
        {
          id: 'd-1003-1',
          type: 'e-ticket',
          url: 'https://example.com/docs/b-1003-eticket.pdf',
        },
        {
          id: 'd-1003-2',
          type: 'receipt',
          url: 'https://example.com/docs/b-1003-receipt.pdf',
        },
      ],
    },
  ]
}

function seedCustomers(): Customer[] {
  return [
    {
      id: 'c-1001',
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
      accountNumber: '0123456789',
      accountName: 'AN NGUYEN',
      swiftCode: 'BFTVVNVX',
      owner: 'agent.one',
      department: 'Sales',
      source: 'Manual',
      status: 'Active',
      createdBy: 'system',
      createdDate: now,
      updatedBy: 'system',
      updatedDate: now,
    },
    {
      id: 'c-1002',
      customerCode: 'CUS-1002',
      customerType: 'Company',
      fullName: 'Acme Travel Co',
      gender: 'unspecified',
      birthday: '2010-01-01',
      nationality: 'VN',
      phone: '+84987654321',
      email: 'ops@acme-travel.example',
      address: '88 Dong Khoi, HCMC',
      owner: 'agent.two',
      department: 'Corporate',
      source: 'Imported',
      status: 'Active',
      createdBy: 'system',
      createdDate: now,
      updatedBy: 'system',
      updatedDate: now,
    },
    {
      id: 'c-1003',
      customerCode: 'CUS-1003',
      customerType: 'Individual',
      fullName: 'Inactive User',
      gender: 'male',
      birthday: '1985-06-01',
      nationality: 'VN',
      owner: 'agent.one',
      department: 'Sales',
      source: 'Booking',
      status: 'Inactive',
      createdBy: 'system',
      createdDate: now,
      updatedBy: 'system',
      updatedDate: now,
    },
  ]
}

/** customerId → related booking ids (stub until booking.customerId is wired). */
function seedCustomerRelatedBookings(): Record<string, string[]> {
  return {
    'c-1001': ['b-1001'],
  }
}

/** In-memory mock DB (module singleton). */
export const bookingDb: { rows: BookingAggregate[] } = {
  rows: seed(),
}

export const customerDb: {
  rows: Customer[]
  relatedBookings: Record<string, string[]>
  deletedIds: Set<string>
} = {
  rows: seedCustomers(),
  relatedBookings: seedCustomerRelatedBookings(),
  deletedIds: new Set(),
}

export function resetBookingDb() {
  bookingDb.rows = seed()
  customerDb.rows = seedCustomers()
  customerDb.relatedBookings = seedCustomerRelatedBookings()
  customerDb.deletedIds = new Set()
}

export function resetCustomerDb() {
  customerDb.rows = seedCustomers()
  customerDb.relatedBookings = seedCustomerRelatedBookings()
  customerDb.deletedIds = new Set()
}
