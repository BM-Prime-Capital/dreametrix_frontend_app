import { generalImages, menuImages } from "./images";
import { userPath } from "./userConstants";

export const StudentRoutes = [
  {
    path: "",
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
    icon: generalImages.home,
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
    icon: generalImages.home,
    label: "HOME",
  },
  {
    path: `${userPath.TEACHER_BASE_PATH}/classes`,
    icon: menuImages.classes,
    label: "CLASSES",
  },
  {
    path: `${userPath.TEACHER_BASE_PATH}/assignments`,
    icon: menuImages.assignments,
    label: "ASSIGNMENTS",
  },
  {
    path: `${userPath.TEACHER_BASE_PATH}/digital_library`,
    icon: menuImages.digital_library,
    label: "DIGITAL LIBRARY",
  },
  {
    path: `${userPath.TEACHER_BASE_PATH}/gradebook`,
    icon: menuImages.gradebook,
    label: "GRADEBOOK",
  },
  {
    path: `${userPath.TEACHER_BASE_PATH}/attendance`,
    icon: menuImages.attendance,
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
  },
  {
    path: `${userPath.TEACHER_BASE_PATH}/reports`,
    icon: menuImages.reports,
    label: "REPORTS",
  },
  {
    path: `${userPath.TEACHER_BASE_PATH}/plan`,
    icon: menuImages.plan,
    label: "PLAN",
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
  {
    path: `${userPath.TEACHER_BASE_PATH}/big_braain`,
    icon: menuImages.big_braain,
    label: "BIG BRAA.I.N",
  },
  {
    path: `${userPath.TEACHER_BASE_PATH}/test_prep`,
    icon: menuImages.test_prep,
    label: "TEST PREP",
  },
  {
    path: `${userPath.TEACHER_BASE_PATH}/child_study`,
    icon: menuImages.child_study,
    label: "CHILD STUDY",
  },
  {
    path: `${userPath.TEACHER_BASE_PATH}/dream_arcade`,
    icon: menuImages.dream_arcade,
    label: "DREAM ARCADE",
  },
  {
    path: `${userPath.TEACHER_BASE_PATH}/report_card`,
    icon: menuImages.report_card,
    label: "REPORT CARD",
  },
];

export const ParentRoutes = [
  {
    path: "/parent",
    icon: generalImages.home,
    label: "HOME",
  },
  {
    path: `${userPath.PARENT_BASE_PATH}/classes`,
    icon: menuImages.classes,
    label: "CLASSES",
  },
  {
    path: `${userPath.PARENT_BASE_PATH}/assignments`,
    icon: menuImages.assignments,
    label: "ASSIGNMENTS",
  },
  {
    path: `${userPath.PARENT_BASE_PATH}/gradebook`,
    icon: menuImages.gradebook,
    label: "GRADEBOOK",
  },
  {
    path: `${userPath.PARENT_BASE_PATH}/attendance`,
    icon: menuImages.attendance,
    label: "ATTENDANCE",
  },
  
 
  {
    path: `${userPath.PARENT_BASE_PATH}/communicate`,
    icon: menuImages.communicate,
    label: "COMMUNICATE",
  },
 
 
 
  {
    path: `${userPath.PARENT_BASE_PATH}/library`,
    icon: menuImages.report_card,
    label: "LIBRARY",
  },
];