create extension if not exists "pgcrypto";

create table if not exists public.questions (
  id uuid primary key default gen_random_uuid(),
  category text not null check (category in ('kumite','kata','parakarate')),
  statement text not null,
  correct_answer boolean not null,
  source text,
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists public.exam_attempts (
  id uuid primary key default gen_random_uuid(),
  total_questions int not null,
  correct_count int not null,
  score_percent int not null,
  created_at timestamptz not null default now()
);

create table if not exists public.exam_attempt_answers (
  id uuid primary key default gen_random_uuid(),
  attempt_id uuid not null references public.exam_attempts(id) on delete cascade,
  question_id uuid not null references public.questions(id) on delete cascade,
  selected_answer boolean not null,
  is_correct boolean not null,
  created_at timestamptz not null default now()
);

alter table public.questions enable row level security;
alter table public.exam_attempts enable row level security;
alter table public.exam_attempt_answers enable row level security;

create policy "public read questions"
  on public.questions for select
  using (is_active = true);

create policy "public insert attempts"
  on public.exam_attempts for insert
  with check (true);

create policy "public insert answers"
  on public.exam_attempt_answers for insert
  with check (true);
