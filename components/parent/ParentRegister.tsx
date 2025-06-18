"use client";

import { useState, type ChangeEvent, type FormEvent } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Mail, Phone, User, Lock, Hash, FileText, AlertTriangle, Eye, EyeOff } from "lucide-react";
import DreaMetrixLogo from "../ui/dreametrix-logo";
import { userPath } from "@/constants/userConstants";
import { Input } from "../ui/input";

export interface RegisterFormData {
  firstName: string;
  lastName: string;
  parentEmail: string;
  phone: string;
  studentCode: string;
  identityCard: File | null;
  password: string;
  confirmPassword: string;
}

export interface RegisterErrors {
  firstName: boolean;
  lastName: boolean;
  parentEmail: boolean;
  phone: boolean;
  studentCode: boolean;
  identityCard: boolean;
  password: boolean;
  confirmPassword: boolean;
}

export default function ParentRegister() {
  const router = useRouter();
  const [formData, setFormData] = useState<RegisterFormData>({
    firstName: "",
    lastName: "",
    parentEmail: "",
    phone: "",
    studentCode: "",
    identityCard: null,
    password: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [formSubmitted, setFormSubmitted] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errors, setErrors] = useState<RegisterErrors>({
    firstName: false,
    lastName: false,
    parentEmail: false,
    phone: false,
    studentCode: false,
    identityCard: false,
    password: false,
    confirmPassword: false,
  });

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>): void => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: false }));
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>): void => {
    const { name, files } = e.target;
    setFormData((prev) => ({ ...prev, [name]: files && files.length > 0 ? files[0] : null }));
    setErrors((prev) => ({ ...prev, [name]: false }));
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    setFormSubmitted(true);
    setIsLoading(true);

    const hasEmptyFields = Object.entries(formData).some(
      ([key, value]) => {
        if (key === "identityCard") {
          return value === null;
        }
        return !value;
      }
    );

    if (hasEmptyFields) {
      setErrors({
        firstName: !formData.firstName,
        lastName: !formData.lastName,
        parentEmail: !formData.parentEmail,
        phone: !formData.phone,
        studentCode: !formData.studentCode,
        identityCard: !formData.identityCard,
        password: !formData.password,
        confirmPassword: !formData.confirmPassword,
      });
      setIsLoading(false);
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setErrors((prev) => ({ ...prev, confirmPassword: true }));
      setIsLoading(false);
      return;
    }

    // API call simulation
    setTimeout(() => {
      setIsLoading(false);
      router.push(userPath.PARENT_LOGIN_PATH);
    }, 1000);
  };

  const renderErrorMessage = (errorMessage: string | null) => {
    if (!errorMessage) return null;
    return (
      <div className="absolute right-[-160px] top-1/2 transform -translate-y-1/2 bg-red-100 text-red-700 px-3 py-1 rounded-md shadow-md">
        <div className="absolute left-[-6px] top-1/2 transform -translate-y-1/2 w-0 h-0 border-t-[6px] border-t-transparent border-b-[6px] border-b-transparent border-r-[6px] border-r-red-100"></div>
        <div className="flex items-center">
          <AlertTriangle className="h-4 w-4 mr-2" />
          <span className="text-sm">{errorMessage}</span>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-[url('/assets/images/bg.png')] bg-cover bg-center bg-no-repeat flex items-center justify-center p-2">
      <div className="w-full max-w-[600px] bg-[rgba(230,230,230,0.95)] p-6 sm:p-8 rounded-[20px] shadow-[0px_4px_20px_rgba(0,0,0,0.15)]">
        <div className="flex justify-center mb-6">
          <DreaMetrixLogo />
        </div>

        <div className="text-center mb-6">
          <h2 className="text-[#1A73E8] text-2xl font-semibold">
            Create Parent Account
          </h2>
          <p className="text-gray-600 mt-2">
            Fill in your details to create your account
          </p>
        </div>

        {isLoading && (
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#25AAE1]"></div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* First Name */}
            <div className="relative">
              <div className={`relative overflow-hidden border ${formSubmitted && errors.firstName ? "border-red-500" : "border-gray-200"} rounded-lg`}>
                <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                  <User size={20} />
                </div>
                <Input
                  type="text"
                  name="firstName"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  placeholder="First Name"
                  className="h-12 pl-10 rounded-lg"
                  disabled={isLoading}
                />
              </div>
              {formSubmitted && errors.firstName && renderErrorMessage("First name is required")}
            </div>

            {/* Last Name */}
            <div className="relative">
              <div className={`relative overflow-hidden border ${formSubmitted && errors.lastName ? "border-red-500" : "border-gray-200"} rounded-lg`}>
                <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                  <User size={20} />
                </div>
                <Input
                  type="text"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  placeholder="Last Name"
                  className="h-12 pl-10 rounded-lg"
                  disabled={isLoading}
                />
              </div>
              {formSubmitted && errors.lastName && renderErrorMessage("Last name is required")}
            </div>

            {/* Email */}
            <div className="relative">
              <div className={`relative overflow-hidden border ${formSubmitted && errors.parentEmail ? "border-red-500" : "border-gray-200"} rounded-lg`}>
                <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                  <Mail size={20} />
                </div>
                <Input
                  type="email"
                  name="parentEmail"
                  value={formData.parentEmail}
                  onChange={handleInputChange}
                  placeholder="Email"
                  className="h-12 pl-10 rounded-lg"
                  disabled={isLoading}
                />
              </div>
              {formSubmitted && errors.parentEmail && renderErrorMessage("Email is required")}
            </div>

            {/* Phone */}
            <div className="relative">
              <div className={`relative overflow-hidden border ${formSubmitted && errors.phone ? "border-red-500" : "border-gray-200"} rounded-lg`}>
                <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                  <Phone size={20} />
                </div>
                <Input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  placeholder="Phone Number"
                  className="h-12 pl-10 rounded-lg"
                  disabled={isLoading}
                />
              </div>
              {formSubmitted && errors.phone && renderErrorMessage("Phone number is required")}
            </div>

            {/* Student Code */}
            <div className="relative">
              <div className={`relative overflow-hidden border ${formSubmitted && errors.studentCode ? "border-red-500" : "border-gray-200"} rounded-lg`}>
                <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                  <Hash size={20} />
                </div>
                <Input
                  type="text"
                  name="studentCode"
                  value={formData.studentCode}
                  onChange={handleInputChange}
                  placeholder="Student Code"
                  className="h-12 pl-10 rounded-lg"
                  disabled={isLoading}
                />
              </div>
              {formSubmitted && errors.studentCode && renderErrorMessage("Student code is required")}
            </div>

            {/* Identity Card */}
            <div className="relative">
              <div className={`relative overflow-hidden border ${formSubmitted && errors.identityCard ? "border-red-500" : "border-gray-200"} rounded-lg`}>
                <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                  <FileText size={20} />
                </div>
                <label className="flex items-center h-12 pl-10 pr-4 cursor-pointer">
                  <span className="text-gray-500 truncate">
                    {formData.identityCard ? formData.identityCard.name : "Upload Identity Card"}
                  </span>
                  <input
                    type="file"
                    name="identityCard"
                    onChange={handleFileChange}
                    className="hidden"
                    disabled={isLoading}
                    accept=".pdf,.jpg,.jpeg,.png"
                  />
                </label>
              </div>
              {formSubmitted && errors.identityCard && renderErrorMessage("Identity card is required")}
            </div>

            {/* Password */}
            <div className="relative">
              <div className={`relative overflow-hidden border ${formSubmitted && errors.password ? "border-red-500" : "border-gray-200"} rounded-lg`}>
                <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                  <Lock size={20} />
                </div>
                <Input
                  type={showPassword ? "text" : "password"}
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder="Password"
                  className="h-12 pl-10 pr-10 rounded-lg"
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={isLoading}
                >
                  {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              {formSubmitted && errors.password && renderErrorMessage("Password is required")}
            </div>

            {/* Confirm Password */}
            <div className="relative">
              <div className={`relative overflow-hidden border ${formSubmitted && errors.confirmPassword ? "border-red-500" : "border-gray-200"} rounded-lg`}>
                <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                  <Lock size={20} />
                </div>
                <Input
                  type={showConfirmPassword ? "text" : "password"}
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  placeholder="Confirm Password"
                  className="h-12 pl-10 pr-10 rounded-lg"
                  disabled={isLoading}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={isLoading}
                >
                  {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                </button>
              </div>
              {formSubmitted && errors.confirmPassword && renderErrorMessage("Passwords do not match")}
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-[#25AAE1] hover:bg-[#1453B8] text-white py-3 rounded-lg
                     transition-colors focus:outline-none focus:ring-2 focus:ring-[#25AAE1]
                     focus:ring-offset-2 disabled:opacity-50 text-base font-semibold mt-6"
          >
            {isLoading ? "Creating Account..." : "Create Account"}
          </button>

          <div className="text-center mt-4">
            <p className="text-gray-600">
              Already have an account?{" "}
              <Link
                href={userPath.LOGIN}
                className="text-[#1A73E8] hover:text-[#1453B8] font-medium"
              >
                Login instead
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}
