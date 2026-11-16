import { db } from "@/lib/db";
import { getSettings } from "@/lib/settings";
import {
  bugun, simdiSaat, gunEkle, gunFarki, kisaTarih, tarihSaat, inputDegeri, sonrakiOdeme, kalanGunMetni,
} from "@/lib/tarih";
import {
  addTask, deleteTask, toggleTask,
  careDone, addCare, deleteCare,
  addSubscription, deleteSubscription, setIncome,
  addAppointment, appointmentDone, deleteAppointment,
  medTaken, medUndo,
} from "./actions";

export const dynamic = "force-dynamic";

const kart = "rounded-2xl bg-white p-5 shadow";
const girdi = "rounded-lg border border-gray-300 px-3 py-2 focus:border-indigo-500 focus:outline-none";
const anaButon = "rounded-lg bg-indigo-600 px-4 py-2 font-medium text-white hover:bg-indigo-700";
const silButon = "rounded-lg px-2 py-1 text-sm text-red-500 hover:bg-red-50";
const tl = (n) => `${Number(n).toLocaleString("tr-TR", { maximumFractionDigits: 2 })} TL`;

// ---------------- Görevler (eski ajanda) ----------------

function TaskRow({ task, today }) {
  const overdue = !task.done && task.due_date && task.due_date < today;
  return (
    <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-gray-100 p-3">
      <div className="min-w-0">
        <p className={`font-medium ${task.done ? "text-gray-400 line-through" : ""}`}>{task.title}</p>
        {task.due_date && (
          <p className={`text-sm ${overdue ? "font-semibold text-red-600" : "text-gray-400"}`}>
            {kisaTarih(task.due_date)}
            {task.due_date === today && " · Bugün"}
            {overdue && " · Gecikti"}
          </p>
        )}
      </div>
      <div className="flex gap-2">
        <form action={toggleTask}>
          <input type="hidden" name="id" value={task.id} />
          <input type="hidden" name="done" value={String(task.done)} />
          <button
            type="submit"
            className={`rounded-lg px-3 py-1 text-sm text-white ${
              task.done ? "bg-gray-500 hover:bg-gray-600" : "bg-green-600 hover:bg-green-700"
            }`}
          >
            {task.done ? "Geri Al" : "Tamamla"}
          </button>
        </form>
        <form action={deleteTask}>
          <input type="hidden" name="id" value={task.id} />
          <button type="submit" className={silButon}>Sil</button>
        </form>
      </div>
    </div>
  );
}

function Gorevler({ tasks, today }) {
  const open = tasks.filter((t) => !t.done);
  const done = tasks.filter((t) => t.done);
  return (
    <section className={kart}>
      <h2 className="mb-3 text-lg font-semibold text-indigo-900">📝 Görevler</h2>
      <form action={addTask} className="mb-4 flex flex-wrap gap-2">
        <input name="title" required placeholder="Yeni görev veya not..." className={`min-w-0 flex-1 ${girdi}`} />
        <input name="due_date" type="date" className={girdi} />
        <button type="submit" className={anaButon}>Ekle</button>
      </form>
      <div className="space-y-2">
        {open.length === 0 && <p className="text-gray-500">Bekleyen görev yok. 🎉</p>}
        {open.map((t) => <TaskRow key={t.id} task={t} today={today} />)}
      </div>
      {done.length > 0 && (
        <details className="mt-4">
          <summary className="cursor-pointer text-sm text-gray-500">Tamamlananlar ({done.length})</summary>
          <div className="mt-2 space-y-2">
            {done.map((t) => <TaskRow key={t.id} task={t} today={today} />)}
          </div>
        </details>
      )}
    </section>
  );
}

// ---------------- Bakım ----------------

