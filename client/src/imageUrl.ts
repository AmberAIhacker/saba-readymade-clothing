export function getDisplayImageUrl(src: string | undefined): string | undefined {
  if (!src) return src;
  if (!/^https:\/\/drive\.google\.com(?:[/?#]|$)/i.test(src)) return src;

  const url = new URL(src);
  if (url.hostname !== "drive.google.com") return src;

  const fileId = url.pathname.match(/^\/file\/d\/([^/]+)/)?.[1] ?? url.searchParams.get("id");
  if (!fileId) return src;

  const imageUrl = new URL("https://drive.google.com/thumbnail");
  imageUrl.searchParams.set("id", fileId);
  imageUrl.searchParams.set("sz", "w1200");
  return imageUrl.toString();
}
