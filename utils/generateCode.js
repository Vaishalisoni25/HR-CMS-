export const generateCode = () => {
  const chars =
    "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$!%&*?";
  return Array.from({ length: 6 }, () => {
    return chars[Math.floor(Math.random() * chars.length)];
  }).join("");
};
