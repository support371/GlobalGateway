/**
 * MOCK PAYMENTS MODULE — NOT PRODUCTION READY
 *
 * This file contains stubbed payment endpoints that return hardcoded mock
 * responses. No real Stripe or Klarna SDK calls are made.
 *
 * To make this production-ready:
 *   - Stripe: install the `stripe` npm package, set STRIPE_SECRET_KEY in env,
 *     and replace the mock objects with real Stripe API calls.
 *   - Klarna: integrate the official Klarna Payments SDK and set real
 *     credentials via environment variables (never hardcode them).
 *   - Remove or guard all mock/stub responses below.
 */

import type { Express } from "express";
import { isAuthenticated } from "./replitAuth";

// Placeholder config — values must come from environment variables in production
const PAYMENT_CONFIG = {
  klarna: {
    accountNumber: process.env.KLARNA_ACCOUNT_NUMBER ?? "MOCK_ACCOUNT",
    routingNumber: process.env.KLARNA_ROUTING_NUMBER ?? "MOCK_ROUTING",
    bankName: "Global Business Gateway Bank",
  },
  stripe: {
    publicKey: process.env.STRIPE_PUBLIC_KEY ?? "pk_test_MOCK",
    secretKey: process.env.STRIPE_SECRET_KEY ?? "sk_test_MOCK",
  },
};

export function registerPaymentRoutes(app: Express) {
  // Create payment intent
  app.post('/api/payments/create-intent', isAuthenticated, async (req: any, res) => {
    try {
      const { amount, currency = 'USD', paymentMethod, description } = req.body;
      
      if (!amount || !paymentMethod || !description) {
        return res.status(400).json({ 
          message: "Amount, payment method, and description are required" 
        });
      }

      const userId = req.user.claims.sub;
      const reference = `GBG-${Date.now()}-${userId.slice(-6)}`;

      if (paymentMethod === 'stripe') {
        // Create Stripe payment intent
        const paymentIntent = {
          id: `pi_${Date.now()}`,
          clientSecret: `pi_${Date.now()}_secret_test`,
          amount: Math.round(amount * 100), // Convert to cents
          currency: currency.toLowerCase(),
          paymentMethod: 'stripe',
          reference,
          status: 'requires_payment_method'
        };

        res.json(paymentIntent);
      } 
      else if (paymentMethod === 'klarna') {
        // Create Klarna ACH payment
        const klarnaPayment = {
          id: `klarna_${Date.now()}`,
          amount,
          currency,
          paymentMethod: 'klarna',
          reference,
          accountDetails: {
            accountNumber: PAYMENT_CONFIG.klarna.accountNumber,
            routingNumber: PAYMENT_CONFIG.klarna.routingNumber,
            bankName: PAYMENT_CONFIG.klarna.bankName,
            accountType: 'checking'
          },
          instructions: [
            "Initiate an ACH wire transfer using the provided account details",
            "Include the reference number in the transfer description",
            "Processing time: 2-3 business days",
            "You will receive confirmation once payment is received"
          ],
          status: 'pending_transfer'
        };

        res.json(klarnaPayment);
      } 
      else {
        return res.status(400).json({ 
          message: "Unsupported payment method. Use 'stripe' or 'klarna'" 
        });
      }
    } catch (error) {
      console.error("Error creating payment intent:", error);
      res.status(500).json({ message: "Failed to create payment intent" });
    }
  });

  // Confirm payment (for Stripe)
  app.post('/api/payments/confirm', isAuthenticated, async (req: any, res) => {
    try {
      const { paymentIntentId, paymentMethodId } = req.body;
      
      // Mock Stripe payment confirmation
      const confirmedPayment = {
        id: paymentIntentId,
        status: 'succeeded',
        amount: 5000, // $50.00 in cents
        currency: 'usd',
        paymentMethod: paymentMethodId,
        created: Date.now(),
        receipt_url: `https://pay.stripe.com/receipts/${paymentIntentId}`
      };

      res.json(confirmedPayment);
    } catch (error) {
      console.error("Error confirming payment:", error);
      res.status(500).json({ message: "Failed to confirm payment" });
    }
  });

  // Get payment status
  app.get('/api/payments/:paymentId/status', isAuthenticated, async (req, res) => {
    try {
      const { paymentId } = req.params;
      
      // Mock payment status lookup
      const paymentStatus = {
        id: paymentId,
        status: paymentId.startsWith('klarna_') ? 'pending_transfer' : 'succeeded',
        amount: 5000,
        currency: 'usd',
        created: Date.now(),
        updated: Date.now()
      };

      res.json(paymentStatus);
    } catch (error) {
      console.error("Error fetching payment status:", error);
      res.status(500).json({ message: "Failed to fetch payment status" });
    }
  });

  // List user payments
  app.get('/api/payments', isAuthenticated, async (req: any, res) => {
    try {
      const userId = req.user.claims.sub;
      
      // Mock payment history
      const payments = [
        {
          id: 'pi_1234567890',
          amount: 5000,
          currency: 'usd',
          status: 'succeeded',
          paymentMethod: 'stripe',
          description: 'Shipping service payment',
          created: Date.now() - 86400000 // 1 day ago
        },
        {
          id: 'klarna_0987654321',
          amount: 10000,
          currency: 'usd',
          status: 'pending_transfer',
          paymentMethod: 'klarna',
          description: 'Legal services payment',
          created: Date.now() - 172800000 // 2 days ago
        }
      ];

      res.json(payments);
    } catch (error) {
      console.error("Error fetching payments:", error);
      res.status(500).json({ message: "Failed to fetch payments" });
    }
  });
}
