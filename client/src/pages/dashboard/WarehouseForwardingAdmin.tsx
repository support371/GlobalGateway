import { useEffect, useMemo, useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Link } from "wouter";
import { AlertTriangle, Clock3, ExternalLink, PackageSearch, RefreshCw, Save, Truck, Warehouse } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";

const FORWARDING_STATUSES = [
  "expected",
  "received",
  "held",
  "inspection_requested",
  "consolidation_requested",
  "return_requested",
  "ready_to_ship",
  "shipped",
  "delivered",
  "cancelled",
] as const;

const FORWARDING_ACTIONS = ["hold", "inspect", "consolidate", "return", "ship"] as const;

type ForwardingStatus = (typeof FORWARDING_STATUSES)[number];
type ForwardingAction = (typeof FORWARDING_ACTIONS)[number];

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
  status: ForwardingStatus;
  recipientName: string | null;
  recipientAddress1: string | null;
  recipientAddress2: string | null;
  recipientCity: string | null;
  recipientState: string | null;
  recipientPostalCode: string | null;
  recipientCountry: string | null;
  notes: string | null;
  warehousePackageId: string | null;
  outboundCarrier: string | null;
  outboundTrackingNumber: string | null;
  receivedAt: string | null;
  shippedAt: string | null;
  createdAt: string;
  updatedAt: string;
}

interface WarehouseConfig {
  provider: string;
  mode: "manual" | "api";
  apiEnabled: boolean;
  suite: string;
  formattedAddress: string[];
}

interface ForwardingOrdersResponse {
  orders: ForwardingOrder[];
  warehouse: WarehouseConfig;
}

interface UpdateDraft {
  status: ForwardingStatus;
  requestedAction: ForwardingAction;
  inboundTrackingNumber: string;
  warehousePackageId: string;
  outboundCarrier: string;
  outboundTrackingNumber: string;
  notes: string;
}

function draftFromOrder(order: ForwardingOrder): UpdateDraft {
  return {
    status: order.status,
    requestedAction: order.requestedAction,
    inboundTrackingNumber: order.inboundTrackingNumber ?? "",
    warehousePackageId: order.warehousePackageId ?? "",
    outboundCarrier: order.outboundCarrier ?? "",
    outboundTrackingNumber: order.outboundTrackingNumber ?? "",
    notes: order.notes ?? "",
  };
}

