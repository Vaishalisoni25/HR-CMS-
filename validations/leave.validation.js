import { z } from "zod";

const dateString = z.preprocess((arg) => {
  if (typeof arg === "string") return new Date(arg);
  if (arg instanceof Date) return arg;
  return arg;
}, z.date());
