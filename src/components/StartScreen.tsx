import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { LogOut, LayoutDashboard, Infinity, Trophy, Award, Sparkles } from "lucide-react";
import bombImage from "@/assets/bomb.png";
import { Difficulty } from "@/types/game";
import { useAuth } from "@/contexts/AuthContext";
import { signOut } from "@/services/authService";
import BadgeDisplay from "./BadgeDisplay";
import Footer from "./Footer";
import LinkToTeacherDialog from "./LinkToTeacherDialog";
import { getInfiniteModeProgress } from "@/services/infiniteModeService";
import { getWordBuilderProgress } from "@/services/wordBuilderService";

interface StartScreenProps {
  onStart: (difficulty: Difficulty, isInfiniteMode?: boolean) => void;
}

const StartScreen = ({ onStart }: StartScreenProps) => {
  const navigate = useNavigate();
  const { user, userRole } = useAuth();
  const [selectedDifficulty, setSelectedDifficulty] = useState<Difficulty>("b1");
  const [infiniteUnlocked, setInfiniteUnlocked] = useState(false);
  const [wordBuilderFreeUnlocked, setWordBuilderFreeUnlocked] = useState(false);

  useEffect(() => {
    const checkModes = async () => {
      if (user && selectedDifficulty) {
        // Teachers always have all modes unlocked
        if (userRole === "teacher") {
          setInfiniteUnlocked(true);
          setWordBuilderFreeUnlocked(true);
          return;
        }
        
        const [infiniteProgress, wordBuilderProgress] = await Promise.all([
          getInfiniteModeProgress(user.uid, selectedDifficulty),
          getWordBuilderProgress(user.uid, selectedDifficulty)
        ]);
        
        setInfiniteUnlocked(infiniteProgress.unlocked);
        setWordBuilderFreeUnlocked(wordBuilderProgress.freeUnlocked);
      }
    };
    checkModes();
  }, [user, selectedDifficulty, userRole]);

  const handleSignOut = async () => {
    await signOut();
    navigate("/auth");
  };

  const difficulties = [
    { 
      value: "a2" as Difficulty, 
      label: "A2 Key", 
      exam: "KET", 
      color: "bg-success",
      description: "Elementary"
    },
    { 
      value: "b1" as Difficulty, 
      label: "B1 Preliminary", 
      exam: "PET", 
      color: "bg-secondary",
      description: "Intermediate"
    },
    { 
      value: "b2" as Difficulty, 
      label: "B2 First", 
      exam: "FCE", 
      color: "bg-accent",
      description: "Upper Intermediate"
    },
    { 
      value: "c1" as Difficulty, 
      label: "C1 Advanced", 
      exam: "CAE", 
      color: "bg-primary",
      description: "Advanced"
    },
    { 
      value: "c2" as Difficulty, 
      label: "C2 Proficiency", 
      exam: "CPE", 
      color: "bg-destructive",
      description: "Proficiency"
    },
  ];

  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex-1 p-4">
        <div className="max-w-6xl mx-auto space-y-6">
        {user && (
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold">Welcome back!</h2>
              <p className="text-muted-foreground">Role: {userRole}</p>
            </div>
            <div className="flex gap-2 flex-wrap">
              <Button onClick={() => navigate("/leaderboard")} variant="outline" size="sm">
                <Trophy className="w-4 h-4 mr-2" />
                Leaderboard
              </Button>
              <Button onClick={() => navigate("/achievements")} variant="outline" size="sm">
                <Award className="w-4 h-4 mr-2" />
                Achievements
              </Button>
              {userRole === "teacher" && (
                <Button onClick={() => navigate("/teacher-dashboard")} variant="outline" size="sm">
                  <LayoutDashboard className="w-4 h-4 mr-2" />
                  Dashboard
                </Button>
              )}
              {userRole === "student" && user && (
                <LinkToTeacherDialog studentId={user.uid} />
              )}
              <Button onClick={handleSignOut} variant="outline" size="sm">
                <LogOut className="w-4 h-4 mr-2" />
                Sign Out
              </Button>
            </div>
          </div>
        )}

        {user && <BadgeDisplay userId={user.uid} />}

      <Card className="w-full shadow-2xl border-2 animate-bounce-in">
        <CardHeader className="text-center pb-0">
          <img
            src={bombImage}
            alt="The Grammar Bomb"
            className="w-48 h-48 mx-auto mb-6 drop-shadow-2xl"
          />
          <CardTitle className="text-5xl font-bold mb-2 bg-gradient-to-r from-primary to-destructive bg-clip-text text-transparent">
            The Grammar Bomb!
          </CardTitle>
          <CardDescription className="text-xl mt-4">
            Cambridge English Exam Preparation
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-8">
          <div className="space-y-6 mb-8">
            <div className="bg-muted p-4 rounded-lg">
              <h3 className="font-semibold text-lg mb-2">📚 How to play:</h3>
              <ul className="space-y-2 text-muted-foreground">
                <li>• Answer questions based on Cambridge exam levels</li>
                <li>• You have 20 seconds per question</li>
                <li>• Each correct answer earns points</li>
                <li>• Build streaks for bonus points!</li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold text-lg mb-4 text-center">Choose Your Cambridge Level:</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
                {difficulties.map((diff) => (
                  <button
                    key={diff.value}
                    onClick={() => setSelectedDifficulty(diff.value)}
                    className={`p-4 rounded-lg border-2 transition-all duration-200 hover:scale-105 ${
                      selectedDifficulty === diff.value
                        ? "border-primary scale-105 shadow-lg ring-2 ring-primary/50"
                        : "border-border hover:border-primary/50"
                    }`}
                  >
                    <Badge className={`${diff.color} text-white mb-2 w-full justify-center`}>
                      {diff.label}
                    </Badge>
                    <p className="text-xs text-muted-foreground font-semibold">{diff.exam}</p>
                    <p className="text-xs text-muted-foreground mt-1">{diff.description}</p>
                  </button>
                ))}
              </div>
            </div>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <Button
              onClick={() => onStart(selectedDifficulty, false)}
              size="lg"
              className="w-full text-xl font-bold h-16 shadow-lg hover:scale-105 transition-transform"
            >
              Start Normal Mode (20 Questions)
            </Button>
            
            {infiniteUnlocked ? (
              <Button
                onClick={() => onStart(selectedDifficulty, true)}
                size="lg"
                variant="secondary"
                className="w-full text-xl font-bold h-16 shadow-lg hover:scale-105 transition-transform"
              >
                <Infinity className="w-6 h-6 mr-2" />
                Infinite Mode
              </Button>
            ) : (
              <Button
                size="lg"
                variant="outline"
                disabled
                className="w-full text-xl font-bold h-16 opacity-50 cursor-not-allowed"
              >
                <span className="text-2xl mr-2">🔒</span>
                Locked: Complete 10 runs
              </Button>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Button
              onClick={() => navigate("/word-builder", { state: { difficulty: selectedDifficulty, mode: "classroom" } })}
              size="lg"
              variant="outline"
              className="w-full text-lg font-bold h-14 shadow-lg hover:scale-105 transition-transform"
            >
              <Sparkles className="w-5 h-5 mr-2" />
              Word Builder (Classroom)
            </Button>
            
            {wordBuilderFreeUnlocked ? (
              <Button
                onClick={() => navigate("/word-builder", { state: { difficulty: selectedDifficulty, mode: "free" } })}
                size="lg"
                variant="outline"
                className="w-full text-lg font-bold h-14 shadow-lg hover:scale-105 transition-transform"
              >
                <Sparkles className="w-5 h-5 mr-2" />
                Word Builder (Free Mode)
              </Button>
            ) : (
              <Button
                size="lg"
                variant="outline"
                disabled
                className="w-full text-lg font-bold h-14 opacity-50 cursor-not-allowed"
              >
                <span className="text-xl mr-2">🔒</span>
                Free Mode: 10 Classroom Runs
              </Button>
            )}
          </div>
          
        </CardContent>
      </Card>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default StartScreen;
