const RIYADH_TIMEZONE = "Asia/Riyadh";
const DEFAULT_DAILY_QUESTION_LIMIT = 10;

function pad(value: string): string {
  return value.padStart(2, "0");
}

export function getRiyadhDateKey(date: Date): string {
  const formatter = new Intl.DateTimeFormat("en-CA", {
    timeZone: RIYADH_TIMEZONE,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  });

  const parts = formatter.formatToParts(date);
  const year = parts.find((part) => part.type === "year")?.value;
  const month = parts.find((part) => part.type === "month")?.value;
  const day = parts.find((part) => part.type === "day")?.value;

  if (!year || !month || !day) {
    throw new Error("Unable to compute Riyadh date key.");
  }

  return `${year}-${pad(month)}-${pad(day)}`;
}

export function isDailyLimitExceeded(
  questionCount: number,
  limit: number = DEFAULT_DAILY_QUESTION_LIMIT
): boolean {
  return questionCount >= limit;
}

export function getDefaultDailyQuestionLimit(): number {
  return DEFAULT_DAILY_QUESTION_LIMIT;
}

