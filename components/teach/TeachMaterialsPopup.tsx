"use client";

import { Button } from "@/components/ui/button";
import { FileText, BookOpen, Home, FileArchive, Download, Upload } from "lucide-react";
import { Dialog, DialogContent, DialogHeader } from "@/components/ui/dialog";
import { format } from "date-fns";
import PlanGeneralView from "./PlanGeneralView";
import { useState, useEffect } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { getTeachMaterials, uploadTeachMaterial, downloadTeachMaterial } from "@/services/TeachService";
import { useToast } from "@/components/ui/use-toast";
import { useRequestInfo } from "@/hooks/useRequestInfo";

type SubjectType = "math" | "ela";

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

interface MaterialTab {
  id: string;
  name: string;
  icon: React.ReactNode;
  lastModified: string;
  status: "complete" | "draft" | "empty";
}

export function TeachMaterialsPopup({ 
  date, 
  open, 
  onOpenChange, 
  subject = "math"
}: {
  date: Date;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  subject?: SubjectType;
}) {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("lesson-plan");
  const [uploadProgress, setUploadProgress] = useState<number | null>(null);
  const [selectedDate, setSelectedDate] = useState(date);
  const [additionalResources, setAdditionalResources] = useState<TeachMaterial[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { tenantDomain, accessToken, refreshToken } = useRequestInfo();

  // Update when the prop date changes
  useEffect(() => {
    setSelectedDate(date);
  }, [date]);

  // Fetch additional resources when tab or date changes
  useEffect(() => {
    if (activeTab === 'other-materials') {
      fetchAdditionalResources();
    }
  }, [activeTab, selectedDate, subject]);

  const fetchAdditionalResources = async () => {
    if (!tenantDomain || !accessToken || !refreshToken) return;
    setIsLoading(true);
    try {
      const dateStr = format(selectedDate, 'yyyy-MM-dd');
      const data = await getTeachMaterials(
        tenantDomain,
        accessToken,
        {
          material_type: 'additional-resources',
          subject,
          date: dateStr
        }
      );
      setAdditionalResources(data);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch additional resources",
        variant: "destructive",
      });
      console.error('Error fetching resources:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDateChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newDate = new Date(e.target.value);
    if (!isNaN(newDate.getTime())) {
      setSelectedDate(newDate);
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
    formData.append('subject', subject);
    formData.append('associated_date', format(selectedDate, 'yyyy-MM-dd'));

    try {
        // The uploadTeachMaterial function does not support onUploadProgress, so we remove it.
        const response = await uploadTeachMaterial(
          formData,
          tenantDomain,
          accessToken
        );

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
      console.error('Upload failed:', error);
    } finally {
      setIsUploading(false);
      setTimeout(() => setUploadProgress(null), 2000);
    }
  };

  const handleDownload = async (materialId: number, fileName: string) => {
    try {
      const blob = await downloadTeachMaterial(
        materialId,
        tenantDomain,
        accessToken
      );
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
      console.error('Download failed:', error);
    }
  };

  // Subject-specific resources
  const mathResources = {
    handout: "Algebra Fundamentals Worksheet",
    homework: "Complete problems 1-20 on quadratic equations",
    otherMaterials: [
      "Graphing Calculator Guide (PDF)",
      "Geometry Reference Sheet",
      "Problem Solving Strategies Video"
    ]
  };

  const elaResources = {
    handout: "Romeo and Juliet Act 1 Analysis",
    homework: "Write a 500-word character analysis of Juliet",
    otherMaterials: [
      "Literary Devices Cheat Sheet",
      "Essay Writing Template",
      "Shakespearean Language Guide"
    ]
  };

  const currentSubjectResources = subject === "math" ? mathResources : elaResources;

  const materials: MaterialTab[] = [
    { 
      id: "lesson-plan", 
      name: "Lesson Plan", 
      icon: <FileText className="w-5 h-5" />,
      lastModified: "Modified 2 hours ago",
      status: "complete"
    },
    { 
      id: "student-handout", 
      name: "Student Handout", 
      icon: <BookOpen className="w-5 h-5" />,
      lastModified: "Modified today",
      status: "complete"
    },
    { 
      id: "homework", 
      name: "Homework", 
      icon: <Home className="w-5 h-5" />,
      lastModified: "Modified yesterday",
      status: "draft"
    },
    { 
      id: "other-materials", 
      name: "Additional Resources", 
      icon: <FileArchive className="w-5 h-5" />,
      lastModified: additionalResources.length > 0 
        ? `Last updated ${format(new Date(additionalResources[0].date_uploaded), 'MMM d, yyyy')}`
        : "No resources yet",
      status: additionalResources.length > 0 ? "complete" : "empty"
    },
  ];

  const getFileSizeDisplay = (size: number): string => {
    if (size < 1024) return `${size} B`;
    if (size < 1024 * 1024) return `${(size / 1024).toFixed(1)} KB`;
    return `${(size / (1024 * 1024)).toFixed(1)} MB`;
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-6xl h-[90vh] p-0 overflow-hidden">
        <div className="flex h-full">
          {/* Sidebar */}
          <div className="w-64 border-r bg-gray-50 p-4 flex flex-col">
            <DialogHeader className="pb-4">
              <div className="mb-2">
                <input
                  type="date"
                  value={format(selectedDate, "yyyy-MM-dd")}
                  onChange={handleDateChange}
                  className="w-full p-2 border rounded"
                />
              </div>
              <h2 className="text-xl font-semibold">
                {format(selectedDate, "EEEE, MMMM d, yyyy")}
              </h2>
              <p className="text-sm text-gray-500">
                {format(selectedDate, "'Week' w")}
              </p>
            </DialogHeader>

            <Tabs 
              value={activeTab} 
              onValueChange={setActiveTab}
              className="flex-1 flex flex-col"
              orientation="vertical"
            >
              <TabsList className="flex-col items-start h-auto bg-transparent p-0 space-y-1">
                {materials.map((material) => (
                  <TabsTrigger 
                    key={material.id}
                    value={material.id}
                    className={`w-full justify-start px-3 py-2 data-[state=active]:bg-white data-[state=active]:shadow-sm ${
                      material.status === 'draft' ? 'border-l-4 border-l-yellow-400' : 
                      material.status === 'empty' ? 'border-l-4 border-l-gray-300' : ''
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-gray-600">{material.icon}</span>
                      <div className="text-left">
                        <div>{material.name}</div>
                        <div className="text-xs text-gray-500 font-normal">
                          {material.lastModified}
                        </div>
                      </div>
                    </div>
                  </TabsTrigger>
                ))}
              </TabsList>

              <div className="mt-auto pt-4 border-t">
                <Button variant="outline" className="w-full" asChild>
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
                {uploadProgress !== null && (
                  <div className="mt-2">
                    <Progress value={uploadProgress} className="h-2" />
                    <p className="text-xs text-center mt-1 text-gray-500">
                      {uploadProgress}% uploaded
                    </p>
                  </div>
                )}
              </div>
            </Tabs>
          </div>

          {/* Main content */}
          <div className="flex-1 flex flex-col overflow-hidden">
            <div className="border-b p-4 flex justify-between items-center">
              <h3 className="text-lg font-medium">
                {materials.find(m => m.id === activeTab)?.name}
              </h3>
              <div className="flex gap-2">
                <Button variant="outline" size="sm">
                  <Download className="w-4 h-4 mr-2" />
                  Download
                </Button>
                <Button size="sm">
                  <span>Share</span>
                </Button>
              </div>
            </div>

            <div className="flex-1 overflow-auto p-6 bg-gray-50">
              <Tabs value={activeTab} className="h-full">
                <TabsContent value="lesson-plan" className="m-0 h-full">
                  <Card className="h-full overflow-hidden">
                    <PlanGeneralView 
                      changeView={() => {}} 
                      selectedDate={selectedDate}
                    />
                  </Card>
                </TabsContent>

                <TabsContent value="student-handout" className="m-0 h-full">
                  <Card className="h-full p-6 flex flex-col bg-white">
                    <div className="flex items-center justify-between mb-6">
                      <div>
                        <h4 className="text-xl font-medium mb-1">Student Handout</h4>
                        <p className="text-gray-500">{currentSubjectResources.handout}</p>
                      </div>
                      <Button variant="outline">
                        <Download className="w-4 h-4 mr-2" />
                        Download PDF
                      </Button>
                    </div>
                    
                    <div className="border rounded-lg p-4 flex-1">
                      <div className="prose max-w-none">
                        <h5 className="font-medium mb-3">Today&apos;s Lesson</h5>
                        {subject === "math" ? (
                          <>
                            <p className="mb-3">1. Introduction to quadratic equations</p>
                            <p className="mb-3">2. Solving using the quadratic formula</p>
                            <p className="mb-3">3. Real-world application problems</p>
                            <p className="text-sm text-gray-500 mt-4">
                              Complete the practice problems on pages 4-5 for class discussion.
                            </p>
                          </>
                        ) : (
                          <>
                            <p className="mb-3">1. Analysis of Act 1, Scene 5</p>
                            <p className="mb-3">2. Character motivations discussion</p>
                            <p className="mb-3">3. Foreshadowing in the text</p>
                            <p className="text-sm text-gray-500 mt-4">
                              Annotate your copy with at least 5 notes per page.
                            </p>
                          </>
                        )}
                      </div>
                    </div>
                  </Card>
                </TabsContent>

                <TabsContent value="homework" className="m-0 h-full">
                  <Card className="h-full p-6 bg-white">
                    <div className="flex items-start gap-6 h-full">
                      <div className="w-2/3 border-r pr-6">
                        <h4 className="font-medium mb-4">Homework Assignment</h4>
                        <div className="prose prose-sm max-w-none">
                          <p className="font-medium mb-2">Instructions:</p>
                          <p className="mb-4">{currentSubjectResources.homework}</p>
                          
                          <p className="font-medium mb-2">Requirements:</p>
                          <ul className="list-disc pl-5 mb-4">
                            <li>Show all work (Math) / Cite evidence (ELA)</li>
                            <li>Submit by the due date</li>
                            <li>Format according to class guidelines</li>
                          </ul>
                          
                          <p className="text-sm text-gray-500 mt-4">
                            Due: {format(new Date(date.setDate(date.getDate() + 2)), "EEEE, MMMM d")}
                          </p>
                        </div>
                      </div>
                      <div className="w-1/3">
                        <h4 className="font-medium mb-4">Supporting Materials</h4>
                        <div className="space-y-3">
                          {currentSubjectResources.otherMaterials.map((resource, index) => (
                            <div key={index} className="flex items-center gap-3 p-3 border rounded-lg hover:bg-gray-50 cursor-pointer">
                              <FileText className="w-5 h-5 text-blue-500" />
                              <div>
                                <div className="font-medium text-sm">{resource}</div>
                                <div className="text-xs text-gray-500">
                                  {resource.includes("Video") ? "MP4 • 15MB" : "PDF • 250KB"}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </Card>
                </TabsContent>

                <TabsContent value="other-materials" className="m-0 h-full">
                  <Card className="h-full p-6 bg-white">
                    <div className="flex flex-col h-full">
                      <div className="flex justify-between items-center mb-6">
                        <div>
                          <h4 className="text-xl font-medium mb-1">Additional Resources</h4>
                          <p className="text-gray-500">
                            {additionalResources.length} resource{additionalResources.length !== 1 ? 's' : ''} available
                          </p>
                        </div>
                        <Button asChild>
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
                        <div className="flex-1 flex items-center justify-center">
                          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-400"></div>
                        </div>
                      ) : (
                        <>
                          {uploadProgress !== null && (
                            <div className="mb-4">
                              <Progress value={uploadProgress} className="h-2" />
                              <p className="text-xs text-center mt-1 text-gray-500">
                                {uploadProgress}% uploaded
                              </p>
                            </div>
                          )}
                          
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 flex-1">
                            {additionalResources.length > 0 ? (
                              additionalResources.map((resource) => (
                                <ResourceCard 
                                  key={resource.id}
                                  title={resource.title}
                                  type={resource.material_type}
                                  format={resource.file_type.toUpperCase()}
                                  size={getFileSizeDisplay(resource.file_size)}
                                  onDownload={() => handleDownload(resource.id, resource.file.name)}
                                />
                              ))
                            ) : (
                              <div className="col-span-2 flex flex-col items-center justify-center h-64 text-gray-400">
                                <FileArchive className="w-12 h-12 mb-4" />
                                <p>No additional resources uploaded yet</p>
                                <p className="text-sm mt-2">Click &quot;Add Resources&quot; to upload files</p>
                              </div>
                            )}
                          </div>
                        </>
                      )}
                    </div>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

interface ResourceCardProps {
  title: string;
  type: string;
  format: string;
  size: string;
  onDownload: () => void;
}

function ResourceCard({ title, type, format, size, onDownload }: ResourceCardProps) {
  return (
    <div className="p-4 border rounded-lg hover:bg-gray-50">
      <div className="flex items-center justify-between mb-2">
        <h5 className="font-medium">{title}</h5>
        <button onClick={onDownload} className="text-gray-500 hover:text-gray-700">
          <Download className="w-4 h-4" />
        </button>
      </div>
      <div className="text-sm text-gray-500">
        <span>{type}</span> • <span>{format}</span> • <span>{size}</span>
      </div>
    </div>
  );
}