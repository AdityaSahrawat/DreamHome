"use client";

import React from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import axios from "axios";
import { useRouter } from "next/navigation";
import { Card, CardContent, CardHeader, CardTitle } from "@/src/components/ui/card";
import { Button } from "@/src/components/ui/button";
import { Label } from "@/src/components/ui/label";
import { Textarea } from "@/src/components/ui/textArea";
import { CalendarIcon, Clock } from "lucide-react";
import { format } from "date-fns";
import { Popover, PopoverContent, PopoverTrigger } from "@/src/components/ui/popover";
import { cn } from "@/lib/utils";
import { Calendar } from "@/src/components/ui/calendar";
import { Input } from "@/src/components/ui/input";

interface PropertyContactFormProps {
  propertyId: number;
}

const formSchema = z.object({
  scheduled_time: z.date({
    required_error: "Please select a date and time for the viewing",
  }),
  message: z.string().min(10, { message: "Message must be at least 10 characters" }),
});

type FormValues = z.infer<typeof formSchema>;

export const PropertyContactForm: React.FC<PropertyContactFormProps> = ({ propertyId }) => {
  const router = useRouter();
  
  const { 
    register, 
    handleSubmit, 
    setValue,
    formState: { errors, isSubmitting },
    reset,
    watch
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      message: "I would like to schedule a viewing for this property.",
    },
  });

  const scheduled_time = watch("scheduled_time");

  const onSubmit = async (data: FormValues) => {
    const token = localStorage.getItem('token');
    if (!token) {
      router.push("/login");
      return;
    }
    const formattedData = {
      ...data,
      scheduled_time: data.scheduled_time.toISOString() // Convert Date to ISO string
    };

    try {
      console.log(token , propertyId , formattedData.scheduled_time , formattedData.message)
      const response = await axios.post("/api/leases/schedule",
        {
          property_id: propertyId,
          scheduled_time: formattedData.scheduled_time ,
          message: formattedData.message
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      reset();
      alert("Viewing request submitted successfully!");
    } catch (error) {
      console.error("Error submitting viewing request:", error);
      alert("Failed to submit viewing request. Please try again.");
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Schedule a Viewing</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label>Viewing Date</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !scheduled_time && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {scheduled_time ? format(scheduled_time, "PPP") : <span>Pick a date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={scheduled_time}
                  onSelect={(date) => {
                    if (date) {
                      setValue("scheduled_time", date);
                    }
                  }}
                  initialFocus
                  disabled={(date) => date < new Date()}
                />
              </PopoverContent>
            </Popover>
            {errors.scheduled_time && (
              <p className="text-sm text-destructive">{errors.scheduled_time.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label>Viewing Time</Label>
            <Input
              type="time"
              onChange={(e) => {
                if (scheduled_time) {
                  const [hours, minutes] = e.target.value.split(':');
                  const newDate = new Date(scheduled_time);
                  newDate.setHours(parseInt(hours, 10));
                  newDate.setMinutes(parseInt(minutes, 10));
                  setValue("scheduled_time", newDate);
                }
              }}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="message">Additional Message</Label>
            <Textarea 
              id="message" 
              rows={4} 
              {...register("message")} 
            />
            {errors.message && (
              <p className="text-sm text-destructive">{errors.message.message}</p>
            )}
          </div>
          
          <Button 
            type="submit" 
            className="w-full" 
            disabled={isSubmitting}
          >
            {isSubmitting ? "Submitting..." : "Request Viewing"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};