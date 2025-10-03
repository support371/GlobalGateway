
import { useQuery } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CreditCard, Building, Calendar, DollarSign, ExternalLink } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { useAuth } from "@/hooks/useAuth";
import { Link } from "wouter";

export default function PaymentHistory() {
  const { isAuthenticated, isLoading } = useAuth();

  const { data: payments, isLoading: paymentsLoading } = useQuery({
    queryKey: ["/api/payments"],
    queryFn: async () => {
      const response = await apiRequest("GET", "/api/payments");
      return response.json();
    },
    enabled: isAuthenticated,
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'succeeded':
        return <Badge variant="secondary" className="bg-green-100 text-green-800">Completed</Badge>;
      case 'pending_transfer':
        return <Badge variant="secondary" className="bg-yellow-100 text-yellow-800">Pending</Badge>;
      case 'failed':
        return <Badge variant="destructive">Failed</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getPaymentIcon = (method: string) => {
    switch (method) {
      case 'stripe':
        return <CreditCard className="h-4 w-4" />;
      case 'klarna':
        return <Building className="h-4 w-4" />;
      default:
        return <DollarSign className="h-4 w-4" />;
    }
  };

  if (isLoading || paymentsLoading) {
    return (
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Card>
          <CardContent className="py-16 text-center">
            <p className="text-muted-foreground">Loading payment history...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Card>
          <CardContent className="py-16 text-center">
            <p className="text-muted-foreground mb-4">Please log in to view your payment history.</p>
            <Button asChild>
              <Link href="/api/login">Login</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-foreground mb-2">Payment History</h1>
            <p className="text-muted-foreground">
              View your transaction history and payment details.
            </p>
          </div>
          <Button asChild>
            <Link href="/payments">New Payment</Link>
          </Button>
        </div>

        {/* Payments List */}
        <div className="space-y-4">
          {payments && payments.length > 0 ? (
            payments.map((payment: any) => (
              <Card key={payment.id}>
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="w-10 h-10 bg-secondary/50 rounded-full flex items-center justify-center">
                        {getPaymentIcon(payment.paymentMethod)}
                      </div>
                      <div>
                        <h3 className="font-semibold">{payment.description}</h3>
                        <div className="flex items-center text-sm text-muted-foreground">
                          <Calendar className="h-4 w-4 mr-1" />
                          {new Date(payment.created).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                    
                    <div className="text-right">
                      <div className="text-lg font-semibold">
                        ${(payment.amount / 100).toFixed(2)} {payment.currency.toUpperCase()}
                      </div>
                      <div className="flex items-center justify-end space-x-2">
                        {getStatusBadge(payment.status)}
                        <Badge variant="outline" className="capitalize">
                          {payment.paymentMethod}
                        </Badge>
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-4 pt-4 border-t border-border">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-muted-foreground">Payment ID: {payment.id}</span>
                      {payment.status === 'succeeded' && (
                        <Button variant="ghost" size="sm">
                          <ExternalLink className="h-4 w-4 mr-1" />
                          View Receipt
                        </Button>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          ) : (
            <Card>
              <CardContent className="py-16 text-center">
                <DollarSign className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No payments yet</h3>
                <p className="text-muted-foreground mb-4">
                  You haven't made any payments yet. Start by making your first payment.
                </p>
                <Button asChild>
                  <Link href="/payments">Make Payment</Link>
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}
