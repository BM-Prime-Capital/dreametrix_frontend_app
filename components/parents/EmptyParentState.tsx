"use client"

import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { UserPlus, Users, AlertCircle, ArrowRight, Info } from "lucide-react"
import Link from "next/link"

interface EmptyParentStateProps {
  variant?: "no-students" | "pending-requests" | "error"
  message?: string
  onAction?: () => void
}

export function EmptyParentState({
  variant = "no-students",
  message,
  onAction
}: EmptyParentStateProps) {

  if (variant === "no-students") {
    return (
      <div className="w-full min-h-[60vh] flex items-center justify-center p-4">
        <Card className="max-w-2xl w-full p-8 bg-gradient-to-br from-blue-50 to-white border-2 border-blue-100 shadow-xl">
          <div className="text-center space-y-6">
            {/* Icon */}
            <div className="w-20 h-20 bg-gradient-to-br from-[#25AAE1] to-[#1D8CB3] rounded-full flex items-center justify-center mx-auto shadow-lg">
              <Users className="h-10 w-10 text-white" />
            </div>

            {/* Title */}
            <div className="space-y-2">
              <h2 className="text-3xl font-bold text-gray-800">
                Welcome to Your Parent Dashboard!
              </h2>
              <p className="text-lg text-gray-600">
                You haven't linked any students yet
              </p>
            </div>

            {/* Description */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-left">
              <div className="flex items-start gap-3">
                <Info className="h-5 w-5 text-[#25AAE1] mt-0.5 flex-shrink-0" />
                <div className="space-y-2 text-sm text-gray-700">
                  <p className="font-semibold">To get started:</p>
                  <ol className="list-decimal list-inside space-y-1 ml-2">
                    <li>Click the button below to link your child's account</li>
                    <li>Enter your child's student code</li>
                    <li>Wait for approval from school administration</li>
                    <li>Once approved, you'll see all your children's academic information</li>
                  </ol>
                </div>
              </div>
            </div>

            {/* Action Button */}
            <div className="pt-4">
              <Link href="/parent/link-student">
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-[#25AAE1] to-[#1D8CB3] hover:from-[#1D8CB3] hover:to-[#1453B8] text-white px-8 py-6 text-lg rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
                >
                  <UserPlus className="h-5 w-5 mr-2" />
                  Link Student Account
                  <ArrowRight className="h-5 w-5 ml-2" />
                </Button>
              </Link>
            </div>

            {/* Additional Help */}
            <div className="pt-4 text-sm text-gray-500">
              <p>
                Don't have your child's student code?
                <Link href="/parent/communicate" className="text-[#25AAE1] hover:underline ml-1">
                  Contact school administration
                </Link>
              </p>
            </div>
          </div>
        </Card>
      </div>
    )
  }

  if (variant === "pending-requests") {
    return (
      <div className="w-full min-h-[60vh] flex items-center justify-center p-4">
        <Card className="max-w-2xl w-full p-8 bg-gradient-to-br from-yellow-50 to-white border-2 border-yellow-100 shadow-xl">
          <div className="text-center space-y-6">
            {/* Icon */}
            <div className="w-20 h-20 bg-gradient-to-br from-yellow-400 to-yellow-600 rounded-full flex items-center justify-center mx-auto shadow-lg animate-pulse">
              <AlertCircle className="h-10 w-10 text-white" />
            </div>

            {/* Title */}
            <div className="space-y-2">
              <h2 className="text-3xl font-bold text-gray-800">
                Link Request Pending
              </h2>
              <p className="text-lg text-gray-600">
                Your request to link a student is awaiting approval
              </p>
            </div>

            {/* Description */}
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 text-left">
              <div className="flex items-start gap-3">
                <Info className="h-5 w-5 text-yellow-600 mt-0.5 flex-shrink-0" />
                <div className="space-y-2 text-sm text-gray-700">
                  <p>Your link request has been submitted to the school administration.</p>
                  <p className="font-semibold">What happens next:</p>
                  <ul className="list-disc list-inside space-y-1 ml-2">
                    <li>School admin will verify your request</li>
                    <li>You'll receive a notification once approved</li>
                    <li>Once approved, you'll have full access to student information</li>
                  </ul>
                  <p className="text-xs text-gray-500 pt-2">
                    This usually takes 1-2 business days
                  </p>
                </div>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4 justify-center pt-4">
              <Link href="/parent/link-student">
                <Button
                  variant="outline"
                  className="border-2 border-[#25AAE1] text-[#25AAE1] hover:bg-blue-50"
                >
                  Link Another Student
                </Button>
              </Link>
              <Link href="/parent/communicate">
                <Button
                  className="bg-gradient-to-r from-[#25AAE1] to-[#1D8CB3] hover:from-[#1D8CB3] hover:to-[#1453B8] text-white"
                >
                  Contact Administration
                </Button>
              </Link>
            </div>
          </div>
        </Card>
      </div>
    )
  }

  if (variant === "error") {
    return (
      <div className="w-full min-h-[60vh] flex items-center justify-center p-4">
        <Card className="max-w-2xl w-full p-8 bg-gradient-to-br from-red-50 to-white border-2 border-red-100 shadow-xl">
          <div className="text-center space-y-6">
            {/* Icon */}
            <div className="w-20 h-20 bg-gradient-to-br from-red-400 to-red-600 rounded-full flex items-center justify-center mx-auto shadow-lg">
              <AlertCircle className="h-10 w-10 text-white" />
            </div>

            {/* Title */}
            <div className="space-y-2">
              <h2 className="text-3xl font-bold text-gray-800">
                Unable to Load Data
              </h2>
              <p className="text-lg text-gray-600">
                {message || "We encountered an error while loading your information"}
              </p>
            </div>

            {/* Action Buttons */}
            <div className="flex gap-4 justify-center pt-4">
              <Button
                onClick={onAction}
                className="bg-gradient-to-r from-[#25AAE1] to-[#1D8CB3] hover:from-[#1D8CB3] hover:to-[#1453B8] text-white"
              >
                Try Again
              </Button>
              <Link href="/parent/communicate">
                <Button
                  variant="outline"
                  className="border-2 border-gray-300"
                >
                  Contact Support
                </Button>
              </Link>
            </div>
          </div>
        </Card>
      </div>
    )
  }

  return null
}
