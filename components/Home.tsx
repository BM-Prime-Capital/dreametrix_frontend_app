"use client"

import { useState, type ChangeEvent, type FormEvent } from "react"
import Link from "next/link"
import { Mail, Lock, AlertTriangle } from "lucide-react"
import { userPath } from "@/constants/userConstants"
import { useLogin } from "@/hooks/SchoolAdmin/useLogin"

export interface LoginFormData {
  email: string
  password: string
}

export interface LoginErrors {
  email: string | null
  password: string | null
}

export default function Login() {
  const { login, isLoading } = useLogin()
  const [formData, setFormData] = useState<LoginFormData>({
    email: "",
    password: "",
  })
  const [formSubmitted, setFormSubmitted] = useState<boolean>(false)
  const [errors, setErrors] = useState<LoginErrors>({
    email: null,
    password: null,
  })

  const validateEmail = (email: string): string | null => {
    if (!email) return "Email is required"
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) return "Incorrect Username"
    return null
  }

  const validatePassword = (password: string): string | null => {
    if (!password) return "Password is required"
    if (password.length < 8) return "Incorrect Password"
    return null
  }

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>): void => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    if (formSubmitted) {
      if (name === 'email') {
        setErrors((prev) => ({ ...prev, email: validateEmail(value) }))
      } else if (name === 'password') {
        setErrors((prev) => ({ ...prev, password: validatePassword(value) }))
      }
    }
  }

  const handleSubmit = async (e: FormEvent<HTMLFormElement>): Promise<void> => {
    e.preventDefault()
    setFormSubmitted(true)

    const { email, password } = formData

    const emailError = validateEmail(email)
    const passwordError = validatePassword(password)

    setErrors({
      email: emailError,
      password: passwordError,
    })

    if (emailError || passwordError) {
      return
    }

    try {
      await login({ email, password })
    } catch (err: unknown) {
      if (err instanceof Error) {
        const errorMessage = err.message

        if (errorMessage.toLowerCase().includes("email") || errorMessage.toLowerCase().includes("username")) {
          setErrors((prev) => ({ ...prev, email: "Incorrect Username" }))
        } else if (errorMessage.toLowerCase().includes("password")) {
          setErrors((prev) => ({ ...prev, password: "Incorrect Password" }))
        } else {
          console.error(errorMessage)
        }
      } else {
        console.error("An unknown error occurred")
      }
    }
  }

  const renderErrorMessage = (errorMessage: string | null) => {
    if (!errorMessage) return null
    return (
      <div className="absolute right-[-180px] top-1/2 transform -translate-y-1/2 bg-red-500 text-white px-4 py-2 rounded-md shadow-md min-w-[160px]">
        <div className="absolute left-[-8px] top-1/2 transform -translate-y-1/2 w-0 h-0 
          border-y-[8px] border-y-transparent 
          border-r-[8px] border-r-red-500">
        </div>
        <div className="flex items-center">
          <AlertTriangle className="h-4 w-4 mr-2 flex-shrink-0" />
          <span className="text-sm whitespace-nowrap">{errorMessage}</span>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[url('/assets/images/bg.png')] bg-cover bg-center bg-no-repeat flex items-center justify-center p-4">
      <div className="w-full max-w-[450px] bg-white/90 p-6 sm:p-8 rounded-[15px] shadow-[0px_4px_20px_rgba(0,0,0,0.1)]">
        <div className="text-left mb-6">
          <h2 className="text-[#25AAE1] text-xl font-medium">Login</h2>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="relative">
            <div
              className={`relative rounded-full overflow-hidden border ${
                formSubmitted && errors.email ? "border-red-500" : "border-gray-200"
              }`}
            >
              <div className="flex items-center">
                <div className="flex items-center px-4 py-2.5 text-[#25AAE1]">
                  <Mail className="h-5 w-5" />
                </div>
                <div className="h-[30px] w-[1px] bg-gray-300"></div>
                <input
                  type="email"
                  placeholder="Email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className="flex-1 bg-transparent focus:outline-none text-sm px-4 py-2.5"
                />
              </div>
            </div>
            {renderErrorMessage(errors.email)}
          </div>

          <div className="relative">
            <div
              className={`relative rounded-full overflow-hidden border ${
                formSubmitted && errors.password ? "border-red-500" : "border-gray-200"
              }`}
            >
              <div className="flex items-center">
                <div className="flex items-center px-4 py-2.5 text-[#25AAE1]">
                  <Lock className="h-5 w-5" />
                </div>
                <div className="h-[30px] w-[1px] bg-gray-300"></div>
                <input
                  type="password"
                  placeholder="Password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  className="flex-1 bg-transparent focus:outline-none text-sm px-4 py-2.5"
                />
              </div>
            </div>
            {renderErrorMessage(errors.password)}
          </div>

          <div className="text-right">
            <Link href="/forgot_password" className="text-[#25AAE1] hover:text-[#25AAE1] text-sm">
              Forgot Password?
            </Link>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-[#25AAE1] hover:bg-[#25AAE1] text-white py-3 rounded-full 
           transition-colors focus:outline-none focus:ring-2 focus:ring-[#25AAE1] 
           focus:ring-offset-2 disabled:opacity-50 text-base font-medium"
          >
            {isLoading ? "LOGGING IN..." : "LOGIN"}
          </button>
        </form>
        <div className="text-center text-sm text-gray-600 mt-4">
          Register your School{" "}
          <Link href={userPath.SCHOOL_ADMIN_REGISTER_PATH} className="text-[#25AAE1] hover:text-[#25AAE1]">
            here
          </Link>
          .
          <br />
          Not registered yet? Sign up{" "}
          <Link href={userPath.SCHOOL_ADMIN_REGISTER_PATH} className="text-[#25AAE1] hover:text-[#25AAE1]">
            here
          </Link>
          .
        </div>
      </div>
    </div>
  )
}