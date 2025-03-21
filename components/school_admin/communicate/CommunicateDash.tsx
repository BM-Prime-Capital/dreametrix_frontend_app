"use client"

import { useState } from "react"
import Image from "next/image"
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Trash2 } from "lucide-react"

// Local icons to avoid next/image hostname errors
const icons = {
  compose: "public/icons/compose.svg",
  external: "/icons/external.svg",
  individualTeacher: "/icons/individual-teacher.svg",
  wholeClasses: "/icons/whole-classes.svg",
  individualParents: "/icons/individual-parents.svg",
  allParents: "/icons/all-parents.svg",
  otherGroups: "/icons/other-groups.svg",
  delete: "/icons/delete.svg",
}

// Données des messages
const messages = [
  {
    id: 1,
    avatar: "/avatars/teacher1.jpg",
    name: "Teacher 1",
    message: "Lorem ipsum dolor sit amet, consetetur adipsicing elit, sed do...",
    time: "13:45",
    date: "21/07/24",
  },
  {
    id: 2,
    avatar: "/avatars/teacher2.jpg",
    name: "Teacher 2",
    message: "Lorem ipsum dolor sit amet, consetetur adipsicing elit, sed do...",
    time: "13:45",
    date: "21/07/24",
  },
  {
    id: 3,
    avatar: "/avatars/teacher3.jpg",
    name: "Teacher 3",
    message: "Lorem ipsum dolor sit amet, consetetur adipsicing elit, sed do...",
    time: "13:45",
    date: "21/07/24",
  },
  {
    id: 4,
    avatar: "/avatars/teacher4.jpg",
    name: "Teacher 4",
    message: "Lorem ipsum dolor sit amet, consetetur adipsicing elit, sed do...",
    time: "13:45",
    date: "21/07/24",
  },
]

// Onglets de communication
const tabs = [
  {
    id: "individual-teacher",
    label: "INDIVIDUAL TEACHER",
    icon: icons.individualTeacher,
    color: "#e6f3f9",
    activeColor: "#55b4f1",
  },
  { id: "whole-classes", label: "WHOLE CLASSES", icon: icons.wholeClasses, color: "#e6f3f9", activeColor: "#f0a868" },
  {
    id: "individual-parents",
    label: "INDIVIDUAL PARENTS",
    icon: icons.individualParents,
    color: "#e6f3f9",
    activeColor: "#9966cc",
  },
  { id: "all-parents", label: "ALL PARENTS", icon: icons.allParents, color: "#e6f3f9", activeColor: "#ff66b3" },
  { id: "other-groups", label: "OTHER GROUPS", icon: icons.otherGroups, color: "#e6f3f9", activeColor: "#4cd964" },
]

