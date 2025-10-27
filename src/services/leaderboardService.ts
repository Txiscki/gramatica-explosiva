import { db } from "@/lib/firebase";
import { collection, addDoc, query, orderBy, limit, getDocs } from "firebase/firestore";
import { leaderboardEntrySchema } from "@/lib/validation";

export interface LeaderboardEntry {
  name: string;
  score?: number;
  streak?: number;
  timestamp: number;
}

export const saveHighScore = async (name: string, score: number) => {
  try {
    // Validate leaderboard entry
    const validatedEntry = leaderboardEntrySchema.parse({
      name,
      score,
      timestamp: Date.now()
    });
    
    await addDoc(collection(db, "leaderboards_highscore"), validatedEntry);
  } catch (error) {
    throw new Error("Unable to save high score");
  }
};

export const saveHighStreak = async (name: string, streak: number) => {
  try {
    // Validate leaderboard entry
    const validatedEntry = leaderboardEntrySchema.parse({
      name,
      streak,
      timestamp: Date.now()
    });
    
    await addDoc(collection(db, "leaderboards_streak"), validatedEntry);
  } catch (error) {
    throw new Error("Unable to save high streak");
  }
};

export const getTopScores = async (limitCount: number = 10): Promise<LeaderboardEntry[]> => {
  try {
    const q = query(
      collection(db, "leaderboards_highscore"),
      orderBy("score", "desc"),
      limit(limitCount)
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => doc.data() as LeaderboardEntry);
  } catch (error) {
    return [];
  }
};

export const getTopStreaks = async (limitCount: number = 10): Promise<LeaderboardEntry[]> => {
  try {
    const q = query(
      collection(db, "leaderboards_streak"),
      orderBy("streak", "desc"),
      limit(limitCount)
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => doc.data() as LeaderboardEntry);
  } catch (error) {
    return [];
  }
};
