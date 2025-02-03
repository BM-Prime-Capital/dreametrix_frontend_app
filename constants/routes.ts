import { userPath } from "./userConstants";
import { generalImages } from "./images";

export const SchoolAdminRoutes = [
  {
    path: userPath.SCHOOL_ADMIN_BASE_PATH,
    icon: generalImages.home,
    label: "HOME",
  },
  {
    path: `${userPath.SCHOOL_ADMIN_BASE_PATH}/classes`,
    icon: generalImages.assignments, // TODO: replace with the classes logo
    label: "CLASSES",
  },
  {
    path: `${userPath.SCHOOL_ADMIN_BASE_PATH}/teachers`,
    icon: generalImages.teach,
    label: "TEACHERS",
  },
  {
    path: `${userPath.SCHOOL_ADMIN_BASE_PATH}/parents`,
    icon: generalImages.assignments,
    label: "PARENTS",
  },
  {
    path: `${userPath.SCHOOL_ADMIN_BASE_PATH}/students`,
    icon: generalImages.seating,
    label: "STUDENTS",
  },
  {
    path: `${userPath.SCHOOL_ADMIN_BASE_PATH}/communicate`,
    icon: generalImages.communicate,
    label: "COMMUNICATE",
  },
];

export const TeacherRoutes = [
  {
    path: userPath.TEACHER_BASE_PATH,
    icon: generalImages.home,
    label: "HOME",
  },
  {
    path: `${userPath.TEACHER_BASE_PATH}/classes`,
    icon: generalImages.assignments,
    label: "CLASSES",
  },
  {
    path: `${userPath.TEACHER_BASE_PATH}/assignments`,
    icon: generalImages.assignments,
    label: "ASSIGNMENTS",
  },
  {
    path: `${userPath.TEACHER_BASE_PATH}/gradebook`,
    icon: generalImages.gradebook,
    label: "GRADEBOOK",
  },
  {
    path: `${userPath.TEACHER_BASE_PATH}/attendance`,
    icon: generalImages.attendance,
    label: "ATTENDANCE",
  },
  {
    path: `${userPath.TEACHER_BASE_PATH}/character`,
    icon: generalImages.character,
    label: "CHARACTER",
  },
  {
    path: `${userPath.TEACHER_BASE_PATH}/seating`,
    icon: generalImages.seating,
    label: "SEATING",
  },
  {
    path: `${userPath.TEACHER_BASE_PATH}/communicate`,
    icon: generalImages.communicate,
    label: "COMMUNICATE",
  },
  {
    path: `${userPath.TEACHER_BASE_PATH}/reports`,
    icon: generalImages.reports,
    label: "REPORTS",
  },
  {
    path: `${userPath.TEACHER_BASE_PATH}/teach`,
    icon: generalImages.teach,
    label: "TEACH",
  },
  {
    path: `${userPath.TEACHER_BASE_PATH}/polls`,
    icon: generalImages.polls,
    label: "POLLS",
  },
];