export function ComposeMessageDialog() {
  const [open, setOpen] = useState(false)

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="flex gap-3 items-center text-base font-medium bg-[#1E88E5] hover:bg-[#1976D2] rounded-md px-6 py-7 h-auto">
          <div className="w-6 h-6 relative">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M19 4H5C3.895 4 3 4.895 3 6V18C3 19.105 3.895 20 5 20H19C20.105 20 21 19.105 21 18V6C21 4.895 20.105 4 19 4Z"
                stroke="white"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path d="M12 12H16" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M12 8H16" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              <path
                d="M8 16C9.10457 16 10 15.1046 10 14C10 12.8954 9.10457 12 8 12C6.89543 12 6 12.8954 6 14C6 15.1046 6.89543 16 8 16Z"
                stroke="white"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>
          <span>Compose</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="w-[400px] p-6">
        <h2 className="pb-3 font-bold text-lg border-b border-gray-200">Compose</h2>
        <div className="flex flex-col gap-3 text-gray-600 mt-4">
          <input type="text" className="px-4 py-3 bg-white rounded-full border border-gray-200" placeholder="To.." />

          <input type="file" className="px-4 py-3 bg-white rounded-full border border-gray-200" />

          <textarea
            className="w-full px-4 py-3 bg-white rounded-lg border border-gray-200"
            rows={4}
            placeholder="Message..."
          />
        </div>
        <div className="flex justify-between gap-2 mt-4">
          <button className="rounded-full px-6 py-2.5 hover:bg-gray-100 text-gray-600" onClick={() => setOpen(false)}>
            Cancel
          </button>
          <button className="flex px-8 py-2.5 items-center justify-center gap-2 bg-[#1E88E5] hover:bg-[#1976D2] text-white rounded-full font-medium">
            SEND
          </button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export function ExternalCommunicationDialog() {
  const [open, setOpen] = useState(false)

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="flex gap-3 items-center text-base font-medium bg-[#FF4081] hover:bg-[#F50057] rounded-md px-6 py-7 h-auto">
          <div className="w-6 h-6 relative">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path
                d="M5 4H9L11 9L8.5 10.5C9.5 12.5 11.5 14.5 13.5 15.5L15 13L20 15V19C20 19.5304 19.7893 20.0391 19.4142 20.4142C19.0391 20.7893 18.5304 21 18 21C14.0993 20.763 10.4202 19.1065 7.65683 16.3432C4.8935 13.5798 3.23705 9.90074 3 6C3 5.46957 3.21071 4.96086 3.58579 4.58579C3.96086 4.21071 4.46957 4 5 4Z"
                stroke="white"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <path d="M15 7L20 2" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M15 2H20V7" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
          <span>External</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="flex flex-col gap-6 w-[400px] p-6">
        <h2 className="pb-3 font-bold text-lg border-b border-gray-200">External</h2>
        <div className="flex flex-col gap-5 text-gray-600">
          <div className="flex items-center gap-3">
            <input id="radio1" type="radio" name="externalCompose" className="w-4 h-4 accent-[#FF4081]" />
            <label htmlFor="radio1" className="text-gray-700">
              Send an email to an external address
            </label>
          </div>

          <div className="flex items-center gap-3">
            <input id="radio2" type="radio" name="externalCompose" className="w-4 h-4 accent-[#FF4081]" />
            <label htmlFor="radio2" className="text-gray-700">
              Send a text message
            </label>
          </div>

          <div className="flex items-center gap-3">
            <input id="radio3" type="radio" name="externalCompose" className="w-4 h-4 accent-[#FF4081]" />
            <label htmlFor="radio3" className="text-gray-700">
              Record a message for sending via call
            </label>
          </div>
        </div>
        <div className="flex justify-end gap-2 mt-2">
          <button className="rounded-full px-6 py-2.5 hover:bg-gray-100 text-gray-600" onClick={() => setOpen(false)}>
            Close
          </button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default function CommunicatePage() {
  const [activeTab, setActiveTab] = useState("individual-teacher")

  return (
    <section className="flex flex-col gap-5 w-full p-6 max-w-[1400px] mx-auto bg-[#f5f5f5]">
      <div>
        <h1 className="text-2xl font-medium text-[#4CD964]">COMMUNICATE</h1>
      </div>

      <div className="flex gap-4">
        <ComposeMessageDialog />
        <ExternalCommunicationDialog />
      </div>

      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        {/* Tabs */}
        <div className="flex w-full">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              className={`flex-1 flex flex-col items-center justify-center py-5 px-2 gap-2 transition-colors ${
                activeTab === tab.id ? "bg-white" : "bg-[#e6f3f9]"
              }`}
              onClick={() => setActiveTab(tab.id)}
            >
              <div className="w-6 h-6 relative">
                {tab.id === "individual-teacher" && (
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path
                      d="M12 11C14.2091 11 16 9.20914 16 7C16 4.79086 14.2091 3 12 3C9.79086 3 8 4.79086 8 7C8 9.20914 9.79086 11 12 11Z"
                      stroke="#55b4f1"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M6 21V19C6 17.9391 6.42143 16.9217 7.17157 16.1716C7.92172 15.4214 8.93913 15 10 15H14C15.0609 15 16.0783 15.4214 16.8284 16.1716C17.5786 16.9217 18 17.9391 18 19V21"
                      stroke="#55b4f1"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                )}
                {tab.id === "whole-classes" && (
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path
                      d="M17 21V19C17 17.9391 16.5786 16.9217 15.8284 16.1716C15.0783 15.4214 14.0609 15 13 15H5C3.93913 15 2.92172 15.4214 2.17157 16.1716C1.42143 16.9217 1 17.9391 1 19V21"
                      stroke="#f0a868"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M9 11C11.2091 11 13 9.20914 13 7C13 4.79086 11.2091 3 9 3C6.79086 3 5 4.79086 5 7C5 9.20914 6.79086 11 9 11Z"
                      stroke="#f0a868"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M23 21V19C22.9993 18.1137 22.7044 17.2528 22.1614 16.5523C21.6184 15.8519 20.8581 15.3516 20 15.13"
                      stroke="#f0a868"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M16 3.13C16.8604 3.35031 17.623 3.85071 18.1676 4.55232C18.7122 5.25392 19.0078 6.11683 19.0078 7.005C19.0078 7.89318 18.7122 8.75608 18.1676 9.45769C17.623 10.1593 16.8604 10.6597 16 10.88"
                      stroke="#f0a868"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                )}
                {tab.id === "individual-parents" && (
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path
                      d="M16 4H18C18.5304 4 19.0391 4.21071 19.4142 4.58579C19.7893 4.96086 20 5.46957 20 6V20C20 20.5304 19.7893 21.0391 19.4142 21.4142C19.0391 21.7893 18.5304 22 18 22H6C5.46957 22 4.96086 21.7893 4.58579 21.4142C4.21071 21.0391 4 20.5304 4 20V6C4 5.46957 4.21071 4.96086 4.58579 4.58579C4.96086 4.21071 5.46957 4 6 4H8"
                      stroke="#9966cc"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M15 2H9C8.44772 2 8 2.44772 8 3V5C8 5.55228 8.44772 6 9 6H15C15.5523 6 16 5.55228 16 5V3C16 2.44772 15.5523 2 15 2Z"
                      stroke="#9966cc"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M12 11C13.1046 11 14 10.1046 14 9C14 7.89543 13.1046 7 12 7C10.8954 7 10 7.89543 10 9C10 10.1046 10.8954 11 12 11Z"
                      stroke="#9966cc"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M16 18.5C16 17.1739 15.4732 15.9021 14.5355 14.9645C13.5979 14.0268 12.3261 13.5 11 13.5H13C11.6739 13.5 10.4021 14.0268 9.46447 14.9645C8.52678 15.9021 8 17.1739 8 18.5"
                      stroke="#9966cc"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                )}
                {tab.id === "all-parents" && (
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path
                      d="M17 21V19C17 17.9391 16.5786 16.9217 15.8284 16.1716C15.0783 15.4214 14.0609 15 13 15H5C3.93913 15 2.92172 15.4214 2.17157 16.1716C1.42143 16.9217 1 17.9391 1 19V21"
                      stroke="#ff66b3"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M9 11C11.2091 11 13 9.20914 13 7C13 4.79086 11.2091 3 9 3C6.79086 3 5 4.79086 5 7C5 9.20914 6.79086 11 9 11Z"
                      stroke="#ff66b3"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M23 21V19C22.9993 18.1137 22.7044 17.2528 22.1614 16.5523C21.6184 15.8519 20.8581 15.3516 20 15.13"
                      stroke="#ff66b3"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M16 3.13C16.8604 3.35031 17.623 3.85071 18.1676 4.55232C18.7122 5.25392 19.0078 6.11683 19.0078 7.005C19.0078 7.89318 18.7122 8.75608 18.1676 9.45769C17.623 10.1593 16.8604 10.6597 16 10.88"
                      stroke="#ff66b3"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                )}
                {tab.id === "other-groups" && (
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path
                      d="M16 21V19C16 17.9391 15.5786 16.9217 14.8284 16.1716C14.0783 15.4214 13.0609 15 12 15H5C3.93913 15 2.92172 15.4214 2.17157 16.1716C1.42143 16.9217 1 17.9391 1 19V21"
                      stroke="#4cd964"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M8.5 11C10.7091 11 12.5 9.20914 12.5 7C12.5 4.79086 10.7091 3 8.5 3C6.29086 3 4.5 4.79086 4.5 7C4.5 9.20914 6.29086 11 8.5 11Z"
                      stroke="#4cd964"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M17 11L19 13L23 9"
                      stroke="#4cd964"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                )}
              </div>
              <span className="text-xs font-medium text-gray-700">{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Messages */}
        <div className="bg-white">
          {messages.map((message, index) => (
            <div
              key={message.id}
              className={`flex items-center gap-4 py-5 px-8 ${
                index < messages.length - 1 ? "border-b border-gray-100" : ""
              }`}
            >
              <div className="flex-shrink-0">
                <div className="w-12 h-12 rounded-full overflow-hidden bg-gray-200">
                  <Image
                    src={`/placeholder.svg?height=48&width=48`}
                    alt={message.name}
                    width={48}
                    height={48}
                    className="w-12 h-12 object-cover"
                  />
                </div>
              </div>
              <div className="flex-shrink-0 w-28">
                <p className="text-sm font-medium text-gray-700">{message.name}</p>
              </div>
              <div className="flex-grow">
                <p className="text-sm text-gray-500 truncate">{message.message}</p>
              </div>
              <div className="flex-shrink-0 w-16 text-right">
                <p className="text-sm text-gray-500">{message.time}</p>
              </div>
              <div className="flex-shrink-0 w-16 text-right">
                <p className="text-sm text-gray-500">{message.date}</p>
              </div>
              <div className="flex-shrink-0">
                <button className="p-1 rounded-full hover:bg-gray-100 text-[#ff6b6b]">
                  <Trash2 size={18} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

