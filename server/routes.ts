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
      // Tracking numbers are not authorization to see addresses or payment data.
      res.set("Cache-Control", "no-store");
      res.json({
        trackingNumber: shipment.trackingNumber,
        status: shipment.status || "pending",
        createdAt: shipment.createdAt,
        updatedAt: shipment.updatedAt,
        source: "globalgateway_internal",
      });
    } catch (error) {
      console.error("Error tracking shipment:", error);
      res.status(500).json({ message: "Failed to track shipment" });
    }
  });

  // Carrier checkout is not connected. Never accept customer-provided prices
  // or create a shipment record that looks like a purchased carrier label.
  app.post('/api/shipments', isAuthenticated, (_req, res) => {
    return res.status(503).json({
      code: "CARRIER_BOOKING_NOT_AVAILABLE",
      message: "Direct carrier booking is not enabled. Request manual forwarding or obtain an authorized carrier quotation.",
    });
  });

  app.patch('/api/shipments/:id', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      if (user?.role !== 'admin') {
        return res.status(403).json({ message: "Admin access required" });
      }
      const updated = await storage.updateShipment(req.params.id, req.body);
      res.json(updated);
    } catch (error) {
      console.error("Error updating shipment:", error);
      res.status(500).json({ message: "Failed to update shipment" });
    }
  });

  // Legacy estimated-rate endpoint was not a carrier quote. Fail closed instead
  // of displaying fabricated prices or delivery commitments to customers.
  app.post("/api/shipments/calculate", (_req, res) => {
    return res.status(503).json({
      code: "CARRIER_QUOTE_REQUIRED",
      message: "Estimated pricing is disabled. Use the USPS Services page for authorized domestic quotes, or request a warehouse-forwarding quote.",
    });
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

  app.patch('/api/lease-requests/:id', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      if (user?.role !== 'admin') {
        return res.status(403).json({ message: "Admin access required" });
      }
      const updated = await storage.updateLeaseRequest(req.params.id, req.body);
      res.json(updated);
    } catch (error) {
      console.error("Error updating lease request:", error);
      res.status(500).json({ message: "Failed to update lease request" });
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

  app.patch('/api/legal-requests/:id', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      const user = await storage.getUser(userId);
      if (user?.role !== 'admin') {
        return res.status(403).json({ message: "Admin access required" });
      }
      const updated = await storage.updateLegalRequest(req.params.id, req.body);
      res.json(updated);
    } catch (error) {
      console.error("Error updating legal request:", error);
      res.status(500).json({ message: "Failed to update legal request" });
    }
  });

  // Register payment routes
  registerPaymentRoutes(app);

  const httpServer = createServer(app);
  return httpServer;
}
