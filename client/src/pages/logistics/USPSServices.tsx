import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {
  Package,
  Calculator,
  MapPinCheck,
  Truck,
  Info,
  CheckCircle2,
  AlertTriangle,
} from "lucide-react";
import {
  getUspsRates,
  verifyUspsAddress,
  UspsRequestError,
  type UspsRate,
  type UspsVerifiedAddress,
} from "@/lib/usps";

const zip5 = z.string().regex(/^\d{5}$/, "Enter a valid 5-digit ZIP code");

const rateSchema = z.object({
  originZip: zip5,
  destinationZip: zip5,
  weight: z
    .string()
    .min(1, "Weight is required")
    .refine((v) => Number(v) > 0 && Number(v) <= 70, "Weight must be between 0 and 70 lbs"),
  service: z.string().default("ALL"),
});
type RateForm = z.infer<typeof rateSchema>;

const addressSchema = z.object({
  address2: z.string().min(1, "Street address is required"),
  address1: z.string().optional(),
  city: z.string().min(1, "City is required"),
  state: z
    .string()
    .min(2, "Use the 2-letter state code")
    .max(2, "Use the 2-letter state code"),
  zip5: z.string().optional(),
});
type AddressForm = z.infer<typeof addressSchema>;

const SERVICE_OPTIONS = [
  { value: "ALL", label: "All available services" },
  { value: "PRIORITY", label: "Priority Mail" },
  { value: "PRIORITY MAIL EXPRESS", label: "Priority Mail Express" },
  { value: "FIRST CLASS", label: "First-Class Package" },
  { value: "PARCEL SELECT GROUND", label: "USPS Ground Advantage" },
];

function AccessPendingNotice() {
  return (
    <Alert className="border-primary/40 bg-primary/5">
      <Info className="h-4 w-4" />
      <AlertTitle>USPS API access pending activation</AlertTitle>
      <AlertDescription>
        The connection to USPS Web Tools is configured and working, but the U.S.
        Postal Service has not yet activated this account&apos;s API access on
        their production server. Live results will appear here automatically
        once USPS approves the access request for your Web Tools USERID.
      </AlertDescription>
    </Alert>
  );
}

