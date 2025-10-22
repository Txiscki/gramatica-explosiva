import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import bombImage from "@/assets/bomb.png";
import { Difficulty } from "@/types/game";

interface StartScreenProps {
  onStart: (difficulty: Difficulty) => void;
}

const StartScreen = ({ onStart }: StartScreenProps) => {
  const [selectedDifficulty, setSelectedDifficulty] = useState<Difficulty>("medium");

  const difficulties = [
    { value: "easy" as Difficulty, label: "Easy", ages: "Ages 4-8", color: "bg-success" },
    { value: "medium" as Difficulty, label: "Medium", ages: "Ages 9-13", color: "bg-secondary" },
    { value: "hard" as Difficulty, label: "Hard", ages: "Ages 14-18", color: "bg-destructive" },
  ];

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="max-w-2xl w-full shadow-2xl border-2 animate-bounce-in">
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
            Answer the questions before the bomb explodes!
          </CardDescription>
        </CardHeader>
        <CardContent className="pt-8">
          <div className="space-y-6 mb-8">
            <div className="bg-muted p-4 rounded-lg">
              <h3 className="font-semibold text-lg mb-2">📚 How to play:</h3>
              <ul className="space-y-2 text-muted-foreground">
                <li>• Answer English grammar questions</li>
                <li>• You have 20 seconds per question</li>
                <li>• Each correct answer earns points</li>
                <li>• Build streaks for bonus points!</li>
              </ul>
            </div>

            <div>
              <h3 className="font-semibold text-lg mb-4 text-center">Choose Your Difficulty:</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {difficulties.map((diff) => (
                  <button
                    key={diff.value}
                    onClick={() => setSelectedDifficulty(diff.value)}
                    className={`p-4 rounded-lg border-2 transition-all duration-200 ${
                      selectedDifficulty === diff.value
                        ? "border-primary scale-105 shadow-lg"
                        : "border-border hover:border-primary/50"
                    }`}
                  >
                    <Badge className={`${diff.color} text-white mb-2`}>
                      {diff.label}
                    </Badge>
                    <p className="text-sm text-muted-foreground">{diff.ages}</p>
                  </button>
                ))}
              </div>
            </div>
          </div>
          
          <Button
            onClick={() => onStart(selectedDifficulty)}
            size="lg"
            className="w-full text-xl font-bold h-16 shadow-lg hover:scale-105 transition-transform"
          >
            Start Playing!
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default StartScreen;