function Bakim({ items, today }) {
  return (
    <section className={kart}>
      <h2 className="mb-3 text-lg font-semibold text-indigo-900">🐦 Bakım Takibi</h2>
      <div className="space-y-2">
        {items.length === 0 && <p className="text-gray-500">Henüz bakım işi yok.</p>}
        {items.map((b) => {
          const siradaki = b.last_done ? gunEkle(b.last_done, b.interval_days) : today;
          const kalan = gunFarki(today, siradaki);
          const renk = kalan < 0 ? "text-red-600 font-semibold" : kalan === 0 ? "text-amber-600 font-semibold" : "text-gray-500";
          return (
            <div key={b.id} className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-gray-100 p-3">
              <div>
                <p className="font-medium">
                  {b.pet && <span className="text-indigo-600">{b.pet} · </span>}
                  {b.title}
                  <span className="ml-2 text-xs text-gray-400">{b.interval_days} günde bir</span>
                </p>
                <p className={`text-sm ${renk}`}>
                  {b.last_done ? `Son: ${kisaTarih(b.last_done)} · Sıradaki: ${kalanGunMetni(kalan)}` : "Henüz işaretlenmedi · Bugün yapılmalı"}
                </p>
              </div>
              <div className="flex gap-2">
                <form action={careDone}>
                  <input type="hidden" name="id" value={b.id} />
                  <button
                    type="submit"
                    disabled={b.last_done === today}
                    className="rounded-lg bg-green-600 px-3 py-1 text-sm text-white hover:bg-green-700 disabled:bg-gray-300"
                  >
                    {b.last_done === today ? "Bugün yapıldı ✓" : "Yaptım"}
                  </button>
                </form>
                <form action={deleteCare}>
                  <input type="hidden" name="id" value={b.id} />
                  <button type="submit" className={silButon}>Sil</button>
                </form>
              </div>
            </div>
          );
        })}
      </div>
      <details className="mt-4">
        <summary className="cursor-pointer text-sm text-gray-500">+ Bakım işi ekle</summary>
        <form action={addCare} className="mt-2 flex flex-wrap gap-2">
          <input name="pet" placeholder="Kim/ne (örn. Şakir)" className={`w-40 ${girdi}`} />
          <input name="title" required placeholder="İş (örn. Kum değişimi)" className={`min-w-0 flex-1 ${girdi}`} />
          <input name="interval_days" type="number" min="1" defaultValue="7" className={`w-24 ${girdi}`} title="Kaç günde bir" />
          <button type="submit" className={anaButon}>Ekle</button>
        </form>
      </details>
    </section>
  );
}

// ---------------- Abonelikler ve bütçe ----------------

function Abonelikler({ subs, income, today }) {
  const toplam = subs.reduce((s, a) => s + Number(a.monthly_price), 0);
  const oran = income > 0 ? Math.min(100, Math.round((toplam / income) * 100)) : 0;
  const kalan = income - toplam;
  const sirali = subs
    .map((a) => ({ ...a, odeme: sonrakiOdeme(a.renew_day, today) }))
    .sort((x, y) => x.odeme.localeCompare(y.odeme));

  return (
    <section className={kart}>
      <h2 className="mb-3 text-lg font-semibold text-indigo-900">💳 Abonelikler ve Bütçe</h2>

      <div className="mb-4 rounded-xl bg-indigo-50 p-4">
        <div className="flex flex-wrap justify-between gap-2 text-sm">
          <span>Aylık gelir: <b>{tl(income)}</b></span>
          <span>Abonelikler: <b>{tl(toplam)}</b> (%{oran})</span>
          <span>Kalan: <b className={kalan < 0 ? "text-red-600" : "text-green-700"}>{tl(kalan)}</b></span>
        </div>
        <div className="mt-2 h-3 overflow-hidden rounded-full bg-white">
          <div className="h-full rounded-full bg-indigo-500" style={{ width: `${oran}%` }} />
        </div>
        <p className="mt-2 text-xs text-gray-500">Yıllık abonelik toplamı: {tl(toplam * 12)}</p>
      </div>

      <div className="space-y-2">
        {sirali.map((a) => {
          const gun = gunFarki(today, a.odeme);
          return (
            <div key={a.id} className="flex items-center justify-between gap-3 rounded-xl border border-gray-100 p-3">
              <div>
                <p className="font-medium">{a.name} <span className="text-gray-500">· {tl(a.monthly_price)}</span></p>
                <p className={`text-sm ${gun <= 3 ? "font-semibold text-amber-600" : "text-gray-500"}`}>
                  Sıradaki ödeme: {kisaTarih(a.odeme)} ({kalanGunMetni(gun)}) · her ayın {a.renew_day}&apos;i
                </p>
              </div>
              <form action={deleteSubscription}>
                <input type="hidden" name="id" value={a.id} />
                <button type="submit" className={silButon}>Sil</button>
              </form>
            </div>
          );
        })}
      </div>

      <details className="mt-4">
        <summary className="cursor-pointer text-sm text-gray-500">+ Abonelik ekle / geliri değiştir</summary>
        <form action={addSubscription} className="mt-2 flex flex-wrap gap-2">
          <input name="name" required placeholder="Abonelik adı" className={`min-w-0 flex-1 ${girdi}`} />
          <input name="monthly_price" required inputMode="decimal" placeholder="Aylık TL" className={`w-28 ${girdi}`} />
          <input name="renew_day" type="number" min="1" max="31" placeholder="Gün" className={`w-20 ${girdi}`} />
          <button type="submit" className={anaButon}>Ekle</button>
        </form>
        <form action={setIncome} className="mt-2 flex flex-wrap gap-2">
          <input name="income" inputMode="decimal" defaultValue={income} className={`w-36 ${girdi}`} />
          <button type="submit" className="rounded-lg bg-white px-4 py-2 text-indigo-700 shadow hover:shadow-md">Aylık geliri kaydet</button>
        </form>
      </details>
    </section>
  );
}

