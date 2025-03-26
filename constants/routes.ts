import { generalImages, menuImages } from "./images";
import { userPath } from "./userConstants";

export const StudentRoutes = [
  {
    path: userPath.STUDENT_DASHBOARD_PATH,
    icon: generalImages.home,
    label: "HOME",
  },
  {
    path: `${userPath.STUDENT_BASE_PATH}/classes`,
    icon: generalImages.assignments,
    label: "CLASSES",
  },
  {
    path: `${userPath.STUDENT_BASE_PATH}/assignments`,
    icon: menuImages.assignments,
    label: "ASSIGNMENTS",
  },
  {
    path: `${userPath.STUDENT_BASE_PATH}/gradebook`,
    icon: generalImages.gradebook,
    label: "GRADEBOOK",
  },
  {
    path: `${userPath.STUDENT_BASE_PATH}/attendance`,
    icon: generalImages.attendance,
    label: "ATTENDANCE",
  },
  {
    path: `${userPath.STUDENT_BASE_PATH}/character`,
    icon: generalImages.character,
    label: "CHARACTER",
  },
  {
    path: `${userPath.STUDENT_BASE_PATH}/communicate`,
    icon: generalImages.communicate,
    label: "COMMUNICATE",
  },
  {
    path: `${userPath.STUDENT_BASE_PATH}/library`,
    icon: generalImages.library,
    label: "LIBRARY",
  },
  {
    path: `${userPath.STUDENT_BASE_PATH}/rewards`,
    icon: generalImages.rewards,
    label: "REWARDS",
  },
  {
    path: `${userPath.STUDENT_BASE_PATH}/tutor`,
    icon: generalImages.tutor,
    label: "TUTOR",
  },
];

export const SchoolAdminRoutes = [
  {
    path: userPath.SCHOOL_ADMIN_DASHBOARD_PATH,
    icon: menuImages.home,
    label: "HOME",
  },
  {
    path: `${userPath.SCHOOL_ADMIN_BASE_PATH}/classes`,
    icon: menuImages.assignments,
    label: "CLASSES",
  },
  {
    path: `${userPath.SCHOOL_ADMIN_BASE_PATH}/teachers`,
    icon: menuImages.teach,
    label: "TEACHERS",
  },
  {
    path: `${userPath.SCHOOL_ADMIN_BASE_PATH}/parents`,
    icon: menuImages.assignments,
    label: "PARENTS",
  },
  {
    path: `${userPath.SCHOOL_ADMIN_BASE_PATH}/students`,
    icon: menuImages.seating,
    label: "STUDENTS",
  },
  {
    path: `${userPath.SCHOOL_ADMIN_BASE_PATH}/communicate`,
    icon: menuImages.communicate,
    label: "COMMUNICATE",
  },
];

export const TeacherRoutes = [
  {
    path: userPath.TEACHER_DASHBOARD_PATH,
    icon: genermenuImagesalImages.home,
    label: "HOME",
  },
  {
    path: `${userPath.TEACHER_BASE_PATH}/classes`,
    icon: menuImages.assignments,
    label: "CLASSES",
  },
  {
    path: `${userPath.TEACHER_BASE_PATH}/assignments`,
    icon: menuImages.assignments,
    label: "ASSIGNMENTS",
  },
  {
    path: `${userPath.TEACHER_BASE_PATH}/digital_library`,
    icon: menuImages.assignments,
    label: "DIGITAL LIBRARY",
  },
  {
    path: `${userPath.TEACHER_BASE_PATH}/gradebook`,
    icon: menuImages.gradebook,
    label: "GRADEBOOK",
  },
  {
    path: `${userPath.TEACHER_BASE_PATH}/attendance`,
    icon: generalImages.attendance,
    label: "ATTENDANCE",
  },
  {
    path: `${userPath.TEACHER_BASE_PATH}/character`,
    icon: menuImages.character,
    label: "CHARACTER",
  },
  {
    path: `${userPath.TEACHER_BASE_PATH}/seating`,
    icon: menuImages.seating,
    label: "SEATING",
  },
  {
    path: `${userPath.TEACHER_BASE_PATH}/communicate`,
    icon: menuImages.communicate,
    label: "COMMUNICATE",
  },{
    path: `${userPath.TEACHER_BASE_PATH}/test_prep`,
    icon: generalImages.test_prep,
    label: "TEST PREP",
  },
  {
    path: `${userPath.TEACHER_BASE_PATH}/reports`,
    icon: menuImages.reports,
    label: "REPORTS",
  },
  {
    path: `${userPath.TEACHER_BASE_PATH}/teach`,
    icon: menuImages.teach,
    label: "TEACH",
  },
  {
    path: `${userPath.TEACHER_BASE_PATH}/polls`,
    icon: menuImages.polls,
    label: "POLLS",
  },
];
