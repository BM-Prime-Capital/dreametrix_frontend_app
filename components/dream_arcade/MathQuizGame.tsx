"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Trophy, Star, Zap, Target } from "lucide-react";

interface Question {
  question: string;
  options: string[];
  correct: number;
  difficulty: 'easy' | 'medium' | 'hard';
}

export default function MathQuizGame() {
  const [score, setScore] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [timeLeft, setTimeLeft] = useState(12);
  const [streak, setStreak] = useState(0);
  const [bestStreak, setBestStreak] = useState(0);

  const questions: Question[] = [
    {
      question: "What is 15 + 27?",
      options: ["40", "42", "45", "38"],
      correct: 1,
      difficulty: 'easy'
    },
    {
      question: "What is 8 × 7?",
      options: ["54", "56", "58", "52"],
      correct: 1,
      difficulty: 'easy'
    },
    {
      question: "What is 144 ÷ 12?",
      options: ["11", "12", "13", "14"],
      correct: 1,
      difficulty: 'medium'
    },
    {
      question: "What is 25% of 80?",
      options: ["15", "20", "25", "30"],
      correct: 1,
      difficulty: 'medium'
    },
    {
      question: "What is 9²?",
      options: ["72", "81", "90", "99"],
      correct: 1,
      difficulty: 'medium'
    },
    {
      question: "Solve: 3x + 7 = 22",
      options: ["x = 4", "x = 5", "x = 6", "x = 7"],
      correct: 1,
      difficulty: 'hard'
    },
    {
      question: "What is √64?",
      options: ["6", "7", "8", "9"],
      correct: 2,
      difficulty: 'medium'
    },
    {
      question: "What is 15% of 200?",
      options: ["25", "30", "35", "40"],
      correct: 1,
      difficulty: 'medium'
    }
  ];

  useEffect(() => {
    if (timeLeft > 0 && !showResult && !gameOver) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0 && !showResult) {
      handleAnswer(-1);
    }
  }, [timeLeft, showResult, gameOver]);

  const handleAnswer = (answerIndex: number) => {
    setSelectedAnswer(answerIndex);
    setShowResult(true);
    
    if (answerIndex === questions[currentQuestion].correct) {
      const points = questions[currentQuestion].difficulty === 'hard' ? 3 : 
                    questions[currentQuestion].difficulty === 'medium' ? 2 : 1;
      setScore(score + points);
      setStreak(streak + 1);
      if (streak + 1 > bestStreak) setBestStreak(streak + 1);
    } else {
      setStreak(0);
    }
  };

  const nextQuestion = () => {
    if (currentQuestion + 1 < questions.length) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer(null);
      setShowResult(false);
      setTimeLeft(12);
    } else {
      setGameOver(true);
    }
  };

  const resetGame = () => {
    setScore(0);
    setCurrentQuestion(0);
    setSelectedAnswer(null);
    setShowResult(false);
    setGameOver(false);
    setTimeLeft(12);
    setStreak(0);
  };

  const getDifficultyColor = (difficulty: string) => {
    switch(difficulty) {
      case 'easy': return 'bg-green-500';
      case 'medium': return 'bg-yellow-500';
      case 'hard': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getScoreRating = () => {
    const maxScore = questions.reduce((sum, q) => sum + (q.difficulty === 'hard' ? 3 : q.difficulty === 'medium' ? 2 : 1), 0);
    const percentage = (score / maxScore) * 100;
    if (percentage >= 90) return { text: 'Outstanding!', icon: Trophy, color: 'text-yellow-500' };
    if (percentage >= 80) return { text: 'Excellent!', icon: Star, color: 'text-blue-500' };
    if (percentage >= 70) return { text: 'Great Job!', icon: Zap, color: 'text-green-500' };
    return { text: 'Keep Practicing!', icon: Target, color: 'text-orange-500' };
  };

  if (gameOver) {
    const rating = getScoreRating();
    const Icon = rating.icon;
    const maxScore = questions.reduce((sum, q) => sum + (q.difficulty === 'hard' ? 3 : q.difficulty === 'medium' ? 2 : 1), 0);
    
    return (
      <Card className="max-w-3xl mx-auto p-8 text-center bg-gradient-to-br from-purple-50 to-blue-50 border-2 border-purple-200">
        <div className="mb-6">
          <Icon className={`w-16 h-16 mx-auto mb-4 ${rating.color}`} />
          <h2 className="text-4xl font-bold mb-2 bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
            {rating.text}
          </h2>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-xl p-4 shadow-lg">
            <div className="text-3xl font-bold text-green-600">{score}</div>
            <div className="text-sm text-gray-600">Total Points</div>
            <div className="text-xs text-gray-500">out of {maxScore}</div>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-lg">
            <div className="text-3xl font-bold text-blue-600">{bestStreak}</div>
            <div className="text-sm text-gray-600">Best Streak</div>
            <div className="text-xs text-gray-500">correct answers</div>
          </div>
          <div className="bg-white rounded-xl p-4 shadow-lg">
            <div className="text-3xl font-bold text-purple-600">{Math.round((score/maxScore)*100)}%</div>
            <div className="text-sm text-gray-600">Accuracy</div>
            <div className="text-xs text-gray-500">overall score</div>
          </div>
        </div>
        
        <Button onClick={resetGame} size="lg" className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700">
          🎮 Play Again
        </Button>
      </Card>
    );
  }

  return (
    <Card className="max-w-3xl mx-auto p-6 bg-gradient-to-br from-blue-50 to-purple-50 border-2 border-blue-200">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
          🧮 Math Challenge
        </h2>
        <div className="flex gap-3">
          <Badge variant="outline" className="text-lg px-3 py-1">
            {currentQuestion + 1}/{questions.length}
          </Badge>
          <Badge className={getDifficultyColor(questions[currentQuestion].difficulty) + " text-white text-lg px-3 py-1"}>
            {questions[currentQuestion].difficulty.toUpperCase()}
          </Badge>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-4">
        <div className="bg-white rounded-lg p-3 text-center shadow-md">
          <div className="text-xl font-bold text-green-600">{score}</div>
          <div className="text-xs text-gray-600">Points</div>
        </div>
        <div className="bg-white rounded-lg p-3 text-center shadow-md">
          <div className="text-xl font-bold text-blue-600">{streak}</div>
          <div className="text-xs text-gray-600">Streak</div>
        </div>
        <div className="bg-white rounded-lg p-3 text-center shadow-md">
          <div className="text-xl font-bold text-red-600">{timeLeft}s</div>
          <div className="text-xs text-gray-600">Time Left</div>
        </div>
      </div>

      <div className="mb-4">
        <Progress value={(timeLeft / 12) * 100} className="h-2" />
      </div>

      <div className="mb-8">
        <h3 className="text-xl font-semibold mb-6 text-center p-4 bg-white rounded-xl shadow-lg">
          {questions[currentQuestion].question}
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {questions[currentQuestion].options.map((option, index) => (
            <Button
              key={index}
              variant={
                showResult
                  ? index === questions[currentQuestion].correct
                    ? "default"
                    : selectedAnswer === index
                    ? "destructive"
                    : "outline"
                  : "outline"
              }
              className="h-16 text-lg font-semibold transition-all duration-200 hover:scale-105 shadow-md"
              onClick={() => handleAnswer(index)}
              disabled={showResult}
            >
              <span className="mr-2 text-2xl">{String.fromCharCode(65 + index)}</span>
              {option}
            </Button>
          ))}
        </div>
      </div>

      {showResult && (
        <div className="text-center bg-white rounded-xl p-6 shadow-lg">
          <div className="text-2xl mb-4">
            {selectedAnswer === questions[currentQuestion].correct ? (
              <div className="text-green-600 font-bold flex items-center justify-center gap-2">
                <span className="text-4xl">🎉</span>
                <span>Correct! +{questions[currentQuestion].difficulty === 'hard' ? 3 : questions[currentQuestion].difficulty === 'medium' ? 2 : 1} points</span>
              </div>
            ) : (
              <div className="text-red-600 font-bold flex items-center justify-center gap-2">
                <span className="text-4xl">😅</span>
                <span>Wrong! The answer was {questions[currentQuestion].options[questions[currentQuestion].correct]}</span>
              </div>
            )}
          </div>
          <Button onClick={nextQuestion} size="lg" className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
            {currentQuestion + 1 < questions.length ? "Next Question →" : "🏁 Finish Game"}
          </Button>
        </div>
      )}
    </Card>
  );
}