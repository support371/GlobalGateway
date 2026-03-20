import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { MapPin, Package, Search, Clock, CheckCircle, Truck } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import type { Shipment } from "@shared/schema";

const trackingSchema = z.object({
  trackingNumber: z.string().min(1, "Tracking number is required"),
});

type TrackingForm = z.infer<typeof trackingSchema>;

export default function Tracking() {
  const [shipment, setShipment] = useState<Shipment | null>(null);
  const [isTracking, setIsTracking] = useState(false);
  const [notFound, setNotFound] = useState(false);
  const { toast } = useToast();

  const form = useForm<TrackingForm>({
    resolver: zodResolver(trackingSchema),
    defaultValues: {
      trackingNumber: "",
    },
  });

  const onSubmit = async (data: TrackingForm) => {
    setIsTracking(true);
    setNotFound(false);
    setShipment(null);

    try {
      const response = await apiRequest("GET", `/api/shipments/track/${data.trackingNumber}`);
      const result = await response.json();
      setShipment(result);
    } catch (error: any) {
      if (error.message.includes("404")) {
        setNotFound(true);
      } else {
        toast({
          title: "Tracking Failed",
          description: "Unable to track shipment. Please try again.",
          variant: "destructive",
        });
      }
    } finally {
      setIsTracking(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const statusMap = {
      pending: { label: "Pending", variant: "secondary" as const },
      in_transit: { label: "In Transit", variant: "default" as const },
      delivered: { label: "Delivered", variant: "default" as const },
      cancelled: { label: "Cancelled", variant: "destructive" as const },
    };

    const statusInfo = statusMap[status as keyof typeof statusMap] || statusMap.pending;
    return (
      <Badge variant={statusInfo.variant} className={status === "delivered" ? "bg-accent hover:bg-accent" : ""}>
        {statusInfo.label}
      </Badge>
    );
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending":
        return <Clock className="h-5 w-5 text-secondary-foreground" />;
      case "in_transit":
        return <Truck className="h-5 w-5 text-primary" />;
      case "delivered":
        return <CheckCircle className="h-5 w-5 text-accent" />;
      default:
        return <Package className="h-5 w-5 text-muted-foreground" />;
    }
  };

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
              <MapPin className="h-8 w-8 text-primary" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-foreground mb-2" data-testid="text-tracking-title">
            Track Your Shipment
          </h1>
          <p className="text-muted-foreground" data-testid="text-tracking-description">
            Enter your tracking number to get real-time updates
          </p>
        </div>

        {/* Tracking Form */}
        <Card className="mb-8" data-testid="card-tracking-form">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Search className="mr-2 h-5 w-5" />
              Track Package
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="flex gap-4">
                <FormField
                  control={form.control}
                  name="trackingNumber"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormControl>
                        <Input 
                          placeholder="Enter tracking number (e.g., GBG123456789ABC)" 
                          {...field} 
                          data-testid="input-tracking-number"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button 
                  type="submit" 
                  disabled={isTracking}
                  data-testid="button-track"
                >
                  {isTracking ? "Tracking..." : "Track"}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>

        {/* Tracking Results */}
        {shipment && (
          <Card data-testid="card-tracking-result">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="flex items-center">
                    {getStatusIcon(shipment.status ?? "pending")}
                    <span className="ml-2">Tracking: {shipment.trackingNumber}</span>
                  </CardTitle>
                  <p className="text-muted-foreground mt-1">
                    {shipment.service} Service
                  </p>
                </div>
                {getStatusBadge(shipment.status ?? "pending")}
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6">
                {/* Shipment Details */}
                <div>
                  <h3 className="font-semibold mb-4">Shipment Details</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Origin:</span>
                      <span data-testid="text-origin">{shipment.origin}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Destination:</span>
                      <span data-testid="text-destination">{shipment.destination}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Weight:</span>
                      <span data-testid="text-weight">{shipment.weight} kg</span>
                    </div>
                    {shipment.dimensions && (
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Dimensions:</span>
                        <span data-testid="text-dimensions">{shipment.dimensions}</span>
                      </div>
                    )}
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Cost:</span>
                      <span data-testid="text-cost">
                        ${shipment.cost} {shipment.currency}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Timeline */}
                <div>
                  <h3 className="font-semibold mb-4">Delivery Timeline</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Booked:</span>
                      <span data-testid="text-created">
                        {shipment.createdAt ? new Date(shipment.createdAt).toLocaleDateString() : "-"}
                      </span>
                    </div>
                    {shipment.estimatedDelivery && (
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Estimated Delivery:</span>
                        <span data-testid="text-estimated-delivery">
                          {new Date(shipment.estimatedDelivery).toLocaleDateString()}
                        </span>
                      </div>
                    )}
                    {shipment.actualDelivery && (
                      <div className="flex justify-between">
                        <span className="text-muted-foreground">Delivered:</span>
                        <span className="text-accent font-medium" data-testid="text-actual-delivery">
                          {new Date(shipment.actualDelivery!).toLocaleDateString()}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Status Progress */}
              <div className="mt-8">
                <h3 className="font-semibold mb-4">Tracking History</h3>
                <div className="space-y-4">
                  <div className={`flex items-center p-3 rounded-lg border ${
                    shipment.status === "delivered" ? "bg-accent/10 border-accent" : 
                    shipment.status === "in_transit" ? "bg-primary/10 border-primary" : 
                    "bg-muted border-border"
                  }`} data-testid="status-current">
                    {getStatusIcon(shipment.status ?? "pending")}
                    <div className="ml-3">
                      <p className="font-medium">
                        {shipment.status === "pending" && "Package ready for pickup"}
                        {shipment.status === "in_transit" && "Package in transit"}
                        {shipment.status === "delivered" && "Package delivered"}
                        {shipment.status === "cancelled" && "Shipment cancelled"}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {shipment.updatedAt ? new Date(shipment.updatedAt).toLocaleString() : "-"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Not Found Message */}
        {notFound && (
          <Card data-testid="card-not-found">
            <CardContent className="py-16 text-center">
              <Package className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-foreground mb-2">
                Shipment Not Found
              </h3>
              <p className="text-muted-foreground mb-4">
                We couldn't find a shipment with that tracking number.
              </p>
              <p className="text-sm text-muted-foreground">
                Please check the tracking number and try again, or contact our support team if you continue to have issues.
              </p>
            </CardContent>
          </Card>
        )}

        {/* Sample Tracking Numbers */}
        {!shipment && !notFound && (
          <Card data-testid="card-sample-tracking">
            <CardHeader>
              <CardTitle>Need Help?</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium mb-2">Tracking Number Format</h4>
                  <p className="text-sm text-muted-foreground">
                    Our tracking numbers follow this format: GBG + 13 characters (letters and numbers)
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Example: GBG123456789ABC
                  </p>
                </div>
                
                <div>
                  <h4 className="font-medium mb-2">Having Issues?</h4>
                  <p className="text-sm text-muted-foreground mb-2">
                    If you can't find your tracking number, check:
                  </p>
                  <ul className="text-sm text-muted-foreground space-y-1 ml-4">
                    <li>• Your booking confirmation email</li>
                    <li>• Your account dashboard</li>
                    <li>• SMS notifications if enabled</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
