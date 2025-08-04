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
import { User, Phone, MapPin, Calendar, Shield, AlertTriangle, Save, Edit3, Camera, Mail } from "lucide-react";
import { localStorageKey } from "@/constants/global";
import PageTitleH1 from "@/components/ui/page-title-h1";

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

export default function ProfilePage() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [editedProfile, setEditedProfile] = useState<UserProfile | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

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

  if (!profile) return <div className="flex items-center justify-center h-64">Loading...</div>;

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
    <section className="flex flex-col w-full h-full bg-gradient-to-br from-blue-50/30 to-purple-50/20">
      {/* Enhanced Header */}
      <div className="flex justify-between items-center bg-[#79bef2] px-8 py-6 shadow-xl rounded-2xl mx-6 mt-8">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
            <User className="h-6 w-6 text-white" />
          </div>
          <div>
            <PageTitleH1 title="My Profile" className="text-white font-bold text-2xl" />
            <p className="text-blue-100 text-sm mt-1">Manage your personal information</p>
          </div>
        </div>
        <Button
          onClick={() => isEditing ? handleSave() : setIsEditing(true)}
          className="flex items-center gap-2 bg-white/20 backdrop-blur-sm border border-white/30 hover:bg-white/30 text-white"
          size="lg"
        >
          {isEditing ? <Save className="h-4 w-4" /> : <Edit3 className="h-4 w-4" />}
          {isEditing ? 'Save Changes' : 'Edit Profile'}
        </Button>
      </div>

      {/* Content Area */}
      <div className="flex-1 mx-6 pb-8 space-y-6">
        {/* Profile Header Card */}
        <Card className="rounded-2xl shadow-xl border-0 bg-white/80 backdrop-blur-sm overflow-hidden mt-2">
          <div className="p-8">
            <div className="flex items-center gap-8">
              <div className="relative">
                <Avatar className="h-32 w-32 border-4 border-white shadow-lg">
                  <AvatarImage src={imagePreview || profile.profile_image || ""} />
                  <AvatarFallback className="text-2xl font-bold bg-gradient-to-br from-blue-500 to-purple-600 text-white">
                    {getInitials(profile.full_name)}
                  </AvatarFallback>
                </Avatar>
                {isEditing && (
                  <>
                    <Button
                      size="icon"
                      variant="outline"
                      className="absolute -bottom-2 -right-2 h-10 w-10 rounded-full bg-white shadow-lg border-2 border-white hover:bg-gray-50"
                      onClick={() => fileInputRef.current?.click()}
                    >
                      <Camera className="h-5 w-5" />
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
                <h2 className="text-3xl font-bold text-gray-800 mb-2">{profile.full_name}</h2>
                <div className="flex items-center gap-2 mb-4">
                  <Mail className="h-4 w-4 text-gray-500" />
                  <p className="text-gray-600">{profile.email}</p>
                </div>
                <div className="flex gap-3">
                  <Badge className={`${getRoleColor(profile.role)} px-3 py-1 text-sm font-medium`}>
                    {profile.role.charAt(0).toUpperCase() + profile.role.slice(1)}
                  </Badge>
                  <Badge className={`${getStatusColor(profile.status)} px-3 py-1 text-sm font-medium`}>
                    {profile.status.charAt(0).toUpperCase() + profile.status.slice(1)}
                  </Badge>
                </div>
              </div>
            </div>
          </div>
        </Card>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
          {/* Personal Information */}
          <Card className="p-6 bg-white/80 backdrop-blur-sm shadow-lg border-0 rounded-2xl">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-blue-100 rounded-lg">
                <User className="h-5 w-5 text-blue-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-800">Personal Information</h3>
            </div>
            <div className="space-y-4">
              <div>
                <Label htmlFor="full_name" className="text-sm font-medium text-gray-700">Full Name</Label>
                <Input
                  id="full_name"
                  value={isEditing ? editedProfile?.full_name : profile.full_name}
                  onChange={(e) => handleInputChange('full_name', e.target.value)}
                  disabled={!isEditing}
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="gender" className="text-sm font-medium text-gray-700">Gender</Label>
                <Select
                  value={isEditing ? editedProfile?.gender : profile.gender}
                  onValueChange={(value) => handleInputChange('gender', value)}
                  disabled={!isEditing}
                >
                  <SelectTrigger className="mt-1">
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
                <Label htmlFor="date_of_birth" className="text-sm font-medium text-gray-700">Date of Birth</Label>
                <Input
                  id="date_of_birth"
                  type="date"
                  value={isEditing ? editedProfile?.date_of_birth : profile.date_of_birth}
                  onChange={(e) => handleInputChange('date_of_birth', e.target.value)}
                  disabled={!isEditing}
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="phone" className="text-sm font-medium text-gray-700">Phone Number</Label>
                <Input
                  id="phone"
                  value={isEditing ? editedProfile?.phone : profile.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  disabled={!isEditing}
                  className="mt-1"
                />
              </div>
            </div>
          </Card>

          {/* Contact Information */}
          <Card className="p-6 bg-white/80 backdrop-blur-sm shadow-lg border-0 rounded-2xl">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-green-100 rounded-lg">
                <MapPin className="h-5 w-5 text-green-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-800">Contact Information</h3>
            </div>
            <div className="space-y-4">
              <div>
                <Label htmlFor="address" className="text-sm font-medium text-gray-700">Address</Label>
                <Textarea
                  id="address"
                  value={isEditing ? editedProfile?.address : profile.address}
                  onChange={(e) => handleInputChange('address', e.target.value)}
                  disabled={!isEditing}
                  rows={3}
                  className="mt-1"
                />
              </div>
              <div>
                <Label htmlFor="emergency_contact" className="text-sm font-medium text-gray-700">Emergency Contact</Label>
                <Input
                  id="emergency_contact"
                  value={isEditing ? editedProfile?.emergency_contact : profile.emergency_contact}
                  onChange={(e) => handleInputChange('emergency_contact', e.target.value)}
                  disabled={!isEditing}
                  className="mt-1"
                />
              </div>
              {profile.role === 'student' && (
                <div>
                  <Label htmlFor="parent_guardian" className="text-sm font-medium text-gray-700">Parent/Guardian</Label>
                  <Input
                    id="parent_guardian"
                    value={isEditing ? editedProfile?.parent_guardian : profile.parent_guardian}
                    onChange={(e) => handleInputChange('parent_guardian', e.target.value)}
                    disabled={!isEditing}
                    className="mt-1"
                  />
                </div>
              )}
            </div>
          </Card>

          {/* Health Information */}
          <Card className="p-6 bg-white/80 backdrop-blur-sm shadow-lg border-0 rounded-2xl">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-red-100 rounded-lg">
                <AlertTriangle className="h-5 w-5 text-red-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-800">Health Information</h3>
            </div>
            <div className="space-y-4">
              <div>
                <Label className="text-sm font-medium text-gray-700">Allergies</Label>
                <div className="flex flex-wrap gap-2 mt-2 mb-2">
                  {(isEditing ? editedProfile?.allergies : profile.allergies)?.map((allergy, index) => (
                    <Badge key={index} variant="outline" className="bg-red-50 border-red-200">
                      {allergy}
                      {isEditing && (
                        <button
                          onClick={() => removeArrayItem('allergies', allergy)}
                          className="ml-2 text-red-500 hover:text-red-700"
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
                    className="mt-2"
                  />
                )}
              </div>
              <div>
                <Label className="text-sm font-medium text-gray-700">Medical Conditions</Label>
                <div className="flex flex-wrap gap-2 mt-2 mb-2">
                  {(isEditing ? editedProfile?.medical_conditions : profile.medical_conditions)?.map((condition, index) => (
                    <Badge key={index} variant="outline" className="bg-orange-50 border-orange-200">
                      {condition}
                      {isEditing && (
                        <button
                          onClick={() => removeArrayItem('medical_conditions', condition)}
                          className="ml-2 text-orange-500 hover:text-orange-700"
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
                    className="mt-2"
                  />
                )}
              </div>
            </div>
          </Card>

          {/* Professional Information */}
          {(profile.role === 'teacher' || profile.role === 'admin') && (
            <Card className="p-6 bg-white/80 backdrop-blur-sm shadow-lg border-0 rounded-2xl">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-purple-100 rounded-lg">
                  <Shield className="h-5 w-5 text-purple-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-800">Professional Information</h3>
              </div>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="employee_id" className="text-sm font-medium text-gray-700">Employee ID</Label>
                  <Input
                    id="employee_id"
                    value={isEditing ? editedProfile?.employee_id : profile.employee_id}
                    onChange={(e) => handleInputChange('employee_id', e.target.value)}
                    disabled={!isEditing}
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label htmlFor="hire_date" className="text-sm font-medium text-gray-700">Hire Date</Label>
                  <Input
                    id="hire_date"
                    type="date"
                    value={isEditing ? editedProfile?.hire_date : profile.hire_date}
                    onChange={(e) => handleInputChange('hire_date', e.target.value)}
                    disabled={!isEditing}
                    className="mt-1"
                  />
                </div>
                {profile.role === 'teacher' && (
                  <div>
                    <Label className="text-sm font-medium text-gray-700">Subjects</Label>
                    <div className="flex flex-wrap gap-2 mt-2 mb-2">
                      {(isEditing ? editedProfile?.subjects : profile.subjects)?.map((subject, index) => (
                        <Badge key={index} variant="outline" className="bg-blue-50 border-blue-200">
                          {subject}
                          {isEditing && (
                            <button
                              onClick={() => removeArrayItem('subjects', subject)}
                              className="ml-2 text-blue-500 hover:text-blue-700"
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
                        className="mt-2"
                      />
                    )}
                  </div>
                )}
              </div>
            </Card>
          )}

          {/* Academic Information for Students */}
          {profile.role === 'student' && (
            <Card className="p-6 bg-white/80 backdrop-blur-sm shadow-lg border-0 rounded-2xl">
              <div className="flex items-center gap-3 mb-6">
                <div className="p-2 bg-yellow-100 rounded-lg">
                  <Calendar className="h-5 w-5 text-yellow-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-800">Academic Information</h3>
              </div>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="grade_level" className="text-sm font-medium text-gray-700">Grade Level</Label>
                  <Select
                    value={isEditing ? editedProfile?.grade_level : profile.grade_level}
                    onValueChange={(value) => handleInputChange('grade_level', value)}
                    disabled={!isEditing}
                  >
                    <SelectTrigger className="mt-1">
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
    </section>
  );
}