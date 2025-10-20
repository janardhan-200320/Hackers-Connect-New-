import { Link } from "react-router-dom";
import {
  Shield,
  Terminal,
  Users,
  Trophy,
  Code2,
  Globe,
  Lock,
  Zap,
  ArrowRight,
  Github,
  Twitter,
  Linkedin,
} from "lucide-react";

export default function Landing() {
  return (
    <div className="min-h-screen bg-zinc-950">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-zinc-900/80 backdrop-blur-lg border-b border-green-500/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 relative group">
                <img
                  src="/logo-dark.svg"
                  alt="Hackers Connect Logo"
                  className="w-full h-full object-contain transition-all duration-300 group-hover:filter-cyber"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-green-500/0 to-green-500/10 rounded-xl opacity-0 group-hover:opacity-100 transition-all duration-300"></div>
              </div>
              <span className="text-xl font-bold neon-text">
                Hackers Connect
              </span>
            </div>

            <div className="hidden md:flex items-center gap-6">
              <a
                href="#features"
                className="neon-link"
              >
                Features
              </a>
              <a
                href="#how-it-works"
                className="neon-link"
              >
                How it Works
              </a>
              <a
                href="#community"
                className="neon-link"
              >
                Community
              </a>
            </div>

            <div className="flex items-center gap-3">
              <Link
                to="/auth"
                className="px-4 py-2 text-sm rounded-md neon-button neon-text"
              >
                Login / Register
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-4 overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-green-500/10 rounded-full blur-3xl animate-pulse"></div>
          <div
            className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl animate-pulse"
            style={{ animationDelay: "1s" }}
          ></div>
        </div>

        <div className="relative max-w-7xl mx-auto text-center">
          <h1 className="text-5xl md:text-7xl font-bold text-zinc-100 mb-6 leading-tight neon-text neon-glow">
            Connect. Compete.
            <br />
            <span className="bg-gradient-to-r from-green-400 to-emerald-500 bg-clip-text text-transparent matrix-text">
              Hack The Planet
            </span>
          </h1>

          <p className="text-xl text-zinc-400 mb-12 max-w-3xl mx-auto">
            The ultimate platform for cybersecurity professionals and
            enthusiasts to collaborate, compete in CTF challenges, and share
            knowledge.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/auth"
              className="group px-8 py-4 rounded-xl font-semibold text-lg flex items-center gap-2 neon-button"
            >
              Initialize Sequence
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition" />
            </Link>
            <a
              href="#features"
              className="px-8 py-4 rounded-xl font-semibold text-lg neon-button"
            >
              Learn More
            </a>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-8 max-w-3xl mx-auto mt-20">
            <div>
              <div className="text-4xl font-bold neon-heading">10K+</div>
              <div className="text-sm text-zinc-500 mt-1 neon-text">Active Members</div>
            </div>
            <div>
              <div className="text-4xl font-bold neon-heading">500+</div>
              <div className="text-sm text-zinc-500 mt-1 neon-text">CTF Challenges</div>
            </div>
            <div>
              <div className="text-4xl font-bold neon-heading">1M+</div>
              <div className="text-sm text-zinc-500 mt-1 neon-text">Writeups Shared</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4 bg-zinc-900/50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold mb-4 neon-heading">
              Everything You Need to Excel
            </h2>
            <p className="text-lg text-zinc-400 max-w-2xl mx-auto neon-text">
              Powerful features designed for hackers, by hackers
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <FeatureCard
              icon={<Terminal className="w-8 h-8" />}
              title="CTF Challenges"
              description="Compete in capture the flag competitions across multiple categories - Web, PWN, Crypto, Forensics, and more."
            />
            <FeatureCard
              icon={<Users className="w-8 h-8" />}
              title="Global Community"
              description="Connect with hackers worldwide, form teams, and collaborate on security research."
            />
            <FeatureCard
              icon={<Code2 className="w-8 h-8" />}
              title="Share Knowledge"
              description="Post writeups, exploits, and POCs with syntax-highlighted code snippets."
            />
            <FeatureCard
              icon={<Trophy className="w-8 h-8" />}
              title="Leaderboards"
              description="Track your progress, earn reputation points, and climb the global rankings."
            />
            <FeatureCard
              icon={<Lock className="w-8 h-8" />}
              title="Real Vulnerabilities"
              description="Practice on real-world security scenarios and learn from actual exploits."
            />
            <FeatureCard
              icon={<Globe className="w-8 h-8" />}
              title="Events & Meetups"
              description="Discover cybersecurity events, conferences, and local meetups near you."
            />
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-zinc-100 mb-4">
              How It Works
            </h2>
            <p className="text-lg text-zinc-400 max-w-2xl mx-auto">
              Get started in three simple steps
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-12">
            <StepCard
              number="01"
              title="Create Account"
              description="Sign up in seconds with your email or GitHub account. It's completely free!"
            />
            <StepCard
              number="02"
              title="Complete Challenges"
              description="Solve CTF challenges, earn points, and unlock badges as you progress."
            />
            <StepCard
              number="03"
              title="Join the Community"
              description="Connect with fellow hackers, share writeups, and collaborate on projects."
            />
          </div>
        </div>
      </section>

      {/* Community Section */}
      <section id="community" className="py-20 px-4 bg-zinc-900/50">
        <div className="max-w-7xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-4 neon-heading">
            Join Our Growing Community
          </h2>
          <p className="text-lg text-zinc-400 mb-12 max-w-2xl mx-auto neon-text">
            Connect with thousands of cybersecurity professionals, from
            beginners to experts
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 mb-12">
            <div className="px-6 py-3 rounded-lg neon-border feature-card">
              <span className="text-2xl font-bold text-green-400 neon-text">50+</span>
              <span className="text-sm text-zinc-500 ml-2 neon-text">Countries</span>
            </div>
            <div className="px-6 py-3 rounded-lg neon-border feature-card">
              <span className="text-2xl font-bold text-green-400 neon-text">100+</span>
              <span className="text-sm text-zinc-500 ml-2 neon-text">CTF Teams</span>
            </div>
            <div className="px-6 py-3 rounded-lg neon-border feature-card">
              <span className="text-2xl font-bold text-green-400 neon-text">24/7</span>
              <span className="text-sm text-zinc-500 ml-2 neon-text">Active Members</span>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      {/* Spotlight footer with torch light effect */}
      <footer className="relative border-t border-zinc-800">
        {/* Spotlight torch light effect - HACKERS CONNECT */}
        <div 
          className="spotlight-container"
          onMouseMove={(e) => {
            const rect = e.currentTarget.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            e.currentTarget.style.setProperty('--cursor-x', `${x}px`);
            e.currentTarget.style.setProperty('--cursor-y', `${y}px`);
          }}
          onMouseLeave={(e) => {
            // Move light off-screen when cursor leaves
            e.currentTarget.style.setProperty('--cursor-x', '-200px');
            e.currentTarget.style.setProperty('--cursor-y', '-200px');
          }}
          onMouseEnter={(e) => {
            // Initialize position when cursor enters
            const rect = e.currentTarget.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            e.currentTarget.style.setProperty('--cursor-x', `${x}px`);
            e.currentTarget.style.setProperty('--cursor-y', `${y}px`);
          }}
        >
          <div className="spotlight-overlay"></div>
          <div className="spotlight-glow"></div>
          <div className="spotlight-text">HACKERS CONNECT</div>
        </div>

        {/* Regular footer content */}
        <div className="relative z-10 bg-zinc-900/80 py-16 px-4">
          <div className="max-w-7xl mx-auto">
            <div className="grid md:grid-cols-4 gap-8 mb-8">
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-8 h-8 bg-gradient-to-br from-green-500 to-emerald-500 rounded-lg flex items-center justify-center">
                    <Shield className="w-5 h-5 text-white" />
                  </div>
                  <span className="font-bold text-zinc-100">Hackers Connect</span>
                </div>
                <p className="text-sm text-zinc-500">
                  The ultimate platform for cybersecurity professionals
                </p>
              </div>

              <div>
                <h3 className="font-semibold text-zinc-100 mb-4">Platform</h3>
                <div className="space-y-2">
                  <a href="#features" className="block text-sm text-zinc-500 hover:text-green-400 transition">
                    Features
                  </a>
                  <a href="#" className="block text-sm text-zinc-500 hover:text-green-400 transition">
                    Challenges
                  </a>
                  <a href="#" className="block text-sm text-zinc-500 hover:text-green-400 transition">
                    Leaderboard
                  </a>
                </div>
              </div>

              <div>
                <h3 className="font-semibold text-zinc-100 mb-4">Resources</h3>
                <div className="space-y-2">
                  <a href="#" className="block text-sm text-zinc-500 hover:text-green-400 transition">
                    Documentation
                  </a>
                  <a href="#" className="block text-sm text-zinc-500 hover:text-green-400 transition">
                    Blog
                  </a>
                  <a href="#" className="block text-sm text-zinc-500 hover:text-green-400 transition">
                    Support
                  </a>
                </div>
              </div>

              <div>
                <h3 className="font-semibold text-zinc-100 mb-4">Connect</h3>
                <div className="flex gap-3">
                  <a href="#" className="p-2 bg-zinc-800 hover:bg-zinc-700 rounded-lg transition">
                    <Github className="w-5 h-5 text-zinc-400" />
                  </a>
                  <a href="#" className="p-2 bg-zinc-800 hover:bg-zinc-700 rounded-lg transition">
                    <Twitter className="w-5 h-5 text-zinc-400" />
                  </a>
                  <a href="#" className="p-2 bg-zinc-800 hover:bg-zinc-700 rounded-lg transition">
                    <Linkedin className="w-5 h-5 text-zinc-400" />
                  </a>
                </div>
              </div>
            </div>

            <div className="pt-8 border-t border-zinc-800 flex flex-col md:flex-row items-center justify-between gap-4">
              <p className="text-sm text-zinc-500">
                © 2025 Hackers Connect. All rights reserved.
              </p>
              <div className="flex gap-6">
                <a href="#" className="text-sm text-zinc-500 hover:text-green-400 transition">
                  Privacy
                </a>
                <a href="#" className="text-sm text-zinc-500 hover:text-green-400 transition">
                  Terms
                </a>
                <a href="#" className="text-sm text-zinc-500 hover:text-green-400 transition">
                  Security
                </a>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

function FeatureCard({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="p-6 bg-zinc-900/80 rounded-xl backdrop-blur-sm neon-border group">
      <div className="w-14 h-14 bg-gradient-to-br from-green-500/10 to-emerald-500/10 rounded-xl flex items-center justify-center text-green-400 mb-4 transition-transform duration-300 group-hover:scale-110">
        {icon}
      </div>
      <h3 className="text-xl font-semibold text-zinc-100 mb-2">{title}</h3>
      <p className="text-zinc-400">{description}</p>
    </div>
  );
}

function StepCard({
  number,
  title,
  description,
}: {
  number: string;
  title: string;
  description: string;
}) {
  return (
    <div className="text-center">
      <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-green-500 to-emerald-500 rounded-2xl text-black font-bold text-2xl mb-6 glow-green">
        {number}
      </div>
      <h3 className="text-2xl font-bold text-zinc-100 mb-3">{title}</h3>
      <p className="text-zinc-400">{description}</p>
    </div>
  );
}
