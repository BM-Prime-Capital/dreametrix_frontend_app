import { title } from "node:process";
export interface UserNavigationInfo {
  label: string;
  basePath: string;
}

export interface MenuRoute {
  path: string;
  icon: any;
  label: string;
}

export interface ClassDay {
  id: number;
  day: string;
  hour: string;
  munite: string;
  dayPart: string;
}
