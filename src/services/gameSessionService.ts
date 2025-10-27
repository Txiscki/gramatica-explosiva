import { db } from "@/lib/firebase";
import { collection, addDoc, query, where, orderBy, limit, getDocs } from "firebase/firestore";
import { Difficulty } from "@/types/game";
import { gameSessionSchema } from "@/lib/validation";

export interface GameSession {
  userId: string;
  displayName: string;
  difficulty: Difficulty;
  score: number;
  streak: number;
  timestamp: number;
  totalQuestions: number;
  correctAnswers: number;
  wrongAnswers: number;
  completionTimeSeconds: number;
  isPerfectGame: boolean;
  hadComeback: boolean;
  isInfiniteMode?: boolean;
}

export const saveGameSession = async (session: GameSession) => {
  try {
    // Validate session data
    const validatedSession = gameSessionSchema.parse(session);
    
    await addDoc(collection(db, "game_sessions"), validatedSession);
  } catch (error) {
    console.error("Error saving game session:", error);
    throw error;
  }
};

export const getUserSessions = async (userId: string): Promise<GameSession[]> => {
  try {
    const q = query(
      collection(db, "game_sessions"),
      where("userId", "==", userId),
      orderBy("timestamp", "desc"),
      limit(20)
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => doc.data() as GameSession);
  } catch (error) {
    console.error("Error getting user sessions:", error);
    return [];
  }
};

export const getTopScoresByLevel = async (difficulty: Difficulty, limitCount: number = 10): Promise<GameSession[]> => {
  try {
    const q = query(
      collection(db, "game_sessions"),
      where("difficulty", "==", difficulty),
      orderBy("score", "desc"),
      limit(limitCount)
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => doc.data() as GameSession);
  } catch (error) {
    console.error("Error getting top scores by level:", error);
    return [];
  }
};

export const getTopStreaksByLevel = async (difficulty: Difficulty, limitCount: number = 10): Promise<GameSession[]> => {
  try {
    const q = query(
      collection(db, "game_sessions"),
      where("difficulty", "==", difficulty),
      orderBy("streak", "desc"),
      limit(limitCount)
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => doc.data() as GameSession);
  } catch (error) {
    console.error("Error getting top streaks by level:", error);
    return [];
  }
};

export const getAllSessions = async (): Promise<GameSession[]> => {
  try {
    const q = query(
      collection(db, "game_sessions"),
      orderBy("timestamp", "desc"),
      limit(100)
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => doc.data() as GameSession);
  } catch (error) {
    console.error("Error getting all sessions:", error);
    return [];
  }
};

export const getSessionsByUserIds = async (userIds: string[]): Promise<GameSession[]> => {
  try {
    if (userIds.length === 0) return [];
    
    // Firestore 'in' query limited to 30 items, handle in batches
    const chunks: string[][] = [];
    for (let i = 0; i < userIds.length; i += 30) {
      chunks.push(userIds.slice(i, i + 30));
    }
    
    const results = await Promise.all(
      chunks.map(async (chunk) => {
        const q = query(
          collection(db, "game_sessions"),
          where("userId", "in", chunk),
          orderBy("timestamp", "desc"),
          limit(200)
        );
        const querySnapshot = await getDocs(q);
        return querySnapshot.docs.map(doc => doc.data() as GameSession);
      })
    );
    
    return results.flat().sort((a, b) => b.timestamp - a.timestamp);
  } catch (error) {
    console.error("Error getting sessions by user IDs:", error);
    return [];
  }
};
