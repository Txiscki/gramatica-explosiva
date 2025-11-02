import { db } from "@/lib/firebase";
import { collection, query, where, getDocs, deleteDoc, doc } from "firebase/firestore";
import { getTopScoresByLevel } from "./gameSessionService";
import { saveUserAchievement, getUserAchievements } from "./achievementService";
import { Difficulty } from "@/types/game";

// Check and update leaderboard-based achievements
export const updateLeaderboardAchievements = async (userId: string, difficulty: Difficulty): Promise<void> => {
  try {
    // Get top 10 for this level
    const topScores = await getTopScoresByLevel(difficulty, 10);
    const userRank = topScores.findIndex(s => s.userId === userId);
    
    const userAchievements = await getUserAchievements(userId);
    const hasThePeak = userAchievements.some(a => a.achievementId === "the_peak");
    const hasTheOneAboveAll = userAchievements.some(a => a.achievementId === "the_one_above_all");
    
    // Check if user is in top 10
    if (userRank >= 0 && userRank < 10) {
      // Award "The Peak" if not already awarded
      if (!hasThePeak) {
        await saveUserAchievement(userId, "the_peak");
      }
      
      // Check if user is #1
      if (userRank === 0) {
        // Award "The One Above All" if not already awarded
        if (!hasTheOneAboveAll) {
          await saveUserAchievement(userId, "the_one_above_all");
        }
      } else {
        // User is in top 10 but not #1 - revoke "The One Above All" if they have it
        if (hasTheOneAboveAll) {
          await revokeAchievement(userId, "the_one_above_all");
        }
      }
    } else {
      // User is not in top 10 - revoke both achievements if they have them
      if (hasThePeak) {
        await revokeAchievement(userId, "the_peak");
      }
      if (hasTheOneAboveAll) {
        await revokeAchievement(userId, "the_one_above_all");
      }
    }
  } catch (error) {
    console.error("Error updating leaderboard achievements:", error);
  }
};

// Revoke an achievement from a user
export const revokeAchievement = async (userId: string, achievementId: string): Promise<void> => {
  try {
    const q = query(
      collection(db, "user_achievements"),
      where("userId", "==", userId),
      where("achievementId", "==", achievementId)
    );
    
    const querySnapshot = await getDocs(q);
    const deletePromises = querySnapshot.docs.map(docSnapshot => 
      deleteDoc(doc(db, "user_achievements", docSnapshot.id))
    );
    
    await Promise.all(deletePromises);
  } catch (error) {
    console.error("Error revoking achievement:", error);
  }
};
