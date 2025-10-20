import {
  Outlet,
  Link,
  useLocation,
  useNavigate,
} from "react-router-dom";
import {
  Bell,
  Home,
  Users,
  Calendar,
  Trophy,
  MessageSquare,
  Search,
  Menu,
  Target,
} from "lucide-react";
import { Toaster } from "sonner";
import * as Avatar from "@radix-ui/react-avatar";
import * as DropdownMenu from "@radix-ui/react-dropdown-menu";
import * as Tooltip from "@radix-ui/react-tooltip";
import { useState } from "react";
import { mockUsers, mockNotifications } from "./lib/mockData";
import { PostProvider, usePost } from "./contexts/PostContext";
import { ChallengeProvider, useChallenge } from "./contexts/ChallengeContext";
import { ScoreProvider } from "./contexts/ScoreContext";
import { removeAuthToken } from "./utils/auth";

// This is the main UI layout for authenticated users.
// It renders the child routes (like Feed, Profile, etc.) via the <Outlet /> component.
const AppContent = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const { openCreatePost } = usePost();
  const { openStartChallenge } = useChallenge();

  // TODO: Replace this with a function to fetch the current user's data
  const currentUser = mockUsers[0];

  const handleLogout = () => {
    removeAuthToken(); // Clear the token from storage
    navigate("/auth"); // Redirect to the login page defined in main.tsx
  };

  const navItems = [
    { path: "/app", icon: Home, label: "Feed" },
    { path: "/app/groups", icon: Users, label: "Groups" },
    { path: "/app/events", icon: Calendar, label: "Events" },
    { path: "/app/ctf", icon: Trophy, label: "CTF" },
    { path: "/app/scoreboard", icon: Target, label: "Scoreboard" },
    { path: "/app/messages", icon: MessageSquare, label: "Messages" },
  ];

  // Check if the current path is exactly the base app path for the 'Feed' link
  const isFeedActive = location.pathname === "/app";

  return (
    <Tooltip.Provider>
      <div className="min-h-screen bg-zinc-950">
        <Toaster position="top-right" richColors />

        {/* Top Navigation */}
        <nav className="fixed top-0 left-0 right-0 z-50 bg-zinc-900/95 backdrop-blur-sm border-b border-zinc-800">
          <div className="max-w-[1600px] mx-auto px-2 sm:px-4 h-14 sm:h-16 flex items-center justify-between">
            {/* Left side */}
            <div className="flex items-center gap-2 sm:gap-6">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="lg:hidden p-1.5 sm:p-2 hover:bg-zinc-800 rounded-lg transition"
              >
                <Menu className="w-4 h-4 sm:w-5 sm:h-5" />
              </button>

              <Link to="/app" className="flex items-center gap-2">
                <div className="w-6 h-6 sm:w-8 sm:h-8 bg-gradient-to-br from-green-400 to-emerald-500 rounded-lg flex items-center justify-center">
                  <span className="text-zinc-950 font-bold text-xs sm:text-sm">HC</span>
                </div>
                <span className="hidden sm:block text-base sm:text-lg font-bold text-zinc-100 neon-text">
                  Hackers Connect
                </span>
              </Link>

              {/* Desktop Navigation */}
              <div className="hidden md:flex items-center gap-1">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  // Special check for Feed, otherwise check if path starts with item's path
                  const isActive = item.path === "/app" ? isFeedActive : location.pathname.startsWith(item.path);
                  return (
                    <Link
                      key={item.path}
                      to={item.path}
                      className={`flex items-center gap-2 px-3 sm:px-4 py-2 rounded-lg transition text-sm ${
                        isActive
                          ? "bg-zinc-800 text-green-400 neon-text border border-green-500/20"
                          : "text-zinc-400 hover:text-green-400 hover:bg-zinc-800/50 neon-border"
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      <span className="text-sm font-medium">{item.label}</span>
                    </Link>
                  );
                })}
              </div>
            </div>

            {/* Right side */}
            <div className="flex items-center gap-3">
              {/* Search */}
              <div className="hidden sm:flex items-center gap-2 bg-zinc-800 rounded-lg px-3 py-2 w-64 neon-border">
                <Search className="w-4 h-4 text-green-400" />
                <input
                  type="text"
                  placeholder="Search hackers..."
                  className="bg-transparent border-none outline-none text-sm text-zinc-100 placeholder-zinc-500 w-full focus:placeholder-green-400 transition"
                />
              </div>

              {/* Notifications */}
              <DropdownMenu.Root>
                <DropdownMenu.Trigger asChild>
                  <button className="relative p-2 hover:bg-zinc-800 rounded-lg transition neon-border">
                    <Bell className="w-5 h-5 text-green-400" />
                    <span className="absolute top-1 right-1 w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                  </button>
                </DropdownMenu.Trigger>
                <DropdownMenu.Portal>
                  <DropdownMenu.Content
                    className="w-80 bg-zinc-900 border border-green-500/20 rounded-xl shadow-xl p-2 z-50 neon-border"
                    sideOffset={5}
                  >
                    <div className="px-3 py-2 border-b border-zinc-800 mb-2">
                      <h3 className="font-semibold text-sm text-zinc-100 neon-text">
                        🔔 Notifications
                      </h3>
                    </div>
                    {mockNotifications.map((notif) => (
                      <DropdownMenu.Item
                        key={notif.id}
                        className="flex items-start gap-3 px-3 py-2 rounded-lg hover:bg-zinc-800 cursor-pointer outline-none"
                      >
                        <Avatar.Root className="w-10 h-10 rounded-full overflow-hidden">
                          <Avatar.Image src={notif.user.avatar} />
                          <Avatar.Fallback className="bg-zinc-700">
                            {notif.user.username[0]}
                          </Avatar.Fallback>
                        </Avatar.Root>
                        <div className="flex-1">
                          <p className="text-sm text-zinc-300">
                            <span className="font-semibold text-zinc-100">
                              {notif.user.username}
                            </span>{" "}
                            {notif.content}
                          </p>
                          <p className="text-xs text-zinc-500 mt-1">
                            {new Date(notif.timestamp).toLocaleTimeString()}
                          </p>
                        </div>
                        {!notif.read && (
                          <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                        )}
                      </DropdownMenu.Item>
                    ))}
                  </DropdownMenu.Content>
                </DropdownMenu.Portal>
              </DropdownMenu.Root>

              {/* User Menu */}
              <DropdownMenu.Root>
                <DropdownMenu.Trigger asChild>
                  <button className="flex items-center gap-2 p-1 hover:bg-zinc-800 rounded-lg transition">
                    <Avatar.Root className="w-8 h-8 rounded-full overflow-hidden">
                      <Avatar.Image src={currentUser.avatar} />
                      <Avatar.Fallback className="bg-zinc-700">
                        {currentUser.username[0]}
                      </Avatar.Fallback>
                    </Avatar.Root>
                  </button>
                </DropdownMenu.Trigger>
                <DropdownMenu.Portal>
                  <DropdownMenu.Content
                    className="w-56 bg-zinc-900 border border-zinc-800 rounded-xl shadow-xl p-2 z-50"
                    sideOffset={5}
                  >
                    <div className="px-3 py-2 border-b border-zinc-800 mb-2">
                      <p className="font-semibold text-sm text-zinc-100">
                        {currentUser.fullName}
                      </p>
                      <p className="text-xs text-zinc-500">
                        @{currentUser.username}
                      </p>
                    </div>
                    <DropdownMenu.Item asChild>
                      <Link
                        to={`/app/profile/${currentUser.username}`}
                        className="flex items-center gap-2 px-3 py-2 text-sm text-zinc-300 hover:bg-zinc-800 rounded-lg cursor-pointer outline-none"
                      >
                        Profile
                      </Link>
                    </DropdownMenu.Item>
                    <DropdownMenu.Item className="flex items-center gap-2 px-3 py-2 text-sm text-zinc-300 hover:bg-zinc-800 rounded-lg cursor-pointer outline-none">
                      Settings
                    </DropdownMenu.Item>
                    <DropdownMenu.Separator className="h-px bg-zinc-800 my-2" />
                    <DropdownMenu.Item
                      onClick={handleLogout}
                      className="flex items-center gap-2 px-3 py-2 text-sm text-red-400 hover:bg-zinc-800 rounded-lg cursor-pointer outline-none"
                    >
                      Logout
                    </DropdownMenu.Item>
                  </DropdownMenu.Content>
                </DropdownMenu.Portal>
              </DropdownMenu.Root>
            </div>
          </div>
        </nav>

        {/* Main Content Area */}
        <div className="pt-14 sm:pt-16">
          <div className="max-w-[1600px] mx-auto flex">
            {/* Sidebar - Hidden on mobile */}
            <aside
              className={`${
                sidebarOpen ? "translate-x-0" : "-translate-x-full"
              } lg:translate-x-0 fixed lg:sticky top-14 sm:top-16 left-0 w-64 h-[calc(100vh-3.5rem)] sm:h-[calc(100vh-4rem)] bg-zinc-900 border-r border-zinc-800 p-3 sm:p-4 overflow-y-auto transition-transform z-40`}
            >
              {/* User Stats */}
              <div className="bg-zinc-800/50 rounded-xl p-4 mb-4">
                <div className="flex items-center gap-3 mb-3">
                  <Avatar.Root className="w-12 h-12 rounded-full overflow-hidden">
                    <Avatar.Image src={currentUser.avatar} />
                    <Avatar.Fallback className="bg-zinc-700">
                      {currentUser.username[0]}
                    </Avatar.Fallback>
                  </Avatar.Root>
                  <div>
                    <p className="font-semibold text-sm text-zinc-100">
                      {currentUser.username}
                    </p>
                    <p className="text-xs text-zinc-500">
                      Reputation: {currentUser.reputation}
                    </p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-2 text-center">
                  <div className="bg-zinc-900 rounded-lg p-2">
                    <p className="text-lg font-bold text-zinc-100">
                      {currentUser.followers}
                    </p>
                    <p className="text-xs text-zinc-500">Followers</p>
                  </div>
                  <div className="bg-zinc-900 rounded-lg p-2">
                    <p className="text-lg font-bold text-zinc-100">
                      {currentUser.following}
                    </p>
                    <p className="text-xs text-zinc-500">Following</p>
                  </div>
                </div>
              </div>

              {/* Mobile Navigation */}
              <div className="lg:hidden space-y-1 mb-4">
                {navItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = location.pathname === item.path;
                  return (
                    <Link
                      key={item.path}
                      to={item.path}
                      onClick={() => setSidebarOpen(false)}
                      className={`flex items-center gap-3 px-3 py-2 rounded-lg transition ${
                        isActive
                          ? "bg-zinc-800 text-zinc-100"
                          : "text-zinc-400 hover:text-zinc-100 hover:bg-zinc-800/50"
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      <span className="text-sm font-medium">{item.label}</span>
                    </Link>
                  );
                })}
              </div>

              {/* Trending */}
              <div className="mb-4">
                <h3 className="text-xs font-semibold text-zinc-400 uppercase tracking-wide mb-3">
                  Trending Topics
                </h3>
                <div className="space-y-2">
                  {["#CTF2025", "#WebSecurity", "#ZeroDay", "#BugBounty"].map(
                    (tag) => (
                      <button
                        key={tag}
                        className="block w-full text-left px-3 py-2 text-sm text-zinc-300 hover:bg-zinc-800/50 rounded-lg transition"
                      >
                        {tag}
                      </button>
                    )
                  )}
                </div>
              </div>

              {/* Suggested Users */}
              <div>
                <h3 className="text-xs font-semibold text-zinc-400 uppercase tracking-wide mb-3">
                  Suggested Connections
                </h3>
                <div className="space-y-3">
                  {mockUsers.slice(1, 4).map((user) => (
                    <div key={user.id} className="flex items-center gap-2">
                      <Avatar.Root className="w-8 h-8 rounded-full overflow-hidden">
                        <Avatar.Image src={user.avatar} />
                        <Avatar.Fallback className="bg-zinc-700">
                          {user.username[0]}
                        </Avatar.Fallback>
                      </Avatar.Root>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-zinc-200 truncate">
                          {user.username}
                        </p>
                        <p className="text-xs text-zinc-500 truncate">
                          {user.reputation} rep
                        </p>
                      </div>
                      <button className="px-2 py-1 text-xs bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded transition">
                        Follow
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </aside>

            {/* Main Content - This renders the child routes defined in main.tsx */}
            <main className="flex-1 min-w-0 lg:ml-0 ml-0">
              <Outlet />
            </main>

            {/* Right Sidebar - Optional, hidden on smaller screens */}
            <aside className="hidden xl:block w-80 h-[calc(100vh-4rem)] sticky top-16 p-4 overflow-y-auto">
              {/* Quick Actions */}
              <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 mb-4">
                <h3 className="text-sm font-semibold text-zinc-100 mb-3">
                  Quick Actions
                </h3>
                <div className="space-y-2">
                  <button
                    onClick={openCreatePost}
                    className="w-full px-3 py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-100 text-sm rounded-lg transition"
                  >
                    Create Post
                  </button>
                  <button
                    onClick={openStartChallenge}
                    className="w-full px-3 py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-100 text-sm rounded-lg transition"
                  >
                    Start Challenge
                  </button>
                </div>
              </div>

              {/* Footer */}
              <div className="text-xs text-zinc-500 space-y-2">
                <div className="flex flex-wrap gap-2">
                  <a href="#" className="hover:text-zinc-400">
                    About
                  </a>
                  <a href="#" className="hover:text-zinc-400">
                    Help
                  </a>
                  <a href="#" className="hover:text-zinc-400">
                    Privacy
                  </a>
                  <a href="#" className="hover:text-zinc-400">
                    Terms
                  </a>
                </div>
                <p>© 2025 Hackers Connect</p>
              </div>
            </aside>
          </div>
        </div>
      </div>
    </Tooltip.Provider>
  );
};

// This is the main export. It wraps the UI with your context providers.
export default function App() {
  return (
    <PostProvider>
      <ChallengeProvider>
        <ScoreProvider>
          <AppContent />
        </ScoreProvider>
      </ChallengeProvider>
    </PostProvider>
  );
}