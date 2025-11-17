/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useEffect, useState, useRef } from "react";
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
  AlertTriangle,
  X,
  Upload,
  Image,
  Crop
} from "lucide-react";
import { useRequestInfo } from "@/hooks/useRequestInfo";
import { Skeleton } from "@/components/ui/skeleton";
import Cropper from "react-cropper";
import "cropperjs/dist/cropper.css";

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

// Composant modal pour l'édition de la photo de profil
interface EditProfilePictureModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentPicture: string | null;
  onPictureUpdate: (pictureBase64: string) => void;
  userName: string;
}

function EditProfilePictureModal({ 
  isOpen, 
  onClose, 
  currentPicture, 
  onPictureUpdate,
  userName 
}: EditProfilePictureModalProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [showCropper, setShowCropper] = useState(false);
  const [croppedImage, setCroppedImage] = useState<string | null>(null);
  
  const cropperRef = useRef<HTMLImageElement>(null);

  const handleFileSelect = (file: File) => {
    if (file && file.type.startsWith('image/')) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        const imageUrl = e.target?.result as string;
        setPreviewUrl(imageUrl);
        setShowCropper(true);
        setCroppedImage(null);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      handleFileSelect(file);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    const files = e.dataTransfer.files;
    if (files && files[0]) {
      handleFileSelect(files[0]);
    }
  };

  const getCroppedImage = (): Promise<string> => {
    return new Promise((resolve) => {
      const imageElement: any = cropperRef?.current;
      const cropper: any = imageElement?.cropper;
      
      if (cropper) {
        const canvas = cropper.getCroppedCanvas({
          width: 300,
          height: 300,
          fillColor: '#fff',
          imageSmoothingEnabled: true,
          imageSmoothingQuality: 'high'
        });
        
        resolve(canvas.toDataURL('image/jpeg', 0.9));
      } else {
        resolve(previewUrl || '');
      }
    });
  };

  const handleCrop = async () => {
    const croppedImageUrl = await getCroppedImage();
    setCroppedImage(croppedImageUrl);
    setShowCropper(false);
  };

  const handleCancelCrop = () => {
    setShowCropper(false);
    setPreviewUrl(null);
    setSelectedFile(null);
    setCroppedImage(null);
  };

  const handleUpload = async () => {
    const imageToUpload = croppedImage || previewUrl;
    
    if (!imageToUpload) return;

    setIsUploading(true);
    
    try {
      // Extract only base64 part (without data:image/... prefix)
      const base64Data = imageToUpload.split(',')[1];
      
      // Pass base64 data to parent
      onPictureUpdate(base64Data);
      onClose();
      
      // Reset state
      setSelectedFile(null);
      setPreviewUrl(null);
      setShowCropper(false);
      setCroppedImage(null);
    } catch (error) {
      console.error("Error processing picture:", error);
    } finally {
      setIsUploading(false);
    }
  };

  const removePicture = () => {
    // To remove picture, pass empty string
    onPictureUpdate("");
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl w-full max-w-2xl shadow-2xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Camera className="h-5 w-5 text-blue-600" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-900">
                {showCropper ? 'Crop Image' : 'Update Profile Picture'}
              </h3>
              <p className="text-gray-600 text-sm">
                {showCropper ? 'Adjust your photo cropping' : 'Upload a new profile photo'}
              </p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 p-2 rounded-lg"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6 overflow-y-auto max-h-[60vh]">
          {showCropper ? (
            // Crop mode
            <div className="space-y-6">
              <div className="text-center">
                <p className="text-sm font-medium text-gray-700 mb-4">Crop your image</p>
                <div className="relative bg-gray-100 rounded-lg overflow-hidden max-h-[400px]">
                  <Cropper
                    ref={cropperRef}
                    src={previewUrl || ''}
                    style={{ height: 400, width: '100%' }}
                    aspectRatio={1}
                    guides={true}
                    background={false}
                    responsive={true}
                    autoCropArea={1}
                    checkOrientation={false}
                    viewMode={1}
                  />
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <Button
                  onClick={handleCrop}
                  className="flex-1 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 h-12 rounded-xl text-white font-semibold shadow-lg"
                >
                  <Crop className="h-4 w-4 mr-2" />
                  Confirm Crop
                </Button>
                <Button
                  variant="outline"
                  onClick={handleCancelCrop}
                  className="h-12 rounded-xl border-gray-300 text-gray-700 hover:bg-gray-50 font-semibold px-4"
                >
                  Cancel
                </Button>
              </div>
            </div>
          ) : (
            // Normal mode - upload or preview
            <>
              {/* Current Picture Preview */}
              <div className="text-center">
                <p className="text-sm font-medium text-gray-700 mb-4">Current Picture</p>
                <Avatar className="h-20 w-20 mx-auto border-2 border-gray-300">
                  <AvatarImage src={currentPicture || "/placeholder.svg"} />
                  <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white font-semibold">
                    {userName.split(' ').map(n => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
              </div>

              {/* Upload Area */}
              <div
                className={`border-2 border-dashed rounded-2xl p-6 text-center transition-all duration-200 ${
                  dragActive 
                    ? "border-blue-500 bg-blue-50" 
                    : "border-gray-300 bg-gray-50 hover:border-gray-400"
                }`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
              >
                <input
                  type="file"
                  id="profile-picture"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                />
                
                {croppedImage ? (
                  <div className="space-y-4">
                    <div className="relative inline-block">
                      <img
                        src={croppedImage}
                        alt="Cropped preview"
                        className="h-32 w-32 rounded-full object-cover border-4 border-white shadow-lg mx-auto"
                      />
                    </div>
                    <p className="text-sm text-gray-600">Preview of your new profile picture</p>
                  </div>
                ) : previewUrl ? (
                  <div className="space-y-4">
                    <div className="relative inline-block">
                      <img
                        src={previewUrl}
                        alt="Preview"
                        className="h-32 w-32 rounded-full object-cover border-4 border-white shadow-lg mx-auto"
                      />
                    </div>
                    <p className="text-sm text-gray-600">Image selected - click Crop&quot; to adjust</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="p-4 bg-white rounded-full w-16 h-16 mx-auto shadow-sm">
                      <Image className="h-8 w-8 text-gray-400 mx-auto" />
                    </div>
                    <div>
                      <p className="text-lg font-semibold text-gray-900 mb-2">
                        Drag and drop your photo
                      </p>
                      <p className="text-gray-600 text-sm mb-4">
                        or click to browse files
                      </p>
                      <p className="text-xs text-gray-500">
                        JPG, PNG, WEBP - Max 5MB
                      </p>
                    </div>
                  </div>
                )}

                <label
                  htmlFor="profile-picture"
                  className="cursor-pointer inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl font-semibold mt-4 hover:from-blue-600 hover:to-purple-700 transition-all duration-200 shadow-md hover:shadow-lg"
                >
                  <Upload className="h-4 w-4" />
                  Choose File
                </label>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-4">
                <Button
                  onClick={handleUpload}
                  disabled={!selectedFile || isUploading}
                  className="flex-1 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 h-12 rounded-xl text-white font-semibold shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isUploading ? (
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  ) : (
                    <Save className="h-4 w-4 mr-2" />
                  )}
                  {isUploading ? "Uploading..." : "Update Picture"}
                </Button>
                
                {previewUrl && !croppedImage && (
                  <Button
                    onClick={() => setShowCropper(true)}
                    className="h-12 rounded-xl bg-green-600 text-white hover:bg-green-700 font-semibold px-4"
                  >
                    <Crop className="h-4 w-4 mr-2" />
                    Crop
                  </Button>
                )}
                
                {currentPicture && (
                  <Button
                    variant="outline"
                    onClick={removePicture}
                    disabled={isUploading}
                    className="h-12 rounded-xl border-red-300 text-red-600 hover:bg-red-50 font-semibold px-4"
                  >
                    Remove
                  </Button>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
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

  const [showEditPicture, setShowEditPicture] = useState(false);

  const router = useRouter();
  const { tenantDomain, accessToken } = useRequestInfo();

  const handleUpdateProfile = async () => {
    if (!accessToken || !tenantDomain || !userData) return;
  
    try {
      setIsUpdating(true);
      
      const updateData: any = {};
      
      // Editable user fields
      editableFields.user_fields.forEach(field => {
        if (formData[field as keyof typeof formData] !== undefined && 
            formData[field as keyof typeof formData] !== userData[field as keyof UserData]) {
          updateData[field] = formData[field as keyof typeof formData];
        }
      });
  
      // Editable profile fields
      editableFields.profile_fields.forEach(field => {
        if (formData[field as keyof typeof formData] !== undefined && 
            formData[field as keyof typeof formData] !== profileData?.[field as keyof ProfileData]) {
          updateData[field] = formData[field as keyof typeof formData];
        }
      });
  
      // Don't send request if no fields were modified
      if (Object.keys(updateData).length === 0) {
        setIsEditing(false);
        return;
      }
  
      const result = await updateStudentProfile(accessToken, tenantDomain, updateData);
      
      if (result.success) {
        // Update local data
        if (userData) {
          setUserData({ ...userData, ...updateData });
        }
        if (profileData) {
          setProfileData({ ...profileData, ...updateData });
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
    // Reset form data
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

  // Profile picture update handler
  const handlePictureUpdate = async (pictureBase64: string) => {
    if (!accessToken || !tenantDomain || !userData) return;

    try {
      setIsUpdating(true);
      
      // Préparer les données pour la mise à jour
      const updateData: any = {
        user: {
          picture: pictureBase64 // Envoyer les données base64
        }
      };

      const result = await updateStudentProfile(accessToken, tenantDomain, updateData);
      
      if (result.success) {
        // Mettre à jour l'URL de l'image localement
        const pictureUrl = pictureBase64 
          ? `data:image/jpeg;base64,${pictureBase64}`
          : null;
      
        const updatedUserData = { ...userData, picture: pictureUrl };
        setUserData(updatedUserData);
        setFormData(prev => ({ ...prev, picture: pictureUrl }));
        
        console.log("Profile picture updated successfully");
      }
    } catch (error) {
      console.error("Error updating profile picture:", error);
    } finally {
      setIsUpdating(false);
    }
  };

  // Password change functions
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
    
    if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?])/.test(password)) {
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

      // Hide form after 3 seconds
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
          
          // Initialize form data
          setFormData({
            ...apiData.data.user,
            ...apiData.data.profile
          });
        }
      } catch (error) {
        console.error("Error fetching Teacher profile:", error);
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
                TEACHER PROFILE
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
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {stats.map((stat, index) => (
              <Card key={index} className="p-6 rounded-2xl border-0 bg-white/80 backdrop-blur-sm shadow-lg hover:shadow-xl transition-all duration-300">
                <div className="flex items-center gap-4">
                  <div className={`p-3 bg-gradient-to-br ${stat.color} rounded-xl shadow-md`}>
                    <stat.icon className="h-6 w-6 text-white" />
                  </div>
                  <div>
                    <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                    <p className="text-gray-600 text-sm">{stat.label}</p>
                  </div>
                </div>
              </Card>
            ))}
          </div>

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

                {/* Change Password Modal */}
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

                {/* Profile Picture Edit Modal */}
                <EditProfilePictureModal
                  isOpen={showEditPicture}
                  onClose={() => setShowEditPicture(false)}
                  currentPicture={userData?.picture || null}
                  onPictureUpdate={handlePictureUpdate}
                  userName={userData?.full_name || "User"}
                />

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
                          onClick={() => setShowEditPicture(true)}
                          className="absolute -bottom-2 -right-2 rounded-full p-2 bg-white border shadow-lg hover:shadow-xl transition-all duration-200"
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
              <Card className="p-6 rounded-2xl border-0 bg-white/80 backdrop-blur-sm shadow-xl">
                <div className="flex items-center gap-3 mb-4">
                  <School className="h-6 w-6 text-blue-600" />
                  <h3 className="text-lg font-semibold text-gray-900">Quick Actions</h3>
                </div>
                <div className="space-y-3">
                  <Button variant="outline" className="w-full justify-start h-11 rounded-xl border-gray-200 text-gray-700 hover:bg-gray-50">
                    <BookOpen className="h-4 w-4 mr-3" />
                    View Courses
                  </Button>
                  <Button variant="outline" className="w-full justify-start h-11 rounded-xl border-gray-200 text-gray-700 hover:bg-gray-50">
                    <Award className="h-4 w-4 mr-3" />
                    My Achievements
                  </Button>
                  <Button variant="outline" className="w-full justify-start h-11 rounded-xl border-gray-200 text-gray-700 hover:bg-gray-50">
                    <Target className="h-4 w-4 mr-3" />
                    Set Goals
                  </Button>
                </div>
              </Card>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}