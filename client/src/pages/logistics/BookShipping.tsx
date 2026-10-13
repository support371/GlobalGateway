import { Link } from "wouter";
import { ArrowRight, Calculator, Clock3, ShieldAlert, Warehouse } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

/**
 * Informational intake gate. Direct carrier booking is not implemented and
 * customers must not be asked to submit self-priced shipments or pay postage.
 */
export default function BookShipping() {
  return (
    <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 space-y-8" data-testid="booking-gated-page">
      <section className="max-w-3xl">
        <p className="uppercase tracking-widest text-sm font-semibold text-primary">GlobalGateway Logistics</p>
        <h1 className="mt-2 text-3xl md:text-4xl font-bold">Shipping requests</h1>
        <p className="mt-4 text-muted-foreground text-lg">
          We are preparing carrier checkout and label purchasing. Until the required carrier
          authorizations and secure order processing are verified, no live carrier booking,
          payment or delivery commitment can be made on this page.
        </p>
      </section>
      <Card className="border-amber-400/60 bg-amber-50/70 dark:bg-amber-950/20">
        <CardContent className="flex gap-3 items-start py-5">
          <ShieldAlert className="shrink-0 h-6 w-6 text-amber-700" />
          <div>
            <p className="font-semibold">Direct booking is not available yet</p>
            <p className="text-sm text-muted-foreground mt-1">
              Do not send parcels or pay shipping charges without a confirmed service order
              and verified carrier instructions. An internal reference is not a USPS tracking number.
            </p>
          </div>
        </CardContent>
      </Card>
      <section className="grid gap-5 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><Warehouse className="h-5 w-5" /> Warehouse forwarding</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              Review the U.S. warehouse forwarding workflow, including manual processing.
              Online registration is disabled automatically when secure storage is unavailable.
            </p>
            <Button asChild className="w-full">
              <Link href="/logistics/warehouse-forwarding">
                Review forwarding options <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2"><Calculator className="h-5 w-5" /> USPS rate enquiry</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">
              See carrier-issued domestic rates if USPS REST credentials and API permissions
              are configured. No estimated or invented carrier prices are shown.
            </p>
            <Button asChild className="w-full" variant="outline">
              <Link href="/logistics/shipping-calculator">
                Check rate access <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </CardContent>
        </Card>
      </section>
      <p className="max-w-3xl text-sm text-muted-foreground flex items-start gap-2">
        <Clock3 className="h-4 w-4 shrink-0 mt-0.5" />
        <span>International forwarding remains subject to destination restrictions,
          item eligibility, customs obligations and an approved carrier quotation.</span>
      </p>
    </main>
  );
}
