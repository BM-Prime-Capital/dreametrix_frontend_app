// middleware/authMiddleware.ts
import { userTypeEnum } from '@/constants/userConstants';
import { NextRequest, NextResponse } from 'next/server';

const routePermissions = {
  // Routes Student
  '/student': [userTypeEnum.STUDENT],
  '/student/dashboard': [userTypeEnum.STUDENT],
  '/student/classes': [userTypeEnum.STUDENT],
  '/student/assignments': [userTypeEnum.STUDENT],
  '/student/gradebook': [userTypeEnum.STUDENT],
  '/student/attendance': [userTypeEnum.STUDENT],
  '/student/character': [userTypeEnum.STUDENT],
  '/student/communicate': [userTypeEnum.STUDENT],
  '/student/polls': [userTypeEnum.STUDENT],
  '/student/rewards': [userTypeEnum.STUDENT],
  '/student/tutor': [userTypeEnum.STUDENT],
  '/student/relationship': [userTypeEnum.STUDENT],
  '/student/profile': [userTypeEnum.STUDENT],
  '/student/help': [userTypeEnum.STUDENT],
  '/student/settings': [userTypeEnum.STUDENT],

  // Routes Teacher
  '/teacher': [userTypeEnum.TEACHER],
  '/teacher/dashboard': [userTypeEnum.TEACHER],
  '/teacher/classes': [userTypeEnum.TEACHER],
  '/teacher/assignments': [userTypeEnum.TEACHER],
  '/teacher/digital_library': [userTypeEnum.TEACHER],
  '/teacher/gradebook': [userTypeEnum.TEACHER],
  '/teacher/attendance': [userTypeEnum.TEACHER],
  '/teacher/character': [userTypeEnum.TEACHER],
  '/teacher/seating': [userTypeEnum.TEACHER],
  '/teacher/communicate': [userTypeEnum.TEACHER],
  '/teacher/rewards': [userTypeEnum.TEACHER],
  '/teacher/plan': [userTypeEnum.TEACHER],
  '/teacher/teach': [userTypeEnum.TEACHER],
  '/teacher/polls': [userTypeEnum.TEACHER],
  '/teacher/big_braain': [userTypeEnum.TEACHER],
  '/teacher/test_prep': [userTypeEnum.TEACHER],
  '/teacher/child_study': [userTypeEnum.TEACHER],
  '/teacher/dream_arcade': [userTypeEnum.TEACHER],
  '/teacher/report_card': [userTypeEnum.TEACHER],
  '/teacher/support': [userTypeEnum.TEACHER],

  // Routes Parent
  '/parent': [userTypeEnum.PARENT],
  '/parent/dashboard': [userTypeEnum.PARENT],
  '/parent/classes': [userTypeEnum.PARENT],
  '/parent/assignments': [userTypeEnum.PARENT],
  '/parent/gradebook': [userTypeEnum.PARENT],
  '/parent/attendance': [userTypeEnum.PARENT],
  '/parent/rewards': [userTypeEnum.PARENT],
  '/parent/characters': [userTypeEnum.PARENT],
  '/parent/report-cards': [userTypeEnum.PARENT],
  '/parent/communicate': [userTypeEnum.PARENT],
  '/parent/library': [userTypeEnum.PARENT],
  '/parent/help': [userTypeEnum.PARENT],

  // Routes School Admin
  '/school_admin': [userTypeEnum.SCHOOL_ADMIN],
  '/school_admin/dashboard': [userTypeEnum.SCHOOL_ADMIN],
  '/school_admin/students': [userTypeEnum.SCHOOL_ADMIN],
  '/school_admin/teachers': [userTypeEnum.SCHOOL_ADMIN],
  '/school_admin/parents': [userTypeEnum.SCHOOL_ADMIN],
  '/school_admin/classes': [userTypeEnum.SCHOOL_ADMIN],
  '/school_admin/subjects': [userTypeEnum.SCHOOL_ADMIN],
  '/school_admin/timetable': [userTypeEnum.SCHOOL_ADMIN],
  '/school_admin/grades': [userTypeEnum.SCHOOL_ADMIN],
  '/school_admin/attendance': [userTypeEnum.SCHOOL_ADMIN],
  '/school_admin/communicate': [userTypeEnum.SCHOOL_ADMIN],
  '/school_admin/finance': [userTypeEnum.SCHOOL_ADMIN],
  '/school_admin/library': [userTypeEnum.SCHOOL_ADMIN],
  '/school_admin/reports': [userTypeEnum.SCHOOL_ADMIN],
  '/school_admin/transports': [userTypeEnum.SCHOOL_ADMIN],
  '/school_admin/settings': [userTypeEnum.SCHOOL_ADMIN],

  // Routes Super Admin
  '/super_admin': [userTypeEnum.SUPER_ADMIN],
  '/super_admin/dashboard': [userTypeEnum.SUPER_ADMIN],
  '/super_admin/schools': [userTypeEnum.SUPER_ADMIN],
  '/super_admin/districts': [userTypeEnum.SUPER_ADMIN],
  '/super_admin/users': [userTypeEnum.SUPER_ADMIN],
  '/super_admin/templates': [userTypeEnum.SUPER_ADMIN],
  '/super_admin/audit-logs': [userTypeEnum.SUPER_ADMIN],
  '/super_admin/subscriptions': [userTypeEnum.SUPER_ADMIN],
  '/super_admin/support': [userTypeEnum.SUPER_ADMIN],
  '/super_admin/api-management': [userTypeEnum.SUPER_ADMIN],
  '/super_admin/notifications': [userTypeEnum.SUPER_ADMIN],
  '/super_admin/backup': [userTypeEnum.SUPER_ADMIN],
  '/super_admin/analytics': [userTypeEnum.SUPER_ADMIN],
  '/super_admin/system-settings': [userTypeEnum.SUPER_ADMIN],
};

