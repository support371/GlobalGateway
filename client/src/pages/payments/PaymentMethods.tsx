
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, CreditCard, Banknote } from "lucide-react";

export default function PaymentMethods() {
  const paymentMethods = [
    {
      name: "Stripe",
      description: "Secure online payment processing",
      icon: CreditCard,
      features: ["Credit/Debit Cards", "Digital Wallets", "International Payments"],
      status: "active"
    },
    {
      name: "Klarna",
      description: "Buy now, pay later options",
      icon: Banknote,
      features: ["Flexible Payments", "Installment Plans", "No Interest Options"],
      status: "active"
    }
  ];

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold mb-4">Payment Methods</h1>
          <p className="text-xl text-muted-foreground">
            Secure and flexible payment options for your transactions
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {paymentMethods.map((method) => {
            const Icon = method.icon;
            return (
              <Card key={method.name}>
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-primary/10 rounded-lg">
                        <Icon className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <CardTitle>{method.name}</CardTitle>
                        <CardDescription>{method.description}</CardDescription>
                      </div>
                    </div>
                    <Badge variant="secondary" className="flex items-center gap-1">
                      <CheckCircle2 className="h-3 w-3" />
                      Active
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {method.features.map((feature) => (
                      <li key={feature} className="flex items-center gap-2 text-sm">
                        <CheckCircle2 className="h-4 w-4 text-primary" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            );
          })}
        </div>

        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Security & Compliance</CardTitle>
            <CardDescription>
              Your payment information is always protected
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-3 gap-4">
              <div className="text-center p-4 border rounded-lg">
                <h3 className="font-semibold mb-2">PCI DSS Compliant</h3>
                <p className="text-sm text-muted-foreground">
                  Industry-standard security
                </p>
              </div>
              <div className="text-center p-4 border rounded-lg">
                <h3 className="font-semibold mb-2">256-bit SSL Encryption</h3>
                <p className="text-sm text-muted-foreground">
                  Bank-level protection
                </p>
              </div>
              <div className="text-center p-4 border rounded-lg">
                <h3 className="font-semibold mb-2">Fraud Detection</h3>
                <p className="text-sm text-muted-foreground">
                  Advanced monitoring
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
