
import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { CreditCard, Smartphone, Building, CheckCircle, AlertCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

const paymentSchema = z.object({
  amount: z.string().min(1, "Amount is required").transform((val) => parseFloat(val)),
  currency: z.string().default("USD"),
  paymentMethod: z.enum(["stripe", "klarna"]),
  description: z.string().min(1, "Description is required"),
});

type PaymentForm = z.infer<typeof paymentSchema>;

export default function PaymentMethods() {
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentResult, setPaymentResult] = useState<any>(null);
  const { toast } = useToast();

  const form = useForm<PaymentForm>({
    resolver: zodResolver(paymentSchema),
    defaultValues: {
      amount: 0,
      currency: "USD",
      paymentMethod: "stripe",
      description: "",
    },
  });

  const onSubmit = async (data: PaymentForm) => {
    setIsProcessing(true);
    setPaymentResult(null);

    try {
      const response = await apiRequest("POST", "/api/payments/create-intent", data);
      const result = await response.json();
      
      setPaymentResult(result);
      
      if (data.paymentMethod === "stripe") {
        // Initialize Stripe Elements for card payment
        initializeStripePayment(result.clientSecret);
      } else if (data.paymentMethod === "klarna") {
        // Show Klarna payment instructions
        toast({
          title: "Klarna Payment Initiated",
          description: "Please follow the ACH wire transfer instructions below.",
        });
      }
    } catch (error: any) {
      toast({
        title: "Payment Error",
        description: error.message || "Failed to process payment",
        variant: "destructive",
      });
    } finally {
      setIsProcessing(false);
    }
  };

  const initializeStripePayment = (clientSecret: string) => {
    // This would integrate with Stripe Elements
    toast({
      title: "Stripe Payment Ready",
      description: "Card payment form initialized. Tap-to-pay available on iOS devices.",
    });
  };

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Payment Methods</h1>
          <p className="text-muted-foreground">
            Choose your preferred payment method. We support Stripe and Klarna payments.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Payment Form */}
          <Card>
            <CardHeader>
              <CardTitle>Process Payment</CardTitle>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <FormField
                    control={form.control}
                    name="amount"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Amount (USD)</FormLabel>
                        <FormControl>
                          <Input 
                            type="number" 
                            step="0.01" 
                            placeholder="0.00" 
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Payment Description</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="What is this payment for?" 
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="paymentMethod"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Payment Method</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select payment method" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="stripe">
                              <div className="flex items-center">
                                <CreditCard className="mr-2 h-4 w-4" />
                                Stripe (Cards & Apple Pay)
                              </div>
                            </SelectItem>
                            <SelectItem value="klarna">
                              <div className="flex items-center">
                                <Building className="mr-2 h-4 w-4" />
                                Klarna (ACH Wire Transfer)
                              </div>
                            </SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Button 
                    type="submit" 
                    className="w-full" 
                    disabled={isProcessing}
                  >
                    {isProcessing ? "Processing..." : "Create Payment"}
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>

          {/* Payment Methods Info */}
          <div className="space-y-6">
            {/* Stripe Info */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <CreditCard className="mr-2 h-5 w-5" />
                  Stripe Payments
                  <Badge variant="secondary" className="ml-2">Recommended</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                    <span className="text-sm">Credit & Debit Cards</span>
                  </div>
                  <div className="flex items-center">
                    <Smartphone className="h-4 w-4 text-blue-500 mr-2" />
                    <span className="text-sm">Apple Pay & Google Pay</span>
                  </div>
                  <div className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                    <span className="text-sm">Tap-to-Pay on iOS Devices</span>
                  </div>
                  <div className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                    <span className="text-sm">Instant Processing</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Klarna Info */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Building className="mr-2 h-5 w-5" />
                  Klarna ACH Payments
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                    <span className="text-sm">ACH Wire Transfers</span>
                  </div>
                  <div className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                    <span className="text-sm">Lower Transaction Fees</span>
                  </div>
                  <div className="flex items-center">
                    <AlertCircle className="h-4 w-4 text-yellow-500 mr-2" />
                    <span className="text-sm">2-3 Business Days Processing</span>
                  </div>
                  <div className="flex items-center">
                    <CheckCircle className="h-4 w-4 text-green-500 mr-2" />
                    <span className="text-sm">Secure Bank Transfers</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Payment Result */}
            {paymentResult && (
              <Card>
                <CardHeader>
                  <CardTitle>Payment Instructions</CardTitle>
                </CardHeader>
                <CardContent>
                  {paymentResult.paymentMethod === "klarna" && (
                    <div className="space-y-4">
                      <div className="bg-blue-50 dark:bg-blue-950 p-4 rounded-lg">
                        <h4 className="font-semibold mb-2">ACH Wire Transfer Details</h4>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span>Account Number:</span>
                            <span className="font-mono">{paymentResult.accountDetails.accountNumber}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Routing Number:</span>
                            <span className="font-mono">{paymentResult.accountDetails.routingNumber}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Amount:</span>
                            <span className="font-semibold">${paymentResult.amount}</span>
                          </div>
                          <div className="flex justify-between">
                            <span>Reference:</span>
                            <span className="font-mono">{paymentResult.reference}</span>
                          </div>
                        </div>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Please include the reference number in your wire transfer description.
                      </p>
                    </div>
                  )}
                  
                  {paymentResult.paymentMethod === "stripe" && (
                    <div className="space-y-4">
                      <div className="bg-green-50 dark:bg-green-950 p-4 rounded-lg">
                        <h4 className="font-semibold mb-2">Card Payment Ready</h4>
                        <p className="text-sm">
                          Payment form is ready. Complete your payment using your preferred card or tap-to-pay method.
                        </p>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
