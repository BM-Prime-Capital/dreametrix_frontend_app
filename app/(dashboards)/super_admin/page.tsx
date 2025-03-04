"use client"

import { useState, useEffect } from "react"
import { useSchoolRequests } from "@/hooks/SchoolAdmin/use-school-request"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Checkbox } from "@/components/ui/checkbox"
import { Button } from "@/components/ui/button"
import { toast } from "react-toastify"
import { Loader2 } from "lucide-react"

interface SchoolRequest {
  id: number
  name: string
  school_email: string
  administrator_email: string
  phone: string
  country: string
  city: string
  address: string
  region: string
  is_reviewed: boolean
  is_approved: boolean | null
  is_denied: boolean | null
  created_at: string
}

interface UpdateStatusPayload extends Omit<SchoolRequest, "id" | "created_at"> {
  is_approved: boolean
  is_denied: boolean
}

export default function SchoolApprovalPage() {
  const { schoolRequests, loading, updateSchoolStatus, refreshSchoolRequests } = useSchoolRequests()
  const [selectedSchools, setSelectedSchools] = useState<Record<number, { approved: boolean; denied: boolean }>>({})
  const [updatingSchools, setUpdatingSchools] = useState<Record<number, boolean>>({})

  useEffect(() => {
    const initialState: Record<number, { approved: boolean; denied: boolean }> = {}
    schoolRequests.forEach((school) => {
      initialState[school.id] = {
        approved: school.is_approved === true,
        denied: school.is_denied === true,
      }
    })
    setSelectedSchools(initialState)
  }, [schoolRequests])

  const handleApproveChange = (id: number, checked: boolean) => {
    setSelectedSchools((prev) => ({
      ...prev,
      [id]: {
        approved: checked,
        denied: checked ? false : prev[id]?.denied || false,
      },
    }))
  }

  const handleDenyChange = (id: number, checked: boolean) => {
    setSelectedSchools((prev) => ({
      ...prev,
      [id]: {
        approved: checked ? false : prev[id]?.approved || false,
        denied: checked,
      },
    }))
  }

  const handleSubmit = async (school: SchoolRequest) => {
    try {
      setUpdatingSchools((prev) => ({ ...prev, [school.id]: true }))
      const status = selectedSchools[school.id]
      const payload: UpdateStatusPayload = {
        ...school,
        is_approved: status.approved,
        is_denied: status.denied,
      }
      await updateSchoolStatus(school.id, payload)
      toast("School request status has been updated successfully")
      await refreshSchoolRequests() // Refresh the school requests after successful update
    } catch (error) {
      console.error("Error updating school status:", error)
      toast("Failed to update school request status")
    } finally {
      setUpdatingSchools((prev) => ({ ...prev, [school.id]: false }))
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    )
  }

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-6">School Approval Requests</h1>

      {schoolRequests.length === 0 ? (
        <p className="text-muted-foreground">No school requests found.</p>
      ) : (
        <div className="grid gap-6">
          {schoolRequests.map((school) => (
            <Card key={school.id}>
              <CardHeader>
                <CardTitle>{school.name}</CardTitle>
                <CardDescription>Created on {new Date(school.created_at).toLocaleDateString()}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm font-medium">School Email</p>
                      <p className="text-sm text-muted-foreground">{school.school_email}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium">Administrator Email</p>
                      <p className="text-sm text-muted-foreground">{school.administrator_email}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium">Phone</p>
                      <p className="text-sm text-muted-foreground">{school.phone}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium">Location</p>
                      <p className="text-sm text-muted-foreground">
                        {school.city}, {school.region}, {school.country}
                      </p>
                    </div>
                    <div>
                      <p className="text-sm font-medium">Address</p>
                      <p className="text-sm text-muted-foreground">{school.address}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium">Review Status</p>
                      <p className="text-sm text-muted-foreground">
                        {school.is_reviewed ? "Reviewed" : "Not Reviewed"}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-6 mt-4">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id={`approve-${school.id}`}
                        checked={selectedSchools[school.id]?.approved || false}
                        onCheckedChange={(checked) => handleApproveChange(school.id, checked === true)}
                        disabled={
                          updatingSchools[school.id] || school.is_approved === true || school.is_denied === true
                        }
                      />
                      <label htmlFor={`approve-${school.id}`} className="text-sm font-medium">
                        Approve
                      </label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id={`deny-${school.id}`}
                        checked={selectedSchools[school.id]?.denied || false}
                        onCheckedChange={(checked) => handleDenyChange(school.id, checked === true)}
                        disabled={
                          updatingSchools[school.id] || school.is_approved === true || school.is_denied === true
                        }
                      />
                      <label htmlFor={`deny-${school.id}`} className="text-sm font-medium">
                        Deny
                      </label>
                    </div>
                    <Button
                      onClick={() => handleSubmit(school)}
                      disabled={
                        updatingSchools[school.id] ||
                        (selectedSchools[school.id]?.approved === (school.is_approved === true) &&
                          selectedSchools[school.id]?.denied === (school.is_denied === true)) ||
                        school.is_approved === true ||
                        school.is_denied === true
                      }
                    >
                      {updatingSchools[school.id] ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                      {updatingSchools[school.id] ? "Updating..." : "Update Status"}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}

