"use client"

import { useState } from "react"
import { Card } from "@/components/ui/card"
import PageTitleH1 from "@/components/ui/page-title-h1";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"

interface TestPrepProps {
  onStartTest: () => void
}

export default function TestPrep({ onStartTest }: TestPrepProps) {
  const [formData, setFormData] = useState({
    subject: "math", // Default to math for testing
    grade: "1", // Default to grade 1 for testing
    testType: "1", // Default to type 1 for testing
  })

  // Sample data for dropdowns
  const subjectsList = [
    { value: "math", display_name: "Mathematics" },
    { value: "science", display_name: "Science" },
    { value: "english", display_name: "English" },
    { value: "history", display_name: "History" },
  ]

  const gradesList = [
    { value: "1", display_name: "1st Grade" },
    { value: "2", display_name: "2nd Grade" },
    { value: "3", display_name: "3rd Grade" },
    { value: "4", display_name: "4th Grade" },
    { value: "5", display_name: "5th Grade" },
  ]

  const testTypesList = [
    { value: "1", display_name: "Practice Test" },
    { value: "2", display_name: "Final Exam" },
    { value: "3", display_name: "Quick Quiz" },
  ]

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }))
  }

  // Direct click handler for the button
  const handleLaunchTest = () => {
    console.log("Launch test button clicked")
    onStartTest() // Directly call the navigation function
  }

  return (
    <section className="flex flex-col gap-2 w-full">
      <div className="">
        <PageTitleH1 title="TEST PREPARATION" />
        <p className="pl-3">Question Simplar</p>
      </div>
      <div className="flex gap-4 justify-start">
        <div className="px-3 w-full">
          <div className="flex justify-between items-center py-5">
            <div>
              <label className="flex flex-col space-y-1">
                <span className="text-sm text-gray-600">Select question Simplar</span>
                <Select value={formData.subject} onValueChange={(value: string) => handleInputChange("subject", value)}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select a subject" />
                  </SelectTrigger>
                  <SelectContent>
                    {subjectsList.map((subject) => (
                      <SelectItem key={subject.value} value={subject.value}>
                        {subject.display_name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </label>
            </div>
            <div>
              <label className="flex flex-col space-y-1">
                <span className="text-sm text-gray-600">Select Grade</span>
                <Select value={formData.grade} onValueChange={(value: string) => handleInputChange("grade", value)}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select a grade" />
                  </SelectTrigger>
                  <SelectContent>
                    {gradesList.map((grade) => (
                      <SelectItem key={grade.value} value={grade.value}>
                        {grade.display_name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </label>
            </div>
            <div>
              <label className="flex flex-col space-y-1">
                <span className="text-sm text-gray-600">Select Test</span>
                <Select value={formData.testType} onValueChange={(value: string) => handleInputChange("testType", value)}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select a test" />
                  </SelectTrigger>
                  <SelectContent>
                    {testTypesList.map((testType) => (
                      <SelectItem key={testType.value} value={testType.value}>
                        {testType.display_name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </label>
            </div>
          </div>
          <div className="flex justify-center items-center">
            <Button type="button" onClick={handleLaunchTest} className="gap-2 text-base bg-blue-500 hover:bg-blue-600">
              Launch test
            </Button>
          </div>
        </div>
      </div>
      <Card className="rounded-md">
        <div className="w-full flex gap-6 bg-[#fff] p-4 pb-0 pl-0">
          <div className="flex gap-4 pl-4">
            <div className="py-8">
              <h2 className="text-center font-bold">More about Question Simplar</h2>
              <p className="pl-3 text-justify">
                Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et
                dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip
                ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu
                fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia
                deserunt mollit anim id est laborum.
              </p>
            </div>
          </div>
        </div>
      </Card>
    </section>
  )
}

