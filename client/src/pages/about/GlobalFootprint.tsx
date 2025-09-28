import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Globe, MapPin, Users, Building, Phone, Mail, Clock } from "lucide-react";
import { Link } from "wouter";

export default function GlobalFootprint() {
  const regions = [
    {
      name: "North America",
      description: "Comprehensive coverage across US, Canada, and Mexico",
      offices: [
        { city: "New York", country: "United States", type: "Headquarters", services: "All Services" },
        { city: "Los Angeles", country: "United States", type: "Regional Hub", services: "Logistics & Real Estate" },
        { city: "Toronto", country: "Canada", type: "Country Office", services: "All Services" },
        { city: "Mexico City", country: "Mexico", type: "Country Office", services: "Logistics & Legal" }
      ],
      stats: { countries: 3, cities: 25, partners: 45 }
    },
    {
      name: "Europe",
      description: "Strategic presence in major European business centers",
      offices: [
        { city: "London", country: "United Kingdom", type: "Regional Hub", services: "All Services" },
        { city: "Frankfurt", country: "Germany", type: "Country Office", services: "Logistics & Legal" },
        { city: "Amsterdam", country: "Netherlands", type: "Country Office", services: "All Services" },
        { city: "Paris", country: "France", type: "Partner Office", services: "Real Estate & Legal" }
      ],
      stats: { countries: 15, cities: 35, partners: 60 }
    },
    {
      name: "Middle East & Africa",
      description: "Growing presence in emerging markets and business hubs",
      offices: [
        { city: "Dubai", country: "UAE", type: "Regional Hub", services: "All Services" },
        { city: "Riyadh", country: "Saudi Arabia", type: "Country Office", services: "Logistics & Real Estate" },
        { city: "Cairo", country: "Egypt", type: "Partner Office", services: "Logistics & Legal" },
        { city: "Lagos", country: "Nigeria", type: "Partner Office", services: "Logistics" }
      ],
      stats: { countries: 12, cities: 18, partners: 25 }
    },
    {
      name: "Asia-Pacific",
      description: "Expanding network across dynamic Asian markets",
      offices: [
        { city: "Singapore", country: "Singapore", type: "Regional Hub", services: "All Services" },
        { city: "Hong Kong", country: "Hong Kong", type: "Country Office", services: "All Services" },
        { city: "Tokyo", country: "Japan", type: "Partner Office", services: "Real Estate & Legal" },
        { city: "Sydney", country: "Australia", type: "Partner Office", services: "All Services" }
      ],
      stats: { countries: 20, cities: 40, partners: 55 }
    }
  ];

  const networkStats = [
    { label: "Countries Served", value: "180+", icon: Globe },
    { label: "Cities Covered", value: "500+", icon: MapPin },
    { label: "Local Partners", value: "185", icon: Users },
    { label: "Office Locations", value: "25", icon: Building }
  ];

  const timeZones = [
    { region: "Americas", timezone: "EST/PST", coverage: "24/7" },
    { region: "Europe/Africa", timezone: "CET/GMT", coverage: "24/7" },
    { region: "Asia-Pacific", timezone: "JST/AEST", coverage: "24/7" },
    { region: "Middle East", timezone: "GST", coverage: "24/7" }
  ];

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="text-center mb-16">
        <div className="flex justify-center mb-6">
          <div className="w-20 h-20 bg-accent/10 rounded-full flex items-center justify-center">
            <Globe className="h-10 w-10 text-accent" />
          </div>
        </div>
        <h1 className="text-4xl lg:text-5xl font-bold text-foreground mb-6" data-testid="text-global-footprint-title">
          Global Footprint
        </h1>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8" data-testid="text-global-footprint-description">
          Our worldwide network of offices, partners, and service centers ensures local expertise 
          and global reach for all your international business needs.
        </p>
        <Link href="/contact/offices">
          <Button size="lg" data-testid="button-contact-offices">
            <MapPin className="mr-2 h-5 w-5" />
            Contact Our Offices
          </Button>
        </Link>
      </div>

      {/* Network Stats */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
        {networkStats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index} className="text-center" data-testid={`card-network-stat-${index}`}>
              <CardContent className="pt-6">
                <Icon className="h-12 w-12 text-primary mx-auto mb-4" />
                <div className="text-3xl font-bold text-foreground mb-2">{stat.value}</div>
                <div className="text-muted-foreground">{stat.label}</div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Regional Presence */}
      <div className="mb-16">
        <h2 className="text-3xl font-bold text-center text-foreground mb-12" data-testid="text-regional-presence-title">
          Regional Presence
        </h2>
        <div className="space-y-12">
          {regions.map((region, regionIndex) => (
            <Card key={regionIndex} className="overflow-hidden" data-testid={`card-region-${regionIndex}`}>
              <CardHeader className="bg-muted">
                <div className="flex justify-between items-start">
                  <div>
                    <CardTitle className="text-2xl mb-2">{region.name}</CardTitle>
                    <p className="text-muted-foreground">{region.description}</p>
                  </div>
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div>
                      <div className="text-2xl font-bold text-primary">{region.stats.countries}</div>
                      <div className="text-xs text-muted-foreground">Countries</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-accent">{region.stats.cities}</div>
                      <div className="text-xs text-muted-foreground">Cities</div>
                    </div>
                    <div>
                      <div className="text-2xl font-bold text-secondary-foreground">{region.stats.partners}</div>
                      <div className="text-xs text-muted-foreground">Partners</div>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="grid md:grid-cols-2 gap-6">
                  {region.offices.map((office, officeIndex) => (
                    <div key={officeIndex} className="flex items-start space-x-3" data-testid={`office-${regionIndex}-${officeIndex}`}>
                      <MapPin className="h-5 w-5 text-primary mt-1 flex-shrink-0" />
                      <div>
                        <h4 className="font-semibold text-foreground">{office.city}, {office.country}</h4>
                        <p className="text-sm text-muted-foreground">{office.type}</p>
                        <p className="text-xs text-muted-foreground">{office.services}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Global Coverage Map */}
      <Card className="mb-16" data-testid="card-coverage-map">
        <CardHeader>
          <CardTitle className="text-center">Global Service Coverage</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center mb-8">
            <img 
              src="https://images.unsplash.com/photo-1614849286447-1dbc2d1c9051?ixlib=rb-4.0.3&auto=format&fit=crop&w=1200&h=600" 
              alt="Global coverage map showing our worldwide network" 
              className="rounded-lg shadow-lg w-full h-auto max-h-96 object-cover" 
              data-testid="img-coverage-map"
            />
          </div>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-4 h-4 bg-primary rounded-full mx-auto mb-2"></div>
              <h4 className="font-semibold text-sm">Full Service Offices</h4>
              <p className="text-xs text-muted-foreground">Complete logistics, real estate & legal services</p>
            </div>
            <div className="text-center">
              <div className="w-4 h-4 bg-accent rounded-full mx-auto mb-2"></div>
              <h4 className="font-semibold text-sm">Regional Hubs</h4>
              <p className="text-xs text-muted-foreground">Coordination centers for multi-country operations</p>
            </div>
            <div className="text-center">
              <div className="w-4 h-4 bg-secondary-foreground rounded-full mx-auto mb-2"></div>
              <h4 className="font-semibold text-sm">Partner Network</h4>
              <p className="text-xs text-muted-foreground">Local partners providing specialized services</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Time Zone Coverage */}
      <Card className="mb-16" data-testid="card-timezone-coverage">
        <CardHeader>
          <CardTitle className="flex items-center justify-center">
            <Clock className="mr-2 h-5 w-5" />
            24/7 Global Support
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {timeZones.map((tz, index) => (
              <div key={index} className="text-center" data-testid={`timezone-${index}`}>
                <Clock className="h-8 w-8 text-primary mx-auto mb-3" />
                <h4 className="font-semibold text-foreground mb-1">{tz.region}</h4>
                <p className="text-sm text-muted-foreground mb-1">{tz.timezone}</p>
                <p className="text-xs text-accent font-medium">{tz.coverage}</p>
              </div>
            ))}
          </div>
          <div className="mt-8 text-center">
            <p className="text-muted-foreground">
              Our follow-the-sun support model ensures there's always a team member available 
              to assist with your business needs, regardless of your location or time zone.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Partnership Network */}
      <Card className="mb-16" data-testid="card-partnership-network">
        <CardHeader>
          <CardTitle className="text-center">Strategic Partnership Network</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-8 text-center">
            <div>
              <Users className="h-12 w-12 text-accent mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Local Expertise</h3>
              <p className="text-muted-foreground text-sm">
                Strategic partnerships with local firms provide deep market knowledge and cultural insights.
              </p>
            </div>
            <div>
              <Building className="h-12 w-12 text-accent mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Service Integration</h3>
              <p className="text-muted-foreground text-sm">
                Seamlessly integrated services across our global network ensure consistent quality and experience.
              </p>
            </div>
            <div>
              <Globe className="h-12 w-12 text-accent mx-auto mb-4" />
              <h3 className="text-xl font-semibold mb-2">Global Standards</h3>
              <p className="text-muted-foreground text-sm">
                All partners meet our rigorous standards for service quality, compliance, and business ethics.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* CTA Section */}
      <div className="grid md:grid-cols-2 gap-8">
        <Card className="bg-primary text-primary-foreground" data-testid="card-cta-expansion">
          <CardContent className="py-8 text-center">
            <h3 className="text-2xl font-bold mb-4">Ready to Expand Globally?</h3>
            <p className="text-blue-100 mb-6">
              Leverage our global network to enter new markets and grow your business internationally.
            </p>
            <a href="/api/login">
              <Button size="lg" variant="secondary" data-testid="button-start-expansion">
                Start Your Expansion
              </Button>
            </a>
          </CardContent>
        </Card>

        <Card className="bg-accent text-accent-foreground" data-testid="card-cta-contact">
          <CardContent className="py-8 text-center">
            <h3 className="text-2xl font-bold mb-4">Connect with Local Experts</h3>
            <p className="text-blue-100 mb-6">
              Get in touch with our regional teams for personalized support and local market insights.
            </p>
            <div className="flex flex-col sm:flex-row gap-2 justify-center">
              <Link href="/contact/offices">
                <Button variant="secondary" data-testid="button-find-office">
                  <MapPin className="mr-2 h-4 w-4" />
                  Find Your Office
                </Button>
              </Link>
              <Link href="/contact">
                <Button variant="outline" className="border-accent-foreground text-accent-foreground hover:bg-accent-foreground hover:text-accent" data-testid="button-contact-team">
                  <Phone className="mr-2 h-4 w-4" />
                  Contact Team
                </Button>
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
