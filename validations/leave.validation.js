import { z } from "zod";

const dateString = z.preprocess((arg) => {
  if (typeof arg === "String" || arg instanceof string) return new Date(arg);
  if (arg instanceof Date) return arg;
  return arg;
}, z.date());
