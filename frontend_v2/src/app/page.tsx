"use client";

import { useEffect, useState } from "react";
import { leaderboardAPI } from "@/lib/api";
import LeaderboardTable from "@/components/LeaderboardTable";
import SearchBar from "@/components/SearchBar";
import Link from "next/link";
import { Settings } from "lucide-react";

export default function Home() {
  const [leaderboard, setLeaderboard] = useState([]);
  const [filteredLeaderboard, setFilteredLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchLeaderboard = async () => {
    try {
      const response = await leaderboardAPI.getLeaderboard();
      setLeaderboard(response.data);
      setFilteredLeaderboard(response.data);
    } catch (error) {
      console.error("Error fetching leaderboard:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeaderboard();
    const interval = setInterval(fetchLeaderboard, 10000); // Poll every 10 seconds
    return () => clearInterval(interval);
  }, []);

  const handleSearch = (query: string) => {
    if (!query) {
      setFilteredLeaderboard(leaderboard);
      return;
    }
    const filtered = leaderboard.filter((team: any) =>
      team.team_name.toLowerCase().includes(query.toLowerCase())
    );
    setFilteredLeaderboard(filtered);
  };

  return (
    <main className="min-h-screen py-12 px-4 sm:px-6 lg:px-8 relative">
      <Link 
        href="/admin/login" 
        className="absolute top-6 left-6 z-50 inline-flex items-center px-4 py-2 bg-white/5 border border-white/20 rounded-md text-sm font-medium text-gray-300 hover:text-white hover:bg-white/10 hover:border-white/30 hover:shadow-[0_0_15px_rgba(0,255,255,0.2)] transition-all duration-300"
      >
        <Settings className="w-4 h-4 mr-2 text-neon-cyan" />
        Admin Panel
      </Link>
      
      <div className="max-w-5xl mx-auto mt-10">
        <div className="text-center mb-12">
          <h1 className="text-5xl font-extrabold tracking-tight text-white mb-2 font-orbitron neon-text-cyan">
            HACK AMONG US
          </h1>
          <p className="text-xl text-neon-cyan/80 font-medium">
            Heritage Institute of Technology • 13–14 March
          </p>
        </div>

        <SearchBar onSearch={handleSearch} />

        {loading ? (
          <div className="flex justify-center items-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-neon-cyan"></div>
          </div>
        ) : (
          <LeaderboardTable 
            teams={filteredLeaderboard} 
          />
        )}
      </div>
    </main>
  );
}
