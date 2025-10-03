import { Link } from "wouter";
import { Globe } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-card border-t border-border">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Company Info */}
          <div className="lg:col-span-2">
            <div className="flex items-center space-x-2 mb-6">
              <div className="w-10 h-10 bg-primary rounded-lg flex items-center justify-center">
                <Globe className="text-primary-foreground h-6 w-6" />
              </div>
              <div className="flex flex-col">
                <span className="font-bold text-lg text-foreground">Global Business Gateway</span>
                <span className="text-xs text-muted-foreground">Logistics • Real Estate • Legal</span>
              </div>
            </div>
            <p className="text-muted-foreground mb-6 leading-relaxed">
              Your trusted partner for global business expansion. We provide integrated logistics, 
              commercial real estate, and legal services to help you scale internationally.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors" data-testid="link-linkedin">
                <i className="fab fa-linkedin text-xl"></i>
              </a>
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors" data-testid="link-twitter">
                <i className="fab fa-twitter text-xl"></i>
              </a>
              <a href="#" className="text-muted-foreground hover:text-primary transition-colors" data-testid="link-facebook">
                <i className="fab fa-facebook text-xl"></i>
              </a>
            </div>
          </div>

          {/* Services */}
          <div>
            <h3 className="font-semibold text-foreground mb-4">Services</h3>
            <ul className="space-y-2">
              <li><Link href="/logistics" className="text-muted-foreground hover:text-primary transition-colors" data-testid="footer-link-logistics">Global Logistics</Link></li>
              <li><Link href="/real-estate" className="text-muted-foreground hover:text-primary transition-colors" data-testid="footer-link-real-estate">Real Estate</Link></li>
              <li><Link href="/legal-services" className="text-muted-foreground hover:text-primary transition-colors" data-testid="footer-link-legal">Legal Services</Link></li>
              <li><Link href="/logistics/shipping-calculator" className="text-muted-foreground hover:text-primary transition-colors" data-testid="footer-link-calculator">Shipping Calculator</Link></li>
            </ul>
          </div>

          {/* Company */}
          <div>
            <h3 className="font-semibold text-foreground mb-4">Company</h3>
            <ul className="space-y-2">
              <li><Link href="/about" className="text-muted-foreground hover:text-primary transition-colors" data-testid="footer-link-about">About Us</Link></li>
              <li><Link href="/about/global-footprint" className="text-muted-foreground hover:text-primary transition-colors" data-testid="footer-link-footprint">Global Footprint</Link></li>
              <li><Link href="/about/partners" className="text-muted-foreground hover:text-primary transition-colors" data-testid="footer-link-partners">Partners</Link></li>
              <li><Link href="/contact" className="text-muted-foreground hover:text-primary transition-colors" data-testid="footer-link-contact">Contact</Link></li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="font-semibold text-foreground mb-4">Support</h3>
            <ul className="space-y-2">
              <li><Link href="/contact/support" className="text-muted-foreground hover:text-primary transition-colors" data-testid="footer-link-help">Help Center</Link></li>
              <li><Link href="/logistics/faq" className="text-muted-foreground hover:text-primary transition-colors" data-testid="footer-link-faq">FAQ</Link></li>
              <li><Link href="/auth/account-dashboard" className="text-muted-foreground hover:text-primary transition-colors" data-testid="footer-link-dashboard">Account Dashboard</Link></li>
              <li><Link href="/legal/privacy-policy" className="text-muted-foreground hover:text-primary transition-colors" data-testid="footer-link-privacy">Privacy Policy</Link></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-border mt-12 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-muted-foreground mb-4 md:mb-0">
            © 2024 Global Business Gateway. All rights reserved.
          </p>
          <div className="flex space-x-6">
            <Link href="/legal/terms-of-service" className="text-muted-foreground hover:text-primary transition-colors text-sm" data-testid="footer-link-terms">Terms of Service</Link>
            <Link href="/legal/privacy-policy" className="text-muted-foreground hover:text-primary transition-colors text-sm" data-testid="footer-link-privacy-policy">Privacy Policy</Link>
            <Link href="/legal-services/digital-compliance" className="text-muted-foreground hover:text-primary transition-colors text-sm" data-testid="footer-link-gdpr">GDPR Compliance</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
