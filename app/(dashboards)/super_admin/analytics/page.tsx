"use client";

import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  School,
  Users,
  BookOpen,
  Clock,
  Award,
  MapPin,
  Filter,
  Download,
  ChevronDown,
  ChevronUp,
  ArrowUp,
  ArrowDown,
  Activity
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
//import { Input } from "@/components/ui/input";
import { DatePicker } from "@/components/ui/date-picker";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export default function AnalyticsPage() {
  const [dateRange, setDateRange] = useState({
    start: new Date(new Date().setFullYear(new Date().getFullYear() - 1)),
    end: new Date()
  });
  const [timeFrame, setTimeFrame] = useState("monthly");
  const [expandedSection, setExpandedSection] = useState<string | null>(null);

  // Sample data - replace with actual API calls
  const systemStats = {
    totalSchools: 42,
    activeSchools: 38,
    newSchoolsThisMonth: 3,
    totalUsers: 1532,
    activeUsers: 1420,
    newUsersThisMonth: 124,
    engagementRate: 78,
    engagementChange: 5.2,
    avgSessionDuration: "12m 45s"
  };

  const schoolGrowthData = [
    { month: "Jan", schools: 12 },
    { month: "Feb", schools: 15 },
    { month: "Mar", schools: 18 },
    { month: "Apr", schools: 22 },
    { month: "May", schools: 25 },
    { month: "Jun", schools: 28 },
    { month: "Jul", schools: 30 },
    { month: "Aug", schools: 33 },
    { month: "Sep", schools: 36 },
    { month: "Oct", schools: 39 },
    { month: "Nov", schools: 41 },
    { month: "Dec", schools: 42 }
  ];

  const userDistributionData = [
    { role: "Students", count: 1250, color: "bg-blue-500" },
    { role: "Teachers", count: 210, color: "bg-green-500" },
    { role: "Parents", count: 980, color: "bg-purple-500" },
    { role: "Admins", count: 92, color: "bg-amber-500" }
  ];

  const districtPerformance = [
    { district: "North District", schools: 12, performance: 82, change: 3.2 },
    { district: "South District", schools: 10, performance: 78, change: -1.5 },
    { district: "East District", schools: 8, performance: 85, change: 4.7 },
    { district: "West District", schools: 7, performance: 76, change: 0.8 },
    { district: "Central District", schools: 5, performance: 89, change: 2.3 }
  ];

  const toggleSection = (section: string) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  return (
    <div className="flex flex-col gap-6 w-full">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold">System Analytics</h1>
          <p className="text-sm text-gray-500">
            Comprehensive insights and performance metrics
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-2 w-full md:w-auto">
          <div className="flex gap-2">
            <DatePicker
              selected={dateRange.start}
              onSelect={(date) => setDateRange({...dateRange, start: date})}
              placeholder="Start date"
            />
            <DatePicker
              selected={dateRange.end}
              onSelect={(date) => setDateRange({...dateRange, end: date})}
              placeholder="End date"
            />
          </div>
          <Select value={timeFrame} onValueChange={setTimeFrame}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Time frame" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="daily">Daily</SelectItem>
              <SelectItem value="weekly">Weekly</SelectItem>
              <SelectItem value="monthly">Monthly</SelectItem>
              <SelectItem value="quarterly">Quarterly</SelectItem>
              <SelectItem value="yearly">Yearly</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" className="gap-2">
            <Download className="h-4 w-4" />
            Export
          </Button>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-4 hover:shadow-md transition-shadow">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-blue-100 rounded-lg text-blue-600">
              <School className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Total Schools</p>
              <div className="flex items-baseline gap-2">
                <p className="text-2xl font-bold">{systemStats.totalSchools}</p>
                <Badge variant="outline" className="text-green-500 border-green-200">
                  +{systemStats.newSchoolsThisMonth} this month
                </Badge>
              </div>
            </div>
          </div>
        </Card>
        <Card className="p-4 hover:shadow-md transition-shadow">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-green-100 rounded-lg text-green-600">
              <Users className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Total Users</p>
              <div className="flex items-baseline gap-2">
                <p className="text-2xl font-bold">{systemStats.totalUsers}</p>
                <Badge variant="outline" className="text-green-500 border-green-200">
                  +{systemStats.newUsersThisMonth} this month
                </Badge>
              </div>
            </div>
          </div>
        </Card>
        <Card className="p-4 hover:shadow-md transition-shadow">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-purple-100 rounded-lg text-purple-600">
              <Activity className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Engagement Rate</p>
              <div className="flex items-baseline gap-2">
                <p className="text-2xl font-bold">{systemStats.engagementRate}%</p>
                <Badge variant="outline" className={
                  systemStats.engagementChange > 0 
                    ? "text-green-500 border-green-200" 
                    : "text-red-500 border-red-200"
                }>
                  {systemStats.engagementChange > 0 ? "↑" : "↓"} {Math.abs(systemStats.engagementChange)}%
                </Badge>
              </div>
            </div>
          </div>
        </Card>
        <Card className="p-4 hover:shadow-md transition-shadow">
          <div className="flex items-center gap-4">
            <div className="p-3 bg-amber-100 rounded-lg text-amber-600">
              <Clock className="h-5 w-5" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Avg. Session</p>
              <p className="text-2xl font-bold">{systemStats.avgSessionDuration}</p>
            </div>
          </div>
        </Card>
      </div>

      {/* School Growth Chart */}
      <Card className="p-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-100 rounded-lg text-blue-600">
              <School className="h-5 w-5" />
            </div>
            <h2 className="text-lg font-semibold">School Growth</h2>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" size="sm" className="gap-2">
              <Filter className="h-4 w-4" />
              Filter
            </Button>
            <Button variant="outline" size="sm" className="gap-2">
              <Download className="h-4 w-4" />
              Export
            </Button>
          </div>
        </div>
        <div className="h-80">
          {/* Replace with actual chart component */}
          <div className="flex items-end justify-between h-full pt-8">
            {schoolGrowthData.map((data, index) => (
              <div key={index} className="flex flex-col items-center">
                <div 
                  className="w-8 bg-blue-500 rounded-t-sm"
                  style={{ height: `${(data.schools / 50) * 100}%` }}
                />
                <span className="text-xs text-gray-500 mt-1">{data.month}</span>
              </div>
            ))}
          </div>
        </div>
      </Card>

      {/* User Distribution */}
      <Card className="p-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-green-100 rounded-lg text-green-600">
              <Users className="h-5 w-5" />
            </div>
            <h2 className="text-lg font-semibold">User Distribution</h2>
          </div>
          <Button variant="outline" size="sm" className="gap-2">
            <Download className="h-4 w-4" />
            Export
          </Button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="h-64">
            {/* Replace with actual pie chart component */}
            <div className="flex justify-center items-center h-full">
              <div className="relative w-48 h-48 rounded-full border-8 border-gray-200">
                {userDistributionData.map((data, index) => {
                  //const percentage = (data.count / systemStats.totalUsers) * 100;
                  const rotation = userDistributionData
                    .slice(0, index)
                    .reduce((acc, curr) => acc + (curr.count / systemStats.totalUsers) * 360, 0);
                  
                  return (
                    <div
                      key={index}
                      className={`absolute top-0 left-0 w-full h-full rounded-full ${data.color}`}
                      style={{
                        clipPath: `polygon(50% 50%, 50% 0%, ${
                          50 + 50 * Math.cos((rotation * Math.PI) / 180)
                        }% ${
                          50 + 50 * Math.sin((rotation * Math.PI) / 180)
                        }%)`,
                        opacity: 0.7
                      }}
                    />
                  );
                })}
              </div>
            </div>
          </div>
          <div className="space-y-4">
            {userDistributionData.map((data, index) => (
              <div key={index} className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`w-3 h-3 rounded-full ${data.color}`} />
                  <span>{data.role}</span>
                </div>
                <div className="flex items-center gap-4">
                  <span className="font-medium">{data.count}</span>
                  <span className="text-sm text-gray-500">
                    {((data.count / systemStats.totalUsers) * 100).toFixed(1)}%
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </Card>

      {/* District Performance */}
      <Card className="p-6">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-purple-100 rounded-lg text-purple-600">
              <MapPin className="h-5 w-5" />
            </div>
            <h2 className="text-lg font-semibold">District Performance</h2>
          </div>
          <Button variant="outline" size="sm" className="gap-2">
            <Download className="h-4 w-4" />
            Export
          </Button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="text-left text-sm text-gray-500 border-b">
                <th className="pb-3">District</th>
                <th className="pb-3 text-right">Schools</th>
                <th className="pb-3 text-right">Performance</th>
                <th className="pb-3 text-right">Change</th>
              </tr>
            </thead>
            <tbody>
              {districtPerformance.map((district, index) => (
                <tr key={index} className="border-b hover:bg-gray-50">
                  <td className="py-3">{district.district}</td>
                  <td className="py-3 text-right">{district.schools}</td>
                  <td className="py-3 text-right font-medium">{district.performance}/100</td>
                  <td className="py-3 text-right">
                    <div className="flex items-center justify-end gap-1">
                      {district.change > 0 ? (
                        <ArrowUp className="h-4 w-4 text-green-500" />
                      ) : (
                        <ArrowDown className="h-4 w-4 text-red-500" />
                      )}
                      <span className={district.change > 0 ? "text-green-500" : "text-red-500"}>
                        {Math.abs(district.change)}%
                      </span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Additional Analytics Sections */}
      <div className="space-y-4">
        {/* Engagement Metrics */}
        <Card>
          <button 
            className="w-full p-6 text-left flex justify-between items-center hover:bg-gray-50"
            onClick={() => toggleSection("engagement")}
          >
            <div className="flex items-center gap-3">
              <div className="p-2 bg-amber-100 rounded-lg text-amber-600">
                <Activity className="h-5 w-5" />
              </div>
              <h2 className="text-lg font-semibold">Engagement Metrics</h2>
            </div>
            {expandedSection === "engagement" ? (
              <ChevronUp className="h-5 w-5 text-gray-500" />
            ) : (
              <ChevronDown className="h-5 w-5 text-gray-500" />
            )}
          </button>
          {expandedSection === "engagement" && (
            <div className="p-6 pt-0 border-t">
              <div className="h-80 bg-gray-50 rounded-lg flex items-center justify-center text-gray-400">
                Engagement metrics chart will be displayed here
              </div>
            </div>
          )}
        </Card>

        {/* Feature Usage */}
        <Card>
          <button 
            className="w-full p-6 text-left flex justify-between items-center hover:bg-gray-50"
            onClick={() => toggleSection("features")}
          >
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg text-blue-600">
                <BookOpen className="h-5 w-5" />
              </div>
              <h2 className="text-lg font-semibold">Feature Usage</h2>
            </div>
            {expandedSection === "features" ? (
              <ChevronUp className="h-5 w-5 text-gray-500" />
            ) : (
              <ChevronDown className="h-5 w-5 text-gray-500" />
            )}
          </button>
          {expandedSection === "features" && (
            <div className="p-6 pt-0 border-t">
              <div className="h-80 bg-gray-50 rounded-lg flex items-center justify-center text-gray-400">
                Feature usage chart will be displayed here
              </div>
            </div>
          )}
        </Card>

        {/* Academic Performance */}
        <Card>
          <button 
            className="w-full p-6 text-left flex justify-between items-center hover:bg-gray-50"
            onClick={() => toggleSection("academic")}
          >
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-lg text-green-600">
                <Award className="h-5 w-5" />
              </div>
              <h2 className="text-lg font-semibold">Academic Performance</h2>
            </div>
            {expandedSection === "academic" ? (
              <ChevronUp className="h-5 w-5 text-gray-500" />
            ) : (
              <ChevronDown className="h-5 w-5 text-gray-500" />
            )}
          </button>
          {expandedSection === "academic" && (
            <div className="p-6 pt-0 border-t">
              <div className="h-80 bg-gray-50 rounded-lg flex items-center justify-center text-gray-400">
                Academic performance chart will be displayed here
              </div>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}