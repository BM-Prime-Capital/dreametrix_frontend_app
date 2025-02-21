export enum userTypeEnum {
  STUDENT = "student",
  PARENT = "parent",
  SCHOOL_ADMIN = "school_admin",
  TEACHER = "teacher",
}

const HOME_PAGE_PATH = "/dashboard";
const LOGIN_PAGE_PATH = "/login";
const REGISTER_PATH = "/register";

export enum userPath {
  STUDENT_BASE_PATH = "/student",
  STUDENT_LOGIN_PATH = `${LOGIN_PAGE_PATH}?userType=${userTypeEnum.STUDENT}`,
  STUDENT_DASHBOARD_PATH = `${STUDENT_BASE_PATH}${HOME_PAGE_PATH}`,

  PARENT_BASE_PATH = "/parent",
  PARENT_LOGIN_PATH = `${LOGIN_PAGE_PATH}?userType=${userTypeEnum.PARENT}`,
  PARENT_DASHBOARD_PATH = `${PARENT_BASE_PATH}${HOME_PAGE_PATH}`,
  PARENT_REGISTER_PATH = `${REGISTER_PATH}?userType=${userTypeEnum.PARENT}`,

  TEACHER_BASE_PATH = "/teacher",
  TEACHER_LOGIN_PATH = `${LOGIN_PAGE_PATH}?userType=${userTypeEnum.TEACHER}`,
  TEACHER_DASHBOARD_PATH = `/${TEACHER_BASE_PATH}${HOME_PAGE_PATH}`,

  SCHOOL_ADMIN_BASE_PATH = "/school_admin",
  SCHOOL_ADMIN_LOGIN_PATH = `${LOGIN_PAGE_PATH}?userType=${userTypeEnum.SCHOOL_ADMIN}`,
  SCHOOL_ADMIN_DASHBOARD_PATH = `${SCHOOL_ADMIN_BASE_PATH}${HOME_PAGE_PATH}`,
  SCHOOL_ADMIN_REGISTER_PATH = `${REGISTER_PATH}?userType=${userTypeEnum.SCHOOL_ADMIN}`,
}

export enum userTitle {
  STUDENT = "Student",
  PARENT = "Parent",
  SCHOOL_ADMIN = "School Admin",
  TEACHER = "Teacher",
}

export enum activityType {
  DONE = "done",
  MESSAGE = "message",
  UPLOAD = "upload",
  EDIT = "edit",
}

export enum activityLabel {
  DONE = "mark as done",
  MESSAGE = "sent you a message",
  UPLOAD = "uploaded",
  EDIT = "edited",
}