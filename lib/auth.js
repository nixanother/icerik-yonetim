import { cookies } from "next/headers";
import { redirect } from "next/navigation";

// Basit, imzalı çerez (cookie) ile yönetici oturumu.
// Çerezin içeriği "admin.<bitiş zamanı>.<imza>" biçimindedir; imza SESSION_SECRET ile HMAC-SHA256'dır.
// Böylece çerez sahte üretilemez ve süresi dolunca geçersiz olur.

const COOKIE_NAME = "admin_session";
const SESSION_SECONDS = 60 * 60 * 8; // 8 saat

const encoder = new TextEncoder();

async function sign(value) {
  const secret = process.env.SESSION_SECRET;
  if (!secret) throw new Error("SESSION_SECRET ortam değişkeni tanımlı değil.");

  const cryptoKey = await crypto.subtle.importKey(
    "raw",
    encoder.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const signature = await crypto.subtle.sign("HMAC", cryptoKey, encoder.encode(value));
  return Buffer.from(signature).toString("hex");
}

// Zamanlama saldırılarına karşı sabit süreli karşılaştırma
export function safeEqual(a, b) {
  const x = String(a);
  const y = String(b);
  let diff = x.length ^ y.length;
  const length = Math.max(x.length, y.length);
  for (let i = 0; i < length; i++) {
    diff |= (x.charCodeAt(i) || 0) ^ (y.charCodeAt(i) || 0);
  }
  return diff === 0;
}

export async function startSession() {
  const expires = Date.now() + SESSION_SECONDS * 1000;
  const payload = `admin.${expires}`;
  const token = `${payload}.${await sign(payload)}`;

  const store = await cookies();
  store.set(COOKIE_NAME, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: SESSION_SECONDS,
  });
}

export async function endSession() {
  const store = await cookies();
  store.delete(COOKIE_NAME);
}

export async function isAdmin() {
  const store = await cookies();
  const token = store.get(COOKIE_NAME)?.value;
  if (!token) return false;

  const [role, expires, signature] = token.split(".");
  if (role !== "admin" || !expires || !signature) return false;
  if (Number(expires) < Date.now()) return false;

  const expected = await sign(`${role}.${expires}`);
  return safeEqual(signature, expected);
}

// Yönetici gerektiren sayfa ve işlemlerin başında çağrılır
export async function requireAdmin() {
  if (!(await isAdmin())) redirect("/giris");
}
