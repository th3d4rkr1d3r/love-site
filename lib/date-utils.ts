export const APP_TIMEZONE = "America/Sao_Paulo";

export type ElapsedTime = {
  years: number;
  months: number;
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
};

function zonedParts(date: Date) {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: APP_TIMEZONE,
    year: "numeric",
    month: "numeric",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
    second: "numeric",
    hourCycle: "h23",
  }).formatToParts(date);

  const read = (type: Intl.DateTimeFormatPartTypes) =>
    Number(parts.find((part) => part.type === type)?.value ?? 0);

  return {
    year: read("year"),
    month: read("month"),
    day: read("day"),
    hour: read("hour"),
    minute: read("minute"),
    second: read("second"),
  };
}

function daysInMonth(year: number, month: number) {
  return new Date(year, month, 0).getDate();
}

export function getElapsedSince(start: Date, now = new Date()): ElapsedTime {
  const from = zonedParts(start);
  const to = zonedParts(now);

  let years = to.year - from.year;
  let months = to.month - from.month;
  let days = to.day - from.day;
  let hours = to.hour - from.hour;
  let minutes = to.minute - from.minute;
  let seconds = to.second - from.second;

  if (seconds < 0) {
    seconds += 60;
    minutes -= 1;
  }
  if (minutes < 0) {
    minutes += 60;
    hours -= 1;
  }
  if (hours < 0) {
    hours += 24;
    days -= 1;
  }
  if (days < 0) {
    months -= 1;
    days += daysInMonth(to.year, to.month - 1 || 12);
  }
  if (months < 0) {
    months += 12;
    years -= 1;
  }

  return {
    years: Math.max(0, years),
    months: Math.max(0, months),
    days: Math.max(0, days),
    hours: Math.max(0, hours),
    minutes: Math.max(0, minutes),
    seconds: Math.max(0, seconds),
  };
}

const longDateFormatter = new Intl.DateTimeFormat("pt-BR", {
  timeZone: APP_TIMEZONE,
  day: "numeric",
  month: "long",
  year: "numeric",
});

export function calendarDaysBetween(from: Date, to: Date) {
  const start = zonedParts(from);
  const end = zonedParts(to);
  const ms =
    Date.UTC(end.year, end.month - 1, end.day) -
    Date.UTC(start.year, start.month - 1, start.day);
  return Math.round(ms / 86_400_000);
}

export function daysTogether(start: Date, now = new Date()) {
  return Math.max(0, calendarDaysBetween(start, now));
}

function pad2(value: number) {
  return String(value).padStart(2, "0");
}

export function addYearsSaoPaulo(start: Date, years: number) {
  const parts = zonedParts(start);
  return new Date(
    `${parts.year + years}-${pad2(parts.month)}-${pad2(parts.day)}T${pad2(parts.hour)}:${pad2(parts.minute)}:${pad2(parts.second)}-03:00`,
  );
}

export function formatLongDatePt(date: Date) {
  return longDateFormatter.format(date);
}

/** Meio-dia em São Paulo, para datas de evento sem deslocar o dia em UTC. */
export function dateAtSaoPauloNoon(isoDate: string) {
  return new Date(`${isoDate}T12:00:00-03:00`);
}
