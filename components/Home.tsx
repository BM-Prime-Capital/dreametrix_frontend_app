"use client";

import { useState, type ChangeEvent, type FormEvent } from "react";
import Link from "next/link";
import { AlertTriangle, Mail, Lock, Eye, EyeOff } from "lucide-react";
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
  const [showPassword, setShowPassword] = useState(false);
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
    <div className="min-h-screen bg-[url('/assets/images/bg.png')] bg-cover bg-center bg-no-repeat flex items-center justify-center p-2">
      <div className="w-full max-w-[500px] bg-[rgba(230,230,230,0.95)] p-6 sm:p-8 rounded-[20px] shadow-[0px_4px_20px_rgba(0,0,0,0.15)]">
        <div className="flex justify-center mb-6">
          <DreaMetrixLogo />
        </div>

        <div className="text-center mb-6">
          <h2 className="text-[#1A73E8] text-2xl font-semibold">
            Welcome to DreaMetrix
          </h2>
          <p className="text-gray-600 mt-2">Log in to access your account</p>
        </div>

        {isLoading && (
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#25AAE1]"></div>
          </div>
        )}
        {error && (
            <div className="bg-red-50 text-red-700 px-4 py-3 mb-2 rounded-lg">
              <div className="flex items-center">
                <AlertTriangle className="h-5 w-5 mr-2" />
                <span>{error}</span>
              </div>
            </div>
          )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <div
              className={`relative overflow-hidden border ${
                formSubmitted && errors.email
                  ? "border-red-500"
                  : "border-gray-200"
              } rounded-lg`}
            >
              <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                <Mail size={20} />
              </div>
              <Input
                type="email"
                placeholder="Email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className="h-12 pl-10 rounded-lg"
                disabled={isLoading}
              />
            </div>
            {renderErrorMessage(errors.email)}
          </div>

          <div className="relative">
            <div
              className={`relative overflow-hidden border ${
                formSubmitted && errors.password
                  ? "border-red-500"
                  : "border-gray-200"
              } rounded-lg`}
            >
              <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                <Lock size={20} />
              </div>
              <Input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                className="h-12 pl-10 rounded-lg"
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
            {renderErrorMessage(errors.password)}
          </div>

          

          <div className="text-right">
            <Link
              href="/forgot_password"
              className="text-[#1A73E8] hover:text-[#1453B8] text-sm font-medium"
            >
              Forgot your password?
            </Link>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-[#25AAE1] hover:bg-[#1453B8] text-white py-3 rounded-lg
                     transition-colors focus:outline-none focus:ring-2 focus:ring-[#25AAE1] 
                     focus:ring-offset-2 disabled:opacity-50 text-base font-semibold"
          >
            {isLoading ? "Logging in..." : "Log In"}
          </button>
        </form>

        <div className="mt-8 pt-6 border-t border-gray-200">
          <p className="text-center text-gray-600 mb-4">Don&apos;t have an account?</p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Link
              href={userPath.SCHOOL_ADMIN_REGISTER_PATH}
              className="flex flex-col items-center p-4 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow border border-gray-100 hover:border-[#25AAE1]"
            >
              <span className="text-[#1A73E8] font-semibold text-center">School Registration</span>
              <span className="text-sm text-gray-500 mt-1 text-center">For educational institutions</span>
            </Link>
            <Link
              href={userPath.PARENT_REGISTER_PATH}
              className="flex flex-col items-center p-4 bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow border border-gray-100 hover:border-[#25AAE1]"
            >
              <span className="text-[#1A73E8] font-semibold text-center">Parent Portal</span>
              <span className="text-sm text-gray-500 mt-1 text-center">For parents and guardians</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
