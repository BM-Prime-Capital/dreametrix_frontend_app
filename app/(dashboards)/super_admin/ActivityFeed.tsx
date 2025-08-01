"use client";

import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Activity,
  School,
  User,
  Settings,
  Shield,
  AlertTriangle,
  CheckCircle,
  Clock,
  FileText,
  Database,
  Globe
} from "lucide-react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export function ActivityFeed() {
  // Default activity data for Super Admin
  const activities = [
    {
      id: 1,
      type: "school_added",
      user: "District Admin",
      action: "added a new school",
      target: "International High School",
      time: "5 min ago",
      icon: <School className="h-4 w-4 text-blue-500" />,
      color: "bg-blue-100"
    },
    {
      id: 2,
      type: "user_created",
      user: "System",
      action: "created 15 accounts",
      target: "Teachers",
      time: "1 hour ago",
      icon: <User className="h-4 w-4 text-green-500" />,
      color: "bg-green-100"
    },
    {
      id: 3,
      type: "system_update",
      user: "Auto-update",
      action: "installed update",
      target: "v2.4.1",
      time: "2 hours ago",
      icon: <Database className="h-4 w-4 text-purple-500" />,
      color: "bg-purple-100"
    },
    {
      id: 4,
      type: "security_alert",
      user: "Security Bot",
      action: "detected suspicious",
      target: "Login attempt",
      time: "3 hours ago",
      icon: <Shield className="h-4 w-4 text-red-500" />,
      color: "bg-red-100"
    },
    {
      id: 5,
      type: "district_modified",
      user: "Super Admin",
      action: "modified district",
      target: "Northeast",
      time: "5 hours ago",
      icon: <Globe className="h-4 w-4 text-amber-500" />,
      color: "bg-amber-100"
    },
    {
      id: 6,
      type: "backup_completed",
      user: "System",
      action: "completed backup",
      target: "Database",
      time: "Today, 3:00 AM",
      icon: <CheckCircle className="h-4 w-4 text-emerald-500" />,
      color: "bg-emerald-100"
    },
    {
      id: 7,
      type: "license_warning",
      user: "Billing System",
      action: "license expires in",
      target: "15 days",
      time: "Yesterday, 6:30 PM",
      icon: <AlertTriangle className="h-4 w-4 text-orange-500" />,
      color: "bg-orange-100"
    }
  ];

  // Get appropriate icon based on activity type
  const getActivityIcon = (type) => {
    switch (type) {
      case "school_added":
        return <School className="h-4 w-4 text-blue-500" />;
      case "user_created":
        return <User className="h-4 w-4 text-green-500" />;
      case "system_update":
        return <Database className="h-4 w-4 text-purple-500" />;
      case "security_alert":
        return <Shield className="h-4 w-4 text-red-500" />;
      case "district_modified":
        return <Globe className="h-4 w-4 text-amber-500" />;
      case "backup_completed":
        return <CheckCircle className="h-4 w-4 text-emerald-500" />;
      case "license_warning":
        return <AlertTriangle className="h-4 w-4 text-orange-500" />;
      default:
        return <Activity className="h-4 w-4 text-gray-500" />;
    }
  };

  return (
    <Card className="h-full shadow-lg">
      <div className="p-6">
        <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
          <Activity className="h-5 w-5 text-indigo-500" />
          Recent Activity
        </h2>
        <p className="text-sm text-gray-500 mb-4">
          All important system activities
        </p>
        
        <ScrollArea className="h-[500px] pr-4">
          <div className="space-y-4">
            {activities.map((activity) => (
              <div key={activity.id} className="flex gap-3">
                <div className={`mt-1 flex-shrink-0 h-8 w-8 rounded-full flex items-center justify-center ${activity.color}`}>
                  {getActivityIcon(activity.type)}
                </div>
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium">
                      <span className="text-gray-900">{activity.user}</span>{" "}
                      <span className="text-gray-600">{activity.action}</span>{" "}
                      <span className="text-gray-900">{activity.target}</span>
                    </p>
                    <span className="text-xs text-gray-500">{activity.time}</span>
                  </div>
                  <div className="mt-1 flex items-center">
                    <Clock className="h-3 w-3 text-gray-400 mr-1" />
                    <span className="text-xs text-gray-500">{activity.time}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>

        <Button variant="outline" className="w-full mt-4">
          View All Activity
        </Button>
      </div>
    </Card>
  );
}