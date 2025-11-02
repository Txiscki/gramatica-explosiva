import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Trophy, TrendingUp } from "lucide-react";
import { getTopScoresByLevel, getTopStreaksByLevel } from "@/services/gameSessionService";
import { Difficulty } from "@/types/game";
import Footer from "@/components/Footer";

interface LeaderboardEntry {
  displayName: string;
  score?: number;
  streak?: number;
  difficulty: Difficulty;
}

const LeaderboardPage = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [leaderboards, setLeaderboards] = useState<Record<Difficulty, { scores: LeaderboardEntry[], streaks: LeaderboardEntry[] }>>({
    a2: { scores: [], streaks: [] },
    b1: { scores: [], streaks: [] },
    b2: { scores: [], streaks: [] },
    c1: { scores: [], streaks: [] },
    c2: { scores: [], streaks: [] },
  });

  useEffect(() => {
    const loadLeaderboards = async () => {
      try {
        const difficulties: Difficulty[] = ["a2", "b1", "b2", "c1", "c2"];
        const results: Record<Difficulty, { scores: LeaderboardEntry[], streaks: LeaderboardEntry[] }> = {} as any;

        for (const difficulty of difficulties) {
          const [scores, streaks] = await Promise.all([
            getTopScoresByLevel(difficulty, 10),
            getTopStreaksByLevel(difficulty, 10),
          ]);

          results[difficulty] = {
            scores: scores.map(s => ({ ...s, difficulty })),
            streaks: streaks.map(s => ({ ...s, difficulty })),
          };
        }

        setLeaderboards(results);
      } catch (error) {
        console.error("Error loading leaderboards:", error);
      } finally {
        setLoading(false);
      }
    };

    loadLeaderboards();
  }, []);

  const difficultyColors: Record<Difficulty, string> = {
    a2: "bg-success",
    b1: "bg-secondary",
    b2: "bg-accent",
    c1: "bg-primary",
    c2: "bg-destructive"
  };

  const renderLeaderboard = (entries: LeaderboardEntry[], type: "score" | "streak") => {
    if (entries.length === 0) {
      return (
        <div className="text-center text-muted-foreground py-8">
          No entries yet. Be the first!
        </div>
      );
    }

    return (
      <div className="space-y-2">
        {entries.map((entry, index) => (
          <div
            key={index}
            className={`flex items-center gap-4 p-4 rounded-lg transition-colors ${
              index === 0 ? "bg-primary/10 border-2 border-primary" :
              index === 1 ? "bg-secondary/10 border-2 border-secondary" :
              index === 2 ? "bg-accent/10 border-2 border-accent" :
              "bg-muted/50"
            }`}
          >
            <div className={`flex items-center justify-center w-12 h-12 rounded-full font-bold text-lg ${
              index === 0 ? "bg-primary text-primary-foreground" :
              index === 1 ? "bg-secondary text-secondary-foreground" :
              index === 2 ? "bg-accent text-accent-foreground" :
              "bg-muted text-muted-foreground"
            }`}>
              {index === 0 ? "🥇" : index === 1 ? "🥈" : index === 2 ? "🥉" : index + 1}
            </div>
            <div className="flex-1">
              <p className="font-semibold text-lg">{entry.displayName}</p>
            </div>
            <div className="flex items-center gap-2">
              {type === "score" ? (
                <>
                  <Trophy className="w-5 h-5 text-secondary" />
                  <span className="font-bold text-xl">{entry.score}</span>
                </>
              ) : (
                <>
                  <TrendingUp className="w-5 h-5 text-accent" />
                  <span className="font-bold text-xl">{entry.streak}</span>
                </>
              )}
            </div>
          </div>
        ))}
      </div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-lg">Loading leaderboards...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex-1 p-4 md:p-8">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center gap-4 mb-8">
            <Button variant="outline" onClick={() => navigate("/")}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
            <div>
              <h1 className="text-4xl font-bold flex items-center gap-2">
                <Trophy className="w-10 h-10 text-primary" />
                Leaderboards
              </h1>
              <p className="text-muted-foreground">Top 10 players by level</p>
            </div>
          </div>

          <Tabs defaultValue="a2" className="space-y-4">
            <TabsList className="grid grid-cols-5 w-full">
              <TabsTrigger value="a2">A2</TabsTrigger>
              <TabsTrigger value="b1">B1</TabsTrigger>
              <TabsTrigger value="b2">B2</TabsTrigger>
              <TabsTrigger value="c1">C1</TabsTrigger>
              <TabsTrigger value="c2">C2</TabsTrigger>
            </TabsList>

            {(["a2", "b1", "b2", "c1", "c2"] as Difficulty[]).map((difficulty) => (
              <TabsContent key={difficulty} value={difficulty} className="space-y-4">
                <div className="grid md:grid-cols-2 gap-4">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Trophy className="w-5 h-5" />
                        Top Scores
                      </CardTitle>
                      <CardDescription>
                        Highest scores for{" "}
                        <Badge className={difficultyColors[difficulty]}>
                          {difficulty.toUpperCase()}
                        </Badge>
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      {renderLeaderboard(leaderboards[difficulty].scores, "score")}
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <TrendingUp className="w-5 h-5" />
                        Top Streaks
                      </CardTitle>
                      <CardDescription>
                        Longest streaks for{" "}
                        <Badge className={difficultyColors[difficulty]}>
                          {difficulty.toUpperCase()}
                        </Badge>
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      {renderLeaderboard(leaderboards[difficulty].streaks, "streak")}
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
            ))}
          </Tabs>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default LeaderboardPage;
