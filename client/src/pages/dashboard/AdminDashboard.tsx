import { useEffect, useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { isUnauthorizedError } from "@/lib/authUtils";
import { apiRequest } from "@/lib/queryClient";
import { 
  Shield, 
  Package, 
  Building, 
  Scale, 
  Users,
  TrendingUp,
  Clock,
  CheckCircle,
  AlertTriangle,
  Eye,
  Edit
} from "lucide-react";
import type { Shipment, LeaseRequest, LegalRequest, Property } from "@shared/schema";

export default function AdminDashboard() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [selectedTab, setSelectedTab] = useState("overview");

  // Redirect if not authenticated or not admin
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
      return;
    }

    if (!isLoading && isAuthenticated && user?.role !== "admin") {
      toast({
        title: "Access Denied",
        description: "Admin access required.",
        variant: "destructive",
      });
    }
  }, [isAuthenticated, isLoading, user, toast]);

  // Fetch all data for admin view
  const { data: shipments, isLoading: shipmentsLoading } = useQuery<Shipment[]>({
    queryKey: ["/api/shipments"],
    enabled: isAuthenticated && user?.role === "admin",
    retry: false,
  });

  const { data: leaseRequests, isLoading: leaseRequestsLoading } = useQuery<LeaseRequest[]>({
    queryKey: ["/api/lease-requests"],
    enabled: isAuthenticated && user?.role === "admin",
    retry: false,
  });

  const { data: legalRequests, isLoading: legalRequestsLoading } = useQuery<LegalRequest[]>({
    queryKey: ["/api/legal-requests"],
    enabled: isAuthenticated && user?.role === "admin",
    retry: false,
  });

  const { data: properties, isLoading: propertiesLoading } = useQuery<Property[]>({
    queryKey: ["/api/properties"],
    enabled: isAuthenticated && user?.role === "admin",
    retry: false,
  });

  // Update status mutations
  const updateShipmentMutation = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      const response = await apiRequest("PATCH", `/api/shipments/${id}`, { status });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/shipments"] });
      toast({ title: "Shipment updated successfully" });
    },
    onError: (error) => {
      if (isUnauthorizedError(error)) {
        toast({
          title: "Unauthorized",
          description: "You are logged out. Logging in again...",
          variant: "destructive",
        });
        setTimeout(() => { window.location.href = "/api/login"; }, 500);
        return;
      }
      toast({ title: "Update failed", description: error.message, variant: "destructive" });
    },
  });

  const updateLeaseRequestMutation = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      const response = await apiRequest("PATCH", `/api/lease-requests/${id}`, { status });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/lease-requests"] });
      toast({ title: "Lease request updated successfully" });
    },
    onError: (error) => {
      if (isUnauthorizedError(error)) {
        toast({
          title: "Unauthorized",
          description: "You are logged out. Logging in again...",
          variant: "destructive",
        });
        setTimeout(() => { window.location.href = "/api/login"; }, 500);
        return;
      }
      toast({ title: "Update failed", description: error.message, variant: "destructive" });
    },
  });

  const updateLegalRequestMutation = useMutation({
    mutationFn: async ({ id, status }: { id: string; status: string }) => {
      const response = await apiRequest("PATCH", `/api/legal-requests/${id}`, { status });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/legal-requests"] });
      toast({ title: "Legal request updated successfully" });
    },
    onError: (error) => {
      if (isUnauthorizedError(error)) {
        toast({
          title: "Unauthorized",
          description: "You are logged out. Logging in again...",
          variant: "destructive",
        });
        setTimeout(() => { window.location.href = "/api/login"; }, 500);
        return;
      }
      toast({ title: "Update failed", description: error.message, variant: "destructive" });
    },
  });

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="max-w-6xl mx-auto">
          <Skeleton className="h-8 w-64 mb-4" />
          <Skeleton className="h-4 w-96 mb-8" />
          <div className="grid md:grid-cols-4 gap-6">
            {[...Array(8)].map((_, i) => (
              <Skeleton key={i} className="h-32" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!isAuthenticated || user?.role !== "admin") {
    return (
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Card>
          <CardContent className="py-16 text-center">
            <Shield className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h2 className="text-2xl font-bold text-foreground mb-2">Access Denied</h2>
            <p className="text-muted-foreground">Administrator privileges required to access this dashboard.</p>
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

  const overviewStats = [
    {
      title: "Total Shipments",
      value: shipments?.length || 0,
      icon: Package,
      color: "text-primary",
      active: shipments?.filter((s: Shipment) => s.status === "in_transit").length || 0
    },
    {
      title: "Properties Listed",
      value: properties?.length || 0,
      icon: Building,
      color: "text-accent",
      active: properties?.filter((p: Property) => p.availability).length || 0
    },
    {
      title: "Lease Requests",
      value: leaseRequests?.length || 0,
      icon: Building,
      color: "text-secondary-foreground",
      active: leaseRequests?.filter((r: LeaseRequest) => r.status === "pending").length || 0
    },
    {
      title: "Legal Requests",
      value: legalRequests?.length || 0,
      icon: Scale,
      color: "text-destructive",
      active: legalRequests?.filter((r: LegalRequest) => r.status === "pending").length || 0
    }
  ];

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-foreground mb-2" data-testid="text-admin-dashboard-title">
                Admin Dashboard
              </h1>
              <p className="text-muted-foreground" data-testid="text-admin-dashboard-subtitle">
                Manage global business operations and monitor all system activities
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <Shield className="h-8 w-8 text-primary" />
              <div className="text-right">
                <p className="font-medium text-foreground">Administrator</p>
                <p className="text-sm text-muted-foreground">{user?.email}</p>
              </div>
            </div>
          </div>
        </div>

        <Tabs value={selectedTab} onValueChange={setSelectedTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="overview" data-testid="tab-overview">Overview</TabsTrigger>
            <TabsTrigger value="shipments" data-testid="tab-shipments">Shipments</TabsTrigger>
            <TabsTrigger value="properties" data-testid="tab-properties">Properties</TabsTrigger>
            <TabsTrigger value="lease-requests" data-testid="tab-lease-requests">Leases</TabsTrigger>
            <TabsTrigger value="legal-requests" data-testid="tab-legal-requests">Legal</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            {/* Overview Stats */}
            <div className="grid md:grid-cols-4 gap-6">
              {overviewStats.map((stat, index) => {
                const Icon = stat.icon;
                return (
                  <Card key={index} data-testid={`card-overview-stat-${index}`}>
                    <CardContent className="pt-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                          <p className="text-sm text-muted-foreground">{stat.title}</p>
                          <p className="text-xs text-accent mt-1">{stat.active} active</p>
                        </div>
                        <Icon className={`h-8 w-8 ${stat.color}`} />
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>

            {/* Recent Activity */}
            <div className="grid lg:grid-cols-2 gap-6">
              <Card data-testid="card-pending-shipments">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Clock className="mr-2 h-5 w-5" />
                    Pending Shipments
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {shipmentsLoading ? (
                    <div className="space-y-3">
                      {[...Array(3)].map((_, i) => (
                        <Skeleton key={i} className="h-16 w-full" />
                      ))}
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {shipments?.filter((s: Shipment) => s.status === "pending").slice(0, 3).map((shipment: Shipment) => (
                        <div key={shipment.id} className="flex justify-between items-center p-3 border rounded" data-testid={`pending-shipment-${shipment.id}`}>
                          <div>
                            <p className="font-medium">{shipment.trackingNumber}</p>
                            <p className="text-sm text-muted-foreground">{shipment.origin} → {shipment.destination}</p>
                          </div>
                          <Button size="sm" onClick={() => updateShipmentMutation.mutate({ id: shipment.id, status: "in_transit" })}>
                            Process
                          </Button>
                        </div>
                      )) || (
                        <p className="text-center text-muted-foreground py-4">No pending shipments</p>
                      )}
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card data-testid="card-pending-requests">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <AlertTriangle className="mr-2 h-5 w-5" />
                    Pending Requests
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {leaseRequests?.filter((r: LeaseRequest) => r.status === "pending").slice(0, 2).map((request: LeaseRequest) => (
                      <div key={request.id} className="flex justify-between items-center p-3 border rounded" data-testid={`pending-lease-${request.id}`}>
                        <div>
                          <p className="font-medium">Lease Request</p>
                          <p className="text-sm text-muted-foreground">{request.contactName}</p>
                        </div>
                        <Button size="sm" variant="outline" onClick={() => updateLeaseRequestMutation.mutate({ id: request.id, status: "approved" })}>
                          Review
                        </Button>
                      </div>
                    ))}
                    {legalRequests?.filter((r: LegalRequest) => r.status === "pending").slice(0, 1).map((request: LegalRequest) => (
                      <div key={request.id} className="flex justify-between items-center p-3 border rounded" data-testid={`pending-legal-${request.id}`}>
                        <div>
                          <p className="font-medium">Legal Request</p>
                          <p className="text-sm text-muted-foreground">{request.title}</p>
                        </div>
                        <Button size="sm" variant="outline" onClick={() => updateLegalRequestMutation.mutate({ id: request.id, status: "in_review" })}>
                          Review
                        </Button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="shipments" className="space-y-6">
            <Card data-testid="card-all-shipments">
              <CardHeader>
                <CardTitle>All Shipments</CardTitle>
              </CardHeader>
              <CardContent>
                {shipmentsLoading ? (
                  <div className="space-y-3">
                    {[...Array(5)].map((_, i) => (
                      <Skeleton key={i} className="h-20 w-full" />
                    ))}
                  </div>
                ) : shipments && shipments.length > 0 ? (
                  <div className="space-y-4">
                    {shipments.map((shipment: Shipment) => (
                      <div key={shipment.id} className="border rounded-lg p-4" data-testid={`admin-shipment-${shipment.id}`}>
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <p className="font-medium text-foreground">#{shipment.trackingNumber}</p>
                            <p className="text-sm text-muted-foreground">{shipment.origin} → {shipment.destination}</p>
                            <p className="text-xs text-muted-foreground">Weight: {shipment.weight}kg | Cost: ${shipment.cost}</p>
                          </div>
                          <div className="flex items-center space-x-2">
                            {getStatusBadge(shipment.status ?? "pending")}
                            <Select
                              value={shipment.status ?? undefined}
                              onValueChange={(value) => updateShipmentMutation.mutate({ id: shipment.id!, status: value })}
                            >
                              <SelectTrigger className="w-32">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="pending">Pending</SelectItem>
                                <SelectItem value="in_transit">In Transit</SelectItem>
                                <SelectItem value="delivered">Delivered</SelectItem>
                                <SelectItem value="cancelled">Cancelled</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                        <div className="text-xs text-muted-foreground">
                          Created: {shipment.createdAt ? new Date(shipment.createdAt).toLocaleString() : "-"}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Package className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">No shipments found</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="properties" className="space-y-6">
            <Card data-testid="card-all-properties">
              <CardHeader>
                <CardTitle>Property Management</CardTitle>
              </CardHeader>
              <CardContent>
                {propertiesLoading ? (
                  <div className="space-y-3">
                    {[...Array(5)].map((_, i) => (
                      <Skeleton key={i} className="h-20 w-full" />
                    ))}
                  </div>
                ) : properties && properties.length > 0 ? (
                  <div className="space-y-4">
                    {properties.map((property: Property) => (
                      <div key={property.id} className="border rounded-lg p-4" data-testid={`admin-property-${property.id}`}>
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="font-medium text-foreground">{property.title}</p>
                            <p className="text-sm text-muted-foreground">{property.location}</p>
                            <p className="text-xs text-muted-foreground">
                              {property.type} | {property.size.toLocaleString()} sq ft | ${property.price}/month
                            </p>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Badge variant={property.availability ? "default" : "secondary"} className={property.availability ? "bg-accent hover:bg-accent" : ""}>
                              {property.availability ? "Available" : "Unavailable"}
                            </Badge>
                            <Button size="sm" variant="outline">
                              <Edit className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Building className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">No properties found</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="lease-requests" className="space-y-6">
            <Card data-testid="card-all-lease-requests">
              <CardHeader>
                <CardTitle>Lease Requests</CardTitle>
              </CardHeader>
              <CardContent>
                {leaseRequestsLoading ? (
                  <div className="space-y-3">
                    {[...Array(5)].map((_, i) => (
                      <Skeleton key={i} className="h-20 w-full" />
                    ))}
                  </div>
                ) : leaseRequests && leaseRequests.length > 0 ? (
                  <div className="space-y-4">
                    {leaseRequests.map((request: LeaseRequest) => (
                      <div key={request.id} className="border rounded-lg p-4" data-testid={`admin-lease-request-${request.id}`}>
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <p className="font-medium text-foreground">{request.contactName}</p>
                            <p className="text-sm text-muted-foreground">{request.companyName}</p>
                            <p className="text-xs text-muted-foreground">
                              Lease Term: {request.leaseTerm} months | Move-in: {request.desiredMoveInDate ? new Date(request.desiredMoveInDate!).toLocaleDateString() : 'TBD'}
                            </p>
                          </div>
                          <div className="flex items-center space-x-2">
                            {getStatusBadge(request.status ?? "pending")}
                            <Select
                              value={request.status ?? undefined}
                              onValueChange={(value) => updateLeaseRequestMutation.mutate({ id: request.id!, status: value })}
                            >
                              <SelectTrigger className="w-32">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="pending">Pending</SelectItem>
                                <SelectItem value="approved">Approved</SelectItem>
                                <SelectItem value="rejected">Rejected</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                        {request.message && (
                          <p className="text-sm text-muted-foreground line-clamp-2 mb-2">{request.message}</p>
                        )}
                        <div className="text-xs text-muted-foreground">
                          Contact: {request.contactEmail} | Created: {request.createdAt ? new Date(request.createdAt).toLocaleString() : "-"}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Building className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">No lease requests found</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="legal-requests" className="space-y-6">
            <Card data-testid="card-all-legal-requests">
              <CardHeader>
                <CardTitle>Legal Requests</CardTitle>
              </CardHeader>
              <CardContent>
                {legalRequestsLoading ? (
                  <div className="space-y-3">
                    {[...Array(5)].map((_, i) => (
                      <Skeleton key={i} className="h-20 w-full" />
                    ))}
                  </div>
                ) : legalRequests && legalRequests.length > 0 ? (
                  <div className="space-y-4">
                    {legalRequests.map((request: LegalRequest) => (
                      <div key={request.id} className="border rounded-lg p-4" data-testid={`admin-legal-request-${request.id}`}>
                        <div className="flex justify-between items-start mb-2">
                          <div className="flex-1">
                            <p className="font-medium text-foreground">{request.title}</p>
                            <p className="text-sm text-muted-foreground capitalize">{request.serviceType.replace('-', ' ')}</p>
                            <p className="text-xs text-muted-foreground">
                              Contact: {request.contactEmail} | Urgency: {request.urgency}
                            </p>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Badge variant={request.urgency === "high" ? "destructive" : request.urgency === "medium" ? "default" : "secondary"}>
                              {request.urgency}
                            </Badge>
                            {getStatusBadge(request.status ?? "pending")}
                            <Select
                              value={request.status ?? undefined}
                              onValueChange={(value) => updateLegalRequestMutation.mutate({ id: request.id!, status: value })}
                            >
                              <SelectTrigger className="w-32">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="pending">Pending</SelectItem>
                                <SelectItem value="in_review">In Review</SelectItem>
                                <SelectItem value="completed">Completed</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                        <p className="text-sm text-muted-foreground line-clamp-2 mb-2">{request.description}</p>
                        <div className="text-xs text-muted-foreground">
                          Created: {request.createdAt ? new Date(request.createdAt).toLocaleString() : "-"}
                          {request.assignedLawyer && ` | Assigned: ${request.assignedLawyer}`}
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Scale className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <p className="text-muted-foreground">No legal requests found</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
