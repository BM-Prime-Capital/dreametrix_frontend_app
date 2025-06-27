"use client";

import { useState, type ChangeEvent, type FormEvent } from "react";
import Link from "next/link";
import { AlertTriangle, Mail, Lock, Eye, EyeOff, LogIn } from "lucide-react";
import { userPath } from "@/constants/userConstants";
import DreaMetrixLogo from "./ui/dreametrix-logo";
import { useLogin } from "@/hooks/SchoolAdmin/useLogin";
import { Input } from "./ui/input";
import { Button } from "./ui/button";

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
  const [showPassword, setShowPassword] = useState<boolean>(false);
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
      <div className="text-destructive text-sm flex items-center mt-1 ml-1">
        <AlertTriangle className="h-3 w-3 mr-1 flex-shrink-0" />
        <span>{errorMessage}</span>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-muted via-background to-secondary-muted flex items-center justify-center p-4">
      <div className="w-full max-w-md bg-card rounded-2xl shadow-soft overflow-hidden animate-fade-in">
        <div className="relative bg-gradient-primary p-6 pb-10">
          <div className="absolute inset-0 bg-[url('/assets/images/bg.png')] bg-cover bg-center opacity-10"></div>
          <div className="relative flex justify-center mb-2">
            <DreaMetrixLogo />
          </div>
          <div className="relative text-center">
            <h1 className="text-white text-2xl font-bold mb-1">
              Welcome to DreaMetrix
            </h1>
            <p className="text-white/80 text-sm">
              The complete educational platform
            </p>
          </div>
        </div>
        
        <div className="px-6 py-8 -mt-6 bg-card rounded-t-3xl">
          {error && (
            <div className="bg-destructive-muted text-destructive px-4 py-3 mb-4 rounded-lg animate-slide-in">
              <div className="flex items-center">
                <AlertTriangle className="h-5 w-5 mr-2 flex-shrink-0" />
                <span className="text-sm">{error}</span>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-foreground mb-1.5 ml-1">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground">
                  <Mail size={18} />
                </div>
                <Input
                  id="email"
                  type="email"
                  placeholder="Enter your email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className={`h-11 pl-10 rounded-lg border-2 ${formSubmitted && errors.email ? "border-destructive focus:border-destructive" : "border-input"}`}
                  disabled={isLoading}
                  aria-invalid={!!errors.email}
                  aria-describedby={errors.email ? "email-error" : undefined}
                />
              </div>
              {errors.email && (
                <div id="email-error">{renderErrorMessage(errors.email)}</div>
              )}
            </div>

            <div>
              <div className="flex justify-between items-center mb-1.5">
                <label htmlFor="password" className="block text-sm font-medium text-foreground ml-1">
                  Password
                </label>
                <Link
                  href="/forgot_password"
                  className="text-primary text-xs hover:text-primary-hover transition-colors"
                >
                  Forgot password?
                </Link>
              </div>
              <div className="relative">
                <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground">
                  <Lock size={18} />
                </div>
                <Input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className={`h-11 pl-10 pr-10 rounded-lg border-2 ${formSubmitted && errors.password ? "border-destructive focus:border-destructive" : "border-input"}`}
                  disabled={isLoading}
                  aria-invalid={!!errors.password}
                  aria-describedby={errors.password ? "password-error" : undefined}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                  disabled={isLoading}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
              {errors.password && (
                <div id="password-error">{renderErrorMessage(errors.password)}</div>
              )}
            </div>

            <Button
              type="submit"
              variant="gradient"
              size="lg"
              className="w-full mt-2 font-semibold"
              isLoading={isLoading}
              leftIcon={!isLoading && <LogIn size={18} />}
            >
              {isLoading ? "Signing in..." : "Sign In"}
            </Button>
          </form>

          <div className="mt-8 pt-6 border-t border-border">
            <p className="text-center text-muted-foreground mb-4">Don&apos;t have an account?</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Link
                href={userPath.SCHOOL_ADMIN_REGISTER_PATH}
                className="flex flex-col items-center p-4 bg-card hover:bg-card-hover rounded-xl shadow-card hover:shadow-md transition-all border border-border hover:border-primary"
              >
                <span className="text-primary font-semibold text-center">School Registration</span>
                <span className="text-xs text-muted-foreground mt-1 text-center">For educational institutions</span>
              </Link>
              <Link
                href={userPath.PARENT_REGISTER_PATH}
                className="flex flex-col items-center p-4 bg-card hover:bg-card-hover rounded-xl shadow-card hover:shadow-md transition-all border border-border hover:border-primary"
              >
                <span className="text-primary font-semibold text-center">Parent Portal</span>
                <span className="text-xs text-muted-foreground mt-1 text-center">For parents and guardians</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
