-- Table to store SMS verification codes for public pages
create table if not exists phone_verifications (
  id         uuid        primary key default gen_random_uuid(),
  phone      text        not null,
  code       text        not null,
  expires_at timestamptz not null,
  verified   boolean     not null default false,
  created_at timestamptz not null default now()
);

create index if not exists idx_phone_verif_phone_created
  on phone_verifications (phone, created_at desc);

-- RLS: only service role can access (all public access blocked)
alter table phone_verifications enable row level security;
