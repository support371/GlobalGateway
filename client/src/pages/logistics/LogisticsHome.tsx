import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Truck, Calculator, Package, MapPin, HelpCircle, Clock, Globe, Shield } from "lucide-react";

export default function LogisticsHome() {
  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Hero Section */}
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
          Ship with confidence worldwide. Our comprehensive logistics network ensures your packages reach their destination safely and on time.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button size="lg" asChild>
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
                <Link href="/logistics/book-shipping">Book Now</Link>
              </Button>
        </div>
      </div>

      {/* Services Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        <Card className="hover:shadow-lg transition-shadow" data-testid="card-shipping-calculator">
          <CardHeader className="text-center">
            <Calculator className="h-12 w-12 text-primary mx-auto mb-4" />
            <CardTitle>Shipping Calculator</CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-muted-foreground mb-4">
              Get instant quotes for your shipments with our advanced pricing calculator.
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
            <CardTitle>Book Shipping</CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-muted-foreground mb-4">
              Schedule your shipments and manage all logistics from one platform.
            </p>
            <Link href="/logistics/book-shipping">
              <Button variant="outline" className="w-full" data-testid="button-book-shipment">
                Book Shipment
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
              Track your packages in real-time with detailed status updates.
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

      {/* Features Section */}
      <div className="grid md:grid-cols-3 gap-8 mb-12">
        <div className="text-center" data-testid="feature-speed">
          <Clock className="h-12 w-12 text-accent mx-auto mb-4" />
          <h3 className="text-xl font-semibold mb-2">Fast Delivery</h3>
          <p className="text-muted-foreground">
            Express and overnight shipping options available to over 180 countries worldwide.
          </p>
        </div>

        <div className="text-center" data-testid="feature-global">
          <Globe className="h-12 w-12 text-accent mx-auto mb-4" />
          <h3 className="text-xl font-semibold mb-2">Global Network</h3>
          <p className="text-muted-foreground">
            Extensive logistics network with local partners in major cities worldwide.
          </p>
        </div>

        <div className="text-center" data-testid="feature-security">
          <Shield className="h-12 w-12 text-accent mx-auto mb-4" />
          <h3 className="text-xl font-semibold mb-2">Secure Handling</h3>
          <p className="text-muted-foreground">
            Advanced security measures and insurance options to protect your valuable shipments.
          </p>
        </div>
      </div>

      {/* Stats Section */}
      <Card className="bg-primary text-primary-foreground" data-testid="card-stats">
        <CardContent className="py-12">
          <div className="grid sm:grid-cols-3 gap-8 text-center">
            <div data-testid="stat-countries-served">
              <div className="text-3xl font-bold mb-2">180+</div>
              <div className="text-blue-100">Countries Served</div>
            </div>
            <div data-testid="stat-packages-delivered">
              <div className="text-3xl font-bold mb-2">1M+</div>
              <div className="text-blue-100">Packages Delivered</div>
            </div>
            <div data-testid="stat-delivery-rate">
              <div className="text-3xl font-bold mb-2">99.9%</div>
              <div className="text-blue-100">On-Time Delivery</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}