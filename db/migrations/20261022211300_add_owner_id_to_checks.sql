CREATE EXTENSION IF NOT EXISTS pgcrypto;

ALTER TABLE checks
ADD COLUMN IF NOT EXISTS owner_id UUID NOT NULL DEFAULT gen_random_uuid();

CREATE INDEX IF NOT EXISTS idx_checks_owner_id ON checks(owner_id);
