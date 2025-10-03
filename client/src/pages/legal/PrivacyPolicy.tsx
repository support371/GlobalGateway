import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Shield, Lock, Eye, FileText, UserCheck, Globe } from "lucide-react";

export default function PrivacyPolicy() {
  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="text-center mb-12">
        <div className="flex justify-center mb-6">
          <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center">
            <Shield className="h-10 w-10 text-primary" />
          </div>
        </div>
        <h1 className="text-4xl font-bold text-foreground mb-4">Privacy Policy</h1>
        <p className="text-muted-foreground max-w-3xl mx-auto">
          Last Updated: January 2024
        </p>
      </div>

      {/* Introduction */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center">
            <FileText className="h-5 w-5 mr-2" />
            Introduction
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-muted-foreground">
          <p>
            Global Business Gateway ("we", "our", or "us") is committed to protecting your privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our platform and services.
          </p>
          <p>
            We comply with GDPR, CCPA, and other applicable data protection regulations across all jurisdictions where we operate.
          </p>
        </CardContent>
      </Card>

      {/* Information We Collect */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Eye className="h-5 w-5 mr-2" />
            Information We Collect
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <h3 className="font-semibold text-foreground mb-2">Personal Information</h3>
            <ul className="list-disc list-inside text-muted-foreground space-y-1 ml-4">
              <li>Name, email address, and contact details</li>
              <li>Business information and company details</li>
              <li>Payment and billing information</li>
              <li>Shipping and delivery addresses</li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold text-foreground mb-2">Usage Information</h3>
            <ul className="list-disc list-inside text-muted-foreground space-y-1 ml-4">
              <li>IP address and device information</li>
              <li>Browser type and version</li>
              <li>Pages visited and time spent on platform</li>
              <li>Referral sources and navigation patterns</li>
            </ul>
          </div>
        </CardContent>
      </Card>

      {/* How We Use Your Information */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Lock className="h-5 w-5 mr-2" />
            How We Use Your Information
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4">
            <li>To provide and maintain our services</li>
            <li>To process your transactions and shipments</li>
            <li>To communicate with you about your account and services</li>
            <li>To improve our platform and user experience</li>
            <li>To comply with legal obligations and prevent fraud</li>
            <li>To send marketing communications (with your consent)</li>
          </ul>
        </CardContent>
      </Card>

      {/* Data Protection */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Shield className="h-5 w-5 mr-2" />
            Data Protection & Security
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-muted-foreground">
          <p>
            We implement industry-standard security measures to protect your personal information, including:
          </p>
          <ul className="list-disc list-inside space-y-1 ml-4">
            <li>256-bit SSL encryption for all data transmissions</li>
            <li>Secure data storage with regular backups</li>
            <li>Access controls and authentication mechanisms</li>
            <li>Regular security audits and vulnerability assessments</li>
            <li>Employee training on data protection practices</li>
          </ul>
        </CardContent>
      </Card>

      {/* Your Rights */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center">
            <UserCheck className="h-5 w-5 mr-2" />
            Your Rights
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-muted-foreground">
            Under GDPR and other data protection laws, you have the following rights:
          </p>
          <ul className="list-disc list-inside text-muted-foreground space-y-2 ml-4">
            <li><strong>Right to Access:</strong> Request copies of your personal data</li>
            <li><strong>Right to Rectification:</strong> Request correction of inaccurate data</li>
            <li><strong>Right to Erasure:</strong> Request deletion of your data</li>
            <li><strong>Right to Restrict Processing:</strong> Request limitation of data processing</li>
            <li><strong>Right to Data Portability:</strong> Receive your data in a structured format</li>
            <li><strong>Right to Object:</strong> Object to processing of your data</li>
            <li><strong>Right to Withdraw Consent:</strong> Withdraw consent at any time</li>
          </ul>
        </CardContent>
      </Card>

      {/* International Transfers */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Globe className="h-5 w-5 mr-2" />
            International Data Transfers
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-muted-foreground">
          <p>
            As a global platform, your data may be transferred to and processed in countries outside your jurisdiction. We ensure appropriate safeguards are in place, including:
          </p>
          <ul className="list-disc list-inside space-y-1 ml-4">
            <li>Standard Contractual Clauses (SCCs) approved by the European Commission</li>
            <li>Adequacy decisions for data transfers</li>
            <li>Binding Corporate Rules (BCRs) where applicable</li>
            <li>Privacy Shield certification (where applicable)</li>
          </ul>
        </CardContent>
      </Card>

      {/* Cookies */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Cookies & Tracking Technologies</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-muted-foreground">
          <p>
            We use cookies and similar tracking technologies to enhance your experience. You can control cookie preferences through your browser settings.
          </p>
          <div>
            <h3 className="font-semibold text-foreground mb-2">Types of Cookies We Use:</h3>
            <ul className="list-disc list-inside space-y-1 ml-4">
              <li><strong>Essential Cookies:</strong> Required for platform functionality</li>
              <li><strong>Performance Cookies:</strong> Help us analyze platform usage</li>
              <li><strong>Functional Cookies:</strong> Remember your preferences</li>
              <li><strong>Marketing Cookies:</strong> Deliver relevant advertisements</li>
            </ul>
          </div>
        </CardContent>
      </Card>

      {/* Contact Information */}
      <Card className="mb-8">
        <CardHeader>
          <CardTitle>Contact Us</CardTitle>
        </CardHeader>
        <CardContent className="text-muted-foreground">
          <p className="mb-4">
            If you have questions about this Privacy Policy or wish to exercise your data rights, please contact our Data Protection Officer:
          </p>
          <div className="space-y-2">
            <p><strong>Email:</strong> privacy@globalbusinessgateway.com</p>
            <p><strong>Phone:</strong> +1 (555) 123-4567</p>
            <p><strong>Address:</strong> 123 Business Avenue, Suite 500, New York, NY 10001, USA</p>
          </div>
        </CardContent>
      </Card>

      {/* Updates */}
      <Card>
        <CardHeader>
          <CardTitle>Updates to This Policy</CardTitle>
        </CardHeader>
        <CardContent className="text-muted-foreground">
          <p>
            We may update this Privacy Policy from time to time. We will notify you of any material changes by posting the new policy on this page and updating the "Last Updated" date. We encourage you to review this policy periodically.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}