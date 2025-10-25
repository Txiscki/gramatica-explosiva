import { Card } from "@/components/ui/card";
import { Trophy, Zap, Heart, CheckCircle } from "lucide-react";

interface GameStatsProps {
  score: number;
  streak: number;
  failsRemaining?: number;
  questionsAnswered?: number;
  totalQuestions?: number;
}

const GameStats = ({ score, streak, failsRemaining, questionsAnswered, totalQuestions }: GameStatsProps) => {
  return (
    <div className="flex gap-4 justify-center mb-6 flex-wrap">
      <Card className="px-6 py-3 flex items-center gap-3 shadow-md">
        <Trophy className="w-6 h-6 text-secondary" />
        <div>
          <p className="text-xs text-muted-foreground">Score</p>
          <p className="text-2xl font-bold text-foreground">{score}</p>
        </div>
      </Card>
      
      <Card className="px-6 py-3 flex items-center gap-3 shadow-md">
        <Zap className="w-6 h-6 text-accent" />
        <div>
          <p className="text-xs text-muted-foreground">Streak</p>
          <p className="text-2xl font-bold text-foreground">{streak}</p>
        </div>
      </Card>
      
      {failsRemaining !== undefined && (
        <Card className="px-6 py-3 flex items-center gap-3 shadow-md">
          <Heart className="w-6 h-6 text-destructive" />
          <div>
            <p className="text-xs text-muted-foreground">Lives</p>
            <p className="text-2xl font-bold text-foreground">{failsRemaining}</p>
          </div>
        </Card>
      )}
      
      {questionsAnswered !== undefined && totalQuestions !== undefined && (
        <Card className="px-6 py-3 flex items-center gap-3 shadow-md">
          <CheckCircle className="w-6 h-6 text-primary" />
          <div>
            <p className="text-xs text-muted-foreground">Progress</p>
            <p className="text-2xl font-bold text-foreground">{questionsAnswered}/{totalQuestions}</p>
          </div>
        </Card>
      )}
    </div>
  );
};

export default GameStats;
