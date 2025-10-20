import { useState, useEffect } from "react";
import { Trophy, Star, Target, Zap, Crown, Award, Flame } from "lucide-react";
import { useScore } from "@/contexts/ScoreContext";
import { getScoreboard } from "../services/scoreboardService"; // Import the getScoreboard function

interface ScoreEntry {
  id: string;
  username: string;
  avatar: string;
  score: number;
  level: string;
  rank: number;
  challengesCompleted: number;
  lastActivity: string;
  streak: number;
  badge: string;
}

export default function Scoreboard() {
  const { currentUser } = useScore(); // currentUser is not used, can be removed
  const [scoreboardData, setScoreboardData] = useState<ScoreEntry[]>([]); // Use ScoreEntry interface
  const [lastUpdate, setLastUpdate] = useState(new Date());
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchScoreboardData = async () => {
      setLoading(true);
      try {
        const data = await getScoreboard(); // Fetch scoreboard data from backend
        setScoreboardData(data); // Set the scoreboard data state with fetched data
        setError("");
      } catch (error: any) {
        setError(error.message || "Failed to fetch scoreboard data");
      } finally {
        setLoading(false);
      }
    };

    fetchScoreboardData();

    const interval = setInterval(() => {
      fetchScoreboardData(); // Fetch new data on interval
      setLastUpdate(new Date());
    }, 30000); // Update every 30 seconds

    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return <div>Loading scoreboard...</div>; // Simple loading indicator
  }

  if (error) {
    return <div style={{ color: "red" }}>Error: {error}</div>; // Non-intrusive error message
  }

  return (
    <div className="min-h-screen bg-zinc-950 p-6">
      {/* Header */}
      <div className="max-w-7xl mx-auto mb-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-4xl font-bold text-zinc-100 mb-2 neon-heading">
              🏆 Live Scoreboard
            </h1>
            <p className="text-zinc-400">
              Real-time rankings updated every 30 seconds
            </p>
          </div>
          <div className="text-right">
            <div className="text-sm text-zinc-500">Last updated</div>
            <div className="text-green-400 font-medium neon-text">
              {lastUpdate.toLocaleTimeString()}
            </div>
          </div>
        </div>

        {/* Live Stats */}
        <div className="grid md:grid-cols-4 gap-4 mb-8">
          <div className="bg-zinc-900/50 border rounded-xl p-6 neon-border feature-card">
            <div className="flex items-center gap-3 mb-2">
              <Trophy className="w-6 h-6 text-green-400" />
              <span className="text-zinc-300 font-medium">Active Players</span>
            </div>
            <div className="text-2xl font-bold text-green-400 neon-text">127</div>
          </div>

          <div className="bg-zinc-900/50 border rounded-xl p-6 neon-border feature-card">
            <div className="flex items-center gap-3 mb-2">
              <Target className="w-6 h-6 text-green-400" />
              <span className="text-zinc-300 font-medium">
                Challenges Solved
              </span>
            </div>
            <div className="text-2xl font-bold text-green-400 neon-text">
              1,247
            </div>
          </div>

          <div className="bg-zinc-900/50 border rounded-xl p-6 neon-border feature-card">
            <div className="flex items-center gap-3 mb-2">
              <Zap className="w-6 h-6 text-green-400" />
              <span className="text-zinc-300 font-medium">Points Today</span>
            </div>
            <div className="text-2xl font-bold text-green-400 neon-text">
              8,432
            </div>
          </div>

          <div className="bg-zinc-900/50 border rounded-xl p-6 neon-border feature-card">
            <div className="flex items-center gap-3 mb-2">
              <Flame className="w-6 h-6 text-green-400" />
              <span className="text-zinc-300 font-medium">Longest Streak</span>
            </div>
            <div className="text-2xl font-bold text-green-400 neon-text">
              15 days
            </div>
          </div>
        </div>

        {/* Leaderboard */}
        <div className="bg-zinc-900/50 border rounded-2xl overflow-hidden neon-border feature-card">
          <div className="p-6 border-b border-zinc-800">
            <h2 className="text-xl font-bold text-zinc-100 neon-text">
              🥇 Top Hackers
            </h2>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-zinc-800/50">
                <tr>
                  <th className="text-left p-4 text-zinc-300 font-medium">
                    Rank
                  </th>
                  <th className="text-left p-4 text-zinc-300 font-medium">
                    Player
                  </th>
                  <th className="text-center p-4 text-zinc-300 font-medium">
                    Score
                  </th>
                  <th className="text-center p-4 text-zinc-300 font-medium">
                    Level
                  </th>
                  <th className="text-center p-4 text-zinc-300 font-medium">
                    Challenges
                  </th>
                  <th className="text-center p-4 text-zinc-300 font-medium">
                    Streak
                  </th>
                  <th className="text-center p-4 text-zinc-300 font-medium">
                    Last Active
                  </th>
                </tr>
              </thead>
              <tbody>
                {scoreboardData.map((entry, index) => (
                  <tr
                    key={entry.id}
                    className={`border-b border-zinc-800 hover:bg-zinc-800/30 transition ${
                      index < 3 ? "bg-zinc-800/20" : ""
                    }`}
                  >
                    <td className="p-4">
                      <div className="flex items-center gap-2">
                        <span className="text-2xl">{entry.badge}</span>
                        <span
                          className={`font-bold ${
                            entry.rank === 1
                              ? "text-yellow-400"
                              : entry.rank === 2
                              ? "text-gray-300"
                              : entry.rank === 3
                              ? "text-amber-600"
                              : "text-zinc-400"
                          }`}
                        >
                          #{entry.rank}
                        </span>
                      </div>
                    </td>

                    <td className="p-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={entry.avatar}
                          alt={entry.username}
                          className="w-10 h-10 rounded-full"
                        />
                        <div>
                          <div className="font-semibold text-zinc-100 neon-text">
                            {entry.username}
                          </div>
                          <div className="text-sm text-zinc-500">
                            {entry.level}
                          </div>
                        </div>
                      </div>
                    </td>

                    <td className="p-4 text-center">
                      <span className="text-lg font-bold text-green-400 neon-text">
                        {entry.score.toLocaleString()}
                      </span>
                    </td>

                    <td className="p-4 text-center">
                      <span className="px-3 py-1 rounded-full text-xs font-medium bg-green-500/20 text-green-400 neon-border">
                        {entry.level}
                      </span>
                    </td>

                    <td className="p-4 text-center">
                      <div className="flex items-center justify-center gap-1">
                        <Award className="w-4 h-4 text-green-400" />
                        <span className="text-zinc-300">
                          {entry.challengesCompleted}
                        </span>
                      </div>
                    </td>

                    <td className="p-4 text-center">
                      <div className="flex items-center justify-center gap-1">
                        <Flame className="w-4 h-4 text-orange-400" />
                        <span className="text-zinc-300">{entry.streak}</span>
                      </div>
                    </td>

                    <td className="p-4 text-center">
                      <span
                        className={`text-sm ${
                          entry.lastActivity === "Just now" ||
                          entry.lastActivity.includes("minute")
                            ? "text-green-400"
                            : "text-zinc-500"
                        }`}
                      >
                        {entry.lastActivity}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Additional Info */}
        <div className="mt-8 text-center">
          <p className="text-zinc-500 text-sm">
            📊 Scores update automatically • 🔄 Refresh every 30 seconds • 🎯
            Real-time competition
          </p>
        </div>
      </div>
    </div>
  );
}