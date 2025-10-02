import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { Terminal, ShieldCheck, Bell, MessagesSquare, UsersRound, Calendar, ShoppingBag, Flame, Github, Twitter, Lock } from 'lucide-react'
import { Toaster, toast } from 'sonner'
import useAuth from './store/auth'
import UserProfileDropdown from './components/UserProfileDropdown'
import Profile from './routes/Profile'

export default function App() {
  const { user } = useAuth()
  const loc = useLocation()
  const nav = useNavigate()
  const [follows, setFollows] = useState<{ [key: string]: boolean }>({})

  useEffect(() => {
    if (!user) {
      toast('CTF Access Required', { description: 'Solve the challenges to unlock registration.' })
    }
  }, [user])

  const toggleFollow = (name: string) => {
    setFollows(prev => ({ ...prev, [name]: !prev[name] }))
  }

  return (
    <div className="min-h-screen grid grid-rows-[auto,1fr,auto] font-mono">
      <Toaster position="top-right" richColors />

      {/* HEADER */}
      <header className="sticky top-0 z-40 border-b border-emerald-500/20 bg-cyber-panel/80 backdrop-blur">
        <div className="mx-auto max-w-7xl flex items-center gap-4 p-3">
          <Link to="/" className="flex items-center gap-2">
            <Terminal className="size-6 text-cyber-neon" />
            <span className="text-xl font-bold glitch-text">Hackers Connect</span>
          </Link>
          <nav className="ml-6 flex items-center gap-4 text-sm">
            <Link to="/" className={linkCls(loc.pathname === '/')}>Feed</Link>
            <Link to="/groups" className={linkCls(loc.pathname.startsWith('/groups'))}><UsersRound className="inline mr-1 size-4" />Groups</Link>
            <Link to="/events" className={linkCls(loc.pathname.startsWith('/events'))}><Calendar className="inline mr-1 size-4" />Events</Link>
            <Link to="/market" className={linkCls(loc.pathname.startsWith('/market'))}><ShoppingBag className="inline mr-1 size-4" />Market</Link>
            <Link to="/ctf" className={linkCls(loc.pathname.startsWith('/ctf'))}><ShieldCheck className="inline mr-1 size-4" />CTF</Link>
            <Link to="/profile/yourusername">My Profile</Link>

          </nav>
          <div className="ml-auto flex items-center gap-3">
            <Link to="/messages" className="p-2 rounded-xl bg-cyber-panel hover:shadow-glow transition">
              <MessagesSquare className="size-5" />
            </Link>
            <button className="p-2 rounded-xl bg-cyber-panel hover:shadow-glow transition">
              <Bell className="size-5" />
            </button>
            {user ? (
              <UserProfileDropdown />
            ) : (
              <Link to="/access" className="text-xs px-3 py-2 rounded-xl bg-cyber-panel border border-emerald-400/30 hover:shadow-glow">Access</Link>
            )}
          </div>
        </div>
      </header>

      {/* MAIN CONTENT */}
      <main className="mx-auto max-w-7xl grid grid-cols-12 gap-4 p-4 w-full">
        {/* LEFT PANEL */}
        <aside className="hidden md:block col-span-3 space-y-3">
          <Panel title="Status">
            <div className="text-sm">
              {user ? (
                <div>
                  <div>Logged in as <b>{user.username}</b></div>
                  <div className="mt-1 text-emerald-400">Reputation: {user.reputation}</div>
                </div>
              ) : (
                <div className="text-amber-400">Guest mode. Solve CTF to unlock.</div>
              )}
            </div>
          </Panel>
          <Panel title="Trending">
            <ul className="text-sm space-y-1">
              <li className="flex items-center gap-2"><Flame className="size-4" /> CVE-2025-XXXX PoC released</li>
              <li className="flex items-center gap-2"><Flame className="size-4" /> New crypto CTF this weekend</li>
              <li className="flex items-center gap-2"><Flame className="size-4" /> Kernel hardening guide</li>
            </ul>
          </Panel>
        </aside>

        {/* POST SECTION with independent scroll */}
        <section className="col-span-12 md:col-span-7 h-[calc(100vh-180px)] overflow-y-auto pr-2">
          <Outlet />
        </section>
      </main>

      {/* WHO TO FOLLOW - moved to absolute right corner */}
      <div className="hidden lg:block fixed top-[70px] right-4 w-64 space-y-3">
        <Panel title="Who to follow">
          <ul className="text-sm space-y-2">
            {['0xRaven', 'ByteBandit', 'CryptoCat', 'RootNova'].map(n => (
              <li key={n} className="flex items-center justify-between">
                <span>@{n}</span>
                <button
                  onClick={() => toggleFollow(n)}
                  className={`text-xs rounded-lg px-2 py-1 border transition ${
                    follows[n] ? 'border-emerald-400 bg-emerald-500/20 text-emerald-300' :
                      'border-emerald-400/30 hover:shadow-glow'
                  }`}>
                  {follows[n] ? 'Following' : 'Follow'}
                </button>
              </li>
            ))}
          </ul>
        </Panel>
      </div>

      {/* FOOTER */}
      <footer className="bg-cyber-panel border-t border-emerald-500/20 mt-4 text-sm">
        <div className="max-w-7xl mx-auto grid md:grid-cols-4 gap-6 p-6">
          <div>
            <h3 className="text-emerald-400 font-bold mb-2">Hackers Connect</h3>
            <p className="text-gray-400">A social platform built for hackers, CTF players, and security researchers.</p>
          </div>
          <div>
            <h4 className="text-emerald-300 font-semibold mb-2">Explore</h4>
            <ul className="space-y-1">
              <li><Link to="/groups" className="hover:text-emerald-400">Groups</Link></li>
              <li><Link to="/events" className="hover:text-emerald-400">Events</Link></li>
              <li><Link to="/market" className="hover:text-emerald-400">Market</Link></li>
              <li><Link to="/ctf" className="hover:text-emerald-400">CTF Challenges</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="text-emerald-300 font-semibold mb-2">Community</h4>
            <ul className="space-y-1">
              <li><a href="#" className="hover:text-emerald-400">Forums</a></li>
              <li><a href="#" className="hover:text-emerald-400">Hackathons</a></li>
              <li><a href="#" className="hover:text-emerald-400">Writeups</a></li>
              <li><a href="#" className="hover:text-emerald-400">Bug Bounty</a></li>
            </ul>
          </div>
          <div>
            <h4 className="text-emerald-300 font-semibold mb-2">Connect</h4>
            <div className="flex gap-3">
              <a href="https://github.com" target="_blank" className="hover:text-emerald-400"><Github className="size-5" /></a>
              <a href="https://twitter.com" target="_blank" className="hover:text-emerald-400"><Twitter className="size-5" /></a>
              <a href="#" className="hover:text-emerald-400"><Lock className="size-5" /></a>
            </div>
          </div>
        </div>
        <div className="text-center text-xs text-gray-500 py-3 border-t border-emerald-400/10">
          © {new Date().getFullYear()} Hackers Connect. Built for Hackers, by Hackers.
        </div>
      </footer>
    </div>
  )
}

function Panel({ title, children }: { title: string, children: React.ReactNode }) {
  return (
    <div className="relative rounded-2xl border border-emerald-400/20 bg-cyber-panel p-3 shadow-inner">
      <div className="mb-2 text-emerald-300 text-xs uppercase tracking-widest">{title}</div>
      <div>{children}</div>
      <div className="scanline absolute inset-0 rounded-2xl pointer-events-none"></div>
    </div>
  )
}

function linkCls(active: boolean) {
  return `px-3 py-1 rounded-lg border ${active ? 'border-emerald-400/50 bg-cyber-panel shadow-glow' : 'border-emerald-400/20 hover:border-emerald-400/40'} transition`
}
