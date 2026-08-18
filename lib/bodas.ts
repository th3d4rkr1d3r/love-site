import { addYearsSaoPaulo, calendarDaysBetween } from "@/lib/date-utils";

export type Boda = {
  years: number;
  name: string;
  meaning: string;
  icon: "paper" | "cotton" | "leather" | "flowers" | "wood" | "perfume" | "brass" | "bronze" | "ceramic" | "tin" | "crystal" | "porcelain" | "silver";
};

export const BODAS: Boda[] = [
  { years: 1, name: "Papel", icon: "paper", meaning: "A primeira folha da nossa história — leve, e já impossível de apagar." },
  { years: 2, name: "Algodão", icon: "cotton", meaning: "Macio, próximo, do dia a dia. O conforto de ter um ao outro." },
  { years: 3, name: "Couro", icon: "leather", meaning: "O que o tempo deixa mais firme. Resistência com carinho." },
  { years: 4, name: "Flores", icon: "flowers", meaning: "Beleza que se renova. Continuar escolhendo um ao outro." },
  { years: 5, name: "Madeira", icon: "wood", meaning: "Raiz. Casa. Algo que cresce devagar e segura tempestade." },
  { years: 6, name: "Perfume", icon: "perfume", meaning: "A memória que fica no ar quando a gente se lembra um do outro." },
  { years: 7, name: "Latão", icon: "brass", meaning: "Brilho que não é de vitrine — é de uso, de mão dada." },
  { years: 8, name: "Bronze", icon: "bronze", meaning: "Liga de duas coisas diferentes que, juntas, ficam mais fortes." },
  { years: 9, name: "Cerâmica", icon: "ceramic", meaning: "Frágil se solta, eterna se cuidada. A gente cuida." },
  { years: 10, name: "Estanho", icon: "tin", meaning: "Uma década. Simples na aparência, pesada de significado." },
  { years: 15, name: "Cristal", icon: "crystal", meaning: "Transparência. Ver um ao outro com clareza, e mesmo assim ficar." },
  { years: 20, name: "Porcelana", icon: "porcelain", meaning: "Delicadeza que atravessou vinte invernos." },
  { years: 25, name: "Prata", icon: "silver", meaning: "Um quarto de século. Luz baixa, brilho certo." },
];

export type BodaStatus = Boda & {
  complete: boolean;
  days: number;
  progress: number;
  anniversaryIso: string;
};

export function getBodaStatuses(start: Date, now = new Date()): BodaStatus[] {
  return BODAS.map((boda) => {
    const anniversary = addYearsSaoPaulo(start, boda.years);
    const total = Math.max(1, calendarDaysBetween(start, anniversary));
    const elapsed = calendarDaysBetween(start, now);
    const delta = calendarDaysBetween(now, anniversary);
    const complete = delta <= 0;
    return {
      ...boda,
      complete,
      days: Math.abs(delta),
      progress: complete ? 1 : Math.min(1, Math.max(0, elapsed / total)),
      anniversaryIso: anniversary.toISOString(),
    };
  });
}

export function nextBodaIndex(statuses: BodaStatus[]) {
  const upcoming = statuses.findIndex((item) => !item.complete);
  return upcoming === -1 ? statuses.length - 1 : upcoming;
}
