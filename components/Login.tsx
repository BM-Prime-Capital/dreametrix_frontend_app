"use client";

import { useState, type ChangeEvent, type FormEvent } from "react";
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
    <div className="min-h-screen bg-[url('/assets/images/bg.png')] bg-cover bg-center bg-no-repeat flex items-center justify-center p-4">
      <div className="w-full max-w-[450px] bg-[rgba(230,230,230,0.90)] p-6 sm:p-8 rounded-[15px] shadow-[0px_4px_20px_rgba(0,0,0,0.1)]">
        <div className="flex justify-center mb-6">
          <DreaMetrixLogo  />
        </div>

        <div className="text-left mb-6">
          <h2 className="text-[#1A73E8] text-lg font-medium ml-2.5">{`Login as ${userNagivationInfo.label}`}</h2>
        </div>

        {isLoading && (
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#25AAE1]"></div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <div className={`relative rounded-full overflow-hidden border ${
              formSubmitted && errors.email ? "border-red-500" : "border-gray-200"
            }`}>
              <div className="flex items-center px-4 py-2.5">
                <Mail className="h-5 w-5 text-gray-400 mr-2" />
                <input
                  type="email"
                  placeholder="Email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="flex-1 bg-transparent focus:outline-none text-sm"
                />
              </div>
            </div>
            {formSubmitted && errors.email && (
              <span className="text-red-500 text-sm ml-4 mt-1 block">Incorrect username</span>
            )}
          </div>

          <div>
            <div className={`relative rounded-full overflow-hidden border ${
              formSubmitted && errors.password ? "border-red-500" : "border-gray-200"
            }`}>
              <div className="flex items-center px-4 py-2.5">
                <Lock className="h-5 w-5 text-gray-400 mr-2" />
                <input
                  type="password"
                  placeholder="Password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className="flex-1 bg-transparent focus:outline-none text-sm"
                />
              </div>
            </div>
            {formSubmitted && errors.password && (
              <span className="text-red-500 text-sm ml-4 mt-1 block">Incorrect password</span>
            )}
          </div>

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
            {userNagivationInfo.basePath === userPath.PARENT_BASE_PATH ||
            userNagivationInfo.basePath === userPath.SCHOOL_ADMIN_BASE_PATH ? (
              <Link
                href={USER_REGISTER_PATH}
                className="text-[#1A73E8] hover:text-[#1453B8]"
              >
                {`Sign up as ${userNagivationInfo.label} here`}
              </Link>
            ) : (
              <Link
                href="#"
                className="text-[#1A73E8] hover:text-[#1453B8]"
              >
                Please contact your School Administrator
              </Link>
            )}
          </div>
        </form>
      </div>
    </div>
  );
}