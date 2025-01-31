"use client"

import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Menu } from "lucide-react"
import DreaMetrixLogo from "./ui/dreametrix-logo"
import { userPath } from "@/constants/userConstants"

const schools = [{ id: "35948177", name: "Nehemie School" }]

function MobileNav() {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="md:hidden">
          <Menu className="h-6 w-6" />
        </Button>
      </SheetTrigger>
      <SheetContent side="right" className="w-[300px] sm:w-[400px]">
        <nav className="flex flex-col gap-4">
          <Link href="/" className="text-lg font-medium hover:text-gray-900">
            Home
          </Link>
          <Link href="/administrators" className="text-lg font-medium hover:text-gray-900">
            Administrators
          </Link>
          <Link href="/teachers" className="text-lg font-medium hover:text-gray-900">
            Teachers
          </Link>
          <Link href="/families" className="text-lg font-medium hover:text-gray-900">
            Families
          </Link>
          <Link href="/about" className="text-lg font-medium hover:text-gray-900">
            About Us
          </Link>
          <Link href="/contact" className="text-lg font-medium hover:text-gray-900">
            Contact
          </Link>
        </nav>
      </SheetContent>
    </Sheet>
  )
}

function SchoolSelector() {
  const router = useRouter()
  const [open, setOpen] = useState(false)

  const handleSchoolSelect = (schoolId: string) => {
    setOpen(false)
    router.push("/login_as")
  }

  return (
    <div className="relative w-full sm:w-auto">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button className="bg-[#25AAE1] hover:bg-[#1E8BB3] px-8 w-full sm:w-auto text-lg">
            Select Your School here
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-[300px] p-0" align="start">
          <Command>
            <CommandInput placeholder="Search schools..." />
            <CommandList>
              <CommandEmpty>No school found.</CommandEmpty>
              <CommandGroup>
                {schools.map((school) => (
                  <CommandItem key={school.id} onSelect={() => handleSchoolSelect(school.id)}>
                    {school.name} - {school.id}
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  )
}

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col relative">
      {/* Background Image with Overlay */}
      <div
        className="absolute inset-0 z-0"
        style={{
          backgroundImage: "url('/assets/img/school_class.avif')",
          backgroundRepeat: "no-repeat",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        {/* Dark Overlay */}
        <div className="absolute inset-0 bg-black/70" />
      </div>

      {/* Navigation */}
      <nav className="relative z-10 bg-white py-4 px-4 sm:px-6 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <DreaMetrixLogo />
        </div>

        <div className="hidden md:flex items-center gap-4 lg:gap-8">
          <Link href="/" className="text-gray-600 hover:text-gray-900">
            Home
          </Link>
          <Link href="/administrators" className="text-gray-600 hover:text-gray-900">
            Administrators
          </Link>
          <Link href="/teachers" className="text-gray-600 hover:text-gray-900">
            Teachers
          </Link>
          <Link href="/families" className="text-gray-600 hover:text-gray-900">
            Families
          </Link>
          <Link href="/about" className="text-gray-600 hover:text-gray-900">
            About Us
          </Link>
          <Link href="/contact" className="text-gray-600 hover:text-gray-900">
            Contact
          </Link>
        </div>

        <div className="flex items-center gap-2">
          <Button asChild className="bg-[#25AAE1] hover:bg-[#1E8BB3] hidden sm:inline-flex">
            <Link href={`${userPath.SCHOOL_ADMIN_REGISTER_PATH}`}>Register your School here</Link>
          </Button>
          <MobileNav />
        </div>
      </nav>

      {/* Hero Section */}
      <main className="relative z-10 flex-1 flex items-center justify-between p-8 md:p-12 max-w-full mx-auto w-full">
        {/* Left Content */}
        <div className="flex flex-col justify-center gap-8 text-left max-w-xl">
          <div>
            <h1 className="text-5xl sm:text-6xl font-bold mb-4">
              <span className="text-white">Empowering Your</span>
              <span className="text-[#25AAE1] block mt-2">Classrooms</span>
            </h1>
            <p className="text-lg sm:text-xl text-white/90">
              Take control of your teaching with Dreametrix's online class management system. Built for educators, loved
              by students.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4">
            <SchoolSelector />
            <Button asChild className="bg-[#25AAE1] hover:bg-[#1E8BB3] w-full sm:hidden">
              <Link href="/school/auth/register">Register your School here</Link>
            </Button>
          </div>
        </div>

        {/* Right Image */}
        <div className="hidden md:block">
          <div className="relative w-[500px] h-[300px] rounded-lg overflow-hidden shadow-2xl">
            <Image src="/assets/img/school_class2.jpg" alt="Classroom" fill className="object-cover" priority />
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 mt-auto mb-11">
        <div className="bg-white h-[8rem]">
          <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
            <p className="text-sm text-gray-600 text-center mt-5">© 2025 Dreametrix. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

