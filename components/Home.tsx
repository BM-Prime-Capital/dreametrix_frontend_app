"use client"

import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Menu, Search, X } from "lucide-react"
import DreaMetrixLogo from "./ui/dreametrix-logo"
import { userPath } from "@/constants/userConstants"

// Mock data - replace with actual API call
const mockSchools = Array.from({ length: 50 }, (_, i) => ({
  id: `school-${i + 1}`,
  name: `School ${i + 1}${i % 3 === 0 ? ' International' : i % 2 === 0 ? ' Academy' : ' High School'}`
}))

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
          <Link href="/" className="text-[#0056b3] hover:text-[#0f60a3] text-lg font-semibold">
            Home
          </Link>
          <Link href="/administrators" className="text-[#0056b3] hover:text-[#0f60a3] text-lg font-semibold">
            Administrators
          </Link>
          <Link href="/teachers" className="text-[#0056b3] hover:text-[#0f60a3] text-lg font-semibold">
            Teachers
          </Link>
          <Link href="/families" className="text-[#0056b3] hover:text-[#0f60a3] text-lg font-semibold">
            Families
          </Link>
          <Link href="/about" className="text-[#0056b3] hover:text-[#0f60a3] text-lg font-semibold">
            About Us
          </Link>
          <Link href="/contact" className="text-[#0056b3] hover:text-[#0f60a3] text-lg font-semibold">
            Contact
          </Link>
        </nav>
      </SheetContent>
    </Sheet>
  )
}

function SchoolSelector() {
  const router = useRouter()
  const [isOpen, setIsOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const schoolsPerPage = 10

  // Filter schools based on search query
  const filteredSchools = mockSchools.filter(school => 
    school.name.toLowerCase().includes(searchQuery.toLowerCase())
  )

  // Calculate pagination
  const totalPages = Math.ceil(filteredSchools.length / schoolsPerPage)
  const startIndex = (currentPage - 1) * schoolsPerPage
  const paginatedSchools = filteredSchools.slice(startIndex, startIndex + schoolsPerPage)

  const handleSchoolSelect = (schoolId: string) => {
    setIsOpen(false)
    router.push("/login_as")
  }

  return (
    <>
      <Button 
        onClick={() => setIsOpen(true)}
        className="w-full sm:w-auto text-xl px-10 py-6 bg-[#29a1e8] hover:bg-[#217bb4] transform transition-all duration-300 hover:-translate-y-1"
      >
        Select Your School here
      </Button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-hidden flex flex-col">
          <DialogHeader>
            <div className="flex items-center justify-between">
              <DialogTitle className="text-2xl font-bold">Select Your School</DialogTitle>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsOpen(false)}
                className="h-8 w-8 p-0"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          </DialogHeader>

          <div className="relative flex items-center mb-4">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <Input
              placeholder="Search schools..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value)
                setCurrentPage(1) // Reset to first page on search
              }}
              className="pl-10"
            />
          </div>

          <div className="flex-1 overflow-y-auto min-h-[300px] border rounded-md">
            {paginatedSchools.length === 0 ? (
              <div className="flex items-center justify-center h-full text-gray-500">
                No schools found
              </div>
            ) : (
              <div className="divide-y">
                {paginatedSchools.map((school) => (
                  <button
                    key={school.id}
                    onClick={() => handleSchoolSelect(school.id)}
                    className="w-full px-4 py-3 text-left hover:bg-gray-100 transition-colors duration-200"
                  >
                    <p className="font-medium text-gray-900">{school.name}</p>
                    <p className="text-sm text-gray-500">ID: {school.id}</p>
                  </button>
                ))}
              </div>
            )}
          </div>

          {totalPages > 1 && (
            <div className="flex items-center justify-between pt-4 border-t">
              <Button
                variant="outline"
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                disabled={currentPage === 1}
              >
                Previous
              </Button>
              <span className="text-sm text-gray-600">
                Page {currentPage} of {totalPages}
              </span>
              <Button
                variant="outline"
                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                disabled={currentPage === totalPages}
              >
                Next
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  )
}

export default function Home() {
  return (
    <div
      className="min-h-screen flex flex-col font-['Roboto']"
      style={{
        background: "linear-gradient(rgba(0, 0, 0, 0.8), rgba(0, 0, 0, 0.3)), url('/assets/images/school_class.avif')",
        backgroundRepeat: "no-repeat",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundAttachment: "fixed",
      }}
    >
      {/* Navigation */}
      <nav className="relative z-10 bg-white/90 py-5 px-12 flex items-center justify-between flex-col md:flex-row gap-4">
        <div className="flex items-center gap-2">
          <DreaMetrixLogo  />
        </div>

        <div className="hidden md:flex items-center gap-4 lg:gap-8">
          <Link href="/" className="text-[#0056b3] hover:text-[#0f60a3] text-sm font-semibold">
            Home
          </Link>
          <Link href="/administrators" className="text-[#0056b3] hover:text-[#0f60a3] text-sm font-semibold">
            Administrators
          </Link>
          <Link href="/teachers" className="text-[#0056b3] hover:text-[#0f60a3] text-sm font-semibold">
            Teachers
          </Link>
          <Link href="/families" className="text-[#0056b3] hover:text-[#0f60a3] text-sm font-semibold">
            Families
          </Link>
          <Link href="/about" className="text-[#0056b3] hover:text-[#0f60a3] text-sm font-semibold">
            About Us
          </Link>
          <Link href="/contact" className="text-[#0056b3] hover:text-[#0f60a3] text-sm font-semibold">
            Contact
          </Link>
        </div>

        <div className="flex items-center gap-2">
          <Button asChild className="bg-[#217bb4] hover:bg-[#0f60a3] text-white font-bold px-5 py-3 hidden sm:inline-flex transition-colors duration-300">
            <Link href={`${userPath.SCHOOL_ADMIN_REGISTER_PATH}`}>Register your School here</Link>
          </Button>
          <MobileNav />
        </div>
      </nav>

      {/* Hero Section */}
      <main className="relative z-10 flex-1 flex items-center justify-between p-8 md:p-12 max-w-full mx-auto w-full">
        {/* Left Content */}
        <div className="flex flex-col justify-center gap-8 text-left max-w-[500px]">
          <div>
            <h1 className="text-5xl md:text-[3.5rem] font-bold mb-5 text-white">
              Empowering Your{" "}
              <span className="text-[#29a1e8] block">Classrooms</span>
            </h1>
            <p className="text-xl md:text-[1.4rem] text-white leading-relaxed">
              Take control of your teaching with Dreametrix's online class management system. Built for educators, loved
              by students.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 mt-6">
            <SchoolSelector />
            <Button asChild className="bg-[#217bb4] hover:bg-[#0f60a3] w-full sm:hidden">
              <Link href="/school/auth/register">Register your School here</Link>
            </Button>
          </div>
        </div>

        {/* Right Image */}
         <div className="relative hidden md:block">
          <div className=" right right-0 top-0">
            <div className="relative w-[25rem] h-[20rem]">
              <Image
                src="/assets/images/school_class2.jpg"
                alt="Classroom"
                fill
                className="object-cover clip-polygon rounded-[20px] border-[5px] border-[#29a1e8] shadow-[0px_10px_30px_rgba(0,0,0,0.3)] hover-scale"
                style={{
                  maxWidth: "650px",
                  clipPath: "polygon(20% 0%, 100% 0%, 100% 80%, 80% 100%, 0% 100%, 0% 20%)",
                }}
              />
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="mt-auto">
        <div className="bg-white/90 py-8">
          <p className="text-gray-800 text-center text-base">
            © 2025 Dreametrix. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  )
}