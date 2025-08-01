"use client"

import { useState } from "react"
import { FileText, Printer, MessageCircle, HistoryIcon, X, Download, ArrowLeft } from "lucide-react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent } from "@/components/ui/dialog"

interface CharacterData {
  id: number
  className: string
  positiveScore: number
  negativeScore: number
  teacher: string
  teacherAvatar?: string
}

interface Comment {
  id: number
  type: "positive" | "negative"
  date: string
  text: string
}

const characterData: CharacterData[] = [
  {
    id: 1,
    className: "Class 5 - Sci",
    positiveScore: 45,
    negativeScore: 5,
    teacher: "Sam Burke",
  },
  {
    id: 2,
    className: "Class 5 - Math",
    positiveScore: 45,
    negativeScore: 5,
    teacher: "Eva Parker",
  },
  {
    id: 3,
    className: "Class 5 - Bio",
    positiveScore: 45,
    negativeScore: 5,
    teacher: "Sam Burke",
  },
  {
    id: 4,
    className: "Class 5 - Lit",
    positiveScore: 45,
    negativeScore: 5,
    teacher: "Anna Blake",
  },
  {
    id: 5,
    className: "Class 5 - Ore",
    positiveScore: 45,
    negativeScore: 5,
    teacher: "Sam Burke",
  },
  {
    id: 6,
    className: "Class 5 - Sca",
    positiveScore: 45,
    negativeScore: 5,
    teacher: "Anna Blake",
  },
  {
    id: 7,
    className: "Class 5 - Phy",
    positiveScore: 45,
    negativeScore: 5,
    teacher: "Eva Parker",
  },
]

const commentsData: Comment[] = [
  {
    id: 1,
    type: "positive",
    date: "11/05",
    text: "You are great! lorem ipsum dolor, lorem ipsum dolor, lorem ipsum dolor, lorem ipsum dolor.",
  },
  {
    id: 2,
    type: "negative",
    date: "11/02",
    text: "I don't like when... lorem ipsum dolor, lorem ipsum dolor, lorem ipsum dolor, lorem ipsum dolor.",
  },
  {
    id: 3,
    type: "positive",
    date: "11/02",
    text: "You are great!",
  },
  {
    id: 4,
    type: "positive",
    date: "11/02",
    text: "You are great!",
  },
  {
    id: 5,
    type: "positive",
    date: "10/30",
    text: "You are great!",
  },
  {
    id: 6,
    type: "positive",
    date: "10/30",
    text: "You are great! lorem ipsum dolor, lorem ipsum dolor, lorem ipsum dolor, lorem ipsum dolor.",
  },
]

