
"use client";

import React from "react";
import { Card, CardContent } from "@/src/components/ui/card";
import { Button } from "@/src/components/ui/button";
import { Phone, Mail } from "lucide-react";

interface PropertyAgentProps {
  agent: {
    name: string;
    photo: string;
    phone: string;
    email: string;
    company: string;
  };
}

export const PropertyAgent: React.FC<PropertyAgentProps> = ({ agent }) => {
  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center space-x-4 mb-4">
          <img
            src={agent.photo}
            alt={agent.name}
            className="w-16 h-16 rounded-full object-cover"
          />
          <div>
            <h3 className="font-semibold">{agent.name}</h3>
            <p className="text-sm text-muted-foreground">{agent.company}</p>
          </div>
        </div>
        
        <div className="space-y-3">
          <Button 
            variant="outline" 
            className="w-full justify-start"
          >
            <Phone className="mr-2 h-4 w-4" />
            {agent.phone}
          </Button>
          
          <Button 
            variant="outline" 
            className="w-full justify-start"
          >
            <Mail className="mr-2 h-4 w-4" />
            {agent.email}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};