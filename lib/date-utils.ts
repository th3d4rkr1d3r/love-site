export const APP_TIMEZONE = "America/Sao_Paulo";

const longDateFormatter = new Intl.DateTimeFormat("pt-BR", {
  timeZone: APP_TIMEZONE,
  day: "numeric",
  month: "long",
  year: "numeric",
});

export function formatLongDatePt(date: Date) {
  return longDateFormatter.format(date);
}

/** Meio-dia em São Paulo, para datas de evento sem deslocar o dia em UTC. */
export function dateAtSaoPauloNoon(isoDate: string) {
  return new Date(`${isoDate}T12:00:00-03:00`);
}
