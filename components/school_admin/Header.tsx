import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card } from "@/components/ui/card"
import { Edit2, Search, Settings } from "lucide-react"

export default function SchoolAdminHeader() {
  return (
    <Card className="p-6">
      <div className="flex items-start gap-6">
        <Avatar className="h-16 w-16">
          <AvatarImage
            src="https://unsplash.com/fr/photos/echelle-de-gris-du-visage-de-lhomme-9QDpFd0j5o0"
            alt="School Leader"
          />
          <AvatarFallback>SL</AvatarFallback>
        </Avatar>
        <div className="flex flex-col gap-2">
          <h2 className="text-xl font-semibold text-gray-800">School Leader/Principal</h2>
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

