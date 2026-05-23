export const SPECIALTIES = [
  {
    id: "internal-medicine",
    label: { en: "Internal Medicine", ar: "الباطنية" },
    enabled: true,
  },
  {
    id: "psychiatry",
    label: { en: "Psychiatry", ar: "الطب النفسي" },
    enabled: false,
  },
  {
    id: "surgery",
    label: { en: "Surgery", ar: "الجراحة" },
    enabled: false,
  },
  {
    id: "pediatrics",
    label: { en: "Pediatrics", ar: "طب الأطفال" },
    enabled: false,
  },
  {
    id: "obstetrics",
    label: { en: "Obstetrics & Gynecology", ar: "النساء والتوليد" },
    enabled: false,
  },
] as const;

export type SpecialtyId = (typeof SPECIALTIES)[number]["id"];

export function getSpecialtyLabel(id: SpecialtyId, locale: string): string {
  const s = SPECIALTIES.find((x) => x.id === id);
  if (!s) return id;
  return locale === "ar" ? s.label.ar : s.label.en;
}
