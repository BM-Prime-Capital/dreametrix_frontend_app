import { Header } from "../school/header"
import { Sidebar } from "../school/sidebar"
import { ActivityFeed } from "../school/activity-feed"
import { AIAssistance } from "../school/ai-assistance"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Edit2, Settings, Search } from "lucide-react"

export default function DashboardPage() {
  return (
    <div className="min-h-screen bg-gray-100">
      <Header />
      <div className="container mx-auto max-w-7xl px-3 sm:px-4">
        <div className="flex flex-col lg:flex-row gap-6 justify-center">
          <Card className="w-full lg:w-[200px] h-fit">
            <Sidebar />
          </Card>

          <main className="flex-1 space-y-6 max-w-3xl">
            <Card className="p-4 sm:p-6">
              <div className="flex flex-col sm:flex-row items-center gap-4 mb-6 justify-center">
                <Avatar className="h-16 w-16">
                  <AvatarImage src="/placeholder.svg" />
                  <AvatarFallback>SL</AvatarFallback>
                </Avatar>
                <div className="text-center sm:text-left">
                  <h2 className="text-xl font-semibold">School Lead/Principal</h2>
                  <div className="flex gap-2 justify-center sm:justify-start">
                    <Settings className="h-4 w-4" />
                    <Search className="h-4 w-4" />
                    <Edit2 className="h-4 w-4" />
                  </div>
                </div>
              </div>
            </Card>

            <Card className="p-4 sm:p-6 bg-[#f0f9ff]">
              <AIAssistance />
            </Card>

            <Card className="p-4 sm:p-6">
              <div className="flex justify-center">
                <div className="space-y-6 w-full max-w-xl">
                  <h2 className="text-xl font-semibold ">Profile</h2>
                  <div className="flex flex-col sm:flex-row i gap-4 mb-6 justify-center">
                    <Avatar className="h-16 w-16">
                      <AvatarImage src="/placeholder.svg" />
                      <AvatarFallback>SL</AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col i sm:items-start gap-2">
                      <div className="text-lg font-medium">School Lead/Principal</div>
                      <div className="text-sm text-muted-foreground">Change photo</div>
                    </div>
                  </div>
                  <div className="grid gap-4">
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm" htmlFor="username">
                          Username
                        </label>
                        <Input id="username" placeholder="School Name" className="bg-gray-50" />
                      </div>
                      <div>
                        <label className="text-sm" htmlFor="email">
                          Email
                        </label>
                        <Input id="email" placeholder="sarah@school.edu" className="bg-gray-50" />
                      </div>
                    </div>
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm" htmlFor="school">
                          School
                        </label>
                        <Input id="school" placeholder="School1" className="bg-gray-50" />
                      </div>
                      <div>
                        <label className="text-sm" htmlFor="role">
                          Role
                        </label>
                        <Input id="role" placeholder="Principal" className="bg-gray-50" />
                      </div>
                    </div>
                    <Button className="w-full bg-[#f0f9ff] color-white">UPDATE PROFILE</Button>
                    <Button variant="ghost" className="w-full">
                      Cancel
                    </Button>
                  </div>
                </div>
              </div>
            </Card>

          </main>
          <Card className="w-full lg:w-[300px] h-fit">
            <ActivityFeed />
          </Card>
        </div>
      </div>
    </div>
  )
}