import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Trophy, RotateCcw } from "lucide-react";
import { saveHighScore, saveHighStreak, getTopScores, getTopStreaks, LeaderboardEntry } from "@/services/leaderboardService";
import Leaderboard from "@/components/Leaderboard";
import { useToast } from "@/hooks/use-toast";

interface GameOverScreenProps {
  score: number;
  maxStreak: number;
  onRestart: () => void;
}

const GameOverScreen = ({ score, maxStreak, onRestart }: GameOverScreenProps) => {
  const { toast } = useToast();
  const [playerName, setPlayerName] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [scoreSaved, setScoreSaved] = useState(false);
  const [topScores, setTopScores] = useState<LeaderboardEntry[]>([]);
  const [topStreaks, setTopStreaks] = useState<LeaderboardEntry[]>([]);

  useEffect(() => {
    loadLeaderboards();
  }, []);

  const loadLeaderboards = async () => {
    const scores = await getTopScores(10);
    const streaks = await getTopStreaks(10);
    setTopScores(scores);
    setTopStreaks(streaks);
  };

  const handleSaveScore = async () => {
    if (!playerName.trim()) {
      toast({
        title: "Name required",
        description: "Please enter your name to save your score",
        variant: "destructive",
      });
      return;
    }

    setIsSaving(true);
    try {
      await Promise.all([
        saveHighScore(playerName.trim(), score),
        saveHighStreak(playerName.trim(), maxStreak)
      ]);
      
      setScoreSaved(true);
      await loadLeaderboards();
      
      toast({
        title: "Score saved!",
        description: "Your score has been added to the leaderboard",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save score. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  const getMessage = () => {
    if (score >= 50) return "You're a grammar master!";
    if (score >= 30) return "Great job! Keep practicing";
    if (score >= 10) return "Good try! You can do better";
    return "Keep trying!";
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="max-w-2xl w-full shadow-2xl border-2 animate-bounce-in">
        <CardHeader className="text-center">
          <div className="w-32 h-32 mx-auto mb-6 bg-gradient-to-br from-secondary to-accent rounded-full flex items-center justify-center shadow-xl">
            <Trophy className="w-16 h-16 text-white" />
          </div>
          <CardTitle className="text-4xl font-bold mb-2">
            Game Over!
          </CardTitle>
          <CardDescription className="text-2xl mt-2 font-semibold text-foreground">
            {getMessage()}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid md:grid-cols-2 gap-4 mb-6">
            <div className="bg-gradient-to-br from-primary/10 to-accent/10 p-6 rounded-xl text-center border-2 border-primary/20">
              <p className="text-muted-foreground text-sm mb-1">Final Score</p>
              <p className="text-4xl font-bold text-primary">{score}</p>
            </div>
            <div className="bg-gradient-to-br from-accent/10 to-primary/10 p-6 rounded-xl text-center border-2 border-accent/20">
              <p className="text-muted-foreground text-sm mb-1">Max Streak</p>
              <p className="text-4xl font-bold text-accent">{maxStreak}</p>
            </div>
          </div>

          {!scoreSaved ? (
            <div className="space-y-4 mb-6">
              <div className="space-y-2">
                <Input
                  value={playerName}
                  onChange={(e) => setPlayerName(e.target.value)}
                  placeholder="Enter your name"
                  className="text-lg h-12"
                  maxLength={20}
                  disabled={isSaving}
                />
              </div>
              <Button
                onClick={handleSaveScore}
                size="lg"
                className="w-full text-lg font-bold h-12"
                disabled={isSaving}
              >
                {isSaving ? "Saving..." : "Save to Leaderboard"}
              </Button>
            </div>
          ) : (
            <div className="mb-6 p-4 bg-success/10 text-success border-2 border-success rounded-lg text-center font-semibold">
              Score saved successfully!
            </div>
          )}

          <Button
            onClick={onRestart}
            size="lg"
            variant="outline"
            className="w-full text-xl font-bold h-16 shadow-lg hover:scale-105 transition-transform"
          >
            <RotateCcw className="w-6 h-6 mr-2" />
            Play Again
          </Button>

          <Leaderboard scores={topScores} streaks={topStreaks} />
        </CardContent>
      </Card>
    </div>
  );
};

export default GameOverScreen;
