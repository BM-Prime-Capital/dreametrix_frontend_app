import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Edit2, Settings, Search } from "lucide-react";
import { ActivityFeed } from "../layout/ActivityFeed";
import PageTitleH1 from "../ui/page-title-h1";
import PageTitleH2 from "../ui/page-title-h2";

export default function TeacherDashboard() {
  return (
    <section className="flex flex-col gap-6 w-full">
      <PageTitleH1 title="Dashboard" />

      <div className="flex flex-col lg:flex-row gap-6 p-4 sm:p-6">
        <div className="flex-1 space-y-6">
          <Card className="p-4 sm:p-6">
            <div className="flex flex-col sm:flex-row items-center gap-4 mb-6">
              <Avatar className="h-16 w-16">
                <AvatarImage src="/placeholder.svg" />
                <AvatarFallback>SL</AvatarFallback>
              </Avatar>
              <div className="text-center sm:text-left">
                <PageTitleH2 title="Sarah Young" />

                <div className="flex gap-2 justify-center sm:justify-start">
                  <Settings className="h-4 w-4" />
                  <Search className="h-4 w-4" />
                  <Edit2 className="h-4 w-4" />
                </div>
              </div>
            </div>
          </Card>

          <Card className="p-4 sm:p-6">
            <p>Some content</p>
          </Card>

          <Card className="p-4 sm:p-6">
            <div className="space-y-6">
              <h2 className="text-xl font-semibold">Profile</h2>
              <div className="flex flex-col sm:flex-row items-center gap-4 mb-6">
                <Avatar className="h-16 w-16">
                  <AvatarImage src="/placeholder.svg" />
                  <AvatarFallback>SL</AvatarFallback>
                </Avatar>
                <div className="text-sm text-muted-foreground">Change</div>
              </div>
              <div className="grid gap-4 max-w-xl mx-auto sm:mx-0">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm" htmlFor="username">
                      Username
                    </label>
                    <Input
                      id="username"
                      placeholder="School Name"
                      className="bg-gray-50"
                    />
                  </div>
                  <div>
                    <label className="text-sm" htmlFor="email">
                      Email
                    </label>
                    <Input
                      id="email"
                      placeholder="sarah@school.edu"
                      className="bg-gray-50"
                    />
                  </div>
                </div>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm" htmlFor="school">
                      School
                    </label>
                    <Input
                      id="school"
                      placeholder="School1"
                      className="bg-gray-50"
                    />
                  </div>
                  <div>
                    <label className="text-sm" htmlFor="role">
                      Role
                    </label>
                    <Input
                      id="role"
                      placeholder="Principal"
                      className="bg-gray-50"
                    />
                  </div>
                </div>
                <Button className="w-full bg-blue-500 hover:bg-blue-600">
                  UPDATE PROFILE
                </Button>
                <Button variant="ghost" className="w-full">
                  Cancel
                </Button>
              </div>
            </div>
          </Card>
        </div>

        <ActivityFeed />
      </div>
    </section>
  );
}