const getUserType = (request: NextRequest): userTypeEnum | null => {
  const userType = request.cookies.get('userType')?.value;
  
  if (userType && Object.values(userTypeEnum).includes(userType as userTypeEnum)) {
    return userType as userTypeEnum;
  }
  
  return null;
};

const getRoutePermission = (pathname: string): userTypeEnum[] | null => {
  const sortedRoutes = Object.keys(routePermissions)
    .sort((a, b) => b.length - a.length);
  
  for (const route of sortedRoutes) {
    if (pathname.startsWith(route)) {
      return routePermissions[route as keyof typeof routePermissions];
    }
  }
  
  return null;
};

export function authMiddleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  const publicRoutes = ['/login', '/register', '/', '/api/auth'];
  if (publicRoutes.some(route => pathname.startsWith(route))) {
    return NextResponse.next();
  }
  
  const userType = getUserType(request);
  
  if (!userType) {
    const loginUrl = new URL('/login', request.url);
    return NextResponse.redirect(loginUrl);
  }
  
  const allowedUserTypes = getRoutePermission(pathname);
  
  if (allowedUserTypes && !allowedUserTypes.includes(userType)) {
    let redirectPath = '/login';
    
    switch (userType) {
      case userTypeEnum.STUDENT:
        redirectPath = '/student/dashboard';
        break;
      case userTypeEnum.TEACHER:
        redirectPath = '/teacher/dashboard';
        break;
      case userTypeEnum.PARENT:
        redirectPath = '/parent/dashboard';
        break;
      case userTypeEnum.SCHOOL_ADMIN:
        redirectPath = '/school_admin/dashboard';
        break;
      case userTypeEnum.SUPER_ADMIN:
        redirectPath = '/super_admin/dashboard';
        break;
    }
    
    const redirectUrl = new URL(redirectPath, request.url);
    return NextResponse.redirect(redirectUrl);
  }
  
  return NextResponse.next();
}