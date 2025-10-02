"use client"

import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from "@/src/components/ui/card";
import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import { Label } from "@/src/components/ui/label";
import { PlusIcon, Building2, MapPin, Loader2 } from "lucide-react";
import axios from "axios";
import { useToast } from "@/src/components/hook/use-toast";

interface Branch {
  id: number;
  name: string;
  location: string;
  createdAt: string;
}

const BranchManagement: React.FC = () => {
  const [branches, setBranches] = useState<Branch[]>([]);
  const [loading, setLoading] = useState(false);
  const [createFormOpen, setCreateFormOpen] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    location: ''
  });
  const [creating, setCreating] = useState(false);
  const { toast } = useToast();

  const fetchBranches = async () => {
    try {
      setLoading(true);
      const response = await axios.get('/api/branches');
      setBranches(response.data.branches);
    } catch (error) {
      console.error('Error fetching branches:', error);
      toast({
        title: "Error",
        description: "Failed to fetch branches",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBranches();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleCreateBranch = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.location) {
      toast({
        title: "Validation Error",
        description: "Please fill in all fields",
        variant: "destructive"
      });
      return;
    }

    try {
      setCreating(true);
      const response = await axios.post('/api/branches', formData, {
        headers: {
          'Content-Type': 'application/json'
        }
      });

      toast({
        title: "Success",
        description: "Branch created successfully",
        variant: "default"
      });

      setBranches(prev => [...prev, response.data.branch]);
      setFormData({ name: '', location: '' });
      setCreateFormOpen(false);
    } catch (error) {
      console.error('Error creating branch:', error);
      const errorMessage = axios.isAxiosError(error) && error.response?.data?.message 
        ? error.response.data.message 
        : 'Failed to create branch';
      toast({
        title: "Error",
        description: errorMessage,
        variant: "destructive"
      });
    } finally {
      setCreating(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <Card className="mb-4">
      <CardHeader>
        <CardTitle className="text-xl font-semibold flex items-center justify-between">
          <span className="flex items-center">
            <Building2 className="h-5 w-5 mr-2" />
            Branch Management
          </span>
          <Button 
            onClick={() => setCreateFormOpen(!createFormOpen)}
            variant={createFormOpen ? "outline" : "default"}
          >
            <PlusIcon className="h-4 w-4 mr-2" />
            {createFormOpen ? 'Cancel' : 'Create Branch'}
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {/* Create Branch Form */}
        {createFormOpen && (
          <div className="mb-6 p-4 border rounded-lg bg-gray-50">
            <h3 className="text-lg font-medium mb-4">Create New Branch</h3>
            <form onSubmit={handleCreateBranch} className="space-y-4">
              <div>
                <Label htmlFor="name">Branch Name</Label>
                <Input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Enter branch name"
                  required
                />
              </div>
              <div>
                <Label htmlFor="location">Location</Label>
                <Input
                  id="location"
                  name="location"
                  value={formData.location}
                  onChange={handleInputChange}
                  placeholder="Enter branch location"
                  required
                />
              </div>
              <div className="flex gap-2">
                <Button type="submit" disabled={creating}>
                  {creating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  Create Branch
                </Button>
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setCreateFormOpen(false)}
                >
                  Cancel
                </Button>
              </div>
            </form>
          </div>
        )}

        {/* Branches List */}
        <div>
          <h3 className="text-lg font-medium mb-4">Existing Branches</h3>
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-6 w-6 animate-spin mr-2" />
              Loading branches...
            </div>
          ) : branches.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <Building2 className="h-12 w-12 mx-auto mb-2 opacity-50" />
              <p>No branches created yet</p>
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {branches.map((branch) => (
                <div key={branch.id} className="border rounded-lg p-4 bg-white">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h4 className="font-medium text-lg">{branch.name}</h4>
                      <div className="flex items-center text-gray-600 mt-1">
                        <MapPin className="h-4 w-4 mr-1" />
                        <span className="text-sm">{branch.location}</span>
                      </div>
                      <p className="text-xs text-gray-500 mt-2">
                        Created: {new Date(branch.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default BranchManagement;
