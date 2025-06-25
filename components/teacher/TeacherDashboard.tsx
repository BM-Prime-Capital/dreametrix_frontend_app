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
import { ActivityFeed } from "../layout/ActivityFeed";
import { MinusIcon, PlusIcon } from "lucide-react";

export default function TeacherDashboard() {
  const [feedbackDuration, setFeedbackDuration] = useState<number>(2);
  const [newSubject, setNewSubject] = useState("");

  const { list: classes } = useList(getClasses);

  // TODO get subjects from DB
  const [subjects, setSubjects] = useState<string[]>([
    "Science",
    "Mathematics",
  ]);

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
    <section className="flex flex-col w-full gap-6">
      {/* Header improved */}
      <div className="flex justify-between items-center bg-[#3e81d4] px-6 py-4 rounded-lg shadow-sm">
        <PageTitleH1 title="Teacher Dashboard" className="text-white font-semibold" />
        <div className="flex items-center gap-2">
          <span className="text-white/90 text-sm flex items-center">
            Welcome back, {userData.full_name.split(' ')[0]}
            <span className="ml-2 animate-waving-hand">👋</span>
          </span>
        </div>
      </div>

      {/* Grid principale améliorée */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-6 px-4 sm:px-6">
        <div className="space-y-6">
          {/* Carte de profil améliorée */}
          <Card className="p-6">
            <div className="flex flex-col sm:flex-row items-center gap-6">
              <UserAvatar className="h-20 w-20 border-2 border-white shadow-md" />
              <div className="text-center sm:text-left space-y-2">
                <PageTitleH2 title={userData.full_name} className="text-gray-800" />
                <p className="text-gray-600 text-sm">{tenantData.name}</p>
                <div className="flex gap-3 justify-center sm:justify-start pt-2">
                  {[teacherImages.ai, teacherImages.profile, teacherImages.settings].map((img, i) => (
                    <button key={i} className="p-2 rounded-full bg-gray-100 hover:bg-gray-200 transition-colors">
                      <Image src={img} alt="" width={20} height={20} className="opacity-70" />
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </Card>

          {/* Section AI Assistant améliorée */}
          <Card className="p-6 bg-[#f0f9ff] border-[#bfdbfe]">
            <div className="flex items-center gap-3 mb-4">
              <Image
                src={teacherImages.ai}
                alt="AI Assistant"
                width={24}
                height={24}
                className="opacity-90"
              />
              <PageTitleH2
                title="AI Teacher Assistance"
                className="text-[#1e40af]"
              />
            </div>

            <div className="space-y-5 pl-2">
              {/* Item 1 */}
              <div className="flex gap-4">
                <div className="flex-shrink-0 pt-1">
                  <Image
                    src={teacherImages.ai1}
                    alt="Alert"
                    width={24}
                    height={24}
                    className="opacity-80"
                  />
                </div>
                <div>
                  <p className="text-gray-800">
                    Students who need you to{" "}
                    <span className="font-semibold text-[#1e40af]">
                      contact their parents
                    </span>
                  </p>
                  <ul className="mt-2 space-y-2 pl-1">
                    {["Marta Sae", "John Smith"].map((name) => (
                      <li key={name} className="flex items-center gap-2">
                        <span className="font-medium text-gray-700">{name}</span>
                        <ContactParentDialog childrenName={name} />
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Items 2 et 3 */}
              {[
                {
                  icon: teacherImages.ai2,
                  text: "Reminder that tomorrow",
                  highlight: "Class 5 - Math has exam"
                },
                {
                  icon: teacherImages.ai2,
                  text: "Reminder that tomorrow",
                  highlight: "Class 5 - Science has exam"
                }
              ].map((item, index) => (
                <div key={index} className="flex gap-4">
                  <div className="flex-shrink-0 pt-1">
                    <Image
                      src={item.icon}
                      alt="Reminder"
                      width={24}
                      height={24}
                      className="opacity-80"
                    />
                  </div>
                  <p className="text-gray-800">
                    {item.text}{" "}
                    <span className="font-semibold text-[#1e40af]">
                      {item.highlight}
                    </span>
                  </p>
                </div>
              ))}
            </div>
          </Card>

          <Card className="p-6">
            <div className="space-y-6">
              {/* En-tête */}
              <div className="flex items-center gap-3 border-b pb-4 border-gray-200">
                <Image
                  src={teacherImages.settings}
                  alt="Settings"
                  width={24}
                  height={24}
                  className="opacity-80"
                />
                <PageTitleH2 title="Settings" className="text-gray-800" />
              </div>

              {/* Section Subjects */}
              <div className="space-y-4">
                <label className="block text-sm font-medium text-gray-700">Subjects</label>
                <div className="flex flex-wrap gap-2 p-3 bg-gray-100 rounded-xl">
                  {subjects.map((subject, index) => (
                    <MultiSelectionItem
                      key={index}
                      title={subject}
                      deleteCallback={() => deleteSubject(subject)}
                    />
                  ))}
                  <div className="flex items-center w-full">
                    <Input
                      value={newSubject}
                      onChange={(e) => setNewSubject(e.target.value)}
                      placeholder="Add subject"
                      className="flex-1 rounded-l-full bg-white border-r-0 focus:ring-2 focus:ring-blue-500"
                    />
                    <Button
                      onClick={() => addSubject(newSubject)}
                      className="rounded-r-full bg-blue-600 hover:bg-blue-700 px-4"
                    >
                      <PlusIcon className="h-5 w-5 text-white" />
                    </Button>
                  </div>
                </div>
              </div>

              {/* Section Feedback Duration */}
              <div className="space-y-2">
                <label className="block text-sm font-medium text-gray-700">
                  Maximum duration for feedback audio (minutes)
                </label>
                <div className="flex items-center">
                  <Button
                    variant="outline"
                    onClick={decrementFeedbackDuration}
                    disabled={feedbackDuration <= 2}
                    className="h-10 w-10 rounded-r-none border-r-0"
                  >
                    <MinusIcon className="h-4 w-4" />
                  </Button>
                  <div className="flex items-center justify-center h-10 w-12 border-y border-gray-300 bg-white text-gray-800 font-medium">
                    {feedbackDuration.toString().padStart(2, '0')}
                  </div>
                  <Button
                    variant="outline"
                    onClick={incrementFeedbackDuration}
                    disabled={feedbackDuration >= 9}
                    className="h-10 w-10 rounded-l-none border-l-0"
                  >
                    <PlusIcon className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {/* Boutons d'action */}
              <div className="flex gap-3 pt-4">
                <Button className="flex-1 bg-blue-600 hover:bg-blue-700 rounded-full">
                  Save Changes
                </Button>
                <Button variant="outline" className="flex-1 rounded-full">
                  Cancel
                </Button>
              </div>
            </div>
          </Card>
        </div>

        {/* Activity Feed à droite */}
        <ActivityFeed />
      </div>
    </section>
  );
}
