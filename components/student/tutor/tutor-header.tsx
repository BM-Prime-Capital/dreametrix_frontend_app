import Image from "next/image"

export default function TutorHeader() {
  return (
    <header className="bg-pink-500 text-white p-3 shadow-md">
      <div className="flex items-center">
        <div className="bg-pink-400 p-2 rounded-md">
          <Image
            src="/placeholder.svg?height=24&width=24"
            width={24}
            height={24}
            alt="Tutor icon"
            className="text-white"
          />
        </div>
        <h1 className="ml-2 font-bold text-lg">TUTOR</h1>
      </div>
    </header>
  )
}

