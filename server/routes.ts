import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth, isAuthenticated } from "./replitAuth";
import { insertShipmentSchema, insertLeaseRequestSchema, insertLegalRequestSchema, insertPropertySchema } from "@shared/schema";
import { registerPaymentRoutes } from "./payments";

export async function registerRoutes(app: Express): Promise<Server> {
  // Auth middleware
  await setupAuth(app);

  // Auth routes
  app.get('/api/auth/user', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      res.json(user);
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  // Property routes
  app.get('/api/properties', async (req, res) => {
    try {
      const { type, location, minPrice, maxPrice, minSize, maxSize } = req.query;
      const filters = {
        type: type as string,
        location: location as string,
        minPrice: minPrice ? Number(minPrice) : undefined,
        maxPrice: maxPrice ? Number(maxPrice) : undefined,
        minSize: minSize ? Number(minSize) : undefined,
        maxSize: maxSize ? Number(maxSize) : undefined,
      };
      
      // Remove undefined values
      Object.keys(filters).forEach(key => 
        filters[key as keyof typeof filters] === undefined && delete filters[key as keyof typeof filters]
      );
      
      const properties = await storage.getProperties(Object.keys(filters).length > 0 ? filters : undefined);
      res.json(properties);
    } catch (error) {
      console.error("Error fetching properties:", error);
      res.status(500).json({ message: "Failed to fetch properties" });
    }
  });

  app.get('/api/properties/:id', async (req, res) => {
    try {
      const property = await storage.getProperty(req.params.id);
      if (!property) {
        return res.status(404).json({ message: "Property not found" });
      }
      res.json(property);
    } catch (error) {
      console.error("Error fetching property:", error);
      res.status(500).json({ message: "Failed to fetch property" });
    }
  });

  app.post('/api/properties', isAuthenticated, async (req: any, res) => {
    try {
      const user = await storage.getUser(req.user.claims.sub);
      if (user?.role !== 'admin') {
        return res.status(403).json({ message: "Admin access required" });
      }
      
      const validatedData = insertPropertySchema.parse(req.body);
      const property = await storage.createProperty(validatedData);
      res.status(201).json(property);
    } catch (error) {
      console.error("Error creating property:", error);
      res.status(500).json({ message: "Failed to create property" });
    }
  });

  // Shipment routes
  app.get('/api/shipments', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      
      let shipments;
      if (user?.role === 'admin') {
        shipments = await storage.getShipments();
      } else {
        shipments = await storage.getShipments(userId);
      }
      
      res.json(shipments);
    } catch (error) {
      console.error("Error fetching shipments:", error);
      res.status(500).json({ message: "Failed to fetch shipments" });
    }
  });

  app.get('/api/shipments/track/:tracking', async (req, res) => {
    try {
      const shipment = await storage.getShipmentByTracking(req.params.tracking);
      if (!shipment) {
        return res.status(404).json({ message: "Shipment not found" });
      }
      res.json(shipment);
    } catch (error) {
      console.error("Error tracking shipment:", error);
      res.status(500).json({ message: "Failed to track shipment" });
    }
  });

  app.post('/api/shipments', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const validatedData = insertShipmentSchema.parse({ ...req.body, userId });
      const shipment = await storage.createShipment(validatedData);
      res.status(201).json(shipment);
    } catch (error) {
      console.error("Error creating shipment:", error);
      res.status(500).json({ message: "Failed to create shipment" });
    }
  });

  app.post('/api/shipments/calculate', async (req, res) => {
    try {
      const { origin, destination, weight, service } = req.body;
      
      // Simple calculation logic - in production this would integrate with shipping APIs
      const baseRate = 10;
      const weightRate = weight * 2;
      const serviceMultiplier = service === 'express' ? 1.5 : service === 'overnight' ? 2.5 : 1;
      const distanceMultiplier = 1.2; // simplified
      
      const cost = Math.round((baseRate + weightRate) * serviceMultiplier * distanceMultiplier * 100) / 100;
      const estimatedDays = service === 'overnight' ? 1 : service === 'express' ? 2 : 5;
      
      res.json({
        cost,
        currency: 'USD',
        estimatedDays,
        service
      });
    } catch (error) {
      console.error("Error calculating shipping cost:", error);
      res.status(500).json({ message: "Failed to calculate shipping cost" });
    }
  });

  // Lease request routes
  app.get('/api/lease-requests', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      
      let requests;
      if (user?.role === 'admin') {
        requests = await storage.getLeaseRequests();
      } else {
        requests = await storage.getLeaseRequests(userId);
      }
      
      res.json(requests);
    } catch (error) {
      console.error("Error fetching lease requests:", error);
      res.status(500).json({ message: "Failed to fetch lease requests" });
    }
  });

  app.post('/api/lease-requests', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const validatedData = insertLeaseRequestSchema.parse({ ...req.body, userId });
      const request = await storage.createLeaseRequest(validatedData);
      res.status(201).json(request);
    } catch (error) {
      console.error("Error creating lease request:", error);
      res.status(500).json({ message: "Failed to create lease request" });
    }
  });

  // Legal request routes
  app.get('/api/legal-requests', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      
      let requests;
      if (user?.role === 'admin') {
        requests = await storage.getLegalRequests();
      } else {
        requests = await storage.getLegalRequests(userId);
      }
      
      res.json(requests);
    } catch (error) {
      console.error("Error fetching legal requests:", error);
      res.status(500).json({ message: "Failed to fetch legal requests" });
    }
  });

  app.post('/api/legal-requests', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const validatedData = insertLegalRequestSchema.parse({ ...req.body, userId });
      const request = await storage.createLegalRequest(validatedData);
      res.status(201).json(request);
    } catch (error) {
      console.error("Error creating legal request:", error);
      res.status(500).json({ message: "Failed to create legal request" });
    }
  });

  // Register payment routes
  registerPaymentRoutes(app);

  const httpServer = createServer(app);
  return httpServer;
}
