import { getFirestore, collection, query, where, orderBy, limit, getDocs } from "firebase/firestore";

const db = getFirestore();

/**
 * Get top scores for a specific level (difficulty)
 */
export async function getTopScoresByLevel(level: string, maxResults = 10) {
  try {
    const q = query(
      collection(db, "game_sessions"),
      where("difficulty", "==", level),
      orderBy("score", "desc"),
      limit(maxResults)
    );

    const snapshot = await getDocs(q);
    return snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
  } catch (error) {
    console.error("Error fetching top scores:", error);
    return [];
  }
}

/**
 * Get top streaks for a specific level (difficulty)
 */
export async function getTopStreaksByLevel(level: string, maxResults = 10) {
  try {
    const q = query(
      collection(db, "game_sessions"),
      where("difficulty", "==", level),
      orderBy("streak", "desc"),
      limit(maxResults)
    );

    const snapshot = await getDocs(q);
    return snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
  } catch (error) {
    console.error("Error fetching top streaks:", error);
    return [];
  }
}

/**
 * Get top players globally (across all levels)
 */
export async function getGlobalLeaderboard(maxResults = 10) {
  try {
    const q = query(
      collection(db, "game_sessions"),
      orderBy("score", "desc"),
      limit(maxResults)
    );

    const snapshot = await getDocs(q);
    return snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
  } catch (error) {
    console.error("Error fetching global leaderboard:", error);
    return [];
  }
}
