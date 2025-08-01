"use client";

import { useState } from "react";
import { Search, Filter, Plus, Download, Frown } from "lucide-react";

import { District } from "@/types";
import { DistrictCard } from "@/components/super_admin/districts/DistrictCard";
import { DistrictFormModal } from "@/components/super_admin/districts/DistrictFormModal";
import { DistrictImportModal } from "@/components/super_admin/districts/DistrictImportModal";
import { DistrictDetailsModal } from "@/components/super_admin/districts/DistrictDetailsModal";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

export default function DistrictsPage() {
  const [searchQuery, setSearchQuery] = useState("");
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [selectedDistrict, setSelectedDistrict] = useState<District | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Liste de districts de test
  const [districts, setDistricts] = useState<District[]>([
    {
      id: "1",
      name: "North District",
      code: "ND001",
      region: "Northern Region",
      superintendent: "Dr. Emily Johnson",
      email: "contact@northdistrict.edu",
      phone: "+1 (555) 123-4567",
      address: "123 Education Blvd",
      city: "Metropolis",
      state: "State",
      postalCode: "12345",
      country: "Country",
      website: "https://northdistrict.edu",
      description: "Serving schools in the northern region with excellence",
      schoolsCount: 12,
      studentsCount: 8500,
      staffCount: 650,
      status: "active",
      establishedDate: "1995-05-15",
      lastUpdated: "2023-10-20"
    },
    {
      id: "2",
      name: "South District",
      code: "SD002",
      region: "Southern Region",
      superintendent: "Mr. Robert Chen",
      email: "info@southdistrict.edu",
      phone: "+1 (555) 987-6543",
      address: "456 Sunshine Ave",
      city: "Sunnyvale",
      state: "State",
      postalCode: "67890",
      country: "Country",
      website: "https://southdistrict.edu",
      description: "Innovative education for the southern communities",
      schoolsCount: 15,
      studentsCount: 10200,
      staffCount: 780,
      status: "active",
      establishedDate: "1988-08-22",
      lastUpdated: "2023-11-15"
    },
    {
      id: "3",
      name: "East District",
      code: "ED003",
      region: "Eastern Region",
      superintendent: "Ms. Linda Martinez",
      email: "admin@eastdistrict.edu",
      phone: "+1 (555) 456-7890",
      address: "789 River Rd",
      city: "Rivertown",
      state: "State",
      postalCode: "34567",
      country: "Country",
      description: "Focused on arts and environmental education",
      schoolsCount: 8,
      studentsCount: 5200,
      staffCount: 420,
      status: "active",
      establishedDate: "2002-03-10",
      lastUpdated: "2024-01-05"
    },
    {
      id: "4",
      name: "West District",
      code: "WD004",
      region: "Western Region",
      superintendent: "Dr. James Wilson",
      email: "support@westdistrict.edu",
      phone: "+1 (555) 234-5678",
      address: "321 Mountain View",
      city: "Westwood",
      state: "State",
      postalCode: "89012",
      country: "Country",
      schoolsCount: 10,
      studentsCount: 6800,
      staffCount: 550,
      status: "inactive",
      establishedDate: "1999-11-18",
      lastUpdated: "2023-12-01"
    },
    {
      id: "5",
      name: "Central District",
      code: "CD005",
      region: "Central Region",
      superintendent: "Dr. Sarah Williams",
      email: "contact@centraldistrict.edu",
      phone: "+1 (555) 345-6789",
      address: "500 Central Plaza",
      city: "Centerville",
      state: "State",
      postalCode: "45678",
      country: "Country",
      website: "https://centraldistrict.edu",
      description: "The heart of our educational system",
      schoolsCount: 20,
      studentsCount: 15000,
      staffCount: 950,
      status: "active",
      establishedDate: "1975-09-01",
      lastUpdated: "2024-02-15"
    }
  ]);

  const filteredDistricts = districts.filter(district =>
    district.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    district.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
    district.region.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleCreateDistrict = async (data: Omit<District, "id">) => {
    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      const newDistrict = { 
        ...data, 
        id: Date.now().toString(),
        lastUpdated: new Date().toISOString()
      };
      setDistricts([...districts, newDistrict]);
      setIsFormModalOpen(false);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateDistrict = async (data: Omit<District, "id">) => {
    if (!selectedDistrict) return;
    
    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      const updatedDistrict = { 
        ...data, 
        id: selectedDistrict.id,
        lastUpdated: new Date().toISOString()
      };
      setDistricts(districts.map(d => d.id === updatedDistrict.id ? updatedDistrict : d));
      setIsFormModalOpen(false);
      setSelectedDistrict(null);
    } finally {
      setIsLoading(false);
    }
  };

  const handleImportDistricts = async (file: File) => {
    setIsLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      console.log("Importing file:", file.name);
      setIsImportModalOpen(false);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col gap-6 w-full">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold">Districts Management</h1>
          <p className="text-sm text-gray-500">
            Manage all school districts in your system ({districts.length} total)
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
              setSelectedDistrict(null);
              setIsFormModalOpen(true);
            }}
          >
            <Plus className="h-4 w-4" />
            Add District
          </Button>
        </div>
      </div>

      {/* Search Bar */}
      <Card className="p-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search districts by name, code or region..."
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

      {/* Districts List */}
      {filteredDistricts.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredDistricts.map((district) => (
            <DistrictCard
              key={district.id}
              district={district}
              onClick={() => {
                setSelectedDistrict(district);
                setIsDetailsModalOpen(true);
              }}
            />
          ))}
        </div>
      ) : (
        <Card className="p-12 flex flex-col items-center justify-center gap-4">
          <Frown className="h-12 w-12 text-gray-400" />
          <h3 className="font-medium text-lg">No districts found</h3>
          <p className="text-sm text-gray-500 max-w-md text-center">
            No districts match your search criteria. Try adjusting your search or filters.
          </p>
          <Button variant="outline" onClick={() => setSearchQuery("")}>
            Clear search
          </Button>
        </Card>
      )}

      {/* Modals */}
      <DistrictFormModal
        isOpen={isFormModalOpen}
        onClose={() => {
          setIsFormModalOpen(false);
          setSelectedDistrict(null);
        }}
        district={selectedDistrict!}
        onSubmit={selectedDistrict ? handleUpdateDistrict : handleCreateDistrict}
        isLoading={isLoading}
      /> 

      <DistrictImportModal
        isOpen={isImportModalOpen}
        onClose={() => setIsImportModalOpen(false)}
        onImport={handleImportDistricts}
        isLoading={isLoading}
      />

      {selectedDistrict && (
        <DistrictDetailsModal
          isOpen={isDetailsModalOpen}
          onClose={() => {
            setIsDetailsModalOpen(false);
            setSelectedDistrict(null);
          }}
          district={selectedDistrict}
          onEdit={() => {
            setIsDetailsModalOpen(false);
            setIsFormModalOpen(true);
          }}
        />
      )}
    </div>
  );
}