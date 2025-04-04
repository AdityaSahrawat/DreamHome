// components/ManagerTabs.tsx
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/src/components/ui/tabs";
import { Card, CardHeader, CardContent, CardTitle } from "@/src/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/src/components/ui/table";
import { Button } from "@/src/components/ui/button";
import { Badge } from "@/src/components/ui/badge";
import { Calendar, CheckCircle, Clock, XCircle } from "lucide-react";
import { useState } from "react";

export default function ManagerTabs({ 
  pendingProperties, 
  staffApplications, 
  assistants,
  onStatusChange ,
  viewRequests,
  onScheduleStatusChange ,
  onStaffApplicationStatusChange
}: {
  pendingProperties: any[];
  staffApplications: any[];
  assistants: any[];
  viewRequests?: any[];
  onStatusChange: (id: string, status: 'approved'|'rejected', assistantId?: string) => void;
  onScheduleStatusChange: (requestId: string, status: 'approved'|'rejected') => Promise<void>;
  onStaffApplicationStatusChange: (applicationId: string, status: 'approved'|'rejected') => Promise<void>;
}) {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };
  const formatTime = (timeString: string) => {
    return new Date(`1970-01-01T${timeString}`).toLocaleTimeString([], {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <Tabs defaultValue="properties" className="mb-8">
      <TabsList className="grid w-full grid-cols-3 mb-4">
        <TabsTrigger value="properties">Pending Properties</TabsTrigger>
        <TabsTrigger value="applications">Staff Applications</TabsTrigger>
        <TabsTrigger value="viewings">Viewing Requests</TabsTrigger>
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
                                  onChange={(e) => setSelectedAssistant(e.target.value)}
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
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {staffApplications.map((app) => (
                      <TableRow key={`staff-app-${app.application_id}`}>
                        <TableCell className="font-medium">{app.name}</TableCell>
                        <TableCell>{app.email}</TableCell>
                        <TableCell className="capitalize">{app.role}</TableCell>
                        <TableCell>{formatDate(app.created_at)}</TableCell>
                        <TableCell>
                          <Badge variant={
                            app.status === 'pending' ? 'secondary' : 
                            app.status === 'approved' ? 'default' : 'destructive'
                          }>
                            {app.status}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              className="bg-green-500 text-white hover:bg-green-600"
                              onClick={() => onStaffApplicationStatusChange(app.application_id, 'approved')}
                              disabled={app.status !== 'pending'}
                            >
                              <CheckCircle className="h-4 w-4 mr-1" />
                              Approve
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              className="bg-red-500 text-white hover:bg-red-600"
                              onClick={() => onStaffApplicationStatusChange(app.application_id, 'rejected')}
                              disabled={app.status !== 'pending'}
                            >
                              <XCircle className="h-4 w-4 mr-1" />
                              Reject
                            </Button>
                          </div>
                        </TableCell>
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

      <TabsContent value="viewings">
        <Card>
          <CardHeader>
            <CardTitle className="text-xl font-semibold flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Viewing Requests
            </CardTitle>
          </CardHeader>
          <CardContent>
            {viewRequests && viewRequests.length > 0 ? (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Property</TableHead>
                      <TableHead>Client</TableHead>
                      <TableHead>Scheduled Time</TableHead>
                      <TableHead>Status</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {viewRequests.map((request) => (
                      <TableRow key={`viewing-${request.request_id}`}>
                        <TableCell className="font-medium">{request.property_title}</TableCell>
                        <TableCell>
                          <div>
                            <p>{request.client_name}</p>
                            <p className="text-sm text-gray-500">{request.client_email}</p>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1">
                            <Clock className="h-4 w-4" />
                            {formatDate(request.scheduled_time)} at {formatTime(request.scheduled_time)}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant={
                            request.status === 'pending' ? 'secondary' : 
                            request.status === 'approved' ? 'default' : 'destructive'
                          }>
                            {request.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="flex gap-2">
                          <Button
                            size="sm"
                            variant="outline"
                            className="bg-green-500 text-white hover:bg-green-600"
                            onClick={() => onScheduleStatusChange(request.request_id, 'approved')}
                            disabled={request.status !== 'pending'}
                          >
                            <CheckCircle className="h-4 w-4 mr-1" />
                            Approve
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="bg-red-500 text-white hover:bg-red-600"
                            onClick={() => onScheduleStatusChange(request.request_id, 'rejected')}
                            disabled={request.status !== 'pending'}
                          >
                            <XCircle className="h-4 w-4 mr-1" />
                            Reject
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            ) : (
              <p className="text-gray-500 py-4">No viewing requests found.</p>
            )}
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );
}