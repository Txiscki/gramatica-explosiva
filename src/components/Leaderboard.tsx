import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Trophy, Zap } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Difficulty } from "@/types/game";

interface LeaderboardEntry {
  displayName: string;
  score?: number;
  streak?: number;
  difficulty?: Difficulty;
}

interface LeaderboardProps {
  scores: LeaderboardEntry[];
  streaks: LeaderboardEntry[];
  difficulty?: Difficulty;
  showDifficulty?: boolean;
}

const Leaderboard = ({ scores, streaks, difficulty, showDifficulty = false }: LeaderboardProps) => {
  const difficultyColors = {
    a2: "bg-success",
    b1: "bg-secondary",
    b2: "bg-accent",
    c1: "bg-primary",
    c2: "bg-destructive"
  };

  const title = difficulty 
    ? `${difficulty.toUpperCase()} Level Leaderboards`
    : "Global Leaderboards";

  return (
    <div className="space-y-4">
      {difficulty && (
        <h2 className="text-2xl font-bold text-center">{title}</h2>
      )}
      <div className="grid md:grid-cols-2 gap-6 mt-6">
      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Trophy className="w-6 h-6 text-secondary" />
            Top Scores
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {scores.length === 0 ? (
              <p className="text-muted-foreground text-center py-4">No scores yet</p>
            ) : (
              scores.map((entry, index) => (
                <div
                  key={`${entry.displayName}-${index}`}
                  className="flex items-center justify-between p-3 bg-secondary/10 rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <span className="font-bold text-lg text-primary">#{index + 1}</span>
                    <div className="flex flex-col">
                      <span className="font-medium">{entry.displayName}</span>
                      {showDifficulty && entry.difficulty && (
                        <Badge className={`${difficultyColors[entry.difficulty]} text-xs mt-1`}>
                          {entry.difficulty.toUpperCase()}
                        </Badge>
                      )}
                    </div>
                  </div>
                  <span className="font-bold text-secondary">{entry.score}</span>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>

      <Card className="shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="w-6 h-6 text-accent" />
            Top Streaks
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {streaks.length === 0 ? (
              <p className="text-muted-foreground text-center py-4">No streaks yet</p>
            ) : (
              streaks.map((entry, index) => (
                <div
                  key={`${entry.displayName}-${index}`}
                  className="flex items-center justify-between p-3 bg-accent/10 rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <span className="font-bold text-lg text-primary">#{index + 1}</span>
                    <div className="flex flex-col">
                      <span className="font-medium">{entry.displayName}</span>
                      {showDifficulty && entry.difficulty && (
                        <Badge className={`${difficultyColors[entry.difficulty]} text-xs mt-1`}>
                          {entry.difficulty.toUpperCase()}
                        </Badge>
                      )}
                    </div>
                  </div>
                  <span className="font-bold text-accent">{entry.streak}</span>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
    </div>
  );
};

export default Leaderboard;
