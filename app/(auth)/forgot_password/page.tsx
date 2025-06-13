"use client";

import { useState, type ChangeEvent, type FormEvent } from "react";
import Link from "next/link";
import { AlertTriangle, Mail, ArrowLeft } from "lucide-react";
import { Input } from "@/components/ui/input";
import DreaMetrixLogo from "@/components/ui/dreametrix-logo";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [formSubmitted, setFormSubmitted] = useState(false);

  const validateEmail = (email: string): string | null => {
    if (!email) return "Email is required";
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) return "Invalid email address";
    return null;
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>): void => {
    setEmail(e.target.value);
    setError(null);
  };

  const handleSubmit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    setFormSubmitted(true);
    setError(null);

    const emailError = validateEmail(email);
    if (emailError) {
      setError(emailError);
      return;
    }

    setIsLoading(true);
    try {
      // TODO: Implement actual password reset logic here
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulated API call
      setSuccess(true);
    } catch (err) {
      setError("Failed to send reset link. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[url('/assets/images/bg.png')] bg-cover bg-center bg-no-repeat flex items-center justify-center p-2">
      <div className="w-full max-w-[500px] bg-[rgba(230,230,230,0.95)] p-6 sm:p-8 rounded-[20px] shadow-[0px_4px_20px_rgba(0,0,0,0.15)]">
        <div className="flex justify-center mb-6">
          <DreaMetrixLogo />
        </div>

        <div className="text-center mb-6">
          <h2 className="text-[#1A73E8] text-2xl font-semibold">
            Forgot Password
          </h2>
          <p className="text-gray-600 mt-2">
            Enter your email address to reset your password
          </p>
        </div>

        {isLoading && (
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#25AAE1]"></div>
          </div>
        )}

        {success ? (
          <div className="text-center">
            <div className="bg-green-50 text-green-700 px-4 py-3 rounded-lg mb-4">
              <p>Password reset link has been sent to your email.</p>
              <p className="text-sm mt-1">Please check your inbox.</p>
            </div>
            <Link
              href="/"
              className="text-[#1A73E8] hover:text-[#1453B8] font-medium inline-flex items-center"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Login
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="relative">
              <div
                className={`relative overflow-hidden border ${
                  formSubmitted && error ? "border-red-500" : "border-gray-200"
                } rounded-lg`}
              >
                <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
                  <Mail size={20} />
                </div>
                <Input
                  type="email"
                  placeholder="Email"
                  value={email}
                  onChange={handleInputChange}
                  className="h-12 pl-10 rounded-lg"
                  disabled={isLoading}
                />
              </div>
              {error && (
                <div className="absolute right-[-160px] top-1/2 transform -translate-y-1/2 bg-red-100 text-red-700 px-3 py-1 rounded-md shadow-md">
                  <div className="absolute left-[-6px] top-1/2 transform -translate-y-1/2 w-0 h-0 border-t-[6px] border-t-transparent border-b-[6px] border-b-transparent border-r-[6px] border-r-red-100"></div>
                  <div className="flex items-center">
                    <AlertTriangle className="h-4 w-4 mr-2" />
                    <span className="text-sm">{error}</span>
                  </div>
                </div>
              )}
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-[#25AAE1] hover:bg-[#1453B8] text-white py-3 rounded-lg
                       transition-colors focus:outline-none focus:ring-2 focus:ring-[#25AAE1] 
                       focus:ring-offset-2 disabled:opacity-50 text-base font-semibold"
            >
              {isLoading ? "Sending..." : "Send Reset Link"}
            </button>

            <div className="text-center">
              <Link
                href="/"
                className="text-[#1A73E8] hover:text-[#1453B8] font-medium inline-flex items-center"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Login
              </Link>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
