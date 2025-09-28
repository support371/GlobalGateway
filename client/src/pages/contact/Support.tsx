import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { HelpCircle, MessageSquare, Phone, Mail, Clock, Search, BookOpen } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

const supportSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters"),
  email: z.string().email("Please enter a valid email address"),
  orderNumber: z.string().optional(),
  category: z.enum(["technical", "billing", "shipping", "account", "general"]),
  priority: z.enum(["low", "medium", "high", "urgent"]),
  subject: z.string().min(5, "Subject must be at least 5 characters"),
  description: z.string().min(20, "Description must be at least 20 characters"),
});

type SupportForm = z.infer<typeof supportSchema>;

export default function Support() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const form = useForm<SupportForm>({
    resolver: zodResolver(supportSchema),
    defaultValues: {
      name: "",
      email: "",
      orderNumber: "",
      category: "general",
      priority: "medium",
      subject: "",
      description: "",
    },
  });

  const onSubmit = async (data: SupportForm) => {
    setIsSubmitting(true);
    try {
      // Simulate form submission
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      toast({
        title: "Support Ticket Created",
        description: "Your support request has been submitted. We'll get back to you within 2-4 hours.",
      });
      
      form.reset();
    } catch (error) {
      toast({
        title: "Submission Failed", 
        description: "Unable to submit your support request. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const supportChannels = [
    {
      title: "Live Chat",
      description: "Instant support with our team",
      availability: "24/7",
      icon: MessageSquare,
      action: "Start Chat"
    },
    {
      title: "Phone Support",
      description: "+1 (800) GLOBAL-1",
      availability: "24/7",
      icon: Phone,
      action: "Call Now"
    },
    {
      title: "Email Support",
      description: "support@globalbusinessgateway.com",
      availability: "Response within 4 hours",
      icon: Mail,
      action: "Send Email"
    }
  ];

  const faqItems = [
    {
      question: "How can I track my shipment?",
      answer: "You can track your shipment using the tracking number provided in your confirmation email. Visit our tracking page and enter your tracking number for real-time updates."
    },
    {
      question: "What are your shipping timeframes?",
      answer: "Shipping times vary by service level: Standard (5-7 days), Express (2-3 days), and Overnight (next business day). Times may vary based on destination and customs clearance."
    },
    {
      question: "How do I request a property viewing?",
      answer: "You can request property viewings through the property detail page or by contacting our real estate team directly. Virtual tours are also available for most properties."
    },
    {
      question: "What legal services do you provide?",
      answer: "We offer comprehensive legal services including contract drafting, regulatory compliance, digital compliance (GDPR), business formation, and international trade law support."
    },
    {
      question: "How do I update my account information?",
      answer: "Log into your account dashboard to update personal information, billing details, and communication preferences. Some changes may require verification."
    },
    {
      question: "What payment methods do you accept?",
      answer: "We accept all major credit cards, PayPal, bank transfers, and corporate accounts with invoicing. Payment processing is secure and PCI compliant."
    }
  ];

  const responseTimesByPriority = [
    { priority: "Urgent", time: "Within 1 hour", color: "text-destructive" },
    { priority: "High", time: "Within 2 hours", color: "text-orange-500" },
    { priority: "Medium", time: "Within 4 hours", color: "text-accent" },
    { priority: "Low", time: "Within 24 hours", color: "text-primary" }
  ];

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="text-center mb-12">
        <div className="flex justify-center mb-6">
          <div className="w-20 h-20 bg-secondary/50 rounded-full flex items-center justify-center">
            <HelpCircle className="h-10 w-10 text-secondary-foreground" />
          </div>
        </div>
        <h1 className="text-4xl font-bold text-foreground mb-4" data-testid="text-support-title">
          Customer Support
        </h1>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto" data-testid="text-support-description">
          Need help? Our support team is available 24/7 to assist you with any questions or issues. 
          Get expert assistance for all our services.
        </p>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Support Form */}
        <div className="lg:col-span-2">
          <Card data-testid="card-support-form">
            <CardHeader>
              <CardTitle>Submit a Support Request</CardTitle>
            </CardHeader>
            <CardContent>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="name"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Full Name *</FormLabel>
                          <FormControl>
                            <Input 
                              placeholder="Enter your name" 
                              {...field} 
                              data-testid="input-support-name"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="email"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Email Address *</FormLabel>
                          <FormControl>
                            <Input 
                              type="email"
                              placeholder="Enter your email" 
                              {...field} 
                              data-testid="input-support-email"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <div className="grid md:grid-cols-3 gap-4">
                    <FormField
                      control={form.control}
                      name="orderNumber"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Order/Tracking Number</FormLabel>
                          <FormControl>
                            <Input 
                              placeholder="Optional" 
                              {...field} 
                              data-testid="input-order-number"
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="category"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Category *</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger data-testid="select-support-category">
                                <SelectValue placeholder="Select category" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="technical">Technical Issue</SelectItem>
                              <SelectItem value="billing">Billing & Payments</SelectItem>
                              <SelectItem value="shipping">Shipping & Tracking</SelectItem>
                              <SelectItem value="account">Account Management</SelectItem>
                              <SelectItem value="general">General Question</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="priority"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Priority *</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger data-testid="select-support-priority">
                                <SelectValue placeholder="Select priority" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="low">Low</SelectItem>
                              <SelectItem value="medium">Medium</SelectItem>
                              <SelectItem value="high">High</SelectItem>
                              <SelectItem value="urgent">Urgent</SelectItem>
                            </SelectContent>
                          </Select>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="subject"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Subject *</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="Brief description of your issue" 
                            {...field} 
                            data-testid="input-support-subject"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="description"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Description *</FormLabel>
                        <FormControl>
                          <Textarea 
                            placeholder="Please provide detailed information about your issue, including any error messages, steps you've taken, and relevant context..."
                            className="min-h-[120px]"
                            {...field} 
                            data-testid="textarea-support-description"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <Button 
                    type="submit" 
                    className="w-full" 
                    disabled={isSubmitting}
                    data-testid="button-submit-support"
                  >
                    {isSubmitting ? "Submitting..." : "Submit Support Request"}
                  </Button>
                </form>
              </Form>
            </CardContent>
          </Card>
        </div>

        {/* Support Sidebar */}
        <div className="space-y-6">
          {/* Quick Contact */}
          <Card data-testid="card-quick-contact">
            <CardHeader>
              <CardTitle className="text-lg">Quick Contact</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {supportChannels.map((channel, index) => {
                const Icon = channel.icon;
                return (
                  <div key={index} className="border rounded-lg p-4" data-testid={`support-channel-${index}`}>
                    <div className="flex items-center mb-2">
                      <Icon className="h-5 w-5 text-primary mr-2" />
                      <h4 className="font-medium">{channel.title}</h4>
                    </div>
                    <p className="text-sm text-muted-foreground mb-1">{channel.description}</p>
                    <p className="text-xs text-accent mb-3">{channel.availability}</p>
                    <Button variant="outline" size="sm" className="w-full">
                      {channel.action}
                    </Button>
                  </div>
                );
              })}
            </CardContent>
          </Card>

          {/* Response Times */}
          <Card data-testid="card-response-times">
            <CardHeader>
              <CardTitle className="text-lg flex items-center">
                <Clock className="mr-2 h-5 w-5" />
                Response Times
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {responseTimesByPriority.map((item, index) => (
                  <div key={index} className="flex justify-between items-center" data-testid={`response-time-${index}`}>
                    <span className="text-sm font-medium">{item.priority}:</span>
                    <span className={`text-sm ${item.color}`}>{item.time}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Self-Service */}
          <Card data-testid="card-self-service">
            <CardHeader>
              <CardTitle className="text-lg flex items-center">
                <BookOpen className="mr-2 h-5 w-5" />
                Self-Service
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <a 
                  href="/logistics/tracking" 
                  className="block text-primary hover:text-primary/80 text-sm"
                  data-testid="link-tracking"
                >
                  • Track Your Shipment
                </a>
                <a 
                  href="/auth/account-dashboard" 
                  className="block text-primary hover:text-primary/80 text-sm"
                  data-testid="link-account"
                >
                  • Account Dashboard
                </a>
                <a 
                  href="/logistics/faq" 
                  className="block text-primary hover:text-primary/80 text-sm"
                  data-testid="link-faq"
                >
                  • FAQ & Knowledge Base
                </a>
                <a 
                  href="/real-estate/listings" 
                  className="block text-primary hover:text-primary/80 text-sm"
                  data-testid="link-properties"
                >
                  • Browse Properties
                </a>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* FAQ Section */}
      <Card className="mt-12" data-testid="card-faq">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Search className="mr-2 h-5 w-5" />
            Frequently Asked Questions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <Accordion type="single" collapsible className="w-full">
            {faqItems.map((item, index) => (
              <AccordionItem key={index} value={`item-${index}`}>
                <AccordionTrigger 
                  className="text-left"
                  data-testid={`faq-trigger-${index}`}
                >
                  {item.question}
                </AccordionTrigger>
                <AccordionContent 
                  className="text-muted-foreground"
                  data-testid={`faq-content-${index}`}
                >
                  {item.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </CardContent>
      </Card>

      {/* Emergency Support */}
      <Card className="mt-8 border-destructive/20" data-testid="card-emergency">
        <CardContent className="py-8 text-center">
          <Phone className="h-12 w-12 text-destructive mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-foreground mb-2">Emergency Support</h3>
          <p className="text-2xl font-bold text-destructive mb-4">+1 (800) URGENT-1</p>
          <p className="text-muted-foreground">
            For critical issues requiring immediate attention, including shipment emergencies, 
            security concerns, or urgent legal matters.
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
