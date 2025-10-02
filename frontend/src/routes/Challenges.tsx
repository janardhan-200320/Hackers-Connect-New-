import { useState } from "react";
import { Trophy, Lock, Flag, Search, Filter, Award, X, Plus } from "lucide-react";
import * as Tabs from "@radix-ui/react-tabs";
import * as Dialog from "@radix-ui/react-dialog";
import { mockChallenges } from "@/lib/mockData";
import { useChallenge } from "@/contexts/ChallengeContext";

export default function Challenges() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTab, setSelectedTab] = useState("all");
  const [solvedChallenges] = useState<Set<string>>(new Set(["1"]));
  const [selectedChallenge, setSelectedChallenge] = useState<
    (typeof mockChallenges)[0] | null
  >(null);
  const [flagInput, setFlagInput] = useState("");
  const { isStartChallengeOpen, setIsStartChallengeOpen } = useChallenge();
  
  // New Challenge Form State
  const [newChallenge, setNewChallenge] = useState({
    title: "",
    description: "",
    difficulty: "Easy",
    category: "Web",
    points: 100,
    flag: "",
  });

  const filteredChallenges = mockChallenges.filter((challenge) => {
    const matchesSearch =
      challenge.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      challenge.description.toLowerCase().includes(searchQuery.toLowerCase());

    if (selectedTab === "solved")
      return matchesSearch && solvedChallenges.has(challenge.id);
    if (selectedTab === "easy")
      return matchesSearch && challenge.difficulty === "Easy";
    if (selectedTab === "medium")
      return matchesSearch && challenge.difficulty === "Medium";
    if (selectedTab === "hard")
      return matchesSearch && challenge.difficulty === "Hard";
    return matchesSearch;
  });

  const getDifficultyColor = (difficulty: string) => {
    const colors: Record<string, string> = {
      Easy: "bg-green-500/10 text-green-400 border-green-500/20",
      Medium: "bg-yellow-500/10 text-yellow-400 border-yellow-500/20",
      Hard: "bg-red-500/10 text-red-400 border-red-500/20",
    };
    return (
      colors[difficulty] || "bg-zinc-500/10 text-zinc-400 border-zinc-500/20"
    );
  };

  const handleSubmitFlag = () => {
    if (flagInput.trim()) {
      alert("Flag submitted! (This is a mock submission)");
      setFlagInput("");
      setSelectedChallenge(null);
    }
  };

  const handleCreateChallenge = () => {
    if (!newChallenge.title.trim() || !newChallenge.description.trim() || !newChallenge.flag.trim()) {
      alert("Please fill in all required fields");
      return;
    }

    // Mock challenge creation
    console.log("New challenge created:", newChallenge);
    alert("Challenge created successfully!");
    
    // Reset form
    setNewChallenge({
      title: "",
      description: "",
      difficulty: "Easy",
      category: "Web",
      points: 100,
      flag: "",
    });
    setIsStartChallengeOpen(false);
  };

  return (
    <div className="max-w-6xl mx-auto p-4 space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-zinc-100">CTF Challenges</h1>
          <p className="text-sm text-zinc-500">
            Test your skills with capture the flag challenges
          </p>
        </div>
        <button
          onClick={() => setIsStartChallengeOpen(true)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition"
        >
          <Plus className="w-4 h-4" />
          Create Challenge
        </button>
      </div>

      {/* Start Challenge Dialog */}
      <Dialog.Root open={isStartChallengeOpen} onOpenChange={setIsStartChallengeOpen}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 animate-in fade-in" />
          <Dialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-zinc-900 border border-zinc-800 rounded-xl p-6 w-full max-w-2xl max-h-[85vh] overflow-y-auto z-50 shadow-2xl">
            {/* Dialog Header */}
            <div className="flex items-center justify-between mb-6">
              <Dialog.Title className="text-xl font-bold text-zinc-100">
                Create New Challenge
              </Dialog.Title>
              <Dialog.Close className="p-2 hover:bg-zinc-800 rounded-lg transition">
                <X className="w-5 h-5 text-zinc-400" />
              </Dialog.Close>
            </div>

            {/* Challenge Form */}
            <div className="space-y-4">
              {/* Title */}
              <div>
                <label className="block text-sm font-medium text-zinc-300 mb-2">
                  Challenge Title *
                </label>
                <input
                  type="text"
                  placeholder="e.g., SQL Injection Challenge"
                  value={newChallenge.title}
                  onChange={(e) => setNewChallenge({ ...newChallenge, title: e.target.value })}
                  className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2 text-zinc-100 placeholder-zinc-500 outline-none focus:border-zinc-600"
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-zinc-300 mb-2">
                  Description *
                </label>
                <textarea
                  placeholder="Describe the challenge, objectives, and any hints..."
                  value={newChallenge.description}
                  onChange={(e) => setNewChallenge({ ...newChallenge, description: e.target.value })}
                  rows={4}
                  className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2 text-zinc-100 placeholder-zinc-500 outline-none focus:border-zinc-600 resize-none"
                />
              </div>

              {/* Difficulty and Category */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-zinc-300 mb-2">
                    Difficulty
                  </label>
                  <select
                    value={newChallenge.difficulty}
                    onChange={(e) => setNewChallenge({ ...newChallenge, difficulty: e.target.value })}
                    className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2 text-zinc-100 outline-none focus:border-zinc-600"
                  >
                    <option value="Easy">Easy</option>
                    <option value="Medium">Medium</option>
                    <option value="Hard">Hard</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-zinc-300 mb-2">
                    Category
                  </label>
                  <select
                    value={newChallenge.category}
                    onChange={(e) => setNewChallenge({ ...newChallenge, category: e.target.value })}
                    className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2 text-zinc-100 outline-none focus:border-zinc-600"
                  >
                    <option value="Web">Web</option>
                    <option value="PWN">PWN</option>
                    <option value="Crypto">Crypto</option>
                    <option value="Forensics">Forensics</option>
                    <option value="Reverse">Reverse Engineering</option>
                  </select>
                </div>
              </div>

              {/* Points */}
              <div>
                <label className="block text-sm font-medium text-zinc-300 mb-2">
                  Points
                </label>
                <input
                  type="number"
                  min="50"
                  step="50"
                  value={newChallenge.points}
                  onChange={(e) => setNewChallenge({ ...newChallenge, points: parseInt(e.target.value) })}
                  className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2 text-zinc-100 outline-none focus:border-zinc-600"
                />
              </div>

              {/* Flag */}
              <div>
                <label className="block text-sm font-medium text-zinc-300 mb-2">
                  Flag *
                </label>
                <input
                  type="text"
                  placeholder="FLAG{example_flag_here}"
                  value={newChallenge.flag}
                  onChange={(e) => setNewChallenge({ ...newChallenge, flag: e.target.value })}
                  className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2 text-zinc-100 placeholder-zinc-500 outline-none focus:border-zinc-600 font-mono"
                />
                <p className="text-xs text-zinc-500 mt-1">
                  This is the correct flag that participants need to submit
                </p>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-3 pt-4 border-t border-zinc-800">
                <Dialog.Close className="px-4 py-2 text-sm text-zinc-400 hover:text-zinc-300 transition">
                  Cancel
                </Dialog.Close>
                <button
                  onClick={handleCreateChallenge}
                  className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium transition"
                >
                  Create Challenge
                </button>
              </div>
            </div>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>

      {/* Search and Filter */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4">
        <div className="flex items-center gap-3 mb-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
            <input
              type="text"
              placeholder="Search challenges..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-zinc-800 border border-zinc-700 rounded-lg pl-10 pr-4 py-2 text-sm text-zinc-100 placeholder-zinc-500 outline-none focus:border-zinc-600"
            />
          </div>
          <button className="p-2 bg-zinc-800 hover:bg-zinc-700 rounded-lg transition">
            <Filter className="w-4 h-4 text-zinc-400" />
          </button>
        </div>

        <Tabs.Root value={selectedTab} onValueChange={setSelectedTab}>
          <Tabs.List className="flex gap-1 bg-zinc-800/50 rounded-lg p-1">
            <Tabs.Trigger
              value="all"
              className="flex-1 px-4 py-2 text-sm font-medium text-zinc-400 rounded-lg data-[state=active]:bg-zinc-800 data-[state=active]:text-zinc-100 transition"
            >
              All
            </Tabs.Trigger>
            <Tabs.Trigger
              value="easy"
              className="flex-1 px-4 py-2 text-sm font-medium text-zinc-400 rounded-lg data-[state=active]:bg-zinc-800 data-[state=active]:text-zinc-100 transition"
            >
              Easy
            </Tabs.Trigger>
            <Tabs.Trigger
              value="medium"
              className="flex-1 px-4 py-2 text-sm font-medium text-zinc-400 rounded-lg data-[state=active]:bg-zinc-800 data-[state=active]:text-zinc-100 transition"
            >
              Medium
            </Tabs.Trigger>
            <Tabs.Trigger
              value="hard"
              className="flex-1 px-4 py-2 text-sm font-medium text-zinc-400 rounded-lg data-[state=active]:bg-zinc-800 data-[state=active]:text-zinc-100 transition"
            >
              Hard
            </Tabs.Trigger>
            <Tabs.Trigger
              value="solved"
              className="flex-1 px-4 py-2 text-sm font-medium text-zinc-400 rounded-lg data-[state=active]:bg-zinc-800 data-[state=active]:text-zinc-100 transition"
            >
              Solved
            </Tabs.Trigger>
          </Tabs.List>
        </Tabs.Root>
      </div>

      {/* Challenges Grid */}
      <div className="grid md:grid-cols-2 gap-4">
        {filteredChallenges.map((challenge) => {
          const isSolved = solvedChallenges.has(challenge.id);

          return (
            <div
              key={challenge.id}
              className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 hover:border-zinc-700 transition"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <h3 className="font-semibold text-zinc-100">
                      {challenge.title}
                    </h3>
                    {isSolved ? (
                      <Trophy className="w-4 h-4 text-yellow-500" />
                    ) : (
                      <Lock className="w-4 h-4 text-zinc-500" />
                    )}
                  </div>
                  <p className="text-sm text-zinc-400 mb-3">
                    {challenge.description}
                  </p>

                  <div className="flex flex-wrap gap-2 mb-3">
                    <span
                      className={`px-2 py-1 text-xs font-medium rounded border ${getDifficultyColor(
                        challenge.difficulty
                      )}`}
                    >
                      {challenge.difficulty}
                    </span>
                    <span className="px-2 py-1 text-xs bg-zinc-800 text-zinc-400 rounded border border-zinc-700">
                      {challenge.category}
                    </span>
                  </div>

                  <div className="flex items-center gap-4 text-xs text-zinc-500 mb-3">
                    <div className="flex items-center gap-1">
                      <Award className="w-3 h-3" />
                      {challenge.points} pts
                    </div>
                    <div className="flex items-center gap-1">
                      <Trophy className="w-3 h-3" />
                      {challenge.solves} solves
                    </div>
                  </div>

                  <button
                    onClick={() => setSelectedChallenge(challenge)}
                    className="w-full px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition text-sm"
                  >
                    {isSolved ? "View Solution" : "Start Challenge"}
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {filteredChallenges.length === 0 && (
        <div className="text-center py-12 text-zinc-500">
          <Flag className="w-12 h-12 mx-auto mb-3 opacity-50" />
          <p>No challenges found</p>
        </div>
      )}

      {/* Challenge Dialog */}
      <Dialog.Root
        open={!!selectedChallenge}
        onOpenChange={(open) => !open && setSelectedChallenge(null)}
      >
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50" />
          <Dialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-zinc-900 border border-zinc-800 rounded-xl p-6 w-full max-w-2xl z-50 max-h-[80vh] overflow-y-auto">
            {selectedChallenge && (
              <>
                <Dialog.Title className="text-xl font-bold text-zinc-100 mb-4 flex items-center gap-2">
                  {selectedChallenge.title}
                  {solvedChallenges.has(selectedChallenge.id) && (
                    <Trophy className="w-5 h-5 text-yellow-500" />
                  )}
                </Dialog.Title>

                <div className="space-y-4">
                  <div>
                    <p className="text-zinc-400 mb-4">
                      {selectedChallenge.description}
                    </p>

                    <div className="flex flex-wrap gap-2 mb-4">
                      <span
                        className={`px-2 py-1 text-xs font-medium rounded border ${getDifficultyColor(
                          selectedChallenge.difficulty
                        )}`}
                      >
                        {selectedChallenge.difficulty}
                      </span>
                      <span className="px-2 py-1 text-xs bg-zinc-800 text-zinc-400 rounded border border-zinc-700">
                        {selectedChallenge.category}
                      </span>
                      <span className="px-2 py-1 text-xs bg-zinc-800 text-zinc-400 rounded border border-zinc-700">
                        {selectedChallenge.points} points
                      </span>
                    </div>
                  </div>

                  <div className="bg-zinc-800 rounded-lg p-4 mb-4">
                    <p className="text-sm text-zinc-400 mb-2">
                      Challenge Files:
                    </p>
                    <button className="text-sm text-blue-400 hover:text-blue-300 transition">
                      Download challenge.zip
                    </button>
                  </div>

                  <div>
                    <label className="text-sm text-zinc-400 mb-2 block">
                      Submit Flag:
                    </label>
                    <div className="flex gap-2">
                      <input
                        type="text"
                        value={flagInput}
                        onChange={(e) => setFlagInput(e.target.value)}
                        placeholder="flag{...}"
                        className="flex-1 bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2 text-zinc-100 placeholder-zinc-500 outline-none focus:border-zinc-600"
                      />
                      <button
                        onClick={handleSubmitFlag}
                        className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition"
                      >
                        Submit
                      </button>
                    </div>
                  </div>

                  <Dialog.Close asChild>
                    <button className="w-full px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded-lg transition">
                      Close
                    </button>
                  </Dialog.Close>
                </div>
              </>
            )}
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </div>
  );
}
