"use client"

import { useState } from "react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Calendar, Download, Printer, Eye, X, ArrowLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent } from "@/components/ui/dialog"

interface LibraryItem {
  id: number
  subject: string
  title: string
  class: string
  time?: string
  content?: string
}

const libraryItems: LibraryItem[] = [
  {
    id: 1,
    subject: "Mathematics",
    title: "Advanced Algebra",
    class: "Class 5 - Math",
    time: "2 hours",
    content: "What is Better?"
  },
  {
    id: 2,
    subject: "Science",
    title: "Physics Fundamentals",
    class: "Class 5 - Science",
    time: "1.5 hours",
    content: "Understanding the basics of physics"
  },
  {
    id: 3,
    subject: "English",
    title: "Literature Analysis",
    class: "Class 5 - English",
    time: "1 hour",
    content: "Analyzing classic literature"
  },
  {
    id: 4,
    subject: "History",
    title: "World History",
    class: "Class 5 - History",
    time: "2.5 hours",
    content: "Exploring world civilizations"
  }
]

export default function LibraryPage() {
  const [selectedClass, setSelectedClass] = useState<string>("all-classes")
  const [isContentDialogOpen, setIsContentDialogOpen] = useState(false)
  const [isPrintDialogOpen, setIsPrintDialogOpen] = useState(false)
  const [selectedItem, setSelectedItem] = useState<LibraryItem | null>(null)

  const handleViewContent = (item: LibraryItem) => {
    setSelectedItem(item)
    setIsContentDialogOpen(true)
  }

  const filteredItems = selectedClass === "all-classes" 
    ? libraryItems 
    : libraryItems.filter(item => item.class.toLowerCase().includes(selectedClass.replace("class-5-", "")))

  return (
    <div className="flex flex-col gap-6 w-full min-h-screen">
      {/* Header avec gradient moderne */}
      <div className="bg-gradient-to-r from-[#25AAE1] via-[#25AAE1] to-[#1D8CB3] p-8 rounded-2xl shadow-xl">
        <div className="flex items-center gap-4 text-white">
          <Button
            variant="ghost"
            size="sm"
            className="text-white hover:bg-white/20 p-3 rounded-full transition-all duration-200"
            onClick={() => window.history.back()}
          >
            <ArrowLeft className="h-6 w-6" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold text-white tracking-wide mb-1">
              LIBRARY
            </h1>
            <p className="text-white/80 text-sm">Access digital learning resources</p>
          </div>
        </div>
      </div>

      <section className="flex flex-col gap-6 w-full mx-auto p-6 bg-gradient-to-br from-blue-50 via-white to-blue-100 min-h-screen rounded-2xl">
        {/* Header Section avec design moderne */}
        <div className="flex items-center justify-between bg-white p-6 rounded-2xl shadow-lg border border-gray-100">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gradient-to-r from-[#25AAE1] to-[#1D8CB3] rounded-xl flex items-center justify-center">
              <svg className="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            <div>
              <h2 className="text-xl font-bold text-[#25AAE1]">Digital Resources</h2>
              <p className="text-gray-600 text-sm">Browse and access learning materials</p>
            </div>
          </div>
          
          <div className="flex gap-4">
            {/* <button
              className="bg-white border-2 border-[#25AAE1] rounded-xl px-6 py-3 flex items-center gap-3 hover:bg-[#25AAE1] hover:text-white transition-all duration-300 shadow-md"
              onClick={() => setIsPrintDialogOpen(true)}
              title="Calendar"
            >
              <Calendar className="h-5 w-5 text-[#25AAE1] hover:text-white transition-colors" />
            </button> */}

            <Select value={selectedClass} onValueChange={setSelectedClass}>
              <SelectTrigger className="w-[200px] bg-white border-2 border-[#25AAE1] rounded-xl shadow-md">
                <SelectValue placeholder="All Classes" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all-classes">All Classes</SelectItem>
                <SelectItem value="class-5-math">Class 5 - Math</SelectItem>
                <SelectItem value="class-5-sci">Class 5 - Science</SelectItem>
                <SelectItem value="class-5-eng">Class 5 - English</SelectItem>
                <SelectItem value="class-5-his">Class 5 - History</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Table avec design moderne */}
        <div className="bg-white rounded-2xl shadow-xl p-0 overflow-hidden border-0">
          <div className="bg-gradient-to-r from-[#25AAE1] to-[#1D8CB3] p-4">
            <h2 className="text-white font-bold text-lg">Digital Resources</h2>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b bg-gray-50">
                  <th className="text-left p-4 font-bold text-gray-700">SUBJECT</th>
                  <th className="text-left p-4 font-bold text-gray-700">TITLE</th>
                  <th className="text-left p-4 font-bold text-gray-700">CLASS</th>
                  <th className="text-left p-4 font-bold text-gray-700">DURATION</th>
                  <th className="text-left p-4 font-bold text-gray-700">ACTIONS</th>
                </tr>
              </thead>
              <tbody>
                {filteredItems.map((item, index) => (
                  <tr key={item.id} className={`${index % 2 === 0 ? "bg-blue-50/50" : "bg-white"} hover:bg-blue-100/50 transition-colors`}>
                    <td className="p-4 text-gray-600 font-medium">{item.subject}</td>
                    <td className="p-4 text-gray-700 font-semibold">{item.title}</td>
                    <td className="p-4 text-gray-600 font-medium">{item.class}</td>
                    <td className="p-4 text-gray-600 font-medium">
                      {item.time && <span className="text-[#25AAE1] font-medium">{item.time}</span>}
                    </td>
                    <td className="p-4">
                      <button 
                        className="text-[#25AAE1] hover:text-[#1D8CB3] hover:scale-110 transition-all duration-200" 
                        onClick={() => handleViewContent(item)}
                        title="View Content"
                      >
                        <Eye className="h-5 w-5" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Content Dialog */}
        <Dialog open={isContentDialogOpen} onOpenChange={setIsContentDialogOpen}>
          <DialogContent className="sm:max-w-[600px] p-0">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-medium text-gray-700">{selectedItem?.title || "What is Better?"}</h2>
                <button onClick={() => setIsContentDialogOpen(false)} className="text-gray-500 hover:text-gray-700" title="Close">
                  <X size={18} />
                </button>
              </div>

              <div className="border-t mb-4"></div>

              <div className="text-gray-500 mb-4">{selectedItem?.class || "Class 5 - Math"}</div>

              <div className="bg-white border rounded-xl p-6 min-h-[300px] flex flex-col justify-center shadow-inner">
                <div className="space-y-4">
                  <div className="h-4 bg-gray-200 rounded w-1/3"></div>
                  <div className="h-4 bg-gray-200 rounded w-2/3"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                </div>
              </div>

              <div className="flex justify-between items-center mt-6">
                <div className="flex gap-2">
                  <button className="text-[#D15A9D] hover:text-[#B066F2] hover:scale-110 transition-all duration-200" title="Download">
                    <Download className="h-5 w-5" />
                  </button>
                  {/* <button className="text-[#25AAE1] hover:text-[#1D8CB3] hover:scale-110 transition-all duration-200" title="Print">
                    <Printer className="h-5 w-5" />
                  </button> */}
                </div>
                <div className="flex justify-center items-center gap-2 mt-4 text-sm text-gray-500">
                  <span>Page 1 of 1</span>
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Print Dialog */}
        <Dialog open={isPrintDialogOpen} onOpenChange={setIsPrintDialogOpen}>
          <DialogContent className="sm:max-w-[400px] p-0">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-medium text-gray-700">Print</h2>
                <button onClick={() => setIsPrintDialogOpen(false)} className="text-gray-500 hover:text-gray-700" title="Close">
                  <X size={18} />
                </button>
              </div>

              <div className="border-t mb-6"></div>

              <div className="space-y-4">
                <Select defaultValue="class-5-math">
                  <SelectTrigger className="w-full rounded-xl">
                    <SelectValue placeholder="Class 5 - Math" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="class-5-math">Class 5 - Math</SelectItem>
                    <SelectItem value="class-5-sci">Class 5 - Science</SelectItem>
                    <SelectItem value="class-5-eng">Class 5 - English</SelectItem>
                    <SelectItem value="class-5-his">Class 5 - History</SelectItem>
                  </SelectContent>
                </Select>

                {/* <Button className="w-full bg-gradient-to-r from-[#25AAE1] to-[#1D8CB3] hover:shadow-lg text-white rounded-xl">PRINT</Button> */}

                <div className="text-center mt-2">
                  <Button variant="ghost" onClick={() => setIsPrintDialogOpen(false)} className="text-gray-500">
                    Cancel
                  </Button>
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </section>
    </div>
  )
}

