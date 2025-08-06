"use client";

import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  School,
  Users,
  Settings,
  Database,
  Globe,
  Bell,
  FileText,
  Shield,
  BarChart2,
  CreditCard,
  LifeBuoy,
  Cpu,
  BellRing,
  BookOpenCheck,
  MessageCircle,
  Zap
} from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { ActivityFeed } from "./ActivityFeed";

export default function SuperAdminDashboard() {
  const router = useRouter();
  //const [activeTab, setActiveTab] = useState("overview");

  // Default data
  const stats = [
    { title: "Schools", value: 42, change: "+3", icon: School, color: "bg-blue-500" },
    { title: "Users", value: 1532, change: "+124", icon: Users, color: "bg-green-500" },
    { title: "Districts", value: 8, change: "+1", icon: Globe, color: "bg-purple-500" },
    { title: "Activity", value: "98%", change: "+2%", icon: BarChart2, color: "bg-amber-500" }
  ];

  const recentSchools = [
    { name: "Central Elementary", district: "North District", status: "active", students: 420 },
    { name: "Science High School", district: "South District", status: "active", students: 780 },
    { name: "Arts College", district: "East District", status: "pending", students: 320 }
  ];

  const systemStatus = {
    database: { status: "optimal", usage: "64%" },
    api: { status: "stable", uptime: "99.9%" },
    storage: { status: "good", used: "1.2TB" }
  };

  return (
    <section className="flex flex-col gap-6 w-full min-h-screen bg-gray-50">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-gray-900 to-gray-800 p-6 rounded-lg shadow-lg">
        <div className="flex flex-col md:flex-row items-center justify-between text-white">
          <div className="flex items-center gap-4 mb-4 md:mb-0">
            <Avatar className="h-16 w-16 border-4 border-white/20 shadow-lg">
              <AvatarImage src="/superadmin-avatar.png" />
              <AvatarFallback className="bg-indigo-600 text-white text-xl font-bold">
                SA
              </AvatarFallback>
            </Avatar>
            <div>
              <h1 className="text-2xl font-bold">Super Admin Dashboard</h1>
              <p className="text-gray-300">
                System overview and global administration
              </p>
            </div>
          </div>
          <div className="flex gap-3">
            <Button
              variant="ghost"
              size="icon"
              className="h-10 w-10 bg-white/10 hover:bg-white/20 text-white border-white/20 relative"
            >
              <Bell className="h-5 w-5" />
              <span className="absolute -top-1 -right-1 bg-red-400 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                5
              </span>
            </Button>
            <Button className="h-10 bg-white/10 hover:bg-white/20 text-white border-white/20 gap-2">
              <Settings className="h-4 w-4" />
              Settings
            </Button>
          </div>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-6 p-4 sm:p-6">
        <div className="flex-1 space-y-6">
          {/* Quick Stats Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {stats.map((stat, index) => (
              <Card key={index} className="p-4 shadow-lg hover:shadow-xl transition-all duration-300">
                <div className="flex items-center gap-4">
                  <div className={`p-3 rounded-lg ${stat.color} text-white`}>
                    <stat.icon className="h-6 w-6" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">{stat.title}</p>
                    <div className="flex items-baseline gap-2">
                      <p className="text-2xl font-bold">{stat.value}</p>
                      <span className="text-sm text-green-500">{stat.change}</span>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>

          {/* System Overview */}
          <Card className="p-6 shadow-lg border-l-4 border-indigo-500">
            <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <div className="p-2 bg-indigo-100 rounded-lg">
                <Cpu className="h-5 w-5 text-indigo-500" />
              </div>
              System Overview
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3 mb-2">
                  <Database className="h-5 w-5 text-blue-500" />
                  <h3 className="font-medium">Database</h3>
                </div>
                <div className="flex justify-between items-center">
                  <span className={`text-sm px-2 py-1 rounded-full ${
                    systemStatus.database.status === 'optimal' 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {systemStatus.database.status}
                  </span>
                  <span className="text-sm text-gray-600">Usage: {systemStatus.database.usage}</span>
                </div>
              </div>
              
              <div className="p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3 mb-2">
                  <Globe className="h-5 w-5 text-purple-500" />
                  <h3 className="font-medium">API</h3>
                </div>
                <div className="flex justify-between items-center">
                  <span className={`text-sm px-2 py-1 rounded-full ${
                    systemStatus.api.status === 'stable' 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {systemStatus.api.status}
                  </span>
                  <span className="text-sm text-gray-600">Uptime: {systemStatus.api.uptime}</span>
                </div>
              </div>
              
              <div className="p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-3 mb-2">
                  <Database className="h-5 w-5 text-amber-500" />
                  <h3 className="font-medium">Storage</h3>
                </div>
                <div className="flex justify-between items-center">
                  <span className={`text-sm px-2 py-1 rounded-full ${
                    systemStatus.storage.status === 'good' 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {systemStatus.storage.status}
                  </span>
                  <span className="text-sm text-gray-600">Used: {systemStatus.storage.used}</span>
                </div>
              </div>
            </div>
          </Card>

          {/* Quick Actions */}
          <Card className="p-6 shadow-lg">
            <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <div className="p-2 bg-blue-100 rounded-lg">
                <Zap className="h-5 w-5 text-blue-500" />
              </div>
              Quick Actions
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              <Button 
                variant="outline" 
                className="h-auto flex-col gap-2 p-4"
                onClick={() => router.push('/super_admin/schools')}
              >
                <School className="h-6 w-6 text-blue-500" />
                <span className="text-sm">Schools</span>
              </Button>
              <Button 
                variant="outline" 
                className="h-auto flex-col gap-2 p-4"
                onClick={() => router.push('/super_admin/users')}
              >
                <Users className="h-6 w-6 text-green-500" />
                <span className="text-sm">Users</span>
              </Button>
              <Button 
                variant="outline" 
                className="h-auto flex-col gap-2 p-4"
                onClick={() => router.push('/super_admin/districts')}
              >
                <Globe className="h-6 w-6 text-purple-500" />
                <span className="text-sm">Districts</span>
              </Button>
              <Button 
                variant="outline" 
                className="h-auto flex-col gap-2 p-4"
                onClick={() => router.push('/super_admin/settings')}
              >
                <Settings className="h-6 w-6 text-gray-500" />
                <span className="text-sm">Settings</span>
              </Button>
            </div>
          </Card>

          {/* Recent Schools */}
          <Card className="p-6 shadow-lg">
            <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <div className="p-2 bg-purple-100 rounded-lg">
                <School className="h-5 w-5 text-purple-500" />
              </div>
              Recent Schools
            </h2>
            <div className="space-y-4">
              {recentSchools.map((school, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                  <div>
                    <p className="font-medium">{school.name}</p>
                    <p className="text-sm text-gray-600">{school.district} • {school.students} students</p>
                  </div>
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    school.status === 'active' 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {school.status === 'active' ? 'Active' : 'Pending'}
                  </span>
                </div>
              ))}
              <Button variant="ghost" className="w-full text-blue-500">
                View all schools
              </Button>
            </div>
          </Card>

          {/* System Alerts */}
          <Card className="p-6 shadow-lg border-l-4 border-red-500">
            <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <div className="p-2 bg-red-100 rounded-lg">
                <BellRing className="h-5 w-5 text-red-500" />
              </div>
              System Alerts
            </h2>
            <div className="space-y-3">
              <div className="flex items-start gap-3 p-4 bg-red-50 rounded-lg">
                <div className="p-2 bg-red-100 rounded-full mt-1">
                  <Shield className="h-4 w-4 text-red-500" />
                </div>
                <div>
                  <p className="font-medium text-gray-800">Security update required</p>
                  <p className="text-sm text-gray-600 mt-1">
                    A new system version is available (v2.4.1). Contains critical security fixes.
                  </p>
                  <div className="flex gap-2 mt-3">
                    <Button size="sm" className="bg-red-500 hover:bg-red-600">
                      Update now
                    </Button>
                    <Button size="sm" variant="outline">
                      More info
                    </Button>
                  </div>
                </div>
              </div>
              <div className="flex items-start gap-3 p-4 bg-amber-50 rounded-lg">
                <div className="p-2 bg-amber-100 rounded-full mt-1">
                  <BookOpenCheck className="h-4 w-4 text-amber-500" />
                </div>
                <div>
                  <p className="font-medium text-gray-800">License audit</p>
                  <p className="text-sm text-gray-600 mt-1">
                    3 schools have licenses expiring in less than 30 days.
                  </p>
                  <Button size="sm" className="mt-3 bg-amber-500 hover:bg-amber-600">
                    View licenses
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        </div>

        {/* Right Sidebar */}
        <div className="lg:w-80 space-y-6">
          {/* License Status */}
          <Card className="p-6 shadow-lg">
            <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <div className="p-2 bg-green-100 rounded-lg">
                <FileText className="h-5 w-5 text-green-500" />
              </div>
              License
            </h2>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Type:</span>
                <span className="text-sm font-medium">Enterprise</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Expiration:</span>
                <span className="text-sm font-medium">12/15/2024</span>
              </div>
              <div className="flex justify-between">
                <span className="text-sm text-gray-600">Schools:</span>
                <span className="text-sm font-medium">42/50</span>
              </div>
              <div className="pt-3">
                <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                  <div className="h-full bg-green-500 rounded-full" style={{ width: '84%' }}></div>
                </div>
              </div>
              <Button className="w-full mt-4 bg-green-500 hover:bg-green-600">
                Manage license
              </Button>
            </div>
          </Card>

          {/* Support Card */}
          <Card className="p-6 shadow-lg bg-gradient-to-br from-blue-50 to-indigo-50">
            <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
              <div className="p-2 bg-blue-100 rounded-lg">
                <LifeBuoy className="h-5 w-5 text-blue-500" />
              </div>
              Support
            </h2>
            <p className="text-sm text-gray-600 mb-4">
              Need help with the system? Our team is available 24/7.
            </p>
            <div className="space-y-2">
              <Button variant="outline" className="w-full gap-2">
                <MessageCircle className="h-4 w-4" />
                Live chat
              </Button>
              <Button variant="outline" className="w-full gap-2">
                <FileText className="h-4 w-4" />
                Documentation
              </Button>
              <Button variant="outline" className="w-full gap-2">
                <CreditCard className="h-4 w-4" />
                Billing
              </Button>
            </div>
          </Card>

          {/* Activity Feed */}
          <ActivityFeed />
        </div>
      </div>
    </section>
  );
}