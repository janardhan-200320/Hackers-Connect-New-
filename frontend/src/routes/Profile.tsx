import * as React from "react";

// --- CSS STYLES ---
// All CSS is placed in this template literal to be injected via a <style> tag.
const globalStyles = `
  /* Import a cool hacker-style font from Google Fonts */
  @import url('https://fonts.googleapis.com/css2?family=Share+Tech+Mono&display=swap');

  /* Basic setup for the dark theme */
  body {
    background-color: #09090b;
    color: #e0e0e0;
    font-family: 'Share Tech Mono', monospace;
    overflow-x: hidden;
  }

  /* The main container for the app layout */
  .app-container {
    display: grid;
    grid-template-columns: 250px 1fr 250px;
    gap: 1.5rem;
    padding: 1rem;
    max-width: 1400px;
    margin: 0 auto;
  }

  .main-content {
    width: 100%;
  }

  /* Custom panel styling from your screenshot */
  .cyber-panel {
    background: rgba(24, 24, 27, 0.5); /* Semi-transparent zinc */
    border: 1px solid rgba(161, 161, 170, 0.3);
    border-radius: 1rem;
    padding: 1rem;
    backdrop-filter: blur(5px);
    -webkit-backdrop-filter: blur(5px);
    transition: all 0.3s ease;
  }

  .cyber-panel:hover {
    border-color: rgba(161, 161, 170, 0.6);
    box-shadow: 0 0 15px rgba(161, 161, 170, 0.2);
  }

  /* Glitch Text Animation */
  .glitch-text {
    position: relative;
    color: #a1a1aa;
    animation: glitch-skew 1s infinite linear alternate-reverse;
  }

  .glitch-text::before,
  .glitch-text::after {
    content: attr(data-text); /* Use data-text attribute for the text */
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: #09090b; /* Match body background */
  }

  .glitch-text::before {
    left: 2px;
    text-shadow: -2px 0 #71717a;
    clip: rect(44px, 450px, 56px, 0);
    animation: glitch-anim 5s infinite linear alternate-reverse;
  }

  .glitch-text::after {
    left: -2px;
    text-shadow: -2px 0 #d4d4d8, 2px 2px #71717a;
    clip: rect(85px, 450px, 90px, 0);
    animation: glitch-anim2 5s infinite linear alternate-reverse;
  }

  @keyframes glitch-skew {
    0% { transform: skew(0deg); }
    10% { transform: skew(1deg); }
    20% { transform: skew(-1deg); }
    30% { transform: skew(2deg); }
    40% { transform: skew(-2deg); }
    50% { transform: skew(0deg); }
    100% { transform: skew(0deg); }
  }

  @keyframes glitch-anim {
    0% { clip: rect(42px, 9999px, 44px, 0); }
    5% { clip: rect(12px, 9999px, 60px, 0); }
    100% { clip: rect(5px, 9999px, 95px, 0); }
  }

  @keyframes glitch-anim2 {
    0% { clip: rect(78px, 9999px, 100px, 0); }
    5% { clip: rect(33px, 9999px, 45px, 0); }
    100% { clip: rect(65px, 9999px, 80px, 0); }
  }
`;

// --- TYPES AND MOCK DATA ---
type Profile = {
  username: string;
  full_name: string | null;
  bio: string | null;
  website: string | null;
  avatar_url: string | null;
  followers_count: number;
  following_count: number;
  posts_count: number;
};

const mockProfile: Profile = {
  username: "hacker123",
  full_name: "Jane Doe",
  bio: "Ethical hacker and open source fan",
  website: "https://janedoe.dev",
  avatar_url: null,
  followers_count: 1337,
  following_count: 200,
  posts_count: 45,
};

// --- PROFILE-SPECIFIC COMPONENTS ---

const AvatarCircle: React.FC<{
  src?: string | null;
  name?: string | null;
  onClick?: () => void;
}> = ({ src, name, onClick }) => {
  const initial = (name ?? "").trim().charAt(0).toUpperCase() || "?";
  return (
    <button
      onClick={onClick}
      aria-label="Edit avatar"
      className="relative rounded-full ring-1 ring-zinc-500/30 hover:ring-zinc-400/60 transition"
      style={{ width: 72, height: 72 }}
    >
      {src ? (
        <img
          src={src}
          alt={name ?? "avatar"}
          className="w-full h-full rounded-full object-cover"
        />
      ) : (
        <div className="w-full h-full rounded-full bg-emerald-800 text-white grid place-items-center text-xl">
          {initial}
        </div>
      )}
      <span className="pointer-events-none absolute bottom-0 right-0 translate-x-1 translate-y-1 bg-black/70 text-white text-[10px] px-1 py-0.5 rounded">
        ✎
      </span>
    </button>
  );
};

