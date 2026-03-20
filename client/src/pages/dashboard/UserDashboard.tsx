import { useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { isUnauthorizedError } from "@/lib/authUtils";
import { Link } from "wouter";
import { 
  User, 
  Package, 
  Building, 
  Scale, 
  Calendar, 
  MapPin, 
  DollarSign, 
  Clock,
  Eye,
  Plus,
  TrendingUp
} from "lucide-react";
import type { Shipment, LeaseRequest, LegalRequest } from "@shared/schema";

export default function UserDashboard() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const { toast } = useToast();

  // Redirect if not authenticated
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      toast({
        title: "Unauthorized",
        description: "You are logged out. Logging in again...",
        variant: "destructive",
      });
      setTimeout(() => {
        window.location.href = "/api/login";
      }, 500);
    }
  }, [isAuthenticated, isLoading, toast]);

  // Fetch user's shipments
  const { data: shipments, isLoading: shipmentsLoading } = useQuery<Shipment[]>({
    queryKey: ["/api/shipments"],
    enabled: isAuthenticated,
    retry: false,
  });

  // Fetch user's lease requests
  const { data: leaseRequests, isLoading: leaseRequestsLoading } = useQuery<LeaseRequest[]>({
    queryKey: ["/api/lease-requests"],
    enabled: isAuthenticated,
    retry: false,
  });

  // Fetch user's legal requests
  const { data: legalRequests, isLoading: legalRequestsLoading } = useQuery<LegalRequest[]>({
    queryKey: ["/api/legal-requests"],
    enabled: isAuthenticated,
    retry: false,
  });

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="max-w-6xl mx-auto">
          <Skeleton className="h-8 w-64 mb-4" />
          <Skeleton className="h-4 w-96 mb-8" />
          <div className="grid md:grid-cols-3 gap-6">
            {[...Array(6)].map((_, i) => (
              <Skeleton key={i} className="h-32" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Card>
          <CardContent className="py-16 text-center">
            <p className="text-muted-foreground">Redirecting to login...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const getStatusBadge = (status: string) => {
    const statusMap = {
      pending: { label: "Pending", variant: "secondary" as const },
      in_transit: { label: "In Transit", variant: "default" as const },
      delivered: { label: "Delivered", variant: "default" as const },
      approved: { label: "Approved", variant: "default" as const },
      rejected: { label: "Rejected", variant: "destructive" as const },
      in_review: { label: "In Review", variant: "default" as const },
      completed: { label: "Completed", variant: "default" as const },
      cancelled: { label: "Cancelled", variant: "destructive" as const },
    };

    const statusInfo = statusMap[status as keyof typeof statusMap] || statusMap.pending;
    return (
      <Badge 
        variant={statusInfo.variant} 
        className={status === "delivered" || status === "completed" ? "bg-accent hover:bg-accent" : ""}
      >
        {statusInfo.label}
      </Badge>
    );
  };

  const quickStats = [
    {
      title: "Active Shipments",
      value: shipments?.filter((s: Shipment) => s.status === "in_transit").length || 0,
      icon: Package,
      color: "text-primary"
    },
    {
      title: "Lease Requests",
      value: leaseRequests?.length || 0,
      icon: Building,
      color: "text-accent"
    },
    {
      title: "Legal Cases",
      value: legalRequests?.length || 0,
      icon: Scale,
      color: "text-secondary-foreground"
    }
  ];

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-foreground mb-2" data-testid="text-dashboard-title">
                Welcome back, {user?.firstName || "User"}!
              </h1>
              <p className="text-muted-foreground" data-testid="text-dashboard-subtitle">
                Manage your global business operations from your dashboard
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <User className="h-8 w-8 text-muted-foreground" />
              <div className="text-right">
                <p className="font-medium text-foreground">{user?.firstName} {user?.lastName}</p>
                <p className="text-sm text-muted-foreground">{user?.email}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          {quickStats.map((stat, index) => {
            const Icon = stat.icon;
            return (
              <Card key={index} data-testid={`card-quick-stat-${index}`}>
                <CardContent className="pt-6">
                  <div className="flex items-center">
                    <Icon className={`h-8 w-8 ${stat.color} mr-3`} />
                    <div>
                      <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                      <p className="text-sm text-muted-foreground">{stat.title}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Quick Actions */}
        <Card className="mb-8" data-testid="card-quick-actions">
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <Link href="/logistics/book-shipping">
                <Button className="w-full justify-start" data-testid="button-book-shipping">
                  <Package className="mr-2 h-4 w-4" />
                  Book Shipping
                </Button>
              </Link>
              <Link href="/real-estate/lease-request">
                <Button variant="outline" className="w-full justify-start" data-testid="button-request-lease">
                  <Building className="mr-2 h-4 w-4" />
                  Request Lease
                </Button>
              </Link>
              <Link href="/legal-services/request-support">
                <Button variant="outline" className="w-full justify-start" data-testid="button-legal-support">
                  <Scale className="mr-2 h-4 w-4" />
                  Legal Support
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

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Recent Shipments */}
          <Card data-testid="card-recent-shipments">
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle className="flex items-center">
                  <Package className="mr-2 h-5 w-5" />
                  Recent Shipments
                </CardTitle>
                <Link href="/logistics">
                  <Button variant="outline" size="sm" data-testid="button-view-all-shipments">
                    View All
                  </Button>
                </Link>
              </div>
            </CardHeader>
            <CardContent>
              {shipmentsLoading ? (
                <div className="space-y-3">
                  {[...Array(3)].map((_, i) => (
                    <Skeleton key={i} className="h-16 w-full" />
                  ))}
                </div>
              ) : shipments && shipments.length > 0 ? (
                <div className="space-y-4">
                  {shipments.slice(0, 3).map((shipment: Shipment) => (
                    <div key={shipment.id} className="border rounded-lg p-4" data-testid={`shipment-${shipment.id}`}>
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <p className="font-medium text-foreground">#{shipment.trackingNumber}</p>
                          <p className="text-sm text-muted-foreground">{shipment.origin} → {shipment.destination}</p>
                        </div>
                        {getStatusBadge(shipment.status ?? "pending")}
                      </div>
                      <div className="flex justify-between items-center text-sm text-muted-foreground">
                        <span>{shipment.weight} kg</span>
                        <span>${shipment.cost} {shipment.currency}</span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground mb-4">No shipments yet</p>
                  <Link href="/logistics/book-shipping">
                    <Button data-testid="button-book-first-shipment">
                      <Plus className="mr-2 h-4 w-4" />
                      Book Your First Shipment
                    </Button>
                  </Link>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Recent Property Requests */}
          <Card data-testid="card-recent-lease-requests">
            <CardHeader>
              <div className="flex justify-between items-center">
                <CardTitle className="flex items-center">
                  <Building className="mr-2 h-5 w-5" />
                  Property Requests
                </CardTitle>
                <Link href="/real-estate">
                  <Button variant="outline" size="sm" data-testid="button-view-all-properties">
                    View All
                  </Button>
                </Link>
              </div>
            </CardHeader>
            <CardContent>
              {leaseRequestsLoading ? (
                <div className="space-y-3">
                  {[...Array(3)].map((_, i) => (
                    <Skeleton key={i} className="h-16 w-full" />
                  ))}
                </div>
              ) : leaseRequests && leaseRequests.length > 0 ? (
                <div className="space-y-4">
                  {leaseRequests.slice(0, 3).map((request: LeaseRequest) => (
                    <div key={request.id} className="border rounded-lg p-4" data-testid={`lease-request-${request.id}`}>
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <p className="font-medium text-foreground">{request.contactName}</p>
                          <p className="text-sm text-muted-foreground">{request.companyName}</p>
                        </div>
                        {getStatusBadge(request.status ?? "pending")}
                      </div>
                      <div className="flex justify-between items-center text-sm text-muted-foreground">
                        <span>
                          <Calendar className="inline h-3 w-3 mr-1" />
                          {request.desiredMoveInDate ? new Date(request.desiredMoveInDate!).toLocaleDateString() : 'TBD'}
                        </span>
                        <span>{request.leaseTerm} months</span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <Building className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground mb-4">No property requests yet</p>
                  <Link href="/real-estate/lease-request">
                    <Button data-testid="button-request-first-property">
                      <Plus className="mr-2 h-4 w-4" />
                      Request Property
                    </Button>
                  </Link>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Legal Requests */}
        <Card className="mt-8" data-testid="card-legal-requests">
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle className="flex items-center">
                <Scale className="mr-2 h-5 w-5" />
                Legal Support Requests
              </CardTitle>
              <Link href="/legal-services">
                <Button variant="outline" size="sm" data-testid="button-view-all-legal">
                  View All
                </Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            {legalRequestsLoading ? (
              <div className="space-y-3">
                {[...Array(2)].map((_, i) => (
                  <Skeleton key={i} className="h-20 w-full" />
                ))}
              </div>
            ) : legalRequests && legalRequests.length > 0 ? (
              <div className="space-y-4">
                {legalRequests.slice(0, 3).map((request: LegalRequest) => (
                  <div key={request.id} className="border rounded-lg p-4" data-testid={`legal-request-${request.id}`}>
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex-1">
                        <p className="font-medium text-foreground">{request.title}</p>
                        <p className="text-sm text-muted-foreground capitalize">{request.serviceType.replace('-', ' ')}</p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge variant={request.urgency === "high" ? "destructive" : request.urgency === "medium" ? "default" : "secondary"}>
                          {request.urgency}
                        </Badge>
                        {getStatusBadge(request.status ?? "pending")}
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground line-clamp-2">{request.description}</p>
                    <div className="flex justify-between items-center mt-2 text-xs text-muted-foreground">
                      <span>Created: {request.createdAt ? new Date(request.createdAt).toLocaleDateString() : "-"}</span>
                      {request.assignedLawyer && <span>Assigned: {request.assignedLawyer}</span>}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <Scale className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground mb-4">No legal requests yet</p>
                <Link href="/legal-services/request-support">
                  <Button data-testid="button-request-first-legal">
                    <Plus className="mr-2 h-4 w-4" />
                    Request Legal Support
                  </Button>
                </Link>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Account Summary */}
        <Card className="mt-8" data-testid="card-account-summary">
          <CardHeader>
            <CardTitle className="flex items-center">
              <TrendingUp className="mr-2 h-5 w-5" />
              Account Summary
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-6">
              <div className="text-center">
                <p className="text-2xl font-bold text-primary">{shipments?.length || 0}</p>
                <p className="text-sm text-muted-foreground">Total Shipments</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-accent">{leaseRequests?.length || 0}</p>
                <p className="text-sm text-muted-foreground">Property Requests</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-secondary-foreground">{legalRequests?.length || 0}</p>
                <p className="text-sm text-muted-foreground">Legal Requests</p>
              </div>
            </div>
            <div className="mt-6 pt-6 border-t border-border">
              <div className="flex justify-between items-center text-sm">
                <span className="text-muted-foreground">Member since:</span>
                <span className="font-medium">{user?.createdAt ? new Date(user.createdAt!).toLocaleDateString() : 'Recently'}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
