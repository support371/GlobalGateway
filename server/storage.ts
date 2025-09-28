import {
  users,
  properties,
  shipments,
  leaseRequests,
  legalRequests,
  type User,
  type UpsertUser,
  type Property,
  type InsertProperty,
  type Shipment,
  type InsertShipment,
  type LeaseRequest,
  type InsertLeaseRequest,
  type LegalRequest,
  type InsertLegalRequest,
} from "@shared/schema";
import { db } from "./db";
import { eq, desc, and, ilike, or } from "drizzle-orm";

// Interface for storage operations
export interface IStorage {
  // User operations
  getUser(id: string): Promise<User | undefined>;
  upsertUser(user: UpsertUser): Promise<User>;
  
  // Property operations
  getProperties(filters?: {
    type?: string;
    location?: string;
    minPrice?: number;
    maxPrice?: number;
    minSize?: number;
    maxSize?: number;
  }): Promise<Property[]>;
  getProperty(id: string): Promise<Property | undefined>;
  createProperty(property: InsertProperty): Promise<Property>;
  updateProperty(id: string, property: Partial<InsertProperty>): Promise<Property>;
  
  // Shipment operations
  getShipments(userId?: string): Promise<Shipment[]>;
  getShipment(id: string): Promise<Shipment | undefined>;
  getShipmentByTracking(trackingNumber: string): Promise<Shipment | undefined>;
  createShipment(shipment: InsertShipment): Promise<Shipment>;
  updateShipment(id: string, shipment: Partial<InsertShipment>): Promise<Shipment>;
  
  // Lease request operations
  getLeaseRequests(userId?: string): Promise<LeaseRequest[]>;
  createLeaseRequest(request: InsertLeaseRequest): Promise<LeaseRequest>;
  updateLeaseRequest(id: string, request: Partial<InsertLeaseRequest>): Promise<LeaseRequest>;
  
  // Legal request operations
  getLegalRequests(userId?: string): Promise<LegalRequest[]>;
  createLegalRequest(request: InsertLegalRequest): Promise<LegalRequest>;
  updateLegalRequest(id: string, request: Partial<InsertLegalRequest>): Promise<LegalRequest>;
}

export class DatabaseStorage implements IStorage {
  // User operations
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(userData)
      .onConflictDoUpdate({
        target: users.id,
        set: {
          ...userData,
          updatedAt: new Date(),
        },
      })
      .returning();
    return user;
  }

  // Property operations
  async getProperties(filters?: {
    type?: string;
    location?: string;
    minPrice?: number;
    maxPrice?: number;
    minSize?: number;
    maxSize?: number;
  }): Promise<Property[]> {
    let query = db.select().from(properties).where(eq(properties.availability, true));
    
    if (filters) {
      const conditions = [eq(properties.availability, true)];
      
      if (filters.type) {
        conditions.push(eq(properties.type, filters.type));
      }
      if (filters.location) {
        conditions.push(or(
          ilike(properties.location, `%${filters.location}%`),
          ilike(properties.address, `%${filters.location}%`)
        )!);
      }
      if (filters.minPrice) {
        conditions.push(sql`${properties.price}::numeric >= ${filters.minPrice}`);
      }
      if (filters.maxPrice) {
        conditions.push(sql`${properties.price}::numeric <= ${filters.maxPrice}`);
      }
      if (filters.minSize) {
        conditions.push(sql`${properties.size} >= ${filters.minSize}`);
      }
      if (filters.maxSize) {
        conditions.push(sql`${properties.size} <= ${filters.maxSize}`);
      }
      
      query = db.select().from(properties).where(and(...conditions));
    }
    
    return await query.orderBy(desc(properties.createdAt));
  }

  async getProperty(id: string): Promise<Property | undefined> {
    const [property] = await db.select().from(properties).where(eq(properties.id, id));
    return property;
  }

  async createProperty(property: InsertProperty): Promise<Property> {
    const [newProperty] = await db.insert(properties).values(property).returning();
    return newProperty;
  }

  async updateProperty(id: string, property: Partial<InsertProperty>): Promise<Property> {
    const [updated] = await db
      .update(properties)
      .set({ ...property, updatedAt: new Date() })
      .where(eq(properties.id, id))
      .returning();
    return updated;
  }

  // Shipment operations
  async getShipments(userId?: string): Promise<Shipment[]> {
    let query = db.select().from(shipments);
    
    if (userId) {
      query = query.where(eq(shipments.userId, userId));
    }
    
    return await query.orderBy(desc(shipments.createdAt));
  }

  async getShipment(id: string): Promise<Shipment | undefined> {
    const [shipment] = await db.select().from(shipments).where(eq(shipments.id, id));
    return shipment;
  }

  async getShipmentByTracking(trackingNumber: string): Promise<Shipment | undefined> {
    const [shipment] = await db.select().from(shipments).where(eq(shipments.trackingNumber, trackingNumber));
    return shipment;
  }

  async createShipment(shipment: InsertShipment): Promise<Shipment> {
    // Generate tracking number
    const trackingNumber = `GBG${Date.now()}${Math.random().toString(36).substr(2, 6).toUpperCase()}`;
    const [newShipment] = await db.insert(shipments).values({
      ...shipment,
      trackingNumber,
    }).returning();
    return newShipment;
  }

  async updateShipment(id: string, shipment: Partial<InsertShipment>): Promise<Shipment> {
    const [updated] = await db
      .update(shipments)
      .set({ ...shipment, updatedAt: new Date() })
      .where(eq(shipments.id, id))
      .returning();
    return updated;
  }

  // Lease request operations
  async getLeaseRequests(userId?: string): Promise<LeaseRequest[]> {
    let query = db.select().from(leaseRequests);
    
    if (userId) {
      query = query.where(eq(leaseRequests.userId, userId));
    }
    
    return await query.orderBy(desc(leaseRequests.createdAt));
  }

  async createLeaseRequest(request: InsertLeaseRequest): Promise<LeaseRequest> {
    const [newRequest] = await db.insert(leaseRequests).values(request).returning();
    return newRequest;
  }

  async updateLeaseRequest(id: string, request: Partial<InsertLeaseRequest>): Promise<LeaseRequest> {
    const [updated] = await db
      .update(leaseRequests)
      .set({ ...request, updatedAt: new Date() })
      .where(eq(leaseRequests.id, id))
      .returning();
    return updated;
  }

  // Legal request operations
  async getLegalRequests(userId?: string): Promise<LegalRequest[]> {
    let query = db.select().from(legalRequests);
    
    if (userId) {
      query = query.where(eq(legalRequests.userId, userId));
    }
    
    return await query.orderBy(desc(legalRequests.createdAt));
  }

  async createLegalRequest(request: InsertLegalRequest): Promise<LegalRequest> {
    const [newRequest] = await db.insert(legalRequests).values(request).returning();
    return newRequest;
  }

  async updateLegalRequest(id: string, request: Partial<InsertLegalRequest>): Promise<LegalRequest> {
    const [updated] = await db
      .update(legalRequests)
      .set({ ...request, updatedAt: new Date() })
      .where(eq(legalRequests.id, id))
      .returning();
    return updated;
  }
}

export const storage = new DatabaseStorage();
