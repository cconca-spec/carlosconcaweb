/** Minúsculas y sin acentos: "Matemática" y "matematica" quedan iguales. */
export function normalize(text: string): string {
  return text.normalize('NFD').replace(/\p{Diacritic}/gu, '').toLowerCase()
}
