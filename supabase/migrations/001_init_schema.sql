-- iAgree v2 - Core Schema
-- Migration: 001_init_schema

-- Extensions
create extension if not exists "uuid-ossp";
create extension if not exists "pg_trgm"; -- for full-text search

-- ============================================
-- ENUMS
-- ============================================
create type user_role as enum ('client', 'freelancer', 'both', 'admin');
create type job_status as enum ('draft', 'open', 'in_progress', 'completed', 'cancelled');
create type proposal_status as enum ('pending', 'accepted', 'rejected', 'withdrawn');
create type contract_status as enum ('draft', 'pending_client', 'pending_freelancer', 'active', 'completed', 'cancelled');
create type subscription_plan as enum ('free', 'pro', 'studio');
create type verification_status as enum ('unverified', 'pending', 'verified', 'rejected');

-- ============================================
-- PROFILES (extends Supabase auth.users)
-- ============================================
create table profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  role user_role not null default 'both',
  display_name text not null,
  username text unique,
  bio text,
  avatar_url text,
  phone text,
  location text, -- city/province
  website_url text,
  
  -- Freelancer specific
  hourly_rate integer, -- VND per hour
  availability boolean default true,
  skills text[] default '{}',
  categories text[] default '{}', -- job categories
  
  -- Verification (A&D Verified badge)
  verification_status verification_status default 'unverified',
  verified_by text, -- 'andlaw.vn' | 'andacc.vn'
  verified_at timestamptz,
  
  -- Stats (denormalized for performance)
  jobs_completed integer default 0,
  avg_rating numeric(3,2) default 0,
  total_reviews integer default 0,
  
  -- Subscription
  subscription_plan subscription_plan default 'free',
  subscription_expires_at timestamptz,
  
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- ============================================
-- CATEGORIES & SKILLS (master data)
-- ============================================
create table categories (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  slug text unique not null,
  icon_url text,
  sort_order integer default 0,
  is_active boolean default true
);

create table skills (
  id uuid primary key default uuid_generate_v4(),
  name text not null,
  category_id uuid references categories(id),
  is_active boolean default true
);

-- ============================================
-- JOBS
-- ============================================
create table jobs (
  id uuid primary key default uuid_generate_v4(),
  client_id uuid not null references profiles(id) on delete cascade,
  
  title text not null,
  description text not null,
  category_id uuid references categories(id),
  skills_required text[] default '{}',
  
  budget_min integer, -- VND
  budget_max integer, -- VND
  deadline date,
  duration_days integer,
  
  status job_status default 'open',
  
  -- AI generated fields
  ai_generated_scope jsonb, -- full AI analysis result
  ai_price_benchmark jsonb, -- {min, max, avg, sample_size}
  
  -- Meta
  views_count integer default 0,
  proposals_count integer default 0,
  
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  expires_at timestamptz default (now() + interval '30 days')
);

-- Full-text search index
create index jobs_search_idx on jobs using gin(
  to_tsvector('simple', title || ' ' || description)
);
create index jobs_status_idx on jobs(status);
create index jobs_client_idx on jobs(client_id);
create index jobs_category_idx on jobs(category_id);

-- ============================================
-- PROPOSALS (freelancer applies to job)
-- ============================================
create table proposals (
  id uuid primary key default uuid_generate_v4(),
  job_id uuid not null references jobs(id) on delete cascade,
  freelancer_id uuid not null references profiles(id) on delete cascade,
  
  cover_letter text not null,
  proposed_rate integer not null, -- VND total
  proposed_timeline integer, -- days
  
  status proposal_status default 'pending',
  
  -- AI match score
  ai_match_score numeric(4,2), -- 0-100
  ai_match_reasons text[], -- ["Đã làm 12 project tương tự", "Rating 4.9/5"]
  
  created_at timestamptz default now(),
  updated_at timestamptz default now(),
  
  unique(job_id, freelancer_id)
);

create index proposals_job_idx on proposals(job_id);
create index proposals_freelancer_idx on proposals(freelancer_id);

