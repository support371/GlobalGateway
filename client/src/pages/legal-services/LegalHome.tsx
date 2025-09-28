import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Scale, FileText, Shield, Users, Globe, CheckCircle, Clock, Award } from "lucide-react";

export default function LegalHome() {
  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Hero Section */}
      <div className="text-center mb-12">
        <div className="flex justify-center mb-6">
          <div className="w-20 h-20 bg-secondary/50 rounded-full flex items-center justify-center">
            <Scale className="h-10 w-10 text-secondary-foreground" />
          </div>
        </div>
        <h1 className="text-4xl font-bold text-foreground mb-4" data-testid="text-legal-title">
          Legal & Compliance Services
        </h1>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8" data-testid="text-legal-description">
          Navigate international business regulations with confidence. Our expert legal team provides comprehensive support for global operations and compliance requirements.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/legal-services/request-support">
            <Button size="lg" data-testid="button-request-support">
              <Scale className="mr-2 h-5 w-5" />
              Request Legal Support
            </Button>
          </Link>
          <Link href="/contact/support">
            <Button variant="outline" size="lg" data-testid="button-consultation">
              <Users className="mr-2 h-5 w-5" />
              Free Consultation
            </Button>
          </Link>
        </div>
      </div>

      {/* Services Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
        <Card className="hover:shadow-lg transition-shadow" data-testid="card-contracts">
          <CardHeader className="text-center">
            <FileText className="h-12 w-12 text-primary mx-auto mb-4" />
            <CardTitle>Contracts & Agreements</CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-muted-foreground mb-6">
              Professional contract drafting, review, and negotiation for international business transactions.
            </p>
            <ul className="text-sm text-muted-foreground mb-6 space-y-2">
              <li className="flex items-center">
                <div className="w-2 h-2 bg-primary rounded-full mr-3"></div>
                Commercial agreements
              </li>
              <li className="flex items-center">
                <div className="w-2 h-2 bg-primary rounded-full mr-3"></div>
                Service contracts
              </li>
              <li className="flex items-center">
                <div className="w-2 h-2 bg-primary rounded-full mr-3"></div>
                Partnership agreements
              </li>
            </ul>
            <Link href="/legal-services/contracts">
              <Button variant="outline" className="w-full" data-testid="button-contracts">
                Learn More
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow" data-testid="card-regulatory">
          <CardHeader className="text-center">
            <Scale className="h-12 w-12 text-accent mx-auto mb-4" />
            <CardTitle>Regulatory Compliance</CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-muted-foreground mb-6">
              Stay compliant with local and international regulations across multiple jurisdictions.
            </p>
            <ul className="text-sm text-muted-foreground mb-6 space-y-2">
              <li className="flex items-center">
                <div className="w-2 h-2 bg-accent rounded-full mr-3"></div>
                International trade law
              </li>
              <li className="flex items-center">
                <div className="w-2 h-2 bg-accent rounded-full mr-3"></div>
                Import/export regulations
              </li>
              <li className="flex items-center">
                <div className="w-2 h-2 bg-accent rounded-full mr-3"></div>
                Industry-specific compliance
              </li>
            </ul>
            <Link href="/legal-services/regulatory">
              <Button variant="outline" className="w-full bg-accent hover:bg-accent/90 text-accent-foreground" data-testid="button-regulatory">
                Learn More
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow" data-testid="card-risk-insurance">
          <CardHeader className="text-center">
            <Shield className="h-12 w-12 text-secondary-foreground mx-auto mb-4" />
            <CardTitle>Risk & Insurance</CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-muted-foreground mb-6">
              Comprehensive risk assessment and insurance solutions for international business operations.
            </p>
            <ul className="text-sm text-muted-foreground mb-6 space-y-2">
              <li className="flex items-center">
                <div className="w-2 h-2 bg-secondary-foreground rounded-full mr-3"></div>
                Risk assessment
              </li>
              <li className="flex items-center">
                <div className="w-2 h-2 bg-secondary-foreground rounded-full mr-3"></div>
                Commercial insurance
              </li>
              <li className="flex items-center">
                <div className="w-2 h-2 bg-secondary-foreground rounded-full mr-3"></div>
                Liability protection
              </li>
            </ul>
            <Link href="/legal-services/risk-insurance">
              <Button variant="outline" className="w-full" data-testid="button-risk-insurance">
                Learn More
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow" data-testid="card-business-support">
          <CardHeader className="text-center">
            <Users className="h-12 w-12 text-primary mx-auto mb-4" />
            <CardTitle>Business Support</CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-muted-foreground mb-6">
              Legal support for business formation, mergers, acquisitions, and corporate restructuring.
            </p>
            <ul className="text-sm text-muted-foreground mb-6 space-y-2">
              <li className="flex items-center">
                <div className="w-2 h-2 bg-primary rounded-full mr-3"></div>
                Business formation
              </li>
              <li className="flex items-center">
                <div className="w-2 h-2 bg-primary rounded-full mr-3"></div>
                M&A transactions
              </li>
              <li className="flex items-center">
                <div className="w-2 h-2 bg-primary rounded-full mr-3"></div>
                Corporate governance
              </li>
            </ul>
            <Link href="/legal-services/business-support">
              <Button variant="outline" className="w-full" data-testid="button-business-support">
                Learn More
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow" data-testid="card-digital-compliance">
          <CardHeader className="text-center">
            <Globe className="h-12 w-12 text-accent mx-auto mb-4" />
            <CardTitle>Digital Compliance</CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-muted-foreground mb-6">
              Navigate digital regulations including GDPR, data privacy, and cybersecurity compliance.
            </p>
            <ul className="text-sm text-muted-foreground mb-6 space-y-2">
              <li className="flex items-center">
                <div className="w-2 h-2 bg-accent rounded-full mr-3"></div>
                GDPR compliance
              </li>
              <li className="flex items-center">
                <div className="w-2 h-2 bg-accent rounded-full mr-3"></div>
                Data privacy policies
              </li>
              <li className="flex items-center">
                <div className="w-2 h-2 bg-accent rounded-full mr-3"></div>
                Cybersecurity law
              </li>
            </ul>
            <Link href="/legal-services/digital-compliance">
              <Button variant="outline" className="w-full bg-accent hover:bg-accent/90 text-accent-foreground" data-testid="button-digital-compliance">
                Learn More
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow" data-testid="card-consultation">
          <CardHeader className="text-center">
            <Users className="h-12 w-12 text-secondary-foreground mx-auto mb-4" />
            <CardTitle>Expert Consultation</CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-muted-foreground mb-6">
              Get personalized legal advice from our team of international business law experts.
            </p>
            <ul className="text-sm text-muted-foreground mb-6 space-y-2">
              <li className="flex items-center">
                <div className="w-2 h-2 bg-secondary-foreground rounded-full mr-3"></div>
                Strategy consultation
              </li>
              <li className="flex items-center">
                <div className="w-2 h-2 bg-secondary-foreground rounded-full mr-3"></div>
                Legal opinions
              </li>
              <li className="flex items-center">
                <div className="w-2 h-2 bg-secondary-foreground rounded-full mr-3"></div>
                Ongoing support
              </li>
            </ul>
            <Link href="/legal-services/request-support">
              <Button variant="outline" className="w-full" data-testid="button-consultation-card">
                Request Support
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>

      {/* Features Section */}
      <div className="grid md:grid-cols-3 gap-8 mb-12">
        <div className="text-center" data-testid="feature-expert-team">
          <Award className="h-12 w-12 text-accent mx-auto mb-4" />
          <h3 className="text-xl font-semibold mb-2">Expert Legal Team</h3>
          <p className="text-muted-foreground">
            Experienced lawyers specializing in international business law and cross-border transactions.
          </p>
        </div>

        <div className="text-center" data-testid="feature-fast-response">
          <Clock className="h-12 w-12 text-accent mx-auto mb-4" />
          <h3 className="text-xl font-semibold mb-2">Fast Response Time</h3>
          <p className="text-muted-foreground">
            Quick turnaround on legal documents and consultation requests with 24-48 hour response times.
          </p>
        </div>

        <div className="text-center" data-testid="feature-global-coverage">
          <Globe className="h-12 w-12 text-accent mx-auto mb-4" />
          <h3 className="text-xl font-semibold mb-2">Global Coverage</h3>
          <p className="text-muted-foreground">
            Legal expertise across 50+ jurisdictions with local law partners worldwide.
          </p>
        </div>
      </div>

      {/* Stats Section */}
      <Card className="bg-secondary text-secondary-foreground" data-testid="card-stats">
        <CardContent className="py-12">
          <div className="grid sm:grid-cols-3 gap-8 text-center">
            <div data-testid="stat-jurisdictions">
              <div className="text-3xl font-bold mb-2">50+</div>
              <div className="text-gray-600">Legal Jurisdictions</div>
            </div>
            <div data-testid="stat-cases">
              <div className="text-3xl font-bold mb-2">10,000+</div>
              <div className="text-gray-600">Cases Handled</div>
            </div>
            <div data-testid="stat-success">
              <div className="text-3xl font-bold mb-2">99%</div>
              <div className="text-gray-600">Success Rate</div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
