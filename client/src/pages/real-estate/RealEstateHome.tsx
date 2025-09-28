import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Building, Search, MapPin, DollarSign, Calendar, Eye, TrendingUp, Award, Users, Globe } from "lucide-react";

export default function RealEstateHome() {
  const [, setLocation] = useLocation();

  const handleSearch = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const query = formData.get('search') as string;
    if (query) {
      setLocation(`/real-estate/listings?search=${encodeURIComponent(query)}`);
    } else {
      setLocation('/real-estate/listings');
    }
  };

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Hero Section */}
      <div className="text-center mb-12">
        <div className="flex justify-center mb-6">
          <div className="w-20 h-20 bg-accent/10 rounded-full flex items-center justify-center">
            <Building className="h-10 w-10 text-accent" />
          </div>
        </div>
        <h1 className="text-4xl font-bold text-foreground mb-4" data-testid="text-real-estate-title">
          Commercial Real Estate
        </h1>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8" data-testid="text-real-estate-description">
          Find the perfect commercial space for your business. From offices to warehouses and retail spaces, we have properties worldwide with flexible leasing terms.
        </p>
        
        {/* Search Bar */}
        <Card className="max-w-2xl mx-auto mb-8" data-testid="card-search">
          <CardContent className="p-6">
            <form onSubmit={handleSearch} className="flex gap-4">
              <Input 
                name="search"
                placeholder="Search by location, property type, or keywords..." 
                className="flex-1"
                data-testid="input-search"
              />
              <Button type="submit" data-testid="button-search">
                <Search className="mr-2 h-4 w-4" />
                Search
              </Button>
            </form>
          </CardContent>
        </Card>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/real-estate/listings">
            <Button size="lg" data-testid="button-browse-all">
              <Building className="mr-2 h-5 w-5" />
              Browse All Properties
            </Button>
          </Link>
          <Link href="/real-estate/lease-request">
            <Button variant="outline" size="lg" data-testid="button-request-lease">
              <Calendar className="mr-2 h-5 w-5" />
              Request Lease
            </Button>
          </Link>
        </div>
      </div>

      {/* Property Types */}
      <div className="grid md:grid-cols-3 gap-8 mb-12">
        <Card className="hover:shadow-lg transition-shadow" data-testid="card-offices">
          <CardHeader className="text-center">
            <Building className="h-12 w-12 text-accent mx-auto mb-4" />
            <CardTitle>Office Spaces</CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-muted-foreground mb-6">
              Modern office spaces in prime business districts with flexible floor plans and premium amenities.
            </p>
            <ul className="text-sm text-muted-foreground mb-6 space-y-2">
              <li className="flex items-center justify-center">
                <div className="w-2 h-2 bg-accent rounded-full mr-3"></div>
                Meeting rooms & conference facilities
              </li>
              <li className="flex items-center justify-center">
                <div className="w-2 h-2 bg-accent rounded-full mr-3"></div>
                High-speed internet & tech infrastructure
              </li>
              <li className="flex items-center justify-center">
                <div className="w-2 h-2 bg-accent rounded-full mr-3"></div>
                Parking & public transport access
              </li>
            </ul>
            <Link href="/real-estate/listings/offices">
              <Button variant="outline" className="w-full" data-testid="button-view-offices">
                View Office Spaces
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow" data-testid="card-warehouses">
          <CardHeader className="text-center">
            <Building className="h-12 w-12 text-primary mx-auto mb-4" />
            <CardTitle>Warehouses</CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-muted-foreground mb-6">
              Strategic warehouse locations with excellent logistics connectivity and scalable storage solutions.
            </p>
            <ul className="text-sm text-muted-foreground mb-6 space-y-2">
              <li className="flex items-center justify-center">
                <div className="w-2 h-2 bg-primary rounded-full mr-3"></div>
                Loading docks & freight access
              </li>
              <li className="flex items-center justify-center">
                <div className="w-2 h-2 bg-primary rounded-full mr-3"></div>
                Climate control options
              </li>
              <li className="flex items-center justify-center">
                <div className="w-2 h-2 bg-primary rounded-full mr-3"></div>
                Security systems & 24/7 access
              </li>
            </ul>
            <Link href="/real-estate/listings/warehouses">
              <Button variant="outline" className="w-full" data-testid="button-view-warehouses">
                View Warehouses
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow" data-testid="card-retail">
          <CardHeader className="text-center">
            <Building className="h-12 w-12 text-secondary-foreground mx-auto mb-4" />
            <CardTitle>Retail Spaces</CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-muted-foreground mb-6">
              High-traffic retail locations perfect for storefronts, showrooms, and customer-facing businesses.
            </p>
            <ul className="text-sm text-muted-foreground mb-6 space-y-2">
              <li className="flex items-center justify-center">
                <div className="w-2 h-2 bg-secondary-foreground rounded-full mr-3"></div>
                Street-level visibility
              </li>
              <li className="flex items-center justify-center">
                <div className="w-2 h-2 bg-secondary-foreground rounded-full mr-3"></div>
                Customer parking available
              </li>
              <li className="flex items-center justify-center">
                <div className="w-2 h-2 bg-secondary-foreground rounded-full mr-3"></div>
                Customizable layouts
              </li>
            </ul>
            <Link href="/real-estate/listings/retail">
              <Button variant="outline" className="w-full" data-testid="button-view-retail">
                View Retail Spaces
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>

      {/* Features Section */}
      <div className="grid md:grid-cols-3 gap-8 mb-12">
        <div className="text-center" data-testid="feature-virtual-tours">
          <Eye className="h-12 w-12 text-accent mx-auto mb-4" />
          <h3 className="text-xl font-semibold mb-2">Virtual Tours</h3>
          <p className="text-muted-foreground">
            Explore properties remotely with immersive 3D virtual tours and detailed floor plans.
          </p>
        </div>

        <div className="text-center" data-testid="feature-flexible-terms">
          <Calendar className="h-12 w-12 text-accent mx-auto mb-4" />
          <h3 className="text-xl font-semibold mb-2">Flexible Terms</h3>
          <p className="text-muted-foreground">
            Choose from short-term to long-term leases with options for expansion and renewal.
          </p>
        </div>

        <div className="text-center" data-testid="feature-global-network">
          <Globe className="h-12 w-12 text-accent mx-auto mb-4" />
          <h3 className="text-xl font-semibold mb-2">Global Network</h3>
          <p className="text-muted-foreground">
            Access premium commercial properties in major business centers worldwide.
          </p>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        <Card className="hover:shadow-lg transition-shadow" data-testid="card-quick-search">
          <CardContent className="p-6 text-center">
            <Search className="h-12 w-12 text-primary mb-4 mx-auto" />
            <h3 className="font-semibold text-foreground mb-2">Property Search</h3>
            <p className="text-muted-foreground text-sm mb-4">Find properties by location and type</p>
            <Link href="/real-estate/listings" className="text-primary hover:text-primary/80 font-medium" data-testid="link-search-properties">
              Search Now →
            </Link>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow" data-testid="card-virtual-tour">
          <CardContent className="p-6 text-center">
            <Eye className="h-12 w-12 text-accent mb-4 mx-auto" />
            <h3 className="font-semibold text-foreground mb-2">Virtual Tours</h3>
            <p className="text-muted-foreground text-sm mb-4">Take immersive property tours</p>
            <Link href="/real-estate/listings" className="text-accent hover:text-accent/80 font-medium" data-testid="link-virtual-tours">
              Explore Tours →
            </Link>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow" data-testid="card-lease-request">
          <CardContent className="p-6 text-center">
            <Calendar className="h-12 w-12 text-secondary-foreground mb-4 mx-auto" />
            <h3 className="font-semibold text-foreground mb-2">Lease Request</h3>
            <p className="text-muted-foreground text-sm mb-4">Request property information</p>
            <Link href="/real-estate/lease-request" className="text-secondary-foreground hover:text-secondary-foreground/80 font-medium" data-testid="link-lease-request">
              Request Now →
            </Link>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow" data-testid="card-market-insights">
          <CardContent className="p-6 text-center">
            <TrendingUp className="h-12 w-12 text-primary mb-4 mx-auto" />
            <h3 className="font-semibold text-foreground mb-2">Market Insights</h3>
            <p className="text-muted-foreground text-sm mb-4">Get market trends and data</p>
            <Link href="/contact/support" className="text-primary hover:text-primary/80 font-medium" data-testid="link-market-insights">
              Learn More →
            </Link>
          </CardContent>
        </Card>
      </div>

      {/* Stats Section */}
      <Card className="bg-accent text-accent-foreground" data-testid="card-stats">
        <CardContent className="py-12">
          <div className="grid sm:grid-cols-3 gap-8 text-center">
            <div data-testid="stat-properties">
              <div className="text-3xl font-bold mb-2">15,000+</div>
              <div className="text-blue-100">Properties Listed</div>
            </div>
            <div data-testid="stat-cities">
              <div className="text-3xl font-bold mb-2">500+</div>
              <div className="text-blue-100">Cities Covered</div>
            </div>
            <div data-testid="stat-satisfaction">
              <div className="text-3xl font-bold mb-2">98%</div>
              <div className="text-blue-100">Client Satisfaction</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
