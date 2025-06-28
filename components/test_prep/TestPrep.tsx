import { useState, useEffect } from "react"
import { Card } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import useSubjects from "@/hooks/Teacher/useSubject"
import useGrades from "@/hooks/Teacher/useGrade"
import useDomains from "@/hooks/Teacher/useDomains"
import { useRequestInfo } from "@/hooks/useRequestInfo"
import { Question } from "@/components/types/question"
import PageTitleH1 from "../ui/page-title-h1"

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
  
    // Stocker les infos du test pour le PDF
    localStorage.setItem('testSubject', formData.subject);
    localStorage.setItem('testGrade', formData.grade.toString());
    localStorage.setItem('testDomain', formData.domain);
  
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
    
  
      // Transformer les questions pour correspondre à l'interface attendue
      const transformedQuestions = data.questions.map((question: any, index: number) => ({
        id: question.id,
        questionNumber: question.id, // Utilisez l'id comme numéro de question
        correctAnswer: question.key, // La réponse correcte est dans 'key'
        pointValue: 1, // Valeur par défaut ou à adapter
        main_link: question.main_link,
        preview_urls: question.preview_urls,
        type: question.type,
        standard: question.standard,
        domain: question.domain
      }));

      console.log("Données brutes de l'API:",transformedQuestions);
  
      onStartTest(transformedQuestions);
    } catch (error) {
      console.error('Error fetching questions:', error);
    }
  };

  return (
    <section className="flex flex-col h-full w-full bg-gradient-to-br from-slate-50/30 to-gray-50/20">
      {/* Enhanced Header */}
      <div className="flex justify-between items-center bg-[#79bef2] px-8 py-6 shadow-xl">
        <div className="flex items-center gap-4">
          <div className="p-3 bg-white/20 rounded-xl backdrop-blur-sm">
            <svg className="h-6 w-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <div>
            <PageTitleH1 title="Test Preparation" className="text-white font-bold text-2xl" />
            <p className="text-blue-100 text-sm mt-1">Question Simplar - Practice with real exam questions</p>
          </div>
        </div>
      </div>

      {/* Content Area */}
      <div className="flex-1 p-8 space-y-8">
        {/* Selection Form */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-100 p-8">
          <h2 className="text-2xl font-bold text-gray-800 mb-6 text-center">Configure Your Test</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
                Select Subject
              </label>
              <Select
                value={formData.subject}
                onValueChange={(value: string) => handleInputChange("subject", value)}
                disabled={isLoadingSubjects}
              >
                <SelectTrigger className="w-full h-12 rounded-xl border-gray-300 focus:border-green-400 focus:ring-2 focus:ring-green-100">
                  <SelectValue placeholder="Choose a subject" />
                </SelectTrigger>
                <SelectContent>
                  {subjects.map((subject) => (
                    <SelectItem key={subject} value={subject}>
                      {subject}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
                Select Grade
              </label>
              <Select
                value={formData.grade.toString()}
                onValueChange={(value: string) => handleInputChange("grade", parseInt(value))}
                disabled={isLoadingGrades || !formData.subject}
              >
                <SelectTrigger className="w-full h-12 rounded-xl border-gray-300 focus:border-green-400 focus:ring-2 focus:ring-green-100">
                  <SelectValue placeholder="Choose a grade" />
                </SelectTrigger>
                <SelectContent>
                  {grades.map((grade) => (
                    <SelectItem key={grade} value={grade.toString()}>
                      Grade {grade}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                <svg className="w-4 h-4 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
                Select Domain
              </label>
              <Select
                value={formData.domain}
                onValueChange={(value: string) => handleInputChange("domain", value)}
                disabled={isLoadingDomains || !formData.grade}
              >
                <SelectTrigger className="w-full h-12 rounded-xl border-gray-300 focus:border-green-400 focus:ring-2 focus:ring-green-100">
                  <SelectValue placeholder="Choose a domain" />
                </SelectTrigger>
                <SelectContent>
                  {domains.map((domain) => (
                    <SelectItem key={domain} value={domain}>
                      {domain}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="flex justify-center">
            <Button
              type="button"
              onClick={handleLaunchTest}
              className="bg-[#79bef2] hover:bg-[#6bb0e8] text-white px-8 py-4 text-lg font-semibold rounded-2xl shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105"
              disabled={!formData.subject || !formData.grade || !formData.domain || !tenantDomain || !accessToken}
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1m4 0h1m-6 4h.01M19 10a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Launch Test
            </Button>
          </div>
        </div>

        {/* Information Card */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-100 p-8">
          <div className="flex items-start gap-6">
            <div className="p-4 bg-gradient-to-br from-green-100 to-emerald-100 rounded-2xl">
              <svg className="w-12 h-12 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
              </svg>
            </div>
            <div className="flex-1">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">About Question Simplar</h2>
              <p className="text-gray-600 leading-relaxed mb-4">
                Question Simplar is an advanced test preparation system that helps students practice and improve their skills
                across various subjects and grade levels. Our platform provides real exam-style questions designed to enhance
                learning and boost confidence.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
                <div className="flex items-center gap-3 p-3 bg-green-50 rounded-xl">
                  <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  </div>
                  <span className="text-sm font-medium text-gray-700">Real Exam Questions</span>
                </div>
                <div className="flex items-center gap-3 p-3 bg-emerald-50 rounded-xl">
                  <div className="w-8 h-8 bg-emerald-500 rounded-full flex items-center justify-center">
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                  <span className="text-sm font-medium text-gray-700">Instant Feedback</span>
                </div>
                <div className="flex items-center gap-3 p-3 bg-teal-50 rounded-xl">
                  <div className="w-8 h-8 bg-teal-500 rounded-full flex items-center justify-center">
                    <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2-2V6a2 2 0 012-2h2a2 2 0 012 2v1m0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                  </div>
                  <span className="text-sm font-medium text-gray-700">Detailed Reports</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}