import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { HelpCircle, MessageSquare, Phone, Mail } from "lucide-react";

export default function FAQ() {
  const faqs = [
    {
      category: "Shipping & Delivery",
      questions: [
        {
          question: "How long does shipping take?",
          answer: "Delivery times vary by service type and destination. Standard shipping takes 5-7 business days, Express takes 2-3 business days, and Overnight delivery arrives the next business day."
        },
        {
          question: "What countries do you ship to?",
          answer: "We ship to over 180 countries worldwide. Our extensive network covers all major continents and most international destinations."
        },
        {
          question: "How can I track my package?",
          answer: "You can track your package using your tracking number on our tracking page. You'll receive real-time updates via email and SMS notifications."
        },
        {
          question: "What if my package is lost or damaged?",
          answer: "All shipments include basic insurance coverage. If your package is lost or damaged, contact our support team immediately with your tracking number for a claim."
        }
      ]
    },
    {
      category: "Pricing & Payment",
      questions: [
        {
          question: "How is shipping cost calculated?",
          answer: "Shipping costs are calculated based on package weight, dimensions, destination, and service type. Use our shipping calculator for instant quotes."
        },
        {
          question: "What payment methods do you accept?",
          answer: "We accept all major credit cards, PayPal, and bank transfers. For corporate accounts, we also offer invoicing options."
        },
        {
          question: "Are there any hidden fees?",
          answer: "No hidden fees. Our quotes include all shipping costs, fuel surcharges, and basic insurance. Additional services like signature confirmation are clearly listed separately."
        },
        {
          question: "Do you offer volume discounts?",
          answer: "Yes, we offer competitive rates for high-volume shippers. Contact our sales team for custom pricing based on your shipping needs."
        }
      ]
    },
    {
      category: "Packaging & Requirements",
      questions: [
        {
          question: "What are the packaging requirements?",
          answer: "Items must be securely packaged in appropriate materials. We recommend using sturdy boxes, adequate cushioning, and proper sealing for international shipments."
        },
        {
          question: "Are there size and weight limits?",
          answer: "Standard packages can weigh up to 70 kg (154 lbs) with maximum dimensions of 150cm x 120cm x 120cm. Larger items require special handling."
        },
        {
          question: "What items cannot be shipped?",
          answer: "Prohibited items include hazardous materials, weapons, illegal substances, and perishable goods. Check our prohibited items list for complete details."
        },
        {
          question: "Do you provide packaging materials?",
          answer: "Yes, we offer packaging supplies including boxes, bubble wrap, and labels. These can be ordered through your account or at our service centers."
        }
      ]
    },
    {
      category: "Customs & International",
      questions: [
        {
          question: "Who handles customs clearance?",
          answer: "We handle all customs documentation and clearance processes. Our team ensures compliance with international shipping regulations."
        },
        {
          question: "What documents are needed for international shipping?",
          answer: "International shipments require commercial invoices, customs declarations, and sometimes additional permits depending on the destination and goods."
        },
        {
          question: "Are there customs duties and taxes?",
          answer: "Customs duties and taxes are determined by the destination country and are typically paid by the recipient. We provide duty estimates when available."
        },
        {
          question: "How long does customs clearance take?",
          answer: "Customs clearance typically takes 1-3 business days but can vary by country and the type of goods being shipped."
        }
      ]
    }
  ];

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="text-center mb-12">
        <div className="flex justify-center mb-6">
          <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center">
            <HelpCircle className="h-10 w-10 text-primary" />
          </div>
        </div>
        <h1 className="text-4xl font-bold text-foreground mb-4" data-testid="text-faq-title">
          Frequently Asked Questions
        </h1>
        <p className="text-xl text-muted-foreground max-w-3xl mx-auto" data-testid="text-faq-description">
          Find answers to common questions about our logistics services. Can't find what you're looking for? Contact our support team.
        </p>
      </div>

      <div className="max-w-4xl mx-auto">
        {/* FAQ Categories */}
        <div className="space-y-8">
          {faqs.map((category, categoryIndex) => (
            <Card key={categoryIndex} data-testid={`card-faq-${category.category.toLowerCase().replace(/\s+/g, '-')}`}>
              <CardHeader>
                <CardTitle className="text-2xl">{category.category}</CardTitle>
              </CardHeader>
              <CardContent>
                <Accordion type="single" collapsible className="w-full">
                  {category.questions.map((faq, index) => (
                    <AccordionItem key={index} value={`item-${categoryIndex}-${index}`}>
                      <AccordionTrigger 
                        className="text-left"
                        data-testid={`accordion-trigger-${categoryIndex}-${index}`}
                      >
                        {faq.question}
                      </AccordionTrigger>
                      <AccordionContent 
                        className="text-muted-foreground"
                        data-testid={`accordion-content-${categoryIndex}-${index}`}
                      >
                        {faq.answer}
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Contact Support */}
        <Card className="mt-12" data-testid="card-contact-support">
          <CardHeader>
            <CardTitle className="text-center">Still Need Help?</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-center">
              <p className="text-muted-foreground mb-6">
                Our support team is available 24/7 to assist you with any questions or concerns.
              </p>
              
              <div className="grid sm:grid-cols-3 gap-4 mb-8">
                <div className="text-center" data-testid="contact-chat">
                  <MessageSquare className="h-8 w-8 text-primary mx-auto mb-2" />
                  <h4 className="font-semibold mb-1">Live Chat</h4>
                  <p className="text-sm text-muted-foreground">Available 24/7</p>
                </div>
                
                <div className="text-center" data-testid="contact-phone">
                  <Phone className="h-8 w-8 text-primary mx-auto mb-2" />
                  <h4 className="font-semibold mb-1">Phone Support</h4>
                  <p className="text-sm text-muted-foreground">1-800-GLOBAL-1</p>
                </div>
                
                <div className="text-center" data-testid="contact-email">
                  <Mail className="h-8 w-8 text-primary mx-auto mb-2" />
                  <h4 className="font-semibold mb-1">Email</h4>
                  <p className="text-sm text-muted-foreground">support@globalbg.com</p>
                </div>
              </div>
              
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/contact/support">
                  <Button data-testid="button-contact-support">
                    Contact Support
                  </Button>
                </Link>
                <Link href="/logistics/shipping-calculator">
                  <Button variant="outline" data-testid="button-shipping-calculator">
                    Shipping Calculator
                  </Button>
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
