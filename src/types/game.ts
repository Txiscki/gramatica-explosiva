export type Difficulty = "a2" | "b1" | "b2" | "c1" | "c2";

export interface Question {
  id: string;
  question: string;
  answers: string[]; // Array of accepted answers
  category: string;
  difficulty: Difficulty;
}

export interface GameState {
  score: number;
  streak: number;
  maxStreak: number;
  currentQuestion: Question | null;
  timeLeft: number;
  isPlaying: boolean;
  isGameOver: boolean;
}
