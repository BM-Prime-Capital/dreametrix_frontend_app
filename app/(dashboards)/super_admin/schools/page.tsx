"use client";

import { useCallback, useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  School,
  Plus,
  Search,
  Frown,
  ChevronLeft,
  ChevronRight,
  Filter,
  Download,
  Users,
  BookOpen,
  MapPin,
  FileUp,
  X,
  Save,
  Loader2,
  CheckCircle
} from "lucide-react";
import { Modal } from "@/components/ui/Modal";
import { useRequestInfo } from "@/hooks/useRequestInfo";
import { getAllSchools, getSchoolCreationRequests } from "@/services/super-admin-service";

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
  pendingValidation: boolean;
  lastUpdated: string;
};

type ApiSchool = {
  id: number;
  name: string;
  email: string;
  phone_number: string;
  region: string;
  city: string;
  address: string;
  country: {
    code: string;
    name: string;
  };
  is_active: boolean;
  on_trial: boolean;
  created_at: string;
  last_update: string;
};

type SchoolRequest = {
  id: number;
  name: string;
  school_email: string;
  administrator_email: string;
  phone: string;
  country: string;
  city: string;
  address: string;
  region: string;
  is_reviewed: boolean;
  is_approved: boolean | null;
  is_denied: boolean | null;
  created_at: string;
};

const SchoolCardSkeleton = () => (
  <Card className="p-4 animate-pulse h-full">
    <div className="flex flex-col h-full">
      <div className="p-3 bg-gray-200 rounded-lg w-fit mb-3">
        <div className="h-6 w-6 bg-gray-300 rounded"></div>
      </div>
      <div className="flex-1">
        <div className="flex items-center gap-2 mb-2">
          <div className="h-6 bg-gray-200 rounded flex-1"></div>
          <div className="h-5 w-16 bg-gray-200 rounded"></div>
        </div>
        <div className="flex items-center gap-1 mb-3">
          <div className="h-3 w-3 bg-gray-200 rounded"></div>
          <div className="h-4 bg-gray-200 rounded flex-1"></div>
        </div>
        <div className="grid grid-cols-3 gap-2 text-sm">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="flex flex-col items-center p-2 bg-gray-100 rounded">
              <div className="h-4 w-4 bg-gray-200 rounded mb-1"></div>
              <div className="h-4 w-8 bg-gray-200 rounded"></div>
            </div>
          ))}
        </div>
      </div>
      <div className="h-3 bg-gray-200 rounded mt-3 pt-2 border-t"></div>
    </div>
  </Card>
);

const HeaderSkeleton = () => (
  <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
    <div>
      <div className="h-7 w-48 bg-gray-200 rounded mb-2"></div>
      <div className="h-4 w-32 bg-gray-200 rounded"></div>
    </div>
    <div className="flex gap-2 w-full md:w-auto">
      {[...Array(3)].map((_, i) => (
        <div key={i} className="h-9 w-24 bg-gray-200 rounded"></div>
      ))}
    </div>
  </div>
);

// Squelette pour la barre de recherche et filtres
const SearchBarSkeleton = () => (
  <Card className="p-4">
    <div className="flex flex-col md:flex-row gap-4">
      <div className="relative flex-1">
        <div className="h-10 bg-gray-200 rounded"></div>
      </div>
      <div className="flex gap-2">
        {[...Array(2)].map((_, i) => (
          <div key={i} className="h-9 w-36 bg-gray-200 rounded"></div>
        ))}
      </div>
    </div>
  </Card>
);

