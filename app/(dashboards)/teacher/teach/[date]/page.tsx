"use client";

import { useParams, useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { format, parseISO } from "date-fns";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { ChevronLeft, FileText, BookOpen, Home, FileArchive, Download, Upload } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import { useRequestInfo } from "@/hooks/useRequestInfo";
import { getTeachMaterials, uploadTeachMaterial, downloadTeachMaterial } from "@/services/TeachService";
import PlanGeneralView from "@/components/teach/PlanGeneralView";

interface TeachMaterial {
  id: number;
  title: string;
  description: string;
  material_type: string;
  file_type: string;
  file_size: number;
  file: {
    name: string;
    url: string;
  };
  uploaded_by: {
    name: string;
  };
  date_uploaded: string;
  last_modified: string;
  subject: string;
  associated_date: string;
}

export default function TeachDatePage() {
  const params = useParams();
  const router = useRouter();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("lesson-plan");
  const [uploadProgress, setUploadProgress] = useState<number | null>(null);
  const [additionalResources, setAdditionalResources] = useState<TeachMaterial[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { tenantDomain, accessToken, refreshToken } = useRequestInfo();

  const dateParam = params.date as string;
  const selectedDate = parseISO(dateParam);

  useEffect(() => {
    if (activeTab === 'other-materials') {
      fetchAdditionalResources();
    }
  }, [activeTab]);

  const fetchAdditionalResources = async () => {
    if (!tenantDomain || !accessToken || !refreshToken) return;
    setIsLoading(true);
    try {
      const data = await getTeachMaterials(
        tenantDomain,
        accessToken,
        {
          material_type: 'additional-resources',
          subject: 'math',
          date: dateParam
        }
      );
      setAdditionalResources(data);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch additional resources",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setUploadProgress(0);

    const formData = new FormData();
    formData.append('file', file);
    formData.append('title', file.name);
    formData.append('material_type', 'additional-resources');
    formData.append('subject', 'math');
    formData.append('associated_date', dateParam);

    try {
      const response = await uploadTeachMaterial(formData, tenantDomain, accessToken);
      setAdditionalResources(prev => [response, ...prev]);
      toast({
        title: "Success",
        description: "File uploaded successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to upload file",
        variant: "destructive",
      });
    } finally {
      setIsUploading(false);
      setTimeout(() => setUploadProgress(null), 2000);
    }
  };

  const handleDownload = async (materialId: number, fileName: string) => {
    try {
      const blob = await downloadTeachMaterial(materialId, tenantDomain, accessToken);
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', fileName);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to download file",
        variant: "destructive",
      });
    }
  };

  const getFileSizeDisplay = (size: number): string => {
    if (size < 1024) return `${size} B`;
    if (size < 1024 * 1024) return `${(size / 1024).toFixed(1)} KB`;
    return `${(size / (1024 * 1024)).toFixed(1)} MB`;
  };

  const materials = [
    { 
      id: "lesson-plan", 
      name: "Lesson Plan", 
      icon: <FileText className="w-5 h-5" />,
      status: "complete"
    },
    { 
      id: "student-handout", 
      name: "Student Handout", 
      icon: <BookOpen className="w-5 h-5" />,
      status: "complete"
    },
    { 
      id: "homework", 
      name: "Homework", 
      icon: <Home className="w-5 h-5" />,
      status: "draft"
    },
    { 
      id: "other-materials", 
      name: "Additional Resources", 
      icon: <FileArchive className="w-5 h-5" />,
      status: additionalResources.length > 0 ? "complete" : "empty"
    },
  ];

  return (
    <section className="flex flex-col h-full w-full bg-gradient-to-br from-blue-50/30 to-indigo-50/20">
      {/* Enhanced Header */}
      <div className="flex justify-between items-center bg-gradient-to-r from-blue-600 via-blue-700 to-indigo-700 px-8 py-6 shadow-xl">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            onClick={() => router.back()}
            className="text-white hover:bg-white/20 rounded-xl p-2"
          >
            <ChevronLeft className="h-5 w-5" />
          </Button>
          <div className="flex items-center gap-4">
            <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
              <svg className="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            <div>
              <h1 className="text-white font-bold text-2xl">Teaching Materials</h1>
              <p className="text-blue-100 text-sm mt-1">{format(selectedDate, "EEEE, MMMM d, yyyy")}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Content Area */}
      <div className="flex-1 p-8 space-y-6">
        {/* Horizontal Material Tabs */}
        <Card className="bg-white/80 backdrop-blur-sm p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-lg">Teaching Materials</h3>
            <div className="flex gap-3">
              <Button variant="outline" asChild>
                <label className="cursor-pointer">
                  <Upload className="w-4 h-4 mr-2" />
                  Upload File
                  <input 
                    type="file" 
                    className="hidden" 
                    onChange={handleFileUpload}
                    disabled={isUploading}
                  />
                </label>
              </Button>
              <Button variant="outline">
                <Download className="w-4 h-4 mr-2" />
                Download
              </Button>
              <Button className="bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600">
                Share
              </Button>
            </div>
          </div>
          
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-4 bg-gray-100 p-1 rounded-xl">
              {materials.map((material) => (
                <TabsTrigger 
                  key={material.id}
                  value={material.id}
                  className={`flex items-center gap-2 px-4 py-3 data-[state=active]:bg-white data-[state=active]:text-blue-700 data-[state=active]:shadow-sm rounded-lg font-medium ${
                    material.status === 'draft' ? 'border-b-2 border-b-yellow-400' : 
                    material.status === 'empty' ? 'border-b-2 border-b-gray-300' : ''
                  }`}
                >
                  <span className="text-gray-600">{material.icon}</span>
                  <span className="hidden sm:inline">{material.name}</span>
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
          
          {uploadProgress !== null && (
            <div className="mt-4">
              <Progress value={uploadProgress} className="h-2" />
              <p className="text-xs text-center mt-1 text-gray-500">
                {uploadProgress}% uploaded
              </p>
            </div>
          )}
        </Card>

        {/* Main Content */}
        <Card className="h-full bg-white/80 backdrop-blur-sm overflow-hidden">
          <div className="p-6 h-full overflow-auto">
            <Tabs value={activeTab} className="h-full">
                  <TabsContent value="lesson-plan" className="m-0 h-full">
                    <PlanGeneralView changeView={() => {}} selectedDate={selectedDate} />
                  </TabsContent>

                  <TabsContent value="student-handout" className="m-0 h-full">
                    <div className="space-y-6">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="text-lg font-semibold">Student Handout</h4>
                          <p className="text-gray-600">Algebra Fundamentals Worksheet</p>
                        </div>
                        <Button variant="outline">
                          <Download className="w-4 h-4 mr-2" />
                          Download PDF
                        </Button>
                      </div>
                      
                      <div className="bg-gray-50 rounded-xl p-6">
                        <h5 className="font-semibold mb-4">Today's Lesson</h5>
                        <div className="space-y-3 text-gray-700">
                          <p>1. Introduction to quadratic equations</p>
                          <p>2. Solving using the quadratic formula</p>
                          <p>3. Real-world application problems</p>
                          <p className="text-sm text-gray-500 mt-4 italic">
                            Complete the practice problems on pages 4-5 for class discussion.
                          </p>
                        </div>
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="homework" className="m-0 h-full">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 h-full">
                      <div className="lg:col-span-2 space-y-6">
                        <div>
                          <h4 className="font-semibold text-lg mb-4">Homework Assignment</h4>
                          <div className="bg-gray-50 rounded-xl p-6 space-y-4">
                            <div>
                              <h5 className="font-medium mb-2">Instructions:</h5>
                              <p className="text-gray-700">Complete problems 1-20 on quadratic equations</p>
                            </div>
                            
                            <div>
                              <h5 className="font-medium mb-2">Requirements:</h5>
                              <ul className="list-disc pl-5 space-y-1 text-gray-700">
                                <li>Show all work</li>
                                <li>Submit by the due date</li>
                                <li>Format according to class guidelines</li>
                              </ul>
                            </div>
                            
                            <div className="pt-4 border-t">
                              <p className="text-sm text-gray-500">
                                Due: {format(new Date(selectedDate.getTime() + 2 * 24 * 60 * 60 * 1000), "EEEE, MMMM d")}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="space-y-4">
                        <h4 className="font-semibold">Supporting Materials</h4>
                        <div className="space-y-3">
                          {["Graphing Calculator Guide", "Geometry Reference Sheet", "Problem Solving Strategies"].map((resource, index) => (
                            <div key={index} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 cursor-pointer transition-colors">
                              <FileText className="w-5 h-5 text-blue-500" />
                              <div>
                                <div className="font-medium text-sm">{resource}</div>
                                <div className="text-xs text-gray-500">PDF • 250KB</div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="other-materials" className="m-0 h-full">
                    <div className="space-y-6">
                      <div className="flex justify-between items-center">
                        <div>
                          <h4 className="text-lg font-semibold">Additional Resources</h4>
                          <p className="text-gray-600">
                            {additionalResources.length} resource{additionalResources.length !== 1 ? 's' : ''} available
                          </p>
                        </div>
                        <Button asChild className="bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600">
                          <label className="cursor-pointer">
                            <Upload className="w-4 h-4 mr-2" />
                            Add Resources
                            <input 
                              type="file" 
                              className="hidden" 
                              onChange={handleFileUpload}
                              disabled={isUploading}
                            />
                          </label>
                        </Button>
                      </div>
                      
                      {isLoading ? (
                        <div className="flex items-center justify-center h-64">
                          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                        </div>
                      ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                          {additionalResources.length > 0 ? (
                            additionalResources.map((resource) => (
                              <div key={resource.id} className="p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors">
                                <div className="flex items-center justify-between mb-2">
                                  <h5 className="font-medium truncate">{resource.title}</h5>
                                  <button 
                                    onClick={() => handleDownload(resource.id, resource.file.name)}
                                    className="text-gray-500 hover:text-blue-600 transition-colors"
                                  >
                                    <Download className="w-4 h-4" />
                                  </button>
                                </div>
                                <div className="text-sm text-gray-500">
                                  <span>{resource.material_type}</span> • 
                                  <span>{resource.file_type.toUpperCase()}</span> • 
                                  <span>{getFileSizeDisplay(resource.file_size)}</span>
                                </div>
                              </div>
                            ))
                          ) : (
                            <div className="col-span-full flex flex-col items-center justify-center h-64 text-gray-400">
                              <FileArchive className="w-16 h-16 mb-4" />
                              <p className="text-lg font-medium">No additional resources uploaded yet</p>
                              <p className="text-sm mt-2">Click "Add Resources" to upload files</p>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </TabsContent>
            </Tabs>
          </div>
        </Card>
      </div>
    </section>
  );
}