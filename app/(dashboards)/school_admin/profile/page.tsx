/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useRouter } from "next/navigation";
import { getStudentProfileInfo, updateStudentProfile, changePassword } from "@/services/admin-service";
import {
  GraduationCap,
  Mail,
  School,
  User,
  MapPin,
  Shield,
  Camera,
  ArrowLeft,
  Save,
  RotateCcw,
  CheckCircle,
  Award,
  BookOpen,
  Target,
  Loader2,
  Eye,
  EyeOff,
  Key,
  AlertTriangle
} from "lucide-react";
import { useRequestInfo } from "@/hooks/useRequestInfo";
import { Skeleton } from "@/components/ui/skeleton";
import { useOnboarding } from "@/hooks/useOnboarding";

interface UserData {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  full_name: string;
  phone_number: string | null;
  role: string;
  country: string;
  city: string | null;
  address: string | null;
  zip_code: string | null;
  age: number | null;
  bio: string | null;
  picture: string | null;
  date_joined: string;
}

interface ProfileData {
  id: number;
  bio: string | null;
  emergency_contact_name: string | null;
  emergency_contact_phone: string | null;
  emergency_contact_relationship: string | null;
  medical_conditions: string | null;
  allergies: string | null;
  created_at: string;
  updated_at: string;
}

interface EditableFields {
  user_fields: string[];
  profile_fields: string[];
}

interface StudentProfileData {
  user: UserData;
  profile: ProfileData;
}

interface ApiResponse {
  success: boolean;
  data: StudentProfileData;
  editable_fields: EditableFields;
}

interface ChangePasswordData {
  current_password: string;
  new_password: string;
  confirm_password: string;
}

