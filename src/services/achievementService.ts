import { db } from "@/lib/firebase";
import { collection, addDoc, query, where, getDocs, doc, setDoc } from "firebase/firestore";

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  requirement: number;
  type: "score" | "streak" | "games" | "level" | "infinite";
  isSecret?: boolean;
}

export interface UserAchievement {
  userId: string;
  achievementId: string;
  earnedAt: number;
}

export const ACHIEVEMENTS: Achievement[] = [
  {
    id: "first_win",
    name: "First Victory",
    description: "Complete your first game",
    icon: "🎯",
    requirement: 1,
    type: "games"
  },
  {
    id: "quiz_veteran",
    name: "Quiz Veteran",
    description: "Complete 50 games",
    icon: "🧠",
    requirement: 50,
    type: "games"
  },
  {
    id: "perfect_game",
    name: "Perfect Game",
    description: "Answer all questions correctly in a single game",
    icon: "🏹",
    requirement: 1,
    type: "games"
  },
  {
    id: "speedster",
    name: "Speedster",
    description: "Complete a game in under 5 minutes",
    icon: "⏱️",
    requirement: 1,
    type: "games"
  },
  {
    id: "comeback",
    name: "Comeback",
    description: "Recover from 3+ wrong answers to finish strong",
    icon: "🔄",
    requirement: 1,
    type: "games"
  },
  {
    id: "vocabulary_wizard",
    name: "Vocabulary Wizard",
    description: "Answer 20+ questions correctly across all games",
    icon: "💡",
    requirement: 20,
    type: "score"
  },
  {
    id: "streak_5",
    name: "Streak Master",
    description: "Achieve a 5-answer streak",
    icon: "🔥",
    requirement: 5,
    type: "streak"
  },
  {
    id: "streak_10",
    name: "Unstoppable",
    description: "Achieve a 10-answer streak",
    icon: "⚡",
    requirement: 10,
    type: "streak"
  },
  {
    id: "score_50",
    name: "Half Century",
    description: "Score 50 points in one game",
    icon: "🌟",
    requirement: 50,
    type: "score"
  },
  {
    id: "score_100",
    name: "Century",
    description: "Score 100 points in one game",
    icon: "💯",
    requirement: 100,
    type: "score"
  },
  {
    id: "level_master_a2",
    name: "A2 Master",
    description: "Complete 10 games at A2 level",
    icon: "🥉",
    requirement: 10,
    type: "level"
  },
  {
    id: "level_master_b1",
    name: "B1 Master",
    description: "Complete 10 games at B1 level",
    icon: "🥈",
    requirement: 10,
    type: "level"
  },
  {
    id: "level_master_b2",
    name: "B2 Master",
    description: "Complete 10 games at B2 level",
    icon: "🥇",
    requirement: 10,
    type: "level"
  },
  {
    id: "level_master_c1",
    name: "C1 Master",
    description: "Complete 10 games at C1 level",
    icon: "🏆",
    requirement: 10,
    type: "level"
  },
  {
    id: "level_master_c2",
    name: "C2 Master",
    description: "Complete 10 games at C2 level",
    icon: "👑",
    requirement: 10,
    type: "level"
  },
  // Secret Achievements
  {
    id: "infinite_challenger",
    name: "Infinite Challenger",
    description: "Unlock Infinite Mode",
    icon: "🕹️",
    requirement: 1,
    type: "infinite",
    isSecret: true
  },
  {
    id: "infinite_explorer",
    name: "Infinite Explorer",
    description: "Unlock infinite mode for any level",
    icon: "🗺️",
    requirement: 1,
    type: "infinite",
    isSecret: true
  },
  {
    id: "endless_genius",
    name: "Endless Genius",
    description: "50 correct in a row in Infinite Mode",
    icon: "🧠",
    requirement: 50,
    type: "infinite",
    isSecret: true
  },
  {
    id: "no_mercy",
    name: "No Mercy",
    description: "100 correct in a row in Infinite Mode",
    icon: "💀",
    requirement: 100,
    type: "infinite",
    isSecret: true
  },
  {
    id: "the_legend",
    name: "The Legend",
    description: "Score 500+ in Infinite Mode",
    icon: "⚔️",
    requirement: 500,
    type: "infinite",
    isSecret: true
  },
  {
    id: "unreal_precision",
    name: "Unreal Precision",
    description: "Finish Infinite Mode with zero mistakes",
    icon: "☠️",
    requirement: 1,
    type: "infinite",
    isSecret: true
  },
  {
    id: "secret_genius",
    name: "Secret Genius",
    description: "Score 1500+ points in Infinite Mode",
    icon: "👀",
    requirement: 1500,
    type: "infinite",
    isSecret: true
  }
];

