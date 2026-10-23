CREATE EXTENSION IF NOT EXISTS pgcrypto;

ALTER TABLE circle_members
ADD COLUMN IF NOT EXISTS owner_id UUID NOT NULL DEFAULT gen_random_uuid();

CREATE INDEX IF NOT EXISTS idx_circle_members_owner_id ON circle_members(owner_id);
