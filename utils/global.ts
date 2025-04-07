import { dayOfTheWeek } from "@/constants/global";

export function getTheDayOfTheWeek(n: number) {
  return !isNaN(n) ? dayOfTheWeek[n] : "Not defined";
}

export function convertToClassDays(
  obj: Record<string, { start_time: string; end_time: string }>
) {
  const data: {
    id: number;
    day: string;
    start_time: string;
    end_time: string;
  }[] = [];

  Object.entries(obj).forEach(([key, value]) => {
    console.log(`${key}: ${value}`);
    data.push({
      id: data.length + 1,
      day: key + "",
      start_time: value.start_time,
      end_time: value.end_time,
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
