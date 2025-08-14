"use client";
import React from 'react';
import { 
  FiUsers, FiBook, FiCalendar, FiAward, 
  FiClipboard, FiMail, FiDollarSign, 
  FiBookOpen, FiBarChart2, FiTruck 
} from 'react-icons/fi';
import { 
  Card, 
  Metric, 
  Text, 
  Flex, 
  Grid, 
  Icon, 
  Title, 
  BarChart, 
  DonutChart 
} from '@tremor/react';
import Link from 'next/link';

// Data definitions
const data = [
  {
    name: 'Students',
    value: 1245,
    icon: FiUsers,
    color: 'blue',
    path: '/school_admin/students'
  },
  {
    name: 'Teachers',
    value: 48,
    icon: FiUsers,
    color: 'violet',
    path: '/school_admin/teachers'
  },
  {
    name: 'Classes',
    value: 32,
    icon: FiBook,
    color: 'amber',
    path: '/school_admin/classes'
  },
  {
    name: 'Subjects',
    value: 18,
    icon: FiBookOpen,
    color: 'emerald',
    path: '/school_admin/subjects'
  },
];

const attendanceData = [
  {
    date: 'Jan 1',
    Present: 89,
    Absent: 11,
  },
  {
    date: 'Jan 2',
    Present: 92,
    Absent: 8,
  },
  {
    date: 'Jan 3',
    Present: 85,
    Absent: 15,
  },
  {
    date: 'Jan 4',
    Present: 91,
    Absent: 9,
  },
  {
    date: 'Jan 5',
    Present: 94,
    Absent: 6,
  },
];

const gradeDistribution = [
  {
    name: 'A (90-100)',
    students: 215,
  },
  {
    name: 'B (80-89)',
    students: 320,
  },
  {
    name: 'C (70-79)',
    students: 280,
  },
  {
    name: 'D (60-69)',
    students: 150,
  },
  {
    name: 'F (Below 60)',
    students: 35,
  },
];

const recentActivity = [
  {
    id: 1,
    action: 'New student enrolled',
    name: 'Emma Johnson',
    time: '2 hours ago',
  },
  {
    id: 2,
    action: 'Grade submitted',
    name: 'Math - Grade 10A',
    time: '4 hours ago',
  },
  {
    id: 3,
    action: 'Attendance marked',
    name: 'May 15, 2023',
    time: '1 day ago',
  },
  {
    id: 4,
    action: 'New teacher added',
    name: 'Mr. Robert Wilson',
    time: '2 days ago',
  },
];

const quickActions = [
  {
    name: 'Take Attendance',
    icon: FiClipboard,
    path: '/school_admin/attendance',
  },
  {
    name: 'Add New Student',
    icon: FiUsers,
    path: '/school_admin/students/add',
  },
  {
    name: 'Schedule Class',
    icon: FiCalendar,
    path: '/school_admin/timetable',
  },
  {
    name: 'Send Announcement',
    icon: FiMail,
    path: '/school_admin/communicate',
  },
];

const SchoolAdminDashboard = () => {
  return (
    <div className="p-6 w-full bg-white">
      <Title className="text-2xl font-bold mb-6">School Dashboard</Title>
      
      {/* Overview Cards */}
      <Grid numItemsSm={2} numItemsLg={4} className="gap-6 mb-6">
        {data.map((item) => (
          <Link href={item.path} key={item.name}>
            <Card decoration="top" decorationColor={item.color}>
              <Flex justifyContent="start" className="space-x-4">
                <Icon icon={item.icon} variant="light" size="xl" color={item.color} />
                <div>
                  <Text>{item.name}</Text>
                  <Metric>{item.value}</Metric>
                </div>
              </Flex>
            </Card>
          </Link>
        ))}
      </Grid>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Attendance Trend */}
        <Card>
          <Title>Attendance Trend (Last 5 Days)</Title>
          <BarChart
            className="mt-6"
            data={attendanceData}
            index="date"
            categories={['Present', 'Absent']}
            colors={['blue', 'sky']} // Modifié ici
            yAxisWidth={30}
            showAnimation={true}
          />
        </Card>

        {/* Grade Distribution */}
        <Card>
          <Title>Grade Distribution</Title>
          <DonutChart
            className="mt-6"
            data={gradeDistribution}
            category="students"
            index="name"
            colors={['blue', 'sky', 'indigo', 'navy', 'cyan']} // Modifié ici
            showAnimation={true}
          />
        </Card>
      </div>

      {/* Quick Actions */}
      <Card className="mb-6">
        <Title>Quick Actions</Title>
        <Grid numItemsSm={2} numItemsLg={4} className="gap-4 mt-4">
          {quickActions.map((action) => (
            <Link href={action.path} key={action.name}>
              <Card className="hover:bg-gray-50 transition-colors cursor-pointer h-full">
                <Flex justifyContent="start" className="space-x-4">
                  <Icon icon={action.icon} variant="light" size="lg" color="blue" />
                  <Text>{action.name}</Text>
                </Flex>
              </Card>
            </Link>
          ))}
        </Grid>
      </Card>

      {/* Recent Activity and Upcoming Events */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activity */}
        <Card>
          <Title>Recent Activity</Title>
          <div className="mt-4 space-y-4">
            {recentActivity.map((activity) => (
              <div key={activity.id} className="flex items-start space-x-4 pb-4 border-b border-gray-100 last:border-0">
                <div className="bg-blue-50 p-2 rounded-full">
                  <FiClipboard className="text-blue-500" />
                </div>
                <div>
                  <p className="font-medium">{activity.action}</p>
                  <p className="text-sm text-gray-500">{activity.name}</p>
                  <p className="text-xs text-gray-400">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </Card>

        {/* Upcoming Events */}
        <Card>
          <Title>Upcoming Events</Title>
          <div className="mt-4 space-y-4">
            <div className="flex items-start space-x-4 pb-4 border-b border-gray-100">
              <div className="bg-purple-50 p-2 rounded-full">
                <FiCalendar className="text-purple-500" />
              </div>
              <div>
                <p className="font-medium">Parent-Teacher Conference</p>
                <p className="text-sm text-gray-500">May 20, 2023 - 3:00 PM</p>
              </div>
            </div>
            <div className="flex items-start space-x-4 pb-4 border-b border-gray-100">
              <div className="bg-green-50 p-2 rounded-full">
                <FiAward className="text-green-500" />
              </div>
              <div>
                <p className="font-medium">Honors Ceremony</p>
                <p className="text-sm text-gray-500">May 25, 2023 - 10:00 AM</p>
              </div>
            </div>
            <div className="flex items-start space-x-4 pb-4 border-b border-gray-100">
              <div className="bg-amber-50 p-2 rounded-full">
                <FiBook className="text-amber-500" />
              </div>
              <div>
                <p className="font-medium">Final Exams Begin</p>
                <p className="text-sm text-gray-500">June 1, 2023 - All Day</p>
              </div>
            </div>
            <div className="flex items-start space-x-4">
              <div className="bg-red-50 p-2 rounded-full">
                <FiTruck className="text-red-500" />
              </div>
              <div>
                <p className="font-medium">Field Trip - Science Museum</p>
                <p className="text-sm text-gray-500">June 5, 2023 - 8:30 AM</p>
              </div>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default SchoolAdminDashboard;