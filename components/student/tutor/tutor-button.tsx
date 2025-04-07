import { Book } from "lucide-react"

export default function TutorButton() {
  return (
    <button className="flex items-center bg-pink-500 text-white p-2 rounded-md hover:bg-pink-600 transition-colors">
      <div className="bg-pink-400 p-1 rounded-md mr-2">
        <Book size={20} className="text-white" />
      </div>
      <span className="font-bold">TUTOR</span>
    </button>
  )
}

