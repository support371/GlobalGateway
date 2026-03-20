import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, Handshake, Globe, Award, CheckCircle, Star, ArrowRight, Building } from "lucide-react";
import { Link } from "wouter";

export default function Partners() {
  const partnerCategories = [
    {
      title: "Logistics Partners",
      description: "Global shipping and freight companies ensuring reliable delivery worldwide",
      partners: [
        { name: "Global Express Network", type: "International Shipping", region: "Worldwide" },
        { name: "Continental Freight Systems", type: "Air & Sea Freight", region: "Europe & Americas" },
        { name: "Asia-Pacific Logistics Alliance", type: "Regional Distribution", region: "Asia-Pacific" },
        { name: "African Trade Corridor", type: "Cross-border Trade", region: "Africa & Middle East" }
      ],
      icon: Globe
    },
    {
      title: "Real Estate Partners",
      description: "Premium commercial real estate firms with extensive property portfolios",
      partners: [
        { name: "Metropolitan Property Group", type: "Office Spaces", region: "North America" },
        { name: "European Commercial Estates", type: "Multi-use Properties", region: "Europe" },
        { name: "Middle East Property Alliance", type: "Commercial & Industrial", region: "Middle East" },
        { name: "Asia Commercial Properties", type: "Retail & Warehouses", region: "Asia" }
      ],
      icon: Building
    },
    {
      title: "Legal Partners",
      description: "International law firms specializing in cross-border business law",
      partners: [
        { name: "International Business Law Consortium", type: "Corporate Law", region: "Global" },
        { name: "Trade Compliance Legal Network", type: "Regulatory Compliance", region: "Worldwide" },
        { name: "Digital Rights Legal Alliance", type: "Technology & Privacy", region: "US, EU, UK" },
        { name: "Emerging Markets Legal Group", type: "Developing Markets", region: "Africa, Asia, LATAM" }
      ],
      icon: Users
    }
  ];

  const benefits = [
    {
      title: "Local Expertise",
      description: "Deep understanding of local markets, regulations, and business practices",
      icon: Globe
    },
    {
      title: "Quality Assurance",
      description: "All partners meet our rigorous standards for service quality and reliability",
      icon: Award
    },
    {
      title: "Seamless Integration",
      description: "Unified platform experience across all partner services and locations",
      icon: CheckCircle
    },
    {
      title: "Competitive Advantage",
      description: "Access to partner networks and exclusive rates not available elsewhere",
      icon: Star
    }
  ];

  const partnershipLevels = [
    {
      level: "Strategic Partners",
      description: "Long-term strategic alliances with global reach and comprehensive service integration",
      features: ["Global coverage", "Integrated systems", "Dedicated support", "Volume discounts"],
      count: "15+"
    },
    {
      level: "Regional Partners",
      description: "Regional specialists providing focused expertise in specific geographic markets",
      features: ["Regional expertise", "Local compliance", "Cultural insights", "Market access"],
      count: "50+"
    },
    {
      level: "Service Partners",
      description: "Specialized service providers offering niche expertise in specific areas",
      features: ["Specialized skills", "Flexible engagement", "Scalable resources", "Innovation focus"],
      count: "120+"
    }
  ];

  const testimonials = [
    {
      quote: "Our partnership with Global Business Gateway has transformed how we serve international clients. The integrated platform makes complex global transactions seamless.",
      author: "Sarah Chen",
      title: "CEO, Metropolitan Property Group",
      company: "Real Estate Partner"
    },
    {
      quote: "The collaboration has opened new markets for our logistics services while maintaining the high standards our clients expect.",
      author: "Ahmed Al-Rashid", 
      title: "Regional Director, Continental Freight",
      company: "Logistics Partner"
    },
    {
      quote: "Working with GBG allows us to offer our legal expertise to a much broader client base while ensuring compliance across all jurisdictions.",
      author: "Maria Rodriguez",
      title: "Managing Partner, International Business Law",
      company: "Legal Partner"
    }
  ];

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="text-center mb-16">
        <div className="flex justify-center mb-6">
          <div className="w-20 h-20 bg-secondary/50 rounded-full flex items-center justify-center">
            <Handshake className="h-10 w-10 text-secondary-foreground" />
          </div>
        </div>
        <h1 className="text-4xl lg:text-5xl font-bold text-foreground mb-6" data-testid="text-partners-title">
          Our Global Partners
        </h1>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8" data-testid="text-partners-description">
          We work with trusted partners worldwide to deliver exceptional service and local expertise. 
          Our carefully selected network ensures you get the best support for your global business needs.
        </p>
        <Link href="/contact">
          <Button size="lg" data-testid="button-become-partner">
            <Handshake className="mr-2 h-5 w-5" />
            Become a Partner
          </Button>
        </Link>
      </div>

      {/* Partnership Stats */}
      <div className="grid sm:grid-cols-3 gap-6 mb-16">
        <Card className="text-center" data-testid="card-partnership-stats">
          <CardContent className="pt-6">
            <div className="text-3xl font-bold text-primary mb-2">185+</div>
            <div className="text-muted-foreground">Global Partners</div>
          </CardContent>
        </Card>
        <Card className="text-center">
          <CardContent className="pt-6">
            <div className="text-3xl font-bold text-accent mb-2">50+</div>
            <div className="text-muted-foreground">Countries Covered</div>
          </CardContent>
        </Card>
        <Card className="text-center">
          <CardContent className="pt-6">
            <div className="text-3xl font-bold text-secondary-foreground mb-2">99%</div>
            <div className="text-muted-foreground">Partner Satisfaction</div>
          </CardContent>
        </Card>
      </div>

      {/* Partner Categories */}
      <div className="mb-16">
        <h2 className="text-3xl font-bold text-center text-foreground mb-12" data-testid="text-partner-categories-title">
          Partner Categories
        </h2>
        <div className="space-y-12">
          {partnerCategories.map((category, categoryIndex) => {
            const Icon = category.icon;
            return (
              <Card key={categoryIndex} className="overflow-hidden" data-testid={`card-partner-category-${categoryIndex}`}>
                <CardHeader className="bg-muted">
                  <CardTitle className="flex items-center text-2xl">
                    <Icon className="mr-3 h-6 w-6 text-primary" />
                    {category.title}
                  </CardTitle>
                  <p className="text-muted-foreground">{category.description}</p>
                </CardHeader>
                <CardContent className="pt-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    {category.partners.map((partner, partnerIndex) => (
                      <div key={partnerIndex} className="flex items-start space-x-3" data-testid={`partner-${categoryIndex}-${partnerIndex}`}>
                        <CheckCircle className="h-5 w-5 text-accent mt-1 flex-shrink-0" />
                        <div>
                          <h4 className="font-semibold text-foreground">{partner.name}</h4>
                          <p className="text-sm text-muted-foreground">{partner.type}</p>
                          <p className="text-xs text-primary">{partner.region}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Partnership Benefits */}
      <div className="mb-16">
        <h2 className="text-3xl font-bold text-center text-foreground mb-12" data-testid="text-partnership-benefits-title">
          Partnership Benefits
        </h2>
        <div className="grid md:grid-cols-2 gap-8">
          {benefits.map((benefit, index) => {
            const Icon = benefit.icon;
            return (
              <Card key={index} className="hover:shadow-lg transition-shadow" data-testid={`card-benefit-${index}`}>
                <CardContent className="pt-6">
                  <div className="flex items-center mb-4">
                    <Icon className="h-8 w-8 text-accent mr-4" />
                    <h3 className="text-xl font-semibold text-foreground">{benefit.title}</h3>
                  </div>
                  <p className="text-muted-foreground">{benefit.description}</p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Partnership Levels */}
      <div className="mb-16">
        <h2 className="text-3xl font-bold text-center text-foreground mb-12" data-testid="text-partnership-levels-title">
          Partnership Levels
        </h2>
        <div className="grid md:grid-cols-3 gap-8">
          {partnershipLevels.map((level, index) => (
            <Card key={index} className="hover:shadow-lg transition-shadow" data-testid={`card-partnership-level-${index}`}>
              <CardHeader>
                <div className="flex justify-between items-start">
                  <CardTitle className="text-lg">{level.level}</CardTitle>
                  <div className="text-2xl font-bold text-primary">{level.count}</div>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">{level.description}</p>
                <ul className="space-y-2">
                  {level.features.map((feature, featureIndex) => (
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

      {/* Partner Testimonials */}
      <div className="mb-16">
        <h2 className="text-3xl font-bold text-center text-foreground mb-12" data-testid="text-testimonials-title">
          What Our Partners Say
        </h2>
        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <Card key={index} data-testid={`card-testimonial-${index}`}>
              <CardContent className="pt-6">
                <div className="flex items-center mb-4">
                  <div className="flex text-accent">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-current" />
                    ))}
                  </div>
                </div>
                <p className="text-muted-foreground mb-6 italic">"{testimonial.quote}"</p>
                <div>
                  <div className="font-semibold text-foreground">{testimonial.author}</div>
                  <div className="text-sm text-muted-foreground">{testimonial.title}</div>
                  <div className="text-xs text-primary">{testimonial.company}</div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Partner Requirements */}
      <Card className="mb-16" data-testid="card-partner-requirements">
        <CardHeader>
          <CardTitle className="text-center text-2xl">Partner Requirements</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-lg font-semibold mb-4 text-foreground">Minimum Qualifications</h3>
              <ul className="space-y-2 text-muted-foreground">
                <li className="flex items-center">
                  <CheckCircle className="mr-2 h-4 w-4 text-accent" />
                  5+ years industry experience
                </li>
                <li className="flex items-center">
                  <CheckCircle className="mr-2 h-4 w-4 text-accent" />
                  Proven track record of service quality
                </li>
                <li className="flex items-center">
                  <CheckCircle className="mr-2 h-4 w-4 text-accent" />
                  Financial stability and insurance coverage
                </li>
                <li className="flex items-center">
                  <CheckCircle className="mr-2 h-4 w-4 text-accent" />
                  Compliance with local regulations
                </li>
                <li className="flex items-center">
                  <CheckCircle className="mr-2 h-4 w-4 text-accent" />
                  Technology integration capabilities
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4 text-foreground">Partnership Benefits</h3>
              <ul className="space-y-2 text-muted-foreground">
                <li className="flex items-center">
                  <CheckCircle className="mr-2 h-4 w-4 text-accent" />
                  Access to global client network
                </li>
                <li className="flex items-center">
                  <CheckCircle className="mr-2 h-4 w-4 text-accent" />
                  Technology platform integration
                </li>
                <li className="flex items-center">
                  <CheckCircle className="mr-2 h-4 w-4 text-accent" />
                  Marketing and business development support
                </li>
                <li className="flex items-center">
                  <CheckCircle className="mr-2 h-4 w-4 text-accent" />
                  Training and certification programs
                </li>
                <li className="flex items-center">
                  <CheckCircle className="mr-2 h-4 w-4 text-accent" />
                  Revenue sharing opportunities
                </li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* CTA Section */}
      <div className="grid md:grid-cols-2 gap-8">
        <Card className="bg-primary text-primary-foreground" data-testid="card-cta-join">
          <CardContent className="py-8 text-center">
            <h3 className="text-2xl font-bold mb-4">Join Our Partner Network</h3>
            <p className="text-blue-100 mb-6">
              Become part of our global ecosystem and expand your business reach through strategic partnership.
            </p>
            <Link href="/contact">
              <Button size="lg" variant="secondary" data-testid="button-apply-partnership">
                Apply for Partnership
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card className="bg-accent text-accent-foreground" data-testid="card-cta-client">
          <CardContent className="py-8 text-center">
            <h3 className="text-2xl font-bold mb-4">Leverage Our Network</h3>
            <p className="text-blue-100 mb-6">
              Access our extensive partner network to accelerate your global business expansion and growth.
            </p>
            <a href="/api/login">
              <Button size="lg" variant="secondary" data-testid="button-start-business">
                Start Your Business
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </a>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
