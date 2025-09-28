import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, CheckCircle, Clock, Shield, Users, ArrowRight } from "lucide-react";
import { Link } from "wouter";

export default function Contracts() {
  const contractTypes = [
    {
      title: "Commercial Agreements",
      description: "Comprehensive business-to-business contracts for goods and services",
      features: ["Supply agreements", "Distribution contracts", "Licensing agreements", "Joint venture contracts"]
    },
    {
      title: "Service Contracts",
      description: "Professional service agreements tailored to your business needs",
      features: ["Consulting agreements", "Software licensing", "Maintenance contracts", "SLA agreements"]
    },
    {
      title: "Employment Contracts",
      description: "International employment law compliance and contract drafting",
      features: ["Executive agreements", "Remote work contracts", "Non-compete clauses", "International transfers"]
    },
    {
      title: "Partnership Agreements",
      description: "Strategic partnership and collaboration frameworks",
      features: ["Strategic alliances", "Technology partnerships", "Market entry agreements", "Franchise contracts"]
    }
  ];

  const process = [
    {
      step: "1",
      title: "Initial Consultation",
      description: "Discuss your requirements and business objectives with our legal experts."
    },
    {
      step: "2",
      title: "Contract Drafting",
      description: "Our team drafts comprehensive contracts tailored to your specific needs."
    },
    {
      step: "3",
      title: "Review & Revision",
      description: "Collaborative review process with amendments based on your feedback."
    },
    {
      step: "4",
      title: "Finalization",
      description: "Final contract delivery with legal guidance for execution and implementation."
    }
  ];

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="text-center mb-12">
        <div className="flex justify-center mb-6">
          <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center">
            <FileText className="h-10 w-10 text-primary" />
          </div>
        </div>
        <h1 className="text-4xl font-bold text-foreground mb-4" data-testid="text-contracts-title">
          Contracts & Agreements
        </h1>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8" data-testid="text-contracts-description">
          Professional contract drafting, review, and negotiation services for international business transactions. Ensure your agreements are legally sound and protect your interests.
        </p>
        <Link href="/legal-services/request-support">
          <Button size="lg" data-testid="button-get-started">
            <FileText className="mr-2 h-5 w-5" />
            Request Contract Support
          </Button>
        </Link>
      </div>

      {/* Contract Types */}
      <div className="mb-16">
        <h2 className="text-3xl font-bold text-center text-foreground mb-8" data-testid="text-contract-types-title">
          Contract Types We Handle
        </h2>
        <div className="grid md:grid-cols-2 gap-8">
          {contractTypes.map((type, index) => (
            <Card key={index} className="hover:shadow-lg transition-shadow" data-testid={`card-contract-type-${index}`}>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <FileText className="mr-2 h-5 w-5 text-primary" />
                  {type.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">{type.description}</p>
                <ul className="space-y-2">
                  {type.features.map((feature, featureIndex) => (
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

      {/* Process */}
      <div className="mb-16">
        <h2 className="text-3xl font-bold text-center text-foreground mb-8" data-testid="text-process-title">
          Our Contract Process
        </h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {process.map((step, index) => (
            <Card key={index} className="text-center" data-testid={`card-process-step-${index}`}>
              <CardContent className="pt-6">
                <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center mx-auto mb-4 text-primary-foreground font-bold text-lg">
                  {step.step}
                </div>
                <h3 className="font-semibold text-foreground mb-2">{step.title}</h3>
                <p className="text-muted-foreground text-sm">{step.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Features */}
      <div className="grid md:grid-cols-3 gap-8 mb-16">
        <Card className="text-center" data-testid="card-feature-expertise">
          <CardContent className="pt-6">
            <Shield className="h-12 w-12 text-accent mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">Legal Expertise</h3>
            <p className="text-muted-foreground">
              Experienced international business lawyers with deep knowledge of cross-border transactions.
            </p>
          </CardContent>
        </Card>

        <Card className="text-center" data-testid="card-feature-speed">
          <CardContent className="pt-6">
            <Clock className="h-12 w-12 text-accent mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">Fast Turnaround</h3>
            <p className="text-muted-foreground">
              Quick contract drafting and review with typical turnaround times of 3-5 business days.
            </p>
          </CardContent>
        </Card>

        <Card className="text-center" data-testid="card-feature-support">
          <CardContent className="pt-6">
            <Users className="h-12 w-12 text-accent mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">Ongoing Support</h3>
            <p className="text-muted-foreground">
              Continued legal support for contract amendments, renewals, and dispute resolution.
            </p>
          </CardContent>
        </Card>
      </div>

      {/* CTA Section */}
      <Card className="bg-primary text-primary-foreground" data-testid="card-cta">
        <CardContent className="py-12 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Get Started?</h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Let our legal experts help you create contracts that protect your business interests and facilitate successful international transactions.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/legal-services/request-support">
              <Button size="lg" variant="secondary" data-testid="button-request-contract">
                <FileText className="mr-2 h-5 w-5" />
                Request Contract Support
              </Button>
            </Link>
            <Link href="/contact/support">
              <Button size="lg" variant="outline" className="border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary" data-testid="button-free-consultation">
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
