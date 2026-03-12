"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { adminAPI } from "@/lib/api";
import { ShieldAlert } from "lucide-react";

export default function AdminLogin() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem("token");
      if (token) {
        try {
          await adminAPI.verify();
          router.push("/admin/dashboard");
        } catch (e) {
          localStorage.removeItem("token");
        }
      }
    };
    checkAuth();
  }, [router]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const response = await adminAPI.login({ username, password });
      localStorage.setItem("token", response.data.access_token);
      router.push("/admin/dashboard");
    } catch (err: any) {
      setError(err.response?.data?.detail || "Login failed. Check credentials.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full glass-panel p-8">
        <div className="text-center mb-8">
          <ShieldAlert className="h-12 w-12 text-neon-red mx-auto mb-4" />
          <h2 className="text-3xl font-bold text-white font-orbitron">ADMIN ACCESS</h2>
          <p className="mt-2 text-sm text-gray-400 font-medium">
            Authorized Personnel Only
          </p>
        </div>
        <form className="space-y-6" onSubmit={handleLogin}>
          <div>
            <label className="block text-xs font-orbitron uppercase tracking-wider text-gray-400 mb-2">
              Username
            </label>
            <input
              type="text"
              required
              className="appearance-none relative block w-full px-3 py-2 border border-white/20 bg-black/40 text-white rounded-lg focus:outline-none focus:ring-neon-cyan focus:border-neon-cyan sm:text-sm"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-xs font-orbitron uppercase tracking-wider text-gray-400 mb-2">
              Password
            </label>
            <input
              type="password"
              required
              className="appearance-none relative block w-full px-3 py-2 border border-white/20 bg-black/40 text-white rounded-lg focus:outline-none focus:ring-neon-cyan focus:border-neon-cyan sm:text-sm"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          {error && (
            <div className="text-neon-red text-sm text-center font-medium bg-neon-red/10 py-2 rounded">
              {error}
            </div>
          )}

          <div>
            <button
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-bold rounded-lg text-black bg-neon-cyan hover:bg-neon-cyan/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-neon-cyan transition-all uppercase font-orbitron disabled:opacity-50"
            >
              {loading ? "Authenticating..." : "Login"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
