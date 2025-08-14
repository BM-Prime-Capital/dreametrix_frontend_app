"use client";
import React, { useState } from 'react';
import { 
  FiSettings, FiUser, FiLock, FiBell, 
  FiMail, FiDatabase, FiShield,
  FiSave, FiDownload, FiUpload, FiTrash2
} from 'react-icons/fi';
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";
import { Button } from '@/ui/Button';
import { Card } from '@/components/ui/card';

const SchoolAdminSettings = () => {
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [emailNotifications, setEmailNotifications] = useState(true);
  const [language, setLanguage] = useState('en');
  const [timezone, setTimezone] = useState('UTC+0');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const languages = [
    { value: 'en', label: 'English' },
    { value: 'fr', label: 'French' },
    { value: 'es', label: 'Spanish' },
    { value: 'de', label: 'German' },
  ];

  const timezones = [
    { value: 'UTC+0', label: 'UTC (London)' },
    { value: 'UTC+1', label: 'UTC+1 (Paris)' },
    { value: 'UTC-5', label: 'UTC-5 (New York)' },
    { value: 'UTC-8', label: 'UTC-8 (Los Angeles)' },
  ];

  return (
    <div className="w-full space-y-6">
      <Card className="p-4 sm:p-6">
        <div className="flex flex-col space-y-6">
          {/* Header */}
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-semibold tracking-tight text-blue-500">
              SCHOOL SETTINGS
            </h1>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="icon" className="h-8 w-8">
                <FiSettings className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Tabs */}
          <Tabs defaultValue="account" className="w-full">
            <TabsList className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-7 h-auto gap-2">
              <TabsTrigger 
                value="account" 
                className="data-[state=active]:bg-blue-500 data-[state=active]:text-white gap-2"
              >
                <FiUser className="h-4 w-4" />
                Account
              </TabsTrigger>
              <TabsTrigger 
                value="security" 
                className="data-[state=active]:bg-blue-500 data-[state=active]:text-white gap-2"
              >
                <FiLock className="h-4 w-4" />
                Security
              </TabsTrigger>
              <TabsTrigger 
                value="notifications" 
                className="data-[state=active]:bg-blue-500 data-[state=active]:text-white gap-2"
              >
                <FiBell className="h-4 w-4" />
                Notifications
              </TabsTrigger>
              <TabsTrigger 
                value="email" 
                className="data-[state=active]:bg-blue-500 data-[state=active]:text-white gap-2"
              >
                <FiMail className="h-4 w-4" />
                Email
              </TabsTrigger>
              <TabsTrigger 
                value="preferences" 
                className="data-[state=active]:bg-blue-500 data-[state=active]:text-white gap-2"
              >
                <FiSettings className="h-4 w-4" />
                Preferences
              </TabsTrigger>
              <TabsTrigger 
                value="data" 
                className="data-[state=active]:bg-blue-500 data-[state=active]:text-white gap-2"
              >
                <FiDatabase className="h-4 w-4" />
                Data
              </TabsTrigger>
              <TabsTrigger 
                value="privacy" 
                className="data-[state=active]:bg-blue-500 data-[state=active]:text-white gap-2"
              >
                <FiShield className="h-4 w-4" />
                Privacy
              </TabsTrigger>
            </TabsList>

            {/* Account Settings */}
            <TabsContent value="account" className="mt-6">
              <div className="space-y-4">
                <h2 className="text-xl font-semibold">Account Information</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">School Name</label>
                    <input 
                      type="text" 
                      placeholder="Enter school name" 
                      className="w-full p-2 border rounded-md"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Admin Name</label>
                    <input 
                      type="text" 
                      placeholder="Enter admin name" 
                      className="w-full p-2 border rounded-md"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Contact Email</label>
                    <input 
                      type="email" 
                      placeholder="Enter contact email" 
                      className="w-full p-2 border rounded-md"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Phone Number</label>
                    <input 
                      type="tel" 
                      placeholder="Enter phone number" 
                      className="w-full p-2 border rounded-md"
                    />
                  </div>
                </div>
                <div className="flex justify-end">
                  <Button className="bg-blue-500 hover:bg-blue-600 text-white gap-2">
                    <FiSave className="h-4 w-4" />
                    Save Changes
                  </Button>
                </div>
              </div>
            </TabsContent>

            {/* Security Settings */}
            <TabsContent value="security" className="mt-6">
              <div className="space-y-6">
                <h2 className="text-xl font-semibold">Change Password</h2>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Current Password</label>
                    <input 
                      type="password"
                      placeholder="Enter current password" 
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      className="w-full p-2 border rounded-md"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">New Password</label>
                    <input 
                      type="password"
                      placeholder="Enter new password" 
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="w-full p-2 border rounded-md"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Confirm New Password</label>
                    <input 
                      type="password"
                      placeholder="Confirm new password" 
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="w-full p-2 border rounded-md"
                    />
                  </div>
                </div>
                <div className="flex justify-end">
                  <Button className="bg-blue-500 hover:bg-blue-600 text-white">
                    Update Password
                  </Button>
                </div>

                <h2 className="text-xl font-semibold mt-8">Two-Factor Authentication</h2>
                <div className="flex items-center justify-between p-4 border rounded-md">
                  <div>
                    <h3 className="font-medium">SMS Authentication</h3>
                    <p className="text-sm text-gray-600">Receive verification codes via SMS</p>
                  </div>
                  <Button variant={notificationsEnabled ? "default" : "outline"}>
                    {notificationsEnabled ? "Enabled" : "Enable"}
                  </Button>
                </div>
              </div>
            </TabsContent>

            {/* Notification Settings */}
            <TabsContent value="notifications" className="mt-6">
              <div className="space-y-6">
                <h2 className="text-xl font-semibold">Notification Preferences</h2>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 border rounded-md">
                    <div>
                      <h3 className="font-medium">Enable Notifications</h3>
                      <p className="text-sm text-gray-600">Receive system notifications</p>
                    </div>
                    <Button 
                      variant={notificationsEnabled ? "default" : "outline"}
                      onClick={() => setNotificationsEnabled(!notificationsEnabled)}
                    >
                      {notificationsEnabled ? "On" : "Off"}
                    </Button>
                  </div>

                  <div className="flex items-center justify-between p-4 border rounded-md">
                    <div>
                      <h3 className="font-medium">Email Notifications</h3>
                      <p className="text-sm text-gray-600">Receive notifications via email</p>
                    </div>
                    <Button 
                      variant={emailNotifications ? "default" : "outline"}
                      onClick={() => setEmailNotifications(!emailNotifications)}
                    >
                      {emailNotifications ? "On" : "Off"}
                    </Button>
                  </div>
                </div>

                <h2 className="text-xl font-semibold mt-8">Notification Types</h2>
                <div className="space-y-2">
                  {[
                    "New Student Enrollment",
                    "Attendance Alerts", 
                    "Grade Submissions",
                    "System Updates"
                  ].map((item) => (
                    <div key={item} className="flex items-center justify-between p-3 border rounded-md">
                      <span>{item}</span>
                      <Button variant="default">On</Button>
                    </div>
                  ))}
                </div>
              </div>
            </TabsContent>

            {/* Email Settings */}
            <TabsContent value="email" className="mt-6">
              <div className="space-y-4">
                <h2 className="text-xl font-semibold">Email Configuration</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">SMTP Server</label>
                    <input 
                      type="text" 
                      placeholder="Enter SMTP server" 
                      className="w-full p-2 border rounded-md"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Port</label>
                    <input 
                      type="number" 
                      placeholder="Enter port" 
                      className="w-full p-2 border rounded-md"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Username</label>
                    <input 
                      type="text" 
                      placeholder="Enter username" 
                      className="w-full p-2 border rounded-md"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Password</label>
                    <input 
                      type="password" 
                      placeholder="Enter password" 
                      className="w-full p-2 border rounded-md"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">From Email Address</label>
                    <input 
                      type="email" 
                      placeholder="Enter from email" 
                      className="w-full p-2 border rounded-md"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-sm font-medium">From Name</label>
                    <input 
                      type="text" 
                      placeholder="Enter from name" 
                      className="w-full p-2 border rounded-md"
                    />
                  </div>
                </div>
                <div className="flex justify-end">
                  <Button className="bg-blue-500 hover:bg-blue-600 text-white gap-2">
                    <FiSave className="h-4 w-4" />
                    Save Email Settings
                  </Button>
                </div>
              </div>
            </TabsContent>

            {/* Preferences */}
            <TabsContent value="preferences" className="mt-6">
              <div className="space-y-6">
                <h2 className="text-xl font-semibold">System Preferences</h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-sm font-medium">Language</label>
                    <select 
                      value={language}
                      onChange={(e) => setLanguage(e.target.value)}
                      className="w-full p-2 border rounded-md"
                    >
                      {languages.map((lang) => (
                        <option key={lang.value} value={lang.value}>
                          {lang.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium">Timezone</label>
                    <select 
                      value={timezone}
                      onChange={(e) => setTimezone(e.target.value)}
                      className="w-full p-2 border rounded-md"
                    >
                      {timezones.map((tz) => (
                        <option key={tz.value} value={tz.value}>
                          {tz.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                <h2 className="text-xl font-semibold mt-8">Display Preferences</h2>
                <div className="flex gap-4">
                  <Button variant="default" className="flex-1">
                    Light Mode
                  </Button>
                  <Button variant="outline" className="flex-1">
                    Dark Mode
                  </Button>
                </div>

                <div className="flex justify-end">
                  <Button className="bg-blue-500 hover:bg-blue-600 text-white gap-2">
                    <FiSave className="h-4 w-4" />
                    Save Preferences
                  </Button>
                </div>
              </div>
            </TabsContent>

            {/* Data Management */}
            <TabsContent value="data" className="mt-6">
              <div className="space-y-6">
                <h2 className="text-xl font-semibold">Data Management</h2>
                
                <Card className="p-4">
                  <h3 className="text-lg font-medium">Export Data</h3>
                  <p className="text-sm text-gray-600 mt-1">Download all school data in CSV format</p>
                  <div className="flex flex-wrap gap-3 mt-4">
                    <Button variant="outline" className="gap-2">
                      <FiDownload className="h-4 w-4" />
                      Export Students
                    </Button>
                    <Button variant="outline" className="gap-2">
                      <FiDownload className="h-4 w-4" />
                      Export Teachers
                    </Button>
                    <Button variant="outline" className="gap-2">
                      <FiDownload className="h-4 w-4" />
                      Export Grades
                    </Button>
                  </div>
                </Card>

                <Card className="p-4">
                  <h3 className="text-lg font-medium">Backup & Restore</h3>
                  <p className="text-sm text-gray-600 mt-1">Create or restore a full system backup</p>
                  <div className="flex flex-wrap gap-3 mt-4">
                    <Button variant="outline" className="gap-2">
                      <FiDownload className="h-4 w-4" />
                      Create Backup
                    </Button>
                    <Button variant="outline" className="gap-2">
                      <FiUpload className="h-4 w-4" />
                      Restore Backup
                    </Button>
                  </div>
                </Card>

                <Card className="p-4 border-red-200 bg-red-50">
                  <h3 className="text-lg font-medium text-red-600">Danger Zone</h3>
                  <p className="text-sm text-red-500 mt-1">These actions are irreversible</p>
                  <div className="flex flex-wrap gap-3 mt-4">
                    <Button variant="outline" className="text-red-600 border-red-300 gap-2">
                      <FiTrash2 className="h-4 w-4" />
                      Reset All Data
                    </Button>
                    <Button variant="destructive" className="gap-2">
                      <FiTrash2 className="h-4 w-4" />
                      Delete School Account
                    </Button>
                  </div>
                </Card>
              </div>
            </TabsContent>

            {/* Privacy Settings */}
            <TabsContent value="privacy" className="mt-6">
              <div className="space-y-6">
                <h2 className="text-xl font-semibold">Privacy Settings</h2>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 border rounded-md">
                    <div>
                      <h3 className="font-medium">Data Collection for Analytics</h3>
                      <p className="text-sm text-gray-600">Help us improve by sharing usage data</p>
                    </div>
                    <Button variant="outline">Disabled</Button>
                  </div>

                  <div className="flex items-center justify-between p-4 border rounded-md">
                    <div>
                      <h3 className="font-medium">Show School in Public Directory</h3>
                      <p className="text-sm text-gray-600">Make your school discoverable</p>
                    </div>
                    <Button variant="default">Enabled</Button>
                  </div>
                </div>

                <h2 className="text-xl font-semibold mt-8">Privacy Policy</h2>
                <p className="text-gray-600">
                  Our privacy policy outlines how we collect, use, and protect your data.
                  You can review our full policy at any time.
                </p>
                <Button variant="outline" className="mt-2">
                  View Privacy Policy
                </Button>

                <h2 className="text-xl font-semibold mt-8">GDPR Compliance</h2>
                <p className="text-gray-600">
                  We comply with the General Data Protection Regulation (GDPR).
                  You can request a copy of all data we have about you or request deletion.
                </p>
                <div className="flex flex-wrap gap-3 mt-4">
                  <Button variant="outline">
                    Request Data Export
                  </Button>
                  <Button variant="outline" className="text-red-600 border-red-300">
                    Request Data Deletion
                  </Button>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </Card>
    </div>
  );
};

export default SchoolAdminSettings;