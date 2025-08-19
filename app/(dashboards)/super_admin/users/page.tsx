"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Label } from "@/components/ui/label";
import {
  Plus,
  Search,
  Frown,
  ChevronLeft,
  ChevronRight,
  Filter,
  Download,
  Mail,
  Phone,
  User,
  FileUp,
  X,
  Save,
  Loader2,
  School,
  Lock,
  Eye,
  Pencil
} from "lucide-react";
import { Modal } from "@/components/ui/modal";

type User = {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  role: "super_admin" | "school_admin" | "teacher" | "student" | "parent";
  status: "active" | "pending" | "inactive";
  lastLogin?: string;
  createdAt: string;
  school?: {
    id: string;
    name: string;
  };
  assignedSchools?: {
    id: string;
    name: string;
  }[];
};

export default function UsersPage() {
  //const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  // Sample data - replace with actual API calls
  const [users,] = useState<User[]>([
    {
      "id": "1",
      "firstName": "John",
      "lastName": "Doe",
      "email": "john.doe@example.com",
      "phone": "+1 (555) 123-4567",
      "role": "school_admin",
      "status": "active",
      "lastLogin": "2024-02-15T14:30:00Z",
      "createdAt": "2023-01-10",
      "school": {
        "id": "1",
        "name": "Central Elementary School"
      }
    },
    {
      "id": "2",
      "firstName": "Jane",
      "lastName": "Smith",
      "email": "jane.smith@example.com",
      "role": "teacher",
      "status": "active",
      "lastLogin": "2024-02-14T09:15:00Z",
      "createdAt": "2023-03-15",
      "school": {
        "id": "1",
        "name": "Central Elementary School"
      }
    },
    {
      "id": "3",
      "firstName": "Robert",
      "lastName": "Johnson",
      "email": "robert.j@example.com",
      "phone": "+1 (555) 987-6543",
      "role": "super_admin",
      "status": "active",
      "lastLogin": "2024-02-15T08:45:00Z",
      "createdAt": "2022-11-05",
      "assignedSchools": [
        {
          "id": "1",
          "name": "Central Elementary School"
        },
        {
          "id": "2",
          "name": "Sunnyvale High School"
        }
      ]
    },
    {
      "id": "4",
      "firstName": "Emily",
      "lastName": "Davis",
      "email": "emily.davis@example.com",
      "role": "student",
      "status": "active",
      "createdAt": "2023-09-10",
      "school": {
        "id": "2",
        "name": "Sunnyvale High School"
      }
    },
    {
      "id": "5",
      "firstName": "Michael",
      "lastName": "Brown",
      "email": "michael.b@example.com",
      "phone": "+1 (555) 456-7890",
      "role": "parent",
      "status": "pending",
      "createdAt": "2024-01-20",
      "school": {
        "id": "1",
        "name": "Central Elementary School"
      }
    },
    {
      "id": "6",
      "firstName": "Sarah",
      "lastName": "Wilson",
      "email": "sarah.w@example.com",
      "role": "teacher",
      "status": "active",
      "createdAt": "2023-08-15",
      "school": {
        "id": "2",
        "name": "Sunnyvale High School"
      }
    },
    {
      "id": "7",
      "firstName": "David",
      "lastName": "Miller",
      "email": "david.m@example.com",
      "role": "student",
      "status": "active",
      "createdAt": "2023-10-05",
      "school": {
        "id": "1",
        "name": "Central Elementary School"
      }
    },
    {
      "id": "8",
      "firstName": "Lisa",
      "lastName": "Taylor",
      "email": "lisa.t@example.com",
      "role": "parent",
      "status": "active",
      "createdAt": "2023-12-10",
      "school": {
        "id": "2",
        "name": "Sunnyvale High School"
      }
    }
  ]);

  const filteredUsers = users.filter(user =>
    `${user.firstName} ${user.lastName}`.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    user.role.toLowerCase().includes(searchQuery.toLowerCase())
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
      // Process file and update users state
      console.log("Importing file:", selectedFile.name);
      setIsImportModalOpen(false);
      setSelectedFile(null);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmitUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      if (selectedUser) {
        // Update existing user
        console.log("Updating user");
      } else {
        // Create new user
        console.log("Creating new user");
      }
      
      setIsFormModalOpen(false);
      setSelectedUser(null);
    } finally {
      setIsLoading(false);
    }
  };

  const getRoleBadgeVariant = (role: string) => {
    switch (role) {
      case "super_admin": return "destructive";
      case "school_admin": return "default";
      case "teacher": return "secondary";
      case "student": return "outline";
      case "parent": return "outline";
      default: return "outline";
    }
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case "active": return "default";
      case "pending": return "secondary";
      case "inactive": return "destructive";
      default: return "outline";
    }
  };

  const getInitials = (firstName: string, lastName: string) => {
    return `${firstName.charAt(0)}${lastName.charAt(0)}`.toUpperCase();
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case "super_admin": return "bg-red-100 text-red-600";
      case "school_admin": return "bg-blue-100 text-blue-600";
      case "teacher": return "bg-purple-100 text-purple-600";
      case "student": return "bg-green-100 text-green-600";
      case "parent": return "bg-amber-100 text-amber-600";
      default: return "bg-gray-100 text-gray-600";
    }
  };

  return (
    <div className="flex flex-col gap-6 w-full">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold">Users Management</h1>
          <p className="text-sm text-gray-500">
            Manage all users in your system ({users.length} total)
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
              setSelectedUser(null);
              setIsFormModalOpen(true);
            }}
          >
            <Plus className="h-4 w-4" />
            Add User
          </Button>
        </div>
      </div>

      {/* Search Bar */}
      <Card className="p-4">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search users by name, email or role..."
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

      {/* Users List */}
      {filteredUsers.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {filteredUsers.map((user) => (
            <Card 
              key={user.id}
              className="hover:shadow-md transition-shadow h-full"
            >
              <div className="p-4 flex flex-col items-center text-center gap-3 h-full relative">
                {/* Action buttons in top right corner */}
                <div className="absolute top-2 right-2 flex gap-1">
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-6 w-6 rounded-full hover:bg-gray-100"
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedUser(user);
                      setIsDetailModalOpen(true);
                    }}
                  >
                    <Eye className="h-3 w-3" />
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="h-6 w-6 rounded-full hover:bg-gray-100"
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedUser(user);
                      setIsFormModalOpen(true);
                    }}
                  >
                    <Pencil className="h-3 w-3" />
                  </Button>
                </div>
                
                {/* Avatar Bubble */}
                <div className={`rounded-full h-16 w-16 flex items-center justify-center ${getRoleColor(user.role)} font-semibold text-lg`}>
                  {getInitials(user.firstName, user.lastName)}
                </div>
                
                {/* Name and Role */}
                <div className="w-full">
                  <h3 className="font-semibold text-lg truncate">
                    {user.firstName} {user.lastName}
                  </h3>
                  <div className="flex justify-center gap-2 mt-1">
                    <Badge variant={getRoleBadgeVariant(user.role)} className="text-xs">
                      {user.role.split('_').map(word => 
                        word.charAt(0).toUpperCase() + word.slice(1)
                      ).join(' ')}
                    </Badge>
                    <Badge variant={getStatusBadgeVariant(user.status)} className="text-xs">
                      {user.status.charAt(0).toUpperCase() + user.status.slice(1)}
                    </Badge>
                  </div>
                </div>
                
                {/* Contact Info */}
                <div className="w-full mt-2 space-y-1">
                  <p className="flex items-center justify-center gap-1 text-sm text-gray-600 truncate">
                    <Mail className="h-3 w-3 flex-shrink-0" />
                    <span className="truncate">{user.email}</span>
                  </p>
                  {user.phone && (
                    <p className="flex items-center justify-center gap-1 text-sm text-gray-600">
                      <Phone className="h-3 w-3 flex-shrink-0" />
                      <span className="truncate">{user.phone}</span>
                    </p>
                  )}
                </div>
                
                {/* School Info */}
                {user.school && (
                  <div className="w-full mt-2">
                    <p className="text-xs text-gray-500 flex items-center justify-center gap-1">
                      <School className="h-3 w-3 flex-shrink-0" />
                      <span className="truncate">{user.school.name}</span>
                    </p>
                  </div>
                )}
                
                {/* Dates */}
                <div className="w-full mt-auto pt-2 text-xs text-gray-500">
                  <div>Created: {new Date(user.createdAt).toLocaleDateString()}</div>
                  {user.lastLogin && (
                    <div>Last login: {new Date(user.lastLogin).toLocaleDateString()}</div>
                  )}
                </div>
              </div>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="p-12 flex flex-col items-center justify-center gap-4">
          <Frown className="h-12 w-12 text-gray-400" />
          <h3 className="font-medium text-lg">No users found</h3>
          <p className="text-sm text-gray-500 max-w-md text-center">
            No users match your search criteria. Try adjusting your search or filters.
          </p>
          <Button variant="outline" onClick={() => setSearchQuery("")}>
            Clear search
          </Button>
        </Card>
      )}

      {/* Pagination */}
      {filteredUsers.length > 0 && (
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
        title="Import Users"
        description="Upload a CSV file containing user data"
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

      {/* User Form Modal */}
      <Modal
        isOpen={isFormModalOpen}
        onClose={() => {
          setIsFormModalOpen(false);
          setSelectedUser(null);
        }}
        title={selectedUser ? "Edit User" : "Create New User"}
        description={
          selectedUser 
            ? "Update the user information" 
            : "Fill in the details for the new user"
        }
        size="2xl"
      >
        <form onSubmit={handleSubmitUser}>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Basic Information */}
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">First Name*</Label>
                  <Input 
                    id="firstName" 
                    placeholder="John" 
                    defaultValue={selectedUser?.firstName || ""} 
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="lastName">Last Name*</Label>
                  <Input 
                    id="lastName" 
                    placeholder="Doe" 
                    defaultValue={selectedUser?.lastName || ""} 
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="email">Email*</Label>
                  <Input 
                    id="email" 
                    type="email"
                    placeholder="user@example.com" 
                    defaultValue={selectedUser?.email || ""} 
                    required
                  />
                </div>
              </div>

              {/* Contact & Role */}
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="phone">Phone</Label>
                  <Input 
                    id="phone" 
                    placeholder="+1 (555) 123-4567" 
                    defaultValue={selectedUser?.phone || ""} 
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="role">Role*</Label>
                  <select
                    id="role"
                    defaultValue={selectedUser?.role || ""}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    required
                  >
                    <option value="">Select a role</option>
                    <option value="super_admin">Super Admin</option>
                    <option value="school_admin">School Admin</option>
                    <option value="teacher">Teacher</option>
                    <option value="student">Student</option>
                    <option value="parent">Parent</option>
                  </select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="status">Status*</Label>
                  <select
                    id="status"
                    defaultValue={selectedUser?.status || "active"}
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    required
                  >
                    <option value="active">Active</option>
                    <option value="pending">Pending</option>
                    <option value="inactive">Inactive</option>
                  </select>
                </div>
              </div>

              {/* School Assignment */}
              <div className="space-y-4 md:col-span-2">
                <h3 className="font-medium flex items-center gap-2">
                  <School className="h-4 w-4" />
                  School Assignment
                </h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="school">Primary School</Label>
                    <select
                      id="school"
                      defaultValue={selectedUser?.school?.id || ""}
                      className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      <option value="">Select a school</option>
                      <option value="1">Central Elementary School</option>
                      <option value="2">Sunnyvale High School</option>
                      <option value="3">Riverside Middle School</option>
                    </select>
                  </div>
                  
                  <div className="space-y-2">
                    <Label>Additional Schools</Label>
                    <div className="flex flex-wrap gap-2">
                      <Badge variant="outline" className="gap-1">
                        Central Elementary
                        <button type="button">
                          <X className="h-3 w-3" />
                        </button>
                      </Badge>
                      <Badge variant="outline" className="gap-1">
                        Sunnyvale High
                        <button type="button">
                          <X className="h-3 w-3" />
                        </button>
                      </Badge>
                      <Button variant="outline" size="sm" className="h-8">
                        <Plus className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Password */}
              {!selectedUser && (
                <div className="space-y-4 md:col-span-2">
                  <h3 className="font-medium flex items-center gap-2">
                    <Lock className="h-4 w-4" />
                    Password
                  </h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="password">Password*</Label>
                      <Input 
                        id="password" 
                        type="password"
                        placeholder="••••••••" 
                        required
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="confirmPassword">Confirm Password*</Label>
                      <Input 
                        id="confirmPassword" 
                        type="password"
                        placeholder="••••••••" 
                        required
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="flex justify-end gap-2 pt-4">
              <Button 
                variant="outline" 
                type="button"
                onClick={() => {
                  setIsFormModalOpen(false);
                  setSelectedUser(null);
                }}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading}>
                {isLoading ? (
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                ) : selectedUser ? (
                  <Save className="h-4 w-4 mr-2" />
                ) : (
                  <Plus className="h-4 w-4 mr-2" />
                )}
                {selectedUser ? "Update User" : "Create User"}
              </Button>
            </div>
          </div>
        </form>
      </Modal>

      {/* User Detail Modal */}
      <Modal
        isOpen={isDetailModalOpen}
        onClose={() => {
          setIsDetailModalOpen(false);
          setSelectedUser(null);
        }}
        title="User Details"
        description="View detailed information about this user"
        size="lg"
      >
        {selectedUser && (
          <div className="grid gap-4 py-4">
            <div className="flex flex-col items-center gap-4">
              <div className={`rounded-full h-20 w-20 flex items-center justify-center ${getRoleColor(selectedUser.role)} font-semibold text-2xl`}>
                {getInitials(selectedUser.firstName, selectedUser.lastName)}
              </div>
              
              <div className="text-center">
                <h3 className="font-semibold text-xl">
                  {selectedUser.firstName} {selectedUser.lastName}
                </h3>
                <div className="flex justify-center gap-2 mt-2">
                  <Badge variant={getRoleBadgeVariant(selectedUser.role)}>
                    {selectedUser.role.split('_').map(word => 
                      word.charAt(0).toUpperCase() + word.slice(1)
                    ).join(' ')}
                  </Badge>
                  <Badge variant={getStatusBadgeVariant(selectedUser.status)}>
                    {selectedUser.status.charAt(0).toUpperCase() + selectedUser.status.slice(1)}
                  </Badge>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
              <div className="space-y-4">
                <h4 className="font-medium">Contact Information</h4>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-gray-500" />
                    <span>{selectedUser.email}</span>
                  </div>
                  {selectedUser.phone && (
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4 text-gray-500" />
                      <span>{selectedUser.phone}</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="space-y-4">
                <h4 className="font-medium">Account Information</h4>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <span className="text-gray-500">Created:</span>
                    <span>{new Date(selectedUser.createdAt).toLocaleDateString()}</span>
                  </div>
                  {selectedUser.lastLogin && (
                    <div className="flex items-center gap-2">
                      <span className="text-gray-500">Last login:</span>
                      <span>{new Date(selectedUser.lastLogin).toLocaleDateString()}</span>
                    </div>
                  )}
                </div>
              </div>

              {selectedUser.school && (
                <div className="space-y-4 md:col-span-2">
                  <h4 className="font-medium">School Information</h4>
                  <div className="flex items-center gap-2">
                    <School className="h-4 w-4 text-gray-500" />
                    <span>{selectedUser.school.name}</span>
                  </div>
                </div>
              )}

              {selectedUser.assignedSchools && selectedUser.assignedSchools.length > 0 && (
                <div className="space-y-4 md:col-span-2">
                  <h4 className="font-medium">Assigned Schools</h4>
                  <div className="flex flex-wrap gap-2">
                    {selectedUser.assignedSchools.map(school => (
                      <Badge key={school.id} variant="outline">
                        {school.name}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="flex justify-end gap-2 pt-4">
              <Button 
                variant="outline" 
                onClick={() => {
                  setIsDetailModalOpen(false);
                  setSelectedUser(null);
                }}
              >
                Close
              </Button>
              <Button 
                onClick={() => {
                  setIsDetailModalOpen(false);
                  setIsFormModalOpen(true);
                }}
              >
                <Pencil className="h-4 w-4 mr-2" />
                Edit User
              </Button>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
}