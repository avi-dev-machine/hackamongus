"use client";

import AdminLayout from "@/components/AdminLayout";
import { useEffect, useState } from "react";
import { leaderboardAPI } from "@/lib/api";
import { 
  Users, 
  Trophy, 
  BarChart3, 
  ArrowUpRight,
  TrendingUp
} from "lucide-react";

export default function Dashboard() {
  const [stats, setStats] = useState({
    totalTeams: 0,
    topTeam: "N/A",
    avgScore: 0
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await leaderboardAPI.getLeaderboard();
        const teams = response.data;
        if (teams.length > 0) {
          const avg = teams.reduce((acc: number, t: any) => acc + t.total_score, 0) / teams.length;
          setStats({
            totalTeams: teams.length,
            topTeam: teams[0].team_name,
            avgScore: avg
          });
        }
      } catch (error) {
        console.error("Error fetching stats:", error);
      }
    };
    fetchStats();
  }, []);

  return (
    <AdminLayout>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
        <StatCard 
          title="Total Teams" 
          value={stats.totalTeams} 
          icon={<Users className="h-6 w-6 text-neon-cyan" />}
          color="cyan"
        />
        <StatCard 
          title="Top Team" 
          value={stats.topTeam} 
          icon={<Trophy className="h-6 w-6 text-yellow-500" />}
          color="yellow"
        />
        <StatCard 
          title="Avg. Score" 
          value={stats.avgScore.toFixed(1)} 
          icon={<BarChart3 className="h-6 w-6 text-neon-purple" />}
          color="purple"
        />
      </div>

      <div className="glass-panel p-8 bg-white/5">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-white font-orbitron flex items-center">
            <TrendingUp className="h-5 w-5 mr-2 text-neon-cyan" />
            REAL-TIME ACTIVITY
          </h2>
        </div>
        <div className="h-64 flex items-center justify-center border border-white/10 rounded-lg bg-black/20">
          <p className="text-gray-500 font-orbitron text-sm italic">Analytics module initialized. Awaiting more data...</p>
        </div>
      </div>
    </AdminLayout>
  );
}

function StatCard({ title, value, icon, color }: { title: string, value: any, icon: any, color: string }) {
  const colorMap: any = {
    cyan: "border-neon-cyan/30 text-neon-cyan",
    yellow: "border-yellow-500/30 text-yellow-500",
    purple: "border-neon-purple/30 text-neon-purple"
  };
  
  return (
    <div className={`glass-panel p-6 bg-white/5 border ${colorMap[color]}`}>
      <div className="flex items-center justify-between mb-4">
        <p className="text-xs uppercase font-orbitron tracking-tight text-gray-400">{title}</p>
        <div className="p-2 bg-black/40 rounded-lg">{icon}</div>
      </div>
      <div className="flex items-baseline space-x-2">
        <h3 className="text-3xl font-bold text-white font-orbitron">{value}</h3>
      </div>
    </div>
  );
}
