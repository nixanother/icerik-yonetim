import { db } from "@/lib/db";
import { deleteMessage } from "./actions";

export const dynamic = "force-dynamic";

export default async function AdminMessagesPage() {
  const messages = await db.select("messages", "select=*&order=created_at.desc");

  return (
    <div>
      <h1 className="mb-4 text-2xl font-bold text-indigo-900">Gelen Mesajlar</h1>

      {messages.length === 0 && (
        <div className="rounded-2xl bg-white p-6 text-gray-500 shadow">Henüz mesaj yok.</div>
      )}

      <div className="space-y-3">
        {messages.map((m) => (
          <div key={m.id} className="rounded-2xl bg-white p-4 shadow">
            <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
              <p className="font-semibold">
                {m.name} <span className="font-normal text-gray-500">&lt;{m.email}&gt;</span>
              </p>
              <div className="flex items-center gap-3">
                <span className="text-sm text-gray-400">
                  {new Date(m.created_at).toLocaleString("tr-TR")}
                </span>
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
        ))}
      </div>
    </div>
  );
}
