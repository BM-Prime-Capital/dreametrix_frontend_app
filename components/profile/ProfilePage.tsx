"use client";

import { useState, useEffect, useRef } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User, Phone, MapPin, Calendar, Shield, AlertTriangle, Save, Edit3, Camera, Upload } from "lucide-react";
import { localStorageKey } from "@/constants/global";
import PageTitleH1 from "@/components/ui/page-title-h1";
import { Sidebar } from "@/components/layout/Sidebar";
import { TeacherRoutes, StudentRoutes, ParentRoutes, SchoolAdminRoutes } from "@/constants/routes";
import { SidebarProvider, useSidebar } from "@/lib/SidebarContext";
import { cn } from "@/utils/tailwind";

interface UserProfile {
  full_name: string;
  email: string;
  role: string;
  phone?: string;
  gender?: string;
  date_of_birth?: string;
  address?: string;
  emergency_contact?: string;
  allergies?: string[];
  medical_conditions?: string[];
  dietary_restrictions?: string[];
  parent_guardian?: string;
  status: string;
  subjects?: string[];
  grade_level?: string;
  employee_id?: string;
  hire_date?: string;
  profile_image?: string;
}

function ProfileContent() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedProfile, setEditedProfile] = useState<UserProfile | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { isCollapsed } = useSidebar();

  const getRoutesForRole = (role: string) => {
    switch (role?.toLowerCase()) {
      case 'teacher': return TeacherRoutes;
      case 'student': return StudentRoutes;
      case 'parent': return ParentRoutes;
      case 'admin': case 'school_admin': return SchoolAdminRoutes;
      default: return TeacherRoutes;
    }
  };

  useEffect(() => {
    const userData = localStorage.getItem(localStorageKey.USER_DATA);
    if (userData) {
      const parsedData = JSON.parse(userData);
      const userProfile: UserProfile = {
        full_name: parsedData.full_name || "",
        email: parsedData.email || "",
        role: parsedData.role || "teacher",
        phone: parsedData.phone || "",
        gender: parsedData.gender || "",
        date_of_birth: parsedData.date_of_birth || "",
        address: parsedData.address || "",
        emergency_contact: parsedData.emergency_contact || "",
        allergies: parsedData.allergies || [],
        medical_conditions: parsedData.medical_conditions || [],
        dietary_restrictions: parsedData.dietary_restrictions || [],
        parent_guardian: parsedData.parent_guardian || "",
        status: parsedData.status || "active",
        subjects: parsedData.subjects || [],
        grade_level: parsedData.grade_level || "",
        employee_id: parsedData.employee_id || "",
        hire_date: parsedData.hire_date || "",
        profile_image: parsedData.profile_image || "",
      };
      setProfile(userProfile);
      setEditedProfile(userProfile);
    }
  }, []);

  const handleSave = () => {
    if (editedProfile) {
      const currentData = JSON.parse(localStorage.getItem(localStorageKey.USER_DATA) || "{}");
      const updatedData = { ...currentData, ...editedProfile };
      localStorage.setItem(localStorageKey.USER_DATA, JSON.stringify(updatedData));
      setProfile(editedProfile);
      setIsEditing(false);
    }
  };

  const handleInputChange = (field: keyof UserProfile, value: string) => {
    if (editedProfile) {
      setEditedProfile({ ...editedProfile, [field]: value });
    }
  };

  const handleArrayChange = (field: keyof UserProfile, value: string) => {
    if (editedProfile && value.trim()) {
      const currentArray = (editedProfile[field] as string[]) || [];
      if (!currentArray.includes(value.trim())) {
        setEditedProfile({
          ...editedProfile,
          [field]: [...currentArray, value.trim()]
        });
      }
    }
  };

  const removeArrayItem = (field: keyof UserProfile, item: string) => {
    if (editedProfile) {
      const currentArray = (editedProfile[field] as string[]) || [];
      setEditedProfile({
        ...editedProfile,
        [field]: currentArray.filter(i => i !== item)
      });
    }
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const result = e.target?.result as string;
        setImagePreview(result);
        if (editedProfile) {
          setEditedProfile({ ...editedProfile, profile_image: result });
        }
      };
      reader.readAsDataURL(file);
    }
  };

  if (!profile) return <div>Loading...</div>;

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  const getRoleColor = (role: string) => {
    switch (role.toLowerCase()) {
      case 'teacher': return 'bg-blue-100 text-blue-800';
      case 'student': return 'bg-green-100 text-green-800';
      case 'parent': return 'bg-purple-100 text-purple-800';
      case 'admin': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'inactive': return 'bg-red-100 text-red-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className={cn(
      "min-h-screen bg-gradient-to-br from-blue-50/30 to-purple-50/20 transition-all duration-500",
      isCollapsed ? "ml-16" : "ml-64"
    )}>
      <div className="p-6">
        <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600/10 via-purple-600/10 to-blue-800/10 rounded-2xl p-6 mb-6">
          <div className="flex justify-between items-center">
            <div>
              <PageTitleH1 title="My Profile" className="text-gray-800 mb-2" />
              <p className="text-gray-600">Manage your personal information and preferences</p>
            </div>
            <Button
              onClick={() => isEditing ? handleSave() : setIsEditing(true)}
              className="flex items-center gap-2 shadow-lg"
              size="lg"
            >
              {isEditing ? <Save className="h-4 w-4" /> : <Edit3 className="h-4 w-4" />}
              {isEditing ? 'Save Changes' : 'Edit Profile'}
            </Button>
          </div>
        </div>

        {/* Profile Header Card */}
        <Card className="p-6 bg-white/80 backdrop-blur-sm shadow-lg border-0">
          <div className="flex items-center gap-6">
            <div className="relative">
              <Avatar className="h-24 w-24">
                <AvatarImage src={imagePreview || profile.profile_image || ""} />
                <AvatarFallback className="text-xl font-bold bg-primary text-white">
                  {getInitials(profile.full_name)}
                </AvatarFallback>
              </Avatar>
              {isEditing && (
                <>
                  <Button
                    size="icon"
                    variant="outline"
                    className="absolute -bottom-2 -right-2 h-8 w-8 rounded-full bg-white shadow-md"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <Camera className="h-4 w-4" />
                  </Button>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                </>
              )}
            </div>
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-gray-800">{profile.full_name}</h2>
              <p className="text-gray-600 mb-2">{profile.email}</p>
              <div className="flex gap-2">
                <Badge className={getRoleColor(profile.role)}>
                  {profile.role.charAt(0).toUpperCase() + profile.role.slice(1)}
                </Badge>
                <Badge className={getStatusColor(profile.status)}>
                  {profile.status.charAt(0).toUpperCase() + profile.status.slice(1)}
                </Badge>
              </div>
            </div>
          </div>
        </Card>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          {/* Personal Information */}
          <Card className="p-6 bg-white/80 backdrop-blur-sm shadow-lg border-0">
            <div className="flex items-center gap-2 mb-4">
              <User className="h-5 w-5 text-primary" />
              <h3 className="text-lg font-semibold">Personal Information</h3>
            </div>
            <div className="space-y-4">
              <div>
                <Label htmlFor="full_name">Full Name</Label>
                <Input
                  id="full_name"
                  value={isEditing ? editedProfile?.full_name : profile.full_name}
                  onChange={(e) => handleInputChange('full_name', e.target.value)}
                  disabled={!isEditing}
                />
              </div>
              <div>
                <Label htmlFor="gender">Gender</Label>
                <Select
                  value={isEditing ? editedProfile?.gender : profile.gender}
                  onValueChange={(value) => handleInputChange('gender', value)}
                  disabled={!isEditing}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select gender" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="male">Male</SelectItem>
                    <SelectItem value="female">Female</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                    <SelectItem value="prefer_not_to_say">Prefer not to say</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="date_of_birth">Date of Birth</Label>
                <Input
                  id="date_of_birth"
                  type="date"
                  value={isEditing ? editedProfile?.date_of_birth : profile.date_of_birth}
                  onChange={(e) => handleInputChange('date_of_birth', e.target.value)}
                  disabled={!isEditing}
                />
              </div>
              <div>
                <Label htmlFor="phone">Phone Number</Label>
                <Input
                  id="phone"
                  value={isEditing ? editedProfile?.phone : profile.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  disabled={!isEditing}
                />
              </div>
            </div>
          </Card>

          {/* Contact Information */}
          <Card className="p-6 bg-white/80 backdrop-blur-sm shadow-lg border-0">
            <div className="flex items-center gap-2 mb-4">
              <MapPin className="h-5 w-5 text-primary" />
              <h3 className="text-lg font-semibold">Contact Information</h3>
            </div>
            <div className="space-y-4">
              <div>
                <Label htmlFor="address">Address</Label>
                <Textarea
                  id="address"
                  value={isEditing ? editedProfile?.address : profile.address}
                  onChange={(e) => handleInputChange('address', e.target.value)}
                  disabled={!isEditing}
                  rows={3}
                />
              </div>
              <div>
                <Label htmlFor="emergency_contact">Emergency Contact</Label>
                <Input
                  id="emergency_contact"
                  value={isEditing ? editedProfile?.emergency_contact : profile.emergency_contact}
                  onChange={(e) => handleInputChange('emergency_contact', e.target.value)}
                  disabled={!isEditing}
                />
              </div>
              {profile.role === 'student' && (
                <div>
                  <Label htmlFor="parent_guardian">Parent/Guardian</Label>
                  <Input
                    id="parent_guardian"
                    value={isEditing ? editedProfile?.parent_guardian : profile.parent_guardian}
                    onChange={(e) => handleInputChange('parent_guardian', e.target.value)}
                    disabled={!isEditing}
                  />
                </div>
              )}
            </div>
          </Card>

          {/* Health Information */}
          <Card className="p-6 bg-white/80 backdrop-blur-sm shadow-lg border-0">
            <div className="flex items-center gap-2 mb-4">
              <AlertTriangle className="h-5 w-5 text-primary" />
              <h3 className="text-lg font-semibold">Health Information</h3>
            </div>
            <div className="space-y-4">
              <div>
                <Label>Allergies</Label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {(isEditing ? editedProfile?.allergies : profile.allergies)?.map((allergy, index) => (
                    <Badge key={index} variant="outline" className="bg-red-50">
                      {allergy}
                      {isEditing && (
                        <button
                          onClick={() => removeArrayItem('allergies', allergy)}
                          className="ml-1 text-red-500 hover:text-red-700"
                        >
                          ×
                        </button>
                      )}
                    </Badge>
                  ))}
                </div>
                {isEditing && (
                  <Input
                    placeholder="Add allergy and press Enter"
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        handleArrayChange('allergies', e.currentTarget.value);
                        e.currentTarget.value = '';
                      }
                    }}
                  />
                )}
              </div>
              <div>
                <Label>Medical Conditions</Label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {(isEditing ? editedProfile?.medical_conditions : profile.medical_conditions)?.map((condition, index) => (
                    <Badge key={index} variant="outline" className="bg-orange-50">
                      {condition}
                      {isEditing && (
                        <button
                          onClick={() => removeArrayItem('medical_conditions', condition)}
                          className="ml-1 text-orange-500 hover:text-orange-700"
                        >
                          ×
                        </button>
                      )}
                    </Badge>
                  ))}
                </div>
                {isEditing && (
                  <Input
                    placeholder="Add medical condition and press Enter"
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        handleArrayChange('medical_conditions', e.currentTarget.value);
                        e.currentTarget.value = '';
                      }
                    }}
                  />
                )}
              </div>
              <div>
                <Label>Dietary Restrictions</Label>
                <div className="flex flex-wrap gap-2 mb-2">
                  {(isEditing ? editedProfile?.dietary_restrictions : profile.dietary_restrictions)?.map((restriction, index) => (
                    <Badge key={index} variant="outline" className="bg-green-50">
                      {restriction}
                      {isEditing && (
                        <button
                          onClick={() => removeArrayItem('dietary_restrictions', restriction)}
                          className="ml-1 text-green-500 hover:text-green-700"
                        >
                          ×
                        </button>
                      )}
                    </Badge>
                  ))}
                </div>
                {isEditing && (
                  <Input
                    placeholder="Add dietary restriction and press Enter"
                    onKeyPress={(e) => {
                      if (e.key === 'Enter') {
                        handleArrayChange('dietary_restrictions', e.currentTarget.value);
                        e.currentTarget.value = '';
                      }
                    }}
                  />
                )}
              </div>
            </div>
          </Card>

          {/* Professional Information */}
          {(profile.role === 'teacher' || profile.role === 'admin') && (
            <Card className="p-6 bg-white/80 backdrop-blur-sm shadow-lg border-0">
              <div className="flex items-center gap-2 mb-4">
                <Shield className="h-5 w-5 text-primary" />
                <h3 className="text-lg font-semibold">Professional Information</h3>
              </div>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="employee_id">Employee ID</Label>
                  <Input
                    id="employee_id"
                    value={isEditing ? editedProfile?.employee_id : profile.employee_id}
                    onChange={(e) => handleInputChange('employee_id', e.target.value)}
                    disabled={!isEditing}
                  />
                </div>
                <div>
                  <Label htmlFor="hire_date">Hire Date</Label>
                  <Input
                    id="hire_date"
                    type="date"
                    value={isEditing ? editedProfile?.hire_date : profile.hire_date}
                    onChange={(e) => handleInputChange('hire_date', e.target.value)}
                    disabled={!isEditing}
                  />
                </div>
                {profile.role === 'teacher' && (
                  <div>
                    <Label>Subjects</Label>
                    <div className="flex flex-wrap gap-2 mb-2">
                      {(isEditing ? editedProfile?.subjects : profile.subjects)?.map((subject, index) => (
                        <Badge key={index} variant="outline" className="bg-blue-50">
                          {subject}
                          {isEditing && (
                            <button
                              onClick={() => removeArrayItem('subjects', subject)}
                              className="ml-1 text-blue-500 hover:text-blue-700"
                            >
                              ×
                            </button>
                          )}
                        </Badge>
                      ))}
                    </div>
                    {isEditing && (
                      <Input
                        placeholder="Add subject and press Enter"
                        onKeyPress={(e) => {
                          if (e.key === 'Enter') {
                            handleArrayChange('subjects', e.currentTarget.value);
                            e.currentTarget.value = '';
                          }
                        }}
                      />
                    )}
                  </div>
                )}
              </div>
            </Card>
          )}

          {/* Academic Information for Students */}
          {profile.role === 'student' && (
            <Card className="p-6 bg-white/80 backdrop-blur-sm shadow-lg border-0">
              <div className="flex items-center gap-2 mb-4">
                <Calendar className="h-5 w-5 text-primary" />
                <h3 className="text-lg font-semibold">Academic Information</h3>
              </div>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="grade_level">Grade Level</Label>
                  <Select
                    value={isEditing ? editedProfile?.grade_level : profile.grade_level}
                    onValueChange={(value) => handleInputChange('grade_level', value)}
                    disabled={!isEditing}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select grade level" />
                    </SelectTrigger>
                    <SelectContent>
                      {Array.from({ length: 12 }, (_, i) => (
                        <SelectItem key={i + 1} value={`grade-${i + 1}`}>
                          Grade {i + 1}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </Card>
          )}
        </div>
        </div>
      </div>
    </div>
  );
}

export default function ProfilePage() {
  const [userRole, setUserRole] = useState('teacher');

  useEffect(() => {
    const userData = localStorage.getItem(localStorageKey.USER_DATA);
    if (userData) {
      const parsedData = JSON.parse(userData);
      setUserRole(parsedData.role || 'teacher');
    }
  }, []);

  const getRoutesForRole = (role: string) => {
    switch (role?.toLowerCase()) {
      case 'teacher': return TeacherRoutes;
      case 'student': return StudentRoutes;
      case 'parent': return ParentRoutes;
      case 'admin': case 'school_admin': return SchoolAdminRoutes;
      default: return TeacherRoutes;
    }
  };

  return (
    <SidebarProvider>
      <Sidebar routes={getRoutesForRole(userRole)} />
      <ProfileContent />
    </SidebarProvider>
  );
}