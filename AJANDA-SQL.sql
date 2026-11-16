-- =========================================================
-- Kişisel Ajanda modülleri (Supabase > SQL Editor'de bir kez çalıştır)
-- Tablolar zaten varsa tekrar çalıştırmak sorun çıkarmaz.
-- =========================================================

-- Evcil hayvan / ev bakımı: her iş belirli günde bir tekrarlanır
create table if not exists care_tasks (
  id bigint generated always as identity primary key,
  pet text not null default '',
  title text not null,
  interval_days int not null default 1,
  last_done date,
  created_at timestamptz not null default now()
);

-- Aylık abonelikler
create table if not exists subscriptions (
  id bigint generated always as identity primary key,
  name text not null,
  monthly_price numeric(10,2) not null default 0,
  renew_day int not null default 1,
  created_at timestamptz not null default now()
);

-- Randevular (örn. terapi seansları)
create table if not exists appointments (
  id bigint generated always as identity primary key,
  title text not null,
  starts_at timestamptz not null,
  note text not null default '',
  done boolean not null default false,
  created_at timestamptz not null default now()
);

-- İlaçlar ve günlük "içtim" kayıtları
create table if not exists medications (
  id bigint generated always as identity primary key,
  name text not null,
  dose_time text not null default '22:00',
  created_at timestamptz not null default now()
);

create table if not exists med_logs (
  id bigint generated always as identity primary key,
  medication_id bigint not null references medications(id) on delete cascade,
  taken_on date not null,
  unique (medication_id, taken_on)
);

alter table care_tasks enable row level security;
alter table subscriptions enable row level security;
alter table appointments enable row level security;
alter table medications enable row level security;
alter table med_logs enable row level security;

-- ---------- Başlangıç verileri (tablolar boşsa eklenir) ----------

insert into care_tasks (pet, title, interval_days)
select * from (values
  ('Şakir', 'Su değişimi', 2),
  ('Şakir', 'Yem', 2),
  ('Şakir', 'Kafes temizliği', 7)
) v(pet, title, interval_days)
where not exists (select 1 from care_tasks);

insert into subscriptions (name, monthly_price, renew_day)
select * from (values
  ('Spotify', 60, 16),
  ('YouTube Premium', 120, 30),
  ('Claude', 1200, 8)
) v(name, monthly_price, renew_day)
where not exists (select 1 from subscriptions);

insert into site_settings (key, value) values ('monthly_income', '4000')
on conflict (key) do nothing;

insert into appointments (title, starts_at)
select 'Terapi', '2026-11-19 14:00:00+03'
where not exists (select 1 from appointments);

insert into medications (name, dose_time)
select 'Selectra', '22:00'
where not exists (select 1 from medications);
