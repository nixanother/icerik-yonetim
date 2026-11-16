// Supabase (PostgREST) ile konuşan küçük yardımcı.
// Ek paket gerekmez, sadece fetch kullanır. Sadece SUNUCU tarafında çalışır.

const url = process.env.SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

async function request(path, { method = "GET", body, prefer } = {}) {
  if (!url || !key) {
    throw new Error("SUPABASE_URL ve SUPABASE_SERVICE_ROLE_KEY ortam değişkenleri tanımlı değil.");
  }

  const res = await fetch(`${url}/rest/v1/${path}`, {
    method,
    headers: {
      apikey: key,
      Authorization: `Bearer ${key}`,
      "Content-Type": "application/json",
      ...(prefer ? { Prefer: prefer } : {}),
    },
    body: body ? JSON.stringify(body) : undefined,
    cache: "no-store",
  });

  if (!res.ok) {
    throw new Error(`Veritabanı hatası (${res.status}): ${await res.text()}`);
  }

  const text = await res.text();
  return text ? JSON.parse(text) : null;
}

export const db = {
  // db.select("posts", "select=*&order=created_at.desc")
  select: (table, query = "select=*") => request(`${table}?${query}`),
  insert: (table, row) =>
    request(table, { method: "POST", body: row, prefer: "return=representation" }),
  // db.update("posts", "id=eq.5", { title: "Yeni" })
  update: (table, match, values) =>
    request(`${table}?${match}`, { method: "PATCH", body: values, prefer: "return=representation" }),
  // Satır varsa günceller, yoksa ekler (onConflict: benzersiz sütun adı)
  upsert: (table, row, onConflict) =>
    request(`${table}?on_conflict=${onConflict}`, {
      method: "POST",
      body: row,
      prefer: "resolution=merge-duplicates,return=representation",
    }),
  remove: (table, match) => request(`${table}?${match}`, { method: "DELETE" }),
};
