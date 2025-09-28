import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Globe, Users, Award, TrendingUp, CheckCircle, ArrowRight } from "lucide-react";

export default function About() {
  const stats = [
    { number: "15+", label: "Years of Experience", icon: Award },
    { number: "50+", label: "Countries Served", icon: Globe },
    { number: "10,000+", label: "Clients Worldwide", icon: Users },
    { number: "99%", label: "Client Satisfaction", icon: TrendingUp }
  ];

  const values = [
    {
      title: "Global Expertise",
      description: "Deep understanding of international business regulations and cultural nuances across multiple markets."
    },
    {
      title: "Integrated Solutions",
      description: "Seamlessly connecting logistics, real estate, and legal services for comprehensive business support."
    },
    {
      title: "Innovation First",
      description: "Leveraging cutting-edge technology to streamline processes and enhance client experiences."
    },
    {
      title: "Client Success",
      description: "Dedicated to helping businesses achieve their global expansion goals with personalized support."
    }
  ];

  const milestones = [
    { year: "2008", event: "Founded as a logistics consulting firm" },
    { year: "2012", event: "Expanded into commercial real estate services" },
    { year: "2015", event: "Launched legal and compliance division" },
    { year: "2018", event: "Opened offices in Europe and Middle East" },
    { year: "2020", event: "Launched digital platform integration" },
    { year: "2023", event: "Reached 10,000+ clients milestone" }
  ];

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Hero Section */}
      <div className="text-center mb-16">
        <h1 className="text-4xl lg:text-5xl font-bold text-foreground mb-6" data-testid="text-about-title">
          About Global Business Gateway
        </h1>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8" data-testid="text-about-description">
          We are your trusted partner for global business expansion, providing integrated logistics, 
          commercial real estate, and legal services to help companies scale internationally with confidence.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/about/vision-mission">
            <Button size="lg" data-testid="button-vision-mission">
              <Globe className="mr-2 h-5 w-5" />
              Our Vision & Mission
            </Button>
          </Link>
          <Link href="/contact">
            <Button variant="outline" size="lg" data-testid="button-contact-us">
              Get in Touch
            </Button>
          </Link>
        </div>
      </div>

      {/* Stats Section */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index} className="text-center" data-testid={`card-stat-${index}`}>
              <CardContent className="pt-6">
                <Icon className="h-12 w-12 text-primary mx-auto mb-4" />
                <div className="text-3xl font-bold text-foreground mb-2">{stat.number}</div>
                <div className="text-muted-foreground">{stat.label}</div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Our Story */}
      <div className="mb-16">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-3xl font-bold text-foreground mb-6" data-testid="text-our-story-title">
              Our Story
            </h2>
            <p className="text-muted-foreground mb-6 leading-relaxed" data-testid="text-our-story-content">
              Founded in 2008, Global Business Gateway began as a vision to simplify international business 
              operations. What started as a small logistics consulting firm has evolved into a comprehensive 
              platform serving thousands of businesses worldwide.
            </p>
            <p className="text-muted-foreground mb-6 leading-relaxed">
              Today, we're proud to be a one-stop solution for companies looking to expand globally, 
              offering integrated services that eliminate the complexity of working with multiple vendors 
              across different regions and industries.
            </p>
            <Link href="/about/global-footprint">
              <Button data-testid="button-global-footprint">
                <Globe className="mr-2 h-4 w-4" />
                Explore Our Global Footprint
              </Button>
            </Link>
          </div>
          <div className="lg:order-first">
            <img 
              src="https://images.unsplash.com/photo-1560472354-b33ff0c44a43?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600" 
              alt="Global business team collaboration" 
              className="rounded-xl shadow-lg w-full h-auto" 
              data-testid="img-our-story"
            />
          </div>
        </div>
      </div>

      {/* Our Values */}
      <div className="mb-16">
        <h2 className="text-3xl font-bold text-center text-foreground mb-8" data-testid="text-our-values-title">
          Our Core Values
        </h2>
        <div className="grid md:grid-cols-2 gap-8">
          {values.map((value, index) => (
            <Card key={index} className="hover:shadow-lg transition-shadow" data-testid={`card-value-${index}`}>
              <CardContent className="pt-6">
                <div className="flex items-center mb-4">
                  <CheckCircle className="h-6 w-6 text-accent mr-3" />
                  <h3 className="text-xl font-semibold text-foreground">{value.title}</h3>
                </div>
                <p className="text-muted-foreground">{value.description}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Company Timeline */}
      <div className="mb-16">
        <h2 className="text-3xl font-bold text-center text-foreground mb-8" data-testid="text-timeline-title">
          Our Journey
        </h2>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {milestones.map((milestone, index) => (
            <Card key={index} data-testid={`card-milestone-${index}`}>
              <CardContent className="pt-6">
                <div className="text-2xl font-bold text-primary mb-2">{milestone.year}</div>
                <p className="text-muted-foreground">{milestone.event}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Team Section */}
      <Card className="mb-16" data-testid="card-team">
        <CardContent className="py-12">
          <div className="text-center">
            <Users className="h-16 w-16 text-primary mx-auto mb-6" />
            <h2 className="text-3xl font-bold text-foreground mb-4">Our Global Team</h2>
            <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
              Over 200 professionals across three continents, including logistics experts, 
              real estate specialists, and legal professionals dedicated to your success.
            </p>
            <div className="grid sm:grid-cols-3 gap-8">
              <div className="text-center">
                <div className="text-2xl font-bold text-foreground mb-2">75+</div>
                <div className="text-muted-foreground">Logistics Experts</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-foreground mb-2">80+</div>
                <div className="text-muted-foreground">Real Estate Professionals</div>
              </div>
              <div className="text-center">
                <div className="text-2xl font-bold text-foreground mb-2">45+</div>
                <div className="text-muted-foreground">Legal & Compliance Experts</div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Quick Links */}
      <div className="grid md:grid-cols-3 gap-6 mb-16">
        <Card className="hover:shadow-lg transition-shadow" data-testid="card-vision-mission">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Globe className="mr-2 h-5 w-5 text-primary" />
              Vision & Mission
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">
              Learn about our mission to simplify global business and our vision for the future.
            </p>
            <Link href="/about/vision-mission">
              <Button variant="outline" className="w-full" data-testid="button-learn-vision">
                Learn More
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow" data-testid="card-global-presence">
          <CardHeader>
            <CardTitle className="flex items-center">
              <TrendingUp className="mr-2 h-5 w-5 text-accent" />
              Global Presence
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">
              Discover our worldwide network of offices and strategic partnerships.
            </p>
            <Link href="/about/global-footprint">
              <Button variant="outline" className="w-full" data-testid="button-explore-presence">
                Explore Network
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-shadow" data-testid="card-partnerships">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Users className="mr-2 h-5 w-5 text-secondary-foreground" />
              Partners
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground mb-4">
              Meet our trusted partners who help us deliver exceptional services worldwide.
            </p>
            <Link href="/about/partners">
              <Button variant="outline" className="w-full" data-testid="button-view-partners">
                View Partners
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>

      {/* CTA Section */}
      <Card className="bg-primary text-primary-foreground" data-testid="card-cta">
        <CardContent className="py-12 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Go Global?</h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Join thousands of businesses who trust Global Business Gateway for their international expansion needs.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="/api/login">
              <Button size="lg" variant="secondary" data-testid="button-get-started">
                Get Started Today
              </Button>
            </a>
            <Link href="/contact">
              <Button size="lg" variant="outline" className="border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary" data-testid="button-contact-team">
                Contact Our Team
              </Button>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
