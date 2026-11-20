# Kurulum

## 1. Supabase projesi
1. https://supabase.com adresinde hesap aç, **New project** de (ad: icerik-yonetim, bir veritabanı şifresi belirle, bölge: Frankfurt).
2. Proje hazır olunca soldan **SQL Editor** → **New query** aç, aşağıdaki SQL'in **tamamını** yapıştırıp **Run**'a bas:

```sql
-- Makaleler
create table posts (
  id bigint generated always as identity primary key,
  title text not null,
  slug text not null unique,
  content text not null default '',
  published boolean not null default false,
  created_at timestamptz not null default now()
);

-- Ajanda
create table agenda (
  id bigint generated always as identity primary key,
  title text not null,
  due_date date,
  done boolean not null default false,
  created_at timestamptz not null default now()
);

-- Galeri (resim dosyaları Storage'da, burada sadece yolu tutulur)
create table gallery (
  id bigint generated always as identity primary key,
  title text not null default '',
  image_path text not null,
  created_at timestamptz not null default now()
);

-- Hakkında sayfası gibi site ayarları
create table site_settings (
  key text primary key,
  value text not null default ''
);

-- Tablolara dışarıdan doğrudan erişimi kapat (sadece sunucu anahtarıyla erişilir)
alter table posts enable row level security;
alter table agenda enable row level security;
alter table gallery enable row level security;
alter table site_settings enable row level security;

-- Herkese açık resim kovası
insert into storage.buckets (id, name, public)
values ('galeri', 'galeri', true)
on conflict (id) do nothing;
```

> **İlk SQL'i daha önce çalıştırdıysan:** yukarıdakini tekrar çalıştırma (tablolar zaten var hatası verir). Onun yerine proje klasöründeki `GUNCELLEME-SQL.sql` dosyasının içeriğini SQL Editor'de çalıştır. Yeni kurulumda önce yukarıdakini, sonra `GUNCELLEME-SQL.sql` dosyasını çalıştır.

3. **Project Settings → API** sayfasından şunları not al:
   - **Project URL** (https://xxxx.supabase.co)
   - **service_role** anahtarı ("secret" olarak görünebilir). Bu anahtarı kimseyle paylaşma, GitHub'a koyma.

## 2. Yerel çalıştırma (.env.local)
Proje klasöründe `.env.local` adlı dosya oluştur (zaten .gitignore içinde, GitHub'a gitmez):

```
SUPABASE_URL=https://xxxx.supabase.co
SUPABASE_SERVICE_ROLE_KEY=buraya_service_role_anahtari
ADMIN_USERNAME=admin
ADMIN_PASSWORD=kendi_belirledigin_sifre
SESSION_SECRET=en_az_32_karakterlik_rastgele_bir_metin
```

Sonra terminalde `npm run dev` çalıştır, http://localhost:3000 adresini aç.

## 3. Vercel'de yayın
1. Kodları GitHub'a gönder (git add . → git commit → git push).
2. Vercel'de projeni aç → **Settings → Environment Variables**. Yukarıdaki 5 değişkeni aynı adlarla ekle.
3. **Deployments** sekmesinden son dağıtımı **Redeploy** et.

## 4. Blog yazıları (vize için 3 yazı)
SQL Editor'de proje klasöründeki `BLOG-YAZILARI-SQL.sql` dosyasının içeriğini çalıştır. Premiere Multicam, hareketli maske ile yüz blur ve PT-App yazıları Türkçe + İngilizce, kategori ve etiketleriyle eklenir. Sonra yönetim panelinden istediğin gibi düzenleyebilirsin.

## 5. Animasyon paketleri
Site GSAP (ScrollTrigger) ve Lenis kullanır. Proje klasöründe bir kez şunu çalıştır:

```
npm install gsap lenis
```

## 6. Panel yenilikleri
Mesajlarda okundu/okunmadı ve makalelerde "öne çıkar" için `GUNCELLEME-2-SQL.sql` dosyasını SQL Editor'de bir kez çalıştır.
