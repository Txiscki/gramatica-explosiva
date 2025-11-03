import { db } from "@/lib/firebase";
import { doc, setDoc, getDoc, updateDoc, increment } from "firebase/firestore";
import { Difficulty } from "@/types/game";

export interface WordBuilderProgress {
  classroomRunsCompleted: number;
  freeUnlocked: boolean;
}

export const getWordBuilderProgress = async (userId: string, difficulty: Difficulty): Promise<WordBuilderProgress> => {
  try {
    const progressRef = doc(db, "word_builder_progress", `${userId}_${difficulty}`);
    const docSnap = await getDoc(progressRef);
    
    if (docSnap.exists()) {
      const data = docSnap.data();
      return {
        classroomRunsCompleted: data.classroomRunsCompleted || 0,
        freeUnlocked: (data.classroomRunsCompleted || 0) >= 10
      };
    }
    
    return {
      classroomRunsCompleted: 0,
      freeUnlocked: false
    };
  } catch (error) {
    if (import.meta.env.DEV) {
      console.error("Error getting word builder progress:", error);
    }
    return {
      classroomRunsCompleted: 0,
      freeUnlocked: false
    };
  }
};

export const incrementClassroomRuns = async (userId: string, difficulty: Difficulty): Promise<void> => {
  try {
    const progressRef = doc(db, "word_builder_progress", `${userId}_${difficulty}`);
    const docSnap = await getDoc(progressRef);
    
    if (docSnap.exists()) {
      await updateDoc(progressRef, {
        classroomRunsCompleted: increment(1)
      });
    } else {
      await setDoc(progressRef, {
        userId,
        difficulty,
        classroomRunsCompleted: 1,
        lastPlayed: Date.now()
      });
    }
  } catch (error) {
    if (import.meta.env.DEV) {
      console.error("Error incrementing classroom runs:", error);
    }
  }
};

export interface WordBuilderSession {
  userId: string;
  displayName: string;
  difficulty: Difficulty;
  mode: "classroom" | "free";
  score: number;
  wordsFound: number;
  timestamp: number;
  allWordsFound?: boolean; // For secret achievement
}

export const saveWordBuilderSession = async (session: WordBuilderSession): Promise<void> => {
  try {
    await setDoc(doc(db, "word_builder_sessions", `${session.userId}_${Date.now()}`), session);
  } catch (error) {
    if (import.meta.env.DEV) {
      console.error("Error saving word builder session:", error);
    }
  }
};
