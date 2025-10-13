"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Loader2, Send, CheckCircle, AlertCircle, UserPlus } from "lucide-react"
import { ParentRelationshipService, sendLinkRequest } from "@/services/ParentRelationshipService"
import { toast } from "sonner"

interface SendRequestTabProps {
  accessToken: string
}

export function SendRequestTab({ accessToken }: SendRequestTabProps) {
  const [email, setEmail] = useState("")
  const [message, setMessage] = useState("")
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
      //toast.success("Link request submitted successfully")
      toast.success("Link request submitted successfully")
      // Redirect to dashboard after 2 seconds
      setTimeout(() => {
        setSuccess(false)
      }, 2000)

    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to submit link request. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Enhanced Header */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-400 to-purple-600 rounded-xl flex items-center justify-center">
              <Send className="h-5 w-5 text-white" />
            </div>
            Send Link Request
          </h3>
          <p className="text-gray-600 mt-1">
            Connect with a student by sending them a link request
          </p>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Form Card */}
        <Card className="lg:col-span-2 relative overflow-hidden border-2 border-transparent hover:border-purple-200 transition-all duration-300 bg-gradient-to-br from-white to-purple-50/20">
          {/* Decorative corner */}
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-purple-400/10 to-transparent rounded-bl-3xl"></div>

          <div className="relative z-10 p-8">
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
                // maxLength={20}
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
          </div>
        </Card>

        {/* Enhanced Info Card */}
        <Card className="h-fit bg-gradient-to-br from-blue-50 via-white to-purple-50 border-2 border-blue-100 hover:border-blue-200 transition-all duration-300">
          <div className="p-6 space-y-4">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-blue-600 rounded-xl flex items-center justify-center">
                <AlertCircle className="h-5 w-5 text-white" />
              </div>
              <h4 className="text-lg font-bold text-gray-800">How It Works</h4>
            </div>

            <div className="space-y-3">
              <div className="flex gap-3 group">
                <div className="w-6 h-6 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5 group-hover:bg-blue-200 transition-colors">
                  <span className="text-xs font-bold text-blue-600">1</span>
                </div>
                <p className="text-sm text-gray-700 leading-relaxed">
                  The student receives a notification about your link request
                </p>
              </div>

              <div className="flex gap-3 group">
                <div className="w-6 h-6 bg-purple-100 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5 group-hover:bg-purple-200 transition-colors">
                  <span className="text-xs font-bold text-purple-600">2</span>
                </div>
                <p className="text-sm text-gray-700 leading-relaxed">
                  They can accept or decline your request
                </p>
              </div>

              <div className="flex gap-3 group">
                <div className="w-6 h-6 bg-green-100 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5 group-hover:bg-green-200 transition-colors">
                  <span className="text-xs font-bold text-green-600">3</span>
                </div>
                <p className="text-sm text-gray-700 leading-relaxed">
                  Once accepted, you can view their academic information
                </p>
              </div>

              <div className="flex gap-3 group">
                <div className="w-6 h-6 bg-orange-100 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5 group-hover:bg-orange-200 transition-colors">
                  <span className="text-xs font-bold text-orange-600">⏱</span>
                </div>
                <p className="text-sm text-gray-700 leading-relaxed">
                  Request expires after 7 days if not accepted
                </p>
              </div>
            </div>

            <div className="mt-6 p-3 bg-gradient-to-r from-yellow-50 to-amber-50 border border-yellow-200 rounded-lg">
              <p className="text-xs text-yellow-800 font-medium flex items-center gap-2">
                <span className="text-base">💡</span>
                <span>Tip: Add a personal message to increase acceptance rate</span>
              </p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  )
}
