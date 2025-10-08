"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Loader2, Send, CheckCircle, AlertCircle } from "lucide-react"
import { sendLinkRequest } from "@/services/ParentRelationshipService"

interface SendRequestTabProps {
  accessToken: string
}

export function SendRequestTab({ accessToken }: SendRequestTabProps) {
  const [email, setEmail] = useState("")
  const [message, setMessage] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!email.trim()) {
      setError("Please enter a student email address")
      return
    }

    setLoading(true)
    setError(null)
    setSuccess(false)

    try {
      await sendLinkRequest(accessToken, email, message)
      setSuccess(true)
      setEmail("")
      setMessage("")

      // Clear success message after 5 seconds
      setTimeout(() => {
        setSuccess(false)
      }, 5000)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to send link request")
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
              {/* Email Input with Enhanced Design */}
              <div className="space-y-3">
                <Label htmlFor="email" className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                  <div className="w-6 h-6 bg-purple-100 rounded-md flex items-center justify-center">
                    <Send className="h-3 w-3 text-purple-600" />
                  </div>
                  Student Email Address <span className="text-red-500">*</span>
                </Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="student@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  disabled={loading}
                  className="w-full h-12 px-4 border-2 border-gray-200 focus:border-purple-400 focus:ring-4 focus:ring-purple-100 transition-all duration-300 rounded-xl"
                  required
                />
                <p className="text-xs text-gray-500 flex items-center gap-1 ml-1">
                  💡 Enter the email address the student uses to sign in
                </p>
              </div>

              {/* Optional Message with Enhanced Design */}
              <div className="space-y-3">
                <Label htmlFor="message" className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                  <div className="w-6 h-6 bg-blue-100 rounded-md flex items-center justify-center">
                    <AlertCircle className="h-3 w-3 text-blue-600" />
                  </div>
                  Personal Message (Optional)
                </Label>
                <Textarea
                  id="message"
                  placeholder="Hi! I would like to connect with you to follow your academic progress and support your learning journey..."
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  disabled={loading}
                  className="w-full min-h-[120px] px-4 py-3 border-2 border-gray-200 focus:border-purple-400 focus:ring-4 focus:ring-purple-100 transition-all duration-300 rounded-xl resize-none"
                  maxLength={500}
                />
                <div className="flex items-center justify-between text-xs">
                  <span className="text-gray-500">Add a personal touch to your request</span>
                  <span className={`font-medium ${message.length > 450 ? 'text-orange-500' : 'text-gray-500'}`}>
                    {message.length}/500
                  </span>
                </div>
              </div>

              {/* Error Message with Enhanced Design */}
              {error && (
                <div className="flex items-start gap-3 p-4 bg-gradient-to-r from-red-50 to-red-100/50 border-2 border-red-200 rounded-xl shadow-sm animate-in slide-in-from-top-2">
                  <div className="w-8 h-8 bg-red-500 rounded-lg flex items-center justify-center flex-shrink-0">
                    <AlertCircle className="h-5 w-5 text-white" />
                  </div>
                  <div className="flex-1 pt-0.5">
                    <p className="text-sm font-bold text-red-800 mb-1">Unable to Send Request</p>
                    <p className="text-sm text-red-600">{error}</p>
                  </div>
                </div>
              )}

              {/* Success Message with Enhanced Design */}
              {success && (
                <div className="flex items-start gap-3 p-4 bg-gradient-to-r from-green-50 to-emerald-100/50 border-2 border-green-200 rounded-xl shadow-sm animate-in slide-in-from-top-2">
                  <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center flex-shrink-0">
                    <CheckCircle className="h-5 w-5 text-white" />
                  </div>
                  <div className="flex-1 pt-0.5">
                    <p className="text-sm font-bold text-green-800 mb-1">Request Sent Successfully!</p>
                    <p className="text-sm text-green-600">
                      Your link request has been sent. The student will receive a notification.
                    </p>
                  </div>
                </div>
              )}

              {/* Enhanced Submit Button */}
              <Button
                type="submit"
                disabled={loading || !email.trim()}
                className="w-full h-14 bg-gradient-to-r from-purple-500 via-purple-600 to-purple-700 text-white hover:shadow-2xl hover:scale-[1.02] transition-all duration-300 rounded-xl text-base font-semibold disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 group"
              >
                {loading ? (
                  <>
                    <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                    Sending Request...
                  </>
                ) : (
                  <>
                    <Send className="h-5 w-5 mr-2 group-hover:translate-x-1 transition-transform duration-300" />
                    Send Link Request
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
