"use client"

import { useEffect, useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Loader2, X, Clock, Mail, Calendar } from "lucide-react"
import { getListRequestLink, cancelLinkRequest } from "@/services/ParentRelationshipService"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

interface PendingRequest {
  relation_id: number
  student_id: number
  student_user_id: number
  student_full_name: string
  requested_at: string | null
}

interface PendingRequestsTabProps {
  accessToken: string
}

export function PendingRequestsTab({ accessToken }: PendingRequestsTabProps) {
  const [requests, setRequests] = useState<PendingRequest[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const refetch = async () => {
    if (!accessToken) return

    setLoading(true)
    setError(null)

    try {
      const data = await getListRequestLink(accessToken)
      setRequests(data)
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load requests")
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    refetch()
  }, [accessToken])

  const [cancellingId, setCancellingId] = useState<number | null>(null)
  const [showCancelDialog, setShowCancelDialog] = useState(false)
  const [selectedRequest, setSelectedRequest] = useState<PendingRequest | null>(null)

  const handleCancelClick = (request: PendingRequest) => {
    setSelectedRequest(request)
    setShowCancelDialog(true)
  }

  const handleCancelConfirm = async () => {
    if (!selectedRequest) return

    setCancellingId(selectedRequest.relation_id)
    try {
      await cancelLinkRequest(accessToken, selectedRequest.relation_id)
      await refetch()
    } catch (err) {
      console.error("Failed to cancel request:", err)
    } finally {
      setCancellingId(null)
      setShowCancelDialog(false)
      setSelectedRequest(null)
    }
  }

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-[#25AAE1] mb-4" />
        <p className="text-gray-600">Loading pending requests...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <div className="bg-red-50 border border-red-200 rounded-xl p-6 max-w-md text-center">
          <p className="text-red-600 font-medium">{error}</p>
          <Button
            onClick={refetch}
            className="mt-4 bg-gradient-to-r from-[#25AAE1] to-[#1D8CB3] text-white"
          >
            Try Again
          </Button>
        </div>
      </div>
    )
  }

  const pendingRequests = requests || []

  if (pendingRequests.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
          <Clock className="h-8 w-8 text-gray-400" />
        </div>
        <h3 className="text-lg font-semibold text-gray-800 mb-2">No Pending Requests</h3>
        <p className="text-gray-600 text-center max-w-md">
          You don't have any pending link requests. Send a new request to connect with a student.
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            <Clock className="h-6 w-6 text-yellow-500" />
            Awaiting Response
          </h3>
          <p className="text-gray-600 mt-1">
            {pendingRequests.length} {pendingRequests.length === 1 ? 'request' : 'requests'} pending student confirmation
          </p>
        </div>
        <Button
          variant="outline"
          onClick={refetch}
          disabled={loading}
          className="border-[#25AAE1] text-[#25AAE1] hover:bg-[#25AAE1] hover:text-white transition-all duration-300"
        >
          <Loader2 className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
          Refresh
        </Button>
      </div>

      <div className="space-y-4">
        {pendingRequests.map((request) => (
          <Card
            key={request.relation_id}
            className="group relative p-5 border-2 border-transparent hover:border-yellow-200 hover:shadow-xl transition-all duration-300 bg-gradient-to-r from-white to-yellow-50/30"
          >
            {/* Status indicator */}
            <div className="absolute left-0 top-0 bottom-0 w-1 bg-gradient-to-b from-yellow-400 to-orange-500 rounded-l-lg"></div>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4 flex-1">
                <div className="relative">
                  <div className="w-14 h-14 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-xl flex items-center justify-center text-white font-bold text-lg shadow-md">
                    {request.student_full_name.charAt(0).toUpperCase()}
                  </div>
                  <div className="absolute -top-1 -right-1 w-5 h-5 bg-yellow-500 rounded-full border-2 border-white animate-pulse">
                    <Clock className="w-3 h-3 text-white absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
                  </div>
                </div>

                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <h4 className="font-bold text-gray-800 text-lg truncate">
                      {request.student_full_name}
                    </h4>
                    <Badge
                      variant="secondary"
                      className="bg-gradient-to-r from-yellow-400 to-amber-500 text-white text-xs border-0 shadow-sm"
                    >
                      ⏳ Awaiting
                    </Badge>
                  </div>

                  <div className="flex items-center gap-4 text-sm text-gray-600">
                    <div className="flex items-center gap-2">
                      <div className="w-6 h-6 bg-gray-100 rounded-md flex items-center justify-center">
                        <Calendar className="h-3 w-3 text-gray-500" />
                      </div>
                      <span className="font-medium">ID: {request.student_id}</span>
                    </div>
                    {request.requested_at && (
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 bg-gray-100 rounded-md flex items-center justify-center">
                          <Clock className="h-3 w-3 text-gray-500" />
                        </div>
                        <span>
                          Sent {new Date(request.requested_at).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <Button
                variant="outline"
                size="sm"
                className="text-red-600 hover:bg-red-600 hover:text-white border-red-300 hover:border-red-600 transition-all duration-300 font-semibold ml-4"
                onClick={() => handleCancelClick(request)}
                disabled={cancellingId === request.relation_id}
              >
                {cancellingId === request.relation_id ? (
                  <Loader2 className="h-4 w-4 animate-spin" />
                ) : (
                  <>
                    <X className="h-4 w-4 mr-1" />
                    Cancel
                  </>
                )}
              </Button>
            </div>
          </Card>
        ))}
      </div>

      {/* Cancel Confirmation Dialog */}
      <AlertDialog open={showCancelDialog} onOpenChange={setShowCancelDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Cancel Link Request</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to cancel the link request to{" "}
              <strong>{selectedRequest?.student_full_name}</strong>?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleCancelConfirm}
              className="bg-red-600 hover:bg-red-700"
            >
              Cancel Request
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
