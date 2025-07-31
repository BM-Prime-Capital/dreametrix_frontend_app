"use client"

import { useState } from "react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Printer, Eye, Calendar, ChevronLeft, ChevronRight, X, Download } from "lucide-react"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"

interface LibraryItem {
  id: number
  subject: string
  class: string
  content: string
  teacher: string
  time?: string
}

const libraryItems: LibraryItem[] = [
  {
    id: 1,
    subject: "Science",
    class: "Class 5 - Sci",
    content: "What is better?",
    teacher: "Eva Parker",
  },
  {
    id: 2,
    subject: "Math",
    class: "Class 5 - Math",
    content: "Select the best",
    teacher: "Eva Parker",
  },
  {
    id: 3,
    subject: "Math",
    class: "Class 6 - Math",
    content: "What do you think",
    teacher: "Sam Burke",
    time: "11:28",
  },
  {
    id: 4,
    subject: "Science",
    class: "Class 7 - Sci",
    content: "What do you think",
    teacher: "Anna Blake",
    time: "11:29",
  },
]

export default function LibraryPage() {
  const [selectedSubject, setSelectedSubject] = useState<string>("all-subjects")
  const [isContentDialogOpen, setIsContentDialogOpen] = useState(false)
  const [isPrintDialogOpen, setIsPrintDialogOpen] = useState(false)
  const [selectedItem, setSelectedItem] = useState<LibraryItem | null>(null)
  const [currentPage, setCurrentPage] = useState(1)
  const totalPages = 4

  const handleViewContent = (item: LibraryItem) => {
    setSelectedItem(item)
    setIsContentDialogOpen(true)
  }

  const handlePrint = () => {
    setIsPrintDialogOpen(true)
  }

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1)
    }
  }

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1)
    }
  }

  return (
    <section className="flex flex-col gap-4 w-full mx-auto p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <h1 className="text-warning text-xl font-bold">LIBRARY</h1>
          <div className="bg-primary text-white p-3 rounded-md w-16 h-16 flex items-center justify-center">
            <svg
              width="32"
              height="32"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="text-white"
            >
              <path
                d="M4 19.5V4.5C4 3.67157 4.67157 3 5.5 3H18.5C19.3284 3 20 3.67157 20 4.5V19.5C20 20.3284 19.3284 21 18.5 21H5.5C4.67157 21 4 20.3284 4 19.5Z"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path d="M8 7H16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M8 11H16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M8 15H12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M6 19H18" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
        </div>
        <div className="flex gap-4">
          <button
            className="bg-card border border-border rounded-md p-2 w-10 h-10 flex items-center justify-center hover:bg-accent/5 transition-colors"
            onClick={handlePrint}
            title="Calendar"
          >
            <Calendar className="h-5 w-5 text-muted-foreground" />
          </button>

          <Select value={selectedSubject} onValueChange={setSelectedSubject}>
            <SelectTrigger className="w-[180px] bg-card border-border">
              <SelectValue placeholder="All Subjects" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all-subjects">All Subjects</SelectItem>
              <SelectItem value="subjects-n-1">Subjects N</SelectItem>
              <SelectItem value="subjects-n-2">Subjects N</SelectItem>
              <SelectItem value="subjects-n-3">Subjects N</SelectItem>
              <SelectItem value="subjects-n-4">Subjects N</SelectItem>
              <SelectItem value="subjects-n-5">Subjects N</SelectItem>
              <SelectItem value="subjects-n-6">Subjects N</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="bg-card rounded-lg shadow-sm overflow-hidden border">
        <table className="w-full">
          <thead>
            <tr className="border-b">
              <th className="text-left p-4 font-bold text-foreground">SUBJECT</th>
              <th className="text-left p-4 font-bold text-foreground">CLASS</th>
              <th className="text-left p-4 font-bold text-foreground">CONTENT</th>
              <th className="text-left p-4 font-bold text-foreground">TEACHER</th>
            </tr>
          </thead>
          <tbody>
            {libraryItems.map((item, index) => (
              <tr key={item.id} className={index % 2 === 0 ? "bg-accent/5" : "bg-card"}>
                <td className="p-4 text-muted-foreground">{item.subject}</td>
                <td className="p-4 text-muted-foreground">{item.class}</td>
                <td className="p-4 text-muted-foreground">
                  <div className="flex items-center">
                    {item.content}
                    <button className="ml-2 text-primary" onClick={() => handleViewContent(item)} title="View Content">
                      <Eye className="h-5 w-5" />
                    </button>
                  </div>
                </td>
                <td className="p-4 text-muted-foreground">
                  <div className="flex items-center">
                    {item.teacher}
                    <MessageIcon />
                    {item.time && <span className="ml-2 text-sm text-primary">{item.time}</span>}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Content View Dialog */}
      <Dialog open={isContentDialogOpen} onOpenChange={setIsContentDialogOpen}>
        <DialogContent className="sm:max-w-[450px] p-0 overflow-hidden">
          <div className="p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-medium text-foreground">{selectedItem?.content || "What is Better?"}</h2>
              <Button variant="ghost" size="icon" onClick={() => setIsContentDialogOpen(false)} className="h-6 w-6">
                <X className="h-4 w-4" />
              </Button>
            </div>

            <div className="text-muted-foreground mb-4">{selectedItem?.class || "Class 5 - Math"}</div>

            <div className="bg-card border rounded-md p-6 min-h-[300px] flex flex-col justify-center">
              <div className="space-y-3">
                <div className="h-4 bg-muted rounded w-1/3"></div>
                <div className="h-4 bg-muted rounded w-1/2"></div>
                <div className="h-4 bg-muted rounded w-full"></div>
                <div className="h-4 bg-muted rounded w-full"></div>
                <div className="h-4 bg-muted rounded w-full"></div>
                <div className="h-4 bg-muted rounded w-full"></div>
                <div className="h-4 bg-muted rounded w-full"></div>
                <div className="h-4 bg-muted rounded w-3/4"></div>
              </div>
            </div>

            <div className="flex justify-center mt-6 gap-8">
              <button className="text-secondary">
                <Download className="h-6 w-6" />
              </button>
              <button className="text-primary">
                <Printer className="h-6 w-6" />
              </button>
            </div>

            <div className="flex justify-center items-center gap-2 mt-4 text-sm text-muted-foreground">
              <button onClick={handlePrevPage}>
                <ChevronLeft className="h-4 w-4" />
              </button>
              <span>
                {currentPage}/{totalPages}
              </span>
              <button onClick={handleNextPage}>
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Print Dialog */}
      <Dialog open={isPrintDialogOpen} onOpenChange={setIsPrintDialogOpen}>
        <DialogContent className="sm:max-w-[400px] p-0 overflow-hidden">
          <div className="p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-medium text-foreground">Print</h2>
              <Button variant="ghost" size="icon" onClick={() => setIsPrintDialogOpen(false)} className="h-6 w-6">
                <X className="h-4 w-4" />
              </Button>
            </div>

            <div className="border-t mb-6"></div>

            <div className="space-y-4">
              <Select defaultValue="class-5-math">
                <SelectTrigger className="w-full rounded-full">
                  <SelectValue placeholder="Class 5 - Math" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="class-5-math">Class 5 - Math</SelectItem>
                  <SelectItem value="class-5-sci">Class 5 - Sci</SelectItem>
                  <SelectItem value="class-6-math">Class 6 - Math</SelectItem>
                  <SelectItem value="class-7-sci">Class 7 - Sci</SelectItem>
                </SelectContent>
              </Select>

              <Select defaultValue="content">
                <SelectTrigger className="w-full rounded-full">
                  <SelectValue placeholder="Content" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="content">Content</SelectItem>
                  <SelectItem value="what-is-better">What is Better?</SelectItem>
                  <SelectItem value="select-the-best">Select the best</SelectItem>
                  <SelectItem value="what-do-you-think">What do you think</SelectItem>
                </SelectContent>
              </Select>

              <Button className="w-full bg-primary hover:bg-primary-hover text-white rounded-md">PRINT</Button>

              <div className="text-center mt-2">
                <Button variant="ghost" onClick={() => setIsPrintDialogOpen(false)} className="text-muted-foreground">
                  Cancel
                </Button>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </section>
  )
}

function MessageIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="text-primary ml-2"
    >
      <path d="M22 2L11 13" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
      <path
        d="M22 2L15 22L11 13L2 9L22 2Z"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

