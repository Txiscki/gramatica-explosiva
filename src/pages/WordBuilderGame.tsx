import { useState, useEffect, useCallback } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Check, X, Sparkles } from "lucide-react";
import { Difficulty } from "@/types/game";
import { wordSets } from "@/data/wordBuilderSets";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import { saveWordBuilderSession, incrementClassroomRuns } from "@/services/wordBuilderService";
import Footer from "@/components/Footer";

const WordBuilderGame = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const { toast } = useToast();
  
  const { difficulty, mode } = location.state as { difficulty: Difficulty; mode: "classroom" | "free" };
  
  const [currentSet, setCurrentSet] = useState(wordSets.find(s => s.difficulty === difficulty) || wordSets[0]);
  const [currentWord, setCurrentWord] = useState("");
  const [foundWords, setFoundWords] = useState<string[]>([]);
  const [score, setScore] = useState(0);
  const [attempts, setAttempts] = useState(0);
  const [gameComplete, setGameComplete] = useState(false);
  const [feedback, setFeedback] = useState<{ message: string; type: "success" | "error" } | null>(null);

  useEffect(() => {
    // Get a random word set for the selected difficulty
    const setsForDifficulty = wordSets.filter(s => s.difficulty === difficulty);
    const randomSet = setsForDifficulty[Math.floor(Math.random() * setsForDifficulty.length)];
    setCurrentSet(randomSet);
  }, [difficulty]);

  const calculateScore = (word: string): number => {
    if (word.length === 3) return 5;
    if (word.length === 4) return 10;
    return 20;
  };

  const handleSubmit = useCallback(() => {
    const upperWord = currentWord.toUpperCase();
    
    if (upperWord.length < 3) {
      setFeedback({ message: "Word must be at least 3 letters!", type: "error" });
      return;
    }

    // Check if letters are valid
    const letterCount: Record<string, number> = {};
    for (const char of currentSet.letters) {
      letterCount[char] = (letterCount[char] || 0) + 1;
    }
    
    for (const char of upperWord) {
      if (!letterCount[char] || letterCount[char] === 0) {
        setFeedback({ message: "Use only the given letters!", type: "error" });
        return;
      }
      letterCount[char]--;
    }

    if (foundWords.includes(upperWord)) {
      setFeedback({ message: "Already found that word!", type: "error" });
      return;
    }

    if (mode === "classroom") {
      // Classroom mode: only target word is correct
      setAttempts(prev => prev + 1);
      
      if (upperWord === currentSet.targetWord) {
        setFoundWords([upperWord]);
        setScore(50);
        setFeedback({ message: `Perfect! You found "${currentSet.targetWord}"!`, type: "success" });
        setGameComplete(true);
        
        if (user) {
          saveWordBuilderSession({
            userId: user.uid,
            displayName: user.displayName || "Player",
            difficulty,
            mode: "classroom",
            score: 50,
            wordsFound: 1,
            timestamp: Date.now()
          });
          incrementClassroomRuns(user.uid, difficulty);
        }
      } else {
        setFeedback({ message: "Not the target word. Try again!", type: "error" });
      }
    } else {
      // Free mode: any valid word counts
      if (currentSet.validWords.includes(upperWord)) {
        const points = calculateScore(upperWord);
        setFoundWords(prev => [...prev, upperWord]);
        setScore(prev => prev + points);
        setFeedback({ message: `+${points} points!`, type: "success" });
        
        // Check if all words found (secret achievement)
        const allFound = currentSet.validWords.every(w => 
          [...foundWords, upperWord].includes(w)
        );
        
        if (allFound) {
          toast({
            title: "🎉 Perfect!",
            description: "You found ALL possible words!",
          });
          
          if (user) {
            saveWordBuilderSession({
              userId: user.uid,
              displayName: user.displayName || "Player",
              difficulty,
              mode: "free",
              score: score + points,
              wordsFound: foundWords.length + 1,
              timestamp: Date.now(),
              allWordsFound: true
            });
          }
        }
      } else {
        setFeedback({ message: "Not a valid word!", type: "error" });
      }
    }
    
    setCurrentWord("");
    setTimeout(() => setFeedback(null), 2000);
  }, [currentWord, currentSet, foundWords, mode, difficulty, score, user, toast]);

  const handleFinish = () => {
    if (user && mode === "free" && foundWords.length > 0) {
      saveWordBuilderSession({
        userId: user.uid,
        displayName: user.displayName || "Player",
        difficulty,
        mode: "free",
        score,
        wordsFound: foundWords.length,
        timestamp: Date.now()
      });
    }
    navigate("/");
  };

  return (
    <div className="min-h-screen flex flex-col">
      <div className="flex-1 p-4 md:p-8">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center gap-4 mb-8">
            <Button variant="outline" onClick={() => navigate("/")}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
            <div>
              <h1 className="text-4xl font-bold flex items-center gap-2">
                <Sparkles className="w-10 h-10 text-primary" />
                Word Builder
              </h1>
              <p className="text-muted-foreground">
                {mode === "classroom" ? "Find the target word" : "Find as many words as you can"}
              </p>
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Letters</CardTitle>
                <CardDescription>
                  {mode === "classroom" ? `Hint: ${currentSet.hint}` : `${foundWords.length} words found`}
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex justify-center gap-2 flex-wrap">
                  {currentSet.letters.split("").map((letter, idx) => (
                    <div
                      key={idx}
                      className="w-16 h-16 flex items-center justify-center bg-primary text-primary-foreground rounded-lg text-3xl font-bold shadow-lg"
                    >
                      {letter}
                    </div>
                  ))}
                </div>

                <div className="space-y-4">
                  <Input
                    value={currentWord}
                    onChange={(e) => setCurrentWord(e.target.value.toUpperCase())}
                    onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
                    placeholder="Type your word..."
                    className="text-2xl text-center uppercase"
                    disabled={gameComplete}
                    maxLength={currentSet.letters.length}
                  />
                  
                  {feedback && (
                    <div className={`p-3 rounded-lg text-center font-semibold ${
                      feedback.type === "success" ? "bg-success/20 text-success" : "bg-destructive/20 text-destructive"
                    }`}>
                      {feedback.message}
                    </div>
                  )}

                  <Button 
                    onClick={handleSubmit} 
                    className="w-full" 
                    size="lg"
                    disabled={gameComplete || currentWord.length < 3}
                  >
                    Submit Word
                  </Button>

                  {mode === "classroom" && (
                    <p className="text-center text-muted-foreground">
                      Attempts: {attempts}
                    </p>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>Your Words</span>
                  <Badge className="text-lg px-4 py-1">
                    Score: {score}
                  </Badge>
                </CardTitle>
                <CardDescription>
                  {mode === "free" && `${currentSet.validWords.length} total possible words`}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 max-h-96 overflow-y-auto">
                  {foundWords.map((word, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between p-3 bg-muted rounded-lg"
                    >
                      <span className="font-semibold text-lg">{word}</span>
                      <div className="flex items-center gap-2">
                        <Badge variant="secondary">+{calculateScore(word)}</Badge>
                        <Check className="w-5 h-5 text-success" />
                      </div>
                    </div>
                  ))}
                  
                  {foundWords.length === 0 && (
                    <p className="text-center text-muted-foreground py-8">
                      No words found yet. Start typing!
                    </p>
                  )}
                </div>

                {(gameComplete || (mode === "free" && foundWords.length > 0)) && (
                  <Button 
                    onClick={handleFinish}
                    className="w-full mt-4"
                    variant="outline"
                  >
                    Finish & Return
                  </Button>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default WordBuilderGame;
