import { db } from "@/lib/db";
import { deleteMessage, toggleRead, markAllRead } from "./actions";

export const dynamic = "force-dynamic";

export default async function AdminMessagesPage() {
  const messages = await db.select("messages", "select=*&order=created_at.desc");
  // is_read sütunu yoksa (SQL çalıştırılmadıysa) özellik gizlenir
  const hasReadColumn = messages.length === 0 || "is_read" in messages[0];
  const unread = messages.filter((m) => m.is_read === false).length;

  return (
    <div>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-bold text-indigo-900">
          Gelen Mesajlar
          {unread > 0 && (
            <span className="ml-3 rounded-full bg-pink-500 px-3 py-1 align-middle text-sm text-white">
              {unread} okunmamış
            </span>
          )}
        </h1>
        {unread > 0 && (
          <form action={markAllRead}>
            <button type="submit" className="rounded-lg bg-white px-4 py-2 text-sm text-indigo-700 shadow hover:shadow-md">
              Hepsini okundu yap
            </button>
          </form>
        )}
      </div>

      {!hasReadColumn && (
        <div className="mb-4 rounded-lg bg-amber-50 px-4 py-2 text-sm text-amber-800">
          Okundu/okunmadı özelliği için GUNCELLEME-2-SQL.sql dosyasını Supabase&apos;de çalıştır.
        </div>
      )}

      {messages.length === 0 && (
        <div className="rounded-2xl bg-white p-6 text-gray-500 shadow">Henüz mesaj yok.</div>
      )}

      <div className="space-y-3">
        {messages.map((m) => {
          const isUnread = m.is_read === false;
          return (
            <div
              key={m.id}
              className={`rounded-2xl p-4 shadow ${
                isUnread ? "border-l-4 border-pink-500 bg-pink-50" : "bg-white"
              }`}
            >
              <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
                <p className="font-semibold">
                  {isUnread && <span className="mr-2 inline-block h-2.5 w-2.5 rounded-full bg-pink-500" />}
                  {m.name} <span className="font-normal text-gray-500">&lt;{m.email}&gt;</span>
                </p>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-gray-400">{new Date(m.created_at).toLocaleString("tr-TR")}</span>
                  {hasReadColumn && (
                    <form action={toggleRead}>
                      <input type="hidden" name="id" value={m.id} />
                      <input type="hidden" name="is_read" value={String(Boolean(m.is_read))} />
                      <button
                        type="submit"
                        className={`rounded-lg px-3 py-1 text-sm ${
                          isUnread ? "bg-pink-500 text-white hover:bg-pink-600" : "bg-gray-100 hover:bg-gray-200"
                        }`}
                      >
                        {isUnread ? "Okundu yap" : "Okunmadı yap"}
                      </button>
                    </form>
                  )}
                  <a
                    href={`mailto:${m.email}`}
                    className="rounded-lg bg-indigo-600 px-3 py-1 text-sm text-white hover:bg-indigo-700"
                  >
                    Yanıtla
                  </a>
                  <form action={deleteMessage}>
                    <input type="hidden" name="id" value={m.id} />
                    <button type="submit" className="rounded-lg bg-red-500 px-3 py-1 text-sm text-white hover:bg-red-600">
                      Sil
                    </button>
                  </form>
                </div>
              </div>
              <p className="whitespace-pre-wrap text-gray-700">{m.message}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}
