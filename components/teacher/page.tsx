import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Edit2, Settings, Search } from "lucide-react";
import { ActivityFeed } from "../layout/ActivityFeed";
import PageTitleH1 from "../ui/page-title-h1";
import PageTitleH2 from "../ui/page-title-h2";
import Image from "next/image";
import { teacherImages } from "@/constants/images";

export default function TeacherDashboard() {
  return (
    <section className="flex flex-col gap-6 w-full">
      <PageTitleH1 title="Dashboard" />

      <div className="flex flex-col lg:flex-row gap-6 p-4 sm:p-6">
        <div className="flex-1 space-y-6">
          <Card className="p-4 sm:p-6">
            <div className="flex flex-col sm:flex-row items-center gap-8 mb-6 pl-0 sm:pl-16">
              <Avatar className="h-16 w-16">
                <AvatarImage src="/placeholder.svg" />
                <AvatarFallback>SY</AvatarFallback>
              </Avatar>
              <div className="text-center sm:text-left">
                <PageTitleH2 title="Sarah Young" />

                <div className="flex gap-2 justify-center sm:justify-start">
                  <Image
                    src={teacherImages.ai}
                    alt="ai"
                    width={100}
                    height={100}
                    className="h-6 w-6"
                    title="ai"
                  />
                  <Image
                    src={teacherImages.profile}
                    alt="profile"
                    width={100}
                    height={100}
                    className="h-6 w-6"
                    title="profile"
                  />
                  <Image
                    src={teacherImages.settings}
                    alt="settings"
                    width={100}
                    height={100}
                    className="h-6 w-6"
                    title="settings"
                  />
                </div>
              </div>
            </div>
          </Card>

          <Card className="p-4 sm:p-6 bg-[#DFECF2]">
            <div className="flex flex-col pl-4 sm:pl-16">
              <PageTitleH2 title="AI Teacher Assistance" />
              <div className="flex flex-col pl-1 gap-4 mt-4">
                <div className="flex gap-4">
                  <Image
                    src={teacherImages.ai1}
                    alt="ai1"
                    width={100}
                    height={100}
                    className="h-6 w-6"
                    title="ai"
                  />
                  <div>
                    Students who needs you to{" "}
                    <span className="font-bold opacity-80">
                      contact their parents
                    </span>
                    <ul className="list-none pl-6">
                      <li className="flex gap-2 items-center font-bold opacity-80">
                        <label>Marta Sae</label>
                        <Image
                          src={teacherImages.information}
                          alt="info"
                          width={100}
                          height={100}
                          className="h-4 w-4"
                          title="info"
                        />
                      </li>

                      <li className="flex gap-2 items-center font-bold opacity-80">
                        <label>John Smith</label>
                        <Image
                          src={teacherImages.information}
                          alt="info"
                          width={100}
                          height={100}
                          className="h-4 w-4"
                          title="info"
                        />
                      </li>
                    </ul>
                  </div>
                </div>

                <div className="flex gap-4">
                  <Image
                    src={teacherImages.ai2}
                    alt="ai2"
                    width={100}
                    height={100}
                    className="h-6 w-6"
                    title="ai"
                  />
                  <div>
                    Reminder that tomorrow{" "}
                    <span className="font-bold opacity-80">
                      Class 5 - Math has exam
                    </span>
                  </div>
                </div>

                <div className="flex gap-4">
                  <Image
                    src={teacherImages.ai2}
                    alt="ai2"
                    width={100}
                    height={100}
                    className="h-6 w-6"
                    title="ai"
                  />
                  <div>
                    Reminder that tomorrow{" "}
                    <span className="font-bold opacity-80">
                      Class 5 - Sci has exam
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </Card>

          <Card className="p-4 sm:py-6 sm:px-24">
            <div className="space-y-6">
              <PageTitleH2 title="Profile" />
              <div className="flex flex-col sm:flex-row items-center gap-4 mb-6">
                <Avatar className="h-16 w-16">
                  <AvatarImage src="/placeholder.svg" />
                  <AvatarFallback>SL</AvatarFallback>
                </Avatar>
                <PageTitleH2 title="Sarah Young" />
                {/* <div className="text-sm text-muted-foreground">Change</div> */}
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
                      className="bg-gray-50 rounded-full"
                    />
                  </div>
                  <div>
                    <label className="text-sm" htmlFor="email">
                      Email
                    </label>
                    <Input
                      id="email"
                      placeholder="sarah@school.edu"
                      className="bg-gray-50 rounded-full"
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
                      className="bg-gray-50 rounded-full"
                    />
                  </div>
                  <div>
                    <label className="text-sm" htmlFor="role">
                      Role
                    </label>
                    <Input
                      id="role"
                      placeholder="Principal"
                      className="bg-gray-50 rounded-full"
                    />
                  </div>
                </div>
                <Button className="w-full bg-blue-500 hover:bg-blue-600 rounded-full">
                  UPDATE PROFILE
                </Button>
                <Button variant="ghost" className="w-full rounded-full">
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
