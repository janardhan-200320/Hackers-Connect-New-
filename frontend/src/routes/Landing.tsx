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
      <nav className="fixed top-0 left-0 right-0 z-50 bg-zinc-900/80 backdrop-blur-lg border-b border-zinc-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center">
                <Shield className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-bold text-zinc-100">
                Hackers Connect
              </span>
            </div>

            <div className="hidden md:flex items-center gap-6">
              <a
                href="#features"
                className="text-zinc-400 hover:text-zinc-100 transition"
              >
                Features
              </a>
              <a
                href="#how-it-works"
                className="text-zinc-400 hover:text-zinc-100 transition"
              >
                How it Works
              </a>
              <a
                href="#community"
                className="text-zinc-400 hover:text-zinc-100 transition"
              >
                Community
              </a>
            </div>

            <div className="flex items-center gap-3">
              <Link
                to="/auth"
                className="px-4 py-2 text-sm text-zinc-300 hover:text-zinc-100 transition"
              >
                Login
              </Link>
              <Link
                to="/auth"
                className="px-4 py-2 text-sm bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition font-medium"
              >
                Get Started
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-4 overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl animate-pulse"></div>
          <div
            className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl animate-pulse"
            style={{ animationDelay: "1s" }}
          ></div>
        </div>

        <div className="relative max-w-7xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-zinc-800/50 border border-zinc-700 rounded-full mb-8">
            <Zap className="w-4 h-4 text-yellow-400" />
            <span className="text-sm text-zinc-300">
              Join 10,000+ Hackers Worldwide
            </span>
          </div>

          <h1 className="text-5xl md:text-7xl font-bold text-zinc-100 mb-6 leading-tight">
            Connect. Compete.
            <br />
            <span className="bg-gradient-to-r from-blue-400 to-purple-600 bg-clip-text text-transparent">
              Conquer Challenges
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
              className="group px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold text-lg transition flex items-center gap-2"
            >
              Start Your Journey
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition" />
            </Link>
            <a
              href="#features"
              className="px-8 py-4 bg-zinc-800 hover:bg-zinc-700 text-zinc-100 rounded-xl font-semibold text-lg transition"
            >
              Learn More
            </a>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-3 gap-8 max-w-3xl mx-auto mt-20">
            <div>
              <div className="text-4xl font-bold text-zinc-100">10K+</div>
              <div className="text-sm text-zinc-500 mt-1">Active Members</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-zinc-100">500+</div>
              <div className="text-sm text-zinc-500 mt-1">CTF Challenges</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-zinc-100">1M+</div>
              <div className="text-sm text-zinc-500 mt-1">Writeups Shared</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 px-4 bg-zinc-900/50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-zinc-100 mb-4">
              Everything You Need to Excel
            </h2>
            <p className="text-lg text-zinc-400 max-w-2xl mx-auto">
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
          <h2 className="text-4xl font-bold text-zinc-100 mb-4">
            Join Our Growing Community
          </h2>
          <p className="text-lg text-zinc-400 mb-12 max-w-2xl mx-auto">
            Connect with thousands of cybersecurity professionals, from
            beginners to experts
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 mb-12">
            <div className="px-6 py-3 bg-zinc-800 rounded-lg">
              <span className="text-2xl font-bold text-blue-400">50+</span>
              <span className="text-sm text-zinc-500 ml-2">Countries</span>
            </div>
            <div className="px-6 py-3 bg-zinc-800 rounded-lg">
              <span className="text-2xl font-bold text-purple-400">100+</span>
              <span className="text-sm text-zinc-500 ml-2">CTF Teams</span>
            </div>
            <div className="px-6 py-3 bg-zinc-800 rounded-lg">
              <span className="text-2xl font-bold text-green-400">24/7</span>
              <span className="text-sm text-zinc-500 ml-2">Active Members</span>
            </div>
          </div>

          <Link
            to="/auth"
            className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white rounded-xl font-semibold text-lg transition"
          >
            Join Now - It's Free
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-zinc-800 py-12 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-2 mb-4">
                <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
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
                <a
                  href="#features"
                  className="block text-sm text-zinc-500 hover:text-zinc-300"
                >
                  Features
                </a>
                <a
                  href="#"
                  className="block text-sm text-zinc-500 hover:text-zinc-300"
                >
                  Challenges
                </a>
                <a
                  href="#"
                  className="block text-sm text-zinc-500 hover:text-zinc-300"
                >
                  Leaderboard
                </a>
              </div>
            </div>

            <div>
              <h3 className="font-semibold text-zinc-100 mb-4">Resources</h3>
              <div className="space-y-2">
                <a
                  href="#"
                  className="block text-sm text-zinc-500 hover:text-zinc-300"
                >
                  Documentation
                </a>
                <a
                  href="#"
                  className="block text-sm text-zinc-500 hover:text-zinc-300"
                >
                  Blog
                </a>
                <a
                  href="#"
                  className="block text-sm text-zinc-500 hover:text-zinc-300"
                >
                  Support
                </a>
              </div>
            </div>

            <div>
              <h3 className="font-semibold text-zinc-100 mb-4">Connect</h3>
              <div className="flex gap-3">
                <a
                  href="#"
                  className="p-2 bg-zinc-800 hover:bg-zinc-700 rounded-lg transition"
                >
                  <Github className="w-5 h-5 text-zinc-400" />
                </a>
                <a
                  href="#"
                  className="p-2 bg-zinc-800 hover:bg-zinc-700 rounded-lg transition"
                >
                  <Twitter className="w-5 h-5 text-zinc-400" />
                </a>
                <a
                  href="#"
                  className="p-2 bg-zinc-800 hover:bg-zinc-700 rounded-lg transition"
                >
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
              <a href="#" className="text-sm text-zinc-500 hover:text-zinc-300">
                Privacy
              </a>
              <a href="#" className="text-sm text-zinc-500 hover:text-zinc-300">
                Terms
              </a>
              <a href="#" className="text-sm text-zinc-500 hover:text-zinc-300">
                Security
              </a>
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
    <div className="p-6 bg-zinc-900 border border-zinc-800 rounded-xl hover:border-zinc-700 transition group">
      <div className="w-14 h-14 bg-gradient-to-br from-blue-500/10 to-purple-600/10 rounded-xl flex items-center justify-center text-blue-400 mb-4 group-hover:scale-110 transition">
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
      <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl text-white font-bold text-2xl mb-6">
        {number}
      </div>
      <h3 className="text-2xl font-bold text-zinc-100 mb-3">{title}</h3>
      <p className="text-zinc-400">{description}</p>
    </div>
  );
}
