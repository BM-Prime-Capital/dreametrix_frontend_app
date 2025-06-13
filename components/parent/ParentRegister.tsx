"use client";

import { useState, type ChangeEvent, type FormEvent } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Mail, Phone, User, Lock, Hash, FileText } from "lucide-react";
import DreaMetrixLogo from "../ui/dreametrix-logo";
import { userPath } from "@/constants/userConstants";

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

export default function ParentRegister({
  userType,
  userBasePath,
}: {
  userType: string;
  userBasePath: string;
}) {
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

    // Simulation d'un appel API
    setTimeout(() => {
      setIsLoading(false);
      router.push(userPath.PARENT_LOGIN_PATH);
    }, 1000);
  };

  return (
    <div
      className="flex items-center justify-center min-h-screen bg-cover bg-center"
      style={{ backgroundImage: `url('/assets/images/bg.png')` }}
    >
      <div className="bg-[#f1f1f1e6] p-6 sm:p-8 rounded-[15px] shadow-[0px_4px_20px_rgba(0,0,0,0.1)] w-full max-w-[600px] mx-4">
        <div className="flex justify-center mb-6">
          <DreaMetrixLogo />
        </div>

        {isLoading && (
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#25AAE1]"></div>
          </div>
        )}

        <form className="space-y-7" onSubmit={handleSubmit}>
          <div className="text-left">
            <h2 className="text-2xl font-bold text-[#25AAE1]">{`Sign up as ${userType}`}</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-8">
            {/* Parent first name */}
            <div>
              <label className="flex flex-col space-y-1">
                <span className="text-sm text-gray-600">First name <span className="text-red-500">*</span></span>
                <div className="flex items-center px-4 py-2 bg-white border rounded-full">
                  <User className="h-5 w-5 text-gray-400 mr-2" />
                  <input
                    type="text"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleInputChange}
                    className="flex-1 bg-transparent focus:outline-none"
                    placeholder="Enter your first name"
                    maxLength={255}
                    required
                  />
                </div>
                {formSubmitted && errors.firstName && <span className="text-red-500 text-sm">First name is required</span>}
              </label>
            </div>

            {/* Parent last name */}
            <div>
              <label className="flex flex-col space-y-1">
                <span className="text-sm text-gray-600">Last name <span className="text-red-500">*</span></span>
                <div className="flex items-center px-4 py-2 bg-white border rounded-full">
                  <User className="h-5 w-5 text-gray-400 mr-2" />
                  <input
                    type="text"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleInputChange}
                    className="flex-1 bg-transparent focus:outline-none"
                    placeholder="Enter your last name"
                    required
                  />
                </div>
                {formSubmitted && errors.lastName && <span className="text-red-500 text-sm">Last name is required</span>}
              </label>
            </div>

            {/* Parent Email */}
            <div>
              <label className="flex flex-col space-y-1">
                <span className="text-sm text-gray-600">Parent Email <span className="text-red-500">*</span></span>
                <div className="flex items-center px-4 py-2 bg-white border rounded-full">
                  <Mail className="h-5 w-5 text-gray-400 mr-2" />
                  <input
                    type="email"
                    name="parentEmail"
                    value={formData.parentEmail}
                    onChange={handleInputChange}
                    className="flex-1 bg-transparent focus:outline-none"
                    placeholder="Enter parent email"
                    required
                  />
                </div>
                {formSubmitted && errors.parentEmail && <span className="text-red-500 text-sm">Parent email is required</span>}
              </label>
            </div>

            {/* Phone */}
            <div>
              <label className="flex flex-col space-y-1">
                <span className="text-sm text-gray-600">Phone <span className="text-red-500">*</span></span>
                <div className="flex items-center px-4 py-2 bg-white border rounded-full">
                  <Phone className="h-5 w-5 text-gray-400 mr-2" />
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    className="flex-1 bg-transparent focus:outline-none"
                    placeholder="Enter phone number"
                    maxLength={20}
                    required
                  />
                </div>
                {formSubmitted && errors.phone && <span className="text-red-500 text-sm">Phone number is required</span>}
              </label>
            </div>

            {/* Student Code & Identity Card Group */}
            <div className="md:col-span-2 flex flex-col md:flex-row gap-x-4 gap-y-4 items-center">
              {/* Student Code */}
              <div className="md:w-5/12">
                <label className="flex flex-col space-y-1">
                  <span className="text-sm text-gray-600">Student Code <span className="text-red-500">*</span></span>
                  <div className="flex items-center py-2 bg-white border rounded-full h-10 relative pl-10 pr-4">
                    <Hash className="h-5 w-5 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      name="studentCode"
                      value={formData.studentCode}
                      onChange={handleInputChange}
                      className="flex-1 bg-transparent focus:outline-none"
                      placeholder="Student Code"
                      required
                    />
                  </div>
                  {formSubmitted && errors.studentCode && <span className="text-red-500 text-sm">Student code is required</span>}
                </label>
              </div>

              {/* Identity Card (Custom File Input) */}
              <div className="md:w-7/12">
                <label className="flex flex-col space-y-1">
                  <span className="text-sm text-gray-600">Identity Card <span className="text-red-500">*</span></span>
                  <div className="flex items-center py-2 bg-white border rounded-full h-10 px-4">
                    <label htmlFor="identityCardInput" className="flex items-center cursor-pointer">
                      <FileText className="h-5 w-5 text-gray-400 mr-2" />
                    </label>
                    <input
                      id="identityCardInput"
                      type="file"
                      name="identityCard"
                      onChange={handleFileChange}
                      className="sr-only" // Cache l'input natif
                      required
                    />
                    <span className="flex-1 text-sm text-gray-600 truncate ml-2">
                      {formData.identityCard ? formData.identityCard.name : "Aucun fichier choisi"}
                    </span>
                  </div>
                  {formSubmitted && errors.identityCard && <span className="text-red-500 text-sm">Identity card is required</span>}
                </label>
              </div>
            </div>

            {/* Password */}
            <div>
              <label className="flex flex-col space-y-1">
                <span className="text-sm text-gray-600">Password <span className="text-red-500">*</span></span>
                <div className="flex items-center px-4 py-2 bg-white border rounded-full">
                  <Lock className="h-5 w-5 text-gray-400 mr-2" />
                  <input
                    type="password"
                    placeholder="Enter password"
                    name="password"
                    value={formData.password}
                    onChange={handleInputChange}
                    className="flex-1 bg-transparent focus:outline-none"
                    required
                  />
                </div>
                {formSubmitted && errors.password && <span className="text-red-500 text-sm">Password is required</span>}
              </label>
            </div>

            {/* Confirm password */}
            <div>
              <label className="flex flex-col space-y-1">
                <span className="text-sm text-gray-600">Confirm password <span className="text-red-500">*</span></span>
                <div className="flex items-center px-4 py-2 bg-white border rounded-full">
                  <Lock className="h-5 w-5 text-gray-400 mr-2" />
                  <input
                    type="password"
                    placeholder="Confirm password"
                    name="confirmPassword"
                    value={formData.confirmPassword}
                    onChange={handleInputChange}
                    className="flex-1 bg-transparent focus:outline-none"
                    required
                  />
                </div>
                {formSubmitted && errors.confirmPassword && <span className="text-red-500 text-sm">Passwords do not match</span>}
              </label>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-center mt-8">
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-[#25AAE1] text-white py-3 rounded-full
                       transition-colors focus:outline-none focus:ring-2 focus:ring-[#25AAE1]
                       focus:ring-offset-2 disabled:opacity-50 text-base font-medium"
            >
              {isLoading ? "REGISTERING..." : "SIGN UP"}
            </button>
          </div>

          {/* Login Link */}
          <p className="text-center text-sm text-gray-500">
            Already registered?{" "}
            <Link
              href={userPath.LOGIN}
              className="text-[#25AAE1] hover:text-[#1453B8]"
            >
              Login here
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
