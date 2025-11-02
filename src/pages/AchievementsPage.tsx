import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Lock, Trophy } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { getUserAchievements } from "@/services/achievementService";
import { ACHIEVEMENTS } from "@/services/achievementService";
import Footer from "@/components/Footer";

const AchievementsPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [earnedAchievements, setEarnedAchievements] = useState<Set<string>>(new Set());
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadAchievements = async () => {
      if (!user) {
        navigate("/auth");
        return;
      }

      try {
        const achievements = await getUserAchievements(user.uid);
        setEarnedAchievements(new Set(achievements.map(a => a.achievementId)));
      } catch (error) {
        console.error("Error loading achievements:", error);
      } finally {
        setLoading(false);
      }
    };

    loadAchievements();
  }, [user, navigate]);

  const normalAchievements = ACHIEVEMENTS.filter(a => !a.isSecret);
  const secretAchievements = ACHIEVEMENTS.filter(a => a.isSecret);

  const renderAchievement = (achievement: typeof ACHIEVEMENTS[0], isEarned: boolean) => {
    const isSecret = achievement.isSecret && !isEarned;

    return (
      <Card 
        key={achievement.id}
        className={`transition-all duration-300 ${
          isEarned 
            ? "bg-gradient-to-br from-primary/10 to-secondary/10 border-primary/50 animate-fade-in" 
            : "opacity-60"
        }`}
      >
        <CardHeader>
          <CardTitle className="flex items-center gap-3">
            <div className={`text-4xl ${isEarned ? "animate-bounce-in" : ""}`}>
              {isSecret ? "❓" : achievement.icon}
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-2">
                <span>{isSecret ? "???" : achievement.name}</span>
                {isEarned && (
                  <Badge className="bg-success text-success-foreground">
                    <Trophy className="w-3 h-3 mr-1" />
                    Unlocked
                  </Badge>
                )}
                {!isEarned && !isSecret && (
                  <Lock className="w-4 h-4 text-muted-foreground" />
                )}
              </div>
              <CardDescription className="mt-1">
                {isSecret ? "Complete secret requirements to unlock" : achievement.description}
              </CardDescription>
            </div>
          </CardTitle>
        </CardHeader>
        {!isSecret && achievement.requirement && (
          <CardContent>
            <p className="text-sm text-muted-foreground">
              <strong>Requirement:</strong> {achievement.requirement}
            </p>
          </CardContent>
        )}
      </Card>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-lg">Loading achievements...</p>
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
                🏅 Achievements
              </h1>
              <p className="text-muted-foreground">
                {earnedAchievements.size} / {ACHIEVEMENTS.length} unlocked
              </p>
            </div>
          </div>

          <div className="space-y-8">
            <div>
              <h2 className="text-2xl font-bold mb-4">Main Achievements</h2>
              <div className="grid gap-4">
                {normalAchievements.map(achievement => 
                  renderAchievement(achievement, earnedAchievements.has(achievement.id))
                )}
              </div>
            </div>

            {secretAchievements.length > 0 && (
              <div>
                <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
                  🌟 Secret Achievements
                </h2>
                <div className="grid gap-4">
                  {secretAchievements.map(achievement => 
                    renderAchievement(achievement, earnedAchievements.has(achievement.id))
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default AchievementsPage;
