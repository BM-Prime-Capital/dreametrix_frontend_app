/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState, type ChangeEvent, type FormEvent } from "react";
import Link from "next/link";
//import { useRouter } from "next/navigation";
import { Mail, Phone, User, Lock, Hash, AlertTriangle, Eye, EyeOff, Info } from "lucide-react";
import DreaMetrixLogo from "../ui/dreametrix-logo";
import { userPath } from "@/constants/userConstants";
import { Input } from "../ui/input";
import { validatePassword } from "@/lib/utils";

export interface RegisterFormData {
  firstName: string;
  lastName: string;
  parentEmail: string;
  phone: string;
  studentCode: string;
  password: string;
  confirmPassword: string;
}

export interface RegisterErrors {
  firstName: boolean;
  lastName: boolean;
  parentEmail: boolean;
  phone: boolean;
  studentCode: boolean;
  password: boolean;
  confirmPassword: boolean;
  passwordStrength?: string[];
}

interface ApiResponse {
  success: boolean;
  message?: string;
  data?: any;
  errors?: Record<string, string[]>; 
}

async function createTeacher(
  tenantPrimaryDomain: string,
  teacherData: any
): Promise<ApiResponse> {
  try {
    const response = await fetch(tenantPrimaryDomain, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(teacherData)
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      return {
        success: false,
        message: errorData?.message || "Error creating account.",
        errors: errorData 
      };
    }

    const data = await response.json();
    return {
      success: true,
      data: data
    };
  } catch (error) {
    console.error("Network error while creating account:", error);
    return {
      success: false,
      message: "Network error while creating account."
    };
  }
}

