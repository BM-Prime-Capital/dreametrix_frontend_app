import { generalImages, menuImages } from "./images";
import { userPath } from "./userConstants";

export const StudentRoutes = [
  // Routes principales
  {
    path: `${userPath.STUDENT_BASE_PATH}`,
    icon: generalImages.home,
    label: "HOME",
  },
  {
    path: `${userPath.STUDENT_BASE_PATH}/classes`,
    icon: menuImages.classes,
    label: "CLASSES",
  },

  {
    path: `${userPath.STUDENT_BASE_PATH}/assignments`,
    icon: menuImages.assignments,
    label: "ASSIGNMENTS",
    badge: 3, // Exemple de badge
  },
  {
    path: `${userPath.STUDENT_BASE_PATH}/gradebook`,
    icon: menuImages.gradebook,
    label: "GRADEBOOK",
  },
  {
    path: `${userPath.STUDENT_BASE_PATH}/attendance`,
    icon: menuImages.attendance,
    label: "ATTENDANCE",
  },
  {
    path: `${userPath.STUDENT_BASE_PATH}/character`,
    icon: menuImages.character,
    label: "CHARACTER",
  },
  {
    path: `${userPath.STUDENT_BASE_PATH}/communicate`,
    icon: menuImages.communicate,
    label: "COMMUNICATE",
    badge: 5, // Exemple de badge
  },
  {
    path: `${userPath.STUDENT_BASE_PATH}/polls`,
    icon: menuImages.polls,
    label: "POLLS",
  },
  {
    path: `${userPath.STUDENT_BASE_PATH}/rewards`,
    icon: menuImages.rewards,
    label: "REWARDS",
  },
  {
    path: `${userPath.STUDENT_BASE_PATH}/tutor`,
    icon: generalImages.tutor,
    label: "TUTOR",
  },
  {
    path: `${userPath.STUDENT_BASE_PATH}/relationship`,
    icon: `/assets/images/teacher/dashboard/relationship.svg`,
    label: "RELATIONSHIP",
  },
  
  // Routes secondaires (affichées en bas du sidebar)
  {
    path: `${userPath.STUDENT_BASE_PATH}/profile`,
    icon: `/assets/images/teacher/dashboard/profile.svg`,
    label: "STUDENT PROFILE",
    isSecondary: true,
  },
  {
    path: `${userPath.STUDENT_BASE_PATH}/help`,
    icon: menuImages.support,
    label: "NEED HELP?",
    isSecondary: true,
  },
  {
    path: `${userPath.STUDENT_BASE_PATH}/settings`,
    icon: menuImages.settings,
    label: "SETTINGS",
    isSecondary: true,
  },
];

export const SchoolAdminRoutes = [
  // Dashboard
  {
    path: `${userPath.SCHOOL_ADMIN_BASE_PATH}`,
    icon: generalImages.home,
    label: "Dashboard",
  },
  // Students
  {
    path: `${userPath.SCHOOL_ADMIN_BASE_PATH}/students`,
    icon: menuImages.seating,
    label: "Students",
  },

  // Teachers
  {
    path: `${userPath.SCHOOL_ADMIN_BASE_PATH}/teachers`,
    icon: menuImages.teach,
    label: "Teachers",
  },

  // Parents
  {
    path: `${userPath.SCHOOL_ADMIN_BASE_PATH}/parents`,
    icon: menuImages.family,
    label: "Parents",
  },

  // Classes
  {
    path: `${userPath.SCHOOL_ADMIN_BASE_PATH}/classes`,
    icon: menuImages.assignments,
    label: "Classes",
  },

  // Subjects
  {
    path: `${userPath.SCHOOL_ADMIN_BASE_PATH}/subjects`,
    icon: menuImages.libraryBooks,
    label: "Subjects",
  },

  // Timetable
  {
    path: `${userPath.SCHOOL_ADMIN_BASE_PATH}/timetable`,
    icon: menuImages.calendar,
    label: "Timetable",
  },

  // Grades
  {
    path: `${userPath.SCHOOL_ADMIN_BASE_PATH}/grades`,
    icon: menuImages.grading,
    label: "Grades",
  },

  // Attendance
  {
    path: `${userPath.SCHOOL_ADMIN_BASE_PATH}/attendance`,
    icon: menuImages.attendance,
    label: "Attendance",
  },

  // Communication
  {
    path: `${userPath.SCHOOL_ADMIN_BASE_PATH}/communicate`,
    icon: menuImages.communicate,
    label: "Communication",
  },

  // Finance 
  {
    path: `${userPath.SCHOOL_ADMIN_BASE_PATH}/finance`,
    icon: menuImages.payments,
    label: "Finance",
  },

  // Library 
  {
    path: `${userPath.SCHOOL_ADMIN_BASE_PATH}/library`,
    icon: menuImages.libraryBooks,
    label: "Library",
  },

  // Reports 
  {
    path: `${userPath.SCHOOL_ADMIN_BASE_PATH}/reports`,
    icon: menuImages.analytics,
    label: "Reports",
  },

  // Transport
  {
    path: `${userPath.SCHOOL_ADMIN_BASE_PATH}/transports`,
    icon: menuImages.transport,
    label: "Transport",
  },

   // Settings
   {
    path: `${userPath.SCHOOL_ADMIN_BASE_PATH}/settings`,
    icon: menuImages.settings,
    label: "Settings",
    isSecondary: true,
  },
];

