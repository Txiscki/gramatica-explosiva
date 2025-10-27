import { db } from "@/lib/firebase";
import { doc, setDoc, getDoc, collection, query, where, getDocs, updateDoc, increment } from "firebase/firestore";
import { Difficulty } from "@/types/game";

export interface InfiniteModeProgress {
  userId: string;
  difficulty: Difficulty;
  unlocked: boolean;
  normalRunsCompleted: number;
  bestScore: number;
  bestStreak: number;
}

const UNLOCK_REQUIREMENT = 10; // 10 normal runs to unlock

export const getInfiniteModeProgress = async (
  userId: string,
  difficulty: Difficulty
): Promise<InfiniteModeProgress> => {
  try {
    const progressRef = doc(db, "infinite_mode_progress", `${userId}_${difficulty}`);
    const docSnap = await getDoc(progressRef);

    if (docSnap.exists()) {
      return docSnap.data() as InfiniteModeProgress;
    }

    // Return default
    return {
      userId,
      difficulty,
      unlocked: false,
      normalRunsCompleted: 0,
      bestScore: 0,
      bestStreak: 0,
    };
  } catch (error) {
    return {
      userId,
      difficulty,
      unlocked: false,
      normalRunsCompleted: 0,
      bestScore: 0,
      bestStreak: 0,
    };
  }
};

export const incrementNormalRunsCompleted = async (
  userId: string,
  difficulty: Difficulty
) => {
  try {
    const progressRef = doc(db, "infinite_mode_progress", `${userId}_${difficulty}`);
    const docSnap = await getDoc(progressRef);

    if (docSnap.exists()) {
      const currentRuns = docSnap.data().normalRunsCompleted || 0;
      const newRuns = currentRuns + 1;
      const unlocked = newRuns >= UNLOCK_REQUIREMENT;

      await updateDoc(progressRef, {
        normalRunsCompleted: increment(1),
        unlocked: unlocked || docSnap.data().unlocked,
      });
    } else {
      await setDoc(progressRef, {
        userId,
        difficulty,
        unlocked: 1 >= UNLOCK_REQUIREMENT,
        normalRunsCompleted: 1,
        bestScore: 0,
        bestStreak: 0,
      });
    }
  } catch (error) {
    // Silently fail - progress tracking is not critical
  }
};

export const updateInfiniteModeStats = async (
  userId: string,
  difficulty: Difficulty,
  score: number,
  streak: number
) => {
  try {
    const progressRef = doc(db, "infinite_mode_progress", `${userId}_${difficulty}`);
    const docSnap = await getDoc(progressRef);

    const currentData = docSnap.exists() ? docSnap.data() : {};
    const newBestScore = Math.max(currentData.bestScore || 0, score);
    const newBestStreak = Math.max(currentData.bestStreak || 0, streak);

    await setDoc(
      progressRef,
      {
        userId,
        difficulty,
        unlocked: currentData.unlocked || false,
        normalRunsCompleted: currentData.normalRunsCompleted || 0,
        bestScore: newBestScore,
        bestStreak: newBestStreak,
      },
      { merge: true }
    );
  } catch (error) {
    // Silently fail - stats tracking is not critical
  }
};
