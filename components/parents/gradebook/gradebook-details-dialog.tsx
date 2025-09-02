"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { GradebookDetails, getGradebookDetails } from "@/services/ParentGradebookService"
import { 
  Loader2, 
  X, 
  User, 
  Mail, 
  BookOpen, 
  Award, 
  FileText, 
  Play, 
  CheckCircle, 
  Clock,
  TrendingUp,
  Star,
  Info,
  BarChart3
} from "lucide-react"

interface GradebookDetailsDialogProps {
  isOpen: boolean
  onClose: () => void
  studentId: number
  classId: number
  studentName: string
  className: string
  accessToken: string
}

export function GradebookDetailsDialog({
  isOpen,
  onClose,
  studentId,
  classId,
  studentName,
  className,
  accessToken
}: GradebookDetailsDialogProps) {
  const [details, setDetails] = useState<GradebookDetails | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState("overview")

  useEffect(() => {
    if (isOpen && studentId && classId && accessToken) {
      fetchDetails()
    }
  }, [isOpen, studentId, classId, accessToken])

  const fetchDetails = async () => {
    setLoading(true)
    setError(null)
    
    try {
      const data = await getGradebookDetails(studentId, classId, accessToken)
      setDetails(data)
    } catch (err: any) {
      console.error('Error fetching details:', err)
      setError(err.message || 'Error loading details')
    } finally {
      setLoading(false)
    }
  }

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-600"
    if (score >= 60) return "text-yellow-600"
    return "text-red-600"
  }

  const getScoreBadgeVariant = (score: number) => {
    if (score >= 80) return "default"
    if (score >= 60) return "secondary"
    return "destructive"
  }

  const getAssessmentTypeIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case 'exam':
        return <FileText className="w-4 h-4" />
      case 'test':
        return <BookOpen className="w-4 h-4" />
      case 'assignment':
        return <Award className="w-4 h-4" />
      default:
        return <FileText className="w-4 h-4" />
    }
  }

  const getAssessmentTypeColor = (type: string) => {
    switch (type.toLowerCase()) {
      case 'exam':
        return "bg-red-100 text-red-700 border-red-200"
      case 'test':
        return "bg-blue-100 text-blue-700 border-blue-200"
      case 'assignment':
        return "bg-green-100 text-green-700 border-green-200"
      default:
        return "bg-gray-100 text-gray-700 border-gray-200"
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-5xl max-h-[90vh] overflow-hidden">
        <DialogHeader className="pb-4 border-b">
          <div className="flex items-center justify-between">
            <DialogTitle className="text-2xl font-bold text-gray-800 flex items-center gap-3">
              <div className="bg-gradient-to-r from-purple-500 to-blue-500 p-2 rounded-lg">
                <BookOpen className="w-6 h-6 text-white" />
              </div>
              Gradebook Details
            </DialogTitle>
          </div>
        </DialogHeader>

        {loading && (
          <div className="flex flex-col items-center justify-center py-12">
            <div className="relative">
              <Loader2 className="w-8 h-8 animate-spin text-blue-500" />
              <div className="absolute inset-0 rounded-full border-2 border-blue-200 animate-pulse"></div>
            </div>
            <span className="mt-4 text-gray-600 font-medium">Loading details...</span>
          </div>
        )}

        {error && (
          <div className="flex flex-col items-center justify-center py-12">
            <div className="bg-red-100 p-4 rounded-full mb-4">
              <X className="w-8 h-8 text-red-500" />
            </div>
            <span className="text-red-600 font-medium">Error: {error}</span>
            <Button onClick={fetchDetails} className="mt-4">
              Retry
            </Button>
          </div>
        )}

        {details && !loading && (
          <div className="flex-1 overflow-hidden">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="h-full flex flex-col">
              <TabsList className="grid w-full grid-cols-3 mb-6">
                <TabsTrigger value="overview" className="flex items-center gap-2">
                  <Info className="w-4 h-4" />
                  Overview
                </TabsTrigger>
                <TabsTrigger value="performance" className="flex items-center gap-2">
                  <BarChart3 className="w-4 h-4" />
                  Performance
                </TabsTrigger>
                <TabsTrigger value="submissions" className="flex items-center gap-2">
                  <FileText className="w-4 h-4" />
                  Submissions ({details.submissions?.length || 0})
                </TabsTrigger>
              </TabsList>

              <div className="flex-1 overflow-y-auto pr-2">
                <TabsContent value="overview" className="space-y-6">
                  {/* Student Information */}
                  <Card className="border-0 shadow-lg bg-gradient-to-r from-blue-50 to-purple-50">
                    <CardHeader className="pb-4">
                      <CardTitle className="flex items-center gap-3 text-gray-800">
                        <div className="bg-blue-100 p-2 rounded-full">
                          <User className="w-5 h-5 text-blue-600" />
                        </div>
                        Student Information
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="flex items-center gap-3 p-3 bg-white rounded-lg shadow-sm">
                          <div className="bg-blue-100 p-2 rounded-full">
                            <User className="w-4 h-4 text-blue-600" />
                          </div>
                          <div>
                            <p className="text-sm text-gray-500">Student Name</p>
                            <p className="font-semibold text-gray-800">{details.student_name}</p>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-3 p-3 bg-white rounded-lg shadow-sm">
                          <div className="bg-green-100 p-2 rounded-full">
                            <Mail className="w-4 h-4 text-green-600" />
                          </div>
                          <div>
                            <p className="text-sm text-gray-500">Email</p>
                            <p className="font-semibold text-gray-800">{details.student_email}</p>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 p-3 bg-white rounded-lg shadow-sm">
                        <div className="bg-purple-100 p-2 rounded-full">
                          <BookOpen className="w-4 h-4 text-purple-600" />
                        </div>
                        <div>
                          <p className="text-sm text-gray-500">Class</p>
                          <p className="font-semibold text-gray-800">{className}</p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Quick Stats */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <Card className="border-0 shadow-lg bg-gradient-to-r from-green-50 to-emerald-50">
                      <CardContent className="p-6">
                        <div className="flex items-center gap-3">
                          <div className="bg-green-100 p-3 rounded-full">
                            <TrendingUp className="w-6 h-6 text-green-600" />
                          </div>
                          <div>
                            <p className="text-sm text-gray-500">Average Score</p>
                            <p className="text-2xl font-bold text-gray-800">{details.student_average}%</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card className="border-0 shadow-lg bg-gradient-to-r from-blue-50 to-cyan-50">
                      <CardContent className="p-6">
                        <div className="flex items-center gap-3">
                          <div className="bg-blue-100 p-3 rounded-full">
                            <FileText className="w-6 h-6 text-blue-600" />
                          </div>
                          <div>
                            <p className="text-sm text-gray-500">Total Submissions</p>
                            <p className="text-2xl font-bold text-gray-800">{details.submissions?.length || 0}</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card className="border-0 shadow-lg bg-gradient-to-r from-purple-50 to-pink-50">
                      <CardContent className="p-6">
                        <div className="flex items-center gap-3">
                          <div className="bg-purple-100 p-3 rounded-full">
                            <CheckCircle className="w-6 h-6 text-purple-600" />
                          </div>
                          <div>
                            <p className="text-sm text-gray-500">Graded</p>
                            <p className="text-2xl font-bold text-gray-800">
                              {details.submissions?.filter(s => s.marked).length || 0}
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>

                <TabsContent value="performance" className="space-y-6">
                  {/* Overall Average */}
                  <Card className="border-0 shadow-lg">
                    <CardHeader className="pb-4">
                      <CardTitle className="flex items-center gap-3 text-gray-800">
                        <div className="bg-gradient-to-r from-yellow-400 to-orange-500 p-2 rounded-full">
                          <TrendingUp className="w-5 h-5 text-white" />
                        </div>
                        Performance Analysis
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-6">
                        <div className="flex items-center gap-6">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <span className="text-3xl font-bold text-gray-800">{details.student_average}%</span>
                              <Badge variant={getScoreBadgeVariant(details.student_average)} className="text-sm">
                                {details.student_average >= 80 ? "Excellent" : 
                                 details.student_average >= 60 ? "Good" : "Needs Improvement"}
                              </Badge>
                            </div>
                            <Progress value={details.student_average} className="h-3" />
                            <p className="text-sm text-gray-500 mt-2">Overall class performance</p>
                          </div>
                          <div className="bg-gradient-to-r from-yellow-400 to-orange-500 p-4 rounded-full">
                            <Star className="w-8 h-8 text-white" />
                          </div>
                        </div>

                        {/* Performance Breakdown */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <Card className="border border-gray-200">
                            <CardContent className="p-4">
                              <h4 className="font-semibold text-gray-800 mb-3">Score Distribution</h4>
                              <div className="space-y-2">
                                <div className="flex justify-between items-center">
                                  <span className="text-sm text-gray-600">90-100%</span>
                                  <span className="text-sm font-medium">
                                    {details.submissions?.filter(s => s.score >= 90).length || 0}
                                  </span>
                                </div>
                                <div className="flex justify-between items-center">
                                  <span className="text-sm text-gray-600">80-89%</span>
                                  <span className="text-sm font-medium">
                                    {details.submissions?.filter(s => s.score >= 80 && s.score < 90).length || 0}
                                  </span>
                                </div>
                                <div className="flex justify-between items-center">
                                  <span className="text-sm text-gray-600">70-79%</span>
                                  <span className="text-sm font-medium">
                                    {details.submissions?.filter(s => s.score >= 70 && s.score < 80).length || 0}
                                  </span>
                                </div>
                                <div className="flex justify-between items-center">
                                  <span className="text-sm text-gray-600">&lt; 70%</span>
                                  <span className="text-sm font-medium">
                                    {details.submissions?.filter(s => s.score < 70).length || 0}
                                  </span>
                                </div>
                              </div>
                            </CardContent>
                          </Card>

                          <Card className="border border-gray-200">
                            <CardContent className="p-4">
                              <h4 className="font-semibold text-gray-800 mb-3">Assessment Types</h4>
                              <div className="space-y-2">
                                <div className="flex justify-between items-center">
                                  <span className="text-sm text-gray-600">Tests</span>
                                  <span className="text-sm font-medium">
                                    {details.submissions?.filter(s => s.assessment_type.toLowerCase() === 'test').length || 0}
                                  </span>
                                </div>
                                <div className="flex justify-between items-center">
                                  <span className="text-sm text-gray-600">Exams</span>
                                  <span className="text-sm font-medium">
                                    {details.submissions?.filter(s => s.assessment_type.toLowerCase() === 'exam').length || 0}
                                  </span>
                                </div>
                                <div className="flex justify-between items-center">
                                  <span className="text-sm text-gray-600">Assignments</span>
                                  <span className="text-sm font-medium">
                                    {details.submissions?.filter(s => s.assessment_type.toLowerCase() === 'assignment').length || 0}
                                  </span>
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="submissions" className="space-y-6">
                  <Card className="border-0 shadow-lg">
                    <CardHeader className="pb-4">
                      <CardTitle className="flex items-center gap-3 text-gray-800">
                        <div className="bg-green-100 p-2 rounded-full">
                          <FileText className="w-5 h-5 text-green-600" />
                        </div>
                        All Submissions
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2">
                        {details.submissions && details.submissions.length > 0 ? (
                          details.submissions.map((submission, index) => (
                            <div key={index} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                              <div className="flex items-center justify-between mb-3">
                                <div className="flex items-center gap-3">
                                  <div className={`p-2 rounded-full ${getAssessmentTypeColor(submission.assessment_type)}`}>
                                    {getAssessmentTypeIcon(submission.assessment_type)}
                                  </div>
                                  <div>
                                    <h4 className="font-semibold text-gray-800">{submission.assessment_name}</h4>
                                    <Badge variant="outline" className="text-xs">
                                      {submission.assessment_type}
                                    </Badge>
                                  </div>
                                </div>
                                
                                <div className="flex items-center gap-3">
                                  <div className="text-right">
                                    <span className={`text-2xl font-bold ${getScoreColor(submission.score)}`}>
                                      {submission.score}
                                    </span>
                                    <span className="text-gray-500 text-sm">/ 100</span>
                                  </div>
                                  
                                  <div className="flex items-center gap-2">
                                    {submission.marked ? (
                                      <Badge variant="default" className="bg-green-100 text-green-700 border-green-200">
                                        <CheckCircle className="w-3 h-3 mr-1" />
                                        Graded
                                      </Badge>
                                    ) : (
                                      <Badge variant="secondary" className="bg-yellow-100 text-yellow-700 border-yellow-200">
                                        <Clock className="w-3 h-3 mr-1" />
                                        Pending
                                      </Badge>
                                    )}
                                  </div>
                                </div>
                              </div>
                              
                              {submission.voice_note && (
                                <div className="flex items-center gap-2 mt-3 p-2 bg-gray-50 rounded-lg">
                                  <Play className="w-4 h-4 text-blue-500" />
                                  <span className="text-sm text-gray-600">Voice note available</span>
                                </div>
                              )}
                            </div>
                          ))
                        ) : (
                          <div className="text-center py-8 text-gray-500">
                            <FileText className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                            <p>No submissions available</p>
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </div>
            </Tabs>
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
} 