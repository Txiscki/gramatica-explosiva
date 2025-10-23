import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Trophy, Zap } from "lucide-react";
import { LeaderboardEntry } from "@/services/leaderboardService";

interface LeaderboardProps {
  scores: LeaderboardEntry[];
  streaks: LeaderboardEntry[];
}

const Leaderboard = ({ scores, streaks }: LeaderboardProps) => {
  return (
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
                  key={`${entry.name}-${entry.timestamp}`}
                  className="flex items-center justify-between p-3 bg-secondary/10 rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <span className="font-bold text-lg text-primary">#{index + 1}</span>
                    <span className="font-medium">{entry.name}</span>
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
                  key={`${entry.name}-${entry.timestamp}`}
                  className="flex items-center justify-between p-3 bg-accent/10 rounded-lg"
                >
                  <div className="flex items-center gap-3">
                    <span className="font-bold text-lg text-primary">#{index + 1}</span>
                    <span className="font-medium">{entry.name}</span>
                  </div>
                  <span className="font-bold text-accent">{entry.streak}</span>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Leaderboard;
