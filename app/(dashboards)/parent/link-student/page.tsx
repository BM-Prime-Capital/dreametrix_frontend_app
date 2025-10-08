"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { UserPlus, Loader2, CheckCircle, AlertCircle, ArrowLeft, Info } from "lucide-react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { useRequestInfo } from "@/hooks/useRequestInfo"
import { ParentRelationshipService } from "@/services/ParentRelationshipService"

export default function LinkStudentPage() {
  const router = useRouter()
  const { accessToken } = useRequestInfo()
  const [studentCode, setStudentCode] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    // Validation
    if (!studentCode.trim()) {
      setError("Please enter a student code")
      return
    }

    if (!accessToken) {
      setError("No access token available. Please log in again.")
      return
    }

    setLoading(true)
    setError(null)

    try {
      // Call the actual API
      await ParentRelationshipService.requestLink(studentCode, accessToken)

      // Show success message
      setSuccess(true)

      // Redirect to dashboard after 2 seconds
      setTimeout(() => {
        router.push("/parent")
      }, 2000)

    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to submit link request. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div className="w-full min-h-[60vh] flex items-center justify-center p-4">
        <Card className="max-w-2xl w-full p-8 bg-gradient-to-br from-green-50 to-white border-2 border-green-100 shadow-xl">
          <div className="text-center space-y-6">
            {/* Success Icon */}
            <div className="w-20 h-20 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center mx-auto shadow-lg">
              <CheckCircle className="h-10 w-10 text-white" />
            </div>

            {/* Title */}
            <div className="space-y-2">
              <h2 className="text-3xl font-bold text-gray-800">
                Request Submitted Successfully!
              </h2>
              <p className="text-lg text-gray-600">
                Your link request has been sent to the school administration
              </p>
            </div>

            {/* Description */}
            <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-left">
              <div className="flex items-start gap-3">
                <Info className="h-5 w-5 text-green-600 mt-0.5 flex-shrink-0" />
                <div className="space-y-2 text-sm text-gray-700">
                  <p className="font-semibold">What happens next:</p>
                  <ul className="list-disc list-inside space-y-1 ml-2">
                    <li>School administration will review your request</li>
                    <li>You'll receive a notification once approved</li>
                    <li>Once approved, you'll have access to student information</li>
                  </ul>
                  <p className="text-xs text-gray-500 pt-2">
                    Redirecting to dashboard...
                  </p>
                </div>
              </div>
            </div>
          </div>
        </Card>
      </div>
    )
  }

  return (
    <div className="w-full space-y-6">
      {/* Back Button */}
      <div>
        <Link href="/parent">
          <Button variant="ghost" className="text-gray-600 hover:text-gray-800">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Dashboard
          </Button>
        </Link>
      </div>

      {/* Main Card */}
      <Card className="max-w-3xl mx-auto p-8 bg-white shadow-xl">
        <div className="space-y-6">
          {/* Header */}
          <div className="text-center space-y-3">
            <div className="w-16 h-16 bg-gradient-to-br from-[#25AAE1] to-[#1D8CB3] rounded-full flex items-center justify-center mx-auto shadow-lg">
              <UserPlus className="h-8 w-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-gray-800">Link Student Account</h1>
            <p className="text-gray-600">
              Enter your child's student code to request access to their academic information
            </p>
          </div>

          {/* Info Box */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <Info className="h-5 w-5 text-[#25AAE1] mt-0.5 flex-shrink-0" />
              <div className="space-y-2 text-sm text-gray-700">
                <p className="font-semibold">How to find the student code:</p>
                <ul className="list-disc list-inside space-y-1 ml-2">
                  <li>Ask your child for their student code</li>
                  <li>Contact your child's teacher or school administration</li>
                  <li>Check any school documentation or welcome materials</li>
                </ul>
                <p className="text-xs text-gray-500 pt-2">
                  Student codes are usually 8-12 characters (letters and numbers)
                </p>
              </div>
            </div>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Student Code Input */}
            <div className="space-y-2">
              <Label htmlFor="studentCode" className="text-base font-semibold text-gray-700">
                Student Code <span className="text-red-500">*</span>
              </Label>
              <Input
                id="studentCode"
                type="text"
                placeholder="Enter student code (e.g., STU12345678)"
                value={studentCode}
                onChange={(e) => {
                  setStudentCode(e.target.value.toUpperCase())
                  setError(null)
                }}
                disabled={loading}
                className="text-lg py-6 font-mono uppercase"
                maxLength={20}
              />
              <p className="text-sm text-gray-500">
                The student code is case-insensitive
              </p>
            </div>

            {/* Error Message */}
            {error && (
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <div className="flex items-center gap-3">
                  <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0" />
                  <p className="text-sm text-red-700 font-medium">{error}</p>
                </div>
              </div>
            )}

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={loading || !studentCode.trim()}
              className="w-full bg-gradient-to-r from-[#25AAE1] to-[#1D8CB3] hover:from-[#1D8CB3] hover:to-[#1453B8] text-white py-6 text-lg rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                  Submitting Request...
                </>
              ) : (
                <>
                  <UserPlus className="h-5 w-5 mr-2" />
                  Submit Link Request
                </>
              )}
            </Button>
          </form>

          {/* Additional Help */}
          <div className="pt-4 border-t border-gray-200">
            <p className="text-center text-sm text-gray-600">
              Having trouble?{" "}
              <Link href="/parent/communicate" className="text-[#25AAE1] hover:underline font-semibold">
                Contact school administration
              </Link>{" "}
              for assistance
            </p>
          </div>
        </div>
      </Card>

      {/* Additional Information */}
      <div className="max-w-3xl mx-auto">
        <Card className="p-6 bg-gray-50 border border-gray-200">
          <h3 className="font-semibold text-gray-800 mb-3">Important Notes:</h3>
          <ul className="space-y-2 text-sm text-gray-600">
            <li className="flex items-start gap-2">
              <span className="text-[#25AAE1] font-bold">•</span>
              <span>Your request must be approved by school administration before you can access student information</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-[#25AAE1] font-bold">•</span>
              <span>Approval typically takes 1-2 business days</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-[#25AAE1] font-bold">•</span>
              <span>You'll receive a notification once your request is approved or if more information is needed</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="text-[#25AAE1] font-bold">•</span>
              <span>You can link multiple students by submitting additional requests</span>
            </li>
          </ul>
        </Card>
      </div>
    </div>
  )
}
