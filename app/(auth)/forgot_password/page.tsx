"use client";

import { useState, type ChangeEvent, type FormEvent } from "react";
import Link from "next/link";
import { AlertTriangle, Mail, ArrowLeft, Eye, EyeOff, Key, CheckCircle } from "lucide-react";
import { Input } from "@/components/ui/input";
import DreaMetrixLogo from "@/components/ui/dreametrix-logo";
import { authService } from "@/services/auth-service";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [step, setStep] = useState<"request" | "verify" | "reset">("request");
  const [resetToken, setResetToken] = useState<string | null>(null);

  const validateEmail = (email: string): string | null => {
    if (!email) return "Email is required";
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) return "Invalid email address";
    return null;
  };

  const validatePassword = (password: string): string | null => {
    if (!password) return "Password is required";
    if (password.length < 8) return "Password must be at least 8 characters long";
    return null;
  };

  const validatePasswordsMatch = (password: string, confirmPassword: string): string | null => {
    if (password !== confirmPassword) return "Passwords do not match";
    return null;
  };

  const validateCode = (code: string): string | null => {
    if (!code) return "Verification code is required";
    if (code.length !== 6) return "Code must be 6 digits";
    if (!/^\d+$/.test(code)) return "Code must contain only numbers";
    return null;
  };

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>): void => {
    setEmail(e.target.value);
    setError(null);
  };

  const handleCodeChange = (e: ChangeEvent<HTMLInputElement>): void => {
    const value = e.target.value.replace(/\D/g, "").slice(0, 6);
    setCode(value);
    setError(null);
  };

  const handlePasswordChange = (e: ChangeEvent<HTMLInputElement>): void => {
    setNewPassword(e.target.value);
    setError(null);
  };

  const handleConfirmPasswordChange = (e: ChangeEvent<HTMLInputElement>): void => {
    setConfirmPassword(e.target.value);
    setError(null);
  };

  const handleRequestOTP = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
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
      await authService.requestPasswordReset(email);
      setStep("verify");
      setSuccess(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to send verification code. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendCode = async (): Promise<void> => {
    setError(null);

    const emailError = validateEmail(email);
    if (emailError) {
      setError(emailError);
      return;
    }

    setIsLoading(true);
    try {
      await authService.resendVerificationCode(email);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to resend verification code. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyCode = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    setError(null);

    const codeError = validateCode(code);
    if (codeError) {
      setError(codeError);
      return;
    }

    setIsLoading(true);
    try {
      const token = await authService.verifyResetCode(email, code);
      setResetToken(token);
      setStep("reset");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Invalid verification code. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetPassword = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault();
    setError(null);

    const passwordError = validatePassword(newPassword);
    if (passwordError) {
      setError(passwordError);
      return;
    }

    const passwordsMatchError = validatePasswordsMatch(newPassword, confirmPassword);
    if (passwordsMatchError) {
      setError(passwordsMatchError);
      return;
    }

    if (!resetToken) {
      setError("Reset token is missing. Please start the process again.");
      return;
    }

    setIsLoading(true);
    try {
      await authService.resetPassword(resetToken, newPassword);
      setSuccess(true);
      setStep("request");
      setEmail("");
      setCode("");
      setNewPassword("");
      setConfirmPassword("");
      setResetToken(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to reset password. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const renderStepRequest = () => (
    <form onSubmit={handleRequestOTP} className="space-y-4">
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
        {isLoading ? "Sending..." : "Send Verification Code"}
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
  );

  const renderStepVerify = () => (
    <form onSubmit={handleVerifyCode} className="space-y-4">
      <div className="bg-blue-50 text-blue-700 px-4 py-3 rounded-lg mb-4">
        <p className="text-sm">
          A verification code has been sent to your email address.
        </p>
        <p className="text-sm mt-1 font-medium">
          Please check your inbox and enter the 6-digit code below.
        </p>
        <p className="text-xs mt-1">
          This code will be valid for 10 minutes.
        </p>
      </div>

      <div className="relative">
        <div
          className={`relative overflow-hidden border ${
            error ? "border-red-500" : "border-gray-200"
          } rounded-lg`}
        >
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
            <Key size={20} />
          </div>
          <Input
            type="text"
            placeholder="Enter 6-digit code"
            value={code}
            onChange={handleCodeChange}
            className="h-12 pl-10 rounded-lg text-center text-lg tracking-widest font-mono"
            disabled={isLoading}
            maxLength={6}
          />
        </div>
        {error && (
          <div className="flex items-center mt-2 text-red-700">
            <AlertTriangle className="h-4 w-4 mr-2" />
            <span className="text-sm">{error}</span>
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
        {isLoading ? "Verifying..." : "Verify Code"}
      </button>

      <div className="text-center space-y-2">
        <button
          type="button"
          onClick={() => setStep("request")}
          className="text-[#1A73E8] hover:text-[#1453B8] font-medium inline-flex items-center"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Email
        </button>
        <div className="text-sm text-gray-600">
          Didn&apos;t receive the code?{" "}
          <button
            type="button"
            onClick={handleResendCode}
            disabled={isLoading}
            className="text-[#1A73E8] hover:text-[#1453B8] font-medium disabled:opacity-50"
          >
            {isLoading ? "Resending..." : "Resend"}
          </button>
        </div>
      </div>
    </form>
  );

  const renderStepReset = () => (
    <form onSubmit={handleResetPassword} className="space-y-4">
      <div className="bg-green-50 text-green-700 px-4 py-3 rounded-lg mb-4">
        <p className="text-sm">
          Code verified successfully! Please enter your new password.
        </p>
      </div>

      <div className="space-y-4">
        {/* New Password Input */}
        <div className="relative">
          <div
            className={`relative overflow-hidden border ${
              error && error.includes("Password") ? "border-red-500" : "border-gray-200"
            } rounded-lg`}
          >
            <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
              <Key size={20} />
            </div>
            <Input
              type={showPassword ? "text" : "password"}
              placeholder="New Password"
              value={newPassword}
              onChange={handlePasswordChange}
              className="h-12 pl-10 pr-10 rounded-lg"
              disabled={isLoading}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>
        </div>

        {/* Confirm Password Input */}
        <div className="relative">
          <div
            className={`relative overflow-hidden border ${
              error && error.includes("Passwords") ? "border-red-500" : 
              newPassword && confirmPassword && newPassword === confirmPassword ? "border-green-500" : "border-gray-200"
            } rounded-lg`}
          >
            <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400">
              <Key size={20} />
            </div>
            <Input
              type={showConfirmPassword ? "text" : "password"}
              placeholder="Confirm New Password"
              value={confirmPassword}
              onChange={handleConfirmPasswordChange}
              className="h-12 pl-10 pr-10 rounded-lg"
              disabled={isLoading}
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              {showConfirmPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
            
            {/* Check icon when passwords match */}
            {newPassword && confirmPassword && newPassword === confirmPassword && (
              <div className="absolute right-10 top-1/2 transform -translate-y-1/2 text-green-500">
                <CheckCircle size={20} />
              </div>
            )}
          </div>
          
          {/* Password match indicator */}
          {newPassword && confirmPassword && (
            <div className={`mt-1 text-xs ${
              newPassword === confirmPassword ? 'text-green-600' : 'text-red-600'
            }`}>
              {newPassword === confirmPassword ? 
                '✓ Passwords match' : 
                '✗ Passwords do not match'
              }
            </div>
          )}
        </div>

        {error && (
          <div className="flex items-center text-red-700">
            <AlertTriangle className="h-4 w-4 mr-2" />
            <span className="text-sm">{error}</span>
          </div>
        )}
      </div>

      <button
        type="submit"
        disabled={isLoading || (newPassword && confirmPassword && newPassword !== confirmPassword)}
        className="w-full bg-[#25AAE1] hover:bg-[#1453B8] text-white py-3 rounded-lg
                 transition-colors focus:outline-none focus:ring-2 focus:ring-[#25AAE1]
                 focus:ring-offset-2 disabled:opacity-50 text-base font-semibold"
      >
        {isLoading ? "Resetting..." : "Reset Password"}
      </button>

      <div className="text-center">
        <button
          type="button"
          onClick={() => setStep("verify")}
          className="text-[#1A73E8] hover:text-[#1453B8] font-medium inline-flex items-center"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Code Verification
        </button>
      </div>
    </form>
  );

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
            {step === "request" && "Enter your email address to reset your password"}
            {step === "verify" && "Enter the verification code sent to your email"}
            {step === "reset" && "Create your new password"}
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
              <p>Password has been reset successfully!</p>
              <p className="text-sm mt-1">You can now login with your new password.</p>
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
          <>
            {step === "request" && renderStepRequest()}
            {step === "verify" && renderStepVerify()}
            {step === "reset" && renderStepReset()}
          </>
        )}
      </div>
    </div>
  );
}