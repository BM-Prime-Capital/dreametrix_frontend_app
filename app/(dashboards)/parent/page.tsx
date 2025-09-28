"use client"

import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { 
  AlertTriangle,
  CheckCircle,
  Clock,
  MessageSquare,
  Users,
  BookOpen,
  Calendar,
  Award,
  Star,
  TrendingUp,
  TrendingDown,
  Bell,
  Eye,
  Trophy,
  GraduationCap,
  Heart,
  FileText,
  Phone,
  Mail,
  AlertCircle,
  Info,
  Sparkles,
  User,
  Settings,
  LogOut,
  Shield,
  CreditCard,
  Home
} from "lucide-react"

export default function ParentDashboardPage() {
  return (
    <div className="w-full min-h-screen bg-gray-50 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header principal */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Sparkles className="h-8 w-8 text-blue-600" />
              <h1 className="text-4xl font-bold text-gray-800">
                Parent Dashboard
              </h1>
            </div>
            <div className="flex items-center gap-4">
              <Badge className="bg-green-100 text-green-800 border-green-200 px-4 py-2 font-medium">
                <CheckCircle className="h-4 w-4 mr-1" />
                All Children Present
              </Badge>
            </div>
          </div>
        </div>

        {/* Layout principal en 3 colonnes */}
        <div className="grid grid-cols-12 gap-6">
          
          {/* ASIDE GAUCHE - Alertes et Notifications */}
          <aside className="col-span-3 space-y-6">
            
            {/* Alertes importantes */}
            <Card className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-red-100 rounded-lg flex items-center justify-center">
                  <AlertTriangle className="h-5 w-5 text-red-600" />
                </div>
                <h3 className="font-bold text-lg text-gray-800">Urgent Alerts</h3>
              </div>
              <div className="space-y-3">
                <div className="p-3 bg-red-50 rounded-lg border-l-4 border-red-500">
                  <div className="flex items-center gap-2 mb-1">
                    <FileText className="h-4 w-4 text-red-600" />
                    <span className="text-sm font-semibold text-gray-800">Permission Slip</span>
                  </div>
                  <p className="text-xs text-gray-600">Jordan - Field trip next week</p>
                  <Button size="sm" className="w-full mt-2 bg-red-600 hover:bg-red-700 text-white text-xs">
                    Sign Now
                  </Button>
                </div>
                
                <div className="p-3 bg-orange-50 rounded-lg border-l-4 border-orange-500">
                  <div className="flex items-center gap-2 mb-1">
                    <Calendar className="h-4 w-4 text-orange-600" />
                    <span className="text-sm font-semibold text-gray-800">Parent Meeting</span>
                  </div>
                  <p className="text-xs text-gray-600">Tomorrow at 3:00 PM</p>
                  <Button size="sm" className="w-full mt-2 bg-orange-600 hover:bg-orange-700 text-white text-xs">
                    Confirm
                  </Button>
                </div>
              </div>
            </Card>

            {/* Notifications récentes */}
            <Card className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Bell className="h-5 w-5 text-blue-600" />
                </div>
                <h3 className="font-bold text-lg text-gray-800">Notifications</h3>
              </div>
              <div className="space-y-3">
                <div className="p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-2 mb-1">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span className="text-sm font-semibold text-gray-800">Math Quiz Tomorrow</span>
                  </div>
                  <p className="text-xs text-gray-600">Jordan has a Mathematics quiz</p>
                </div>
                
                <div className="p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-2 mb-1">
                    <Clock className="h-4 w-4 text-blue-600" />
                    <span className="text-sm font-semibold text-gray-800">Science Project</span>
                  </div>
                  <p className="text-xs text-gray-600">Alice's project due in 3 days</p>
                </div>
                
                <div className="p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-2 mb-1">
                    <MessageSquare className="h-4 w-4 text-purple-600" />
                    <span className="text-sm font-semibold text-gray-800">New Message</span>
                  </div>
                  <p className="text-xs text-gray-600">From Mrs. Johnson</p>
                </div>
              </div>
            </Card>

            {/* Rappels rapides */}
            <Card className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                  <Calendar className="h-5 w-5 text-green-600" />
                </div>
                <h3 className="font-bold text-lg text-gray-800">Quick Reminders</h3>
              </div>
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm">
                  <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                  <span className="text-gray-700">Jordan - Math Quiz (Tomorrow)</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <div className="w-2 h-2 bg-orange-500 rounded-full"></div>
                  <span className="text-gray-700">Alice - Science Project (3 days)</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span className="text-gray-700">Parent Meeting (Tomorrow 3PM)</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span className="text-gray-700">School Newsletter Available</span>
                </div>
              </div>
            </Card>
          </aside>

          {/* CENTRE - Informations principales */}
          <main className="col-span-6 space-y-6">
            
            {/* Vue d'ensemble des enfants */}
            <div className="grid grid-cols-1 gap-6">
              {/* Jordan */}
              <Card className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-300">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-4">
                    <div className="relative">
                      <div className="w-14 h-14 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600 font-bold text-lg">
                        JN
                      </div>
                      <div className="absolute -top-1 -right-1 w-5 h-5 bg-green-500 rounded-full border-2 border-white flex items-center justify-center">
                        <CheckCircle className="h-3 w-3 text-white" />
                      </div>
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-800 mb-1">Jordan Nguepi</h3>
                      <p className="text-gray-600 text-sm">Grade 5 • Age 10</p>
                    </div>
                  </div>
                  <Badge className="bg-green-100 text-green-800 border-green-200 px-3 py-1 text-sm font-medium">
                    Present
                  </Badge>
                </div>
                
                <div className="grid grid-cols-3 gap-4 mb-4">
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600 mb-1">A-</div>
                    <div className="text-blue-600 text-xs font-medium">Current Grade</div>
                  </div>
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600 mb-1">95%</div>
                    <div className="text-blue-600 text-xs font-medium">Attendance</div>
                  </div>
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600 mb-1">12</div>
                    <div className="text-blue-600 text-xs font-medium">Assignments</div>
                  </div>
                </div>
                
                <div className="grid grid-cols-3 gap-3">
                  <div className="text-center p-3 bg-blue-50 rounded-lg">
                    <div className="font-bold text-blue-600 text-sm">Mathematics</div>
                    <div className="flex items-center justify-center gap-1 mt-1">
                      <span className="font-bold text-blue-600">A-</span>
                      <TrendingUp className="h-3 w-3 text-green-600" />
                    </div>
                  </div>
                  <div className="text-center p-3 bg-blue-50 rounded-lg">
                    <div className="font-bold text-blue-600 text-sm">Science</div>
                    <div className="flex items-center justify-center gap-1 mt-1">
                      <span className="font-bold text-blue-600">B+</span>
                      <TrendingUp className="h-3 w-3 text-green-600" />
                    </div>
                  </div>
                  <div className="text-center p-3 bg-blue-50 rounded-lg">
                    <div className="font-bold text-blue-600 text-sm">English</div>
                    <div className="flex items-center justify-center gap-1 mt-1">
                      <span className="font-bold text-blue-600">A</span>
                      <TrendingUp className="h-3 w-3 text-green-600" />
                    </div>
                  </div>
                </div>
              </Card>

              {/* Alice */}
              <Card className="bg-white p-6 rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-300">
                <div className="flex items-center justify-between mb-4">
                  <div className="flex items-center gap-4">
                    <div className="relative">
                      <div className="w-14 h-14 bg-orange-100 rounded-lg flex items-center justify-center text-orange-600 font-bold text-lg">
                        AS
                      </div>
                      <div className="absolute -top-1 -right-1 w-5 h-5 bg-green-500 rounded-full border-2 border-white flex items-center justify-center">
                        <CheckCircle className="h-3 w-3 text-white" />
                      </div>
                    </div>
                    <div>
                      <h3 className="text-xl font-bold text-gray-800 mb-1">Alice Smith</h3>
                      <p className="text-gray-600 text-sm">Grade 3 • Age 8</p>
                    </div>
                  </div>
                  <Badge className="bg-green-100 text-green-800 border-green-200 px-3 py-1 text-sm font-medium">
                    Present
                  </Badge>
                </div>
                
                <div className="grid grid-cols-3 gap-4 mb-4">
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600 mb-1">B+</div>
                    <div className="text-blue-600 text-xs font-medium">Current Grade</div>
                  </div>
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600 mb-1">92%</div>
                    <div className="text-blue-600 text-xs font-medium">Attendance</div>
                  </div>
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600 mb-1">8</div>
                    <div className="text-blue-600 text-xs font-medium">Assignments</div>
                  </div>
                </div>
                
                <div className="grid grid-cols-3 gap-3">
                  <div className="text-center p-3 bg-blue-50 rounded-lg">
                    <div className="font-bold text-blue-600 text-sm">Reading</div>
                    <div className="flex items-center justify-center gap-1 mt-1">
                      <span className="font-bold text-blue-600">A-</span>
                      <TrendingUp className="h-3 w-3 text-green-600" />
                    </div>
                  </div>
                  <div className="text-center p-3 bg-blue-50 rounded-lg">
                    <div className="font-bold text-blue-600 text-sm">Math</div>
                    <div className="flex items-center justify-center gap-1 mt-1">
                      <span className="font-bold text-blue-600">B</span>
                      <TrendingDown className="h-3 w-3 text-red-600" />
                    </div>
                  </div>
                  <div className="text-center p-3 bg-blue-50 rounded-lg">
                    <div className="font-bold text-blue-600 text-sm">Science</div>
                    <div className="flex items-center justify-center gap-1 mt-1">
                      <span className="font-bold text-blue-600">B+</span>
                      <TrendingUp className="h-3 w-3 text-green-600" />
                    </div>
                  </div>
                </div>
              </Card>
            </div>

            {/* Communications récentes */}
            <Card className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                    <MessageSquare className="h-5 w-5 text-purple-600" />
                  </div>
                  <h2 className="text-xl font-bold text-gray-800">Recent Communications</h2>
                </div>
                <Button variant="ghost" className="text-purple-600 hover:text-purple-700 font-medium hover:bg-purple-50 rounded-lg">
                  View All
                </Button>
              </div>
              <div className="space-y-4">
                <div className="flex items-start gap-3 p-4 bg-blue-50 rounded-lg border border-blue-100">
                  <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600 text-sm font-bold">
                    MJ
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-bold text-gray-800">Mrs. Johnson</h4>
                      <span className="text-xs text-gray-500 bg-white px-2 py-1 rounded-full">2 hours ago</span>
                    </div>
                    <p className="text-sm text-gray-700 mb-3">Alice has shown great improvement in reading this week.</p>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" className="border-blue-300 text-blue-600 hover:bg-blue-50 rounded-lg text-xs">
                        Reply
                      </Button>
                      <Button size="sm" variant="outline" className="border-green-300 text-green-600 hover:bg-green-50 rounded-lg text-xs">
                        <Phone className="h-3 w-3 mr-1" />
                        Call
                      </Button>
                    </div>
                  </div>
                </div>

                <div className="flex items-start gap-3 p-4 bg-green-50 rounded-lg border border-green-100">
                  <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center text-green-600 text-sm font-bold">
                    DW
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-bold text-gray-800">Mr. Wilson</h4>
                      <span className="text-xs text-gray-500 bg-white px-2 py-1 rounded-full">1 day ago</span>
                    </div>
                    <p className="text-sm text-gray-700 mb-3">Jordan's mathematics quiz results are excellent! He scored 95%.</p>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" className="border-green-300 text-green-600 hover:bg-green-50 rounded-lg text-xs">
                        Reply
                      </Button>
                      <Button size="sm" variant="outline" className="border-blue-300 text-blue-600 hover:bg-blue-50 rounded-lg text-xs">
                        <Mail className="h-3 w-3 mr-1" />
                        Email
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            </Card>
          </main>

          {/* ASIDE DROITE - Informations personnelles du parent */}
          <aside className="col-span-3 space-y-6">
            
            {/* Profil du parent */}
            <Card className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
              <div className="text-center mb-4">
                <div className="w-16 h-16 bg-blue-100 rounded-lg flex items-center justify-center text-blue-600 font-bold text-xl mx-auto mb-3">
                  JN
                </div>
                <h3 className="font-bold text-lg text-gray-800">Jordan Nguepi</h3>
                <p className="text-gray-600 text-sm">Parent Account</p>
                <Badge className="bg-green-100 text-green-800 border-green-200 mt-2">
                  <Shield className="h-3 w-3 mr-1" />
                  Verified Parent
                </Badge>
              </div>
              
              <div className="space-y-3">
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <Users className="h-5 w-5 text-blue-600" />
                  <div>
                    <div className="font-semibold text-gray-800">2 Children</div>
                    <div className="text-xs text-gray-600">Jordan & Alice</div>
                  </div>
                </div>
                
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <Home className="h-5 w-5 text-blue-600" />
                  <div>
                    <div className="font-semibold text-gray-800">Active Since</div>
                    <div className="text-xs text-gray-600">January 2024</div>
                  </div>
                </div>
                
                <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                  <CreditCard className="h-5 w-5 text-blue-600" />
                  <div>
                    <div className="font-semibold text-gray-800">Account Status</div>
                    <div className="text-xs text-gray-600">Premium Member</div>
                  </div>
                </div>
              </div>
              
              <div className="mt-4">
                <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium">
                  <Settings className="h-4 w-4 mr-2" />
                  Account Settings
                </Button>
              </div>
            </Card>

            {/* Statistiques personnelles */}
            <Card className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                  <Trophy className="h-5 w-5 text-green-600" />
                </div>
                <h3 className="font-bold text-lg text-gray-800">Your Stats</h3>
              </div>
              <div className="space-y-4">
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <div className="text-2xl font-bold text-green-600 mb-1">156</div>
                  <div className="text-sm text-gray-600">Days Active</div>
                </div>
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600 mb-1">89%</div>
                  <div className="text-sm text-gray-600">Response Rate</div>
                </div>
                <div className="text-center p-4 bg-purple-50 rounded-lg">
                  <div className="text-2xl font-bold text-purple-600 mb-1">24</div>
                  <div className="text-sm text-gray-600">Messages Sent</div>
                </div>
              </div>
            </Card>

            {/* Actions rapides */}
            <Card className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                  <Award className="h-5 w-5 text-orange-600" />
                </div>
                <h3 className="font-bold text-lg text-gray-800">Quick Actions</h3>
              </div>
              <div className="space-y-3">
                <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium">
                  <MessageSquare className="h-4 w-4 mr-2" />
                  Contact Teacher
                </Button>
                <Button className="w-full bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium">
                  <Calendar className="h-4 w-4 mr-2" />
                  Schedule Meeting
                </Button>
                <Button className="w-full bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium">
                  <FileText className="h-4 w-4 mr-2" />
                  View Reports
                </Button>
                <Button className="w-full bg-orange-600 hover:bg-orange-700 text-white rounded-lg font-medium">
                  <BookOpen className="h-4 w-4 mr-2" />
                  Library Access
                </Button>
              </div>
            </Card>
          </aside>
        </div>
      </div>
    </div>
  )
}
