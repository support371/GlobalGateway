import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { MapPin, Phone, Mail, Clock, Globe, Users, Building } from "lucide-react";

export default function Offices() {
  const regions = [
    {
      region: "North America",
      offices: [
        {
          city: "New York",
          country: "United States",
          type: "Global Headquarters",
          address: "350 Fifth Avenue, Suite 7400, New York, NY 10118",
          phone: "+1 (212) 555-0100",
          email: "ny@globalbusinessgateway.com",
          hours: "Mon-Fri 8AM-8PM EST",
          services: ["All Services", "Executive Management", "Global Coordination"],
          isHeadquarters: true
        },
        {
          city: "Los Angeles",
          country: "United States", 
          type: "Regional Hub",
          address: "633 West Fifth Street, Suite 2800, Los Angeles, CA 90071",
          phone: "+1 (213) 555-0200",
          email: "la@globalbusinessgateway.com",
          hours: "Mon-Fri 7AM-7PM PST",
          services: ["Logistics", "Real Estate", "Asia-Pacific Coordination"]
        },
        {
          city: "Toronto",
          country: "Canada",
          type: "Country Office",
          address: "181 Bay Street, Suite 2100, Toronto, ON M5J 2T3",
          phone: "+1 (416) 555-0300",
          email: "toronto@globalbusinessgateway.com", 
          hours: "Mon-Fri 8AM-6PM EST",
          services: ["All Services", "Canadian Market Specialist"]
        }
      ]
    },
    {
      region: "Europe",
      offices: [
        {
          city: "London",
          country: "United Kingdom",
          type: "Regional Hub",
          address: "30 Gresham Street, London EC2V 7QN",
          phone: "+44 20 7946 0958",
          email: "london@globalbusinessgateway.com",
          hours: "Mon-Fri 8AM-7PM GMT",
          services: ["All Services", "European Coordination", "Brexit Advisory"]
        },
        {
          city: "Frankfurt",
          country: "Germany",
          type: "Country Office", 
          address: "Taunusanlage 12, 60325 Frankfurt am Main",
          phone: "+49 69 7104 0000",
          email: "frankfurt@globalbusinessgateway.com",
          hours: "Mon-Fri 8AM-6PM CET",
          services: ["Logistics", "Legal Services", "EU Compliance"]
        },
        {
          city: "Amsterdam",
          country: "Netherlands",
          type: "Country Office",
          address: "Strawinskylaan 3127, 1077 ZX Amsterdam",
          phone: "+31 20 794 7000",
          email: "amsterdam@globalbusinessgateway.com",
          hours: "Mon-Fri 8AM-6PM CET", 
          services: ["All Services", "Benelux Region"]
        }
      ]
    },
    {
      region: "Middle East & Africa",
      offices: [
        {
          city: "Dubai",
          country: "UAE",
          type: "Regional Hub",
          address: "Dubai International Financial Centre, Gate Village 10, Level 3",
          phone: "+971 4 375 2222",
          email: "dubai@globalbusinessgateway.com",
          hours: "Sun-Thu 8AM-7PM GST",
          services: ["All Services", "MEA Coordination", "Islamic Finance"]
        },
        {
          city: "Riyadh",
          country: "Saudi Arabia", 
          type: "Country Office",
          address: "King Fahd Road, Al Olaya District, Riyadh 12313",
          phone: "+966 11 234 5678",
          email: "riyadh@globalbusinessgateway.com",
          hours: "Sun-Thu 8AM-6PM AST",
          services: ["Logistics", "Real Estate", "Vision 2030 Advisory"]
        }
      ]
    },
    {
      region: "Asia-Pacific", 
      offices: [
        {
          city: "Singapore",
          country: "Singapore",
          type: "Regional Hub",
          address: "One Raffles Quay, Level 18, South Tower, Singapore 048583",
          phone: "+65 6534 4720",
          email: "singapore@globalbusinessgateway.com",
          hours: "Mon-Fri 8AM-7PM SGT",
          services: ["All Services", "ASEAN Coordination", "Trade Finance"]
        },
        {
          city: "Hong Kong",
          country: "Hong Kong SAR",
          type: "Country Office", 
          address: "International Finance Centre, Tower 2, Level 45, Hong Kong",
          phone: "+852 2234 5678",
          email: "hongkong@globalbusinessgateway.com",
          hours: "Mon-Fri 8AM-7PM HKT",
          services: ["All Services", "Greater China Gateway"]
        }
      ]
    }
  ];

  const globalStats = [
    { label: "Office Locations", value: "25", icon: Building },
    { label: "Countries", value: "15", icon: Globe },
    { label: "Time Zones", value: "12", icon: Clock },
    { label: "Local Staff", value: "200+", icon: Users }
  ];

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="text-center mb-12">
        <div className="flex justify-center mb-6">
          <div className="w-20 h-20 bg-accent/10 rounded-full flex items-center justify-center">
            <MapPin className="h-10 w-10 text-accent" />
          </div>
        </div>
        <h1 className="text-4xl font-bold text-foreground mb-4" data-testid="text-offices-title">
          Our Global Offices
        </h1>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto" data-testid="text-offices-description">
          Connect with our local teams around the world. Our strategically located offices ensure 
          personalized support and deep market expertise for your global business needs.
        </p>
      </div>

      {/* Global Stats */}
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
        {globalStats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <Card key={index} className="text-center" data-testid={`card-global-stat-${index}`}>
              <CardContent className="pt-6">
                <Icon className="h-12 w-12 text-primary mx-auto mb-4" />
                <div className="text-3xl font-bold text-foreground mb-2">{stat.value}</div>
                <div className="text-muted-foreground">{stat.label}</div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Regional Offices */}
      <div className="space-y-12">
        {regions.map((region, regionIndex) => (
          <div key={regionIndex}>
            <h2 className="text-2xl font-bold text-foreground mb-8 text-center" data-testid={`text-region-${regionIndex}`}>
              {region.region}
            </h2>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {region.offices.map((office, officeIndex) => (
                <Card 
                  key={officeIndex} 
                  className={`hover:shadow-lg transition-shadow ${office.isHeadquarters ? 'ring-2 ring-primary' : ''}`}
                  data-testid={`card-office-${regionIndex}-${officeIndex}`}
                >
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="flex items-center">
                          <MapPin className="mr-2 h-5 w-5 text-primary" />
                          {office.city}
                        </CardTitle>
                        <p className="text-muted-foreground">{office.country}</p>
                      </div>
                      {office.isHeadquarters && (
                        <div className="bg-primary/10 text-primary px-2 py-1 rounded text-xs font-medium">
                          HQ
                        </div>
                      )}
                    </div>
                    <div className="text-sm font-medium text-accent">{office.type}</div>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* Address */}
                    <div className="flex items-start space-x-2">
                      <Building className="h-4 w-4 text-muted-foreground mt-1 flex-shrink-0" />
                      <p className="text-sm text-muted-foreground">{office.address}</p>
                    </div>

                    {/* Phone */}
                    <div className="flex items-center space-x-2">
                      <Phone className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                      <a 
                        href={`tel:${office.phone}`} 
                        className="text-sm text-primary hover:text-primary/80"
                        data-testid={`phone-${regionIndex}-${officeIndex}`}
                      >
                        {office.phone}
                      </a>
                    </div>

                    {/* Email */}
                    <div className="flex items-center space-x-2">
                      <Mail className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                      <a 
                        href={`mailto:${office.email}`} 
                        className="text-sm text-primary hover:text-primary/80"
                        data-testid={`email-${regionIndex}-${officeIndex}`}
                      >
                        {office.email}
                      </a>
                    </div>

                    {/* Hours */}
                    <div className="flex items-center space-x-2">
                      <Clock className="h-4 w-4 text-muted-foreground flex-shrink-0" />
                      <p className="text-sm text-muted-foreground">{office.hours}</p>
                    </div>

                    {/* Services */}
                    <div>
                      <h4 className="text-sm font-medium text-foreground mb-2">Services:</h4>
                      <div className="flex flex-wrap gap-1">
                        {office.services.map((service, serviceIndex) => (
                          <span 
                            key={serviceIndex}
                            className="text-xs bg-muted text-muted-foreground px-2 py-1 rounded"
                            data-testid={`service-${regionIndex}-${officeIndex}-${serviceIndex}`}
                          >
                            {service}
                          </span>
                        ))}
                      </div>
                    </div>

                    {/* Contact Button */}
                    <Button 
                      className="w-full" 
                      variant="outline"
                      data-testid={`button-contact-${regionIndex}-${officeIndex}`}
                    >
                      Contact This Office
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* 24/7 Support */}
      <Card className="mt-16 bg-primary text-primary-foreground" data-testid="card-24-7-support">
        <CardContent className="py-12 text-center">
          <Phone className="h-16 w-16 mx-auto mb-6 text-blue-100" />
          <h2 className="text-3xl font-bold mb-4">24/7 Global Support</h2>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            No matter where you are in the world, our follow-the-sun support model ensures 
            there's always a team member ready to assist you.
          </p>
          <div className="grid sm:grid-cols-2 gap-6 max-w-lg mx-auto">
            <div>
              <h3 className="font-semibold mb-2">Emergency Hotline</h3>
              <p className="text-2xl font-bold text-blue-100">+1 (800) URGENT-1</p>
            </div>
            <div>
              <h3 className="font-semibold mb-2">General Support</h3>
              <p className="text-2xl font-bold text-blue-100">+1 (800) GLOBAL-1</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Regional Time Zones */}
      <Card className="mt-8" data-testid="card-time-zones">
        <CardHeader>
          <CardTitle className="text-center flex items-center justify-center">
            <Clock className="mr-2 h-5 w-5" />
            Regional Coverage Hours
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 text-center">
            <div data-testid="timezone-americas">
              <h4 className="font-semibold text-foreground mb-1">Americas</h4>
              <p className="text-sm text-muted-foreground">EST/PST Coverage</p>
              <p className="text-xs text-accent">6 AM - 10 PM Local</p>
            </div>
            <div data-testid="timezone-europe">
              <h4 className="font-semibold text-foreground mb-1">Europe/Africa</h4>
              <p className="text-sm text-muted-foreground">CET/GMT Coverage</p>
              <p className="text-xs text-accent">8 AM - 8 PM Local</p>
            </div>
            <div data-testid="timezone-middle-east">
              <h4 className="font-semibold text-foreground mb-1">Middle East</h4>
              <p className="text-sm text-muted-foreground">GST Coverage</p>
              <p className="text-xs text-accent">8 AM - 7 PM Local</p>
            </div>
            <div data-testid="timezone-asia-pacific">
              <h4 className="font-semibold text-foreground mb-1">Asia-Pacific</h4>
              <p className="text-sm text-muted-foreground">SGT/JST Coverage</p>
              <p className="text-xs text-accent">8 AM - 7 PM Local</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
