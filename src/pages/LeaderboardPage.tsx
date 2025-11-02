import { useEffect, useState } from "react";
import { getTopScoresByLevel, getTopStreaksByLevel } from "@/services/leaderboardService";
import Leaderboard from "@/components/Leaderboard";

export default function LeaderboardPage() {
  const [scores, setScores] = useState<any[]>([]);
  const [streaks, setStreaks] = useState<any[]>([]);
  const [level, setLevel] = useState("b1"); // Puedes cambiar o hacer dinámico

  useEffect(() => {
    const fetchData = async () => {
      const scoreData = await getTopScoresByLevel(level);
      const streakData = await getTopStreaksByLevel(level);
      setScores(scoreData);
      setStreaks(streakData);
    };
    fetchData();
  }, [level]);

  return (
    <div className="p-6 text-center">
      <h1 className="text-3xl font-bold mb-6">🏆 Leaderboard - {level.toUpperCase()}</h1>

      <div className="flex flex-col md:flex-row justify-around gap-8">
        <Leaderboard title="Top Scores" data={scores} type="score" />
        <Leaderboard title="Top Streaks" data={streaks} type="streak" />
      </div>
    </div>
  );
}
