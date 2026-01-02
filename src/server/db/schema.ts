import { appSchema, baseFields } from "./db-utils";

export const day = appSchema.table("day", (d) => ({
  ...baseFields,
  name: d.varchar({ length: 9 }).notNull(),
  order: d.integer().notNull(),
}));

export const reservation = appSchema.table("reservation", (r) => ({
  ...baseFields,
  name: r.text().notNull(),
  description: r.text(),
  color: r.varchar({ length: 7 }).notNull(),
}));

export * from "./auth-schema";
