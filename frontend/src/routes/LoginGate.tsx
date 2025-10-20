import { useState } from "react";
import {
  Eye,
  EyeOff,
  Lock,
  Mail,
  User,
  Shield,
  Github,
  Terminal,
  CheckCircle,
} from "lucide-react";
import * as Tabs from "@radix-ui/react-tabs";
import { login, register } from "../services/authservice";
import { storeAuthToken } from "../utils/auth";
import { useNavigate } from "react-router-dom";

export default function LoginGate() {
  const [activeTab, setActiveTab] = useState<"login" | "register">("login");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigate = useNavigate();

  // Form states
  const [loginData, setLoginData] = useState({ email: "", password: "" });
  const [registerData, setRegisterData] = useState({
    username: "",
    email: "",
    fullName: "",
    password: "",
    confirmPassword: "",
  });

  // Error and Success states
  const [loginError, setLoginError] = useState("");
  const [registerError, setRegisterError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError("");
    setSuccessMessage("");
    console.log("Attempting login with:", loginData); // <-- DEBUG: Log login data

    try {
      const data = await login(loginData.email, loginData.password);
      console.log("Response from login service:", data); // <-- DEBUG: Log the full API response

      if (data && data.access_token) {
        console.log("Login successful. Token received. Redirecting..."); // <-- DEBUG: Success confirmation
        setSuccessMessage('Login successful!');
        storeAuthToken(data.access_token);
        setTimeout(() => {
          navigate("/app");
        }, 1500);
      } else {
        console.error("Login failed. Response did not contain access_token:", data); // <-- DEBUG: Failure reason
        setLoginError(data.message || "Login failed: Invalid response from server.");
      }
    } catch (error: any) {
      console.error("An error occurred during login:", error); // <-- DEBUG: Catch any exceptions
      setLoginError(error.message || "Invalid credentials");
      console.error("Login error:", error);
    }
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setRegisterError("");
    setSuccessMessage("");

    if (registerData.password !== registerData.confirmPassword) {
      setRegisterError("Passwords don't match!");
      return;
    }

    try {
      const result = await register(
        registerData.email,
        registerData.password,
        registerData.username,
        registerData.fullName
      );

      if (result && result.success) {
        setSuccessMessage('Registration successful! Please log in.');
        setActiveTab("login");
        setTimeout(() => setSuccessMessage(""), 3000);
      } else {
        setRegisterError(result.message || "Registration failed");
      }
    } catch (error: any) {
      setRegisterError(error.message || "Registration failed");
      console.error("Registration error:", error);
    }
  };

  return (
    <div className="min-h-screen bg-zinc-950 flex items-center justify-center p-4">
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-green-500/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
      </div>

      <div className="relative w-full max-w-5xl grid md:grid-cols-2 gap-8 items-center">
        <div className="hidden md:block space-y-6">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-emerald-500 rounded-xl flex items-center justify-center neon-border">
                <Shield className="w-7 h-7 text-white" />
              </div>
              <h1 className="text-3xl font-bold neon-heading">
                Hackers Connect
              </h1>
            </div>
            <p className="text-lg text-zinc-400 neon-text">
              Join the elite community of cybersecurity professionals and
              enthusiasts
            </p>
          </div>

          <div className="space-y-4">
            <FeatureItem
              icon={<Terminal className="w-5 h-5" />}
              title="CTF Challenges"
              description="Compete in capture the flag competitions"
            />
            <FeatureItem
              icon={<User className="w-5 h-5" />}
              title="Connect & Collaborate"
              description="Network with hackers worldwide"
            />
            <FeatureItem
              icon={<Shield className="w-5 h-5" />}
              title="Share Knowledge"
              description="Share exploits, writeups, and POCs"
            />
          </div>
        </div>

        <div className="bg-zinc-900/80 border rounded-2xl p-8 shadow-2xl backdrop-blur-sm neon-border feature-card">
          {successMessage && (
            <div className="flex items-center gap-3 p-4 mb-4 text-sm text-green-400 bg-green-900/50 rounded-lg border border-green-700">
              <CheckCircle className="w-5 h-5" />
              <span>{successMessage}</span>
            </div>
          )}

          <Tabs.Root
            value={activeTab}
            onValueChange={(v) => setActiveTab(v as "login" | "register")}
          >
            <Tabs.List className="flex gap-1 bg-zinc-800/50 rounded-lg p-1 mb-8">
              <Tabs.Trigger
                value="login"
                className="flex-1 px-6 py-3 text-sm font-medium rounded-lg transition neon-button"
              >
                Login
              </Tabs.Trigger>
              <Tabs.Trigger
                value="register"
                className="flex-1 px-6 py-3 text-sm font-medium rounded-lg transition neon-button"
              >
                Register
              </Tabs.Trigger>
            </Tabs.List>

            <Tabs.Content value="login">
              <form onSubmit={handleLogin} className="space-y-5">
                {loginError && (
                  <div className="text-red-500 text-sm">{loginError}</div>
                )}
                <div>
                  <label className="block text-sm font-medium text-zinc-300 mb-2 neon-text">
                    Email
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-green-400" />
                    <input
                      type="email"
                      required
                      placeholder="your@email.com"
                      value={loginData.email}
                      onChange={(e) =>
                        setLoginData({ ...loginData, email: e.target.value })
                      }
                      className="w-full pl-10 pr-4 py-3 bg-zinc-800 border border-zinc-700 rounded-lg text-zinc-100 placeholder-zinc-500 outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500/20 transition neon-border"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-zinc-300 mb-2 neon-text">
                    Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-green-400" />
                    <input
                      type={showPassword ? "text" : "password"}
                      required
                      placeholder="••••••••"
                      value={loginData.password}
                      onChange={(e) =>
                        setLoginData({ ...loginData, password: e.target.value })
                      }
                      className="w-full pl-10 pr-12 py-3 bg-zinc-800 border border-zinc-700 rounded-lg text-zinc-100 placeholder-zinc-500 outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500/20 transition neon-border"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-green-400 transition"
                    >
                      {showPassword ? (
                        <EyeOff className="w-5 h-5" />
                      ) : (
                        <Eye className="w-5 h-5" />
                      )}
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between text-sm">
                  <label className="flex items-center gap-2 text-zinc-400 cursor-pointer neon-text">
                    <input type="checkbox" className="rounded accent-green-500" />
                    Remember me
                  </label>
                  <a
                    href="#"
                    className="text-green-400 hover:text-green-300 transition neon-link"
                  >
                    Forgot password?
                  </a>
                </div>

                <button
                  type="submit"
                  className="w-full py-3 font-medium rounded-lg transition neon-button"
                >
                  Initialize Login
                </button>

                <div className="relative my-6">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-zinc-800"></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-4 bg-zinc-900 text-zinc-500">
                      Or continue with
                    </span>
                  </div>
                </div>

                <button
                  type="button"
                  className="w-full py-3 font-medium rounded-lg transition flex items-center justify-center gap-2 neon-button"
                >
                  <Github className="w-5 h-5" />
                  GitHub Access
                </button>
              </form>
            </Tabs.Content>

            <Tabs.Content value="register">
              <form onSubmit={handleRegister} className="space-y-5">
                {registerError && (
                  <div className="text-red-500 text-sm">{registerError}</div>
                )}
                <div>
                  <label className="block text-sm font-medium text-zinc-300 mb-2 neon-text">
                    Username
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-green-400" />
                    <input
                      type="text"
                      required
                      placeholder="hacker123"
                      value={registerData.username}
                      onChange={(e) =>
                        setRegisterData({
                          ...registerData,
                          username: e.target.value,
                        })
                      }
                      className="w-full pl-10 pr-4 py-3 bg-zinc-800 border border-zinc-700 rounded-lg text-zinc-100 placeholder-zinc-500 outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500/20 transition neon-border"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-zinc-300 mb-2 neon-text">
                    Full Name
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-green-400" />
                    <input
                      type="text"
                      required
                      placeholder="John Doe"
                      value={registerData.fullName}
                      onChange={(e) =>
                        setRegisterData({
                          ...registerData,
                          fullName: e.target.value,
                        })
                      }
                      className="w-full pl-10 pr-4 py-3 bg-zinc-800 border border-zinc-700 rounded-lg text-zinc-100 placeholder-zinc-500 outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500/20 transition neon-border"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-zinc-300 mb-2 neon-text">
                    Email
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-green-400" />
                    <input
                      type="email"
                      required
                      placeholder="your@email.com"
                      value={registerData.email}
                      onChange={(e) =>
                        setRegisterData({
                          ...registerData,
                          email: e.target.value,
                        })
                      }
                      className="w-full pl-10 pr-4 py-3 bg-zinc-800 border border-zinc-700 rounded-lg text-zinc-100 placeholder-zinc-500 outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500/20 transition neon-border"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-zinc-300 mb-2 neon-text">
                    Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-green-400" />
                    <input
                      type={showPassword ? "text" : "password"}
                      required
                      placeholder="••••••••"
                      value={registerData.password}
                      onChange={(e) =>
                        setRegisterData({
                          ...registerData,
                          password: e.target.value,
                        })
                      }
                      className="w-full pl-10 pr-12 py-3 bg-zinc-800 border border-zinc-700 rounded-lg text-zinc-100 placeholder-zinc-500 outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500/20 transition neon-border"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-green-400 transition"
                    >
                      {showPassword ? (
                        <EyeOff className="w-5 h-5" />
                      ) : (
                        <Eye className="w-5 h-5" />
                      )}
                    </button>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-zinc-300 mb-2 neon-text">
                    Confirm Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-green-400" />
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      required
                      placeholder="••••••••"
                      value={registerData.confirmPassword}
                      onChange={(e) =>
                        setRegisterData({
                          ...registerData,
                          confirmPassword: e.target.value,
                        })
                      }
                      className="w-full pl-10 pr-12 py-3 bg-zinc-800 border border-zinc-700 rounded-lg text-zinc-100 placeholder-zinc-500 outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500/20 transition neon-border"
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-green-400 transition"
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="w-5 h-5" />
                      ) : (
                        <Eye className="w-5 h-5" />
                      )}
                    </button>
                  </div>
                </div>

                <label className="flex items-start gap-2 text-sm text-zinc-400 cursor-pointer neon-text">
                  <input
                    type="checkbox"
                    required
                    className="mt-1 rounded accent-green-500"
                  />
                  <span>
                    I agree to the{" "}
                    <a
                      href="/terms-of-service"
                      className="text-green-400 hover:text-green-300 transition neon-link"
                    >
                      Terms of Service
                    </a>{" "}
                    and{" "}
                    <a
                      href="/privacy-policy"
                      className="text-green-400 hover:text-green-300 transition neon-link"
                    >
                      Privacy Policy
                    </a>
                  </span>
                </label>

                <button
                  type="submit"
                  className="w-full py-3 font-medium rounded-lg transition neon-button"
                >
                  Initialize Account
                </button>

                <div className="relative my-6">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-zinc-800"></div>
                  </div>
                  <div className="relative flex justify-center text-sm">
                    <span className="px-4 bg-zinc-900 text-zinc-500">
                      Or continue with
                    </span>
                  </div>
                </div>

                <button
                  type="button"
                  className="w-full py-3 font-medium rounded-lg transition flex items-center justify-center gap-2 neon-button"
                >
                  <Github className="w-5 h-5" />
                  GitHub Access
                </button>
              </form>
            </Tabs.Content>
          </Tabs.Root>
        </div>
      </div>
    </div>
  );
}

function FeatureItem({
  icon,
  title,
  description,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
}) {
  return (
    <div className="flex items-start gap-3">
      <div className="p-2 bg-zinc-800/50 rounded-lg text-green-400">{icon}</div>
      <div>
        <h3 className="font-semibold text-zinc-200 neon-text">{title}</h3>
        <p className="text-sm text-zinc-500">{description}</p>
      </div>
    </div>
  );
}