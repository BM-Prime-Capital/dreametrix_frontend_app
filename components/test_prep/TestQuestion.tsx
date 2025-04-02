import { useState, useEffect, useRef } from "react"
import { ArrowLeft, Bookmark, Calculator, ChevronLeft, ChevronRight, Eraser, HelpCircle, ImageIcon, Lightbulb, Maximize, Palette, PenTool, Ruler, Send, TextCursor, Timer } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { useRequestInfo } from "@/hooks/useRequestInfo"

interface TestQuestionProps {
  onBack: () => void;
  questions: Array<{
    id: number;
    main_link: string;
    preview_urls: string[];
  }>;
}

export default function TestQuestion({ onBack, questions }: TestQuestionProps) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [loadedImages, setLoadedImages] = useState<Record<number, boolean>>({});
  const [previewImageSrc, setPreviewImageSrc] = useState<string | null>(null);
  const { tenantDomain, accessToken } = useRequestInfo();
  const mainImageRef = useRef<HTMLImageElement>(null);

  const handleNextQuestion = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer(null);
      setPreviewImageSrc(null);
    }
  };

  const handlePrevQuestion = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
      setSelectedAnswer(null);
      setPreviewImageSrc(null);
    }
  };

  // Function to get the correct preview URL format
  const getPreviewUrl = (questionId: number, previewUrl: string) => {
    if (!previewUrl) return "";
    
    // Extract the URL parameter from the preview_urls
    const urlParam = previewUrl.split('?url=')[1];
    if (!urlParam) return previewUrl;
    
    // Construct the correct preview URL
    return `${tenantDomain}/testprep/question-preview/${questionId}/?url=${urlParam}`;
  };

  // Fetch preview image with authentication
  useEffect(() => {
    const fetchPreviewImage = async () => {
      if (!questions[currentQuestion]?.preview_urls?.length || !accessToken) return;
      
      try {
        const previewUrl = getPreviewUrl(
          questions[currentQuestion].id, 
          questions[currentQuestion].preview_urls[0]
        );
        
        const response = await fetch(previewUrl, {
          headers: {
            'Authorization': `Bearer ${accessToken}`
          }
        });
        
        if (!response.ok) {
          throw new Error(`Failed to load preview: ${response.status}`);
        }
        
        const blob = await response.blob();
        const objectUrl = URL.createObjectURL(blob);
        setPreviewImageSrc(objectUrl);
        
        // Clean up the object URL when it's no longer needed
        return () => {
          URL.revokeObjectURL(objectUrl);
        };
      } catch (error) {
        console.error("Error loading preview image:", error);
      }
    };
    
    fetchPreviewImage();
  }, [currentQuestion, questions, accessToken]);

  // Preload the next image
  useEffect(() => {
    if (currentQuestion < questions.length - 1 && accessToken) {
      const preloadImage = async () => {
        try {
          const response = await fetch(questions[currentQuestion + 1].main_link, {
            headers: {
              'Authorization': `Bearer ${accessToken}`
            }
          });
          
          if (response.ok) {
            const blob = await response.blob();
            const img = new Image();
            img.src = URL.createObjectURL(blob);
            
            // Clean up
            return () => URL.revokeObjectURL(img.src);
          }
        } catch (error) {
          console.error("Error preloading next image:", error);
        }
      };
      
      preloadImage();
    }
  }, [currentQuestion, questions, accessToken]);

  const handleImageLoad = (questionId: number) => {
    setLoadedImages(prev => ({
      ...prev,
      [questionId]: true
    }));
  };

  const currentQuestionData = questions[currentQuestion];

  return (
    <div className="min-h-screen bg-white flex flex-col w-full">
      {/* Header */}
      <header className="flex justify-between items-center p-4 border-b w-full bg-gradient-to-r from-blue-50 to-indigo-50">
        <Button
          variant="ghost"
          onClick={onBack}
          className="flex items-center gap-2 text-indigo-600 hover:bg-indigo-100"
        >
          <ArrowLeft size={20} />
          <span>Return to Test Prep</span>
        </Button>
        <div className="flex items-center gap-3">
          <div className="bg-gray-100 px-3 py-1 rounded-full text-sm flex items-center gap-1">
            <Timer size={16} className="text-gray-500" />
            <span>Time remaining: 45:00</span>
          </div>
          <Button variant="outline" className="border-indigo-200 text-indigo-700 hover:bg-indigo-50">
            <HelpCircle size={18} className="mr-2" />
            Help
          </Button>
          <Button className="bg-indigo-600 hover:bg-indigo-700 text-white">
            <Send size={18} className="mr-2" />
            Submit
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 p-6 w-full max-w-5xl mx-auto">
        {questions.length === 0 ? (
          <div className="flex justify-center items-center h-64">
            <p className="text-gray-500">No questions available</p>
          </div>
        ) : (
          <div className="w-full mx-auto bg-white rounded-xl shadow-sm border p-6">
            <div className="flex justify-between items-center mb-6">
              <h2 className="font-bold text-xl text-gray-800">
                Question {currentQuestion + 1} of {questions.length}
              </h2>
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="sm" className="text-indigo-600 hover:bg-indigo-50">
                  <Bookmark size={18} className="mr-1" />
                  Save
                </Button>
              </div>
            </div>

            {/* Question Image */}
            <div className="mb-8 bg-gray-50 p-6 rounded-lg">
              <div className="relative">
                {/* Show loading state if neither preview nor main image is loaded */}
                {!previewImageSrc && !loadedImages[currentQuestionData?.id] && (
                  <div className="w-full aspect-video flex justify-center items-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
                  </div>
                )}
                
                {/* Show preview image while main image loads */}
                {previewImageSrc && !loadedImages[currentQuestionData?.id] && (
                  <img
                    src={previewImageSrc || "/placeholder.svg"}
                    alt={`Question ${currentQuestion + 1} preview`}
                    className="w-full h-auto rounded-lg"
                  />
                )}
                
                {/* Main image with authentication */}
                {currentQuestionData && (
                  <img
                    ref={mainImageRef}
                    src={currentQuestionData.main_link || "/placeholder.svg"}
                    alt={`Question ${currentQuestion + 1}`}
                    className={`w-full h-auto rounded-lg ${!loadedImages[currentQuestionData.id] ? 'hidden' : ''}`}
                    onLoad={() => handleImageLoad(currentQuestionData.id)}
                    crossOrigin="anonymous"
                  />
                )}
              </div>
            </div>

            {/* Answer Options */}
            <div className="flex justify-center gap-8 mt-6">
              {['A', 'B', 'C', 'D', 'E'].map((option) => (
                <button
                  key={option}
                  onClick={() => setSelectedAnswer(option)}
                  className={`w-12 h-12 rounded-full flex items-center justify-center text-lg font-semibold transition-all
                    ${selectedAnswer === option 
                      ? 'bg-indigo-600 text-white' 
                      : 'bg-gray-100 text-gray-700 hover:bg-indigo-50 hover:text-indigo-600'}`}
                >
                  {option}
                </button>
              ))}
            </div>

            {/* Navigation Buttons */}
            <div className="flex justify-between items-center mt-8 border-t pt-6">
              <Button
                variant="outline"
                onClick={handlePrevQuestion}
                disabled={currentQuestion === 0}
                className="flex items-center gap-2 px-5 py-2 h-auto text-indigo-700 border-indigo-200 hover:bg-indigo-50 disabled:opacity-50"
              >
                <ChevronLeft size={20} />
                Previous Question
              </Button>

              <div className="flex items-center gap-1">
                {questions.map((_, index) => (
                  <div
                    key={index}
                    className={`w-2.5 h-2.5 rounded-full mx-0.5 ${
                      currentQuestion === index ? "bg-indigo-600" : "bg-gray-300"
                    }`}
                    onClick={() => setCurrentQuestion(index)}
                    style={{ cursor: "pointer" }}
                  />
                ))}
              </div>

              <Button
                variant="outline"
                onClick={handleNextQuestion}
                disabled={currentQuestion === questions.length - 1}
                className="flex items-center gap-2 px-5 py-2 h-auto bg-indigo-600 text-white hover:bg-indigo-700 disabled:opacity-50 border-0"
              >
                Next Question
                <ChevronRight size={20} />
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Tools Footer */}
      <footer className="bg-gradient-to-r from-gray-800 to-gray-900 p-3 w-full">
        <div className="flex justify-center gap-2 flex-wrap">
          {[
            { icon: <Lightbulb size={20} />, label: "Hint", color: "bg-amber-500" },
            { icon: <TextCursor size={20} />, label: "Line Reader", color: "bg-blue-500" },
            { icon: <Calculator size={20} />, label: "Calculator", color: "bg-purple-500" },
            { icon: <Palette size={20} />, label: "Highlighter", color: "bg-green-500" },
            { icon: <Eraser size={20} />, label: "Eraser", color: "bg-red-500" },
            { icon: <Ruler size={20} />, label: "Ruler", color: "bg-teal-500" },
            { icon: <PenTool size={20} />, label: "Notes", color: "bg-indigo-500" },
            { icon: <ImageIcon size={20} />, label: "Reference", color: "bg-pink-500" },
            { icon: <Maximize size={20} />, label: "Fullscreen", color: "bg-gray-500" },
          ].map((tool, index) => (
            <Button
              key={index}
              variant="ghost"
              className="text-white hover:bg-white/10 flex flex-col items-center gap-1 p-2 rounded-lg"
            >
              <div className={`${tool.color} p-2 rounded-full`}>{tool.icon}</div>
              <span className="text-xs font-medium">{tool.label}</span>
            </Button>
          ))}
        </div>
      </footer>
    </div>
  );
}