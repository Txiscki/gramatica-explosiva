import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Question } from "@/types/game";

interface QuestionCardProps {
  question: Question;
  onAnswer: (isCorrect: boolean) => void;
  isPaused?: boolean;
}

const QuestionCard = ({ question, onAnswer, isPaused = false }: QuestionCardProps) => {
  const [userAnswer, setUserAnswer] = useState("");
  const [showFeedback, setShowFeedback] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [waitingForContinue, setWaitingForContinue] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Check if answer matches any accepted answer (case-insensitive, trimmed)
    const normalizedAnswer = userAnswer.toLowerCase().trim();
    const correct = question.answers.some(
      answer => answer.toLowerCase().trim() === normalizedAnswer
    );
    
    setIsCorrect(correct);
    setShowFeedback(true);

    if (correct) {
      // Auto-continue for correct answers
      setTimeout(() => {
        onAnswer(correct);
        setUserAnswer("");
        setShowFeedback(false);
        setWaitingForContinue(false);
      }, 1500);
    } else {
      // Wait for manual continue on wrong answers
      setWaitingForContinue(true);
    }
  };

  const handleContinue = () => {
    onAnswer(false);
    setUserAnswer("");
    setShowFeedback(false);
    setWaitingForContinue(false);
  };

  return (
    <Card className="w-full max-w-2xl shadow-lg border-2 animate-bounce-in">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-2xl">{question.question}</CardTitle>
          <Badge variant="secondary" className="text-sm">
            {question.category}
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <Input
            value={userAnswer}
            onChange={(e) => setUserAnswer(e.target.value)}
            placeholder="Type your answer..."
            className="text-lg h-14"
            disabled={showFeedback || isPaused}
            autoFocus
          />
          {!waitingForContinue ? (
            <Button
              type="submit"
              size="lg"
              className="w-full text-lg font-bold"
              disabled={!userAnswer.trim() || showFeedback || isPaused}
            >
              {showFeedback ? (isCorrect ? "Correct! ✓" : "Incorrect ✗") : "Submit Answer"}
            </Button>
          ) : (
            <Button
              type="button"
              size="lg"
              className="w-full text-lg font-bold"
              onClick={handleContinue}
            >
              Continue
            </Button>
          )}
        </form>

        {showFeedback && (
          <div
            className={`mt-4 p-4 rounded-lg text-center font-semibold text-lg ${
              isCorrect
                ? "bg-success/10 text-success border-2 border-success"
                : "bg-destructive/10 text-destructive border-2 border-destructive"
            }`}
          >
            {isCorrect ? "Excellent!" : (
              <div>
                <div className="mb-2">Incorrect!</div>
                <div className="text-base">
                  Correct answer{question.answers.length > 1 ? 's' : ''}: {question.answers.join(', ')}
                </div>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default QuestionCard;
