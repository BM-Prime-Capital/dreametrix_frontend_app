"use client"

import { useState, type ChangeEvent, type FormEvent } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Mail, Lock, AlertTriangle,User } from "lucide-react"
import { userTypeEnum } from "@/constants/userConstants"

import DreaMetrixLogo from "./ui/dreametrix-logo"

export interface LoginFormData {
  email: string
  password: string
}

export interface LoginErrors {
  email: boolean
  password: boolean
}

// Exemples d'identifiants pour chaque type d'utilisateur
const DEFAULT_USERS = {
  [userTypeEnum.STUDENT]: { email: "student@example.com", password: "studentpass" },
  [userTypeEnum.TEACHER]: { email: "teacher@example.com", password: "teacherpass" },
  [userTypeEnum.SCHOOL_ADMIN]: { email: "admin@example.com", password: "adminpass" },
  [userTypeEnum.PARENT]: { email: "parent@example.com", password: "parentpass" },
}

// Simulation d'une fonction d'authentification
const authenticateUser = async (email: string, password: string): Promise<{ role: userTypeEnum | null }> => {
  for (const [role, credentials] of Object.entries(DEFAULT_USERS)) {
    if (email === credentials.email && password === credentials.password) {
      return { role: role as userTypeEnum }
    }
  }
  return { role: null }
}

export default function Login() {
  const router = useRouter()
  const [formData, setFormData] = useState<LoginFormData>({
    email: "",
    password: "",
  })
  const [formSubmitted, setFormSubmitted] = useState<boolean>(false)
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [errors, setErrors] = useState<LoginErrors>({
    email: false,
    password: false,
  })

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>): void => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    setErrors((prev) => ({ ...prev, [name]: false }))
  }

  const handleSubmit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault()
    setFormSubmitted(true)
    setIsLoading(true)

    const { email, password } = formData

    if (!email || !password) {
      setErrors({
        email: !email,
        password: !password,
      })
      setIsLoading(false)
      return
    }

    try {
      const { role } = await authenticateUser(email, password)
      if (role) {
        switch (role) {
          case userTypeEnum.STUDENT:
            router.push("/student/")
            break
          case userTypeEnum.TEACHER:
            router.push("/teacher/")
            break
          case userTypeEnum.SCHOOL_ADMIN:
            router.push("/school_admin/")
            break
          case userTypeEnum.PARENT:
            router.push("/parent/")
            break
          default:
            setErrors({ email: true, password: true })
        }
      } else {
        setErrors({ email: true, password: true })
      }
    } catch (error) {
      console.error("Authentication error:", error)
      setErrors({ email: true, password: true })
    } finally {
      setIsLoading(false)
    }
  }


  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-[450px] bg-[rgba(255,255,255,0.85)] p-6 sm:p-8 rounded-[15px] shadow-[0px_4px_20px_rgba(0,0,0,0.1)]">
        {/* Title Section */}
        <div className="text-left mb-6">
          <h2 className="text-[#25AAE1] text-xl font-normal">Login</h2>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Email Input */}
          <div className="relative">
            <div
              className={`relative rounded-full overflow-hidden border ${
                formSubmitted && errors.email ? "border-red-500" : "border-gray-200"
              } bg-white`}
            >
              <div className="flex items-center">
                <div className="px-4 py-2.5">
                  <div className="text-[#25AAE1]">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="h-5 w-5"
                    >
                      <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path>
                      <circle cx="12" cy="7" r="4"></circle>
                    </svg>
                  </div>
                </div>
                <div className="h-[30px] w-[1px] bg-gray-300 mx-1"></div>
                <input
                  type="email"
                  placeholder="Email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="flex-1 bg-transparent focus:outline-none text-sm py-2.5 pr-4"
                />
              </div>
            </div>
            {formSubmitted && errors.email && (
              <div className="absolute right-[-160px] top-1/2 transform -translate-y-1/2 bg-red-100 text-red-700 px-3 py-1 rounded-md shadow-md">
                <div className="absolute left-[-6px] top-1/2 transform -translate-y-1/2 w-0 h-0 border-t-[6px] border-t-transparent border-b-[6px] border-b-transparent border-r-[6px] border-r-red-100"></div>
                <div className="flex items-center">
                  <AlertTriangle className="h-4 w-4 mr-2" />
                  <span className="text-sm">Incorrect email</span>
                </div>
              </div>
            )}
          </div>

          {/* Password Input */}
          <div className="relative">
            <div
              className={`relative rounded-full overflow-hidden border ${
                formSubmitted && errors.password ? "border-red-500" : "border-gray-200"
              } bg-white`}
            >
              <div className="flex items-center">
                <div className="px-4 py-2.5">
                  <div className="text-[#25AAE1]">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="24"
                      height="24"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="h-5 w-5"
                    >
                      <rect width="18" height="11" x="3" y="11" rx="2" ry="2"></rect>
                      <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
                    </svg>
                  </div>
                </div>
                <div className="h-[30px] w-[1px] bg-gray-300 mx-1"></div>
                <input
                  type="password"
                  placeholder="Password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className="flex-1 bg-transparent focus:outline-none text-sm py-2.5 pr-4"
                />
              </div>
            </div>
            {formSubmitted && errors.password && (
              <div className="absolute right-[-160px] top-1/2 transform -translate-y-1/2 bg-red-100 text-red-700 px-3 py-1 rounded-md shadow-md">
                <div className="absolute left-[-6px] top-1/2 transform -translate-y-1/2 w-0 h-0 border-t-[6px] border-t-transparent border-b-[6px] border-b-transparent border-r-[6px] border-r-red-100"></div>
                <div className="flex items-center">
                  <AlertTriangle className="h-4 w-4 mr-2" />
                  <span className="text-sm">Incorrect password</span>
                </div>
              </div>
            )}
          </div>

          {/* Forgot Password Link */}
          <div className="text-right">
            <Link href="/forgot_password" className="text-[#25AAE1] hover:text-[#1A73E8] text-sm">
              Forgot Password?
            </Link>
          </div>

          {/* Login Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-[#25AAE1] hover:bg-[#1A73E8] text-white py-3 rounded-full 
                     transition-colors focus:outline-none focus:ring-2 focus:ring-[#25AAE1] 
                     focus:ring-offset-2 disabled:opacity-50 text-base font-medium"
          >
            {isLoading ? "LOGGING IN..." : "LOGIN"}
          </button>
        </form>

        {/* Registration Links */}
        <div className="text-center text-sm text-gray-600 mt-4">
          Register your School{" "}
          <Link href="/register_school" className="text-[#25AAE1] hover:text-[#1A73E8]">
            here
          </Link>
          .
          <br />
          Not registered yet? Sign up{" "}
          <Link href="/register" className="text-[#25AAE1] hover:text-[#1A73E8]">
            here
          </Link>
          .
        </div>
      </div>
    </div>
  )
}

