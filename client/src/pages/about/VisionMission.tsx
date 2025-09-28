import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Globe, Target, Eye, Heart, Users, TrendingUp, ArrowRight, CheckCircle } from "lucide-react";
import { Link } from "wouter";

export default function VisionMission() {
  const missionPoints = [
    {
      title: "Simplify Global Business",
      description: "Remove barriers and complexity from international business operations",
      icon: Globe
    },
    {
      title: "Integrated Solutions",
      description: "Provide comprehensive services under one unified platform",
      icon: Target
    },
    {
      title: "Empower Growth",
      description: "Enable businesses of all sizes to expand and thrive globally",
      icon: TrendingUp
    },
    {
      title: "Build Relationships",
      description: "Foster long-term partnerships based on trust and mutual success",
      icon: Users
    }
  ];

  const visionAspects = [
    {
      title: "Global Accessibility",
      description: "Making international business accessible to companies of all sizes, from startups to enterprises."
    },
    {
      title: "Technology Integration",
      description: "Leveraging cutting-edge technology to streamline cross-border operations and communication."
    },
    {
      title: "Sustainable Growth",
      description: "Promoting responsible business practices that benefit communities and the environment."
    },
    {
      title: "Cultural Bridge",
      description: "Connecting cultures and markets through respectful and informed business practices."
    }
  ];

  const coreValues = [
    {
      value: "Integrity",
      description: "We conduct business with the highest ethical standards and transparency.",
      icon: Heart
    },
    {
      value: "Excellence",
      description: "We strive for excellence in every service we provide and every client interaction.",
      icon: Target
    },
    {
      value: "Innovation",
      description: "We continuously innovate to provide better solutions and experiences.",
      icon: TrendingUp
    },
    {
      value: "Partnership",
      description: "We view our clients as partners and invest in their long-term success.",
      icon: Users
    }
  ];

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="text-center mb-16">
        <div className="flex justify-center mb-6">
          <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center">
            <Eye className="h-10 w-10 text-primary" />
          </div>
        </div>
        <h1 className="text-4xl lg:text-5xl font-bold text-foreground mb-6" data-testid="text-vision-mission-title">
          Vision & Mission
        </h1>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto" data-testid="text-vision-mission-description">
          Our commitment to transforming global business through integrated solutions, 
          innovation, and unwavering dedication to client success.
        </p>
      </div>

      {/* Mission Section */}
      <div className="mb-20">
        <Card className="mb-12" data-testid="card-mission-statement">
          <CardContent className="py-12 text-center">
            <Target className="h-16 w-16 text-primary mx-auto mb-6" />
            <h2 className="text-3xl font-bold text-foreground mb-6">Our Mission</h2>
            <p className="text-xl text-muted-foreground max-w-4xl mx-auto leading-relaxed">
              To simplify global business operations by providing integrated logistics, real estate, 
              and legal services that empower companies to expand internationally with confidence, 
              efficiency, and success.
            </p>
          </CardContent>
        </Card>

        <div className="grid md:grid-cols-2 gap-8">
          {missionPoints.map((point, index) => {
            const Icon = point.icon;
            return (
              <Card key={index} className="hover:shadow-lg transition-shadow" data-testid={`card-mission-point-${index}`}>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Icon className="mr-3 h-6 w-6 text-primary" />
                    {point.title}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{point.description}</p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Vision Section */}
      <div className="mb-20">
        <Card className="mb-12" data-testid="card-vision-statement">
          <CardContent className="py-12 text-center">
            <Eye className="h-16 w-16 text-accent mx-auto mb-6" />
            <h2 className="text-3xl font-bold text-foreground mb-6">Our Vision</h2>
            <p className="text-xl text-muted-foreground max-w-4xl mx-auto leading-relaxed">
              To be the world's leading platform for global business expansion, where companies 
              of all sizes can seamlessly navigate international markets and achieve sustainable 
              growth through our comprehensive ecosystem of services.
            </p>
          </CardContent>
        </Card>

        <div className="grid md:grid-cols-2 gap-8">
          {visionAspects.map((aspect, index) => (
            <Card key={index} className="hover:shadow-lg transition-shadow" data-testid={`card-vision-aspect-${index}`}>
              <CardContent className="pt-6">
                <div className="flex items-center mb-4">
                  <CheckCircle className="h-6 w-6 text-accent mr-3" />
                  <h3 className="text-xl font-semibold text-foreground">{aspect.title}</h3>
                </div>
                <p className="text-muted-foreground">{aspect.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Core Values */}
      <div className="mb-20">
        <h2 className="text-3xl font-bold text-center text-foreground mb-12" data-testid="text-core-values-title">
          Our Core Values
        </h2>
        <div className="grid md:grid-cols-2 gap-8">
          {coreValues.map((value, index) => {
            const Icon = value.icon;
            return (
              <Card key={index} className="hover:shadow-lg transition-shadow" data-testid={`card-core-value-${index}`}>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Icon className="mr-3 h-6 w-6 text-secondary-foreground" />
                    {value.value}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{value.description}</p>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>

      {/* Impact Section */}
      <Card className="mb-16 bg-muted" data-testid="card-impact">
        <CardContent className="py-12">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-foreground mb-4">Our Impact</h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto">
              Measuring success through the growth and achievements of our clients worldwide
            </p>
          </div>
          
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center" data-testid="impact-businesses">
              <div className="text-3xl font-bold text-primary mb-2">10,000+</div>
              <div className="text-muted-foreground">Businesses Served</div>
            </div>
            <div className="text-center" data-testid="impact-countries">
              <div className="text-3xl font-bold text-accent mb-2">180+</div>
              <div className="text-muted-foreground">Countries Reached</div>
            </div>
            <div className="text-center" data-testid="impact-shipments">
              <div className="text-3xl font-bold text-secondary-foreground mb-2">1M+</div>
              <div className="text-muted-foreground">Shipments Processed</div>
            </div>
            <div className="text-center" data-testid="impact-properties">
              <div className="text-3xl font-bold text-primary mb-2">15,000+</div>
              <div className="text-muted-foreground">Properties Listed</div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Future Goals */}
      <Card className="mb-16" data-testid="card-future-goals">
        <CardHeader>
          <CardTitle className="text-center text-2xl">Looking Ahead</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-lg font-semibold mb-4 text-foreground">2025 Goals</h3>
              <ul className="space-y-2 text-muted-foreground">
                <li className="flex items-center">
                  <CheckCircle className="mr-2 h-4 w-4 text-accent" />
                  Launch AI-powered logistics optimization
                </li>
                <li className="flex items-center">
                  <CheckCircle className="mr-2 h-4 w-4 text-accent" />
                  Expand to 200+ countries
                </li>
                <li className="flex items-center">
                  <CheckCircle className="mr-2 h-4 w-4 text-accent" />
                  50,000+ property listings
                </li>
                <li className="flex items-center">
                  <CheckCircle className="mr-2 h-4 w-4 text-accent" />
                  Carbon-neutral shipping options
                </li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-semibold mb-4 text-foreground">Long-term Vision</h3>
              <ul className="space-y-2 text-muted-foreground">
                <li className="flex items-center">
                  <CheckCircle className="mr-2 h-4 w-4 text-accent" />
                  Global SME marketplace platform
                </li>
                <li className="flex items-center">
                  <CheckCircle className="mr-2 h-4 w-4 text-accent" />
                  Blockchain-based trade verification
                </li>
                <li className="flex items-center">
                  <CheckCircle className="mr-2 h-4 w-4 text-accent" />
                  Sustainable business ecosystem
                </li>
                <li className="flex items-center">
                  <CheckCircle className="mr-2 h-4 w-4 text-accent" />
                  Real-time global compliance monitoring
                </li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* CTA Sections */}
      <div className="grid md:grid-cols-2 gap-8">
        <Card className="bg-primary text-primary-foreground" data-testid="card-join-mission">
          <CardContent className="py-8 text-center">
            <h3 className="text-2xl font-bold mb-4">Join Our Mission</h3>
            <p className="text-blue-100 mb-6">
              Be part of the global business transformation. Start your international expansion journey today.
            </p>
            <a href="/api/login">
              <Button size="lg" variant="secondary" data-testid="button-start-journey">
                Start Your Journey
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </a>
          </CardContent>
        </Card>

        <Card className="bg-accent text-accent-foreground" data-testid="card-learn-more">
          <CardContent className="py-8 text-center">
            <h3 className="text-2xl font-bold mb-4">Learn More</h3>
            <p className="text-blue-100 mb-6">
              Discover our global network, partnerships, and the team behind our success.
            </p>
            <div className="flex flex-col sm:flex-row gap-2 justify-center">
              <Link href="/about/global-footprint">
                <Button variant="secondary" data-testid="button-global-footprint">
                  Global Footprint
                </Button>
              </Link>
              <Link href="/about/partners">
                <Button variant="outline" className="border-accent-foreground text-accent-foreground hover:bg-accent-foreground hover:text-accent" data-testid="button-partners">
                  Our Partners
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