const ProfileEditor: React.FC<{
  initial: Omit<Profile, "followers_count" | "following_count" | "posts_count">;
  onClose: () => void;
  onSaved: (
    p: Omit<Profile, "followers_count" | "following_count" | "posts_count">
  ) => void;
}> = ({ initial, onClose, onSaved }) => {
  const [form, setForm] = React.useState({ ...initial });
  const [saving, setSaving] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const validate = () => {
    if (!/^[a-z0-9_.]{3,30}$/.test(form.username))
      return "Username must be 3–30 chars lowercase, digits, _, or .";
    if (form.website && !/^https?:\/\//i.test(form.website))
      return "Website must start with http:// or https://";
    return null;
  };

  const save = () => {
    const v = validate();
    if (v) {
      setError(v);
      return;
    }
    setSaving(true);
    setTimeout(() => {
      onSaved(form);
      setSaving(false);
      onClose();
    }, 1000);
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 grid place-items-center bg-black/80 backdrop-blur-sm p-4 z-50"
    >
      <div className="w-full max-w-lg rounded-2xl border border-zinc-400/30 bg-[#0d1a1a] p-4 shadow-2xl shadow-zinc-500/20">
        <h3 className="glitch-text text-lg mb-3" data-text="Edit Profile">
          Edit Profile
        </h3>
        <div className="grid gap-3">
          {/* Form fields here, e.g., Username */}
          <label className="grid gap-1">
            <span className="text-xs opacity-80">Username</span>
            <input
              value={form.username}
              onChange={(e) =>
                setForm((x) => ({
                  ...x,
                  username: e.target.value.trim().toLowerCase(),
                }))
              }
              className="px-3 py-2 rounded-md bg-black/40 border border-zinc-400/30 focus:ring-1 focus:ring-zinc-400 focus:outline-none"
              placeholder="username"
            />
          </label>
          {/* Add other form fields (Full Name, Bio, Website) here as needed */}
        </div>
        {error ? <p className="mt-3 text-sm text-red-400">{error}</p> : null}
        <div className="mt-4 flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-3 py-1 rounded-md border border-zinc-400/30 hover:bg-white/10 transition"
          >
            Cancel
          </button>
          <button
            onClick={save}
            disabled={saving}
            className="px-3 py-1 rounded-md bg-zinc-600 hover:bg-zinc-700 disabled:opacity-50 transition"
          >
            {saving ? "Saving…" : "Save"}
          </button>
        </div>
      </div>
    </div>
  );
};

const ProfileActions: React.FC<{
  followed: boolean;
  onToggleFollow: () => void;
}> = ({ followed, onToggleFollow }) => (
  <button
    onClick={onToggleFollow}
    className={`px-3 py-1 rounded-md transition ${
      followed ? "bg-red-600 hover:bg-red-700" : "bg-zinc-600 hover:bg-zinc-700"
    } text-white`}
  >
    {followed ? "Unfollow" : "Follow"}
  </button>
);

const ProfilePage = () => {
  const [profile, setProfile] = React.useState<Profile>(mockProfile);
  const [editing, setEditing] = React.useState(false);
  const [followed, setFollowed] = React.useState(false);

  return (
    <div className="space-y-6">
      <div className="cyber-panel p-4">
        <div className="flex items-start gap-4">
          <AvatarCircle
            src={profile.avatar_url ?? undefined}
            name={profile.full_name ?? profile.username}
            onClick={() => setEditing(true)}
          />
          <div className="flex-1">
            <div className="flex items-center justify-between">
              <h2 className="text-xl glitch-text" data-text={profile.username}>
                @{profile.username}
              </h2>
              <div className="flex items-center gap-2">
                <ProfileActions
                  followed={followed}
                  onToggleFollow={() => setFollowed((f) => !f)}
                />
                <button
                  onClick={() => setEditing(true)}
                  className="px-3 py-1 rounded-md border border-zinc-400/30 hover:bg-white/10 transition"
                >
                  Edit Profile
                </button>
              </div>
            </div>
            <div className="mt-4 flex space-x-6 text-sm">
              <span>
                <strong className="text-white">
                  {profile.posts_count.toLocaleString()}
                </strong>{" "}
                Posts
              </span>
              <span>
                <strong className="text-white">
                  {profile.followers_count.toLocaleString()}
                </strong>{" "}
                Followers
              </span>
              <span>
                <strong className="text-white">
                  {profile.following_count.toLocaleString()}
                </strong>{" "}
                Following
              </span>
            </div>
            <div className="mt-4">
              {profile.full_name && (
                <div className="font-bold text-lg text-white">
                  {profile.full_name}
                </div>
              )}
              {profile.bio && (
                <p className="opacity-80 text-sm mt-1">{profile.bio}</p>
              )}
              {profile.website && (
                <a
                  href={profile.website}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-1 inline-block text-sm text-zinc-300 hover:underline"
                >
                  {profile.website}
                </a>
              )}
            </div>
            <div className="mt-3 text-sm">
              <strong>Badges:</strong>{" "}
              <span className="text-zinc-300 font-bold bg-zinc-500/20 px-2 py-1 rounded">
                Hacker Badge
              </span>
            </div>
          </div>
        </div>
      </div>
      <div className="cyber-panel p-4 text-sm text-gray-400">
        Posts will appear here.
      </div>
      {editing && (
        <ProfileEditor
          initial={profile}
          onClose={() => setEditing(false)}
          onSaved={(p) => setProfile((prev) => ({ ...prev, ...p }))}
        />
      )}
    </div>
  );
};

// --- LAYOUT COMPONENTS ---

const AppHeader: React.FC = () => (
  <header className="cyber-panel mb-6 col-span-3">
    <div className="flex justify-between items-center">
      <h1
        className="text-2xl font-bold glitch-text"
        data-text="> Hackers Connect"
      >
        &gt; Hackers Connect
      </h1>
      <nav className="flex space-x-4 text-sm">
        {[
          "Feed",
          "Groups",
          "Events",
          "Market",
          "CTF",
          "My Profile",
          "Access",
          "About",
        ].map((item) => (
          <a
            key={item}
            href="#"
            className={`px-3 py-1 rounded-md transition hover:bg-zinc-500/20 ${
              item === "My Profile"
                ? "text-zinc-300 font-bold"
                : "text-gray-400"
            }`}
          >
            {item}
          </a>
        ))}
      </nav>
    </div>
  </header>
);

const LeftSidebar: React.FC = () => (
  <aside className="cyber-panel space-y-4">
    <div>
      <h3 className="font-bold text-zinc-400 mb-2">STATUS</h3>
      <p className="text-sm p-2 bg-black/30 rounded-md">
        Guest Mode. Solve CTF to unlock.
      </p>
    </div>
    <div>
      <h3 className="font-bold text-zinc-400 mb-2">TRENDING</h3>
      <ul className="text-sm space-y-2">
        <li>&raquo; CVE-2025-XXXX POC released</li>
        <li>&raquo; New crypto CTF this weekend</li>
        <li>&raquo; Kernel hardening guide</li>
      </ul>
    </div>
  </aside>
);

const RightSidebar: React.FC = () => (
  <aside className="cyber-panel">
    <h3 className="font-bold text-zinc-400 mb-3">WHO TO FOLLOW</h3>
    <div className="space-y-3">
      {["MsRaven", "ByteBandit", "CryptoCat", "RootNova"].map((name) => (
        <div key={name} className="flex justify-between items-center text-sm">
          <span>@{name}</span>
          <button className="px-3 py-1 text-xs rounded-md bg-zinc-600 hover:bg-zinc-700 transition">
            Follow
          </button>
        </div>
      ))}
    </div>
  </aside>
);

// --- MAIN APP STRUCTURE ---

const App = () => (
  <div className="min-h-screen p-4">
    <AppHeader />
    <main className="app-container">
      <LeftSidebar />
      <div className="main-content">
        <ProfilePage />
      </div>
      <RightSidebar />
    </main>
  </div>
);

// --- EXPORTED COMPONENT ---
// This is the final component you will import into your project.
// It injects the styles and renders the full application layout.
export default function HackersConnectPage() {
  return (
    <>
      <style>{globalStyles}</style>
      <App />
    </>
  );
}
