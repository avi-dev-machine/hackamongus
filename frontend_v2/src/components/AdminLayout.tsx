"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { 
  LayoutDashboard, 
  Users, 
  Trophy, 
  PieChart, 
  Download, 
  LogOut,
  ChevronRight
} from "lucide-react";
import { adminAPI } from "@/lib/api";

export default function AdminDashboard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        router.push("/admin/login");
        return;
      }
      try {
        await adminAPI.verify();
        setLoading(false);
      } catch (error) {
        localStorage.removeItem("token");
        router.push("/admin/login");
      }
    };
    
    checkAuth();
  }, [router]);

  const handleLogout = () => {
    localStorage.removeItem("token");
    router.push("/admin/login");
  };

  const handleExport = async () => {
    try {
      const response = await adminAPI.exportExcel();
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'leaderboard.xlsx');
      document.body.appendChild(link);
      link.click();
    } catch (error) {
      console.error("Export failed:", error);
    }
  };

  if (loading) return null;

  return (
    <div className="min-h-screen flex bg-background">
      {/* Sidebar */}
      <div className="w-64 glass-panel rounded-none border-y-0 border-l-0 bg-black/20 flex flex-col">
        <div className="p-6 border-b border-white/10">
          <h2 className="text-xl font-bold text-white font-orbitron neon-text-cyan">ADMIN HUB</h2>
          <p className="text-xs text-gray-500 uppercase mt-1">Spaceship Control</p>
        </div>
        
        <nav className="flex-1 p-4 space-y-2">
          <Link href="/admin/teams" className="flex items-center space-x-3 px-4 py-3 rounded-lg hover:bg-white/5 text-gray-400 hover:text-white transition-all">
            <Users className="h-5 w-5" />
            <span className="font-medium">Teams</span>
          </Link>
          <Link href="/admin/scores" className="flex items-center space-x-3 px-4 py-3 rounded-lg hover:bg-white/5 text-gray-400 hover:text-white transition-all">
            <Trophy className="h-5 w-5" />
            <span className="font-medium">Scores</span>
          </Link>
        </nav>

        <div className="p-4 border-t border-white/10">
          <button 
            onClick={handleLogout}
            className="flex items-center space-x-3 px-4 py-3 w-full rounded-lg hover:bg-neon-red/10 text-gray-400 hover:text-neon-red transition-all"
          >
            <LogOut className="h-5 w-5" />
            <span className="font-medium">Logout</span>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-8 overflow-y-auto">
        <header className="flex justify-between items-center mb-10">
          <div>
            <h1 className="text-3xl font-bold text-white font-orbitron">MISSION CONTROL</h1>
            <p className="text-gray-400">Manage participants and scoring systems</p>
          </div>
          <div className="flex items-center space-x-4">
            <span className="inline-block h-3 w-3 rounded-full bg-green-500 animate-pulse"></span>
            <span className="text-xs font-orbitron text-gray-500 uppercase tracking-widest">System Online</span>
          </div>
        </header>

        {children}
      </div>
    </div>
  );
}
