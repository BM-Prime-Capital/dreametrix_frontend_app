import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import { AlertCircle, Bell } from "lucide-react"

export function AIAssistance() {
  return (
    <div className="space-y-4">
      <h2 className="font-semibold">AI Teacher Assistance</h2>
      <Alert className="bg-sky-50 border-sky-100">
        <AlertCircle className="h-4 w-4 shrink-0" />
        <div>
          <AlertTitle>Contact Required</AlertTitle>
          <AlertDescription>
            Students who need you to contact their parents:
            <ul className="mt-2 ml-4 space-y-1">
              <li className="text-sm">Martha Roe</li>
              <li className="text-sm">John Smith</li>
            </ul>
          </AlertDescription>
        </div>
      </Alert>
      <Alert className="bg-sky-50 border-sky-100">
        <Bell className="h-4 w-4 shrink-0" />
        <div>
          <AlertTitle>Upcoming Exams</AlertTitle>
          <AlertDescription>
            <ul className="ml-4 space-y-1">
              <li className="text-sm">Remember that tomorrow Class 5 - Math has an exam</li>
              <li className="text-sm">Remember that tomorrow Class 5 - Sci has an exam</li>
            </ul>
          </AlertDescription>
        </div>
      </Alert>
    </div>
  )
}