export default function CharacterPage() {
  const [selectedClass, setSelectedClass] = useState<string>("all-classes")
  const [selectedItem, setSelectedItem] = useState<CharacterData | null>(null)

  // Modal states
  const [isCommentsOpen, setIsCommentsOpen] = useState(false)
  const [isHistoryOpen, setIsHistoryOpen] = useState(false)
  const [isReportOpen, setIsReportOpen] = useState(false)
  const [isPrintOpen, setIsPrintOpen] = useState(false)

  const handleOpenComments = (item: CharacterData) => {
    setSelectedItem(item)
    setIsCommentsOpen(true)
  }

  const handleOpenHistory = (item: CharacterData) => {
    setSelectedItem(item)
    setIsHistoryOpen(true)
  }

  const handleOpenReport = () => {
    setIsReportOpen(true)
  }

  const handleOpenPrint = () => {
    setIsPrintOpen(true)
  }

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
              CHARACTER
            </h1>
            <p className="text-white/80 text-sm">Track your character development</p>
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-6 w-full mx-auto p-6 bg-gradient-to-br from-blue-50 via-white to-blue-100 min-h-screen rounded-2xl">
        {/* Header Section avec design moderne */}
        <div className="flex items-center justify-between bg-white p-6 rounded-2xl shadow-lg border border-gray-100">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-gradient-to-r from-[#25AAE1] to-[#1D8CB3] rounded-xl flex items-center justify-center">
              <svg className="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <div>
              <h2 className="text-xl font-bold text-[#25AAE1]">Character Assessment</h2>
              <p className="text-gray-600 text-sm">View your character scores and feedback</p>
            </div>
          </div>
          
          <div className="flex gap-3">
            <Button
              className="bg-gradient-to-r from-[#25AAE1] to-[#1D8CB3] hover:shadow-lg hover:scale-105 text-white flex items-center gap-2 px-6 py-3 rounded-xl transition-all duration-300 shadow-md"
              onClick={handleOpenReport}
            >
              <FileText size={18} />
              <span>Report</span>
            </Button>
            <Button
              variant="outline"
              className="bg-gradient-to-r from-[#25AAE1] to-[#1D8CB3] hover:shadow-lg hover:scale-105 text-white border-none px-4 py-3 rounded-xl transition-all duration-300 shadow-md"
              onClick={handleOpenPrint}
            >
              <Printer size={18} />
            </Button>
            <div className="relative">
              <Select value={selectedClass} onValueChange={setSelectedClass}>
                <SelectTrigger className="w-[200px] bg-white border-2 border-[#25AAE1] rounded-xl shadow-md">
                  <SelectValue placeholder="All Classes" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all-classes">All Classes</SelectItem>
                  <SelectItem value="class-5-math">Class 5 - Math</SelectItem>
                  <SelectItem value="class-5-sci">Class 5 - Sci</SelectItem>
                  <SelectItem value="class-n">Class N</SelectItem>
                  <SelectItem value="class-n-1">Class N</SelectItem>
                  <SelectItem value="class-n-2">Class N</SelectItem>
                  <SelectItem value="class-n-3">Class N</SelectItem>
                  <SelectItem value="class-n-4">Class N</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Table avec design moderne */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-100">
          <div className="bg-gradient-to-r from-[#25AAE1] to-[#1D8CB3] p-4">
            <h2 className="text-white font-bold text-lg">Character Assessment</h2>
          </div>
          
          <div className="grid grid-cols-5 border-b bg-gray-50">
            <div className="p-4 font-bold text-gray-700">CLASS</div>
            <div className="p-4 font-bold text-gray-700">CHARACTER</div>
            <div className="p-4 font-bold text-gray-700">STATISTICS</div>
            <div className="p-4 font-bold text-gray-700">COMMENTS</div>
            <div className="p-4 font-bold text-gray-700">HISTORY</div>
          </div>

          {characterData.map((item, index) => (
            <div key={item.id} className={`grid grid-cols-5 ${index % 2 === 0 ? "bg-blue-50/50" : "bg-white"} hover:bg-blue-100/50 transition-colors`}>
              <div className="p-4 text-gray-600 font-medium">{item.className}</div>
              <div className="p-4 flex items-center gap-3">
                <span className="text-[#25AAE1] font-bold text-lg">{item.positiveScore}</span>
                <span className="text-gray-400 text-xl">/</span>
                <span className="text-[#FF5252] font-bold text-lg">{item.negativeScore}</span>
              </div>
              <div className="p-4 flex items-center">
                <div className="w-full h-3 rounded-full overflow-hidden bg-gray-200 shadow-inner">
                  <div
                    className="h-full bg-gradient-to-r from-[#4CAF50] to-[#FF5252] shadow-sm"
                    style={{
                      width: `${(item.positiveScore / (item.positiveScore + item.negativeScore)) * 100}%`,
                    }}
                  ></div>
                </div>
              </div>
              <div className="p-4">
                <button 
                  className="text-[#25AAE1] hover:text-[#1D8CB3] hover:scale-110 transition-all duration-200" 
                  onClick={() => handleOpenComments(item)}
                  title="View Comments"
                >
                  <MessageCircle className="h-6 w-6" />
                </button>
              </div>
              <div className="p-4 flex items-center justify-between">
                <button 
                  className="text-[#25AAE1] hover:text-[#1D8CB3] hover:scale-110 transition-all duration-200" 
                  onClick={() => handleOpenHistory(item)}
                  title="View History"
                >
                  <HistoryIcon className="h-6 w-6" />
                </button>
                <div className="flex items-center text-gray-500">
                  {item.teacher}
                  <MessageIcon />
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Comments Modal */}
        <Dialog open={isCommentsOpen} onOpenChange={setIsCommentsOpen}>
          <DialogContent className="sm:max-w-[500px] p-0">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-medium text-gray-700">Comments</h2>
                <button onClick={() => setIsCommentsOpen(false)} className="text-gray-500 hover:text-gray-700" title="Close">
                  <X size={18} />
                </button>
              </div>

              <div className="border-t mb-4"></div>

              <div className="text-gray-500 mb-4">{selectedItem?.className || "Class 5 - Sci"}</div>

              <div className="space-y-4 max-h-[400px] overflow-y-auto">
                {commentsData.map((comment) => (
                  <div key={comment.id} className="flex gap-3">
                    <div
                      className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center text-white shadow-md ${
                        comment.type === "positive" ? "bg-[#4CAF50]" : "bg-[#FF5252]"
                      }`}
                    >
                      {comment.type === "positive" ? "+" : "-"}
                    </div>
                    <div className="flex-1">
                      <div className="text-gray-500 text-sm font-medium">{comment.date}</div>
                      <div className="text-gray-700">{comment.text}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* History Modal */}
        <Dialog open={isHistoryOpen} onOpenChange={setIsHistoryOpen}>
          <DialogContent className="sm:max-w-[400px] p-0">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-medium text-gray-700">History</h2>
                <button onClick={() => setIsHistoryOpen(false)} className="text-gray-500 hover:text-gray-700" title="Close">
                  <X size={18} />
                </button>
              </div>

              <div className="border-t mb-4"></div>

              <div className="text-gray-500 mb-4">{selectedItem?.className || "Class 5 - Sci"}</div>

              <div className="space-y-4 max-h-[400px] overflow-y-auto">
                {commentsData.map((comment) => (
                  <div key={comment.id} className="flex gap-3">
                    <div
                      className={`flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center text-white shadow-md ${
                        comment.type === "positive" ? "bg-[#4CAF50]" : "bg-[#FF5252]"
                      }`}
                    >
                      {comment.type === "positive" ? "+" : "-"}
                    </div>
                    <div className="flex-1">
                      <div className="text-gray-500 text-sm font-medium">{comment.date}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Report Modal */}
        <Dialog open={isReportOpen} onOpenChange={setIsReportOpen}>
          <DialogContent className="sm:max-w-[400px] p-0">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-medium text-gray-700">Report</h2>
                <button onClick={() => setIsReportOpen(false)} className="text-gray-500 hover:text-gray-700" title="Close">
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
                    <SelectItem value="class-5-sci">Class 5 - Sci</SelectItem>
                    <SelectItem value="class-5-bio">Class 5 - Bio</SelectItem>
                    <SelectItem value="class-5-lit">Class 5 - Lit</SelectItem>
                  </SelectContent>
                </Select>

                <Button className="w-full bg-gradient-to-r from-[#25AAE1] to-[#1D8CB3] hover:shadow-lg text-white rounded-xl flex items-center justify-center gap-2 py-3">
                  <Download size={18} />
                  <span>SAVE REPORT</span>
                </Button>

                <div className="text-center mt-2">
                  <button onClick={() => setIsReportOpen(false)} className="text-gray-500 hover:text-gray-700">
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>

        {/* Print Modal */}
        <Dialog open={isPrintOpen} onOpenChange={setIsPrintOpen}>
          <DialogContent className="sm:max-w-[400px] p-0">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-medium text-gray-700">Print</h2>
                <button onClick={() => setIsPrintOpen(false)} className="text-gray-500 hover:text-gray-700" title="Close">
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
                    <SelectItem value="class-5-sci">Class 5 - Sci</SelectItem>
                    <SelectItem value="class-5-bio">Class 5 - Bio</SelectItem>
                    <SelectItem value="class-5-lit">Class 5 - Lit</SelectItem>
                  </SelectContent>
                </Select>

                <Button className="w-full bg-gradient-to-r from-[#25AAE1] to-[#1D8CB3] hover:shadow-lg text-white rounded-xl">PRINT</Button>

                <div className="text-center mt-2">
                  <button onClick={() => setIsPrintOpen(false)} className="text-gray-500 hover:text-gray-700">
                    Cancel
                  </button>
                </div>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>
    </div>
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
      className="text-[#25AAE1] ml-2"
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