export const saveUserAchievement = async (userId: string, achievementId: string) => {
  try {
    const achievementRef = doc(db, "user_achievements", `${userId}_${achievementId}`);
    await setDoc(achievementRef, {
      userId,
      achievementId,
      earnedAt: Date.now()
    });
  } catch (error) {
    console.error("Error saving achievement:", error);
  }
};

export const getUserAchievements = async (userId: string): Promise<UserAchievement[]> => {
  try {
    const q = query(
      collection(db, "user_achievements"),
      where("userId", "==", userId)
    );
    const querySnapshot = await getDocs(q);
    return querySnapshot.docs.map(doc => doc.data() as UserAchievement);
  } catch (error) {
    console.error("Error getting user achievements:", error);
    return [];
  }
};

export const checkAndAwardAchievements = async (
  userId: string,
  score: number,
  streak: number,
  gameCount: number,
  isPerfectGame: boolean,
  completionTimeSeconds: number,
  hadComeback: boolean,
  totalCorrectAnswersAllTime: number,
  isInfiniteMode: boolean = false,
  infiniteModeUnlocked: boolean = false,
  infiniteModeZeroMistakes: boolean = false
) => {
  const userAchievements = await getUserAchievements(userId);
  const earnedIds = userAchievements.map(ua => ua.achievementId);
  const newAchievements: Achievement[] = [];

  for (const achievement of ACHIEVEMENTS) {
    if (earnedIds.includes(achievement.id)) continue;

    let shouldAward = false;

    switch (achievement.type) {
      case "score":
        if (achievement.id === "vocabulary_wizard") {
          shouldAward = totalCorrectAnswersAllTime >= achievement.requirement;
        } else if (isInfiniteMode && achievement.id === "the_legend") {
          shouldAward = score >= achievement.requirement;
        } else if (!isInfiniteMode) {
          shouldAward = score >= achievement.requirement;
        }
        break;
      case "streak":
        if (isInfiniteMode && (achievement.id === "endless_genius" || achievement.id === "no_mercy")) {
          shouldAward = streak >= achievement.requirement;
        } else if (!isInfiniteMode) {
          shouldAward = streak >= achievement.requirement;
        }
        break;
      case "games":
        if (achievement.id === "perfect_game") {
          shouldAward = isPerfectGame && !isInfiniteMode;
        } else if (achievement.id === "speedster") {
          shouldAward = completionTimeSeconds <= 300 && !isInfiniteMode;
        } else if (achievement.id === "comeback") {
          shouldAward = hadComeback && !isInfiniteMode;
        } else {
          shouldAward = gameCount >= achievement.requirement && !isInfiniteMode;
        }
        break;
      case "infinite":
        if (achievement.id === "infinite_challenger") {
          shouldAward = infiniteModeUnlocked;
        } else if (achievement.id === "unreal_precision") {
          shouldAward = isInfiniteMode && infiniteModeZeroMistakes;
        } else if (achievement.id === "endless_genius" || achievement.id === "no_mercy") {
          shouldAward = isInfiniteMode && streak >= achievement.requirement;
        } else if (achievement.id === "the_legend") {
          shouldAward = isInfiniteMode && score >= achievement.requirement;
        } else if (achievement.id === "infinite_explorer") {
          shouldAward = infiniteModeUnlocked;
        } else if (achievement.id === "secret_genius") {
          shouldAward = isInfiniteMode && score >= achievement.requirement;
        }
        break;
      case "games":
        if (achievement.id === "perfect_game") {
          shouldAward = isPerfectGame && !isInfiniteMode;
        } else if (achievement.id === "speedster") {
          shouldAward = completionTimeSeconds <= 300 && !isInfiniteMode;
        } else if (achievement.id === "comeback") {
          shouldAward = hadComeback && !isInfiniteMode;
        } else if (achievement.id === "quiz_veteran") {
          shouldAward = gameCount >= achievement.requirement && !isInfiniteMode;
        } else {
          shouldAward = gameCount >= achievement.requirement && !isInfiniteMode;
        }
        break;
    }

    if (shouldAward) {
      await saveUserAchievement(userId, achievement.id);
      newAchievements.push(achievement);
    }
  }

  return newAchievements;
};
