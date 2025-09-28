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
import { Button } from "@/components/ui/button";
import { useRequestInfo } from "@/hooks/useRequestInfo";
import { submitTestAnswers, generateTestReport } from "@/services/TestPrepService";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { ToastContainer } from "react-toastify";
import CalculatorComponent from "./tools/Calculator";
import RulerComponent from "./tools/EnhancedRuler";
import NotesPanelComponent from "./tools/NotesPanel";
import LineReaderComponent from "./tools/LineReader";
import ReferencePanelComponent from "./tools/ReferencePanel";
import HintDisplayComponent from "./tools/HintDisplay";
import HighlighterTool from "./tools/HighlighterTool";

// Interfaces (inchangées)
interface DrawingPoint { x: number; y: number; }
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
  questionNumber: number;
  correctAnswer: string;
  pointValue: number;
  domain?: string;
  type?: string;
  standard?: string;
  hint?: string;
}
interface TestQuestionProps { onBack: () => void; questions: Question[]; }
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
  // États (inchangés)
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
  const [loadedImages, setLoadedImages] = useState<Record<number, boolean>>({});
  const [previewImageSrc, setPreviewImageSrc] = useState<string | null>(null);
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [questionHighlights, setQuestionHighlights] = useState<Record<number, Highlight[]>>({});
  const [isHintVisible, setIsHintVisible] = useState(false);
  const [isLineReaderVisible, setIsLineReaderVisible] = useState(false);
  const [isCalculatorVisible, setIsCalculatorVisible] = useState(false);
  const [isRulerVisible, setIsRulerVisible] = useState(false);
  const [isNotesVisible, setIsNotesVisible] = useState(false);
  const [isReferenceVisible, setIsReferenceVisible] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [currentHintText, setCurrentHintText] = useState("");
  const [isHighlighterVisible, setIsHighlighterVisible] = useState(false);
  const [questionContainerWidth, setQuestionContainerWidth] = useState(800);
  const { tenantDomain, accessToken } = useRequestInfo();
  const mainImageRef = useRef<HTMLImageElement>(null);
  const fullscreenContentRef = useRef<HTMLDivElement>(null);
  const annotatableContentRef = useRef<HTMLDivElement>(null);

  // Fonction pour convertir les URLs Dropbox en URLs directes
  const convertDropboxUrl = (url: string): string => {
    if (!url) return "";
    let convertedUrl = url.replace('www.dropbox.com', 'dl.dropboxusercontent.com');
    convertedUrl = convertedUrl.replace('&raw=1', '');
    return convertedUrl;
  };

  // Helper functions for highlights (inchangées)
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

  // Initialisation des réponses
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

  // Mise à jour des réponses
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

  // Mise à jour de la largeur du conteneur
  useEffect(() => {
    const updateContainerWidth = () => {
      if (mainImageRef.current) {
        setQuestionContainerWidth(mainImageRef.current.offsetWidth);
      }
    };
    updateContainerWidth();
    window.addEventListener("resize", updateContainerWidth);
    return () => window.removeEventListener("resize", updateContainerWidth);
  }, []);

  // Soumission du test (inchangé)
  const handleSubmit = async () => {
    setIsSubmitting(true);
    try {
      const unansweredQuestions = answers.filter((a) => a.selectedOption === null);
      if (unansweredQuestions.length > 0) {
        const unansweredNumbers = unansweredQuestions
          .map((a) => questions.find((q) => q.id === a.questionId)?.questionNumber)
          .filter(Boolean)
          .join(", ");
        throw new Error(`Please answer all questions. Missing answers for questions: ${unansweredNumbers}`);
      }

      const { correctedAnswers, score, totalPossible, percentage } = await submitTestAnswers(
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

      const pdfBlob = generateTestReport(correctedAnswers, testDetails);
      const url = URL.createObjectURL(pdfBlob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `Test_Results_${testDetails.subject}_${new Date().toISOString().slice(0, 10)}.pdf`;
      document.body.appendChild(a);
      a.click();
      setTimeout(() => {
        document.body.removeChild(a);
        URL.revokeObjectURL(url);
      }, 100);

      const isPassing = percentage >= 70;
      const message = isPassing
        ? `Congratulations! You passed with ${score}/${totalPossible} (${percentage}%)`
        : `Score: ${score}/${totalPossible} (${percentage}%). Keep practicing!`;
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
      alert(error instanceof Error ? error.message : "An unexpected error occurred during submission");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Navigation entre questions
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

  // Chargement de l'image principale (mis à jour)
  const handleImageLoad = (questionId: number) => {
    setLoadedImages((prev) => ({ ...prev, [questionId]: true }));
  };

  // Préchargement de l'image suivante (mis à jour)
  useEffect(() => {
    if (currentQuestion < questions.length - 1) {
      const nextQuestion = questions[currentQuestion + 1];
      const nextImageUrl = convertDropboxUrl(nextQuestion.main_link);
      const img = new Image();
      img.src = nextImageUrl; // Précharge sans attendre
    }
  }, [currentQuestion, questions]);

  // Chargement de l'image de prévisualisation (simplifié)
  useEffect(() => {
    const currentQuestionData = questions[currentQuestion];
    if (!currentQuestionData?.main_link) return;

    const mainImageUrl = convertDropboxUrl(currentQuestionData.main_link);
    setPreviewImageSrc(mainImageUrl); // Utilise directement l'URL convertie
  }, [currentQuestion, questions]);

  // Gestion du plein écran (inchangé)
  const toggleFullscreen = () => {
    const element = fullscreenContentRef.current;
    if (!element) return;
    if (!document.fullscreenElement) {
      element.requestFullscreen()
        .then(() => setIsFullscreen(true))
        .catch((err) => {
          console.error(`Error attempting to enable full-screen mode: ${err.message}`);
          toast.error("Failed to enter fullscreen mode.");
        });
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen()
          .then(() => setIsFullscreen(false))
          .catch((err) => {
            console.error(`Error attempting to exit full-screen mode: ${err.message}`);
            toast.error("Failed to exit fullscreen mode.");
          });
      }
    }
  };

  // Gestion des outils (inchangé)
  const handleToolClick = (toolLabel: string) => {
    console.log(`${toolLabel} clicked`);
    switch (toolLabel) {
      case "Hint":
        const currentQ = questions[currentQuestion];
        let hintToDisplay = currentQ?.hint || "Aucune aide spécifique disponible pour cette question. Essayez de revoir les concepts clés.";
        if (!isHintVisible) {
          setCurrentHintText(hintToDisplay);
          toast.info("Hint: " + hintToDisplay);
        } else {
          toast.info("Hint hidden");
        }
        setIsHintVisible((prev) => !prev);
        break;
      case "Line Reader":
        setIsLineReaderVisible((prev) => !prev);
        break;
      case "Calculator":
        setIsCalculatorVisible((prev) => !prev);
        break;
      case "Highlighter":
        setIsHighlighterVisible((prev) => !prev);
        toast.info(!isHighlighterVisible ? "Highlighter tool activated - Draw on the image!" : "Highlighter tool deactivated");
        break;
      case "Eraser":
        toast.info("Eraser tool not yet implemented");
        break;
      case "Ruler":
        setIsRulerVisible((prev) => !prev);
        break;
      case "Notes":
        setIsNotesVisible((prev) => !prev);
        break;
      case "Reference":
        setIsReferenceVisible((prev) => !prev);
        break;
      case "Fullscreen":
      case "Exit Fullscreen":
        toggleFullscreen();
        break;
      default:
        break;
    }
  };

  const currentQuestionData = questions[currentQuestion];
  const mainImageUrl = currentQuestionData ? convertDropboxUrl(currentQuestionData.main_link) : "";

  return (
    <div ref={fullscreenContentRef} className="min-h-screen bg-gradient-to-br from-green-50/30 to-emerald-50/20 flex flex-col w-full relative overflow-auto">
      {/* Header (inchangé) */}
      <header className="flex justify-between items-center p-6 border-b border-gray-200/60 w-full bg-gradient-to-r from-green-600 via-emerald-600 to-teal-700 shadow-xl">
        <Button variant="ghost" onClick={onBack} className="flex items-center gap-2 text-white hover:bg-white/20 rounded-xl backdrop-blur-sm px-4 py-2">
          <ArrowLeft size={20} />
          <span className="font-medium">Return to Test Prep</span>
        </Button>
        <div className="flex items-center gap-4">
          <div className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-xl text-sm flex items-center gap-2 text-white">
            <Timer size={16} />
            <span className="font-medium">Time remaining: 45:00</span>
          </div>
          <Button variant="outline" className="border-white/30 text-white hover:bg-white/20 backdrop-blur-sm rounded-xl">
            <HelpCircle size={18} className="mr-2" />
            Help
          </Button>
          <Button
            className="bg-white/20 hover:bg-white/30 text-white border-white/30 rounded-xl backdrop-blur-sm font-medium"
            onClick={handleSubmit}
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <svg className="animate-spin h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Processing...
              </>
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
      <div className="flex-1 p-8 w-full max-w-6xl mx-auto">
        {questions.length === 0 ? (
          <div className="flex flex-col justify-center items-center h-64 bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg">
            <div className="w-16 h-16 bg-gradient-to-br from-green-100 to-emerald-100 rounded-full flex items-center justify-center mb-4">
              <svg className="w-8 h-8 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
            </div>
            <p className="text-gray-500 text-lg font-medium">No questions available</p>
          </div>
        ) : (
          <div className="w-full mx-auto bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl border border-gray-100 p-8">
            {/* Question Header */}
            <div className="flex justify-between items-center mb-8">
              <div>
                <h2 className="font-bold text-2xl bg-gradient-to-r from-green-600 to-emerald-600 bg-clip-text text-transparent">
                  Question {currentQuestion + 1} of {questions.length}
                </h2>
                <p className="text-gray-500 text-sm mt-1">Select the best answer from the options below</p>
              </div>
              <div className="flex items-center gap-3">
                <div className="bg-gray-50 px-3 py-2 rounded-xl text-sm font-medium text-gray-600">
                  Progress: {Math.round(((currentQuestion + 1) / questions.length) * 100)}%
                </div>
                <Button variant="ghost" size="sm" className="text-green-600 hover:bg-green-50 rounded-xl">
                  <Bookmark size={18} className="mr-2" />
                  Save
                </Button>
              </div>
            </div>

            {/* Question Image Container (mis à jour) */}
            <div className="mb-8 bg-gradient-to-br from-gray-50 to-gray-100 p-8 rounded-2xl relative shadow-inner border border-gray-200" ref={mainImageRef}>
              <div className="relative">
                {!previewImageSrc && (
                  <div className="w-full aspect-video flex justify-center items-center">
                    <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
                  </div>
                )}
                {previewImageSrc && (
                  <img
                    src={previewImageSrc}
                    alt={`Question ${currentQuestion + 1}`}
                    className="w-full h-auto rounded-lg"
                    onLoad={() => handleImageLoad(currentQuestionData.id)}
                    onError={(e) => {
                      console.error("Failed to load image:", e);
                      e.currentTarget.src = "/fallback-question.png"; // Fallback local
                    }}
                  />
                )}
                {isLineReaderVisible && (
                  <LineReaderComponent
                    onClose={() => setIsLineReaderVisible(false)}
                    initialPosition={{ x: 0, y: 50 }}
                    containerWidth={questionContainerWidth}
                  />
                )}
              </div>
            </div>

            {/* Answer Options (inchangé) */}
            <div className="flex justify-center gap-6 mt-8">
              {["A", "B", "C", "D", "E"].map((option) => (
                <button
                  key={option}
                  onClick={() => setSelectedAnswer(option)}
                  className={`w-16 h-16 rounded-2xl flex items-center justify-center text-xl font-bold transition-all duration-200 shadow-lg hover:shadow-xl hover:scale-105
                    ${
                      selectedAnswer === option
                        ? "bg-gradient-to-br from-green-500 to-emerald-600 text-white"
                        : "bg-white text-gray-700 hover:bg-gradient-to-br hover:from-green-50 hover:to-emerald-50 hover:text-green-600 border-2 border-gray-200 hover:border-green-300"
                    }`}
                >
                  {option}
                </button>
              ))}
            </div>

            {/* Navigation Buttons (inchangé) */}
            <div className="flex justify-between items-center mt-10 border-t border-gray-200 pt-8">
              <Button
                variant="outline"
                onClick={handlePrevQuestion}
                disabled={currentQuestion === 0}
                className="flex items-center gap-2 px-6 py-3 h-auto text-green-700 border-green-200 hover:bg-green-50 disabled:opacity-50 rounded-xl font-medium"
              >
                <ChevronLeft size={20} />
                Previous Question
              </Button>
              <div className="flex items-center gap-2 bg-gray-50 px-4 py-2 rounded-xl">
                {questions.map((_, index) => (
                  <div
                    key={index}
                    className={`w-3 h-3 rounded-full transition-all duration-200 cursor-pointer hover:scale-125 ${
                      currentQuestion === index
                        ? "bg-gradient-to-r from-green-500 to-emerald-600 shadow-lg"
                        : "bg-gray-300 hover:bg-gray-400"
                    }`}
                    onClick={() => setCurrentQuestion(index)}
                  />
                ))}
              </div>
              <Button
                variant="outline"
                onClick={handleNextQuestion}
                disabled={currentQuestion === questions.length - 1}
                className="flex items-center gap-2 px-6 py-3 h-auto bg-gradient-to-r from-green-500 to-emerald-600 text-white hover:from-green-600 hover:to-emerald-700 disabled:opacity-50 border-0 rounded-xl font-medium shadow-lg hover:shadow-xl transition-all duration-200"
              >
                Next Question
                <ChevronRight size={20} />
              </Button>
            </div>

            {/* Tools Toolbar (inchangé) */}
            <div className="mt-8 pt-8 border-t border-gray-200">
              <h3 className="text-lg font-bold text-gray-800 mb-6 text-center flex items-center justify-center gap-2">
                <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                Test Tools
              </h3>
              <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-6 rounded-2xl shadow-inner border border-green-100">
                <div className="grid grid-cols-4 md:grid-cols-8 gap-4">
                  {[
                    { icon: <Lightbulb size={20} />, label: "Hint", color: "bg-gradient-to-br from-amber-400 to-orange-500 hover:from-amber-500 hover:to-orange-600" },
                    { icon: <TextCursor size={20} />, label: "Line Reader", color: "bg-gradient-to-br from-blue-400 to-indigo-500 hover:from-blue-500 hover:to-indigo-600" },
                    { icon: <Calculator size={20} />, label: "Calculator", color: "bg-gradient-to-br from-purple-400 to-violet-500 hover:from-purple-500 hover:to-violet-600" },
                    { icon: <Palette size={20} />, label: "Highlighter", color: "bg-gradient-to-br from-green-400 to-emerald-500 hover:from-green-500 hover:to-emerald-600" },
                    { icon: <Ruler size={20} />, label: "Ruler", color: "bg-gradient-to-br from-teal-400 to-cyan-500 hover:from-teal-500 hover:to-cyan-600" },
                    { icon: <PenTool size={20} />, label: "Notes", color: "bg-gradient-to-br from-indigo-400 to-blue-500 hover:from-indigo-500 hover:to-blue-600" },
                    { icon: <ImageIcon size={20} />, label: "Reference", color: "bg-gradient-to-br from-pink-400 to-rose-500 hover:from-pink-500 hover:to-rose-600" },
                    { icon: <Maximize size={20} />, label: isFullscreen ? "Exit Fullscreen" : "Fullscreen", color: "bg-gradient-to-br from-gray-400 to-slate-500 hover:from-gray-500 hover:to-slate-600" },
                  ].map((tool, index) => (
                    <Button
                      key={index}
                      variant="ghost"
                      className="text-gray-700 hover:text-white flex flex-col items-center gap-2 p-4 rounded-2xl h-fit transition-all duration-200 hover:scale-105 hover:shadow-lg"
                      onClick={() => handleToolClick(tool.label)}
                    >
                      <div className={`${tool.color} p-3 rounded-2xl shadow-lg transition-all duration-200`}>
                        {tool.icon}
                      </div>
                      <span className="text-xs font-semibold text-center leading-tight">{tool.label}</span>
                    </Button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Tool Components (inchangé) */}
      <ToastContainer />
      {isCalculatorVisible && <CalculatorComponent onClose={() => setIsCalculatorVisible(false)} />}
      {isRulerVisible && <RulerComponent onClose={() => setIsRulerVisible(false)} />}
      {isNotesVisible && <NotesPanelComponent onClose={() => setIsNotesVisible(false)} />}
      {isReferenceVisible && <ReferencePanelComponent onClose={() => setIsReferenceVisible(false)} />}
      {isHintVisible && currentHintText && <HintDisplayComponent hintText={currentHintText} onClose={() => setIsHintVisible(false)} />}
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