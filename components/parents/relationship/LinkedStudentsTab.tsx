"use client"

import { useEffect, useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Loader2, UserMinus, Mail, Phone, GraduationCap, Calendar, Users } from "lucide-react"
import { useParentRelationship } from "@/hooks/useParentRelationship"
import { unlinkStudent } from "@/services/ParentRelationshipService"
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

interface LinkedStudentsTabProps {
  accessToken: string
}

export function LinkedStudentsTab({ accessToken }: LinkedStudentsTabProps) {
  const { linkedStudents, loading, error, refetch } = useParentRelationship(accessToken)
  const [unlinkingId, setUnlinkingId] = useState<number | null>(null)
  const [showUnlinkDialog, setShowUnlinkDialog] = useState(false)
  const [selectedStudent, setSelectedStudent] = useState<any>(null)

  const handleUnlinkClick = (student: any) => {
    setSelectedStudent(student)
    setShowUnlinkDialog(true)
  }

  const handleUnlinkConfirm = async () => {
    if (!selectedStudent) return

    setUnlinkingId(selectedStudent.student_id)
    try {
      await unlinkStudent(accessToken, selectedStudent.student_id)
      await refetch()
    } catch (err) {
      console.error("Failed to unlink student:", err)
    } finally {
      setUnlinkingId(null)
      setShowUnlinkDialog(false)
      setSelectedStudent(null)
    }
  }

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-[#25AAE1] mb-4" />
        <p className="text-gray-600">Loading linked students...</p>
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

  if (linkedStudents.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
          <GraduationCap className="h-8 w-8 text-gray-400" />
        </div>
        <h3 className="text-lg font-semibold text-gray-800 mb-2">No Linked Students</h3>
        <p className="text-gray-600 text-center max-w-md">
          You don't have any linked students yet. Send a link request to connect with a student.
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-2xl font-bold text-gray-800 flex items-center gap-2">
            <Users className="h-6 w-6 text-[#25AAE1]" />
            Connected Students
          </h3>
          <p className="text-gray-600 mt-1">
            You have {linkedStudents.length} {linkedStudents.length === 1 ? 'student' : 'students'} in your network
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

      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {linkedStudents.map((student) => (
          <Card
            key={student.student_id}
            className="group relative p-6 hover:shadow-2xl transition-all duration-300 border-2 border-transparent hover:border-[#25AAE1]/20 bg-gradient-to-br from-white to-gray-50"
          >
            {/* Decorative corner */}
            <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-[#25AAE1]/10 to-transparent rounded-bl-3xl"></div>

            <div className="relative z-10">
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-4">
                  <div className="relative">
                    <div className="w-16 h-16 bg-gradient-to-br from-[#25AAE1] via-[#1D8CB3] to-[#1453B8] rounded-2xl flex items-center justify-center text-white font-bold text-xl shadow-lg group-hover:scale-110 transition-transform duration-300">
                      {student.student_full_name
                        .split(" ")
                        .map((n: string) => n[0])
                        .join("")
                        .toUpperCase()
                        .slice(0, 2)}
                    </div>
                    <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full border-4 border-white flex items-center justify-center">
                      <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
                    </div>
                  </div>
                  <div>
                    <h4 className="font-bold text-gray-800 text-lg mb-1">
                      {student.student_full_name}
                    </h4>
                    <Badge
                      variant="secondary"
                      className="bg-gradient-to-r from-green-400 to-emerald-500 text-white text-xs border-0 shadow-sm"
                    >
                      ✓ Active Connection
                    </Badge>
                  </div>
                </div>
              </div>

              <div className="space-y-3 mb-5">
                <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-100 transition-colors">
                  <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Mail className="h-4 w-4 text-blue-600" />
                  </div>
                  <span className="text-sm text-gray-700 font-medium truncate">
                    {student.student_email || "No email provided"}
                  </span>
                </div>
                <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-100 transition-colors">
                  <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center">
                    <GraduationCap className="h-4 w-4 text-purple-600" />
                  </div>
                  <span className="text-sm text-gray-700 font-medium">
                    ID: {student.student_id}
                  </span>
                </div>
                {student.relationship_since && (
                  <div className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-100 transition-colors">
                    <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
                      <Calendar className="h-4 w-4 text-green-600" />
                    </div>
                    <span className="text-sm text-gray-700 font-medium">
                      Since {new Date(student.relationship_since).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </span>
                  </div>
                )}
              </div>

              <Button
                variant="outline"
                size="sm"
                className="w-full text-red-600 hover:bg-red-600 hover:text-white border-red-300 hover:border-red-600 transition-all duration-300 font-semibold group/btn"
                onClick={() => handleUnlinkClick(student)}
                disabled={unlinkingId === student.student_id}
              >
                {unlinkingId === student.student_id ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Unlinking...
                  </>
                ) : (
                  <>
                    <UserMinus className="h-4 w-4 mr-2 group-hover/btn:animate-bounce" />
                    Remove Connection
                  </>
                )}
              </Button>
            </div>
          </Card>
        ))}
      </div>

      {/* Unlink Confirmation Dialog */}
      <AlertDialog open={showUnlinkDialog} onOpenChange={setShowUnlinkDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Unlink Student</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to unlink <strong>{selectedStudent?.student_full_name}</strong>?
              You will no longer be able to view their academic information.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleUnlinkConfirm}
              className="bg-red-600 hover:bg-red-700"
            >
              Unlink
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
