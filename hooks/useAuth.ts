// hooks/useAuth.ts
"use client";
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { userTypeEnum } from '@/constants/userConstants';
import { useRequestInfo } from "@/hooks/useRequestInfo"

interface StoredUserData {
  id: number;
  role: string;
  email: string;
  username: string;
  owner_id?: number;
  first_name?: string;
  last_name?: string;
  full_name?: string;
}

export const useAuth = (allowedUserTypes: userTypeEnum[]) => {
  const { accessToken } = useRequestInfo()
  console.log("accessToken", accessToken)
  const router = useRouter();
  
  useEffect(() => {
    const checkAuth = async () => {
      const userDataString = localStorage.getItem('userData');
      let userRole: userTypeEnum | null = null;
      
      if (userDataString) {
        try {
          const userData: StoredUserData = JSON.parse(userDataString);
          userRole = userData.role as userTypeEnum;
        } catch (error) {
          console.error('Error parsing user data:', error);
        }
      }
      
      console.log("userRole", userRole);
      
      if (!userRole || !allowedUserTypes.includes(userRole)) {
        let redirectPath = '/login';
        
        switch (userRole) {
          case userTypeEnum.STUDENT:
            redirectPath = '/student';
            break;
          case userTypeEnum.TEACHER:
            redirectPath = '/teacher';
            break;
          case userTypeEnum.PARENT:
            redirectPath = '/parent';
            break;
          case userTypeEnum.SCHOOL_ADMIN:
            redirectPath = '/school_admin';
            break;
          case userTypeEnum.SUPER_ADMIN:
            redirectPath = '/super_admin';
            break;
          default:
            redirectPath = '/login';
        }
        
        router.replace(redirectPath);
      }
    };
    
    checkAuth();
  }, [allowedUserTypes, router]);
};