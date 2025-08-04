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
  FileText,
  Plus,
  Search,
  Frown,
  ChevronLeft,
  ChevronRight,
  MoreVertical,
  Filter,
  Download,
  Upload,
  FileUp,
  X,
  Save,
  Loader2,
  FileInput,
  FileOutput,
  FileEdit,
  FileCheck,
  FileX,
  FileSearch,
  FilePlus2
} from "lucide-react";

type Template = {
  id: string;
  name: string;
  type: "report" | "certificate" | "form" | "email" | "other";
  description: string;
  lastUpdated: string;
  status: "active" | "draft" | "archived";
  usedBy: number;
  createdBy: string;
};

export default function TemplatesPage() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [selectedTemplate, setSelectedTemplate] = useState<Template | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [activeTab, setActiveTab] = useState<"all" | "reports" | "certificates" | "forms" | "emails">("all");

  // Sample data - replace with actual API calls
  const [templates, setTemplates] = useState<Template[]>([
    {
      id: "1",
      name: "Student Progress Report",
      type: "report",
      description: "Standard template for student progress reports",
      lastUpdated: "2023-10-15",
      status: "active",
      usedBy: 42,
      createdBy: "Admin User"
    },
    {
      id: "2",
      name: "Certificate of Achievement",
      type: "certificate",
      description: "Template for student achievement certificates",
      lastUpdated: "2023-11-20",
      status: "active",
      usedBy: 38,
      createdBy: "Admin User"
    },
    {
      id: "3",
      name: "Parent-Teacher Meeting Form",
      type: "form",
      description: "Form for scheduling parent-teacher meetings",
      lastUpdated: "2023-09-05",
      status: "active",
      usedBy: 28,
      createdBy: "Admin User"
    },
    {
      id: "4",
      name: "Absence Notification Email",
      type: "email",
      description: "Email template for student absence notifications",
      lastUpdated: "2023-12-10",
      status: "draft",
      usedBy: 15,
      createdBy: "Admin User"
    },
    {
      id: "5",
      name: "School Newsletter",
      type: "other",
      description: "Monthly school newsletter template",
      lastUpdated: "2024-01-15",
      status: "archived",
      usedBy: 0,
      createdBy: "Admin User"
    }
  ]);

  const filteredTemplates = templates.filter(template => {
    const matchesSearch = template.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         template.description.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (activeTab === "all") return matchesSearch;
    return matchesSearch && template.type === activeTab.slice(0, -1);
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
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      // Process file and update templates state
      console.log("Importing template file:", selectedFile.name);
      setIsImportModalOpen(false);
      setSelectedFile(null);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmitTemplate = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      if (selectedTemplate) {
        // Update existing template
        console.log("Updating template");
      } else {
        // Create new template
        console.log("Creating new template");
      }
      
      setIsFormModalOpen(false);
      setSelectedTemplate(null);
    } finally {
      setIsLoading(false);
    }
  };

  const getTypeBadgeVariant = (type: string) => {
    switch(type) {
      case "report": return "default";
      case "certificate": return "secondary";
      case "form": return "outline";
      case "email": return "destructive";
      default: return "outline";
    }
  };

  const getStatusBadgeVariant = (status: string) => {
    switch(status) {
      case "active": return "default";
      case "draft": return "secondary";
      case "archived": return "outline";
      default: return "outline";
    }
  };

  return (
    <div className="flex flex-col gap-6 w-full">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold">Templates Management</h1>
          <p className="text-sm text-gray-500">
            Manage all system templates ({templates.length} total)
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
              setSelectedTemplate(null);
              setIsFormModalOpen(true);
            }}
          >
            <Plus className="h-4 w-4" />
            New Template
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-2">
        <Button
          variant={activeTab === "all" ? "default" : "outline"}
          onClick={() => setActiveTab("all")}
          className="gap-2"
        >
          <FileText className="h-4 w-4" />
          All Templates
        </Button>
        <Button
          variant={activeTab === "reports" ? "default" : "outline"}
          onClick={() => setActiveTab("reports")}
          className="gap-2"
        >
          <FileSearch className="h-4 w-4" />
          Reports
        </Button>
        <Button
          variant={activeTab === "certificates" ? "default" : "outline"}
          onClick={() => setActiveTab("certificates")}
          className="gap-2"
        >
          <FileCheck className="h-4 w-4" />
          Certificates
        </Button>
        <Button
          variant={activeTab === "forms" ? "default" : "outline"}
          onClick={() => setActiveTab("forms")}
          className="gap-2"
        >
          <FileEdit className="h-4 w-4" />
          Forms
        </Button>
        <Button
          variant={activeTab === "emails" ? "default" : "outline"}
          onClick={() => setActiveTab("emails")}
          className="gap-2"
        >
          <FileOutput className="h-4 w-4" />
          Emails
        </Button>
      </div>

      {/* Search Bar */}
      <Card className="p-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search templates by name or description..."
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

      {/* Templates List */}
      {filteredTemplates.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredTemplates.map((template) => (
            <Card 
              key={template.id}
              className="hover:shadow-md transition-shadow cursor-pointer h-full"
              onClick={() => {
                setSelectedTemplate(template);
                setIsFormModalOpen(true);
              }}
            >
              <div className="p-4 flex flex-col h-full">
                <div className="flex justify-between items-start mb-3">
                  <div className="p-2 bg-blue-100 rounded-lg text-blue-600 w-fit">
                    {template.type === "report" && <FileSearch className="h-5 w-5" />}
                    {template.type === "certificate" && <FileCheck className="h-5 w-5" />}
                    {template.type === "form" && <FileEdit className="h-5 w-5" />}
                    {template.type === "email" && <FileOutput className="h-5 w-5" />}
                    {template.type === "other" && <FileText className="h-5 w-5" />}
                  </div>
                  <div className="flex gap-2">
                    <Badge variant={getStatusBadgeVariant(template.status)}>
                      {template.status.charAt(0).toUpperCase() + template.status.slice(1)}
                    </Badge>
                  </div>
                </div>
                
                <div className="flex-1">
                  <h3 className="font-semibold text-lg mb-2">{template.name}</h3>
                  <Badge variant={getTypeBadgeVariant(template.type)} className="mb-3">
                    {template.type.charAt(0).toUpperCase() + template.type.slice(1)}
                  </Badge>
                  <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                    {template.description}
                  </p>
                  
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div className="flex flex-col p-2 bg-gray-50 rounded">
                      <span className="text-gray-500">Used by</span>
                      <span className="font-medium">{template.usedBy} schools</span>
                    </div>
                    <div className="flex flex-col p-2 bg-gray-50 rounded">
                      <span className="text-gray-500">Created by</span>
                      <span className="font-medium truncate">{template.createdBy}</span>
                    </div>
                  </div>
                </div>
                
                <div className="text-xs text-gray-500 mt-3 pt-2 border-t">
                  Updated: {new Date(template.lastUpdated).toLocaleDateString()}
                </div>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="p-12 flex flex-col items-center justify-center gap-4">
          <Frown className="h-12 w-12 text-gray-400" />
          <h3 className="font-medium text-lg">No templates found</h3>
          <p className="text-sm text-gray-500 max-w-md text-center">
            No templates match your search criteria. Try adjusting your search or filters.
          </p>
          <Button variant="outline" onClick={() => {
            setSearchQuery("");
            setActiveTab("all");
          }}>
            Clear search
          </Button>
        </Card>
      )}

      {/* Pagination */}
      {filteredTemplates.length > 0 && (
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
        title="Import Templates"
        description="Upload a file containing template data (JSON or CSV)"
        size="md"
      >
        <div className="grid gap-4 py-4">
          <div className="grid items-center gap-4">
            <Label htmlFor="file">Template File</Label>
            <div className="flex items-center gap-2">
              <Input
                id="file"
                type="file"
                accept=".json,.csv"
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

      {/* Template Form Modal */}
      <Modal
        isOpen={isFormModalOpen}
        onClose={() => {
          setIsFormModalOpen(false);
          setSelectedTemplate(null);
        }}
        title={selectedTemplate ? "Edit Template" : "Create New Template"}
        description={
          selectedTemplate 
            ? "Update the template information" 
            : "Fill in the details for the new template"
        }
        size="2xl"
      >
        <form onSubmit={handleSubmitTemplate}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Basic Information */}
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="name">Template Name*</Label>
                  <Input 
                    id="name" 
                    placeholder="Student Progress Report" 
                    defaultValue={selectedTemplate?.name || ""} 
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="type">Template Type*</Label>
                  <select
                    id="type"
                    defaultValue={selectedTemplate?.type || "report"}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    required
                  >
                    <option value="report">Report</option>
                    <option value="certificate">Certificate</option>
                    <option value="form">Form</option>
                    <option value="email">Email</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="status">Status*</Label>
                  <select
                    id="status"
                    defaultValue={selectedTemplate?.status || "draft"}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    required
                  >
                    <option value="active">Active</option>
                    <option value="draft">Draft</option>
                    <option value="archived">Archived</option>
                  </select>
                </div>
              </div>

              {/* Template File */}
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="templateFile">Template File*</Label>
                  <div className="flex items-center gap-2">
                    <Input
                      id="templateFile"
                      type="file"
                      className="cursor-pointer"
                    />
                    {selectedTemplate && (
                      <Button
                        variant="outline"
                        size="sm"
                        type="button"
                      >
                        <FileSearch className="h-4 w-4 mr-2" />
                        Preview Current
                      </Button>
                    )}
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="variables">Available Variables</Label>
                  <Input 
                    id="variables" 
                    placeholder="{student_name}, {grade_level}, etc." 
                    defaultValue=""
                  />
                  <p className="text-xs text-muted-foreground">
                    Comma-separated list of variables this template supports
                  </p>
                </div>
              </div>

              {/* Description */}
              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="description">Description*</Label>
                <Textarea 
                  id="description" 
                  placeholder="Detailed description of this template's purpose and usage" 
                  className="min-h-[100px]" 
                  defaultValue={selectedTemplate?.description || ""} 
                  required
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-4">
              <Button 
                variant="outline" 
                type="button"
                onClick={() => {
                  setIsFormModalOpen(false);
                  setSelectedTemplate(null);
                }}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                ) : selectedTemplate ? (
                  <Save className="h-4 w-4 mr-2" />
                ) : (
                  <FilePlus2 className="h-4 w-4 mr-2" />
                )}
                {selectedTemplate ? "Update Template" : "Create Template"}
              </Button>
            </div>
          </div>
        </form>
      </Modal>
    </div>
  );
}