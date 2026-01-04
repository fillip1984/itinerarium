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
  reservationId: d.text().references(() => reservation.id),
}));

export const reservation = appSchema.table("reservation", (d) => ({
  ...baseFields,
  name: d.text().notNull(),
  description: d.text(),
  color: d.varchar({ length: 7 }).notNull(),
}));

export const list = appSchema.table("list", (d) => ({
  ...baseFields,
  name: d.text().notNull(),
  description: d.text(),
  reservationId: d
    .text()
    .references(() => reservation.id, { onDelete: "cascade" })
    .notNull(),
}));

export const listItem = appSchema.table("listItem", (d) => ({
  ...baseFields,
  name: d.text().notNull(),
  description: d.text(),
  complete: d.boolean().notNull().default(false),
  listId: d
    .text()
    .references(() => list.id, { onDelete: "cascade" })
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
  reservation: one(reservation, {
    fields: [timeslot.reservationId],
    references: [reservation.id],
  }),
}));

export const reservationRelationships = relations(reservation, ({ many }) => ({
  timeslots: many(timeslot),
  lists: many(list),
}));

export const listRelationships = relations(list, ({ one, many }) => ({
  reservation: one(reservation, {
    fields: [list.reservationId],
    references: [reservation.id],
  }),
  items: many(listItem),
}));

export const listItemRelationships = relations(listItem, ({ one }) => ({
  list: one(list, {
    fields: [listItem.listId],
    references: [list.id],
  }),
}));

export * from "./auth-schema";