// ---------------- Randevular ----------------

function Randevular({ items }) {
  const simdi = Date.now();
  const yaklasan = items.filter((r) => !r.done && Date.parse(r.starts_at) >= simdi - 3 * 3600 * 1000);
  const gecmisAcik = items.filter((r) => !r.done && Date.parse(r.starts_at) < simdi - 3 * 3600 * 1000);
  const son = [...items].filter((r) => r.done).sort((a, b) => b.starts_at.localeCompare(a.starts_at))[0];
  const oneri = son ? inputDegeri(Date.parse(son.starts_at) + 14 * 86400000) : "";

  const Satir = ({ r, gecmis }) => (
    <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-gray-100 p-3">
      <div>
        <p className="font-medium">{r.title}</p>
        <p className={`text-sm ${gecmis ? "text-amber-600" : "text-gray-500"}`}>
          {tarihSaat(r.starts_at)}{gecmis && " · Gittin mi?"}
        </p>
        {r.note && <p className="text-xs text-gray-400">{r.note}</p>}
      </div>
      <div className="flex gap-2">
        <form action={appointmentDone}>
          <input type="hidden" name="id" value={r.id} />
          <button type="submit" className="rounded-lg bg-green-600 px-3 py-1 text-sm text-white hover:bg-green-700">Gittim</button>
        </form>
        <form action={deleteAppointment}>
          <input type="hidden" name="id" value={r.id} />
          <button type="submit" className={silButon}>Sil</button>
        </form>
      </div>
    </div>
  );

  return (
    <section className={kart}>
      <h2 className="mb-3 text-lg font-semibold text-indigo-900">🗓 Randevular</h2>
      <div className="space-y-2">
        {gecmisAcik.map((r) => <Satir key={r.id} r={r} gecmis />)}
        {yaklasan.map((r) => <Satir key={r.id} r={r} />)}
        {yaklasan.length === 0 && (
          <p className="rounded-xl bg-amber-50 p-3 text-sm text-amber-700">
            Sonraki randevu tarihi belirlenmedi.
            {son && ` Son randevu: ${tarihSaat(son.starts_at)}. Aşağıda 2 hafta sonrası önerildi.`}
          </p>
        )}
      </div>
      <form action={addAppointment} className="mt-4 flex flex-wrap gap-2">
        <input name="title" defaultValue={son?.title || ""} placeholder="Randevu (örn. Terapi)" className={`min-w-0 flex-1 ${girdi}`} />
        <input name="starts_at" type="datetime-local" required defaultValue={oneri} className={girdi} />
        <button type="submit" className={anaButon}>Ekle</button>
      </form>
    </section>
  );
}

// ---------------- İlaç takibi ----------------

