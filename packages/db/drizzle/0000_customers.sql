-- customers table (Postgres)
CREATE TABLE IF NOT EXISTS customers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_code VARCHAR(50) UNIQUE NOT NULL,
  customer_type VARCHAR(20) NOT NULL,
  full_name VARCHAR(255) NOT NULL,
  gender VARCHAR(20),
  birthday DATE,
  nationality VARCHAR(100),
  phone VARCHAR(30),
  email VARCHAR(255),
  address TEXT,
  passport_number VARCHAR(100),
  passport_country VARCHAR(100),
  passport_expired_date DATE,
  identity_number VARCHAR(100),
  bank_name VARCHAR(255),
  bank_account_number VARCHAR(100),
  bank_account_name VARCHAR(255),
  swift_code VARCHAR(50),
  owner_id UUID,
  source VARCHAR(50),
  status VARCHAR(20),
  created_by UUID,
  updated_by UUID,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),
  deleted_at TIMESTAMPTZ
);

CREATE INDEX IF NOT EXISTS customers_status_idx ON customers (status);
CREATE INDEX IF NOT EXISTS customers_owner_id_idx ON customers (owner_id);
