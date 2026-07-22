export const WA_SALES = process.env.NEXT_PUBLIC_WHATSAPP_SALES || "50942667936";
export const WA_SUPPORT = process.env.NEXT_PUBLIC_WHATSAPP_SUPPORT || "50947830897";

export function waLink(number: string, text: string) {
  return `https://wa.me/${number}?text=${encodeURIComponent(text)}`;
}

export function formatHTG(n: number) {
  return n.toLocaleString("fr-FR") + " HTG";
}
