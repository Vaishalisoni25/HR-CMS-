export function parseDate(month, year) {
  const date = new Date(year, month - 1);
  return date.toLocaleString("en", { month: "long", year: "numeric" });
}

export function formatFullDate(date = new Date()) {
  return date.toLocaleString("en-US", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}
export function validationMonthYear(month, year) {
  if (!month || !year) {
    return { error: "Month and Year are required" };
  }
  const m = Number(month);
  const y = Number(year);

  if (isNaN(m) || isNaN(y) || m < 1 || m > 12) {
    return { error: "Invalid month or year" };
  }
  return {
    m,
    y,

    error: null,
  };
}
