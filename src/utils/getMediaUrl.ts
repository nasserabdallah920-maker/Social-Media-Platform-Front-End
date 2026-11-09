/**
 * تحويل أي URL صورة (نسبي أو كامل) إلى URL قابل للاستخدام.
 * - لو الـ URL فيه http/https → يُرجعه كما هو
 * - لو الـ URL نسبي → يُضيف قاعدة الـ API
 * - لو الـ URL فاضي أو null أو string "null" → يُرجع ""
 */
export function getMediaUrl(url?: string | null): string {
  if (!url || url === "null" || url.trim() === "") return "";
  if (url.startsWith("http://") || url.startsWith("https://")) return url;
  const base = process.env.NEXT_PUBLIC_API_URL ?? "";
  return base + url;
}
