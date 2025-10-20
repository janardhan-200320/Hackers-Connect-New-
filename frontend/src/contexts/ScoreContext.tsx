import { createContext, useContext, useState, ReactNode } from "react";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

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

interface ScoreContextType {
  currentUserScore: number;
  updateScore: (points: number, challengeTitle: string) => void;
  navigateToScoreboard: () => void;
  scoreEntries: ScoreEntry[];
  currentUser: ScoreEntry | null;
  addChallengeCompletion: (challengeTitle: string, points: number) => void;
}

const ScoreContext = createContext<ScoreContextType | undefined>(undefined);

const initialScoreData: ScoreEntry[] = [
  {
    id: "current-user",
    username: "YourUsername",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=user",
    score: 850,
    level: "Intermediate",
    rank: 8,
    challengesCompleted: 12,
    lastActivity: "Just now",
    streak: 3,
    badge: "🔥"
  },
  {
    id: "1",
    username: "CyberNinja",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=cyber",
    score: 2850,
    level: "Elite Hacker",
    rank: 1,
    challengesCompleted: 47,
    lastActivity: "2 minutes ago",
    streak: 15,
    badge: "🏆"
  },
  {
    id: "2", 
    username: "CodeBreaker",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=code",
    score: 2720,
    level: "Master",
    rank: 2,
    challengesCompleted: 43,
    lastActivity: "5 minutes ago",
    streak: 12,
    badge: "🥈"
  },
  {
    id: "3",
    username: "RootAccess",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=root",
    score: 2680,
    level: "Expert",
    rank: 3,
    challengesCompleted: 41,
    lastActivity: "8 minutes ago",
    streak: 8,
    badge: "🥉"
  },
  {
    id: "4",
    username: "ShellMaster",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=shell",
    score: 2150,
    level: "Advanced",
    rank: 4,
    challengesCompleted: 35,
    lastActivity: "15 minutes ago",
    streak: 6,
    badge: "⭐"
  },
  {
    id: "5",
    username: "ByteHunter",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=byte",
    score: 1950,
    level: "Advanced",
    rank: 5,
    challengesCompleted: 29,
    lastActivity: "1 hour ago",
    streak: 4,
    badge: "💎"
  },
  {
    id: "6",
    username: "NetGhost",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=net",
    score: 1780,
    level: "Intermediate",
    rank: 6,
    challengesCompleted: 25,
    lastActivity: "2 hours ago",
    streak: 2,
    badge: "🚀"
  },
  {
    id: "7",
    username: "CryptKeeper",
    avatar: "https://api.dicebear.com/7.x/avataaars/svg?seed=crypt",
    score: 1650,
    level: "Intermediate", 
    rank: 7,
    challengesCompleted: 22,
    lastActivity: "3 hours ago",
    streak: 5,
    badge: "🔐"
  }
];

export function ScoreProvider({ children }: { children: ReactNode }) {
  const [scoreEntries, setScoreEntries] = useState<ScoreEntry[]>(initialScoreData);
  const [currentUserScore, setCurrentUserScore] = useState(850);
  const navigate = useNavigate();

  const currentUser = scoreEntries.find(entry => entry.id === "current-user") || null;

  const getLevelFromScore = (score: number): string => {
    if (score >= 2500) return "Elite Hacker";
    if (score >= 2000) return "Master";
    if (score >= 1500) return "Expert";
    if (score >= 1000) return "Advanced";
    if (score >= 500) return "Intermediate";
    return "Beginner";
  };

  const getBadgeFromLevel = (level: string): string => {
    const badges: Record<string, string> = {
      "Elite Hacker": "🏆",
      "Master": "🥈", 
      "Expert": "🥉",
      "Advanced": "⭐",
      "Intermediate": "🔥",
      "Beginner": "🌟"
    };
    return badges[level] || "🌟";
  };

  const updateScore = (points: number, challengeTitle: string) => {
    const newScore = currentUserScore + points;
    setCurrentUserScore(newScore);

    // Update the current user's entry
    setScoreEntries(prev => {
      const updated = prev.map(entry => {
        if (entry.id === "current-user") {
          const newLevel = getLevelFromScore(newScore);
          return {
            ...entry,
            score: newScore,
            level: newLevel,
            badge: getBadgeFromLevel(newLevel),
            challengesCompleted: entry.challengesCompleted + 1,
            lastActivity: "Just now",
            streak: entry.streak + 1
          };
        }
        return entry;
      });

      // Re-rank all entries
      const sorted = updated.sort((a, b) => b.score - a.score);
      return sorted.map((entry, index) => ({ ...entry, rank: index + 1 }));
    });

    // Show success notification with navigation prompt
    toast.success(
      `🎉 Challenge "${challengeTitle}" completed! +${points} points`,
      {
        action: {
          label: "View Scoreboard",
          onClick: () => navigateToScoreboard()
        },
        duration: 5000
      }
    );
  };

  const addChallengeCompletion = (challengeTitle: string, points: number) => {
    updateScore(points, challengeTitle);
  };

  const navigateToScoreboard = () => {
    navigate("/app/scoreboard");
    toast.info("🏆 Check out your new ranking!");
  };

  return (
    <ScoreContext.Provider
      value={{
        currentUserScore,
        updateScore,
        navigateToScoreboard,
        scoreEntries,
        currentUser,
        addChallengeCompletion
      }}
    >
      {children}
    </ScoreContext.Provider>
  );
}

export function useScore() {
  const context = useContext(ScoreContext);
  if (context === undefined) {
    throw new Error("useScore must be used within a ScoreProvider");
  }
  return context;
}