function Ilaclar({ meds, logs, today, saat }) {
  const son7 = Array.from({ length: 7 }, (_, i) => gunEkle(today, i - 6));
  const gunAdi = (t) => new Date(`${t}T00:00:00Z`).toLocaleDateString("tr-TR", { timeZone: "UTC", weekday: "short" });

  return (
    <section className={kart}>
      <h2 className="mb-3 text-lg font-semibold text-indigo-900">💊 İlaç Takibi</h2>
      <div className="space-y-3">
        {meds.map((m) => {
          const icilen = new Set(logs.filter((l) => l.medication_id === m.id).map((l) => l.taken_on));
          const bugunIcildi = icilen.has(today);
          const gecikti = !bugunIcildi && saat >= m.dose_time;
          return (
            <div key={m.id} className={`rounded-xl border p-3 ${gecikti ? "border-red-300 bg-red-50" : "border-gray-100"}`}>
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <p className="font-medium">{m.name} <span className="text-gray-500">· her gün {m.dose_time}</span></p>
                  <p className={`text-sm ${bugunIcildi ? "text-green-700" : gecikti ? "font-semibold text-red-600" : "text-gray-500"}`}>
                    {bugunIcildi ? "Bugün içildi ✓" : gecikti ? "Saati geçti, henüz işaretlenmedi" : "Bugün henüz içilmedi"}
                  </p>
                </div>
                <form action={bugunIcildi ? medUndo : medTaken}>
                  <input type="hidden" name="id" value={m.id} />
                  <button
                    type="submit"
                    className={`rounded-lg px-3 py-1 text-sm text-white ${bugunIcildi ? "bg-gray-500 hover:bg-gray-600" : "bg-green-600 hover:bg-green-700"}`}
                  >
                    {bugunIcildi ? "Geri al" : "İçtim"}
                  </button>
                </form>
              </div>
              <div className="mt-3 flex gap-2">
                {son7.map((g) => (
                  <div key={g} className="flex flex-col items-center gap-1 text-xs text-gray-400">
                    <span
                      className={`flex h-7 w-7 items-center justify-center rounded-full ${
                        icilen.has(g) ? "bg-green-500 text-white" : g === today ? "border-2 border-dashed border-gray-300" : "bg-gray-100"
                      }`}
                    >
                      {icilen.has(g) ? "✓" : ""}
                    </span>
                    {gunAdi(g)}
                  </div>
                ))}
              </div>
            </div>
          );
        })}
        {meds.length === 0 && <p className="text-gray-500">Kayıtlı ilaç yok.</p>}
      </div>
    </section>
  );
}

// ---------------- Sayfa ----------------

export default async function AgendaPage() {
  const today = bugun();
  const saat = simdiSaat();

  const [tasks, care, subs, appts, meds, logs, settings] = await Promise.all([
    db.select("agenda", "select=*&order=due_date.asc.nullslast,created_at.desc"),
    db.select("care_tasks", "select=*&order=pet.asc,interval_days.asc"),
    db.select("subscriptions", "select=*"),
    db.select("appointments", "select=*&order=starts_at.asc"),
    db.select("medications", "select=*&order=dose_time.asc"),
    db.select("med_logs", `select=*&taken_on=gte.${gunEkle(today, -6)}`),
    getSettings(),
  ]);
  const income = Number(settings.monthly_income || 0);

  // Üstteki "Bugün" özeti
  const bakimBekleyen = care.filter((b) => !b.last_done || gunFarki(today, gunEkle(b.last_done, b.interval_days)) <= 0).length;
  const ilacBekleyen = meds.filter((m) => !logs.some((l) => l.medication_id === m.id && l.taken_on === today)).length;
  const siradakiRandevu = appts.find((r) => !r.done && Date.parse(r.starts_at) >= Date.now());
  const siradakiOdeme = subs
    .map((a) => ({ ...a, odeme: sonrakiOdeme(a.renew_day, today) }))
    .sort((x, y) => x.odeme.localeCompare(y.odeme))[0];

  const ozet = [
    { etiket: "Bakım", deger: bakimBekleyen ? `${bakimBekleyen} iş bekliyor` : "Hepsi tamam ✓" },
    { etiket: "İlaç", deger: ilacBekleyen ? "Henüz içilmedi" : "İçildi ✓" },
    { etiket: "Sıradaki randevu", deger: siradakiRandevu ? tarihSaat(siradakiRandevu.starts_at) : "Belirlenmedi" },
    { etiket: "Sıradaki ödeme", deger: siradakiOdeme ? `${siradakiOdeme.name} · ${kisaTarih(siradakiOdeme.odeme)}` : "-" },
  ];

  return (
    <div>
      <h1 className="mb-1 text-2xl font-bold text-indigo-900">Kişisel Ajanda</h1>
      <p className="mb-5 text-sm text-gray-500">Bu sayfa sadece giriş yapan yöneticiye görünür.</p>

      <div className="mb-6 grid grid-cols-2 gap-3 md:grid-cols-4">
        {ozet.map((o) => (
          <div key={o.etiket} className="rounded-2xl bg-indigo-950 p-4 text-white">
            <p className="text-xs uppercase tracking-wide text-indigo-300">{o.etiket}</p>
            <p className="mt-1 font-semibold">{o.deger}</p>
          </div>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Bakim items={care} today={today} />
        <Ilaclar meds={meds} logs={logs} today={today} saat={saat} />
        <Randevular items={appts} />
        <Abonelikler subs={subs} income={income} today={today} />
        <div className="lg:col-span-2">
          <Gorevler tasks={tasks} today={today} />
        </div>
      </div>
    </div>
  );
}
