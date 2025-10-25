import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Trophy } from "lucide-react";
import { getUserAchievements, ACHIEVEMENTS, UserAchievement } from "@/services/achievementService";

interface BadgeDisplayProps {
  userId: string;
}

const BadgeDisplay = ({ userId }: BadgeDisplayProps) => {
  const [userAchievements, setUserAchievements] = useState<UserAchievement[]>([]);

  useEffect(() => {
    const loadAchievements = async () => {
      const achievements = await getUserAchievements(userId);
      setUserAchievements(achievements);
    };
    loadAchievements();
  }, [userId]);

  const earnedIds = userAchievements.map(ua => ua.achievementId);
  const earnedAchievements = ACHIEVEMENTS.filter(a => earnedIds.includes(a.id));
  
  // Only show non-secret locked achievements
  const lockedAchievements = ACHIEVEMENTS.filter(a =>
    !earnedIds.includes(a.id) && !a.isSecret
  );
  
  // Show secret achievements only if earned
  const secretAchievements = earnedAchievements.filter(a => a.isSecret);

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Trophy className="w-6 h-6 text-secondary" />
          Your Achievements
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {earnedAchievements.filter(a => !a.isSecret).map((achievement) => (
            <div
              key={achievement.id}
              className="flex flex-col items-center p-4 bg-secondary/10 rounded-lg border-2 border-secondary/30 hover:scale-105 transition-transform"
            >
              <div className="text-4xl mb-2">{achievement.icon}</div>
              <h4 className="font-semibold text-sm text-center">{achievement.name}</h4>
              <p className="text-xs text-muted-foreground text-center mt-1">
                {achievement.description}
              </p>
            </div>
          ))}
          {lockedAchievements.map((achievement) => (
            <div
              key={achievement.id}
              className="flex flex-col items-center p-4 bg-muted/20 rounded-lg border-2 border-muted opacity-50"
            >
              <div className="text-4xl mb-2 grayscale">{achievement.icon}</div>
              <h4 className="font-semibold text-sm text-center">{achievement.name}</h4>
              <p className="text-xs text-muted-foreground text-center mt-1">
                {achievement.description}
              </p>
            </div>
          ))}
        </div>
        
        {secretAchievements.length > 0 && (
          <div className="mt-6">
            <h3 className="font-bold text-lg mb-3 text-center">✨ Secret Achievements</h3>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
              {secretAchievements.map((achievement) => (
                <div
                  key={achievement.id}
                  className="flex flex-col items-center p-4 bg-gradient-to-br from-accent/20 to-primary/20 rounded-lg border-2 border-accent animate-pulse"
                  style={{ animation: "pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite" }}
                >
                  <div className="text-4xl mb-2">{achievement.icon}</div>
                  <h4 className="font-semibold text-sm text-center">{achievement.name}</h4>
                  <p className="text-xs text-muted-foreground text-center mt-1">
                    {achievement.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}
        {earnedAchievements.length === 0 && (
          <p className="text-center text-muted-foreground py-8">
            Complete games to earn achievements!
          </p>
        )}
      </CardContent>
    </Card>
  );
};

export default BadgeDisplay;
