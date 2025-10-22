import { useState, useEffect, useCallback } from "react";
import { GameState } from "@/types/game";
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
  const [gameState, setGameState] = useState<GameState>({
    score: 0,
    streak: 0,
    currentQuestion: null,
    timeLeft: INITIAL_TIME,
    isPlaying: false,
    isGameOver: false,
  });

  const [questions, setQuestions] = useState([...sampleQuestions]);
  const [usedQuestions, setUsedQuestions] = useState<string[]>([]);

  const getNextQuestion = useCallback(() => {
    const availableQuestions = questions.filter(q => !usedQuestions.includes(q.id));
    
    if (availableQuestions.length === 0) {
      setUsedQuestions([]);
      return questions[Math.floor(Math.random() * questions.length)];
    }
    
    const nextQuestion = availableQuestions[Math.floor(Math.random() * availableQuestions.length)];
    setUsedQuestions(prev => [...prev, nextQuestion.id]);
    return nextQuestion;
  }, [questions, usedQuestions]);

  const startGame = () => {
    setGameState({
      score: 0,
      streak: 0,
      currentQuestion: getNextQuestion(),
      timeLeft: INITIAL_TIME,
      isPlaying: true,
      isGameOver: false,
    });
    setUsedQuestions([]);
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
        title: "¡Correcto!",
        description: `+${points} puntos (Racha: ${streakBonus})`,
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
        title: "Incorrecto",
        description: "La racha se reinició",
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
      title: "💥 ¡BOOM!",
      description: "¡La bomba explotó!",
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
    return <GameOverScreen score={gameState.score} onRestart={startGame} />;
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
