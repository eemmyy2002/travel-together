const DATE_PATTERN = /^(\d{4})-(\d{2})-(\d{2})$/;

const MONTHS = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

export type CalendarDateError = "invalid" | "order";

export function parseCalendarDate(value: string): Date | null {
  const match = DATE_PATTERN.exec(value);
  if (!match) return null;
  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);
  const date = new Date(Date.UTC(year, month - 1, day));
  if (
    date.getUTCFullYear() !== year ||
    date.getUTCMonth() !== month - 1 ||
    date.getUTCDate() !== day
  ) {
    return null;
  }
  return date;
}

export function formatCalendarDate(value: string): string {
  const date = parseCalendarDate(value);
  if (!date) return value;
  return `${date.getUTCDate()} ${MONTHS[date.getUTCMonth()]}`;
}

export function formatDayLabel(dayNumber: number, date: string): string {
  return `Day ${dayNumber} — ${formatCalendarDate(date)}`;
}

export function isEndBeforeStart(startDate: string, endDate: string): boolean {
  return endDate < startDate;
}

export type GeneratedDay = {
  id: string;
  dayNumber: number;
  date: string;
};

export function generateDays(
  startDate: string,
  endDate: string,
  createId: () => string = () => crypto.randomUUID(),
): { ok: true; days: GeneratedDay[] } | { ok: false; error: CalendarDateError } {
  const start = parseCalendarDate(startDate);
  const end = parseCalendarDate(endDate);
  if (!start || !end) return { ok: false, error: "invalid" };
  if (isEndBeforeStart(startDate, endDate)) return { ok: false, error: "order" };

  const days: GeneratedDay[] = [];
  const cursor = new Date(start);
  let dayNumber = 1;
  while (cursor.getTime() <= end.getTime()) {
    const date = cursor.toISOString().slice(0, 10);
    days.push({ id: createId(), dayNumber, date });
    cursor.setUTCDate(cursor.getUTCDate() + 1);
    dayNumber += 1;
  }
  return { ok: true, days };
}
