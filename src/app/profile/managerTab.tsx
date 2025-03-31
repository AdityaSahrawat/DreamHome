// components/ManagerTabs.tsx
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/src/components/ui/tabs";
import { Card, CardHeader, CardContent, CardTitle } from "@/src/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/src/components/ui/table";
import { Button } from "@/src/components/ui/button";
import { Badge } from "@/src/components/ui/badge";
import { CheckCircle, XCircle } from "lucide-react";
import { useState } from "react";

export default function ManagerTabs({ 
  pendingProperties, 
  staffApplications, 
  assistants,
  onStatusChange 
}: {
  pendingProperties: any[];
  staffApplications: any[];
  assistants: any[];
  onStatusChange: (id: string, status: 'approved'|'rejected', assistantId?: string) => void;
}) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <Tabs defaultValue="properties" className="mb-8">
      <TabsList className="grid w-full grid-cols-2 mb-4">
        <TabsTrigger value="properties">Pending Properties</TabsTrigger>
        <TabsTrigger value="applications">Staff Applications</TabsTrigger>
      </TabsList>
      
      <TabsContent value="properties">
        <Card>
          <CardHeader>
            <CardTitle className="text-xl font-semibold">Pending Property Approvals</CardTitle>
          </CardHeader>
          <CardContent>
            {pendingProperties.length > 0 ? (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Property</TableHead>
                      <TableHead>Address</TableHead>
                      <TableHead>Submitted Date</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {pendingProperties.map((property) => {
                      const [selectedAssistant, setSelectedAssistant] = useState('');
                      return (
                        <TableRow key={`property-${property.id}-${property.created_at}`}>
                          <TableCell className="font-medium">{property.title}</TableCell>
                          <TableCell>{property.address}, {property.city}</TableCell>
                          <TableCell>{formatDate(property.created_at)}</TableCell>
                          <TableCell>
                            {property.status === 'pending' ? (
                              <div className="flex flex-col sm:flex-row gap-2">
                                <select
                                  value={selectedAssistant}
                                  onChange={(e) => {
                                    console.log('Selected value:', e.target.value); 
                                    setSelectedAssistant(e.target.value);
                                    console.log("selected : " , selectedAssistant)
                                  }}
                                  className="w-[180px] border rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                >
                                  <option value="">Select Assistant</option>
                                  {assistants.map((assistant) => (
                                    <option key={assistant.id} value={assistant.id}>
                                      {assistant.name}
                                    </option>
                                  ))}
                                </select>

                                <div className="flex gap-2">
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    className="bg-green-500 text-white hover:bg-green-600"
                                    onClick={() => onStatusChange(property.id, 'approved', selectedAssistant)}
                                    disabled={!selectedAssistant}
                                  >
                                    <CheckCircle className="h-4 w-4 mr-1" />
                                    Approve
                                  </Button>
                                  
                                  <Button
                                    variant="outline"
                                    size="sm"
                                    className="bg-red-500 text-white hover:bg-red-600"
                                    onClick={() => onStatusChange(property.id, 'rejected')}
                                  >
                                    <XCircle className="h-4 w-4 mr-1" />
                                    Reject
                                  </Button>
                                </div>
                              </div>
                            ) : (
                              <Badge variant="outline" className={
                                property.status === 'approved' 
                                  ? "bg-green-100 text-green-800" 
                                  : "bg-red-100 text-red-800"
                              }>
                                {property.status.toUpperCase()}
                              </Badge>
                            )}
                          </TableCell>
                        </TableRow>
                      );
                    })}
                  </TableBody>
                </Table>
              </div>
            ) : (
              <p className="text-gray-500 py-4">No pending property approvals.</p>
            )}
          </CardContent>
        </Card>
      </TabsContent>
      
      <TabsContent value="applications">
        <Card>
          <CardHeader>
            <CardTitle className="text-xl font-semibold">Pending Staff Applications</CardTitle>
          </CardHeader>
          <CardContent>
            {staffApplications.length > 0 ? (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Applicant</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Position</TableHead>
                      <TableHead>Applied Date</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {staffApplications.map((app) => (
                      <TableRow key={`staff-app-${app.application_id}`}>
                        <TableCell className="font-medium">{app.name}</TableCell>
                        <TableCell>{app.email}</TableCell>
                        <TableCell>{app.role}</TableCell>
                        <TableCell>{formatDate(app.created_at)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            ) : (
              <p className="text-gray-500 py-4">No pending staff applications.</p>
            )}
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
}