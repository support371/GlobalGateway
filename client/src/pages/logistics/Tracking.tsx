import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { MapPin, Package, Search, CheckCircle, Truck, Info, Clock } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { trackUspsPackage, UspsRequestError, type UspsTrackResult } from "@/lib/usps";
import type { Shipment } from "@shared/schema";

const trackingSchema = z.object({
  trackingNumber: z.string().min(1, "Tracking number is required"),
});
type TrackingForm = z.infer<typeof trackingSchema>;

export default function Tracking() {
  const [uspsResult, setUspsResult] = useState<UspsTrackResult | null>(null);
  const [shipment, setShipment] = useState<Shipment | null>(null);
  const [accessPending, setAccessPending] = useState(false);
  const [isTracking, setIsTracking] = useState(false);
  const [notFound, setNotFound] = useState(false);
  const { toast } = useToast();

  const form = useForm<TrackingForm>({
    resolver: zodResolver(trackingSchema),
    defaultValues: { trackingNumber: "" },
  });

  const lookupInternalShipment = async (trackingNumber: string) => {
    try {
      const response = await apiRequest("GET", `/api/shipments/track/${trackingNumber}`);
      const result = await response.json();
      setShipment(result);
      return true;
    } catch {
      return false;
    }
  };

  const onSubmit = async (data: TrackingForm) => {
    setIsTracking(true);
    setNotFound(false);
    setAccessPending(false);
    setShipment(null);
    setUspsResult(null);

    const trackingNumber = data.trackingNumber.trim();

    try {
      const result = await trackUspsPackage(trackingNumber);
      setUspsResult(result);
    } catch (err) {
      if (err instanceof UspsRequestError && err.isAccessPending) {
        // USPS credentials not yet activated — fall back to internal records.
        setAccessPending(true);
        const found = await lookupInternalShipment(trackingNumber);
        if (!found) setNotFound(true);
      } else {
        // USPS did not find it — try our own shipment records.
        const found = await lookupInternalShipment(trackingNumber);
        if (!found) {
          if (err instanceof UspsRequestError && err.status >= 500) {
            toast({
              title: "Tracking Failed",
              description: err.message,
              variant: "destructive",
            });
          } else {
            setNotFound(true);
          }
        }
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
      <Badge
        variant={statusInfo.variant}
        className={status === "delivered" ? "bg-accent hover:bg-accent" : ""}
      >
        {statusInfo.label}
      </Badge>
    );
  };

  const hasResult = uspsResult || shipment;

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
            Real-time tracking powered by USPS Web Tools
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
              <form onSubmit={form.handleSubmit(onSubmit)} className="flex flex-col sm:flex-row gap-4">
                <FormField
                  control={form.control}
                  name="trackingNumber"
                  render={({ field }) => (
                    <FormItem className="flex-1">
                      <FormControl>
                        <Input
                          placeholder="Enter USPS tracking number (e.g. 9400 1000 0000 0000 0000 00)"
                          {...field}
                          data-testid="input-tracking-number"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button type="submit" disabled={isTracking} data-testid="button-track">
                  {isTracking ? "Tracking..." : "Track"}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>

        {/* USPS access pending */}
        {accessPending && (
          <Alert className="mb-8 border-primary/40 bg-primary/5">
            <Info className="h-4 w-4" />
            <AlertTitle>USPS live tracking pending activation</AlertTitle>
            <AlertDescription>
              The USPS Web Tools connection is configured, but USPS has not yet
              activated API access for this account. Live carrier tracking will
              appear here automatically once approved. In the meantime, we&apos;ve
              checked your GlobalGateway shipment records.
            </AlertDescription>
          </Alert>
        )}

        {/* USPS Tracking Results */}
        {uspsResult && (
          <Card data-testid="card-usps-tracking-result">
            <CardHeader>
              <div className="flex justify-between items-start gap-4">
                <div>
                  <CardTitle className="flex items-center">
                    <Truck className="h-5 w-5 text-primary" />
                    <span className="ml-2 break-all">
                      Tracking: {uspsResult.trackingNumber}
                    </span>
                  </CardTitle>
                  <p className="text-muted-foreground mt-1">USPS Carrier Tracking</p>
                </div>
                {uspsResult.status && <Badge variant="default">{uspsResult.status}</Badge>}
              </div>
            </CardHeader>
            <CardContent>
              {uspsResult.expectedDelivery && (
                <div className="mb-6 flex items-center gap-2 text-sm">
                  <Clock className="h-4 w-4 text-primary" />
                  <span className="text-muted-foreground">Expected delivery:</span>
                  <span className="font-medium">{uspsResult.expectedDelivery}</span>
                </div>
              )}

              {uspsResult.summary && (
                <div className="mb-6 rounded-lg border border-primary/40 bg-primary/5 p-4">
                  <p className="font-medium">{uspsResult.summary}</p>
                </div>
              )}

              <h3 className="font-semibold mb-4">Tracking History</h3>
              <ol className="relative border-l border-border pl-6 space-y-6">
                {uspsResult.events.map((e, i) => (
                  <li key={i} className="relative" data-testid={`track-event-${i}`}>
                    <span
                      className={`absolute -left-[27px] flex h-4 w-4 items-center justify-center rounded-full ${
                        i === 0 ? "bg-primary" : "bg-muted-foreground/40"
                      }`}
                    />
                    <p className="font-medium leading-snug">{e.event}</p>
                    <p className="text-sm text-muted-foreground">
                      {[
                        [e.city, e.state, e.zip].filter(Boolean).join(", "),
                        [e.date, e.time].filter(Boolean).join(" "),
                      ]
                        .filter(Boolean)
                        .join(" • ")}
                    </p>
                  </li>
                ))}
                {uspsResult.events.length === 0 && (
                  <li className="text-sm text-muted-foreground">
                    No tracking events are available yet for this package.
                  </li>
                )}
              </ol>
            </CardContent>
          </Card>
        )}

        {/* Internal Shipment Results (fallback) */}
        {shipment && !uspsResult && (
          <Card data-testid="card-tracking-result">
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="flex items-center">
                    <Package className="h-5 w-5 text-muted-foreground" />
                    <span className="ml-2">Tracking: {shipment.trackingNumber}</span>
                  </CardTitle>
                  <p className="text-muted-foreground mt-1">{shipment.service} Service</p>
                </div>
                {getStatusBadge(shipment.status ?? "pending")}
              </div>
            </CardHeader>
            <CardContent>
              <div className="grid md:grid-cols-2 gap-6">
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
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Cost:</span>
                      <span data-testid="text-cost">
                        ${shipment.cost} {shipment.currency}
                      </span>
                    </div>
                  </div>
                </div>
                <div>
                  <h3 className="font-semibold mb-4">Delivery Timeline</h3>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Booked:</span>
                      <span data-testid="text-created">
                        {shipment.createdAt
                          ? new Date(shipment.createdAt).toLocaleDateString()
                          : "-"}
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
                  </div>
                </div>
              </div>

              <div className="mt-8 flex items-center rounded-lg border bg-muted p-3">
                {shipment.status === "delivered" ? (
                  <CheckCircle className="h-5 w-5 text-accent" />
                ) : (
                  <Truck className="h-5 w-5 text-primary" />
                )}
                <div className="ml-3">
                  <p className="font-medium">
                    {shipment.status === "pending" && "Package ready for pickup"}
                    {shipment.status === "in_transit" && "Package in transit"}
                    {shipment.status === "delivered" && "Package delivered"}
                    {shipment.status === "cancelled" && "Shipment cancelled"}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {shipment.updatedAt
                      ? new Date(shipment.updatedAt).toLocaleString()
                      : "-"}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Not Found Message */}
        {notFound && !hasResult && (
          <Card data-testid="card-not-found">
            <CardContent className="py-16 text-center">
              <Package className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-foreground mb-2">Shipment Not Found</h3>
              <p className="text-muted-foreground mb-4">
                We couldn&apos;t find tracking information for that number.
              </p>
              <p className="text-sm text-muted-foreground">
                Please double-check the tracking number and try again, or contact our
                support team if you continue to have issues.
              </p>
            </CardContent>
          </Card>
        )}

        {/* Help */}
        {!hasResult && !notFound && (
          <Card data-testid="card-sample-tracking">
            <CardHeader>
              <CardTitle>Need Help?</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <h4 className="font-medium mb-2">USPS Tracking Numbers</h4>
                  <p className="text-sm text-muted-foreground">
                    USPS tracking numbers are typically 20-22 digits (e.g. starting with
                    9400, 9205, or 9114). Enter it above to see live carrier updates.
                  </p>
                </div>
                <div>
                  <h4 className="font-medium mb-2">Having Issues?</h4>
                  <p className="text-sm text-muted-foreground mb-2">
                    If you can&apos;t find your tracking number, check:
                  </p>
                  <ul className="text-sm text-muted-foreground space-y-1 ml-4">
                    <li>Your booking confirmation email</li>
                    <li>Your account dashboard</li>
                    <li>SMS notifications if enabled</li>
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
