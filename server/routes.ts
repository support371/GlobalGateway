import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth, isAuthenticated } from "./replitAuth";
import { insertShipmentSchema, insertLeaseRequestSchema, insertLegalRequestSchema, insertPropertySchema } from "@shared/schema";
import { registerPaymentRoutes } from "./payments";
import { z } from "zod";
import { getRates, trackPackage, verifyAddress, UspsError } from "./usps";

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

  /* ---------------------------------------------------------------------- */
  /* USPS Web Tools routes (public)                                         */
  /* ---------------------------------------------------------------------- */

  const zip5 = z.string().regex(/^\d{5}$/, "Enter a valid 5-digit ZIP code");

  const rateRequestSchema = z.object({
    originZip: zip5,
    destinationZip: zip5,
    weightLbs: z.coerce.number().positive("Weight must be greater than 0").max(70, "USPS packages must be 70 lbs or less"),
    service: z.string().optional(),
    container: z.string().optional(),
  });

  // Get live USPS domestic rates (RateV4)
  app.post("/api/usps/rates", async (req, res) => {
    try {
      const data = rateRequestSchema.parse(req.body);
      const rates = await getRates(data);
      res.json({ rates });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: error.errors[0]?.message ?? "Invalid request" });
      }
      if (error instanceof UspsError) {
        return res.status(502).json({ message: error.message, code: error.code });
      }
      console.error("USPS rate error:", error);
      res.status(500).json({ message: "Failed to fetch USPS rates" });
    }
  });

  // Track a USPS package (TrackV2)
  app.get("/api/usps/track/:trackingNumber", async (req, res) => {
    try {
      const trackingNumber = String(req.params.trackingNumber || "").trim();
      if (!trackingNumber) {
        return res.status(400).json({ message: "Tracking number is required" });
      }
      const result = await trackPackage(trackingNumber);
      res.json(result);
    } catch (error) {
      if (error instanceof UspsError) {
        return res.status(404).json({ message: error.message, code: error.code });
      }
      console.error("USPS tracking error:", error);
      res.status(500).json({ message: "Failed to track package" });
    }
  });

  // Verify / standardize a US address (Verify)
  const verifyAddressSchema = z.object({
    address1: z.string().optional(),
    address2: z.string().min(1, "Street address is required"),
    city: z.string().min(1, "City is required"),
    state: z.string().min(2, "State is required").max(2, "Use the 2-letter state code"),
    zip5: z.string().optional(),
    zip4: z.string().optional(),
  });

  app.post("/api/usps/verify-address", async (req, res) => {
    try {
      const data = verifyAddressSchema.parse(req.body);
      const address = await verifyAddress(data);
      res.json({ address });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: error.errors[0]?.message ?? "Invalid address" });
      }
      if (error instanceof UspsError) {
        return res.status(422).json({ message: error.message, code: error.code });
      }
      console.error("USPS address verification error:", error);
      res.status(500).json({ message: "Failed to verify address" });
    }
  });

  // Register payment routes
  registerPaymentRoutes(app);

  const httpServer = createServer(app);
  return httpServer;
}
