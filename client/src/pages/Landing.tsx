import { Link } from "wouter";
import { Globe, Truck, Building, Scale, Calculator, Search, Gavel, MapPin, Star, Rocket, Phone, Play } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

export default function Landing() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Hero Section */}
      <section className="hero-gradient relative overflow-hidden">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-20 lg:py-32">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="text-white">
              <h1 className="text-4xl lg:text-6xl font-bold leading-tight mb-6" data-testid="text-hero-title">
                Your Global Business <span className="text-accent">Gateway</span>
              </h1>
              <p className="text-xl lg:text-2xl mb-8 text-blue-100 leading-relaxed" data-testid="text-hero-description">
                Streamline your international operations with integrated logistics, commercial real estate, and legal compliance services—all in one platform.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <a 
                  href="/api/login" 
                  className="bg-accent hover:bg-accent/90 text-accent-foreground px-8 py-4 rounded-lg text-lg font-semibold transition-colors flex items-center justify-center"
                  data-testid="button-start-journey"
                >
                  <Rocket className="mr-2 h-5 w-5" />
                  Start Your Journey
                </a>
                <Link 
                  href="/about" 
                  className="border-2 border-white text-white hover:bg-white hover:text-primary px-8 py-4 rounded-lg text-lg font-semibold transition-colors flex items-center justify-center"
                  data-testid="button-learn-more"
                >
                  <Play className="mr-2 h-5 w-5" />
                  Learn More
                </Link>
              </div>
            </div>
            
            {/* Hero Image */}
            <div className="hidden lg:block">
              <img 
                src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600" 
                alt="Global business connectivity and logistics network illustration" 
                className="rounded-xl shadow-2xl w-full h-auto" 
                data-testid="img-hero"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Service Overview */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4" data-testid="text-services-title">
              Three Core Services, One Integrated Platform
            </h2>
            <p className="text-xl text-muted-foreground max-w-3xl mx-auto" data-testid="text-services-description">
              Whether you're shipping globally, leasing commercial space, or navigating legal compliance, 
              we provide the expertise and technology to accelerate your business growth.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Logistics Service Card */}
            <Card className="service-card hover:shadow-lg transition-all duration-300 hover:-translate-y-1" data-testid="card-logistics">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Truck className="text-primary h-8 w-8" />
                </div>
                <h3 className="text-2xl font-bold text-foreground mb-4">Global Logistics</h3>
                <p className="text-muted-foreground mb-6 leading-relaxed">
                  Comprehensive shipping solutions with real-time tracking, competitive rates, and seamless customs clearance across 180+ countries.
                </p>
                <ul className="text-left text-muted-foreground mb-6 space-y-2">
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-accent rounded-full mr-3"></div>
                    Shipping Calculator & Booking
                  </li>
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-accent rounded-full mr-3"></div>
                    Real-time Package Tracking
                  </li>
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-accent rounded-full mr-3"></div>
                    Customs & Documentation
                  </li>
                </ul>
                <Link href="/logistics">
                  <Button className="w-full" data-testid="button-explore-logistics">
                    Explore Logistics
                  </Button>
                </Link>
              </CardContent>
            </Card>

            {/* Real Estate Service Card */}
            <Card className="service-card hover:shadow-lg transition-all duration-300 hover:-translate-y-1" data-testid="card-real-estate">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-accent/10 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Building className="text-accent h-8 w-8" />
                </div>
                <h3 className="text-2xl font-bold text-foreground mb-4">Commercial Real Estate</h3>
                <p className="text-muted-foreground mb-6 leading-relaxed">
                  Premium commercial properties worldwide including offices, warehouses, and retail spaces with flexible leasing terms.
                </p>
                <ul className="text-left text-muted-foreground mb-6 space-y-2">
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-accent rounded-full mr-3"></div>
                    Offices, Warehouses & Retail
                  </li>
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-accent rounded-full mr-3"></div>
                    Virtual Tours & 3D Viewing
                  </li>
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-accent rounded-full mr-3"></div>
                    Flexible Lease Terms
                  </li>
                </ul>
                <Link href="/real-estate">
                  <Button variant="secondary" className="w-full bg-accent hover:bg-accent/90 text-accent-foreground" data-testid="button-browse-properties">
                    Browse Properties
                  </Button>
                </Link>
              </CardContent>
            </Card>

            {/* Legal Services Card */}
            <Card className="service-card hover:shadow-lg transition-all duration-300 hover:-translate-y-1" data-testid="card-legal">
              <CardContent className="p-8 text-center">
                <div className="w-16 h-16 bg-secondary/50 rounded-full flex items-center justify-center mx-auto mb-6">
                  <Scale className="text-secondary-foreground h-8 w-8" />
                </div>
                <h3 className="text-2xl font-bold text-foreground mb-4">Legal & Compliance</h3>
                <p className="text-muted-foreground mb-6 leading-relaxed">
                  Expert legal support for international business including contracts, regulatory compliance, and risk management.
                </p>
                <ul className="text-left text-muted-foreground mb-6 space-y-2">
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-accent rounded-full mr-3"></div>
                    Contract & Regulatory Support
                  </li>
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-accent rounded-full mr-3"></div>
                    GDPR & Digital Compliance
                  </li>
                  <li className="flex items-center">
                    <div className="w-2 h-2 bg-accent rounded-full mr-3"></div>
                    Risk & Insurance Services
                  </li>
                </ul>
                <Link href="/legal-services">
                  <Button variant="secondary" className="w-full" data-testid="button-get-legal-support">
                    Get Legal Support
                  </Button>
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Quick Actions */}
      <section className="py-20 bg-muted">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-4" data-testid="text-quick-actions-title">
              Get Started in Minutes
            </h2>
            <p className="text-xl text-muted-foreground" data-testid="text-quick-actions-description">
              Quick access to our most popular services and tools
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card className="hover:shadow-lg transition-shadow" data-testid="card-shipping-calculator">
              <CardContent className="p-6 text-center">
                <Calculator className="h-12 w-12 text-primary mb-4 mx-auto" />
                <h3 className="font-semibold text-foreground mb-2">Shipping Calculator</h3>
                <p className="text-muted-foreground text-sm mb-4">Get instant shipping quotes</p>
                <Link href="/logistics/shipping-calculator" className="text-primary hover:text-primary/80 font-medium" data-testid="link-calculate-now">
                  Calculate Now →
                </Link>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow" data-testid="card-property-search">
              <CardContent className="p-6 text-center">
                <Search className="h-12 w-12 text-accent mb-4 mx-auto" />
                <h3 className="font-semibold text-foreground mb-2">Property Search</h3>
                <p className="text-muted-foreground text-sm mb-4">Find your ideal space</p>
                <Link href="/real-estate/listings" className="text-accent hover:text-accent/80 font-medium" data-testid="link-search-properties">
                  Search Properties →
                </Link>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow" data-testid="card-legal-consultation">
              <CardContent className="p-6 text-center">
                <Gavel className="h-12 w-12 text-secondary-foreground mb-4 mx-auto" />
                <h3 className="font-semibold text-foreground mb-2">Legal Consultation</h3>
                <p className="text-muted-foreground text-sm mb-4">Request expert advice</p>
                <Link href="/legal-services/request-support" className="text-secondary-foreground hover:text-secondary-foreground/80 font-medium" data-testid="link-get-support">
                  Get Support →
                </Link>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow" data-testid="card-track-shipment">
              <CardContent className="p-6 text-center">
                <MapPin className="h-12 w-12 text-primary mb-4 mx-auto" />
                <h3 className="font-semibold text-foreground mb-2">Track Shipment</h3>
                <p className="text-muted-foreground text-sm mb-4">Monitor your packages</p>
                <Link href="/logistics/tracking" className="text-primary hover:text-primary/80 font-medium" data-testid="link-track-now">
                  Track Now →
                </Link>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* Global Reach */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl lg:text-4xl font-bold text-foreground mb-6" data-testid="text-global-reach-title">
                Global Reach, Local Expertise
              </h2>
              <p className="text-xl text-muted-foreground mb-8 leading-relaxed" data-testid="text-global-reach-description">
                With offices spanning three continents and partnerships in over 50 countries, 
                we provide localized support backed by global infrastructure.
              </p>
              
              <div className="grid sm:grid-cols-3 gap-6 mb-8">
                <div className="text-center" data-testid="stat-countries">
                  <div className="text-3xl font-bold text-primary">180+</div>
                  <div className="text-muted-foreground">Countries Served</div>
                </div>
                <div className="text-center" data-testid="stat-properties">
                  <div className="text-3xl font-bold text-accent">15,000+</div>
                  <div className="text-muted-foreground">Properties Listed</div>
                </div>
                <div className="text-center" data-testid="stat-jurisdictions">
                  <div className="text-3xl font-bold text-secondary-foreground">50+</div>
                  <div className="text-muted-foreground">Legal Jurisdictions</div>
                </div>
              </div>

              <Link href="/about/global-footprint">
                <Button className="inline-flex items-center" data-testid="button-view-footprint">
                  <Globe className="mr-2 h-4 w-4" />
                  View Global Footprint
                </Button>
              </Link>
            </div>

            <div className="lg:order-first">
              <img 
                src="https://images.unsplash.com/photo-1521295121783-8a321d551ad2?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&h=600" 
                alt="Global business operations and international connectivity" 
                className="rounded-xl shadow-lg w-full h-auto" 
                data-testid="img-global-operations"
              />
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 hero-gradient">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl lg:text-4xl font-bold text-primary-foreground mb-6" data-testid="text-cta-title">
            Ready to Scale Your Global Operations?
          </h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto" data-testid="text-cta-description">
            Join thousands of businesses already using Global Business Gateway to streamline 
            their international operations and accelerate growth.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a 
              href="/api/login" 
              className="bg-accent hover:bg-accent/90 text-accent-foreground px-8 py-4 rounded-lg text-lg font-semibold transition-colors inline-flex items-center justify-center"
              data-testid="button-start-trial"
            >
              <Rocket className="mr-2 h-5 w-5" />
              Start Free Trial
            </a>
            <Link 
              href="/contact" 
              className="border-2 border-primary-foreground text-primary-foreground hover:bg-primary-foreground hover:text-primary px-8 py-4 rounded-lg text-lg font-semibold transition-colors inline-flex items-center justify-center"
              data-testid="button-schedule-demo"
            >
              <Phone className="mr-2 h-5 w-5" />
              Schedule Demo
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}
