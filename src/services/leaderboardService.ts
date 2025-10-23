import { db } from "@/lib/firebase";
import { collection, addDoc, query, orderBy, limit, getDocs } from "firebase/firestore";

export interface LeaderboardEntry {
  name: string;
  score?: number;
  streak?: number;
  timestamp: number;
}

export const saveHighScore = async (name: string, score: number) => {
  try {
    await addDoc(collection(db, "leaderboards_highscore"), {
      name,
      score,
      timestamp: Date.now()
    });
  } catch (error) {
    console.error("Error saving high score:", error);
    throw error;
  }
};

export const saveHighStreak = async (name: string, streak: number) => {
  try {
    await addDoc(collection(db, "leaderboards_streak"), {
      name,
      streak,
      timestamp: Date.now()
    });
  } catch (error) {
    console.error("Error saving high streak:", error);
    throw error;
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
    console.error("Error getting top scores:", error);
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
    console.error("Error getting top streaks:", error);
    return [];
  }
};
