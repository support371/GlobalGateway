import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Scale, Globe, Shield, CheckCircle, AlertTriangle, Users } from "lucide-react";
import { Link } from "wouter";

export default function Regulatory() {
  const complianceAreas = [
    {
      title: "International Trade Law",
      description: "Navigate complex international trade regulations and customs requirements",
      features: ["Import/export compliance", "Customs documentation", "Trade sanctions", "Free trade agreements"]
    },
    {
      title: "Industry Regulations",
      description: "Sector-specific compliance for various industries and markets",
      features: ["Financial services", "Healthcare & pharmaceuticals", "Technology & software", "Manufacturing standards"]
    },
    {
      title: "Tax Compliance",
      description: "International tax planning and compliance across multiple jurisdictions",
      features: ["Transfer pricing", "VAT/GST compliance", "Tax treaty optimization", "Permanent establishment"]
    },
    {
      title: "Labor & Employment",
      description: "Employment law compliance for international workforce management",
      features: ["Work permits & visas", "Employment standards", "Workplace safety", "Cross-border transfers"]
    }
  ];

  const jurisdictions = [
    { region: "United States", laws: "SEC, FDA, FTC, OSHA regulations" },
    { region: "European Union", laws: "GDPR, MiFID II, CE marking, REACH" },
    { region: "United Kingdom", laws: "FCA, MHRA, HSE, Companies House" },
    { region: "Asia-Pacific", laws: "ASEAN regulations, APEC standards" },
    { region: "Middle East", laws: "UAE Commercial Law, Saudi SAMA" },
    { region: "Latin America", laws: "MERCOSUR, NAFTA successor agreements" }
  ];

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="text-center mb-12">
        <div className="flex justify-center mb-6">
          <div className="w-20 h-20 bg-accent/10 rounded-full flex items-center justify-center">
            <Scale className="h-10 w-10 text-accent" />
          </div>
        </div>
        <h1 className="text-4xl font-bold text-foreground mb-4" data-testid="text-regulatory-title">
          Regulatory Compliance
        </h1>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8" data-testid="text-regulatory-description">
          Stay compliant with local and international regulations across multiple jurisdictions. Our regulatory experts help you navigate complex compliance requirements and avoid costly penalties.
        </p>
        <Link href="/legal-services/request-support">
          <Button size="lg" data-testid="button-get-compliance-help">
            <Scale className="mr-2 h-5 w-5" />
            Get Compliance Help
          </Button>
        </Link>
      </div>

      {/* Compliance Areas */}
      <div className="mb-16">
        <h2 className="text-3xl font-bold text-center text-foreground mb-8" data-testid="text-compliance-areas-title">
          Compliance Areas We Cover
        </h2>
        <div className="grid md:grid-cols-2 gap-8">
          {complianceAreas.map((area, index) => (
            <Card key={index} className="hover:shadow-lg transition-shadow" data-testid={`card-compliance-area-${index}`}>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Scale className="mr-2 h-5 w-5 text-accent" />
                  {area.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">{area.description}</p>
                <ul className="space-y-2">
                  {area.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center text-sm" data-testid={`feature-${index}-${featureIndex}`}>
                      <CheckCircle className="mr-2 h-4 w-4 text-accent" />
                      {feature}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Global Jurisdictions */}
      <div className="mb-16">
        <h2 className="text-3xl font-bold text-center text-foreground mb-8" data-testid="text-jurisdictions-title">
          Global Jurisdictions We Cover
        </h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {jurisdictions.map((jurisdiction, index) => (
            <Card key={index} data-testid={`card-jurisdiction-${index}`}>
              <CardContent className="pt-6">
                <div className="flex items-center mb-3">
                  <Globe className="h-5 w-5 text-accent mr-2" />
                  <h3 className="font-semibold text-foreground">{jurisdiction.region}</h3>
                </div>
                <p className="text-sm text-muted-foreground">{jurisdiction.laws}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Risk Assessment */}
      <Card className="mb-16 border-destructive/20" data-testid="card-risk-assessment">
        <CardHeader>
          <CardTitle className="flex items-center text-destructive">
            <AlertTriangle className="mr-2 h-5 w-5" />
            Compliance Risk Assessment
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-lg font-semibold mb-4">Common Compliance Risks</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-center">
                  <div className="w-2 h-2 bg-destructive rounded-full mr-3"></div>
                  Regulatory violations and penalties
                </li>
                <li className="flex items-center">
                  <div className="w-2 h-2 bg-destructive rounded-full mr-3"></div>
                  Business license suspension
                </li>
                <li className="flex items-center">
                  <div className="w-2 h-2 bg-destructive rounded-full mr-3"></div>
                  Customs delays and seizures
                </li>
                <li className="flex items-center">
                  <div className="w-2 h-2 bg-destructive rounded-full mr-3"></div>
                  Reputational damage
                </li>
                <li className="flex items-center">
                  <div className="w-2 h-2 bg-destructive rounded-full mr-3"></div>
                  Market access restrictions
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Our Risk Mitigation</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-center">
                  <CheckCircle className="mr-2 h-4 w-4 text-accent" />
                  Comprehensive compliance audits
                </li>
                <li className="flex items-center">
                  <CheckCircle className="mr-2 h-4 w-4 text-accent" />
                  Proactive regulatory monitoring
                </li>
                <li className="flex items-center">
                  <CheckCircle className="mr-2 h-4 w-4 text-accent" />
                  Staff training and education
                </li>
                <li className="flex items-center">
                  <CheckCircle className="mr-2 h-4 w-4 text-accent" />
                  Compliance management systems
                </li>
                <li className="flex items-center">
                  <CheckCircle className="mr-2 h-4 w-4 text-accent" />
                  Regular compliance updates
                </li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Features */}
      <div className="grid md:grid-cols-3 gap-8 mb-16">
        <Card className="text-center" data-testid="card-feature-monitoring">
          <CardContent className="pt-6">
            <Globe className="h-12 w-12 text-accent mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">Regulatory Monitoring</h3>
            <p className="text-muted-foreground">
              Continuous monitoring of regulatory changes across all relevant jurisdictions.
            </p>
          </CardContent>
        </Card>

        <Card className="text-center" data-testid="card-feature-expertise">
          <CardContent className="pt-6">
            <Shield className="h-12 w-12 text-accent mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">Expert Guidance</h3>
            <p className="text-muted-foreground">
              Specialized legal experts with deep knowledge of international regulatory frameworks.
            </p>
          </CardContent>
        </Card>

        <Card className="text-center" data-testid="card-feature-support">
          <CardContent className="pt-6">
            <Users className="h-12 w-12 text-accent mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">Ongoing Support</h3>
            <p className="text-muted-foreground">
              Dedicated compliance support team available for ongoing guidance and updates.
            </p>
          </CardContent>
        </Card>
      </div>

      {/* CTA Section */}
      <Card className="bg-accent text-accent-foreground" data-testid="card-cta">
        <CardContent className="py-12 text-center">
          <h2 className="text-3xl font-bold mb-4">Ensure Your Business Stays Compliant</h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Don't let regulatory compliance slow down your global expansion. Get expert guidance to navigate complex regulations with confidence.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/legal-services/request-support">
              <Button size="lg" variant="secondary" data-testid="button-request-compliance">
                <Scale className="mr-2 h-5 w-5" />
                Request Compliance Support
              </Button>
            </Link>
            <Link href="/contact/support">
              <Button size="lg" variant="outline" className="border-accent-foreground text-accent-foreground hover:bg-accent-foreground hover:text-accent" data-testid="button-compliance-consultation">
                <Users className="mr-2 h-5 w-5" />
                Free Consultation
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
