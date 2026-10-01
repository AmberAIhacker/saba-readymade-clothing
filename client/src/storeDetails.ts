export const DEFAULT_PHONE = "918210869821";
export const DEFAULT_WHATSAPP = "918210869821";
export const DEFAULT_ADDRESS = "Gudri Bazar, Laheriyasarai, Darbhanga, Bihar";

export function phoneLink(phone: string): string | null {
  const digits = phone.replace(/\D/g, "");
  return digits.length >= 7 ? `tel:${phone.replace(/[^\d+]/g, "")}` : null;
}

export function whatsappLink(phone: string): string | null {
  const digits = phone.replace(/\D/g, "");
  if (digits.length < 7) return null;
  const number = digits.length === 10 ? `91${digits}` : digits.length === 11 && digits.startsWith("0") ? `91${digits.slice(1)}` : digits;
  return `https://wa.me/${number}`;
}

export function mapsLink(address: string): string | null {
  if (!address.trim() || address.trim() === "Shop address to be added") return null;
  return `https://maps.google.com/?q=${encodeURIComponent(address.trim())}`;
}
