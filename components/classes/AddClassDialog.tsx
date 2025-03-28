"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Pencil, Plus } from "lucide-react";
import { useEffect, useState } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ISchoolClass } from "@/types";
import { useList } from "@/hooks/useList";
import { getTeachers } from "@/services/TeacherService";
import { localStorageKey } from "@/constants/global";
import { createClass, updateClass } from "@/services/ClassService";
import { useRequestInfo } from "@/hooks/useRequestInfo";
import { getGrades, getSubjects } from "@/services/DigitalLibraryService";

interface ClassDay {
  id: number;
  day: string;
  hour: string;
  minute: string;
  dayPart: string;
}

const schoolClassInit = {
  name: "",
  subject_in_all_letter: "",
  subject_in_short: "",
  hours_and_dates_of_course_schedule: {
    Monday: [],
    Wednesday: [],
    Friday: [],
  },
  description: "",
  grade: "",
  teacher: 1,
  students: [],
};

export function AddClassDialog({
  setRefreshTime,
  existingClass,
}: {
  setRefreshTime: Function;
  existingClass?: ISchoolClass;
}) {
  const [open, setOpen] = useState(false);
  const { list: teachers } = useList(getTeachers);
  const { list: subjects } = useList(getSubjects);
  const [grades, setGrades] = useState<string[]>([]);
  const userData = JSON.parse(localStorage.getItem(localStorageKey.USER_DATA)!);
  const { tenantDomain, accessToken, refreshToken } = useRequestInfo();
  const [isSubmiting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState("");

  const [schoolClass, setSchoolClass] = useState<ISchoolClass>(
    existingClass ? existingClass : schoolClassInit
  );

  const [classDays, setClassDays] = useState<ClassDay[]>([
    { id: 1, day: "Monday", hour: "01", minute: "01", dayPart: "AM" },
  ]);

  const addNewClassDay = () => {
    const newId = classDays[classDays.length - 1].id + 1;
    setClassDays([
      ...classDays,
      { id: newId, day: "Monday", hour: "00", minute: "00", dayPart: "AM" },
    ]);
  };

  const handleClassDayChange = (
    classDayId: number,
    fieldName: keyof ClassDay,
    newValue: string
  ) => {
    setClassDays(
      classDays.map((day) =>
        day.id === classDayId ? { ...day, [fieldName]: newValue } : day
      )
    );
  };

  const handleDeleteClassDay = (id: number) => {
    setClassDays(classDays.filter((day) => day.id !== id));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    const rep = existingClass
      ? await updateClass(schoolClass, tenantDomain, accessToken, refreshToken)
      : await createClass(schoolClass, tenantDomain, accessToken, refreshToken);
    if (!rep) {
      setMessage(
        "The class creation failed, be sure that you are not creating an existing class, if this persists, please contact the admin."
      );
    } else {
      setRefreshTime(new Date().toISOString());
      setOpen(false);
    }

    setIsSubmitting(false);
  };

  useEffect(() => {
    const loadGrades = async () => {
      if (accessToken) {
        if (schoolClass && schoolClass.subject_in_short) {
          const grades = await getGrades(
            schoolClass.subject_in_short,
            tenantDomain,
            accessToken,
            refreshToken
          );
          setGrades(grades);
        }
      }
    };

    loadGrades();
  }, [tenantDomain, accessToken, refreshToken]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {existingClass ? (
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 hover:bg-blue-50"
          >
            <Pencil className="h-4 w-4 text-[#25AAE1]" />
          </Button>
        ) : (
          <Button className="gap-2 text-base bg-blue-500 hover:bg-blue-600">
            <Plus className="h-5 w-5" />
            Add New Class
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-blue-500">
            Add New Class
          </DialogTitle>
        </DialogHeader>
        <div className="flex flex-col gap-4">
          {message ? <label className="text-red-500 p-2">{message}</label> : ""}
          <form onSubmit={(e) => handleSubmit(e)}>
            <div className="grid grid-cols-2 gap-4 py-4">
              <select
                style={{ border: "solid 1px #eee" }}
                className="px-2 py-1 bg-white rounded-lg"
                placeholder="Subject in short"
                value={schoolClass.subject_in_short}
                onChange={(e) =>
                  setSchoolClass({
                    ...schoolClass,
                    subject_in_short: e.target.value,
                  })
                }
                required
              >
                <option disabled value={""}>
                  Select Subject in short
                </option>
                {subjects?.map((subject: string, index: number) => (
                  <option key={index}>{subject}</option>
                ))}
              </select>

              <Input
                className="rounded-lg"
                placeholder="Subject in all letter"
                value={schoolClass.subject_in_all_letter}
                onChange={(e) =>
                  setSchoolClass({
                    ...schoolClass,
                    subject_in_all_letter: e.target.value,
                  })
                }
                required
              />

              <select
                style={{ border: "solid 1px #eee" }}
                className="px-2 py-1 bg-white rounded-lg"
                placeholder="Subject in short"
                value={schoolClass.grade}
                onChange={(e) =>
                  setSchoolClass({
                    ...schoolClass,
                    grade: e.target.value,
                  })
                }
                required
              >
                <option disabled selected value={""}>
                  Select Grade
                </option>
                {grades?.map((grade: number, index: number) => (
                  <option key={index} value={grade + ""}>
                    {grade}
                  </option>
                ))}
              </select>

              <Select
                value={`${
                  userData.role === "teacher"
                    ? userData.owner_id
                    : schoolClass.teacher
                }`}
                onValueChange={(value) =>
                  setSchoolClass({
                    ...schoolClass,
                    teacher: Number.parseInt(value),
                  })
                }
                required
              >
                <SelectTrigger>
                  <SelectValue placeholder="Teacher" />
                </SelectTrigger>
                <SelectContent>
                  {userData.role === "teacher" ? (
                    <SelectItem
                      aria-selected
                      key={`${userData.owner_id}`}
                      value={`${userData.owner_id}`}
                    >
                      {userData.username}
                    </SelectItem>
                  ) : (
                    <>
                      {teachers.length > 0 ? (
                        teachers.map((teacher: { id: number; name: string }) => (                          
                        <SelectItem key={teacher.id} value={`${teacher.id}`}>
                            {teacher.name}
                          </SelectItem>
                        ))
                      ) : (
                        <SelectItem key={0} value={"0"} disabled>
                          {"No teacher"}
                        </SelectItem>
                      )}
                    </>
                  )}
                </SelectContent>
              </Select>
            </div>

            <div className="border rounded-lg p-4 space-y-4">
              <label className="text-sm font-medium text-gray-700">
                Class Days
              </label>

              {classDays.map((day) => (
                <div key={day.id} className="grid grid-cols-4 gap-2">
                  <Select
                    value={day.day}
                    onValueChange={(value) =>
                      handleClassDayChange(day.id, "day", value)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Day" />
                    </SelectTrigger>
                    <SelectContent>
                      {[
                        "Monday",
                        "Tuesday",
                        "Wednesday",
                        "Thursday",
                        "Friday",
                      ].map((d) => (
                        <SelectItem key={d} value={d}>
                          {d}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>

                  <Input
                    type="number"
                    min="1"
                    max="12"
                    value={day.hour}
                    onChange={(e) =>
                      handleClassDayChange(day.id, "hour", e.target.value)
                    }
                    className="w-full"
                    placeholder="Hour"
                  />

                  <Input
                    type="number"
                    min="0"
                    max="59"
                    value={day.minute}
                    onChange={(e) =>
                      handleClassDayChange(day.id, "minute", e.target.value)
                    }
                    className="w-full"
                    placeholder="Minute"
                  />

                  <Select
                    value={day.dayPart}
                    onValueChange={(value) =>
                      handleClassDayChange(day.id, "dayPart", value)
                    }
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="AM/PM" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="AM">AM</SelectItem>
                      <SelectItem value="PM">PM</SelectItem>
                    </SelectContent>
                  </Select>

                  {classDays.length > 1 && (
                    <Button
                      variant="ghost"
                      className="text-red-500 hover:text-red-600"
                      onClick={() => handleDeleteClassDay(day.id)}
                    >
                      Remove
                    </Button>
                  )}
                </div>
              ))}

              <Button
                variant="outline"
                onClick={addNewClassDay}
                className="w-full mt-2"
              >
                Add Another Day
              </Button>
            </div>

            <div className="flex justify-end gap-2 mt-4">
              <Button variant="outline" onClick={() => setOpen(false)}>
                Cancel
              </Button>
              <Button
                disabled={isSubmiting}
                type="submit"
                className="bg-blue-500 hover:bg-blue-600"
              >
                {isSubmiting
                  ? "Submitting..."
                  : existingClass
                  ? "Update Class"
                  : "Create Class"}
              </Button>
            </div>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
