import { FormEvent, useEffect, useMemo, useState } from "react";
import { Link } from "wouter";
import {
  CheckCircle2,
  Clipboard,
  Clock3,
  PackageCheck,
  Search,
  ShieldCheck,
  Warehouse,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";

type ForwardingAction = "hold" | "inspect" | "consolidate" | "return" | "ship";

type FormState = {
  customerName: string;
  customerEmail: string;
  merchantName: string;
  merchantOrderNumber: string;
  inboundTrackingNumber: string;
  itemDescription: string;
  quantity: string;
  declaredValue: string;
  currency: string;
  requestedAction: ForwardingAction;
  recipientName: string;
  recipientAddress1: string;
  recipientAddress2: string;
  recipientCity: string;
  recipientState: string;
  recipientPostalCode: string;
  recipientCountry: string;
  notes: string;
  termsAccepted: boolean;
};

interface WarehouseConfig {
  provider: "shipito";
  mode: "manual" | "api";
  apiEnabled: boolean;
  accountName: string;
  suite: string;
  address1: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  formattedAddress: string[];
  instructions: string[];
}

interface ForwardingOrder {
  id: string;
  reference: string;
  provider: string;
  providerSuite: string;
  customerName: string;
  customerEmail: string;
  merchantName: string | null;
  merchantOrderNumber: string | null;
  inboundTrackingNumber: string | null;
  itemDescription: string;
  quantity: number;
  declaredValue: string | null;
  currency: string;
  requestedAction: ForwardingAction;
  status: string;
  warehousePackageId: string | null;
  outboundCarrier: string | null;
  outboundTrackingNumber: string | null;
  createdAt: string;
  updatedAt: string;
}

const fallbackWarehouse: WarehouseConfig = {
  provider: "shipito",
  mode: "manual",
  apiEnabled: false,
  accountName: "Victoria Eleanor",
  suite: "BZA842",
  address1: "444 Alaska Avenue",
  city: "Torrance",
  state: "CA",
  postalCode: "90503",
  country: "USA",
  formattedAddress: [
    "Victoria Eleanor",
    "444 Alaska Avenue",
    "Suite #BZA842",
    "Torrance, CA 90503",
    "USA",
  ],
  instructions: [
    "Always include Suite #BZA842 on the merchant shipping label.",
    "Create a forwarding order before the package arrives.",
    "Warehouse actions are reviewed manually while API access is pending.",
    "Do not send prohibited or restricted items.",
  ],
};

const initialForm: FormState = {
  customerName: "",
  customerEmail: "",
  merchantName: "",
  merchantOrderNumber: "",
  inboundTrackingNumber: "",
  itemDescription: "",
  quantity: "1",
  declaredValue: "",
  currency: "USD",
  requestedAction: "hold",
  recipientName: "",
  recipientAddress1: "",
  recipientAddress2: "",
  recipientCity: "",
  recipientState: "",
  recipientPostalCode: "",
  recipientCountry: "",
  notes: "",
  termsAccepted: false,
};

function humanize(value: string) {
  return value
    .replace(/_/g, " ")
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

async function parseResponse<T>(response: Response): Promise<T> {
  const payload = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(payload?.message || "The request could not be completed.");
  }
  return payload as T;
}

export default function WarehouseForwarding() {
  const { toast } = useToast();
  const [warehouse, setWarehouse] = useState<WarehouseConfig>(fallbackWarehouse);
  const [form, setForm] = useState<FormState>(initialForm);
  const [submitting, setSubmitting] = useState(false);
  const [createdOrder, setCreatedOrder] = useState<ForwardingOrder | null>(null);
  const [lookupReference, setLookupReference] = useState("");
  const [lookupEmail, setLookupEmail] = useState("");
  const [lookupLoading, setLookupLoading] = useState(false);
  const [lookupOrder, setLookupOrder] = useState<ForwardingOrder | null>(null);

  useEffect(() => {
    fetch("/api/warehouse/config")
      .then((response) => parseResponse<WarehouseConfig>(response))
      .then(setWarehouse)
      .catch(() => setWarehouse(fallbackWarehouse));
  }, []);

  const warehouseAddress = useMemo(
    () => warehouse.formattedAddress.join("\n"),
    [warehouse.formattedAddress],
  );

  const setField = <K extends keyof FormState>(key: K, value: FormState[K]) => {
    setForm((current) => ({ ...current, [key]: value }));
  };

  const copyWarehouseAddress = async () => {
    try {
      await navigator.clipboard.writeText(warehouseAddress);
      toast({ title: "Warehouse address copied" });
    } catch {
      toast({
        title: "Copy unavailable",
        description: "Select and copy the address manually.",
        variant: "destructive",
      });
    }
  };

  const submitOrder = async (event: FormEvent) => {
    event.preventDefault();
    if (!form.termsAccepted) {
      toast({
        title: "Confirm the forwarding instructions",
        description: `You must confirm that Suite #${warehouse.suite} will appear on the label.`,
        variant: "destructive",
      });
      return;
    }

    setSubmitting(true);
    try {
      const response = await fetch("/api/forwarding-orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...form,
          quantity: Number(form.quantity || 1),
          declaredValue: form.declaredValue ? Number(form.declaredValue) : undefined,
          website: "",
        }),
      });
      const payload = await parseResponse<{
        order: ForwardingOrder;
        warehouse: WarehouseConfig;
      }>(response);
      setCreatedOrder(payload.order);
      setWarehouse(payload.warehouse);
      setLookupReference(payload.order.reference);
      setLookupEmail(payload.order.customerEmail);
      toast({
        title: "Forwarding order created",
        description: `Reference ${payload.order.reference} is ready for the incoming package.`,
      });
      setForm(initialForm);
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (error) {
      toast({
        title: "Unable to create forwarding order",
        description: error instanceof Error ? error.message : "Please try again.",
        variant: "destructive",
      });
    } finally {
      setSubmitting(false);
    }
  };

  const lookup = async (event: FormEvent) => {
    event.preventDefault();
    setLookupLoading(true);
    setLookupOrder(null);
    try {
      const reference = lookupReference.trim().toUpperCase();
      const email = encodeURIComponent(lookupEmail.trim());
      const response = await fetch(
        `/api/forwarding-orders/${encodeURIComponent(reference)}?email=${email}`,
      );
      const payload = await parseResponse<{ order: ForwardingOrder }>(response);
      setLookupOrder(payload.order);
    } catch (error) {
      toast({
        title: "Order not found",
        description: error instanceof Error ? error.message : "Check the reference and email.",
        variant: "destructive",
      });
    } finally {
      setLookupLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="text-center">
          <div className="flex justify-center mb-5">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
              <Warehouse className="h-8 w-8 text-primary" />
            </div>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold mb-3">
            U.S. Warehouse & Package Forwarding
          </h1>
          <p className="text-muted-foreground max-w-3xl mx-auto">
            Register a purchase or gift before it reaches the assigned warehouse suite, hold it,
            and prepare it for delivery to the final recipient.
          </p>
        </div>

        <Card className="border-amber-300 bg-amber-50/60 dark:bg-amber-950/20">
          <CardContent className="py-5 flex flex-col md:flex-row md:items-center gap-4">
            <Clock3 className="h-6 w-6 text-amber-700 shrink-0" />
            <div className="flex-1">
              <p className="font-semibold">Manual warehouse mode is active</p>
              <p className="text-sm text-muted-foreground">
                Orders and warehouse actions are reviewed manually while Shipito for Business API
                access is being processed. No automated carrier purchase is represented as active.
              </p>
            </div>
            <Badge variant="outline">{warehouse.apiEnabled ? "API active" : "API pending"}</Badge>
          </CardContent>
        </Card>

        {createdOrder && (
          <Card className="border-green-300 bg-green-50/60 dark:bg-green-950/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-green-800 dark:text-green-200">
                <CheckCircle2 className="h-5 w-5" />
                Forwarding order ready
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-3 gap-4">
                <div>
                  <p className="text-xs uppercase text-muted-foreground">Reference</p>
                  <p className="font-mono font-semibold break-all">{createdOrder.reference}</p>
                </div>
                <div>
                  <p className="text-xs uppercase text-muted-foreground">Status</p>
                  <p className="font-semibold">{humanize(createdOrder.status)}</p>
                </div>
                <div>
                  <p className="text-xs uppercase text-muted-foreground">Requested action</p>
                  <p className="font-semibold">{humanize(createdOrder.requestedAction)}</p>
                </div>
              </div>
              <p className="text-sm">
                Use the exact address below. Keep this GlobalGateway reference with the merchant
                order receipt and add the incoming tracking number when available.
              </p>
            </CardContent>
          </Card>
        )}

        <div className="grid lg:grid-cols-[0.85fr_1.15fr] gap-8 items-start">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <PackageCheck className="h-5 w-5" />
                  Assigned warehouse address
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="rounded-lg border bg-muted/40 p-4 font-mono whitespace-pre-line">
                  {warehouseAddress}
                </div>
                <Button type="button" variant="outline" className="w-full" onClick={copyWarehouseAddress}>
                  <Clipboard className="mr-2 h-4 w-4" />
                  Copy exact address
                </Button>
                <div className="rounded-lg border border-red-200 bg-red-50 p-4 dark:bg-red-950/20">
                  <p className="font-semibold text-red-800 dark:text-red-200">
                    Suite #{warehouse.suite} is mandatory
                  </p>
                  <p className="text-sm text-red-700 dark:text-red-300 mt-1">
                    A package without the suite can be delayed or may not be matched to the account.
                  </p>
                </div>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  {warehouse.instructions.map((instruction) => (
                    <li key={instruction} className="flex gap-2">
                      <ShieldCheck className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                      <span>{instruction}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>How the pilot works</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-sm">
                {[
                  "Create the forwarding order before buying or dispatching the item.",
                  `Send the item to the exact address with Suite #${warehouse.suite}.`,
                  "The incoming package is matched and held for manual review.",
                  "Choose hold, inspection, consolidation, return, or final shipment.",
                  "Outbound carrier and tracking details are added after approval and payment.",
                ].map((step, index) => (
                  <div key={step} className="flex gap-3">
                    <div className="h-7 w-7 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-xs font-bold shrink-0">
                      {index + 1}
                    </div>
                    <p className="pt-1">{step}</p>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Create a forwarding order</CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={submitOrder} className="space-y-6">
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="customer-name">Customer or requester name</Label>
                    <Input
                      id="customer-name"
                      value={form.customerName}
                      onChange={(event) => setField("customerName", event.target.value)}
                      required
                      maxLength={120}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="customer-email">Email</Label>
                    <Input
                      id="customer-email"
                      type="email"
                      value={form.customerEmail}
                      onChange={(event) => setField("customerEmail", event.target.value)}
                      required
                      maxLength={254}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="merchant-name">Merchant or sender</Label>
                    <Input
                      id="merchant-name"
                      placeholder="Amazon, Walmart, private sender…"
                      value={form.merchantName}
                      onChange={(event) => setField("merchantName", event.target.value)}
                      maxLength={160}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="merchant-order">Merchant order number</Label>
                    <Input
                      id="merchant-order"
                      value={form.merchantOrderNumber}
                      onChange={(event) => setField("merchantOrderNumber", event.target.value)}
                      maxLength={120}
                    />
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="inbound-tracking">Incoming tracking number, when available</Label>
                    <Input
                      id="inbound-tracking"
                      value={form.inboundTrackingNumber}
                      onChange={(event) => setField("inboundTrackingNumber", event.target.value)}
                      maxLength={120}
                    />
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="item-description">Item description</Label>
                    <Textarea
                      id="item-description"
                      placeholder="Describe the purchase or gift and identify anything needed for matching."
                      value={form.itemDescription}
                      onChange={(event) => setField("itemDescription", event.target.value)}
                      required
                      maxLength={1000}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="quantity">Quantity</Label>
                    <Input
                      id="quantity"
                      type="number"
                      min="1"
                      max="1000"
                      value={form.quantity}
                      onChange={(event) => setField("quantity", event.target.value)}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="declared-value">Declared value (optional)</Label>
                    <div className="flex gap-2">
                      <Input
                        id="declared-value"
                        type="number"
                        min="0"
                        step="0.01"
                        value={form.declaredValue}
                        onChange={(event) => setField("declaredValue", event.target.value)}
                      />
                      <Input
                        aria-label="Currency"
                        className="w-24"
                        value={form.currency}
                        onChange={(event) => setField("currency", event.target.value.toUpperCase())}
                        maxLength={3}
                      />
                    </div>
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <Label>Requested warehouse action</Label>
                    <Select
                      value={form.requestedAction}
                      onValueChange={(value: ForwardingAction) => setField("requestedAction", value)}
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="hold">Hold until further instruction</SelectItem>
                        <SelectItem value="inspect">Request inspection or photos</SelectItem>
                        <SelectItem value="consolidate">Consolidate with another package</SelectItem>
                        <SelectItem value="return">Prepare return to sender</SelectItem>
                        <SelectItem value="ship">Prepare final shipment</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <Separator />

                <div>
                  <h3 className="font-semibold">Final recipient, optional at this stage</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    Leave blank when the package should only be received and held.
                  </p>
                </div>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="recipient-name">Recipient name</Label>
                    <Input
                      id="recipient-name"
                      value={form.recipientName}
                      onChange={(event) => setField("recipientName", event.target.value)}
                    />
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="recipient-address1">Address line 1</Label>
                    <Input
                      id="recipient-address1"
                      value={form.recipientAddress1}
                      onChange={(event) => setField("recipientAddress1", event.target.value)}
                    />
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="recipient-address2">Address line 2</Label>
                    <Input
                      id="recipient-address2"
                      value={form.recipientAddress2}
                      onChange={(event) => setField("recipientAddress2", event.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="recipient-city">City</Label>
                    <Input
                      id="recipient-city"
                      value={form.recipientCity}
                      onChange={(event) => setField("recipientCity", event.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="recipient-state">State or region</Label>
                    <Input
                      id="recipient-state"
                      value={form.recipientState}
                      onChange={(event) => setField("recipientState", event.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="recipient-postal">Postal code</Label>
                    <Input
                      id="recipient-postal"
                      value={form.recipientPostalCode}
                      onChange={(event) => setField("recipientPostalCode", event.target.value)}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="recipient-country">Country</Label>
                    <Input
                      id="recipient-country"
                      value={form.recipientCountry}
                      onChange={(event) => setField("recipientCountry", event.target.value)}
                    />
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="notes">Special instructions</Label>
                    <Textarea
                      id="notes"
                      value={form.notes}
                      onChange={(event) => setField("notes", event.target.value)}
                      maxLength={2000}
                    />
                  </div>
                </div>

                <div className="flex items-start gap-3 rounded-lg border p-4">
                  <Checkbox
                    id="terms"
                    checked={form.termsAccepted}
                    onCheckedChange={(checked) => setField("termsAccepted", checked === true)}
                  />
                  <Label htmlFor="terms" className="leading-5 font-normal cursor-pointer">
                    I understand that the merchant label must use the exact assigned warehouse
                    address and include Suite #{warehouse.suite}. I will not send prohibited items,
                    and I understand this order is processed manually until API access is activated.
                  </Label>
                </div>

                <Button type="submit" className="w-full" size="lg" disabled={submitting}>
                  {submitting ? "Creating order…" : "Create forwarding order"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Search className="h-5 w-5" />
              Check forwarding status
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={lookup} className="grid md:grid-cols-[1fr_1fr_auto] gap-4 items-end">
              <div className="space-y-2">
                <Label htmlFor="lookup-reference">GlobalGateway reference</Label>
                <Input
                  id="lookup-reference"
                  placeholder="GGW-YYYYMMDD-XXXXXXXXXX"
                  value={lookupReference}
                  onChange={(event) => setLookupReference(event.target.value.toUpperCase())}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lookup-email">Order email</Label>
                <Input
                  id="lookup-email"
                  type="email"
                  value={lookupEmail}
                  onChange={(event) => setLookupEmail(event.target.value)}
                  required
                />
              </div>
              <Button type="submit" disabled={lookupLoading}>
                {lookupLoading ? "Checking…" : "Check status"}
              </Button>
            </form>

            {lookupOrder && (
              <div className="mt-6 rounded-lg border p-5 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                  <div>
                    <p className="font-mono font-semibold">{lookupOrder.reference}</p>
                    <p className="text-sm text-muted-foreground">
                      Created {new Date(lookupOrder.createdAt).toLocaleString()}
                    </p>
                  </div>
                  <Badge>{humanize(lookupOrder.status)}</Badge>
                </div>
                <Separator />
                <div className="grid md:grid-cols-3 gap-4 text-sm">
                  <div>
                    <p className="text-muted-foreground">Item</p>
                    <p className="font-medium">{lookupOrder.itemDescription}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Warehouse package ID</p>
                    <p className="font-medium">{lookupOrder.warehousePackageId || "Not assigned"}</p>
                  </div>
                  <div>
                    <p className="text-muted-foreground">Outbound tracking</p>
                    <p className="font-medium">
                      {lookupOrder.outboundTrackingNumber || "Not shipped"}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>

        <div className="text-center text-sm text-muted-foreground">
          Need ordinary carrier rates or USPS tracking?{" "}
          <Link href="/logistics/usps-services" className="text-primary underline underline-offset-4">
            Open USPS Services
          </Link>
        </div>
      </div>
    </div>
  );
}
