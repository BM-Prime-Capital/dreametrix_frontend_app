"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Modal } from "@/components/ui/Modal";
import {
  School,
  Plus,
  Search,
  Frown,
  ChevronLeft,
  ChevronRight,
  MoreVertical,
  Filter,
  Download,
  Users,
  BookOpen,
  MapPin,
  FileUp,
  X,
  Save,
  Loader2
} from "lucide-react";

type School = {
  id: string;
  name: string;
  district: string;
  address: string;
  city: string;
  postalCode: string;
  country: string;
  phone: string;
  email: string;
  website?: string;
  principal: string;
  description?: string;
  students: number;
  teachers: number;
  courses: number;
  status: "active" | "pending" | "inactive";
  lastUpdated: string;
};

export default function SchoolsPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [selectedSchool, setSelectedSchool] = useState<School | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  // Sample data - replace with actual API calls
  const [schools, setSchools] = useState<School[]>([
    {
      "id": "1",
      "name": "Central Elementary School",
      "district": "North District",
      "address": "123 Education St",
      "city": "Metropolis",
      "postalCode": "12345",
      "country": "Country",
      "phone": "+1 (555) 123-4567",
      "email": "contact@central.edu",
      "website": "https://central.edu",
      "principal": "Dr. Sarah Johnson",
      "description": "A leading elementary school in the district",
      "students": 420,
      "teachers": 28,
      "courses": 15,
      "status": "active",
      "lastUpdated": "2023-10-15"
    },
    {
      "id": "2",
      "name": "Sunnyvale High School",
      "district": "South District",
      "address": "456 Sunshine Ave",
      "city": "Sunnyvale",
      "postalCode": "67890",
      "country": "Country",
      "phone": "+1 (555) 987-6543",
      "email": "info@sunnyvalehs.edu",
      "website": "https://sunnyvalehs.edu",
      "principal": "Mr. James Wilson",
      "description": "Renowned for STEM programs and athletics",
      "students": 850,
      "teachers": 55,
      "courses": 32,
      "status": "active",
      "lastUpdated": "2023-11-20"
    },
    {
      "id": "3",
      "name": "Riverside Middle School",
      "district": "East District",
      "address": "789 River Rd",
      "city": "Rivertown",
      "postalCode": "34567",
      "country": "Country",
      "phone": "+1 (555) 456-7890",
      "email": "admin@riversidems.edu",
      "website": "https://riversidems.edu",
      "principal": "Ms. Emily Davis",
      "description": "Focus on arts and environmental education",
      "students": 620,
      "teachers": 42,
      "courses": 25,
      "status": "active",
      "lastUpdated": "2023-09-05"
    },
    {
      "id": "4",
      "name": "Westwood Academy",
      "district": "West District",
      "address": "321 Oak Lane",
      "city": "Westwood",
      "postalCode": "89012",
      "country": "Country",
      "phone": "+1 (555) 234-5678",
      "email": "admissions@westwood.edu",
      "website": "https://westwood.edu",
      "principal": "Dr. Robert Chen",
      "description": "Private school with IB program",
      "students": 350,
      "teachers": 30,
      "courses": 40,
      "status": "active",
      "lastUpdated": "2023-12-10"
    },
    {
      "id": "5",
      "name": "Pinecrest Elementary",
      "district": "North District",
      "address": "555 Forest Blvd",
      "city": "Metropolis",
      "postalCode": "12348",
      "country": "Country",
      "phone": "+1 (555) 345-6789",
      "email": "hello@pinecrest.edu",
      "website": "https://pinecrest.edu",
      "principal": "Mrs. Linda Martinez",
      "description": "Dual-language immersion program",
      "students": 380,
      "teachers": 25,
      "courses": 18,
      "status": "inactive",
      "lastUpdated": "2024-01-15"
    }
  ]);

  const filteredSchools = schools.filter(school =>
    school.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    school.district.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleImport = async () => {
    if (!selectedFile) return;
    
    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      // Process file and update schools state
      console.log("Importing file:", selectedFile.name);
      setIsImportModalOpen(false);
      setSelectedFile(null);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmitSchool = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      if (selectedSchool) {
        // Update existing school
        console.log("Updating school");
      } else {
        // Create new school
        console.log("Creating new school");
      }
      
      setIsFormModalOpen(false);
      setSelectedSchool(null);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-6 w-full">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold">Schools Management</h1>
          <p className="text-sm text-gray-500">
            Manage all schools in your system ({schools.length} total)
          </p>
        </div>
        <div className="flex gap-2 w-full md:w-auto">
          <Button
            variant="outline"
            className="gap-2"
            onClick={() => setIsImportModalOpen(true)}
          >
            <Download className="h-4 w-4" />
            Import
          </Button>
          <Button
            className="gap-2"
            onClick={() => {
              setSelectedSchool(null);
              setIsFormModalOpen(true);
            }}
          >
            <Plus className="h-4 w-4" />
            Add School
          </Button>
        </div>
      </div>

      {/* Search Bar */}
      <Card className="p-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search schools by name or district..."
              className="pl-10"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <Button variant="outline" className="gap-2">
            <Filter className="h-4 w-4" />
            Filters
          </Button>
        </div>
      </Card>

      {/* Schools List */}
      {filteredSchools.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredSchools.map((school) => (
            <Card 
              key={school.id}
              className="hover:shadow-md transition-shadow cursor-pointer h-full"
              onClick={() => {
                setSelectedSchool(school);
                setIsFormModalOpen(true);
              }}
            >
              <div className="p-4 flex flex-col h-full">
                <div className="p-3 bg-blue-100 rounded-lg text-blue-600 w-fit mb-3">
                  <School className="h-6 w-6" />
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="font-semibold text-lg truncate">{school.name}</h3>
                    <Badge
                      variant={
                        school.status === "active"
                          ? "default"
                          : school.status === "pending"
                          ? "secondary"
                          : "destructive"
                      }
                      className="shrink-0"
                    >
                      {school.status.charAt(0).toUpperCase() + school.status.slice(1)}
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-600 mb-3 flex items-center gap-1">
                    <MapPin className="h-3 w-3" />
                    <span className="truncate">{school.district}</span>
                  </p>
                  <div className="grid grid-cols-3 gap-2 text-sm">
                    <div className="flex flex-col items-center p-2 bg-gray-50 rounded">
                      <Users className="h-4 w-4 text-gray-500 mb-1" />
                      <span>{school.students}</span>
                    </div>
                    <div className="flex flex-col items-center p-2 bg-gray-50 rounded">
                      <Users className="h-4 w-4 text-gray-500 mb-1" />
                      <span>{school.teachers}</span>
                    </div>
                    <div className="flex flex-col items-center p-2 bg-gray-50 rounded">
                      <BookOpen className="h-4 w-4 text-gray-500 mb-1" />
                      <span>{school.courses}</span>
                    </div>
                  </div>
                </div>
                <div className="text-xs text-gray-500 mt-3 pt-2 border-t">
                  Updated: {new Date(school.lastUpdated).toLocaleDateString()}
                </div>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="p-12 flex flex-col items-center justify-center gap-4">
          <Frown className="h-12 w-12 text-gray-400" />
          <h3 className="font-medium text-lg">No schools found</h3>
          <p className="text-sm text-gray-500 max-w-md text-center">
            No schools match your search criteria. Try adjusting your search or filters.
          </p>
          <Button variant="outline" onClick={() => setSearchQuery("")}>
            Clear search
          </Button>
        </Card>
      )}

      {/* Pagination */}
      {filteredSchools.length > 0 && (
        <div className="flex items-center justify-between mt-6">
          <Button variant="outline" className="gap-2">
            <ChevronLeft className="h-4 w-4" />
            Previous
          </Button>
          <div className="text-sm text-gray-500">
            Page 1 of 1
          </div>
          <Button variant="outline" className="gap-2">
            Next
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
      )}

      {/* Import Modal */}
      <Modal
        isOpen={isImportModalOpen}
        onClose={() => setIsImportModalOpen(false)}
        title="Import Schools"
        description="Upload a CSV file containing school data"
        size="md"
      >
        <div className="grid gap-4 py-4">
          <div className="grid items-center gap-4">
            <Label htmlFor="file">CSV File</Label>
            <div className="flex items-center gap-2">
              <Input
                id="file"
                type="file"
                accept=".csv"
                onChange={handleFileChange}
                className="cursor-pointer"
              />
              {selectedFile && (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => setSelectedFile(null)}
                >
                  <X className="h-4 w-4" />
                </Button>
              )}
            </div>
            <p className="text-xs text-muted-foreground">
              {selectedFile ? selectedFile.name : "No file selected"}
            </p>
          </div>

          <div className="flex justify-end gap-2 mt-4">
            <Button variant="outline" onClick={() => setIsImportModalOpen(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleImport}
              disabled={!selectedFile || isLoading}
              className="gap-2"
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <FileUp className="h-4 w-4" />
              )}
              Import
            </Button>
          </div>
        </div>
      </Modal>

      {/* School Form Modal */}
      <Modal
        isOpen={isFormModalOpen}
        onClose={() => {
          setIsFormModalOpen(false);
          setSelectedSchool(null);
        }}
        title={selectedSchool ? "Edit School" : "Create New School"}
        description={
          selectedSchool 
            ? "Update the school information" 
            : "Fill in the details for the new school"
        }
        size="2xl"
      >
        <form onSubmit={handleSubmitSchool}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Basic Information */}
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">School Name*</Label>
                  <Input 
                    id="name" 
                    placeholder="Central High School" 
                    defaultValue={selectedSchool?.name || ""} 
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="district">District*</Label>
                  <Input 
                    id="district" 
                    placeholder="North District" 
                    defaultValue={selectedSchool?.district || ""} 
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="principal">Principal*</Label>
                  <Input 
                    id="principal" 
                    placeholder="Dr. Sarah Johnson" 
                    defaultValue={selectedSchool?.principal || ""} 
                    required
                  />
                </div>
              </div>

              {/* Contact Information */}
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email*</Label>
                  <Input 
                    id="email" 
                    type="email"
                    placeholder="contact@school.edu" 
                    defaultValue={selectedSchool?.email || ""} 
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone*</Label>
                  <Input 
                    id="phone" 
                    placeholder="+1 (555) 123-4567" 
                    defaultValue={selectedSchool?.phone || ""} 
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="website">Website</Label>
                  <Input 
                    id="website" 
                    placeholder="https://school.edu" 
                    defaultValue={selectedSchool?.website || ""} 
                  />
                </div>
              </div>

              {/* Location */}
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="address">Address*</Label>
                  <Input 
                    id="address" 
                    placeholder="123 Education Street" 
                    defaultValue={selectedSchool?.address || ""} 
                    required
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="city">City*</Label>
                    <Input 
                      id="city" 
                      placeholder="Metropolis" 
                      defaultValue={selectedSchool?.city || ""} 
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="postalCode">Postal Code*</Label>
                    <Input 
                      id="postalCode" 
                      placeholder="12345" 
                      defaultValue={selectedSchool?.postalCode || ""} 
                      required
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="country">Country*</Label>
                  <Input 
                    id="country" 
                    placeholder="Country" 
                    defaultValue={selectedSchool?.country || ""} 
                    required
                  />
                </div>
              </div>

              {/* Statistics */}
              <div className="space-y-4">
                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="students">Students*</Label>
                    <Input 
                      id="students" 
                      type="number" 
                      min="0"
                      placeholder="500" 
                      defaultValue={selectedSchool?.students || ""} 
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="teachers">Teachers*</Label>
                    <Input 
                      id="teachers" 
                      type="number" 
                      min="0"
                      placeholder="30" 
                      defaultValue={selectedSchool?.teachers || ""} 
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="courses">Courses*</Label>
                    <Input 
                      id="courses" 
                      type="number" 
                      min="0"
                      placeholder="20" 
                      defaultValue={selectedSchool?.courses || ""} 
                      required
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="establishmentDate">Establishment Date</Label>
                  <Input 
                    id="establishmentDate" 
                    type="date" 
                    defaultValue={selectedSchool?.lastUpdated.split('T')[0] || ""} 
                  />
                </div>
              </div>

              {/* Settings */}
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Switch 
                    id="status" 
                    defaultChecked={selectedSchool?.status === "active"} 
                  />
                  <Label htmlFor="status">Active School</Label>
                </div>
              </div>

              {/* Description */}
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="description">Description</Label>
                <Textarea 
                  id="description" 
                  placeholder="Brief description of the school" 
                  className="min-h-[100px]" 
                  defaultValue={selectedSchool?.description || ""} 
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-4">
              <Button 
                variant="outline" 
                type="button"
                onClick={() => {
                  setIsFormModalOpen(false);
                  setSelectedSchool(null);
                }}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                ) : selectedSchool ? (
                  <Save className="h-4 w-4 mr-2" />
                ) : (
                  <Plus className="h-4 w-4 mr-2" />
                )}
                {selectedSchool ? "Update School" : "Create School"}
              </Button>
            </div>
          </div>
        </form>
      </Modal>
    </div>
  );
}