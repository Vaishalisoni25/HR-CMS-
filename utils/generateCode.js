export const generateCode = () => {
  const chars =
    "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$!%&*?";
  return Array.from({ length: 6 }, () => {
    return chars[Math.random() * chars.length];
  }).join("");
};

//auto generate
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
