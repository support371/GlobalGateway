import { useEffect } from "react";
import { useRoute } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Building, MapPin, DollarSign, Square, Calendar, Eye, Phone, Mail, Star, ArrowLeft } from "lucide-react";
import { Link } from "wouter";
import type { Property } from "@shared/schema";

export default function PropertyDetail() {
  const [match, params] = useRoute("/real-estate/property/:id");
  const propertyId = params?.id;

  const { data: property, isLoading, error } = useQuery<Property>({
    queryKey: ["/api/properties", propertyId],
    queryFn: async () => {
      if (!propertyId) throw new Error("Property ID is required");
      const response = await fetch(`/api/properties/${propertyId}`);
      if (!response.ok) {
        if (response.status === 404) {
          throw new Error("Property not found");
        }
        throw new Error("Failed to fetch property");
      }
      return response.json();
    },
    enabled: !!propertyId,
  });

  useEffect(() => {
    if (property) {
      document.title = `${property.title} - Global Business Gateway`;
    }
  }, [property]);

  const formatPrice = (price: string, currency: string = "USD") => {
    const num = parseFloat(price);
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(num);
  };

  if (!match) {
    return <div>Property not found</div>;
  }

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="max-w-6xl mx-auto">
          <Skeleton className="h-8 w-32 mb-4" />
          <Skeleton className="h-10 w-3/4 mb-2" />
          <Skeleton className="h-6 w-1/2 mb-8" />
          <Skeleton className="h-96 w-full mb-8" />
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <Skeleton className="h-64 w-full" />
            </div>
            <div>
              <Skeleton className="h-40 w-full" />
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !property) {
    return (
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="max-w-2xl mx-auto">
          <Card data-testid="card-error">
            <CardContent className="py-16 text-center">
              <Building className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
              <h2 className="text-2xl font-bold text-foreground mb-2">Property Not Found</h2>
              <p className="text-muted-foreground mb-6">
                {error?.message || "The property you're looking for doesn't exist or has been removed."}
              </p>
              <Link href="/real-estate/listings">
                <Button data-testid="button-back-to-listings">
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back to Listings
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="max-w-6xl mx-auto">
        {/* Breadcrumb */}
        <div className="flex items-center text-sm text-muted-foreground mb-6">
          <Link href="/real-estate" className="hover:text-primary" data-testid="link-real-estate">
            Real Estate
          </Link>
          <span className="mx-2">/</span>
          <Link href="/real-estate/listings" className="hover:text-primary" data-testid="link-listings">
            Listings
          </Link>
          <span className="mx-2">/</span>
          <span data-testid="text-current-property">{property.title}</span>
        </div>

        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col lg:flex-row lg:justify-between lg:items-start gap-4 mb-4">
            <div>
              <h1 className="text-3xl font-bold text-foreground mb-2" data-testid="text-property-title">
                {property.title}
              </h1>
              <div className="flex items-center text-muted-foreground mb-4" data-testid="text-property-location">
                <MapPin className="mr-2 h-5 w-5" />
                {property.address}
              </div>
              <div className="flex items-center gap-4">
                <Badge 
                  className="capitalize"
                  variant={property.type === 'office' ? 'default' : property.type === 'warehouse' ? 'secondary' : 'outline'}
                  data-testid="badge-property-type"
                >
                  {property.type}
                </Badge>
                {property.virtualTourUrl && (
                  <Badge className="bg-accent hover:bg-accent" data-testid="badge-virtual-tour">
                    <Eye className="mr-1 h-3 w-3" />
                    Virtual Tour Available
                  </Badge>
                )}
              </div>
            </div>
            
            <div className="text-right">
              <div className="text-3xl font-bold text-primary mb-2" data-testid="text-property-price">
                {formatPrice(property.price, property.currency ?? undefined)}/month
              </div>
              <div className="flex items-center text-muted-foreground" data-testid="text-property-size">
                <Square className="mr-1 h-4 w-4" />
                {property.size.toLocaleString()} sq ft
              </div>
            </div>
          </div>
        </div>

        {/* Property Images */}
        <div className="mb-8">
          {property.imageUrls && property.imageUrls.length > 0 ? (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
              <div className="lg:col-span-2">
                <img
                  src={property.imageUrls[0]}
                  alt={property.title}
                  className="w-full h-96 object-cover rounded-lg"
                  data-testid="img-property-main"
                />
              </div>
              <div className="grid grid-cols-2 lg:grid-cols-1 gap-4">
                {property.imageUrls.slice(1, 3).map((imageUrl, index) => (
                  <img
                    key={index}
                    src={imageUrl}
                    alt={`${property.title} - Image ${index + 2}`}
                    className="w-full h-44 object-cover rounded-lg"
                    data-testid={`img-property-${index + 1}`}
                  />
                ))}
              </div>
            </div>
          ) : (
            <div className="w-full h-96 bg-muted rounded-lg flex items-center justify-center">
              <Building className="h-24 w-24 text-muted-foreground" />
            </div>
          )}
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Property Details */}
          <div className="lg:col-span-2">
            <Card className="mb-8" data-testid="card-description">
              <CardHeader>
                <CardTitle>Property Description</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground leading-relaxed" data-testid="text-property-description">
                  {property.description || "No description available for this property."}
                </p>
              </CardContent>
            </Card>

            {/* Amenities */}
            {property.amenities && property.amenities.length > 0 && (
              <Card className="mb-8" data-testid="card-amenities">
                <CardHeader>
                  <CardTitle>Amenities & Features</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-2 gap-4">
                    {property.amenities.map((amenity, index) => (
                      <div key={index} className="flex items-center" data-testid={`amenity-${index}`}>
                        <div className="w-2 h-2 bg-accent rounded-full mr-3"></div>
                        <span>{amenity}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Virtual Tour */}
            {property.virtualTourUrl && (
              <Card data-testid="card-virtual-tour">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Eye className="mr-2 h-5 w-5" />
                    Virtual Tour
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="aspect-video bg-muted rounded-lg flex items-center justify-center">
                    <a 
                      href={property.virtualTourUrl} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-primary hover:text-primary/80"
                      data-testid="link-virtual-tour"
                    >
                      <Button size="lg">
                        <Eye className="mr-2 h-5 w-5" />
                        Launch Virtual Tour
                      </Button>
                    </a>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div>
            {/* Contact Card */}
            <Card className="mb-6" data-testid="card-contact">
              <CardHeader>
                <CardTitle>Interested in this Property?</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <Link href="/real-estate/lease-request">
                  <Button className="w-full" data-testid="button-request-lease">
                    <Calendar className="mr-2 h-4 w-4" />
                    Request Lease Information
                  </Button>
                </Link>
                
                <Button variant="outline" className="w-full" data-testid="button-contact-agent">
                  <Phone className="mr-2 h-4 w-4" />
                  Contact Agent
                </Button>
                
                <Button variant="outline" className="w-full" data-testid="button-schedule-viewing">
                  <Eye className="mr-2 h-4 w-4" />
                  Schedule Viewing
                </Button>
              </CardContent>
            </Card>

            {/* Property Details Card */}
            <Card data-testid="card-property-details">
              <CardHeader>
                <CardTitle>Property Details</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Type:</span>
                    <span className="capitalize font-medium" data-testid="detail-type">{property.type}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Size:</span>
                    <span className="font-medium" data-testid="detail-size">{property.size.toLocaleString()} sq ft</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Price:</span>
                    <span className="font-medium" data-testid="detail-price">
                      {formatPrice(property.price, property.currency ?? undefined)}/month
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Location:</span>
                    <span className="font-medium text-right" data-testid="detail-location">{property.location}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Availability:</span>
                    <Badge 
                      variant={property.availability ? "default" : "secondary"}
                      className={property.availability ? "bg-accent hover:bg-accent" : ""}
                      data-testid="detail-availability"
                    >
                      {property.availability ? "Available" : "Not Available"}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
