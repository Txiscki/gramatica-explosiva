import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Question } from "@/types/game";

interface QuestionCardProps {
  question: Question;
  onAnswer: (isCorrect: boolean) => void;
}

const QuestionCard = ({ question, onAnswer }: QuestionCardProps) => {
  const [userAnswer, setUserAnswer] = useState("");
  const [showFeedback, setShowFeedback] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const correct = userAnswer.toLowerCase().trim() === question.answer.toLowerCase().trim();
    setIsCorrect(correct);
    setShowFeedback(true);

    setTimeout(() => {
      onAnswer(correct);
      setUserAnswer("");
      setShowFeedback(false);
    }, 1500);
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
            disabled={showFeedback}
            autoFocus
          />
          <Button
            type="submit"
            size="lg"
            className="w-full text-lg font-bold"
            disabled={!userAnswer.trim() || showFeedback}
          >
            {showFeedback ? (isCorrect ? "Correct! ✓" : "Incorrect ✗") : "Submit Answer"}
          </Button>
        </form>

        {showFeedback && (
          <div
            className={`mt-4 p-4 rounded-lg text-center font-semibold text-lg ${
              isCorrect
                ? "bg-success/10 text-success border-2 border-success"
                : "bg-destructive/10 text-destructive border-2 border-destructive"
            }`}
          >
            {isCorrect ? "Excellent!" : `The correct answer was: ${question.answer}`}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default QuestionCard;