-- ============================================
-- CONTRACTS
-- ============================================
create table contracts (
  id uuid primary key default uuid_generate_v4(),
  job_id uuid not null references jobs(id),
  proposal_id uuid references proposals(id),
  client_id uuid not null references profiles(id),
  freelancer_id uuid not null references profiles(id),
  
  title text not null,
  terms text not null, -- full contract text (AI generated)
  milestones jsonb, -- [{title, due_date, description}]
  
  agreed_rate integer not null, -- VND
  
  status contract_status default 'draft',
  
  -- Signatures
  signed_by_client_at timestamptz,
  signed_by_freelancer_at timestamptz,
  
  -- Storage
  pdf_url text, -- Supabase storage path
  
  -- AI generated
  ai_generated boolean default false,
  
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- ============================================
-- REVIEWS
-- ============================================
create table reviews (
  id uuid primary key default uuid_generate_v4(),
  job_id uuid not null references jobs(id),
  contract_id uuid references contracts(id),
  reviewer_id uuid not null references profiles(id),
  reviewee_id uuid not null references profiles(id),
  
  rating integer not null check (rating between 1 and 5),
  comment text,
  
  -- Detailed ratings
  rating_quality integer check (rating_quality between 1 and 5),
  rating_communication integer check (rating_communication between 1 and 5),
  rating_timeliness integer check (rating_timeliness between 1 and 5),
  
  created_at timestamptz default now(),
  
  unique(job_id, reviewer_id)
);

-- ============================================
-- MESSAGES (Chat)
-- ============================================
create table chat_rooms (
  id uuid primary key default uuid_generate_v4(),
  job_id uuid references jobs(id),
  participant_ids uuid[] not null,
  last_message text,
  last_message_at timestamptz,
  created_at timestamptz default now()
);

create table messages (
  id uuid primary key default uuid_generate_v4(),
  room_id uuid not null references chat_rooms(id) on delete cascade,
  sender_id uuid not null references profiles(id),
  content text not null,
  attachment_url text,
  is_read boolean default false,
  created_at timestamptz default now()
);

create index messages_room_idx on messages(room_id, created_at desc);

-- ============================================
-- NOTIFICATIONS
-- ============================================
create table notifications (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references profiles(id) on delete cascade,
  type text not null, -- 'new_proposal' | 'proposal_accepted' | 'contract_signed' | 'review_received'
  title text not null,
  body text,
  data jsonb,
  is_read boolean default false,
  created_at timestamptz default now()
);

create index notifications_user_idx on notifications(user_id, is_read, created_at desc);

-- ============================================
-- SUBSCRIPTIONS (Stripe)
-- ============================================
create table subscriptions (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid not null references profiles(id) on delete cascade,
  plan subscription_plan not null,
  stripe_subscription_id text unique,
  stripe_customer_id text,
  status text not null default 'active', -- active | cancelled | past_due
  current_period_start timestamptz,
  current_period_end timestamptz,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- ============================================
-- FAVORITES
-- ============================================
create table favorites (
  user_id uuid not null references profiles(id) on delete cascade,
  target_id uuid not null, -- job_id or freelancer profile_id
  target_type text not null, -- 'job' | 'freelancer'
  created_at timestamptz default now(),
  primary key (user_id, target_id, target_type)
);

-- ============================================
-- ROW LEVEL SECURITY
-- ============================================

alter table profiles enable row level security;
alter table jobs enable row level security;
alter table proposals enable row level security;
alter table contracts enable row level security;
alter table reviews enable row level security;
alter table messages enable row level security;
alter table chat_rooms enable row level security;
alter table notifications enable row level security;
alter table subscriptions enable row level security;
alter table favorites enable row level security;

-- Profiles: public read, self write
create policy "Profiles are viewable by everyone" on profiles for select using (true);
create policy "Users can update own profile" on profiles for update using (auth.uid() = id);
create policy "Users can insert own profile" on profiles for insert with check (auth.uid() = id);

-- Jobs: public read, owner write
create policy "Jobs are viewable by everyone" on jobs for select using (true);
create policy "Clients can create jobs" on jobs for insert with check (auth.uid() = client_id);
create policy "Clients can update own jobs" on jobs for update using (auth.uid() = client_id);

-- Proposals: freelancer can create, client & freelancer can view
create policy "Proposals viewable by job owner and proposer" on proposals
  for select using (
    auth.uid() = freelancer_id or
    auth.uid() = (select client_id from jobs where id = job_id)
  );
create policy "Freelancers can create proposals" on proposals for insert
  with check (auth.uid() = freelancer_id);
create policy "Freelancers can update own proposals" on proposals for update
  using (auth.uid() = freelancer_id);

-- Contracts: parties only
create policy "Contracts viewable by parties" on contracts
  for select using (auth.uid() = client_id or auth.uid() = freelancer_id);
create policy "Parties can create contracts" on contracts
  for insert with check (auth.uid() = client_id);
create policy "Parties can update contracts" on contracts
  for update using (auth.uid() = client_id or auth.uid() = freelancer_id);

-- Messages: room participants only
create policy "Messages viewable by room participants" on messages
  for select using (
    auth.uid() = any(
      select participant_ids from chat_rooms where id = room_id
    )
  );
create policy "Room participants can send messages" on messages
  for insert with check (
    auth.uid() = sender_id and
    auth.uid() = any(
      select participant_ids from chat_rooms where id = room_id
    )
  );

-- Notifications: owner only
create policy "Users can view own notifications" on notifications
  for select using (auth.uid() = user_id);

-- Reviews: public read, verified reviewer write
create policy "Reviews are public" on reviews for select using (true);
create policy "Verified parties can create reviews" on reviews
  for insert with check (auth.uid() = reviewer_id);

-- Subscriptions: owner only
create policy "Users view own subscriptions" on subscriptions
  for select using (auth.uid() = user_id);

-- Favorites: owner only
create policy "Users manage own favorites" on favorites
  for all using (auth.uid() = user_id);

-- ============================================
-- TRIGGERS: updated_at auto-update
-- ============================================
create or replace function update_updated_at()
returns trigger as $$
begin new.updated_at = now(); return new; end;
$$ language plpgsql;

create trigger profiles_updated_at before update on profiles
  for each row execute function update_updated_at();
create trigger jobs_updated_at before update on jobs
  for each row execute function update_updated_at();
create trigger proposals_updated_at before update on proposals
  for each row execute function update_updated_at();
create trigger contracts_updated_at before update on contracts
  for each row execute function update_updated_at();

-- ============================================
-- SEED: Categories
-- ============================================
insert into categories (name, slug, sort_order) values
  ('Thiết kế', 'thiet-ke', 1),
  ('Lập trình & Công nghệ', 'lap-trinh', 2),
  ('Marketing & Nội dung', 'marketing', 3),
  ('Video & Âm thanh', 'video-am-thanh', 4),
  ('Pháp lý', 'phap-ly', 5),
  ('Kế toán & Tài chính', 'ke-toan-tai-chinh', 6),
  ('Giáo dục & Đào tạo', 'giao-duc-dao-tao', 7),
  ('Dịch thuật', 'dich-thuat', 8),
  ('Kinh doanh & Tư vấn', 'kinh-doanh-tu-van', 9),
  ('Nhiếp ảnh', 'nhiep-anh', 10);
