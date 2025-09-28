import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Building, TrendingUp, CheckCircle, FileText, Handshake, Scale, Phone } from "lucide-react";
import { Link } from "wouter";

export default function BusinessSupport() {
  const businessServices = [
    {
      title: "Business Formation",
      description: "Comprehensive support for starting your business in international markets",
      features: ["Company registration", "Corporate structure design", "Share capital planning", "Director appointments"],
      icon: Building
    },
    {
      title: "Mergers & Acquisitions",
      description: "Expert guidance through complex M&A transactions and due diligence",
      features: ["Due diligence support", "Transaction structuring", "Valuation assistance", "Post-merger integration"],
      icon: Handshake
    },
    {
      title: "Corporate Governance",
      description: "Establish robust governance frameworks for sustainable business growth",
      features: ["Board governance", "Compliance frameworks", "Policy development", "Risk management"],
      icon: Scale
    },
    {
      title: "International Expansion",
      description: "Strategic legal support for expanding your business globally",
      features: ["Market entry strategies", "Joint ventures", "Licensing agreements", "Regulatory compliance"],
      icon: TrendingUp
    }
  ];

  const formations = [
    { type: "LLC Formation", description: "Limited Liability Company setup with flexible management structure" },
    { type: "Corporation", description: "C-Corp or S-Corp formation for scalable business growth" },
    { type: "Partnership", description: "General or Limited Partnership agreements and structures" },
    { type: "International Entity", description: "Foreign entity registration and compliance setup" }
  ];

  const maProcess = [
    {
      step: "Initial Assessment",
      description: "Evaluate transaction feasibility and identify key legal considerations."
    },
    {
      step: "Due Diligence",
      description: "Comprehensive legal, financial, and operational review of target entity."
    },
    {
      step: "Transaction Structure",
      description: "Design optimal transaction structure for tax and legal efficiency."
    },
    {
      step: "Documentation",
      description: "Draft and negotiate all transaction documents and agreements."
    },
    {
      step: "Closing & Integration",
      description: "Facilitate closing process and support post-transaction integration."
    }
  ];

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="text-center mb-12">
        <div className="flex justify-center mb-6">
          <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center">
            <Users className="h-10 w-10 text-primary" />
          </div>
        </div>
        <h1 className="text-4xl font-bold text-foreground mb-4" data-testid="text-business-support-title">
          Business Support Services
        </h1>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8" data-testid="text-business-support-description">
          Comprehensive legal support for business formation, mergers & acquisitions, corporate governance, and international expansion. Build your business on a solid legal foundation.
        </p>
        <Link href="/legal-services/request-support">
          <Button size="lg" data-testid="button-get-business-support">
            <Users className="mr-2 h-5 w-5" />
            Get Business Support
          </Button>
        </Link>
      </div>

      {/* Business Services */}
      <div className="mb-16">
        <h2 className="text-3xl font-bold text-center text-foreground mb-8" data-testid="text-services-title">
          Our Business Support Services
        </h2>
        <div className="grid md:grid-cols-2 gap-8">
          {businessServices.map((service, index) => {
            const Icon = service.icon;
            return (
              <Card key={index} className="hover:shadow-lg transition-shadow" data-testid={`card-service-${index}`}>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Icon className="mr-2 h-5 w-5 text-primary" />
                    {service.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground mb-4">{service.description}</p>
                  <ul className="space-y-2">
                    {service.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-center text-sm" data-testid={`feature-${index}-${featureIndex}`}>
                        <CheckCircle className="mr-2 h-4 w-4 text-accent" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Business Formation Types */}
      <div className="mb-16">
        <h2 className="text-3xl font-bold text-center text-foreground mb-8" data-testid="text-formation-types-title">
          Business Formation Types
        </h2>
        <div className="grid md:grid-cols-2 gap-6">
          {formations.map((formation, index) => (
            <Card key={index} data-testid={`card-formation-${index}`}>
              <CardContent className="pt-6">
                <div className="flex items-center mb-3">
                  <Building className="h-5 w-5 text-primary mr-2" />
                  <h3 className="font-semibold text-foreground">{formation.type}</h3>
                </div>
                <p className="text-sm text-muted-foreground">{formation.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* M&A Process */}
      <div className="mb-16">
        <h2 className="text-3xl font-bold text-center text-foreground mb-8" data-testid="text-ma-process-title">
          M&A Transaction Process
        </h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-6">
          {maProcess.map((step, index) => (
            <Card key={index} className="text-center" data-testid={`card-ma-step-${index}`}>
              <CardContent className="pt-6">
                <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center mx-auto mb-4 text-primary-foreground font-bold text-lg">
                  {index + 1}
                </div>
                <h3 className="font-semibold text-foreground mb-2">{step.step}</h3>
                <p className="text-muted-foreground text-sm">{step.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Corporate Governance */}
      <Card className="mb-16" data-testid="card-governance">
        <CardHeader>
          <CardTitle className="text-center text-2xl">Corporate Governance Excellence</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <Scale className="h-12 w-12 text-accent mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-3">Board Governance</h3>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Board structure optimization</li>
                <li>• Director duties & responsibilities</li>
                <li>• Meeting procedures & protocols</li>
                <li>• Decision-making frameworks</li>
              </ul>
            </div>
            
            <div className="text-center">
              <FileText className="h-12 w-12 text-accent mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-3">Policy Development</h3>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Corporate policies & procedures</li>
                <li>• Code of conduct</li>
                <li>• Whistleblower policies</li>
                <li>• Conflict of interest management</li>
              </ul>
            </div>
            
            <div className="text-center">
              <TrendingUp className="h-12 w-12 text-accent mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-3">Performance Management</h3>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• KPI development & tracking</li>
                <li>• Executive compensation</li>
                <li>• Performance evaluation</li>
                <li>• Succession planning</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Features */}
      <div className="grid md:grid-cols-3 gap-8 mb-16">
        <Card className="text-center" data-testid="card-feature-expertise">
          <CardContent className="pt-6">
            <Users className="h-12 w-12 text-accent mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">Expert Legal Team</h3>
            <p className="text-muted-foreground">
              Experienced business lawyers specializing in corporate law and international transactions.
            </p>
          </CardContent>
        </Card>

        <Card className="text-center" data-testid="card-feature-comprehensive">
          <CardContent className="pt-6">
            <Building className="h-12 w-12 text-accent mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">Comprehensive Support</h3>
            <p className="text-muted-foreground">
              End-to-end legal support from business formation to ongoing corporate governance.
            </p>
          </CardContent>
        </Card>

        <Card className="text-center" data-testid="card-feature-global">
          <CardContent className="pt-6">
            <TrendingUp className="h-12 w-12 text-accent mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">Global Reach</h3>
            <p className="text-muted-foreground">
              International business expertise with local knowledge across multiple jurisdictions.
            </p>
          </CardContent>
        </Card>
      </div>

      {/* CTA Section */}
      <Card className="bg-primary text-primary-foreground" data-testid="card-cta">
        <CardContent className="py-12 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Build Your Business?</h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Get expert legal support for your business formation, growth, and expansion plans. Our team is ready to help you succeed.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/legal-services/request-support">
              <Button size="lg" variant="secondary" data-testid="button-request-business-support">
                <Users className="mr-2 h-5 w-5" />
                Request Business Support
              </Button>
            </Link>
            <Link href="/contact/support">
              <Button size="lg" variant="outline" className="border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary" data-testid="button-business-consultation">
                <Phone className="mr-2 h-5 w-5" />
                Free Consultation
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
