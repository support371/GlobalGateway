import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/hooks/useAuth";
import { Truck, Building, Scale, Calendar, Package, MapPin, TrendingUp } from "lucide-react";

export default function Home() {
  const { user } = useAuth();

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2" data-testid="text-welcome">
          Welcome back, {user?.firstName || "User"}!
        </h1>
        <p className="text-muted-foreground" data-testid="text-dashboard-description">
          Manage your global business operations from your dashboard
        </p>
      </div>

      {/* Quick Actions */}
      <div className="grid md:grid-cols-3 gap-6 mb-8">
        <Card className="hover:shadow-lg transition-shadow" data-testid="card-quick-logistics">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Logistics</CardTitle>
            <Truck className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Link href="/logistics/book-shipping">
                <Button variant="outline" className="w-full justify-start" data-testid="button-book-shipping">
                  <Package className="mr-2 h-4 w-4" />
                  Book Shipping
                </Button>
              </Link>
              <Link href="/logistics/tracking">
                <Button variant="outline" className="w-full justify-start" data-testid="button-track-shipment">
                  <MapPin className="mr-2 h-4 w-4" />
                  Track Shipment
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow" data-testid="card-quick-real-estate">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Real Estate</CardTitle>
            <Building className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Link href="/real-estate/listings">
                <Button variant="outline" className="w-full justify-start" data-testid="button-browse-properties">
                  <Building className="mr-2 h-4 w-4" />
                  Browse Properties
                </Button>
              </Link>
              <Link href="/real-estate/lease-request">
                <Button variant="outline" className="w-full justify-start" data-testid="button-request-lease">
                  <Calendar className="mr-2 h-4 w-4" />
                  Request Lease
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow" data-testid="card-quick-legal">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Legal Services</CardTitle>
            <Scale className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <Link href="/legal-services/request-support">
                <Button variant="outline" className="w-full justify-start" data-testid="button-request-legal">
                  <Scale className="mr-2 h-4 w-4" />
                  Request Support
                </Button>
              </Link>
              <Link href="/legal-services">
                <Button variant="outline" className="w-full justify-start" data-testid="button-view-services">
                  <TrendingUp className="mr-2 h-4 w-4" />
                  View Services
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card data-testid="card-recent-activity">
        <CardHeader>
          <CardTitle>Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8 text-muted-foreground" data-testid="text-no-activity">
            <p>No recent activity to display.</p>
            <p className="text-sm mt-2">Start using our services to see your activity here.</p>
          </div>
        </CardContent>
      </Card>

      {/* Dashboard Link */}
      <div className="mt-8 text-center">
        <Link href="/auth/account-dashboard">
          <Button data-testid="button-view-dashboard">View Full Dashboard</Button>
        </Link>
      </div>
    </div>
  );
}
