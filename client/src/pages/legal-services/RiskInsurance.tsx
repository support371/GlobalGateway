import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield, AlertTriangle, TrendingUp, CheckCircle, Users, Phone } from "lucide-react";
import { Link } from "wouter";

export default function RiskInsurance() {
  const riskTypes = [
    {
      title: "Commercial Risk",
      description: "Protect your business operations from commercial uncertainties",
      risks: ["Contract defaults", "Supply chain disruptions", "Market volatility", "Currency fluctuations"],
      solutions: ["Commercial insurance", "Performance bonds", "Credit insurance", "Currency hedging"]
    },
    {
      title: "Operational Risk",
      description: "Safeguard against operational disruptions and business interruptions",
      risks: ["Equipment failure", "Cyber attacks", "Natural disasters", "Key personnel loss"],
      solutions: ["Business interruption insurance", "Cyber liability coverage", "Property insurance", "Key person insurance"]
    },
    {
      title: "Legal & Regulatory Risk",
      description: "Minimize exposure to legal and compliance-related risks",
      risks: ["Regulatory violations", "Litigation exposure", "Professional liability", "Employment disputes"],
      solutions: ["Professional indemnity", "D&O insurance", "Employment practices liability", "Legal expense insurance"]
    },
    {
      title: "International Risk",
      description: "Address unique risks of international business operations",
      risks: ["Political instability", "Trade restrictions", "Cultural misunderstandings", "Repatriation issues"],
      solutions: ["Political risk insurance", "Trade credit insurance", "Kidnap & ransom", "International liability"]
    }
  ];

  const assessmentProcess = [
    {
      step: "Risk Identification",
      description: "Comprehensive analysis of your business operations to identify potential risks and vulnerabilities."
    },
    {
      step: "Risk Evaluation",
      description: "Quantitative and qualitative assessment of identified risks based on probability and impact."
    },
    {
      step: "Mitigation Strategy",
      description: "Development of customized risk mitigation strategies including insurance and operational measures."
    },
    {
      step: "Implementation",
      description: "Implementation of risk management solutions with ongoing monitoring and adjustment."
    }
  ];

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="text-center mb-12">
        <div className="flex justify-center mb-6">
          <div className="w-20 h-20 bg-secondary/50 rounded-full flex items-center justify-center">
            <Shield className="h-10 w-10 text-secondary-foreground" />
          </div>
        </div>
        <h1 className="text-4xl font-bold text-foreground mb-4" data-testid="text-risk-insurance-title">
          Risk Assessment & Insurance
        </h1>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8" data-testid="text-risk-insurance-description">
          Comprehensive risk assessment and insurance solutions to protect your international business operations. Identify, evaluate, and mitigate risks with expert guidance and tailored coverage.
        </p>
        <Link href="/legal-services/request-support">
          <Button size="lg" data-testid="button-get-risk-assessment">
            <Shield className="mr-2 h-5 w-5" />
            Get Risk Assessment
          </Button>
        </Link>
      </div>

      {/* Risk Types */}
      <div className="mb-16">
        <h2 className="text-3xl font-bold text-center text-foreground mb-8" data-testid="text-risk-types-title">
          Types of Business Risks We Address
        </h2>
        <div className="grid md:grid-cols-2 gap-8">
          {riskTypes.map((risk, index) => (
            <Card key={index} className="hover:shadow-lg transition-shadow" data-testid={`card-risk-type-${index}`}>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <AlertTriangle className="mr-2 h-5 w-5 text-destructive" />
                  {risk.title}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">{risk.description}</p>
                
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-semibold text-sm mb-2 text-destructive">Common Risks:</h4>
                    <ul className="space-y-1">
                      {risk.risks.map((item, itemIndex) => (
                        <li key={itemIndex} className="text-xs text-muted-foreground flex items-center" data-testid={`risk-${index}-${itemIndex}`}>
                          <div className="w-1.5 h-1.5 bg-destructive rounded-full mr-2"></div>
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold text-sm mb-2 text-accent">Our Solutions:</h4>
                    <ul className="space-y-1">
                      {risk.solutions.map((solution, solutionIndex) => (
                        <li key={solutionIndex} className="text-xs text-muted-foreground flex items-center" data-testid={`solution-${index}-${solutionIndex}`}>
                          <CheckCircle className="mr-2 h-3 w-3 text-accent" />
                          {solution}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Assessment Process */}
      <div className="mb-16">
        <h2 className="text-3xl font-bold text-center text-foreground mb-8" data-testid="text-assessment-process-title">
          Our Risk Assessment Process
        </h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
          {assessmentProcess.map((step, index) => (
            <Card key={index} className="text-center" data-testid={`card-assessment-step-${index}`}>
              <CardContent className="pt-6">
                <div className="w-12 h-12 bg-secondary-foreground rounded-full flex items-center justify-center mx-auto mb-4 text-white font-bold text-lg">
                  {index + 1}
                </div>
                <h3 className="font-semibold text-foreground mb-2">{step.step}</h3>
                <p className="text-muted-foreground text-sm">{step.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Insurance Coverage */}
      <Card className="mb-16" data-testid="card-insurance-coverage">
        <CardHeader>
          <CardTitle className="text-center text-2xl">Comprehensive Insurance Coverage</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="text-center">
              <Shield className="h-12 w-12 text-primary mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-3">General Liability</h3>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Public liability coverage</li>
                <li>• Product liability protection</li>
                <li>• Professional indemnity</li>
                <li>• Errors & omissions</li>
              </ul>
            </div>
            
            <div className="text-center">
              <TrendingUp className="h-12 w-12 text-accent mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-3">Business Protection</h3>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Business interruption</li>
                <li>• Property damage coverage</li>
                <li>• Cyber liability insurance</li>
                <li>• Key person protection</li>
              </ul>
            </div>
            
            <div className="text-center">
              <AlertTriangle className="h-12 w-12 text-secondary-foreground mx-auto mb-4" />
              <h3 className="text-lg font-semibold mb-3">Specialized Coverage</h3>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Political risk insurance</li>
                <li>• Trade credit protection</li>
                <li>• International liability</li>
                <li>• Director & officer coverage</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Features */}
      <div className="grid md:grid-cols-3 gap-8 mb-16">
        <Card className="text-center" data-testid="card-feature-expert-analysis">
          <CardContent className="pt-6">
            <TrendingUp className="h-12 w-12 text-accent mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">Expert Analysis</h3>
            <p className="text-muted-foreground">
              Detailed risk analysis by certified risk management professionals with international experience.
            </p>
          </CardContent>
        </Card>

        <Card className="text-center" data-testid="card-feature-tailored-solutions">
          <CardContent className="pt-6">
            <Shield className="h-12 w-12 text-accent mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">Tailored Solutions</h3>
            <p className="text-muted-foreground">
              Customized insurance solutions designed specifically for your business needs and risk profile.
            </p>
          </CardContent>
        </Card>

        <Card className="text-center" data-testid="card-feature-ongoing-support">
          <CardContent className="pt-6">
            <Users className="h-12 w-12 text-accent mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2">Ongoing Support</h3>
            <p className="text-muted-foreground">
              Continuous risk monitoring and insurance management with regular policy reviews and updates.
            </p>
          </CardContent>
        </Card>
      </div>

      {/* CTA Section */}
      <Card className="bg-secondary text-secondary-foreground" data-testid="card-cta">
        <CardContent className="py-12 text-center">
          <h2 className="text-3xl font-bold mb-4">Protect Your Business Today</h2>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Don't leave your business exposed to unnecessary risks. Get a comprehensive risk assessment and tailored insurance solutions from our experts.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/legal-services/request-support">
              <Button size="lg" variant="default" className="bg-primary hover:bg-primary/90 text-primary-foreground" data-testid="button-request-assessment">
                <Shield className="mr-2 h-5 w-5" />
                Request Risk Assessment
              </Button>
            </Link>
            <Link href="/contact/support">
              <Button size="lg" variant="outline" className="border-secondary-foreground text-secondary-foreground hover:bg-secondary-foreground hover:text-secondary" data-testid="button-speak-expert">
                <Phone className="mr-2 h-5 w-5" />
                Speak with Expert
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
