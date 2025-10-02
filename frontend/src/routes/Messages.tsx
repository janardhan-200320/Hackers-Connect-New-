import { useState } from "react";
import { Search, Send, MoreVertical, Phone, Video } from "lucide-react";
import * as Avatar from "@radix-ui/react-avatar";
import * as ScrollArea from "@radix-ui/react-scroll-area";
import { mockUsers } from "@/lib/mockData";

type Message = {
  id: string;
  senderId: string;
  content: string;
  timestamp: string;
};

export default function Messages() {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedUser, setSelectedUser] = useState(mockUsers[1]);
  const [messageInput, setMessageInput] = useState("");

  // Mock conversations
  const conversations = mockUsers.filter((_, i) => i !== 0);

  // Mock messages for selected user
  const [messages] = useState<Message[]>([
    {
      id: "1",
      senderId: selectedUser.id,
      content: "Hey! Did you see the new CTF challenge?",
      timestamp: new Date(Date.now() - 3600000).toISOString(),
    },
    {
      id: "2",
      senderId: mockUsers[0].id,
      content: "Yes! I'm working on it right now. The crypto part is tricky.",
      timestamp: new Date(Date.now() - 3500000).toISOString(),
    },
    {
      id: "3",
      senderId: selectedUser.id,
      content: "Want to team up? I think I found something interesting.",
      timestamp: new Date(Date.now() - 3400000).toISOString(),
    },
    {
      id: "4",
      senderId: mockUsers[0].id,
      content: "Sure! Let me share my findings with you.",
      timestamp: new Date(Date.now() - 3300000).toISOString(),
    },
  ]);

  const filteredConversations = conversations.filter(
    (user) =>
      user.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      user.username.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffHours = Math.floor(diffMs / 3600000);

    if (diffHours < 1) return "Just now";
    if (diffHours < 24) return `${diffHours}h ago`;
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
  };

  const handleSendMessage = () => {
    if (messageInput.trim()) {
      alert(`Message sent: ${messageInput}`);
      setMessageInput("");
    }
  };

  return (
    <div className="flex h-[calc(100vh-4rem)] max-w-7xl mx-auto">
      {/* Conversations Sidebar */}
      <div className="w-80 bg-zinc-900 border-r border-zinc-800 flex flex-col">
        <div className="p-4 border-b border-zinc-800">
          <h2 className="text-xl font-bold text-zinc-100 mb-3">Messages</h2>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
            <input
              type="text"
              placeholder="Search conversations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-zinc-800 border border-zinc-700 rounded-lg pl-10 pr-4 py-2 text-sm text-zinc-100 placeholder-zinc-500 outline-none focus:border-zinc-600"
            />
          </div>
        </div>

        <ScrollArea.Root className="flex-1">
          <ScrollArea.Viewport className="h-full">
            <div className="divide-y divide-zinc-800">
              {filteredConversations.map((user) => (
                <button
                  key={user.id}
                  onClick={() => setSelectedUser(user)}
                  className={`w-full p-4 flex gap-3 hover:bg-zinc-800/50 transition text-left ${
                    selectedUser.id === user.id ? "bg-zinc-800/50" : ""
                  }`}
                >
                  <Avatar.Root className="w-12 h-12 rounded-full overflow-hidden flex-shrink-0">
                    <Avatar.Image src={user.avatar} />
                    <Avatar.Fallback className="bg-zinc-700 flex items-center justify-center text-zinc-300 font-medium">
                      {user.fullName[0]}
                    </Avatar.Fallback>
                  </Avatar.Root>

                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <span className="font-medium text-zinc-100 text-sm truncate">
                        {user.fullName}
                      </span>
                      <span className="text-xs text-zinc-500">2h</span>
                    </div>
                    <p className="text-xs text-zinc-500 truncate">
                      Last message preview...
                    </p>
                  </div>
                </button>
              ))}
            </div>
          </ScrollArea.Viewport>
          <ScrollArea.Scrollbar orientation="vertical">
            <ScrollArea.Thumb />
          </ScrollArea.Scrollbar>
        </ScrollArea.Root>
      </div>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col bg-zinc-950">
        {/* Chat Header */}
        <div className="p-4 bg-zinc-900 border-b border-zinc-800 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Avatar.Root className="w-10 h-10 rounded-full overflow-hidden">
              <Avatar.Image src={selectedUser.avatar} />
              <Avatar.Fallback className="bg-zinc-700 flex items-center justify-center text-zinc-300 font-medium">
                {selectedUser.fullName[0]}
              </Avatar.Fallback>
            </Avatar.Root>
            <div>
              <h3 className="font-semibold text-zinc-100">
                {selectedUser.fullName}
              </h3>
              <p className="text-xs text-zinc-500">@{selectedUser.username}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button className="p-2 hover:bg-zinc-800 rounded-lg transition">
              <Phone className="w-5 h-5 text-zinc-400" />
            </button>
            <button className="p-2 hover:bg-zinc-800 rounded-lg transition">
              <Video className="w-5 h-5 text-zinc-400" />
            </button>
            <button className="p-2 hover:bg-zinc-800 rounded-lg transition">
              <MoreVertical className="w-5 h-5 text-zinc-400" />
            </button>
          </div>
        </div>

        {/* Messages */}
        <ScrollArea.Root className="flex-1">
          <ScrollArea.Viewport className="h-full p-4">
            <div className="space-y-4">
              {messages.map((message) => {
                const isCurrentUser = message.senderId === mockUsers[0].id;
                const sender = isCurrentUser ? mockUsers[0] : selectedUser;

                return (
                  <div
                    key={message.id}
                    className={`flex gap-3 ${
                      isCurrentUser ? "flex-row-reverse" : ""
                    }`}
                  >
                    <Avatar.Root className="w-8 h-8 rounded-full overflow-hidden flex-shrink-0">
                      <Avatar.Image src={sender.avatar} />
                      <Avatar.Fallback className="bg-zinc-700 flex items-center justify-center text-zinc-300 text-sm font-medium">
                        {sender.fullName[0]}
                      </Avatar.Fallback>
                    </Avatar.Root>

                    <div
                      className={`flex flex-col ${
                        isCurrentUser ? "items-end" : "items-start"
                      }`}
                    >
                      <div
                        className={`px-4 py-2 rounded-lg max-w-md ${
                          isCurrentUser
                            ? "bg-blue-600 text-white"
                            : "bg-zinc-800 text-zinc-100"
                        }`}
                      >
                        <p className="text-sm">{message.content}</p>
                      </div>
                      <span className="text-xs text-zinc-500 mt-1">
                        {formatTime(message.timestamp)}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          </ScrollArea.Viewport>
          <ScrollArea.Scrollbar orientation="vertical">
            <ScrollArea.Thumb />
          </ScrollArea.Scrollbar>
        </ScrollArea.Root>

        {/* Message Input */}
        <div className="p-4 bg-zinc-900 border-t border-zinc-800">
          <div className="flex gap-2">
            <input
              type="text"
              value={messageInput}
              onChange={(e) => setMessageInput(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
              placeholder="Type a message..."
              className="flex-1 bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2 text-sm text-zinc-100 placeholder-zinc-500 outline-none focus:border-zinc-600"
            />
            <button
              onClick={handleSendMessage}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition flex items-center gap-2"
            >
              <Send className="w-4 h-4" />
              Send
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
