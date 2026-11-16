-- Makalelere ikinci dil, kategori ve etiket
alter table posts add column if not exists title_en text not null default '';
alter table posts add column if not exists content_en text not null default '';
alter table posts add column if not exists category text not null default '';
alter table posts add column if not exists category_en text not null default '';
alter table posts add column if not exists tags text not null default '';
alter table posts add column if not exists tags_en text not null default '';

-- Galeri açıklaması için İngilizce alan
alter table gallery add column if not exists title_en text not null default '';

-- Projeler
create table if not exists projects (
  id bigint generated always as identity primary key,
  title text not null,
  title_en text not null default '',
  description text not null default '',
  description_en text not null default '',
  link text not null default '',
  image_path text not null default '',
  created_at timestamptz not null default now()
);

-- Yetenekler (seviye 0-100)
create table if not exists skills (
  id bigint generated always as identity primary key,
  name text not null,
  level int not null default 50,
  sort int not null default 0
);

-- İletişim formundan gelen mesajlar
create table if not exists messages (
  id bigint generated always as identity primary key,
  name text not null,
  email text not null,
  message text not null,
  created_at timestamptz not null default now()
);

alter table projects enable row level security;
alter table skills enable row level security;
alter table messages enable row level security;
