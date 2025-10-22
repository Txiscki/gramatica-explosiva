export type Difficulty = "easy" | "medium" | "hard";

export interface Question {
  id: string;
  question: string;
  answer: string;
  category: string;
  difficulty: Difficulty;
}

export interface GameState {
  score: number;
  streak: number;
  currentQuestion: Question | null;
  timeLeft: number;
  isPlaying: boolean;
  isGameOver: boolean;
}
