// Supabase Storage ("galeri" kovası) ile resim yükleme/silme. Sadece SUNUCU tarafında çalışır.

const url = process.env.SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
const BUCKET = "galeri";

// Herkese açık resim adresi
export function publicUrl(path) {
  return `${url}/storage/v1/object/public/${BUCKET}/${path}`;
}

export async function uploadToStorage(file) {
  const ext = (file.name.split(".").pop() || "jpg").toLowerCase().replace(/[^a-z0-9]/g, "");
  const path = `${Date.now()}-${crypto.randomUUID().slice(0, 8)}.${ext || "jpg"}`;

  const res = await fetch(`${url}/storage/v1/object/${BUCKET}/${path}`, {
    method: "POST",
    headers: {
      apikey: key,
      Authorization: `Bearer ${key}`,
      "Content-Type": file.type || "application/octet-stream",
    },
    body: Buffer.from(await file.arrayBuffer()),
  });

  if (!res.ok) {
    throw new Error(`Depolama hatası (${res.status}): ${await res.text()}`);
  }
  return path;
}

export async function removeFromStorage(path) {
  await fetch(`${url}/storage/v1/object/${BUCKET}/${path}`, {
    method: "DELETE",
    headers: { apikey: key, Authorization: `Bearer ${key}` },
  });
}
