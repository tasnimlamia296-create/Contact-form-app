/*
# Create contact_messages table

1. New Tables
- `contact_messages`
  - `id` (uuid, primary key)
  - `full_name` (text, not null) — sender's full name
  - `company_name` (text, not null) — sender's company
  - `email` (text, not null) — sender's email address
  - `phone` (text, not null) — sender's phone number
  - `agreement` (boolean, not null, default false) — consent checkbox
  - `created_at` (timestamptz, default now()) — when message was received

2. Security
- Enable RLS on `contact_messages`.
- Grant INSERT to `anon, authenticated` so the public contact form can submit.
- Grant SELECT to `anon, authenticated` so the messages list endpoint can read.
- Allow anon + authenticated INSERT because the contact form is public (no sign-in).
- Allow anon + authenticated SELECT because the messages endpoint is public.
*/

CREATE TABLE IF NOT EXISTS contact_messages (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  full_name text NOT NULL,
  company_name text NOT NULL,
  email text NOT NULL,
  phone text NOT NULL,
  agreement boolean NOT NULL DEFAULT false,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE contact_messages ENABLE ROW LEVEL SECURITY;

GRANT SELECT, INSERT ON contact_messages TO anon, authenticated;
GRANT SELECT, INSERT ON contact_messages TO service_role;

DROP POLICY IF EXISTS "anon_insert_contact_messages" ON contact_messages;
CREATE POLICY "anon_insert_contact_messages"
ON contact_messages FOR INSERT
TO anon, authenticated WITH CHECK (true);

DROP POLICY IF EXISTS "anon_select_contact_messages" ON contact_messages;
CREATE POLICY "anon_select_contact_messages"
ON contact_messages FOR SELECT
TO anon, authenticated USING (true);
