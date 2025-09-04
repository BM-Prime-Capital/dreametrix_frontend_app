/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { Card } from "@/components/ui/card";
import PageTitleH1 from "@/components/ui/page-title-h1";
//import { generalImages } from "@/constants/images";
import { Button } from "../ui/button";
import { ChevronLeft } from "lucide-react";
import { useEffect, useState } from "react";
import { useRequestInfo } from "@/hooks/useRequestInfo";
import { Loader } from "../ui/loader";
import NoDataPersonalized from "../ui/no-data-personalized";
//import { getRewardsFocusView } from "@/services/RewardsService";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { views } from "@/constants/global";

export default function ChildStudyFocusedView({
  student,
  changeView,
}: {
  student: any;
  changeView: (viewName: string) => void;
}) {
  //const [studentData, setStudentData] = useState<any>(null);

  const [studentData] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const { tenantDomain: tenantPrimaryDomain, accessToken, refreshToken } = useRequestInfo();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const loadStudentDetails = async () => {
      setIsLoading(true);
      try {
        if (!tenantPrimaryDomain || !accessToken || !refreshToken) {
          console.error("Missing authentication credentials");
          return;
        }
        
        if (!student?.student?.id) {
          throw new Error("Missing student ID");
        }

        //const data = await getRewardsFocusView(
          // tenantPrimaryDomain,
          // accessToken,
          // refreshToken,
          // "",
          // "",
          // student.student.id 
        //);

        // const transformedData = {
        //   ...data,
        //   personalInfo: {
        //     fullName: `${data.studentName || "N/A"}`,
        //     birthDate: "2005-03-15", 
        //     age: calculateAge("2005-03-15"), 
        //     gender: "Male", 
        //     address: "123 School St, Boston, MA",
        //     phone: "(123) 456-7890", 
        //     email: "student@example.com", 
        //     nationality: "US Citizen", 
        //     photoUrl: (data as any).photoUrl || generalImages.student
        //   },
        //   academicInfo: {
        //     school: "Boston High School", 
        //     grade: (data as any).className ? extractGrade((data as any).className) : "N/A",
        //     homeroomTeacher: "Mr. Johnson", 
        //     gpa: "3.2",
        //     schedule: [
        //       { time: "8:00-9:00", subject: "Math", teacher: "Mr. Smith" },
        //       { time: "9:00-10:00", subject: "English", teacher: "Ms. Davis" },
        //       { time: "10:00-11:00", subject: "Science", teacher: "Dr. Brown" },
        //       { time: "11:00-12:00", subject: "History", teacher: "Mrs. Wilson" }
        //     ],
        //     reportCards: [
        //       { term: "Fall 2023", link: "#" },
        //       { term: "Winter 2023", link: "#" }
        //     ]
        //   },
        //   medicalInfo: {
        //     allergies: "Peanuts", 
        //     conditions: "None",
        //     iepStatus: data.totalPoints < 50 ? "Active" : "None",
        //     accommodations: "Extended test time, Preferential seating" 
        //   },
        //   behaviorInfo: {
        //     absences: 3,
        //     tardies: 2,
        //     incidents: [
        //       { date: "2023-09-15", description: "Late to class", resolution: "Warning" },
        //       { date: "2023-10-02", description: "Disruptive behavior", resolution: "Detention" }
        //     ],
        //     awards: [
        //       { date: "2023-11-01", description: "Student of the Month" },
        //       { date: "2023-09-20", description: "Perfect Attendance" }
        //     ]
        //   },
        //   emergencyContacts: [
        //     { name: "Jane Doe", relation: "Mother", phone: "(123) 456-7890", email: "parent@example.com" },
        //     { name: "John Doe", relation: "Father", phone: "(987) 654-3210", email: "parent2@example.com" }
        //   ],
        //   extracurriculars: [
        //     { activity: "Basketball", schedule: "Mon/Wed 3-5pm" },
        //     { activity: "Debate Club", schedule: "Tue/Thu 4-6pm" }
        //   ],
        //   teacherComments: [
        //     { teacher: "Mr. Smith", subject: "Math", comment: "Shows great potential but needs to complete homework regularly" },
        //     { teacher: "Ms. Davis", subject: "English", comment: "Excellent participation in class discussions" }
        //   ]
        // };

       // setStudentData(transformedData);
      } catch (err) {
        console.error("Failed to load student details:", err);
        setError(err instanceof Error ? err.message : "Failed to load student details");
      } finally {
        setIsLoading(false);
      }
    };

    loadStudentDetails();
  }, [tenantPrimaryDomain, accessToken, refreshToken, student?.student?.id]);

  // const extractGrade = (className: string) => {
  //   const match = className.match(/(\d+)(th|rd|nd|st)?\s?Grade/i);
  //   return match ? `${match[1]}${match[2] || 'th'} Grade` : className;
  // };

  // function calculateAge(birthDate: string): number {
  //   const today = new Date();
  //   const birthDateObj = new Date(birthDate);
  //   let age = today.getFullYear() - birthDateObj.getFullYear();
  //   const monthDiff = today.getMonth() - birthDateObj.getMonth();
    
  //   if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDateObj.getDate())) {
  //     age--;
  //   }
    
  //   return age;
  // }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64 w-full">
        <Loader className="w-full" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center h-64 gap-4">
        <NoDataPersonalized message={error} />
        <Button onClick={() => changeView("GENERAL_VIEW")}>
          Back to Student List
        </Button>
      </div>
    );
  }

  if (!studentData) {
    return (
      <div className="flex flex-col items-center justify-center h-64 gap-4">
        <NoDataPersonalized message="No student data available" />
        <Button onClick={() => changeView("GENERAL_VIEW")}>
          Back to Student List
        </Button>
      </div>
    );
  }

  return (
    <section className="flex flex-col h-full w-full bg-gradient-to-br from-slate-50/30 to-gray-50/20">
      {/* Enhanced Header */}
      <div className="flex justify-between items-center bg-[#79bef2] px-8 py-6 shadow-xl rounded-2xl mx-6 mt-8">
        <div className="flex items-center gap-4">
          <Button 
            variant="ghost" 
            onClick={() => changeView(views.GENERAL_VIEW)}
            className="text-white hover:bg-white/20 rounded-xl p-2"
          >
            <ChevronLeft className="h-5 w-5" />
          </Button>
          <div className="flex items-center gap-4">
            <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
              <svg className="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <div>
              <PageTitleH1 title="Student Profile" className="text-white font-bold text-2xl" />
              <p className="text-blue-100 text-sm mt-1">{studentData.personalInfo.fullName}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Content Area */}
      <div className="flex-1 mx-6 pb-8 space-y-6 overflow-auto">

        <Tabs defaultValue="overview" className="w-full mt-2">
          <TabsList className="grid w-full grid-cols-7 gap-1 bg-white/80 backdrop-blur-sm p-2 rounded-2xl shadow-lg">
            {["overview", "personal", "academic", "medical", "behavior", "contacts", "activities"].map((tab) => (
              <TabsTrigger
                key={tab}
                value={tab}
                className="transition-all duration-200 hover:bg-blue-50 data-[state=active]:bg-[#79bef2] data-[state=active]:text-white data-[state=active]:font-medium capitalize rounded-xl px-4 py-2"
              >
                {tab}
              </TabsTrigger>
            ))}
          </TabsList>

          {/* Overview Tab - Consolidated View */}
          <TabsContent value="overview" className="space-y-6">
            {/* Personal Information Section */}
            <Card className="p-8 bg-white/80 backdrop-blur-sm shadow-xl border-0 rounded-2xl">
            <h2 className="text-xl font-bold mb-6">Personal Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex flex-col items-center gap-4">
                <Avatar className="h-32 w-32 border-4 border-blue-100">
                  <AvatarImage src={studentData.personalInfo.photoUrl} alt={studentData.personalInfo.fullName} />
                  <AvatarFallback>
                    {studentData.personalInfo.fullName.split(' ').map((n: string) => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                <div className="text-center">
                  <h3 className="text-lg font-bold">{studentData.personalInfo.fullName}</h3>
                  <p className="text-gray-600">{studentData.personalInfo.gender}, {studentData.personalInfo.age} years</p>
                </div>
              </div>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Date of Birth</p>
                    <p>{studentData.personalInfo.birthDate}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Nationality</p>
                    <p>{studentData.personalInfo.nationality}</p>
                  </div>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Address</p>
                  <p>{studentData.personalInfo.address}</p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Phone</p>
                    <p>{studentData.personalInfo.phone}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Email</p>
                    <p>{studentData.personalInfo.email}</p>
                  </div>
                </div>
              </div>
            </div>
          </Card>

            {/* Academic Information Section */}
            <Card className="p-8 bg-white/80 backdrop-blur-sm shadow-xl border-0 rounded-2xl">
            <h2 className="text-xl font-bold mb-6">Academic Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-500">School</p>
                  <p className="font-medium">{studentData.academicInfo.school}</p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Grade</p>
                    <p>{studentData.academicInfo.grade}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Homeroom Teacher</p>
                    <p>{studentData.academicInfo.homeroomTeacher}</p>
                  </div>
                </div>
                <div>
                  <p className="text-sm text-gray-500">GPA</p>
                  <p>{studentData.academicInfo.gpa}</p>
                </div>
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-2">Class Schedule</p>
                <div className="border rounded-lg overflow-hidden">
                  {studentData.academicInfo.schedule.map((classItem: any, index: number) => (
                    <div key={index} className={`p-3 ${index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}`}>
                      <div className="flex justify-between">
                        <span className="font-medium">{classItem.subject}</span>
                        <span className="text-gray-600">{classItem.time}</span>
                      </div>
                      <div className="text-sm text-gray-500">Teacher: {classItem.teacher}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </Card>

            {/* Medical Information Section */}
            <Card className="p-8 bg-white/80 backdrop-blur-sm shadow-xl border-0 rounded-2xl">
            <h2 className="text-xl font-bold mb-6">Medical Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-500">Allergies</p>
                  <p>{studentData.medicalInfo.allergies}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Medical Conditions</p>
                  <p>{studentData.medicalInfo.conditions}</p>
                </div>
              </div>
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-500">IEP Status</p>
                  <p>{studentData.medicalInfo.iepStatus}</p>
                </div>
                {studentData.medicalInfo.iepStatus === "Active" && (
                  <div>
                    <p className="text-sm text-gray-500">Accommodations</p>
                    <p>{studentData.medicalInfo.accommodations}</p>
                  </div>
                )}
              </div>
            </div>
          </Card>

            {/* Behavior Information Section */}
            <Card className="p-8 bg-white/80 backdrop-blur-sm shadow-xl border-0 rounded-2xl">
            <h2 className="text-xl font-bold mb-6">Behavior Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Absences</p>
                    <p>{studentData.behaviorInfo.absences}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Tardies</p>
                    <p>{studentData.behaviorInfo.tardies}</p>
                  </div>
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-2">Disciplinary Incidents</p>
                  <div className="space-y-3">
                    {studentData.behaviorInfo.incidents.map((incident: any, index: number) => (
                      <div key={index} className="border-l-4 border-red-500 pl-4 py-2">
                        <div className="flex justify-between text-sm text-gray-500 mb-1">
                          <span>{incident.date}</span>
                        </div>
                        <p className="font-medium">{incident.description}</p>
                        <p className="text-sm text-gray-600">Resolution: {incident.resolution}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-500 mb-2">Awards & Recognition</p>
                  <div className="space-y-3">
                    {studentData.behaviorInfo.awards.map((award: any, index: number) => (
                      <div key={index} className="border-l-4 border-green-500 pl-4 py-2">
                        <div className="flex justify-between text-sm text-gray-500 mb-1">
                          <span>{award.date}</span>
                        </div>
                        <p className="font-medium">{award.description}</p>
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-2">Teacher Comments</p>
                  <div className="space-y-3">
                    {studentData.teacherComments.map((comment: any, index: number) => (
                      <div key={index} className="border-l-4 border-blue-500 pl-4 py-2">
                        <div className="flex justify-between">
                          <span className="font-medium">{comment.teacher}</span>
                          <span className="text-sm text-gray-500">{comment.subject}</span>
                        </div>
                        <p className="mt-1">{comment.comment}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </Card>

            {/* Emergency Contacts Section */}
            <Card className="p-8 bg-white/80 backdrop-blur-sm shadow-xl border-0 rounded-2xl">
            <h2 className="text-xl font-bold mb-6">Emergency Contacts</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {studentData.emergencyContacts.map((contact: any, index: number) => (
                <Card key={index} className="p-4">
                  <h3 className="font-medium mb-2">{contact.name} ({contact.relation})</h3>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="text-gray-500">Phone:</span>
                      <span>{contact.phone}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-gray-500">Email:</span>
                      <span>{contact.email}</span>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </Card>

            {/* Extracurricular Activities Section */}
            <Card className="p-8 bg-white/80 backdrop-blur-sm shadow-xl border-0 rounded-2xl">
            <h2 className="text-xl font-bold mb-6">Extracurricular Activities</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {studentData.extracurriculars.map((activity: any, index: number) => (
                <Card key={index} className="p-4">
                  <h3 className="font-medium mb-1">{activity.activity}</h3>
                  <p className="text-sm text-gray-600">Schedule: {activity.schedule}</p>
                </Card>
              ))}
            </div>
          </Card>
        </TabsContent>

        {/* Individual Tabs (unchanged from original) */}
          <TabsContent value="personal">
            <Card className="p-8 bg-white/80 backdrop-blur-sm shadow-xl border-0 rounded-2xl">
            <h2 className="text-xl font-bold mb-6">A. Personal Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="flex flex-col items-center gap-4">
                <Avatar className="h-32 w-32 border-4 border-blue-100">
                  <AvatarImage src={studentData.personalInfo.photoUrl} alt={studentData.personalInfo.fullName} />
                  <AvatarFallback>
                    {studentData.personalInfo.fullName.split(' ').map((n: string) => n[0]).join('')}
                  </AvatarFallback>
                </Avatar>
                <div className="text-center">
                  <h3 className="text-lg font-bold">{studentData.personalInfo.fullName}</h3>
                  <p className="text-gray-600">{studentData.personalInfo.gender}, {studentData.personalInfo.age} years</p>
                </div>
              </div>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Date of Birth</p>
                    <p>{studentData.personalInfo.birthDate}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Nationality</p>
                    <p>{studentData.personalInfo.nationality}</p>
                  </div>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Address</p>
                  <p>{studentData.personalInfo.address}</p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Phone</p>
                    <p>{studentData.personalInfo.phone}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Email</p>
                    <p>{studentData.personalInfo.email}</p>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </TabsContent>

          <TabsContent value="academic">
            <Card className="p-8 bg-white/80 backdrop-blur-sm shadow-xl border-0 rounded-2xl">
            <h2 className="text-xl font-bold mb-6">B. Academic Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-500">School</p>
                  <p className="font-medium">{studentData.academicInfo.school}</p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Grade</p>
                    <p>{studentData.academicInfo.grade}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Homeroom Teacher</p>
                    <p>{studentData.academicInfo.homeroomTeacher}</p>
                  </div>
                </div>
                <div>
                  <p className="text-sm text-gray-500">GPA</p>
                  <p>{studentData.academicInfo.gpa}</p>
                </div>
              </div>
              <div>
                <p className="text-sm text-gray-500 mb-2">Class Schedule</p>
                <div className="border rounded-lg overflow-hidden">
                  {studentData.academicInfo.schedule.map((classItem: any, index: number) => (
                    <div key={index} className={`p-3 ${index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}`}>
                      <div className="flex justify-between">
                        <span className="font-medium">{classItem.subject}</span>
                        <span className="text-gray-600">{classItem.time}</span>
                      </div>
                      <div className="text-sm text-gray-500">Teacher: {classItem.teacher}</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="border-t pt-6 mt-6">
              <h3 className="text-lg font-bold mb-3 text-gray-800">Report Card</h3>
              <div>
                <Button variant="default" onClick={() => changeView(views.GENERAL_VIEW)} className="p-2">
                  View Report Card
                </Button>
              </div>
            </div> 
          </Card>
        </TabsContent>

          <TabsContent value="medical">
            <Card className="p-8 bg-white/80 backdrop-blur-sm shadow-xl border-0 rounded-2xl">
            <h2 className="text-xl font-bold mb-6">C. Medical & Special Needs</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-500">Allergies</p>
                  <p>{studentData.medicalInfo.allergies}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Medical Conditions</p>
                  <p>{studentData.medicalInfo.conditions}</p>
                </div>
              </div>
              <div className="space-y-4">
                {studentData.medicalInfo.iepStatus === "Active" && (
                  <div>
                    <p className="text-sm text-gray-500">Accommodations</p>
                    <p>{studentData.medicalInfo.accommodations}</p>
                  </div>
                )}
              </div>
            </div>
          </Card>
        </TabsContent>

          <TabsContent value="behavior">
            <Card className="p-8 bg-white/80 backdrop-blur-sm shadow-xl border-0 rounded-2xl">
            <h2 className="text-xl font-bold mb-6">D. Behavior & Discipline</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Absences</p>
                    <p>{studentData.behaviorInfo.absences}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Tardies</p>
                    <p>{studentData.behaviorInfo.tardies}</p>
                  </div>
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-2">Disciplinary Incidents</p>
                  <div className="space-y-3">
                    {studentData.behaviorInfo.incidents.map((incident: any, index: number) => (
                      <div key={index} className="border-l-4 border-red-500 pl-4 py-2">
                        <div className="flex justify-between text-sm text-gray-500 mb-1">
                          <span>{incident.date}</span>
                        </div>
                        <p className="font-medium">{incident.description}</p>
                        <p className="text-sm text-gray-600">Resolution: {incident.resolution}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-500 mb-2">Awards & Recognition</p>
                  <div className="space-y-3">
                    {studentData.behaviorInfo.awards.map((award: any, index: number) => (
                      <div key={index} className="border-l-4 border-green-500 pl-4 py-2">
                        <div className="flex justify-between text-sm text-gray-500 mb-1">
                          <span>{award.date}</span>
                        </div>
                        <p className="font-medium">{award.description}</p>
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="text-sm text-gray-500 mb-2">Teacher Comments</p>
                  <div className="space-y-3">
                    {studentData.teacherComments.map((comment: any, index: number) => (
                      <div key={index} className="border-l-4 border-blue-500 pl-4 py-2">
                        <div className="flex justify-between">
                          <span className="font-medium">{comment.teacher}</span>
                          <span className="text-sm text-gray-500">{comment.subject}</span>
                        </div>
                        <p className="mt-1">{comment.comment}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </TabsContent>

          <TabsContent value="contacts">
            <Card className="p-8 bg-white/80 backdrop-blur-sm shadow-xl border-0 rounded-2xl">
            <h2 className="text-xl font-bold mb-6">E. Emergency Contacts</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {studentData.emergencyContacts.map((contact: any, index: number) => (
                <Card key={index} className="p-4">
                  <h3 className="font-medium mb-2">{contact.name} ({contact.relation})</h3>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <span className="text-gray-500">Phone:</span>
                      <span>{contact.phone}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-gray-500">Email:</span>
                      <span>{contact.email}</span>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
            <div className="mt-6">
              <h3 className="font-medium mb-2">Authorized Pickup</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <Card className="p-3 text-center">Jane Doe (Mother)</Card>
                <Card className="p-3 text-center">John Doe (Father)</Card>
                <Card className="p-3 text-center">Mary Smith (Aunt)</Card>
              </div>
            </div>
          </Card>
        </TabsContent>

          <TabsContent value="activities">
            <Card className="p-8 bg-white/80 backdrop-blur-sm shadow-xl border-0 rounded-2xl">
            <h2 className="text-xl font-bold mb-6">F. Extracurricular Activities</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {studentData.extracurriculars.map((activity: any, index: number) => (
                <Card key={index} className="p-4">
                  <h3 className="font-medium mb-1">{activity.activity}</h3>
                  <p className="text-sm text-gray-600">Schedule: {activity.schedule}</p>
                </Card>
              ))}
            </div>
          </Card>
        </TabsContent>
        </Tabs>
      </div>
    </section>
  );
}