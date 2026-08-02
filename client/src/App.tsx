import { Switch, Route } from "wouter";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import { Toaster } from "@/components/ui/toaster";
import Layout from "./components/Layout";
import NotFound from "./pages/not-found";

import Landing from "./pages/Landing";
import Home from "./pages/Home";

import LogisticsHome from "./pages/logistics/LogisticsHome";
import ShippingCalculator from "./pages/logistics/ShippingCalculator";
import BookShipping from "./pages/logistics/BookShipping";
import Tracking from "./pages/logistics/Tracking";
import LogisticsFAQ from "./pages/logistics/FAQ";
import USPSServices from "./pages/logistics/USPSServices";
import WarehouseForwarding from "./pages/logistics/WarehouseForwarding";

import RealEstateHome from "./pages/real-estate/RealEstateHome";
import Listings from "./pages/real-estate/Listings";
import PropertyDetail from "./pages/real-estate/PropertyDetail";
import LeaseRequest from "./pages/real-estate/LeaseRequest";

import LegalHome from "./pages/legal-services/LegalHome";
import Contracts from "./pages/legal-services/Contracts";
import Regulatory from "./pages/legal-services/Regulatory";
import DigitalCompliance from "./pages/legal-services/DigitalCompliance";
import BusinessSupport from "./pages/legal-services/BusinessSupport";
import RiskInsurance from "./pages/legal-services/RiskInsurance";
import RequestSupport from "./pages/legal-services/RequestSupport";

import About from "./pages/about/About";
import VisionMission from "./pages/about/VisionMission";
import GlobalFootprint from "./pages/about/GlobalFootprint";
import Partners from "./pages/about/Partners";

import Contact from "./pages/contact/Contact";
import General from "./pages/contact/General";
import Offices from "./pages/contact/Offices";
import Support from "./pages/contact/Support";

import PaymentMethods from "./pages/payments/PaymentMethods";
import PaymentHistory from "./pages/payments/PaymentHistory";

import PrivacyPolicy from "./pages/legal/PrivacyPolicy";
import TermsOfService from "./pages/legal/TermsOfService";

import UserDashboard from "./pages/dashboard/UserDashboard";
import AdminDashboard from "./pages/dashboard/AdminDashboard";

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Layout>
        <Switch>
          <Route path="/" component={Landing} />
          <Route path="/home" component={Home} />

          <Route path="/logistics" component={LogisticsHome} />
          <Route path="/logistics/shipping-calculator" component={ShippingCalculator} />
          <Route path="/logistics/book-shipping" component={BookShipping} />
          <Route path="/logistics/warehouse-forwarding" component={WarehouseForwarding} />
          <Route path="/logistics/tracking" component={Tracking} />
          <Route path="/logistics/faq" component={LogisticsFAQ} />
          <Route path="/logistics/usps-services" component={USPSServices} />

          <Route path="/real-estate" component={RealEstateHome} />
          <Route path="/real-estate/listings" component={Listings} />
          <Route path="/real-estate/property/:id" component={PropertyDetail} />
          <Route path="/real-estate/lease-request" component={LeaseRequest} />

          <Route path="/legal-services" component={LegalHome} />
          <Route path="/legal-services/contracts" component={Contracts} />
          <Route path="/legal-services/regulatory" component={Regulatory} />
          <Route path="/legal-services/digital-compliance" component={DigitalCompliance} />
          <Route path="/legal-services/business-support" component={BusinessSupport} />
          <Route path="/legal-services/risk-insurance" component={RiskInsurance} />
          <Route path="/legal-services/request-support" component={RequestSupport} />

          <Route path="/about" component={About} />
          <Route path="/about/vision-mission" component={VisionMission} />
          <Route path="/about/global-footprint" component={GlobalFootprint} />
          <Route path="/about/partners" component={Partners} />

          <Route path="/contact" component={Contact} />
          <Route path="/contact/general" component={General} />
          <Route path="/contact/offices" component={Offices} />
          <Route path="/contact/support" component={Support} />

          <Route path="/payments" component={PaymentMethods} />
          <Route path="/payments/history" component={PaymentHistory} />

          <Route path="/legal/privacy-policy" component={PrivacyPolicy} />
          <Route path="/legal/terms-of-service" component={TermsOfService} />

          <Route path="/auth/account-dashboard" component={UserDashboard} />
          <Route path="/admin/dashboard" component={AdminDashboard} />

          <Route component={NotFound} />
        </Switch>
      </Layout>
      <Toaster />
    </QueryClientProvider>
  );
}
