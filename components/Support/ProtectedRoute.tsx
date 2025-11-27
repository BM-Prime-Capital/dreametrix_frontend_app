"use client";
import { userTypeEnum } from '@/constants/userConstants';
import { useAuth } from '@/hooks/useAuth';
import { ReactNode, useState, useEffect, } from 'react';
import { Loader } from "@/components/ui/loader";

interface ProtectedRouteProps {
  children: ReactNode;
  allowedUserTypes: userTypeEnum[];
}

export const ProtectedRoute = ({ children, allowedUserTypes }: ProtectedRouteProps) => {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 5000);

    return () => clearTimeout(timer);
  }, []);

  useAuth(allowedUserTypes);

  if (isLoading) {
    return (
        <div className="flex justify-center items-center min-h-screen">

            <Loader/>
      </div>

      );
  }

  return <>{children}</>;
};
