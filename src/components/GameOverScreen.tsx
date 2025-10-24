import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Trophy, RotateCcw } from "lucide-react";
import Leaderboard from "@/components/Leaderboard";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { saveGameSession, getTopScoresByLevel, getTopStreaksByLevel, GameSession } from "@/services/gameSessionService";
import { checkAndAwardAchievements, Achievement } from "@/services/achievementService";
import { getUserSessions } from "@/services/gameSessionService";
import { Difficulty } from "@/types/game";

interface GameOverScreenProps {
  score: number;
  maxStreak: number;
  difficulty: Difficulty;
  totalQuestions: number;
  correctAnswers: number;
  wrongAnswers: number;
  completionTimeSeconds: number;
  isPerfectGame: boolean;
  hadComeback: boolean;
  onRestart: () => void;
}

const GameOverScreen = ({ 
  score, 
  maxStreak, 
  difficulty, 
  totalQuestions, 
  correctAnswers, 
  wrongAnswers,
  completionTimeSeconds,
  isPerfectGame,
  hadComeback,
  onRestart 
}: GameOverScreenProps) => {
  const { toast } = useToast();
  const { user, userProfile } = useAuth();
  const [isSaving, setIsSaving] = useState(false);
  const [scoreSaved, setScoreSaved] = useState(false);
  const [topScores, setTopScores] = useState<GameSession[]>([]);
  const [topStreaks, setTopStreaks] = useState<GameSession[]>([]);
  const [newAchievements, setNewAchievements] = useState<Achievement[]>([]);

  useEffect(() => {
    const saveAndLoadData = async () => {
      if (user && userProfile && !scoreSaved) {
        setIsSaving(true);
        try {
          // Save game session with detailed stats
          await saveGameSession({
            userId: user.uid,
            displayName: userProfile.displayName,
            difficulty,
            score,
            streak: maxStreak,
            timestamp: Date.now(),
            totalQuestions,
            correctAnswers,
            wrongAnswers,
            completionTimeSeconds,
            isPerfectGame,
            hadComeback
          });

          // Get user sessions to calculate total correct answers
          const userSessions = await getUserSessions(user.uid);
          const totalCorrectAnswersAllTime = userSessions.reduce(
            (sum, session) => sum + (session.correctAnswers || 0), 
            correctAnswers
          );

          // Check for achievements with new parameters
          const achievements = await checkAndAwardAchievements(
            user.uid,
            score,
            maxStreak,
            userSessions.length,
            isPerfectGame,
            completionTimeSeconds,
            hadComeback,
            totalCorrectAnswersAllTime
          );

          if (achievements.length > 0) {
            setNewAchievements(achievements);
            toast({
              title: "🎉 New Achievement!",
              description: `You earned: ${achievements.map(a => a.name).join(", ")}`,
              duration: 5000,
            });
          }

          setScoreSaved(true);
          toast({
            title: "Score saved!",
            description: "Your score has been recorded",
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
      }

      // Load leaderboards
      const [scores, streaks] = await Promise.all([
        getTopScoresByLevel(difficulty, 10),
        getTopStreaksByLevel(difficulty, 10)
      ]);
      setTopScores(scores);
      setTopStreaks(streaks);
    };

    saveAndLoadData();
  }, [user, userProfile, score, maxStreak, difficulty, scoreSaved, totalQuestions, correctAnswers, wrongAnswers, completionTimeSeconds, isPerfectGame, hadComeback]);

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

          {isSaving && (
            <div className="mb-6 p-4 bg-primary/10 text-primary border-2 border-primary rounded-lg text-center font-semibold">
              Saving your score...
            </div>
          )}

          {scoreSaved && (
            <div className="mb-6 p-4 bg-success/10 text-success border-2 border-success rounded-lg text-center font-semibold">
              Score saved successfully!
            </div>
          )}

          {newAchievements.length > 0 && (
            <div className="mb-6 space-y-2">
              <h3 className="font-bold text-lg text-center">🎉 New Achievements!</h3>
              <div className="grid grid-cols-2 gap-2">
                {newAchievements.map((achievement) => (
                  <div
                    key={achievement.id}
                    className="flex items-center gap-2 p-3 bg-secondary/10 rounded-lg border-2 border-secondary"
                  >
                    <span className="text-2xl">{achievement.icon}</span>
                    <div>
                      <p className="font-semibold text-sm">{achievement.name}</p>
                      <p className="text-xs text-muted-foreground">{achievement.description}</p>
                    </div>
                  </div>
                ))}
              </div>
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

          <Leaderboard 
            scores={topScores} 
            streaks={topStreaks} 
            difficulty={difficulty}
          />
        </CardContent>
      </Card>
    </div>
  );
};

export default GameOverScreen;
