/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { Card } from "@/components/ui/card";
import PageTitleH1 from "@/components/ui/page-title-h1";
import { generalImages } from "@/constants/images";
import { Button } from "../ui/button";
import { ChevronLeft } from "lucide-react";
import { useEffect, useState } from "react";
import { useRequestInfo } from "@/hooks/useRequestInfo";
import { Loader } from "../ui/loader";
import NoDataPersonalized from "../ui/no-data-personalized";
import { getRewardsFocusView } from "@/services/RewardsService";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { views } from "@/constants/global";
import { getChildStudyData } from "@/services/TeacherService";

export default function ChildStudyFocusedView({
  student,
  changeView,
}: {
  student: any;
  changeView: (viewName: string) => void;
}) {
  const [studentData, setStudentData] = useState<any>(null);
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

        // Récupérer les données réelles de l'API
        const childStudyData = await getChildStudyData(
          tenantPrimaryDomain,
          accessToken,
          student.student.id
        );

        console.log("Child Study Data:", childStudyData);

        // Récupérer les données de récompenses si nécessaire
        const rewardsData = await getRewardsFocusView(
          tenantPrimaryDomain,
          accessToken,
          refreshToken,
          "",
          "",
          student.student.id
        );

        // Transformer les données avec les informations réelles de l'API
        const transformedData = {
          ...childStudyData,
          personalInfo: {
            fullName: childStudyData.studentName || "N/A",
            firstName: childStudyData.personalInfo?.firstName || "",
            lastName: childStudyData.personalInfo?.lastName || "",
            birthDate: childStudyData.personalInfo?.birthDate || "N/A",
            age: childStudyData.personalInfo?.age || calculateAge(childStudyData.personalInfo?.birthDate),
            gender: childStudyData.personalInfo?.gender !== "undefined" ? childStudyData.personalInfo.gender : "Not specified",
            address: childStudyData.personalInfo?.address || "Not specified",
            phone: childStudyData.personalInfo?.phone || "Not specified",
            email: childStudyData.personalInfo?.email || "Not specified",
            nationality: childStudyData.personalInfo?.nationality || "Not specified",
            photoUrl: childStudyData.photoUrl || generalImages.student
          },
          academicInfo: {
            school: childStudyData.academicInfo?.school || "Not specified",
            schoolId: childStudyData.academicInfo?.schoolId,
            grade: childStudyData.academicInfo?.grade || extractGrade(childStudyData.className),
            class: childStudyData.academicInfo?.class || "Not specified",
            homeroomTeacher: childStudyData.academicInfo?.homeroomTeacher || "Not specified",
            teacherId: childStudyData.academicInfo?.teacherId,
            gpa: childStudyData.academicInfo?.gpa || "N/A",
            currentTerm: childStudyData.academicInfo?.currentTerm || "Not specified",
            schedule: childStudyData.academicInfo?.schedule || [],
            reportCards: childStudyData.academicInfo?.reportCards || [],
            currentCourses: childStudyData.academicInfo?.currentCourses || []
          },
          medicalInfo: {
            allergies: childStudyData.medicalInfo?.allergies?.length > 0 
              ? childStudyData.medicalInfo.allergies.join(", ") 
              : "None",
            conditions: childStudyData.medicalInfo?.medicalConditions?.length > 0
              ? childStudyData.medicalInfo.medicalConditions.join(", ")
              : "None",
            medications: childStudyData.medicalInfo?.medications || [],
            iepStatus: childStudyData.medicalInfo?.iepStatus || "None",
            iepExpiryDate: childStudyData.medicalInfo?.iepExpiryDate,
            accommodations: childStudyData.medicalInfo?.accommodations?.length > 0
              ? childStudyData.medicalInfo.accommodations.join(", ")
              : "None",
            doctor: childStudyData.medicalInfo?.doctor || {}
          },
          behaviorInfo: {
            attendance: childStudyData.behaviorInfo?.attendance || {
              absences: 0,
              tardies: 0,
              excusedAbsences: 0,
              unexcusedAbsences: 0
            },
            incidents: childStudyData.behaviorInfo?.incidents || [],
            awards: childStudyData.behaviorInfo?.awards || [],
            points: childStudyData.behaviorInfo?.points || {
              totalPoints: 0,
              academicPoints: 0,
              behaviorPoints: 0,
              participationPoints: 0,
              currentRank: 0
            }
          },
          emergencyContacts: childStudyData.emergencyContacts || [],
          extracurriculars: childStudyData.extracurriculars || [],
          teacherComments: childStudyData.teacherComments || [],
          documents: childStudyData.documents || [],
          permissions: childStudyData.permissions || {},
          metadata: childStudyData.metadata || {}
        };

        setStudentData(transformedData);
      } catch (err) {
        console.error("Failed to load student details:", err);
        setError(err instanceof Error ? err.message : "Failed to load student details");
      } finally {
        setIsLoading(false);
      }
    };

    loadStudentDetails();
  }, [tenantPrimaryDomain, accessToken, refreshToken, student?.student?.id]);

  const extractGrade = (className: string) => {
    if (!className) return "Not specified";
    const match = className.match(/(\d+)(th|rd|nd|st)?\s?Grade/i);
    return match ? `${match[1]}${match[2] || 'th'} Grade` : className;
  };

  function calculateAge(birthDate: string): number {
    if (!birthDate) return 0;
    const today = new Date();
    const birthDateObj = new Date(birthDate);
    let age = today.getFullYear() - birthDateObj.getFullYear();
    const monthDiff = today.getMonth() - birthDateObj.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDateObj.getDate())) {
      age--;
    }
    
    return age;
  }

  const formatDate = (dateString: string) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString();
  };

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
                      <p>{formatDate(studentData.personalInfo.birthDate)}</p>
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
                  <div>
                    <p className="text-sm text-gray-500">Current Term</p>
                    <p>{studentData.academicInfo.currentTerm}</p>
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
                        {classItem.room && (
                          <div className="text-sm text-gray-500">Room: {classItem.room}</div>
                        )}
                      </div>
                    ))}
                    {studentData.academicInfo.schedule.length === 0 && (
                      <div className="p-4 text-center text-gray-500">
                        No schedule available
                      </div>
                    )}
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
                  {studentData.medicalInfo.accommodations !== "None" && (
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
                      <p>{studentData.behaviorInfo.attendance.absences}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Tardies</p>
                      <p>{studentData.behaviorInfo.attendance.tardies}</p>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 mb-2">Disciplinary Incidents</p>
                    <div className="space-y-3">
                      {studentData.behaviorInfo.incidents.map((incident: any, index: number) => (
                        <div key={index} className="border-l-4 border-red-500 pl-4 py-2">
                          <div className="flex justify-between text-sm text-gray-500 mb-1">
                            <span>{formatDate(incident.date)}</span>
                          </div>
                          <p className="font-medium">{incident.description}</p>
                          <p className="text-sm text-gray-600">Resolution: {incident.resolution}</p>
                        </div>
                      ))}
                      {studentData.behaviorInfo.incidents.length === 0 && (
                        <p className="text-gray-500">No disciplinary incidents</p>
                      )}
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
                            <span>{formatDate(award.date)}</span>
                          </div>
                          <p className="font-medium">{award.description}</p>
                        </div>
                      ))}
                      {studentData.behaviorInfo.awards.length === 0 && (
                        <p className="text-gray-500">No awards yet</p>
                      )}
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Total Points</p>
                    <p className="font-bold text-lg">{studentData.behaviorInfo.points.totalPoints}</p>
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
                {studentData.emergencyContacts.length === 0 && (
                  <p className="text-gray-500 col-span-2 text-center">No emergency contacts available</p>
                )}
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
                {studentData.extracurriculars.length === 0 && (
                  <p className="text-gray-500 col-span-2 text-center">No extracurricular activities</p>
                )}
              </div>
            </Card>
          </TabsContent>

          {/* Individual Tabs */}
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
                      <p>{formatDate(studentData.personalInfo.birthDate)}</p>
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
                  <div>
                    <p className="text-sm text-gray-500">Current Term</p>
                    <p>{studentData.academicInfo.currentTerm}</p>
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
                        {classItem.room && (
                          <div className="text-sm text-gray-500">Room: {classItem.room}</div>
                        )}
                      </div>
                    ))}
                    {studentData.academicInfo.schedule.length === 0 && (
                      <div className="p-4 text-center text-gray-500">
                        No schedule available
                      </div>
                    )}
                  </div>
                </div>
              </div>
              
              {/* Current Courses */}
              {studentData.academicInfo.currentCourses.length > 0 && (
                <div className="border-t pt-6 mt-6">
                  <h3 className="text-lg font-bold mb-3 text-gray-800">Current Courses</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {studentData.academicInfo.currentCourses.map((course: any, index: number) => (
                      <Card key={index} className="p-4">
                        <h4 className="font-medium">{course.name}</h4>
                        <p className="text-sm text-gray-600">Code: {course.code}</p>
                        <p className="text-sm text-gray-600">Credits: {course.credits}</p>
                        <p className="text-sm text-gray-600">Current Grade: {course.currentGrade}</p>
                      </Card>
                    ))}
                  </div>
                </div>
              )}
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
                  {studentData.medicalInfo.medications.length > 0 && (
                    <div>
                      <p className="text-sm text-gray-500">Medications</p>
                      <p>{studentData.medicalInfo.medications.join(", ")}</p>
                    </div>
                  )}
                </div>
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-gray-500">IEP Status</p>
                    <p>{studentData.medicalInfo.iepStatus}</p>
                  </div>
                  {studentData.medicalInfo.iepExpiryDate && (
                    <div>
                      <p className="text-sm text-gray-500">IEP Expiry Date</p>
                      <p>{formatDate(studentData.medicalInfo.iepExpiryDate)}</p>
                    </div>
                  )}
                  {studentData.medicalInfo.accommodations !== "None" && (
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
                      <p>{studentData.behaviorInfo.attendance.absences}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500">Tardies</p>
                      <p>{studentData.behaviorInfo.attendance.tardies}</p>
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 mb-2">Disciplinary Incidents</p>
                    <div className="space-y-3">
                      {studentData.behaviorInfo.incidents.map((incident: any, index: number) => (
                        <div key={index} className="border-l-4 border-red-500 pl-4 py-2">
                          <div className="flex justify-between text-sm text-gray-500 mb-1">
                            <span>{formatDate(incident.date)}</span>
                          </div>
                          <p className="font-medium">{incident.description}</p>
                          <p className="text-sm text-gray-600">Resolution: {incident.resolution}</p>
                        </div>
                      ))}
                      {studentData.behaviorInfo.incidents.length === 0 && (
                        <p className="text-gray-500">No disciplinary incidents</p>
                      )}
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
                            <span>{formatDate(award.date)}</span>
                          </div>
                          <p className="font-medium">{award.description}</p>
                        </div>
                      ))}
                      {studentData.behaviorInfo.awards.length === 0 && (
                        <p className="text-gray-500">No awards yet</p>
                      )}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm text-gray-500">Points Summary</p>
                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <p className="text-xs text-gray-500">Total Points</p>
                        <p className="font-bold">{studentData.behaviorInfo.points.totalPoints}</p>
                      </div>
                      <div>
                        <p className="text-xs text-gray-500">Current Rank</p>
                        <p className="font-bold">#{studentData.behaviorInfo.points.currentRank}</p>
                      </div>
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
                {studentData.emergencyContacts.length === 0 && (
                  <p className="text-gray-500 col-span-2 text-center">No emergency contacts available</p>
                )}
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
                {studentData.extracurriculars.length === 0 && (
                  <p className="text-gray-500 col-span-2 text-center">No extracurricular activities</p>
                )}
              </div>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </section>
  );
}