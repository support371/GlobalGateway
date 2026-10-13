import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Truck, Calculator, Package, MapPin, HelpCircle, Clock, Globe, Shield, Warehouse } from "lucide-react";

export default function LogisticsHome() {
  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="text-center mb-12">
        <div className="flex justify-center mb-6">
          <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center">
            <Truck className="h-10 w-10 text-primary" />
          </div>
        </div>
        <h1 className="text-4xl font-bold text-foreground mb-4" data-testid="text-logistics-title">
          Global Logistics Solutions
        </h1>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8" data-testid="text-logistics-description">
          Explore domestic carrier tools and managed warehouse forwarding. Actual order registration, rates and international fulfillment depend on operational readiness and provider approvals.
        </p>
        <div className="flex flex-col sm:flex-row flex-wrap gap-4 justify-center">
          <Button size="lg" asChild>
            <Link href="/logistics/warehouse-forwarding">
              <Warehouse className="mr-2 h-5 w-5" />
              Warehouse Forwarding
            </Link>
          </Button>
          <Button size="lg" variant="outline" asChild>
            <Link href="/logistics/usps-services">
              <Package className="mr-2 h-5 w-5" />
              USPS Services
            </Link>
          </Button>
          <Button size="lg" variant="outline" asChild>
            <Link href="/logistics/shipping-calculator">
              <Calculator className="mr-2 h-5 w-5" />
              Calculate Shipping
            </Link>
          </Button>
          <Button size="lg" variant="outline" asChild>
            <Link href="/logistics/book-shipping">Shipping Readiness</Link>
          </Button>
        </div>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-6 mb-12">
        <Card className="hover:shadow-lg transition-shadow" data-testid="card-warehouse-forwarding">
          <CardHeader className="text-center">
            <Warehouse className="h-12 w-12 text-primary mx-auto mb-4" />
            <CardTitle>Warehouse Forwarding</CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-muted-foreground mb-4">
              Review the assigned U.S. warehouse suite and the readiness of online order intake before sending any parcel.
            </p>
            <Link href="/logistics/warehouse-forwarding">
              <Button className="w-full" data-testid="button-warehouse-forwarding">
                Review Forwarding
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow" data-testid="card-shipping-calculator">
          <CardHeader className="text-center">
            <Calculator className="h-12 w-12 text-primary mx-auto mb-4" />
            <CardTitle>Shipping Calculator</CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-muted-foreground mb-4">
              Check actual USPS domestic rates when access is enabled, or request a warehouse-forwarding quote.
            </p>
            <Link href="/logistics/shipping-calculator">
              <Button variant="outline" className="w-full" data-testid="button-use-calculator">
                Use Calculator
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow" data-testid="card-book-shipping">
          <CardHeader className="text-center">
            <Package className="h-12 w-12 text-primary mx-auto mb-4" />
            <CardTitle>Shipping Requests</CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-muted-foreground mb-4">
              Review forwarding and quote options. Direct postage purchasing is not yet enabled.
            </p>
            <Link href="/logistics/book-shipping">
              <Button variant="outline" className="w-full" data-testid="button-book-shipment">
                View Options
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow" data-testid="card-tracking">
          <CardHeader className="text-center">
            <MapPin className="h-12 w-12 text-primary mx-auto mb-4" />
            <CardTitle>Package Tracking</CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-muted-foreground mb-4">
              Look up supported carrier tracking or your warehouse order status.
            </p>
            <Link href="/logistics/tracking">
              <Button variant="outline" className="w-full" data-testid="button-track-package">
                Track Package
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow" data-testid="card-support">
          <CardHeader className="text-center">
            <HelpCircle className="h-12 w-12 text-primary mx-auto mb-4" />
            <CardTitle>Support & FAQ</CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-muted-foreground mb-4">
              Find answers to common questions and get expert support.
            </p>
            <Link href="/logistics/faq">
              <Button variant="outline" className="w-full" data-testid="button-view-faq">
                View FAQ
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>

      <div className="grid md:grid-cols-3 gap-8 mb-12">
        <div className="text-center" data-testid="feature-speed">
          <Clock className="h-12 w-12 text-accent mx-auto mb-4" />
          <h3 className="text-xl font-semibold mb-2">Controlled Release</h3>
          <p className="text-muted-foreground">
            Hold packages until inspection, consolidation, return, or final shipment is approved.
          </p>
        </div>

        <div className="text-center" data-testid="feature-global">
          <Globe className="h-12 w-12 text-accent mx-auto mb-4" />
          <h3 className="text-xl font-semibold mb-2">Global Destinations</h3>
          <p className="text-muted-foreground">
            Prepare packages for delivery to the customer or the customer’s chosen gift recipient.
          </p>
        </div>

        <div className="text-center" data-testid="feature-security">
          <Shield className="h-12 w-12 text-accent mx-auto mb-4" />
          <h3 className="text-xl font-semibold mb-2">Traceable Workflow</h3>
          <p className="text-muted-foreground">
            Confirmed forwarding requests receive an internal GlobalGateway reference and restricted status lookup when secure intake is enabled.
          </p>
        </div>
      </div>

      <Card className="bg-primary text-primary-foreground" data-testid="card-forwarding-flow">
        <CardContent className="py-10">
          <div className="grid sm:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-2xl font-bold mb-2">1</div>
              <div className="text-blue-100">Register order</div>
            </div>
            <div>
              <div className="text-2xl font-bold mb-2">2</div>
              <div className="text-blue-100">Receive at suite</div>
            </div>
            <div>
              <div className="text-2xl font-bold mb-2">3</div>
              <div className="text-blue-100">Hold or consolidate</div>
            </div>
            <div>
              <div className="text-2xl font-bold mb-2">4</div>
              <div className="text-blue-100">Release and track</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
