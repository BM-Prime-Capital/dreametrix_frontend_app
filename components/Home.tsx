"use client";

import { useState, type ChangeEvent, type FormEvent } from "react";
import Link from "next/link";
import { Mail, Lock, AlertTriangle } from "lucide-react";
import { userPath } from "@/constants/userConstants";
import DreaMetrixLogo from "./ui/dreametrix-logo";
import { useLogin } from "@/hooks/SchoolAdmin/useLogin";
import { Input } from "./ui/input";

export interface LoginFormData {
  email: string;
  password: string;
}

export interface LoginErrors {
  email: string | null;
  password: string | null;
}

export default function Login() {
  const { login, isLoading, error } = useLogin();
  const [formData, setFormData] = useState<LoginFormData>({
    email: "",
    password: "",
  });
  const [formSubmitted, setFormSubmitted] = useState<boolean>(false);
  const [errors, setErrors] = useState<LoginErrors>({
    email: null,
    password: null,
  });

  const validateEmail = (email: string): string | null => {
    if (!email) return "Email is required";
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) return "Invalid email address";
    return null;
  };

  const validatePassword = (password: string): string | null => {
    if (!password) return "Password is required";
    if (password.length < 8)
      return "Password must be at least 8 characters long";
    return null;
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>): void => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: null }));
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    setFormSubmitted(true);

    const { email, password } = formData;

    const emailError = validateEmail(email);
    const passwordError = validatePassword(password);

    setErrors({
      email: emailError,
      password: passwordError,
    });

    if (emailError || passwordError) {
      return;
    }

    try {
      await login({ email, password });
    } catch (err: unknown) {
      if (err instanceof Error) {
        const errorMessage = err.message;

        if (errorMessage.includes("email")) {
          setErrors((prev) => ({ ...prev, email: errorMessage }));
        } else if (errorMessage.includes("password")) {
          setErrors((prev) => ({ ...prev, password: errorMessage }));
        } else {
          // Handle general error
          console.error(errorMessage);
        }
      } else {
        // Handle case where err is not an Error object
        console.error("An unknown error occurred");
      }
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
    <div className="min-h-screen bg-[url('/assets/images/bg.png')] bg-cover bg-center bg-no-repeat flex items-center justify-center p-4">
      <div className="w-full max-w-[450px] bg-[rgba(230,230,230,0.90)] p-6 sm:p-8 rounded-[15px] shadow-[0px_4px_20px_rgba(0,0,0,0.1)]">
        <div className="flex justify-center mb-6">
          <DreaMetrixLogo />
        </div>

        <div className="text-left mb-6">
          <h2 className="text-[#1A73E8] text-lg font-medium ml-2.5">
            Login Here
          </h2>
        </div>

        {isLoading && (
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#25AAE1]"></div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <div
              className={`relative rounded-full overflow-hidden border ${
                formSubmitted && errors.email
                  ? "border-red-500"
                  : "border-gray-200"
              }`}
            >
              <Input
                type="email"
                placeholder="Email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
              />
            </div>
            {renderErrorMessage(errors.email)}
          </div>

          <div className="relative">
            <div
              className={`relative rounded-full overflow-hidden border ${
                formSubmitted && errors.password
                  ? "border-red-500"
                  : "border-gray-200"
              }`}
            >
              <Input
                type="password"
                placeholder="Password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
              />
            </div>
            {renderErrorMessage(errors.password)}
          </div>

          {error && (
            <div className="bg-red-100 text-red-700 px-4 py-2 rounded-md">
              <div className="flex items-center">
                <AlertTriangle className="h-5 w-5 mr-2" />
                <span>{error}</span>
              </div>
            </div>
          )}

          <div className="text-right">
            <Link
              href="/forgot_password"
              className="text-[#1A73E8] hover:text-[#1453B8] text-sm"
            >
              Forgot Password?
            </Link>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-[#25AAE1] hover:bg-[#1453B8] text-white py-3 rounded-full 
                     transition-colors focus:outline-none focus:ring-2 focus:ring-[#25AAE1] 
                     focus:ring-offset-2 disabled:opacity-50 text-base font-medium"
          >
            {isLoading ? "LOGGING IN..." : "LOGIN"}
          </button>

          <div className="text-center text-sm text-gray-600 mt-4">
            Not registered yet?{" "}
            <Link
              href={userPath.SCHOOL_ADMIN_REGISTER_PATH}
              className="text-[#1A73E8] hover:text-[#1453B8]"
            >
              Contact your school administrator
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
