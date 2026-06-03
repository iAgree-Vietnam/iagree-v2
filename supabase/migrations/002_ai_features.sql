-- iAgree v2 - AI Features Schema
-- Migration: 002_ai_features

-- ============================================
-- AI JOB BRIEF REQUESTS (audit log)
-- ============================================
create table ai_job_briefs (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references profiles(id),
  raw_input text not null, -- user's free-text input
  ai_output jsonb not null, -- structured brief output
  job_id uuid references jobs(id), -- if converted to job
  tokens_used integer,
  created_at timestamptz default now()
);

-- ============================================
-- AI MATCH RESULTS (cache)
-- ============================================
create table ai_match_results (
  id uuid primary key default uuid_generate_v4(),
  job_id uuid not null references jobs(id) on delete cascade,
  freelancer_id uuid not null references profiles(id),
  match_score numeric(4,2) not null,
  match_reasons text[] not null,
  computed_at timestamptz default now(),
  unique(job_id, freelancer_id)
);

-- ============================================
-- AI PRICE BENCHMARKS (aggregate cache)
-- ============================================
create table ai_price_benchmarks (
  id uuid primary key default uuid_generate_v4(),
  category_id uuid references categories(id),
  skill_tags text[],
  price_min integer,
  price_max integer,
  price_avg integer,
  sample_size integer,
  last_computed_at timestamptz default now()
);

-- ============================================
-- CONTRACT TEMPLATES (AI base templates)
-- ============================================
create table contract_templates (
  id uuid primary key default uuid_generate_v4(),
  category_id uuid references categories(id),
  name text not null,
  template_text text not null, -- with {{placeholders}}
  is_active boolean default true,
  created_at timestamptz default now()
);

-- RLS
alter table ai_job_briefs enable row level security;
alter table ai_match_results enable row level security;

create policy "Users view own AI briefs" on ai_job_briefs
  for select using (auth.uid() = user_id);
create policy "AI match results viewable by job owner" on ai_match_results
  for select using (
    auth.uid() = (select client_id from jobs where id = job_id)
    or auth.uid() = freelancer_id
  );