function label(value: string): string {
  return value
    .split("_")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

function statusVariant(status: ForwardingStatus): "default" | "secondary" | "destructive" | "outline" {
  if (status === "cancelled") return "destructive";
  if (status === "delivered" || status === "shipped" || status === "ready_to_ship") return "default";
  if (status === "expected" || status === "held") return "secondary";
  return "outline";
}

function formatDate(value: string | null): string {
  if (!value) return "Not recorded";
  return new Intl.DateTimeFormat(undefined, {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

export default function WarehouseForwardingAdmin() {
  const { user, isAuthenticated, isLoading: authLoading } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [search, setSearch] = useState("");
  const [drafts, setDrafts] = useState<Record<string, UpdateDraft>>({});

  const queryKey = ["/api/admin/forwarding-orders?limit=250"];
  const ordersQuery = useQuery<ForwardingOrdersResponse>({
    queryKey,
    enabled: isAuthenticated && user?.role === "admin",
    retry: false,
  });

  useEffect(() => {
    if (!ordersQuery.data?.orders) return;
    setDrafts((current) => {
      const next = { ...current };
      for (const order of ordersQuery.data.orders) {
        if (!next[order.id]) next[order.id] = draftFromOrder(order);
      }
      return next;
    });
  }, [ordersQuery.data]);

  const updateMutation = useMutation({
    mutationFn: async ({ id, draft }: { id: string; draft: UpdateDraft }) => {
      const response = await apiRequest("PATCH", `/api/admin/forwarding-orders/${id}`, draft);
      return (await response.json()) as { order: ForwardingOrder };
    },
    onSuccess: ({ order }) => {
      setDrafts((current) => ({ ...current, [order.id]: draftFromOrder(order) }));
      queryClient.invalidateQueries({ queryKey });
      toast({
        title: "Forwarding order updated",
        description: `${order.reference} is now ${label(order.status)}.`,
      });
    },
    onError: (error: Error) => {
      toast({
        title: "Update failed",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const filteredOrders = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();
    return (ordersQuery.data?.orders ?? []).filter((order) => {
      if (statusFilter !== "all" && order.status !== statusFilter) return false;
      if (!normalizedSearch) return true;
      return [
        order.reference,
        order.customerName,
        order.customerEmail,
        order.merchantName,
        order.merchantOrderNumber,
        order.inboundTrackingNumber,
        order.warehousePackageId,
        order.outboundTrackingNumber,
      ].some((value) => value?.toLowerCase().includes(normalizedSearch));
    });
  }, [ordersQuery.data, search, statusFilter]);

  const stats = useMemo(() => {
    const orders = ordersQuery.data?.orders ?? [];
    return {
      total: orders.length,
      expected: orders.filter((order) => order.status === "expected").length,
      received: orders.filter((order) => order.status === "received").length,
      actionRequired: orders.filter((order) =>
        ["inspection_requested", "consolidation_requested", "return_requested"].includes(order.status),
      ).length,
      readyToShip: orders.filter((order) => order.status === "ready_to_ship").length,
    };
  }, [ordersQuery.data]);

  const updateDraft = <K extends keyof UpdateDraft>(id: string, key: K, value: UpdateDraft[K]) => {
    setDrafts((current) => ({
      ...current,
      [id]: {
        ...(current[id] ?? draftFromOrder(ordersQuery.data!.orders.find((order) => order.id === id)!)),
        [key]: value,
      },
    }));
  };

  if (authLoading) {
    return <div className="container mx-auto px-4 py-16 text-center text-muted-foreground">Checking administrator access...</div>;
  }

  if (!isAuthenticated || user?.role !== "admin") {
    return (
      <div className="container mx-auto px-4 py-16">
        <Card className="max-w-xl mx-auto">
          <CardContent className="py-12 text-center">
            <AlertTriangle className="h-12 w-12 mx-auto mb-4 text-destructive" />
            <h1 className="text-2xl font-bold mb-2">Administrator access required</h1>
            <p className="text-muted-foreground mb-6">Sign in with an administrator account to manage warehouse-forwarding orders.</p>
            <Button asChild><a href="/api/login">Administrator login</a></Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between mb-8">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <Warehouse className="h-8 w-8 text-primary" />
            <h1 className="text-3xl font-bold">Warehouse Forwarding Queue</h1>
          </div>
          <p className="text-muted-foreground max-w-3xl">
            Review incoming Shipito packages, record warehouse identifiers, and control the manual forwarding lifecycle.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" onClick={() => ordersQuery.refetch()} disabled={ordersQuery.isFetching}>
            <RefreshCw className={`mr-2 h-4 w-4 ${ordersQuery.isFetching ? "animate-spin" : ""}`} />
            Refresh
          </Button>
          <Button variant="outline" asChild>
            <Link href="/logistics/warehouse-forwarding">
              <ExternalLink className="mr-2 h-4 w-4" /> Customer workflow
            </Link>
          </Button>
        </div>
      </div>

      {ordersQuery.data?.warehouse && (
        <Card className="mb-6">
          <CardContent className="py-5 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Badge variant={ordersQuery.data.warehouse.apiEnabled ? "default" : "secondary"}>
                  {ordersQuery.data.warehouse.mode === "api" ? "API mode" : "Manual mode"}
                </Badge>
                <span className="font-medium">Shipito Suite #{ordersQuery.data.warehouse.suite}</span>
              </div>
              <p className="text-sm text-muted-foreground">{ordersQuery.data.warehouse.formattedAddress.join(", ")}</p>
            </div>
            {!ordersQuery.data.warehouse.apiEnabled && (
              <p className="text-sm text-amber-700 dark:text-amber-300 max-w-xl">
                Warehouse actions must be completed manually until approved Shipito API access is configured.
              </p>
            )}
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-6">
        {[
          ["Total", stats.total, PackageSearch],
          ["Expected", stats.expected, Clock3],
          ["Received", stats.received, Warehouse],
          ["Action required", stats.actionRequired, AlertTriangle],
          ["Ready to ship", stats.readyToShip, Truck],
        ].map(([title, value, Icon]) => {
          const StatIcon = Icon as typeof PackageSearch;
          return (
            <Card key={String(title)}>
              <CardContent className="pt-5 flex items-center justify-between gap-2">
                <div><p className="text-2xl font-bold">{String(value)}</p><p className="text-xs text-muted-foreground">{String(title)}</p></div>
                <StatIcon className="h-5 w-5 text-primary" />
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Card className="mb-6">
        <CardContent className="py-4 grid gap-4 md:grid-cols-[1fr_220px]">
          <Input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search reference, customer, merchant, tracking, or warehouse ID"
          />
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger><SelectValue placeholder="Filter by status" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All statuses</SelectItem>
              {FORWARDING_STATUSES.map((status) => (
                <SelectItem key={status} value={status}>{label(status)}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      {ordersQuery.isLoading ? (
        <Card><CardContent className="py-16 text-center text-muted-foreground">Loading forwarding orders...</CardContent></Card>
      ) : ordersQuery.isError ? (
        <Card><CardContent className="py-16 text-center"><AlertTriangle className="h-10 w-10 mx-auto mb-3 text-destructive" /><p className="font-medium">Unable to load the forwarding queue.</p><p className="text-sm text-muted-foreground mt-1">{(ordersQuery.error as Error).message}</p></CardContent></Card>
      ) : filteredOrders.length === 0 ? (
        <Card><CardContent className="py-16 text-center text-muted-foreground">No forwarding orders match the current filter.</CardContent></Card>
      ) : (
        <div className="space-y-5">
          {filteredOrders.map((order) => {
            const draft = drafts[order.id] ?? draftFromOrder(order);
            const isSaving = updateMutation.isPending && updateMutation.variables?.id === order.id;
            return (
              <Card key={order.id} data-testid={`forwarding-order-${order.reference}`}>
                <CardHeader className="pb-3">
                  <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                    <div>
                      <CardTitle className="flex flex-wrap items-center gap-2">
                        <span>{order.reference}</span>
                        <Badge variant={statusVariant(order.status)}>{label(order.status)}</Badge>
                        <Badge variant="outline">{label(order.requestedAction)}</Badge>
                      </CardTitle>
                      <p className="text-sm text-muted-foreground mt-1">Created {formatDate(order.createdAt)} · Updated {formatDate(order.updatedAt)}</p>
                    </div>
                    <Button onClick={() => updateMutation.mutate({ id: order.id, draft })} disabled={isSaving}>
                      <Save className="mr-2 h-4 w-4" />{isSaving ? "Saving..." : "Save update"}
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="space-y-5">
                  <div className="grid gap-4 md:grid-cols-3">
                    <div><p className="text-xs uppercase tracking-wide text-muted-foreground">Customer</p><p className="font-medium">{order.customerName}</p><p className="text-sm break-all">{order.customerEmail}</p></div>
                    <div><p className="text-xs uppercase tracking-wide text-muted-foreground">Merchant</p><p className="font-medium">{order.merchantName || "Not provided"}</p><p className="text-sm">Order: {order.merchantOrderNumber || "Not provided"}</p></div>
                    <div><p className="text-xs uppercase tracking-wide text-muted-foreground">Package</p><p className="font-medium">{order.itemDescription}</p><p className="text-sm">Qty {order.quantity}{order.declaredValue ? ` · ${order.currency} ${order.declaredValue}` : ""}</p></div>
                  </div>

                  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                    <div><label className="text-sm font-medium">Status</label><Select value={draft.status} onValueChange={(value) => updateDraft(order.id, "status", value as ForwardingStatus)}><SelectTrigger className="mt-1"><SelectValue /></SelectTrigger><SelectContent>{FORWARDING_STATUSES.map((status) => <SelectItem key={status} value={status}>{label(status)}</SelectItem>)}</SelectContent></Select></div>
                    <div><label className="text-sm font-medium">Requested action</label><Select value={draft.requestedAction} onValueChange={(value) => updateDraft(order.id, "requestedAction", value as ForwardingAction)}><SelectTrigger className="mt-1"><SelectValue /></SelectTrigger><SelectContent>{FORWARDING_ACTIONS.map((action) => <SelectItem key={action} value={action}>{label(action)}</SelectItem>)}</SelectContent></Select></div>
                    <div><label className="text-sm font-medium">Inbound tracking</label><Input className="mt-1" value={draft.inboundTrackingNumber} onChange={(event) => updateDraft(order.id, "inboundTrackingNumber", event.target.value)} /></div>
                    <div><label className="text-sm font-medium">Warehouse package ID</label><Input className="mt-1" value={draft.warehousePackageId} onChange={(event) => updateDraft(order.id, "warehousePackageId", event.target.value)} /></div>
                    <div><label className="text-sm font-medium">Outbound carrier</label><Input className="mt-1" value={draft.outboundCarrier} onChange={(event) => updateDraft(order.id, "outboundCarrier", event.target.value)} /></div>
                    <div><label className="text-sm font-medium">Outbound tracking</label><Input className="mt-1" value={draft.outboundTrackingNumber} onChange={(event) => updateDraft(order.id, "outboundTrackingNumber", event.target.value)} /></div>
                    <div className="md:col-span-2"><label className="text-sm font-medium">Internal/customer notes</label><Textarea className="mt-1 min-h-20" value={draft.notes} onChange={(event) => updateDraft(order.id, "notes", event.target.value)} /></div>
                  </div>

                  <div className="grid gap-4 text-sm md:grid-cols-3 border-t pt-4">
                    <div><span className="text-muted-foreground">Recipient:</span> {order.recipientName || "Not provided"}{order.recipientCountry ? ` · ${order.recipientCountry}` : ""}</div>
                    <div><span className="text-muted-foreground">Received:</span> {formatDate(order.receivedAt)}</div>
                    <div><span className="text-muted-foreground">Shipped:</span> {formatDate(order.shippedAt)}</div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}
