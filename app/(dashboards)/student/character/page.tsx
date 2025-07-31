"use client"

import { useState } from "react"
import { FileText, Printer, MessageCircle, HistoryIcon, X, Download } from "lucide-react"
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
    <div className="flex flex-col gap-4 w-full mx-auto p-4">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-secondary text-xl font-bold">CHARACTER</h1>
        <div className="flex gap-3">
          <Button
            className="bg-secondary hover:bg-secondary-hover text-white flex items-center gap-2 px-6"
            onClick={handleOpenReport}
          >
            <FileText size={18} />
            <span>Report</span>
          </Button>
          <Button
            variant="outline"
            className="bg-primary hover:bg-primary-hover text-white border-none"
            onClick={handleOpenPrint}
          >
            <Printer size={18} />
          </Button>
          <div className="relative">
            <Select value={selectedClass} onValueChange={setSelectedClass}>
              <SelectTrigger className="w-[180px] bg-card border-border">
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

      <div className="bg-card rounded-lg shadow-sm overflow-hidden border">
        <div className="grid grid-cols-5 border-b">
          <div className="p-4 font-bold text-foreground">CLASS</div>
          <div className="p-4 font-bold text-foreground">CHARACTER</div>
          <div className="p-4 font-bold text-foreground">STATISTICS</div>
          <div className="p-4 font-bold text-foreground">COMMENTS</div>
          <div className="p-4 font-bold text-foreground">HISTORY</div>
        </div>

        {characterData.map((item, index) => (
          <div key={item.id} className={`grid grid-cols-5 ${index % 2 === 0 ? "bg-accent/5" : "bg-card"}`}>
            <div className="p-4 text-muted-foreground">{item.className}</div>
            <div className="p-4 flex items-center gap-3">
              <span className="text-primary font-medium">{item.positiveScore}</span>
              <span className="text-muted-foreground">/</span>
              <span className="text-destructive font-medium">{item.negativeScore}</span>
            </div>
            <div className="p-4 flex items-center">
              <div className="w-full h-2 rounded-full overflow-hidden bg-muted">
                <div
                  className="h-full bg-gradient-to-r from-success to-destructive"
                  style={{
                    width: `${(item.positiveScore / (item.positiveScore + item.negativeScore)) * 100}%`,
                  }}
                ></div>
              </div>
            </div>
            <div className="p-4">
              <button className="text-primary hover:text-primary-hover" onClick={() => handleOpenComments(item)} title="View Comments">
                <MessageCircle className="h-5 w-5" />
              </button>
            </div>
            <div className="p-4 flex items-center justify-between">
              <button className="text-primary hover:text-primary-hover" onClick={() => handleOpenHistory(item)} title="View History">
                <HistoryIcon className="h-5 w-5" />
              </button>
              <div className="flex items-center text-muted-foreground">
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
              <h2 className="text-xl font-medium text-foreground">Comments</h2>
              <button onClick={() => setIsCommentsOpen(false)} className="text-muted-foreground hover:text-foreground" title="Close">
                <X size={18} />
              </button>
            </div>

            <div className="border-t mb-4"></div>

            <div className="text-muted-foreground mb-4">{selectedItem?.className || "Class 5 - Sci"}</div>

            <div className="space-y-4 max-h-[400px] overflow-y-auto">
              {commentsData.map((comment) => (
                <div key={comment.id} className="flex gap-3">
                  <div
                    className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-white ${
                      comment.type === "positive" ? "bg-success" : "bg-destructive"
                    }`}
                  >
                    {comment.type === "positive" ? "+" : "-"}
                  </div>
                  <div className="flex-1">
                    <div className="text-muted-foreground text-sm">{comment.date}</div>
                    <div className="text-foreground">{comment.text}</div>
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
              <h2 className="text-xl font-medium text-foreground">History</h2>
              <button onClick={() => setIsHistoryOpen(false)} className="text-muted-foreground hover:text-foreground">
                <X size={18} />
              </button>
            </div>

            <div className="border-t mb-4"></div>

            <div className="text-muted-foreground mb-4">{selectedItem?.className || "Class 5 - Sci"}</div>

            <div className="space-y-4 max-h-[400px] overflow-y-auto">
              {commentsData.map((comment) => (
                <div key={comment.id} className="flex gap-3">
                  <div
                    className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-white ${
                      comment.type === "positive" ? "bg-success" : "bg-destructive"
                    }`}
                  >
                    {comment.type === "positive" ? "+" : "-"}
                  </div>
                  <div className="flex-1">
                    <div className="text-muted-foreground text-sm">{comment.date}</div>
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
              <h2 className="text-xl font-medium text-foreground">Report</h2>
              <button onClick={() => setIsReportOpen(false)} className="text-muted-foreground hover:text-foreground">
                <X size={18} />
              </button>
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
                  <SelectItem value="class-5-bio">Class 5 - Bio</SelectItem>
                  <SelectItem value="class-5-lit">Class 5 - Lit</SelectItem>
                </SelectContent>
              </Select>

              <Button className="w-full bg-primary hover:bg-primary-hover text-white rounded-md flex items-center justify-center gap-2">
                <Download size={18} />
                <span>SAVE REPORT</span>
              </Button>

              <div className="text-center mt-2">
                <button onClick={() => setIsReportOpen(false)} className="text-muted-foreground hover:text-foreground">
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
              <h2 className="text-xl font-medium text-foreground">Print</h2>
              <button onClick={() => setIsPrintOpen(false)} className="text-muted-foreground hover:text-foreground">
                <X size={18} />
              </button>
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
                  <SelectItem value="class-5-bio">Class 5 - Bio</SelectItem>
                  <SelectItem value="class-5-lit">Class 5 - Lit</SelectItem>
                </SelectContent>
              </Select>

              <Button className="w-full bg-primary hover:bg-primary-hover text-white rounded-md">PRINT</Button>

              <div className="text-center mt-2">
                <button onClick={() => setIsPrintOpen(false)} className="text-muted-foreground hover:text-foreground">
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
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

