import { AlertCircle, Bell } from "lucide-react";

export function AIAssistance() {
  return (
    <div className="flex flex-col pl-4 sm:pl-16">
      <h2 className="text-xl font-semibold">AI Teacher Assistance</h2>
      <div className="flex flex-col pl-1 gap-4 mt-4">
        <div className="flex gap-4">
          <AlertCircle className="h-6 w-6 text-blue-500" />
          <div>
            Students who need you to{" "}
            <span className="font-bold opacity-80">contact their parents</span>
            <ul className="list-none pl-6">
              <li className="flex gap-2 items-center font-bold opacity-80">
                <label>Martha Roe</label>
              </li>
              <li className="flex gap-2 items-center font-bold opacity-80">
                <label>John Smith</label>
              </li>
            </ul>
          </div>
        </div>

        <div className="flex gap-4">
          <Bell className="h-6 w-6 text-blue-500" />
          <div>
            Remember that tomorrow{" "}
            <span className="font-bold opacity-80">Class 5 - Math has an exam</span>
          </div>
        </div>

        <div className="flex gap-4">
          <Bell className="h-6 w-6 text-blue-500" />
          <div>
            Remember that tomorrow{" "}
            <span className="font-bold opacity-80">Class 5 - Sci has an exam</span>
          </div>
        </div>
      </div>
    </div>
  );
}