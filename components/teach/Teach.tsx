"use client";

import PageTitleH1 from "@/components/ui/page-title-h1";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { format } from "date-fns";
import { FullScreenCalendar } from "./FullScreenCalendar";
import { Button } from "@/components/ui/button";
import { Calendar, BookOpen, FileText } from "lucide-react";

export default function Teach() {
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const router = useRouter();

  const handleDateSelect = (date: Date) => {
    setSelectedDate(date);
    const dateString = format(date, "yyyy-MM-dd");
    router.push(`/teacher/teach/${dateString}`);
  };

  return (
    <section className="flex flex-col h-full w-full bg-gradient-to-br from-blue-50/30 to-indigo-50/20">
      {/* Enhanced Header */}
      <div className="flex justify-between items-center bg-[#79bef2] px-8 py-6 shadow-xl rounded-2xl mx-6 mt-8">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
            <svg className="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
          <div>
            <PageTitleH1 title="Teaching Calendar" className="text-white font-bold text-2xl" />
            <p className="text-blue-100 text-sm mt-1">Plan and organize your teaching materials</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="bg-white/10 backdrop-blur-sm rounded-xl px-4 py-2">
            <span className="text-white text-sm font-medium">
              {selectedDate ? format(selectedDate, "MMM d, yyyy") : "Select a date"}
            </span>
          </div>
        </div>
      </div>

      {/* Content Area */}
      <div className="flex-1 mx-6 pb-8">
        <div className="grid grid-cols-1 xl:grid-cols-4 gap-8 h-full mt-2">
          {/* Calendar */}
          <div className="xl:col-span-3">
            <FullScreenCalendar 
              onDateSelect={handleDateSelect} 
              selectedDate={selectedDate} 
            />
          </div>

          {/* Quick Actions Sidebar */}
          <div className="xl:col-span-1 space-y-6">
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-100 p-6">
              <h3 className="font-bold text-lg mb-4 flex items-center gap-2">
                <Calendar className="w-5 h-5 text-blue-600" />
                Quick Actions
              </h3>
              <div className="space-y-3">
                <Button 
                  className="w-full justify-start bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white"
                  onClick={() => {
                    const today = new Date();
                    const dateString = format(today, "yyyy-MM-dd");
                    router.push(`/teacher/teach/${dateString}`);
                  }}
                >
                  <FileText className="w-4 h-4 mr-2" />
                  Today's Materials
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full justify-start"
                  onClick={() => {
                    const tomorrow = new Date();
                    tomorrow.setDate(tomorrow.getDate() + 1);
                    const dateString = format(tomorrow, "yyyy-MM-dd");
                    router.push(`/teacher/teach/${dateString}`);
                  }}
                >
                  <BookOpen className="w-4 h-4 mr-2" />
                  Tomorrow's Plan
                </Button>
              </div>
            </div>

            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-100 p-6">
              <h3 className="font-bold text-lg mb-4">Recent Activity</h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">Lesson plan updated</p>
                    <p className="text-xs text-gray-500">Math - Algebra basics</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">Homework assigned</p>
                    <p className="text-xs text-gray-500">Due tomorrow</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                  <div className="flex-1">
                    <p className="text-sm font-medium">Resources uploaded</p>
                    <p className="text-xs text-gray-500">3 new files</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg border border-gray-100 p-6">
              <h3 className="font-bold text-lg mb-4">This Week</h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Lesson Plans</span>
                  <span className="font-semibold text-green-600">5/5</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Homework Sets</span>
                  <span className="font-semibold text-blue-600">3/5</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Resources</span>
                  <span className="font-semibold text-purple-600">12</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}