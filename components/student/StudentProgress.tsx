import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { BookOpen, Clock, Trophy, Target, TrendingUp, AlertTriangle, CheckCircle, Brain } from "lucide-react";
import { useRouter } from "next/navigation";

interface SubjectProgressProps {
  subject: string;
  progress: number;
  color: string;
  icon: React.ReactNode;
  grade: string;
  nextAssignment?: string;
}

const getStatusIcon = (status: string) => {
  switch (status) {
    case 'excellent': return <CheckCircle className="h-4 w-4 text-green-500" />;
    case 'improving': return <TrendingUp className="h-4 w-4 text-blue-500" />;
    case 'needs-attention': return <AlertTriangle className="h-4 w-4 text-amber-500" />;
    default: return <CheckCircle className="h-4 w-4 text-green-500" />;
  }
};

const getStatusColor = (status: string) => {
  switch (status) {
    case 'excellent': return 'text-green-600';
    case 'improving': return 'text-blue-600';
    case 'needs-attention': return 'text-amber-600';
    default: return 'text-green-600';
  }
};

function SubjectProgress({
  subject,
  progress,
  color,
  icon,
  grade,
  nextAssignment,
  trend,
  improvement,
  status,
}: SubjectProgressProps & { trend: string; improvement: string; status: string }) {
  const router = useRouter();
  
  return (
    <Card className="p-4 hover:shadow-lg transition-all duration-300 transform hover:scale-105 group cursor-pointer"
          onClick={() => router.push(`/student/gradebook?subject=${subject.toLowerCase()}`)}>
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-3">
          <div
            className={`p-2 rounded-lg ${color} group-hover:scale-110 transition-transform duration-200`}
          >
            {icon}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-semibold text-gray-800 group-hover:text-gray-900">
                {subject}
              </h3>
              {getStatusIcon(status)}
            </div>
            <p className="text-sm text-gray-500">Grade: {grade}</p>
          </div>
        </div>
        <div className="text-right">
          <div className="flex items-center gap-1">
            <p className="text-xl font-bold text-gray-800 group-hover:text-blue-600 transition-colors">
              {progress}%
            </p>
            <span className={`text-xs font-medium ${getStatusColor(status)}`}>
              {improvement}
            </span>
          </div>
          <p className="text-xs text-gray-500">Complete</p>
        </div>
      </div>

      <Progress
        value={progress}
        className="mb-3 group-hover:scale-105 transition-transform duration-200"
      />

      <div className="flex items-center justify-between">
        {nextAssignment && (
          <div className="flex items-center gap-2 text-sm text-gray-600 group-hover:text-gray-700">
            <Clock className="h-4 w-4" />
            <span>Next: {nextAssignment}</span>
          </div>
        )}
        {status === 'needs-attention' && (
          <Button 
            size="sm" 
            variant="outline" 
            className="ml-auto text-xs"
            onClick={(e) => {
              e.stopPropagation();
              router.push('/student/tutor');
            }}
          >
            Get Help
          </Button>
        )}
      </div>
    </Card>
  );
}

export default function StudentProgress() {
  const router = useRouter();
  
  const subjects = [
    {
      subject: "Mathematics",
      progress: 85,
      color: "bg-blue-100 text-blue-600",
      icon: <Target className="h-5 w-5" />,
      grade: "A-",
      nextAssignment: "Algebra Quiz - Tomorrow",
      trend: "up",
      improvement: "+5%",
      status: "on-track",
    },
    {
      subject: "Science",
      progress: 78,
      color: "bg-green-100 text-green-600",
      icon: <BookOpen className="h-5 w-5" />,
      grade: "B+",
      nextAssignment: "Lab Report - Friday",
      trend: "up",
      improvement: "+12%",
      status: "improving",
    },
    {
      subject: "English",
      progress: 92,
      color: "bg-purple-100 text-purple-600",
      icon: <Trophy className="h-5 w-5" />,
      grade: "A",
      nextAssignment: "Essay - Next Week",
      trend: "stable",
      improvement: "+2%",
      status: "excellent",
    },
    {
      subject: "History",
      progress: 70,
      color: "bg-amber-100 text-amber-600",
      icon: <BookOpen className="h-5 w-5" />,
      grade: "B",
      nextAssignment: "Research Project - Mon",
      trend: "down",
      improvement: "-3%",
      status: "needs-attention",
    },
  ];

  return (
    <div className="space-y-6">
      <Card className="p-6 shadow-lg border-l-4 border-green-500">
        <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
          <div className="p-2 bg-green-100 rounded-lg">
            <Trophy className="h-5 w-5 text-green-600" />
          </div>
          Subject Progress
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {subjects.map((subject, index) => (
            <SubjectProgress key={index} {...subject} />
          ))}
        </div>
      </Card>

      {/* AI-Powered Study Recommendations */}
      <Card className="p-6 shadow-lg border-l-4 border-purple-500 bg-gradient-to-br from-purple-50 to-indigo-50">
        <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
          <div className="p-2 bg-purple-100 rounded-lg">
            <Brain className="h-5 w-5 text-purple-600" />
          </div>
          AI Study Recommendations
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-200 border-l-2 border-amber-400">
            <div className="flex items-center gap-2 mb-2">
              <AlertTriangle className="h-4 w-4 text-amber-500" />
              <h3 className="font-semibold text-gray-800">Priority: History</h3>
            </div>
            <p className="text-sm text-gray-600 mb-3">
              Your History grade needs attention. Focus on research methods and source analysis.
            </p>
            <Button 
              size="sm" 
              className="bg-amber-500 hover:bg-amber-600 text-white"
              onClick={() => router.push('/student/tutor?subject=history')}
            >
              Start Study Session
            </Button>
          </div>
          <div className="p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-200 border-l-2 border-blue-400">
            <div className="flex items-center gap-2 mb-2">
              <Target className="h-4 w-4 text-blue-500" />
              <h3 className="font-semibold text-gray-800">Math Prep</h3>
            </div>
            <p className="text-sm text-gray-600 mb-3">
              Tomorrow's algebra quiz: Practice quadratic equations for 20 minutes.
            </p>
            <Button 
              size="sm" 
              className="bg-blue-500 hover:bg-blue-600 text-white"
              onClick={() => router.push('/student/tutor?subject=math&topic=algebra')}
            >
              Practice Now
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
