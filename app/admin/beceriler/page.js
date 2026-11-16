import { db } from "@/lib/db";
import { addSkill, deleteSkill } from "./actions";

export const dynamic = "force-dynamic";

export default async function AdminSkillsPage() {
  const skills = await db.select("skills", "select=*&order=sort.asc,id.asc");

  return (
    <div>
      <h1 className="mb-4 text-2xl font-bold text-indigo-900">Yetenekler</h1>

      <form action={addSkill} className="mb-6 flex flex-wrap gap-3 rounded-2xl bg-white p-5 shadow">
        <input
          name="name"
          required
          placeholder="Yetenek (örn. HTML)"
          className="min-w-0 flex-1 rounded-lg border border-gray-300 px-3 py-2 focus:border-indigo-500 focus:outline-none"
        />
        <input
          name="level"
          type="number"
          min="0"
          max="100"
          required
          placeholder="Seviye %"
          className="w-28 rounded-lg border border-gray-300 px-3 py-2 focus:border-indigo-500 focus:outline-none"
        />
        <button type="submit" className="rounded-lg bg-indigo-600 px-5 py-2 font-medium text-white hover:bg-indigo-700">
          Ekle
        </button>
      </form>

      {skills.length === 0 && (
        <div className="rounded-2xl bg-white p-6 text-gray-500 shadow">Henüz yetenek yok.</div>
      )}

      <div className="space-y-3">
        {skills.map((s) => (
          <div key={s.id} className="flex items-center gap-4 rounded-2xl bg-white p-4 shadow">
            <div className="min-w-0 flex-1">
              <div className="mb-1 flex justify-between text-sm font-medium">
                <span>{s.name}</span>
                <span>%{s.level}</span>
              </div>
              <div className="h-2 overflow-hidden rounded-full bg-gray-200">
                <div className="h-full rounded-full bg-indigo-500" style={{ width: `${s.level}%` }} />
              </div>
            </div>
            <form action={deleteSkill}>
              <input type="hidden" name="id" value={s.id} />
              <button type="submit" className="rounded-lg bg-red-500 px-3 py-1 text-sm text-white hover:bg-red-600">
                Sil
              </button>
            </form>
          </div>
        ))}
      </div>
    </div>
  );
}
