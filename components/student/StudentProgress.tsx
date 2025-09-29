import { Card } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { BookOpen, Clock, Trophy, Target, FileText, HelpCircle, PenTool } from "lucide-react";
import { StudentDashboardData } from "@/services/StudentGradebookService";

interface SubjectProgressProps {
  subject: string;
  progress: number;
  color: string;
  icon: React.ReactNode;
  grade: string;
  courseId: number;
  nextAssignment?: string;
}

interface StudentProgressComponentProps {
  dashboardData?: StudentDashboardData | null;
}

function SubjectProgress({
  subject,
  progress,
  color,
  icon,
  grade,
  courseId,
  nextAssignment,
}: SubjectProgressProps) {
  return (
    <Card 
      className="p-4 hover:shadow-lg transition-all duration-300 transform hover:scale-105 group cursor-pointer" 
      data-course-id={courseId}
      onClick={() => {
        // Future: Navigate to course detail page
        console.log(`Navigate to course ${courseId}: ${subject}`);
      }}
    >
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

export default function StudentProgress({ dashboardData }: StudentProgressComponentProps) {


  // Helper function to get next assignment for a specific course
  const getNextAssignmentForCourse = (courseName: string): string | undefined => {
    if (!dashboardData?.upcoming_assessments) return undefined;
    const nextAssignment = dashboardData.upcoming_assessments.find(
      assessment => assessment.course_name === courseName
    );
    if (nextAssignment) {
      const dueDate = new Date(nextAssignment.due_date).toLocaleDateString();
      return `${nextAssignment.name} (${nextAssignment.type}) - ${dueDate}`;
    }
    return undefined;
  };

  // Helper function to get icon based on subject
  const getSubjectIcon = (subject: string) => {
    const lowerSubject = subject.toLowerCase();
    if (lowerSubject.includes('math')) return <Target className="h-5 w-5" />;
    if (lowerSubject.includes('science')) return <BookOpen className="h-5 w-5" />;
    if (lowerSubject.includes('english')) return <Trophy className="h-5 w-5" />;
    return <BookOpen className="h-5 w-5" />;
  };

  // Helper function to get color based on grade
  const getGradeColor = (grade: number) => {
    if (grade >= 90) return "bg-green-100 text-green-600";
    if (grade >= 80) return "bg-blue-100 text-blue-600";
    if (grade >= 70) return "bg-yellow-100 text-yellow-600";
    return "bg-red-100 text-red-600";
  };

  // Use only real course data from API - no mock data
  const subjects = dashboardData?.academic_overview?.courses?.map(course => ({
    subject: course.name,
    progress: course.grade,
    color: getGradeColor(course.grade),
    icon: getSubjectIcon(course.subject),
    grade: `${course.grade}%`,
    courseId: course.id,
    nextAssignment: getNextAssignmentForCourse(course.name),
  })) || [];

  return (
    <div className="space-y-6">
      <Card className="p-6 shadow-lg">
        <h2 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
          <div className="p-2 bg-green-100 rounded-lg">
            <Trophy className="h-5 w-5 text-green-600" />
          </div>
          Subject Progress
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {subjects.length > 0 ? (
            subjects.map((subject, index) => (
              <SubjectProgress key={index} {...subject} />
            ))
          ) : (
            <div className="col-span-2 flex items-center justify-center p-8 bg-gray-50 rounded-xl">
              <div className="text-center">
                <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 font-medium">No courses available</p>
                <p className="text-gray-500 text-sm">Your course progress will appear here when data is available</p>
              </div>
            </div>
          )}
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
