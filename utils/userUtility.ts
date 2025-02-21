import { userPath, userTitle } from "@/constants/userConstants";
import { UserNavigationInfo } from "@/types";

export function getUserNavigationInfo(userType: string): UserNavigationInfo {
  const defaultUserNavigation = {
    label: userTitle.TEACHER,
    basePath: userPath.TEACHER_BASE_PATH,
  };
  const navigationMap: Record<typeof userType, UserNavigationInfo> = {
    school_admin: {
      label: userTitle.SCHOOL_ADMIN,
      basePath: userPath.SCHOOL_ADMIN_BASE_PATH,
    },
    student: { label: userTitle.STUDENT, basePath: userPath.STUDENT_BASE_PATH },
    parent: { label: userTitle.PARENT, basePath: userPath.PARENT_BASE_PATH },
    teacher: defaultUserNavigation,
  };

  return navigationMap[userType] ?? defaultUserNavigation;
}
