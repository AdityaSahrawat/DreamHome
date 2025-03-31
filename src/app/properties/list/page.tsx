"use client"

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Card, 
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter 
} from "@/src/components/ui/card";
import { Input } from "@/src/components/ui/input";
import { Textarea } from "@/src/components/ui/textArea";
import { Button } from "@/src/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/src/components/ui/select";
import { Dialog, DialogContent, DialogTrigger } from "@/src/components/ui/dialog";
import { X, Image, Upload, Trash2 } from "lucide-react";
import { AspectRatio } from "@/src/components/ui/aspect-ratio";
import axios from 'axios';
import Navbar from '@/src/components/navbar';

const propertyTypes = [
  "House",
  "Apartment",
  "Condo",
  "Townhouse",
  "Villa",
  "Land",
  "Commercial",
  "Industrial",
  "Other"
];

const Index = () => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    address: '',
    city: '',
    price: '',
    bedrooms: '',
    bathrooms: '',
    sqft: '',
    type: '',
    latitude: '',
    longitude: '',
    year_built: ''
  });
  const [files, setFiles] = useState<File[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [previewImageName, setPreviewImageName] = useState<string>('');


  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const selectedFiles = Array.from(e.target.files);
      setFiles((prevFiles) => [...prevFiles, ...selectedFiles]);
    }
  };

  const handleRemoveFile = (index: number) => {
    setFiles((prevFiles) => prevFiles.filter((_, i) => i !== index));
  };

  const handlePreviewImage = (file: File) => {
    const fileUrl = URL.createObjectURL(file);
    setPreviewImage(fileUrl);
    setPreviewImageName(file.name);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Validate required fields
    const requiredFields = [
      'title', 'description', 'address', 'city', 
      'price', 'bedrooms', 'bathrooms', 'sqft', 'type'
    ];
    
    const missingFields = requiredFields.filter(field => !formData[field as keyof typeof formData]);
    
    if (missingFields.length > 0) {
      alert(`Please fill out all required fields: ${missingFields.join(', ')}`);
      setIsSubmitting(false);
      return;
    }

    try {
      const propertyData = {
        ...formData,
        price: parseFloat(formData.price),
        bedrooms: parseInt(formData.bedrooms),
        bathrooms: parseInt(formData.bathrooms),
        sqft: parseInt(formData.sqft),
        latitude: formData.latitude ? parseFloat(formData.latitude) : 0,
        longitude: formData.longitude ? parseFloat(formData.longitude) : 0,
        year_built: formData.year_built ? parseInt(formData.year_built) : null
      };
      const token = localStorage.getItem("token")
      console.log(token)
      const propertyResponse = await axios.post('/api/properties/apply', propertyData, {
        headers: {
          Authorization : `Bearer ${token}`,
          'Content-Type' : 'application/json'
        },
      });

      if (propertyResponse.status >= 200 && propertyResponse.status < 300) {
        const propertyId = propertyResponse.data.propertyId; 

        if (files.length > 0) {
          const formDataImages = new FormData();
          files.forEach((file) => {
            formDataImages.append('photos', file); 
          });
          console.log("token : " , token)
          const imagesResponse = await axios.post(`/api/properties/${propertyId}/photos`, formDataImages, {
            headers: {
              Authorization: `Bearer ${token}`
            },
          });
          
          if (imagesResponse.status >= 200 && imagesResponse.status < 300) {
            alert('Property and images uploaded successfully!');
            router.push('/properties');
          } else {
            await axios.delete(`/api/properties/${propertyId}`, {
              headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json',
              },
            });
            alert('Failed to upload images. Property listing has been removed.');
          }
        } else {
          alert('Property listed successfully!');
          router.push('/properties');
        }
      } else {
        alert('Failed to list property. Please try again.');
      }
    } catch (error) {
      console.log(error)
      alert('An error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <Navbar/>
      <div className='pt-24 pb-12'>
        <div className="container mx-auto px-4 py-12">
          <div className="max-w-3xl mx-auto">
            <div className="text-center mb-8 animate-fade-in">
              <h1 className="text-4xl font-bold tracking-tight text-gray-900 mb-2">List Your Property</h1>
              <p className="text-lg text-gray-600">Fill in the details below to showcase your property</p>
            </div>

            <Card className="shadow-xl border-0 overflow-hidden bg-white/80 backdrop-blur-sm animate-scale-in">
              <CardHeader className="border-b bg-gradient-to-r from-blue-50 to-purple-50 p-6">
                <CardTitle className="text-2xl">Property Details</CardTitle>
                <CardDescription>Complete all fields for the best results</CardDescription>
              </CardHeader>
              
              <form onSubmit={handleSubmit}>
                <CardContent className="p-6 space-y-6">
                  <div className="space-y-2">
                    <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                      Property Title*
                    </label>
                    <Input
                      id="title"
                      name="title"
                      value={formData.title}
                      onChange={handleChange}
                      placeholder="Enter a descriptive title"
                      className="transition duration-200 focus:ring-blue-500"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                      Description*
                    </label>
                    <Textarea
                      id="description"
                      name="description"
                      value={formData.description}
                      onChange={handleChange}
                      rows={4}
                      placeholder="Describe your property in detail"
                      className="transition duration-200 focus:ring-blue-500"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label htmlFor="type" className="block text-sm font-medium text-gray-700">
                        Property Type*
                      </label>
                      <Select
                        value={formData.type}
                        onValueChange={(value) => handleSelectChange('type', value)}
                        required
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select property type" />
                        </SelectTrigger>
                        <SelectContent>
                          {propertyTypes.map((type) => (
                            <SelectItem key={type} value={type}>{type}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <label htmlFor="price" className="block text-sm font-medium text-gray-700">
                        Price ($)*
                      </label>
                      <Input
                        type="number"
                        id="price"
                        name="price"
                        value={formData.price}
                        onChange={handleChange}
                        placeholder="Enter price"
                        className="transition duration-200 focus:ring-blue-500"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="space-y-2">
                      <label htmlFor="bedrooms" className="block text-sm font-medium text-gray-700">
                        Bedrooms*
                      </label>
                      <Input
                        type="number"
                        id="bedrooms"
                        name="bedrooms"
                        value={formData.bedrooms}
                        onChange={handleChange}
                        placeholder="Number of bedrooms"
                        className="transition duration-200 focus:ring-blue-500"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <label htmlFor="bathrooms" className="block text-sm font-medium text-gray-700">
                        Bathrooms*
                      </label>
                      <Input
                        type="number"
                        id="bathrooms"
                        name="bathrooms"
                        value={formData.bathrooms}
                        onChange={handleChange}
                        placeholder="Number of bathrooms"
                        className="transition duration-200 focus:ring-blue-500"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <label htmlFor="sqft" className="block text-sm font-medium text-gray-700">
                        Square Feet*
                      </label>
                      <Input
                        type="number"
                        id="sqft"
                        name="sqft"
                        value={formData.sqft}
                        onChange={handleChange}
                        placeholder="Total area in sqft"
                        className="transition duration-200 focus:ring-blue-500"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label htmlFor="address" className="block text-sm font-medium text-gray-700">
                        Address*
                      </label>
                      <Input
                        id="address"
                        name="address"
                        value={formData.address}
                        onChange={handleChange}
                        placeholder="Street address"
                        className="transition duration-200 focus:ring-blue-500"
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <label htmlFor="city" className="block text-sm font-medium text-gray-700">
                        City*
                      </label>
                      <Input
                        id="city"
                        name="city"
                        value={formData.city}
                        onChange={handleChange}
                        placeholder="City"
                        className="transition duration-200 focus:ring-blue-500"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label htmlFor="latitude" className="block text-sm font-medium text-gray-700">
                        Latitude (optional)
                      </label>
                      <Input
                        type="number"
                        id="latitude"
                        name="latitude"
                        value={formData.latitude}
                        onChange={handleChange}
                        placeholder="Geographic latitude"
                        className="transition duration-200 focus:ring-blue-500"
                        step="any"
                      />
                    </div>

                    <div className="space-y-2">
                      <label htmlFor="longitude" className="block text-sm font-medium text-gray-700">
                        Longitude (optional)
                      </label>
                      <Input
                        type="number"
                        id="longitude"
                        name="longitude"
                        value={formData.longitude}
                        onChange={handleChange}
                        placeholder="Geographic longitude"
                        className="transition duration-200 focus:ring-blue-500"
                        step="any"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label htmlFor="year_built" className="block text-sm font-medium text-gray-700">
                      Year Built (optional)
                    </label>
                    <Input
                      type="number"
                      id="year_built"
                      name="year_built"
                      value={formData.year_built}
                      onChange={handleChange}
                      placeholder="Construction year"
                      className="transition duration-200 focus:ring-blue-500"
                    />
                  </div>

                  <div className="space-y-3">
                    <label className="block text-sm font-medium text-gray-700">
                      Upload Photos
                    </label>
                    
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:bg-gray-50 transition-colors cursor-pointer relative">
                      <input
                        type="file"
                        id="photos"
                        name="photos"
                        onChange={handleFileChange}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        multiple
                        accept="image/*"
                      />
                      <div className="space-y-2">
                        <Upload className="h-10 w-10 text-blue-500 mx-auto" />
                        <p className="text-sm text-gray-500">
                          Drag and drop your images here, or click to browse
                        </p>
                        <p className="text-xs text-gray-400">
                          Supported formats: JPEG, PNG, WebP. Max size: 5MB per image.
                        </p>
                      </div>
                    </div>
                  </div>

                  {files.length > 0 && (
                    <div className="space-y-3">
                      <h3 className="text-sm font-medium text-gray-700">Selected Images ({files.length})</h3>
                      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                        {files.map((file, index) => (
                          <div key={index} className="group relative rounded-lg overflow-hidden shadow-sm border border-gray-200 transition-all hover:shadow-md">
                            <Dialog>
                              <DialogTrigger asChild>
                                <button 
                                  type="button" 
                                  className="w-full h-full" 
                                  onClick={() => handlePreviewImage(file)}
                                >
                                  <div className="aspect-square relative bg-gray-100">
                                    <div className="absolute inset-0 flex items-center justify-center">
                                      <div className="w-full h-full flex items-center justify-center bg-gradient-to-r from-gray-200 to-gray-300 animate-image-shimmer bg-[length:400%_100%]">
                                        <Image className="w-6 h-6 text-gray-400" />
                                      </div>
                                      {URL.createObjectURL && (
                                        <img 
                                          src={URL.createObjectURL(file)} 
                                          alt={file.name}
                                          className="absolute inset-0 w-full h-full object-cover"
                                        />
                                      )}
                                    </div>
                                  </div>
                                  <div className="p-2 text-xs truncate">{file.name}</div>
                                </button>
                              </DialogTrigger>
                              <DialogContent className="sm:max-w-md">
                                <div className="space-y-4">
                                  <div className="font-medium text-center">{file.name}</div>
                                  <AspectRatio ratio={16/9} className="bg-muted overflow-hidden rounded-md">
                                    <img 
                                      src={URL.createObjectURL(file)}
                                      alt={file.name}
                                      className="object-contain w-full h-full"
                                    />
                                  </AspectRatio>
                                </div>
                              </DialogContent>
                            </Dialog>
                            
                            <button
                              type="button"
                              onClick={() => handleRemoveFile(index)}
                              className="absolute top-1 right-1 bg-white/80 p-1 rounded-full shadow-sm opacity-0 group-hover:opacity-100 transition-opacity"
                              aria-label="Remove image"
                            >
                              <Trash2 className="w-4 h-4 text-red-500" />
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </CardContent>

                <CardFooter className="border-t bg-gray-50/50 p-6">
                  <Button 
                    type="submit" 
                    className="w-full bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-medium py-2.5 transition-all duration-200"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <span className="flex items-center justify-center">
                        <span className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></span>
                        Processing...
                      </span>
                    ) : (
                      'List Your Property'
                    )}
                  </Button>
                </CardFooter>
              </form>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;