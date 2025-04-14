"use client"

import { useState } from "react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Eye, Pencil, Trash2, Check } from "lucide-react"
import { Button } from "@/components/ui/button"
import CrossCloseButton from "@/components/ui/cross-close-button"

export default function ClassStudent() {
  const [isChecked, setIsChecked] = useState(false)

  return (
    <div className="flex items-center justify-between gap-4 p-4 border-b">
      <div className="flex items-center gap-2">
        <Avatar className="h-12 w-12">
          <AvatarImage src="/placeholder.svg" />
          <AvatarFallback>SL</AvatarFallback>
        </Avatar>
        <label className={`text-gray-700 ${isChecked ? "bg-gray-100 p-2 rounded-full" : ""}`}>Student name</label>
        <label className={`text-gray-700 ${isChecked ? "bg-gray-100 p-2 rounded-full" : ""}`}>ID 0366ANH55</label>
      </div>

      <div className="flex items-center gap-2">
        {isChecked ? (
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <Check className="h-5 w-5 text-green-500" />
          </Button>
        ) : (
          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => setIsChecked(true)}>
            <Pencil className="h-4 w-4 text-green-500" />
          </Button>
        )}

        {isChecked ? (
          <Button variant="ghost" size="icon" className="h-8 w-8 relative" onClick={() => setIsChecked(false)}>
            <CrossCloseButton className="h-4 w-4 text-red-500 absolute top-1" callBack={() => console.log("closed")} />
          </Button>
        ) : (
          <Button variant="ghost" size="icon" className="h-8 w-8">
            <Trash2 className="h-4 w-4 text-red-500" />
          </Button>
        )}

        <Button variant="ghost" size="icon" className="h-8 w-8 hover:bg-blue-50">
          <Eye className="h-4 w-4 text-[#25AAE1]" />
        </Button>
      </div>
    </div>
  )
}

