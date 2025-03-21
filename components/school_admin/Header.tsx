import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card } from "../../components/ui/card"
import { Settings, Search, Edit2 } from "lucide-react";

interface UserData {
  id: number;
  role: string;
  email: string;
  username: string;
  picture: string;
}

interface TenantData {
  name: string;
  code: string;
  primary_domain: string;
}

interface SchoolAdminHeaderProps {
  userData: UserData | null;
  tenantData: TenantData | null;
}

export default function SchoolAdminHeader({ userData, tenantData }: SchoolAdminHeaderProps) {
  return (
    <Card className="p-4 sm:p-6">
      <div className="flex flex-col sm:flex-row items-center gap-8 mb-6 pl-0 sm:pl-16">
        <Avatar className="h-16 w-16">
          <AvatarImage src={userData?.picture || "/placeholder.svg"} alt="School Leader" />
          <AvatarFallback>{userData?.username?.slice(0, 2).toUpperCase() || "SL"}</AvatarFallback>
        </Avatar>
        <div className="text-center sm:text-left">
          <h2 className="text-xl font-semibold">{userData?.username || "School Leader"}</h2>
          <p className="text-sm text-gray-600 mb-2">{tenantData?.name || "School Name"}</p>
          <div className="flex gap-4 justify-center sm:justify-start">
            <Settings className="h-6 w-6 text-blue-500 cursor-pointer hover:text-blue-600" />
            <Search className="h-6 w-6 text-blue-500 cursor-pointer hover:text-blue-600" />
            <Edit2 className="h-6 w-6 text-blue-500 cursor-pointer hover:text-blue-600" />
          </div>
        </div>
      </div>
    </Card>
  );
}