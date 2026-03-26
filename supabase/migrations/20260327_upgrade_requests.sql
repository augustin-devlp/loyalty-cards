-- Table for plan upgrade & add-on requests submitted from /dashboard/billing
-- Admin approves from /admin, which updates businesses.plan and sends SMS

create table if not exists upgrade_requests (
  id            uuid        primary key default gen_random_uuid(),
  business_id   uuid        references businesses(id) on delete cascade,
  business_name text        not null,
  business_email text       not null,
  business_phone text,
  current_plan  text        not null,
  requested_item text       not null,  -- plan key (e.g. "pro") or add-on id (e.g. "sms-campaign")
  request_type  text        not null default 'plan',  -- 'plan' | 'addon'
  status        text        not null default 'pending',  -- 'pending' | 'approved' | 'rejected'
  created_at    timestamptz not null default now(),
  approved_at   timestamptz
);

alter table upgrade_requests enable row level security;

-- Merchants can insert their own requests and read them
create policy "owner_insert_upgrade_requests"
  on upgrade_requests for insert
  with check (auth.uid() = business_id);

create policy "owner_select_upgrade_requests"
  on upgrade_requests for select
  using (auth.uid() = business_id);
