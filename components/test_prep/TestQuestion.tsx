import { useState, useEffect, useRef } from "react";
import {
  ArrowLeft,
  Bookmark,
  Calculator,
  ChevronLeft,
  ChevronRight,
  Eraser,
  HelpCircle,
  ImageIcon,
  Lightbulb,
  Maximize,
  Palette,
  PenTool,
  Ruler,
  Send,
  TextCursor,
  Timer,
} from "lucide-react";
import { Button } from "@/components/ui/button"; // MODIFIED_LINE - Assuming buttonVariants is not needed if we ignore variant prop issues
import { useRequestInfo } from "@/hooks/useRequestInfo";
import {
  submitTestAnswers,
  generateTestReport,
} from "@/services/TestPrepService";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";
import CalculatorComponent from "./tools/Calculator"; // ADDED: Import Calculator component
import RulerComponent from "./tools/EnhancedRuler"; // ADDED: Import Ruler component
import NotesPanelComponent from "./tools/NotesPanel"; // ADDED: Import NotesPanel component
import LineReaderComponent from "./tools/LineReader"; // ADDED: Import LineReader component
import ReferencePanelComponent from "./tools/ReferencePanel"; // ADDED: Import ReferencePanel component
import HintDisplayComponent from "./tools/HintDisplay"; // ADDED: Import HintDisplay component
import HighlighterTool from "./tools/HighlighterTool"; // ADDED: Import HighlighterTool

// Add the highlight interfaces that we need for question-specific highlights
interface DrawingPoint {
  x: number;
  y: number;
}

interface Highlight {
  id: string;
  type: "rectangle" | "circle" | "freehand";
  color: string;
  opacity: number;
  strokeWidth: number;
  x: number;
  y: number;
  width?: number;
  height?: number;
  radius?: number;
  points?: DrawingPoint[];
}

interface Question {
  id: number;
  main_link: string;
  preview_urls: string[];
  questionNumber: number; // Correspond à l'API
  correctAnswer: string; // Correspond à 'key' dans l'API
  pointValue: number;
  domain?: string;
  type?: string;
  standard?: string;
  hint?: string; // ADDED: Optional hint field
}

interface TestQuestionProps {
  onBack: () => void;
  questions: Question[];
}

interface Answer {
  questionId: number;
  questionNumber: number;
  selectedOption: string | null;
  correctAnswer: string;
  isCorrect?: boolean;
  pointValue: number;
}

interface CorrectedAnswer extends Answer {
  isCorrect: boolean;
  pointsEarned: number;
}

interface TestDetails {
  subject: string;
  grade: string;
  domain: string;
  date: string;
  totalQuestions: number;
  correctCount: number;
  totalScore: number;
  maxPossibleScore: number;
  percentage: number;
}

