import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Scale, FileText, User, Mail, Phone, Upload } from "lucide-react";
import { insertLegalRequestSchema } from "@shared/schema";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/hooks/useAuth";
import { useEffect } from "react";
import { isUnauthorizedError } from "@/lib/authUtils";

const legalRequestSchema = insertLegalRequestSchema.omit({ userId: true });

type LegalRequestForm = typeof legalRequestSchema._type;

export default function RequestSupport() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const form = useForm<LegalRequestForm>({
    resolver: zodResolver(legalRequestSchema),
    defaultValues: {
      serviceType: "",
      title: "",
      description: "",
      urgency: "medium",
      contactEmail: "",
      contactPhone: "",
      documentUrls: [],
    },
  });

  const legalRequestMutation = useMutation({
    mutationFn: async (data: LegalRequestForm) => {
      const response = await apiRequest("POST", "/api/legal-requests", data);
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Legal Support Request Submitted",
        description: "Our legal team will review your request and contact you within 24 hours.",
      });
      queryClient.invalidateQueries({ queryKey: ["/api/legal-requests"] });
      form.reset();
    },
    onError: (error) => {
      if (isUnauthorizedError(error)) {
        toast({
          title: "Unauthorized",
          description: "You are logged out. Logging in again...",
          variant: "destructive",
        });
        setTimeout(() => {
          window.location.href = "/api/login";
        }, 500);
        return;
      }
      toast({
        title: "Submission Failed",
        description: error.message || "Unable to submit legal request. Please try again.",
        variant: "destructive",
      });
    },
  });

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      toast({
        title: "Authentication Required",
        description: "Please log in to request legal support.",
        variant: "destructive",
      });
      setTimeout(() => {
        window.location.href = "/api/login";
      }, 1000);
    }
  }, [isAuthenticated, isLoading, toast]);

  // Pre-fill form with user data when available
  useEffect(() => {
    if (user && user.email) {
      form.setValue("contactEmail", user.email);
    }
  }, [user, form]);

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Card>
          <CardContent className="py-16 text-center">
            <p className="text-muted-foreground">Loading...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!isAuthenticated) {
    return (
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Card>
          <CardContent className="py-16 text-center">
            <p className="text-muted-foreground">Redirecting to login...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const onSubmit = (data: LegalRequestForm) => {
    legalRequestMutation.mutate(data);
  };

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 bg-secondary/50 rounded-full flex items-center justify-center">
              <Scale className="h-8 w-8 text-secondary-foreground" />
            </div>
          </div>
          <h1 className="text-3xl font-bold text-foreground mb-2" data-testid="text-request-support-title">
            Request Legal Support
          </h1>
          <p className="text-muted-foreground" data-testid="text-request-support-description">
            Get expert legal assistance for your business needs. Our team of legal professionals is ready to help.
          </p>
        </div>

        <Card data-testid="card-legal-request-form">
          <CardHeader>
            <CardTitle className="flex items-center">
              <FileText className="mr-2 h-5 w-5" />
              Legal Support Request
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                {/* Service Type */}
                <FormField
                  control={form.control}
                  name="serviceType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Service Type *</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <FormControl>
                          <SelectTrigger data-testid="select-service-type">
                            <SelectValue placeholder="Select the type of legal service you need" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="contracts">Contracts & Agreements</SelectItem>
                          <SelectItem value="regulatory">Regulatory Compliance</SelectItem>
                          <SelectItem value="risk-insurance">Risk & Insurance</SelectItem>
                          <SelectItem value="business-support">Business Support</SelectItem>
                          <SelectItem value="digital-compliance">Digital Compliance</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Title */}
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Request Title *</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="Brief title for your legal request" 
                          {...field} 
                          data-testid="input-title"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Description */}
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description *</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Provide detailed information about your legal needs, including background, specific requirements, timeline, and any relevant context."
                          className="min-h-[120px]"
                          {...field} 
                          data-testid="textarea-description"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Urgency and Contact Info */}
                <div className="grid md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="urgency"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Urgency Level</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger data-testid="select-urgency">
                              <SelectValue placeholder="Select urgency" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="low">Low - Standard response</SelectItem>
                            <SelectItem value="medium">Medium - Priority response</SelectItem>
                            <SelectItem value="high">High - Urgent response</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="contactPhone"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Phone Number</FormLabel>
                        <FormControl>
                          <Input 
                            type="tel"
                            placeholder="Your phone number" 
                            {...field} 
                            data-testid="input-phone"
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                {/* Contact Email */}
                <FormField
                  control={form.control}
                  name="contactEmail"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Contact Email *</FormLabel>
                      <FormControl>
                        <Input 
                          type="email"
                          placeholder="Your email address" 
                          {...field} 
                          data-testid="input-email"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Document Upload Note */}
                <Card className="bg-muted/50">
                  <CardContent className="pt-6">
                    <div className="flex items-center mb-2">
                      <Upload className="h-5 w-5 text-muted-foreground mr-2" />
                      <h4 className="font-semibold">Document Upload</h4>
                    </div>
                    <p className="text-sm text-muted-foreground">
                      If you have relevant documents (contracts, correspondence, legal notices), 
                      please mention them in your description. Our team will provide secure upload 
                      instructions after reviewing your request.
                    </p>
                  </CardContent>
                </Card>

                <Button 
                  type="submit" 
                  className="w-full" 
                  disabled={legalRequestMutation.isPending}
                  data-testid="button-submit-request"
                >
                  {legalRequestMutation.isPending ? "Submitting..." : "Submit Legal Request"}
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>

        {/* Information Cards */}
        <div className="grid md:grid-cols-2 gap-6 mt-8">
          <Card data-testid="card-response-time">
            <CardHeader>
              <CardTitle className="text-lg">Response Times</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-center">
                  <div className="w-2 h-2 bg-destructive rounded-full mr-3"></div>
                  High urgency: 4-8 hours
                </li>
                <li className="flex items-center">
                  <div className="w-2 h-2 bg-accent rounded-full mr-3"></div>
                  Medium urgency: 12-24 hours
                </li>
                <li className="flex items-center">
                  <div className="w-2 h-2 bg-primary rounded-full mr-3"></div>
                  Low urgency: 24-48 hours
                </li>
                <li className="flex items-center">
                  <div className="w-2 h-2 bg-muted-foreground rounded-full mr-3"></div>
                  Free consultation within 1 week
                </li>
              </ul>
            </CardContent>
          </Card>

          <Card data-testid="card-what-to-expect">
            <CardHeader>
              <CardTitle className="text-lg">What to Expect</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-center">
                  <div className="w-2 h-2 bg-accent rounded-full mr-3"></div>
                  Initial consultation call
                </li>
                <li className="flex items-center">
                  <div className="w-2 h-2 bg-accent rounded-full mr-3"></div>
                  Detailed scope & cost estimate
                </li>
                <li className="flex items-center">
                  <div className="w-2 h-2 bg-accent rounded-full mr-3"></div>
                  Dedicated legal expert assignment
                </li>
                <li className="flex items-center">
                  <div className="w-2 h-2 bg-accent rounded-full mr-3"></div>
                  Regular progress updates
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
