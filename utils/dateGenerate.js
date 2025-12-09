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
    return res.status(400).json({ message: "Invalid month or year" });
  }

  const startDate = new Date(y, m - 1, 1);
  const endDate = new Date(y, m, 0, 23, 59, 59, 999);

  return {
    m,
    y,
    startDate,
    endDate,
    error: null,
  };
}
