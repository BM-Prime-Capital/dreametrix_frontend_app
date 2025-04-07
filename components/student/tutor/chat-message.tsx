import Image from "next/image"

type AttachmentType = {
  type: "image" | "document"
  src: string
  alt: string
}

interface ChatMessageProps {
  avatar: string
  sender: string
  message: string
  isUser: boolean
  timestamp?: string
  attachment?: AttachmentType
}

export default function ChatMessage({ avatar, sender, message, isUser, attachment }: ChatMessageProps) {
  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"}`}>
      {!isUser && (
        <div className="mr-2 flex-shrink-0">
          <Image src={avatar} width={40} height={40} alt={sender} className="rounded-full" />
        </div>
      )}

      <div
        className={`max-w-[70%] ${isUser ? "bg-blue-100 rounded-tl-lg rounded-bl-lg rounded-br-lg" : "bg-green-100 rounded-tr-lg rounded-bl-lg rounded-br-lg"} p-3`}
      >
        {!isUser && <div className="font-medium text-sm mb-1">{sender}</div>}
        <p className="text-sm">{message}</p>

        {attachment && attachment.type === "image" && (
          <div className="mt-2">
            <Image
              src={attachment.src || "/placeholder.svg"}
              width={150}
              height={100}
              alt={attachment.alt}
              className="rounded-md"
            />
          </div>
        )}
      </div>

      {isUser && (
        <div className="ml-2 flex-shrink-0">
          <Image src={avatar || "/placeholder.svg"} width={40} height={40} alt={sender} className="rounded-full" />
        </div>
      )}
    </div>
  )
}