export default function ParentRegister() {
  //const router = useRouter();
  const [formData, setFormData] = useState<RegisterFormData>({
    firstName: "",
    lastName: "",
    parentEmail: "",
    phone: "",
    studentCode: "",
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
    password: false,
    confirmPassword: false,
    passwordStrength: [],
  });
  const [apiError, setApiError] = useState<string | null>(null);
  const [registrationSuccess, setRegistrationSuccess] = useState<boolean>(false);
  const [successMessage, setSuccessMessage] = useState<string>("");

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>): void => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    
    // Reset the error for the modified field and API error
    setErrors((prev) => ({ 
      ...prev, 
      [name]: false,
      ...(name === "password" || name === "confirmPassword" ? { confirmPassword: false } : {})
    }));
    
    // Reset API error when user modifies a field
    if (apiError) {
      setApiError(null);
    }
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    e.stopPropagation();
    setFormSubmitted(true);
    setIsLoading(true);
    setApiError(null);

    // Validate required fields
    const hasEmptyFields = Object.entries(formData).some(
      ([, value]) => !value
    );

    if (hasEmptyFields) {
      setErrors({
        firstName: !formData.firstName,
        lastName: !formData.lastName,
        parentEmail: !formData.parentEmail,
        phone: !formData.phone,
        studentCode: !formData.studentCode,
        password: !formData.password,
        confirmPassword: !formData.confirmPassword,
        passwordStrength: [],
      });
      setIsLoading(false);
      return;
    }

    // PASSWORD VALIDATION ONLY HERE (on Create Account click)
    const passwordValidation = validatePassword(formData.password);
    if (!passwordValidation.isValid) {
      setErrors((prev) => ({ 
        ...prev, 
        passwordStrength: passwordValidation.errors 
      }));
      setIsLoading(false);
      return;
    }

    // Check that passwords match
    if (formData.password !== formData.confirmPassword) {
      setErrors((prev) => ({ ...prev, confirmPassword: true }));
      setIsLoading(false);
      return;
    }

    try {
      // Prepare data for API
      const teacherData = {
        email: formData.parentEmail,
        password: formData.password,
        first_name: formData.firstName,
        last_name: formData.lastName,
        phone_number: formData.phone,
        student_uuid: formData.studentCode,
        role: "parent"
      };

      const result = await createTeacher(
        "https://backend-dreametrix.com/accounts/users/create/",
        teacherData
      );

      if (result.success) {
        console.log("API Response:", result);
        console.log("Setting registration success to true");
        setSuccessMessage(result.message || "Account created successfully");
        setRegistrationSuccess(true);
        setIsLoading(false);
        console.log("States updated, should show success message");
        return;
      } else {
        // Handle API error
        console.error("Account creation error:", result.message);
        
        // Extract error message from API response
        let errorMessage = result.message || "An error occurred during account creation.";
        
        // If we have detailed errors like {"email":["User with this email already exists"]}
        if (result.errors) {
          // Concatenate all errors into a single string
          const errorMessages = Object.values(result.errors).flat();
          errorMessage = errorMessages.join(" ");
        }
        
        setApiError(errorMessage);
        setIsLoading(false);
      }
    } catch (error) {
      console.error("Account creation error:", error);
      setApiError("An error occurred during account creation.");
      setIsLoading(false);
    }
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

        {/* API error display */}
        {apiError && (
          <div className="mb-4 p-3 bg-red-100 border border-red-400 text-red-700 rounded-lg">
            <div className="flex items-center">
              <AlertTriangle className="h-5 w-5 mr-2" />
              <span className="text-sm">{apiError}</span>
            </div>
          </div>
        )}

        {registrationSuccess ? (
          <div className="text-center">
            <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-lg mb-4">
              <div className="flex flex-col items-center">
                <div className="flex items-center mb-2">
                  <svg className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span className="font-semibold">Success</span>
                </div>
                <p className="text-center">{successMessage}</p>
              </div>
            </div>

            <div className="bg-blue-100 border border-blue-400 text-blue-700 px-4 py-3 rounded-lg mb-6">
              <div className="flex items-center justify-center">
                <svg className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <p className="text-sm">
                  You will receive an email within maximum 24 hours. Please be patient and check your emails after this period.
                </p>
              </div>
            </div>

            <Link
              href={userPath.PARENT_LOGIN_PATH}
              className="inline-block bg-[#25AAE1] hover:bg-[#1453B8] text-white py-3 px-6 rounded-lg transition-colors text-base font-semibold"
            >
              Go to Login
            </Link>
          </div>
        ) : (
<<<<<<< HEAD
          <>
            {/* Information Alert */}
            <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
              <div className="flex items-start">
                <Info className="h-5 w-5 text-blue-600 mt-0.5 mr-3 flex-shrink-0" />
                <div>
                  <p className="text-blue-800 text-sm font-medium">
                    Before creating a parent account
                  </p>
                  <p className="text-blue-700 text-sm mt-1">
                    You need the UUID of at least one student you are a parent of. 
                    This UUID can be found in the student&apos;s profile menu.
                  </p>
                </div>
              </div>
            </div>

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
                <div className="relative md:col-span-2">
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
                  {formSubmitted && errors.passwordStrength && errors.passwordStrength.length > 0 && (
                    <div className="mt-1 text-xs text-red-500">
                      {errors.passwordStrength.map((error, index) => (
                        <div key={index} className="flex items-center">
                          <AlertTriangle className="h-3 w-3 mr-1" />
                          {error}
                        </div>
                      ))}
                    </div>
                  )}
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
          </>
=======
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
              <div className="relative md:col-span-2">
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
                {formSubmitted && errors.passwordStrength && errors.passwordStrength.length > 0 && (
                  <div className="mt-1 text-xs text-red-500">
                    {errors.passwordStrength.map((error, index) => (
                      <div key={index} className="flex items-center">
                        <AlertTriangle className="h-3 w-3 mr-1" />
                        {error}
                      </div>
                    ))}
                  </div>
                )}
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
>>>>>>> 4a10ad2 (stable create parent)
        )}
      </div>
    </div>
  );
}