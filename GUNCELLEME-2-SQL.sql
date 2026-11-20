-- Panel yenilikleri: mesajlarda okundu bilgisi, makalelerde "öne çıkar"
-- Supabase → SQL Editor'de bir kez çalıştır.
alter table messages add column if not exists is_read boolean not null default false;
alter table posts add column if not exists featured boolean not null default false;