export default function StudentProfile() {
  const [userData, setUserData] = useState<UserData | null>(null);
  const [profileData, setProfileData] = useState<ProfileData | null>(null);
  const [editableFields, setEditableFields] = useState<EditableFields>({
    user_fields: [],
    profile_fields: []
  });
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isUpdating, setIsUpdating] = useState(false);
  const [formData, setFormData] = useState<Partial<UserData & ProfileData>>({});
  
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [passwordData, setPasswordData] = useState<ChangePasswordData>({
    current_password: "",
    new_password: "",
    confirm_password: ""
  });
  const [passwordError, setPasswordError] = useState<string | null>(null);
  const [passwordSuccess, setPasswordSuccess] = useState(false);
  const [showPasswords, setShowPasswords] = useState({
    current: false,
    new: false,
    confirm: false
  });

  const router = useRouter();
  const { tenantDomain, accessToken, userId } = useRequestInfo();
  const { markTaskComplete } = useOnboarding();

  const handleUpdateProfile = async () => {
    if (!accessToken || !tenantDomain || !userData) return;

    try {
      setIsUpdating(true);
      
      const updateData: any = {};
      
      editableFields.user_fields.forEach(field => {
        if (formData[field as keyof typeof formData] !== undefined && 
            formData[field as keyof typeof formData] !== userData[field as keyof UserData]) {
          if (!updateData.user) updateData.user = {};
          updateData.user[field] = formData[field as keyof typeof formData];
        }
      });

      // Champs profile éditables
      editableFields.profile_fields.forEach(field => {
        if (formData[field as keyof typeof formData] !== undefined && 
            formData[field as keyof typeof formData] !== profileData?.[field as keyof ProfileData]) {
          if (!updateData.profile) updateData.profile = {};
          updateData.profile[field] = formData[field as keyof typeof formData];
        }
      });

      // Si aucun champ n'a été modifié, ne pas envoyer la requête
      if (!updateData.user && !updateData.profile) {
        setIsEditing(false);
        return;
      }

      const result = await updateStudentProfile(accessToken, tenantDomain, updateData);
      
      if (result.success) {
        // Mettre à jour les données locales
        if (updateData.user && userData) {
          setUserData({ ...userData, ...updateData.user });
        }
        if (updateData.profile && profileData) {
          setProfileData({ ...profileData, ...updateData.profile });
        }
        setIsEditing(false);
      }
    } catch (error) {
      console.error("Error updating profile:", error);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    // Réinitialiser les données du formulaire
    if (userData && profileData) {
      setFormData({
        ...userData,
        ...profileData
      });
    }
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  // Fonctions pour le changement de mot de passe
  const handlePasswordChange = (field: keyof ChangePasswordData, value: string) => {
    setPasswordData(prev => ({
      ...prev,
      [field]: value
    }));
    setPasswordError(null);
  };

  const validatePassword = (password: string): string | null => {
    if (!password) return "Password is required";
    if (password.length < 8) return "Password must be at least 8 characters long";
    if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/.test(password)) {
      return "Password must contain at least one uppercase letter, one lowercase letter, one number and one special character";
    }
    return null;
  };

  const handleChangePassword = async () => {
    if (!accessToken || !tenantDomain) return;

    // Validation
    if (!passwordData.current_password) {
      setPasswordError("Current password is required");
      return;
    }

    const newPasswordError = validatePassword(passwordData.new_password);
    if (newPasswordError) {
      setPasswordError(newPasswordError);
      return;
    }

    if (passwordData.new_password !== passwordData.confirm_password) {
      setPasswordError("New passwords do not match");
      return;
    }

    try {
      setIsChangingPassword(true);
      setPasswordError(null);

      await changePassword(
        accessToken,
        tenantDomain,
        passwordData.current_password,
        passwordData.new_password,
        passwordData.confirm_password
      );

      setPasswordSuccess(true);
      setPasswordData({
        current_password: "",
        new_password: "",
        confirm_password: ""
      });

      // Mark password change task as complete
      markTaskComplete('change_password');
      localStorage.setItem(`password_changed_since_first_login_${userId}`, 'true');

      // Cacher le formulaire après 3 secondes
      setTimeout(() => {
        setShowChangePassword(false);
        setPasswordSuccess(false);
      }, 3000);

    } catch (error) {
      setPasswordError(error instanceof Error ? error.message : "Failed to change password");
    } finally {
      setIsChangingPassword(false);
    }
  };

  const toggleShowPassword = (field: keyof typeof showPasswords) => {
    setShowPasswords(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
  };

  const resetPasswordForm = () => {
    setPasswordData({
      current_password: "",
      new_password: "",
      confirm_password: ""
    });
    setPasswordError(null);
    setPasswordSuccess(false);
  };

  useEffect(() => {
    const getStudentProfile = async () => {
      try {
        setIsLoading(true);
        const result = await getStudentProfileInfo(accessToken, tenantDomain);
        
        if (result.success && result.data) {
          const apiData = result.data as ApiResponse;
          setUserData(apiData.data.user);
          setProfileData(apiData.data.profile);
          setEditableFields(apiData.editable_fields);
          
          // Initialiser les données du formulaire
          setFormData({
            ...apiData.data.user,
            ...apiData.data.profile
          });
        }
      } catch (error) {
        console.error("Error fetching Admin profile:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    if (accessToken && tenantDomain) {
      getStudentProfile();
    }
  }, [accessToken, tenantDomain]);

  const stats = [
    { icon: BookOpen, label: "Courses", value: "8", color: "from-blue-500 to-cyan-500" },
    { icon: Award, label: "Achievements", value: "12", color: "from-purple-500 to-pink-500" },
    { icon: Target, label: "Goals", value: "5", color: "from-green-500 to-emerald-500" },
    { icon: CheckCircle, label: "Completed", value: "89%", color: "from-orange-500 to-red-500" }
  ];

  const isFieldEditable = (field: string, section: 'user' | 'profile') => {
    return editableFields[`${section}_fields` as keyof EditableFields]?.includes(field);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 w-full">
        <div className="rounded-2xl p-8 mx-4 mt-4 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white shadow-2xl">
          <Skeleton className="h-12 w-64 bg-white/20 rounded-xl" />
        </div>
        <div className="p-4">
          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              {stats.map((_, index) => (
                <Skeleton key={index} className="h-24 rounded-2xl bg-white/80" />
              ))}
            </div>
            <div className="grid lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2">
                <Skeleton className="h-[600px] rounded-2xl bg-white/80" />
              </div>
              <div className="space-y-6">
                <Skeleton className="h-48 rounded-2xl bg-white/80" />
                <Skeleton className="h-64 rounded-2xl bg-white/80" />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 w-full">
      {/* Header */}
      <div className="rounded-2xl p-8 mx-4 mt-4 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 text-white shadow-2xl">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              className="text-white hover:bg-white/20 p-3 rounded-full transition-all duration-200 backdrop-blur-sm"
              onClick={() => router.back()}
            >
              <ArrowLeft className="h-6 w-6" />
            </Button>
            <div>
              <h1 className="text-4xl font-extrabold tracking-tight mb-2">
                ADMIN PROFILE
              </h1>
              <p className="text-blue-100 text-lg opacity-90">
                Manage your personal and academic information
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <Avatar className="h-16 w-16 border-4 border-white/30 shadow-2xl">
              <AvatarImage src={userData?.picture || "/placeholder.svg"} />
              <AvatarFallback className="bg-white/20 text-xl font-bold text-white">
                {userData?.first_name?.[0]}{userData?.last_name?.[0]}
              </AvatarFallback>
            </Avatar>
          </div>
        </div>
      </div>

      <div className="p-4">
        <div className="max-w-7xl mx-auto">
          {/* Stats Cards */}
          

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Profile Information Card */}
            <div className="lg:col-span-2">
              <Card className="p-8 rounded-2xl border-0 bg-white/80 backdrop-blur-sm shadow-xl">
                <div className="flex items-center justify-between mb-8">
                  <div className="flex items-center gap-4">
                    <div className="p-3 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl shadow-md">
                      <User className="h-6 w-6 text-white" />
                    </div>
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900">Profile Information</h2>
                      <p className="text-gray-600">Update your personal details</p>
                    </div>
                  </div>
                  
                  <div className="flex gap-3">
                    <Button
                      onClick={() => setShowChangePassword(true)}
                      variant="outline"
                      className="rounded-xl border-blue-500 text-blue-600 hover:bg-blue-50 transition-all duration-300"
                    >
                      <Key className="h-4 w-4 mr-2" />
                      Change Password
                    </Button>
                    <Button
                      onClick={() => isEditing ? handleUpdateProfile() : setIsEditing(true)}
                      disabled={isUpdating}
                      className={`rounded-xl transition-all duration-300 ${
                        isEditing 
                          ? "bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700" 
                          : "bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
                      }`}
                    >
                      {isUpdating ? (
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      ) : isEditing ? (
                        <Save className="h-4 w-4 mr-2" />
                      ) : (
                        <User className="h-4 w-4 mr-2" />
                      )}
                      {isUpdating ? "Saving..." : isEditing ? "Save Changes" : "Edit Profile"}
                    </Button>
                  </div>
                </div>

                {/* Modal de changement de mot de passe */}
                {showChangePassword && (
                  <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-2xl">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-xl font-bold text-gray-900">Change Password</h3>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => {
                            setShowChangePassword(false);
                            resetPasswordForm();
                          }}
                          className="text-gray-500 hover:text-gray-700"
                        >
                          ✕
                        </Button>
                      </div>

                      {passwordSuccess ? (
                        <div className="text-center py-8">
                          <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
                          <h4 className="text-lg font-semibold text-gray-900 mb-2">Password Changed Successfully!</h4>
                          <p className="text-gray-600">Your password has been updated successfully.</p>
                        </div>
                      ) : (
                        <div className="space-y-4">
                          <div>
                            <label className="text-sm font-medium text-gray-700 mb-2 block">
                              Current Password
                            </label>
                            <div className="relative">
                              <Input
                                type={showPasswords.current ? "text" : "password"}
                                value={passwordData.current_password}
                                onChange={(e) => handlePasswordChange('current_password', e.target.value)}
                                className="h-12 rounded-xl pr-10"
                                placeholder="Enter current password"
                              />
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={() => toggleShowPassword('current')}
                                className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                              >
                                {showPasswords.current ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                              </Button>
                            </div>
                          </div>

                          <div>
                            <label className="text-sm font-medium text-gray-700 mb-2 block">
                              New Password
                            </label>
                            <div className="relative">
                              <Input
                                type={showPasswords.new ? "text" : "password"}
                                value={passwordData.new_password}
                                onChange={(e) => handlePasswordChange('new_password', e.target.value)}
                                className="h-12 rounded-xl pr-10"
                                placeholder="Enter new password"
                              />
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={() => toggleShowPassword('new')}
                                className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                              >
                                {showPasswords.new ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                              </Button>
                            </div>
                          </div>

                          <div>
                            <label className="text-sm font-medium text-gray-700 mb-2 block">
                              Confirm New Password
                            </label>
                            <div className="relative">
                              <Input
                                type={showPasswords.confirm ? "text" : "password"}
                                value={passwordData.confirm_password}
                                onChange={(e) => handlePasswordChange('confirm_password', e.target.value)}
                                className="h-12 rounded-xl pr-10"
                                placeholder="Confirm new password"
                              />
                              <Button
                                type="button"
                                variant="ghost"
                                size="sm"
                                onClick={() => toggleShowPassword('confirm')}
                                className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                              >
                                {showPasswords.confirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                              </Button>
                            </div>
                          </div>

                          {passwordError && (
                            <div className="flex items-center text-red-600 bg-red-50 p-3 rounded-lg">
                              <AlertTriangle className="h-4 w-4 mr-2" />
                              <span className="text-sm">{passwordError}</span>
                            </div>
                          )}

                          <div className="flex gap-3 pt-4">
                            <Button
                              onClick={handleChangePassword}
                              disabled={isChangingPassword}
                              className="flex-1 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 h-12 rounded-xl text-white font-semibold"
                            >
                              {isChangingPassword ? (
                                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                              ) : (
                                <Key className="h-4 w-4 mr-2" />
                              )}
                              {isChangingPassword ? "Changing..." : "Change Password"}
                            </Button>
                            <Button
                              variant="outline"
                              onClick={() => {
                                setShowChangePassword(false);
                                resetPasswordForm();
                              }}
                              disabled={isChangingPassword}
                              className="flex-1 h-12 rounded-xl border-gray-300 text-gray-700 hover:bg-gray-50 font-semibold"
                            >
                              Cancel
                            </Button>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                <div className="space-y-8">
                  {/* Avatar Section */}
                  <div className="flex items-center gap-6 p-6 bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl border border-blue-200">
                    <div className="relative">
                      <Avatar className="h-24 w-24 border-4 border-white shadow-2xl">
                        <AvatarImage src={userData?.picture || "/placeholder.svg"} />
                        <AvatarFallback className="text-2xl font-bold bg-gradient-to-br from-blue-500 to-purple-600 text-white">
                          {userData?.first_name?.[0]}{userData?.last_name?.[0]}
                        </AvatarFallback>
                      </Avatar>
                      {isEditing && isFieldEditable('picture', 'user') && (
                        <Button
                          size="sm"
                          className="absolute -bottom-2 -right-2 rounded-full p-2 bg-white border shadow-lg hover:shadow-xl"
                        >
                          <Camera className="h-4 w-4 text-blue-600" />
                        </Button>
                      )}
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">{userData?.full_name}</h3>
                      <p className="text-gray-600 mb-1 flex items-center gap-2">
                        <Mail className="h-4 w-4" />
                        {userData?.email}
                      </p>
                      <p className="text-gray-600 flex items-center gap-2">
                        <School className="h-4 w-4" />
                        Student ID: STU{userData?.id.toString().padStart(6, '0')}
                      </p>
                    </div>
                  </div>

                  {/* Form Sections */}
                  <div className="grid md:grid-cols-2 gap-8">
                    {/* Personal Information */}
                    <div className="space-y-6">
                      <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                        <User className="h-5 w-5 text-blue-600" />
                        Personal Details
                      </h3>
                      
                      <div className="space-y-4">
                        <div>
                          <label className="text-sm font-medium text-gray-700 mb-2 block">
                            First Name
                          </label>
                          <Input
                            value={formData.first_name || ''}
                            onChange={(e) => handleInputChange('first_name', e.target.value)}
                            disabled={!isEditing || !isFieldEditable('first_name', 'user')}
                            className="h-12 rounded-xl border-gray-200 bg-white focus:border-blue-400 focus:ring-blue-400"
                          />
                        </div>

                        <div>
                          <label className="text-sm font-medium text-gray-700 mb-2 block">
                            Last Name
                          </label>
                          <Input
                            value={formData.last_name || ''}
                            onChange={(e) => handleInputChange('last_name', e.target.value)}
                            disabled={!isEditing || !isFieldEditable('last_name', 'user')}
                            className="h-12 rounded-xl border-gray-200 bg-white focus:border-blue-400 focus:ring-blue-400"
                          />
                        </div>
                        
                        <div>
                          <label className="text-sm font-medium text-gray-700 mb-2 block">
                            Phone Number
                          </label>
                          <Input
                            value={formData.phone_number || ''}
                            onChange={(e) => handleInputChange('phone_number', e.target.value)}
                            disabled={!isEditing || !isFieldEditable('phone_number', 'user')}
                            className="h-12 rounded-xl border-gray-200 bg-white focus:border-blue-400 focus:ring-blue-400"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Additional Information */}
                    <div className="space-y-6">
                      <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                        <MapPin className="h-5 w-5 text-green-600" />
                        Location Information
                      </h3>
                      
                      <div className="space-y-4">
                        <div>
                          <label className="text-sm font-medium text-gray-700 mb-2 block">
                            Address
                          </label>
                          <Input
                            value={formData.address || ''}
                            onChange={(e) => handleInputChange('address', e.target.value)}
                            disabled={!isEditing || !isFieldEditable('address', 'user')}
                            className="h-12 rounded-xl border-gray-200 bg-white focus:border-green-400 focus:ring-green-400"
                          />
                        </div>
                        
                        <div>
                          <label className="text-sm font-medium text-gray-700 mb-2 block">
                            City
                          </label>
                          <Input
                            value={formData.city || ''}
                            onChange={(e) => handleInputChange('city', e.target.value)}
                            disabled={!isEditing || !isFieldEditable('city', 'user')}
                            className="h-12 rounded-xl border-gray-200 bg-white focus:border-green-400 focus:ring-green-400"
                          />
                        </div>
                        
                        <div>
                          <label className="text-sm font-medium text-gray-700 mb-2 block">
                            ZIP Code
                          </label>
                          <Input
                            value={formData.zip_code || ''}
                            onChange={(e) => handleInputChange('zip_code', e.target.value)}
                            disabled={!isEditing || !isFieldEditable('zip_code', 'user')}
                            className="h-12 rounded-xl border-gray-200 bg-white focus:border-green-400 focus:ring-green-400"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Bio Section */}
                  <div className="space-y-6">
                    <h3 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                      <GraduationCap className="h-5 w-5 text-purple-600" />
                      Bio & Additional Information
                    </h3>
                    
                    <div>
                      <label className="text-sm font-medium text-gray-700 mb-2 block">
                        Bio
                      </label>
                      <Input
                        value={formData.bio || ''}
                        onChange={(e) => handleInputChange('bio', e.target.value)}
                        disabled={!isEditing || !isFieldEditable('bio', 'user')}
                        className="h-12 rounded-xl border-gray-200 bg-white focus:border-purple-400 focus:ring-purple-400"
                        placeholder="Tell us about yourself..."
                      />
                    </div>
                  </div>

                  {/* Action Buttons */}
                  {isEditing && (
                    <div className="flex gap-4 pt-6 border-t border-gray-200">
                      <Button
                        onClick={handleUpdateProfile}
                        disabled={isUpdating}
                        className="flex-1 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 h-12 rounded-xl text-white font-semibold shadow-lg hover:shadow-xl transition-all duration-300"
                      >
                        {isUpdating ? (
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        ) : (
                          <Save className="h-4 w-4 mr-2" />
                        )}
                        {isUpdating ? "Saving..." : "Save Changes"}
                      </Button>
                      <Button
                        variant="outline"
                        onClick={handleCancelEdit}
                        disabled={isUpdating}
                        className="flex-1 h-12 rounded-xl border-gray-300 text-gray-700 hover:bg-gray-50 font-semibold transition-all duration-300"
                      >
                        <RotateCcw className="h-4 w-4 mr-2" />
                        Cancel
                      </Button>
                    </div>
                  )}
                </div>
              </Card>
            </div>

            {/* Sidebar - Quick Info */}
            <div className="space-y-6">
              {/* Account Status */}
              <Card className="p-6 rounded-2xl border-0 bg-gradient-to-br from-blue-500 to-purple-600 text-white shadow-xl">
                <div className="flex items-center gap-3 mb-4">
                  <Shield className="h-6 w-6" />
                  <h3 className="text-lg font-semibold">Account Status</h3>
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-blue-100">Verified</span>
                    <CheckCircle className="h-5 w-5 text-green-300" />
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-blue-100">Active</span>
                    <CheckCircle className="h-5 w-5 text-green-300" />
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-blue-100">Member Since</span>
                    <span className="text-blue-100">
                      {userData ? new Date(userData.date_joined).getFullYear() : '2024'}
                    </span>
                  </div>
                </div>
              </Card>

              {/* Quick Actions */}
              
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}