import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Truck, Calculator, Clock, DollarSign } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";

const calculatorSchema = z.object({
  origin: z.string().min(1, "Origin is required"),
  destination: z.string().min(1, "Destination is required"),
  weight: z.string().min(1, "Weight is required").transform((val) => parseFloat(val)),
  service: z.enum(["standard", "express", "overnight"]),
});

type CalculatorForm = z.infer<typeof calculatorSchema>;

interface ShippingQuote {
  cost: number;
  currency: string;
  estimatedDays: number;
  service: string;
}

export default function ShippingCalculator() {
  const [quote, setQuote] = useState<ShippingQuote | null>(null);
  const [isCalculating, setIsCalculating] = useState(false);
  const { toast } = useToast();

  const form = useForm<CalculatorForm>({
    resolver: zodResolver(calculatorSchema),
    defaultValues: {
      origin: "",
      destination: "",
      weight: "" as any,
      service: "standard",
    },
  });

  const onSubmit = async (data: CalculatorForm) => {
    setIsCalculating(true);
    try {
      const response = await apiRequest("POST", "/api/shipments/calculate", data);
      const result = await response.json();
      setQuote(result);
    } catch (error) {
      toast({
        title: "Calculation Failed",
        description: "Unable to calculate shipping cost. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsCalculating(false);
    }
  };

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
              <Calculator className="h-8 w-8 text-primary" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-foreground mb-2" data-testid="text-calculator-title">
            Shipping Calculator
          </h1>
          <p className="text-muted-foreground" data-testid="text-calculator-description">
            Get instant quotes for your shipments worldwide
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Calculator Form */}
          <Card data-testid="card-calculator-form">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Truck className="mr-2 h-5 w-5" />
                Calculate Shipping Cost
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <FormField
                    control={form.control}
                    name="origin"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Origin</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="Enter origin city/country" 
                            {...field} 
                            data-testid="input-origin"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="destination"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Destination</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="Enter destination city/country" 
                            {...field} 
                            data-testid="input-destination"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="weight"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Weight (kg)</FormLabel>
                        <FormControl>
                          <Input 
                            type="number" 
                            step="0.1" 
                            placeholder="Enter package weight" 
                            {...field} 
                            data-testid="input-weight"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="service"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Service Type</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger data-testid="select-service">
                              <SelectValue placeholder="Select service type" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="standard">Standard (5-7 days)</SelectItem>
                            <SelectItem value="express">Express (2-3 days)</SelectItem>
                            <SelectItem value="overnight">Overnight (1 day)</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Button 
                    type="submit" 
                    className="w-full" 
                    disabled={isCalculating}
                    data-testid="button-calculate"
                  >
                    {isCalculating ? "Calculating..." : "Calculate Shipping Cost"}
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>

          {/* Quote Result */}
          {quote ? (
            <Card data-testid="card-quote-result">
              <CardHeader>
                <CardTitle className="flex items-center text-accent">
                  <DollarSign className="mr-2 h-5 w-5" />
                  Shipping Quote
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="text-center">
                    <div className="text-3xl font-bold text-foreground" data-testid="text-quote-cost">
                      ${quote.cost} {quote.currency}
                    </div>
                    <p className="text-muted-foreground capitalize" data-testid="text-quote-service">
                      {quote.service} Service
                    </p>
                  </div>

                  <div className="flex items-center justify-center space-x-2 text-muted-foreground" data-testid="text-quote-delivery">
                    <Clock className="h-4 w-4" />
                    <span>Estimated delivery: {quote.estimatedDays} business days</span>
                  </div>

                  <div className="pt-4 border-t">
                    <h4 className="font-semibold mb-2">What's included:</h4>
                    <ul className="text-sm text-muted-foreground space-y-1">
                      <li>• Door-to-door delivery</li>
                      <li>• Real-time tracking</li>
                      <li>• Basic insurance coverage</li>
                      <li>• Customs documentation</li>
                    </ul>
                  </div>

                  <Button className="w-full" data-testid="button-book-shipment">
                    Book This Shipment
                  </Button>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card data-testid="card-quote-placeholder">
              <CardContent className="py-16 text-center">
                <Calculator className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  Get Your Quote
                </h3>
                <p className="text-muted-foreground">
                  Fill out the form to calculate your shipping costs
                </p>
              </CardContent>
            </Card>
          )}
        </div>

        {/* Service Comparison */}
        <Card className="mt-8" data-testid="card-service-comparison">
          <CardHeader>
            <CardTitle>Service Comparison</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center p-4 border rounded-lg" data-testid="service-standard">
                <h4 className="font-semibold mb-2">Standard</h4>
                <p className="text-2xl font-bold text-primary mb-2">Most Economical</p>
                <p className="text-sm text-muted-foreground mb-4">5-7 business days</p>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Ground transportation</li>
                  <li>• Basic tracking</li>
                  <li>• Standard handling</li>
                </ul>
              </div>

              <div className="text-center p-4 border rounded-lg border-accent" data-testid="service-express">
                <h4 className="font-semibold mb-2">Express</h4>
                <p className="text-2xl font-bold text-accent mb-2">Best Value</p>
                <p className="text-sm text-muted-foreground mb-4">2-3 business days</p>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Air transportation</li>
                  <li>• Priority handling</li>
                  <li>• Enhanced tracking</li>
                </ul>
              </div>

              <div className="text-center p-4 border rounded-lg" data-testid="service-overnight">
                <h4 className="font-semibold mb-2">Overnight</h4>
                <p className="text-2xl font-bold text-destructive mb-2">Fastest</p>
                <p className="text-sm text-muted-foreground mb-4">Next business day</p>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li>• Express air delivery</li>
                  <li>• Premium handling</li>
                  <li>• Real-time updates</li>
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
