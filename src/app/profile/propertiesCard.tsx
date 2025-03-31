// components/PropertiesCard.tsx
import { Card, CardHeader, CardContent, CardTitle } from "@/src/components/ui/card";
import { Badge } from "@/src/components/ui/badge";
import { HomeIcon } from "lucide-react";

export default function PropertiesCard({ properties, role }: { properties: any[], role: string }) {
  const formatAddress = (property: any) => {
    return `${property.address}, ${property.city}`;
  };

  const getStatusBadgeColor = (status: string) => {
    switch (status) {
      case 'approved':
        return "bg-green-100 text-green-800 hover:bg-green-200";
      case 'rented':
        return "bg-blue-100 text-blue-800 hover:bg-blue-200";
      case 'pending':
        return "bg-yellow-100 text-yellow-800 hover:bg-yellow-200";
      case 'rejected':
        return "bg-red-100 text-red-800 hover:bg-red-200";
      default:
        return "bg-gray-100 text-gray-800 hover:bg-gray-200";
    }
  };

  const title = role === 'owner' ? 'My Properties' : 'Properties in My Branch';

  return (
    <Card className="mb-8">
      <CardHeader>
        <CardTitle className="text-xl font-semibold flex items-center gap-2">
          <HomeIcon className="h-5 w-5" />
          {title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        {properties.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {properties.map((property) => (
              <Card key={property.id} className="border hover:shadow-md transition-shadow">
                <CardContent className="p-5">
                  <h3 className="font-medium text-lg mb-2">{property.title}</h3>
                  <p className="text-gray-600 text-sm mb-1">{formatAddress(property)}</p>
                  {property.type && (
                    <p className="text-gray-600 text-sm mb-1">{property.type} - {property.bedrooms} bedrooms</p>
                  )}
                  <p className="text-gray-600 text-sm mb-3">${property.price}{role !== 'owner' ? '/month' : ''}</p>
                  <Badge variant="outline" className={getStatusBadgeColor(property.status)}>
                    {property.status.charAt(0).toUpperCase() + property.status.slice(1)}
                  </Badge>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <p className="text-gray-500">
            {role === 'owner' ? "You don't own any properties yet." : "No properties in your branch."}
          </p>
        )}
      </CardContent>
    </Card>
  );
}