function RateCalculator() {
  const [rates, setRates] = useState<UspsRate[] | null>(null);
  const [accessPending, setAccessPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const form = useForm<RateForm>({
    resolver: zodResolver(rateSchema),
    defaultValues: { originZip: "", destinationZip: "", weight: "", service: "ALL" },
  });

  const onSubmit = async (data: RateForm) => {
    setLoading(true);
    setError(null);
    setAccessPending(false);
    setRates(null);
    try {
      const result = await getUspsRates({
        originZip: data.originZip,
        destinationZip: data.destinationZip,
        weightLbs: Number(data.weight),
        service: data.service,
      });
      setRates(result.rates);
    } catch (err) {
      if (err instanceof UspsRequestError && err.isAccessPending) {
        setAccessPending(true);
      } else {
        setError(err instanceof Error ? err.message : "Unable to fetch rates.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card data-testid="card-usps-rates">
      <CardHeader>
        <CardTitle className="flex items-center">
          <Calculator className="mr-2 h-5 w-5 text-primary" />
          USPS Rate Calculator
        </CardTitle>
        <CardDescription>
          Live domestic rates from the USPS RateV4 Web Tools API.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="originZip"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Origin ZIP</FormLabel>
                    <FormControl>
                      <Input
                        inputMode="numeric"
                        placeholder="e.g. 90210"
                        maxLength={5}
                        {...field}
                        data-testid="input-origin-zip"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="destinationZip"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Destination ZIP</FormLabel>
                    <FormControl>
                      <Input
                        inputMode="numeric"
                        placeholder="e.g. 10001"
                        maxLength={5}
                        {...field}
                        data-testid="input-destination-zip"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="weight"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Weight (lbs)</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        step="0.1"
                        inputMode="decimal"
                        placeholder="e.g. 2.5"
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
                    <FormLabel>Service</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger data-testid="select-usps-service">
                          <SelectValue />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {SERVICE_OPTIONS.map((o) => (
                          <SelectItem key={o.value} value={o.value}>
                            {o.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <Button
              type="submit"
              className="w-full"
              disabled={loading}
              data-testid="button-get-rates"
            >
              {loading ? "Getting rates..." : "Get USPS Rates"}
            </Button>
          </form>
        </Form>

        {accessPending && (
          <div className="mt-6">
            <AccessPendingNotice />
          </div>
        )}

        {error && (
          <Alert variant="destructive" className="mt-6">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Could not get rates</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {rates && rates.length > 0 && (
          <div className="mt-6 space-y-3" data-testid="usps-rate-results">
            <h3 className="font-semibold">Available Services</h3>
            {rates.map((r, i) => (
              <div
                key={`${r.service}-${i}`}
                className="flex items-center justify-between rounded-lg border p-4"
              >
                <div className="flex items-center gap-3">
                  <Truck className="h-5 w-5 text-primary" />
                  <div>
                    <p className="font-medium">{r.service}</p>
                    {r.commitment && (
                      <p className="text-sm text-muted-foreground">{r.commitment}</p>
                    )}
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-lg font-bold" data-testid={`rate-${i}`}>
                    ${r.rate.toFixed(2)}
                  </p>
                  {r.zone && (
                    <p className="text-xs text-muted-foreground">Zone {r.zone}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}

        {rates && rates.length === 0 && (
          <p className="mt-6 text-sm text-muted-foreground">
            No rates were returned for this route and weight.
          </p>
        )}
      </CardContent>
    </Card>
  );
}

function AddressVerifier() {
  const [verified, setVerified] = useState<UspsVerifiedAddress | null>(null);
  const [accessPending, setAccessPending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const form = useForm<AddressForm>({
    resolver: zodResolver(addressSchema),
    defaultValues: { address2: "", address1: "", city: "", state: "", zip5: "" },
  });

  const onSubmit = async (data: AddressForm) => {
    setLoading(true);
    setError(null);
    setAccessPending(false);
    setVerified(null);
    try {
      const result = await verifyUspsAddress({
        address1: data.address1,
        address2: data.address2,
        city: data.city,
        state: data.state.toUpperCase(),
        zip5: data.zip5,
      });
      setVerified(result.address);
    } catch (err) {
      if (err instanceof UspsRequestError && err.isAccessPending) {
        setAccessPending(true);
      } else {
        setError(err instanceof Error ? err.message : "Unable to verify address.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card data-testid="card-usps-verify">
      <CardHeader>
        <CardTitle className="flex items-center">
          <MapPinCheck className="mr-2 h-5 w-5 text-primary" />
          Address Verification
        </CardTitle>
        <CardDescription>
          Standardize and validate US addresses via the USPS Address (Verify) API.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="address2"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Street Address</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="1600 Amphitheatre Pkwy"
                      {...field}
                      data-testid="input-street"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="address1"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Apt / Suite (optional)</FormLabel>
                  <FormControl>
                    <Input placeholder="Suite 200" {...field} data-testid="input-apt" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <FormField
                control={form.control}
                name="city"
                render={({ field }) => (
                  <FormItem className="sm:col-span-1">
                    <FormLabel>City</FormLabel>
                    <FormControl>
                      <Input placeholder="Mountain View" {...field} data-testid="input-city" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="state"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>State</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="CA"
                        maxLength={2}
                        {...field}
                        data-testid="input-state"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="zip5"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>ZIP (optional)</FormLabel>
                    <FormControl>
                      <Input
                        inputMode="numeric"
                        placeholder="94043"
                        maxLength={5}
                        {...field}
                        data-testid="input-verify-zip"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <Button
              type="submit"
              className="w-full"
              disabled={loading}
              data-testid="button-verify-address"
            >
              {loading ? "Verifying..." : "Verify Address"}
            </Button>
          </form>
        </Form>

        {accessPending && (
          <div className="mt-6">
            <AccessPendingNotice />
          </div>
        )}

        {error && (
          <Alert variant="destructive" className="mt-6">
            <AlertTriangle className="h-4 w-4" />
            <AlertTitle>Address could not be verified</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {verified && (
          <div
            className="mt-6 rounded-lg border border-accent bg-accent/10 p-4"
            data-testid="verified-address"
          >
            <div className="mb-2 flex items-center gap-2 text-accent">
              <CheckCircle2 className="h-5 w-5" />
              <span className="font-semibold">Standardized Address</span>
            </div>
            <address className="not-italic text-sm leading-relaxed">
              {verified.address1 && <div>{verified.address1}</div>}
              <div>{verified.address2}</div>
              <div>
                {verified.city}, {verified.state} {verified.zip5}
                {verified.zip4 ? `-${verified.zip4}` : ""}
              </div>
            </address>
            {verified.returnText && (
              <p className="mt-2 text-xs text-muted-foreground">{verified.returnText}</p>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

export default function USPSServices() {
  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="max-w-5xl mx-auto">
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
              <Package className="h-8 w-8 text-primary" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-foreground mb-2 text-balance">
            USPS Web Tools Services
          </h1>
          <p className="text-muted-foreground text-pretty">
            Live USPS rate quotes and address verification, powered directly by the
            USPS Web Tools API.
          </p>
          <div className="mt-3 flex justify-center">
            <Badge variant="secondary">Powered by USPS Web Tools</Badge>
          </div>
        </div>

        <div className="grid gap-8 lg:grid-cols-2">
          <RateCalculator />
          <AddressVerifier />
        </div>
      </div>
    </div>
  );
}
