import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useAuth } from "@/hooks/useAuth";
import NotFound from "@/pages/not-found";
import Landing from "@/pages/Landing";
import Home from "@/pages/Home";
import Layout from "@/components/Layout";

// Logistics pages
import LogisticsHome from "@/pages/logistics/LogisticsHome";
import ShippingCalculator from "@/pages/logistics/ShippingCalculator";
import BookShipping from "@/pages/logistics/BookShipping";
import Tracking from "@/pages/logistics/Tracking";
import FAQ from "@/pages/logistics/FAQ";
import USPSServices from "@/pages/logistics/USPSServices";

// Real Estate pages
import RealEstateHome from "@/pages/real-estate/RealEstateHome";
import Listings from "@/pages/real-estate/Listings";
import PropertyDetail from "@/pages/real-estate/PropertyDetail";
import LeaseRequest from "@/pages/real-estate/LeaseRequest";

// Legal Services pages
import LegalHome from "@/pages/legal-services/LegalHome";
import Contracts from "@/pages/legal-services/Contracts";
import Regulatory from "@/pages/legal-services/Regulatory";
import RiskInsurance from "@/pages/legal-services/RiskInsurance";
import BusinessSupport from "@/pages/legal-services/BusinessSupport";
import DigitalCompliance from "@/pages/legal-services/DigitalCompliance";
import RequestSupport from "@/pages/legal-services/RequestSupport";

// About pages
import About from "@/pages/about/About";
import VisionMission from "@/pages/about/VisionMission";
import GlobalFootprint from "@/pages/about/GlobalFootprint";
import Partners from "@/pages/about/Partners";

// Contact pages
import Contact from "@/pages/contact/Contact";
import ContactGeneral from "./pages/contact/General";
import ContactOffices from "./pages/contact/Offices";
import ContactSupport from "./pages/contact/Support";

// Payment pages
import PaymentMethods from "./pages/payments/PaymentMethods";
import PaymentHistory from "./pages/payments/PaymentHistory";

// Dashboard pages
import UserDashboard from "@/pages/dashboard/UserDashboard";
import AdminDashboard from "@/pages/dashboard/AdminDashboard";

function Router() {
  const { isAuthenticated, isLoading } = useAuth();

  return (
    <Switch>
      {isLoading || !isAuthenticated ? (
        <>
          <Route path="/" component={Landing} />
          {/* Public routes for non-authenticated users */}
          <Route path="/logistics" component={LogisticsHome} />
          <Route path="/logistics/usps-services" component={USPSServices} />
          <Route path="/logistics/shipping-calculator" component={ShippingCalculator} />
          <Route path="/logistics/tracking" component={Tracking} />
          <Route path="/logistics/faq" component={FAQ} />
          <Route path="/real-estate" component={RealEstateHome} />
          <Route path="/real-estate/listings" component={Listings} />
          <Route path="/real-estate/listings/:category" component={Listings} />
          <Route path="/real-estate/property/:id" component={PropertyDetail} />
          <Route path="/legal-services" component={LegalHome} />
          <Route path="/legal-services/contracts" component={Contracts} />
          <Route path="/legal-services/regulatory" component={Regulatory} />
          <Route path="/legal-services/risk-insurance" component={RiskInsurance} />
          <Route path="/legal-services/business-support" component={BusinessSupport} />
          <Route path="/legal-services/digital-compliance" component={DigitalCompliance} />
          <Route path="/about" component={About} />
          <Route path="/about/vision-mission" component={VisionMission} />
          <Route path="/about/global-footprint" component={GlobalFootprint} />
          <Route path="/about/partners" component={Partners} />
          <Route path="/contact" component={Contact} />
          <Route path="/contact/general" component={ContactGeneral} />
          <Route path="/contact/support" component={ContactSupport} />
          <Route path="/contact/offices" component={ContactOffices} />
        </>
      ) : (
        <Layout>
          <Route path="/" component={Home} />
          {/* Authenticated routes */}
          <Route path="/logistics" component={LogisticsHome} />
          <Route path="/logistics/usps-services" component={USPSServices} />
          <Route path="/logistics/shipping-calculator" component={ShippingCalculator} />
          <Route path="/logistics/book-shipping" component={BookShipping} />
          <Route path="/logistics/tracking" component={Tracking} />
          <Route path="/logistics/faq" component={FAQ} />
          <Route path="/real-estate" component={RealEstateHome} />
          <Route path="/real-estate/listings" component={Listings} />
          <Route path="/real-estate/listings/:category" component={Listings} />
          <Route path="/real-estate/property/:id" component={PropertyDetail} />
          <Route path="/real-estate/lease-request" component={LeaseRequest} />
          <Route path="/legal-services" component={LegalHome} />
          <Route path="/legal-services/contracts" component={Contracts} />
          <Route path="/legal-services/regulatory" component={Regulatory} />
          <Route path="/legal-services/risk-insurance" component={RiskInsurance} />
          <Route path="/legal-services/business-support" component={BusinessSupport} />
          <Route path="/legal-services/digital-compliance" component={DigitalCompliance} />
          <Route path="/legal-services/request-support" component={RequestSupport} />
          <Route path="/about" component={About} />
          <Route path="/about/vision-mission" component={VisionMission} />
          <Route path="/about/global-footprint" component={GlobalFootprint} />
          <Route path="/about/partners" component={Partners} />
          <Route path="/contact" component={Contact} />
          <Route path="/contact/general" component={ContactGeneral} />
          <Route path="/contact/support" component={ContactSupport} />
          <Route path="/contact/offices" component={ContactOffices} />
          <Route path="/payments" component={PaymentMethods} />
          <Route path="/payments/history" component={PaymentHistory} />
          <Route path="/auth/account-dashboard" component={UserDashboard} />
          <Route path="/admin/dashboard" component={AdminDashboard} />
        </Layout>
      )}
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;