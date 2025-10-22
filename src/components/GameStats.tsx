import { Card } from "@/components/ui/card";
import { Trophy, Zap } from "lucide-react";

interface GameStatsProps {
  score: number;
  streak: number;
}

const GameStats = ({ score, streak }: GameStatsProps) => {
  return (
    <div className="flex gap-4 justify-center mb-6">
      <Card className="px-6 py-3 flex items-center gap-3 shadow-md">
        <Trophy className="w-6 h-6 text-secondary" />
        <div>
          <p className="text-xs text-muted-foreground">Puntos</p>
          <p className="text-2xl font-bold text-foreground">{score}</p>
        </div>
      </Card>
      
      <Card className="px-6 py-3 flex items-center gap-3 shadow-md">
        <Zap className="w-6 h-6 text-accent" />
        <div>
          <p className="text-xs text-muted-foreground">Racha</p>
          <p className="text-2xl font-bold text-foreground">{streak}</p>
        </div>
      </Card>
    </div>
  );
};

export default GameStats;