export default function SchoolsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [isApproveModalOpen, setIsApproveModalOpen] = useState(false);
  const [selectedSchool, setSelectedSchool] = useState<School | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingSchools, setIsLoadingSchools] = useState(true);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [showPendingOnly, setShowPendingOnly] = useState(false);
  const [showActiveOnly, setShowActiveOnly] = useState(false);
  const { accessToken } = useRequestInfo();
  const [schools, setSchools] = useState<School[]>([]);
  const [schoolRequests, setSchoolRequests] = useState<SchoolRequest[]>([]);

  const loadAllData = useCallback(async () => {
    if (!accessToken) return;
    
    setIsLoadingSchools(true);
    try {
      const [schoolsResponse, requestsResponse] = await Promise.all([
        getAllSchools(accessToken),
        getSchoolCreationRequests(accessToken)
      ]);

      const apiSchools: ApiSchool[] = schoolsResponse.results || [];
      const formattedSchools: School[] = apiSchools.map(school => ({
        id: school.id.toString(),
        name: school.name,
        district: school.region,
        address: school.address,
        city: school.city,
        postalCode: "",
        country: school.country.name || school.country.code,
        phone: school.phone_number,
        email: school.email,
        principal: "",
        description: "",
        students: 0,
        teachers: 0,
        courses: 0,
        status: school.is_active ? "active" : "inactive",
        pendingValidation: false,
        lastUpdated: school.last_update
      }));

      const requests: SchoolRequest[] = requestsResponse.results || [];
      setSchoolRequests(requests);
      
      const pendingRequests: School[] = requests
        .filter(req => !req.is_reviewed && req.is_approved === null)
        .map(req => ({
          id: `request-${req.id}`,
          name: req.name,
          district: req.region,
          address: req.address,
          city: req.city,
          postalCode: "",
          country: req.country,
          phone: req.phone,
          email: req.school_email,
          principal: req.administrator_email,
          description: "",
          students: 0,
          teachers: 0,
          courses: 0,
          status: "pending",
          pendingValidation: true,
          lastUpdated: req.created_at
        }));

      setSchools([...formattedSchools, ...pendingRequests]);
      
    } catch (error) {
      console.error("Error loading data:", error);
      setSchools([]);
      setSchoolRequests([]);
    } finally {
      setIsLoadingSchools(false);
    }
  }, [accessToken]);

  useEffect(() => {
    loadAllData();
  }, [loadAllData]);

  const refreshData = async () => {
    setIsLoading(true);
    try {
      await loadAllData();
    } finally {
      setIsLoading(false);
    }
  };

  const filteredSchools = schools.filter(school => {
    const matchesSearch = school.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      school.district.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (showPendingOnly) {
      return matchesSearch && school.pendingValidation;
    }
    
    if (showActiveOnly) {
      return matchesSearch && school.status === "active" && !school.pendingValidation;
    }
    
    return matchesSearch;
  });

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setSelectedFile(e.target.files[0]);
    }
  };

  const handleImport = async () => {
    if (!selectedFile) return;
    
    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      console.log("Importing file:", selectedFile.name);
      setIsImportModalOpen(false);
      setSelectedFile(null);
      await refreshData();
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmitSchool = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      if (selectedSchool) {
        console.log("Updating school");
      } else {
        console.log("Creating new school");
      }
      
      setIsFormModalOpen(false);
      setSelectedSchool(null);
      await refreshData();
    } finally {
      setIsLoading(false);
    }
  };

  const handleApproveSchool = async () => {
    if (!selectedSchool) return;
    
    setIsLoading(true);
    try {
      const requestId = parseInt(selectedSchool.id.replace('request-', ''));
      const schoolRequest = schoolRequests.find(req => req.id === requestId);
      
      if (schoolRequest) {
        
        const response = await fetch(`https://backend-dreametrix.com/school-requests/${requestId}/`, {
          method: "PUT",
          // headers: {
          //   "Content-Type": "application/json",
          //   Authorization: `Basic ${credentials}`,
          // },

          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
          },

          
          body: JSON.stringify({
            ...schoolRequest,
            is_approved: true,
            is_reviewed: true
          })
        });

        if (!response.ok) {
          throw new Error("Failed to approve school");
        }

        console.log("School approved:", selectedSchool.name);
      }
      
      setIsApproveModalOpen(false);
      setIsFormModalOpen(false);
      setSelectedSchool(null);
      await refreshData();
    } catch (error) {
      console.error("Error approving school:", error);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoadingSchools) {
    return (
      <div className="flex flex-col gap-6 w-full">
        <HeaderSkeleton />
        <SearchBarSkeleton />
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {[...Array(8)].map((_, i) => (
            <SchoolCardSkeleton key={i} />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 w-full">
      {isLoadingSchools ? (
        <HeaderSkeleton />
      ) : (
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
            <Button
              variant="outline"
              className="gap-2"
              onClick={refreshData}
              disabled={isLoading}
            >
              {isLoading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Users className="h-4 w-4" />
              )}
              Refresh
            </Button>
          </div>
        </div>
      )}

      {isLoadingSchools ? (
        <SearchBarSkeleton />
      ) : (
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
            <div className="flex gap-2">
              <Button 
                variant={showPendingOnly ? "default" : "outline"} 
                className="gap-2"
                onClick={() => {
                  setShowPendingOnly(!showPendingOnly);
                  setShowActiveOnly(false);
                }}
              >
                <Filter className="h-4 w-4" />
                Pending Validation
              </Button>
              <Button 
                variant={showActiveOnly ? "default" : "outline"} 
                className="gap-2"
                onClick={() => {
                  setShowActiveOnly(!showActiveOnly);
                  setShowPendingOnly(false);
                }}
              >
                <Filter className="h-4 w-4" />
                Active Schools
              </Button>
            </div>
          </div>
        </Card>
      )}

      {isLoadingSchools ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {[...Array(8)].map((_, i) => (
            <SchoolCardSkeleton key={i} />
          ))}
        </div>
      ) : filteredSchools.length > 0 ? (
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
                    <div className="flex gap-1">
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
            {showPendingOnly 
              ? "No schools are pending validation. Try adjusting your search or filters."
              : showActiveOnly
              ? "No active schools found. Try adjusting your search or filters."
              : "No schools match your search criteria. Try adjusting your search or filters."
            }
          </p>
          <Button variant="outline" onClick={() => {
            setSearchQuery("");
            setShowPendingOnly(false);
            setShowActiveOnly(false);
          }}>
            Clear filters
          </Button>
        </Card>
      )}

      {!isLoadingSchools && filteredSchools.length > 0 && (
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

      <Modal
        isOpen={isFormModalOpen}
        onClose={() => {
          setIsFormModalOpen(false);
          setSelectedSchool(null);
        }}
        title={selectedSchool ? "School Details" : "Create New School"}
        description={
          selectedSchool 
            ? "View and manage school information" 
            : "Fill in the details for the new school"
        }
        size="2xl"
      >
        <form onSubmit={handleSubmitSchool}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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

              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Switch 
                    id="status" 
                    defaultChecked={selectedSchool?.status === "active"} 
                  />
                  <Label htmlFor="status">Active School</Label>
                </div>
              </div>

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

            <div className="flex justify-between items-center pt-4 border-t">
              {selectedSchool?.pendingValidation && (
                <Button 
                  type="button"
                  onClick={() => setIsApproveModalOpen(true)}
                  className="gap-2"
                >
                  <CheckCircle className="h-4 w-4" />
                  Approve School
                </Button>
              )}
              
              <div className="flex gap-2 ml-auto">
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
          </div>
        </form>
      </Modal>

      <Modal
        isOpen={isApproveModalOpen}
        onClose={() => setIsApproveModalOpen(false)}
        title="Approve School"
        description={`Are you sure you want to approve ${selectedSchool?.name}? This action cannot be undone.`}
        size="sm"
      >
        <div className="flex justify-end gap-2 mt-4">
          <Button 
            variant="outline" 
            onClick={() => setIsApproveModalOpen(false)}
          >
            Cancel
          </Button>
          <Button 
            onClick={handleApproveSchool}
            disabled={isLoading}
            className="gap-2"
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <CheckCircle className="h-4 w-4" />
            )}
            Approve
          </Button>
        </div>
      </Modal>
    </div>
  );
}