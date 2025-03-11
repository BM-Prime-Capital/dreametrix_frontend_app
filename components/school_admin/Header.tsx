import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card } from "@/components/ui/card"
import { Edit2, Search, Settings } from "lucide-react"

interface UserData {
  id: number
  role: string
  email: string
  username: string
  picture: string
}

interface TenantData {
  name: string
  code: string
  primary_domain: string
}

interface SchoolAdminHeaderProps {
  userData: UserData | null
  tenantData: TenantData | null
}

export default function SchoolAdminHeader({ userData, tenantData }: SchoolAdminHeaderProps) {
  return (
    <Card className="p-6">
      <div className="flex items-start gap-6">
        <Avatar className="h-16 w-16">
          <AvatarImage src={userData?.picture} alt="School Leader" />
          <AvatarFallback>{userData?.username?.slice(0, 2).toUpperCase() || "SL"}</AvatarFallback>
        </Avatar>
        <div className="flex flex-col gap-2">
          <h2 className="text-xl font-semibold text-gray-800">{userData?.username || "School Leader/Principal"}</h2>
          <p className="text-sm text-gray-600">{tenantData?.name || "School Name"}</p>
          <div className="flex gap-4">
            <Settings className="h-5 w-5 text-[#25AAE1] cursor-pointer hover:text-[#1E86B3]" />
            <Search className="h-5 w-5 text-[#25AAE1] cursor-pointer hover:text-[#1E86B3]" />
            <Edit2 className="h-5 w-5 text-[#25AAE1] cursor-pointer hover:text-[#1E86B3]" />
          </div>
        </div>
      </div>
    </Card>
  )
}

