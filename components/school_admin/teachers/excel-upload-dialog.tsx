'use client'
import { useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "../../ui/dialog"
import { Button } from "../../ui/button"
import { FileUp, Upload } from "lucide-react"
import { Loader } from '../../ui/loader'

export function ExcelUploadDialog() {
  const [isOpen, setIsOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [fileName, setFileName] = useState("")
  const [showSuccess, setShowSuccess] = useState(false)

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setFileName(file.name)
      setIsLoading(true)
      // Simulate file upload
      await new Promise(resolve => setTimeout(resolve, 2000))
      setIsLoading(false)
      setShowSuccess(true)
      // Reset after showing success
      setTimeout(() => {
        setIsOpen(false)
        setShowSuccess(false)
        setFileName("")
      }, 2000)
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <Button
        onClick={() => setIsOpen(true)}
        className="bg-blue-600 hover:bg-blue-700"
      >
        <FileUp className="mr-2 h-4 w-4" />
        Add Many New Teachers
      </Button>
      <DialogContent>
        {!isLoading && !showSuccess && (
          <>
            <DialogHeader>
              <DialogTitle>Upload The Excel Sheet to create Teachers</DialogTitle>
              <DialogDescription className="mt-4">
                <div className="space-y-4">
                  <p>Your Excel sheet must adhere to the specified column titles; otherwise, the process will fail!</p>
                  <div>
                    <p className="font-medium">The required column titles are as follows:</p>
                    <p className="text-sm italic">Firstname, Lastname, Middlename, Email address, Phone, and Type.</p>
                  </div>
                  <p>
                    For the <span className="font-medium">&quot;Type&quot;</span> column, the entry must be{" "}
                    <span className="font-medium">teacher</span> everywhere.
                  </p>
                </div>
              </DialogDescription>
            </DialogHeader>
            <div className="mt-4">
              <label
                htmlFor="excel-upload"
                className="flex cursor-pointer items-center justify-center gap-2 rounded-md border-2 border-dashed border-slate-300 p-6 hover:border-slate-400"
              >
                <Upload className="h-6 w-6 text-slate-500" />
                <span className="text-sm text-slate-600">
                  {fileName || "Click to upload Excel file"}
                </span>
                <input
                  id="excel-upload"
                  type="file"
                  className="hidden"
                  accept=".xlsx,.xls"
                  onChange={handleFileUpload}
                />
              </label>
            </div>
          </>
        )}
        {isLoading && (
          <div className="flex flex-col items-center justify-center py-8">
            <img
              src="https://raw.githubusercontent.com/your-org/your-repo/main/public/logo.png"
              alt="Logo"
              className="mb-4 h-12 w-12"
            />
            <Loader className="text-blue-600" />
            <p className="mt-4 text-sm text-slate-500">Loading...</p>
          </div>
        )}
        {showSuccess && (
          <div className="flex flex-col items-center justify-center py-8">
            <div className="mb-4 h-16 w-16 rounded-full bg-green-500 p-4">
              <svg
                className="h-full w-full text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <h3 className="text-lg font-semibold">Congratulations!!</h3>
            <p className="text-sm text-slate-500">Teachers created 🎉</p>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}