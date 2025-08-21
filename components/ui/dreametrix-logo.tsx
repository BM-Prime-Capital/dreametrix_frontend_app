"use client";

import { generalImages } from "@/constants/images";
import { localStorageKey } from "@/constants/global";
import { userPath, userTypeEnum } from "@/constants/userConstants";
import Image from "next/image";
import Link from "next/link";
import React from "react";

function DreaMetrixLogo({
  width,
  height,
}: {
  width?: number;
  height?: number;
  className?: string;
}) {
  const getDashboardPath = () => {
    if (typeof window === 'undefined') return "/";
    
    try {
      const userData = localStorage.getItem(localStorageKey.USER_DATA);
      if (!userData) return "/";
      
      const { role } = JSON.parse(userData);
      
      switch (role) {
        case "teacher":
          return userPath.TEACHER_BASE_PATH;
        case "student":
          return userPath.STUDENT_BASE_PATH;
        case "parent":
          return userPath.PARENT_BASE_PATH;
        case "school_admin":
          return userPath.SCHOOL_ADMIN_BASE_PATH;
        case "superadmin":
          return userPath.SUPER_ADMIN_BASE_PATH;
        default:
          return "/";
      }
    } catch (error) {
      return "/";
    }
  };

  return (
    <Link href={getDashboardPath()}>
      <Image
        src={generalImages.dreaMetrixLogo}
        alt="Dreametrix Logo"
        width={width ? width : 150}
        height={height ? height : 40}
        priority
        className="w-32 sm:w-[150px]"
      />
    </Link>
  );
}

export default DreaMetrixLogo;
