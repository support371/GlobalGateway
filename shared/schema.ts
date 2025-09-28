import { sql } from 'drizzle-orm';
import {
  index,
  jsonb,
  pgTable,
  timestamp,
  varchar,
  text,
  decimal,
  integer,
  boolean,
} from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// Session storage table.
// (IMPORTANT) This table is mandatory for Replit Auth, don't drop it.
export const sessions = pgTable(
  "sessions",
  {
    sid: varchar("sid").primaryKey(),
    sess: jsonb("sess").notNull(),
    expire: timestamp("expire").notNull(),
  },
  (table) => [index("IDX_session_expire").on(table.expire)],
);

// User storage table.
// (IMPORTANT) This table is mandatory for Replit Auth, don't drop it.
export const users = pgTable("users", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  email: varchar("email").unique(),
  firstName: varchar("first_name"),
  lastName: varchar("last_name"),
  profileImageUrl: varchar("profile_image_url"),
  role: varchar("role").default("client"), // client or admin
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Properties table for real estate listings
export const properties = pgTable("properties", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  title: text("title").notNull(),
  description: text("description"),
  type: varchar("type").notNull(), // office, warehouse, retail
  location: text("location").notNull(),
  address: text("address").notNull(),
  size: integer("size").notNull(), // square feet
  price: decimal("price", { precision: 10, scale: 2 }).notNull(),
  currency: varchar("currency").default("USD"),
  availability: boolean("availability").default(true),
  imageUrls: text("image_urls").array(),
  amenities: text("amenities").array(),
  virtualTourUrl: text("virtual_tour_url"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Shipments table for logistics tracking
export const shipments = pgTable("shipments", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id),
  trackingNumber: varchar("tracking_number").unique(),
  origin: text("origin").notNull(),
  destination: text("destination").notNull(),
  weight: decimal("weight", { precision: 8, scale: 2 }),
  dimensions: text("dimensions"),
  status: varchar("status").default("pending"), // pending, in_transit, delivered, cancelled
  estimatedDelivery: timestamp("estimated_delivery"),
  actualDelivery: timestamp("actual_delivery"),
  cost: decimal("cost", { precision: 10, scale: 2 }),
  currency: varchar("currency").default("USD"),
  service: varchar("service"), // standard, express, overnight
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Lease requests for real estate
export const leaseRequests = pgTable("lease_requests", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id),
  propertyId: varchar("property_id").references(() => properties.id),
  contactName: text("contact_name").notNull(),
  contactEmail: varchar("contact_email").notNull(),
  contactPhone: varchar("contact_phone"),
  companyName: text("company_name"),
  desiredMoveInDate: timestamp("desired_move_in_date"),
  leaseTerm: integer("lease_term"), // months
  message: text("message"),
  status: varchar("status").default("pending"), // pending, approved, rejected
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Legal support requests
export const legalRequests = pgTable("legal_requests", {
  id: varchar("id").primaryKey().default(sql`gen_random_uuid()`),
  userId: varchar("user_id").references(() => users.id),
  serviceType: varchar("service_type").notNull(), // contracts, regulatory, risk-insurance, business-support, digital-compliance
  title: text("title").notNull(),
  description: text("description").notNull(),
  urgency: varchar("urgency").default("medium"), // low, medium, high
  contactEmail: varchar("contact_email").notNull(),
  contactPhone: varchar("contact_phone"),
  documentUrls: text("document_urls").array(),
  status: varchar("status").default("pending"), // pending, in_review, completed
  assignedLawyer: varchar("assigned_lawyer"),
  createdAt: timestamp("created_at").defaultNow(),
  updatedAt: timestamp("updated_at").defaultNow(),
});

// Create insert schemas
export const insertUserSchema = createInsertSchema(users).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertPropertySchema = createInsertSchema(properties).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertShipmentSchema = createInsertSchema(shipments).omit({
  id: true,
  trackingNumber: true,
  createdAt: true,
  updatedAt: true,
});

export const insertLeaseRequestSchema = createInsertSchema(leaseRequests).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

export const insertLegalRequestSchema = createInsertSchema(legalRequests).omit({
  id: true,
  createdAt: true,
  updatedAt: true,
});

// Types
export type UpsertUser = typeof users.$inferInsert;
export type User = typeof users.$inferSelect;
export type Property = typeof properties.$inferSelect;
export type InsertProperty = z.infer<typeof insertPropertySchema>;
export type Shipment = typeof shipments.$inferSelect;
export type InsertShipment = z.infer<typeof insertShipmentSchema>;
export type LeaseRequest = typeof leaseRequests.$inferSelect;
export type InsertLeaseRequest = z.infer<typeof insertLeaseRequestSchema>;
export type LegalRequest = typeof legalRequests.$inferSelect;
export type InsertLegalRequest = z.infer<typeof insertLegalRequestSchema>;