export const TeacherRoutes = [
  {
    path: userPath.TEACHER_DASHBOARD_PATH,
    icon: generalImages.home,
    label: "HOME",
    exact: true
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
    path: `${userPath.TEACHER_BASE_PATH}/rewards`,
    icon: menuImages.rewards,
    label: "REWARDS ",
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
    label: "BIG BRA.I.N",
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
  {
    path: `${userPath.TEACHER_BASE_PATH}/support`,
    icon: menuImages.support,
    label: "SUPPORT",
    isSecondary: true,
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
    path: `${userPath.PARENT_BASE_PATH}/rewards`,
    icon: menuImages.rewards,
    label: "REWARDS",
  },
  {
    path: `${userPath.PARENT_BASE_PATH}/characters`,
    icon: menuImages.character,
    label: "CHARACTERS",
  },
  {
    path: `${userPath.PARENT_BASE_PATH}/report-cards`,
    icon: menuImages.report_card,
    label: "REPORT CARDS",
  },
  {
    path: `${userPath.PARENT_BASE_PATH}/relationship`,
    icon: `/assets/images/teacher/dashboard/relationship.svg`,
    label: "RELATIONSHIP",
  },
  {
    path: `${userPath.PARENT_BASE_PATH}/communicate`,
    icon: menuImages.communicate,
    label: "COMMUNICATE",
  },
];

export const SuperAdminRoutes = [
  // Dashboard
  {
    path: `${userPath.SUPER_ADMIN_BASE_PATH}`,
    icon: generalImages.home,
    label: "Dashboard",
  },
  
  // Schools Management
  {
    path: `${userPath.SUPER_ADMIN_BASE_PATH}/schools`,
    icon: menuImages.school,
    label: "Schools",
  },
  
  // Districts Management
  {
    path: `${userPath.SUPER_ADMIN_BASE_PATH}/districts`,
    icon: menuImages.district,
    label: "Districts",
  },
  
  // Users Management
  {
    path: `${userPath.SUPER_ADMIN_BASE_PATH}/users`,
    icon: menuImages.users,
    label: "Users",
  },
  
  // Templates
  {
    path: `${userPath.SUPER_ADMIN_BASE_PATH}/templates`,
    icon: menuImages.templates,
    label: "Templates",
  },
  
  // Audit Logs
  {
    path: `${userPath.SUPER_ADMIN_BASE_PATH}/audit-logs`,
    icon: menuImages.logs,
    label: "Audit Logs",
  },
  
  // Subscription Management
  {
    path: `${userPath.SUPER_ADMIN_BASE_PATH}/subscriptions`,
    icon: menuImages.subscriptions,
    label: "Subscriptions",
  },
  
  // Support Tickets
  {
    path: `${userPath.SUPER_ADMIN_BASE_PATH}/support`,
    icon: menuImages.support,
    label: "Support",
    isSecondary: true,
  },
  
  // API Management
  {
    path: `${userPath.SUPER_ADMIN_BASE_PATH}/api-management`,
    icon: menuImages.api,
    label: "API Management",
  },
  
  // Notifications
  {
    path: `${userPath.SUPER_ADMIN_BASE_PATH}/notifications`,
    icon: menuImages.notifications,
    label: "Notifications",
  },
  
  // Backup & Restore
  {
    path: `${userPath.SUPER_ADMIN_BASE_PATH}/backup`,
    icon: menuImages.backup,
    label: "Backup",
  },
  // Reports & Analytics
  {
    path: `${userPath.SUPER_ADMIN_BASE_PATH}/analytics`,
    icon: menuImages.analytics,
    label: "Analytics",
  },

   // System Settings
   {
    path: `${userPath.SUPER_ADMIN_BASE_PATH}/system-settings`,
    icon: menuImages.settings,
    label: "System Settings",
    isSecondary: true,
  },
];