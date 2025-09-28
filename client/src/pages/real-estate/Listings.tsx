import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { Building, MapPin, DollarSign, Square, Filter, Eye } from "lucide-react";
import { Link } from "wouter";
import type { Property } from "@shared/schema";

export default function Listings() {
  const [location] = useLocation();
  const [filters, setFilters] = useState({
    type: "",
    location: "",
    minPrice: "",
    maxPrice: "",
    minSize: "",
    maxSize: "",
  });

  // Extract category from URL params
  const categoryMatch = location.match(/\/real-estate\/listings\/(.+)/);
  const category = categoryMatch ? categoryMatch[1] : "";

  // Set initial type filter based on URL category
  useEffect(() => {
    if (category && category !== filters.type) {
      setFilters(prev => ({ ...prev, type: category }));
    }
  }, [category]);

  // Extract search query from URL
  const urlParams = new URLSearchParams(window.location.search);
  const searchQuery = urlParams.get('search') || '';

  useEffect(() => {
    if (searchQuery && searchQuery !== filters.location) {
      setFilters(prev => ({ ...prev, location: searchQuery }));
    }
  }, [searchQuery]);

  const { data: properties, isLoading, error } = useQuery({
    queryKey: ["/api/properties", filters],
    queryFn: async () => {
      const searchParams = new URLSearchParams();
      Object.entries(filters).forEach(([key, value]) => {
        if (value) searchParams.append(key, value);
      });
      
      const response = await fetch(`/api/properties?${searchParams}`);
      if (!response.ok) throw new Error('Failed to fetch properties');
      return response.json();
    },
  });

  const handleFilterChange = (key: string, value: string) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const clearFilters = () => {
    setFilters({
      type: category || "",
      location: "",
      minPrice: "",
      maxPrice: "",
      minSize: "",
      maxSize: "",
    });
  };

  const formatPrice = (price: string, currency: string = "USD") => {
    const num = parseFloat(price);
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(num);
  };

  return (
    <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-foreground mb-2" data-testid="text-listings-title">
          {category ? `${category.charAt(0).toUpperCase() + category.slice(1)} Properties` : "Commercial Properties"}
        </h1>
        <p className="text-muted-foreground" data-testid="text-listings-description">
          Find the perfect commercial space for your business needs
        </p>
      </div>

      {/* Filters */}
      <Card className="mb-8" data-testid="card-filters">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Filter className="mr-2 h-5 w-5" />
            Filter Properties
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Property Type</label>
              <Select value={filters.type} onValueChange={(value) => handleFilterChange('type', value)}>
                <SelectTrigger data-testid="select-type">
                  <SelectValue placeholder="All types" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All types</SelectItem>
                  <SelectItem value="office">Office</SelectItem>
                  <SelectItem value="warehouse">Warehouse</SelectItem>
                  <SelectItem value="retail">Retail</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">Location</label>
              <Input
                placeholder="Enter city or country"
                value={filters.location}
                onChange={(e) => handleFilterChange('location', e.target.value)}
                data-testid="input-location"
              />
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">Size (sq ft)</label>
              <div className="flex gap-2">
                <Input
                  placeholder="Min"
                  type="number"
                  value={filters.minSize}
                  onChange={(e) => handleFilterChange('minSize', e.target.value)}
                  data-testid="input-min-size"
                />
                <Input
                  placeholder="Max"
                  type="number"
                  value={filters.maxSize}
                  onChange={(e) => handleFilterChange('maxSize', e.target.value)}
                  data-testid="input-max-size"
                />
              </div>
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">Price Range (USD)</label>
              <div className="flex gap-2">
                <Input
                  placeholder="Min"
                  type="number"
                  value={filters.minPrice}
                  onChange={(e) => handleFilterChange('minPrice', e.target.value)}
                  data-testid="input-min-price"
                />
                <Input
                  placeholder="Max"
                  type="number"
                  value={filters.maxPrice}
                  onChange={(e) => handleFilterChange('maxPrice', e.target.value)}
                  data-testid="input-max-price"
                />
              </div>
            </div>

            <div className="flex items-end">
              <Button variant="outline" onClick={clearFilters} data-testid="button-clear-filters">
                Clear Filters
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Results */}
      {isLoading ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, index) => (
            <Card key={index}>
              <Skeleton className="h-48 w-full" />
              <CardContent className="p-6">
                <Skeleton className="h-6 w-3/4 mb-2" />
                <Skeleton className="h-4 w-1/2 mb-4" />
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-full" />
              </CardContent>
            </Card>
          ))}
        </div>
      ) : error ? (
        <Card data-testid="card-error">
          <CardContent className="py-16 text-center">
            <p className="text-muted-foreground">Failed to load properties. Please try again.</p>
          </CardContent>
        </Card>
      ) : properties && properties.length > 0 ? (
        <>
          <div className="flex justify-between items-center mb-6">
            <p className="text-muted-foreground" data-testid="text-results-count">
              {properties.length} properties found
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {properties.map((property: Property) => (
              <Card key={property.id} className="hover:shadow-lg transition-shadow" data-testid={`card-property-${property.id}`}>
                <div className="relative">
                  {property.imageUrls && property.imageUrls.length > 0 ? (
                    <img
                      src={property.imageUrls[0]}
                      alt={property.title}
                      className="w-full h-48 object-cover rounded-t-lg"
                      data-testid={`img-property-${property.id}`}
                    />
                  ) : (
                    <div className="w-full h-48 bg-muted rounded-t-lg flex items-center justify-center">
                      <Building className="h-16 w-16 text-muted-foreground" />
                    </div>
                  )}
                  <Badge 
                    className="absolute top-2 left-2 capitalize"
                    variant={property.type === 'office' ? 'default' : property.type === 'warehouse' ? 'secondary' : 'outline'}
                    data-testid={`badge-type-${property.id}`}
                  >
                    {property.type}
                  </Badge>
                  {property.virtualTourUrl && (
                    <Badge className="absolute top-2 right-2 bg-accent hover:bg-accent" data-testid={`badge-virtual-tour-${property.id}`}>
                      <Eye className="mr-1 h-3 w-3" />
                      Virtual Tour
                    </Badge>
                  )}
                </div>

                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold text-foreground mb-2" data-testid={`text-title-${property.id}`}>
                    {property.title}
                  </h3>
                  
                  <div className="flex items-center text-muted-foreground text-sm mb-2" data-testid={`text-location-${property.id}`}>
                    <MapPin className="mr-1 h-4 w-4" />
                    {property.location}
                  </div>

                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center text-primary font-semibold" data-testid={`text-price-${property.id}`}>
                      <DollarSign className="mr-1 h-4 w-4" />
                      {formatPrice(property.price, property.currency)}/month
                    </div>
                    <div className="flex items-center text-muted-foreground text-sm" data-testid={`text-size-${property.id}`}>
                      <Square className="mr-1 h-4 w-4" />
                      {property.size.toLocaleString()} sq ft
                    </div>
                  </div>

                  {property.description && (
                    <p className="text-muted-foreground text-sm mb-4 line-clamp-2" data-testid={`text-description-${property.id}`}>
                      {property.description}
                    </p>
                  )}

                  <Link href={`/real-estate/property/${property.id}`}>
                    <Button className="w-full" data-testid={`button-view-details-${property.id}`}>
                      View Details
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        </>
      ) : (
        <Card data-testid="card-no-results">
          <CardContent className="py-16 text-center">
            <Building className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-foreground mb-2">
              No Properties Found
            </h3>
            <p className="text-muted-foreground mb-4">
              Try adjusting your filters or search criteria.
            </p>
            <Button onClick={clearFilters} data-testid="button-clear-filters-no-results">
              Clear All Filters
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
