import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
 import useSubjects  from "@/hooks/Teacher/useSubject"
 import  useGrades  from "@/hooks/Teacher/useGrade"
 import useDomains  from "@/hooks/Teacher/useDomains"
import { useRequestInfo } from "@/hooks/useRequestInfo"
import { Question } from "@/components/types/question"

interface TestPrepProps {
  onStartTest: (questions: Question[]) => void;
}

export default function TestPrep({ onStartTest }: TestPrepProps) {
  const [formData, setFormData] = useState({
    subject: "",
    grade: 0,
    domain: "",
  });

  // Get authentication and tenant info
  const { tenantDomain, accessToken } = useRequestInfo();

  // Fetch data using custom hooks
  const { subjects, isLoading: isLoadingSubjects } = useSubjects();
  const { grades, isLoading: isLoadingGrades } = useGrades(formData.subject);
  const { domains, isLoading: isLoadingDomains } = useDomains(formData.subject, formData.grade);

  // Update subject when subjects are loaded
  useEffect(() => {
    if (subjects.length > 0 && !formData.subject) {
      setFormData(prev => ({ ...prev, subject: subjects[0] }));
    }
  }, [subjects]);

  // Update grade when grades are loaded
  useEffect(() => {
    if (grades.length > 0 && !formData.grade) {
      setFormData(prev => ({ ...prev, grade: grades[0] }));
    }
  }, [grades]);

  // Update domain when domains are loaded
  useEffect(() => {
    if (domains.length > 0 && !formData.domain) {
      setFormData(prev => ({ ...prev, domain: domains[0] }));
    }
  }, [domains]);

  const handleInputChange = (field: string, value: string | number) => {
    setFormData((prev) => {
      const newData = { ...prev, [field]: value };
      
      // Reset dependent fields
      if (field === 'subject') {
        newData.grade = 0;
        newData.domain = '';
      } else if (field === 'grade') {
        newData.domain = '';
      }
      
      return newData;
    });
  };

  const handleLaunchTest = async () => {
    if (!formData.subject || !formData.grade || !formData.domain || !tenantDomain || !accessToken) {
      return;
    }

    try {
      const response = await fetch(
        `${tenantDomain}/testprep/questions/${formData.subject}/${formData.grade}/${encodeURIComponent(formData.domain)}/`,
        {
          headers: {
            'Authorization': `Bearer ${accessToken}`,
          }
        }
      );

      if (!response.ok) {
        throw new Error('Failed to fetch questions');
      }

      const data = await response.json();
      onStartTest(data.questions);
    } catch (error) {
      console.error('Error fetching questions:', error);
    }
  };

  return (
    <section className="flex flex-col gap-2 w-full">
      <div className="">
        <h1 className="text-2xl font-bold mb-2">TEST PREPARATION</h1>
        <p className="pl-3">Question Simplar</p>
      </div>
      <div className="flex gap-4 justify-start">
        <div className="px-3 w-full">
          <div className="flex justify-between items-center py-5">
            <div>
              <label className="flex flex-col space-y-1">
                <span className="text-sm text-gray-600">Select Subject</span>
                <Select
                  value={formData.subject}
                  onValueChange={(value: string) => handleInputChange("subject", value)}
                  disabled={isLoadingSubjects}
                >
                  <SelectTrigger className="w-[200px]">
                    <SelectValue placeholder="Select a subject" />
                  </SelectTrigger>
                  <SelectContent>
                    {subjects.map((subject) => (
                      <SelectItem key={subject} value={subject}>
                        {subject}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </label>
            </div>

            <div>
              <label className="flex flex-col space-y-1">
                <span className="text-sm text-gray-600">Select Grade</span>
                <Select
                  value={formData.grade.toString()}
                  onValueChange={(value: string) => handleInputChange("grade", parseInt(value))}
                  disabled={isLoadingGrades || !formData.subject}
                >
                  <SelectTrigger className="w-[200px]">
                    <SelectValue placeholder="Select a grade" />
                  </SelectTrigger>
                  <SelectContent>
                    {grades.map((grade) => (
                      <SelectItem key={grade} value={grade.toString()}>
                        Grade {grade}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </label>
            </div>

            <div>
              <label className="flex flex-col space-y-1">
                <span className="text-sm text-gray-600">Select Domain</span>
                <Select
                  value={formData.domain}
                  onValueChange={(value: string) => handleInputChange("domain", value)}
                  disabled={isLoadingDomains || !formData.grade}
                >
                  <SelectTrigger className="w-[300px]">
                    <SelectValue placeholder="Select a domain" />
                  </SelectTrigger>
                  <SelectContent>
                    {domains.map((domain) => (
                      <SelectItem key={domain} value={domain}>
                        {domain}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </label>
            </div>
          </div>

          <div className="flex justify-center items-center">
            <Button
              type="button"
              onClick={handleLaunchTest}
              className="gap-2 text-base bg-indigo-600 hover:bg-indigo-700 text-white"
              disabled={!formData.subject || !formData.grade || !formData.domain || !tenantDomain || !accessToken}
            >
              Launch test
            </Button>
          </div>
        </div>
      </div>

      <Card className="rounded-md">
        <div className="w-full flex gap-6 bg-[#fff] p-4 pb-0 pl-0">
          <div className="flex gap-4 pl-4">
            <div className="py-8">
              <h2 className="text-center font-bold">More about Question Simplar</h2>
              <p className="pl-3 text-justify">
                Question Simplar is an advanced test preparation system that helps students practice and improve their skills
                across various subjects and grade levels. Select your subject, grade, and domain to start practicing with
                real exam-style questions.
              </p>
            </div>
          </div>
        </div>
      </Card>
    </section>
  );
}