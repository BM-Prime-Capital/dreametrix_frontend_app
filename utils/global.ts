import { dayOfTheWeek } from "@/constants/global";

export function getTheDayOfTheWeek(n: number) {
  return !isNaN(n) ? dayOfTheWeek[n] : "Not defined";
}

export function convertToClassDays(
  obj: Record<string, { start_time: string; end_time: string } | { start_time: string; end_time: string }[]>
) {
  const data: {
    id: number;
    day: string;
    start_time: string;
    end_time: string;
  }[] = [];

  const toHHmm = (t: string | undefined) => {
    if (!t) return "";
    // Accept HH:mm or HH:mm:ss
    const trimmed = t.trim();
    if (/^\d{1,2}:\d{2}:\d{2}$/.test(trimmed)) return trimmed.slice(0, 5);
    return trimmed;
  };

  Object.entries(obj).forEach(([key, value]) => {
    const slots = Array.isArray(value) ? value : [value];
    slots.forEach((slot) => {
      data.push({
        id: data.length + 1,
        day: key + "",
        start_time: toHHmm(slot.start_time),
        end_time: toHHmm(slot.end_time),
      });
    });
  });

  return data;
}

export function convertToClassSchedule(
  data: {
    id: number;
    day: string;
    start_time: string;
    end_time: string;
  }[]
) {
  const obj: Record<string, { start_time: string; end_time: string }> = {};

  for (const el of data) {
    obj[el.day] = { start_time: el.start_time, end_time: el.end_time };
  }

  return obj;
}

export const getFormatedDate = (
  date: Date,
  displayHour = false,
  displayMinute = false,
  displaySecond = false
) => {
  date = new Date(date);

  function padTo2Digits(num: any) {
    return num.toString().padStart(2, "0");
  }

  const mainDate = [
    date.getFullYear(),
    padTo2Digits(date.getMonth() + 1),
    padTo2Digits(date.getDate()),
  ].join("-");

  const time = [];

  if (displayHour) {
    time.push(padTo2Digits(date.getHours()));
  }

  if (displayMinute) {
    time.push(padTo2Digits(date.getMinutes()));
  }

  if (displaySecond) {
    time.push(padTo2Digits(date.getSeconds()));
  }

  const timeString = time.join(":");

  return `${mainDate} ${timeString}`;
};



export const LessonPlanDuration =[
  {
    title: "Pick a duration",
    value:""
  }
    ,
  {
    title:"5 minutes",
    value:"5min"
  },
  {
    title:"10 minutes",
    value:"10min"
  },  {
    title:"15 minutes",
    value:"15min"
  },  {
    title:"20 minutes",
    value:"20min"
  },  {
    title:"25 minutes",
    value:"25min"
  },  {
    title:"30 minutes",
    value:"30min"
  },  {
    title:"35 minutes",
    value:"35min"
  },  {
    title:"40 minutes",
    value:"40min"
  },  {
    title:"45 minutes",
    value:"45min"
  },  {
    title:"50 minutes",
    value:"50min"
  },  {
    title:"55 minutes",
    value:"55min"
  },  {
    title:"60 minutes",
    value:"60min"
  },
]
