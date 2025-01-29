"use client";

import { userPath, userTypeEnum } from "@/constants/userConstants";
import { getUserNavigationInfo } from "@/utils/userUtility";
import { useSearchParams } from "next/navigation";
import React from "react";
import SchoolAdminRegister from "./school_admin/SchoolAdminRegister";
import ParentRegister from "./parent/ParentRegister";

export default function RegisterPortal() {
  const searchParams = useSearchParams();
  const userTypeParam =
    searchParams.get("userType") || userTypeEnum.SCHOOL_ADMIN;
  const userNagivationInfo = getUserNavigationInfo(userTypeParam);

  if (userNagivationInfo.basePath === userPath.PARENT_BASE_PATH) {
    return (
      <ParentRegister
        userBasePath={userNagivationInfo.basePath}
        userType={userNagivationInfo.label}
      />
    );
  } else {
    return (
      <SchoolAdminRegister
        userBasePath={userNagivationInfo.basePath}
        userType={userNagivationInfo.label}
      />
    );
  }
}
