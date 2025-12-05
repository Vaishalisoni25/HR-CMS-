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
