"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card } from "@/components/ui/card";
import PageTitleH1 from "../ui/page-title-h1";
import PageTitleH2 from "../ui/page-title-h2";
import Image from "next/image";
import { teacherImages } from "@/constants/images";
import MultiSelectionItem from "../ui/multi-selection-item";
import { useEffect, useState } from "react";
import ContactParentDialog from "./ContactParentDialog";
import { localStorageKey } from "@/constants/global";
import UserAvatar from "../ui/user-avatar";
import { useList } from "@/hooks/useList";
import { getClasses } from "@/services/ClassService";
import { getAssignments } from "@/services/AssignmentService";
import { ActivityFeed } from "../layout/ActivityFeed";
import { MinusIcon, PlusIcon } from "lucide-react";

export default function TeacherDashboard() {
  const [feedbackDuration, setFeedbackDuration] = useState<number>(2);
  const [newSubject, setNewSubject] = useState("");

  const { list: classes } = useList(getClasses);
  const { list: assignments } = useList(getAssignments);
  
  // Extract unique subjects from classes
  const [subjects, setSubjects] = useState<string[]>([]);
  
  useEffect(() => {
    if (classes && classes.length > 0) {
      const uniqueSubjects = [...new Set(classes.map(cls => cls.subject || ""))]
        .filter(subject => subject !== "");
      setSubjects(uniqueSubjects);
    }
  }, [classes]);

  const userData = JSON.parse(localStorage.getItem(localStorageKey.USER_DATA)!);
  const tenantData = JSON.parse(
    localStorage.getItem(localStorageKey.TENANT_DATA)!
  );

  const incrementFeedbackDuration = () => {
    if (feedbackDuration <= 9) {
      setFeedbackDuration(feedbackDuration + 1);
    }
  };
  const decrementFeedbackDuration = () => {
    if (feedbackDuration >= 2) {
      setFeedbackDuration(feedbackDuration - 1);
    }
  };

  const deleteSubject = (subject: string) => {
    const newSubjects = subjects.filter(
      (subjectValue) => subjectValue != subject
    );
    setSubjects(newSubjects);
  };

  const addSubject = (subject: string) => {
    const existingSubject = subjects.find(
      (subjectValue) => subject.toLowerCase() === subjectValue.toLowerCase()
    );
    if (!existingSubject && subject) {
      setSubjects([...subjects, subject]);
      setNewSubject("");
    }
  };

  useEffect(() => {
    console.log("classes ok ==> ", classes);
    localStorage.setItem(localStorageKey.ALL_CLASSES, JSON.stringify(classes));
  }, [classes]);

  return (
    <section className="flex flex-col w-full h-full bg-gradient-to-br from-blue-50/30 to-purple-50/20">
      {/* Enhanced Header */}
      <div className="flex justify-between items-center bg-[#79bef2] px-8 py-6 shadow-xl rounded-2xl mx-6 mt-8">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
            <svg className="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 21l4-4 4 4" />
            </svg>
          </div>
          <div>
            <PageTitleH1 title="Teacher Dashboard" className="text-white font-bold text-2xl" />
            <p className="text-blue-100 text-sm mt-1">Your teaching command center</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="bg-white/20 backdrop-blur-sm rounded-xl px-4 py-2">
            <span className="text-white text-sm font-medium">
              {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}
            </span>
          </div>
          <span className="text-white/95 text-base flex items-center font-medium">
            Welcome, {userData.full_name.split(' ')[0]}
            <span className="ml-2 text-xl">👋</span>
          </span>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 mx-6 pb-8 space-y-8 overflow-auto">
        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-2">
          <Card className="p-6 bg-white/80 backdrop-blur-sm shadow-lg border-0">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-slate-100 rounded-xl">
                <svg className="w-6 h-6 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                </svg>
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-800">{classes.length}</p>
                <p className="text-sm font-medium text-gray-600">Active Classes</p>
              </div>
            </div>
          </Card>
          
          <Card className="p-6 bg-white/80 backdrop-blur-sm shadow-lg border-0">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-slate-100 rounded-xl">
                <svg className="w-6 h-6 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-800">{subjects.length}</p>
                <p className="text-sm font-medium text-gray-600">Subjects</p>
              </div>
            </div>
          </Card>
          
          <Card className="p-6 bg-white/80 backdrop-blur-sm shadow-lg border-0">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-slate-100 rounded-xl">
                <svg className="w-6 h-6 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-800">{assignments?.length || 0}</p>
                <p className="text-sm font-medium text-gray-600">Assignments</p>
              </div>
            </div>
          </Card>
          
          <Card className="p-6 bg-white/80 backdrop-blur-sm shadow-lg border-0">
            <div className="flex items-center gap-4">
              <div className="p-3 bg-slate-100 rounded-xl">
                <svg className="w-6 h-6 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-800">
                  {assignments ? assignments.filter(a => a.status === 'pending' || !a.reviewed).length : 0}
                </p>
                <p className="text-sm font-medium text-gray-600">Pending Reviews</p>
              </div>
            </div>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* AI Assistant */}
          <Card className="p-8 bg-gradient-to-br from-blue-50/80 to-purple-50/60 border-blue-200/50 shadow-lg backdrop-blur-sm">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-slate-100 rounded-lg">
                <svg className="w-5 h-5 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
              <PageTitleH2 title="AI Assistant" className="text-slate-800" />
            </div>

            <div className="space-y-4">
              <div className="flex items-start gap-3 p-4 bg-white/60 rounded-xl">
                <div className="w-2 h-2 bg-red-500 rounded-full mt-2"></div>
                <div>
                  <p className="font-medium text-gray-800">Parent Contact Needed</p>
                  <p className="text-sm text-gray-600 mt-1">
                    {classes.filter(c => c.needsParentContact).length || 0} students require parent communication
                  </p>
                  <div className="flex gap-2 mt-2">
                    {classes
                      .filter(c => c.needsParentContact)
                      .slice(0, 2)
                      .map((cls) => (
                        <ContactParentDialog key={cls.id} childrenName={cls.studentName || 'Student'} />
                      ))}
                  </div>
                </div>
              </div>
              
              <div className="flex items-start gap-3 p-4 bg-white/60 rounded-xl">
                <div className="w-2 h-2 bg-yellow-500 rounded-full mt-2"></div>
                <div>
                  <p className="font-medium text-gray-800">Upcoming Exams</p>
                  <p className="text-sm text-gray-600 mt-1">Class 5 - Math & Science exams tomorrow</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3 p-4 bg-white/60 rounded-xl">
                <div className="w-2 h-2 bg-green-500 rounded-full mt-2"></div>
                <div>
                  <p className="font-medium text-gray-800">All Caught Up</p>
                  <p className="text-sm text-gray-600 mt-1">No other urgent tasks at this time</p>
                </div>
              </div>
            </div>
          </Card>

          {/* Quick Actions */}
          <Card className="p-8 bg-white/80 backdrop-blur-sm shadow-lg border-0">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 bg-slate-100 rounded-lg">
                <svg className="w-5 h-5 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <PageTitleH2 title="Quick Actions" className="text-gray-800" />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              {[
                { icon: "📝", title: "Create Assignment", desc: "New homework or task" },
                { icon: "📊", title: "View Reports", desc: "Student progress" },
                { icon: "💬", title: "Send Message", desc: "Contact parents" },
                { icon: "📅", title: "Schedule Event", desc: "Plan activities" },
                { icon: "🎯", title: "Test Prep", desc: "Practice questions" },
                { icon: "⭐", title: "Give Rewards", desc: "Student recognition" }
              ].map((action, index) => (
                <button key={index} className="p-4 bg-gray-50 hover:bg-gray-100 rounded-xl transition-colors text-left">
                  <div className="text-2xl mb-2">{action.icon}</div>
                  <p className="font-medium text-gray-800 text-sm">{action.title}</p>
                  <p className="text-xs text-gray-600">{action.desc}</p>
                </button>
              ))}
            </div>
          </Card>
        </div>

        {/* Settings - Simplified */}
        <Card className="p-8 bg-white/80 backdrop-blur-sm shadow-lg border-0">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-gray-100 rounded-lg">
              <svg className="w-5 h-5 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <PageTitleH2 title="Quick Settings" className="text-gray-800" />
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="space-y-4">
              <label className="block text-sm font-semibold text-gray-700">Teaching Subjects</label>
              <div className="flex flex-wrap gap-2 p-4 bg-gray-50 rounded-xl">
                {subjects.map((subject, index) => (
                  <MultiSelectionItem
                    key={index}
                    title={subject}
                    deleteCallback={() => deleteSubject(subject)}
                  />
                ))}
                <div className="flex items-center gap-2 mt-2">
                  <Input
                    value={newSubject}
                    onChange={(e) => setNewSubject(e.target.value)}
                    placeholder="Add subject"
                    className="flex-1 rounded-lg bg-white"
                  />
                  <Button
                    onClick={() => addSubject(newSubject)}
                    className="bg-slate-600 hover:bg-slate-700 rounded-lg px-4"
                  >
                    <PlusIcon className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            </div>
            
            <div className="space-y-4">
              <label className="block text-sm font-semibold text-gray-700">Feedback Duration (minutes)</label>
              <div className="flex items-center justify-center">
                <Button
                  variant="outline"
                  onClick={decrementFeedbackDuration}
                  disabled={feedbackDuration <= 2}
                  className="h-12 w-12 rounded-l-xl"
                >
                  <MinusIcon className="h-5 w-5" />
                </Button>
                <div className="flex items-center justify-center h-12 w-16 border-y border-gray-300 bg-white text-gray-800 font-bold text-lg">
                  {feedbackDuration}
                </div>
                <Button
                  variant="outline"
                  onClick={incrementFeedbackDuration}
                  disabled={feedbackDuration >= 9}
                  className="h-12 w-12 rounded-r-xl"
                >
                  <PlusIcon className="h-5 w-5" />
                </Button>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </section>
  );
}
