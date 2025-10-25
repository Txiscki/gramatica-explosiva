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
import { incrementNormalRunsCompleted } from "@/services/infiniteModeService";

const INITIAL_TIME = 20;
const NORMAL_MODE_QUESTIONS = 20;
const INFINITE_MODE_MAX_FAILS = 3;

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
    isInfiniteMode: false,
    failsRemaining: INFINITE_MODE_MAX_FAILS,
  });

  const [usedQuestions, setUsedQuestions] = useState<string[]>([]);
  const [shuffledQuestions, setShuffledQuestions] = useState<typeof sampleQuestions>([]);
  const [isPaused, setIsPaused] = useState(false);
  const [gameStartTime, setGameStartTime] = useState<number>(0);
  const [correctAnswersCount, setCorrectAnswersCount] = useState(0);
  const [wrongAnswersCount, setWrongAnswersCount] = useState(0);
  const [consecutiveWrong, setConsecutiveWrong] = useState(0);
  const [maxConsecutiveWrong, setMaxConsecutiveWrong] = useState(0);
  const [totalQuestionsAnswered, setTotalQuestionsAnswered] = useState(0);

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

  const startGame = (difficulty: Difficulty, isInfiniteMode: boolean = false) => {
    setSelectedDifficulty(difficulty);
    setUsedQuestions([]);
    setIsPaused(false);
    setGameStartTime(Date.now());
    setCorrectAnswersCount(0);
    setWrongAnswersCount(0);
    setConsecutiveWrong(0);
    setMaxConsecutiveWrong(0);
    setTotalQuestionsAnswered(0);
    
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
      isInfiniteMode,
      failsRemaining: isInfiniteMode ? INFINITE_MODE_MAX_FAILS : undefined,
    });
  };

  const handleAnswer = (isCorrect: boolean) => {
    setTotalQuestionsAnswered(prev => prev + 1);
    
    if (isCorrect) {
      setCorrectAnswersCount(prev => prev + 1);
      setConsecutiveWrong(0);
      
      const streakBonus = gameState.streak + 1;
      const points = 10 + (streakBonus * 2);
      const newMaxStreak = Math.max(gameState.maxStreak, streakBonus);
      
      // Check if normal mode is complete (20 questions)
      const isNormalModeComplete = !gameState.isInfiniteMode && totalQuestionsAnswered + 1 >= NORMAL_MODE_QUESTIONS;
      
      setGameState(prev => ({
        ...prev,
        score: prev.score + points,
        streak: streakBonus,
        maxStreak: newMaxStreak,
        currentQuestion: isNormalModeComplete ? null : getNextQuestion(),
        timeLeft: INITIAL_TIME,
        isGameOver: isNormalModeComplete,
        isPlaying: !isNormalModeComplete,
      }));
      
      if (isNormalModeComplete) {
        // Increment normal runs for infinite mode unlock
        if (user) {
          incrementNormalRunsCompleted(user.uid, selectedDifficulty);
        }
      }

      toast({
        title: "Correct!",
        description: `+${points} points (Streak: ${streakBonus})`,
        duration: 2000,
      });
    } else {
      setWrongAnswersCount(prev => prev + 1);
      const newConsecutiveWrong = consecutiveWrong + 1;
      setConsecutiveWrong(newConsecutiveWrong);
      setMaxConsecutiveWrong(prev => Math.max(prev, newConsecutiveWrong));
      
      // Handle infinite mode failures
      if (gameState.isInfiniteMode) {
        const newFailsRemaining = (gameState.failsRemaining || INFINITE_MODE_MAX_FAILS) - 1;
        
        if (newFailsRemaining <= 0) {
          // Game over in infinite mode
          setGameState(prev => ({
            ...prev,
            streak: 0,
            failsRemaining: 0,
            isPlaying: false,
            isGameOver: true,
          }));
          
          toast({
            title: "💥 Game Over!",
            description: "You've used all your chances in Infinite Mode",
            variant: "destructive",
            duration: 3000,
          });
          return;
        }
        
        setGameState(prev => ({
          ...prev,
          streak: 0,
          failsRemaining: newFailsRemaining,
        }));
        
        toast({
          title: "Wrong!",
          description: `Fails remaining: ${newFailsRemaining}`,
          variant: "destructive",
          duration: 2000,
        });
      }
      
      // Pause timer when answer is wrong
      setIsPaused(true);
      
      // Reset streak immediately
      if (!gameState.isInfiniteMode) {
        setGameState(prev => ({
          ...prev,
          streak: 0,
        }));
      }
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
    const completionTimeSeconds = Math.floor((Date.now() - gameStartTime) / 1000);
    // Perfect game: all questions correct and exactly 20 questions in normal mode
    const isPerfectGame = !gameState.isInfiniteMode && 
                          wrongAnswersCount === 0 && 
                          totalQuestionsAnswered === NORMAL_MODE_QUESTIONS &&
                          correctAnswersCount === NORMAL_MODE_QUESTIONS;
    const hadComeback = maxConsecutiveWrong >= 3 && totalQuestionsAnswered > 0;
    const infiniteModeZeroMistakes = gameState.isInfiniteMode && wrongAnswersCount === 0;
    
    return (
      <GameOverScreen 
        score={gameState.score} 
        maxStreak={gameState.maxStreak}
        difficulty={selectedDifficulty}
        totalQuestions={totalQuestionsAnswered}
        correctAnswers={correctAnswersCount}
        wrongAnswers={wrongAnswersCount}
        completionTimeSeconds={completionTimeSeconds}
        isPerfectGame={isPerfectGame}
        hadComeback={hadComeback}
        isInfiniteMode={gameState.isInfiniteMode || false}
        infiniteModeZeroMistakes={infiniteModeZeroMistakes}
        onRestart={() => startGame(selectedDifficulty, gameState.isInfiniteMode)} 
        onBackToMenu={() => {
          setGameState(prev => ({
            ...prev,
            isPlaying: false,
            isGameOver: false,
          }));
        }}
      />
    );
  }

  return (
    <div className="min-h-screen bg-[image:var(--gradient-background)] p-4 flex flex-col items-center justify-center">
      <GameStats 
        score={gameState.score} 
        streak={gameState.streak}
        failsRemaining={gameState.isInfiniteMode ? gameState.failsRemaining : undefined}
        questionsAnswered={!gameState.isInfiniteMode ? totalQuestionsAnswered : undefined}
        totalQuestions={!gameState.isInfiniteMode ? NORMAL_MODE_QUESTIONS : undefined}
      />
      
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
