"use client";

import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu } from "lucide-react";

const schools = [{ id: "35948177", name: "Nehemie School" }];

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
          <Link
            href="/administrators"
            className="text-lg font-medium hover:text-gray-900"
          >
            Administrators
          </Link>
          <Link
            href="/teachers"
            className="text-lg font-medium hover:text-gray-900"
          >
            Teachers
          </Link>
          <Link
            href="/families"
            className="text-lg font-medium hover:text-gray-900"
          >
            Families
          </Link>
          <Link
            href="/about"
            className="text-lg font-medium hover:text-gray-900"
          >
            About Us
          </Link>
          <Link
            href="/contact"
            className="text-lg font-medium hover:text-gray-900"
          >
            Contact
          </Link>
        </nav>
      </SheetContent>
    </Sheet>
  );
}

function SchoolSelector() {
  const router = useRouter();
  const [open, setOpen] = useState(false);

  const handleSchoolSelect = (schoolId: string) => {
    setOpen(false);
    router.push("/login_as");
  };

  return (
    <div className="relative w-full sm:w-auto">
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <Button className="bg-[#25AAE1] hover:bg-[#1E8BB3] px-8 w-full sm:w-auto">
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
                  <CommandItem
                    key={school.id}
                    onSelect={() => handleSchoolSelect(school.id)}
                  >
                    {school.name} - {school.id}
                  </CommandItem>
                ))}
              </CommandGroup>
            </CommandList>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
  );
}

export default function HomePage() {
  return (
    <div
      className="min-h-screen flex flex-col"
      style={{
        backgroundImage: "url('/assets/img/school_class.avif')",
        backgroundRepeat: "no-repeat",
        backgroundSize: "cover",
        backgroundColor: "rgba(0, 0, 0, 0.5)",
        backgroundBlendMode: "darken",
      }}
    >
      {/* Navigation */}
      <nav className="bg-white py-4 px-4 sm:px-6 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Image
            src="/assets/img/logo.png"
            alt="Dreametrix Logo"
            width={150}
            height={40}
            priority
            className="w-32 sm:w-[150px]"
          />
        </div>

        <div className="hidden md:flex items-center gap-4 lg:gap-8">
          <Link href="/" className="text-gray-600 hover:text-gray-900">
            Home
          </Link>
          <Link
            href="/administrators"
            className="text-gray-600 hover:text-gray-900"
          >
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
          <Button
            asChild
            className="bg-[#25AAE1] hover:bg-[#1E8BB3] hidden sm:inline-flex"
          >
            <Link href="/school/auth/register">Register your School here</Link>
          </Button>
          <MobileNav />
        </div>
      </nav>

      {/* Hero Section */}
      <main className="flex-1 grid md:grid-cols-2 gap-8 p-4 sm:p-6 md:p-12">
        <div className="flex flex-col justify-center gap-6 text-center md:text-left">
          <h1 className="text-4xl sm:text-5xl font-bold">
            <span className="text-white">Empowering Your</span>{" "}
            <span className="text-[#1E8BB3] block mt-2">Classrooms</span>
          </h1>
          <p className="text-base sm:text-lg text-white max-w-md mx-auto md:mx-0">
            Take control of your teaching with Dreametrix's online class
            management system. Built for educators, loved by students.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 mt-4">
            <SchoolSelector />
            <Button
              asChild
              className="bg-[#25AAE1] hover:bg-[#1E8BB3] w-full sm:hidden"
            >
              <Link href="/school/auth/register">
                Register your School here
              </Link>
            </Button>
          </div>
        </div>

        <div className="relative hidden md:block">
          <div className="absolute right-0 top-0 w-full max-w-[24rem] aspect-[3/2] bg-[#25AAE1] rounded-lg overflow-hidden shadow-xl">
            <Image
              src="/assets/img/school_class2.jpg"
              alt="Classroom"
              fill
              className="object-cover"
            />
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="py-4 px-4 sm:px-6 text-center text-white border-t mt-auto">
        <p className="text-sm sm:text-base">
          © 2025 Dreametrix. All rights reserved.
        </p>
      </footer>
    </div>
  );
}
