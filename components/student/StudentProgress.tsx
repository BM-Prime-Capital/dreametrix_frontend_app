import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { BookOpen, Clock, Trophy, Target } from "lucide-react";

interface SubjectProgressProps {
  subject: string;
  progress: number;
  color: string;
  icon: React.ReactNode;
  grade: string;
  nextAssignment?: string;
}

function SubjectProgress({
  subject,
  progress,
  color,
  icon,
  grade,
  nextAssignment,
}: SubjectProgressProps) {
  return (
    <Card className="p-4 hover:shadow-lg transition-all duration-300 transform hover:scale-105 group">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-3">
          <div
            className={`p-2 rounded-lg ${color} group-hover:scale-110 transition-transform duration-200`}
          >
            {icon}
          </div>
          <div>
            <h3 className="font-semibold text-gray-800 group-hover:text-gray-900">
              {subject}
            </h3>
            <p className="text-sm text-gray-500">Current Grade: {grade}</p>
          </div>
        </div>
        <div className="text-right">
          <p className="text-xl font-bold text-gray-800 group-hover:text-blue-600 transition-colors">
            {progress}%
          </p>
          <p className="text-xs text-gray-500">Complete</p>
        </div>
      </div>

      <Progress
        value={progress}
        className="mb-3 group-hover:scale-105 transition-transform duration-200"
      />

      {nextAssignment && (
        <div className="flex items-center gap-2 text-sm text-gray-600 group-hover:text-gray-700">
          <Clock className="h-4 w-4" />
          <span>Next: {nextAssignment}</span>
        </div>
      )}
    </Card>
  );
}

export default function StudentProgress() {
  const subjects = [
    {
      subject: "Mathematics",
      progress: 85,
      color: "bg-blue-100 text-blue-600",
      icon: <Target className="h-5 w-5" />,
      grade: "A-",
      nextAssignment: "Algebra Quiz - Tomorrow",
    },
    {
      subject: "Science",
      progress: 78,
      color: "bg-green-100 text-green-600",
      icon: <BookOpen className="h-5 w-5" />,
      grade: "B+",
      nextAssignment: "Lab Report - Friday",
    },
    {
      subject: "English",
      progress: 92,
      color: "bg-purple-100 text-purple-600",
      icon: <Trophy className="h-5 w-5" />,
      grade: "A",
      nextAssignment: "Essay - Next Week",
    },
    {
      subject: "History",
      progress: 70,
      color: "bg-amber-100 text-amber-600",
      icon: <BookOpen className="h-5 w-5" />,
      grade: "B",
      nextAssignment: "Research Project - Mon",
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

      {/* Study Tips Section */}
      {/* <Card className="p-6 shadow-lg border-l-4 border-indigo-500 bg-gradient-to-br from-indigo-50 to-blue-50">
        <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
          <div className="p-2 bg-indigo-100 rounded-lg">
            <Target className="h-5 w-5 text-indigo-600" />
          </div>
          Smart Study Tips
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-200">
            <h3 className="font-semibold text-gray-800 mb-2">📚 Math Focus</h3>
            <p className="text-sm text-gray-600">
              Practice algebra problems for 30 minutes daily before your
              upcoming quiz.
            </p>
          </div>
          <div className="p-4 bg-white rounded-lg shadow-sm hover:shadow-md transition-all duration-200">
            <h3 className="font-semibold text-gray-800 mb-2">
              🔬 Science Boost
            </h3>
            <p className="text-sm text-gray-600">
              Review lab procedures and create visual diagrams to improve
              understanding.
            </p>
          </div>
        </div>
      </Card> */}
    </div>
  );
}
