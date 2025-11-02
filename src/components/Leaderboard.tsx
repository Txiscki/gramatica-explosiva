interface LeaderboardProps {
  title: string;
  data: any[];
  type: "score" | "streak";
}

export default function Leaderboard({ title, data, type }: LeaderboardProps) {
  return (
    <div className="bg-white rounded-2xl shadow-lg p-4 w-full md:w-1/2">
      <h2 className="text-xl font-semibold mb-4">{title}</h2>

      {data.length === 0 ? (
        <p className="text-gray-500">No data available yet.</p>
      ) : (
        <ul className="divide-y divide-gray-200">
          {data.map((entry, index) => (
            <li key={entry.id || index} className="flex justify-between py-2">
              <span>
                <strong>{index + 1}.</strong> {entry.displayName || "Unknown"}
              </span>
              <span className="font-medium text-blue-600">
                {type === "score" ? `${entry.score} pts` : `${entry.streak}🔥`}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
