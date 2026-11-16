// YouTube linkinden gömülü oynatıcı adresi üretir (geçersizse null)
export function youtubeEmbed(link) {
  const text = String(link || "").trim();
  if (!text) return null;
  const match =
    text.match(/(?:youtu\.be\/|[?&]v=|\/embed\/|\/shorts\/)([A-Za-z0-9_-]{11})/) || null;
  return match ? `https://www.youtube.com/embed/${match[1]}` : null;
}
