import { pgTable, text, serial, integer, boolean, doublePrecision } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { relations } from "drizzle-orm";

// Waste Types Table
export const wasteTypes = pgTable("waste_types", {
  id: serial("id").primaryKey(),
  name: text("name").notNull().unique(),
  description: text("description").notNull(),
  isRecyclable: boolean("is_recyclable").notNull(),
  disposalInstructions: text("disposal_instructions").notNull(),
  category: text("category").notNull(),
  colorClass: text("color_class").notNull(),
});

export const wasteTypesRelations = relations(wasteTypes, ({ many }) => ({
  recyclingCenters: many(recyclingCenterWasteTypes),
}));

export const insertWasteTypeSchema = createInsertSchema(wasteTypes);
export type InsertWasteType = z.infer<typeof insertWasteTypeSchema>;
export type WasteType = typeof wasteTypes.$inferSelect;

// Learning Resources Table
export const learningResources = pgTable("learning_resources", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  content: text("content").notNull(),
  image: text("image").notNull(),
  category: text("category").notNull(),
  categoryColor: text("category_color").notNull(),
  createdAt: text("created_at").notNull(),
});

export const insertLearningResourceSchema = createInsertSchema(learningResources);
export type InsertLearningResource = z.infer<typeof insertLearningResourceSchema>;
export type LearningResource = typeof learningResources.$inferSelect;

// Recycling Centers Table
export const recyclingCenters = pgTable("recycling_centers", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  address: text("address").notNull(),
  latitude: doublePrecision("latitude").notNull(),
  longitude: doublePrecision("longitude").notNull(),
  phone: text("phone"),
  website: text("website"),
  hoursOfOperation: text("hours_of_operation"),
});

export const recyclingCentersRelations = relations(recyclingCenters, ({ many }) => ({
  wasteTypes: many(recyclingCenterWasteTypes),
}));

export const insertRecyclingCenterSchema = createInsertSchema(recyclingCenters);
export type InsertRecyclingCenter = z.infer<typeof insertRecyclingCenterSchema>;
export type RecyclingCenter = typeof recyclingCenters.$inferSelect;

// Junction Table for Many-to-Many Relationship between Recycling Centers and Waste Types
export const recyclingCenterWasteTypes = pgTable("recycling_center_waste_types", {
  id: serial("id").primaryKey(),
  recyclingCenterId: integer("recycling_center_id")
    .references(() => recyclingCenters.id)
    .notNull(),
  wasteTypeId: integer("waste_type_id")
    .references(() => wasteTypes.id)
    .notNull(),
});

export const recyclingCenterWasteTypesRelations = relations(recyclingCenterWasteTypes, ({ one }) => ({
  recyclingCenter: one(recyclingCenters, {
    fields: [recyclingCenterWasteTypes.recyclingCenterId],
    references: [recyclingCenters.id],
  }),
  wasteType: one(wasteTypes, {
    fields: [recyclingCenterWasteTypes.wasteTypeId],
    references: [wasteTypes.id],
  }),
}));

export const insertRecyclingCenterWasteTypeSchema = createInsertSchema(recyclingCenterWasteTypes);
export type InsertRecyclingCenterWasteType = z.infer<typeof insertRecyclingCenterWasteTypeSchema>;
export type RecyclingCenterWasteType = typeof recyclingCenterWasteTypes.$inferSelect;

// Users Table (for future auth features)
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
});

export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
});

export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;
