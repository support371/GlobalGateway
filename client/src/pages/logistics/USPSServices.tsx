import React, { useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

// USPS service options
const USPSServiceOptions = [
  { id: 'priority', name: 'Priority Mail' },
  { id: 'express', name: 'Express Mail' },
  { id: 'first_class', name: 'First-Class Mail' },
  { id: 'parcel_select', name: 'Parcel Select' },
];

interface ShipmentFormData {
  fromName: string;
  fromZip: string;
  toName: string;
  toZip: string;
  weight: number;
}

interface ShipmentDetails extends ShipmentFormData {
  service: string | undefined;
  insurance: boolean;
  totalCost: number;
}

// Mock PaymentMethods component
const PaymentMethods = () => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Payment Methods</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <Label htmlFor="card-number">Card Number</Label>
            <Input id="card-number" placeholder="XXXX XXXX XXXX XXXX" />
          </div>
          <div className="flex space-x-4">
            <div className="flex-1">
              <Label htmlFor="expiry-date">Expiry Date</Label>
              <Input id="expiry-date" placeholder="MM/YY" />
            </div>
            <div className="flex-1">
              <Label htmlFor="cvv">CVV</Label>
              <Input id="cvv" placeholder="XXX" />
            </div>
          </div>
          <div>
            <Label htmlFor="billing-address">Billing Address</Label>
            <Textarea id="billing-address" placeholder="123 Main St, Anytown, USA" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

const calculateShippingCost = (weight: number, service: string, insurance: boolean): number => {
  let baseCost = 0;
  switch (service) {
    case 'priority':
      baseCost = 5.0;
      break;
    case 'express':
      baseCost = 10.0;
      break;
    case 'first_class':
      baseCost = 3.0;
      break;
    case 'parcel_select':
      baseCost = 4.0;
      break;
    default:
      baseCost = 5.0;
  }
  const weightCost = weight * 0.5;
  const insuranceCost = insurance ? 2.5 : 0;
  return baseCost + weightCost + insuranceCost;
};

const ShippingForm = () => {
  const {
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<ShipmentFormData>();
  const [shippingService, setShippingService] = useState('');
  const [isInsuranceSelected, setIsInsuranceSelected] = useState(false);
  const [shipmentDetails, setShipmentDetails] = useState<ShipmentDetails | null>(null);
  const [error, setError] = useState<string | null>(null);

  const onSubmit = (data: ShipmentFormData) => {
    // Simulate API call
    setTimeout(() => {
      if (data.weight > 150) {
        setError('Package weight exceeds the limit.');
        setShipmentDetails(null);
      } else {
        setShipmentDetails({
          ...data,
          service: USPSServiceOptions.find((s) => s.id === shippingService)?.name,
          insurance: isInsuranceSelected,
          totalCost: calculateShippingCost(data.weight, shippingService, isInsuranceSelected),
        });
        setError(null);
      }
    }, 1000);
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Shipping Calculator</h1>

      {error && (
        <Alert variant="destructive" className="mb-6">
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {shipmentDetails && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Shipment Summary</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <p>
                <strong>From:</strong> {shipmentDetails.fromName} ({shipmentDetails.fromZip})
              </p>
              <p>
                <strong>To:</strong> {shipmentDetails.toName} ({shipmentDetails.toZip})
              </p>
              <p>
                <strong>Weight:</strong> {shipmentDetails.weight} lbs
              </p>
              <p>
                <strong>Service:</strong> {shipmentDetails.service}
              </p>
              <p>
                <strong>Insurance:</strong> {shipmentDetails.insurance ? 'Yes' : 'No'}
              </p>
              <p className="text-xl font-bold">
                Total Cost: ${shipmentDetails.totalCost.toFixed(2)}
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Sender Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="fromName">Name</Label>
                <Controller
                  name="fromName"
                  control={control}
                  rules={{ required: 'Sender name is required' }}
                  render={({ field }) => (
                    <Input id="fromName" {...field} />
                  )}
                />
                {errors.fromName && (
                  <p className="text-red-500 text-sm">{errors.fromName.message}</p>
                )}
              </div>
              <div>
                <Label htmlFor="fromZip">Zip Code</Label>
                <Controller
                  name="fromZip"
                  control={control}
                  rules={{
                    required: 'Sender zip code is required',
                    pattern: {
                      value: /^\d{5}(-\d{4})?$/,
                      message: 'Invalid zip code format',
                    },
                  }}
                  render={({ field }) => <Input id="fromZip" {...field} />}
                />
                {errors.fromZip && (
                  <p className="text-red-500 text-sm">{errors.fromZip.message}</p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Recipient Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="toName">Name</Label>
                <Controller
                  name="toName"
                  control={control}
                  rules={{ required: 'Recipient name is required' }}
                  render={({ field }) => <Input id="toName" {...field} />}
                />
                {errors.toName && (
                  <p className="text-red-500 text-sm">{errors.toName.message}</p>
                )}
              </div>
              <div>
                <Label htmlFor="toZip">Zip Code</Label>
                <Controller
                  name="toZip"
                  control={control}
                  rules={{
                    required: 'Recipient zip code is required',
                    pattern: {
                      value: /^\d{5}(-\d{4})?$/,
                      message: 'Invalid zip code format',
                    },
                  }}
                  render={({ field }) => <Input id="toZip" {...field} />}
                />
                {errors.toZip && (
                  <p className="text-red-500 text-sm">{errors.toZip.message}</p>
                )}
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Package Details</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label htmlFor="weight">Weight (lbs)</Label>
                <Controller
                  name="weight"
                  control={control}
                  rules={{
                    required: 'Weight is required',
                    min: {
                      value: 0.1,
                      message: 'Weight must be at least 0.1 lbs',
                    },
                    max: {
                      value: 150,
                      message: 'Weight cannot exceed 150 lbs',
                    },
                  }}
                  render={({ field }) => (
                    <Input
                      id="weight"
                      type="number"
                      step="0.1"
                      {...field}
                      onChange={(e) => {
                        field.onChange(parseFloat(e.target.value));
                      }}
                    />
                  )}
                />
                {errors.weight && (
                  <p className="text-red-500 text-sm">{errors.weight.message}</p>
                )}
              </div>
              <div className="flex flex-col space-y-2">
                <Label>Shipping Service</Label>
                <Select
                  onValueChange={(value) => setShippingService(value)}
                  defaultValue={shippingService}
                >
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Select service" />
                  </SelectTrigger>
                  <SelectContent>
                    {USPSServiceOptions.map((service) => (
                      <SelectItem key={service.id} value={service.id}>
                        {service.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="mt-4">
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="insurance"
                  checked={isInsuranceSelected}
                  onCheckedChange={(checked) => setIsInsuranceSelected(checked === true)}
                />
                <Label htmlFor="insurance">Add Shipping Insurance (+$2.50)</Label>
              </div>
            </div>
          </CardContent>
        </Card>

        <PaymentMethods />

        <Button type="submit" className="w-full">
          Calculate Shipping Cost
        </Button>
      </form>
    </div>
  );
};

export default ShippingForm;
