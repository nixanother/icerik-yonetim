-- 3 blog yazısı (Türkçe + İngilizce, kategori ve etiketli)
-- Supabase → SQL Editor'de bir kez çalıştır. Aynı adresli yazı varsa günceller.

insert into posts (title, title_en, slug, category, category_en, tags, tags_en, published, created_at, content, content_en)
values
(
  'Premiere Pro''da Multicam Kurgu: Çok Kameralı Çekimi Dakikalar İçinde Kesmek',
  'Multicam Editing in Premiere Pro: Cutting a Multi-Camera Shoot in Minutes',
  'premiere-multicam-kurgu',
  'Video Kurgu', 'Video Editing',
  'premiere pro, multicam, video kurgu, senkronizasyon',
  'premiere pro, multicam, video editing, sync',
  true, now() - interval '9 days',
$tr$Aynı anı iki ya da daha fazla kamerayla çektiğinde, görüntüleri tek tek timeline'a dizip hizalamak saatler sürebilir. Premiere Pro'nun Multi-Camera (multicam) özelliği bu işi otomatikleştirir: kameraları sese göre senkronlar, sonra sen videoyu oynatırken canlı yayın rejisi gibi kameralar arasında geçiş yaparsın.

## Çekimden önce
- Her kamerada ses kaydı açık olsun; Premiere senkronu çoğunlukla sesten yapar.
- Çekimin başında bir kez el çırp. Dalga formunda net bir tepe oluşur ve senkron kolaylaşır.
- Tüm kameralarda aynı kare hızını (ör. 25 fps) kullan.

## Adım adım multicam
1. Klipleri Project paneline aktar ve aynı ana ait olanların hepsini seç.
2. Sağ tıkla → Create Multi-Camera Source Sequence.
3. Synchronize Point olarak Audio'yu seç. Ana mikrofonu kullanmak istiyorsan Audio Sequence Settings kısmından o kameranın sesini seç.
4. Oluşan multicam klibe sağ tıkla → New Sequence From Clip ile yeni bir sekans aç.
5. Program Monitor'deki anahtar simgesinden Multi-Camera görünümünü aç. Solda tüm açılar, sağda canlı çıktı görünür.
6. Videoyu oynat ve geçmek istediğin kameraya tıkla ya da klavyeden 1, 2, 3… tuşlarına bas. Premiere her geçişte kesim yapar.

## Kesimleri düzeltmek
- Bir kesimi biraz ileri ya da geri almak için Rolling Edit aracını (N) kullan.
- Yanlış açıyı değiştirmek için kliğe sağ tıkla → Multi-Camera → istediğin kamera.
- Renk düzeltmesini kaynak multicam klibe uygularsan tüm kesimlere aynı anda yansır.
- İş bittiğinde Multi-Camera → Flatten ile sekansı normal kliplere çevirebilirsin.

## Neden işe yarıyor?
Röportaj, konser ve ders kaydı gibi uzun çekimlerde multicam sayesinde kurgu, videoyu bir kez izleme süresine iner. Asıl zaman ise senkron için değil, hikâyeye karar vermek için harcanır.$tr$,
$en$When you film the same moment with two or more cameras, lining up every clip on the timeline by hand can take hours. Premiere Pro's Multi-Camera (multicam) feature automates it: it syncs the cameras by audio, then you switch between angles while the video plays, like a live broadcast director.

## Before you shoot
- Keep audio recording on in every camera; Premiere usually syncs from sound.
- Clap once at the start. It creates a clear peak in the waveform and makes syncing easier.
- Use the same frame rate (e.g. 25 fps) on all cameras.

## Multicam step by step
1. Import the clips into the Project panel and select every clip of the same moment.
2. Right-click → Create Multi-Camera Source Sequence.
3. Choose Audio as the Synchronize Point. To use your main microphone, pick that camera's audio in Audio Sequence Settings.
4. Right-click the new multicam clip → New Sequence From Clip.
5. Turn on the Multi-Camera view from the wrench icon in the Program Monitor. All angles appear on the left, the live output on the right.
6. Play the video and click the camera you want, or press 1, 2, 3… on the keyboard. Premiere cuts at every switch.

## Fixing the cuts
- Use the Rolling Edit tool (N) to move a cut slightly earlier or later.
- To change a wrong angle, right-click the clip → Multi-Camera → the camera you want.
- Apply color correction to the source multicam clip and it shows up on every cut at once.
- When you are done, Multi-Camera → Flatten turns the sequence back into regular clips.

## Why it works
For long shoots such as interviews, concerts and lectures, multicam brings editing down to the time it takes to watch the video once. The real time goes into story decisions, not syncing.$en$
),
(
  'Premiere Pro''da Hareketli Maske ile Yüz Bulanıklaştırma',
  'Blurring a Face with a Tracked Mask in Premiere Pro',
  'premiere-hareketli-maske-yuz-blur',
  'Video Kurgu', 'Video Editing',
  'premiere pro, maske takibi, gaussian blur, gizlilik',
  'premiere pro, mask tracking, gaussian blur, privacy',
  true, now() - interval '6 days',
$tr$Bir videoda izin almadığın birinin yüzü görünüyorsa ya da bir plakayı gizlemen gerekiyorsa, Premiere Pro'da ek eklenti kurmadan çözüm var: efektin içine maske çizip bu maskeyi kişiyle birlikte hareket ettirmek.

## Adım adım
1. Klibi timeline'a koy. Effects panelinde Gaussian Blur'u ara (Video Effects → Blur & Sharpen) ve klibin üzerine sürükle.
2. Effect Controls panelinde Gaussian Blur'un altındaki elips simgesine tıkla. Görüntüde bir maske belirir.
3. Maskeyi yüzün üzerine taşı, kenar noktalarından boyutlandır.
4. Blurriness değerini 60–100 arası yap ve Repeat Edge Pixels kutusunu işaretle; kenarlarda koyu halka oluşmaz.
5. Mask Feather değerini biraz artır, bulanıklık kenarı yumuşak geçsin.
6. Mask Path satırındaki ileri oynat düğmesine (Track selected mask forward) bas. Premiere yüzü kare kare takip eder.

## Takip kayarsa
- Takip yöntemini anahtar simgesinden Position, Scale & Rotation yap; kişi kameraya yaklaşıp uzaklaştığında maske de büyüyüp küçülür.
- Maskenin kaydığı kareye git, maskeyi elle düzelt ve oradan tekrar takip ettir. Her düzeltme yeni bir anahtar kare olur.
- Hızlı harekette takibi tek kare ilerleten düğmeyle adım adım yapmak daha güvenlidir.

## Birden fazla yüz
Her yüz için aynı efektin içine yeni bir elips maske ekleyebilir veya efekti çoğaltabilirsin. Bulanıklık yerine pikselli görünüm istiyorsan Gaussian Blur yerine Mosaic efektini aynı yöntemle kullan.

## Son kontrol
Kliği baştan sona normal hızda izle. Tek bir karede bile yüz açıkta kalıyorsa gizlilik bozulur; o kareyi bulup maskeyi düzelt.$tr$,
$en$If someone who did not give permission appears in your video, or you need to hide a licence plate, Premiere Pro can handle it without any plugin: draw a mask inside an effect and let it follow the person.

## Step by step
1. Put the clip on the timeline. Search for Gaussian Blur in the Effects panel (Video Effects → Blur & Sharpen) and drag it onto the clip.
2. In Effect Controls, click the ellipse icon under Gaussian Blur. A mask appears on the image.
3. Move the mask over the face and resize it from its edge points.
4. Set Blurriness to 60–100 and tick Repeat Edge Pixels so no dark ring appears at the edges.
5. Raise Mask Feather a little so the blur edge blends softly.
6. Press the play button on the Mask Path row (Track selected mask forward). Premiere follows the face frame by frame.

## If the track drifts
- Set the tracking method to Position, Scale & Rotation from the wrench icon; the mask then grows and shrinks as the person moves toward or away from the camera.
- Go to the frame where the mask slipped, fix it by hand and track again from there. Every fix becomes a new keyframe.
- For fast movement, tracking one frame at a time with the single-frame button is safer.

## More than one face
Add a new ellipse mask inside the same effect for each face, or duplicate the effect. For a pixelated look instead of blur, use the Mosaic effect the same way.

## Final check
Watch the clip from start to finish at normal speed. If the face is visible in even one frame, privacy is broken; find that frame and fix the mask.$en$
),
(
  'PT-App: ASP.NET Core MVC ile Kişisel Antrenör ve Danışan Uygulaması',
  'PT-App: A Personal Trainer and Client App with ASP.NET Core MVC',
  'pt-app-aspnet-core',
  'Yazılım', 'Software',
  'asp.net core, mvc, entity framework, sistem analizi, c#',
  'asp.net core, mvc, entity framework, systems analysis, c#',
  true, now() - interval '3 days',
$tr$PT-App, Sistem Analizi dersi için geliştirdiğim bir kişisel antrenör (koç) ve danışan uygulaması. Amaç; koçun danışanlarına antrenman programı atayabildiği, danışanın da ilerlemesini kaydedebildiği sade bir sistem kurmak. Fikir aşamasında Hevy uygulamasının antrenör bölümünü örnek aldım.

## Kullandığım teknolojiler
- ASP.NET Core MVC (C#), geliştirme ortamı olarak VS Code
- Entity Framework Core ile veritabanı erişimi
- Geliştirme sırasında SQLite, canlı sürümde MSSQL
- Canlı yayın için MonsterASP.NET ücretsiz barındırma

## Veri modeli
Uygulama beş ana modelden oluşuyor:
- Koc: antrenör bilgileri ve profili
- Musteri: danışan bilgileri
- Rutin: antrenman rutinleri ve hareketler
- AtananProgram: hangi koçun hangi danışana hangi rutini atadığı
- Ilerleme: danışanın girdiği kilo ve gelişim kayıtları
Hepsi AppDbContext üzerinden yönetiliyor; tablolar EF Core migration'larıyla oluşturuluyor.

## Geliştirme adımları
1. Model ve veritabanı tasarımı: sınıfları ve aralarındaki ilişkileri belirledim.
2. Giriş ve kayıt: kullanıcılar koç ya da danışan rolüyle kaydoluyor, her rol kendi ekranlarını görüyor.
3. Program atama: koç, danışanına rutin atayabiliyor.
4. İlerleme takibi: danışan kilosunu girip gelişimini izleyebiliyor.
5. Koçluk talebi: danışanın bir koçu anında seçmesi gerçekçi gelmedi; bunun yerine danışan talep gönderiyor, koç onaylıyor.
6. Canlıya alma: uygulamayı veritabanıyla birlikte internette yayınladım.

## Öğrendiklerim
MVC'de model, görünüm ve denetleyiciyi ayırmak kodu düzenli tutuyor. Rol tabanlı yetkilendirme, bir sayfayı kimin görebileceğini baştan düşünmeyi gerektiriyor. Yerelde SQLite ile hızlı ilerleyip canlıda MSSQL'e geçmek ise bağlantı ayarlarını ortam değişkenlerine taşımanın neden önemli olduğunu gösterdi.$tr$,
$en$PT-App is a personal trainer (coach) and client app I built for my Systems Analysis course. The goal is a simple system where a coach assigns workout programs to clients and clients record their progress. During the idea stage I used the trainer section of the Hevy app as a reference.

## Tech stack
- ASP.NET Core MVC (C#), developed in VS Code
- Entity Framework Core for database access
- SQLite during development, MSSQL in the live version
- MonsterASP.NET free hosting for the live site

## Data model
The app is built on five main models:
- Koc (Coach): trainer details and profile
- Musteri (Client): client details
- Rutin (Routine): workout routines and exercises
- AtananProgram (Assigned program): which coach assigned which routine to which client
- Ilerleme (Progress): weight and progress records entered by the client
All of them are managed through AppDbContext; tables are created with EF Core migrations.

## Development steps
1. Model and database design: I defined the classes and their relationships.
2. Login and registration: users sign up as a coach or a client, and each role sees its own screens.
3. Program assignment: a coach can assign routines to a client.
4. Progress tracking: a client enters their weight and follows their progress.
5. Coaching request: picking a coach instantly felt unrealistic, so the client sends a request and the coach approves it.
6. Going live: I published the app online together with its database.

## What I learned
Separating model, view and controller in MVC keeps the code organised. Role-based authorisation makes you think early about who can see each page. Moving fast with SQLite locally and switching to MSSQL in production showed why connection settings belong in environment variables.$en$
)
on conflict (slug) do update set
  title = excluded.title, title_en = excluded.title_en,
  category = excluded.category, category_en = excluded.category_en,
  tags = excluded.tags, tags_en = excluded.tags_en,
  content = excluded.content, content_en = excluded.content_en,
  published = excluded.published;
