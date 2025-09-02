"use client"

import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { getStudentReportCard, ReportCard } from "@/services/ReportCardService"
import { useRequestInfo } from "@/hooks/useRequestInfo"
import { useLoading } from "@/lib/LoadingContext"
import { 
  Loader2, 
  AlertCircle, 
  RefreshCw, 
  Trophy,
  Award,
  TrendingUp,
  Calendar,
  Star,
  Target,
  BookOpen,
  Users,
  Mail,
  Phone,
  Download,
  FileText,
  Eye,
  CheckCircle,
  Clock,
  AlertTriangle,
  GraduationCap,
  School,
  User,
  BarChart3,
  PieChart,
  MessageSquare,
  Clock3,
  CalendarDays,
  TrendingDown,
  Activity,
  Crown,
  Medal,
  Zap,
  Lightbulb,
  TargetIcon,
  ArrowUpRight,
  ArrowDownRight,
  Minus,
  Plus,
  ChevronRight,
  ChevronLeft
} from "lucide-react"

interface ReportCardDashboardProps {
  studentId?: string
}

export function ReportCardDashboard({ studentId = "8" }: ReportCardDashboardProps) {
  const { accessToken } = useRequestInfo()
  const { stopLoading } = useLoading()
  const [reportCard, setReportCard] = useState<ReportCard | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedTerm, setSelectedTerm] = useState<string>("")

  const fetchReportCard = async () => {
    if (!accessToken) {
      setError("Authentication required")
      setLoading(false)
      stopLoading() // Arrêter le chargement même en cas d'erreur d'auth
      return
    }

    try {
      setLoading(true)
      setError(null)
      
      const data = await getStudentReportCard(accessToken, studentId)
      console.log("Report card data received:", data)
      
      setReportCard(data)
      setSelectedTerm(data.student_info.current_term)
      // Arrêter le chargement dès qu'on reçoit une réponse (succès)
      stopLoading()
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : "Error loading report card"
      console.error("Error fetching report card:", err)
      setError(errorMessage)
      // Arrêter le chargement même en cas d'erreur
      stopLoading()
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchReportCard()
  }, [accessToken, studentId])

  const getGradeColor = (grade: string) => {
    switch (grade) {
      case 'A': return 'text-green-600 bg-green-100 border-green-300'
      case 'A-': return 'text-green-600 bg-green-100 border-green-300'
      case 'B+': return 'text-blue-600 bg-blue-100 border-blue-300'
      case 'B': return 'text-blue-600 bg-blue-100 border-blue-300'
      case 'B-': return 'text-blue-600 bg-blue-100 border-blue-300'
      case 'C+': return 'text-yellow-600 bg-yellow-100 border-yellow-300'
      case 'C': return 'text-yellow-600 bg-yellow-100 border-yellow-300'
      case 'C-': return 'text-yellow-600 bg-yellow-100 border-yellow-300'
      case 'D': return 'text-orange-600 bg-orange-100 border-orange-300'
      case 'F': return 'text-red-600 bg-red-100 border-red-300'
      default: return 'text-gray-600 bg-gray-100 border-gray-300'
    }
  }

  const getScoreColor = (score: number) => {
    if (score >= 90) return 'text-green-600'
    if (score >= 80) return 'text-blue-600'
    if (score >= 70) return 'text-yellow-600'
    if (score >= 60) return 'text-orange-600'
    return 'text-red-600'
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', { 
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-16">
        <div className="relative">
          <Loader2 className="h-12 w-12 animate-spin text-[#25AAE1] mb-6" />
          <div className="absolute inset-0 w-12 h-12 border-4 border-[#25AAE1]/20 rounded-full"></div>
        </div>
        <p className="text-gray-600 font-medium text-lg">Loading report card...</p>
        <p className="text-gray-500 text-sm mt-2">Analyzing academic performance</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-16">
        <div className="bg-gradient-to-br from-red-50 to-rose-50 p-8 rounded-3xl border border-red-200 shadow-lg max-w-md w-full">
          <div className="text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <AlertCircle className="h-8 w-8 text-red-600" />
            </div>
            <h3 className="text-xl font-bold text-red-800 mb-2">Connection Error</h3>
            <p className="text-red-600 font-medium text-center mb-6">{error}</p>
            <Button
              onClick={fetchReportCard}
              className="bg-gradient-to-r from-[#25AAE1] to-[#1D8CB3] text-white px-8 py-3 rounded-xl hover:shadow-lg transition-all duration-300"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Try Again
            </Button>
          </div>
        </div>
      </div>
    )
  }

  if (!reportCard) {
    return (
      <div className="flex flex-col items-center justify-center py-16">
        <div className="bg-gradient-to-br from-gray-50 to-slate-50 p-8 rounded-3xl border border-gray-200 shadow-lg max-w-md w-full">
          <div className="text-center">
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
              <AlertCircle className="h-8 w-8 text-gray-400" />
            </div>
            <h3 className="text-xl font-bold text-gray-800 mb-2">No Report Card</h3>
            <p className="text-gray-600 text-center">Report card data will appear here once available</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="w-full space-y-6">
      {/* Demo Data Notification - Supprimé car l'API fonctionne correctement */}

             {/* Header Section */}
       <div className="bg-gradient-to-br from-[#25AAE1] via-[#1D8CB3] to-[#1453B8] p-6 rounded-2xl text-white shadow-xl">
         <div className="flex justify-between items-start mb-4">
           <div>
             <h1 className="text-3xl font-bold mb-1">📊 Academic Report Card</h1>
             <p className="text-blue-100 text-base">Comprehensive academic performance overview</p>
           </div>
           <div className="flex gap-2">
             <Button className="bg-white/20 hover:bg-white/30 text-white border-white/30 text-sm px-3 py-2">
               <Download className="h-3 w-3 mr-1" />
               Download
             </Button>
             <Button className="bg-white/20 hover:bg-white/30 text-white border-white/30 text-sm px-3 py-2">
               <FileText className="h-3 w-3 mr-1" />
               Print
             </Button>
           </div>
         </div>

         {/* Student Info */}
         <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
           <div className="bg-white/10 p-3 rounded-xl backdrop-blur-sm">
             <div className="flex items-center gap-2 mb-2">
               <User className="h-4 w-4 text-blue-200" />
               <span className="text-blue-200 text-xs">Student</span>
             </div>
             <h3 className="text-lg font-bold">{reportCard.student_info.name}</h3>
             <p className="text-blue-100 text-sm">ID: {reportCard.student_info.student_id}</p>
           </div>
           
           <div className="bg-white/10 p-3 rounded-xl backdrop-blur-sm">
             <div className="flex items-center gap-2 mb-2">
               <School className="h-4 w-4 text-blue-200" />
               <span className="text-blue-200 text-xs">Class</span>
             </div>
             <h3 className="text-lg font-bold">{reportCard.student_info.class_name}</h3>
             <p className="text-blue-100 text-sm">{reportCard.student_info.grade_level}</p>
           </div>
           
           <div className="bg-white/10 p-3 rounded-xl backdrop-blur-sm">
             <div className="flex items-center gap-2 mb-2">
               <Calendar className="h-4 w-4 text-blue-200" />
               <span className="text-blue-200 text-xs">Term</span>
             </div>
             <h3 className="text-lg font-bold">{reportCard.student_info.current_term}</h3>
             <p className="text-blue-100 text-sm">Current Period</p>
           </div>
         </div>
       </div>

             {/* Academic Performance Overview */}
       <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
         {/* Overall Grade */}
         <Card className="p-4 bg-gradient-to-br from-[#25AAE1] to-[#1D8CB3] text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 border-0">
           <div className="flex items-center justify-between mb-3">
             <Trophy className="h-6 w-6 text-yellow-300" />
             <Badge className="bg-white/20 text-white border-white/30 text-xs">Grade</Badge>
           </div>
           <div className="text-3xl font-bold mb-1">{reportCard.academic_performance.overall_grade}</div>
           <p className="text-blue-100 font-medium text-sm">Overall Grade</p>
           <div className="mt-2 flex items-center gap-2 text-xs text-yellow-300">
             <Star className="h-3 w-3" />
             <span>Excellent Performance</span>
           </div>
         </Card>

         {/* Overall Score */}
         <Card className="p-4 bg-gradient-to-br from-[#25AAE1]/10 to-[#1D8CB3]/20 border-[#25AAE1]/30 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
           <div className="flex items-center justify-between mb-3">
             <Award className="h-6 w-6 text-[#25AAE1]" />
             <Badge className="bg-[#25AAE1]/20 text-[#1D8CB3] border-[#25AAE1]/30 text-xs">Score</Badge>
           </div>
           <div className={`text-3xl font-bold mb-1 ${getScoreColor(reportCard.academic_performance.overall_score)}`}>
             {reportCard.academic_performance.overall_score}%
           </div>
           <p className="text-[#25AAE1] font-medium text-sm">Overall Score</p>
           <div className="mt-2 flex items-center gap-2 text-xs text-[#25AAE1]">
             <TrendingUp className="h-3 w-3" />
             <span>Above Class Average</span>
           </div>
         </Card>

         {/* Ranking */}
         <Card className="p-4 bg-gradient-to-br from-[#25AAE1]/10 to-[#1D8CB3]/20 border-[#25AAE1]/30 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
           <div className="flex items-center justify-between mb-3">
             <Crown className="h-6 w-6 text-[#25AAE1]" />
             <Badge className="bg-[#25AAE1]/20 text-[#1D8CB3] border-[#25AAE1]/30 text-xs">Rank</Badge>
           </div>
           <div className="text-3xl font-bold text-[#1D8CB3] mb-1">
             #{reportCard.academic_performance.ranking.position}
           </div>
           <p className="text-[#25AAE1] font-medium text-sm">Class Ranking</p>
           <div className="mt-2 flex items-center gap-2 text-xs text-[#25AAE1]">
             <Medal className="h-3 w-3" />
             <span>of {reportCard.academic_performance.ranking.out_of} students</span>
           </div>
         </Card>

         {/* Attendance */}
         <Card className="p-4 bg-gradient-to-br from-[#25AAE1]/10 to-[#1D8CB3]/20 border-[#25AAE1]/30 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105">
           <div className="flex items-center justify-between mb-3">
             <CalendarDays className="h-6 w-6 text-[#25AAE1]" />
             <Badge className="bg-[#25AAE1]/20 text-[#1D8CB3] border-[#25AAE1]/30 text-xs">Present</Badge>
           </div>
           <div className="text-3xl font-bold text-[#1D8CB3] mb-1">
             {reportCard.attendance.percentage}%
           </div>
           <p className="text-[#25AAE1] font-medium text-sm">Attendance Rate</p>
           <div className="mt-2 flex items-center gap-2 text-xs text-[#25AAE1]">
             <CheckCircle className="h-3 w-3" />
             <span>Perfect attendance</span>
           </div>
         </Card>
       </div>

             {/* Subjects Performance */}
       <Card className="p-6 bg-gradient-to-br from-[#25AAE1]/5 to-[#1D8CB3]/10 border-[#25AAE1]/20 rounded-xl shadow-lg">
         <div className="flex items-center gap-3 mb-4">
           <div className="w-10 h-10 bg-[#25AAE1]/20 rounded-lg flex items-center justify-center">
             <BookOpen className="h-5 w-5 text-[#25AAE1]" />
           </div>
           <div>
             <h3 className="text-xl font-bold text-[#1D8CB3]">Subject Performance</h3>
             <p className="text-[#25AAE1] text-sm">Detailed breakdown by subject</p>
           </div>
         </div>

         <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
           {reportCard.subjects.map((subject) => (
             <div key={subject.subject_id} className="bg-white rounded-lg p-4 border border-[#25AAE1]/20 shadow-sm hover:shadow-md transition-shadow">
               <div className="flex items-center justify-between mb-3">
                 <div>
                   <h4 className="text-base font-bold text-[#1D8CB3]">{subject.name}</h4>
                   <p className="text-[#25AAE1] text-xs">Teacher: {subject.teacher_name}</p>
                 </div>
                 <Badge className={`px-2 py-1 text-sm font-bold ${getGradeColor(subject.grade)}`}>
                   {subject.grade}
                 </Badge>
               </div>
               
               <div className="flex items-center gap-3 mb-3">
                 <div className="text-center">
                   <div className={`text-xl font-bold ${getScoreColor(subject.score)}`}>
                     {subject.score}%
                   </div>
                   <div className="text-xs text-gray-500">Score</div>
                 </div>
                 <div className="flex-1">
                   <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                     <div
                       className={`h-full transition-all duration-1000 ease-out ${
                         subject.score >= 90 ? 'bg-green-500' :
                         subject.score >= 80 ? 'bg-blue-500' :
                         subject.score >= 70 ? 'bg-yellow-500' :
                         subject.score >= 60 ? 'bg-orange-500' : 'bg-red-500'
                       }`}
                       style={{ width: `${subject.score}%` }}
                     ></div>
                   </div>
                 </div>
               </div>
               
               <div className="bg-gray-50 p-2 rounded-lg">
                 <p className="text-xs text-gray-700 italic">"{subject.teacher_comment}"</p>
               </div>
             </div>
           ))}
         </div>
       </Card>

             {/* Teacher Comments */}
       <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
         {/* Strengths */}
         <Card className="p-4 bg-gradient-to-br from-green-50 to-emerald-50 border-green-200 rounded-xl shadow-lg">
           <div className="flex items-center gap-3 mb-3">
             <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center">
               <Lightbulb className="h-4 w-4 text-green-600" />
             </div>
             <div>
               <h3 className="text-lg font-bold text-green-800">Strengths</h3>
               <p className="text-green-600 text-xs">Areas of excellence</p>
             </div>
           </div>
           
           <div className="space-y-2">
             {reportCard.teacher_comments.strengths.map((strength, index) => (
               <div key={index} className="flex items-start gap-2">
                 <CheckCircle className="h-3 w-3 text-green-600 mt-0.5 flex-shrink-0" />
                 <p className="text-green-700 text-xs">{strength}</p>
               </div>
             ))}
           </div>
         </Card>

         {/* Areas for Improvement */}
         <Card className="p-4 bg-gradient-to-br from-amber-50 to-orange-50 border-amber-200 rounded-xl shadow-lg">
           <div className="flex items-center gap-3 mb-3">
             <div className="w-8 h-8 bg-amber-100 rounded-lg flex items-center justify-center">
               <TargetIcon className="h-4 w-4 text-amber-600" />
             </div>
             <div>
               <h3 className="text-lg font-bold text-amber-800">Areas for Improvement</h3>
               <p className="text-amber-600 text-xs">Focus areas</p>
             </div>
           </div>
           
           <div className="space-y-2">
             {reportCard.teacher_comments.areas_for_improvement.map((area, index) => (
               <div key={index} className="flex items-start gap-2">
                 <Target className="h-3 w-3 text-amber-600 mt-0.5 flex-shrink-0" />
                 <p className="text-amber-700 text-xs">{area}</p>
               </div>
             ))}
           </div>
         </Card>
       </div>

       {/* General Remarks */}
       <Card className="p-4 bg-gradient-to-br from-[#25AAE1]/5 to-[#1D8CB3]/10 border-[#25AAE1]/20 rounded-xl shadow-lg">
         <div className="flex items-center gap-3 mb-3">
           <div className="w-8 h-8 bg-[#25AAE1]/20 rounded-lg flex items-center justify-center">
             <MessageSquare className="h-4 w-4 text-[#25AAE1]" />
           </div>
           <div>
             <h3 className="text-lg font-bold text-[#1D8CB3]">General Remarks</h3>
             <p className="text-[#25AAE1] text-xs">Overall assessment</p>
           </div>
         </div>
         
         <div className="bg-white p-3 rounded-lg border border-[#25AAE1]/20">
           <p className="text-gray-700 leading-relaxed text-sm">{reportCard.teacher_comments.general_remarks}</p>
         </div>
       </Card>

       {/* Footer with Metadata */}
       <Card className="p-4 bg-gradient-to-br from-gray-50 to-slate-50 border-gray-200 rounded-xl shadow-lg">
         <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
           <div>
             <p className="text-gray-600 text-xs">Generated on</p>
             <p className="font-semibold text-gray-800 text-sm">{formatDate(reportCard.report_metadata.generated_date)}</p>
           </div>
           <div>
             <p className="text-gray-600 text-xs">Authorized by</p>
             <p className="font-semibold text-gray-800 text-sm">{reportCard.report_metadata.authorized_by.name}</p>
             <p className="text-gray-500 text-xs">{reportCard.report_metadata.authorized_by.position}</p>
           </div>
           <div>
             <p className="text-gray-600 text-xs">School</p>
             <p className="font-semibold text-gray-800 text-sm">{reportCard.report_metadata.school_info.name}</p>
             <p className="text-gray-500 text-xs">{reportCard.report_metadata.school_info.contact}</p>
           </div>
         </div>
       </Card>
    </div>
  )
}
