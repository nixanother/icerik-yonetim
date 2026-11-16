import { cookies } from "next/headers";

// Seçili dil çerezden okunur (varsayılan: Türkçe)
export async function getLang() {
  const value = (await cookies()).get("lang")?.value;
  return value === "en" ? "en" : "tr";
}

// Satırda "alan_en" doluysa İngilizce, değilse Türkçe alanı döndürür
export function pick(row, field, lang) {
  if (!row) return "";
  if (lang === "en" && row[`${field}_en`]) return row[`${field}_en`];
  return row[field] ?? "";
}

// "a, b, c" veya satır satır metni diziye çevirir
export function splitList(text) {
  return String(text || "")
    .split(/[,\n]/)
    .map((s) => s.trim())
    .filter(Boolean);
}

export const dateLocale = (lang) => (lang === "en" ? "en-GB" : "tr-TR");

export const dict = {
  tr: {
    siteName: "İçerik Yönetim Sistemi",
    home: "Ana Sayfa",
    articles: "Makaleler",
    gallery: "Galeri",
    about: "Hakkımda",
    projects: "Projeler",
    contact: "İletişim",
    panel: "Yönetim Paneli",
    logout: "Çıkış Yap",
    login: "Yönetici Girişi",
    heroText: "Projelerim, makalelerim ve fotoğraflarım tek yerde.",
    readArticles: "Makaleleri Oku",
    all: "Tümü →",
    latestArticles: "Son Makaleler",
    noPosts: "Henüz yayınlanmış makale yok.",
    noImages: "Galeride henüz resim yok.",
    noProjects: "Henüz proje eklenmedi.",
    readMore: "Devamını oku",
    back: "← Tüm makaleler",
    category: "Kategori",
    tags: "Etiketler",
    filter: "Filtre",
    clearFilter: "Filtreyi temizle",
    articlesIntro: "Yönetim panelinden yayınlanan makaleler.",
    galleryIntro: "Beni en çok yansıtan fotoğraflar.",
    projectsIntro: "Derslerde ve kendi çalışmalarımda hazırladığım projeler.",
    visit: "Projeyi gör",
    education: "Eğitim",
    interests: "İlgi Alanları",
    skills: "Yetenekler",
    video: "Kendimi Tanıtıyorum",
    aboutEmpty: "Bu sayfa henüz düzenlenmedi.",
    contactIntro: "Bana ulaşmak için formu doldurabilir veya aşağıdaki bilgileri kullanabilirsin.",
    address: "Adres",
    phone: "Telefon",
    email: "E-posta",
    name: "Ad Soyad",
    message: "Mesaj",
    send: "Gönder",
    sending: "Gönderiliyor...",
    sent: "Mesajın alındı, teşekkürler!",
    contactInvalid: "Lütfen ad, geçerli bir e-posta ve mesaj gir.",
    contactError: "Mesaj gönderilemedi, lütfen tekrar dene.",
  },
  en: {
    siteName: "Content Management System",
    home: "Home",
    articles: "Articles",
    gallery: "Gallery",
    about: "About",
    projects: "Projects",
    contact: "Contact",
    panel: "Admin Panel",
    logout: "Log out",
    login: "Admin Login",
    heroText: "My projects, articles and photos in one place.",
    readArticles: "Read Articles",
    all: "View all →",
    latestArticles: "Latest Articles",
    noPosts: "No published articles yet.",
    noImages: "No images in the gallery yet.",
    noProjects: "No projects added yet.",
    readMore: "Read more",
    back: "← All articles",
    category: "Category",
    tags: "Tags",
    filter: "Filter",
    clearFilter: "Clear filter",
    articlesIntro: "Articles published from the admin panel.",
    galleryIntro: "Photos that reflect me the most.",
    projectsIntro: "Projects I made in my courses and on my own.",
    visit: "View project",
    education: "Education",
    interests: "Interests",
    skills: "Skills",
    video: "Introducing Myself",
    aboutEmpty: "This page has not been edited yet.",
    contactIntro: "You can fill in the form or use the details below to reach me.",
    address: "Address",
    phone: "Phone",
    email: "Email",
    name: "Full name",
    message: "Message",
    send: "Send",
    sending: "Sending...",
    sent: "Your message was received, thank you!",
    contactInvalid: "Please enter your name, a valid email and a message.",
    contactError: "The message could not be sent, please try again.",
  },
};
