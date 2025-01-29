"use client";

import { useState, type ChangeEvent, type FormEvent } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Mail, Building2, MapPin, Lock } from "lucide-react";
import DreaMetrixLogo from "../ui/dreametrix-logo";
import { userPath } from "@/constants/userConstants";

export interface RegisterFormData {
  schoolEmail: string;
  schoolName: string;
  address: string;
  password: string;
}

export interface RegisterErrors {
  schoolEmail: boolean;
  schoolName: boolean;
  address: boolean;
  password: boolean;
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
    schoolEmail: "",
    schoolName: "",
    address: "",
    password: "",
  });
  const [formSubmitted, setFormSubmitted] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errors, setErrors] = useState<RegisterErrors>({
    schoolEmail: false,
    schoolName: false,
    address: false,
    password: false,
  });

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>): void => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: false }));
  };

  const handleSubmit = (e: FormEvent<HTMLFormElement>): void => {
    e.preventDefault();
    setFormSubmitted(true);
    setIsLoading(true);

    const hasEmptyFields = Object.entries(formData).some(
      ([key, value]) => !value
    );

    if (hasEmptyFields) {
      setErrors({
        schoolEmail: !formData.schoolEmail,
        schoolName: !formData.schoolName,
        address: !formData.address,
        password: !formData.password,
      });
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
      <div className="bg-[#f1f1f1e6] p-6 sm:p-8 rounded-[15px] shadow-[0px_4px_20px_rgba(0,0,0,0.1)] w-full max-w-[450px] mx-4 text-center">
        <div className="flex justify-center mb-6">
          <DreaMetrixLogo />
        </div>

        {isLoading && (
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
          </div>
        )}

        <form className="space-y-6" onSubmit={handleSubmit}>
          <div className="text-left">
            <h2 className="text-2xl font-bold text-[#25AAE1]">{`Sign up as ${userType}`}</h2>
          </div>

          <div className="space-y-4">
            {[
              {
                name: "schoolEmail",
                icon: Mail,
                placeholder: "School Email",
                type: "email",
              },
              {
                name: "schoolName",
                icon: Building2,
                placeholder: "School Name",
                type: "text",
              },
              {
                name: "address",
                icon: MapPin,
                placeholder: "Address",
                type: "text",
              },
              {
                name: "password",
                icon: Lock,
                placeholder: "Password",
                type: "password",
              },
            ].map((field) => (
              <div key={field.name} className="space-y-2">
                <label
                  className={`flex items-center gap-2 px-4 py-2 bg-white border rounded-full transition-colors ${
                    formSubmitted && errors[field.name as keyof RegisterErrors]
                      ? "border-red-500 focus-within:border-red-500"
                      : "border-gray-300 focus-within:border-blue-500"
                  }`}
                >
                  <field.icon className="h-5 w-5 text-gray-400" />
                  <input
                    type={field.type}
                    name={field.name}
                    placeholder={field.placeholder}
                    value={formData[field.name as keyof RegisterFormData]}
                    onChange={handleInputChange}
                    className="flex-1 bg-white focus:outline-none text-sm text-black"
                    required
                  />
                </label>
                {formSubmitted &&
                  errors[field.name as keyof RegisterErrors] && (
                    <span className="text-red-500 text-sm">
                      {field.placeholder} is required
                    </span>
                  )}
              </div>
            ))}
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-[#25AAE1] text-white py-2 rounded-full  
                     transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 
                     focus:ring-offset-2 disabled:opacity-50"
          >
            {isLoading ? "SIGNING UP..." : "SIGN UP"}
          </button>

          <p className="text-center text-sm text-gray-500">
            Already registered?
            <Link
              href={`/${userPath.PARENT_LOGIN_PATH}`}
              className="text-[#25AAE1] hover:text-[#25AAE1]"
            >
              {` Login as ${userType} here`}
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
