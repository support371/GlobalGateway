import { Link } from "wouter";
import { Calculator, Globe2, Warehouse, ArrowRight, Info } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { RateCalculator } from "./USPSServices";

/**
 * Customer-facing quote entry. Never invent prices: domestic quotes are
 * returned only by approved USPS APIs; cross-border fulfilment stays manual.
 */
export default function ShippingCalculator() {
  return (
    <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-10 space-y-8" data-testid="shipping-calculator-page">
      <section className="max-w-3xl">
        <p className="text-sm uppercase tracking-widest text-primary font-semibold">GlobalGateway Logistics</p>
        <h1 className="text-3xl md:text-4xl font-bold mt-2 mb-3">Shipping quotes and forwarding</h1>
        <p className="text-muted-foreground text-lg">
          Check actual USPS domestic shipping rates where authorized. International shipping,
          warehouse consolidation and gift delivery are requested through our managed forwarding workflow.
        </p>
      </section>
      <div className="grid lg:grid-cols-[minmax(0,2fr)_minmax(290px,1fr)] gap-6 items-start">
        <RateCalculator />
        <div className="space-y-5">
          <Card>
            <CardHeader><CardTitle className="flex items-center gap-2"><Warehouse className="h-5 w-5" /> Warehouse forwarding</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-muted-foreground">Register a purchase or gift for receipt at the assigned U.S. warehouse suite. Hold, inspect, consolidate, then request international or domestic forwarding.</p>
              <Button asChild className="w-full"><Link href="/logistics/warehouse-forwarding">Create forwarding request <ArrowRight className="ml-2 h-4 w-4" /></Link></Button>
            </CardContent>
          </Card>
          <Card>
            <CardHeader><CardTitle className="flex items-center gap-2"><Globe2 className="h-5 w-5" /> International delivery</CardTitle></CardHeader>
            <CardContent>
              <p className="text-sm text-muted-foreground">Cross-border carrier availability, customs charges, and transit times require a confirmed fulfillment quotation. USPS domestic rates do not represent international pricing.</p>
            </CardContent>
          </Card>
          <div className="rounded-lg border bg-muted/40 p-4 text-sm flex items-start gap-3">
            <Info className="h-5 w-5 text-primary shrink-0" />
            <p>Live prices appear only after carrier authorization succeeds. A quote is not a postage purchase, and a GlobalGateway order reference is not a carrier tracking number.</p>
          </div>
        </div>
      </div>
    </main>
  );
}
