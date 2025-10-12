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
  CheckCircle,
  RefreshCw,
} from "lucide-react";
import { Modal } from "@/components/ui/Modal";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useRequestInfo } from "@/hooks/useRequestInfo";
import { getAllSchools, getSchoolCreationRequests } from "@/services/super-admin-service";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useUSSchools, type USOfficialSchool } from "@/hooks/useUSSchools";
import { USSchoolContextMenu } from "@/components/schools/USSchoolContextMenu";
import { DeleteSchoolDialog } from "@/components/schools/DeleteSchoolDialog";
import { useToast } from "@/components/ui/use-toast";

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
  // Tab management
  const [activeTab, setActiveTab] = useState<"platform" | "official">("platform");

  // Platform schools state
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
  const [schools, setSchools] = useState<School[]>([]);
  const [schoolRequests, setSchoolRequests] = useState<SchoolRequest[]>([]);

  // US Official schools state
  const [selectedUSSchool, setSelectedUSSchool] = useState<USOfficialSchool | null>(null);
  const [isUSSchoolViewModalOpen, setIsUSSchoolViewModalOpen] = useState(false);
  const [isUSSchoolEditModalOpen, setIsUSSchoolEditModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [schoolToDelete, setSchoolToDelete] = useState<USOfficialSchool | null>(null);
  const [isSchoolOpen, setIsSchoolOpen] = useState(false);
  const [gradeOffered, setGradeOffered] = useState<Record<string, boolean>>({});
  const [schoolYearStart, setSchoolYearStart] = useState("");
  const [schoolYearEnd, setSchoolYearEnd] = useState("");
  const [effectiveDate, setEffectiveDate] = useState("");
  const [isCharterSchool, setIsCharterSchool] = useState(false);
  const [isOutOfState, setIsOutOfState] = useState(false);
  const [schoolLevel, setSchoolLevel] = useState("");
  const [schoolType, setSchoolType] = useState("");

  const { accessToken } = useRequestInfo();
  const { toast } = useToast();

  // Use the custom hook for US Schools management
  const {
    schools: usSchools,
    isLoading: isLoadingUSSchools,
    currentPage: usSchoolsPage,
    totalPages: usSchoolsTotalPages,
    totalCount: usSchoolsTotalCount,
    loadSchools: loadUSOfficialSchools,
    refreshSchools: refreshUSSchools,
    nextPage: nextUSSchoolsPage,
    previousPage: previousUSSchoolsPage,
    deleteSchool: deleteUSSchool,
    updateSchool: updateUSSchool,
    createSchool: createUSSchool,
    searchSchools: searchUSSchools,
    clearSearch: clearUSSchoolsSearch,
    searchQuery: usSchoolsSearchQuery,
  } = useUSSchools(accessToken || "");

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

  useEffect(() => {
    if (activeTab === "official") {
      loadUSOfficialSchools(1);
    }
  }, [activeTab, loadUSOfficialSchools]);

  const refreshData = async () => {
    setIsLoading(true);
    try {
      await loadAllData();
    } catch (error) {
      console.error("Error refreshing data:", error);
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
    } catch (error) {
      console.error("Error importing file:", error);
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
    } catch (error) {
      console.error("Error submitting school:", error);
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

  // US Schools CRUD handlers
  const handleViewUSSchool = useCallback((school: USOfficialSchool) => {
    setSelectedUSSchool(school);
    setIsUSSchoolViewModalOpen(true);
  }, []);

  const handleEditUSSchool = useCallback((school: USOfficialSchool) => {
    setSelectedUSSchool(school);
    setIsSchoolOpen(school.SY_STATUS_TEXT === "Open");

    // Initialize grade offered state
    const gradeKeys = [
      "G_PK_OFFERED", "G_KG_OFFERED", "G_1_OFFERED", "G_2_OFFERED", "G_3_OFFERED",
      "G_4_OFFERED", "G_5_OFFERED", "G_6_OFFERED", "G_7_OFFERED", "G_8_OFFERED",
      "G_9_OFFERED", "G_10_OFFERED", "G_11_OFFERED", "G_12_OFFERED", "G_13_OFFERED",
      "G_AE_OFFERED", "G_UG_OFFERED"
    ];

    const initialGrades: Record<string, boolean> = {};
    gradeKeys.forEach(key => {
      initialGrades[key] = school[key as keyof USOfficialSchool] === "Yes";
    });
    setGradeOffered(initialGrades);

    // Initialize school year and effective date
    const schoolYearValue = school.SCHOOL_YEAR || "";
    if (schoolYearValue.includes('-')) {
      const [start, end] = schoolYearValue.split('-');
      setSchoolYearStart(start.trim());
      setSchoolYearEnd(end.trim());
    } else {
      setSchoolYearStart(schoolYearValue);
      setSchoolYearEnd("");
    }
    setEffectiveDate(school.EFFECTIVE_DATE ? new Date(school.EFFECTIVE_DATE).toISOString().split('T')[0] : "");

    // Initialize boolean fields
    setIsCharterSchool(school.CHARTER_TEXT === "Yes");
    setIsOutOfState(school.OUT_OF_STATE_FLAG === "Yes");

    // Initialize school level
    setSchoolLevel(school.LEVEL || "");
    
    // Initialize school type
    setSchoolType(school.SCH_TYPE_TEXT || "");
    
    setIsUSSchoolEditModalOpen(true);
  }, []);

  const handleDeleteUSSchool = (school: USOfficialSchool) => {
    setSchoolToDelete(school);
    setIsDeleteDialogOpen(true);
  };

  const handleCardClick = (school: USOfficialSchool) => {
    handleViewUSSchool(school);
  };

  const handleGradeChange = (gradeKey: string, checked: boolean) => {
    setGradeOffered(prev => ({
      ...prev,
      [gradeKey]: checked
    }));
  };

  const confirmDeleteUSSchool = async () => {
    if (!schoolToDelete) return;

    const result = await deleteUSSchool(schoolToDelete.id);

    if (result.success) {
      toast({
        title: "Success",
        description: `School "${schoolToDelete.SCH_NAME}" deleted successfully`,
      });
      setIsDeleteDialogOpen(false);
      setSchoolToDelete(null);
    } else {
      console.error("Failed to delete school:", result.message);
      toast({
        title: "Error",
        description: result.message || "Failed to delete school",
        variant: "destructive",
      });
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
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold">Schools Management</h1>
          <p className="text-sm text-gray-500">
            Manage official US schools database and platform school registrations
          </p>
        </div>
      </div>

      {/* Tabbed Interface */}
      <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as "platform" | "official")} className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="platform" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            Platform Schools ({schools.length})
          </TabsTrigger>
          <TabsTrigger value="official" className="flex items-center gap-2">
            <School className="h-4 w-4" />
            US Schools Database ({usSchoolsTotalCount})
          </TabsTrigger>
        </TabsList>

        {/* Platform Schools Tab */}
        <TabsContent value="platform" className="space-y-6">
          {/* Platform Schools Header */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h2 className="text-xl font-semibold">Platform Schools</h2>
              <p className="text-sm text-gray-500">
                Manage schools registered on the platform ({schools.length} total)
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

          {/* Platform Schools Search and Filters */}
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

          {/* Platform Schools Grid */}
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

          {/* Platform Schools Pagination */}
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
        </TabsContent>

        {/* US Schools Database Tab */}
        <TabsContent value="official" className="space-y-6">
          {/* US Schools Header */}
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h2 className="text-xl font-semibold">US Schools Database</h2>
              <p className="text-sm text-gray-500">
                Official directory of US schools ({usSchoolsTotalCount} total)
              </p>
            </div>
            <div className="flex gap-2 w-full md:w-auto">

              <Button
                variant="outline"
                className="gap-2"
                onClick={async () => {
                  try {
                    await refreshUSSchools();
                    toast({
                      title: "Success",
                      description: "US Schools list refreshed successfully",
                    });
                  } catch (error) {
                    console.error("Error refreshing US schools:", error);
                    toast({
                      title: "Error",
                      description: "Failed to refresh US schools list",
                      variant: "destructive",
                    });
                  }
                }}
                disabled={isLoadingUSSchools}
              >
                 {isLoadingUSSchools ? (
                   <Loader2 className="h-4 w-4 animate-spin" />
                 ) : (
                   <RefreshCw className="h-4 w-4" />
                 )}
                Refresh
              </Button>
              <Button
                className="gap-2"
                onClick={() => {
                  // Reset form state for new school
                  setIsSchoolOpen(false);
                  setGradeOffered({});
                  setSchoolYearStart("");
                  setSchoolYearEnd("");
                  setEffectiveDate("");
                  setIsCharterSchool(false);
                  setIsOutOfState(false);
                  setSchoolLevel("");
                  setSchoolType("");
                  setSelectedUSSchool(null);
                  setIsUSSchoolEditModalOpen(true);
                }}
              >
                <Plus className="h-4 w-4" />
                Add US School
              </Button>
            </div>
          </div>

          {/* US Schools Search */}
          <Card className="p-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Search by school name, city, state, or district..."
                  className="pl-10"
                  value={usSchoolsSearchQuery}
                  onChange={(e) => {
                    const query = e.target.value;
                    if (query.trim()) {
                      searchUSSchools(query);
                    } else {
                      clearUSSchoolsSearch();
                    }
                  }}
                />
              </div>
            </div>
          </Card>

          {/* US Schools Grid */}
          {isLoadingUSSchools ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {[...Array(8)].map((_, i) => (
                <SchoolCardSkeleton key={i} />
              ))}
            </div>
          ) : usSchools.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {usSchools.map((school) => (
                <Card
                  key={school.id}
                  className="hover:shadow-md transition-shadow cursor-pointer h-full"
                  onClick={() => handleCardClick(school)}
                >
                  <div className="p-4 flex flex-col h-full">
                    <div className="flex items-start justify-between mb-3">
                      <div className="p-3 bg-green-100 rounded-lg text-green-600 w-fit">
                        <School className="h-6 w-6" />
                      </div>
                       <USSchoolContextMenu
                         school={school}
                         onView={handleViewUSSchool}
                         onEdit={handleEditUSSchool}
                         onDelete={handleDeleteUSSchool}
                       />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="font-semibold text-lg truncate">{school.SCH_NAME}</h3>
                        <Badge variant="outline" className="shrink-0 text-xs">
                          {school.ST}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600 mb-2 flex items-center gap-1">
                        <MapPin className="h-3 w-3" />
                        <span className="truncate">{school.MCITY}, {school.STATENAME}</span>
                      </p>
                      <p className="text-sm text-gray-500 mb-3 truncate">
                        {school.LEA_NAME}
                      </p>
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div className="flex flex-col items-center p-2 bg-gray-50 rounded">
                          <span className="text-xs text-gray-500">Level</span>
                          <span className="font-medium">{school.LEVEL}</span>
                        </div>
                        <div className="flex flex-col items-center p-2 bg-gray-50 rounded">
                          <span className="text-xs text-gray-500">Status</span>
                          <span className="font-medium">{school.SY_STATUS_TEXT}</span>
                        </div>
                      </div>
                    </div>
                    <div className="text-xs text-gray-500 mt-3 pt-2 border-t">
                      Grades: {school.GSLO}-{school.GSHI}
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
                No US schools match your search criteria. Try adjusting your search terms.
              </p>
              <Button variant="outline" onClick={() => clearUSSchoolsSearch()}>
                Clear search
              </Button>
            </Card>
          )}

          {/* US Schools Pagination */}
          {!isLoadingUSSchools && usSchools.length > 0 && (
            <div className="flex items-center justify-between mt-6">
              <Button
                variant="outline"
                className="gap-2"
                onClick={() => previousUSSchoolsPage()}
                disabled={usSchoolsPage <= 1 || isLoadingUSSchools}
              >
                <ChevronLeft className="h-4 w-4" />
                Previous
              </Button>
              <div className="text-sm text-gray-500">
                Page {usSchoolsPage} of {usSchoolsTotalPages}
              </div>
              <Button
                variant="outline"
                className="gap-2"
                onClick={() => nextUSSchoolsPage()}
                disabled={usSchoolsPage >= usSchoolsTotalPages || isLoadingUSSchools}
              >
                Next
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          )}
        </TabsContent>
      </Tabs>

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

{/* Create/view platform schools */}
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
        <form onSubmit={handleSubmitSchool} className="flex flex-col h-full max-h-[80vh]">
          {/* Scrollable Body */}
          <div className="flex-1 overflow-y-auto px-6 py-4">
            <div className="grid gap-4">
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
            </div>
          </div>

          {/* Fixed Footer */}
          <div className="flex-shrink-0 px-6 py-4 border-t bg-gray-50">
            <div className="flex justify-between items-center">
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

      {/* US School View Modal */}
      <Dialog open={isUSSchoolViewModalOpen} onOpenChange={(open) => {
        if (!open) {
          setIsUSSchoolViewModalOpen(false);
          setSelectedUSSchool(null);
        }
      }}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-hidden flex flex-col">
          <DialogHeader>
            <DialogTitle>US School Details</DialogTitle>
            <DialogDescription>View official school information from the US database</DialogDescription>
          </DialogHeader>
          <div className="flex-1 overflow-y-auto">
        {selectedUSSchool ? (
          <div className="space-y-6 py-4">
            {/* Basic Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <Label className="text-sm font-medium text-gray-700">School Name</Label>
                  <p className="text-lg font-semibold">{selectedUSSchool.SCH_NAME}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-700">District</Label>
                  <p className="text-sm">{selectedUSSchool.LEA_NAME}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-700">School Level</Label>
                  <p className="text-sm">{selectedUSSchool.LEVEL}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-700">School Type</Label>
                  <p className="text-sm">{selectedUSSchool.SCH_TYPE_TEXT}</p>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <Label className="text-sm font-medium text-gray-700">Address</Label>
                  <p className="text-sm">
                    {selectedUSSchool.MSTREET1}<br />
                    {selectedUSSchool.MCITY}, {selectedUSSchool.MSTATE} {selectedUSSchool.MZIP}
                  </p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-700">Phone</Label>
                  <p className="text-sm">{selectedUSSchool.PHONE}</p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-700">Website</Label>
                  <p className="text-sm">
                    {selectedUSSchool.WEBSITE ? (
                      <a href={selectedUSSchool.WEBSITE} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
                        {selectedUSSchool.WEBSITE}
                      </a>
                    ) : (
                      "Not available"
                    )}
                  </p>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-700">Status</Label>
                  <Badge variant={selectedUSSchool.SY_STATUS_TEXT === "Open" ? "default" : "destructive"}>
                    {selectedUSSchool.SY_STATUS_TEXT}
                  </Badge>
                </div>
              </div>
            </div>

            {/* Grades Offered */}
            <div>
              <Label className="text-sm font-medium text-gray-700">Grades Offered</Label>
              <div className="grid grid-cols-6 gap-2 mt-2">
                {[
                  { key: "G_PK_OFFERED", label: "PK" },
                  { key: "G_KG_OFFERED", label: "K" },
                  { key: "G_1_OFFERED", label: "1" },
                  { key: "G_2_OFFERED", label: "2" },
                  { key: "G_3_OFFERED", label: "3" },
                  { key: "G_4_OFFERED", label: "4" },
                  { key: "G_5_OFFERED", label: "5" },
                  { key: "G_6_OFFERED", label: "6" },
                  { key: "G_7_OFFERED", label: "7" },
                  { key: "G_8_OFFERED", label: "8" },
                  { key: "G_9_OFFERED", label: "9" },
                  { key: "G_10_OFFERED", label: "10" },
                  { key: "G_11_OFFERED", label: "11" },
                  { key: "G_12_OFFERED", label: "12" },
                  { key: "G_13_OFFERED", label: "13" },
                  { key: "G_AE_OFFERED", label: "AE" },
                  { key: "G_UG_OFFERED", label: "UG" }
                ].map(grade => {
                  const isOffered = selectedUSSchool && selectedUSSchool[grade.key as keyof USOfficialSchool] === "Yes";
                  return (
                    <div key={grade.key} className={`p-2 rounded text-center text-sm ${isOffered ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-500"}`}>
                      {grade.label}
                    </div>
                  );
                })}
              </div>
              <p className="text-xs text-gray-500 mt-2">
                Grade Range: {selectedUSSchool.GSLO} - {selectedUSSchool.GSHI}
              </p>
            </div>

            {/* Additional Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label className="text-sm font-medium text-gray-700">School Year</Label>
                <p className="text-sm">{selectedUSSchool.SCHOOL_YEAR || "Not specified"}</p>
              </div>
              <div>
                <Label className="text-sm font-medium text-gray-700">Effective Date</Label>
                <p className="text-sm">
                  {selectedUSSchool.EFFECTIVE_DATE
                    ? new Date(selectedUSSchool.EFFECTIVE_DATE).toLocaleDateString('en-CA') // YYYY-MM-DD format
                    : "Not specified"
                  }
                </p>
              </div>
              <div>
                <Label className="text-sm font-medium text-gray-700">Charter School</Label>
                <p className="text-sm">{selectedUSSchool.CHARTER_TEXT}</p>
              </div>
              <div>
                <Label className="text-sm font-medium text-gray-700">Out of State</Label>
                <p className="text-sm">{selectedUSSchool.OUT_OF_STATE_FLAG}</p>
              </div>
            </div>

            {/* Identifiers */}
            <div className="border-t pt-4">
              <Label className="text-sm font-medium text-gray-700">School Identifiers</Label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2 text-xs">
                <div>
                  <span className="font-medium">NCES ID:</span> {selectedUSSchool.NCESSCH}
                </div>
                <div>
                  <span className="font-medium">State School ID:</span> {selectedUSSchool.ST_SCHID}
                </div>
                <div>
                  <span className="font-medium">LEA ID:</span> {selectedUSSchool.LEAID}
                </div>
                <div>
                  <span className="font-medium">State LEA ID:</span> {selectedUSSchool.ST_LEAID}
                </div>
              </div>
            </div>

            <div className="flex justify-end pt-4 border-t">
              <Button
                variant="outline"
                onClick={() => {
                  setIsUSSchoolViewModalOpen(false);
                  setSelectedUSSchool(null);
                }}
              >
                Close
              </Button>
            </div>
          </div>
        ) : (
          <div className="p-8 text-center">
            <p className="text-gray-500">No school selected</p>
          </div>
        )}
          </div>
        </DialogContent>
      </Dialog>

      {/* US School Edit Modal */}
      <Dialog open={isUSSchoolEditModalOpen} onOpenChange={(open) => {
        if (!open) {
          setIsUSSchoolEditModalOpen(false);
          setSelectedUSSchool(null);
        }
      }}>
        <DialogContent className="max-w-4xl max-h-[90vh] flex flex-col">
          <DialogHeader className="flex-shrink-0">
            <DialogTitle>{selectedUSSchool ? "Edit US School" : "Add New US School"}</DialogTitle>
            <DialogDescription>
              {selectedUSSchool ? "Update school information" : "Fill in the details for the new school"}
            </DialogDescription>
          </DialogHeader>
          <div className="flex-1 overflow-y-auto">
            <form onSubmit={async (e) => {
                e.preventDefault();

                try {
                  setIsLoading(true);

                  // Validate required fields
                  if (!schoolLevel) {
                    toast({
                      title: "Validation Error",
                      description: "Please select a school level",
                      variant: "destructive",
                    });
                    return;
                  }
                  
                  if (!schoolType) {
                    toast({
                      title: "Validation Error",
                      description: "Please select a school type",
                      variant: "destructive",
                    });
                    return;
                  }

                  // Get form data
                  const formData = new FormData(e.currentTarget);

                  // Handle form submission with updated status and grades
                  const updatedStatus = isSchoolOpen ? "Open" : "Closed";

                  // Prepare grade data for API
                  const gradeData: Record<string, string> = {};
                  Object.keys(gradeOffered).forEach(key => {
                    gradeData[key] = gradeOffered[key] ? "Yes" : "No";
                  });

                  // Combine school years
                  const combinedSchoolYear = schoolYearEnd ? `${schoolYearStart}-${schoolYearEnd}` : schoolYearStart;

                  // Create the payload with form data mapped to API field names
                  const schoolData: Record<string, string | number> = {
                    // Map form fields to API field names
                    SCH_NAME: formData.get('schoolName') as string,
                    LEA_NAME: formData.get('district') as string,
                    LEVEL: schoolLevel,
                    SCH_TYPE_TEXT: schoolType,
                    MSTREET1: formData.get('address') as string,
                    MCITY: formData.get('city') as string,
                    MSTATE: formData.get('state') as string,
                    MZIP: parseInt(formData.get('zipCode') as string) || 0,
                    PHONE: formData.get('phone') as string,
                    WEBSITE: formData.get('website') as string,
                    // Status and other fields
                    SY_STATUS_TEXT: updatedStatus,
                    SCHOOL_YEAR: combinedSchoolYear,
                    EFFECTIVE_DATE: effectiveDate,
                    CHARTER_TEXT: isCharterSchool ? "Yes" : "No",
                    OUT_OF_STATE_FLAG: isOutOfState ? "Yes" : "No",
                    // Update all grade fields
                    ...gradeData,
                  };

                  if (selectedUSSchool) {
                    // Update existing school
                    console.log("Updating school with data:", schoolData);
                    const result = await updateUSSchool(selectedUSSchool.id, schoolData);

                    if (result.success) {
                      console.log("School updated successfully:", result.data);
                      toast({
                        title: "Success",
                        description: `School "${schoolData.SCH_NAME}" updated successfully`,
                      });
                      setIsUSSchoolEditModalOpen(false);
                      setSelectedUSSchool(null);
                    } else {
                      console.error("Failed to update school:", result.message);
                      toast({
                        title: "Error",
                        description: result.message || "Failed to update school",
                        variant: "destructive",
                      });
                    }
                  } else {
                    // Create new school
                    console.log("Creating new school with data:", schoolData);
                    const result = await createUSSchool(schoolData);

                    if (result.success) {
                      console.log("School created successfully:", result.data);
                      toast({
                        title: "Success",
                        description: `School "${schoolData.SCH_NAME}" created successfully`,
                      });
                      setIsUSSchoolEditModalOpen(false);
                      setSelectedUSSchool(null);
                    } else {
                      console.error("Failed to create school:", result.message);
                      toast({
                        title: "Error",
                        description: result.message || "Failed to create school",
                        variant: "destructive",
                      });
                    }
                  }
                } catch (error) {
                  console.error("Error processing school:", error);
                } finally {
                  setIsLoading(false);
                }
              }} className="space-y-6 px-6 py-4">
                {/* Basic Information */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="schoolName" className="text-sm font-medium text-gray-700">School Name*</Label>
                      <Input
                        id="schoolName"
                        name="schoolName"
                        defaultValue={selectedUSSchool?.SCH_NAME || ""}
                        className="mt-1"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="district" className="text-sm font-medium text-gray-700">District*</Label>
                      <Input
                        id="district"
                        name="district"
                        defaultValue={selectedUSSchool?.LEA_NAME || ""}
                        className="mt-1"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="schoolLevel" className="text-sm font-medium text-gray-700">School Level*</Label>
                      <Select value={schoolLevel} onValueChange={setSchoolLevel} required>
                        <SelectTrigger className="mt-1">
                          <SelectValue placeholder="Select school level" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Kindergarten">Kindergarten</SelectItem>
                          <SelectItem value="Elementary">Elementary</SelectItem>
                          <SelectItem value="Middle">Middle</SelectItem>
                          <SelectItem value="High">High</SelectItem>
                          <SelectItem value="Other">Other</SelectItem>
                          <SelectItem value="Not reported">Not reported</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label htmlFor="schoolType" className="text-sm font-medium text-gray-700">School Type*</Label>
                      <Select value={schoolType} onValueChange={setSchoolType} required>
                        <SelectTrigger className="mt-1">
                          <SelectValue placeholder="Select school type" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="Regular School">Regular School</SelectItem>
                          <SelectItem value="Public School">Public School</SelectItem>
                          <SelectItem value="Private School">Private School</SelectItem>
                          <SelectItem value="Other">Other</SelectItem>
                          <SelectItem value="Not reported">Not reported</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="address" className="text-sm font-medium text-gray-700">Address*</Label>
                      <Input
                        id="address"
                        name="address"
                        defaultValue={selectedUSSchool?.MSTREET1 || ""}
                        className="mt-1"
                        required
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="city" className="text-sm font-medium text-gray-700">City*</Label>
                        <Input
                          id="city"
                          name="city"
                          defaultValue={selectedUSSchool?.MCITY || ""}
                          className="mt-1"
                          required
                        />
                      </div>
                      <div>
                        <Label htmlFor="state" className="text-sm font-medium text-gray-700">State*</Label>
                        <Input
                          id="state"
                          name="state"
                          defaultValue={selectedUSSchool?.MSTATE || ""}
                          className="mt-1"
                          required
                        />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="zipCode" className="text-sm font-medium text-gray-700">ZIP Code*</Label>
                      <Input
                        id="zipCode"
                        name="zipCode"
                        defaultValue={selectedUSSchool?.MZIP || ""}
                        className="mt-1"
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="phone" className="text-sm font-medium text-gray-700">Phone</Label>
                      <Input
                        id="phone"
                        name="phone"
                        defaultValue={selectedUSSchool?.PHONE || ""}
                        className="mt-1"
                      />
                    </div>
                  </div>
                </div>

                {/* Website and Status */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label htmlFor="website" className="text-sm font-medium text-gray-700">Website</Label>
                    <Input
                      id="website"
                      name="website"
                      defaultValue={selectedUSSchool?.WEBSITE || ""}
                      className="mt-1"
                      placeholder="https://example.com"
                    />
                  </div>
                  <div>
                    <Label htmlFor="status" className="text-sm font-medium text-gray-700">School Status</Label>
                    <div className="mt-1 flex items-center space-x-3">
                      <Switch
                        id="status"
                        checked={isSchoolOpen}
                        onCheckedChange={setIsSchoolOpen}
                      />
                      <span className="text-sm text-gray-600">
                        {isSchoolOpen ? "Open" : "Closed"}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Grades Offered */}
                <div>
                  <Label className="text-sm font-medium text-gray-700">Grades Offered</Label>
                  <div className="grid grid-cols-6 gap-2 mt-2">
                    {[
                      { key: "G_PK_OFFERED", label: "PK" },
                      { key: "G_KG_OFFERED", label: "K" },
                      { key: "G_1_OFFERED", label: "1" },
                      { key: "G_2_OFFERED", label: "2" },
                      { key: "G_3_OFFERED", label: "3" },
                      { key: "G_4_OFFERED", label: "4" },
                      { key: "G_5_OFFERED", label: "5" },
                      { key: "G_6_OFFERED", label: "6" },
                      { key: "G_7_OFFERED", label: "7" },
                      { key: "G_8_OFFERED", label: "8" },
                      { key: "G_9_OFFERED", label: "9" },
                      { key: "G_10_OFFERED", label: "10" },
                      { key: "G_11_OFFERED", label: "11" },
                      { key: "G_12_OFFERED", label: "12" },
                      { key: "G_13_OFFERED", label: "13" },
                      { key: "G_AE_OFFERED", label: "AE" },
                      { key: "G_UG_OFFERED", label: "UG" }
                    ].map(grade => {
                      const isChecked = gradeOffered[grade.key] || false;
                      return (
                        <div key={grade.key} className="flex items-center space-x-2 p-2 border rounded">
                          <input
                            type="checkbox"
                            id={grade.key}
                            checked={isChecked}
                            onChange={(e) => handleGradeChange(grade.key, e.target.checked)}
                            className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                          />
                          <label htmlFor={grade.key} className="text-sm font-medium text-gray-700">
                            {grade.label}
                          </label>
                        </div>
                      );
                    })}
                  </div>
                  <p className="text-xs text-gray-500 mt-2">
                    Grade Range: {selectedUSSchool?.GSLO || "N/A"} - {selectedUSSchool?.GSHI || "N/A"}
                  </p>
                </div>

                {/* Additional Information */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <Label className="text-sm font-medium text-gray-700">School Year</Label>
                    <div className="mt-1 flex items-center space-x-2">
                      <div className="flex-1">
                        <Input
                          id="schoolYearStart"
                          type="number"
                          value={schoolYearStart}
                          onChange={(e) => setSchoolYearStart(e.target.value)}
                          placeholder="2023"
                          min="1900"
                          max="2100"
                          className="text-center"
                        />
                        <p className="text-xs text-gray-500 text-center mt-1">Start Year</p>
                      </div>
                      <span className="text-gray-500 font-medium">-</span>
                      <div className="flex-1">
                        <Input
                          id="schoolYearEnd"
                          type="number"
                          value={schoolYearEnd}
                          onChange={(e) => setSchoolYearEnd(e.target.value)}
                          placeholder="2024"
                          min="1900"
                          max="2100"
                          className="text-center"
                        />
                        <p className="text-xs text-gray-500 text-center mt-1">End Year</p>
                      </div>
                    </div>
                    <p className="text-xs text-gray-500 mt-2">Select start and end years for the school year</p>
                  </div>
                  <div>
                    <Label htmlFor="effectiveDate" className="text-sm font-medium text-gray-700">Effective Date</Label>
                    <Input
                      id="effectiveDate"
                      type="date"
                      value={effectiveDate}
                      onChange={(e) => setEffectiveDate(e.target.value)}
                      className="mt-1"
                    />
                    <p className="text-xs text-gray-500 mt-1">Select effective date (YYYY-MM-DD format)</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-700">Charter School</Label>
                    <div className="mt-1 flex items-center space-x-3">
                      <Switch
                        id="charterSchool"
                        checked={isCharterSchool}
                        onCheckedChange={setIsCharterSchool}
                      />
                      <span className="text-sm text-gray-600">
                        {isCharterSchool ? "Yes" : "No"}
                      </span>
                    </div>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-700">Out of State</Label>
                    <div className="mt-1 flex items-center space-x-3">
                      <Switch
                        id="outOfState"
                        checked={isOutOfState}
                        onCheckedChange={setIsOutOfState}
                      />
                      <span className="text-sm text-gray-600">
                        {isOutOfState ? "Yes" : "No"}
                      </span>
                    </div>
                  </div>
                </div>

                {/* School Identifiers */}
                <div className="border-t pt-4">
                  <Label className="text-sm font-medium text-gray-700">School Identifiers</Label>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2 text-xs">
                    <div>
                      <span className="font-medium">NCES ID:</span> {selectedUSSchool?.NCESSCH || "N/A"}
                    </div>
                    <div>
                      <span className="font-medium">State School ID:</span> {selectedUSSchool?.ST_SCHID || "N/A"}
                    </div>
                    <div>
                      <span className="font-medium">LEA ID:</span> {selectedUSSchool?.LEAID || "N/A"}
                    </div>
                    <div>
                      <span className="font-medium">State LEA ID:</span> {selectedUSSchool?.ST_LEAID || "N/A"}
                    </div>
                  </div>
                </div>

                {/* Footer Buttons */}
                <div className="flex justify-end gap-2 pt-6 border-t">
                  <Button
                    variant="outline"
                    type="button"
                    onClick={() => {
                      setIsUSSchoolEditModalOpen(false);
                      setSelectedUSSchool(null);
                    }}
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    disabled={isLoading}
                    className="gap-2"
                  >
                    {isLoading ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Save className="h-4 w-4" />
                    )}
                    {selectedUSSchool ? "Update School" : "Create School"}
                  </Button>
                </div>
            </form>
          </div>
        </DialogContent>
      </Dialog>

      {/* Delete School Confirmation Dialog */}
      <DeleteSchoolDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => {
          setIsDeleteDialogOpen(false);
          setSchoolToDelete(null);
        }}
        onConfirm={confirmDeleteUSSchool}
        schoolName={schoolToDelete?.SCH_NAME || ""}
        isLoading={isLoadingUSSchools}
      />
    </div>
  );
}
