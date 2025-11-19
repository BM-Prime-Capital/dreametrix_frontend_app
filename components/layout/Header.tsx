/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import { useState, useRef } from "react"
import Cookies from "js-cookie"
import {  
  ChevronDown, 
  LogOut,
  School,
  Pencil,
  Camera,
  Upload,
  Image,
  Crop,
  X,
  Loader2
} from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu"
import { localStorageKey } from "@/constants/global"
import { cn } from "@/utils/tailwind"
import DreaMetrixLogo from "../ui/dreametrix-logo"
import UserAvatar from "../ui/user-avatar"
import { Button } from "../ui/button"
import { useRequestInfo } from "@/hooks/useRequestInfo"
import Cropper from "react-cropper"
import "cropperjs/dist/cropper.css"
import { useRouter } from "next/navigation"

interface EditSchoolLogoModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentLogo: string | null;
  onLogoUpdate: (logoBase64: string) => void;
  schoolName: string;
}

function EditSchoolLogoModal({ 
  isOpen, 
  onClose, 
  currentLogo, 
  onLogoUpdate
}: EditSchoolLogoModalProps) {
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
          width: 160,
          height: 160,
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
      const base64Data = imageToUpload.split(',')[1];
      
      onLogoUpdate(base64Data);
      onClose();
      
      // Reset state
      setSelectedFile(null);
      setPreviewUrl(null);
      setShowCropper(false);
      setCroppedImage(null);
    } catch (error) {
      console.error("Error processing logo:", error);
    } finally {
      setIsUploading(false);
    }
  };



  const removeLogo = () => {
    // To remove logo, pass empty string
    onLogoUpdate("");
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
                {showCropper ? 'Crop Logo' : 'Update School Logo'}
              </h3>
              <p className="text-gray-600 text-sm">
                {showCropper ? 'Adjust your logo cropping' : 'Upload a new school logo'}
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
                <p className="text-sm font-medium text-gray-700 mb-4">Crop your logo (circular format)</p>
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
              {/* Current Logo Preview */}
              <div className="text-center">
                <p className="text-sm font-medium text-gray-700 mb-4">Current Logo</p>
                <div className="flex h-20 w-20 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-purple-600 shadow-lg mx-auto">
                  {currentLogo ? (
                    <img
                      src={currentLogo}
                      alt="School logo"
                      className="h-16 w-16 rounded-full object-cover"
                    />
                  ) : (
                    <School className="h-8 w-8 text-white" />
                  )}
                </div>
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
                  id="school-logo"
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
                    <p className="text-sm text-gray-600">Preview of your new school logo (circular)</p>
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
                    <p className="text-sm text-gray-600">Image selected - click &quot;Crop&quot; to adjust</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="p-4 bg-white rounded-full w-16 h-16 mx-auto shadow-sm">
                      <Image className="h-8 w-8 text-gray-400 mx-auto" />
                    </div>
                    <div>
                      <p className="text-lg font-semibold text-gray-900 mb-2">
                        Drag and drop your logo
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
                  htmlFor="school-logo"
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
                    <Upload className="h-4 w-4 mr-2" />
                  )}
                  {isUploading ? "Uploading..." : "Update Logo"}
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
                
                {currentLogo && (
                  <Button
                    variant="outline"
                    onClick={removeLogo}
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

const getSchoolInitials = (schoolName: string): string => {
  if (!schoolName || schoolName === "School") return "SC";
  
  const words = schoolName.split(' ').filter(word => word.length > 0);
  
  if (words.length === 0) return "SC";
  if (words.length === 1) return words[0].substring(0, 2).toUpperCase();
  
  return (words[0][0] + words[words.length - 1][0]).toUpperCase();
};

export function Header() {
  const router = useRouter()
  const { schoolData } = useRequestInfo()
  const [isLogoHovered, setIsLogoHovered] = useState(false)
  const [showEditLogo, setShowEditLogo] = useState(false)
  const [schoolLogo, setSchoolLogo] = useState<string | null>(null)

  const getUserData = (): { full_name: string, role: string } => {
    if (typeof window === 'undefined') return { full_name: "Guest", role: "Guest" }
    
    try {
      const userData = localStorage.getItem(localStorageKey.USER_DATA)
      console.log("VVVVVVVV>>>userData", userData);
      return userData 
        ? JSON.parse(userData) 
        : { full_name: "Guest", role: "Guest" }
    } catch (error) {
      console.error("Error parsing user data:", error)
      return { full_name: "Guest", role: "Guest" }
    }
  }

  const getSchoolInfo = () => {
    if (!schoolData) {
      return { name: "School", hasLogo: false }
    }

    try {
      const name = schoolData.name || "School"
      const hasLogo = schoolData.has_logo || schoolData.logo_url || false
      return { name, hasLogo }
    } catch (error) {
      console.error("Error parsing school data:", error)
      return { name: "School", hasLogo: false }
    }
  }

  const { full_name, role } = getUserData()
  const { name: schoolName } = getSchoolInfo()

  const isSchoolAdmin = role === "school_admin"

  const handleLogoClick = () => {
    if (isSchoolAdmin) {
      setShowEditLogo(true)
    }
  }

  const handleLogout = () => {
    Cookies.remove("tenantDomain")
    Cookies.remove(localStorageKey.ACCESS_TOKEN)
    localStorage.clear()
    router.push("/")
  }

  const handleLogoUpdate = async (logoBase64: string) => {
    try {
      if (logoBase64) {
        const logoUrl = `data:image/jpeg;base64,${logoBase64}`
        setSchoolLogo(logoUrl)
        console.log("Logo updated successfully")
      } else {
        // Remove logo
        setSchoolLogo(null)
        console.log("Logo removed successfully")
      }
    } catch (error) {
      console.error("Error updating school logo:", error)
    }
  }

  return (
    <>
      <header className="sticky top-0 z-50 w-full border-b border-white/20 bg-gradient-to-r from-white/10 via-white/5 to-white/10 backdrop-blur-xl shadow-lg">
        {/* Glass overlay effects */}
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 via-purple-500/5 to-pink-500/5"></div>
        <div className="absolute inset-0 bg-gradient-to-b from-white/10 via-transparent to-white/5"></div>
        
        <div className="relative pl-4 flex h-16 items-center justify-between gap-4 z-10">
          
          <div className="flex items-center gap-3 flex-1">
            <div className="flex items-center gap-2">
              <div 
                className={cn(
                  "relative group",
                  isSchoolAdmin && "cursor-pointer"
                )}
                onMouseEnter={() => isSchoolAdmin && setIsLogoHovered(true)}
                onMouseLeave={() => isSchoolAdmin && setIsLogoHovered(false)}
                onClick={handleLogoClick}
              >
                <div className={cn(
                  "flex h-10 w-10 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-purple-600 shadow-lg transition-all duration-300",
                  isSchoolAdmin && "group-hover:scale-105"
                )}>
                  {schoolLogo ? (
                    <img
                      src={schoolLogo}
                      alt="School logo"
                      className="h-8 w-8 rounded-full object-cover"
                    />
                  ) : (
                    <span className="text-white font-bold text-sm">
                      {getSchoolInitials(schoolName)}
                    </span>
                  )}
                </div>
                
                {/* Afficher le crayon seulement pour les school_admin */}
                {isSchoolAdmin && (
                  <div className={cn(
                    "absolute -top-1 -right-1 bg-blue-500 rounded-full p-1 shadow-lg transition-all duration-300",
                    isLogoHovered ? "opacity-100 scale-100" : "opacity-0 scale-50"
                  )}>
                    <Pencil className="h-2.5 w-2.5 text-white" />
                  </div>
                )}
              </div>
              
              <div className="hidden sm:block">
                <p className="text-sm font-medium text-foreground">{schoolName}</p>
              </div>
            </div>
          </div>
          
          <div className="flex items-center absolute left-1/2 transform -translate-x-1/2">
            <DreaMetrixLogo height={28} />
          </div>

          <div className="flex items-center gap-4 flex-1 justify-end">
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button 
                  variant="ghost" 
                  className="group flex items-center gap-2 rounded-2xl p-1 pr-3 bg-white/10 backdrop-blur-md border border-white/20 hover:bg-white/20 focus-visible:ring-white/30 transition-all duration-300"
                >
                  <UserAvatar className="h-8 w-8 border border-border shadow-sm" />
                  <span className="hidden md:inline text-sm font-medium">{full_name}</span>
                  <ChevronDown className="h-4 w-4 text-muted-foreground transition-transform duration-200 group-data-[state=open]:rotate-180" />
                </Button>
              </DropdownMenuTrigger>
              
              <DropdownMenuContent 
                align="end" 
                className="min-w-[220px] rounded-xl p-2 shadow-dropdown"
              >
                <div className="px-3 py-2 mb-1">
                  <p className="text-sm font-medium">{full_name}</p>
                  <p className="text-xs text-muted-foreground">{role.charAt(0).toUpperCase() + role.slice(1)}</p>
                </div>
                
                <DropdownMenuSeparator />
                
                <DropdownMenuItem
                onClick={handleLogout}
                className={cn(
                  "group flex items-center gap-3 rounded-lg px-3 py-2 text-sm",
                  "text-destructive hover:bg-destructive-muted focus:bg-destructive-muted data-[highlighted]:!text-red-600 hover:cursor-pointer"
                )}
              >
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-destructive-muted text-destructive">
                    <LogOut className="h-4 w-4" />
                  </div>
                  <span>Sign Out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>

      {/* Modal pour uploader le logo */}
      <EditSchoolLogoModal
        isOpen={showEditLogo}
        onClose={() => setShowEditLogo(false)}
        currentLogo={schoolLogo}
        onLogoUpdate={handleLogoUpdate}
        schoolName={schoolName}
      />
    </>
  )
}