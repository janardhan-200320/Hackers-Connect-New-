import { useState } from "react";
import { Users, Search, Lock, Globe, MessageSquare } from "lucide-react";
import * as Avatar from "@radix-ui/react-avatar";
import * as Tabs from "@radix-ui/react-tabs";
import * as Dialog from "@radix-ui/react-dialog";
import { mockGroups } from "@/lib/mockData";

export default function Groups() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTab, setSelectedTab] = useState("all");
  const [joinedGroups] = useState<Set<string>>(new Set(["1", "2"]));
  const [createDialogOpen, setCreateDialogOpen] = useState(false);

  const filteredGroups = mockGroups.filter((group) => {
    const matchesSearch =
      group.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      group.description.toLowerCase().includes(searchQuery.toLowerCase());

    if (selectedTab === "joined")
      return matchesSearch && joinedGroups.has(group.id);
    if (selectedTab === "private") return matchesSearch && group.isPrivate;
    return matchesSearch;
  });

  return (
    <div className="max-w-6xl mx-auto p-4 space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-zinc-100">Groups</h1>
          <p className="text-sm text-zinc-500">
            Connect with like-minded hackers
          </p>
        </div>
        <Dialog.Root open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
          <Dialog.Trigger asChild>
            <button className="px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-100 rounded-lg transition">
              Create Group
            </button>
          </Dialog.Trigger>
          <Dialog.Portal>
            <Dialog.Overlay className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50" />
            <Dialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-zinc-900 border border-zinc-800 rounded-xl p-6 w-full max-w-md z-50">
              <Dialog.Title className="text-xl font-bold text-zinc-100 mb-4">
                Create New Group
              </Dialog.Title>
              <div className="space-y-4">
                <input
                  type="text"
                  placeholder="Group name"
                  className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2 text-zinc-100 placeholder-zinc-500"
                />
                <textarea
                  placeholder="Description"
                  rows={3}
                  className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2 text-zinc-100 placeholder-zinc-500 resize-none"
                />
                <div className="flex gap-3">
                  <Dialog.Close asChild>
                    <button className="flex-1 px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded-lg transition">
                      Cancel
                    </button>
                  </Dialog.Close>
                  <button className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition">
                    Create
                  </button>
                </div>
              </div>
            </Dialog.Content>
          </Dialog.Portal>
        </Dialog.Root>
      </div>

      <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4">
        <div className="flex items-center gap-3 mb-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
            <input
              type="text"
              placeholder="Search groups..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-zinc-800 border border-zinc-700 rounded-lg pl-10 pr-4 py-2 text-sm text-zinc-100 placeholder-zinc-500 outline-none focus:border-zinc-600"
            />
          </div>
        </div>

        <Tabs.Root value={selectedTab} onValueChange={setSelectedTab}>
          <Tabs.List className="flex gap-1 bg-zinc-800/50 rounded-lg p-1">
            <Tabs.Trigger
              value="all"
              className="flex-1 px-4 py-2 text-sm font-medium text-zinc-400 rounded-lg data-[state=active]:bg-zinc-800 data-[state=active]:text-zinc-100 transition"
            >
              All Groups
            </Tabs.Trigger>
            <Tabs.Trigger
              value="joined"
              className="flex-1 px-4 py-2 text-sm font-medium text-zinc-400 rounded-lg data-[state=active]:bg-zinc-800 data-[state=active]:text-zinc-100 transition"
            >
              Joined
            </Tabs.Trigger>
            <Tabs.Trigger
              value="private"
              className="flex-1 px-4 py-2 text-sm font-medium text-zinc-400 rounded-lg data-[state=active]:bg-zinc-800 data-[state=active]:text-zinc-100 transition"
            >
              Private
            </Tabs.Trigger>
          </Tabs.List>
        </Tabs.Root>
      </div>

      <div className="grid md:grid-cols-2 gap-4">
        {filteredGroups.map((group) => {
          const isJoined = joinedGroups.has(group.id);

          return (
            <div
              key={group.id}
              className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 hover:border-zinc-700 transition"
            >
              <div className="flex gap-4">
                <Avatar.Root className="w-16 h-16 rounded-lg overflow-hidden flex-shrink-0">
                  <Avatar.Image src={group.avatar} />
                  <Avatar.Fallback className="bg-zinc-700 flex items-center justify-center">
                    <Users className="w-6 h-6 text-zinc-400" />
                  </Avatar.Fallback>
                </Avatar.Root>

                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between mb-2">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold text-zinc-100">
                          {group.name}
                        </h3>
                        {group.isPrivate ? (
                          <Lock className="w-3 h-3 text-zinc-500" />
                        ) : (
                          <Globe className="w-3 h-3 text-zinc-500" />
                        )}
                      </div>
                      <p className="text-xs text-zinc-500 line-clamp-2">
                        {group.description}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center justify-between mt-3">
                    <div className="flex items-center gap-4 text-xs text-zinc-500">
                      <div className="flex items-center gap-1">
                        <Users className="w-3 h-3" />
                        {group.members.toLocaleString()}
                      </div>
                      <div className="flex items-center gap-1">
                        <MessageSquare className="w-3 h-3" />
                        {group.posts}
                      </div>
                    </div>

                    {isJoined ? (
                      <button className="px-3 py-1 text-xs bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded transition">
                        Joined
                      </button>
                    ) : (
                      <button className="px-3 py-1 text-xs bg-blue-600 hover:bg-blue-700 text-white rounded transition">
                        Join
                      </button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {filteredGroups.length === 0 && (
        <div className="text-center py-12 text-zinc-500">
          <Users className="w-12 h-12 mx-auto mb-3 opacity-50" />
          <p>No groups found</p>
        </div>
      )}
    </div>
  );
}
