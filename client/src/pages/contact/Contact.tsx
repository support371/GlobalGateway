import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Mail, Phone, MessageSquare, MapPin, Clock, Globe, ArrowRight, HeadphonesIcon } from "lucide-react";

export default function Contact() {
  const contactMethods = [
    {
      title: "General Inquiries",
      description: "For general questions about our services and how we can help your business",
      icon: Mail,
      action: "Contact Form",
      link: "/contact/general"
    },
    {
      title: "Customer Support",
      description: "Get help with existing services, track shipments, or resolve any issues",
      icon: HeadphonesIcon,
      action: "Get Support",
      link: "/contact/support"
    },
    {
      title: "Office Locations",
      description: "Find contact information for our offices worldwide and local representatives",
      icon: MapPin,
      action: "Find Offices",
      link: "/contact/offices"
    }
  ];

  const quickContact = [
    {
      method: "Phone",
      value: "+1 (800) GLOBAL-1",
      description: "24/7 Support Hotline",
      icon: Phone
    },
    {
      method: "Email",
      value: "info@globalbusinessgateway.com",
      description: "General inquiries",
      icon: Mail
    },
    {
      method: "Live Chat",
      value: "Available 24/7",
      description: "Instant support",
      icon: MessageSquare
    }
  ];

  const businessHours = [
    { region: "Americas", hours: "Mon-Fri 6AM-10PM EST", timezone: "EST/PST" },
    { region: "Europe", hours: "Mon-Fri 8AM-8PM CET", timezone: "CET/GMT" },
    { region: "Asia-Pacific", hours: "Mon-Fri 8AM-8PM JST", timezone: "JST/AEST" },
    { region: "Middle East", hours: "Sun-Thu 8AM-6PM GST", timezone: "GST" }
  ];

  const serviceAreas = [
    {
      service: "Logistics",
      description: "Shipping inquiries, tracking, customs, and freight services",
      contact: "logistics@globalbusinessgateway.com"
    },
    {
      service: "Real Estate",
      description: "Property searches, lease requests, and commercial space inquiries",
      contact: "realestate@globalbusinessgateway.com"
    },
    {
      service: "Legal Services",
      description: "Legal consultation, compliance, contracts, and regulatory support",
      contact: "legal@globalbusinessgateway.com"
    }
  ];

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="text-center mb-16">
        <div className="flex justify-center mb-6">
          <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center">
            <Mail className="h-10 w-10 text-primary" />
          </div>
        </div>
        <h1 className="text-4xl lg:text-5xl font-bold text-foreground mb-6" data-testid="text-contact-title">
          Contact Us
        </h1>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto mb-8" data-testid="text-contact-description">
          Get in touch with our global team. We're here to help you with all your international business needs, 
          from logistics and real estate to legal support and compliance.
        </p>
        <Link href="/contact/general">
          <Button size="lg" data-testid="button-contact-now">
            <Mail className="mr-2 h-5 w-5" />
            Contact Us Now
          </Button>
        </Link>
      </div>

      {/* Contact Methods */}
      <div className="grid md:grid-cols-3 gap-8 mb-16">
        {contactMethods.map((method, index) => {
          const Icon = method.icon;
          return (
            <Card key={index} className="hover:shadow-lg transition-shadow text-center" data-testid={`card-contact-method-${index}`}>
              <CardHeader>
                <Icon className="h-12 w-12 text-primary mx-auto mb-4" />
                <CardTitle>{method.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-6">{method.description}</p>
                <Link href={method.link}>
                  <Button className="w-full" data-testid={`button-${method.action.toLowerCase().replace(/\s+/g, '-')}`}>
                    {method.action}
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </Link>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Quick Contact */}
      <Card className="mb-16" data-testid="card-quick-contact">
        <CardHeader>
          <CardTitle className="text-center text-2xl">Quick Contact Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-8 text-center">
            {quickContact.map((contact, index) => {
              const Icon = contact.icon;
              return (
                <div key={index} data-testid={`quick-contact-${index}`}>
                  <Icon className="h-8 w-8 text-primary mx-auto mb-3" />
                  <h4 className="font-semibold text-foreground mb-1">{contact.method}</h4>
                  <p className="text-lg text-primary font-medium mb-1">{contact.value}</p>
                  <p className="text-sm text-muted-foreground">{contact.description}</p>
                </div>
              );
            })}
          </div>
          
          <div className="mt-8 pt-8 border-t border-border text-center">
            <p className="text-muted-foreground mb-4">
              For urgent matters, please call our 24/7 hotline or use live chat for immediate assistance.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button variant="outline" data-testid="button-live-chat">
                <MessageSquare className="mr-2 h-4 w-4" />
                Start Live Chat
              </Button>
              <Button variant="outline" data-testid="button-call-now">
                <Phone className="mr-2 h-4 w-4" />
                Call Now
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Business Hours */}
      <Card className="mb-16" data-testid="card-business-hours">
        <CardHeader>
          <CardTitle className="flex items-center justify-center">
            <Clock className="mr-2 h-5 w-5" />
            Global Business Hours
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            {businessHours.map((hours, index) => (
              <div key={index} className="text-center" data-testid={`business-hours-${index}`}>
                <Globe className="h-8 w-8 text-accent mx-auto mb-3" />
                <h4 className="font-semibold text-foreground mb-1">{hours.region}</h4>
                <p className="text-sm text-muted-foreground mb-1">{hours.hours}</p>
                <p className="text-xs text-accent">{hours.timezone}</p>
              </div>
            ))}
          </div>
          <div className="mt-8 text-center">
            <p className="text-muted-foreground">
              Our support team operates across multiple time zones to ensure you always have access to assistance when you need it.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Service-Specific Contact */}
      <Card className="mb-16" data-testid="card-service-contact">
        <CardHeader>
          <CardTitle className="text-center">Service-Specific Contact</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-3 gap-8">
            {serviceAreas.map((area, index) => (
              <div key={index} className="text-center" data-testid={`service-area-${index}`}>
                <h4 className="font-semibold text-foreground mb-2">{area.service}</h4>
                <p className="text-sm text-muted-foreground mb-3">{area.description}</p>
                <p className="text-sm text-primary font-medium">{area.contact}</p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Emergency Contact */}
      <Card className="mb-16 border-destructive/20" data-testid="card-emergency-contact">
        <CardHeader>
          <CardTitle className="text-center text-destructive">Emergency Contact</CardTitle>
        </CardHeader>
        <CardContent className="text-center">
          <Phone className="h-12 w-12 text-destructive mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-foreground mb-2">24/7 Emergency Hotline</h3>
          <p className="text-2xl font-bold text-destructive mb-4">+1 (800) URGENT-1</p>
          <p className="text-muted-foreground">
            For urgent shipment issues, emergency legal matters, or critical business support needs.
            This line is monitored 24/7 for immediate response to time-sensitive situations.
          </p>
        </CardContent>
      </Card>

      {/* Social Media & Additional Resources */}
      <Card className="mb-16" data-testid="card-additional-resources">
        <CardHeader>
          <CardTitle className="text-center">Additional Resources</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="text-center">
              <h4 className="font-semibold text-foreground mb-4">Follow Us</h4>
              <div className="flex justify-center space-x-4 mb-4">
                <a href="#" className="text-muted-foreground hover:text-primary transition-colors" data-testid="link-linkedin">
                  <i className="fab fa-linkedin text-2xl"></i>
                </a>
                <a href="#" className="text-muted-foreground hover:text-primary transition-colors" data-testid="link-twitter">
                  <i className="fab fa-twitter text-2xl"></i>
                </a>
                <a href="#" className="text-muted-foreground hover:text-primary transition-colors" data-testid="link-facebook">
                  <i className="fab fa-facebook text-2xl"></i>
                </a>
              </div>
              <p className="text-sm text-muted-foreground">
                Stay updated with industry news, company updates, and business insights.
              </p>
            </div>
            
            <div className="text-center">
              <h4 className="font-semibold text-foreground mb-4">Self-Service Options</h4>
              <div className="space-y-2">
                <Link href="/logistics/faq" className="block text-primary hover:text-primary/80" data-testid="link-faq">
                  FAQ & Knowledge Base
                </Link>
                <Link href="/logistics/tracking" className="block text-primary hover:text-primary/80" data-testid="link-tracking">
                  Package Tracking
                </Link>
                <Link href="/auth/account-dashboard" className="block text-primary hover:text-primary/80" data-testid="link-account">
                  Account Dashboard
                </Link>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* CTA Section */}
      <div className="grid md:grid-cols-2 gap-8">
        <Card className="bg-primary text-primary-foreground" data-testid="card-cta-get-started">
          <CardContent className="py-8 text-center">
            <h3 className="text-2xl font-bold mb-4">Ready to Get Started?</h3>
            <p className="text-blue-100 mb-6">
              Join thousands of businesses using our platform for global expansion and growth.
            </p>
            <a href="/api/login">
              <Button size="lg" variant="secondary" data-testid="button-get-started">
                Get Started Today
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </a>
          </CardContent>
        </Card>

        <Card className="bg-accent text-accent-foreground" data-testid="card-cta-schedule-demo">
          <CardContent className="py-8 text-center">
            <h3 className="text-2xl font-bold mb-4">Schedule a Demo</h3>
            <p className="text-blue-100 mb-6">
              See how our integrated platform can transform your global business operations.
            </p>
            <Link href="/contact/general">
              <Button size="lg" variant="secondary" data-testid="button-schedule-demo">
                Schedule Demo
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
