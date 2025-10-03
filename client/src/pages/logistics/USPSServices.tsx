
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  Package, 
  Globe, 
  Clock, 
  Shield, 
  FileText, 
  Mail, 
  Briefcase,
  TrendingUp,
  CheckCircle,
  MapPin,
  Users
} from "lucide-react";
import { Link } from "wouter";

export default function USPSServices() {
  const services = [
    {
      icon: Package,
      title: "Domestic & International Shipping",
      description: "Ship packages anywhere in the world with competitive rates and reliable delivery",
      features: ["200+ countries", "Real-time tracking", "Customs support"]
    },
    {
      icon: Clock,
      title: "Express Priority & Overnight Mail",
      description: "Fast delivery options for time-sensitive shipments and urgent documents",
      features: ["Next-day delivery", "Same-day options", "Guaranteed arrival"]
    },
    {
      icon: MapPin,
      title: "Tracking & Delivery Confirmation",
      description: "Monitor your packages in real-time with comprehensive tracking solutions",
      features: ["SMS alerts", "Email updates", "Proof of delivery"]
    },
    {
      icon: Shield,
      title: "Package Insurance & Certified Mail",
      description: "Protect your valuable shipments with comprehensive insurance coverage",
      features: ["Up to $10,000 coverage", "Signature confirmation", "Legal proof of mailing"]
    },
    {
      icon: Mail,
      title: "P.O. Boxes & Forwarding Services",
      description: "Secure mailbox solutions and mail forwarding for remote workers and travelers",
      features: ["Virtual mailbox", "Auto-forwarding", "Package consolidation"]
    },
    {
      icon: Package,
      title: "Flat-Rate Shipping Options",
      description: "Predictable pricing with flat-rate boxes and envelopes for all your needs",
      features: ["No weight limits", "Fixed pricing", "Multiple sizes"]
    },
    {
      icon: Briefcase,
      title: "Business Mailing Solutions",
      description: "Comprehensive logistics support for businesses of all sizes",
      features: ["Bulk mail discounts", "Return labels", "API integration"]
    }
  ];

  const globalBenefits = [
    "Affordable Global Rates - Competitive pricing for international shipping",
    "Secure & Reliable - Industry-leading security and delivery success rates",
    "Integrated Health-Wealth-Wellness - Part of our holistic ecosystem",
    "24/7 Support - Round-the-clock customer service for all your needs"
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-background to-secondary/20">
      {/* Header Section */}
      <div className="relative bg-gradient-to-r from-blue-900 via-red-800 to-blue-900 text-white">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <Badge className="mb-4 bg-green-600 hover:bg-green-700">
              Living Life @300%
            </Badge>
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              Holistic Real Estate Logistics
            </h1>
            <h2 className="text-2xl md:text-3xl font-semibold mb-6">
              Global Mailing & Shipping Services
            </h2>
            <p className="text-lg md:text-xl text-blue-100 mb-8">
              Part of our Health–Wealth–Wellness Solutions, empowering communities to live life @300%
            </p>
            <div className="flex flex-wrap gap-4 justify-center">
              <Button size="lg" className="bg-white text-blue-900 hover:bg-blue-50">
                <Package className="mr-2 h-5 w-5" />
                Ship a Package
              </Button>
              <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
                <MapPin className="mr-2 h-5 w-5" />
                Track Shipment
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Services Grid */}
        <div className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-foreground mb-4">
              Comprehensive Mailing & Shipping Solutions
            </h2>
            <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
              Inspired by the trusted USPS model, enhanced with our holistic approach to serving your complete logistics needs
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {services.map((service, index) => {
              const Icon = service.icon;
              return (
                <Card key={index} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center mb-4">
                      <Icon className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                    </div>
                    <CardTitle className="text-xl">{service.title}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground mb-4">{service.description}</p>
                    <div className="space-y-2">
                      {service.features.map((feature, idx) => (
                        <div key={idx} className="flex items-center text-sm">
                          <CheckCircle className="h-4 w-4 text-green-600 mr-2 flex-shrink-0" />
                          <span>{feature}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>

        {/* Global Freelancer & Agent Services */}
        <div className="mb-16">
          <Card className="bg-gradient-to-br from-green-50 to-blue-50 dark:from-green-950 dark:to-blue-950 border-2 border-green-200 dark:border-green-800">
            <CardHeader>
              <div className="flex items-center space-x-3 mb-2">
                <Globe className="h-8 w-8 text-green-600" />
                <CardTitle className="text-2xl">Global Freelancer & Agent Services</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-lg mb-6">
                Empowering freelancers and virtual assistants worldwide to send/receive documents, contracts, and wellness-related products with ease and reliability.
              </p>
              
              <div className="grid md:grid-cols-2 gap-4 mb-6">
                {globalBenefits.map((benefit, index) => (
                  <div key={index} className="flex items-start">
                    <TrendingUp className="h-5 w-5 text-green-600 mr-3 mt-1 flex-shrink-0" />
                    <div>
                      <p className="font-semibold text-foreground">
                        {benefit.split(' - ')[0]}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {benefit.split(' - ')[1]}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="bg-white dark:bg-gray-900 p-6 rounded-lg">
                <h4 className="font-semibold text-lg mb-3">Perfect For:</h4>
                <div className="grid sm:grid-cols-2 gap-3">
                  <div className="flex items-center">
                    <FileText className="h-4 w-4 text-blue-600 mr-2" />
                    <span className="text-sm">Contract & Document Shipping</span>
                  </div>
                  <div className="flex items-center">
                    <Package className="h-4 w-4 text-blue-600 mr-2" />
                    <span className="text-sm">Wellness Products Distribution</span>
                  </div>
                  <div className="flex items-center">
                    <Mail className="h-4 w-4 text-blue-600 mr-2" />
                    <span className="text-sm">International Correspondence</span>
                  </div>
                  <div className="flex items-center">
                    <Briefcase className="h-4 w-4 text-blue-600 mr-2" />
                    <span className="text-sm">Business Materials</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Career Opportunities Section */}
        <div className="mb-16">
          <Card className="bg-gradient-to-r from-blue-900 to-red-800 text-white">
            <CardHeader>
              <div className="flex items-center space-x-3 mb-2">
                <Users className="h-8 w-8" />
                <CardTitle className="text-2xl">Build a Career with Holistic Real Estate Logistics</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-lg text-blue-100 mb-6">
                Join our growing health–wealth–wellness ecosystem as a freelance agent, logistics partner, or virtual assistant. 
                Help businesses and individuals worldwide achieve success while living life @300%.
              </p>
              
              <div className="grid md:grid-cols-3 gap-4 mb-8">
                <div className="bg-white/10 backdrop-blur p-4 rounded-lg">
                  <h4 className="font-semibold mb-2">Logistics Partners</h4>
                  <p className="text-sm text-blue-100">Join our network of trusted delivery and shipping partners</p>
                </div>
                <div className="bg-white/10 backdrop-blur p-4 rounded-lg">
                  <h4 className="font-semibold mb-2">Virtual Assistants</h4>
                  <p className="text-sm text-blue-100">Support clients with shipping, tracking, and coordination</p>
                </div>
                <div className="bg-white/10 backdrop-blur p-4 rounded-lg">
                  <h4 className="font-semibold mb-2">Freelance Agents</h4>
                  <p className="text-sm text-blue-100">Represent our services in your local community</p>
                </div>
              </div>

              <div className="flex flex-wrap gap-4">
                <Button size="lg" className="bg-white text-blue-900 hover:bg-blue-50">
                  <Briefcase className="mr-2 h-5 w-5" />
                  Apply Now
                </Button>
                <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
                  Learn More
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Call-to-Action Footer */}
        <div className="bg-gradient-to-r from-green-600 to-blue-600 text-white rounded-2xl p-8 md:p-12 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-4">
            Ship Smarter. Work Smarter. Live Smarter — @300%
          </h2>
          <p className="text-lg md:text-xl text-green-100 mb-8 max-w-2xl mx-auto">
            Experience the future of logistics integrated with health, wealth, and wellness solutions
          </p>

          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <Card className="bg-white/10 backdrop-blur border-white/20">
              <CardContent className="pt-6 text-center">
                <Package className="h-8 w-8 mx-auto mb-3" />
                <h3 className="font-semibold mb-2">Ship a Package</h3>
                <Button variant="ghost" className="text-white hover:bg-white/20" asChild>
                  <Link href="/logistics/book-shipping">Get Started →</Link>
                </Button>
              </CardContent>
            </Card>

            <Card className="bg-white/10 backdrop-blur border-white/20">
              <CardContent className="pt-6 text-center">
                <MapPin className="h-8 w-8 mx-auto mb-3" />
                <h3 className="font-semibold mb-2">Track Shipment</h3>
                <Button variant="ghost" className="text-white hover:bg-white/20" asChild>
                  <Link href="/logistics/tracking">Track Now →</Link>
                </Button>
              </CardContent>
            </Card>

            <Card className="bg-white/10 backdrop-blur border-white/20">
              <CardContent className="pt-6 text-center">
                <Users className="h-8 w-8 mx-auto mb-3" />
                <h3 className="font-semibold mb-2">Start a Career</h3>
                <Button variant="ghost" className="text-white hover:bg-white/20">
                  Apply Today →
                </Button>
              </CardContent>
            </Card>
          </div>

          <div className="border-t border-white/20 pt-6">
            <p className="text-sm text-green-100 mb-2">Contact Us</p>
            <div className="flex flex-wrap justify-center gap-4 text-sm">
              <span>📧 logistics@holisticrealestate.com</span>
              <span>📞 1-800-HOLISTIC</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
