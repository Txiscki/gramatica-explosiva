import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { GameState, Difficulty } from "@/types/game";
import { sampleQuestions } from "@/data/sampleQuestions";
import BombTimer from "@/components/BombTimer";
import QuestionCard from "@/components/QuestionCard";
import GameStats from "@/components/GameStats";
import StartScreen from "@/components/StartScreen";
import GameOverScreen from "@/components/GameOverScreen";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";

const INITIAL_TIME = 20;

const Index = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user, loading } = useAuth();
  const [selectedDifficulty, setSelectedDifficulty] = useState<Difficulty>("b1");

  useEffect(() => {
    if (!loading && !user) {
      navigate("/auth");
    }
  }, [user, loading, navigate]);
  const [gameState, setGameState] = useState<GameState>({
    score: 0,
    streak: 0,
    maxStreak: 0,
    currentQuestion: null,
    timeLeft: INITIAL_TIME,
    isPlaying: false,
    isGameOver: false,
  });

  const [usedQuestions, setUsedQuestions] = useState<string[]>([]);
  const [shuffledQuestions, setShuffledQuestions] = useState<typeof sampleQuestions>([]);
  const [isPaused, setIsPaused] = useState(false);

  const getNextQuestion = () => {
    const availableQuestions = shuffledQuestions.filter(
      q => !usedQuestions.includes(q.id)
    );
    
    if (availableQuestions.length === 0) {
      setUsedQuestions([]);
      return shuffledQuestions[0];
    }
    
    const nextQuestion = availableQuestions[0];
    setUsedQuestions(prev => [...prev, nextQuestion.id]);
    return nextQuestion;
  };

  const startGame = (difficulty: Difficulty) => {
    setSelectedDifficulty(difficulty);
    setUsedQuestions([]);
    setIsPaused(false);
    
    const difficultyQuestions = sampleQuestions.filter(q => q.difficulty === difficulty);
    const shuffled = [...difficultyQuestions].sort(() => Math.random() - 0.5);
    setShuffledQuestions(shuffled);
    
    setGameState({
      score: 0,
      streak: 0,
      maxStreak: 0,
      currentQuestion: shuffled[0],
      timeLeft: INITIAL_TIME,
      isPlaying: true,
      isGameOver: false,
    });
  };

  const handleAnswer = (isCorrect: boolean) => {
    if (isCorrect) {
      const streakBonus = gameState.streak + 1;
      const points = 10 + (streakBonus * 2);
      const newMaxStreak = Math.max(gameState.maxStreak, streakBonus);
      
      setGameState(prev => ({
        ...prev,
        score: prev.score + points,
        streak: streakBonus,
        maxStreak: newMaxStreak,
        currentQuestion: getNextQuestion(),
        timeLeft: INITIAL_TIME,
      }));

      toast({
        title: "Correct!",
        description: `+${points} points (Streak: ${streakBonus})`,
        duration: 2000,
      });
    } else {
      // Pause timer when answer is wrong
      setIsPaused(true);
      
      // Reset streak immediately
      setGameState(prev => ({
        ...prev,
        streak: 0,
      }));
    }
  };

  const handleContinue = () => {
    // Load next question and reset timer
    setGameState(prev => ({
      ...prev,
      currentQuestion: getNextQuestion(),
      timeLeft: INITIAL_TIME,
    }));
    setIsPaused(false);
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
    if (!gameState.isPlaying || gameState.timeLeft === 0 || isPaused) return;

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
  }, [gameState.isPlaying, gameState.timeLeft, isPaused]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-lg">Loading...</p>
      </div>
    );
  }

  if (!user) {
    return null;
  }

  if (!gameState.isPlaying && !gameState.isGameOver) {
    return <StartScreen onStart={startGame} />;
  }

  if (gameState.isGameOver) {
    return (
      <GameOverScreen 
        score={gameState.score} 
        maxStreak={gameState.maxStreak}
        difficulty={selectedDifficulty}
        onRestart={() => startGame(selectedDifficulty)} 
      />
    );
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
            isPaused={isPaused}
            onContinue={handleContinue}
          />
        )}
      </div>
    </div>
  );
};

export default Index;
