import { useState, useEffect, useCallback } from "react";
import { GameState, Difficulty } from "@/types/game";
import { sampleQuestions } from "@/data/sampleQuestions";
import BombTimer from "@/components/BombTimer";
import QuestionCard from "@/components/QuestionCard";
import GameStats from "@/components/GameStats";
import StartScreen from "@/components/StartScreen";
import GameOverScreen from "@/components/GameOverScreen";
import { useToast } from "@/hooks/use-toast";

const INITIAL_TIME = 20;

const Index = () => {
  const { toast } = useToast();
  const [selectedDifficulty, setSelectedDifficulty] = useState<Difficulty>("medium");
  const [gameState, setGameState] = useState<GameState>({
    score: 0,
    streak: 0,
    currentQuestion: null,
    timeLeft: INITIAL_TIME,
    isPlaying: false,
    isGameOver: false,
  });

  const [usedQuestions, setUsedQuestions] = useState<string[]>([]);

  const getNextQuestion = useCallback(() => {
    const difficultyQuestions = sampleQuestions.filter(
      q => q.difficulty === selectedDifficulty && !usedQuestions.includes(q.id)
    );
    
    if (difficultyQuestions.length === 0) {
      setUsedQuestions([]);
      const allDifficultyQuestions = sampleQuestions.filter(q => q.difficulty === selectedDifficulty);
      return allDifficultyQuestions[Math.floor(Math.random() * allDifficultyQuestions.length)];
    }
    
    const nextQuestion = difficultyQuestions[Math.floor(Math.random() * difficultyQuestions.length)];
    setUsedQuestions(prev => [...prev, nextQuestion.id]);
    return nextQuestion;
  }, [selectedDifficulty, usedQuestions]);

  const startGame = (difficulty: Difficulty) => {
    setSelectedDifficulty(difficulty);
    setUsedQuestions([]);
    
    const firstQuestion = sampleQuestions.filter(q => q.difficulty === difficulty)[0];
    
    setGameState({
      score: 0,
      streak: 0,
      currentQuestion: firstQuestion,
      timeLeft: INITIAL_TIME,
      isPlaying: true,
      isGameOver: false,
    });
  };

  const handleAnswer = (isCorrect: boolean) => {
    if (isCorrect) {
      const streakBonus = gameState.streak + 1;
      const points = 10 + (streakBonus * 2);
      
      setGameState(prev => ({
        ...prev,
        score: prev.score + points,
        streak: streakBonus,
        currentQuestion: getNextQuestion(),
        timeLeft: INITIAL_TIME,
      }));

      toast({
        title: "Correct!",
        description: `+${points} points (Streak: ${streakBonus})`,
        duration: 2000,
      });
    } else {
      setGameState(prev => ({
        ...prev,
        streak: 0,
        currentQuestion: getNextQuestion(),
        timeLeft: INITIAL_TIME,
      }));

      toast({
        title: "Incorrect",
        description: "Streak reset",
        variant: "destructive",
        duration: 2000,
      });
    }
  };

  const gameOver = () => {
    setGameState(prev => ({
      ...prev,
      isPlaying: false,
      isGameOver: true,
    }));

    toast({
      title: "💥 BOOM!",
      description: "The bomb exploded!",
      variant: "destructive",
      duration: 3000,
    });
  };

  useEffect(() => {
    if (!gameState.isPlaying || gameState.timeLeft === 0) return;

    const timer = setInterval(() => {
      setGameState(prev => {
        if (prev.timeLeft <= 1) {
          gameOver();
          return prev;
        }
        return { ...prev, timeLeft: prev.timeLeft - 1 };
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [gameState.isPlaying, gameState.timeLeft]);

  if (!gameState.isPlaying && !gameState.isGameOver) {
    return <StartScreen onStart={startGame} />;
  }

  if (gameState.isGameOver) {
    return <GameOverScreen score={gameState.score} onRestart={() => startGame(selectedDifficulty)} />;
  }

  return (
    <div className="min-h-screen bg-[image:var(--gradient-background)] p-4 flex flex-col items-center justify-center">
      <GameStats score={gameState.score} streak={gameState.streak} />
      
      <BombTimer
        timeLeft={gameState.timeLeft}
        totalTime={INITIAL_TIME}
        isActive={gameState.isPlaying}
      />

      <div className="mt-8 w-full flex justify-center">
        {gameState.currentQuestion && (
          <QuestionCard
            question={gameState.currentQuestion}
            onAnswer={handleAnswer}
          />
        )}
      </div>
    </div>
  );
};

export default Index;
