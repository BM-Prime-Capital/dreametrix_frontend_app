/* eslint-disable @typescript-eslint/no-explicit-any */
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Settings,
  Save,
  Globe,
  Lock,
  Bell,
  Users,
  Database,
  Shield,
  Loader2,
  AlertCircle
} from "lucide-react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export default function SystemSettingsPage() {
  const [isSaving, setIsSaving] = useState(false);
  const [activeTab, setActiveTab] = useState("general");

  // System settings state
  const [settings, setSettings] = useState({
    general: {
      systemName: "EduManage Pro",
      timezone: "America/New_York",
      dateFormat: "MM/DD/YYYY",
      timeFormat: "12h",
      defaultLanguage: "en",
      maintenanceMode: false,
    },
    security: {
      require2FA: true,
      passwordComplexity: "medium",
      loginAttempts: 5,
      sessionTimeout: 30, // minutes
      dataEncryption: true,
    },
    notifications: {
      emailNotifications: true,
      systemAlerts: true,
      updateNotifications: true,
      newsletter: false,
    },
    integrations: {
      googleAuth: true,
      microsoftAuth: false,
      smtpEnabled: true,
      smtpConfig: {
        host: "smtp.example.com",
        port: 587,
        username: "admin@example.com",
        secure: true,
      },
    },
    advanced: {
      cacheEnabled: true,
      loggingLevel: "info",
      analyticsEnabled: true,
      backupFrequency: "daily",
    }
  });

  const handleSave = async (section: string) => {
    setIsSaving(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      console.log(`Saved ${section} settings`);
    } finally {
      setIsSaving(false);
    }
  };

  const handleChange = (section: string, field: string, value: any) => {
    setSettings(prev => ({
      ...prev,
      [section]: {
        ...prev[section as keyof typeof prev],
        [field]: value
      }
    }));
  };

  return (
    <div className="flex flex-col gap-6 w-full">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <Settings className="h-6 w-6" />
            System Settings
          </h1>
          <p className="text-sm text-gray-500">
            Configure global system settings and preferences
          </p>
        </div>
        <Button 
          className="gap-2" 
          onClick={() => handleSave(activeTab)}
          disabled={isSaving}
        >
          {isSaving ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Save className="h-4 w-4" />
          )}
          Save Changes
        </Button>
      </div>

      {/* Settings Tabs */}
      <Tabs 
        value={activeTab} 
        onValueChange={setActiveTab}
        className="w-full"
      >
        <TabsList className="grid w-full grid-cols-2 md:grid-cols-5 h-auto">
          <TabsTrigger value="general" className="flex gap-2 py-3">
            <Globe className="h-4 w-4" />
            General
          </TabsTrigger>
          <TabsTrigger value="security" className="flex gap-2 py-3">
            <Lock className="h-4 w-4" />
            Security
          </TabsTrigger>
          <TabsTrigger value="notifications" className="flex gap-2 py-3">
            <Bell className="h-4 w-4" />
            Notifications
          </TabsTrigger>
          <TabsTrigger value="integrations" className="flex gap-2 py-3">
            <Users className="h-4 w-4" />
            Integrations
          </TabsTrigger>
          <TabsTrigger value="advanced" className="flex gap-2 py-3">
            <Database className="h-4 w-4" />
            Advanced
          </TabsTrigger>
        </TabsList>

        {/* General Settings */}
        <TabsContent value="general">
          <Card className="p-6">
            <div className="space-y-6">
              <div>
                <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <Globe className="h-5 w-5" />
                  General Settings
                </h2>
                <p className="text-sm text-gray-500 mb-6">
                  Configure basic system information and display preferences
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="systemName">System Name</Label>
                  <Input
                    id="systemName"
                    value={settings.general.systemName}
                    onChange={(e) => handleChange("general", "systemName", e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="timezone">Timezone</Label>
                  <select
                    id="timezone"
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    value={settings.general.timezone}
                    onChange={(e) => handleChange("general", "timezone", e.target.value)}
                  >
                    <option value="America/New_York">Eastern Time (ET)</option>
                    <option value="America/Chicago">Central Time (CT)</option>
                    <option value="America/Denver">Mountain Time (MT)</option>
                    <option value="America/Los_Angeles">Pacific Time (PT)</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="dateFormat">Date Format</Label>
                  <select
                    id="dateFormat"
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    value={settings.general.dateFormat}
                    onChange={(e) => handleChange("general", "dateFormat", e.target.value)}
                  >
                    <option value="MM/DD/YYYY">MM/DD/YYYY</option>
                    <option value="DD/MM/YYYY">DD/MM/YYYY</option>
                    <option value="YYYY-MM-DD">YYYY-MM-DD</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="timeFormat">Time Format</Label>
                  <select
                    id="timeFormat"
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    value={settings.general.timeFormat}
                    onChange={(e) => handleChange("general", "timeFormat", e.target.value)}
                  >
                    <option value="12h">12-hour</option>
                    <option value="24h">24-hour</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="defaultLanguage">Default Language</Label>
                  <select
                    id="defaultLanguage"
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    value={settings.general.defaultLanguage}
                    onChange={(e) => handleChange("general", "defaultLanguage", e.target.value)}
                  >
                    <option value="en">English</option>
                    <option value="es">Spanish</option>
                    <option value="fr">French</option>
                    <option value="de">German</option>
                  </select>
                </div>

                <div className="flex items-center justify-between pt-2">
                  <div>
                    <Label htmlFor="maintenanceMode">Maintenance Mode</Label>
                    <p className="text-sm text-gray-500">
                      When enabled, only admins can access the system
                    </p>
                  </div>
                  <Switch
                    id="maintenanceMode"
                    checked={settings.general.maintenanceMode}
                    onCheckedChange={(val) => handleChange("general", "maintenanceMode", val)}
                  />
                </div>
              </div>
            </div>
          </Card>
        </TabsContent>

        {/* Security Settings */}
        <TabsContent value="security">
          <Card className="p-6">
            <div className="space-y-6">
              <div>
                <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <Lock className="h-5 w-5" />
                  Security Settings
                </h2>
                <p className="text-sm text-gray-500 mb-6">
                  Configure system security and authentication policies
                </p>
              </div>

              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="require2FA">Require Two-Factor Authentication</Label>
                    <p className="text-sm text-gray-500">
                      All users will need to set up 2FA on next login
                    </p>
                  </div>
                  <Switch
                    id="require2FA"
                    checked={settings.security.require2FA}
                    onCheckedChange={(val) => handleChange("security", "require2FA", val)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="passwordComplexity">Password Complexity</Label>
                  <select
                    id="passwordComplexity"
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    value={settings.security.passwordComplexity}
                    onChange={(e) => handleChange("security", "passwordComplexity", e.target.value)}
                  >
                    <option value="low">Low (6+ characters)</option>
                    <option value="medium">Medium (8+ chars with mix)</option>
                    <option value="high">High (10+ chars with special)</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="loginAttempts">Failed Login Attempts Before Lockout</Label>
                  <Input
                    id="loginAttempts"
                    type="number"
                    min="1"
                    max="10"
                    value={settings.security.loginAttempts}
                    onChange={(e) => handleChange("security", "loginAttempts", parseInt(e.target.value))}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="sessionTimeout">Session Timeout (minutes)</Label>
                  <Input
                    id="sessionTimeout"
                    type="number"
                    min="1"
                    max="1440"
                    value={settings.security.sessionTimeout}
                    onChange={(e) => handleChange("security", "sessionTimeout", parseInt(e.target.value))}
                  />
                </div>

                <div className="flex items-center justify-between pt-2">
                  <div>
                    <Label htmlFor="dataEncryption">Data Encryption</Label>
                    <p className="text-sm text-gray-500">
                      Encrypt sensitive data at rest in the database
                    </p>
                  </div>
                  <Switch
                    id="dataEncryption"
                    checked={settings.security.dataEncryption}
                    onCheckedChange={(val) => handleChange("security", "dataEncryption", val)}
                  />
                </div>

                <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <div className="flex items-start gap-3">
                    <Shield className="h-5 w-5 text-blue-600 mt-0.5" />
                    <div>
                      <h4 className="font-medium text-blue-800">Security Recommendations</h4>
                      <p className="text-sm text-blue-700 mt-1">
                        For maximum security, enable 2FA, set password complexity to High,
                        and keep data encryption enabled.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </TabsContent>

        {/* Notification Settings */}
        <TabsContent value="notifications">
          <Card className="p-6">
            <div className="space-y-6">
              <div>
                <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <Bell className="h-5 w-5" />
                  Notification Settings
                </h2>
                <p className="text-sm text-gray-500 mb-6">
                  Configure system-wide notification preferences
                </p>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="emailNotifications">Email Notifications</Label>
                    <p className="text-sm text-gray-500">
                      Enable all email notifications system-wide
                    </p>
                  </div>
                  <Switch
                    id="emailNotifications"
                    checked={settings.notifications.emailNotifications}
                    onCheckedChange={(val) => handleChange("notifications", "emailNotifications", val)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="systemAlerts">System Alerts</Label>
                    <p className="text-sm text-gray-500">
                      Critical system alerts and notifications
                    </p>
                  </div>
                  <Switch
                    id="systemAlerts"
                    checked={settings.notifications.systemAlerts}
                    onCheckedChange={(val) => handleChange("notifications", "systemAlerts", val)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="updateNotifications">Update Notifications</Label>
                    <p className="text-sm text-gray-500">
                      Notify admins about available system updates
                    </p>
                  </div>
                  <Switch
                    id="updateNotifications"
                    checked={settings.notifications.updateNotifications}
                    onCheckedChange={(val) => handleChange("notifications", "updateNotifications", val)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="newsletter">Newsletter</Label>
                    <p className="text-sm text-gray-500">
                      Monthly product updates and tips
                    </p>
                  </div>
                  <Switch
                    id="newsletter"
                    checked={settings.notifications.newsletter}
                    onCheckedChange={(val) => handleChange("notifications", "newsletter", val)}
                  />
                </div>

                <div className="p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                  <div className="flex items-start gap-3">
                    <AlertCircle className="h-5 w-5 text-yellow-600 mt-0.5" />
                    <div>
                      <h4 className="font-medium text-yellow-800">Notification Preferences</h4>
                      <p className="text-sm text-yellow-700 mt-1">
                        Users can override some of these settings in their personal preferences.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </TabsContent>

        {/* Integration Settings */}
        <TabsContent value="integrations">
          <Card className="p-6">
            <div className="space-y-6">
              <div>
                <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <Users className="h-5 w-5" />
                  Integration Settings
                </h2>
                <p className="text-sm text-gray-500 mb-6">
                  Configure third-party integrations and authentication providers
                </p>
              </div>

              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="googleAuth">Google Authentication</Label>
                    <p className="text-sm text-gray-500">
                      Allow users to sign in with Google accounts
                    </p>
                  </div>
                  <Switch
                    id="googleAuth"
                    checked={settings.integrations.googleAuth}
                    onCheckedChange={(val) => handleChange("integrations", "googleAuth", val)}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="microsoftAuth">Microsoft Authentication</Label>
                    <p className="text-sm text-gray-500">
                      Allow users to sign in with Microsoft accounts
                    </p>
                  </div>
                  <Switch
                    id="microsoftAuth"
                    checked={settings.integrations.microsoftAuth}
                    onCheckedChange={(val) => handleChange("integrations", "microsoftAuth", val)}
                  />
                </div>

                <div className="flex items-center justify-between pt-4 border-t">
                  <div>
                    <Label htmlFor="smtpEnabled">SMTP Email Server</Label>
                    <p className="text-sm text-gray-500">
                      Configure outgoing email server settings
                    </p>
                  </div>
                  <Switch
                    id="smtpEnabled"
                    checked={settings.integrations.smtpEnabled}
                    onCheckedChange={(val) => handleChange("integrations", "smtpEnabled", val)}
                  />
                </div>

                {settings.integrations.smtpEnabled && (
                  <div className="space-y-4 p-4 bg-gray-50 rounded-lg">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="smtpHost">SMTP Host</Label>
                        <Input
                          id="smtpHost"
                          value={settings.integrations.smtpConfig.host}
                          onChange={(e) => handleChange("integrations", "smtpConfig", {
                            ...settings.integrations.smtpConfig,
                            host: e.target.value
                          })}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="smtpPort">SMTP Port</Label>
                        <Input
                          id="smtpPort"
                          type="number"
                          value={settings.integrations.smtpConfig.port}
                          onChange={(e) => handleChange("integrations", "smtpConfig", {
                            ...settings.integrations.smtpConfig,
                            port: parseInt(e.target.value)
                          })}
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="smtpUsername">SMTP Username</Label>
                      <Input
                        id="smtpUsername"
                        value={settings.integrations.smtpConfig.username}
                        onChange={(e) => handleChange("integrations", "smtpConfig", {
                          ...settings.integrations.smtpConfig,
                          username: e.target.value
                        })}
                      />
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch
                        id="smtpSecure"
                        checked={settings.integrations.smtpConfig.secure}
                        onCheckedChange={(val) => handleChange("integrations", "smtpConfig", {
                          ...settings.integrations.smtpConfig,
                          secure: val
                        })}
                      />
                      <Label htmlFor="smtpSecure">Use SSL/TLS</Label>
                    </div>
                  </div>
                )}

                <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <div className="flex items-start gap-3">
                    <AlertCircle className="h-5 w-5 text-blue-600 mt-0.5" />
                    <div>
                      <h4 className="font-medium text-blue-800">Integration Notes</h4>
                      <p className="text-sm text-blue-700 mt-1">
                        Some integrations may require additional configuration in the
                        authentication providers&apos; developer consoles.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </TabsContent>

        {/* Advanced Settings */}
        <TabsContent value="advanced">
          <Card className="p-6">
            <div className="space-y-6">
              <div>
                <h2 className="text-lg font-semibold mb-4 flex items-center gap-2">
                  <Database className="h-5 w-5" />
                  Advanced Settings
                </h2>
                <p className="text-sm text-gray-500 mb-6">
                  Configure advanced system behaviors and performance
                </p>
              </div>

              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="cacheEnabled">System Caching</Label>
                    <p className="text-sm text-gray-500">
                      Improve performance by caching frequently accessed data
                    </p>
                  </div>
                  <Switch
                    id="cacheEnabled"
                    checked={settings.advanced.cacheEnabled}
                    onCheckedChange={(val) => handleChange("advanced", "cacheEnabled", val)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="loggingLevel">Logging Level</Label>
                  <select
                    id="loggingLevel"
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    value={settings.advanced.loggingLevel}
                    onChange={(e) => handleChange("advanced", "loggingLevel", e.target.value)}
                  >
                    <option value="error">Error only</option>
                    <option value="warn">Warning</option>
                    <option value="info">Information</option>
                    <option value="debug">Debug</option>
                  </select>
                </div>

                <div className="flex items-center justify-between">
                  <div>
                    <Label htmlFor="analyticsEnabled">System Analytics</Label>
                    <p className="text-sm text-gray-500">
                      Collect anonymous usage data to improve the product
                    </p>
                  </div>
                  <Switch
                    id="analyticsEnabled"
                    checked={settings.advanced.analyticsEnabled}
                    onCheckedChange={(val) => handleChange("advanced", "analyticsEnabled", val)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="backupFrequency">Automatic Backup Frequency</Label>
                  <select
                    id="backupFrequency"
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                    value={settings.advanced.backupFrequency}
                    onChange={(e) => handleChange("advanced", "backupFrequency", e.target.value)}
                  >
                    <option value="daily">Daily</option>
                    <option value="weekly">Weekly</option>
                    <option value="monthly">Monthly</option>
                  </select>
                </div>

                <div className="p-4 bg-red-50 rounded-lg border border-red-200">
                  <div className="flex items-start gap-3">
                    <AlertCircle className="h-5 w-5 text-red-600 mt-0.5" />
                    <div>
                      <h4 className="font-medium text-red-800">Warning</h4>
                      <p className="text-sm text-red-700 mt-1">
                        Changing these settings may affect system performance and stability.
                        Modify with caution.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}