export default function TestQuestion({ onBack, questions }: TestQuestionProps) {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [loadedImages, setLoadedImages] = useState<Record<number, boolean>>({});
  const [previewImageSrc, setPreviewImageSrc] = useState<string | null>(null);
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Question-specific highlights state
  const [questionHighlights, setQuestionHighlights] = useState<
    Record<number, Highlight[]>
  >({});

  // States for footer tools
  const [isHintVisible, setIsHintVisible] = useState(false);
  const [isLineReaderVisible, setIsLineReaderVisible] = useState(false);
  const [isCalculatorVisible, setIsCalculatorVisible] = useState(false);
  const [isRulerVisible, setIsRulerVisible] = useState(false);
  const [isNotesVisible, setIsNotesVisible] = useState(false);
  const [isReferenceVisible, setIsReferenceVisible] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [currentHintText, setCurrentHintText] = useState<string>(""); // ADDED: State for hint text
  const [isHighlighterVisible, setIsHighlighterVisible] = useState(false); // ADDED: State for HighlighterTool visibility
  const [questionContainerWidth, setQuestionContainerWidth] = useState(800); // ADDED: State for container width

  const { tenantDomain, accessToken } = useRequestInfo();
  const mainImageRef = useRef<HTMLImageElement>(null);
  const fullscreenContentRef = useRef<HTMLDivElement>(null);
  const annotatableContentRef = useRef<HTMLDivElement>(null); // ADDED: Ref for annotatable content

  // Helper functions for question-specific highlights
  const getCurrentQuestionHighlights = (): Highlight[] => {
    const currentQuestionId = questions[currentQuestion]?.id;
    return questionHighlights[currentQuestionId] || [];
  };

  const updateCurrentQuestionHighlights = (highlights: Highlight[]) => {
    const currentQuestionId = questions[currentQuestion]?.id;
    if (currentQuestionId) {
      setQuestionHighlights((prev) => ({
        ...prev,
        [currentQuestionId]: highlights,
      }));
    }
  };

  const clearCurrentQuestionHighlights = () => {
    const currentQuestionId = questions[currentQuestion]?.id;
    if (currentQuestionId) {
      setQuestionHighlights((prev) => ({
        ...prev,
        [currentQuestionId]: [],
      }));
    }
  };

  useEffect(() => {
    setAnswers(
      questions.map((q) => ({
        questionId: q.id,
        questionNumber: q.questionNumber,
        selectedOption: null,
        correctAnswer: q.correctAnswer,
        pointValue: q.pointValue,
      }))
    );
  }, [questions]);

  useEffect(() => {
    if (selectedAnswer !== null) {
      setAnswers((prev) => {
        const newAnswers = [...prev];
        newAnswers[currentQuestion] = {
          ...newAnswers[currentQuestion],
          selectedOption: selectedAnswer,
        };
        return newAnswers;
      });
    }
  }, [selectedAnswer, currentQuestion]);

  // Update container width when component mounts or window resizes
  useEffect(() => {
    const updateContainerWidth = () => {
      if (mainImageRef.current) {
        setQuestionContainerWidth(mainImageRef.current.offsetWidth);
      }
    };

    // Update on mount
    updateContainerWidth();

    // Update on window resize
    window.addEventListener("resize", updateContainerWidth);

    return () => {
      window.removeEventListener("resize", updateContainerWidth);
    };
  }, []);

  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      // Validation
      const unansweredQuestions = answers.filter(
        (a) => a.selectedOption === null
      );
      if (unansweredQuestions.length > 0) {
        const unansweredNumbers = unansweredQuestions
          .map(
            (a) => questions.find((q) => q.id === a.questionId)?.questionNumber
          )
          .filter(Boolean)
          .join(", ");
        throw new Error(
          `Please answer all questions. Missing answers for questions: ${unansweredNumbers}`
        );
      }

      // AJOUT DES LOGS ICI
      console.log("=== DONNÉES ENVOYÉES AU SERVICE ===");
      console.log(
        "Questions (avec numéros):",
        questions.map((q) => ({
          id: q.id,
          questionNumber: q.questionNumber,
          correctAnswer: q.correctAnswer,
          pointValue: q.pointValue,
        }))
      );
      console.log(
        "Réponses des élèves:",
        answers.map((a) => ({
          questionId: a.questionId,
          questionNumber: a.questionNumber,
          selectedOption: a.selectedOption,
        }))
      );

      const { correctedAnswers, score, totalPossible, percentage } =
        await submitTestAnswers(
          answers.map((a) => ({
            questionId: a.questionId,
            selectedOption: a.selectedOption!,
          })),
          questions.map((q) => ({
            id: q.id,
            correctAnswer: q.correctAnswer,
            pointValue: q.pointValue,
            questionNumber: q.questionNumber,
          }))
        );

      // LOG DES RÉSULTATS CORRIGÉS
      console.log("=== RÉSULTATS CORRIGÉS ===");
      console.log(
        correctedAnswers.map((ca) => ({
          questionNumber: ca.questionNumber,
          selected: ca.selectedOption,
          correct: ca.correctAnswer,
          isCorrect: ca.isCorrect,
          points: `${ca.pointsEarned}/${ca.pointValue}`,
        }))
      );

      // Prepare test details
      const testDetails: TestDetails = {
        subject: localStorage.getItem("testSubject") || "Unknown Subject",
        grade: localStorage.getItem("testGrade") || "Unknown Grade",
        domain: localStorage.getItem("testDomain") || "Unknown Domain",
        date: new Date().toLocaleDateString(),
        totalQuestions: correctedAnswers.length,
        correctCount: correctedAnswers.filter((a) => a.isCorrect).length,
        totalScore: score,
        maxPossibleScore: totalPossible,
        percentage,
      };

      // Generate and download PDF
      const pdfBlob = generateTestReport(correctedAnswers, testDetails);
      const url = URL.createObjectURL(pdfBlob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `Test_Results_${testDetails.subject}_${new Date()
        .toISOString()
        .slice(0, 10)}.pdf`;
      document.body.appendChild(a);
      a.click();

      // Cleanup
      setTimeout(() => {
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      }, 100);

      // Show results
      const isPassing = percentage >= 70;
      const message = isPassing
        ? `Congratulations! You passed with ${score}/${totalPossible} (${percentage}%)`
        : `Score: ${score}/${totalPossible} (${percentage}%). Keep practicing!`;

      // alert(`Test completed!\n\n${message}`);
      toast.success(`Test completed!\n\n${message}`, {
        position: "top-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    } catch (error) {
      console.error("Test submission failed:", error);
      alert(
        error instanceof Error
          ? error.message
          : "An unexpected error occurred during submission"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

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

  const getPreviewUrl = (questionId: number, previewUrl: string) => {
    if (!previewUrl) return "";
    const urlParam = previewUrl.split("?url=")[1];
    if (!urlParam) return previewUrl;
    return `${tenantDomain}/testprep/question-preview/${questionId}/?url=${urlParam}`;
  };

  useEffect(() => {
    const fetchPreviewImage = async () => {
      if (!questions[currentQuestion]?.preview_urls?.length || !accessToken)
        return;

      try {
        const previewUrl = getPreviewUrl(
          questions[currentQuestion].id,
          questions[currentQuestion].preview_urls[0]
        );

        const response = await fetch(previewUrl, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });

        if (!response.ok) {
          throw new Error(`Failed to load preview: ${response.status}`);
        }

        const blob = await response.blob();
        const objectUrl = URL.createObjectURL(blob);
        setPreviewImageSrc(objectUrl);

        return () => {
          URL.revokeObjectURL(objectUrl);
        };
      } catch (error) {
        console.error("Error loading preview image:", error);
      }
    };

    fetchPreviewImage();
  }, [currentQuestion, questions, accessToken]);

  useEffect(() => {
    if (currentQuestion < questions.length - 1 && accessToken) {
      const preloadImage = async () => {
        try {
          const response = await fetch(
            questions[currentQuestion + 1].main_link,
            {
              headers: {
                Authorization: `Bearer ${accessToken}`,
              },
            }
          );

          if (response.ok) {
            const blob = await response.blob();
            const img = new Image();
            img.src = URL.createObjectURL(blob);
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
    console.log("Image loaded for question ID:", questionId);
    setLoadedImages((prev) => ({
      ...prev,
      [questionId]: true,
    }));
  };

  const toggleFullscreen = () => {
    const element = fullscreenContentRef.current;
    if (!element) return;

    if (!document.fullscreenElement) {
      element
        .requestFullscreen()
        .then(() => setIsFullscreen(true))
        .catch((err) => {
          console.error(
            `Error attempting to enable full-screen mode: ${err.message} (${err.name})`
          );
          toast.error("Failed to enter fullscreen mode.");
        });
    } else {
      if (document.exitFullscreen) {
        document
          .exitFullscreen()
          .then(() => setIsFullscreen(false))
          .catch((err) => {
            console.error(
              `Error attempting to exit full-screen mode: ${err.message} (${err.name})`
            );
            toast.error("Failed to exit fullscreen mode.");
          });
      }
    }
  };

  const handleToolClick = (toolLabel: string) => {
    console.log(`${toolLabel} clicked`);
    switch (toolLabel) {
      case "Hint":
        const currentQ = questions[currentQuestion];
        let hintToDisplay = "";

        if (currentQ && currentQ.hint && currentQ.hint.trim() !== "") {
          hintToDisplay = currentQ.hint;
        } else {
          hintToDisplay =
            "Aucune aide spécifique disponible pour cette question. Essayez de revoir les concepts clés.";
        }

        if (!isHintVisible) {
          setCurrentHintText(hintToDisplay);
          toast.info("Hint: " + hintToDisplay); // Keep toast for now, or remove if HintDisplay is enough
        } else {
          toast.info("Hint hidden");
        }
        setIsHintVisible((prev: boolean) => !prev);
        break;
      case "Line Reader":
        setIsLineReaderVisible((prev: boolean) => !prev);
        // Toast is handled by the component or not needed if UI is clear
        break;
      case "Calculator":
        setIsCalculatorVisible((prev: boolean) => !prev);
        // Toast is handled by the component or not needed if UI is clear
        break;
      case "Highlighter":
        setIsHighlighterVisible((prev: boolean) => !prev);
        if (!isHighlighterVisible) {
          toast.info("Highlighter tool activated - Draw on the image!");
        } else {
          toast.info("Highlighter tool deactivated");
        }
        break;
      case "Eraser":
        // For now, just show a message that eraser functionality is not implemented
        toast.info("Eraser tool not yet implemented");
        break;
      case "Ruler":
        setIsRulerVisible((prev: boolean) => !prev);
        // Toast is handled by the component or not needed if UI is clear
        break;
      case "Notes": // Assuming 'Notes' was the label for ImageIcon
        setIsNotesVisible((prev: boolean) => !prev);
        // Toast is handled by the component or not needed if UI is clear
        break;
      case "Reference": // This was missing, adding a placeholder if needed or adjust label
        setIsReferenceVisible((prev: boolean) => !prev);
        // Toast is handled by the component or not needed if UI is clear
        break;
      case "Fullscreen":
      case "Exit Fullscreen":
        toggleFullscreen();
        // Toast for fullscreen is handled in toggleFullscreen
        break;
      default:
        break;
    }
  };

  const currentQuestionData = questions[currentQuestion];

  return (
    <div
      ref={fullscreenContentRef}
      className="min-h-screen bg-white flex flex-col w-full relative overflow-auto"
    >
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
          <Button
            variant="outline"
            className="border-indigo-200 text-indigo-700 hover:bg-indigo-50"
          >
            <HelpCircle size={18} className="mr-2" />
            Help
          </Button>
          <Button
            className="bg-indigo-600 hover:bg-indigo-700 text-white"
            onClick={handleSubmit}
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              "Processing..."
            ) : (
              <>
                <Send size={18} className="mr-2" />
                Submit Test
              </>
            )}
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
          <div
            // ref={annotatableContentRef} // ATTACHED: Ref for annotation target

            className="w-full mx-auto bg-white rounded-xl shadow-sm border p-6"
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="font-bold text-xl text-gray-800">
                Question {currentQuestion + 1} of {questions.length}
              </h2>
              <div className="flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-indigo-600 hover:bg-indigo-50"
                >
                  <Bookmark size={18} className="mr-1" />
                  Save
                </Button>
              </div>
            </div>

            {/* Question Image Container - LineReader will be constrained to this area */}
            <div
              className="mb-8 bg-gray-50 p-6 rounded-lg relative"
              ref={mainImageRef}
            >
              <div className="relative">
                {!previewImageSrc && !loadedImages[currentQuestionData?.id] && (
                  <div className="w-full aspect-video flex justify-center items-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
                  </div>
                )}

                {previewImageSrc && !loadedImages[currentQuestionData?.id] && (
                  <img
                    src={previewImageSrc}
                    alt={`Question ${currentQuestion + 1} preview`}
                    className="w-full h-auto rounded-lg"
                  />
                )}

                {currentQuestionData && (
                  <img
                    src={currentQuestionData.main_link}
                    alt={`Question ${currentQuestion + 1}`}
                    className={`w-full h-auto rounded-lg ${
                      !loadedImages[currentQuestionData.id] ? "hidden" : ""
                    }`}
                    onLoad={() => handleImageLoad(currentQuestionData.id)}
                    crossOrigin="anonymous"
                  />
                )}

                {/* LineReader - constrained to this question container */}
                {isLineReaderVisible && (
                  <LineReaderComponent
                    onClose={() => setIsLineReaderVisible(false)}
                    initialPosition={{ x: 0, y: 50 }}
                    containerWidth={questionContainerWidth}
                  />
                )}
              </div>
            </div>

            {/* Answer Options */}
            <div className="flex justify-center gap-8 mt-6">
              {["A", "B", "C", "D", "E"].map((option) => (
                <button
                  key={option}
                  onClick={() => setSelectedAnswer(option)}
                  className={`w-12 h-12 rounded-full flex items-center justify-center text-lg font-semibold transition-all
                    ${
                      selectedAnswer === option
                        ? "bg-indigo-600 text-white"
                        : "bg-gray-100 text-gray-700 hover:bg-indigo-50 hover:text-indigo-600"
                    }`}
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
                      currentQuestion === index
                        ? "bg-indigo-600"
                        : "bg-gray-300"
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

            {/* Tools Toolbar - Moved inside content area */}
            <div className="mt-6 pt-6 border-t border-gray-200">
              <h3 className="text-sm font-medium text-gray-700 mb-3 text-center">
                Test Tools
              </h3>
              <div className="bg-gradient-to-r from-slate-100 to-slate-200 p-4 rounded-lg shadow-sm">
                <div className="flex justify-center gap-3 flex-wrap">
                  {[
                    {
                      icon: <Lightbulb size={18} />,
                      label: "Hint",
                      color: "bg-amber-400 hover:bg-amber-500",
                    },
                    {
                      icon: <TextCursor size={18} />,
                      label: "Line Reader",
                      color: "bg-blue-400 hover:bg-blue-500",
                    },
                    {
                      icon: <Calculator size={18} />,
                      label: "Calculator",
                      color: "bg-purple-400 hover:bg-purple-500",
                    },
                    {
                      icon: <Palette size={18} />,
                      label: "Highlighter",
                      color: "bg-green-400 hover:bg-green-500",
                    },

                    {
                      icon: <Ruler size={18} />,
                      label: "Ruler",
                      color: "bg-teal-400 hover:bg-teal-500",
                    },
                    {
                      icon: <PenTool size={18} />,
                      label: "Notes",
                      color: "bg-indigo-400 hover:bg-indigo-500",
                    },
                    {
                      icon: <ImageIcon size={18} />,
                      label: "Reference",
                      color: "bg-pink-400 hover:bg-pink-500",
                    },
                    {
                      icon: <Maximize size={18} />,
                      label: isFullscreen ? "Exit Fullscreen" : "Fullscreen",
                      color: "bg-gray-400 hover:bg-gray-500",
                    },
                  ].map((tool, index) => (
                    <Button
                      key={index}
                      variant="ghost"
                      className="text-gray-700 hover:text-white flex flex-col items-center gap-1 p-3 rounded-lg h-fit transition-all duration-200 hover:scale-105"
                      onClick={() => handleToolClick(tool.label)}
                    >
                      <div
                        className={`${tool.color} p-2 rounded-full shadow-sm transition-colors duration-200`}
                      >
                        {tool.icon}
                      </div>
                      <span className="text-xs font-medium">{tool.label}</span>
                    </Button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <ToastContainer />
      {/* Tool Components */}
      {isCalculatorVisible && (
        <CalculatorComponent onClose={() => setIsCalculatorVisible(false)} />
      )}
      {isRulerVisible && (
        <RulerComponent onClose={() => setIsRulerVisible(false)} />
      )}
      {isNotesVisible && (
        <NotesPanelComponent
          onClose={() => setIsNotesVisible(false)}
          // initialNotes={localStorage.getItem('testPrepNotes') || ''} // Optional: Load saved notes
        />
      )}
      {isReferenceVisible && (
        <ReferencePanelComponent onClose={() => setIsReferenceVisible(false)} />
      )}
      {isHintVisible && currentHintText && (
        <HintDisplayComponent
          hintText={currentHintText}
          onClose={() => setIsHintVisible(false)}
        />
      )}
      {isHighlighterVisible && (
        <HighlighterTool
          onClose={() => setIsHighlighterVisible(false)}
          targetImageRef={mainImageRef}
          initialPosition={{ x: 100, y: 100 }}
          highlights={getCurrentQuestionHighlights()}
          onHighlightsChange={updateCurrentQuestionHighlights}
          onClearHighlights={clearCurrentQuestionHighlights}
        />
      )}
    </div>
  );
}
