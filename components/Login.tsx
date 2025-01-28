"use client";

import { useState, type ChangeEvent, type FormEvent } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Mail, Lock } from "lucide-react";
import { getUserNavigationInfo } from "@/utils/userUtility";
import { userPath, userTypeEnum } from "@/constants/userConstants";
import DreaMetrixLogo from "./ui/dreametrix-logo";

export interface LoginFormData {
  email: string;
  password: string;
}

export interface LoginErrors {
  email: boolean;
  password: boolean;
}
const TEST_EMAIL = "test@example.com";
const TEST_PASSWORD = "test";
export default function Login() {
  const searchParams = useSearchParams();
  const userTypeParam = searchParams.get("userType") || userTypeEnum.TEACHER;
  const userNagivationInfo = getUserNavigationInfo(userTypeParam);
  const USER_REGISTER_PATH =
    userNagivationInfo.basePath === userPath.PARENT_BASE_PATH
      ? userPath.PARENT_REGISTER_PATH
      : userPath.SCHOOL_ADMIN_REGISTER_PATH;

  const router = useRouter();
  const [formData, setFormData] = useState<LoginFormData>({
    email: TEST_EMAIL,
    password: TEST_PASSWORD,
  });
  const [formSubmitted, setFormSubmitted] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [errors, setErrors] = useState<LoginErrors>({
    email: false,
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

    const { email, password } = formData;

    if (!email || !password) {
      setErrors({
        email: !email,
        password: !password,
      });
      setIsLoading(false);
      return;
    }

    // Simulation d'un appel API
    setTimeout(() => {
      setIsLoading(false);
      if (email === TEST_EMAIL && password === TEST_PASSWORD) {
        router.push(`${userNagivationInfo.basePath}`);
      } else {
        setErrors({
          email: email !== TEST_EMAIL,
          password: password !== TEST_PASSWORD,
        });
      }
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
            <h3 className="text-2xl font-bold text-[#25AAE1]">{`Login as ${userNagivationInfo.label}`}</h3>
          </div>

          <div className="space-y-2">
            <label
              className={`flex items-center gap-2 px-4 py-2 bg-white border rounded-full transition-colors ${
                formSubmitted && errors.email
                  ? "border-red-500 focus-within:border-red-500"
                  : "border-gray-300 focus-within:border-blue-500"
              }`}
            >
              <Mail className="h-5 w-5 text-gray-400" />
              <input
                type="email"
                placeholder="Email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                className="flex-1 bg-white focus:outline-none text-sm text-black"
              />
            </label>
            {formSubmitted && errors.email && (
              <span className="text-red-500 text-sm">Incorrect username</span>
            )}
          </div>

          <div className="space-y-2">
            <label
              className={`flex items-center gap-2 px-4 py-2 bg-white border rounded-full transition-colors ${
                formSubmitted && errors.password
                  ? "border-red-500 focus-within:border-red-500"
                  : "border-gray-300 focus-within:border-blue-500"
              }`}
            >
              <Lock className="h-5 w-5 text-gray-400" />
              <input
                type="password"
                placeholder="Password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                className="flex-1 bg-white focus:outline-none text-sm text-black"
              />
            </label>
            {formSubmitted && errors.password && (
              <span className="text-red-500 text-sm">Incorrect password</span>
            )}
          </div>

          <div className="text-right">
            <Link
              href={"/forgot_password"}
              className="text-sm text-[#25AAE1] hover:text-[#25AAE1]"
            >
              Forgot Password?
            </Link>
          </div>

          <div className="space-y-4">
            <button
              type="submit"
              disabled={isLoading}
              className="w-full bg-[#25AAE1] text-white py-2 rounded-full  
                       transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 
                       focus:ring-offset-2 disabled:opacity-50"
            >
              {isLoading ? "LOGGING IN..." : "LOGIN"}
            </button>

            <p className="text-center text-sm text-gray-500">
              Not registered yet?{" "}
              {userNagivationInfo.basePath === userPath.PARENT_BASE_PATH ||
              userNagivationInfo.basePath ===
                userPath.SCHOOL_ADMIN_BASE_PATH ? (
                <Link
                  href={`${USER_REGISTER_PATH}`}
                  className="text-[#25AAE1] hover:text-[#25AAE1]"
                >
                  {`Sign up as ${userNagivationInfo.label} here`}
                </Link>
              ) : (
                <Link
                  href={`#`}
                  className="text-[#25AAE1] hover:text-[#25AAE1]"
                >
                  {`Please contact your School Administrator`}
                </Link>
              )}
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}
