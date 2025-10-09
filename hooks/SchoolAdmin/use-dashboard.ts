import { useState, useEffect } from 'react';
import { useBaseUrl } from './use-base-url';
import { localStorageKey } from '@/constants/global';

interface DashboardOverview {
  total_students: number;
  total_teachers: number;
  total_courses: number;
  total_assessments: number;
  pending_submissions: number;
  graded_submissions: number;
  present_today: number;
}

interface RecentStudent {
  id: number;
  name: string;
  email: string;
  grade: number;
  created_at: string;
}

interface RecentAssessment {
  id: number;
  name: string;
  course: string;
  type: string;
  due_date: string;
  published: boolean;
}

interface CourseAverage {
  course__name: string;
  class_average: number;
}

interface DashboardData {
  overview: DashboardOverview;
  recent_students: RecentStudent[];
  recent_assessments: RecentAssessment[];
  course_averages: CourseAverage[];
}

export const useDashboard = () => {
  const [data, setData] = useState<DashboardData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { baseUrl, error: baseUrlError } = useBaseUrl();

  useEffect(() => {
    if (baseUrlError) {
      setError(baseUrlError);
      setLoading(false);
      return;
    }

    if (!baseUrl) {
      return;
    }

    const fetchDashboard = async () => {
      try {
        setLoading(true);
        const accessToken = localStorage.getItem(localStorageKey.ACCESS_TOKEN);

        if (!accessToken) {
          throw new Error('Authentication required');
        }

        const response = await fetch(`${baseUrl}/school-admin/dashboard/`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });

        if (!response.ok) {
          throw new Error('Failed to fetch dashboard data');
        }

        const dashboardData: DashboardData = await response.json();
        setData(dashboardData);
        setError(null);
      } catch (err: any) {
        setError(err.message || 'Failed to fetch dashboard data');
      } finally {
        setLoading(false);
      }
    };

    fetchDashboard();
  }, [baseUrl, baseUrlError]);

  return { data, loading, error };
};