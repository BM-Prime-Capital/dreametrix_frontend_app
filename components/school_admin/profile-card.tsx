import type React from "react"
import { Card } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
interface ProfileCardProps {
  userData?: {
    username?: string
    email?: string
    role?: string
  }
  tenantData?: {
    name?: string
  }
}

const ProfileCard: React.FC<ProfileCardProps> = ({ userData, tenantData }) => {
  return (
    <Card className="p-6 rounded-xl shadow-md bg-white px-24">
      <div className="space-y-6">
        <h2 className="text-xl font-medium text-gray-700">Profile</h2>

        <div className="flex flex-col sm:flex-row items-start gap-6 mb-8">
          <div className="relative">
            <div className="rounded-full overflow-hidden w-24 h-24 border border-gray-200">
              <img
                src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=200&h=200&q=80"
                alt="Profile"
                className="w-full h-full object-cover"
              />
            </div>
            <button className="absolute bottom-0 left-1/2 -translate-x-1/2 bg-gray-100 text-gray-600 text-xs py-1 px-3 rounded-full border border-gray-300">
              Change
            </button>
          </div>

          <h3 className="text-xl font-medium text-gray-600 mt-2">{userData?.username || "School Leader/Principal"}</h3>
        </div>

        <div className="grid gap-6">
          <div className="grid sm:grid-cols-2 gap-6">
            <div>
              <label className="text-sm text-gray-500 mb-1 block" htmlFor="username">
                Username
              </label>
              <Input
                id="username"
                value={userData?.username || "School Name"}
                className="bg-gray-100 rounded-full border-gray-200 text-gray-600"
                readOnly
              />
            </div>
            <div>
              <label className="text-sm text-gray-500 mb-1 block" htmlFor="email">
                Email
              </label>
              <Input
                id="email"
                value={userData?.email || "sarah@school.edu"}
                className="bg-gray-100 rounded-full border-gray-200 text-gray-600"
                readOnly
              />
            </div>
          </div>

          <div className="grid sm:grid-cols-2 gap-6">
            <div>
              <label className="text-sm text-gray-500 mb-1 block" htmlFor="school">
                School
              </label>
              <Input
                id="school"
                value={tenantData?.name || "School1"}
                className="bg-gray-100 rounded-full border-gray-200 text-gray-600"
                readOnly
              />
            </div>
            <div>
              <label className="text-sm text-gray-500 mb-1 block" htmlFor="role">
                Role
              </label>
              <Input
                id="role"
                value={userData?.role || "Principal"}
                className="bg-gray-100 rounded-full border-gray-200 text-gray-600"
                readOnly
              />
            </div>
          </div>

          <div className="flex flex-col items-center gap-3 mt-4">
            <Button className="w-full bg-[#25AAE1] rounded-full py-6 text-base font-medium">
              UPDATE PROFILE
            </Button>
            <Button variant="ghost" className="text-gray-500 hover:text-gray-700 hover:bg-transparent">
              Cancel
            </Button>
          </div>
        </div>
      </div>
    </Card>
  )
}

export default ProfileCard

