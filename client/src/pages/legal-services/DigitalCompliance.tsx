import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Globe, Shield, Lock, CheckCircle, AlertTriangle, Users, FileText, Phone } from "lucide-react";
import { Link } from "wouter";

export default function DigitalCompliance() {
  const complianceAreas = [
    {
      title: "GDPR Compliance",
      description: "Comprehensive GDPR compliance solutions for EU data protection requirements",
      features: ["Privacy policy drafting", "Data mapping & audits", "Consent management", "Breach response protocols"],
      icon: Shield
    },
    {
      title: "Data Privacy Laws",
      description: "Navigate global data privacy regulations across multiple jurisdictions",
      features: ["CCPA compliance", "PIPEDA requirements", "LGPD implementation", "Regional privacy laws"],
      icon: Lock
    },
    {
      title: "Cybersecurity Law",
      description: "Legal frameworks for cybersecurity compliance and incident response",
      features: ["Security standards compliance", "Incident response planning", "Cyber insurance guidance", "Regulatory reporting"],
      icon: Globe
    },
    {
      title: "Digital Governance",
      description: "Establish robust digital governance frameworks for your organization",
      features: ["Digital policies & procedures", "Data governance frameworks", "Technology risk management", "Digital ethics guidelines"],
      icon: FileText
    }
  ];

  const gdprRequirements = [
    {
      requirement: "Lawful Basis",
      description: "Establish and document lawful basis for data processing activities"
    },
    {
      requirement: "Data Subject Rights",
      description: "Implement processes for handling data subject access, rectification, and erasure requests"
    },
    {
      requirement: "Privacy by Design",
      description: "Integrate privacy considerations into system design and business processes"
    },
    {
      requirement: "Data Protection Impact Assessment",
      description: "Conduct DPIAs for high-risk processing activities"
    },
    {
      requirement: "Breach Notification",
      description: "Establish 72-hour breach notification procedures to supervisory authorities"
    },
    {
      requirement: "Records of Processing",
      description: "Maintain comprehensive records of all data processing activities"
    }
  ];

  const globalRegulations = [
    { region: "European Union", regulation: "GDPR", description: "General Data Protection Regulation" },
    { region: "United States", regulation: "CCPA/CPRA", description: "California Consumer Privacy Act & Rights" },
    { region: "Canada", regulation: "PIPEDA", description: "Personal Information Protection & Electronic Documents Act" },
    { region: "Brazil", regulation: "LGPD", description: "Lei Geral de Proteção de Dados" },
    { region: "United Kingdom", regulation: "UK GDPR", description: "UK Data Protection Act 2018" },
    { region: "Australia", regulation: "Privacy Act", description: "Australian Privacy Principles" }
  ];

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="text-center mb-12">
        <div className="flex justify-center mb-6">
          <div className="w-20 h-20 bg-accent/10 rounded-full flex items-center justify-center">
            <Globe className="h-10 w-10 text-accent" />
          </div>
        </div>
        <h1 className="text-4xl font-bold text-foreground mb-4" data-testid="text-digital-compliance-title">
          Digital Compliance Services
        </h1>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8" data-testid="text-digital-compliance-description">
          Navigate the complex landscape of digital regulations including GDPR, data privacy laws, and cybersecurity compliance. Protect your business and customers with expert legal guidance.
        </p>
        <Link href="/legal-services/request-support">
          <Button size="lg" data-testid="button-get-compliance-help">
            <Globe className="mr-2 h-5 w-5" />
            Get Compliance Help
          </Button>
        </Link>
      </div>

      {/* Compliance Areas */}
      <div className="mb-16">
        <h2 className="text-3xl font-bold text-center text-foreground mb-8" data-testid="text-compliance-areas-title">
          Digital Compliance Areas
        </h2>
        <div className="grid md:grid-cols-2 gap-8">
          {complianceAreas.map((area, index) => {
            const Icon = area.icon;
            return (
              <Card key={index} className="hover:shadow-lg transition-shadow" data-testid={`card-compliance-area-${index}`}>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Icon className="mr-2 h-5 w-5 text-accent" />
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
            );
          })}
        </div>
      </div>

      {/* GDPR Requirements */}
      <div className="mb-16">
        <h2 className="text-3xl font-bold text-center text-foreground mb-8" data-testid="text-gdpr-requirements-title">
          Key GDPR Requirements
        </h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {gdprRequirements.map((req, index) => (
            <Card key={index} data-testid={`card-gdpr-requirement-${index}`}>
              <CardContent className="pt-6">
                <div className="flex items-center mb-3">
                  <Shield className="h-5 w-5 text-accent mr-2" />
                  <h3 className="font-semibold text-foreground">{req.requirement}</h3>
                </div>
                <p className="text-sm text-muted-foreground">{req.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Global Regulations */}
      <div className="mb-16">
        <h2 className="text-3xl font-bold text-center text-foreground mb-8" data-testid="text-global-regulations-title">
          Global Privacy Regulations We Handle
        </h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {globalRegulations.map((reg, index) => (
            <Card key={index} data-testid={`card-regulation-${index}`}>
              <CardContent className="pt-6">
                <div className="flex items-center mb-3">
                  <Globe className="h-5 w-5 text-primary mr-2" />
                  <div>
                    <h3 className="font-semibold text-foreground">{reg.region}</h3>
                    <p className="text-sm font-medium text-primary">{reg.regulation}</p>
                  </div>
                </div>
                <p className="text-sm text-muted-foreground">{reg.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Compliance Checklist */}
      <Card className="mb-16 border-accent/20" data-testid="card-compliance-checklist">
        <CardHeader>
          <CardTitle className="flex items-center text-accent">
            <CheckCircle className="mr-2 h-5 w-5" />
            Digital Compliance Checklist
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-lg font-semibold mb-4">Essential Compliance Steps</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-center">
                  <CheckCircle className="mr-2 h-4 w-4 text-accent" />
                  Conduct privacy impact assessments
                </li>
                <li className="flex items-center">
                  <CheckCircle className="mr-2 h-4 w-4 text-accent" />
                  Implement data mapping procedures
                </li>
                <li className="flex items-center">
                  <CheckCircle className="mr-2 h-4 w-4 text-accent" />
                  Establish consent management systems
                </li>
                <li className="flex items-center">
                  <CheckCircle className="mr-2 h-4 w-4 text-accent" />
                  Create data subject request procedures
                </li>
                <li className="flex items-center">
                  <CheckCircle className="mr-2 h-4 w-4 text-accent" />
                  Develop breach response protocols
                </li>
                <li className="flex items-center">
                  <CheckCircle className="mr-2 h-4 w-4 text-accent" />
                  Train staff on privacy requirements
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4">Common Compliance Risks</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-center">
                  <AlertTriangle className="mr-2 h-4 w-4 text-destructive" />
                  Inadequate consent mechanisms
                </li>
                <li className="flex items-center">
                  <AlertTriangle className="mr-2 h-4 w-4 text-destructive" />
                  Insufficient data security measures
                </li>
                <li className="flex items-center">
                  <AlertTriangle className="mr-2 h-4 w-4 text-destructive" />
                  Lack of data retention policies
                </li>
                <li className="flex items-center">
                  <AlertTriangle className="mr-2 h-4 w-4 text-destructive" />
                  Inadequate vendor agreements
                </li>
                <li className="flex items-center">
                  <AlertTriangle className="mr-2 h-4 w-4 text-destructive" />
                  Missing privacy notices
                </li>
                <li className="flex items-center">
                  <AlertTriangle className="mr-2 h-4 w-4 text-destructive" />
                  Poor incident response planning
                </li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Features */}
      <div className="grid md:grid-cols-3 gap-8 mb-16">
        <Card className="text-center" data-testid="card-feature-expertise">
          <CardContent className="pt-6">
            <Shield className="h-12 w-12 text-accent mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">Privacy Expertise</h3>
            <p className="text-muted-foreground">
              Certified privacy professionals with deep knowledge of global data protection regulations.
            </p>
          </CardContent>
        </Card>

        <Card className="text-center" data-testid="card-feature-comprehensive">
          <CardContent className="pt-6">
            <Globe className="h-12 w-12 text-accent mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">Global Coverage</h3>
            <p className="text-muted-foreground">
              Comprehensive compliance solutions covering major data protection regulations worldwide.
            </p>
          </CardContent>
        </Card>

        <Card className="text-center" data-testid="card-feature-ongoing">
          <CardContent className="pt-6">
            <Users className="h-12 w-12 text-accent mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">Ongoing Support</h3>
            <p className="text-muted-foreground">
              Continuous compliance monitoring and support with regular updates on regulatory changes.
            </p>
          </CardContent>
        </Card>
      </div>

      {/* CTA Section */}
      <Card className="bg-accent text-accent-foreground" data-testid="card-cta">
        <CardContent className="py-12 text-center">
          <h2 className="text-3xl font-bold mb-4">Secure Your Digital Compliance</h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Don't risk hefty fines and reputation damage. Get expert guidance on digital compliance and data protection regulations.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/legal-services/request-support">
              <Button size="lg" variant="secondary" data-testid="button-request-compliance">
                <Globe className="mr-2 h-5 w-5" />
                Request Compliance Support
              </Button>
            </Link>
            <Link href="/contact/support">
              <Button size="lg" variant="outline" className="border-accent-foreground text-accent-foreground hover:bg-accent-foreground hover:text-accent" data-testid="button-compliance-consultation">
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
