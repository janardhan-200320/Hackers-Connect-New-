import React, { useState } from "react";
import { Lock, Unlock, Trophy } from "lucide-react";

type Challenge = {
  id: number;
  title: string;
  description: string;
  difficulty: "Easy" | "Medium" | "Hard";
  flag: string;
  solved: boolean;
};

const initialChallenges: Challenge[] = [
  {
    id: 1,
    title: "Basic SQL Injection",
    description: "Find the correct payload to bypass the login.",
    difficulty: "Easy",
    flag: "FLAG{SQL_INJECTION_SUCCESS}",
    solved: false,
  },
  {
    id: 2,
    title: "Reverse Engineering",
    description: "Decompile the binary and retrieve the hidden flag.",
    difficulty: "Medium",
    flag: "FLAG{REVERSE_ENGINEERED}",
    solved: false,
  },
  {
    id: 3,
    title: "Web Exploit",
    description: "Exploit the XSS vulnerability and steal the cookie.",
    difficulty: "Hard",
    flag: "FLAG{XSS_OWNED}",
    solved: false,
  },
];

export default function Challenges() {
  const [challenges, setChallenges] = useState(initialChallenges);
  const [input, setInput] = useState<{ [key: number]: string }>({});

  const handleSubmit = (id: number) => {
    setChallenges((prev) =>
      prev.map((c) =>
        c.id === id
          ? {
              ...c,
              solved: input[id]?.trim() === c.flag,
            }
          : c
      )
    );
  };

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold text-emerald-400">CTF Challenges</h1>
      {challenges.map((challenge) => (
        <div
          key={challenge.id}
          className="rounded-2xl border border-emerald-400/40 bg-black/40 p-6 shadow-md space-y-3"
        >
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-emerald-300">
              {challenge.title}
            </h2>
            {challenge.solved ? (
              <span className="flex items-center text-emerald-400">
                <Unlock className="mr-1" size={18} /> Solved
              </span>
            ) : (
              <span className="flex items-center text-red-400">
                <Lock className="mr-1" size={18} /> Locked
              </span>
            )}
          </div>
          <p className="text-sm text-gray-300">{challenge.description}</p>
          <p className="text-xs text-emerald-500">
            Difficulty: {challenge.difficulty}
          </p>

          {!challenge.solved && (
            <div className="flex space-x-2 mt-2">
              <input
                type="text"
                placeholder="Enter flag..."
                value={input[challenge.id] || ""}
                onChange={(e) =>
                  setInput({ ...input, [challenge.id]: e.target.value })
                }
                className="flex-1 rounded-lg border border-emerald-400/30 bg-black/60 p-2 text-sm text-white focus:outline-none focus:ring-2 focus:ring-emerald-400"
              />
              <button
                onClick={() => handleSubmit(challenge.id)}
                className="px-4 py-2 rounded-lg bg-emerald-500 hover:bg-emerald-600 text-sm font-semibold"
              >
                Submit
              </button>
            </div>
          )}

          {challenge.solved && (
            <div className="flex items-center space-x-2 text-emerald-300 font-semibold">
              <Trophy size={18} /> <span>Congratulations! Flag captured.</span>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
