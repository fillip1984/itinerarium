import { relations } from "drizzle-orm";

import { appSchema, baseFields } from "./db-utils";

export const day = appSchema.table("day", (d) => ({
  ...baseFields,
  name: d.varchar({ length: 9 }).notNull(),
  order: d.integer().notNull(),
}));

export const timeslot = appSchema.table("timeslot", (d) => ({
  ...baseFields,
  startTime: d.time().notNull(),
  endTime: d.time().notNull(),
  dayId: d
    .text()
    .references(() => day.id, { onDelete: "cascade" })
    .notNull(),
}));

export const reservation = appSchema.table("reservation", (d) => ({
  ...baseFields,
  name: d.text().notNull(),
  description: d.text(),
  color: d.varchar({ length: 7 }).notNull(),
  timeslotId: d
    .text()
    .references(() => timeslot.id, { onDelete: "cascade" })
    .notNull(),
}));

// Relationships
export const dayRelationships = relations(day, ({ many }) => ({
  timeslots: many(timeslot),
}));

export const timeslotRelationships = relations(timeslot, ({ one }) => ({
  day: one(day, {
    fields: [timeslot.dayId],
    references: [day.id],
  }),
  reservation: one(reservation),
}));

export const reservationRelationships = relations(reservation, ({ one }) => ({
  timeslot: one(timeslot, {
    fields: [reservation.timeslotId],
    references: [timeslot.id],
  }),
}));

export * from "./auth-schema";
